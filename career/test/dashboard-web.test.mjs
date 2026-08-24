import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat, utimes, writeFile } from 'node:fs/promises';
import http from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { buildDashboardData, createDashboardStore } from '../dashboard-web/data.mjs';
import { startDashboardServer } from '../dashboard-web/server.mjs';

const FIXED_NOW = new Date('2026-08-20T10:00:00.000Z');

function fixtureJob({
  id,
  title,
  company,
  firstSeenAt,
  workplace = 'remote',
  tracks = ['software'],
  url = `https://jobs.example.test/${id}`,
} = {}) {
  return {
    schema_version: 1,
    job_key: `greenhouse:example:${id}`,
    source: { type: 'greenhouse', board: 'example', job_id: id },
    company: { name: company, slug: company.toLowerCase().replaceAll(' ', '-') },
    title,
    canonical_url: url,
    apply_url: `${url}/apply`,
    locations: [{ label: 'New York, NY', city: 'New York', region: 'NY', country: 'US' }],
    workplace_type: workplace,
    employment_type: 'full_time',
    first_published_at: '2026-08-19T12:00:00.000Z',
    compensation: [{ summary: '$100,000-$120,000' }],
    description_plain: 'PRIVATE FULL DESCRIPTION MUST NOT REACH THE BROWSER',
    classification: { included: true, tier: 'target', score: 12, level: 'early_career', tracks },
    first_seen_at: firstSeenAt,
    last_seen_at: '2026-08-20T09:30:00.000Z',
    status: 'open',
  };
}

