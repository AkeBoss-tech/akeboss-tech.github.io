/* sidepanel.js — the human-in-the-loop review UI. */

const $ = (s) => document.querySelector(s);
const TAGS = ["auto", "verify", "drafted", "you", "blocker"];
const HOST = "com.akash.jobfill";
const SERVER = "http://localhost:9291";

// Talk to the local connector server (run: node tools/jobfill/server/jobfill-server.mjs).
// Far simpler/robust than Chrome Native Messaging — full PATH, no macOS TCC.
async function serverSend(path, payload) {
  try {
    const r = await fetch(SERVER + path, {
      method: payload ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    if (!r.ok) return { error: `server ${r.status}` };
    return await r.json();
  } catch (e) {
    return { error: "connector not running on :9291 — start it:  node tools/jobfill/server/jobfill-server.mjs" };
  }
}

// ---- debug log (visible in the panel + console) ----
function log(msg, obj) {
  const t = new Date().toISOString().slice(11, 23);
  let extra = "";
  if (obj !== undefined) { try { extra = " " + (typeof obj === "string" ? obj : JSON.stringify(obj)); } catch { extra = " " + String(obj); } }
  const el = $("#log"); if (el) { el.hidden = false; $("#toggleLog").textContent = "Hide debug log"; el.textContent += `[${t}] ${msg}${extra}\n`; el.scrollTop = el.scrollHeight; }
  console.log("[JobFill]", msg, obj ?? "");
}
document.addEventListener("DOMContentLoaded", () => {
  $("#toggleLog").onclick = () => { const el = $("#log"); el.hidden = !el.hidden; $("#toggleLog").textContent = el.hidden ? "Show debug log" : "Hide debug log"; };
  $("#copyLog").onclick = () => navigator.clipboard.writeText($("#log").textContent || "");
  $("#clearLog").onclick = () => { $("#log").textContent = ""; };
});

// Call the native host directly from the panel (a live page) instead of routing
// through the background service worker, which MV3 may suspend during a long
// claude call. Times out so a hung host surfaces instead of hanging forever.
function nativeSend(msg, timeoutMs = 150000) {
  return new Promise((res) => {
    let done = false;
    const t = setTimeout(() => { if (!done) { done = true; res({ error: `native host timeout after ${timeoutMs / 1000}s (host installed? Chrome restarted?)` }); } }, timeoutMs);
    try {
      chrome.runtime.sendNativeMessage(HOST, msg, (r) => {
        if (done) return; done = true; clearTimeout(t);
        res(chrome.runtime.lastError ? { error: chrome.runtime.lastError.message } : r);
      });
    } catch (e) { if (!done) { done = true; clearTimeout(t); res({ error: String(e.message || e) }); } }
  });
}

async function activeTabId() {
  const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
  return t.id;
}

// ---- per-page context ----
// Each application page keeps its own scan results / answers, keyed by URL and
// stored in session storage (cleared when the browser closes — no PII on disk).
let CURRENT = { tabId: null, url: "" };
const pageKey = (url) => "page:" + (url || "").split("#")[0];

async function getActiveTab() {
  const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
  return t;
}
function setHeader(tab) {
  const el = $("#page");
  try { const u = new URL(tab.url); el.textContent = u.hostname + u.pathname; }
  catch { el.textContent = (tab && tab.title) || "— no page —"; }
}
async function persist(resp) {
  if (!CURRENT.url) return;
  await chrome.storage.session.set({ [pageKey(CURRENT.url)]: { resp, status: $("#status").textContent, ts: Date.now() } });
}
// Switch the panel to whatever page is active now (restore or clear).
async function refreshContext() {
  const tab = await getActiveTab();
  if (!tab) return;
  CURRENT = { tabId: tab.id, url: tab.url || "" };
  setHeader(tab);
  const k = pageKey(CURRENT.url);
  const saved = (await chrome.storage.session.get(k))[k];
  if (saved && saved.resp) {
    render(saved.resp, tab.id);
    $("#status").textContent = "Restored this page's saved context — re-scan to re-enable Jump/Insert.";
  } else {
    $("#list").innerHTML = ""; $("#counts").innerHTML = ""; $("#gate").hidden = true;
    $("#status").textContent = "New page. Import profile (once), then Detect & fill or Generate all.";
  }
}
chrome.tabs.onActivated.addListener(refreshContext);
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (tabId === CURRENT.tabId && (info.status === "complete" || info.url)) refreshContext();
});
document.addEventListener("DOMContentLoaded", refreshContext);
// Surface connector status on open so a missing server is obvious.
document.addEventListener("DOMContentLoaded", async () => {
  const p = await serverSend("/ping");
  if (p.error) log("connector: OFFLINE — " + p.error);
  else log("connector: online", { claude: !!p.claude, codex: !!p.codex });
});

