#!/usr/bin/env node
/* selftest.mjs — exercise the native host WITHOUT Chrome, using the same
 * [uint32 LE length][JSON] wire format Chrome uses.
 *   node selftest.mjs ping   # verify wiring + that claude/codex resolve (no tokens)
 *   node selftest.mjs gen     # tiny real generate_all (calls claude — uses tokens)
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2] || "ping";

const msg = mode === "gen"
  ? { action: "generate_all",
      context: { company: "Test Co", role: "SWE Intern", jd: "Build AI features." },
      fields: [
        { i: 0, label: "are you authorized to work in the us?", type: "select", options: ["--", "Yes", "No"], current: "" },
        { i: 1, label: "why are you interested in test co?", type: "textarea", current: "" },
      ] }
  : { action: "ping" };

const child = spawn(process.execPath, [path.join(HERE, "jobfill-host.mjs")], { stdio: ["pipe", "pipe", "inherit"] });

// write one framed message
const body = Buffer.from(JSON.stringify(msg), "utf8");
const hdr = Buffer.alloc(4); hdr.writeUInt32LE(body.length, 0);
child.stdin.write(Buffer.concat([hdr, body]));
child.stdin.end();

// read one framed reply
let buf = Buffer.alloc(0);
child.stdout.on("data", (d) => { buf = Buffer.concat([buf, d]); });
child.stdout.on("end", () => {
  if (buf.length < 4) { console.error("no reply"); process.exit(1); }
  const len = buf.readUInt32LE(0);
  const json = JSON.parse(buf.slice(4, 4 + len).toString("utf8"));
  console.log(JSON.stringify(json, null, 2));
});
