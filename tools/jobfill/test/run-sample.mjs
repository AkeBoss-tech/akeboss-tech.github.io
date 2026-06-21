/* Headless test of the deterministic mapper against a sample application form.
 * Loads the REAL fieldmap.js + mapper.js into a jsdom window and runs planFill.
 * Usage: node test/run-sample.mjs   (from tools/jobfill/) */
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, "..");
const html = readFileSync(path.join(dir, "sample-form.html"), "utf8");
const profile = JSON.parse(readFileSync(path.join(root, "profile.json"), "utf8"));

// jsdom with a Greenhouse URL so ATS.detect() returns 'greenhouse'
const dom = new JSDOM(html, { url: "https://job-boards.greenhouse.io/fiveringsllc/jobs/4017982008", runScripts: "outside-only" });
const { window } = dom;

// Load the actual extension source into the jsdom window scope.
for (const f of ["extension/src/fieldmap.js", "extension/src/mapper.js"]) {
  window.eval(readFileSync(path.join(root, f), "utf8"));
}

const { platform, plan } = window.JobFill.planFill(profile, window.document, window);

const COLORS = { auto: "🟢", verify: "🟡", drafted: "🔵", you: "🔴", blocker: "⚪" };
const counts = {};
console.log(`\nATS detected: ${platform}\n`);
console.log("TAG  KEY              VALUE / ACTION");
console.log("---  ---------------  ------------------------------------------");
for (const p of plan) {
  counts[p.tag] = (counts[p.tag] || 0) + 1;
  const val = p.value != null ? String(p.value) : `(${p.status})`;
  console.log(`${COLORS[p.tag] || "  "}  ${p.key.padEnd(15)}  ${val.slice(0, 50)}`);
}
console.log("\nSummary:", Object.entries(counts).map(([k, v]) => `${COLORS[k]} ${k}:${v}`).join("  "));

// Assertions — these are what "working" means.
const byKey = Object.fromEntries(plan.map(p => [p.key, p]));
const checks = [
  ["first_name auto-filled Akash", byKey.first_name?.value === "Akash" && byKey.first_name.tag === "auto"],
  ["email auto-filled", byKey.email?.value === profile.identity.email && byKey.email.tag === "auto"],
  ["GPA mapped (verify)", byKey.gpa?.value === "3.95" && byKey.gpa.tag === "verify"],
  ["work auth -> verify Yes", byKey.work_auth?.value === "Yes"],
  ["sponsorship -> No", byKey.sponsorship?.value === "No"],
  ["essays -> drafted (LLM)", plan.filter(p => p.tag === "drafted").length === 2],
  ["EEO gender -> you (not filled)", byKey.eeo_gender?.tag === "you" && byKey.eeo_gender.value == null],
  ["EEO veteran -> you", byKey.eeo_veteran?.tag === "you"],
  ["unknown referral -> you", plan.some(p => p.key === "unknown" && /referral/.test(p.label))],
  ["resume upload -> you/manual", plan.some(p => p.key === "resume" && p.tag === "you")],
];
// Serialization (what the "Generate all" agent receives) — dropdowns must carry options.
const ser = window.JobFill.serializeFields(plan);
const degree = ser.find(f => f.key === "degree");
const auth = ser.find(f => f.key === "work_auth");
console.log("\nDropdown payload the agent sees:");
console.log(`  degree options:    ${JSON.stringify(degree?.options)}`);
console.log(`  work_auth options: ${JSON.stringify(auth?.options)}`);
checks.push(["serialize: degree dropdown exposes options", Array.isArray(degree?.options) && degree.options.includes("Bachelor of Science")]);
checks.push(["serialize: work_auth dropdown exposes Yes/No", Array.isArray(auth?.options) && auth.options.includes("Yes") && auth.options.includes("No")]);
checks.push(["serialize: select type tagged", degree?.type === "select"]);

// Value coercion for typed inputs (the SpaceX date-field bug).
const cv = window.JobFill.coerceValue;
console.log("\nValue coercion (typed inputs):");
console.log(`  date  "May 2027" -> ${cv({ type: "date" }, "May 2027")}`);
console.log(`  month "2026-06"  -> ${cv({ type: "month" }, "2026-06")}`);
console.log(`  number "3.95"    -> ${cv({ type: "number" }, "3.95")}`);
console.log(`  date  "garbage"  -> ${cv({ type: "date" }, "garbage")}`);
checks.push(["coerce date 'May 2027' -> 2027-05-01", cv({ type: "date" }, "May 2027") === "2027-05-01"]);
checks.push(["coerce month '2026-06' -> 2026-06", cv({ type: "month" }, "2026-06") === "2026-06"]);
checks.push(["coerce number '3.95' -> 3.95", cv({ type: "number" }, "3.95") === "3.95"]);
checks.push(["coerce unparseable date -> null (skip, no throw)", cv({ type: "date" }, "garbage") === null]);
checks.push(["coerce passes text through", cv({ type: "text" }, "hello") === "hello"]);

console.log("\nChecks:");
let pass = 0;
for (const [name, ok] of checks) { console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}`); if (ok) pass++; }
console.log(`\n${pass}/${checks.length} checks passed.`);
process.exit(pass === checks.length ? 0 : 1);
