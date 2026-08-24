import { normalizeDashboard, safeHttpsUrl } from './contract.js';

const elements = Object.fromEntries([
  'notice', 'new-relevant', 'scan-time', 'supported', 'agent-required', 'due',
  'due-state', 'escalations', 'health', 'recent', 'relevant-open', 'refresh', 'run-due', 'capture',
].map((id) => [id, document.getElementById(id)]));

function extensionMessage(type) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type }, (response) => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        reject(new Error(runtimeError.message));
        return;
      }
      if (!response?.ok) {
        reject(new Error(response?.error ?? 'The extension background returned an invalid response.'));
        return;
      }
      resolve(response.data ?? {});
    });
  });
}

function formatTime(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'No completed scan yet';
  return `Scan ${new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium', timeStyle: 'short',
  }).format(date)}`;
}

function setNotice(message, state = '') {
  elements.notice.textContent = message;
  elements.notice.className = `notice ${state}`.trim();
}

function renderHealth(health) {
  elements.health.replaceChildren();
  const entries = Object.entries(health).sort(([left], [right]) => left.localeCompare(right));
  if (!entries.length) {
    const empty = document.createElement('span');
    empty.textContent = 'No health data';
    elements.health.append(empty);
    return;
  }
  for (const [state, count] of entries) {
    const chip = document.createElement('span');
    chip.className = state.replace(/[^a-z_-]/gi, '');
    chip.textContent = `${state.replaceAll('_', ' ')} ${count}`;
    elements.health.append(chip);
  }
}

function renderJobs(jobs) {
  elements.recent.replaceChildren();
  const safeJobs = jobs.filter((job) => job.title && safeHttpsUrl(job.url));
  if (!safeJobs.length) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No relevant roles have been recorded yet.';
    elements.recent.append(empty);
    return;
  }
  for (const job of safeJobs) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = safeHttpsUrl(job.url);
    link.target = '_blank';
    link.rel = 'noreferrer';
    const title = document.createElement('span');
    title.className = 'job-title';
    title.textContent = job.title;
    const metadata = document.createElement('span');
    metadata.className = 'job-meta';
    metadata.textContent = [job.company, job.location].filter(Boolean).join(' · ');
    link.append(title, metadata);
    item.append(link);
    elements.recent.append(item);
  }
}

function render(value) {
  const dashboard = normalizeDashboard(value);
  elements['new-relevant'].textContent = String(dashboard.newRelevantJobs);
  elements['scan-time'].textContent = formatTime(dashboard.scanCompletedAt);
  elements.supported.textContent = String(dashboard.supportedSources);
  elements['agent-required'].textContent = String(dashboard.agentRequiredSources);
  elements.due.textContent = String(dashboard.dueSources);
  elements['due-state'].textContent = dashboard.leasedSources > 0
    ? `${dashboard.leasedSources} running`
    : 'due now';
  elements.escalations.textContent = String(dashboard.openEscalations);
  elements['relevant-open'].textContent = `${dashboard.relevantOpenJobs.toLocaleString()} open`;
  renderHealth(dashboard.health);
  renderJobs(dashboard.recentRelevant);
  setNotice(`Updated ${formatTime(dashboard.generatedAt).replace(/^Scan /, '')}`);
}

async function withDisabled(button, action) {
  button.disabled = true;
  try {
    return await action();
  } finally {
    button.disabled = false;
  }
}

async function refresh() {
  setNotice('Refreshing local monitor…');
  try {
    render(await extensionMessage('get_dashboard'));
  } catch (error) {
    setNotice(`${error.message} Install the native host from career/README.md.`, 'error');
  }
}

elements.refresh.addEventListener('click', () => withDisabled(elements.refresh, refresh));
elements['run-due'].addEventListener('click', () => withDisabled(elements['run-due'], async () => {
  setNotice('Starting a due-source monitor run…');
  try {
    await extensionMessage('run_due');
    setNotice('Due-source run started. Source leases prevent duplicate work.', 'success');
    setTimeout(() => void refresh(), 1_500);
  } catch (error) {
    setNotice(error.message, 'error');
  }
}));
elements.capture.addEventListener('click', () => withDisabled(elements.capture, async () => {
  setNotice('Capturing metadata from this visible tab…');
  try {
    const result = await extensionMessage('capture_visible_job');
    setNotice(`Saved manual capture ${String(result.capture_id ?? '').slice(0, 8)} for review.`, 'success');
  } catch (error) {
    setNotice(error.message, 'error');
  }
}));

void refresh();
