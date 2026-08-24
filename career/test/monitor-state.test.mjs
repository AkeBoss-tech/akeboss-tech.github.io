import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  computeBackoffSeconds,
  detectCountAnomaly,
  MonitorState,
} from '../scanner/state.mjs';
import { loadFreshSummary, mergeCompanies, toRegistrySources } from '../monitor-jobs.mjs';
import { renderPlist } from '../scripts/install-monitor-launchd.mjs';

function structured(company, board, options = {}) {
  return {
    company,
    ats: 'greenhouse',
    board,
    cadence_seconds: options.cadenceSeconds ?? 3_600,
    enabled: options.enabled ?? true,
  };
}

function record(state, sourceId, runId, completedAt, result, options = {}) {
  return state.recordResult(sourceId, result, {
    runId,
    startedAt: new Date(new Date(completedAt).getTime() - 10_000),
    completedAt,
    ...options,
  });
}

test('healthy, degraded, failing, and recovered source states are durable', () => {
  const state = new MonitorState(':memory:');
  try {
    state.syncSources([structured('Example', 'example')], '2026-01-01T00:00:00Z');
    record(state, 'greenhouse:example', 'baseline', '2026-01-01T00:01:00Z', {
      status: 'ok', jobs: 100, relevant: 12,
    });
    assert.equal(state.getSource('greenhouse:example').health_state, 'healthy');

    const first = record(state, 'greenhouse:example', 'failure-1', '2026-01-01T01:00:00Z', {
      status: 'error', error: 'HTTP 503', authoritative: false,
    });
    assert.equal(first.source.health_state, 'degraded');
    assert.equal(first.source.consecutive_failures, 1);
    assert.equal(first.source.backoff_until, '2026-01-01T01:15:00.000Z');
    assert.equal(first.run.anomaly_type, null);
    assert.equal(state.listEscalations().length, 0);

    record(state, 'greenhouse:example', 'failure-2', '2026-01-01T02:00:00Z', {
      status: 'error', error: 'HTTP 503',
    });
    const third = record(state, 'greenhouse:example', 'failure-3', '2026-01-01T03:00:00Z', {
      status: 'error', error: 'HTTP 503',
    });
    assert.equal(third.source.health_state, 'failing');
    assert.equal(third.source.backoff_until, '2026-01-01T04:00:00.000Z');
    assert.equal(state.listEscalations()[0].kind, 'source_failures');
    assert.equal(state.listEscalations()[0].evidence.consecutive_failures, 3);

    const recovery = record(state, 'greenhouse:example', 'recovery', '2026-01-01T05:00:00Z', {
      status: 'ok', jobs: 102, relevant: 13,
    });
    assert.equal(recovery.source.health_state, 'healthy');
    assert.equal(recovery.source.consecutive_failures, 0);
    assert.equal(recovery.source.backoff_until, null);
    assert.equal(state.listEscalations().length, 0);
    assert.equal(state.listEscalations({ status: 'resolved' })[0].kind, 'source_failures');
  } finally {
    state.close();
  }
});

test('zero and large-drop runs are suspicious and do not replace the accepted baseline', () => {
  const state = new MonitorState(':memory:');
  try {
    state.syncSources([structured('Volatile', 'volatile')], '2026-01-01T00:00:00Z');
    record(state, 'greenhouse:volatile', 'baseline', '2026-01-01T00:01:00Z', {
      status: 'ok', jobs: 100, relevant: 20,
    });

    const drop = record(state, 'greenhouse:volatile', 'drop', '2026-01-01T01:00:00Z', {
      status: 'ok', jobs: 40, relevant: 8,
    });
    assert.equal(drop.run.outcome, 'suspicious');
    assert.equal(drop.run.anomaly_type, 'large_drop');
    assert.equal(drop.source.last_job_count, 100);
    assert.equal(drop.source.consecutive_anomalies, 1);
    assert.equal(drop.source.next_run_at, '2026-01-01T01:30:00.000Z');
    assert.equal(state.listEscalations().length, 0);

    const zero = record(state, 'greenhouse:volatile', 'zero', '2026-01-01T02:00:00Z', {
      status: 'ok', jobs: 0, relevant: 0,
    });
    assert.equal(zero.run.anomaly_type, 'zero_jobs');
    assert.equal(zero.source.last_job_count, 100);
    const escalation = state.listEscalations()[0];
    assert.equal(escalation.kind, 'job_count_anomaly');
    assert.equal(escalation.evidence.previous_jobs, 100);
    assert.equal(escalation.evidence.current_jobs, 0);
    assert.equal(escalation.evidence.baseline_accepted, false);
    assert.equal(escalation.recent_runs.length, 3);
  } finally {
    state.close();
  }
});

