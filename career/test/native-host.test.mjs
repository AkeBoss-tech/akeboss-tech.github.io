import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough } from 'node:stream';
import { test } from 'node:test';
import {
  appendManualCapture,
  createNativeRequestHandler,
  encodeNativeMessage,
  readRecentRelevant,
  runNativeProtocol,
  sanitizeCapturePayload,
  validateNativeRequest,
} from '../scripts/career-monitor-native-host.mjs';

test('native request validation exposes only the three explicit actions', () => {
  assert.deepEqual(validateNativeRequest({ action: 'get_status', payload: {} }), {
    action: 'get_status', payload: {},
  });
  assert.deepEqual(validateNativeRequest({ action: 'run_due', payload: { reason: 'manual' } }), {
    action: 'run_due', payload: { reason: 'manual' },
  });
  assert.throws(
    () => validateNativeRequest({ action: 'shell', payload: { command: 'whoami' } }),
    /not allowed/,
  );
  assert.throws(
    () => validateNativeRequest({ action: 'run_due', payload: { reason: 'manual', all: true } }),
    /unsupported field/,
  );
  assert.throws(
    () => validateNativeRequest({ action: 'get_status', payload: { path: '/tmp' } }),
    /unsupported field/,
  );
});

test('manual captures are HTTPS-only, bounded, and strip query credentials and fragments', () => {
  const payload = sanitizeCapturePayload({
    source: 'manual_visible_page',
    url: 'https://person:secret@jobs.example/role/123?token=private#details',
    title: `  Engineer ${'x'.repeat(400)}  `,
    company: 'Example',
    location: 'Remote',
    description: 'Build systems.',
    selected_text: 'Selected requirements',
  });
  assert.equal(payload.url, 'https://jobs.example/role/123');
  assert.equal(payload.title.length, 300);
  assert.equal(payload.selected_text, 'Selected requirements');
  assert.throws(() => sanitizeCapturePayload({
    source: 'manual_visible_page', url: 'http://jobs.example/1', title: 'Role',
  }), /HTTPS/);
  assert.throws(() => sanitizeCapturePayload({
    source: 'automatic_crawl', url: 'https://jobs.example/1', title: 'Role',
  }), /source is invalid/);
});

test('manual capture appends a review-only record outside canonical jobs', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'career-native-capture-'));
  try {
    const path = join(directory, 'manual-captures.ndjson');
    const result = await appendManualCapture({
      source: 'manual_visible_page',
      url: 'https://www.linkedin.com/jobs/view/123?tracking=removed',
      title: 'Machine Learning Engineer',
      company: 'Example',
      location: 'New York',
      description: 'Build models.',
      selected_text: 'Experience with distributed systems',
    }, path);
    const record = JSON.parse((await readFile(path, 'utf8')).trim());
    assert.equal(result.status, 'manual_review');
    assert.equal(record.status, 'manual_review');
    assert.equal(record.canonical_url, 'https://www.linkedin.com/jobs/view/123');
    assert.equal(record.source.type, 'manual_visible_page');
    assert.equal(record.selected_text, 'Experience with distributed systems');
    assert.equal(record.job_key, undefined);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('native handler routes validated actions without exposing implementation parameters', async () => {
  const calls = [];
  const handler = createNativeRequestHandler({
    getStatus: async () => ({ status: { supported_sources: 2 } }),
    runDue: async (payload) => {
      calls.push(['run', payload]);
      return { accepted: true };
    },
    capture: async (payload) => {
      calls.push(['capture', payload]);
      return { capture_id: 'capture-1' };
    },
  });
  assert.equal((await handler({ action: 'get_status', payload: {} })).status.supported_sources, 2);
  assert.equal((await handler({ action: 'run_due', payload: { reason: 'alarm' } })).accepted, true);
  assert.equal((await handler({
    action: 'capture_visible_job',
    payload: {
      source: 'manual_visible_page', url: 'https://jobs.example/1', title: 'Role',
    },
  })).capture_id, 'capture-1');
  assert.deepEqual(calls[0], ['run', { reason: 'alarm' }]);
  assert.equal(calls[1][1].url, 'https://jobs.example/1');
});

test('native framing uses a four-byte little-endian length prefix', () => {
  const frame = encodeNativeMessage({ ok: true, data: { count: 2 } });
  assert.equal(frame.readUInt32LE(0), frame.length - 4);
  assert.deepEqual(JSON.parse(frame.subarray(4).toString('utf8')), { ok: true, data: { count: 2 } });
});

test('native protocol parses a framed request and returns a framed response', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const responsePromise = new Promise((resolvePromise) => {
    let buffered = Buffer.alloc(0);
    output.on('data', (chunk) => {
      buffered = Buffer.concat([buffered, chunk]);
      if (buffered.length < 4) return;
      const length = buffered.readUInt32LE(0);
      if (buffered.length >= length + 4) {
        resolvePromise(JSON.parse(buffered.subarray(4, length + 4).toString('utf8')));
      }
    });
  });
  runNativeProtocol(input, output, async (request) => ({ action: request.action }));
  const request = Buffer.from(JSON.stringify({ action: 'get_status', payload: {} }));
  const header = Buffer.alloc(4);
  header.writeUInt32LE(request.length, 0);
  input.write(Buffer.concat([header, request]));
  const response = await responsePromise;
  assert.deepEqual(response, { ok: true, data: { action: 'get_status' } });
  input.end();
});

test('recent relevant projection stays bounded and omits unsafe URLs', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'career-native-recent-'));
  try {
    const path = join(directory, 'relevant.ndjson');
    const records = [
      {
        company: 'Old', title: 'Old role', canonical_url: 'https://jobs.example/old',
        first_seen_at: '2026-01-01T00:00:00Z', status: 'open', classification: { included: true },
      },
      {
        company: { name: 'New' }, title: 'New role', canonical_url: 'https://jobs.example/new',
        locations: [{ label: 'Remote' }],
        first_seen_at: '2026-02-01T00:00:00Z', status: 'open', classification: { included: true },
      },
      {
        company: 'Unsafe', title: 'Unsafe role', canonical_url: 'javascript:alert(1)',
        first_seen_at: '2026-03-01T00:00:00Z', status: 'open', classification: { included: true },
      },
    ];
    await writeFile(path, records.map((record) => JSON.stringify(record)).join('\n'), 'utf8');
    const recent = await readRecentRelevant(path, 1);
    assert.equal(recent.length, 1);
    assert.equal(recent[0].company, 'New');
    assert.equal(recent[0].location, 'Remote');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
