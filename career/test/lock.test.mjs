import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { acquireOutputLock } from '../scanner/lock.mjs';

test('canonical writer lock serializes disjoint scanner batches', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'career-writer-lock-'));
  const lockPath = join(directory, '.scan-writer.lock');
  try {
    const first = await acquireOutputLock(lockPath, { pollMs: 5, waitMs: 1_000 });
    let secondAcquired = false;
    const secondPromise = acquireOutputLock(lockPath, { pollMs: 5, waitMs: 1_000 })
      .then((lock) => {
        secondAcquired = true;
        return lock;
      });
    await new Promise((resolve) => setTimeout(resolve, 25));
    assert.equal(secondAcquired, false);
    assert.equal(await first.release(), true);
    const second = await secondPromise;
    assert.equal(secondAcquired, true);
    assert.equal(await second.release(), true);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
