# JobFill — personal job-application autofill

A self-hosted "Simplify" for one person. Deterministic field-mapping where
possible, an LLM (your `claude`/`codex` CLI) only where required, and a
human-review checklist that **never auto-submits**.

## Why this design

Field-mapping is mostly a solved, boring problem (80% of fields are
name/email/school/links/EEO), so those are handled by **deterministic rules**.
The hard 20% — "why do you want to work here?", a custom screening essay, a
resume tweak — is escalated to a **local CLI runner** that you already pay for
(`claude -p` / `codex exec`). No vendor server, no API key, no data leaves your
machine.

```
 application page
        │  content.js (deterministic: ATS adapters + synonym rules)
        ▼
   side panel  ──register/review──►  you
        │  (free-text / unknown fields)
        ▼
 background.js ──Native Messaging──► jobfill-host.mjs ──► `claude -p` / `codex exec`
```

## Two fill modes

- **Detect & fill** — deterministic only. Fast, free, no agent. Fills the known
  fields, flags the rest.
- **✨ Generate all (Haiku)** — deterministic fill first, then a Claude **Haiku**
  agent completes the rest (essays, leftover dropdowns) using your **resume
  (`career/cv.md`), `profile.json`, and `about.md`**. It still routes EEO/uploads
  to you and never submits. Requires the native host installed.
  - **Dropdowns:** every `<select>`'s allowed options are serialized and sent to
    the agent, which is required to copy one option **exactly** (no invented
    values). This fixes the common "AI guesses a dropdown value that isn't there."
  - Edit `about.md` (gitignored; copy from `about.example.md`) to steer answers,
    voice, salary, locations, etc.

## The deterministic ↔ LLM boundary

| Field kind | Handled by | Tag |
|---|---|---|
| name, email, phone, links, school | ATS adapter / synonym rule | 🟢 auto |
| degree, GPA, dates, location, work-auth, salary, "how heard" | synonym rule | 🟡 verify |
| "why us", custom essays, "biggest project" | **LLM runner** (drafted, you approve) | 🔵 drafted |
| EEO / demographics, unmapped fields, file upload | nothing — routed to you | 🔴 you |
| Workday account creation, captcha, assessments | nothing | ⚪ blocker |

Rules live in `extension/src/fieldmap.js` (`RULES` = synonym regexes,
`ATS` = per-platform selectors). Add a platform by adding an adapter array.

## Setup (macOS, ~10 min)

1. **Profile:** `profile.json` already holds your data (gitignored). Edit freely.
2. **Load the extension:** `chrome://extensions` → enable Developer mode →
   "Load unpacked" → select `tools/jobfill/extension`. Copy the **extension ID**.
3. **Register the native host** (lets Chrome run your CLI):
   ```bash
   cd tools/jobfill/native-host
   ./install.sh <EXTENSION_ID>
   ```
   Requires `node`, and `claude` (and/or `codex`) on your PATH and logged in.
   Restart Chrome.
4. **Use it:** open a Greenhouse/Lever/Ashby application → click the JobFill
   icon to open the side panel → import `profile.json` once → "Detect & fill".
   Review the amber/blue/red items, generate drafts where offered, then submit
   manually.

## What works / what's stubbed

- ✅ Greenhouse + Lever adapters, generic synonym fallback, React-safe filling,
  review taxonomy + pre-submit gate, native-messaging → CLI generation.
- 🚧 Ashby is mostly generic-rule driven (dynamic field names); Workday/iCIMS
  are flagged as blockers (multi-step + account creation) — add adapters later.
- 🚧 Resume-variant auto-pick: `profile.resume_variants` is wired; selection
  logic (map company → category via `files/job-targets.csv`) is a TODO.
- 🚧 Learned-mapping cache (persist LLM field classifications per domain) — TODO.

## Test the mapper (headless)

The deterministic engine is unit-tested against a sample Greenhouse form using
the real `fieldmap.js` + `mapper.js` (no browser needed):
```bash
npm i jsdom --no-save        # one-time, from repo root
cd tools/jobfill && node test/run-sample.mjs
```
Prints the fill plan + tags and asserts 10 behaviors (auto-fills identity, maps
work-auth/GPA, routes essays to the LLM, refuses EEO/unknown/file fields).

## Troubleshooting "Generate all"

The deterministic "Detect & fill" works with zero setup. "Generate all" needs
the native host, which talks to your `claude` CLI. If it fails:

1. **Register the host** (most common cause — it's a one-time step):
   ```bash
   cd tools/jobfill/native-host && ./install.sh <EXTENSION_ID>   # then restart Chrome
   ```
   Get `<EXTENSION_ID>` from `chrome://extensions`.
2. **Verify the host + that `claude` resolves — no Chrome, no tokens:**
   ```bash
   node tools/jobfill/native-host/selftest.mjs ping
   # -> { ok:true, claude:"/…/claude", claudeFound:true, … }
   ```
   If `claudeFound:false`, install the Claude CLI or set `JOBFILL_CLAUDE_BIN`.
3. **Real end-to-end test (uses tokens):**
   ```bash
   node tools/jobfill/native-host/selftest.mjs gen   # -> {"map":[{"i":0,"value":"Yes"}, …]}
   ```
4. **See the real error in Chrome:** `chrome://extensions` → JobFill → "service
   worker" → Console. The side panel also shows the host's error message.

Note: Chrome launches the host with a minimal PATH, so the host widens PATH and
resolves `claude` to an absolute path (homebrew, `~/.local/bin`, nvm). `install.sh`
also bakes the absolute paths into the launcher.

## Reuse / prior art studied

- **Open source to fork ideas from:** [berellevy/job_app_filler](https://github.com/berellevy/job_app_filler)
  (Workday/Greenhouse, no data collection), [andrewmillercode/Autofill-Jobs](https://github.com/andrewmillercode/Autofill-Jobs) (Vue).
- **Commercial reference:** Simplify Copilot (100+ ATS), JobWizard, Huntr.
- **Native Messaging:** [Chrome docs](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging)
  — host gets `[uint32 LE length][JSON]` over stdio.
- **Headless runners:** [Claude Code headless](https://code.claude.com/docs/en/headless)
  (`claude -p`), `codex exec --sandbox read-only`.
- This repo's `career/modes/apply.md` (answer-generation logic) and the
  `cover-letter` skill (essay drafting) are the brains the runner reuses.

## Safety

- **Never auto-submits** — by design there is no submit-click code path.
- **Never guesses eligibility/EEO** — those are always routed to you.
- `profile.json` is gitignored (PII); only `profile.example.json` is committed.
- The native host runs trusted, fixed prompts; it does **not** pass
  `--dangerously-skip-permissions`.
