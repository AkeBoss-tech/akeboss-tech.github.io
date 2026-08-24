import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const DASHBOARD_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DATA_DIR = path.resolve(DASHBOARD_DIR, '..', 'data');
const DAY_MS = 24 * 60 * 60 * 1_000;

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function nonblank(value) {
  const normalized = String(value ?? '').trim();
  return normalized || null;
}

function finiteInteger(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.trunc(parsed)) : fallback;
}

function validDate(value) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

function safeUrl(value) {
  const candidate = nonblank(value);
  if (!candidate) return null;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'https:' ? parsed.href : null;
  } catch {
    return null;
  }
}

function compactLocations(value) {
  return asArray(value).map((entry) => {
    if (typeof entry === 'string') return nonblank(entry);
    const location = asObject(entry);
    const projected = {
      label: nonblank(location.label),
      city: nonblank(location.city),
      region: nonblank(location.region),
      country: nonblank(location.country),
    };
    if (!projected.label) {
      projected.label = [projected.city, projected.region, projected.country].filter(Boolean).join(', ') || null;
    }
    return projected.label ? projected : null;
  }).filter(Boolean);
}

function hasCompensation(value) {
  return asArray(value).some((entry) => {
    const item = asObject(entry);
    return Boolean(
      nonblank(item.text)
      || nonblank(item.summary)
      || nonblank(item.salary_summary)
      || Number.isFinite(Number(item.min))
      || Number.isFinite(Number(item.max))
      || asArray(item.tiers).length,
    );
  });
}

function projectRole(job) {
  const source = asObject(job.source);
  const company = asObject(job.company);
  const classification = asObject(job.classification);
  const locations = compactLocations(job.locations);
  return {
    id: nonblank(job.job_key),
    title: nonblank(job.title) ?? 'Untitled role',
    company: nonblank(company.name) ?? 'Unknown company',
    companySlug: nonblank(company.slug),
    canonicalUrl: safeUrl(job.canonical_url),
    applyUrl: safeUrl(job.apply_url),
    locations,
    workplaceType: nonblank(job.workplace_type) ?? 'unknown',
    employmentType: nonblank(job.employment_type) ?? 'unknown',
    sourceType: nonblank(source.type) ?? 'unknown',
    sourceBoard: nonblank(source.board),
    tracks: [...new Set(asArray(classification.tracks).map(nonblank).filter(Boolean))],
    level: nonblank(classification.level) ?? 'unknown',
    term: nonblank(classification.term),
    tier: nonblank(classification.tier) ?? 'unknown',
    score: finiteInteger(classification.score),
    firstSeenAt: validDate(job.first_seen_at),
    lastSeenAt: validDate(job.last_seen_at),
    firstPublishedAt: validDate(job.first_published_at),
    hasCompensation: hasCompensation(job.compensation),
  };
}

