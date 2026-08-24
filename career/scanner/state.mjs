import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { DEFAULT_SUSPICIOUS_DROP_RATIO } from './lifecycle.mjs';

export const DEFAULT_MONITOR_POLICY = Object.freeze({
  cadenceSeconds: 6 * 60 * 60,
  leaseSeconds: 60 * 60,
  errorBackoffBaseSeconds: 15 * 60,
  errorBackoffMaxSeconds: 6 * 60 * 60,
  anomalyRetrySeconds: 30 * 60,
  failureEscalationThreshold: 3,
  anomalyEscalationThreshold: 2,
  largeDropFraction: DEFAULT_SUSPICIOUS_DROP_RATIO,
  largeDropMinimumPrevious: 10,
  largeDropMinimumAbsolute: 10,
});

function iso(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error(`Invalid timestamp: ${value}`);
  return date.toISOString();
}

function addSeconds(value, seconds) {
  return new Date(new Date(value).getTime() + seconds * 1_000).toISOString();
}

function parseJson(value, fallback = null) {
  if (value == null) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function asInteger(value, fallback = 0) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : fallback;
}

function policyWith(overrides = {}) {
  return { ...DEFAULT_MONITOR_POLICY, ...overrides };
}

export function sourceIdentity(source) {
  const connector = String(source.ats ?? source.connector_type ?? 'unsupported').trim().toLowerCase();
  const board = String(source.board ?? source.company ?? source.company_name ?? '').trim().toLowerCase();
  if (!board) throw new Error('A source needs a board or company name');
  return `${connector}:${board}`;
}

export function computeBackoffSeconds(failureCount, overrides = {}) {
  const policy = policyWith(overrides);
  const exponent = Math.max(0, asInteger(failureCount, 1) - 1);
  return Math.min(
    policy.errorBackoffMaxSeconds,
    policy.errorBackoffBaseSeconds * (2 ** exponent),
  );
}

export function detectCountAnomaly(previousCount, currentCount, overrides = {}) {
  const policy = policyWith(overrides);
  const previous = Number(previousCount);
  const current = Number(currentCount);
  if (!Number.isInteger(previous) || previous < 0 || !Number.isInteger(current) || current < 0) {
    return null;
  }
  if (previous > 0 && current === 0) {
    return {
      type: 'zero_jobs',
      severity: 'high',
      previous_jobs: previous,
      current_jobs: current,
      absolute_drop: previous,
      drop_fraction: 1,
    };
  }
  const absoluteDrop = previous - current;
  const dropFraction = previous > 0 ? absoluteDrop / previous : 0;
  if (
    previous >= policy.largeDropMinimumPrevious
    && absoluteDrop >= policy.largeDropMinimumAbsolute
    && dropFraction >= policy.largeDropFraction
  ) {
    return {
      type: 'large_drop',
      severity: 'medium',
      previous_jobs: previous,
      current_jobs: current,
      absolute_drop: absoluteDrop,
      drop_fraction: Number(dropFraction.toFixed(6)),
    };
  }
  return null;
}

function hydrateSource(row) {
  if (!row) return null;
  return {
    ...row,
    supported: Boolean(row.supported),
    enabled: Boolean(row.enabled),
    metadata: parseJson(row.metadata_json, {}),
  };
}

function hydrateRun(row) {
  if (!row) return null;
  return {
    ...row,
    evidence: parseJson(row.evidence_json, null),
  };
}

function hydrateEscalation(row) {
  if (!row) return null;
  return {
    ...row,
    evidence: parseJson(row.evidence_json, {}),
  };
}

export class MonitorState {
  constructor(path = ':memory:', options = {}) {
    this.path = path;
    this.policy = policyWith(options.policy);
    this.db = new DatabaseSync(path, {
      enableForeignKeyConstraints: true,
      timeout: options.timeoutMs ?? 5_000,
    });
    this.db.exec('PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL; PRAGMA busy_timeout = 5000;');
    this.#migrate();
  }

