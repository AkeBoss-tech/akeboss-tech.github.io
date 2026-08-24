import {
  createSourceDescriptor,
  getConnector,
  inspectSourceDescriptor,
  listConnectorTypes,
} from './connectors/registry.mjs';
import { jobIdentityIssues } from './core.mjs';

export { fetchJson, fetchText, mapLimit } from './connectors/http.mjs';
export {
  CONNECTOR_REGISTRY,
  createSourceDescriptor,
  getConnector,
  inspectSourceDescriptor,
  listConnectorTypes,
  registerConnector,
} from './connectors/registry.mjs';

export const sourceDescriptor = createSourceDescriptor;

export async function scanCompany(company, options = {}) {
  const inspected = inspectSourceDescriptor(company);
  const source = inspected.source;
  if (!source) {
    return {
      company: company.name,
      jobs: [],
      source: null,
      status: 'unsupported',
      complete: false,
      advertised_total: null,
      error: `${inspected.error}. Supported types: ${listConnectorTypes().join(', ')}`,
    };
  }

  const connector = getConnector(source.type);
  const startedAt = Date.now();
  const scanned = await connector.scan({ company, source, options });
  const result = Array.isArray(scanned) ? { jobs: scanned, complete: true } : scanned;
  if (!Array.isArray(result.jobs)) throw new Error(`Connector ${source.type} returned no jobs array`);
  const normalizedJobs = [];
  const seenKeys = new Set();
  let invalidIdentities = 0;
  let duplicateIdentities = 0;
  for (const job of result.jobs) {
    const jobKey = String(job?.job_key ?? '').trim();
    if (jobIdentityIssues(job).length) {
      invalidIdentities += 1;
      continue;
    }
    if (seenKeys.has(jobKey)) {
      duplicateIdentities += 1;
      continue;
    }
    seenKeys.add(jobKey);
    normalizedJobs.push(job);
  }
  const identityIntegrity = invalidIdentities === 0 && duplicateIdentities === 0;
  const complete = result.complete === true && identityIntegrity;
  const advertisedTotal = result.advertisedTotal ?? result.advertised_total ?? null;
  const lifecycleMode = result.lifecycleMode ?? result.lifecycle_mode
    ?? source.lifecycleMode ?? source.lifecycle_mode ?? 'authoritative';
  const existingDiagnostics = result.diagnostics ?? {};

  return {
    company: company.name,
    jobs: normalizedJobs,
    source,
    status: 'ok',
    complete,
    completeness: {
      complete,
      pagination_complete: complete,
      reason: identityIntegrity
        ? result.partialReason ?? result.diagnostics?.partial_reason ?? null
        : 'invalid_normalized_identity',
    },
    advertised_total: advertisedTotal,
    lifecycle_mode: lifecycleMode,
    diagnostics: identityIntegrity ? result.diagnostics ?? null : {
      ...existingDiagnostics,
      normalized_entries: normalizedJobs.length,
      invalid_identities: invalidIdentities,
      duplicate_identities: duplicateIdentities,
      partial_reason: 'invalid_normalized_identity',
    },
    duration_ms: Date.now() - startedAt,
  };
}
