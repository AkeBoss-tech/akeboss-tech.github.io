import {
  classifyTitle,
  normalizeAshby,
  normalizeGreenhouse,
  normalizeLever,
  normalizeSmartRecruiters,
  normalizeWorkable,
} from '../core.mjs';
import { fetchJson, mapLimit } from './http.mjs';

function endpointDescriptor(type, defaultUrl) {
  return {
    type,
    describe(company, inferred) {
      return {
        ...inferred,
        sourceUrl: company.api ?? defaultUrl(encodeURIComponent(inferred.slug)),
      };
    },
  };
}

export const greenhouseConnector = {
  ...endpointDescriptor('greenhouse', (slug) => `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`),
  async scan({ company, source, options }) {
    const url = new URL(source.sourceUrl);
    url.searchParams.set('content', 'true');
    const payload = await fetchJson(url, options);
    if (!Array.isArray(payload.jobs)) throw new Error(`Greenhouse board ${source.slug} returned no jobs array`);
    return {
      jobs: payload.jobs.map((job) => normalizeGreenhouse(company, source, job)),
      complete: true,
      advertisedTotal: payload.jobs.length,
    };
  },
};

export const ashbyConnector = {
  ...endpointDescriptor('ashby', (slug) => `https://api.ashbyhq.com/posting-api/job-board/${slug}`),
  async scan({ company, source, options }) {
    const url = new URL(source.sourceUrl);
    url.searchParams.set('includeCompensation', 'true');
    const payload = await fetchJson(url, options);
    if (!Array.isArray(payload.jobs)) throw new Error(`Ashby board ${source.slug} returned no jobs array`);
    const listed = payload.jobs.filter((job) => job.isListed !== false);
    return {
      jobs: listed.map((job) => normalizeAshby(company, source, job)),
      complete: true,
      advertisedTotal: listed.length,
    };
  },
};

export const leverConnector = {
  ...endpointDescriptor('lever', (slug) => `https://api.lever.co/v0/postings/${slug}`),
  async scan({ company, source, options }) {
    const jobs = [];
    const seenIds = new Set();
    const pageSize = Number(company.page_size ?? 100);
    const maxPages = Number(company.max_pages ?? options.maxPages ?? 1_000);
    let skip = 0;
    let pages = 0;
    let complete = false;
    while (pages < maxPages) {
      const url = new URL(source.sourceUrl);
      url.searchParams.set('mode', 'json');
      url.searchParams.set('limit', String(pageSize));
      url.searchParams.set('skip', String(skip));
      const payload = await fetchJson(url, options);
      if (!Array.isArray(payload)) throw new Error(`Lever board ${source.slug} returned no jobs array`);
      const unseen = payload.filter((job) => !seenIds.has(String(job.id)));
      for (const job of unseen) seenIds.add(String(job.id));
      jobs.push(...unseen);
      pages += 1;
      if (payload.length < pageSize) {
        complete = true;
        break;
      }
      if (unseen.length === 0) throw new Error(`Lever board ${source.slug} repeated a page at offset ${skip}`);
      skip += payload.length;
    }
    return {
      jobs: jobs.map((job) => normalizeLever(company, source, job)),
      complete,
      advertisedTotal: complete ? jobs.length : null,
    };
  },
};

export const smartRecruitersConnector = {
  ...endpointDescriptor('smartrecruiters', (slug) => `https://api.smartrecruiters.com/v1/companies/${slug}/postings`),
  async scan({ company, source, options }) {
    const summaries = [];
    const limit = Number(company.page_size ?? 100);
    const maxPages = Number(company.max_pages ?? options.maxPages ?? 1_000);
    let offset = 0;
    let total = null;
    let pages = 0;
    let paginationComplete = false;
    while (pages < maxPages && (total === null || offset < total)) {
      const url = new URL(source.sourceUrl);
      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));
      const payload = await fetchJson(url, options);
      if (!Array.isArray(payload.content)) throw new Error(`SmartRecruiters board ${source.slug} returned no content array`);
      const observedAfterPage = summaries.length + payload.content.length;
      if (payload.totalFound !== undefined && payload.totalFound !== null) {
        const reportedTotal = Number(payload.totalFound);
        if (!Number.isFinite(reportedTotal) || reportedTotal < 0) {
          throw new Error(`SmartRecruiters board ${source.slug} returned an invalid totalFound`);
        }
        if (reportedTotal < observedAfterPage) {
          throw new Error(`SmartRecruiters board ${source.slug} totalFound ${reportedTotal} is smaller than ${observedAfterPage} observed jobs`);
        }
        total = Math.max(total ?? 0, reportedTotal);
      }
      summaries.push(...payload.content);
      pages += 1;
      offset += payload.content.length;
      if (payload.content.length < limit) {
        paginationComplete = total === null || offset >= total;
        break;
      }
      if (total !== null && offset >= total) {
        paginationComplete = true;
        break;
      }
    }

    const relevantIds = new Set(summaries
      .filter((job) => classifyTitle(job.name, options.filter ?? {}).included)
      .map((job) => String(job.id)));
    const details = await mapLimit([...relevantIds], options.detailConcurrency ?? 4, async (id) => {
      const detailUrl = new URL(`${source.sourceUrl.replace(/\/$/, '')}/${encodeURIComponent(id)}`);
      return fetchJson(detailUrl, options);
    });
    const detailById = new Map(details.map((job) => [String(job.id), job]));
    return {
      jobs: summaries.map((summary) => normalizeSmartRecruiters(
        company,
        source,
        detailById.get(String(summary.id)) ?? summary,
      )),
      complete: paginationComplete,
      advertisedTotal: total ?? (paginationComplete ? summaries.length : null),
      diagnostics: paginationComplete ? null : {
        observed_total: summaries.length,
        advertised_total: total,
        partial_reason: 'pagination_incomplete',
      },
    };
  },
};

export const workableConnector = {
  ...endpointDescriptor('workable', (slug) => `https://www.workable.com/api/accounts/${slug}`),
  async scan({ company, source, options }) {
    const url = new URL(source.sourceUrl);
    url.searchParams.set('details', 'true');
    const payload = await fetchJson(url, options);
    const jobs = Array.isArray(payload) ? payload : payload.jobs;
    if (!Array.isArray(jobs)) throw new Error(`Workable board ${source.slug} returned no jobs array`);
    return {
      jobs: jobs.map((job) => normalizeWorkable(company, source, job)),
      complete: true,
      advertisedTotal: jobs.length,
    };
  },
};

export const builtinConnectors = [
  greenhouseConnector,
  ashbyConnector,
  leverConnector,
  smartRecruitersConnector,
  workableConnector,
];
