#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, stat, unlink } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { inspectSourceDescriptor } from './scanner/adapters.mjs';
import { inferCompanySource, slugify } from './scanner/core.mjs';
import { MonitorState, sourceIdentity } from './scanner/state.mjs';
import { atomicWrite } from './scanner/storage.mjs';

const CAREER_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG = join(CAREER_DIR, 'portals.yml');
const FALLBACK_CONFIG = join(CAREER_DIR, 'templates', 'portals.example.yml');
const DEFAULT_CATALOG = join(CAREER_DIR, 'config', 'sources.yml');
const DEFAULT_OUTPUT_DIR = join(CAREER_DIR, 'data');

function usage() {
  return `Career-Ops deterministic source monitor

Usage: node monitor-jobs.mjs [options]

Options:
  --status                Print control-plane status and do not scan
  --dry-run               Print the sources that would be claimed and do not scan
  --all                   Select every enabled structured source, ignoring due/backoff time
  --limit N               Maximum sources in this batch (default: 10000)
  --state PATH            SQLite state path (default: data/monitor.sqlite)
  --escalations PATH      Agent escalation NDJSON path (default: data/agent-escalations.ndjson)
  --config PATH           Personal filter/company configuration (default: portals.yml)
  --catalog PATH          Structured source catalog (default: config/sources.yml)
  --output-dir PATH       Scanner output directory (default: data)
  --owner ID              Lease owner (default: generated monitor ID)
  --lease-seconds N       Per-source lease duration (default: 3600)
  --concurrency N         Forward scanner company concurrency
  --detail-concurrency N  Forward scanner detail concurrency
  --timeout-ms N          Forward scanner request timeout
  --write-pipeline        Allow the delegated scanner to update the legacy pipeline
  --json                  Emit machine-readable status/selection output
  --help                  Show this help

The monitor writes only control-plane state and escalation evidence. Canonical job
data remains owned by scan-jobs.mjs, which is invoked as a child process.
`;
}

function positiveInteger(value, name) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) throw new Error(`${name} must be a positive integer`);
  return number;
}

function parseArgs(argv) {
  const options = {
    all: false,
    dryRun: false,
    json: false,
    limit: 10_000,
    status: false,
    writePipeline: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = () => {
      index += 1;
      if (!argv[index]) throw new Error(`${argument} requires a value`);
      return argv[index];
    };
    if (argument === '--status') options.status = true;
    else if (argument === '--dry-run') options.dryRun = true;
    else if (argument === '--all') options.all = true;
    else if (argument === '--json') options.json = true;
    else if (argument === '--write-pipeline') options.writePipeline = true;
    else if (argument === '--limit') options.limit = positiveInteger(next(), 'limit');
    else if (argument === '--state') options.statePath = next();
    else if (argument === '--escalations') options.escalationsPath = next();
    else if (argument === '--config') options.configPath = next();
    else if (argument === '--catalog') options.catalogPath = next();
    else if (argument === '--output-dir') options.outputDir = next();
    else if (argument === '--owner') options.owner = next();
    else if (argument === '--lease-seconds') options.leaseSeconds = positiveInteger(next(), 'lease-seconds');
    else if (argument === '--concurrency') options.concurrency = positiveInteger(next(), 'concurrency');
    else if (argument === '--detail-concurrency') {
      options.detailConcurrency = positiveInteger(next(), 'detail-concurrency');
    } else if (argument === '--timeout-ms') options.timeoutMs = positiveInteger(next(), 'timeout-ms');
    else if (argument === '--help' || argument === '-h') options.help = true;
    else throw new Error(`Unknown option: ${argument}`);
  }
  return options;
}

function absoluteFrom(base, path) {
  return isAbsolute(path) ? path : resolve(base, path);
}

async function exists(path) {
  return stat(path).then(() => true, () => false);
}