test('scanner partial and suspicious states remain non-authoritative and escalate with fetch evidence', () => {
  const state = new MonitorState(':memory:');
  try {
    state.syncSources([structured('Integrity', 'integrity')], '2026-01-01T00:00:00Z');
    record(state, 'greenhouse:integrity', 'baseline', '2026-01-01T00:01:00Z', {
      status: 'ok', jobs: 80, relevant: 10, authoritative: true, fetch_status: 'complete',
    });
    const partial = record(state, 'greenhouse:integrity', 'partial', '2026-01-01T01:00:00Z', {
      status: 'partial',
      jobs: 75,
      relevant: 9,
      authoritative: false,
      fetch_status: 'pagination_incomplete',
      error: 'Page 3 failed',
    });
    assert.equal(partial.run.raw_status, 'partial');
    assert.equal(partial.run.outcome, 'suspicious');
    assert.equal(partial.run.anomaly_type, 'partial_scan');
    assert.equal(partial.source.last_job_count, 80);

    const suspicious = record(state, 'greenhouse:integrity', 'suspicious', '2026-01-01T02:00:00Z', {
      status: 'suspicious',
      jobs: 76,
      relevant: 9,
      authoritative: false,
      fetch_status: 'count_anomaly',
    });
    assert.equal(suspicious.source.health_state, 'suspicious');
    assert.equal(suspicious.source.last_job_count, 80);
    const escalation = state.listEscalations()[0];
    assert.equal(escalation.kind, 'source_integrity');
    assert.equal(escalation.evidence.fetch_status, 'count_anomaly');
    assert.equal(escalation.evidence.authoritative, false);
  } finally {
    state.close();
  }
});

test('alternating partial and error runs still reach the agent escalation queue', () => {
  const state = new MonitorState(':memory:');
  try {
    state.syncSources([structured('Alternating', 'alternating')], '2026-01-01T00:00:00Z');
    record(state, 'greenhouse:alternating', 'baseline', '2026-01-01T00:01:00Z', {
      status: 'ok', jobs: 20, relevant: 2,
    });
    record(state, 'greenhouse:alternating', 'partial-1', '2026-01-01T01:00:00Z', {
      status: 'partial', jobs: 19, relevant: 2, authoritative: false,
    });
    const error = record(state, 'greenhouse:alternating', 'error-1', '2026-01-01T02:00:00Z', {
      status: 'error', error: 'HTTP 503', jobs: 0, relevant: 0,
    });
    assert.equal(error.source.consecutive_anomalies, 1);
    const escalated = record(state, 'greenhouse:alternating', 'partial-2', '2026-01-01T03:00:00Z', {
      status: 'partial', jobs: 18, relevant: 2, authoritative: false,
    });
    assert.equal(escalated.source.consecutive_failures, 1);
    assert.equal(escalated.source.consecutive_anomalies, 2);
    assert.equal(state.listEscalations()[0].kind, 'source_integrity');

    const healthy = record(state, 'greenhouse:alternating', 'healthy', '2026-01-01T04:00:00Z', {
      status: 'ok', jobs: 21, relevant: 2,
    });
    assert.equal(healthy.source.consecutive_failures, 0);
    assert.equal(healthy.source.consecutive_anomalies, 0);
  } finally {
    state.close();
  }
});

test('count anomaly and exponential backoff thresholds are explicit', () => {
  assert.equal(detectCountAnomaly(null, 0), null);
  assert.equal(detectCountAnomaly(1, 0).type, 'zero_jobs');
  assert.equal(detectCountAnomaly(100, 51), null);
  assert.equal(detectCountAnomaly(100, 50).type, 'large_drop');
  assert.equal(detectCountAnomaly(9, 0).type, 'zero_jobs');
  assert.equal(computeBackoffSeconds(1), 900);
  assert.equal(computeBackoffSeconds(2), 1_800);
  assert.equal(computeBackoffSeconds(20), 21_600);
});