function createMonitorDatabase(filePath) {
  const database = new DatabaseSync(filePath);
  database.exec(`
    CREATE TABLE monitor_sources (
      source_id TEXT PRIMARY KEY, company_name TEXT NOT NULL, connector_type TEXT NOT NULL,
      board TEXT NOT NULL, supported INTEGER NOT NULL, enabled INTEGER NOT NULL,
      health_state TEXT NOT NULL, last_attempt_at TEXT, last_success_at TEXT,
      last_job_count INTEGER, last_relevant_count INTEGER, last_error TEXT,
      next_run_at TEXT, backoff_until TEXT, lease_owner TEXT, lease_expires_at TEXT
    );
    CREATE TABLE monitor_escalations (
      id INTEGER PRIMARY KEY AUTOINCREMENT, source_id TEXT NOT NULL, kind TEXT NOT NULL,
      severity TEXT NOT NULL, status TEXT NOT NULL, occurrences INTEGER NOT NULL,
      first_seen_at TEXT NOT NULL, last_seen_at TEXT NOT NULL, resolved_at TEXT,
      evidence_json TEXT NOT NULL
    );
    CREATE TABLE source_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT, run_id TEXT NOT NULL, source_id TEXT NOT NULL,
      started_at TEXT NOT NULL, completed_at TEXT NOT NULL, raw_status TEXT NOT NULL,
      outcome TEXT NOT NULL, jobs INTEGER NOT NULL, relevant INTEGER NOT NULL,
      duration_ms INTEGER, error TEXT, anomaly_type TEXT, evidence_json TEXT
    );
  `);
  database.prepare(`
    INSERT INTO monitor_sources VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'greenhouse:example', 'Example Labs', 'greenhouse', 'example', 1, 1, 'healthy',
    '2026-08-20T09:30:00.000Z', '2026-08-20T09:30:00.000Z', 12, 2, null,
    '2026-08-20T09:00:00.000Z', null, 'monitor-1', '2026-08-21T11:00:00.000Z',
    'custom:complex', 'Complex Corp', 'custom', 'complex', 0, 1, 'agent_required',
    null, null, 0, 0, 'No deterministic connector', null, null, null, null,
  );
  database.prepare(`
    INSERT INTO monitor_escalations
      (source_id, kind, severity, status, occurrences, first_seen_at, last_seen_at, evidence_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'custom:complex', 'unsupported_source', 'agent_required', 'open', 1,
    '2026-08-20T08:00:00.000Z', '2026-08-20T09:00:00.000Z',
    JSON.stringify({ reason: 'Needs a guided extraction pass' }),
  );
  database.prepare(`
    INSERT INTO source_runs
      (run_id, source_id, started_at, completed_at, raw_status, outcome, jobs, relevant, duration_ms, error, anomaly_type, evidence_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'run-1', 'greenhouse:example', '2026-08-20T09:29:00.000Z', '2026-08-20T09:30:00.000Z',
    'ok', 'healthy', 12, 2, 60_000, null, null, '{}',
  );
  database.close();
}

async function createFixture() {
  const dataDir = await mkdtemp(path.join(tmpdir(), 'career-dashboard-'));
  const jobs = [
    fixtureJob({
      id: 'new-role',
      title: 'Robotics Engineer',
      company: 'Example Labs',
      firstSeenAt: '2026-08-20T09:00:30.000Z',
      tracks: ['robotics', 'software'],
    }),
    fixtureJob({
      id: 'older-role',
      title: 'ML Engineer',
      company: 'Other AI',
      firstSeenAt: '2026-08-18T09:00:00.000Z',
      workplace: 'hybrid',
      tracks: ['ai-ml'],
      url: 'http://insecure.example.test/older-role',
    }),
  ];
  const summary = {
    schema_version: 1,
    run_id: 'scan-1',
    started_at: '2026-08-20T09:00:00.000Z',
    completed_at: '2026-08-20T09:01:00.000Z',
    stored_open_jobs: 12,
    relevant_open_jobs: 2,
    new_relevant_jobs: 1,
  };
  const relevantPath = path.join(dataDir, 'relevant-jobs.ndjson');
  await writeFile(relevantPath, `${jobs.map(JSON.stringify).join('\n')}\n`);
  await utimes(relevantPath, FIXED_NOW, FIXED_NOW);
  await writeFile(path.join(dataDir, 'scan-summary.json'), `${JSON.stringify(summary)}\n`);
  createMonitorDatabase(path.join(dataDir, 'monitor.sqlite'));
  return { dataDir, jobs, summary };
}

test('dashboard projection reconciles canonical metrics without exposing descriptions', async (t) => {
  const fixture = await createFixture();
  t.after(() => rm(fixture.dataDir, { recursive: true, force: true }));

  const dashboard = await buildDashboardData({ dataDir: fixture.dataDir, now: () => FIXED_NOW });

  assert.equal(dashboard.kpis.openJobs, 12);
  assert.equal(dashboard.kpis.relevantOpenJobs, 2);
  assert.equal(dashboard.kpis.newRelevantThisScan, 1);
  assert.equal(dashboard.kpis.deterministicSources, 1);
  assert.equal(dashboard.kpis.healthySources, 1);
  assert.equal(dashboard.kpis.agentRequiredSources, 1);
  assert.equal(dashboard.roles.length, 2);
  assert.equal(dashboard.roles.filter((role) => role.isNewThisScan).length, 1);
  assert.equal(dashboard.roles[0].id, 'greenhouse:example:new-role');
  assert.equal(dashboard.roles[1].canonicalUrl, null, 'insecure links are removed from the browser projection');
  assert.equal(JSON.stringify(dashboard).includes('PRIVATE FULL DESCRIPTION'), false);
  assert.deepEqual(dashboard.sources.map((source) => source.health), ['healthy', 'agent_required']);
  assert.equal(dashboard.escalations[0].company, 'Complex Corp');
  assert.equal(dashboard.recentRuns[0].runId, 'run-1');
  assert.equal(dashboard.meta.newMembershipExact, true);
  assert.equal(dashboard.meta.newThisScanRoleMembershipAvailable, true);
});

test('dashboard store reuses unchanged projections and invalidates when source data changes', async (t) => {
  const fixture = await createFixture();
  t.after(() => rm(fixture.dataDir, { recursive: true, force: true }));
  let currentTime = FIXED_NOW;
  const store = createDashboardStore({ dataDir: fixture.dataDir, now: () => currentTime });

  const first = await store.getDashboardData();
  const cached = await store.getDashboardData();
  assert.equal(cached.roles, first.roles, 'unchanged source data reuses the parsed role projection');
  assert.equal(cached.meta.dataVersion, first.meta.dataVersion);
  assert.equal(cached.sources[0].leased, true);
  assert.equal(cached.sources[0].due, false);

  currentTime = new Date(FIXED_NOW.getTime() + (26 * 60 * 60 * 1_000));
  const timeRefreshed = await store.getDashboardData();
  assert.equal(timeRefreshed.roles, first.roles);
  assert.equal(timeRefreshed.freshness.status, 'stale');
  assert.equal(timeRefreshed.kpis.dueSources, 1);
  assert.equal(timeRefreshed.sources[0].leased, false);
  assert.equal(timeRefreshed.kpis.newRelevant24h, 0);
  assert.equal(timeRefreshed.kpis.newRelevantThisScan, 1, 'latest-scan membership remains an exact historical fact');

  const relevantPath = path.join(fixture.dataDir, 'relevant-jobs.ndjson');
  const prior = await stat(relevantPath);
  const third = fixtureJob({
    id: 'third-role',
    title: 'Data Engineer',
    company: 'Example Labs',
    firstSeenAt: '2026-08-17T09:00:00.000Z',
    tracks: ['data'],
  });
  await writeFile(relevantPath, `${fixture.jobs.concat(third).map(JSON.stringify).join('\n')}\n`);
  await utimes(relevantPath, prior.atime, new Date(prior.mtimeMs + 5_000));

  const rebuilt = await store.getDashboardData();
  assert.notEqual(rebuilt.roles, first.roles);
  assert.equal(rebuilt.roles.length, 3);
});

test('latest-scan KPI remains authoritative when per-role membership cannot be reconstructed', async (t) => {
  const fixture = await createFixture();
  t.after(() => rm(fixture.dataDir, { recursive: true, force: true }));
  await writeFile(
    path.join(fixture.dataDir, 'scan-summary.json'),
    `${JSON.stringify({ ...fixture.summary, new_relevant_jobs: 2 })}\n`,
  );

  const dashboard = await buildDashboardData({ dataDir: fixture.dataDir, now: () => FIXED_NOW });
  assert.equal(dashboard.kpis.newRelevantThisScan, 2);
  assert.equal(dashboard.meta.newThisScanRoleMembershipAvailable, false);
  assert.equal(dashboard.roles.some((role) => Object.hasOwn(role, 'isNewThisScan')), false);
});

test('localhost dashboard server allowlists routes and applies privacy headers', async (t) => {
  const fixture = await createFixture();
  t.after(() => rm(fixture.dataDir, { recursive: true, force: true }));
  const store = createDashboardStore({ dataDir: fixture.dataDir, now: () => FIXED_NOW });
  const { server, url } = await startDashboardServer({ port: 0, store, log: { log() {}, error() {} } });
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const dashboardResponse = await fetch(`${url}/api/dashboard`);
  assert.equal(dashboardResponse.status, 200);
  assert.equal(dashboardResponse.headers.get('cache-control'), 'no-store');
  assert.match(dashboardResponse.headers.get('content-security-policy'), /default-src 'self'/);
  assert.equal(dashboardResponse.headers.get('x-frame-options'), 'DENY');
  const dashboard = await dashboardResponse.json();
  assert.equal(dashboard.roles.length, 2);

  const healthResponse = await fetch(`${url}/api/health`);
  const health = await healthResponse.json();
  assert.equal(healthResponse.status, 200);
  assert.equal(health.dataVersion, dashboard.meta.dataVersion);
  assert.equal(health.kpis.openJobs, 12);
  assert.equal(JSON.stringify(health).includes('Robotics Engineer'), false);

  const staticResponse = await fetch(`${url}/app.js`);
  assert.equal(staticResponse.status, 200);
  assert.match(staticResponse.headers.get('content-type'), /text\/javascript/);
  assert.match(await staticResponse.text(), /REFRESH_INTERVAL_MS = 30_000/);

  const missingResponse = await fetch(`${url}/package.json`);
  assert.equal(missingResponse.status, 404);
  const rebindingStatus = await new Promise((resolve, reject) => {
    const target = new URL(url);
    const request = http.get({
      hostname: target.hostname,
      port: target.port,
      path: '/api/dashboard',
      headers: { Host: 'attacker.example' },
    }, (response) => {
      response.resume();
      response.once('end', () => resolve(response.statusCode));
    });
    request.once('error', reject);
  });
  assert.equal(rebindingStatus, 421);
  const mutationResponse = await fetch(`${url}/api/dashboard`, { method: 'POST' });
  assert.equal(mutationResponse.status, 405);
  assert.equal(mutationResponse.headers.get('allow'), 'GET, HEAD');
});

test('server refuses a non-local bind address', async () => {
  await assert.rejects(
    startDashboardServer({ host: '0.0.0.0', port: 0, log: { log() {}, error() {} } }),
    /only supports a localhost bind address/,
  );
});

test('frontend DOM bindings and latest-scan contract stay aligned', async () => {
  const publicDir = path.resolve(import.meta.dirname, '..', 'dashboard-web', 'public');
  const [html, app] = await Promise.all([
    readFile(path.join(publicDir, 'index.html'), 'utf8'),
    readFile(path.join(publicDir, 'app.js'), 'utf8'),
  ]);
  const bindingBlock = app.match(/Object\.fromEntries\(\[([\s\S]*?)\]\.map/);
  assert.ok(bindingBlock, 'frontend element binding list is discoverable');
  const ids = [...bindingBlock[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
  assert.ok(ids.length > 40);
  for (const id of ids) assert.match(html, new RegExp(`id=["']${id}["']`), `missing #${id}`);
  assert.match(app, /meta\.newThisScanRoleMembershipAvailable/);
  assert.match(app, /fetch\('\/api\/health'/);
  assert.doesNotMatch(app, /\.innerHTML\s*=|insertAdjacentHTML|document\.write/);
});
