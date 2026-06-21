#!/usr/bin/env node
/* jobfill-host.mjs — Chrome Native Messaging host.
 *
 * Chrome launches this process and speaks the native-messaging wire format:
 *   [uint32 LE length][UTF-8 JSON message]
 * We read one message, run the requested CLI (claude/codex), and write one
 * framed JSON reply back.
 *
 * Security: only ever invoked by Chrome for the allowed extension id (set in
 * the host manifest's allowed_origins). It shells out to YOUR logged-in CLI —
 * no API key needed. Keep prompts trusted; we do not pass --dangerously-skip.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFileSync, existsSync, appendFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Disk log — survives even if Chrome kills the process, so we can see how far
// it got under Chrome's launch environment.
const LOGF = "/tmp/jobfill-host.log";
function hlog(s) { try { appendFileSync(LOGF, `[${new Date().toISOString()}] ${s}\n`); } catch {} }
hlog(`=== host start  pid=${process.pid}  cwd=${process.cwd()}  node=${process.execPath}`);
process.on("exit", (c) => hlog(`process exit code=${c}`));
process.on("SIGTERM", () => { hlog("SIGTERM received"); process.exit(0); });

const exec = promisify(execFile);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const JOBFILL = path.resolve(HERE, "..");           // tools/jobfill
const REPO = path.resolve(HERE, "..", "..", "..");  // repo root

// Chrome launches native hosts with a minimal PATH (no homebrew, ~/.local/bin,
// nvm, etc.), so CLI binaries often aren't found. Widen PATH and resolve the
// CLI to an absolute path (overridable via env from the launcher).
const EXTRA_PATHS = ["/opt/homebrew/bin", "/usr/local/bin", path.join(os.homedir(), ".local/bin"),
  path.join(os.homedir(), ".bun/bin"), path.join(os.homedir(), ".npm-global/bin"), "/usr/bin", "/bin"];
process.env.PATH = [...EXTRA_PATHS, process.env.PATH || ""].filter(Boolean).join(":");
function resolveBin(name, envVar) {
  if (process.env[envVar] && existsSync(process.env[envVar])) return process.env[envVar];
  for (const d of EXTRA_PATHS) { const p = path.join(d, name); if (existsSync(p)) return p; }
  return name; // last resort: rely on PATH
}
const CLAUDE_BIN = resolveBin("claude", "JOBFILL_CLAUDE_BIN");
const CODEX_BIN = resolveBin("codex", "JOBFILL_CODEX_BIN");

const safeRead = (rel, base = REPO) => { try { return readFileSync(path.join(base, rel), "utf8"); } catch { return ""; } };
// Pull the first top-level JSON array out of model output (tolerates prose around it).
function extractJsonArray(s) {
  const a = s.indexOf("["), b = s.lastIndexOf("]");
  if (a === -1 || b === -1 || b < a) return [];
  try { return JSON.parse(s.slice(a, b + 1)); } catch { return []; }
}

// ---- native messaging framing ----
// Accumulate chunks: a large message (big forms with long dropdowns) arrives
// across multiple stdin reads, so we must buffer until we have 4+len bytes.
function readMessage() {
  return new Promise((resolve, reject) => {
    const chunks = []; let len = null;
    process.stdin.on("data", (d) => {
      chunks.push(d);
      const buf = Buffer.concat(chunks);
      if (len === null) { if (buf.length < 4) return; len = buf.readUInt32LE(0); }
      if (buf.length >= 4 + len) {
        try { resolve(JSON.parse(buf.slice(4, 4 + len).toString("utf8"))); }
        catch (e) { reject(e); }
      }
    });
    process.stdin.on("end", () => { if (!chunks.length) resolve(null); });
  });
}
function writeMessage(obj) {
  const buf = Buffer.from(JSON.stringify(obj), "utf8");
  const hdr = Buffer.alloc(4); hdr.writeUInt32LE(buf.length, 0);
  process.stdout.write(Buffer.concat([hdr, buf]));
}

// ---- prompt builders (reuse the cover-letter principles) ----
function buildPrompt(msg) {
  const c = msg.context || {};
  const principles = "Follow killer-cover-letter rules: business case not personal statement; " +
    "lead with the company's core bet; one Problem->Solution->Impact proof with a metric; " +
    "no 'I am excited to apply', no resume restatement; sound human; 250-400 words for letters, " +
    "60-120 words for short answers.";
  if (msg.kind === "cover_letter") {
    return `Write a tailored cover letter. ${principles}\nCompany/Role: ${c.company} — ${c.role}\n` +
      `Candidate: ${c.profileSummary}\nJob description (truncated):\n${c.jd}\nOutput ONLY the letter text.`;
  }
  // short answer to a specific application question
  return `Answer this job-application question in the candidate's voice. ${principles}\n` +
    `Question: ${c.question || msg.prompt}\nCompany/Role: ${c.company} — ${c.role}\n` +
    `Candidate: ${c.profileSummary}\nJD:\n${(c.jd||"").slice(0,2000)}\nOutput ONLY the answer.`;
}

async function runCLI(msg) {
  const prompt = buildPrompt(msg);
  if (msg.runner === "codex") {
    // codex exec runs headless; read-only sandbox so it can't modify files for a generate task
    const { stdout } = await exec(CODEX_BIN, ["exec", "--sandbox", "read-only", prompt],
      { cwd: REPO, maxBuffer: 1024 * 1024 });
    return stdout.trim();
  }
  // default: claude code headless. -p prints a single turn to stdout.
  const { stdout } = await exec(CLAUDE_BIN, ["-p", prompt, "--output-format", "text"],
    { cwd: REPO, maxBuffer: 1024 * 1024 });
  return stdout.trim();
}

async function tailorResume(msg) {
  // Delegate to claude with file tools to invoke the existing cover-letter skill
  // or recompile a variant. Scoped, well-tested prompt only.
  const c = msg.context || {};
  const prompt = `Use the cover-letter skill to generate a tailored cover letter for ${c.company} — ${c.role}, ` +
    `compile it to PDF under files/cover-letters/, and reply with the output path. Do not commit.`;
  const { stdout } = await exec(CLAUDE_BIN, ["-p", prompt, "--allowedTools", "Bash,Edit,Write,Read",
    "--output-format", "text"], { cwd: REPO, maxBuffer: 2 * 1024 * 1024 });
  return stdout.trim();
}

// Whole-form fill. The agent gets the resume + profile + notes and the full
// field list. Dropdowns include their allowed options and MUST be matched exactly.
async function generateAll(msg) {
  const t0 = Date.now();
  const c = msg.context || {};
  // Prefer data sitting next to the host (the ~/.jobfill runtime, outside the
  // TCC-protected ~/Documents); fall back to the repo when run locally.
  const resume = safeRead("resume.md", HERE) || safeRead("career/cv.md") || safeRead("files/resume.tex");
  const profile = safeRead("profile.json", HERE) || safeRead("profile.json", JOBFILL);
  const about = safeRead("about.md", HERE) || safeRead("about.md", JOBFILL);
  hlog(`data sizes: resume=${resume.length} profile=${profile.length} about=${about.length}`);

  // Render fields compactly; spell out dropdown options so the model can't guess.
  const fieldLines = (msg.fields || []).map(f => {
    const empty = !f.current ? " (EMPTY)" : "";
    if (f.type === "select" && f.options) return `#${f.i} [dropdown] "${f.label}" — choose EXACTLY one of: ${JSON.stringify(f.options)}${empty}`;
    if (f.type === "textarea") return `#${f.i} [long text] "${f.label}"${empty}`;
    return `#${f.i} [${f.type}] "${f.label}"${empty}`;
  }).join("\n");

  const prompt = [
    "You fill out job applications for a candidate, truthfully and in their voice.",
    "=== RESUME ===", resume.slice(0, 6000),
    "=== PROFILE (JSON) ===", profile,
    "=== EXTRA NOTES ABOUT THE CANDIDATE ===", about || "(none)",
    `=== TARGET ROLE ===\n${c.company} — ${c.role}\nJD (truncated):\n${(c.jd || "").slice(0, 3000)}`,
    "=== FORM FIELDS ===", fieldLines,
    "",
    "Return ONLY a JSON array, one object per field you can answer: {\"i\": <number>, \"value\": \"<text>\"}.",
    "RULES:",
    "- For [dropdown] fields, value MUST be copied EXACTLY from that field's allowed options list — never invent a value, never paraphrase. If none fits, omit the field.",
    "- For [long text] essays (why/describe/cover letter), write a specific, strong answer: lead with the company's need, one concrete proof point with a metric, no \"I am excited to apply\", 80-160 words.",
    "- Prefer filling EMPTY fields; you may improve already-filled ones only if clearly better.",
    "- SKIP (omit) any EEO / demographic / voluntary self-identification field, file uploads, and anything you cannot answer truthfully from the materials.",
    "- NEVER invent facts (no fake employers, dates, GPA, work authorization). Output the JSON array and nothing else.",
  ].join("\n");

  const model = msg.model || "claude-haiku-4-5-20251001";
  hlog(`spawning claude: ${CLAUDE_BIN} --model ${model}  (prompt ${prompt.length} chars)`);
  const { stdout, stderr } = await exec(CLAUDE_BIN, ["-p", prompt, "--model", model, "--output-format", "text"],
    { cwd: REPO, maxBuffer: 4 * 1024 * 1024 });
  hlog(`claude returned: stdout=${stdout.length} stderr=${stderr.length}`);
  const map = extractJsonArray(stdout);
  // Return raw output + timing so the UI can explain a zero-fill result.
  return { map, count: map.length, ms: Date.now() - t0, model, fieldsReceived: (msg.fields || []).length,
    raw: (stdout || stderr || "").slice(0, 1500) };
}

// Never die silently — Chrome reports a bare "Native host has exited" otherwise.
process.on("uncaughtException", (e) => { hlog("uncaughtException: " + (e.stack || e)); try { writeMessage({ error: "uncaughtException: " + (e.stack || e.message || e) }); } catch {} process.exit(0); });
process.on("unhandledRejection", (e) => { hlog("unhandledRejection: " + (e && (e.stack || e.message) || e)); try { writeMessage({ error: "unhandledRejection: " + (e && (e.stack || e.message) || e) }); } catch {} process.exit(0); });

(async () => {
  hlog("waiting for message…");
  let msg;
  try { msg = await readMessage(); }
  catch (e) { hlog("readMessage failed: " + e); writeMessage({ error: "readMessage failed: " + (e.message || e) }); return; }
  if (!msg) { hlog("no message (stdin closed empty)"); return; }
  hlog(`message received: action=${msg.action} fields=${(msg.fields || []).length} bytes=${JSON.stringify(msg).length}`);
  try {
    if (msg.action === "echo") {
      // Diagnostic: confirms the host received a (possibly large) message intact.
      writeMessage({ ok: true, fieldsReceived: (msg.fields || []).length, bytes: JSON.stringify(msg).length });
    }
    else if (msg.action === "ping") {
      writeMessage({ ok: true, node: process.execPath, claude: CLAUDE_BIN, claudeFound: existsSync(CLAUDE_BIN),
        codex: CODEX_BIN, codexFound: existsSync(CODEX_BIN), repo: REPO });
    }
    else if (msg.action === "generate_all") { writeMessage(await generateAll(msg)); }
    else if (msg.action === "generate") { writeMessage({ text: await runCLI(msg) }); }
    else if (msg.action === "tailor_resume") { writeMessage({ text: await tailorResume(msg) }); }
    else writeMessage({ text: "(unknown action)" });
    hlog(`reply written for action=${msg.action}`);
  } catch (e) {
    hlog("handler error: " + (e.stack || e));
    writeMessage({ error: String(e.message || e) });
  }
  process.exit(0);
})();
