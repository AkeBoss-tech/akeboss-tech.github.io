const USER_AGENT = 'career-ops-job-scanner/3.0 (+local personal job research)';

class RequestGate {
  constructor(maxConcurrent, spacingMs) {
    this.maxConcurrent = maxConcurrent;
    this.spacingMs = spacingMs;
    this.active = 0;
    this.waiters = [];
    this.lastStartedAt = 0;
    this.startChain = Promise.resolve();
  }

  async acquire(spacingMs = this.spacingMs) {
    if (this.active >= this.maxConcurrent) {
      await new Promise((resolve) => this.waiters.push(resolve));
    }
    this.active += 1;
    const scheduled = this.startChain.then(async () => {
      const wait = Math.max(0, this.lastStartedAt + spacingMs - Date.now());
      if (wait) await sleep(wait);
      this.lastStartedAt = Date.now();
    });
    this.startChain = scheduled.catch(() => {});
    await scheduled;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.active -= 1;
      this.waiters.shift()?.();
    };
  }
}

// Workday tenant hosts share infrastructure and can rate-limit one another.
// Bound aggregate request pressure rather than treating each hostname as an
// independent service.
const workdayRequestGate = new RequestGate(2, 250);

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function retryDelay(response, attempt) {
  const retryAfter = response?.headers?.get('retry-after');
  if (retryAfter && /^\d+$/.test(retryAfter)) return Math.min(Number(retryAfter) * 1_000, 60_000);
  if (retryAfter) {
    const timestamp = Date.parse(retryAfter);
    if (Number.isFinite(timestamp)) return Math.min(Math.max(0, timestamp - Date.now()), 60_000);
  }
  if (response?.status === 429) return Math.min(2_000 * (2 ** attempt), 30_000);
  return Math.min(500 * (2 ** attempt), 5_000);
}

function gateFor(url) {
  try {
    return /\.myworkday(?:jobs|site)\.com$/i.test(new URL(url).hostname)
      ? workdayRequestGate
      : null;
  } catch {
    return null;
  }
}

function responseHeaders(headers) {
  if (!headers?.entries) return {};
  return Object.fromEntries(headers.entries());
}

function retryableError(error) {
  return error?.name === 'TimeoutError'
    || error?.name === 'AbortError'
    || error?.cause?.code === 'ECONNRESET'
    || [408, 425, 429, 500, 502, 503, 504].includes(error?.status);
}

export async function fetchText(url, options = {}) {
  const retries = options.retries ?? 2;
  const timeoutMs = options.timeoutMs ?? 30_000;
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    let response;
    let releaseGate;
    try {
      const gate = gateFor(url);
      releaseGate = gate
        ? await gate.acquire(options.workdayRequestSpacingMs ?? 250)
        : null;
      response = await fetch(url, {
        method: options.method ?? 'GET',
        headers: {
          accept: options.accept ?? '*/*',
          'user-agent': USER_AGENT,
          ...options.headers,
        },
        body: options.body,
        redirect: 'follow',
        signal: AbortSignal.timeout(timeoutMs),
      });

      const body = await response.text();
      if (response.ok) {
        if (options.onResponse) {
          await options.onResponse({
            url: response.url || String(url),
            status: response.status,
            headers: responseHeaders(response.headers),
            body,
            contentType: response.headers?.get('content-type') ?? null,
          });
        }
        return body;
      }

      const excerpt = body.slice(0, 300).replace(/\s+/g, ' ');
      const error = new Error(`HTTP ${response.status} from ${url}${excerpt ? `: ${excerpt}` : ''}`);
      error.status = response.status;
      if (!retryableError(error) || attempt === retries) throw error;
      lastError = error;
    } catch (error) {
      lastError = error;
      if (!retryableError(error) || attempt === retries) throw error;
    } finally {
      releaseGate?.();
    }

    await sleep(retryDelay(response, attempt));
  }

  throw lastError;
}

export async function fetchJson(url, options = {}) {
  const retries = options.retries ?? 2;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const body = await fetchText(url, {
      ...options,
      accept: options.accept ?? 'application/json',
    });
    try {
      return JSON.parse(body);
    } catch (error) {
      if (attempt === retries) {
        throw new Error(`Malformed JSON from ${url}: ${error.message}`, { cause: error });
      }
      const delay = options.jsonRetryDelayMs
        ?? (gateFor(url) ? Math.min(2_000 * (2 ** attempt), 30_000) : Math.min(500 * (2 ** attempt), 5_000));
      if (delay) await sleep(delay);
    }
  }
  throw new Error(`Malformed JSON from ${url}`);
}

export async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(Math.max(limit, 1), Math.max(items.length, 1)) }, worker));
  return results;
}