  #migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS monitor_sources (
        source_id TEXT PRIMARY KEY,
        company_name TEXT NOT NULL,
        connector_type TEXT NOT NULL,
        board TEXT NOT NULL,
        supported INTEGER NOT NULL DEFAULT 1 CHECK (supported IN (0, 1)),
        enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
        cadence_seconds INTEGER NOT NULL,
        health_state TEXT NOT NULL DEFAULT 'new',
        consecutive_failures INTEGER NOT NULL DEFAULT 0,
        consecutive_anomalies INTEGER NOT NULL DEFAULT 0,
        last_attempt_at TEXT,
        last_success_at TEXT,
        last_job_count INTEGER,
        last_relevant_count INTEGER,
        last_error TEXT,
        next_run_at TEXT,
        backoff_until TEXT,
        lease_owner TEXT,
        lease_expires_at TEXT,
        metadata_json TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS source_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id TEXT NOT NULL,
        source_id TEXT NOT NULL REFERENCES monitor_sources(source_id),
        started_at TEXT NOT NULL,
        completed_at TEXT NOT NULL,
        raw_status TEXT NOT NULL,
        outcome TEXT NOT NULL,
        jobs INTEGER NOT NULL DEFAULT 0,
        relevant INTEGER NOT NULL DEFAULT 0,
        duration_ms INTEGER,
        error TEXT,
        anomaly_type TEXT,
        evidence_json TEXT,
        UNIQUE (run_id, source_id)
      );

      CREATE INDEX IF NOT EXISTS source_runs_source_completed
      ON source_runs (source_id, completed_at DESC);

      CREATE TABLE IF NOT EXISTS monitor_escalations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id TEXT NOT NULL REFERENCES monitor_sources(source_id),
        kind TEXT NOT NULL,
        severity TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        occurrences INTEGER NOT NULL DEFAULT 1,
        first_seen_at TEXT NOT NULL,
        last_seen_at TEXT NOT NULL,
        resolved_at TEXT,
        evidence_json TEXT NOT NULL
      );

      CREATE UNIQUE INDEX IF NOT EXISTS one_open_escalation_per_kind
      ON monitor_escalations (source_id, kind) WHERE status = 'open';

      CREATE INDEX IF NOT EXISTS escalations_status_seen
      ON monitor_escalations (status, last_seen_at DESC);
    `);
  }

  close() {
    this.db.close();
  }

  syncSources(sources, now = new Date()) {
    const timestamp = iso(now);
    const normalized = sources.map((source) => {
      const supported = source.supported !== false && source.ats && source.ats !== 'unsupported';
      return {
        source_id: source.source_id ?? sourceIdentity(source),
        company_name: String(source.company ?? source.company_name ?? '').trim(),
        connector_type: String(source.ats ?? source.connector_type ?? 'unsupported').toLowerCase(),
        board: String(source.board ?? source.company ?? source.company_name ?? '').trim(),
        supported: supported ? 1 : 0,
        enabled: source.enabled === false ? 0 : 1,
        cadence_seconds: asInteger(source.cadence_seconds, this.policy.cadenceSeconds),
        metadata_json: JSON.stringify(source.metadata ?? {}),
      };
    });
    if (normalized.some((source) => !source.company_name)) throw new Error('Every source needs a company name');

    const upsert = this.db.prepare(`
      INSERT INTO monitor_sources (
        source_id, company_name, connector_type, board, supported, enabled,
        cadence_seconds, health_state, next_run_at, metadata_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(source_id) DO UPDATE SET
        company_name = excluded.company_name,
        connector_type = excluded.connector_type,
        board = excluded.board,
        supported = excluded.supported,
        enabled = excluded.enabled,
        cadence_seconds = excluded.cadence_seconds,
        metadata_json = excluded.metadata_json,
        updated_at = excluded.updated_at
    `);

    this.db.exec('BEGIN IMMEDIATE');
    try {
      this.db.prepare('UPDATE monitor_sources SET enabled = 0, updated_at = ?').run(timestamp);
      for (const source of normalized) {
        upsert.run(
          source.source_id,
          source.company_name,
          source.connector_type,
          source.board,
          source.supported,
          source.enabled,
          source.cadence_seconds,
          source.supported ? 'new' : 'agent_required',
          source.supported && source.enabled ? timestamp : null,
          source.metadata_json,
          timestamp,
          timestamp,
        );
        if (!source.supported && source.enabled) {
          this.db.prepare(`
            UPDATE monitor_sources SET
              health_state = 'agent_required', next_run_at = NULL, backoff_until = NULL,
              lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
            WHERE source_id = ?
          `).run(timestamp, source.source_id);
          this.#upsertEscalation(source.source_id, 'connector_discovery', 'medium', timestamp, {
            reason: 'No deterministic connector is configured',
            company: source.company_name,
            connector_type: source.connector_type,
            board: source.board,
            metadata: parseJson(source.metadata_json, {}),
          }, false);
        } else if (source.supported) {
          this.db.prepare(`
            UPDATE monitor_sources SET health_state = 'new', next_run_at = ?, updated_at = ?
            WHERE source_id = ? AND health_state = 'agent_required'
          `).run(timestamp, timestamp, source.source_id);
          this.#resolveEscalations(source.source_id, ['connector_discovery'], timestamp);
        }
      }
      this.db.prepare(`
        UPDATE monitor_escalations
        SET status = 'resolved', resolved_at = ?, last_seen_at = ?
        WHERE status = 'open'
          AND source_id IN (SELECT source_id FROM monitor_sources WHERE enabled = 0)
      `).run(timestamp, timestamp);
      this.db.exec('COMMIT');
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
    return normalized.map((source) => this.getSource(source.source_id));
  }

  getSource(sourceId) {
    return hydrateSource(this.db.prepare('SELECT * FROM monitor_sources WHERE source_id = ?').get(sourceId));
  }

  listSources({ enabled, supported, health } = {}) {
    const clauses = [];
    const values = [];
    if (enabled != null) {
      clauses.push('enabled = ?');
      values.push(enabled ? 1 : 0);
    }
    if (supported != null) {
      clauses.push('supported = ?');
      values.push(supported ? 1 : 0);
    }
    if (health) {
      clauses.push('health_state = ?');
      values.push(health);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    return this.db.prepare(`
      SELECT * FROM monitor_sources ${where}
      ORDER BY company_name COLLATE NOCASE, source_id
    `).all(...values).map(hydrateSource);
  }

  listDue({ now = new Date(), all = false, limit = 10_000 } = {}) {
    const timestamp = iso(now);
    const safeLimit = Math.max(0, asInteger(limit, 10_000));
    const dueClause = all ? '1 = 1' : `
      (next_run_at IS NULL OR next_run_at <= ?)
      AND (backoff_until IS NULL OR backoff_until <= ?)
    `;
    const values = all ? [timestamp, safeLimit] : [timestamp, timestamp, timestamp, safeLimit];
    return this.db.prepare(`
      SELECT * FROM monitor_sources
      WHERE enabled = 1
        AND supported = 1
        AND (lease_expires_at IS NULL OR lease_expires_at <= ?)
        AND ${dueClause}
      ORDER BY COALESCE(next_run_at, created_at), company_name COLLATE NOCASE
      LIMIT ?
    `).all(...values).map(hydrateSource);
  }

  claimDueSources({ owner, now = new Date(), all = false, limit = 10_000, leaseSeconds } = {}) {
    if (!owner) throw new Error('A lease owner is required');
    const timestamp = iso(now);
    const expiresAt = addSeconds(timestamp, leaseSeconds ?? this.policy.leaseSeconds);
    let due;
    this.db.exec('BEGIN IMMEDIATE');
    try {
      due = this.listDue({ now: timestamp, all, limit });
      const claim = this.db.prepare(`
        UPDATE monitor_sources
        SET lease_owner = ?, lease_expires_at = ?, updated_at = ?
        WHERE source_id = ? AND (lease_expires_at IS NULL OR lease_expires_at <= ?)
      `);
      due = due.filter((source) => (
        claim.run(owner, expiresAt, timestamp, source.source_id, timestamp).changes === 1
      ));
      this.db.exec('COMMIT');
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
    return due.map((source) => ({ ...source, lease_owner: owner, lease_expires_at: expiresAt }));
  }

  releaseLease(sourceId, owner = null, now = new Date()) {
    const timestamp = iso(now);
    const result = owner
      ? this.db.prepare(`
        UPDATE monitor_sources
        SET lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
        WHERE source_id = ? AND lease_owner = ?
      `).run(timestamp, sourceId, owner)
      : this.db.prepare(`
        UPDATE monitor_sources
        SET lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
        WHERE source_id = ?
      `).run(timestamp, sourceId);
    return result.changes === 1;
  }

  recordResult(sourceId, result, options = {}) {
    const startedAt = iso(options.startedAt ?? result.started_at ?? new Date());
    const completedAt = iso(options.completedAt ?? result.completed_at ?? new Date());
    const runId = String(options.runId ?? result.run_id ?? `${startedAt}:${sourceId}`);
    const rawStatus = String(result.status ?? 'error').toLowerCase();
    const jobs = asInteger(result.jobs);
    const relevant = asInteger(result.relevant);
    const durationMs = result.duration_ms == null ? null : asInteger(result.duration_ms);
    const error = result.error ? String(result.error) : null;
    const policy = policyWith({ ...this.policy, ...options.policy });
    let outcome;
    let evidence = null;

    this.db.exec('BEGIN IMMEDIATE');
    try {
      const existing = this.db.prepare(`
        SELECT * FROM source_runs WHERE run_id = ? AND source_id = ?
      `).get(runId, sourceId);
      if (existing) {
        this.db.exec('COMMIT');
        return { source: this.getSource(sourceId), run: hydrateRun(existing), idempotent: true };
      }

      const source = this.getSource(sourceId);
      if (!source) throw new Error(`Unknown monitor source: ${sourceId}`);
      const suppliedOwner = options.leaseOwner ?? null;
      if (source.lease_owner !== suppliedOwner && (source.lease_owner || suppliedOwner)) {
        throw new Error(`Source ${sourceId} is leased by another monitor or the supplied lease is stale`);
      }
      const scannerIntegrityIssue = (
        ['ok', 'partial', 'suspicious'].includes(rawStatus)
        && (rawStatus !== 'ok' || result.authoritative === false)
      ) ? {
          type: rawStatus === 'partial' ? 'partial_scan' : 'scanner_suspicious',
          severity: rawStatus === 'suspicious' ? 'high' : 'medium',
          previous_jobs: source.last_job_count,
          current_jobs: jobs,
          fetch_status: result.fetch_status ?? null,
          authoritative: result.authoritative ?? false,
        } : null;
      const lifecycleMode = String(
        result.lifecycle_mode ?? source.metadata?.lifecycle_mode ?? 'authoritative',
      ).toLowerCase();
      const anomaly = scannerIntegrityIssue ?? (rawStatus === 'ok'
        ? detectCountAnomaly(source.last_job_count, jobs, policy)
        : null);
      const runEvidence = {
        authoritative: result.authoritative ?? null,
        fetch_status: result.fetch_status ?? null,
        advertised_total: result.advertised_total ?? null,
        complete: result.complete ?? null,
        drop_ratio: result.drop_ratio ?? null,
        snapshot_count: Array.isArray(result.snapshots) ? result.snapshots.length : 0,
        snapshot_manifest: options.snapshotManifest ?? result.snapshot_manifest ?? null,
        diagnostics: result.diagnostics ?? null,
        lifecycle_mode: lifecycleMode,
      };
      if ((rawStatus === 'ok' || rawStatus === 'partial' || rawStatus === 'suspicious') && anomaly) {
        outcome = 'suspicious';
        const anomalyCount = source.consecutive_anomalies + 1;
        evidence = {
          ...runEvidence,
          ...anomaly,
          run_id: runId,
          source_id: sourceId,
          company: source.company_name,
          observed_at: completedAt,
          baseline_accepted: false,
          raw_status: rawStatus,
          fetch_status: result.fetch_status ?? anomaly.fetch_status ?? null,
          authoritative: result.authoritative ?? anomaly.authoritative ?? null,
          scanner_error: error,
          retry_at: addSeconds(completedAt, policy.anomalyRetrySeconds),
        };
        this.db.prepare(`
          UPDATE monitor_sources SET
            health_state = 'suspicious',
            consecutive_anomalies = ?,
            last_attempt_at = ?,
            last_error = ?,
            next_run_at = ?,
            backoff_until = ?,
            lease_owner = NULL,
            lease_expires_at = NULL,
            updated_at = ?
          WHERE source_id = ?
        `).run(
          anomalyCount,
          completedAt,
          `Suspicious job count: ${anomaly.type}`,
          evidence.retry_at,
          evidence.retry_at,
          completedAt,
          sourceId,
        );
        if (anomalyCount >= policy.anomalyEscalationThreshold) {
          const escalationKind = ['partial_scan', 'scanner_suspicious'].includes(anomaly.type)
            ? 'source_integrity'
            : 'job_count_anomaly';
          this.#upsertEscalation(sourceId, escalationKind, anomaly.severity, completedAt, {
            ...evidence,
            consecutive_anomalies: anomalyCount,
            threshold: policy.anomalyEscalationThreshold,
          });
        }
      } else if (rawStatus === 'ok') {
        outcome = 'healthy';
        evidence = runEvidence;
        const nextRunAt = addSeconds(completedAt, source.cadence_seconds);
        this.db.prepare(`
          UPDATE monitor_sources SET
            health_state = 'healthy',
            consecutive_failures = 0,
            consecutive_anomalies = 0,
            last_attempt_at = ?,
            last_success_at = ?,
            last_job_count = ?,
            last_relevant_count = ?,
            last_error = NULL,
            next_run_at = ?,
            backoff_until = NULL,
            lease_owner = NULL,
            lease_expires_at = NULL,
            updated_at = ?
          WHERE source_id = ?
        `).run(completedAt, completedAt, jobs, relevant, nextRunAt, completedAt, sourceId);
        this.#resolveEscalations(
          sourceId,
          ['source_failures', 'job_count_anomaly', 'source_integrity'],
          completedAt,
        );
      } else if (rawStatus === 'unsupported') {
        outcome = 'agent_required';
        evidence = {
          ...runEvidence,
          run_id: runId,
          source_id: sourceId,
          company: source.company_name,
          reason: error ?? 'The scanner reported this source as unsupported',
          observed_at: completedAt,
        };
        this.db.prepare(`
          UPDATE monitor_sources SET
            supported = 0,
            health_state = 'agent_required',
            last_attempt_at = ?,
            last_error = ?,
            next_run_at = NULL,
            backoff_until = NULL,
            lease_owner = NULL,
            lease_expires_at = NULL,
            updated_at = ?
          WHERE source_id = ?
        `).run(completedAt, evidence.reason, completedAt, sourceId);
        this.#upsertEscalation(sourceId, 'connector_discovery', 'medium', completedAt, evidence);
      } else {
        outcome = 'error';
        const failureCount = source.consecutive_failures + 1;
        const backoffSeconds = computeBackoffSeconds(failureCount, policy);
        const retryAt = addSeconds(completedAt, backoffSeconds);
        evidence = {
          ...runEvidence,
          run_id: runId,
          source_id: sourceId,
          company: source.company_name,
          connector_type: source.connector_type,
          board: source.board,
          error: error ?? `Scanner status: ${rawStatus}`,
          observed_at: completedAt,
          retry_at: retryAt,
          backoff_seconds: backoffSeconds,
          consecutive_failures: failureCount,
          threshold: policy.failureEscalationThreshold,
        };
        this.db.prepare(`
          UPDATE monitor_sources SET
            health_state = ?,
            consecutive_failures = ?,
            last_attempt_at = ?,
            last_error = ?,
            next_run_at = ?,
            backoff_until = ?,
            lease_owner = NULL,
            lease_expires_at = NULL,
            updated_at = ?
          WHERE source_id = ?
        `).run(
          failureCount >= policy.failureEscalationThreshold ? 'failing' : 'degraded',
          failureCount,
          completedAt,
          evidence.error,
          retryAt,
          retryAt,
          completedAt,
          sourceId,
        );
        if (failureCount >= policy.failureEscalationThreshold) {
          this.#upsertEscalation(sourceId, 'source_failures', 'high', completedAt, evidence);
        }
      }

      const run = this.db.prepare(`
        INSERT INTO source_runs (
          run_id, source_id, started_at, completed_at, raw_status, outcome,
          jobs, relevant, duration_ms, error, anomaly_type, evidence_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *
      `).get(
        runId,
        sourceId,
        startedAt,
        completedAt,
        rawStatus,
        outcome,
        jobs,
        relevant,
        durationMs,
        error,
        anomaly?.type ?? null,
        evidence ? JSON.stringify(evidence) : null,
      );
      this.db.exec('COMMIT');
      return { source: this.getSource(sourceId), run: hydrateRun(run), idempotent: false };
    } catch (recordError) {
      this.db.exec('ROLLBACK');
      throw recordError;
    }
  }

  #upsertEscalation(sourceId, kind, severity, timestamp, evidence, increment = true) {
    const active = this.db.prepare(`
      SELECT id FROM monitor_escalations
      WHERE source_id = ? AND kind = ? AND status = 'open'
    `).get(sourceId, kind);
    if (active) {
      this.db.prepare(`
        UPDATE monitor_escalations SET
          severity = ?, occurrences = occurrences + ?, last_seen_at = ?, evidence_json = ?
        WHERE id = ?
      `).run(severity, increment ? 1 : 0, timestamp, JSON.stringify(evidence), active.id);
      return active.id;
    }
    return this.db.prepare(`
      INSERT INTO monitor_escalations (
        source_id, kind, severity, status, occurrences,
        first_seen_at, last_seen_at, evidence_json
      ) VALUES (?, ?, ?, 'open', 1, ?, ?, ?)
      RETURNING id
    `).get(sourceId, kind, severity, timestamp, timestamp, JSON.stringify(evidence)).id;
  }

  #resolveEscalations(sourceId, kinds, timestamp) {
    if (!kinds.length) return;
    const placeholders = kinds.map(() => '?').join(', ');
    this.db.prepare(`
      UPDATE monitor_escalations
      SET status = 'resolved', resolved_at = ?, last_seen_at = ?
      WHERE source_id = ? AND status = 'open' AND kind IN (${placeholders})
    `).run(timestamp, timestamp, sourceId, ...kinds);
  }

  listRuns({ sourceId, limit = 100 } = {}) {
    const safeLimit = Math.max(0, asInteger(limit, 100));
    const rows = sourceId
      ? this.db.prepare(`
        SELECT * FROM source_runs WHERE source_id = ?
        ORDER BY completed_at DESC, id DESC LIMIT ?
      `).all(sourceId, safeLimit)
      : this.db.prepare(`
        SELECT * FROM source_runs ORDER BY completed_at DESC, id DESC LIMIT ?
      `).all(safeLimit);
    return rows.map(hydrateRun);
  }

  listEscalations({ status = 'open', limit = 1_000 } = {}) {
    const safeLimit = Math.max(0, asInteger(limit, 1_000));
    const rows = this.db.prepare(`
      SELECT
        escalation.*,
        source.company_name,
        source.connector_type,
        source.board,
        source.health_state,
        source.last_job_count,
        source.last_success_at,
        source.last_attempt_at,
        source.last_error
      FROM monitor_escalations escalation
      JOIN monitor_sources source ON source.source_id = escalation.source_id
      WHERE (? IS NULL OR escalation.status = ?)
      ORDER BY
        CASE escalation.severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
        escalation.last_seen_at DESC
      LIMIT ?
    `).all(status, status, safeLimit);
    return rows.map((row) => ({
      ...hydrateEscalation(row),
      recent_runs: this.listRuns({ sourceId: row.source_id, limit: 5 }),
    }));
  }

  async exportEscalations(path, options = {}) {
    const records = this.listEscalations(options).map((escalation) => ({
      schema_version: 1,
      escalation_id: escalation.id,
      status: escalation.status,
      severity: escalation.severity,
      kind: escalation.kind,
      source: {
        id: escalation.source_id,
        company: escalation.company_name,
        connector_type: escalation.connector_type,
        board: escalation.board,
        health_state: escalation.health_state,
      },
      occurrences: escalation.occurrences,
      first_seen_at: escalation.first_seen_at,
      last_seen_at: escalation.last_seen_at,
      evidence: escalation.evidence,
      recent_runs: escalation.recent_runs,
      agent_contract: {
        objective: 'Diagnose the source and return deterministic connector evidence or a repair recipe',
        allowed_outputs: ['connector configuration', 'endpoint evidence', 'schema-drift diagnosis', 'extraction recipe'],
        prohibited_outputs: ['canonical job writes', 'job closure decisions'],
      },
    }));
    const contents = records.map((record) => JSON.stringify(record)).join('\n') + (records.length ? '\n' : '');
    await mkdir(dirname(path), { recursive: true });
    const temporary = `${path}.${process.pid}.tmp`;
    await writeFile(temporary, contents, 'utf8');
    await rename(temporary, path);
    return records;
  }

  status(now = new Date()) {
    const timestamp = iso(now);
    const sources = this.listSources({ enabled: true });
    const health = {};
    for (const source of sources) health[source.health_state] = (health[source.health_state] ?? 0) + 1;
    return {
      generated_at: timestamp,
      sources: sources.length,
      supported_sources: sources.filter((source) => source.supported).length,
      agent_required_sources: sources.filter((source) => !source.supported).length,
      due_sources: this.listDue({ now: timestamp }).length,
      leased_sources: sources.filter((source) => source.lease_expires_at > timestamp).length,
      open_escalations: this.listEscalations({ status: 'open' }).length,
      health,
    };
  }
}
