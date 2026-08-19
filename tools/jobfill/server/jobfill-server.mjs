#!/usr/bin/env node
/* jobfill-server.mjs — local HTTP connector for the JobFill extension.
 *
 * Run this in YOUR terminal:  node tools/jobfill/server/jobfill-server.mjs
 * It listens on http://localhost:9291 and runs the claude/codex CLI on request.
 *
 * Why a server instead of Chrome Native Messaging: a terminal process has your
 * full PATH + file permissions (no macOS TCC / hardened-runtime exec block),
 * and you can watch exactly what the agent does in this terminal.
 */
import http from "node:http";
import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { agentEligibleFields, agentEligibleMap, expectedExtensionOrigin, isAllowedBrowserOrigin, readJsonBody, setCorsHeaders, UNTRUSTED_DATA_RULES } from "./security.mjs";

const exec = promisify(execFile);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const JOBFILL = path.resolve(HERE, "..");           // tools/jobfill
const REPO = path.resolve(HERE, "..", "..", "..");  // repo root
const PORT = Number(process.env.JOBFILL_PORT || 9291);

const safeRead = (rel, base = REPO) => { try { return readFileSync(path.join(base, rel), "utf8"); } catch { return ""; } };
const RESUMES = {
  default: "files/resume.pdf", "ai-ml": "files/resume-ai-ml-engineer.pdf", "ai-infra": "files/resume-ai-infra-platform.pdf",
  founding: "files/resume-founding-engineer.pdf", quant: "files/resume-quant-dev.pdf", "comp-bio": "files/resume-comp-bio.pdf",
  research: "files/resume-research-engineer.pdf", finance: "files/resume-finance-ai-automation.pdf",
  consulting: "files/resume-consulting-ai.pdf", enterprise: "files/resume-enterprise-ai-automation.pdf",
};
const which = (n) => { try { return execFileSync("which", [n]).toString().trim(); } catch { return null; } };
const log = (...a) => console.log("\x1b[90m" + new Date().toISOString().slice(11, 19) + "\x1b[0m", ...a);
function extractJsonArray(s) { const a = s.indexOf("["), b = s.lastIndexOf("]"); if (a < 0 || b < 0 || b < a) return []; try { return JSON.parse(s.slice(a, b + 1)); } catch { return []; } }
function extractJsonObject(s) { const a = s.indexOf("{"), b = s.lastIndexOf("}"); if (a < 0 || b < 0 || b < a) return {}; try { return JSON.parse(s.slice(a, b + 1)); } catch { return {}; } }
const VARIANT_DESC = {
  default: "general software engineering", "ai-ml": "AI/ML & applied AI engineering (RAG, agents, LLMs)",
  "ai-infra": "AI infrastructure/platform (distributed systems, CUDA, inference)", founding: "founding engineer at a startup (0->1, full-stack, shipping)",
  quant: "quant developer (trading firms, C++/CUDA, probability)", "comp-bio": "computational biology / bioinformatics",
  research: "research engineer (experiments, model training, breadth)", finance: "finance AI automation (banks, insurers, workflows)",
  consulting: "consulting / professional-services AI (client delivery)", enterprise: "enterprise AI automation (insurance/legal/healthcare docs)",
};

const PRINCIPLES = "Follow killer-cover-letter rules: business case not personal statement; lead with the company's need; one Problem->Solution->Impact proof with a metric; no 'I am excited to apply'; sound human.";

function buildGenerateAllPrompt({ fields = [], context = {} }) {
  fields = agentEligibleFields(fields);
  const resume = safeRead("career/cv.md") || safeRead("files/resume.tex");
  const profile = safeRead("profile.json", JOBFILL);
  const about = safeRead("about.md", JOBFILL);
  const fieldLines = fields.map(f => {
    const empty = !f.current ? " (EMPTY)" : "";
    if (f.searchable) return `#${f.i} [search] "${f.label}" — provide the exact value to type (e.g. a country, university, degree, or city name)${empty}`;
    if (f.type === "select" && f.options) return `#${f.i} [dropdown] "${f.label}" — choose EXACTLY one of: ${JSON.stringify(f.options)}${empty}`;
    if (f.type === "textarea") return `#${f.i} [long text] "${f.label}"${empty}`;
    return `#${f.i} [${f.type}] "${f.label}"${empty}`;
  }).join("\n");
  return [
    "You draft reviewable job-application answers for a candidate, truthfully and in their voice.",
    UNTRUSTED_DATA_RULES,
    "=== RESUME ===", resume.slice(0, 6000),
    "=== PROFILE (JSON) ===", profile,
    "=== EXTRA NOTES ===", about || "(none)",
    `=== TARGET ROLE ===\n${context.company} — ${context.role}\nJD:\n${(context.jd || "").slice(0, 3000)}`,
    "=== FORM FIELDS ===", fieldLines, "",
    "Answer as many eligible fields as you truthfully can.",
    "Return ONLY a JSON array, one object per field: {\"i\": <number>, \"value\": \"<text>\"}.",
    "- [search] provide the exact real-world value (e.g. \"United States\", \"Rutgers University\", \"Bachelor of Science\", \"Computer Science\").",
    "- [dropdown] value MUST be copied EXACTLY from that field's options; if none fits, omit it.",
    "- [long text] essays: specific, concrete, with a metric, 80-160 words. " + PRINCIPLES,
    "- For short text/date fields, fill them from the resume/profile (name, school, dates, GPA, links, work auth).",
    "- SKIP: protected/manual fields, file uploads, transmissions, and anything you genuinely cannot answer from the resume/profile.",
    "- NEVER invent facts (employers, dates, GPA, work authorization, demographics). Output the JSON array only.",
  ].join("\n");
}

