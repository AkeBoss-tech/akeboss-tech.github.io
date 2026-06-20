---
title: "KRAIL - Local-First Knowledge Runtime"
excerpt: "A repo-backed knowledge runtime for auditable agent work, with capture, search, think envelopes, markdown graphs, workflows, integrity records, and MCP tools."
image: "/images/portfolio/knowledge/hero.svg"
collection: portfolio
tags: [AI, Infrastructure, Research]
rank: 5
date: 2026-06-18
---

<img src='/images/portfolio/knowledge/hero.svg' width='100%' align='center'>

KRAIL is a local-first knowledge runtime for projects where agents need more than chat memory. It gives a repository durable context: captured notes, source pointers, knowledge packs, task records, workflow outputs, markdown graphs, vector search, and evidence-backed `think` envelopes. The core idea is simple: if an agent uses knowledge to make a decision, the source trail should stay inspectable.

<p align="center">
  <strong><a href="https://github.com/AkeBoss-tech/knowledge" target="_blank" rel="noopener noreferrer">View on GitHub</a></strong>
</p>

---

## What It Provides

KRAIL treats a project folder as a living knowledge workspace. You can capture notes or files, search raw evidence, build markdown-frontmatter graphs, ask deterministic `think` queries, dispatch local CLI agents as auditable workers, and expose the same functions through MCP tools for Codex, Claude Code, Cursor, Gemini, or other agent surfaces.

The project is intentionally headless. There is no required hosted database or bundled frontend. The runtime starts local, with optional API adapters and MCP tools when a project needs to connect to custom interfaces.

---

## Core Capabilities

* **Capture** notes, URLs, files, and stdin into a predictable inbox
* **Search** local evidence with deterministic file search and SQLite vector retrieval
* **Think** through an answer envelope with citations, gaps, conflicts, and next actions
* **Graph** markdown-frontmatter entities, edges, and topic documents
* **Task and workflow records** for repo-backed work orders and agent sessions
* **Integrity artifacts** for promoted outputs and verification runs
* **MCP tools** for search, think, capture, tasks, workflows, and integrity

---

## Technical Stack

* Python 3.11+
* SQLite vector storage
* Markdown and YAML project records
* CLI and SDK interfaces
* FastAPI adapter
* MCP server
* Optional DuckDB, ontology, and embedding extras

KRAIL is pilot-ready rather than polished production software. That is also what makes it interesting: it is infrastructure for making long-running AI-assisted research more durable, sourced, and reviewable.

