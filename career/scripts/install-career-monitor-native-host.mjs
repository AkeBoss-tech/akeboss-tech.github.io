#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { access, chmod, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { constants as fsConstants, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { HOST_NAME } from './career-monitor-native-host.mjs';

const CAREER_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EXTENSION_DIR = join(CAREER_DIR, 'chrome-extension');
const EXTENSION_MANIFEST = join(EXTENSION_DIR, 'manifest.json');
const HOST_SCRIPT = join(CAREER_DIR, 'scripts', 'career-monitor-native-host.mjs');
const homebrewPrefix = process.execPath.includes('/Cellar/')
  ? process.execPath.slice(0, process.execPath.indexOf('/Cellar/'))
  : null;
const stableHomebrewNode = homebrewPrefix ? join(homebrewPrefix, 'bin', 'node') : null;
const DEFAULT_NODE_PATH = stableHomebrewNode && existsSync(stableHomebrewNode)
  ? stableHomebrewNode
  : process.execPath;
const BROWSER_DIRECTORIES = {
  chrome: join('Google', 'Chrome'),
  'chrome-beta': join('Google', 'Chrome Beta'),
  'chrome-canary': join('Google', 'Chrome Canary'),
  chromium: 'Chromium',
};

function parseArgs(argv) {
  const options = { browser: 'chrome', install: false, uninstall: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = () => {
      index += 1;
      if (!argv[index]) throw new Error(`${argument} requires a value`);
      return argv[index];
    };
    if (argument === '--install') options.install = true;
    else if (argument === '--uninstall') options.uninstall = true;
    else if (argument === '--browser') options.browser = next();
    else if (argument === '--extension-id') options.extensionId = next();
    else if (argument === '--node-path') options.nodePath = resolve(next());
    else if (argument === '--help' || argument === '-h') options.help = true;
    else throw new Error(`Unknown option: ${argument}`);
  }
  if (options.install && options.uninstall) throw new Error('--install and --uninstall are mutually exclusive');
  if (!Object.hasOwn(BROWSER_DIRECTORIES, options.browser)) {
    throw new Error(`Unsupported browser: ${options.browser}`);
  }
  return options;
}

export function deriveChromeExtensionId(manifestKey) {
  if (!manifestKey || typeof manifestKey !== 'string') throw new Error('Chrome manifest key is missing');
  const decoded = Buffer.from(manifestKey, 'base64');
  if (!decoded.length || decoded.toString('base64').replace(/=+$/, '') !== manifestKey.replace(/=+$/, '')) {
    throw new Error('Chrome manifest key is not valid base64');
  }
  const digest = createHash('sha256').update(decoded).digest().subarray(0, 16);
  return [...digest]
    .map((byte) => String.fromCharCode(97 + (byte >> 4), 97 + (byte & 15)))
    .join('');
}

export function validateExtensionId(extensionId) {
  if (!/^[a-p]{32}$/.test(String(extensionId))) {
    throw new Error('extension ID must contain exactly 32 letters in the range a-p');
  }
  return String(extensionId);
}

export function renderNativeHostManifest({ extensionId, wrapperPath }) {
  return `${JSON.stringify({
    name: HOST_NAME,
    description: 'Local deterministic Career Monitor bridge',
    path: resolve(wrapperPath),
    type: 'stdio',
    allowed_origins: [`chrome-extension://${validateExtensionId(extensionId)}/`],
  }, null, 2)}\n`;
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", `'\\''`)}'`;
}

export function renderHostWrapper({ nodePath, hostScript = HOST_SCRIPT }) {
  return `#!/bin/sh\nexec ${shellQuote(resolve(nodePath))} ${shellQuote(resolve(hostScript))}\n`;
}

async function atomicWrite(path, contents, mode) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, contents, { encoding: 'utf8', mode });
  await chmod(temporary, mode);
  await rename(temporary, path);
}

async function pathsFor(options) {
  const applicationSupport = join(homedir(), 'Library', 'Application Support');
  const manifestDirectory = join(
    applicationSupport,
    BROWSER_DIRECTORIES[options.browser],
    'NativeMessagingHosts',
  );
  const runtimeDirectory = join(applicationSupport, 'Career Ops', 'native-messaging');
  const extensionManifest = JSON.parse(await readFile(EXTENSION_MANIFEST, 'utf8'));
  const derivedId = deriveChromeExtensionId(extensionManifest.key);
  const extensionId = validateExtensionId(options.extensionId ?? derivedId);
  return {
    derivedId,
    extensionId,
    extensionDir: EXTENSION_DIR,
    manifestPath: join(manifestDirectory, `${HOST_NAME}.json`),
    wrapperPath: join(runtimeDirectory, `${HOST_NAME}.${options.browser}`),
  };
}

export async function installerMain(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) {
    process.stdout.write(`Usage: node scripts/install-career-monitor-native-host.mjs [options]

Without --install or --uninstall, prints the exact paths and IDs without changing files.

Options:
  --install             Install the per-user native host manifest and wrapper
  --uninstall           Remove this native host manifest and wrapper
  --browser NAME        chrome, chrome-beta, chrome-canary, or chromium (default: chrome)
  --extension-id ID     Register one explicit valid extension ID (default: derived manifest ID)
  --node-path PATH      Absolute Node.js executable (default: stable detected executable)
  --help                Show this help
`);
    return { exitCode: 0 };
  }
  const paths = await pathsFor(options);
  const nodePath = resolve(options.nodePath ?? DEFAULT_NODE_PATH);
  await access(nodePath, fsConstants.X_OK);

  if (options.uninstall) {
    await Promise.all([paths.manifestPath, paths.wrapperPath].map((path) => (
      unlink(path).catch((error) => {
        if (error?.code !== 'ENOENT') throw error;
      })
    )));
    console.log(`Removed ${HOST_NAME} for ${options.browser}.`);
    return { exitCode: 0, ...paths };
  }

  const preview = {
    browser: options.browser,
    extension_id: paths.extensionId,
    derived_extension_id: paths.derivedId,
    extension_directory: paths.extensionDir,
    native_manifest: paths.manifestPath,
    native_wrapper: paths.wrapperPath,
    node: nodePath,
  };
  if (!options.install) {
    process.stdout.write(`${JSON.stringify(preview, null, 2)}\n`);
    return { exitCode: 0, ...paths };
  }

  await access(HOST_SCRIPT, fsConstants.R_OK);
  await atomicWrite(paths.wrapperPath, renderHostWrapper({ nodePath }), 0o700);
  await atomicWrite(paths.manifestPath, renderNativeHostManifest({
    extensionId: paths.extensionId,
    wrapperPath: paths.wrapperPath,
  }), 0o600);
  console.log(`Installed ${HOST_NAME} for ${options.browser}.`);
  console.log(`  Extension ID: ${paths.extensionId}`);
  console.log(`  Load unpacked: ${paths.extensionDir}`);
  console.log(`  Native manifest: ${paths.manifestPath}`);
  return { exitCode: 0, ...paths };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  installerMain().then(({ exitCode = 0 }) => {
    process.exitCode = exitCode;
  }).catch((error) => {
    console.error(`install-career-monitor-native-host: ${error.message}`);
    process.exitCode = 1;
  });
}
