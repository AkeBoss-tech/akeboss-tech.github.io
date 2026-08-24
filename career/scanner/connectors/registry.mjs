import { inferCompanySource } from '../core.mjs';
import { builtinConnectors } from './builtin.mjs';
import { jsonLdConnector } from './jsonld.mjs';
import { hackerNewsConnector } from './hackernews.mjs';
import { personioConnector } from './personio.mjs';
import { pinpointConnector } from './pinpoint.mjs';
import { recruiteeConnector } from './recruitee.mjs';
import { teamtailorConnector } from './teamtailor.mjs';
import { workdayConnector } from './workday.mjs';

const connectors = new Map();

export function registerConnector(connector) {
  if (!connector?.type || typeof connector.describe !== 'function' || typeof connector.scan !== 'function') {
    throw new TypeError('A connector must provide type, describe(), and scan()');
  }
  connectors.set(connector.type, connector);
  return connector;
}

for (const connector of [
  ...builtinConnectors,
  hackerNewsConnector,
  teamtailorConnector,
  pinpointConnector,
  personioConnector,
  recruiteeConnector,
  jsonLdConnector,
  workdayConnector,
]) {
  registerConnector(connector);
}

export function getConnector(type) {
  return connectors.get(type) ?? null;
}

export function listConnectorTypes() {
  return [...connectors.keys()].sort();
}

export function createSourceDescriptor(company) {
  const inferred = inferCompanySource(company);
  if (!inferred) return null;
  const connector = getConnector(inferred.type);
  if (!connector) return null;
  const source = connector.describe(company, inferred);
  return source ? { ...inferred, ...source, type: connector.type } : null;
}

export function inspectSourceDescriptor(company) {
  try {
    const source = createSourceDescriptor(company);
    return {
      source,
      error: source ? null : 'No runnable structured source descriptor could be created',
    };
  } catch (error) {
    return {
      source: null,
      error: `Source descriptor failed: ${error?.message ?? String(error)}`,
    };
  }
}

export const CONNECTOR_REGISTRY = connectors;
