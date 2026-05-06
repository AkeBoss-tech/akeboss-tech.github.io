---
title: "Lykke — AI Education Platform"
excerpt: "An AI-first education platform that ingests Canvas course content and transforms it into AI-generated wikis, an adaptive video tutor, interview prep coaching, and a persistent personal knowledge library"
image: "/images/portfolio/lykke/hero.png"
collection: portfolio
tags: [AI, Web]
featured: true
rank: 2
---

<img src='/images/portfolio/lykke/hero.png' width='100%' align='center'>

Students spend more time hunting for materials than actually studying. Notes scattered across Google Drive, assignments buried in Canvas, lecture slides downloaded and forgotten—by the time exams hit, half the battle is just finding everything. **Lykke** reimagines this entirely. It's an AI-first education platform built around a single idea: your courses should become a living, queryable knowledge base. Connect your Canvas account, and Lykke ingests your entire semester—assignments, files, grades, syllabi—then surfaces that knowledge through four distinct AI experiences: **AI-generated wikis** that explain every concept from your actual course materials, an **AI video tutor** that teaches interactively, **AI interview prep** that coaches you using real questions from your field, and a **persistent study workspace** that generates flashcards, quizzes, and infographics on demand. Currently used by **285+ students** across UC San Diego, Michigan, and UT Austin.

---

## AI-Generated Wikis

When you ask "what is a Fourier transform?" on a generic AI, you get a generic answer. In Lykke, you get an answer grounded in your professor's lecture slides, your textbook's notation, and the specific examples from your class. The Wiki system transforms course materials into a structured, auto-generated knowledge base—one article per concept, built from your actual course content. Each wiki entry is linked to its source documents, versioned as you add more materials, and browsable by topic. It's the course wiki your professor never had time to write.

---

## AI Video Tutor

The video tutor is Lykke's interactive teaching layer. Rather than static Q&A, it delivers concept explanations as short, AI-generated video lessons—synthesized from your course materials, voiced, and structured like a real lecture segment. Students who learn better through audio-visual instruction get a tutor that adapts to their pace and their class, not a generic YouTube tutorial.

---

## AI Interview Prep

Built for students entering technical fields, the interview prep module pulls from your courses, projects, and resume to generate realistic practice questions—behavioral, technical, and domain-specific. It runs mock interviews, scores responses, and flags weak points. Unlike generic prep platforms, it knows you studied machine learning under a specific curriculum and can tailor questions accordingly.

---

## The Study Workspace

<img src='/images/portfolio/lykke/study.png' width='100%' align='center'>

The core of Lykke is a RAG-powered chat interface that knows your course materials. Upload your textbooks, notes, and PDFs, and the AI answers questions with citations pulled directly from your documents—not the internet. The right panel tracks everything generated: flashcards, quizzes, study guides, and infographics, all organized by class.

The system uses a **LangGraph multi-agent backend** with specialized agents for each task:

* **Chat Agent** — conversational Q&A with document context, web search fallback, and streaming responses
* **Study Agent** — generates flashcards and quizzes adapted to your difficulty preferences
* **Weekly Plan Agent** — reads your Canvas calendar and builds a personalized study schedule around upcoming exams
* **Orchestrator Agent** — routes complex queries across research, calculator, LMS data, and stress heatmap agents

---

## AI-Generated Infographics

<img src='/images/portfolio/lykke/infographic.png' width='100%' align='center'>

One of Lykke's most distinctive features: paste in a textbook chapter or lecture notes and get a publication-quality infographic in seconds. The AI reads the content, identifies key concepts and relationships, and produces a structured visual explanation with diagrams, formulas, and definitions. The example above was generated from a Graph Theory textbook—the kind of visual that would normally take an hour to make by hand.

---

## Community & Discovery

<img src='/images/portfolio/lykke/discover.png' width='100%' align='center'>

Study materials don't have to be private. The Discover feed lets students browse summaries, infographics, and flashcard sets shared by classmates in the same courses. If someone already made great flashcards for Math 478, you don't have to regenerate them. The community layer turns Lykke into a collaborative knowledge base that improves as more students use it.

---

## Why It's Hard to Build

Connecting an LLM to a student's actual course materials—not generic internet content—requires getting several hard things right simultaneously:

**Semantic retrieval at scale.** Every uploaded document is chunked, embedded with `text-embedding-3-large`, and stored in **Zilliz** (cloud Milvus). When a student asks a question, the system retrieves the most relevant passages via vector similarity + keyword hybrid search, re-ranks them, and injects them as context. This means answers are grounded in the student's actual materials, not hallucinated.

**Canvas integration.** Rather than asking students to manually re-upload everything, Lykke connects directly to Canvas via OAuth. A Chrome extension extracts course data and files from the LMS, posts them to the backend, and they're automatically embedded and indexed. Assignments, due dates, and grades flow in automatically—the weekly plan agent reads the Canvas calendar to build study schedules around real exam dates.

**Dual-backend architecture.** The platform runs a production Java Spring Boot backend for auth and legacy notes alongside a Python FastAPI backend for all AI operations (agents, RAG, vector search, document processing). The frontend intelligently routes requests between both, giving users a seamless experience while the AI infrastructure scales independently.

