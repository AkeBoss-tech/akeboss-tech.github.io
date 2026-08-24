#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { mkdir, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const CAREER_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_LABEL = 'com.akeboss.career-monitor';
const homebrewPrefix = process.execPath.includes('/Cellar/')
  ? process.execPath.slice(0, process.execPath.indexOf('/Cellar/'))
  : null;
const stableHomebrewNode = homebrewPrefix ? join(homebrewPrefix, 'bin', 'node') : null;
const DEFAULT_NODE_PATH = stableHomebrewNode && existsSync(stableHomebrewNode)
  ? stableHomebrewNode
  : process.execPath;

function xml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function positiveInteger(value, name) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 60) throw new Error(`${name} must be an integer of at least 60`);
  return number;
}

function launchdLabel(value) {
  if (!/^[A-Za-z0-9.-]+$/.test(value)) {
    throw new Error('label may contain only letters, numbers, dots, and hyphens');
  }
  return value;
}

export function renderPlist({
  label = DEFAULT_LABEL,
  intervalSeconds = 15 * 60,
  nodePath = DEFAULT_NODE_PATH,
  careerDir = CAREER_DIR,
  writePipeline = false,
} = {}) {
  const argumentsList = [
    nodePath,
    join(careerDir, 'monitor-jobs.mjs'),
    ...(writePipeline ? ['--write-pipeline'] : []),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${xml(label)}</string>
  <key>ProgramArguments</key>
  <array>
${argumentsList.map((argument) => `    <string>${xml(argument)}</string>`).join('\n')}
  </array>
  <key>WorkingDirectory</key>
  <string>${xml(careerDir)}</string>
  <key>StartInterval</key>
  <integer>${intervalSeconds}</integer>
  <key>RunAtLoad</key>
  <true/>
  <key>ProcessType</key>
  <string>Background</string>
  <key>StandardOutPath</key>
  <string>${xml(join(careerDir, 'data', 'monitor.stdout.log'))}</string>
  <key>StandardErrorPath</key>
  <string>${xml(join(careerDir, 'data', 'monitor.stderr.log'))}</string>
</dict>
</plist>
`;
}

function parseArgs(argv) {
  const options = {
    install: false,
    uninstall: false,
    intervalSeconds: 15 * 60,
    label: DEFAULT_LABEL,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = () => {
      index += 1;
      if (!argv[index]) throw new Error(`${argument} requires a value`);
      return argv[index];
    };
    if (argument === '--install') options.install = true;
    else if (argument === '--uninstall') options.uninstall = true;
    else if (argument === '--write-pipeline') options.writePipeline = true;
    else if (argument === '--interval-seconds') {
      options.intervalSeconds = positiveInteger(next(), 'interval-seconds');
    } else if (argument === '--label') options.label = launchdLabel(next());
    else if (argument === '--node-path') options.nodePath = resolve(next());
    else if (argument === '--help' || argument === '-h') options.help = true;
    else throw new Error(`Unknown option: ${argument}`);
  }
  if (options.install && options.uninstall) throw new Error('--install and --uninstall are mutually exclusive');
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`Usage: node scripts/install-monitor-launchd.mjs [options]

Without --install, prints the LaunchAgent plist without changing system state.

Options:
  --install             Install and load the user LaunchAgent
  --uninstall           Unload and remove the user LaunchAgent
  --interval-seconds N  Wake interval; source cadences still control actual scans (default: 900)
  --write-pipeline      Let scheduled scans update the legacy pipeline
  --label LABEL         LaunchAgent label (default: ${DEFAULT_LABEL})
  --node-path PATH      Stable Node executable path (default: detected)
  --help                Show this help
`);
    return;
  }
  const agentsDirectory = join(homedir(), 'Library', 'LaunchAgents');
  const plistPath = join(agentsDirectory, `${options.label}.plist`);
  const domain = `gui/${process.getuid()}`;
  const service = `${domain}/${options.label}`;
  if (options.uninstall) {
    const existing = spawnSync('launchctl', ['print', service], { stdio: 'ignore' });
    if (existing.status === 0) {
      const stopped = spawnSync('launchctl', ['bootout', service], { encoding: 'utf8' });
      if (stopped.status !== 0) throw new Error(`Could not unload service: ${stopped.stderr.trim()}`);
    }
    await unlink(plistPath).catch((error) => {
      if (error?.code !== 'ENOENT') throw error;
    });
    console.log(`Uninstalled ${options.label}`);
    return;
  }

  const plist = renderPlist(options);
  if (!options.install) {
    process.stdout.write(plist);
    return;
  }

  await mkdir(join(CAREER_DIR, 'data'), { recursive: true });
  await mkdir(agentsDirectory, { recursive: true });
  const temporary = `${plistPath}.${process.pid}.tmp`;
  await writeFile(temporary, plist, 'utf8');
  await rename(temporary, plistPath);

  const existing = spawnSync('launchctl', ['print', service], { stdio: 'ignore' });
  if (existing.status === 0) {
    const stopped = spawnSync('launchctl', ['bootout', service], { encoding: 'utf8' });
    if (stopped.status !== 0) throw new Error(`Could not unload existing service: ${stopped.stderr.trim()}`);
  }
  const loaded = spawnSync('launchctl', ['bootstrap', domain, plistPath], { encoding: 'utf8' });
  if (loaded.status !== 0) throw new Error(`Could not load LaunchAgent: ${loaded.stderr.trim()}`);
  console.log(`Installed ${options.label}`);
  console.log(`  Plist: ${plistPath}`);
  console.log(`  Status: launchctl print ${service}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`install-monitor-launchd: ${error.message}`);
    process.exitCode = 1;
  });
}