async function readYaml(path, required = true) {
  if (!(await exists(path))) {
    if (!required) return {};
    throw new Error(`Configuration file not found: ${path}`);
  }
  const parsed = parseYaml(await readFile(path, 'utf8'));
  if (!parsed || typeof parsed !== 'object') throw new Error(`Invalid YAML object: ${path}`);
  return parsed;
}

export function mergeCompanies(catalogCompanies = [], localCompanies = []) {
  assertUniqueCompanyNames(catalogCompanies, 'source catalog');
  assertUniqueCompanyNames(localCompanies, 'local configuration');
  const merged = new Map();
  for (const company of catalogCompanies ?? []) {
    if (company?.name) merged.set(slugify(company.name), { ...company });
  }
  for (const company of localCompanies ?? []) {
    if (!company?.name) continue;
    const key = slugify(company.name);
    const base = merged.get(key) ?? {};
    const safeOverride = { ...company };
    if (base.ats && company.ats == null && company.source_type == null) delete safeOverride.api;
    merged.set(key, { ...base, ...safeOverride });
  }
  return [...merged.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function assertUniqueCompanyNames(companies, label) {
  const seen = new Set();
  for (const company of companies ?? []) {
    if (!company?.name) continue;
    const key = slugify(company.name);
    if (seen.has(key)) throw new Error(`Duplicate company name in ${label}: ${company.name}`);
    seen.add(key);
  }
}

export function toRegistrySources(companies) {
  const sources = companies.map((company) => {
    const inferred = inferCompanySource(company);
    const inspected = inspectSourceDescriptor(company);
    const descriptor = inspected.source;
    const supported = Boolean(descriptor);
    const source = {
      company: company.name,
      ats: descriptor?.type ?? inferred?.type ?? 'unsupported',
      board: descriptor?.slug ?? inferred?.slug ?? slugify(company.name),
      supported,
      enabled: company.enabled !== false,
      cadence_seconds: company.monitor_cadence_seconds
        ?? (inferred?.type === 'workday' ? 12 * 60 * 60 : 6 * 60 * 60),
      metadata: {
        careers_url: company.careers_url ?? null,
        api: company.api ?? null,
        lists: Array.isArray(company.list) ? company.list : [company.list].filter(Boolean),
        candidate_connector: company.candidate_connector ?? null,
        agent_hint: company.agent_hint ?? null,
        notes: company.notes ?? null,
        descriptor_error: inspected.error,
        lifecycle_mode: descriptor?.lifecycleMode ?? company.lifecycle_mode ?? 'authoritative',
      },
    };
    return { ...source, source_id: sourceIdentity(source) };
  });
  const seen = new Map();
  for (const source of sources) {
    if (seen.has(source.source_id)) {
      throw new Error(
        `Duplicate source identity ${source.source_id}: ${seen.get(source.source_id)} and ${source.company}`,
      );
    }
    seen.set(source.source_id, source.company);
  }
  return sources;
}

function printSelection(sources, json = false) {
  const selected = sources.map((source) => ({
    source_id: source.source_id,
    company: source.company_name,
    connector: source.connector_type,
    board: source.board,
    health: source.health_state,
    next_run_at: source.next_run_at,
    backoff_until: source.backoff_until,
  }));
  if (json) process.stdout.write(`${JSON.stringify({ selected }, null, 2)}\n`);
  else {
    console.log(`Selected ${selected.length} structured source${selected.length === 1 ? '' : 's'}:`);
    for (const source of selected) {
      console.log(`  - ${source.company} (${source.connector}:${source.board}, ${source.health})`);
    }
  }
}

function runScanner(args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: CAREER_DIR,
      stdio: 'inherit',
      env: process.env,
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => resolvePromise({ code: code ?? 1, signal }));
  });
}

