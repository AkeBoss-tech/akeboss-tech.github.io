import { readFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createDashboardStore } from './data.mjs';

const DASHBOARD_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PUBLIC_DIR = path.join(DASHBOARD_DIR, 'public');
const STATIC_ROUTES = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
]);

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; base-uri 'none'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self'",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

function send(response, status, body, contentType, method = 'GET', headers = {}) {
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(String(body));
  response.writeHead(status, {
    ...SECURITY_HEADERS,
    'Content-Type': contentType,
    'Content-Length': payload.byteLength,
    ...headers,
  });
  response.end(method === 'HEAD' ? undefined : payload);
}

function sendJson(response, status, value, method = 'GET', headers = {}) {
  send(response, status, `${JSON.stringify(value)}\n`, 'application/json; charset=utf-8', method, {
    'Cache-Control': 'no-store',
    ...headers,
  });
}

function publicError(error, log) {
  log?.error?.('[career-dashboard]', error);
  return {
    error: 'Dashboard data is unavailable.',
    hint: 'Confirm the career monitor has produced its local data files, then retry.',
  };
}

function isLocalHostHeader(value) {
  if (!value) return false;
  try {
    const hostname = new URL(`http://${value}`).hostname;
    return ['127.0.0.1', '[::1]', 'localhost'].includes(hostname);
  } catch {
    return false;
  }
}

export function createDashboardServer({
  store = createDashboardStore(),
  publicDir = DEFAULT_PUBLIC_DIR,
  log = console,
} = {}) {
  return http.createServer(async (request, response) => {
    const method = request.method ?? 'GET';
    if (!isLocalHostHeader(request.headers.host)) {
      sendJson(response, 421, { error: 'Localhost host header required.' }, method);
      return;
    }
    if (!['GET', 'HEAD'].includes(method)) {
      sendJson(response, 405, { error: 'Method not allowed.' }, method, { Allow: 'GET, HEAD' });
      return;
    }

    let pathname;
    try {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');
      pathname = url.pathname;
    } catch {
      sendJson(response, 400, { error: 'Invalid request URL.' }, method);
      return;
    }

    if (pathname === '/favicon.ico') {
      send(response, 204, '', 'image/x-icon', method, { 'Cache-Control': 'no-store' });
      return;
    }

    if (pathname === '/api/dashboard') {
      try {
        const dashboard = await store.getDashboardData();
        sendJson(response, 200, dashboard, method);
      } catch (error) {
        sendJson(response, 503, publicError(error, log), method);
      }
      return;
    }

    if (pathname === '/api/health') {
      try {
        const dashboard = await store.getDashboardData();
        sendJson(response, 200, {
          ok: true,
          generatedAt: dashboard.generatedAt,
          freshness: dashboard.freshness,
          kpis: dashboard.kpis,
          dataVersion: dashboard.meta.dataVersion,
        }, method);
      } catch (error) {
        sendJson(response, 503, { ok: false, ...publicError(error, log) }, method);
      }
      return;
    }

    const staticRoute = STATIC_ROUTES.get(pathname);
    if (!staticRoute) {
      sendJson(response, 404, { error: 'Not found.' }, method);
      return;
    }

    const [fileName, contentType] = staticRoute;
    try {
      const body = await readFile(path.join(publicDir, fileName));
      send(response, 200, body, contentType, method, { 'Cache-Control': 'no-cache' });
    } catch (error) {
      sendJson(response, 500, publicError(error, log), method);
    }
  });
}

function validateHost(host) {
  if (!['127.0.0.1', '::1', 'localhost'].includes(host)) {
    throw new Error('The career dashboard only supports a localhost bind address.');
  }
  return host;
}

function validatePort(value) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 0 || port > 65_535) {
    throw new Error(`Invalid dashboard port: ${value}`);
  }
  return port;
}

export async function startDashboardServer({
  host = process.env.CAREER_DASHBOARD_HOST ?? '127.0.0.1',
  port = process.env.CAREER_DASHBOARD_PORT ?? 4173,
  store,
  publicDir,
  log = console,
} = {}) {
  const validatedHost = validateHost(host);
  const validatedPort = validatePort(port);
  const server = createDashboardServer({ store, publicDir, log });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(validatedPort, validatedHost, resolve);
  });
  const address = server.address();
  const displayHost = validatedHost === '::1' ? '[::1]' : validatedHost;
  const url = `http://${displayHost}:${address.port}`;
  log?.log?.(`Career Radar dashboard: ${url}`);
  return { server, url };
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  const { server } = await startDashboardServer();
  const shutdown = () => server.close(() => process.exit(0));
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
