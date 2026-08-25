# New York Life work retrospective: video findings

> Private working note. This document summarizes a locally supplied video and corroborating portfolio materials. It is intended as a reference for drafting public website copy, not for publication verbatim. Do not publish internal repository names, session identifiers, infrastructure details, or claims that the sources label as unverified.

## Source record

- Primary source: `/Users/akashdubey/Downloads/IMG_8212.MOV`
- Reviewed: August 6, 2026
- Video length: 22.71 seconds
- Video format: 3840 x 2160 HEVC with AAC audio
- Visible artifact: `akash-dubey-ai-work-retrospective.html`
- Artifact label: "Individual work record · manager handoff"
- Artifact snapshot: frozen August 5, 2026 at 5:12 PM ET
- Corroborating local sources:
  - `files/resume.tex`
  - `files/cover-letters/cover-palantir-fde-new-grad-commercial.tex`
  - `files/cover-letters/cover-sierra.tex`

The retrospective explicitly says that it describes Akash Dubey's individual retained activity, not department-wide or company-wide adoption. Its counts are not evidence of headcount productivity, cost savings, realized ROI, production deployment, or business outcomes.

## Executive finding

Akash's New York Life work was broader than a single claims chatbot. The record shows six connected workstreams: Claims AI, Pega engineering, Company Brain/NYL Knowledge, AEM engineering, business artifacts and automation, and infrastructure/reusable platform work. Across them, he used AI as an execution and verification layer: inspecting real systems, scoping changes, building code and artifacts, exercising browser/API/provider paths, verifying results, documenting evidence, and preparing work for handoff.

The strongest public story is that Akash built applied-AI systems at the intersection of customer-service workflows, governed enterprise knowledge, and legacy modernization.

## Observed operating model

The retrospective presents a repeatable eight-stage engineering loop:

1. **Ground** — inspect repositories, tickets, source systems, logs, browser state, and cloud configuration.
2. **Bound** — protect dirty worktrees, permissions, privacy, freshness, and proof boundaries.
3. **Plan** — turn ambiguity into a bounded sequence with checkpoints and ownership.
4. **Build** — create code, tests, infrastructure, reusable skills, connectors, documents, and business artifacts.
5. **Run** — start services and exercise browsers, provider APIs, and enterprise systems.
6. **Verify** — use syntax checks, tests, builds, DOM inspection, screenshots, consoles, authentication, and live smoke paths.
7. **Deliver** — prepare scoped commits, branches, pushes, publish actions, and owner-ready gaps.
8. **Capture** — leave durable skills, runbooks, evidence, readiness gates, and handoff artifacts.

This evidence-first approach is a valuable part of the website narrative because it distinguishes production-minded engineering from demo-only AI work.

## Workstream findings

### 1. Claims AI

The claims work was a customer and customer-service-representative experience spanning implementation, runtime operation, browser testing, cloud diagnosis, release readiness, and documentation.

Observed activities include:

- Mapping frontend routes, authentication storage, document preview, claims rendering, and production risks.
- Starting local services and inspecting application source, cloud state, logs, databases, and API routes.
- Implementing privacy-conscious observability and isolated data stores.
- Adding approval and chat-tool gating, Markdown rendering, voice authentication, and direct voice tools.
- Diagnosing CloudFront/CORS, streaming, provider, authentication, and permission boundaries.
- Building readiness checks, route-parity checks, UAT coverage, and browser end-to-end verification.
- Producing startup, deployment, route/CORS, readiness, voice/provider, and remaining-gap handoff documentation.

Corroborating portfolio material describes this as an AWS-based text and voice claims assistant designed for customers and 12,000 customer service representatives, with access to New York Life services, knowledge, and forms.

Public wording should say **built** or **developed**, and can say **designed for customers and 12,000 service representatives**. Avoid saying it produced a measured business outcome unless separate production evidence exists.

### 2. Pega engineering

The Pega work converted opaque application artifacts into source-linked evidence and business-readable logic while maintaining a guarded, read-only integration model.

Observed activities include:

- Inventorying exports, JARs, manifests, rule classes, dependencies, and business-rule candidates.
- Building resumable XML and Java harvesters with authentication recovery, progress state, rendered rule text, and retry manifests.
- Creating read-first/read-only Pega tooling and connector surfaces.
- Adding rule extraction, translation, impact analysis, drift analysis, generated tests, approval states, audit trails, and source traceability.
- Translating technical Pega rules into numbered business logic that non-Pega reviewers could evaluate.
- Creating reusable Pega workflows and documentation.

The strongest public framing is **legacy and low-code modernization through business-rule extraction, translation, and review tooling**.

### 3. Company Brain / NYL Knowledge

The knowledge work built governance and publishing around internal knowledge instead of treating retrieval output as automatically authoritative.

Observed activities include:

- Expanding the knowledge system beyond claims into project lanes and enterprise routing.
- Building queue-based ingestion and source-to-topic synthesis with provenance and usefulness gates.
- Separating raw sources, partial evidence, durable topics, customer-safe guidance, and CSR-only material.
- Adding provenance, freshness, review state, primary-source citations, and human/agent user experiences.
- Creating a connector guide covering 17 workflows, read-only Jira dashboards, architecture research, and read-only intranet retrieval tooling.
- Producing executive research and knowledge artifacts with explicit source and evidence boundaries.
- Using the corpus for backlog work, executive synthesis, capability reviews, and AI-usage analysis.

