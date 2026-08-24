import { classifyTitle, normalizeWorkday } from '../core.mjs';
import { fetchJson, mapLimit } from './http.mjs';

function workdayParts(company) {
  const candidates = [company.api, company.careers_url, company.workday_host].filter(Boolean);
  let host = null;
  let tenant = company.workday_tenant ?? company.tenant ?? null;
  let site = company.workday_site ?? company.site ?? null;
  let api = company.api ?? null;
  for (const candidate of candidates) {
    let url;
    try {
      url = new URL(candidate);
    } catch {
      continue;
    }
    if (!/myworkday(?:jobs|site)\.com$/i.test(url.hostname)) continue;
    host ??= url.origin;
    const segments = url.pathname.split('/').filter(Boolean);
    const cxs = segments.indexOf('cxs');
    if (cxs >= 0) {
      tenant ??= segments[cxs + 1];
      site ??= segments[cxs + 2];
      api ??= `${url.origin}/wday/cxs/${encodeURIComponent(tenant)}/${encodeURIComponent(site)}/jobs`;
    } else {
      tenant ??= url.hostname.split('.')[0];
      const firstSiteSegment = /^[a-z]{2}(?:-[a-z]{2})?$/i.test(segments[0] ?? '')
        ? segments[1]
        : segments[0];
      site ??= firstSiteSegment;
    }
  }
  if (!host || !tenant || !site) return null;
  api ??= `${host}/wday/cxs/${encodeURIComponent(tenant)}/${encodeURIComponent(site)}/jobs`;
  return {
    api,
    apiBase: api.replace(/\/jobs\/?(?:\?.*)?$/, ''),
    careersBase: `${host}/${encodeURIComponent(site)}`,
    host,
    site,
    tenant,
  };
}

