/* content.js — runs on application pages. Maps + fills deterministically,
 * tags everything for review, and escalates free-text to the LLM runner.
 * It NEVER clicks submit. */

if (window.__jobfillContentLoaded) { /* re-injection: no-op, listener already registered */ }
else {
window.__jobfillContentLoaded = true;

const { RULES, ATS } = window.JobFill;

// React/Vue controlled inputs ignore plain .value assignment; use the native
// setter then dispatch input+change so the framework's state updates.
function setNativeValue(el, value) {
  const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
  setter.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

// Build a lowercased "signature" from everything that hints at a field's meaning.
function signature(el) {
  const bits = [el.name, el.id, el.placeholder, el.getAttribute("aria-label"), el.autocomplete];
  // associated <label for=id> or wrapping label
  if (el.id) { const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`); if (l) bits.push(l.textContent); }
  const wrap = el.closest("label"); if (wrap) bits.push(wrap.textContent);
  // Greenhouse/Ashby often put the question text in a sibling/ancestor block
  const block = el.closest(".field, .application-question, [class*='question'], [class*='Field']");
  if (block) bits.push(block.querySelector("label, legend, .label")?.textContent || "");
  return bits.filter(Boolean).join(" ").toLowerCase().replace(/\s+/g, " ").trim();
}

function fillSelect(el, value) {
  const want = String(value).toLowerCase();
  const opt = [...el.options].find(o =>
    o.textContent.toLowerCase().includes(want) || want.includes(o.textContent.toLowerCase().trim()));
  if (opt) { el.value = opt.value; el.dispatchEvent(new Event("change", { bubbles: true })); return true; }
  return false;
}

async function run(profile) {
  const platform = ATS.detect();
  const results = []; // {label, key, tag, value, status}
  const handled = new WeakSet();

  // 1) ATS adapter pass (highest confidence)
  for (const a of (ATS[platform] || [])) {
    for (const el of document.querySelectorAll(a.selector)) {
      if (handled.has(el)) continue;
      const value = a.res(profile);
      apply(el, a.key, value, a.tag);
      handled.add(el);
    }
  }

  // 2) Generic synonym-rule pass over remaining fields
  const fields = document.querySelectorAll("input:not([type=hidden]):not([type=file]):not([type=submit]), select, textarea");
  for (const el of fields) {
    if (handled.has(el) || el.disabled || el.type === "password") continue;
    const sig = signature(el);
    if (!sig) continue;

    // free-text essays: escalate to LLM (drafted) rather than guess
    if (el.tagName === "TEXTAREA" || (el.maxLength > 180) || /cover letter|why |describe|tell us|anything else|essay/.test(sig)) {
      results.push({ label: sig.slice(0, 80), key: "freeform", tag: "drafted", el, value: null, status: "pending-llm" });
      handled.add(el); continue;
    }

    const rule = RULES.find(r => r.re.test(sig));
    if (rule) { apply(el, rule.key, rule.res(profile), rule.tag); handled.add(el); }
    else { results.push({ label: sig.slice(0, 80), key: "unknown", tag: "you", el, value: null, status: "unmapped" }); }
  }

  // 3) Blockers worth surfacing
  if (platform === "workday") results.push({ label: "Workday multi-step / account", key: "flow", tag: "blocker", el: null, status: "manual" });
  for (const f of document.querySelectorAll("input[type=file]"))
    results.push({ label: "Resume / file upload — attach the right variant", key: "resume", tag: "you", el: f, status: "manual" });

  function apply(el, key, value, tag) {
    if (value == null) { results.push({ label: signature(el).slice(0,80), key, tag: "you", el, value: null, status: "needs-you" }); return; }
    let ok = false;
    if (el.tagName === "SELECT") ok = fillSelect(el, value);
    else if (el.type === "checkbox" || el.type === "radio") { /* leave yes/no + EEO to review */ }
    else { setNativeValue(el, value); ok = true; }
    el.style.outline = tag === "auto" ? "2px solid #16a34a" : "2px solid #d97706"; // green vs amber
    results.push({ label: signature(el).slice(0,80), key, tag, el, value, status: ok ? "filled" : "needs-you" });
  }

  return { platform, results };
}

// message bridge with background/sidepanel
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "JOBFILL_PING") { sendResponse({ ok: true }); return; }
  if (msg.type === "JOBFILL_RUN") {
    chrome.storage.local.get("profile").then(async ({ profile }) => {
      if (!profile) { sendResponse({ error: "No profile loaded. Import profile.json in the side panel." }); return; }
      const out = await run(profile);
      // strip DOM refs before sending; keep an index to re-locate for jump/fill-draft
      window.__jobfill = out.results;
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
