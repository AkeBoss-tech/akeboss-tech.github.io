import { mkdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

export async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

export async function atomicWrite(path, contents) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.tmp-${process.pid}`;
  await writeFile(temporaryPath, contents, 'utf8');
  await rename(temporaryPath, path);
}

function transactionPath(directory, name) {
  if (!name || basename(name) !== name) throw new Error(`Unsafe projection transaction path: ${name}`);
  return join(directory, name);
}

export async function recoverWriteTransaction(journalPath) {
  if (!(await pathExists(journalPath))) return false;
  const directory = dirname(journalPath);
  const journal = JSON.parse(await readFile(journalPath, 'utf8'));
  if (journal?.version !== 1 || !Array.isArray(journal.entries) || !journal.entries.length) {
    throw new Error(`Invalid projection transaction journal: ${journalPath}`);
  }

  for (const entry of journal.entries) {
    const temporaryPath = transactionPath(directory, entry.temporary);
    const targetPath = transactionPath(directory, entry.target);
    if (await pathExists(temporaryPath)) {
      await rename(temporaryPath, targetPath);
    } else if (!(await pathExists(targetPath))) {
      throw new Error(`Cannot recover projection transaction; both files are missing: ${entry.target}`);
    }
  }
  await unlink(journalPath);
  return true;
}

export async function atomicWriteTransaction(journalPath, writes) {
  if (!Array.isArray(writes) || writes.length < 2) {
    throw new Error('A projection transaction requires at least two writes');
  }
  await recoverWriteTransaction(journalPath);
  const directory = dirname(journalPath);
  await mkdir(directory, { recursive: true });
  const suffix = `${process.pid}-${Date.now()}`;
  const entries = writes.map((write, index) => {
    const targetPath = resolve(write.path);
    if (dirname(targetPath) !== resolve(directory)) {
      throw new Error(`Projection transaction target must be in ${directory}: ${write.path}`);
    }
    return {
      contents: write.contents,
      target: basename(targetPath),
      temporary: `.${basename(targetPath)}.projection-${suffix}-${index}.tmp`,
    };
  });

  try {
    await Promise.all(entries.map((entry) => writeFile(
      transactionPath(directory, entry.temporary),
      entry.contents,
      'utf8',
    )));
    await atomicWrite(journalPath, `${JSON.stringify({
      version: 1,
      created_at: new Date().toISOString(),
      entries: entries.map(({ target, temporary }) => ({ target, temporary })),
    }, null, 2)}\n`);
  } catch (error) {
    await Promise.allSettled(entries.map((entry) => unlink(transactionPath(directory, entry.temporary))));
    throw error;
  }

  for (const entry of entries) {
    await rename(transactionPath(directory, entry.temporary), transactionPath(directory, entry.target));
  }
  await unlink(journalPath);
}