test('due scheduling and per-source leases prevent concurrent claims', () => {
  const state = new MonitorState(':memory:');
  try {
    state.syncSources([
      structured('Alpha', 'alpha'),
      structured('Beta', 'beta'),
    ], '2026-01-01T00:00:00Z');

    const alpha = state.claimDueSources({
      owner: 'worker-a',
      now: '2026-01-01T00:00:00Z',
      limit: 1,
      leaseSeconds: 600,
    });
    assert.deepEqual(alpha.map((source) => source.company_name), ['Alpha']);
    assert.equal(state.listDue({ now: '2026-01-01T00:00:01Z' }).length, 1);

    const beta = state.claimDueSources({
      owner: 'worker-b',
      now: '2026-01-01T00:00:01Z',
      limit: 10,
      leaseSeconds: 600,
    });
    assert.deepEqual(beta.map((source) => source.company_name), ['Beta']);
    assert.equal(state.claimDueSources({
      owner: 'worker-c',
      now: '2026-01-01T00:00:02Z',
    }).length, 0);

    assert.throws(() => record(
      state,
      'greenhouse:alpha',
      'wrong-owner',
      '2026-01-01T00:00:03Z',
      { status: 'ok', jobs: 1, relevant: 0 },
      { leaseOwner: 'worker-b' },
    ), /leased by another monitor/);
    assert.equal(state.releaseLease('greenhouse:alpha', 'not-the-owner', '2026-01-01T00:00:03Z'), false);
    assert.equal(state.releaseLease('greenhouse:alpha', 'worker-a', '2026-01-01T00:00:03Z'), true);
    assert.equal(state.claimDueSources({
      owner: 'worker-c',
      now: '2026-01-01T00:00:04Z',
      limit: 1,
    })[0].company_name, 'Alpha');

    assert.equal(state.claimDueSources({
      owner: 'worker-d',
      now: '2026-01-01T00:10:02Z',
      all: true,
      limit: 1,
    })[0].company_name, 'Beta');
  } finally {
    state.close();
  }
});

test('expired lease handoff fences a stale prior owner after the new owner records', () => {
  const state = new MonitorState(':memory:');
  try {
    state.syncSources([structured('Fenced', 'fenced')], '2026-01-01T00:00:00Z');
    assert.equal(state.claimDueSources({
      owner: 'worker-a',
      now: '2026-01-01T00:00:00Z',
      leaseSeconds: 60,
    }).length, 1);
    assert.equal(state.claimDueSources({
      owner: 'worker-b',
      now: '2026-01-01T00:01:01Z',
      leaseSeconds: 60,
    }).length, 1);
    const accepted = record(state, 'greenhouse:fenced', 'worker-b-run', '2026-01-01T00:01:02Z', {
      status: 'ok', jobs: 12, relevant: 2,
    }, { leaseOwner: 'worker-b' });
    assert.equal(accepted.source.health_state, 'healthy');

    assert.throws(() => record(
      state,
      'greenhouse:fenced',
      'stale-worker-a-run',
      '2026-01-01T00:01:03Z',
      { status: 'error', error: 'stale result' },
      { leaseOwner: 'worker-a' },
    ), /supplied lease is stale/);
    assert.equal(state.getSource('greenhouse:fenced').health_state, 'healthy');

    const retry = record(state, 'greenhouse:fenced', 'worker-b-run', '2026-01-01T00:01:04Z', {
      status: 'error', error: 'must remain idempotent',
    }, { leaseOwner: 'worker-b' });
    assert.equal(retry.idempotent, true);
    assert.equal(state.getSource('greenhouse:fenced').health_state, 'healthy');
  } finally {
    state.close();
  }
});

test('a clean run schedules the next due time and ingestion is idempotent', () => {
  const state = new MonitorState(':memory:');
  try {
    state.syncSources([structured('Cadence', 'cadence')], '2026-01-01T00:00:00Z');
    const first = record(state, 'greenhouse:cadence', 'same-run', '2026-01-01T00:05:00Z', {
      status: 'ok', jobs: 12, relevant: 2, advertised_total: 12, complete: true,
      authoritative: true, snapshots: [{}, {}],
    }, { snapshotManifest: '/tmp/raw/manifests/run.json' });
    const duplicate = record(state, 'greenhouse:cadence', 'same-run', '2026-01-01T00:06:00Z', {
      status: 'error', error: 'must be ignored',
    });
    assert.equal(first.idempotent, false);
    assert.equal(first.run.evidence.snapshot_manifest, '/tmp/raw/manifests/run.json');
    assert.equal(first.run.evidence.snapshot_count, 2);
    assert.equal(first.run.evidence.advertised_total, 12);
    assert.equal(duplicate.idempotent, true);
    assert.equal(state.listRuns({ sourceId: 'greenhouse:cadence' }).length, 1);
    assert.equal(state.listDue({ now: '2026-01-01T01:04:59Z' }).length, 0);
    assert.equal(state.listDue({ now: '2026-01-01T01:05:00Z' }).length, 1);
  } finally {
    state.close();
  }
});

