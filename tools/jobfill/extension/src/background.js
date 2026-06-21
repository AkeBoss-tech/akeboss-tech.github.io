/* background.js — service worker. Bridges the side panel to the native
 * messaging host, which runs the claude/codex CLI on your machine. */

const HOST = "com.akash.jobfill"; // must match the native host manifest name

chrome.action.onClicked.addListener(async (tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "JOBFILL_GENERATE") {
    // msg: { kind: 'cover_letter'|'cover_letter_short'|'answer', prompt, context }
    chrome.runtime.sendNativeMessage(HOST, {
      action: "generate",
      kind: msg.kind,
      prompt: msg.prompt,
      context: msg.context, // { company, role, jd, profileSummary, question }
      runner: msg.runner || "claude", // 'claude' | 'codex'
    }, (resp) => {
      if (chrome.runtime.lastError) { sendResponse({ error: chrome.runtime.lastError.message }); return; }
      sendResponse(resp); // { text } or { error }
    });
    return true; // async
  }

  if (msg.type === "JOBFILL_GENERATE_ALL") {
    // Whole-form fill: send every field (with dropdown options) to the agent.
    chrome.runtime.sendNativeMessage(HOST, {
      action: "generate_all",
      fields: msg.fields,
      context: msg.context,
      model: msg.model || "claude-haiku-4-5-20251001",
      runner: msg.runner || "claude",
    }, (resp) => {
      sendResponse(chrome.runtime.lastError ? { error: chrome.runtime.lastError.message } : resp);
    });
    return true; // async
  }

  if (msg.type === "JOBFILL_TAILOR_RESUME") {
    // Ask the runner to compile a tailored resume variant -> returns a path/status.
    chrome.runtime.sendNativeMessage(HOST, {
      action: "tailor_resume",
      context: msg.context, // { company, role, jd, variant }
    }, (resp) => {
      sendResponse(chrome.runtime.lastError ? { error: chrome.runtime.lastError.message } : resp);
    });
    return true;
  }
});
