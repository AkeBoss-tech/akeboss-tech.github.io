import { normalizeJsonLd } from '../core.mjs';
import { fetchText, mapLimit } from './http.mjs';
import { assertXmlRoot, xmlElements, xmlValue } from './xml.mjs';

function schemaTypes(node) {
  return (Array.isArray(node?.['@type']) ? node['@type'] : [node?.['@type']])
    .filter(Boolean)
    .map((type) => String(type).split(/[\/#]/).at(-1)?.toLowerCase());
}

function collectJobPostings(node, output) {
  if (Array.isArray(node)) {
    for (const child of node) collectJobPostings(child, output);
    return;
  }
  if (!node || typeof node !== 'object') return;
  if (schemaTypes(node).includes('jobposting')) output.push(node);
  for (const key of ['@graph', 'itemListElement', 'item']) {
    if (node[key]) collectJobPostings(node[key], output);
  }
}

export function parseJsonLdJobPostingsWithEvidence(html, pageUrl = null) {
  const scripts = [...String(html ?? '').matchAll(
    /<script\b[^>]*\btype\s*=\s*(?:["']application\/ld\+json["']|application\/ld\+json)[^>]*>([\s\S]*?)<\/script\s*>/gi,
  )];
  const jobs = [];
  let parsedDocuments = 0;
  let malformedDocuments = 0;
  for (const script of scripts) {
    const value = script[1]
      .replace(/^\s*<!--/, '')
      .replace(/-->\s*$/, '')
      .replace(/;\s*$/, '')
      .trim();
    if (!value) {
      malformedDocuments += 1;
      continue;
    }
    try {
      const document = JSON.parse(value);
      parsedDocuments += 1;
      collectJobPostings(document, jobs);
    } catch {
      malformedDocuments += 1;
    }
  }
  const unique = new Map();
  for (const job of jobs) {
    const withPage = { ...job, _pageUrl: pageUrl };
    const identifier = typeof job.identifier === 'object' ? job.identifier?.value : job.identifier;
    const key = String(identifier ?? job.url ?? `${job.title ?? ''}|${job.datePosted ?? ''}|${pageUrl ?? ''}`);
    if (!unique.has(key)) unique.set(key, withPage);
  }
  return {
    jobs: [...unique.values()],
    scriptCount: scripts.length,
    parsedDocuments,
    malformedDocuments,
  };
}

export function parseJsonLdJobPostings(html, pageUrl = null) {
  const parsed = parseJsonLdJobPostingsWithEvidence(html, pageUrl);
  if (parsed.scriptCount && !parsed.parsedDocuments && parsed.malformedDocuments) {
    throw new Error('Malformed JobPosting JSON-LD: no structured-data script could be parsed');
  }
  return parsed.jobs;
}

export function parseSitemapXml(xml) {
  assertXmlRoot(xml, ['urlset', 'sitemapindex']);
  if (/<sitemapindex\b/i.test(xml)) {
    return {
      sitemaps: xmlElements(xml, 'sitemap').map((entry) => xmlValue(entry, 'loc')).filter(Boolean),
      urls: [],
    };
  }
  return {
    sitemaps: [],
    urls: xmlElements(xml, 'url').map((entry) => xmlValue(entry, 'loc')).filter(Boolean),
  };
}

function isExpired(job, now = Date.now()) {
  if (!job.validThrough) return false;
  const timestamp = Date.parse(job.validThrough);
  return Number.isFinite(timestamp) && timestamp < now;
}

function urlFilter(company) {
  if (!company.job_url_pattern) return () => true;
  const pattern = new RegExp(company.job_url_pattern, 'i');
  return (url) => pattern.test(url);
}

function matchesTombstone(page, company) {
  const rule = company.tombstone_rule ?? company.jsonld_tombstone_pattern;
  const pattern = typeof rule === 'string' ? rule : rule?.pattern;
  if (!pattern) return false;
  const flags = typeof rule === 'object' && rule.flags ? rule.flags : 'i';
  return new RegExp(pattern, flags).test(page);
}

function inspectJobPage(page, pageUrl, company) {
  const parsed = parseJsonLdJobPostingsWithEvidence(page, pageUrl);
  const zeroJobPostings = parsed.jobs.length === 0;
  const tombstone = zeroJobPostings && matchesTombstone(page, company);
  const evidenceLoss = parsed.malformedDocuments > 0 || (zeroJobPostings && !tombstone);
  return {
    jobs: parsed.jobs.filter((job) => !isExpired(job)),
    evidenceLoss,
    malformedDocuments: parsed.malformedDocuments,
    scriptCount: parsed.scriptCount,
    tombstone,
    zeroJobPostings,
  };
}

function evidenceReason({ pageErrors, malformedScripts, evidenceLossPages, traversalComplete, authoritative = true }) {
  if (pageErrors) return 'job_page_fetch_errors';
  if (malformedScripts) return 'malformed_jsonld';
  if (evidenceLossPages) return 'missing_jobposting_evidence';
  if (!traversalComplete) return 'pagination_incomplete';
  if (!authoritative) return 'direct_page_non_authoritative';
  return null;
}

async function collectSitemapUrls(startUrl, company, options) {
  const maximum = Number(company.max_sitemaps ?? options.maxSitemaps ?? 50);
  const pending = [startUrl];
  const visited = new Set();
  const urls = [];
  let complete = true;
  while (pending.length) {
    if (visited.size >= maximum) {
      complete = false;
      break;
    }
    const sitemapUrl = pending.shift();
    if (visited.has(sitemapUrl)) continue;
    visited.add(sitemapUrl);
    const parsed = parseSitemapXml(await fetchText(sitemapUrl, {
      ...options,
      accept: 'application/xml, text/xml',
    }));
    for (const child of parsed.sitemaps) {
      if (!visited.has(child)) pending.push(child);
    }
    urls.push(...parsed.urls);
  }
  return { urls: [...new Set(urls)], complete };
}

export const jsonLdConnector = {
  type: 'jsonld',
  describe(company, inferred) {
    const explicit = company.api ?? company.feed_url;
    const sitemapUrl = company.sitemap_url
      ?? (explicit && /(?:\.xml|sitemap)(?:\?|$)/i.test(explicit) ? explicit : null);
    const pageUrl = sitemapUrl ? null : explicit ?? company.careers_url;
    if (!sitemapUrl && !pageUrl) return null;
    return {
      ...inferred,
      sourceUrl: sitemapUrl ?? pageUrl,
      sitemapUrl,
      pageUrl,
    };
  },
  async scan({ company, source, options }) {
    if (!source.sitemapUrl) {
      const page = await fetchText(source.pageUrl, {
        ...options,
        accept: 'text/html, application/xhtml+xml',
      });
      const inspected = inspectJobPage(page, source.pageUrl, company);
      const authoritative = company.authoritative === true;
      const complete = authoritative && !inspected.evidenceLoss;
      return {
        jobs: inspected.jobs.map((job) => normalizeJsonLd(company, source, job)),
        complete,
        advertisedTotal: null,
        diagnostics: {
          candidate_urls: 1,
          page_errors: 0,
          structured_data_scripts: inspected.scriptCount,
          malformed_scripts: inspected.malformedDocuments,
          zero_jobposting_pages: inspected.zeroJobPostings ? 1 : 0,
          tombstone_pages: inspected.tombstone ? 1 : 0,
          evidence_loss_pages: inspected.evidenceLoss ? 1 : 0,
          partial_reason: complete ? null : evidenceReason({
            pageErrors: 0,
            malformedScripts: inspected.malformedDocuments,
            evidenceLossPages: inspected.evidenceLoss ? 1 : 0,
            traversalComplete: true,
            authoritative,
          }),
        },
      };
    }

    const sitemap = await collectSitemapUrls(source.sitemapUrl, company, options);
    const maximumPages = Number(company.max_job_pages ?? options.maxJobPages ?? 500);
    const candidateUrls = sitemap.urls.filter(urlFilter(company));
    const selectedUrls = candidateUrls.slice(0, maximumPages);
    let pageErrors = 0;
    let malformedScripts = 0;
    let structuredDataScripts = 0;
    let zeroJobPostingPages = 0;
    let tombstonePages = 0;
    let evidenceLossPages = 0;
    const pages = await mapLimit(selectedUrls, options.detailConcurrency ?? 6, async (pageUrl) => {
      try {
        const page = await fetchText(pageUrl, {
          ...options,
          accept: 'text/html, application/xhtml+xml',
        });
        const inspected = inspectJobPage(page, pageUrl, company);
        malformedScripts += inspected.malformedDocuments;
        structuredDataScripts += inspected.scriptCount;
        if (inspected.zeroJobPostings) zeroJobPostingPages += 1;
        if (inspected.tombstone) tombstonePages += 1;
        if (inspected.evidenceLoss) evidenceLossPages += 1;
        return inspected.jobs;
      } catch (error) {
        pageErrors += 1;
        if (options.onPageError) await options.onPageError({ url: pageUrl, error });
        return [];
      }
    });
    const jobs = pages.flat();
    const traversalComplete = sitemap.complete && candidateUrls.length <= maximumPages;
    const complete = traversalComplete && pageErrors === 0 && evidenceLossPages === 0;
    return {
      jobs: jobs.map((job) => normalizeJsonLd(company, source, job)),
      complete,
      advertisedTotal: null,
      diagnostics: {
        sitemap_urls: sitemap.urls.length,
        candidate_urls: candidateUrls.length,
        page_errors: pageErrors,
        structured_data_scripts: structuredDataScripts,
        malformed_scripts: malformedScripts,
        zero_jobposting_pages: zeroJobPostingPages,
        tombstone_pages: tombstonePages,
        evidence_loss_pages: evidenceLossPages,
        partial_reason: complete ? null : evidenceReason({
          pageErrors,
          malformedScripts,
          evidenceLossPages,
          traversalComplete,
        }),
      },
    };
  },
};
