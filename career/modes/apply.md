# Mode: apply — Live Application Assistant

Fast-fill mode. User confirms the posting is open; Claude loads context and generates all answers immediately, ready to copy-paste.

## Verification

**Do NOT require Playwright.** If the user says the posting is open (or navigates to it and confirms), proceed immediately.

If the URL is unknown, ask once: "What's the application URL?" Then proceed.

## Workflow

```
1. CONFIRM   → User confirms posting is open (or pastes URL they verified)
2. LOAD      → Match against reports/ by company name; load report + cv.md
3. GENERATE  → Produce ALL standard answers immediately (no waiting for user to paste questions)
4. PRESENT   → Formatted copy-paste block per field
5. GAPS      → Flag any fields that need user input (salary, start date, custom essays)
6. POST      → After user confirms submitted: update tracker to Applied, suggest /contacto
```

## Step 1 — Identify the role

Extract company + role from context (URL, user message, or report number). Match against `reports/` with case-insensitive grep. Load the full report.

## Step 2 — Generate answers proactively

Don't wait for the user to paste form questions. Generate answers for ALL standard Greenhouse/Lever/Ashby fields immediately using the report's Block G + Block B:

### Standard fields to fill (always generate these):

**Resume** → remind user to attach the tailored PDF from `output/cvs/`

**LinkedIn URL** → `https://linkedin.com/in/akash-dubey-06`

**Website/Portfolio** → `https://akashdubey.me`

**GitHub** → `https://github.com/AkeBoss-tech`

**Work Authorization** → U.S. Citizen — no sponsorship needed

**Graduation Date** → May 2027

**Degree** → B.S. Computer Science and Mathematics

**GPA** → 3.97/4.0

**How did you hear about this role?** → Online job board / company careers page

**Start date** → Ask user: "When can you start? (typical: May/June 2026)"

**Why [Company]?** → Use Block G draft; personalize with 1-2 specifics from Block A

**Cover Letter / Additional Info** → Use Block G answer + proof point framing from Block B

**Anything else you'd like us to know?** → 2-3 sentence summary: CUDA at ARC Lab + Lykke production + TopCoder 5th

### Role-specific technical questions:
Generate from Block G and Block F stories. If Block G has a draft, use it. If not, synthesize from Block B proof points.

## Step 3 — Output format

```
## Application: [Company] — [Role]
Report: #NNN | Score: X.X/5 | Archetype: [type]
Tailored CV: output/cvs/NNN-slug.tex (compile to PDF first)

---

### Resume
→ Attach: career/output/cvs/NNN-[slug].tex (compile with pdflatex first)

### LinkedIn
→ https://linkedin.com/in/akash-dubey-06

### Website
→ https://akashdubey.me

### Work Authorization
→ U.S. Citizen

### Graduation Date
→ May 2027

### Why [Company]?
[Copy-paste answer]

### Cover Letter / Why this role?
[Copy-paste answer]

### Describe your GPU/ML/relevant experience
[Copy-paste answer]

### Anything else?
[Copy-paste answer]

---
⚠️  Fields needing your input:
- Start date (when can you start?)
- [Any custom essay questions not in Block G]

📎 After submitting: tell me and I'll update the tracker + draft a LinkedIn outreach message.
```

## Post-apply

When user confirms submitted:
1. Update `applications.md` status from `Evaluada` → `Applied`
2. Offer to run `/career-ops contacto` for LinkedIn outreach to a recruiter/engineer at the company
