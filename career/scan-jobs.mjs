#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { inspectSourceDescriptor, mapLimit, scanCompany } from './scanner/adapters.mjs';
import {
  canonicalizeJobUrl,
  createPreviousJobResolver,
  dedupeJobsByCanonicalUrl,
  finalizeJob,
  preserveIncompleteSourceRecord,
  quarantineInvalidJobIdentity,
  reclassifyStoredJob,
  reconcileLegacyPipelineTiers,
  selectNewlyRelevantJobs,
  slugify,
  stripRichDescription,
} from './scanner/core.mjs';
import { acquireOutputLock } from './scanner/lock.mjs';
import {
  atomicWrite,
  atomicWriteTransaction,
  pathExists,
  recoverWriteTransaction,
} from './scanner/storage.mjs';
import {
  applyAuthoritativeOmission,
  applyWindowedOmission,
  assessSourceResult,
  countOpenJobsBySource,
  quarantineUnverifiedClosure,
  sourceIdentity,
  validateLifecycleOptions,
} from './scanner/lifecycle.mjs';
import {
  pruneSnapshotManifests,
  pruneSnapshots,
  SnapshotStore,
  writeSnapshotManifest,
} from './scanner/snapshots.mjs';

const CAREER_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG = join(CAREER_DIR, 'portals.yml');
const FALLBACK_CONFIG = join(CAREER_DIR, 'templates', 'portals.example.yml');
const DEFAULT_CATALOG = join(CAREER_DIR, 'config', 'sources.yml');
const DEFAULT_OUTPUT_DIR = join(CAREER_DIR, 'data');

function usage() {
  return `Career-Ops structured job scanner

Usage: node scan-jobs.mjs [options]

Options:
  --config PATH          Personal filters and company overrides (default: portals.yml)
  --catalog PATH         Tracked reusable company catalog (default: config/sources.yml)
  --output-dir PATH      NDJSON and run-summary directory (default: data)
  --summary-path PATH    Write this run's summary to an explicit path
  --run-id ID            Attach a caller-provided run identity to the summary
  --company NAME         Scan only one company; repeatable
  --accept-drop NAME     Accept a reviewed large count drop for this company; repeatable
  --limit N              Scan only the first N selected companies
  --concurrency N        Company request concurrency (default: 5)
  --detail-concurrency N SmartRecruiters detail concurrency (default: 4)
  --timeout-ms N         Per-request timeout (default: 30000)
  --write-pipeline       Add newly matched roles to data/pipeline.md
  --dry-run              Fetch and report, but do not write files
  --strict               Exit non-zero if any supported source fails
  --help                 Show this help
`;
}

function parseArgs(argv) {
  const options = {
    companies: [],
    acceptDrops: [],
    concurrency: 5,
    detailConcurrency: 4,
    timeoutMs: 30_000,
    writePipeline: false,
    dryRun: false,
    strict: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = () => {
      index += 1;
      if (!argv[index]) throw new Error(`${argument} requires a value`);
      return argv[index];
    };
    if (argument === '--config') options.configPath = next();
    else if (argument === '--catalog') options.catalogPath = next();
    else if (argument === '--output-dir') options.outputDir = next();
    else if (argument === '--summary-path') options.summaryPath = next();
    else if (argument === '--run-id') options.runId = next();
    else if (argument === '--company') options.companies.push(next());
    else if (argument === '--accept-drop') options.acceptDrops.push(next());
    else if (argument === '--limit') options.limit = Number(next());
    else if (argument === '--concurrency') options.concurrency = Number(next());
    else if (argument === '--detail-concurrency') options.detailConcurrency = Number(next());
    else if (argument === '--timeout-ms') options.timeoutMs = Number(next());
    else if (argument === '--write-pipeline') options.writePipeline = true;
    else if (argument === '--dry-run') options.dryRun = true;
    else if (argument === '--strict') options.strict = true;
    else if (argument === '--help' || argument === '-h') options.help = true;
    else throw new Error(`Unknown option: ${argument}`);
  }

  for (const [name, value] of [
    ['limit', options.limit ?? 1],
    ['concurrency', options.concurrency],
    ['detail-concurrency', options.detailConcurrency],
    ['timeout-ms', options.timeoutMs],
  ]) {
    if (!Number.isInteger(value) || value < 1) throw new Error(`${name} must be a positive integer`);
  }
  return options;
}

