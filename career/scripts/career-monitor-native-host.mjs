#!/usr/bin/env node

import { execFile, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import {
  closeSync,
  constants as fsConstants,
  createReadStream,
  openSync,
} from 'node:fs';
import {
  access,
  appendFile,
  chmod,
  mkdir,
  readFile,
} from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

export const HOST_NAME = 'com.akeboss.career_monitor';
export const MAX_REQUEST_BYTES = 64 * 1024;
export const MAX_RESPONSE_BYTES = 256 * 1024;

const execFileAsync = promisify(execFile);
const CAREER_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MONITOR_PATH = join(CAREER_DIR, 'monitor-jobs.mjs');
const DATA_DIR = join(CAREER_DIR, 'data');
const SUMMARY_PATH = join(DATA_DIR, 'scan-summary.json');
const RELEVANT_PATH = join(DATA_DIR, 'relevant-jobs.ndjson');
const CAPTURE_PATH = join(DATA_DIR, 'manual-captures.ndjson');
const ALLOWED_ACTIONS = new Set(['get_status', 'run_due', 'capture_visible_job']);

function plainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function rejectUnknownKeys(value, allowed, label) {
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length) throw new Error(`${label} contains unsupported field: ${unknown[0]}`);
}

function clipped(value, maximum) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maximum);
}

export function sanitizeCapturePayload(payload) {
  if (!plainObject(payload)) throw new Error('capture_visible_job requires an object payload');
  rejectUnknownKeys(payload, new Set([
    'url', 'title', 'company', 'location', 'description', 'selected_text', 'source',
  ]), 'capture payload');
  let url;
  try {
    url = new URL(payload.url);
  } catch {
    throw new Error('capture URL is invalid');
  }
  if (url.protocol !== 'https:') throw new Error('manual capture accepts HTTPS pages only');
  url.username = '';
  url.password = '';
  url.search = '';
  url.hash = '';
  const title = clipped(payload.title, 300);
  if (!title) throw new Error('manual capture requires a page or job title');
  if (payload.source !== 'manual_visible_page') throw new Error('manual capture source is invalid');
  return {
    url: url.href,
    title,
    company: clipped(payload.company, 200),
    location: clipped(payload.location, 300),
    description: clipped(payload.description, 4_000),
    selected_text: clipped(payload.selected_text, 2_000),
    source: 'manual_visible_page',
  };
}

export function validateNativeRequest(value) {
  if (!plainObject(value)) throw new Error('native request must be an object');
  rejectUnknownKeys(value, new Set(['action', 'payload']), 'native request');
  if (!ALLOWED_ACTIONS.has(value.action)) throw new Error('native action is not allowed');
  const payload = value.payload ?? {};
  if (!plainObject(payload)) throw new Error('native request payload must be an object');
  if (value.action === 'get_status') {
    rejectUnknownKeys(payload, new Set(), 'get_status payload');
    return { action: value.action, payload: {} };
  }
  if (value.action === 'run_due') {
    rejectUnknownKeys(payload, new Set(['reason']), 'run_due payload');
    if (!['alarm', 'manual'].includes(payload.reason)) throw new Error('run_due reason must be alarm or manual');
    return { action: value.action, payload: { reason: payload.reason } };
  }
  return { action: value.action, payload: sanitizeCapturePayload(payload) };
}

function boundedInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function publicSummary(summary) {
  if (!plainObject(summary)) return null;
  return {
    completed_at: clipped(summary.completed_at, 50),
    companies_selected: boundedInteger(summary.companies_selected),
    sources_succeeded: boundedInteger(summary.sources_succeeded),
    sources_failed: boundedInteger(summary.sources_failed),
    sources_partial: boundedInteger(summary.sources_partial),
    sources_suspicious: boundedInteger(summary.sources_suspicious),
    stored_open_jobs: boundedInteger(summary.stored_open_jobs),
    relevant_open_jobs: boundedInteger(summary.relevant_open_jobs),
    new_relevant_jobs: boundedInteger(summary.new_relevant_jobs),
  };
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT' || error instanceof SyntaxError) return null;
    throw error;
  }
}

function recentJobProjection(job) {
  let url = null;
  try {
    const candidate = new URL(job?.canonical_url ?? job?.apply_url ?? '');
    if (candidate.protocol === 'https:') url = candidate.href;
  } catch {
    // A stored invalid URL is omitted from the popup rather than propagated.
  }
  return {
    company: clipped(job?.company?.name ?? job?.company, 200),
    title: clipped(job?.title, 300),
    location: clipped(job?.primary_location?.label ?? job?.locations?.[0]?.label ?? job?.location, 300),
    url,
    first_seen_at: clipped(job?.first_seen_at, 50),
  };
}

