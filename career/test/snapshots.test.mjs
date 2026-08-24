import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, utimes } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { gunzip } from 'node:zlib';
import { promisify } from 'node:util';
import {
  pruneSnapshotManifests,
  pruneSnapshots,
  SnapshotStore,
  writeSnapshotManifest,
} from '../scanner/snapshots.mjs';

const gunzipAsync = promisify(gunzip);

test('SnapshotStore writes content-addressed compressed payloads once', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'career-snapshots-'));
  try {
    const store = new SnapshotStore(directory);
    const response = {
      url: 'https://example.test/jobs',
      status: 200,
      contentType: 'application/json',
      headers: { etag: 'v1' },
      body: '{"jobs":[1]}',
      fetchedAt: '2026-08-20T00:00:00.000Z',
    };
    const first = await store.capture(response);
    const second = await store.capture(response);
    assert.equal(first.sha256, second.sha256);
    assert.equal(first.stored, true);
    assert.equal(second.stored, true);
    assert.equal(first.etag, 'v1');
    const decompressed = await gunzipAsync(await readFile(join(directory, first.file)));
    assert.equal(decompressed.toString(), response.body);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('SnapshotStore enforces size caps and pruning keeps referenced hashes', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'career-snapshots-'));
  try {
    const capped = new SnapshotStore(directory, { maxBytes: 2 });
    const skipped = await capped.capture({ body: 'large', contentType: 'text/plain' });
    assert.equal(skipped.stored, false);
    assert.equal(skipped.skipped_reason, 'max_bytes_exceeded');

    const store = new SnapshotStore(directory);
    const old = await store.capture({ body: 'old', contentType: 'text/plain' });
    const kept = await store.capture({ body: 'kept', contentType: 'text/plain' });
    const oldDate = new Date('2020-01-01T00:00:00Z');
    await utimes(join(directory, old.file), oldDate, oldDate);
    await utimes(join(directory, kept.file), oldDate, oldDate);
    const result = await pruneSnapshots(directory, { retentionDays: 1, keepHashes: [kept.sha256] });
    assert.deepEqual(result, { removed: 1, retained: 1 });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('snapshot manifests durably map source runs to content hashes', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'career-snapshots-'));
  try {
    const stored = await new SnapshotStore(directory).capture({
      url: 'https://example.test/jobs',
      status: 200,
      contentType: 'application/json',
      body: '{"jobs":[]}',
      fetchedAt: '2026-08-20T00:00:00.000Z',
    });
    const reference = await writeSnapshotManifest(directory, {
      started_at: '2026-08-20T00:00:00.000Z',
      completed_at: '2026-08-20T00:00:01.000Z',
      sources: [{ company: 'Example', status: 'ok', snapshots: [stored] }],
    });
    const manifest = JSON.parse(await readFile(join(directory, reference.file), 'utf8'));
    assert.equal(manifest.sources[0].snapshots[0].sha256, stored.sha256);
    assert.equal(manifest.sources[0].snapshots[0].url, 'https://example.test/jobs');

    const oldDate = new Date('2020-01-01T00:00:00Z');
    await utimes(join(directory, reference.file), oldDate, oldDate);
    assert.deepEqual(
      await pruneSnapshotManifests(directory, { retentionDays: 1 }),
      { removed: 1, retained: 0 },
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('re-referencing an unchanged blob refreshes its retention age', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'career-snapshots-'));
  try {
    const store = new SnapshotStore(directory);
    const response = { body: 'stable', contentType: 'text/plain' };
    const first = await store.capture(response);
    const oldDate = new Date('2020-01-01T00:00:00Z');
    await utimes(join(directory, first.file), oldDate, oldDate);
    const referencedAgain = await store.capture(response);
    assert.equal(referencedAgain.sha256, first.sha256);
    assert.deepEqual(
      await pruneSnapshots(directory, { retentionDays: 1, keepHashes: [] }),
      { removed: 0, retained: 1 },
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