export async function loadFreshSummary(path, context) {
  let summary;
  try {
    summary = JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return null;
  }
  const summaryStarted = Date.parse(summary.started_at);
  if (!Number.isFinite(summaryStarted) || summaryStarted + 1_000 < Date.parse(context.startedAt)) return null;
  if (summary.run_id !== context.runId) return null;
  if (!summary.config || !summary.catalog) return null;
  if (resolve(summary.config) !== resolve(context.configPath)) return null;
  if (resolve(summary.catalog) !== resolve(context.catalogPath)) return null;
  const actual = new Map((summary.sources ?? []).map((source) => [slugify(source.company), source]));
  if (
    actual.size !== context.claims.length
    || context.claims.some((claim) => {
      const source = actual.get(slugify(claim.company_name));
      return !source
        || String(source.ats ?? '').toLowerCase() !== String(claim.connector_type).toLowerCase()
        || String(source.board ?? '').toLowerCase() !== String(claim.board).toLowerCase();
    })
  ) return null;
  return summary;
}

function scannerArguments(options, claims, paths) {
  const args = [
    join(CAREER_DIR, 'scan-jobs.mjs'),
    '--config', paths.configPath,
    '--catalog', paths.catalogPath,
    '--output-dir', paths.outputDir,
    '--summary-path', paths.summaryPath,
    '--run-id', paths.runId,
    '--strict',
  ];
  if (options.writePipeline) args.push('--write-pipeline');
  if (options.concurrency) args.push('--concurrency', String(options.concurrency));
  if (options.detailConcurrency) args.push('--detail-concurrency', String(options.detailConcurrency));
  if (options.timeoutMs) args.push('--timeout-ms', String(options.timeoutMs));
  for (const source of claims) args.push('--company', source.company_name);
  return args;
}

async function ingestBatch(state, claims, summary, context) {
  const byCompany = new Map((summary?.sources ?? []).map((result) => [slugify(result.company), result]));
  const completedAt = summary?.completed_at ?? new Date().toISOString();
  const recorded = [];
  for (const source of claims) {
    const result = byCompany.get(slugify(source.company_name)) ?? {
      status: 'error',
      jobs: 0,
      relevant: 0,
      error: context.scannerError,
    };
    recorded.push(state.recordResult(source.source_id, result, {
      runId: context.runId,
      startedAt: summary?.started_at ?? context.startedAt,
      completedAt,
      leaseOwner: context.owner,
      snapshotManifest: summary?.snapshot_manifest?.file
        ? join(context.outputDir, 'raw', summary.snapshot_manifest.file)
        : null,
    }));
  }
  return recorded;
}