test('monitor accepts only the exact run-specific summary and source identities', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'career-monitor-summary-'));
  const path = join(directory, 'run.json');
  const configPath = join(directory, 'portals.yml');
  const catalogPath = join(directory, 'sources.yml');
  const context = {
    startedAt: '2026-01-01T00:00:00.000Z',
    runId: 'expected-run',
    configPath,
    catalogPath,
    claims: [{
      company_name: 'Acme',
      connector_type: 'greenhouse',
      board: 'acme',
    }],
  };
  const summary = {
    run_id: 'expected-run',
    started_at: '2026-01-01T00:00:01.000Z',
    config: configPath,
    catalog: catalogPath,
    sources: [{ company: 'Acme', ats: 'greenhouse', board: 'acme' }],
  };
  try {
    await writeFile(path, JSON.stringify(summary));
    assert.deepEqual(await loadFreshSummary(path, context), summary);
    await writeFile(path, JSON.stringify({ ...summary, run_id: 'different-run' }));
    assert.equal(await loadFreshSummary(path, context), null);
    await writeFile(path, JSON.stringify({
      ...summary,
      sources: [{ company: 'Acme', ats: 'greenhouse', board: 'wrong-board' }],
    }));
    assert.equal(await loadFreshSummary(path, context), null);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('unsupported sources export structured, bounded agent evidence without job-write authority', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'career-monitor-'));
  const databasePath = join(directory, 'monitor.sqlite');
  const exportPath = join(directory, 'agent-escalations.ndjson');
  const state = new MonitorState(databasePath);
  try {
    state.syncSources([{
      company: 'Bespoke Careers',
      ats: 'unsupported',
      board: 'bespoke-careers',
      supported: false,
      metadata: { careers_url: 'https://example.test/careers' },
    }], '2026-01-01T00:00:00Z');
    state.syncSources([{
      company: 'Bespoke Careers',
      ats: 'unsupported',
      board: 'bespoke-careers',
      supported: false,
      metadata: { careers_url: 'https://example.test/careers' },
    }], '2026-01-01T00:05:00Z');
    const exported = await state.exportEscalations(exportPath);
    assert.equal(exported.length, 1);
    assert.equal(exported[0].occurrences, 1);
    assert.equal(exported[0].kind, 'connector_discovery');
    assert.equal(exported[0].source.health_state, 'agent_required');
    assert.deepEqual(exported[0].agent_contract.prohibited_outputs, [
      'canonical job writes',
      'job closure decisions',
    ]);
    const line = JSON.parse((await readFile(exportPath, 'utf8')).trim());
    assert.equal(line.source.company, 'Bespoke Careers');
    assert.equal(line.evidence.metadata.careers_url, 'https://example.test/careers');
  } finally {
    state.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test('inferred but undescribable sources enter the agent-required lane', () => {
  const [source] = toRegistrySources([{
    name: 'Incomplete Recruitee',
    ats: 'recruitee',
    ats_slug: 'incomplete',
  }]);
  assert.equal(source.ats, 'recruitee');
  assert.equal(source.supported, false);

  const state = new MonitorState(':memory:');
  try {
    state.syncSources([source], '2026-01-01T00:00:00Z');
    assert.equal(state.getSource('recruitee:incomplete').health_state, 'agent_required');
    assert.equal(state.listDue({ all: true }).length, 0);
  } finally {
    state.close();
  }
});

test('throwing descriptors and duplicate catalog identities fail safely', () => {
  const [broken] = toRegistrySources([{
    name: 'Broken Teamtailor',
    ats: 'teamtailor',
  }]);
  assert.equal(broken.supported, false);
  assert.match(broken.metadata.descriptor_error, /Source descriptor failed/);

  assert.throws(() => toRegistrySources([
    { name: 'One', ats: 'greenhouse', ats_slug: 'same' },
    { name: 'Two', ats: 'greenhouse', ats_slug: 'same' },
  ]), /Duplicate source identity/);
  assert.throws(() => mergeCompanies([
    { name: 'Duplicate', ats: 'greenhouse', ats_slug: 'one' },
    { name: ' duplicate ', ats: 'greenhouse', ats_slug: 'two' },
  ]), /Duplicate company name/);
});

test('LaunchAgent generation wakes the monitor without granting pipeline writes by default', () => {
  const plist = renderPlist({
    label: 'test.career-monitor',
    intervalSeconds: 900,
    nodePath: '/opt/node&runtime/bin/node',
    careerDir: '/tmp/Career & Ops',
  });
  assert.match(plist, /<string>test\.career-monitor<\/string>/);
  assert.match(plist, /<integer>900<\/integer>/);
  assert.match(plist, /\/opt\/node&amp;runtime\/bin\/node/);
  assert.match(plist, /\/tmp\/Career &amp; Ops\/monitor-jobs\.mjs/);
  assert.doesNotMatch(plist, /--write-pipeline/);
});
