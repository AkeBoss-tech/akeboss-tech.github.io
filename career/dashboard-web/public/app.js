'use strict';

const REFRESH_INTERVAL_MS = 30_000;
const PAGE_SIZE = 25;

const state = {
  dashboard: null,
  filteredRoles: [],
  visibleCount: PAGE_SIZE,
  loading: false,
  lastLoadedAt: 0,
  controller: null,
};

const elements = Object.fromEntries([
  'health-pill', 'health-label', 'freshness-copy', 'refresh-button', 'refresh-label',
  'live-status', 'loading-state', 'error-state', 'error-message', 'retry-button',
  'dashboard-content', 'scan-note', 'kpi-relevant', 'kpi-open', 'kpi-new',
  'kpi-new-label', 'kpi-new-detail', 'kpi-deterministic', 'kpi-deterministic-detail',
  'kpi-agent', 'results-count',
  'filter-form', 'search-input', 'track-filter', 'level-filter', 'workplace-filter',
  'source-filter', 'tier-filter', 'new-filter', 'clear-filters', 'jobs-body',
  'new-filter-label', 'jobs-empty', 'load-more-wrap', 'load-more-button', 'load-more-copy', 'track-chart',
  'trend-chart', 'workplace-chart', 'company-chart', 'quality-list', 'source-total',
  'health-breakdown', 'queue-summary', 'agent-list', 'agent-empty',
].map((id) => [id, document.getElementById(id)]));

const integerFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function integer(value, fallback = 0) {
  return Math.max(0, Math.trunc(number(value, fallback)));
}

function text(value, fallback = 'Unknown') {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function formatNumber(value) {
  return integerFormatter.format(integer(value));
}

function formatPercent(value) {
  return `${percentFormatter.format(Math.max(0, Math.min(100, number(value))))}%`;
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatRelative(value) {
  const date = parseDate(value);
  if (!date) return 'time unavailable';
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(seconds);
  if (absoluteSeconds < 60) return relativeFormatter.format(seconds, 'second');
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return relativeFormatter.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, 'hour');
  const days = Math.round(hours / 24);
  return relativeFormatter.format(days, 'day');
}

function formatDate(value, options = {}) {
  const date = parseDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date);
}

function formatDateTime(value) {
  const date = parseDate(value);
  if (!date) return 'time unavailable';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(date);
}

function titleCase(value) {
  return text(value, 'Unknown')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function safeExternalUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function clampPercent(value) {
  return `${Math.max(0, Math.min(100, number(value))).toFixed(2)}%`;
}

function clear(node) {
  node.replaceChildren();
}

function appendTextElement(parent, tagName, className, value) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  node.textContent = value;
  parent.append(node);
  return node;
}

function announce(message) {
  elements['live-status'].textContent = '';
  window.setTimeout(() => {
    elements['live-status'].textContent = message;
  }, 20);
}

function normalizeDashboard(payload) {
  const root = asObject(payload);
  return {
    generatedAt: root.generatedAt ?? null,
    freshness: asObject(root.freshness),
    kpis: asObject(root.kpis),
    quality: asObject(root.quality),
    mix: asObject(root.mix),
    firstSeenTrend: asArray(root.firstSeenTrend),
    roles: asArray(root.roles),
    sources: asArray(root.sources),
    escalations: asArray(root.escalations),
    recentRuns: asArray(root.recentRuns),
    meta: asObject(root.meta),
  };
}

function setLoading(loading, initial = false) {
  state.loading = loading;
  elements['refresh-button'].disabled = loading;
  elements['refresh-button'].classList.toggle('is-refreshing', loading);
  elements['refresh-label'].textContent = loading ? 'Refreshing' : 'Refresh data';
  if (initial) elements['loading-state'].hidden = !loading;
}

function showError(error) {
  const message = error instanceof Error ? error.message : 'The monitor did not return usable data.';
  elements['loading-state'].hidden = true;
  elements['error-state'].hidden = false;
  elements['error-message'].textContent = message;
  elements['health-pill'].className = 'status-pill status-pill--error';
  elements['health-label'].textContent = 'Update failed';
  if (state.dashboard) {
    elements['freshness-copy'].textContent = 'Showing the last successful update';
    announce('Refresh failed. The last successful dashboard data remains visible.');
  } else {
    elements['dashboard-content'].hidden = true;
    elements['freshness-copy'].textContent = 'Live data unavailable';
    announce('Dashboard data could not be loaded.');
  }
}

