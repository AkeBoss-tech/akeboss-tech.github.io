import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyAuthoritativeOmission,
  assessSourceResult,
  quarantineUnverifiedClosure,
  resetSeenLifecycle,
  sourceIdentity,
  validateLifecycleOptions,
} from '../scanner/lifecycle.mjs';

test('source results must be complete and plausible to be authoritative', () => {
  assert.equal(assessSourceResult({ status: 'ok', jobs: [{}, {}] }, 2).authoritative, true);
  assert.deepEqual(
    assessSourceResult({ status: 'ok', jobs: [{}], advertised_total: 2 }, 2),
    {
      state: 'partial',
      authoritative: false,
      previous_open_jobs: 2,
      current_open_jobs: 1,
      advertised_total: 2,
      drop_ratio: 0.5,
      reason: 'Fetched 1 of 2 advertised jobs',
    },
  );
  assert.equal(assessSourceResult({ status: 'ok', jobs: [] }, 100).state, 'suspicious');
  assert.equal(assessSourceResult({ status: 'error', jobs: [], error: 'timeout' }, 100).state, 'error');
});

test('large drop guard is configurable and does not punish small boards', () => {
  assert.equal(assessSourceResult({ status: 'ok', jobs: [{}] }, 3).state, 'ok');
  assert.equal(assessSourceResult(
    { status: 'ok', jobs: Array.from({ length: 4 }) },
    10,
    { suspicious_drop_ratio: 0.5 },
  ).state, 'suspicious');
  assert.equal(assessSourceResult(
    { status: 'ok', jobs: Array.from({ length: 45 }) },
    100,
  ).state, 'suspicious');
  assert.equal(assessSourceResult(
    { status: 'ok', jobs: [] },
    100,
    { allow_large_drop: true },
  ).state, 'ok');
});

test('unsafe lifecycle thresholds fail configuration validation', () => {
  assert.throws(
    () => validateLifecycleOptions({ suspicious_drop_ratio: 1.1 }),
    /at most 0.5/,
  );
  assert.throws(
    () => validateLifecycleOptions({ minimum_previous_jobs_for_drop_guard: 0 }),
    /positive integer/,
  );
  assert.throws(
    () => validateLifecycleOptions({ close_confirmation_hours: -1 }),
    /nonnegative/,
  );
  assert.throws(
    () => validateLifecycleOptions({ suspicious_drop_ratio: 'not-a-number' }),
    /finite number/,
  );
});

test('two complete omissions separated by the minimum interval close a job', () => {
  const open = { job_key: 'greenhouse:a:1', status: 'open', closed_at: null };
  const first = applyAuthoritativeOmission(open, '2026-08-20T00:00:00.000Z');
  assert.equal(first.status, 'possibly_closed');
  assert.equal(first.missing_complete_scans, 1);

  const tooSoon = applyAuthoritativeOmission(first, '2026-08-20T05:59:59.000Z');
  assert.equal(tooSoon.status, 'possibly_closed');
  assert.equal(tooSoon.missing_complete_scans, 1);

  const closed = applyAuthoritativeOmission(tooSoon, '2026-08-20T06:00:00.000Z');
  assert.equal(closed.status, 'closed');
  assert.equal(closed.missing_complete_scans, 2);
  assert.equal(closed.closed_at, '2026-08-20T06:00:00.000Z');
});

test('legacy closures without confirmation evidence are conservatively quarantined', () => {
  const migrationTime = '2026-08-20T12:00:00.000Z';
  const legacy = quarantineUnverifiedClosure({
    job_key: 'greenhouse:a:legacy',
    status: 'closed',
    closed_at: '2026-08-20T04:00:00.000Z',
    possibly_closed_at: null,
  }, migrationTime);
  assert.deepEqual(legacy, {
    job_key: 'greenhouse:a:legacy',
    status: 'possibly_closed',
    closed_at: null,
    possibly_closed_at: migrationTime,
    missing_complete_scans: 1,
  });
  assert.equal(quarantineUnverifiedClosure(legacy, '2026-08-20T13:00:00.000Z'), legacy);

  const verified = {
    job_key: 'greenhouse:a:verified',
    status: 'closed',
    closed_at: '2026-08-20T06:00:00.000Z',
    possibly_closed_at: '2026-08-20T00:00:00.000Z',
    missing_complete_scans: 2,
  };
  assert.equal(quarantineUnverifiedClosure(verified, migrationTime), verified);
});

test('seen jobs reopen and clear omission evidence', () => {
  const seen = resetSeenLifecycle({
    status: 'possibly_closed',
    closed_at: null,
    possibly_closed_at: '2026-08-20T00:00:00.000Z',
    missing_complete_scans: 1,
  });
  assert.deepEqual(seen, {
    status: 'open',
    closed_at: null,
    possibly_closed_at: null,
    missing_complete_scans: 0,
  });
  assert.equal(sourceIdentity({ type: 'GreenHouse', board: 'Acme' }), 'greenhouse:acme');
});