// Import profile.json into extension storage
$("#profileFile").addEventListener("change", async (e) => {
  const file = e.target.files[0]; if (!file) return;
  const profile = JSON.parse(await file.text());
  await chrome.storage.local.set({ profile });
  $("#status").textContent = `Profile loaded for ${profile.identity.full_name}.`;
});

// Ensure the content script is live on this tab; inject on demand if it isn't.
async function ensureInjected(tabId) {
  const pong = await new Promise((res) =>
    chrome.tabs.sendMessage(tabId, { type: "JOBFILL_PING" }, (r) => res(chrome.runtime.lastError ? null : r)));
  if (pong && pong.ok) return;
  await chrome.scripting.executeScript({ target: { tabId }, files: ["src/fieldmap.js", "src/mapper.js", "src/content.js"] });
}

function sendRun(tabId) {
  chrome.tabs.sendMessage(tabId, { type: "JOBFILL_RUN" }, (resp) => {
    if (chrome.runtime.lastError) { $("#status").textContent = "Couldn't reach the page: " + chrome.runtime.lastError.message + ". Reload the page and retry."; return; }
    if (!resp) { $("#status").textContent = "No response from the page."; return; }
    if (resp.error) { $("#status").textContent = resp.error; return; }
    render(resp, tabId);
    persist(resp);
  });
}

// promise wrapper around tabs.sendMessage
function tabSend(tabId, msg) {
  return new Promise((res) => chrome.tabs.sendMessage(tabId, msg, (r) => res(chrome.runtime.lastError ? { error: chrome.runtime.lastError.message } : r)));
}

$("#fill").addEventListener("click", async () => {
  const tabId = await activeTabId();
  $("#status").textContent = "Scanning form…";
  try {
    await ensureInjected(tabId);
  } catch (e) {
    $("#status").textContent = "Can't run here: " + e.message + " — open a real application page (not chrome://, the Web Store, or a PDF).";
    return;
  }
  sendRun(tabId);
});

// Fetch the chosen resume PDF from the connector and attach it to the page's
// file input (best-effort; standard <input type=file> only).
function abToB64(buf) {
  let s = ""; const b = new Uint8Array(buf), chunk = 0x8000;
  for (let i = 0; i < b.length; i += chunk) s += String.fromCharCode.apply(null, b.subarray(i, i + chunk));
  return btoa(s);
}
$("#attachResume").addEventListener("click", async () => {
  const tabId = await activeTabId();
  const v = $("#resumeVariant").value;
  $("#status").textContent = "Fetching resume PDF…";
  let b64;
  try {
    const r = await fetch(SERVER + "/resume?v=" + encodeURIComponent(v));
    if (!r.ok) { $("#status").textContent = `Resume fetch failed (${r.status}).`; return; }
    b64 = abToB64(await r.arrayBuffer());
  } catch (e) { $("#status").textContent = "Connector offline — can't fetch resume."; return; }
  await ensureInjected(tabId);
  const resp = await tabSend(tabId, { type: "JOBFILL_ATTACH_RESUME", b64, filename: "Akash_Dubey_Resume.pdf" });
  log("attach resume", { variant: v, attached: resp?.attached, error: resp?.error });
  if (resp?.error) { $("#status").textContent = resp.error; return; }
  $("#status").textContent = resp.attached > 0
    ? `📎 Attached resume to ${resp.attached} file input(s) — verify it shows before submitting.`
    : "No standard file input found — this site likely uses a custom uploader; drag the PDF in manually.";
});