function absoluteFrom(base, path) {
  return isAbsolute(path) ? path : resolve(base, path);
}

async function readYaml(path, required = true) {
  if (!(await pathExists(path))) {
    if (!required) return {};
    throw new Error(`Configuration file not found: ${path}`);
  }
  const contents = await readFile(path, 'utf8');
  const parsed = parseYaml(contents);
  if (!parsed || typeof parsed !== 'object') throw new Error(`Invalid YAML object: ${path}`);
  return parsed;
}

function normalizedCompanyName(company) {
  return slugify(company.name ?? '');
}

function mergeCompanies(catalogCompanies = [], localCompanies = []) {
  assertUniqueCompanyNames(catalogCompanies, 'source catalog');
  assertUniqueCompanyNames(localCompanies, 'local configuration');
  const companies = new Map();
  for (const company of catalogCompanies) {
    if (company?.name) companies.set(normalizedCompanyName(company), { ...company });
  }
  for (const override of localCompanies) {
    if (!override?.name) continue;
    const key = normalizedCompanyName(override);
    const base = companies.get(key) ?? {};
    const safeOverride = { ...override };
    // A tracked catalog ATS migration must not be redirected by a stale legacy
    // `api` field. A personal endpoint override remains possible by explicitly
    // setting `ats` (or `source_type`) alongside it.
    if (base.ats && override.ats == null && override.source_type == null) {
      delete safeOverride.api;
    }
    const baseLists = Array.isArray(base.list) ? base.list : [base.list, ...(base.lists ?? [])];
    const overrideLists = Array.isArray(override.list) ? override.list : [override.list, ...(override.lists ?? [])];
    const lists = [...new Set([...baseLists, ...overrideLists].filter(Boolean))];
    companies.set(key, {
      ...base,
      ...safeOverride,
      list: lists,
    });
  }
  return [...companies.values()];
}

function assertUniqueCompanyNames(companies, label) {
  const seen = new Map();
  for (const company of companies ?? []) {
    if (!company?.name) continue;
    const key = normalizedCompanyName(company);
    if (seen.has(key)) {
      throw new Error(`Duplicate company name in ${label}: ${company.name}`);
    }
    seen.set(key, company.name);
  }
}

function assertUniqueSourceDescriptors(describedCompanies) {
  const seen = new Map();
  for (const { company, source } of describedCompanies) {
    if (!source) continue;
    const identity = sourceIdentity(source);
    if (seen.has(identity)) {
      throw new Error(`Duplicate source identity ${identity}: ${seen.get(identity)} and ${company.name}`);
    }
    seen.set(identity, company.name);
  }
}

function selectCompanies(companies, options) {
  let selected = companies.filter((company) => company.enabled !== false);
  if (options.companies.length) {
    const names = new Set(options.companies.map(slugify));
    selected = selected.filter((company) => names.has(slugify(company.name)));
    const missing = [...names].filter((name) => !selected.some((company) => slugify(company.name) === name));
    if (missing.length) throw new Error(`Unknown or disabled companies: ${missing.join(', ')}`);
  }
  selected.sort((a, b) => a.name.localeCompare(b.name));
  if (options.limit) selected = selected.slice(0, options.limit);
  return selected;
}

async function loadNdjson(path) {
  if (!(await pathExists(path))) return [];
  const contents = await readFile(path, 'utf8');
  return contents.split('\n').filter(Boolean).map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error(`Malformed NDJSON in ${path} at line ${index + 1}: ${error.message}`);
    }
  });
}

function toNdjson(records) {
  return records.map((record) => JSON.stringify(record)).join('\n') + (records.length ? '\n' : '');
}

function compareJobs(a, b) {
  return a.company.name.localeCompare(b.company.name)
    || a.title.localeCompare(b.title)
    || a.job_key.localeCompare(b.job_key);
}

function collectExistingUrls(contents) {
  const urls = new Set();
  for (const match of String(contents ?? '').matchAll(/https?:\/\/[^\s|)>]+/g)) {
    const canonical = canonicalizeJobUrl(match[0]);
    if (canonical) urls.add(canonical);
  }
  return urls;
}

