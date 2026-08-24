# Career-Ops

**[:gb: English](#what-is-this)** | **[:es: Español](#es-versión-en-español)**

> AI-powered job search pipeline built on Claude Code. Evaluate offers, generate tailored CVs, scan portals, and track everything -- powered by AI agents.

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

---

<p align="center">
  <img src="docs/demo.gif" alt="Career-Ops Demo" width="800">
</p>

## What Is This

Career-Ops turns Claude Code into a full job search command center. Instead of manually tracking applications in a spreadsheet, you get an AI-powered pipeline that:

- **Evaluates offers** with a structured A-F scoring system (10 weighted dimensions)
- **Generates tailored PDFs** -- ATS-optimized CVs customized per job description
- **Scans portals** through repeatable structured feeds (Greenhouse, Ashby,
  Lever, SmartRecruiters, and Workable), with stable IDs and source health
- **Processes in batch** -- evaluate 10+ offers in parallel with sub-agents
- **Tracks everything** in a single source of truth with integrity checks

> **Important: This is NOT a spray-and-pray tool.** The whole point is to apply only where there's a real match -- for your sake and for the recruiter reading your application. The scoring system helps you focus on high-fit opportunities instead of wasting everyone's time. Always review before submitting.

Built by someone who used it to evaluate 740+ job offers, generate 100+ tailored CVs, and land a Head of Applied AI role. [Read the full case study](https://santifer.io/career-ops-system).

## Features

| Feature | Description |
|---------|-------------|
| **Auto-Pipeline** | Paste a URL, get a full evaluation + PDF + tracker entry |
| **6-Block Evaluation** | Role summary, CV match, level strategy, comp research, personalization, interview prep (STAR+R) |
| **Interview Story Bank** | Accumulates STAR+Reflection stories across evaluations -- 5-10 master stories that answer any behavioral question |
| **Negotiation Scripts** | Salary negotiation frameworks, geographic discount pushback, competing offer leverage |
| **ATS PDF Generation** | Keyword-injected CVs with Space Grotesk + DM Sans design |
| **Portal Scanner** | 173 structured company feeds across AI, infrastructure, robotics, quant, computational biology, finance, and enterprise AI |
| **Batch Processing** | Parallel evaluation with `claude -p` workers |
| **Dashboard TUI** | Terminal UI to browse, filter, and sort your pipeline |
| **Pipeline Integrity** | Automated merge, dedup, status normalization, health checks |

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/santifer/career-ops.git
cd career-ops && npm install
npx playwright install chromium   # Required for PDF generation

# 2. Configure
cp config/profile.example.yml config/profile.yml  # Edit with your details
cp templates/portals.example.yml portals.yml       # Customize companies

# 3. Add your CV
# Create cv.md in the project root with your CV in markdown

# 4. Personalize with Claude
claude   # Open Claude Code in this directory

# Then ask Claude to adapt the system to you:
# "Change the archetypes to backend engineering roles"
# "Translate the modes to English"
# "Add these 5 companies to portals.yml"
# "Update my profile with this CV I'm pasting"

# 5. Start using
# Paste a job URL or run /career-ops

# Or run the deterministic scanner directly
npm run scan:preview  # live fetch, no local writes
npm run scan          # persist rich NDJSON + add new matches to the pipeline

# Or run only sources that are due, with durable health/backoff
npm run monitor:preview
npm run monitor
npm run monitor:status
```

> **The system is designed to be customized by Claude itself.** Modes, archetypes, scoring weights, negotiation scripts -- just ask Claude to change them. It reads the same files it uses, so it knows exactly what to edit.

See [docs/SETUP.md](docs/SETUP.md) for the full setup guide.

## Usage

Career-ops is a single slash command with multiple modes:

```
/career-ops                → Show all available commands
/career-ops {paste a JD}   → Full auto-pipeline (evaluate + PDF + tracker)
/career-ops scan           → Scan portals for new offers
/career-ops pdf            → Generate ATS-optimized CV
/career-ops batch          → Batch evaluate multiple offers
/career-ops tracker        → View application status
/career-ops apply          → Fill application forms with AI
/career-ops pipeline       → Process pending URLs
/career-ops contacto       → LinkedIn outreach message
/career-ops deep           → Deep company research
/career-ops training       → Evaluate a course/cert
/career-ops project        → Evaluate a portfolio project
```

Or just paste a job URL or description directly -- career-ops auto-detects it and runs the full pipeline.

## How It Works

```
You paste a job URL or description
        │
        ▼
┌──────────────────┐
│  Archetype       │  Classifies: LLMOps / Agentic / PM / SA / FDE / Transformation
│  Detection       │
└────────┬─────────┘
         │
┌────────▼─────────┐
│  A-F Evaluation   │  Match, gaps, comp research, STAR stories
│  (reads cv.md)    │
└────────┬─────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
 Report  PDF  Tracker
  .md   .pdf   .tsv
```

## Structured Job Scanner

The scanner is executable code rather than an agent-only browsing prompt. It
uses public job feeds and deterministic career-site adapters, isolates failures
per company, retries transient errors, verifies pagination, and stores one
canonical record per source job ID.

```bash
npm run scan:preview
npm run scan
npm run monitor:preview
npm run monitor
npm run monitor:status
```

The canonical snapshot is `data/jobs.ndjson`; the filtered open set is
`data/relevant-jobs.ndjson`; run health and coverage are in
`data/scan-summary.json`. These personal, time-sensitive files remain ignored by
Git. Existing `data/pipeline.md` and `data/scan-history.tsv` stay compatible as
derived projections.

Each rich record includes source provenance, stable job ID, canonical and apply
URLs, primary/secondary locations, workplace and employment type, departments,
teams, descriptions, compensation when published, source timestamps,
first/last-seen lifecycle fields, and match reasons. Raw successful responses
are retained locally as content-addressed gzip snapshots for 14 days, with a
per-run manifest mapping each response hash back to its company and URL. Partial
or suspicious traversals may contribute observed jobs but cannot close missing
ones. A role closes only after two authoritative omissions separated by the
configured interval, and a reappearing role clears that omission history.
Identifier-only source stubs are retained as `unknown` evidence instead of
being presented as actionable roles. The Markdown pipeline remains a
compatibility projection.

The official Hacker News `jobstories` API is a bounded rolling window. A
posting that leaves the window becomes non-actionable `unknown`; its absence is
never presented as evidence that the employer closed it. Empty or implausibly
truncated windows still fail the normal count-integrity guards.

`monitor-jobs.mjs` adds persistent SQLite scheduling, owner-checked leases,
source health, exponential backoff, count-drop quarantine, and run history. An
output-scoped writer lock serializes canonical read/merge/write cycles even when
different monitor batches or direct scans overlap.
Unsupported or repeatedly broken sources are exported to
`data/agent-escalations.ndjson`; agents may propose a deterministic connector or
repair recipe, but cannot write canonical jobs or make closure decisions.

On macOS, preview or install the optional LaunchAgent (Node 22.16+; required
for the stable built-in SQLite API):

```bash
npm run monitor:plist
npm run monitor:install
node scripts/install-monitor-launchd.mjs --uninstall
```

### Optional Chrome control surface

`chrome-extension/` contains an unpacked Manifest V3 extension that schedules
due checks while Chrome is running and shows source health, new relevant jobs,
and recent matches. It connects through a per-user macOS native-messaging host;
there is no localhost port, remote extension code, or broad website access.

```bash
npm run extension:native:preview
npm run extension:native:install
```

Then load the `chrome-extension/` directory from `chrome://extensions` and
confirm its stable ID is `hjmedfgjhbbfpmdmpikekgpngokcpfol`. The installer
only registers the exact extension origin and does not load or modify Chrome.
See [`chrome-extension/README.md`](chrome-extension/README.md) for setup,
uninstall, and the privacy boundary.

The extension does not crawl LinkedIn or Handshake. Its explicit **Capture this
visible job** button may save bounded structured metadata and selected text from
the active HTTPS tab into `data/manual-captures.ndjson` for review. Manual
captures never enter canonical jobs or role-closure decisions.

## Pre-configured Portals

The tracked catalog contains **173 structured company boards**. Copy
`templates/portals.example.yml` to `portals.yml` to customize filters and add
local overrides without forking the shared catalog.

**AI and infrastructure:** OpenAI, Anthropic, Cohere, Mistral, xAI, CoreWeave,
Databricks, Cursor, Baseten, Modal, Together AI, LangChain, Cloudflare

**Enterprise and founding:** Harvey, Sierra, Decagon, Glean, Ramp, Rogo,
OpenEvidence, Abridge, Mercor, Clay, Tavily, Exa, Lovable

**Robotics and physical AI:** Anduril, SpaceX, Figure AI, Physical
Intelligence, 1X, Apptronik, Agility Robotics, Waabi

**Quantitative roles:** IMC, Point72, Jump, Five Rings, PDT, Tower Research,
Virtu, Akuna, AQR, DV Trading, Flow Traders, Radix, Schonfeld

**Research and computational biology:** Allen Institute for AI, Isomorphic
Labs, Recursion, Generate Biomedicines, Ginkgo Bioworks, CERN, Bosch

**Structured sources:** Ashby, Greenhouse, Lever, SmartRecruiters, Workable,
Teamtailor RSS, Pinpoint, Personio, Recruitee XML, the official Hacker News jobs
API, JobPosting JSON-LD, and Workday CXS. Workday and generic page extraction are best-effort public-site
adapters and therefore receive stricter health checks. Custom sites enter the
agent discovery/repair queue until their extraction is deterministic.

## Live Web Dashboard

The local web dashboard reads the monitor's canonical NDJSON, scan summary, and
SQLite health database directly. It is read-only, binds to `127.0.0.1`, and
refreshes itself every 30 seconds as the underlying data changes.

```bash
npm run dashboard:web
open http://127.0.0.1:4173
```

It shows total and relevant open roles, latest-scan additions, source health,
agent-repair queues, data quality, trends, and a searchable/filterable role
table with direct application links. The server projects only dashboard fields;
full descriptions and raw response snapshots never reach the browser.

The dashboard reads personal files under `data/`, which are intentionally
gitignored. Keep it bound to localhost unless you add authentication and an
explicit private-data deployment policy.

## Dashboard TUI

The built-in terminal dashboard lets you browse your pipeline visually:

```bash
cd dashboard
go build -o career-dashboard .
./career-dashboard
```

Features: 6 filter tabs, 4 sort modes, grouped/flat view, lazy-loaded previews, inline status changes.

## Project Structure

```
career-ops/
├── CLAUDE.md                    # Agent instructions
├── cv.md                        # Your CV (create this)
├── article-digest.md            # Your proof points (optional)
├── config/
│   ├── profile.example.yml      # Template for your profile
│   └── sources.yml              # Versioned structured company catalog
├── scanner/                     # ATS adapters + canonical data model
├── scan-jobs.mjs                # Executable discovery pipeline
├── monitor-jobs.mjs             # Durable due scheduler + source health
├── scripts/install-monitor-launchd.mjs # Optional macOS scheduler
├── modes/                       # 14 skill modes
│   ├── _shared.md               # Shared context (customize this)
│   ├── oferta.md                # Single evaluation
│   ├── pdf.md                   # PDF generation
│   ├── scan.md                  # Portal scanner
│   ├── batch.md                 # Batch processing
│   └── ...
├── templates/
│   ├── cv-template.html         # ATS-optimized CV template
│   ├── portals.example.yml      # Scanner config template
│   └── states.yml               # Canonical statuses
├── batch/
│   ├── batch-prompt.md          # Self-contained worker prompt
│   └── batch-runner.sh          # Orchestrator script
├── dashboard/                   # Go TUI pipeline viewer
├── dashboard-web/               # Read-only local live web dashboard
├── data/                        # Your tracking data (gitignored)
├── reports/                     # Evaluation reports (gitignored)
├── output/                      # Generated PDFs (gitignored)
├── fonts/                       # Space Grotesk + DM Sans
├── docs/                        # Setup, customization, architecture
└── examples/                    # Sample CV, report, proof points
```

## Tech Stack

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Bubble Tea](https://img.shields.io/badge/Bubble_Tea-FF75B5?style=flat&logo=go&logoColor=white)

- **Agent**: Claude Code with custom skills and modes
- **PDF**: Playwright/Puppeteer + HTML template
- **Scanner**: Node.js connector registry, rich NDJSON, SQLite source health, and bounded agent repair queue
- **Dashboard**: Local Node.js live web dashboard + Go/Bubble Tea terminal viewer
- **Data**: Markdown tables + YAML config + TSV batch files

## Also Open Source

- **[cv-santiago](https://github.com/santifer/cv-santiago)** -- The portfolio website (santifer.io) with AI chatbot, LLMOps dashboard, and case studies. If you need a portfolio to showcase alongside your job search, fork it and make it yours.

## About the Author

I'm Santiago -- Head of Applied AI, former founder (built and sold a business that still runs with my name on it). I built career-ops to manage my own job search. It worked: I used it to land my current role.

My portfolio and other open source projects → [santifer.io](https://santifer.io)

## License

MIT

---

# :es: Version en Español

## Que es esto

Career-Ops convierte Claude Code en un centro de mando de busqueda de empleo. En vez de trackear aplicaciones en un spreadsheet, tienes un pipeline AI que:

- **Evalua ofertas** con scoring estructurado A-F (10 dimensiones ponderadas)
- **Genera PDFs personalizados** -- CVs ATS-optimizados por oferta
- **Escanea portales** automaticamente (Greenhouse, Ashby, Lever, webs de empresas)
- **Procesa en batch** -- evalua 10+ ofertas en paralelo con sub-agentes
- **Trackea todo** en una fuente de verdad unica con checks de integridad

> **Importante: Esto NO es para spamear empresas.** El objetivo es aplicar solo donde hay match real -- por tu bien y por el de quien lea tu aplicacion. El scoring te ayuda a centrarte en las oportunidades de alto fit en vez de perder el tiempo de todos. Siempre revisa antes de enviar.

Construido por alguien que lo uso para evaluar 740+ ofertas, generar 100+ CVs personalizados, y conseguir un rol de Head of Applied AI. [Lee el case study completo](https://santifer.io/career-ops).

## Inicio rapido

```bash
# 1. Clonar
git clone https://github.com/santifer/career-ops.git
cd career-ops && npm install

# 2. Configurar
cp config/profile.example.yml config/profile.yml  # Editar con tus datos
cp templates/portals.example.yml portals.yml       # Personalizar empresas

# 3. Añadir tu CV
# Crear cv.md en la raiz del proyecto con tu CV en markdown

# 4. Personalizar con Claude
claude   # Abrir Claude Code en este directorio

# Pidele a Claude que adapte el sistema a ti:
# "Cambia los arquetipos a roles de backend"
# "Traduce los modes a ingles"
# "Añade estas empresas a portals.yml"
# "Actualiza mi perfil con este CV que te pego"

# 5. Usar
# Pega una URL de oferta o ejecuta /career-ops
```

> **El sistema esta diseñado para que Claude lo personalice.** Modes, arquetipos, scoring, scripts de negociacion -- solo pidelo. Claude lee los mismos archivos que usa, asi que sabe exactamente que editar.

Guia completa en [docs/SETUP.md](docs/SETUP.md).

## Portales incluidos

El scanner incluye **173 feeds estructurados** de empresas y mantiene las queries
manuales como fallback para sitios custom. Copia `templates/portals.example.yml`
a `portals.yml` para personalizar filtros y overrides locales:

**AI Labs:** Anthropic, OpenAI, Mistral, Cohere, LangChain, Pinecone
**Voice AI:** ElevenLabs, PolyAI, Parloa, Hume AI, Deepgram, Vapi, Bland AI
**Plataformas AI:** Retool, Airtable, Vercel, Temporal, Glean, Arize AI
**Contact Center:** Ada, LivePerson, Sierra, Decagon, Talkdesk, Genesys
**Enterprise:** Salesforce, Twilio, Gong, Dialpad
**LLMOps:** Langfuse, Weights & Biases, Lindy, Cognigy, Speechmatics
**Automatizacion:** n8n, Zapier, Make.com
**Europa:** Factorial, Attio, Tinybird, Clarity AI, Travelperk

**Portales de empleo:** Ashby, Greenhouse, Lever, Wellfound, Workable, RemoteFront

## Uso

Career-ops es un unico slash command con multiples modos:

```
/career-ops                → Mostrar todos los comandos
/career-ops {pega un JD}   → Pipeline completo (evaluar + PDF + tracker)
/career-ops scan           → Escanear portales
/career-ops pdf            → Generar CV ATS-optimizado
/career-ops batch          → Evaluar ofertas en batch
/career-ops tracker        → Ver estado de aplicaciones
/career-ops apply          → Rellenar formularios con IA
/career-ops pipeline       → Procesar URLs pendientes
/career-ops contacto       → Mensaje LinkedIn outreach
/career-ops deep           → Research profundo de empresa
```

O simplemente pega una URL o descripcion de oferta -- career-ops la detecta y ejecuta el pipeline completo.

## Tambien Open Source

- **[cv-santiago](https://github.com/santifer/cv-santiago)** -- El portfolio (santifer.io) con chatbot IA, dashboard LLMOps y case studies. Si necesitas un portfolio para acompañar tu busqueda de empleo, echale un vistazo.

## Documentacion

- [SETUP.md](docs/SETUP.md) -- Guia de instalacion
- [CUSTOMIZATION.md](docs/CUSTOMIZATION.md) -- Como personalizar
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) -- Como funciona el sistema

## Let's Connect

[![Website](https://img.shields.io/badge/santifer.io-000?style=for-the-badge&logo=safari&logoColor=white)](https://santifer.io)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/santifer)
[![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:hola@santifer.io)
