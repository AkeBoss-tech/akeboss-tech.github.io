import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { normalizeDashboard, safeHttpsUrl } from '../chrome-extension/contract.js';
import {
  deriveChromeExtensionId,
  renderHostWrapper,
  renderNativeHostManifest,
  validateExtensionId,
} from '../scripts/install-career-monitor-native-host.mjs';

const CAREER_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXTENSION_ID = 'hjmedfgjhbbfpmdmpikekgpngokcpfol';

test('manifest has a stable key and no broad website access', async () => {
  const manifest = JSON.parse(await readFile(join(CAREER_DIR, 'chrome-extension', 'manifest.json'), 'utf8'));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(deriveChromeExtensionId(manifest.key), EXTENSION_ID);
  assert.equal(manifest.host_permissions, undefined);
  assert.equal(manifest.content_scripts, undefined);
  assert.deepEqual([...manifest.permissions].sort(), [
    'activeTab', 'alarms', 'nativeMessaging', 'scripting',
  ]);
});

test('native host manifest authorizes exactly one validated extension origin', () => {
  const rendered = JSON.parse(renderNativeHostManifest({
    extensionId: EXTENSION_ID,
    wrapperPath: '/tmp/career host',
  }));
  assert.equal(rendered.name, 'com.akeboss.career_monitor');
  assert.deepEqual(rendered.allowed_origins, [`chrome-extension://${EXTENSION_ID}/`]);
  assert.equal(rendered.type, 'stdio');
  assert.throws(() => validateExtensionId('*'), /32 letters/);
});

test('native wrapper safely quotes spaces and apostrophes', () => {
  const wrapper = renderHostWrapper({
    nodePath: "/Applications/Node's Runtime/node",
    hostScript: "/tmp/Career Host's/host.mjs",
  });
  assert.match(wrapper, /^#!\/bin\/sh\nexec /);
  assert.match(wrapper, /'\\''/);
  assert.equal(wrapper.includes('"'), false);
});

test('popup dashboard coercion bounds recent roles and rejects unsafe links', () => {
  const dashboard = normalizeDashboard({
    generated_at: '2026-08-20T00:00:00Z',
    status: {
      supported_sources: '152', agent_required_sources: 14, due_sources: 3,
      open_escalations: 1, health: { healthy: '149' },
    },
    summary: { new_relevant_jobs: 2, relevant_open_jobs: 3_700 },
    recent_relevant: Array.from({ length: 12 }, (_, index) => ({
      title: `Role ${index}`, url: `https://jobs.example/${index}`,
    })),
  });
  assert.equal(dashboard.supportedSources, 152);
  assert.equal(dashboard.recentRelevant.length, 8);
  assert.equal(safeHttpsUrl('javascript:alert(1)'), null);
  assert.equal(safeHttpsUrl('http://jobs.example/1'), null);
  assert.equal(safeHttpsUrl('https://jobs.example/1'), 'https://jobs.example/1');
});