export const workdayConnector = {
  type: 'workday',
  describe(company, inferred) {
    const parts = workdayParts(company);
    if (!parts) return null;
    return {
      ...inferred,
      slug: company.ats_slug ?? `${parts.tenant}-${parts.site}`,
      sourceUrl: parts.api,
      apiBase: parts.apiBase,
      careersBase: parts.careersBase,
      tenant: parts.tenant,
      site: parts.site,
    };
  },
  async scan({ company, source, options }) {
    const pageSize = Number(company.page_size ?? 20);
    const maxPages = Number(company.max_pages ?? options.maxPages ?? 1_000);
    const resultCap = Number(company.workday_result_cap ?? 2_000);
    const trustResultCap = company.trust_workday_result_cap === true;
    const baseFacets = company.applied_facets ?? {};
    const summaries = [];
    const seenPaths = new Set();
    let pages = 0;
    let complete = true;
    const requestOptions = {
      ...options,
      retries: company.retries ?? options.retries ?? 4,
    };

    const fetchPage = (appliedFacets, offset) => fetchJson(source.sourceUrl, {
      ...requestOptions,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify({
        appliedFacets,
        limit: pageSize,
        offset,
        searchText: company.search_text ?? '',
      }),
    });

    const firstPayload = await fetchPage(baseFacets, 0);
    if (!Array.isArray(firstPayload.jobPostings)) throw new Error(`Workday site ${source.slug} returned no jobPostings array`);
    const rootTotal = Number.isFinite(Number(firstPayload.total)) ? Number(firstPayload.total) : firstPayload.jobPostings.length;
    const preferredFacet = company.partition_facet ?? 'jobFamilyGroup';
    const candidateFacets = (firstPayload.facets ?? []).filter((facet) => (
      facet?.facetParameter
      && !Object.hasOwn(baseFacets, facet.facetParameter)
      && Array.isArray(facet.values)
      && facet.values.length > 1
      && facet.values.every((value) => value?.id && Number(value.count) >= 0 && Number(value.count) < resultCap)
      && facet.values.reduce((sum, value) => sum + Number(value.count), 0) >= rootTotal
    ));
    candidateFacets.sort((left, right) => {
      if (left.facetParameter === preferredFacet) return -1;
      if (right.facetParameter === preferredFacet) return 1;
      return left.values.length - right.values.length;
    });
    const partitionFacet = rootTotal >= resultCap ? candidateFacets[0] : null;
    const partitions = partitionFacet ? partitionFacet.values.map((value) => ({
      facets: { ...baseFacets, [partitionFacet.facetParameter]: [value.id] },
      firstPayload: null,
    })) : [{ facets: baseFacets, firstPayload }];
    if (rootTotal >= resultCap && !partitionFacet && !trustResultCap) complete = false;

    for (const partition of partitions) {
      let payload = partition.firstPayload;
      let offset = 0;
      let partitionTotal = null;
      while (pages < maxPages && (partitionTotal === null || offset < partitionTotal)) {
        if (!payload) payload = await fetchPage(partition.facets, offset);
        if (!Array.isArray(payload.jobPostings)) throw new Error(`Workday site ${source.slug} returned no jobPostings array`);
        const reportedTotal = Number(payload.total);
        if (Number.isFinite(reportedTotal) && reportedTotal > 0) {
          partitionTotal = Math.max(partitionTotal ?? 0, reportedTotal);
        } else if (partitionTotal === null && payload.jobPostings.length < pageSize) {
          partitionTotal = offset + payload.jobPostings.length;
        }
        const unseen = payload.jobPostings.filter((job) => !seenPaths.has(String(job.externalPath)));
        for (const job of unseen) seenPaths.add(String(job.externalPath));
        summaries.push(...unseen);
        pages += 1;
        if (payload.jobPostings.length === 0) break;
        if (unseen.length === 0 && !partitionFacet) {
          throw new Error(`Workday site ${source.slug} repeated a page at offset ${offset}`);
        }
        offset += payload.jobPostings.length;
        payload = null;
      }
      if (partitionTotal === null
        || offset < partitionTotal
        || (partitionTotal >= resultCap && !trustResultCap)) complete = false;
      if (pages >= maxPages && partitions.at(-1) !== partition) complete = false;
    }

    if (pages >= maxPages) complete = false;

    /*
     * Workday commonly caps unfiltered result sets at 2,000. A mutually exclusive
     * facet (normally jobFamilyGroup) lets us deterministically traverse every
     * partition. If no safe partition is advertised, the result stays partial.
     */
    if (partitionFacet && summaries.length < rootTotal) complete = false;
    const capSuspected = rootTotal >= resultCap && !partitionFacet && !trustResultCap;
    if (capSuspected) complete = false;

    const relevant = summaries.filter((job) => company.enrich_all
      || classifyTitle(job.title, options.filter ?? {}).included);
    const details = await mapLimit(relevant, options.detailConcurrency ?? 4, async (summary) => {
      const detailUrl = `${source.apiBase}${summary.externalPath}`;
      const payload = await fetchJson(detailUrl, requestOptions);
      const detail = payload.jobPostingInfo ?? payload;
      if (!detail || typeof detail !== 'object') throw new Error(`Workday job ${summary.externalPath} returned no jobPostingInfo`);
      return {
        ...summary,
        ...detail,
        externalPath: summary.externalPath,
      };
    });
    const detailByPath = new Map(details.map((job) => [job.externalPath, job]));
    return {
      jobs: summaries.map((summary) => normalizeWorkday(
        company,
        source,
        detailByPath.get(summary.externalPath) ?? summary,
      )),
      complete,
      advertisedTotal: partitionFacet && complete
        ? summaries.length
        : rootTotal > 0 ? rootTotal : complete ? summaries.length : null,
      diagnostics: partitionFacet || capSuspected ? {
        partition_facet: partitionFacet?.facetParameter ?? null,
        partitions: partitionFacet?.values.length ?? null,
        root_advertised_total: rootTotal,
        observed_total: summaries.length,
        partial_reason: capSuspected ? `server_cap_${resultCap}` : null,
      } : null,
    };
  },
};

export function describeWorkday(company) {
  return workdayParts(company);
}
