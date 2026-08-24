import { normalizeTeamtailor } from '../core.mjs';
import { fetchText } from './http.mjs';
import {
  assertXmlRoot,
  xmlAttribute,
  xmlElements,
  xmlOpeningTagCount,
  xmlRawValue,
  xmlValue,
} from './xml.mjs';

function teamtailorFeedUrl(company) {
  if (company.api ?? company.feed_url) return company.api ?? company.feed_url;
  const careersUrl = new URL(company.careers_url);
  const path = careersUrl.pathname.replace(/\/$/, '');
  careersUrl.pathname = path.endsWith('/jobs') ? `${path}.rss` : `${path}/jobs.rss`;
  return careersUrl.toString();
}

export function parseTeamtailorRssWithEvidence(xml) {
  assertXmlRoot(xml, ['rss', 'feed']);
  const items = xmlElements(xml, 'item');
  const atomEntries = xmlElements(xml, 'entry');
  const rawItems = xmlOpeningTagCount(xml, 'item');
  const rawAtomEntries = xmlOpeningTagCount(xml, 'entry');
  const usesItems = rawItems > 0 || items.length > 0;
  const entries = usesItems ? items : atomEntries;
  const rawCount = usesItems ? rawItems : rawAtomEntries;
  const jobs = entries.map((entry) => ({
    title: xmlValue(entry, 'title'),
    description: xmlRawValue(entry, 'description') ?? xmlRawValue(entry, 'content'),
    pubDate: xmlValue(entry, 'pubDate') ?? xmlValue(entry, 'published') ?? xmlValue(entry, 'updated'),
    link: xmlValue(entry, 'link') ?? xmlAttribute(entry, 'link', 'href'),
    remoteStatus: xmlValue(entry, 'remoteStatus'),
    employmentType: xmlValue(entry, 'employmentType'),
    guid: xmlValue(entry, 'guid') ?? xmlValue(entry, 'id'),
    locations: xmlElements(entry, 'location').map((location) => ({
      name: xmlValue(location, 'name'),
      city: xmlValue(location, 'city'),
      country: xmlValue(location, 'country'),
      address: xmlValue(location, 'address'),
      postal_code: xmlValue(location, 'zip'),
    })),
    department: xmlValue(entry, 'department'),
    role: xmlValue(entry, 'role'),
    division: xmlValue(entry, 'division'),
  })).filter((job) => job.title && job.link && job.guid);
  return {
    jobs,
    rawCount,
    invalidCount: Math.max(0, rawCount - jobs.length),
    signature: entries.join('\u0000'),
  };
}

export function parseTeamtailorRss(xml) {
  return parseTeamtailorRssWithEvidence(xml).jobs;
}

export const teamtailorConnector = {
  type: 'teamtailor',
  describe(company, inferred) {
    return {
      ...inferred,
      sourceUrl: teamtailorFeedUrl(company),
    };
  },
  async scan({ company, source, options }) {
    // RSS descriptions can make the documented 100-item default very large.
    // Smaller deterministic pages are more reliable on slower career sites.
    const pageSize = Number(company.page_size ?? 25);
    const maxPages = Number(company.max_pages ?? options.maxPages ?? 1_000);
    const rawJobs = [];
    const seen = new Set();
    const pageSignatures = new Set();
    let offset = 0;
    let pages = 0;
    let paginationComplete = false;
    let invalidEntries = 0;
    let rawEntries = 0;

    while (pages < maxPages) {
      const url = new URL(source.sourceUrl);
      url.searchParams.set('offset', String(offset));
      url.searchParams.set('per_page', String(pageSize));
      const page = parseTeamtailorRssWithEvidence(await fetchText(url, {
        ...options,
        accept: 'application/rss+xml, application/xml, text/xml',
      }));
      if (page.rawCount && pageSignatures.has(page.signature)) {
        throw new Error(`Teamtailor feed ${source.slug} repeated a page at offset ${offset}`);
      }
      if (page.rawCount) pageSignatures.add(page.signature);
      const unseen = page.jobs.filter((job) => !seen.has(String(job.guid)));
      for (const job of unseen) seen.add(String(job.guid));
      rawJobs.push(...unseen);
      rawEntries += page.rawCount;
      invalidEntries += page.invalidCount;
      pages += 1;
      if (page.rawCount < pageSize) {
        paginationComplete = true;
        break;
      }
      offset += page.rawCount;
    }

    const complete = paginationComplete && invalidEntries === 0;
    return {
      jobs: rawJobs.map((job) => normalizeTeamtailor(company, source, job)),
      complete,
      advertisedTotal: paginationComplete ? rawEntries : null,
      diagnostics: complete ? null : {
        raw_entries: rawEntries,
        invalid_entries: invalidEntries,
        partial_reason: invalidEntries ? 'invalid_feed_entries' : 'pagination_incomplete',
      },
    };
  },
};