export async function readRecentRelevant(path = RELEVANT_PATH, limit = 8) {
  try {
    await access(path, fsConstants.R_OK);
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
  const recent = [];
  const lines = createInterface({ input: createReadStream(path, { encoding: 'utf8' }), crlfDelay: Infinity });
  for await (const line of lines) {
    if (!line.trim()) continue;
    let job;
    try {
      job = JSON.parse(line);
    } catch {
      continue;
    }
    if (job?.status !== 'open' || job?.classification?.included !== true) continue;
    const projection = recentJobProjection(job);
    if (!projection.title || !projection.url) continue;
    recent.push(projection);
    recent.sort((left, right) => right.first_seen_at.localeCompare(left.first_seen_at));
    if (recent.length > limit) recent.length = limit;
  }
  return recent;
}

function safeEnvironment() {
  return {
    HOME: process.env.HOME ?? '',
    LANG: process.env.LANG ?? 'en_US.UTF-8',
    LOGNAME: process.env.LOGNAME ?? '',
    PATH: '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
    TMPDIR: process.env.TMPDIR ?? '/tmp',
    USER: process.env.USER ?? '',
  };
}

export async function getMonitorDashboard({
  careerDir = CAREER_DIR,
  monitorPath = MONITOR_PATH,
  summaryPath = SUMMARY_PATH,
  relevantPath = RELEVANT_PATH,
  nodePath = process.execPath,
} = {}) {
  await access(monitorPath, fsConstants.R_OK);
  const { stdout } = await execFileAsync(nodePath, [monitorPath, '--status', '--json'], {
    cwd: careerDir,
    encoding: 'utf8',
    env: safeEnvironment(),
    maxBuffer: 256 * 1024,
    timeout: 30_000,
  });
  let status;
  try {
    status = JSON.parse(stdout);
  } catch {
    throw new Error('monitor status did not return valid JSON');
  }
  return {
    generated_at: new Date().toISOString(),
    status,
    summary: publicSummary(await readJson(summaryPath)),
    recent_relevant: await readRecentRelevant(relevantPath, 8),
  };
}

export async function startDueMonitor({
  careerDir = CAREER_DIR,
  monitorPath = MONITOR_PATH,
  dataDir = DATA_DIR,
  nodePath = process.execPath,
} = {}) {
  await access(monitorPath, fsConstants.R_OK);
  await mkdir(dataDir, { recursive: true, mode: 0o700 });
  const stdoutPath = join(dataDir, 'monitor.chrome.stdout.log');
  const stderrPath = join(dataDir, 'monitor.chrome.stderr.log');
  const stdout = openSync(stdoutPath, fsConstants.O_WRONLY | fsConstants.O_CREAT | fsConstants.O_APPEND, 0o600);
  const stderr = openSync(stderrPath, fsConstants.O_WRONLY | fsConstants.O_CREAT | fsConstants.O_APPEND, 0o600);
  let child;
  try {
    child = spawn(nodePath, [monitorPath, '--write-pipeline'], {
      cwd: careerDir,
      detached: true,
      env: safeEnvironment(),
      stdio: ['ignore', stdout, stderr],
    });
    child.unref();
  } finally {
    closeSync(stdout);
    closeSync(stderr);
  }
  await Promise.all([chmod(stdoutPath, 0o600), chmod(stderrPath, 0o600)]);
  return {
    accepted: true,
    started_at: new Date().toISOString(),
    process_id: child.pid,
  };
}

export async function appendManualCapture(payload, capturePath = CAPTURE_PATH) {
  const safe = sanitizeCapturePayload(payload);
  const capturedAt = new Date().toISOString();
  const record = {
    schema_version: 1,
    capture_id: randomUUID(),
    captured_at: capturedAt,
    status: 'manual_review',
    source: {
      type: safe.source,
      origin: new URL(safe.url).origin,
    },
    company: safe.company || null,
    title: safe.title,
    location: safe.location || null,
    canonical_url: safe.url,
    description_excerpt: safe.description || null,
    selected_text: safe.selected_text || null,
  };
  await mkdir(dirname(capturePath), { recursive: true, mode: 0o700 });
  await appendFile(capturePath, `${JSON.stringify(record)}\n`, { encoding: 'utf8', mode: 0o600 });
  await chmod(capturePath, 0o600);
  return {
    capture_id: record.capture_id,
    captured_at: capturedAt,
    status: record.status,
  };
}

export function createNativeRequestHandler({
  getStatus = () => getMonitorDashboard(),
  runDue = () => startDueMonitor(),
  capture = (payload) => appendManualCapture(payload),
} = {}) {
  return async (request) => {
    const validated = validateNativeRequest(request);
    if (validated.action === 'get_status') return getStatus();
    if (validated.action === 'run_due') return runDue(validated.payload);
    return capture(validated.payload);
  };
}

export function encodeNativeMessage(value) {
  let payload = Buffer.from(JSON.stringify(value), 'utf8');
  if (payload.length > MAX_RESPONSE_BYTES) {
    payload = Buffer.from(JSON.stringify({
      ok: false,
      error: { code: 'response_too_large', message: 'Native response exceeded its safety limit.' },
    }), 'utf8');
  }
  const header = Buffer.alloc(4);
  header.writeUInt32LE(payload.length, 0);
  return Buffer.concat([header, payload]);
}

function errorResponse(error) {
  return {
    ok: false,
    error: {
      code: 'native_request_failed',
      message: clipped(error?.message ?? error, 500),
    },
  };
}

export function runNativeProtocol(input = process.stdin, output = process.stdout, handler = createNativeRequestHandler()) {
  let buffer = Buffer.alloc(0);
  let queue = Promise.resolve();
  let stopped = false;

  const write = (value) => output.write(encodeNativeMessage(value));
  const stop = (error) => {
    if (stopped) return;
    stopped = true;
    write(errorResponse(error));
    input.pause();
  };
  const consume = () => {
    while (!stopped && buffer.length >= 4) {
      const length = buffer.readUInt32LE(0);
      if (length > MAX_REQUEST_BYTES) {
        stop(new Error('Native request exceeded its safety limit.'));
        return;
      }
      if (buffer.length < length + 4) return;
      const payload = buffer.subarray(4, length + 4);
      buffer = buffer.subarray(length + 4);
      queue = queue.then(async () => {
        let request;
        try {
          request = JSON.parse(payload.toString('utf8'));
          write({ ok: true, data: await handler(request) });
        } catch (error) {
          write(errorResponse(error));
        }
      });
    }
  };

  input.on('data', (chunk) => {
    if (stopped) return;
    buffer = Buffer.concat([buffer, chunk]);
    consume();
  });
  input.on('error', stop);
  return queue;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runNativeProtocol();
}
