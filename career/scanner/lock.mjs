import { randomUUID } from 'node:crypto';
import { mkdir, open, readFile, stat, unlink } from 'node:fs/promises';
import { hostname } from 'node:os';
import { dirname } from 'node:path';

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid < 1) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error?.code === 'EPERM';
  }
}

async function readLock(path) {
  try {
    const [contents, details] = await Promise.all([readFile(path, 'utf8'), stat(path)]);
    let owner = null;
    try {
      owner = JSON.parse(contents);
    } catch {
      // A newly-created lock can briefly be empty while its owner writes metadata.
    }
    return { owner, ageMs: Math.max(0, Date.now() - details.mtimeMs) };
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

function staleLock(lock, invalidGraceMs, foreignHostStaleMs) {
  if (!lock) return true;
  if (!lock.owner) return lock.ageMs >= invalidGraceMs;
  if (lock.owner.hostname !== hostname()) return lock.ageMs >= foreignHostStaleMs;
  return !processIsAlive(Number(lock.owner.pid));
}

async function recoverStaleLock(path, options) {
  const recoveryPath = `${path}.recovery`;
  let recovery;
  try {
    recovery = await open(recoveryPath, 'wx', 0o600);
  } catch (error) {
    if (error?.code === 'EEXIST') return false;
    throw error;
  }

  try {
    const lock = await readLock(path);
    if (!staleLock(lock, options.invalidGraceMs, options.foreignHostStaleMs)) return false;
    await unlink(path).catch((error) => {
      if (error?.code !== 'ENOENT') throw error;
    });
    return true;
  } finally {
    await recovery.close();
    await unlink(recoveryPath).catch((error) => {
      if (error?.code !== 'ENOENT') throw error;
    });
  }
}

/**
 * Serialize read/merge/write cycles for one canonical output directory.
 * The token check prevents an old owner from releasing a replacement lock.
 */
export async function acquireOutputLock(path, options = {}) {
  const waitMs = Number(options.waitMs ?? 30 * 60 * 1_000);
  const pollMs = Number(options.pollMs ?? 250);
  const invalidGraceMs = Number(options.invalidGraceMs ?? 30_000);
  const foreignHostStaleMs = Number(options.foreignHostStaleMs ?? 24 * 60 * 60 * 1_000);
  if (![waitMs, pollMs, invalidGraceMs, foreignHostStaleMs].every(Number.isFinite)) {
    throw new TypeError('Output-lock timing options must be finite numbers');
  }

  await mkdir(dirname(path), { recursive: true });
  const startedAt = Date.now();
  const token = randomUUID();
  const owner = {
    schema_version: 1,
    token,
    pid: process.pid,
    hostname: hostname(),
    created_at: new Date().toISOString(),
  };

  while (true) {
    let handle;
    try {
      handle = await open(path, 'wx', 0o600);
      await handle.writeFile(`${JSON.stringify(owner)}\n`, 'utf8');
      await handle.close();
      break;
    } catch (error) {
      await handle?.close().catch(() => {});
      if (error?.code !== 'EEXIST') throw error;
      await recoverStaleLock(path, { invalidGraceMs, foreignHostStaleMs });
      if (Date.now() - startedAt >= waitMs) {
        const current = await readLock(path);
        const description = current?.owner
          ? `pid ${current.owner.pid} on ${current.owner.hostname}`
          : 'an unidentifiable owner';
        throw new Error(`Timed out waiting for canonical writer lock ${path} held by ${description}`);
      }
      await sleep(Math.max(1, pollMs));
    }
  }

  let released = false;
  return {
    owner,
    path,
    async release() {
      if (released) return false;
      released = true;
      const current = await readLock(path);
      if (current?.owner?.token !== token) return false;
      await unlink(path).catch((error) => {
        if (error?.code !== 'ENOENT') throw error;
      });
      return true;
    },
  };
}
