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
import path from "node:path";
import { fileURLToPath } from "node:url";

const exec = promisify(execFile);
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", ".."); // repo root

// ---- native messaging framing ----
function readMessage() {
  return new Promise((resolve) => {
    let len = null, chunks = [];
    process.stdin.on("readable", () => {
      let b;
      if (len === null && (b = process.stdin.read(4))) len = b.readUInt32LE(0);
      if (len !== null && (b = process.stdin.read(len))) resolve(JSON.parse(b.toString("utf8")));
    });
    process.stdin.on("end", () => resolve(null));
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
    const { stdout } = await exec("codex", ["exec", "--sandbox", "read-only", prompt],
      { cwd: REPO, maxBuffer: 1024 * 1024 });
    return stdout.trim();
  }
  // default: claude code headless. -p prints a single turn to stdout.
  const { stdout } = await exec("claude", ["-p", prompt, "--output-format", "text"],
    { cwd: REPO, maxBuffer: 1024 * 1024 });
  return stdout.trim();
}

async function tailorResume(msg) {
  // Delegate to claude with file tools to invoke the existing cover-letter skill
  // or recompile a variant. Scoped, well-tested prompt only.
  const c = msg.context || {};
  const prompt = `Use the cover-letter skill to generate a tailored cover letter for ${c.company} — ${c.role}, ` +
    `compile it to PDF under files/cover-letters/, and reply with the output path. Do not commit.`;
  const { stdout } = await exec("claude", ["-p", prompt, "--allowedTools", "Bash,Edit,Write,Read",
    "--output-format", "text"], { cwd: REPO, maxBuffer: 2 * 1024 * 1024 });
  return stdout.trim();
}

(async () => {
  const msg = await readMessage();
  if (!msg) return;
  try {
    let text;
    if (msg.action === "generate") text = await runCLI(msg);
    else if (msg.action === "tailor_resume") text = await tailorResume(msg);
    else text = "(unknown action)";
    writeMessage({ text });
  } catch (e) {
    writeMessage({ error: String(e.message || e) });
  }
  process.exit(0);
})();
