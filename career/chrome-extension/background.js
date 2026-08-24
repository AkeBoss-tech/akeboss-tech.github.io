import { extractVisibleJob } from './capture-page.js';
import { DUE_ALARM, DUE_ALARM_MINUTES } from './contract.js';
import { nativeRequest } from './native-client.js';

let dueLaunchInFlight = null;

async function ensureDueAlarm() {
  const alarm = await chrome.alarms.get(DUE_ALARM);
  if (!alarm || alarm.periodInMinutes !== DUE_ALARM_MINUTES) {
    await chrome.alarms.clear(DUE_ALARM);
    chrome.alarms.create(DUE_ALARM, {
      delayInMinutes: 1,
      periodInMinutes: DUE_ALARM_MINUTES,
    });
  }
}

async function updateBadge(dashboard) {
  const count = Math.max(0, Number(dashboard?.summary?.new_relevant_jobs ?? 0));
  await chrome.action.setBadgeBackgroundColor({ color: count > 0 ? '#0f766e' : '#64748b' });
  await chrome.action.setBadgeText({ text: count > 0 ? String(Math.min(count, 999)) : '' });
}

async function refreshDashboard() {
  const dashboard = await nativeRequest('get_status');
  await updateBadge(dashboard);
  return dashboard;
}

async function rememberError(error) {
  return String(error?.message ?? error).slice(0, 500);
}

async function runDue(reason) {
  if (dueLaunchInFlight) return dueLaunchInFlight;
  dueLaunchInFlight = (async () => {
    return nativeRequest('run_due', { reason });
  })();
  try {
    return await dueLaunchInFlight;
  } finally {
    dueLaunchInFlight = null;
  }
}

async function captureCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) throw new Error('No active tab is available.');
  const [injection] = await chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: false },
    func: extractVisibleJob,
  });
  if (!injection?.result) throw new Error('The visible page did not return job metadata.');
  return nativeRequest('capture_visible_job', injection.result);
}

chrome.runtime.onInstalled.addListener(() => {
  void ensureDueAlarm();
  void refreshDashboard().catch(rememberError);
});

chrome.runtime.onStartup.addListener(() => {
  void ensureDueAlarm();
  void refreshDashboard().catch(rememberError);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== DUE_ALARM) return;
  void runDue('alarm')
    .then(() => refreshDashboard())
    .catch(rememberError);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const respond = async () => {
    if (message?.type === 'get_dashboard') {
      return { ok: true, data: await refreshDashboard() };
    }
    if (message?.type === 'run_due') {
      return { ok: true, data: await runDue('manual') };
    }
    if (message?.type === 'capture_visible_job') {
      return { ok: true, data: await captureCurrentTab() };
    }
    throw new Error('Unsupported extension action.');
  };
  respond()
    .then(sendResponse)
    .catch(async (error) => {
      const messageText = await rememberError(error);
      sendResponse({ ok: false, error: messageText });
    });
  return true;
});

void ensureDueAlarm();
