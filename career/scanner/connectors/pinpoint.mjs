import { normalizePinpoint } from '../core.mjs';
import { fetchJson } from './http.mjs';

export function parsePinpointPostingsWithEvidence(payload) {
  const jobs = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(jobs)) throw new Error('Pinpoint response returned no data array');
  const valid = jobs.filter((job) => job && job.id && job.title && job.url);
  return {
    jobs: valid,
    rawCount: jobs.length,
    invalidCount: jobs.length - valid.length,
  };
}

export function parsePinpointPostings(payload) {
  return parsePinpointPostingsWithEvidence(payload).jobs;
}

export const pinpointConnector = {
  type: 'pinpoint',
  describe(company, inferred) {
    const locale = company.language ?? company.locale;
    const localePath = locale ? `${encodeURIComponent(locale)}/` : '';
    return {
      ...inferred,
      sourceUrl: company.api ?? company.feed_url
        ?? `https://${encodeURIComponent(inferred.slug)}.pinpointhq.com/${localePath}postings.json`,
    };
  },
  async scan({ company, source, options }) {
    const parsed = parsePinpointPostingsWithEvidence(await fetchJson(source.sourceUrl, options));
    const complete = parsed.invalidCount === 0;
    return {
      jobs: parsed.jobs.map((job) => normalizePinpoint(company, source, job)),
      complete,
      advertisedTotal: parsed.rawCount,
      diagnostics: complete ? null : {
        raw_entries: parsed.rawCount,
        invalid_entries: parsed.invalidCount,
        partial_reason: 'invalid_feed_entries',
      },
    };
  },
};
