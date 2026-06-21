---
name: cover-letter
description: Research a company + role, then generate a tailored, ATS-ready LaTeX cover letter and compile it to PDF from Akash's "killer cover letter" template. Use when asked to "write a cover letter", "cover letter for <company>", "generate a cover letter for <role> at <company>", or given a job posting URL to apply to.
user_invocable: true
args: company and role (and optionally a job-description URL or pasted JD text)
---

# cover-letter — Tailored Cover Letter Generator

Turn a company + role into a finished, one-page cover letter PDF that follows the
killer-cover-letter principles. The flow: **research → select proof → fill template →
compile → open**. Never produce a generic letter; every one must reference the
specific company and role.

## Inputs

Parse `{{args}}` for:
- **Company** (required)
- **Role / title** (required — if missing, ask once, or infer from the JD)
- **JD URL or pasted JD text** (optional but strongly preferred — fetch/read it)

Key files (repo-relative):
- Template: `files/cover-letter-template.tex`
- Principles: `.claude/skills/cover-letter/reference/cover-letter-principles.md`
- Candidate proof points: `files/resume.tex` (and `career/cv.md` if present)
- Output dir: `files/cover-letters/`

## Workflow

### 1. Research the company and role (do this first — it's the whole point)
Read the principles file. Then gather **3–5 concrete, specific facts** using WebSearch /
WebFetch (load via ToolSearch: `select:WebSearch,WebFetch`):
- What the company actually builds and the **core bet/problem** it is making (one crisp sentence).
- Something **recent and real**: a launch, funding round, named customer, or roadmap direction.
- The **role's** actual responsibilities and what they're optimizing for (fetch the JD URL if given; otherwise search "{company} {role} job description").
Discard fluff. You need facts a hiring manager would recognize as true, not marketing adjectives.

### 2. Select the single best proof story
From the candidate's experience (read `files/resume.tex` / `career/cv.md`), pick the **ONE**
story that best matches the role's problem space. Favor ones with a **metric and scale**
(e.g. NYL AI agent for 12,000 CSRs; Lykke RAG pipeline with citations/token-budgeting;
Samaritan Scout 90% manual-work reduction across 100k+ sites; Scarlet Sync thousands of users).
Match proof to role:
- agent / applied-AI / product → NYL CSR agent, Decagon-style, Scarlet Sync assistant
- infra / platform → Lykke distributed wiki engine (SQS, Redis, ECS), CUDA/HPC
- research / ML → SLM fine-tuning/quantization, robotics CUDA, genomics pipelines
- finance / enterprise / automation → NYL claims automation + knowledge base
- founding / startup → Scarlet Sync 0→1 with real users

### 3. Fill the template
Copy `files/cover-letter-template.tex` and replace **every** `[[PLACEHOLDER]]` — leave no
brackets in the output. Honor the structure and rules in the principles file:
- **Hook (2–3 sentences):** state the company's core bet/problem, then assert the match. Never "I am excited to apply."
- **Proof (1–2 paras):** the chosen story in Problem → Solution → Impact form, with a metric. Extend the resume, don't restate it.
- **Fit / why-now (keep the fixed pitch):** AI-tool fluency + fast adaptation + helping the firm expand. Personalize only the bracketed **recent company fact** and the why-now sentence.
- **Close:** tie to the specific thing the team is building.
- Total **250–400 words**. Sound like a person. Strip every AI-tell listed in the principles file.

### 4. Compile and open
Write to `files/cover-letters/cover-<company-slug>.tex` (lowercase, hyphenated). Then:
```bash
mkdir -p files/cover-letters
cd files/cover-letters && pdflatex -interaction=nonstopmode -halt-on-error cover-<slug>.tex \
  && rm -f cover-<slug>.aux cover-<slug>.log cover-<slug>.out \
  && open cover-<slug>.pdf
```
If `pdflatex` errors, read the log, fix the `.tex`, and recompile before reporting.

### 5. Report
Tell the user: output path, word count, the company facts you used, and which proof story
you chose. Run the final quality checklist from the principles file and confirm it passes.

## Notes
- Keep it to **one page**. If it overflows, tighten the proof paragraph, don't shrink margins.
- The template is tectonic/XeTeX-safe (guards `\pdfgentounicode`); it also compiles with `pdflatex` locally.
- For several companies at once, run this per company; optionally delegate each to a
  `general-purpose` subagent (Sonnet) with this SKILL.md content injected, to keep main context clean.
- Do not invent facts about the candidate or the company. If a claimed company fact can't be
  verified, use a softer, true statement instead.