async function readRelevantRoles(filePath) {
  const roles = [];
  const input = createReadStream(filePath, { encoding: 'utf8' });
  const lines = readline.createInterface({ input, crlfDelay: Infinity });
  let lineNumber = 0;
  try {
    for await (const line of lines) {
      lineNumber += 1;
      if (!line.trim()) continue;
      let parsed;
      try {
        parsed = JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid relevant-jobs NDJSON at line ${lineNumber}: ${error.message}`);
      }
      roles.push(projectRole(parsed));
    }
  } finally {
    lines.close();
  }
  return roles;
}

function parseJsonObject(text, label) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid ${label}: ${error.message}`);
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Invalid ${label}: expected an object`);
  }
  return parsed;
}

function parseEvidence(value) {
  try {
    return asObject(JSON.parse(value ?? '{}'));
  } catch {
    return {};
  }
}

function readMonitorData(databasePath, nowMs) {
  const database = new DatabaseSync(databasePath, { readOnly: true });
  try {
    const sourceRows = database.prepare(`
      SELECT source_id, company_name, connector_type, board, supported, enabled,
             health_state, last_attempt_at, last_success_at, last_job_count,
             last_relevant_count, last_error, next_run_at, backoff_until,
             lease_owner, lease_expires_at
        FROM monitor_sources
       WHERE enabled = 1
       ORDER BY supported DESC, company_name COLLATE NOCASE
    `).all();

    const escalationRows = database.prepare(`
      SELECT e.id, e.source_id, e.kind, e.severity, e.status, e.occurrences,
             e.first_seen_at, e.last_seen_at, e.evidence_json,
             s.company_name, s.connector_type
        FROM monitor_escalations e
        JOIN monitor_sources s ON s.source_id = e.source_id
       WHERE e.status = 'open' AND s.enabled = 1
       ORDER BY e.last_seen_at DESC, e.id DESC
    `).all();

    const runRows = database.prepare(`
      SELECT r.run_id, r.source_id, r.started_at, r.completed_at, r.raw_status,
             r.outcome, r.jobs, r.relevant, r.duration_ms, r.error,
             r.anomaly_type, s.company_name, s.connector_type
        FROM source_runs r
        JOIN monitor_sources s ON s.source_id = r.source_id
       ORDER BY r.completed_at DESC, r.id DESC
       LIMIT 40
    `).all();

    const sources = sourceRows.map((row) => ({
      id: row.source_id,
      company: row.company_name,
      connector: row.connector_type,
      board: row.board,
      supported: row.supported === 1,
      enabled: row.enabled === 1,
      health: row.health_state,
      lastAttemptAt: validDate(row.last_attempt_at),
      lastSuccessAt: validDate(row.last_success_at),
      jobCount: finiteInteger(row.last_job_count),
      relevantCount: finiteInteger(row.last_relevant_count),
      lastError: nonblank(row.last_error),
      nextRunAt: validDate(row.next_run_at),
      backoffUntil: validDate(row.backoff_until),
      leaseExpiresAt: validDate(row.lease_expires_at),
      leased: Boolean(row.lease_owner && Date.parse(row.lease_expires_at) > nowMs),
      due: row.supported === 1
        && validDate(row.next_run_at) !== null
        && Date.parse(row.next_run_at) <= nowMs
        && !(row.lease_owner && Date.parse(row.lease_expires_at) > nowMs),
    }));

    const escalations = escalationRows.map((row) => {
      const evidence = parseEvidence(row.evidence_json);
      return {
        id: row.id,
        sourceId: row.source_id,
        company: row.company_name,
        connector: row.connector_type,
        kind: row.kind,
        severity: row.severity,
        occurrences: finiteInteger(row.occurrences, 1),
        firstSeenAt: validDate(row.first_seen_at),
        lastSeenAt: validDate(row.last_seen_at),
        lastError: nonblank(evidence.last_error ?? evidence.error ?? evidence.reason),
      };
    });

    const recentRuns = runRows.map((row) => ({
      runId: row.run_id,
      sourceId: row.source_id,
      company: row.company_name,
      connector: row.connector_type,
      startedAt: validDate(row.started_at),
      completedAt: validDate(row.completed_at),
      rawStatus: row.raw_status,
      outcome: row.outcome,
      jobs: finiteInteger(row.jobs),
      relevant: finiteInteger(row.relevant),
      durationMs: finiteInteger(row.duration_ms),
      error: nonblank(row.error),
      anomalyType: nonblank(row.anomaly_type),
    }));

    return { sources, escalations, recentRuns };
  } finally {
    database.close();
  }
}

function countMix(values, { labels = {} } = {}) {
  const counts = new Map();
  for (const value of values) {
    const key = nonblank(value) ?? 'unknown';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, label: labels[key] ?? key.replaceAll(/[-_]+/g, ' '), count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

function buildFirstSeenTrend(roles, nowMs, days = 30) {
  const start = new Date(nowMs);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  const counts = new Map();
  for (let offset = 0; offset < days; offset += 1) {
    const day = new Date(start.getTime() + (offset * DAY_MS)).toISOString().slice(0, 10);
    counts.set(day, 0);
  }
  for (const role of roles) {
    if (!role.firstSeenAt) continue;
    const day = role.firstSeenAt.slice(0, 10);
    if (counts.has(day)) counts.set(day, counts.get(day) + 1);
  }
  return [...counts.entries()].map(([date, count]) => ({ date, count }));
}

function coverageEntry(key, label, count, total) {
  return {
    key,
    label,
    count,
    total,
    percent: total ? Number(((count / total) * 100).toFixed(1)) : 0,
  };
}

function buildQuality(roles) {
  const total = roles.length;
  const coverage = [
    coverageEntry('apply_url', 'Application link', roles.filter((role) => role.applyUrl || role.canonicalUrl).length, total),
    coverageEntry('location', 'Location', roles.filter((role) => role.locations.length).length, total),
    coverageEntry('workplace', 'Workplace type', roles.filter((role) => role.workplaceType !== 'unknown').length, total),
    coverageEntry('employment', 'Employment type', roles.filter((role) => role.employmentType !== 'unknown').length, total),
    coverageEntry('published', 'Publication date', roles.filter((role) => role.firstPublishedAt).length, total),
    coverageEntry('compensation', 'Compensation', roles.filter((role) => role.hasCompensation).length, total),
  ];
  const issues = coverage
    .filter((entry) => entry.percent < 70)
    .map((entry) => ({
      kind: 'low_coverage',
      field: entry.key,
      label: entry.label,
      percent: entry.percent,
    }));
  return { scope: 'relevant_open_jobs', coverage, issues };
}

function addLatestScanMembership(roles, summary) {
  const startedAt = validDate(summary.started_at);
  const completedAt = validDate(summary.completed_at);
  const expected = Number(summary.new_relevant_jobs);
  if (!startedAt || !completedAt || !Number.isFinite(expected) || expected < 0) {
    return { exact: false, count: null };
  }
  const startMs = Date.parse(startedAt);
  const endMs = Date.parse(completedAt);
  const candidates = roles.filter((role) => {
    const seenMs = Date.parse(role.firstSeenAt);
    return Number.isFinite(seenMs) && seenMs >= startMs && seenMs <= endMs;
  });
  if (candidates.length !== Math.trunc(expected)) return { exact: false, count: null };
  const keys = new Set(candidates.map((role) => role.id));
  for (const role of roles) role.isNewThisScan = keys.has(role.id);
  return { exact: true, count: candidates.length };
}

function newestTimestamp(values) {
  const timestamps = values.map((value) => Date.parse(value)).filter(Number.isFinite);
  return timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : null;
}

function refreshTimeDependentFields(dashboard, nowDate) {
  const nowMs = nowDate.getTime();
  const sources = dashboard.sources.map((source) => {
    const leased = source.leaseExpiresAt !== null && Date.parse(source.leaseExpiresAt) > nowMs;
    const due = source.supported
      && source.nextRunAt !== null
      && Date.parse(source.nextRunAt) <= nowMs
      && !leased;
    return { ...source, leased, due };
  });
  const deterministicSources = sources.filter((source) => source.supported);
  const dueSources = deterministicSources.filter((source) => source.due).length;
  const operationalIssues = deterministicSources.filter((source) => source.health !== 'healthy').length;
  const stale = nowMs - Date.parse(dashboard.freshness.jobsUpdatedAt) > DAY_MS;
  const status = stale ? 'stale' : operationalIssues || dueSources ? 'degraded' : 'healthy';
  const newRelevant24h = dashboard.roles
    .filter((role) => Date.parse(role.firstSeenAt) >= nowMs - DAY_MS && Date.parse(role.firstSeenAt) <= nowMs)
    .length;
  return {
    ...dashboard,
    generatedAt: nowDate.toISOString(),
    freshness: { ...dashboard.freshness, status },
    kpis: {
      ...dashboard.kpis,
      newRelevant24h,
      dueSources,
      operationalIssues,
    },
    firstSeenTrend: buildFirstSeenTrend(dashboard.roles, nowMs),
    sources,
  };
}

export async function buildDashboardData({
  dataDir = DEFAULT_DATA_DIR,
  now = () => new Date(),
} = {}) {
  const relevantPath = path.join(dataDir, 'relevant-jobs.ndjson');
  const summaryPath = path.join(dataDir, 'scan-summary.json');
  const databasePath = path.join(dataDir, 'monitor.sqlite');
  const nowDate = now();
  const nowMs = nowDate.getTime();

  const [roles, summaryText, relevantStats] = await Promise.all([
    readRelevantRoles(relevantPath),
    readFile(summaryPath, 'utf8'),
    stat(relevantPath),
  ]);
  const summary = parseJsonObject(summaryText, 'scan-summary.json');
  const monitor = readMonitorData(databasePath, nowMs);
  const newMembership = addLatestScanMembership(roles, summary);
  const newRelevant24h = roles.filter((role) => Date.parse(role.firstSeenAt) >= nowMs - DAY_MS).length;

  roles.sort((left, right) => {
    const newDifference = Number(right.isNewThisScan === true) - Number(left.isNewThisScan === true);
    if (newDifference) return newDifference;
    const seenDifference = (Date.parse(right.firstSeenAt) || 0) - (Date.parse(left.firstSeenAt) || 0);
    if (seenDifference) return seenDifference;
    const scoreDifference = right.score - left.score;
    if (scoreDifference) return scoreDifference;
    return left.company.localeCompare(right.company) || left.title.localeCompare(right.title);
  });

  const enabledSources = monitor.sources;
  const deterministicSources = enabledSources.filter((source) => source.supported);
  const agentRequiredSources = enabledSources.filter((source) => !source.supported);
  const healthySources = deterministicSources.filter((source) => source.health === 'healthy').length;
  const dueSources = deterministicSources.filter((source) => source.due).length;
  const operationalIssues = deterministicSources.filter((source) => source.health !== 'healthy').length;
  const latestScanCompletedAt = validDate(summary.completed_at);
  const jobsUpdatedAt = relevantStats.mtime.toISOString();
  const latestSourceSuccessAt = newestTimestamp(deterministicSources.map((source) => source.lastSuccessAt));
  const stale = nowMs - relevantStats.mtimeMs > DAY_MS;
  const freshnessStatus = stale ? 'stale' : operationalIssues || dueSources ? 'degraded' : 'healthy';

  const kpis = {
    openJobs: finiteInteger(summary.stored_open_jobs),
    relevantOpenJobs: finiteInteger(summary.relevant_open_jobs, roles.length),
    newRelevant24h,
    monitoredCompanies: enabledSources.length,
    deterministicSources: deterministicSources.length,
    healthySources,
    agentRequiredSources: agentRequiredSources.length,
    dueSources,
    openEscalations: monitor.escalations.length,
    operationalIssues,
  };
  const authoritativeNewRelevant = Number(summary.new_relevant_jobs);
  if (Number.isFinite(authoritativeNewRelevant) && authoritativeNewRelevant >= 0) {
    kpis.newRelevantThisScan = Math.trunc(authoritativeNewRelevant);
  }

  return {
    generatedAt: nowDate.toISOString(),
    freshness: {
      status: freshnessStatus,
      jobsUpdatedAt,
      latestScanStartedAt: validDate(summary.started_at),
      latestScanCompletedAt,
      latestSourceSuccessAt,
    },
    kpis,
    quality: buildQuality(roles),
    mix: {
      tracks: countMix(roles.flatMap((role) => role.tracks)),
      levels: countMix(roles.map((role) => role.level)),
      workplace: countMix(roles.map((role) => role.workplaceType), {
        labels: { onsite: 'On-site', on_site: 'On-site' },
      }),
      connectors: countMix(roles.map((role) => role.sourceType)),
    },
    firstSeenTrend: buildFirstSeenTrend(roles, nowMs),
    roles,
    sources: enabledSources,
    escalations: monitor.escalations,
    recentRuns: monitor.recentRuns,
    meta: {
      schemaVersion: 1,
      roleProjection: 'open_and_classification_included',
      roleCount: roles.length,
      newMembershipExact: newMembership.exact,
      newThisScanRoleMembershipAvailable: newMembership.exact,
      newThisScanRoleMembershipReason: newMembership.exact
        ? null
        : 'Latest-scan count could not be reconciled to per-role first-seen timestamps.',
      latestRunId: nonblank(summary.run_id),
      dataFiles: ['relevant-jobs.ndjson', 'scan-summary.json', 'monitor.sqlite'],
    },
  };
}

async function fileSignature(filePath, optional = false) {
  try {
    const info = await stat(filePath);
    return `${info.mtimeMs}:${info.size}`;
  } catch (error) {
    if (optional && error?.code === 'ENOENT') return 'missing';
    throw error;
  }
}

export function createDashboardStore({ dataDir = DEFAULT_DATA_DIR, now } = {}) {
  const paths = [
    path.join(dataDir, 'relevant-jobs.ndjson'),
    path.join(dataDir, 'scan-summary.json'),
    path.join(dataDir, 'monitor.sqlite'),
  ];
  const optionalPaths = [
    path.join(dataDir, 'monitor.sqlite-wal'),
  ];
  let cachedSignature = null;
  let cachedDashboard = null;
  let pending = null;

  async function signature() {
    const required = await Promise.all(paths.map((filePath) => fileSignature(filePath)));
    const optional = await Promise.all(optionalPaths.map((filePath) => fileSignature(filePath, true)));
    return [...required, ...optional].join('|');
  }

  function attachDataVersion(dashboard, value) {
    const dataVersion = createHash('sha256').update(value).digest('hex').slice(0, 16);
    return { ...dashboard, meta: { ...dashboard.meta, dataVersion } };
  }

  async function getDashboardData({ force = false } = {}) {
    const nowDate = now ? now() : new Date();
    const currentSignature = await signature();
    if (!force && cachedDashboard && currentSignature === cachedSignature) {
      cachedDashboard = refreshTimeDependentFields(cachedDashboard, nowDate);
      return cachedDashboard;
    }
    if (pending) return pending;
    pending = buildDashboardData({ dataDir, now: () => nowDate })
      .then(async (dashboard) => {
        const completedSignature = await signature();
        if (completedSignature !== currentSignature) {
          dashboard = await buildDashboardData({ dataDir, now: () => nowDate });
        }
        cachedSignature = await signature();
        cachedDashboard = attachDataVersion(refreshTimeDependentFields(dashboard, nowDate), cachedSignature);
        return cachedDashboard;
      })
      .finally(() => {
        pending = null;
      });
    return pending;
  }

  return {
    getDashboardData,
    clear() {
      cachedSignature = null;
      cachedDashboard = null;
    },
  };
}