async function runCLI(prompt, { model = "claude-haiku-4-5-20251001", runner = "claude" } = {}) {
  if (runner === "codex") {
    const { stdout } = await exec("codex", ["exec", "--sandbox", "read-only", prompt], { cwd: REPO, maxBuffer: 8 << 20 });
    return stdout;
  }
  const { stdout } = await exec("claude", ["-p", prompt, "--model", model, "--output-format", "text"], { cwd: REPO, maxBuffer: 8 << 20 });
  return stdout;
}

// ---- http plumbing ----
function send(req, res, code, obj) { setCorsHeaders(req, res); res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(obj)); }

const server = http.createServer(async (req, res) => {
  if (!isAllowedBrowserOrigin(req.headers.origin)) return send(req, res, 403, { error: "origin denied; set JOBFILL_EXTENSION_ID to this extension's ID" });
  if (req.method === "OPTIONS") { setCorsHeaders(req, res); res.writeHead(204); res.end(); return; }
  try {
    if (req.method === "GET" && req.url === "/ping") {
      return send(req, res, 200, { ok: true, claude: which("claude"), codex: which("codex"), repo: REPO, variants: Object.keys(RESUMES) });
    }
    if (req.method === "GET" && req.url.startsWith("/resume")) {
      const v = new URL(req.url, "http://x").searchParams.get("v") || "default";
      const rel = RESUMES[v] || RESUMES.default;
      try {
        const buf = readFileSync(path.join(REPO, rel));
        log(`resume served: ${v} (${buf.length} bytes)`);
        setCorsHeaders(req, res); res.writeHead(200, { "Content-Type": "application/pdf", "Cache-Control": "no-store" }); res.end(buf);
      } catch (e) { send(req, res, 404, { error: "resume not found: " + rel }); }
      return;
    }
    if (req.method === "POST" && req.url === "/generate_all") {
      const b = await readJsonBody(req);
      log(`generate_all  fields=${(b.fields || []).length}  runner=${b.runner || "claude"}  company="${(b.context?.company || "").slice(0, 40)}"`);
      const t0 = Date.now();
      const out = await runCLI(buildGenerateAllPrompt(b), b);
      const map = agentEligibleMap(extractJsonArray(out), b.fields);
      log(`  → ${map.length} answers in ${Date.now() - t0}ms`);
      return send(req, res, 200, { map, count: map.length, ms: Date.now() - t0, raw: out.slice(0, 1500) });
    }
    if (req.method === "POST" && req.url === "/pick_resume") {
      const b = await readJsonBody(req); const c = b.context || {};
      const prompt = "Pick the single best resume variant for this job. Options:\n" +
        Object.entries(VARIANT_DESC).map(([k, d]) => `- ${k}: ${d}`).join("\n") +
        `\n\n${UNTRUSTED_DATA_RULES}\nJob: ${c.company} — ${c.role}\nJD:\n${(c.jd || "").slice(0, 2500)}\n\nReturn ONLY JSON: {"variant":"<one key from the list>","reason":"<one short sentence>"}.`;
      const out = await runCLI(prompt, b);
      const pick = extractJsonObject(out);
      if (!VARIANT_DESC[pick.variant]) pick.variant = "default";
      log(`pick_resume → ${pick.variant}`);
      return send(req, res, 200, { variant: pick.variant, reason: pick.reason || "" });
    }
    if (req.method === "POST" && req.url === "/generate") {
      const b = await readJsonBody(req); const c = b.context || {};
      log(`generate (single)  question="${(c.question || b.prompt || "").slice(0, 50)}"`);
      const prompt = b.kind === "cover_letter"
        ? `Write a tailored cover letter. ${PRINCIPLES}\n${UNTRUSTED_DATA_RULES}\nCompany/Role: ${c.company} — ${c.role}\nCandidate: ${c.profileSummary}\nJD:\n${c.jd}\nOutput ONLY the letter.`
        : `Answer this job-application question in the candidate's voice. ${PRINCIPLES}\n${UNTRUSTED_DATA_RULES}\nQuestion: ${c.question || b.prompt}\nCompany/Role: ${c.company} — ${c.role}\nCandidate: ${c.profileSummary}\nOutput ONLY the answer.`;
      const out = await runCLI(prompt, b);
      return send(req, res, 200, { text: out.trim() });
    }
    send(req, res, 404, { error: "not found" });
  } catch (e) { log("\x1b[31mERROR\x1b[0m", e.message); if (!res.headersSent) send(req, res, 500, { error: String(e.message || e) }); }
});

server.listen(PORT, "127.0.0.1", () => {
  log(`JobFill server → http://localhost:${PORT}`);
  log(`allowed extension origin=${expectedExtensionOrigin() || "MISSING — set JOBFILL_EXTENSION_ID"}`);
  log(`claude=${which("claude") || "MISSING"}  codex=${which("codex") || "MISSING"}`);
  log("Leave this running; the extension calls it. Ctrl-C to stop.");
});
