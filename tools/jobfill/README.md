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
