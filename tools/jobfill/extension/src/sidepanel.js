/* sidepanel.js — the human-in-the-loop review UI. */

const $ = (s) => document.querySelector(s);
const TAGS = ["auto", "verify", "drafted", "you", "blocker"];

async function activeTabId() {
  const [t] = await chrome.tabs.query({ active: true, currentWindow: true });
  return t.id;
}

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
  await chrome.scripting.executeScript({ target: { tabId }, files: ["src/fieldmap.js", "src/content.js"] });
}

function sendRun(tabId) {
  chrome.tabs.sendMessage(tabId, { type: "JOBFILL_RUN" }, (resp) => {
    if (chrome.runtime.lastError) { $("#status").textContent = "Couldn't reach the page: " + chrome.runtime.lastError.message + ". Reload the page and retry."; return; }
    if (!resp) { $("#status").textContent = "No response from the page."; return; }
    if (resp.error) { $("#status").textContent = resp.error; return; }
    render(resp, tabId);
  });
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
        const resp = await chrome.runtime.sendMessage({
          type: "JOBFILL_GENERATE",
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