$("#genall").addEventListener("click", async () => {
  try {
    const tabId = await activeTabId();
    log("=== Generate all ===", { url: CURRENT.url });
    try { await ensureInjected(tabId); } catch (e) { log("inject failed", String(e.message)); $("#status").textContent = "Can't run here: " + e.message; return; }

    // 1) deterministic fill
    $("#status").textContent = "1/4 Filling known fields…";
    const runResp = await tabSend(tabId, { type: "JOBFILL_RUN" });
    if (!runResp || runResp.error) { log("JOBFILL_RUN failed", runResp); $("#status").textContent = runResp?.error || "scan failed"; return; }
    log("deterministic scan ok", { platform: runResp.platform, fields: runResp.results.length });

    // 2) serialize (opens dropdowns to read options)
    $("#status").textContent = "2/4 Reading the form (incl. dropdowns)…";
    const ser = await tabSend(tabId, { type: "JOBFILL_SERIALIZE" });
    if (!ser || ser.error || !ser.fields) { log("JOBFILL_SERIALIZE failed", ser); $("#status").textContent = "Serialize failed: " + (ser?.error || "no response"); return; }
    const dropdowns = ser.fields.filter(f => f.options);
    log("serialized fields", { total: ser.fields.length, dropdowns: dropdowns.length, drafted: ser.fields.filter(f => f.tag === "drafted").length });
    if (dropdowns.length) log("dropdown options", dropdowns.slice(0, 8).map(f => ({ i: f.i, label: f.label.slice(0, 24), n: f.options.length })));

    // Only send the agent fields that still need it (empty, or a dropdown) —
    // the auto/verify fields are already filled deterministically. Keeps the
    // native message small enough for Chrome's sendNativeMessage.
    const need = ser.fields.filter(f => !f.current || f.options || f.tag === "drafted" || f.tag === "you");
    const payloadBytes = JSON.stringify(need).length;
    log("agent payload", { of: ser.fields.length, sending: need.length, bytes: payloadBytes });

    // 3) ask Haiku
    const ctx = await context();
    ctx.jd = (ctx.jd || "").slice(0, 2500);
    log("page context", { company: (ctx.company || "").slice(0, 50), role: (ctx.role || "").slice(0, 50), jdChars: ctx.jd.length });
    $("#status").textContent = `3/4 Asking Haiku to complete ${need.length} fields… (10–60s)`;
    log("→ POST /generate_all to connector…", { fields: need.length });
    const t0 = performance.now();
    const gen = await serverSend("/generate_all", { fields: need, context: ctx, model: "claude-haiku-4-5-20251001" });
    const ms = Math.round(performance.now() - t0);
    if (!gen || gen.error) { log("connector error", { ms, error: gen?.error }); $("#status").textContent = (gen?.error || "no response") + " (see debug log)"; render(runResp, tabId); return; }
    log("← connector replied", { ms, serverMs: gen.ms, count: gen.count });
    log("raw model output (truncated)", (gen.raw || "(empty)").slice(0, 600));
    if (!gen.map || !gen.map.length) { $("#status").textContent = `Haiku returned 0 answers (see debug log).`; render(runResp, tabId); return; }

    // 4) apply
    log("applying answers…", gen.map.slice(0, 10).map(m => ({ i: m.i, v: String(m.value).slice(0, 30) })));
    const applied = await tabSend(tabId, { type: "JOBFILL_APPLY_ALL", map: gen.map });
    if (!applied || applied.error) { log("apply failed", applied); $("#status").textContent = "Apply failed: " + (applied?.error || "no response"); return; }
    const final = { platform: runResp.platform, results: applied.results };
    log("done", { returned: gen.map.length, filled: applied.filled, unfilled: applied.unfilled });
    $("#status").textContent = `Done: filled ${applied.filled}. 🔴 ${applied.unfilled} still need you — they're outlined red on the page. Review, then submit manually.`;
    render(final, tabId);
    persist(final);
  } catch (e) {
    log("EXCEPTION", String(e && (e.stack || e.message) || e));
    $("#status").textContent = "Error (see debug log): " + (e.message || e);
  }
});

