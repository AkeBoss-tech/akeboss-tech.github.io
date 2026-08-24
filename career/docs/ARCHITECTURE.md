# Architecture

## System Overview

```
config/sources.yml + portals.yml
                 │
        ┌────────▼────────┐
        │ SQLite monitor  │ due times, leases, health, backoff
        └────────┬────────┘
                 │ repeatable --company claims
        ┌────────▼────────┐
        │ connector runner│ public feeds + deterministic career sites
        └─────┬──────┬────┘
              │      └──────────────┐
      ┌───────▼───────┐      ┌──────▼────────┐
      │ raw snapshots │      │ source result │ completeness + counts
      │ SHA-256 + gzip│      └──────┬────────┘
      └───────────────┘             │
                             ┌──────▼────────┐
                             │ canonical jobs│ jobs.ndjson
                             └──────┬────────┘
                                    │
                      ┌─────────────┼─────────────┐
                      ▼             ▼             ▼
             relevant-jobs   pipeline/history   application flow

failed / partial / suspicious / unsupported
                 │
        ┌────────▼──────────┐
        │ escalation NDJSON│ bounded evidence and recent runs
        └────────┬──────────┘
                 │ agent proposes config or deterministic recipe
                 └──────────────► fixture + live validation ► source catalog
```

Job discovery is deterministic in steady state. Agents evaluate applications
and repair unsupported or drifting sources, but they do not own canonical job
writes or lifecycle decisions.

## Deterministic Monitoring

`monitor-jobs.mjs` is the control plane. `scanner/state.mjs` persists the source
registry, every run outcome, due times, owner-checked leases, accepted count
baselines and open/resolved escalations in SQLite. A LaunchAgent may wake it
frequently, while each source's cadence determines whether it is actually
fetched.

Source health is one of `new`, `healthy`, `degraded`, `failing`, `suspicious`,
or `agent_required`. Transient failures use exponential backoff. Partial
pagination and implausible count drops do not replace the accepted baseline and
are retried on an anomaly cadence. Canonical lifecycle and monitor health share
the same default 50% drop threshold; only an explicit reviewed `--accept-drop`
override can authorize a larger transition.

The connector registry supports Greenhouse, Ashby, Lever, SmartRecruiters,
Workable, Teamtailor RSS, Pinpoint JSON, Personio XML, Recruitee XML, schema.org
`JobPosting` JSON-LD/sitemaps, the official Hacker News jobs API, and Workday
CXS. Public documented feeds are preferred. Workday CXS and generic structured-page extraction are best-effort
candidate-site adapters with stricter completeness checks and drift alerts.

Each successful response can be retained under `data/raw/` as compressed,
content-addressed evidence. Per-run manifests preserve the mapping from source
and URL to response hash for the same 14-day retention window. Canonical job
identity is source type, board and source job ID; URLs are normalized only for
projection deduplication. Missing or duplicate source IDs make a traversal
partial, and an output-scoped writer lock serializes canonical snapshot updates.

Lifecycle transitions are deliberately asymmetric:

- An observed posting can be added or refreshed from a partial result.
- Only a complete, plausible traversal may act on an omission.
- The first authoritative omission sets `possibly_closed`.
- A second authoritative omission after the configured interval sets `closed`.
- A reappearing job clears all prior omission evidence before it becomes `open` again.
- A healthy rolling-window source moves omitted items to `unknown`, never `closed`; count anomalies still quarantine the run.
- Identifier-only source stubs remain `unknown` evidence and are not projected as actionable roles.
- Failed, partial, suspicious and unscanned sources preserve missing jobs.

`data/agent-escalations.ndjson` is an interchange queue, not a job store. Its
contract allows endpoint evidence, connector configuration, schema diagnosis
and extraction recipes; it explicitly prohibits canonical job writes and job
closure decisions.

## Evaluation Flow (Single Offer)

1. **Input**: User pastes JD text or URL
2. **Extract**: Playwright/WebFetch extracts JD from URL
3. **Classify**: Detect archetype (1 of 6 types)
4. **Evaluate**: 6 blocks (A-F):
   - A: Role summary
   - B: CV match (gaps + mitigation)
   - C: Level strategy
   - D: Comp research (WebSearch)
   - E: CV personalization plan
   - F: Interview prep (STAR stories)
5. **Score**: Weighted average across 10 dimensions (1-5)
6. **Report**: Save as `reports/{num}-{company}-{date}.md`
7. **PDF**: Generate ATS-optimized CV (`generate-pdf.mjs`)
8. **Track**: Write TSV to `batch/tracker-additions/`, auto-merged

## Batch Processing

The batch system processes multiple offers in parallel:

```
batch-input.tsv    →  batch-runner.sh  →  N × claude -p workers
(id, url, source)     (orchestrator)       (self-contained prompt)
                           │
                    batch-state.tsv
                    (tracks progress)
```

Each worker is a headless Claude instance (`claude -p`) that receives the full `batch-prompt.md` as context. Workers produce:
- Report .md
- PDF
- Tracker TSV line

The orchestrator manages parallelism, state, retries, and resume.

## Data Flow

```
cv.md                    →  Evaluation context
article-digest.md        →  Proof points for matching
config/profile.yml       →  Candidate identity
config/sources.yml       →  Versioned structured ATS catalog
portals.yml              →  Personal filters and source overrides
templates/states.yml     →  Canonical status values
templates/cv-template.html → PDF generation template
```

## File Naming Conventions

- Reports: `{###}-{company-slug}-{YYYY-MM-DD}.md` (3-digit zero-padded)
- PDFs: `cv-candidate-{company-slug}-{YYYY-MM-DD}.pdf`
- Tracker TSVs: `batch/tracker-additions/{id}.tsv`

## Pipeline Integrity

Scripts maintain data consistency:

| Script | Purpose |
|--------|---------|
| `merge-tracker.mjs` | Merges batch TSV additions into applications.md |
| `verify-pipeline.mjs` | Health check: statuses, duplicates, links |
| `dedup-tracker.mjs` | Removes duplicate entries by company+role |
| `normalize-statuses.mjs` | Maps status aliases to canonical values |
| `cv-sync-check.mjs` | Validates setup consistency |

## Live Web Dashboard

`dashboard-web/` is a localhost-only, read-only projection of the monitoring
artifacts. The server watches file modification times and rebuilds its cache
only when `data/relevant-jobs.ndjson`, `data/scan-summary.json`, or
`data/monitor.sqlite` changes. The browser polls `/api/dashboard` every 30
seconds, so a completed monitor run appears without rebuilding or restarting
the dashboard.

The API deliberately omits descriptions, raw snapshots, and internal response
bodies. It exposes compact role projections, aggregate breakdowns, source
health, recent source runs, and open agent escalations. Static assets and API
routes are allowlisted, all other paths fail closed, and the server binds to
`127.0.0.1` by default.

This is separate from the public portfolio application: job-search data under
`data/` is personal and gitignored, so it must not be surfaced through a public
route by default.

## Dashboard TUI

The `dashboard/` directory contains a standalone Go TUI application that visualizes the pipeline:

- Filter tabs: All, Evaluada, Aplicado, Entrevista, Top >=4, No Aplicar
- Sort modes: Score, Date, Company, Status
- Grouped/flat view
- Lazy-loaded report previews
- Inline status picker