function safeCell(value) {
  return String(value ?? '').replace(/[\t\r\n|]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function errorMessage(error) {
  const messages = [];
  const seen = new Set();
  let current = error;
  while (current && !seen.has(current) && messages.length < 4) {
    seen.add(current);
    const code = current.code ?? current.cause?.code;
    const message = current.message ?? String(current);
    const detail = code && !message.includes(code) ? `${message} (${code})` : message;
    if (detail && !messages.includes(detail)) messages.push(detail);
    current = current.cause;
  }
  return messages.join(': ') || 'Unknown scanner error';
}

function validatePipelineOptions(options = {}) {
  const maxNew = Number(options.max_new ?? options.maxNew ?? 250);
  if (!Number.isInteger(maxNew) || maxNew < 0) {
    throw new Error('pipeline.max_new must be a nonnegative integer');
  }
  return maxNew;
}

async function updateLegacyPipeline(candidateJobs, relevantJobs, options, now) {
  const pipelinePath = join(CAREER_DIR, 'data', 'pipeline.md');
  const historyPath = join(CAREER_DIR, 'data', 'scan-history.tsv');
  const applicationsPath = join(CAREER_DIR, 'data', 'applications.md');
  const transactionPath = join(CAREER_DIR, 'data', '.pipeline-projection-transaction.json');
  await recoverWriteTransaction(transactionPath);
  const [pipeline, history, applications] = await Promise.all([
    readFile(pipelinePath, 'utf8').catch(() => '# Pipeline — Pending URLs\n\n## Pendientes\n\n## Procesadas\n'),
    readFile(historyPath, 'utf8').catch(() => 'url\tfirst_seen\tportal\ttitle\tcompany\tstatus\n'),
    readFile(applicationsPath, 'utf8').catch(() => ''),
  ]);
  const existingUrls = new Set([
    ...collectExistingUrls(pipeline),
    ...collectExistingUrls(history),
    ...collectExistingUrls(applications),
  ]);
  const maxNew = validatePipelineOptions(options);
  const allCandidates = dedupeJobsByCanonicalUrl(candidateJobs
    .filter((job) => job.status === 'open' && job.canonical_url && !existingUrls.has(job.canonical_url))
    .sort((a, b) => {
      const tierOrder = { target: 0, stretch: 1 };
      return (tierOrder[a.classification.tier] ?? 2) - (tierOrder[b.classification.tier] ?? 2)
        || b.classification.score - a.classification.score
        || compareJobs(a, b);
    }));
  const candidates = allCandidates.slice(0, maxNew);
  const reconciledPipeline = reconcileLegacyPipelineTiers(pipeline, history, relevantJobs);
  const reconciledLines = reconciledPipeline.split('\n');
  const reconciled = pipeline.split('\n')
    .filter((line, index) => line !== reconciledLines[index])
    .length;

  if (!candidates.length) {
    if (reconciled) await atomicWrite(pipelinePath, reconciledPipeline);
    return { added: 0, capped: allCandidates.length, reconciled };
  }
  const markdownLines = [];
  const historyLines = [];
  const date = now.slice(0, 10);
  for (const job of candidates) {
    existingUrls.add(job.canonical_url);
    const stretch = job.classification.tier === 'stretch' ? ' [STRETCH]' : '';
    markdownLines.push(`- [ ] ${job.canonical_url} | ${safeCell(job.company.name)} | ${safeCell(job.title)}${stretch}`);
    historyLines.push([
      job.canonical_url,
      date,
      `${job.source.type}:${job.source.board}`,
      safeCell(job.title),
      safeCell(job.company.name),
      'added',
    ].join('\t'));
  }

  let updatedPipeline;
  if (reconciledPipeline.includes('\n## Procesadas')) {
    updatedPipeline = reconciledPipeline.replace('\n## Procesadas', `\n${markdownLines.join('\n')}\n\n## Procesadas`);
  } else {
    updatedPipeline = `${reconciledPipeline.trimEnd()}\n${markdownLines.join('\n')}\n`;
  }
  const updatedHistory = `${history.trimEnd()}\n${historyLines.join('\n')}\n`;
  await atomicWriteTransaction(transactionPath, [
    { path: pipelinePath, contents: updatedPipeline },
    { path: historyPath, contents: updatedHistory },
  ]);
  return {
    added: candidates.length,
    capped: Math.max(0, allCandidates.length - candidates.length),
    reconciled,
  };
}

function dataQuality(jobs) {
  const open = jobs.filter((job) => job.status === 'open');
  const relevant = open.filter((job) => job.classification?.included);
  const count = (records, predicate) => records.filter(predicate).length;
  return {
    open_jobs: open.length,
    relevant_jobs: relevant.length,
    with_location: count(open, (job) => job.locations?.length),
    with_description: count(relevant, (job) => job.description_plain),
    with_compensation: count(relevant, (job) => job.compensation?.length),
    with_published_date: count(open, (job) => job.first_published_at),
    with_department_or_team: count(open, (job) => job.departments?.length || job.teams?.length),
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }

  const configPath = absoluteFrom(CAREER_DIR, options.configPath
    ?? ((await pathExists(DEFAULT_CONFIG)) ? DEFAULT_CONFIG : FALLBACK_CONFIG));
  const localConfig = await readYaml(configPath);
  if (options.writePipeline) validatePipelineOptions(localConfig.pipeline);
  const catalogSetting = options.catalogPath ?? localConfig.source_catalog ?? DEFAULT_CATALOG;
  const catalogPath = catalogSetting === false ? null : absoluteFrom(CAREER_DIR, catalogSetting);
  const catalogConfig = catalogPath ? await readYaml(catalogPath, false) : {};
  const filter = localConfig.title_filter ?? catalogConfig.title_filter ?? {};
  const outputDir = absoluteFrom(CAREER_DIR, options.outputDir ?? DEFAULT_OUTPUT_DIR);
  const summaryPath = absoluteFrom(
    CAREER_DIR,
    options.summaryPath ?? join(outputDir, 'scan-summary.json'),
  );
  const lockPath = join(outputDir, '.scan-writer.lock');
  const writerLock = options.dryRun ? null : await acquireOutputLock(lockPath);
  try {
  const jobsPath = join(outputDir, 'jobs.ndjson');
  const relevantPath = join(outputDir, 'relevant-jobs.ndjson');
  const lifecycleConfig = {
    ...(catalogConfig.lifecycle ?? {}),
    ...(localConfig.lifecycle ?? {}),
  };
  validateLifecycleOptions(lifecycleConfig);
  const scanStartedAt = new Date().toISOString();
  let quarantinedUnverifiedClosures = 0;
  const previousJobs = (await loadNdjson(jobsPath)).map((storedJob) => {
    const identityChecked = quarantineInvalidJobIdentity(storedJob);
    const sourceEvidenceChecked = preserveIncompleteSourceRecord(identityChecked);
    const lifecycleChecked = quarantineUnverifiedClosure(
      sourceEvidenceChecked,
      scanStartedAt,
      lifecycleConfig,
    );
    if (sourceEvidenceChecked.status === 'closed' && lifecycleChecked.status !== 'closed') {
      quarantinedUnverifiedClosures += 1;
    }
    return lifecycleChecked;
  });
  const previousResolver = createPreviousJobResolver(previousJobs);
  const { effectivePreviousByKey } = previousResolver;
  const previousOpenBySource = countOpenJobsBySource(
    previousJobs,
    (job) => previousResolver.isSuperseded(job),
  );
  const snapshotConfig = {
    ...(catalogConfig.snapshots ?? {}),
    ...(localConfig.snapshots ?? {}),
  };
  const snapshotMaxBytes = Number(snapshotConfig.max_bytes ?? snapshotConfig.maxBytes ?? 100 * 1024 * 1024);
  const snapshotRetentionDays = Number(snapshotConfig.retention_days ?? snapshotConfig.retentionDays ?? 14);
  if (!Number.isFinite(snapshotMaxBytes) || snapshotMaxBytes < 0) {
    throw new Error('snapshots.max_bytes must be a nonnegative number');
  }
  if (!Number.isFinite(snapshotRetentionDays) || snapshotRetentionDays < 0) {
    throw new Error('snapshots.retention_days must be a nonnegative number');
  }
  const snapshotDirectory = join(outputDir, 'raw');
  const snapshotStore = new SnapshotStore(snapshotDirectory, {
    enabled: !options.dryRun && snapshotConfig.enabled !== false,
    maxBytes: snapshotMaxBytes,
  });
  const companies = selectCompanies(mergeCompanies(
    catalogConfig.tracked_companies,
    localConfig.tracked_companies,
  ), options);
  if (!companies.length) throw new Error('No enabled companies selected');

  const acceptedDropCompanies = new Set(options.acceptDrops.map(slugify));
  const selectedCompanyNames = new Set(companies.map((company) => slugify(company.name)));
  const unselectedDropOverrides = [...acceptedDropCompanies]
    .filter((company) => !selectedCompanyNames.has(company));
  if (unselectedDropOverrides.length) {
    throw new Error(`--accept-drop must name a selected company: ${unselectedDropOverrides.join(', ')}`);
  }
  const describedCompanies = companies.map((company) => ({
    company,
    ...inspectSourceDescriptor(company),
  }));
  assertUniqueSourceDescriptors(describedCompanies);
  const supportedCount = describedCompanies.filter(({ source }) => source).length;
  console.log(`Scanning ${companies.length} companies (${supportedCount} structured ATS boards)…`);
  const results = await mapLimit(describedCompanies, options.concurrency, async (described) => {
    const { company, error: descriptorError, source: descriptor } = described;
    if (!descriptor) {
      console.log(`  - ${company.name}: unsupported (${company.careers_url ?? 'no structured ATS'})`);
      return {
        company: company.name,
        jobs: [],
        source: null,
        status: 'unsupported',
        error: descriptorError,
        lifecycle: { state: 'unsupported', authoritative: false },
        snapshot_refs: [],
      };
    }
    const snapshotRefs = [];
    try {
      const result = await scanCompany(company, {
        timeoutMs: options.timeoutMs,
        detailConcurrency: options.detailConcurrency,
        filter,
        onResponse: async (response) => {
          try {
            snapshotRefs.push(await snapshotStore.capture(response));
          } catch (error) {
            snapshotRefs.push({
              url: response?.url ?? null,
              stored: false,
              skipped_reason: 'snapshot_error',
              error: error.message,
            });
          }
        },
      });
      if (result.status === 'unsupported' || !result.source) {
        console.log(`  - ${company.name}: unsupported (${result.error})`);
        return {
          ...result,
          lifecycle: { state: 'unsupported', authoritative: false },
          snapshot_refs: snapshotRefs,
        };
      }
      const relevant = result.jobs.filter((job) => classifyOnly(job, filter)).length;
      const lifecycle = assessSourceResult(
        result,
        previousOpenBySource.get(sourceIdentity(result.source)) ?? 0,
        {
          ...lifecycleConfig,
          allow_large_drop: acceptedDropCompanies.has(slugify(company.name)),
        },
      );
      const marker = lifecycle.authoritative ? '✓' : '!';
      console.log(`  ${marker} ${company.name}: ${result.jobs.length} open, ${relevant} matched (${result.source.type}; ${lifecycle.state})`);
      return {
        ...result,
        lifecycle,
        drop_guard_overridden: acceptedDropCompanies.has(slugify(company.name)),
        snapshot_refs: snapshotRefs.sort((a, b) => String(a.url).localeCompare(String(b.url))),
      };
    } catch (error) {
      const message = errorMessage(error);
      console.error(`  ✗ ${company.name}: ${message}`);
      const result = {
        company: company.name,
        jobs: [],
        source: descriptor,
        status: 'error',
        error: message,
        snapshot_refs: snapshotRefs,
      };
      return {
        ...result,
        lifecycle: assessSourceResult(
          result,
          previousOpenBySource.get(sourceIdentity(result.source)) ?? 0,
          lifecycleConfig,
        ),
      };
    }
  });

  const fetched = results.filter((result) => result.status === 'ok');
  const successful = results.filter((result) => result.lifecycle?.authoritative);
  const failures = results.filter((result) => result.status === 'error');
  const unsupported = results.filter((result) => result.status === 'unsupported');
  const partial = results.filter((result) => result.lifecycle?.state === 'partial');
  const suspicious = results.filter((result) => result.lifecycle?.state === 'suspicious');
  if (!successful.length && !previousJobs.length && !fetched.some((result) => result.jobs.length)) {
    throw new Error('No structured source returned usable jobs; no existing data was available to preserve');
  }

  const now = new Date().toISOString();
  const successfulSourceModes = new Map(successful.map((result) => [
    sourceIdentity(result.source),
    result.lifecycle?.lifecycle_mode ?? result.lifecycle_mode ?? 'authoritative',
  ]));
  const currentByKey = new Map();

  // Partial and suspicious traversals are safe for additive updates: every
  // observed job is real source evidence. Only authoritative sources below may
  // transition omitted jobs toward closure.
  for (const result of fetched) {
    for (const rawJob of result.jobs) {
      const finalized = finalizeJob(rawJob, filter, now, previousResolver.match(rawJob));
      const stored = finalized.classification.included ? finalized : stripRichDescription(finalized);
      const existing = currentByKey.get(stored.job_key);
      if (!existing || (!existing.description_plain && stored.description_plain)) currentByKey.set(stored.job_key, stored);
    }
  }

  const retained = [];
  let closedCount = 0;
  let possiblyClosedCount = 0;
  let movedOutsideWindowCount = 0;
  let preservedAfterFailure = 0;
  for (const previous of previousJobs) {
    if (currentByKey.has(previous.job_key) || previousResolver.hasMatched(previous)) continue;
    const reclassified = reclassifyStoredJob(previous, filter);
    const lifecycleMode = successfulSourceModes.get(sourceIdentity(previous.source));
    if (lifecycleMode === 'authoritative') {
      const transitioned = applyAuthoritativeOmission(reclassified, now, lifecycleConfig);
      retained.push(transitioned);
      if (previous.status !== 'closed' && transitioned.status === 'closed') closedCount += 1;
      if (previous.status !== 'possibly_closed' && transitioned.status === 'possibly_closed') {
        possiblyClosedCount += 1;
      }
    } else if (lifecycleMode === 'windowed') {
      const transitioned = applyWindowedOmission(reclassified, now);
      retained.push(transitioned);
      if (previous.status !== 'unknown'
        || previous.data_quality?.state !== 'outside_source_window') {
        movedOutsideWindowCount += 1;
      }
    } else {
      retained.push(reclassified);
      preservedAfterFailure += 1;
    }
  }

  const jobs = [...currentByKey.values(), ...retained].sort(compareJobs);
  const currentRelevantCount = [...currentByKey.values()]
    .filter((job) => job.classification?.included).length;
  const relevantJobs = jobs
    .filter((job) => job.status === 'open' && job.classification?.included)
    .sort((a, b) => b.classification.score - a.classification.score || compareJobs(a, b));
  const newJobs = [...currentByKey.values()].filter((job) => !effectivePreviousByKey.has(job.job_key));
  const newRelevant = selectNewlyRelevantJobs(jobs, effectivePreviousByKey);
  const reopenedJobs = jobs.filter((job) => (
    job.status === 'open'
      && ['closed', 'possibly_closed'].includes(effectivePreviousByKey.get(job.job_key)?.status)
  ));
  const duplicateUrls = jobs.length - new Set(jobs.map((job) => job.canonical_url).filter(Boolean)).size
    - jobs.filter((job) => !job.canonical_url).length;

  const summary = {
    schema_version: 1,
    run_id: options.runId ?? null,
    started_at: scanStartedAt,
    completed_at: now,
    config: configPath,
    catalog: catalogPath,
    companies_selected: companies.length,
    source_responses_succeeded: fetched.length,
    sources_succeeded: successful.length,
    sources_failed: failures.length,
    sources_partial: partial.length,
    sources_suspicious: suspicious.length,
    sources_unsupported: unsupported.length,
    fetched_open_jobs: currentByKey.size,
    response_open_jobs: fetched.reduce((total, result) => total + result.jobs.length, 0),
    stored_open_jobs: jobs.filter((job) => job.status === 'open').length,
    stored_possibly_closed_jobs: jobs.filter((job) => job.status === 'possibly_closed').length,
    stored_unknown_jobs: jobs.filter((job) => job.status === 'unknown').length,
    current_scan_relevant_jobs: currentRelevantCount,
    relevant_open_jobs: relevantJobs.length,
    new_jobs: newJobs.length,
    new_relevant_jobs: newRelevant.length,
    reopened_jobs: reopenedJobs.length,
    migrated_job_identities: previousResolver.migratedIdentities,
    superseded_invalid_job_identities: previousResolver.supersededInvalidIdentities,
    quarantined_unverified_closures: quarantinedUnverifiedClosures,
    newly_possibly_closed_jobs: possiblyClosedCount,
    newly_closed_jobs: closedCount,
    newly_outside_source_window_jobs: movedOutsideWindowCount,
    prior_jobs_preserved_after_unscanned_or_non_authoritative_source: preservedAfterFailure,
    duplicate_canonical_urls: Math.max(0, duplicateUrls),
    data_quality: dataQuality(jobs),
    pipeline: { requested: options.writePipeline, added: 0, capped: 0, reconciled: 0 },
    sources: results.map((result) => ({
      company: result.company,
      status: result.lifecycle?.state ?? result.status,
      fetch_status: result.status,
      authoritative: result.lifecycle?.authoritative ?? false,
      lifecycle_mode: result.lifecycle?.lifecycle_mode ?? result.lifecycle_mode ?? 'authoritative',
      ats: result.source?.type ?? null,
      board: result.source?.slug ?? null,
      jobs: result.jobs.length,
      relevant: result.jobs.filter((job) => classifyOnly(job, filter)).length,
      advertised_total: result.lifecycle?.advertised_total ?? null,
      drop_ratio: result.lifecycle?.drop_ratio ?? null,
      complete: result.complete ?? result.completeness?.complete ?? null,
      drop_guard_overridden: result.drop_guard_overridden ?? false,
      duration_ms: result.duration_ms ?? null,
      error: result.error ?? result.lifecycle?.reason ?? null,
      diagnostics: result.diagnostics ?? null,
      snapshots: result.snapshot_refs ?? [],
    })),
  };

  if (!options.dryRun) {
    await Promise.all([
      atomicWrite(jobsPath, toNdjson(jobs)),
      atomicWrite(relevantPath, toNdjson(relevantJobs)),
    ]);
    if (options.writePipeline) {
      const pipelineCandidates = [...new Map([
        ...newRelevant,
        ...relevantJobs.filter((job) => job.classification.tier === 'target'),
      ].map((job) => [job.job_key, job])).values()];
      summary.pipeline = {
        requested: true,
        ...await updateLegacyPipeline(pipelineCandidates, relevantJobs, localConfig.pipeline ?? {}, now),
      };
    }
    if (snapshotStore.enabled) {
      summary.snapshot_manifest = await writeSnapshotManifest(snapshotDirectory, {
        started_at: scanStartedAt,
        completed_at: now,
        config: configPath,
        catalog: catalogPath,
        sources: results.map((result) => ({
          company: result.company,
          source: result.source ? {
            type: result.source.type,
            board: result.source.slug ?? result.source.board ?? null,
          } : null,
          status: result.lifecycle?.state ?? result.status,
          authoritative: result.lifecycle?.authoritative ?? false,
          snapshots: result.snapshot_refs ?? [],
        })),
      });
    }
    summary.snapshot_pruning = await pruneSnapshots(snapshotDirectory, {
      retentionDays: snapshotRetentionDays,
      keepHashes: results.flatMap((result) => result.snapshot_refs ?? [])
        .map((reference) => reference.sha256)
        .filter(Boolean),
    });
    summary.snapshot_manifest_pruning = await pruneSnapshotManifests(snapshotDirectory, {
      retentionDays: snapshotRetentionDays,
    });
    await atomicWrite(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  }

  console.log('\nScan complete');
  console.log(`  Sources: ${successful.length} authoritative, ${failures.length} failed, ${partial.length} partial, ${suspicious.length} suspicious, ${unsupported.length} unsupported`);
  console.log(`  Jobs: ${currentByKey.size} fetched, ${currentRelevantCount} matched in this scan, ${newRelevant.length} newly matched`);
  if (summary.stored_open_jobs !== currentByKey.size) console.log(`  Store: ${summary.stored_open_jobs} open jobs retained across all known sources`);
  console.log(`  Rich data: ${summary.data_quality.with_description}/${relevantJobs.length} descriptions, ${summary.data_quality.with_compensation}/${relevantJobs.length} compensation records`);
  if (options.writePipeline && !options.dryRun) {
    console.log(`  Pipeline: ${summary.pipeline.added} new roles added, ${summary.pipeline.reconciled} tiers reconciled`);
  }
  if (options.dryRun) console.log('  Dry run: no files changed');
  else console.log(`  Data: ${jobsPath}`);

  if (options.strict && (failures.length || partial.length || suspicious.length)) process.exitCode = 1;
  } finally {
    await writerLock?.release();
  }
}

function classifyOnly(job, filter) {
  return finalizeJob(job, filter, '1970-01-01T00:00:00.000Z', null).classification.included;
}

main().catch((error) => {
  console.error(`scan-jobs: ${error.message}`);
  process.exitCode = 1;
});