function render({ platform, results }, tabId) {
  $("#status").textContent = `Detected: ${platform}. ${results.length} fields.`;
  // counts
  const counts = TAGS.map(t => `<span class="pill ${t}">${t}: ${results.filter(r => r.tag === t).length}</span>`).join("");
  $("#counts").innerHTML = counts;

  // list — auto first (collapsed feel), then things needing you
  const order = { auto: 0, verify: 1, drafted: 2, you: 3, blocker: 4 };
  results.sort((a, b) => order[a.tag] - order[b.tag]);
  $("#list").innerHTML = "";
  for (const r of results) {
    const div = document.createElement("div"); div.className = "item";
    div.innerHTML = `<div class="tag" style="color:${color(r.tag)}">${r.tag} · ${r.key}</div>
      <div class="label">${escape(r.label || "(field)")}</div>
      ${r.value ? `<div class="val">${escape(String(r.value))}</div>` : ""}`;
    const acts = document.createElement("div"); acts.className = "acts";

    const jump = btn("Jump to", () => chrome.tabs.sendMessage(tabId, { type: "JOBFILL_SCROLL_TO", i: r.i }));
    acts.appendChild(jump);

    if (r.tag === "drafted") {
      const ta = document.createElement("textarea"); ta.placeholder = "Draft will appear here — review before inserting.";
      const gen = btn("Generate", async () => {
        gen.textContent = "Generating…";
        const ctx = await context();
        const resp = await serverSend("/generate", {
          kind: /cover letter/i.test(r.label) ? "cover_letter" : "answer",
          prompt: r.label, context: { ...ctx, question: r.label },
        });
        gen.textContent = "Generate";
        if (resp?.error) { ta.value = "⚠️ " + resp.error; return; }
        ta.value = resp.text || "(empty)";
      });
      const insert = btn("Insert", () => chrome.tabs.sendMessage(tabId, { type: "JOBFILL_INSERT_DRAFT", i: r.i, text: ta.value }));
      acts.append(gen, insert);
      div.append(acts, ta);
    } else {
      div.append(acts);
    }
    $("#list").appendChild(div);
  }

  // pre-submit gate
  const todo = results.filter(r => ["verify", "drafted", "you", "blocker"].includes(r.tag));
  const gate = $("#gate"); gate.hidden = false;
  gate.innerHTML = `<b>Before you click Submit (${todo.length} to clear):</b><ul>` +
    todo.map(r => `<li><span class="tag" style="color:${color(r.tag)}">${r.tag}</span> ${escape(r.label || r.key)}</li>`).join("") +
    `</ul><small>JobFill never submits for you — review the amber/blue/red items, then submit manually.</small>`;
}

async function context() {
  // crude company/role extraction from the page title; refine per ATS as needed
  const tabId = await activeTabId();
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => ({ title: document.title, h1: document.querySelector("h1,h2")?.textContent?.trim() || "", url: location.href,
                   jd: document.querySelector("[class*='content'],[class*='description'],main")?.innerText?.slice(0, 4000) || "" }),
  });
  const { profile } = await chrome.storage.local.get("profile");
  return { company: result.title, role: result.h1, jd: result.jd, url: result.url,
           profileSummary: profile ? summarize(profile) : "" };
}

function summarize(p) {
  return `${p.identity.full_name}, ${p.education[0].field} @ Rutgers (grad ${p.education[0].graduation_date}). ` +
    p.experience.slice(0, 3).map(e => `${e.title} @ ${e.company}: ${e.bullets[0]}`).join(" ");
}

const btn = (t, fn) => { const b = document.createElement("button"); b.textContent = t; b.onclick = fn; return b; };
const color = (t) => ({ auto: "#16a34a", verify: "#d97706", drafted: "#2563eb", you: "#dc2626", blocker: "#6b7280" }[t]);
const escape = (s) => (s || "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
