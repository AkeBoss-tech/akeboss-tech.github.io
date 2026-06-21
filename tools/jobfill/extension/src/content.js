/* content.js — runs on application pages. Uses the pure mapper to decide what
 * to fill, then performs the actual DOM fill + review tagging. Never submits. */

if (window.__jobfillContentLoaded) { /* re-injection: no-op, listener already registered */ }
else {
window.__jobfillContentLoaded = true;

// React/Vue controlled inputs ignore plain .value assignment; use the native
// setter then dispatch input+change so the framework's state updates.
function setNativeValue(el, value) {
  const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
  setter.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

function fillSelect(el, value) {
  const want = String(value).toLowerCase();
  const opt = [...el.options].find(o =>
    o.textContent.toLowerCase().includes(want) || want.includes(o.textContent.toLowerCase().trim()));
  if (opt) { el.value = opt.value; el.dispatchEvent(new Event("change", { bubbles: true })); return true; }
  return false;
}

function run(profile) {
  const { platform, plan } = window.JobFill.planFill(profile, document, window);
  const results = [];
  for (const p of plan) {
    let status = p.status;
    if (p.el && p.value != null && p.tag !== "you") {
      if (p.el.tagName === "SELECT") status = fillSelect(p.el, p.value) ? "filled" : "needs-you";
      else if (p.el.type === "checkbox" || p.el.type === "radio") status = "needs-you"; // yes/no + EEO -> review
      else { setNativeValue(p.el, p.value); status = "filled"; }
      p.el.style.outline = p.tag === "auto" ? "2px solid #16a34a" : "2px solid #d97706";
    }
    results.push({ el: p.el, label: p.label, key: p.key, tag: p.tag, value: p.value, status });
  }
  window.__jobfill = results;
  return { platform, results };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "JOBFILL_PING") { sendResponse({ ok: true }); return; }
  if (msg.type === "JOBFILL_RUN") {
    chrome.storage.local.get("profile").then(({ profile }) => {
      if (!profile) { sendResponse({ error: "No profile loaded. Import profile.json in the side panel." }); return; }
      const out = run(profile);
      sendResponse({
        platform: out.platform,
        results: out.results.map((r, i) => ({ i, label: r.label, key: r.key, tag: r.tag, value: r.value, status: r.status })),
      });
    });
    return true; // async
  }
  if (msg.type === "JOBFILL_INSERT_DRAFT") {
    const r = (window.__jobfill || [])[msg.i];
    if (r && r.el) { setNativeValue(r.el, msg.text); r.el.style.outline = "2px solid #2563eb"; r.status = "drafted-inserted"; sendResponse({ ok: true }); }
    else sendResponse({ ok: false });
  }
  if (msg.type === "JOBFILL_SCROLL_TO") {
    const r = (window.__jobfill || [])[msg.i];
    if (r && r.el) { r.el.scrollIntoView({ behavior: "smooth", block: "center" }); r.el.focus(); }
    sendResponse({ ok: true });
  }
});

} // end re-injection guard
