---
title: "RAIL - Rutgers Agentic Intelligence Labs"
excerpt: "An open-source, repo-native platform for agent-assisted economic and policy research, with ontology-backed analysis, data hydration, MCP tools, and an operator command center."
image: "/images/portfolio/rail/hero.svg"
collection: portfolio
tags: [AI, Infrastructure, Research, Data]
rank: 5
date: 2026-06-08
---

<img src='/images/portfolio/rail/hero.svg' width='100%' align='center'>

**RAIL** is an open-source platform for repo-native, agent-assisted research. It turns a Git repository into the system of record for research plans, source definitions, ontology schemas, hydration pipelines, analysis artifacts, verification records, and agent handoffs. The project started at **Rutgers Economics Labs** with an initial focus on economic and policy research, but the architecture is broader: research should be inspectable, repeatable, and safe for agents to continue.

<p align="center">
  <strong><a href="https://github.com/Rutgers-Economics-Labs/RutgersAgenticIntelligenceLabs/" target="_blank" rel="noopener noreferrer">View on GitHub</a></strong>
</p>

---

## Why It Exists

Data research usually fragments across notebooks, dashboards, chat logs, local files, and undocumented API calls. That makes it hard to answer basic questions later: which source produced a number, which assumptions were active, what changed between runs, and whether an agent can safely resume the work without inventing context.

RAIL makes the repository the contract. Plans, tasks, source notes, artifacts, ontology state, and integrity records live together, so research work can be reviewed as a versioned system rather than a pile of disconnected outputs.

---

## Platform Surfaces

The monorepo includes several coordinated pieces:

* **Next.js command center** for projects, planner state, runs, ontology exploration, artifacts, sources, and review
* **FastAPI control plane** for project services, runners, connectors, SQL, quality, and storage
* **Python engine** for hydration, ontology work, transforms, and analysis
* **Python SDK and `rail` CLI** for local and cloud workflows
* **MCP server** so agents can inspect ontology, hydrate data, run queries, update projects, and verify outputs
* **Integrity layer** for assumptions, sources, empirical claims, rerun plans, and verification records

---

## Technical Stack

* Python 3.11+
* FastAPI
* Next.js and TypeScript
* MCP server tooling
* Ontology-backed project models
* YAML project configuration
* Local and cloud execution modes
* Public examples plus generated research workspaces

RAIL and KRAIL are related but serve different portfolio stories: RAIL is the broader Rutgers Economics Labs platform with a command center and research-control-plane architecture; KRAIL is the leaner local-first/headless knowledge runtime extracted for project memory and auditable agent work.