async function loadDashboard({ manual = false } = {}) {
  if (state.loading) return;
  if (state.controller) state.controller.abort();
  state.controller = new AbortController();
  setLoading(true, !state.dashboard);

  try {
    const response = await fetch('/api/dashboard', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: state.controller.signal,
    });
    if (!response.ok) throw new Error(`Dashboard request failed (${response.status})`);
    const payload = await response.json();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('The monitor returned an invalid dashboard response.');
    }
    state.dashboard = normalizeDashboard(payload);
    state.lastLoadedAt = Date.now();
    elements['error-state'].hidden = true;
    elements['loading-state'].hidden = true;
    elements['dashboard-content'].hidden = false;
    renderDashboard(state.dashboard);
    announce(manual ? 'Dashboard refreshed.' : 'Dashboard data updated.');
  } catch (error) {
    if (error?.name !== 'AbortError') showError(error);
  } finally {
    setLoading(false);
  }
}

async function pollDashboard() {
  if (state.loading || !state.dashboard) return loadDashboard();
  try {
    const response = await fetch('/api/health', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Dashboard health request failed (${response.status})`);
    const update = asObject(await response.json());
    if (update.dataVersion !== state.dashboard.meta.dataVersion) {
      await loadDashboard();
      return;
    }
    state.dashboard = {
      ...state.dashboard,
      generatedAt: update.generatedAt ?? state.dashboard.generatedAt,
      freshness: asObject(update.freshness),
      kpis: asObject(update.kpis),
    };
    state.lastLoadedAt = Date.now();
    elements['error-state'].hidden = true;
    renderHeader(state.dashboard);
    renderKpis(state.dashboard);
    if (elements['new-filter'].checked && state.dashboard.meta.newThisScanRoleMembershipAvailable !== true) {
      filterRoles();
    }
  } catch (error) {
    showError(error);
  }
}

function deriveHealth(dashboard) {
  const { freshness, kpis } = dashboard;
  const rawStatus = text(freshness.status, 'unknown').toLowerCase();
  const deterministic = integer(kpis.deterministicSources);
  const healthy = integer(kpis.healthySources);
  const due = integer(kpis.dueSources);
  const escalations = integer(kpis.openEscalations);

  if (['error', 'failed', 'unavailable'].includes(rawStatus)) {
    return { state: 'error', label: 'Monitor issue' };
  }
  if (['stale', 'warning', 'degraded'].includes(rawStatus) || due > 0 || escalations > 0 || healthy < deterministic) {
    return { state: 'warning', label: rawStatus === 'stale' ? 'Data is stale' : 'Needs attention' };
  }
  return { state: 'healthy', label: 'Monitor healthy' };
}

function renderHeader(dashboard) {
  const health = deriveHealth(dashboard);
  const { freshness, kpis } = dashboard;
  const updatedAt = freshness.jobsUpdatedAt ?? freshness.latestScanCompletedAt ?? dashboard.generatedAt;
  const deterministic = integer(kpis.deterministicSources);
  const healthy = integer(kpis.healthySources);
  elements['health-pill'].className = `status-pill status-pill--${health.state}`;
  elements['health-label'].textContent = health.label;

  const sourceCopy = deterministic > 0 ? ` · ${formatNumber(healthy)} of ${formatNumber(deterministic)} feeds healthy` : '';
  elements['freshness-copy'].textContent = `Updated ${formatRelative(updatedAt)}${sourceCopy}`;
  elements['scan-note'].textContent = `Latest scan ${formatDateTime(freshness.latestScanCompletedAt ?? updatedAt)}`;
}

function renderKpis(dashboard) {
  const { kpis } = dashboard;
  elements['kpi-relevant'].textContent = formatNumber(kpis.relevantOpenJobs);
  elements['kpi-open'].textContent = formatNumber(kpis.openJobs);
  const hasExactNew = Number.isFinite(Number(kpis.newRelevantThisScan));
  const newThisScan = hasExactNew ? kpis.newRelevantThisScan : kpis.newRelevant24h;
  elements['kpi-new'].textContent = formatNumber(newThisScan);
  elements['kpi-new-label'].textContent = hasExactNew ? 'New this scan' : 'New in 24 hours';
  elements['kpi-new-detail'].textContent = hasExactNew
    ? 'New relevant opportunities'
    : 'Relevant roles first seen today';
  elements['kpi-deterministic'].textContent = formatNumber(kpis.deterministicSources);
  elements['kpi-agent'].textContent = formatNumber(kpis.agentRequiredSources);
  const healthy = integer(kpis.healthySources);
  const deterministic = integer(kpis.deterministicSources);
  elements['kpi-deterministic-detail'].textContent = deterministic
    ? `${formatNumber(healthy)} currently healthy`
    : 'Programmatic company feeds';
}

function uniqueSorted(values) {
  return [...new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }));
}

function getLocationLabels(role) {
  return asArray(role.locations).map((location) => {
    if (typeof location === 'string') return location.trim();
    const item = asObject(location);
    return text(item.label ?? item.name ?? [item.city, item.region, item.country].filter(Boolean).join(', '), '');
  }).filter(Boolean);
}

function roleTracks(role) {
  return asArray(role.tracks).map((track) => text(track, '')).filter(Boolean);
}

function roleIsNew(role) {
  return role.isNewThisScan === true;
}

function roleMatchesRecencyFilter(role) {
  if (state.dashboard?.meta?.newThisScanRoleMembershipAvailable === true) return roleIsNew(role);
  const firstSeen = parseDate(role.firstSeenAt);
  if (!firstSeen) return false;
  const age = Date.now() - firstSeen.getTime();
  return age >= 0 && age <= 24 * 60 * 60 * 1000;
}

function populateSelect(select, values, defaultLabel) {
  const selected = select.value;
  clear(select);
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = defaultLabel;
  select.append(defaultOption);
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = titleCase(value);
    select.append(option);
  });
  if (values.includes(selected)) select.value = selected;
}

function populateFilters(roles) {
  populateSelect(elements['track-filter'], uniqueSorted(roles.flatMap(roleTracks)), 'All tracks');
  populateSelect(elements['level-filter'], uniqueSorted(roles.map((role) => role.level)), 'All levels');
  populateSelect(elements['workplace-filter'], uniqueSorted(roles.map((role) => role.workplaceType)), 'Any workplace');
  populateSelect(elements['source-filter'], uniqueSorted(roles.map((role) => role.sourceType)), 'All sources');
  populateSelect(elements['tier-filter'], uniqueSorted(roles.map((role) => role.tier)), 'Any tier');

  const exactMembership = state.dashboard?.meta?.newThisScanRoleMembershipAvailable === true;
  elements['new-filter'].disabled = false;
  elements['new-filter-label'].textContent = exactMembership ? 'New this scan' : 'First seen in 24h';
  elements['new-filter'].closest('label').title = exactMembership
    ? ''
    : text(state.dashboard?.meta?.newThisScanRoleMembershipReason, 'Exact per-role scan membership is unavailable');
}

function filterRoles() {
  const dashboard = state.dashboard;
  if (!dashboard) return;
  const query = elements['search-input'].value.trim().toLocaleLowerCase();
  const track = elements['track-filter'].value;
  const level = elements['level-filter'].value;
  const workplace = elements['workplace-filter'].value;
  const source = elements['source-filter'].value;
  const tier = elements['tier-filter'].value;
  const onlyNew = elements['new-filter'].checked;

  state.filteredRoles = dashboard.roles.filter((role) => {
    const tracks = roleTracks(role);
    const searchable = [
      role.title, role.company, role.level, role.workplaceType, role.sourceType, role.tier,
      role.employmentType, ...tracks, ...getLocationLabels(role),
    ].map((value) => String(value ?? '').toLocaleLowerCase()).join(' ');

    return (!query || searchable.includes(query))
      && (!track || tracks.includes(track))
      && (!level || role.level === level)
      && (!workplace || role.workplaceType === workplace)
      && (!source || role.sourceType === source)
      && (!tier || role.tier === tier)
      && (!onlyNew || roleMatchesRecencyFilter(role));
  });

  renderRoles();
}

function appendJobRow(role) {
  const row = document.createElement('tr');

  const roleCell = document.createElement('td');
  roleCell.className = 'role-cell';
  const roleTitle = document.createElement('p');
  roleTitle.className = 'role-title';
  const titleNode = document.createElement('span');
  titleNode.textContent = text(role.title, 'Untitled role');
  roleTitle.append(titleNode);
  if (roleIsNew(role)) appendTextElement(roleTitle, 'span', 'new-badge', 'New');
  roleCell.append(roleTitle);
  appendTextElement(roleCell, 'p', 'company-name', text(role.company));
  row.append(roleCell);

  const locationCell = document.createElement('td');
  const locations = getLocationLabels(role);
  appendTextElement(locationCell, 'p', '', locations[0] ?? 'Location not listed');
  const extraLocations = locations.length > 1 ? ` +${locations.length - 1} more` : '';
  appendTextElement(locationCell, 'p', 'cell-secondary', `${titleCase(role.workplaceType)}${extraLocations}`);
  row.append(locationCell);

  const trackCell = document.createElement('td');
  const tracks = roleTracks(role);
  appendTextElement(trackCell, 'span', 'tag tag--track', titleCase(tracks[0] ?? 'Unclassified'));
  if (role.tier) appendTextElement(trackCell, 'span', 'tag tag--tier', titleCase(role.tier));
  if (tracks.length > 1) appendTextElement(trackCell, 'p', 'cell-secondary', `+${tracks.length - 1} track${tracks.length > 2 ? 's' : ''}`);
  row.append(trackCell);

  const levelCell = document.createElement('td');
  levelCell.textContent = titleCase(role.level);
  row.append(levelCell);

  const sourceCell = document.createElement('td');
  appendTextElement(sourceCell, 'span', 'tag', titleCase(role.sourceType));
  if (role.sourceBoard) appendTextElement(sourceCell, 'p', 'cell-secondary', text(role.sourceBoard));
  row.append(sourceCell);

  const firstSeenCell = document.createElement('td');
  firstSeenCell.textContent = formatRelative(role.firstSeenAt);
  firstSeenCell.title = formatDateTime(role.firstSeenAt);
  row.append(firstSeenCell);

  const linkCell = document.createElement('td');
  const href = safeExternalUrl(role.applyUrl) ?? safeExternalUrl(role.canonicalUrl);
  if (href) {
    const link = document.createElement('a');
    link.className = 'job-link';
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '↗';
    link.setAttribute('aria-label', `Open ${text(role.title, 'job')} at ${text(role.company)} in a new tab`);
    linkCell.append(link);
  } else {
    linkCell.textContent = '—';
  }
  row.append(linkCell);

  elements['jobs-body'].append(row);
}

function renderRoles() {
  const total = state.filteredRoles.length;
  const visible = state.filteredRoles.slice(0, state.visibleCount);
  clear(elements['jobs-body']);
  visible.forEach(appendJobRow);
  elements['jobs-empty'].hidden = total !== 0;
  elements['results-count'].textContent = `${formatNumber(total)} role${total === 1 ? '' : 's'}`;
  elements['load-more-wrap'].hidden = total === 0 || visible.length >= total;
  elements['load-more-copy'].textContent = `Showing ${formatNumber(visible.length)} of ${formatNumber(total)}`;
}

function emptyChart(container, message = 'No data is available for this view.') {
  clear(container);
  appendTextElement(container, 'p', 'chart-empty', message);
}

function normalizeMixItems(items) {
  return asArray(items).map((item) => {
    const object = asObject(item);
    return {
      key: text(object.key ?? object.label, 'Unknown'),
      label: text(object.label ?? object.key, 'Unknown'),
      count: integer(object.count),
    };
  }).filter((item) => item.count > 0).sort((left, right) => right.count - left.count);
}

function renderBarChart(container, items, limit = 7) {
  clear(container);
  const displayed = normalizeMixItems(items).slice(0, limit);
  if (!displayed.length) {
    emptyChart(container);
    return;
  }
  const maximum = Math.max(...displayed.map((item) => item.count), 1);
  displayed.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.setAttribute('aria-label', `${item.label}: ${formatNumber(item.count)} roles`);
    appendTextElement(row, 'span', 'bar-label', item.label);
    const track = document.createElement('div');
    track.className = 'bar-track';
    track.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.setProperty('--bar-width', clampPercent((item.count / maximum) * 100));
    track.append(fill);
    row.append(track);
    appendTextElement(row, 'span', 'bar-value', formatNumber(item.count));
    container.append(row);
  });
}

function renderTrend(items) {
  const container = elements['trend-chart'];
  clear(container);
  const points = asArray(items).map((item) => {
    const object = asObject(item);
    return { date: object.date, count: integer(object.count) };
  }).filter((item) => item.date).slice(-14);
  if (!points.length) {
    emptyChart(container, 'First-seen history will appear after scan data accumulates.');
    return;
  }
  const maximum = Math.max(...points.map((point) => point.count), 1);
  const bars = document.createElement('div');
  bars.className = 'trend-bars';
  bars.setAttribute('role', 'img');
  const accessiblePoints = points
    .map((point) => `${formatDate(point.date, { year: 'numeric' })}: ${formatNumber(point.count)}`)
    .join('; ');
  bars.setAttribute('aria-label', `New relevant jobs by day. ${accessiblePoints}. Peak: ${formatNumber(maximum)}.`);
  points.forEach((point) => {
    const column = document.createElement('div');
    column.className = 'trend-column';
    column.title = `${formatDate(point.date, { year: 'numeric' })}: ${formatNumber(point.count)}`;
    const bar = document.createElement('div');
    bar.className = 'trend-bar';
    bar.style.setProperty('--bar-height', clampPercent((point.count / maximum) * 100));
    bar.setAttribute('aria-hidden', 'true');
    column.append(bar);
    appendTextElement(column, 'span', 'trend-label', formatDate(point.date));
    bars.append(column);
  });
  container.append(bars);
}

function topCompanies(roles) {
  const counts = new Map();
  roles.forEach((role) => {
    const company = text(role.company);
    counts.set(company, (counts.get(company) ?? 0) + 1);
  });
  return [...counts.entries()]
    .map(([label, count]) => ({ key: label, label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

function renderQuality(quality) {
  const container = elements['quality-list'];
  clear(container);
  const coverage = asArray(quality.coverage);
  if (!coverage.length) {
    emptyChart(container, 'Coverage metrics are not available yet.');
    return;
  }
  coverage.forEach((entry) => {
    const item = asObject(entry);
    const total = integer(item.total);
    const count = integer(item.count);
    const percent = Number.isFinite(Number(item.percent))
      ? Math.max(0, Math.min(100, Number(item.percent)))
      : total > 0 ? (count / total) * 100 : 0;
    const row = document.createElement('div');
    row.className = 'quality-row';
    const header = document.createElement('div');
    header.className = 'quality-row-header';
    appendTextElement(header, 'span', 'quality-label', text(item.label ?? item.key));
    appendTextElement(header, 'span', 'quality-value', `${formatPercent(percent)} · ${formatNumber(count)} of ${formatNumber(total)}`);
    row.append(header);
    const track = document.createElement('div');
    track.className = 'quality-track';
    track.setAttribute('role', 'progressbar');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '100');
    track.setAttribute('aria-valuenow', String(Math.round(percent)));
    track.setAttribute('aria-label', `${text(item.label ?? item.key)} coverage`);
    const fill = document.createElement('div');
    fill.className = `quality-fill${percent < 50 ? ' quality-fill--low' : ''}`;
    fill.style.setProperty('--quality-width', clampPercent(percent));
    track.append(fill);
    row.append(track);
    container.append(row);
  });
}

function healthTone(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes('healthy') || normalized === 'ok') return 'healthy';
  if (normalized.includes('fail') || normalized.includes('error') || normalized.includes('suspicious')) return 'error';
  return 'warning';
}

function renderSourceHealth(dashboard) {
  const sourceCounts = new Map();
  dashboard.sources.forEach((source) => {
    const health = text(source.health, source.supported === false ? 'agent required' : 'unknown');
    sourceCounts.set(health, (sourceCounts.get(health) ?? 0) + 1);
  });
  const entries = [...sourceCounts.entries()].sort((left, right) => {
    const order = { healthy: 0, ok: 0, due: 1, new: 1, agent_required: 2, failed: 3, error: 3 };
    return (order[left[0]] ?? 2) - (order[right[0]] ?? 2) || right[1] - left[1];
  });

  elements['source-total'].textContent = `${formatNumber(dashboard.sources.length || dashboard.kpis.monitoredCompanies)} sources`;
  clear(elements['health-breakdown']);
  if (!entries.length) {
    emptyChart(elements['health-breakdown'], 'Source health has not been reported.');
  } else {
    entries.forEach(([label, count]) => {
      const card = document.createElement('div');
      card.className = `health-card health-card--${healthTone(label)}`;
      appendTextElement(card, 'p', 'health-card-value', formatNumber(count));
      appendTextElement(card, 'p', 'health-card-label', titleCase(label));
      elements['health-breakdown'].append(card);
    });
  }

  renderAgentQueue(dashboard);
}

function renderAgentQueue(dashboard) {
  const seen = new Set();
  const queue = [];
  dashboard.escalations.forEach((escalation) => {
    const item = asObject(escalation);
    const id = text(item.sourceId ?? item.id, `escalation-${queue.length}`);
    if (seen.has(id)) return;
    seen.add(id);
    queue.push({
      id,
      company: text(item.company),
      reason: text(item.lastError ?? item.kind, 'Source requires agent review'),
      state: text(item.severity ?? item.kind, 'Open'),
    });
  });
  dashboard.sources.filter((source) => source.supported === false).forEach((source) => {
    const item = asObject(source);
    const id = text(item.id, `source-${queue.length}`);
    if (seen.has(id)) return;
    seen.add(id);
    queue.push({
      id,
      company: text(item.company),
      reason: text(item.lastError, `${titleCase(item.connector)} needs a guided extraction pass`),
      state: 'Agent required',
    });
  });

  clear(elements['agent-list']);
  elements['agent-empty'].hidden = queue.length !== 0;
  elements['queue-summary'].textContent = queue.length
    ? `${formatNumber(queue.length)} source${queue.length === 1 ? '' : 's'} need a guided pass.`
    : 'No complex sources currently need attention.';
  queue.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.className = 'agent-item';
    const copy = document.createElement('div');
    appendTextElement(copy, 'p', 'agent-company', item.company);
    appendTextElement(copy, 'p', 'agent-reason', item.reason);
    listItem.append(copy);
    appendTextElement(listItem, 'span', 'agent-state', titleCase(item.state));
    elements['agent-list'].append(listItem);
  });
}

function renderDashboard(dashboard) {
  renderHeader(dashboard);
  renderKpis(dashboard);
  populateFilters(dashboard.roles);
  state.visibleCount = PAGE_SIZE;
  filterRoles();
  renderBarChart(elements['track-chart'], dashboard.mix.tracks);
  renderTrend(dashboard.firstSeenTrend);
  renderBarChart(elements['workplace-chart'], dashboard.mix.workplace, 5);
  renderBarChart(elements['company-chart'], topCompanies(dashboard.roles), 8);
  renderQuality(dashboard.quality);
  renderSourceHealth(dashboard);
}

function resetFilters() {
  elements['filter-form'].reset();
  state.visibleCount = PAGE_SIZE;
  filterRoles();
  elements['search-input'].focus();
  announce('Job filters cleared.');
}

elements['refresh-button'].addEventListener('click', () => loadDashboard({ manual: true }));
elements['retry-button'].addEventListener('click', () => loadDashboard({ manual: true }));
elements['clear-filters'].addEventListener('click', resetFilters);
elements['load-more-button'].addEventListener('click', () => {
  state.visibleCount += PAGE_SIZE;
  renderRoles();
  announce(`Showing ${formatNumber(Math.min(state.visibleCount, state.filteredRoles.length))} roles.`);
});

elements['filter-form'].addEventListener('submit', (event) => event.preventDefault());
elements['filter-form'].addEventListener('input', () => {
  state.visibleCount = PAGE_SIZE;
  filterRoles();
});
elements['filter-form'].addEventListener('change', () => {
  state.visibleCount = PAGE_SIZE;
  filterRoles();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && Date.now() - state.lastLoadedAt >= REFRESH_INTERVAL_MS) {
    pollDashboard();
  }
});

window.setInterval(() => {
  if (document.visibilityState === 'visible') pollDashboard();
}, REFRESH_INTERVAL_MS);

loadDashboard();
