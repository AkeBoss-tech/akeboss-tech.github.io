/* content.js — runs on application pages. Uses the pure mapper to decide what
 * to fill, then performs the actual DOM fill + review tagging. Never submits. */

if (window.__jobfillContentLoaded) { /* re-injection: no-op, listener already registered */ }
else {
window.__jobfillContentLoaded = true;

// React/Vue controlled inputs ignore plain .value assignment; use the native
// setter then dispatch input+change so the framework's state updates.
// Coerces to the input's type (date/month/number) and never throws — returns
// true if the value was set, false if it couldn't be (caller flags for review).
function setNativeValue(el, value) {
  const v = window.JobFill.coerceValue(el, value);
  if (v == null) return false;
  try {
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
    setter.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  } catch (e) {
    console.warn("[JobFill] could not set", el.name || el.id, "->", value, e.message);
    return false;
  }
}

function fillSelect(el, value) {
  const want = String(value).toLowerCase();
  const opt = [...el.options].find(o =>
    o.textContent.toLowerCase().includes(want) || want.includes(o.textContent.toLowerCase().trim()));
  if (opt) { el.value = opt.value; el.dispatchEvent(new Event("change", { bubbles: true })); return true; }
  return false;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Custom dropdowns (react-select etc., e.g. Greenhouse "Start date month") are
// an <input role="combobox">, NOT a <select>. Their options only render once
// opened, so we click to open, read [role=option], then read or pick.
function isCustomCombobox(el) {
  if (!el || el.tagName === "SELECT") return false;
  if (el.getAttribute && el.getAttribute("role") === "combobox") return true;
  if (el.getAttribute && el.getAttribute("aria-haspopup") === "listbox") return true;
  return false;
}
function comboControl(el) { return (el.closest && el.closest("[class*='control']")) || el; }
function readOpenOptions() {
  let opts = [...document.querySelectorAll("[role='option']")];
  if (!opts.length) opts = [...document.querySelectorAll("[id*='option']")];
  return opts;
}
async function openCombobox(el) {
  comboControl(el).dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  if (el.focus) el.focus();
  await sleep(140); // let the menu render
  return readOpenOptions();
}
function closeCombobox(el) { el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); }

// Open -> read option labels -> close. Returns the visible option texts.
async function harvestComboOptions(el) {
  const opts = await openCombobox(el);
  const texts = opts.map(o => o.textContent.trim()).filter(Boolean);
  closeCombobox(el);
  return texts;
}
const matchOption = (opts, want) =>
  opts.find(o => o.textContent.toLowerCase().trim() === want)
  || opts.find(o => o.textContent.toLowerCase().includes(want));

// Open -> (for search widgets, type to filter) -> click the matching option.
async function fillCustomSelect(el, value) {
  const want = String(value).toLowerCase().trim();
  let opts = await openCombobox(el);
  let match = matchOption(opts, want);
  if (!match) {
    // Typeahead: type the value into the combobox input to filter the list.
    try {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      setter.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    } catch {}
    await sleep(350);
    opts = readOpenOptions();
    match = matchOption(opts, want);
  }
  if (match) { match.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })); if (match.click) match.click(); await sleep(60); return true; }
  closeCombobox(el);
  return false;
}

function run(profile) {
  const { platform, plan } = window.JobFill.planFill(profile, document, window);
  const results = [];
  for (const p of plan) {
    let status = p.status;
    if (p.el && p.value != null && p.tag !== "you") {
      if (p.el.tagName === "SELECT") status = fillSelect(p.el, p.value) ? "filled" : "needs-you";
      else if (isCustomCombobox(p.el)) status = "needs-you"; // handled via dropdown selection in generate-all
      else if (p.el.type === "checkbox" || p.el.type === "radio") status = "needs-you"; // yes/no + EEO -> review
      else status = setNativeValue(p.el, p.value) ? "filled" : "needs-you";
      if (status === "filled") p.el.style.outline = p.tag === "auto" ? "2px solid #16a34a" : "2px solid #d97706";
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
  if (msg.type === "JOBFILL_SERIALIZE") {
    (async () => {
      const items = window.__jobfill || [];
      if (!items.length) { sendResponse({ error: "Run a scan first." }); return; }
      const fields = window.JobFill.serializeFields(items);
      // Enrich custom comboboxes: open each, read its options, feed them in.
      for (const f of fields) {
        const r = items[f.i];
        if (r && r.el && isCustomCombobox(r.el)) {
          const options = await harvestComboOptions(r.el);
          if (options.length) {
            f.type = "select"; f.custom = true;
            // Search/typeahead widgets (country, school, location) expose huge
            // lists — don't ship hundreds of options; cap and mark searchable.
            if (options.length > 50) { f.searchable = true; f.options = options.slice(0, 50); }
            else f.options = options;
          }
        }
      }
      sendResponse({ fields });
    })();
    return true; // async
  }
  if (msg.type === "JOBFILL_APPLY_ALL") {
    (async () => {
      const items = window.__jobfill || [];
      let filled = 0;
      for (const m of (msg.map || [])) {
        const r = items[m.i];
        if (!r || !r.el || m.skip || m.value == null || m.value === "") continue;
        if (r.el.tagName === "SELECT") { if (!fillSelect(r.el, m.value)) continue; }
        else if (isCustomCombobox(r.el)) { if (!await fillCustomSelect(r.el, m.value)) continue; }
        else if (!setNativeValue(r.el, m.value)) continue;
        r.el.style.outline = "2px solid #2563eb"; // blue = AI-filled
        r.tag = "drafted"; r.value = m.value; r.status = "ai-filled";
        filled++;
      }
      sendResponse({ filled, results: items.map((r, i) => ({ i, label: r.label, key: r.key, tag: r.tag, value: r.value, status: r.status })) });
    })();
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
