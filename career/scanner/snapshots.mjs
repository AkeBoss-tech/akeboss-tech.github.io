import { createHash } from 'node:crypto';
import { mkdir, readdir, rename, stat, unlink, utimes, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';

const gzipAsync = promisify(gzip);

function safeHeader(headers, name) {
  if (!headers) return null;
  if (typeof headers.get === 'function') return headers.get(name);
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
  return entry?.[1] ?? null;
}

export class SnapshotStore {
  constructor(directory, options = {}) {
    this.directory = directory;
    this.enabled = options.enabled ?? true;
    this.maxBytes = options.maxBytes ?? 100 * 1024 * 1024;
  }

  async capture(response) {
    const body = typeof response.body === 'string'
      ? response.body
      : JSON.stringify(response.body ?? null);
    const bytes = Buffer.byteLength(body);
    const hash = createHash('sha256').update(body).digest('hex');
    const contentType = response.contentType ?? safeHeader(response.headers, 'content-type');
    const extension = /json/i.test(contentType ?? '') ? 'json.gz' : 'txt.gz';
    const filename = `${hash}.${extension}`;
    const reference = {
      sha256: hash,
      file: filename,
      url: response.url ?? null,
      status: response.status ?? null,
      content_type: contentType ?? null,
      etag: safeHeader(response.headers, 'etag'),
      last_modified: safeHeader(response.headers, 'last-modified'),
      fetched_at: response.fetchedAt ?? new Date().toISOString(),
      bytes,
      stored: false,
      skipped_reason: null,
    };

    if (!this.enabled) {
      reference.skipped_reason = 'disabled';
      return reference;
    }
    if (bytes > this.maxBytes) {
      reference.skipped_reason = 'max_bytes_exceeded';
      return reference;
    }

    await mkdir(this.directory, { recursive: true });
    const destination = join(this.directory, filename);
    try {
      await stat(destination);
      const referencedAt = new Date();
      await utimes(destination, referencedAt, referencedAt);
      reference.stored = true;
      return reference;
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }

    const compressed = await gzipAsync(Buffer.from(body));
    const temporary = `${destination}.tmp-${process.pid}-${Date.now()}`;
    await writeFile(temporary, compressed);
    try {
      await rename(temporary, destination);
    } catch (error) {
      await unlink(temporary).catch(() => {});
      throw error;
    }
    reference.stored = true;
    reference.compressed_bytes = compressed.length;
    return reference;
  }
}

export async function writeSnapshotManifest(directory, manifest) {
  if (!manifest?.started_at || !Array.isArray(manifest.sources)) {
    throw new Error('A snapshot manifest needs started_at and sources');
  }
  const manifestsDirectory = join(directory, 'manifests');
  await mkdir(manifestsDirectory, { recursive: true });
  const identity = createHash('sha256')
    .update(`${manifest.started_at}:${manifest.completed_at ?? ''}:${process.pid}`)
    .digest('hex')
    .slice(0, 16);
  const filename = `${manifest.started_at.replace(/[^0-9A-Za-z-]/g, '-')}-${identity}.json`;
  const destination = join(manifestsDirectory, filename);
  const temporary = `${destination}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify({ schema_version: 1, ...manifest }, null, 2)}\n`, 'utf8');
  await rename(temporary, destination);
  return { file: join('manifests', filename), sources: manifest.sources.length };
}

export async function pruneSnapshotManifests(directory, options = {}) {
  const retentionDays = options.retentionDays ?? 14;
  if (!Number.isFinite(retentionDays) || retentionDays < 0) {
    throw new Error('snapshot retentionDays must be a nonnegative number');
  }
  const manifestsDirectory = join(directory, 'manifests');
  const cutoff = Date.now() - (retentionDays * 24 * 60 * 60 * 1_000);
  let removed = 0;
  let retained = 0;
  let entries;
  try {
    entries = await readdir(manifestsDirectory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return { removed, retained };
    throw error;
  }
  for (const entry of entries) {
    if (!entry.isFile() || !/\.json$/.test(entry.name)) continue;
    const path = join(manifestsDirectory, entry.name);
    const metadata = await stat(path);
    if (metadata.mtimeMs >= cutoff) retained += 1;
    else {
      await unlink(path);
      removed += 1;
    }
  }
  return { removed, retained };
}

export async function pruneSnapshots(directory, options = {}) {
  const retentionDays = options.retentionDays ?? 14;
  if (!Number.isFinite(retentionDays) || retentionDays < 0) {
    throw new Error('snapshot retentionDays must be a nonnegative number');
  }
  const keep = new Set(options.keepHashes ?? []);
  const cutoff = Date.now() - (retentionDays * 24 * 60 * 60 * 1_000);
  let removed = 0;
  let retained = 0;
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return { removed, retained };
    throw error;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !/^[a-f0-9]{64}\.(?:json|txt)\.gz$/.test(entry.name)) continue;
    const hash = basename(entry.name).split('.')[0];
    const path = join(directory, entry.name);
    const metadata = await stat(path);
    if (keep.has(hash) || metadata.mtimeMs >= cutoff) {
      retained += 1;
      continue;
    }
    await unlink(path);
    removed += 1;
  }
  return { removed, retained };
}