The video shows one validated snapshot containing 397 sources across 155 documents. Separate portfolio materials describe a broader 13,000-document knowledge base assembled from SharePoint, New York Life's public site, Confluence, Jira, and the intranet. Treat these as different scopes unless a source confirms otherwise; do not collapse them into one metric.

The strongest public framing is **a governed enterprise knowledge layer for both people and AI, with provenance, freshness, citations, review controls, and audience boundaries**.

### 4. AEM engineering

The AEM work connected component delivery, local preview, feature tracking, Jira/Figma context, repository setup, and browser verification into a reusable delivery process.

Observed activities include:

- Reviewing how design, Jira, coding, verification, and local AEM workflows should interoperate.
- Improving reusable skill metadata, naming, setup guidance, cross-machine installation, and documentation.
- Working through corporate dependency, TLS, and certificate constraints.
- Creating canonical feature tracking and running test/fix/retest loops.
- Fixing hidden runtime or UI-control issues and connecting real workspace and preview surfaces.
- Building local New York Life clone pages and reusable author/demo paths.
- Using repository comparison, clean worktrees, Jira/Figma context, and browser verification to protect delivery quality.

The strongest public framing is **accelerating AEM website delivery through reusable workflows that connect design and requirements to implementation and browser-tested components**.

### 5. Business artifacts and automation

This work translated technical and business source material into editable, manager-ready artifacts instead of stopping at prose recommendations.

Observed outputs include:

- A 55-slide research pack and editable prototypes with evidence-class labeling.
- Executive ROI framing that distinguished target value from realized results.
- A weekly-report drafting agent and draft presentation.
- A business-requirements-to-Jira review harness.
- An executive Jira dashboard.
- A Codex teaching site.
- Editable source files, browser-verified sites, agent configurations, and scoped repository updates.

The strongest public framing is **building decision-support and workflow automation that converted research and requirements into editable reports, dashboards, review tools, and agent-assisted operating artifacts**.

### 6. Infrastructure and reusable platform work

The platform work supported scoped cloud changes, reusable tools, and escalation-ready diagnosis under enterprise policy constraints.

Observed activities include:

- Migrating an email integration away from a deprecated endpoint.
- Generating in-memory XLSX attachments and adding configuration inputs.
- Preparing Terraform/email-service and streaming-permission branches.
- Creating reusable skills, connector servers, repository scaffolds, setup notes, and owner-ready escalation language.
- Diagnosing centralized IAM and organization-policy blockers without presenting local code readiness as production approval.
- Keeping missing non-production smoke tests and provider-access gaps explicit.

The strongest public framing is **supporting enterprise AI delivery with AWS infrastructure, reusable integration tooling, and careful diagnosis of identity, policy, streaming, and deployment boundaries**.

## Public-safe summary

> At New York Life, I built applied-AI systems across insurance claims, enterprise knowledge, and legacy modernization. My primary project was a secure, AWS-based text and voice claims assistant designed for customers and 12,000 service representatives, integrating existing services, forms, and business rules. I also consolidated 13,000 documents from SharePoint, Confluence, Jira, the intranet, and public sources into a governed knowledge layer with citations, provenance, freshness checks, and audience controls. Beyond claims, I developed multi-agent tools for translating Pega and legacy-system logic into reviewable business rules, accelerating AEM development, improving document-processing workflows, and supporting cloud infrastructure and business automation. Across each project, I treated AI as an execution and verification layer—grounding work in real systems, protecting data and permissions, testing changes, and leaving behind reusable tools and clear handoff documentation.

### Short homepage version

> Built enterprise AI systems at New York Life, including an AWS-based voice and text claims assistant designed for customers and 12,000 service representatives, a governed knowledge layer spanning 13,000 documents, and multi-agent tools supporting Pega, AEM, document processing, cloud infrastructure, and legacy modernization.

## Publication guardrails

Before using this material publicly:

- Remove internal repository names, branch names, session identifiers, internal hostnames, and access details.
- Do not publish AI request, call, trace, or token counts as measures of productivity or impact.
- Do not imply team-wide or company-wide adoption from this individual activity record.
- Distinguish **configured**, **built**, **validated**, **observed live**, **deployed**, and **measured business outcome**.
- Do not claim production usage, cost savings, realized ROI, or customer outcomes without separate evidence.
- Describe permission, IAM, provider, authentication, certificate, and deployment gaps only at a high level.
- Confirm that the 13,000-document figure is approved for public use before featuring it prominently.

## Audio transcript

The video's audio does not add technical details. Approximate transcript:

> "Yeah, but then I feel like there's some miscellaneous stuff in there too. Yeah, wait, honestly, it's good to remember the miscellaneous stuff too, because who knows when you might want to talk about it. Knowledge transfer. Yeah, knowledge transfer, knowledge transfer."

The audio reinforces that the retrospective was intended as a broad knowledge-transfer and handoff artifact, including smaller work that might be useful later.

## Confidence notes

- **High confidence:** The six workstreams, evidence-first operating model, and most activity descriptions are directly visible in the video.
- **High confidence:** The report warns against interpreting retained activity as production impact, adoption, ROI, or productivity.
- **Medium-to-high confidence:** The 12,000-representative, AWS, and 13,000-document claims are repeated in multiple local portfolio sources, but are not fully legible as consolidated claims in the short video itself.
- **Unverified:** Production adoption, realized business outcomes, savings, or ROI.