export async function monitorMain(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) {
    process.stdout.write(usage());
    return { exitCode: 0 };
  }

  const configPath = absoluteFrom(CAREER_DIR, options.configPath
    ?? ((await exists(DEFAULT_CONFIG)) ? DEFAULT_CONFIG : FALLBACK_CONFIG));
  const localConfig = await readYaml(configPath);
  const catalogSetting = options.catalogPath ?? localConfig.source_catalog ?? DEFAULT_CATALOG;
  if (catalogSetting === false) throw new Error('The monitor requires a structured source catalog');
  const catalogPath = absoluteFrom(CAREER_DIR, catalogSetting);
  const catalogConfig = await readYaml(catalogPath, false);
  const outputDir = absoluteFrom(CAREER_DIR, options.outputDir ?? DEFAULT_OUTPUT_DIR);
  const statePath = absoluteFrom(CAREER_DIR, options.statePath ?? join(outputDir, 'monitor.sqlite'));
  const escalationsPath = absoluteFrom(
    CAREER_DIR,
    options.escalationsPath ?? join(outputDir, 'agent-escalations.ndjson'),
  );
  const registry = toRegistrySources(mergeCompanies(
    catalogConfig.tracked_companies,
    localConfig.tracked_companies,
  ));
  if (!registry.length) throw new Error('No companies are configured');

  await mkdir(dirname(statePath), { recursive: true });
  const state = new MonitorState(statePath);
  try {
    state.syncSources(registry);
    await state.exportEscalations(escalationsPath);

    if (options.status) {
      const status = state.status();
      if (options.json) process.stdout.write(`${JSON.stringify(status, null, 2)}\n`);
      else {
        console.log('Career monitor status');
        console.log(`  Sources: ${status.supported_sources} structured, ${status.agent_required_sources} agent-required`);
        console.log(`  Due: ${status.due_sources}; leased: ${status.leased_sources}`);
        console.log(`  Open escalations: ${status.open_escalations}`);
        console.log(`  Health: ${Object.entries(status.health).map(([key, value]) => `${key}=${value}`).join(', ') || 'none'}`);
        console.log(`  Evidence: ${escalationsPath}`);
      }
      return { exitCode: 0, status };
    }

    if (options.dryRun) {
      const due = state.listDue({ all: options.all, limit: options.limit });
      printSelection(due, options.json);
      return { exitCode: 0, selected: due, dryRun: true };
    }

    const owner = options.owner ?? `monitor-${process.pid}-${randomUUID()}`;
    const claims = state.claimDueSources({
      owner,
      all: options.all,
      limit: options.limit,
      leaseSeconds: options.leaseSeconds,
    });
    if (!claims.length) {
      if (options.json) process.stdout.write(`${JSON.stringify({ selected: [], message: 'No sources are due' })}\n`);
      else console.log('No structured sources are due.');
      return { exitCode: 0, selected: [] };
    }
    printSelection(claims, options.json);

    const runId = randomUUID();
    const startedAt = new Date().toISOString();
    const latestSummaryPath = join(outputDir, 'scan-summary.json');
    const summaryPath = join(outputDir, '.monitor-runs', `${runId}.json`);
    let scannerResult;
    let summary;
    try {
      scannerResult = await runScanner(scannerArguments(options, claims, {
        configPath,
        catalogPath,
        outputDir,
        runId,
        summaryPath,
      }));
      summary = await loadFreshSummary(summaryPath, {
        startedAt,
        runId,
        claims,
        configPath,
        catalogPath,
      });
      const scannerError = summary
        ? `Scanner omitted this source (exit ${scannerResult.code}${scannerResult.signal ? `, ${scannerResult.signal}` : ''})`
        : `Scanner did not produce a fresh complete summary (exit ${scannerResult.code}${scannerResult.signal ? `, ${scannerResult.signal}` : ''})`;
      await ingestBatch(state, claims, summary, {
        runId, startedAt, scannerError, owner, outputDir,
      });
      if (summary) await atomicWrite(latestSummaryPath, `${JSON.stringify(summary, null, 2)}\n`);
    } catch (error) {
      await ingestBatch(state, claims, null, {
        runId,
        startedAt,
        owner,
        outputDir,
        scannerError: `Monitor could not run scanner: ${error.message}`,
      });
      scannerResult = { code: 1, signal: null };
    }
    await unlink(summaryPath).catch((error) => {
      if (error?.code !== 'ENOENT') throw error;
    });

    const escalations = await state.exportEscalations(escalationsPath);
    const results = claims.map((source) => state.getSource(source.source_id));
    const failed = results.filter((source) => source.health_state !== 'healthy').length;
    const report = {
      run_id: runId,
      selected: claims.length,
      healthy: results.length - failed,
      requires_attention: failed,
      open_escalations: escalations.length,
      scanner_exit_code: scannerResult.code,
      evidence_path: escalationsPath,
    };
    if (options.json) process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    else {
      console.log('Monitor ingestion complete');
      console.log(`  Healthy: ${report.healthy}/${report.selected}; attention: ${report.requires_attention}`);
      console.log(`  Open escalations: ${report.open_escalations} (${escalationsPath})`);
    }
    return { exitCode: scannerResult.code === 0 ? 0 : 1, report };
  } finally {
    state.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  monitorMain().then(({ exitCode = 0 }) => {
    process.exitCode = exitCode;
  }).catch((error) => {
    console.error(`monitor-jobs: ${error.message}`);
    process.exitCode = 1;
  });
}
