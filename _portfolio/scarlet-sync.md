---
title: "Scarlet Sync"
excerpt: "A Rutgers planning app that helps students find courses, compare schedules, and organize degree requirements."
image: "/images/portfolio/scarlet-sync/product-overview.png"
collection: portfolio
date: 2026-04-05
tags: [Web, AI]
featured: true
rank: 1
---

Choosing classes should not mean keeping five university websites open and hoping everything fits. **Scarlet Sync** brings Rutgers course search, schedule building, and degree planning into one place. I started it to make a problem I knew as a student easier to work through.

For example, a student can choose courses, block off work hours, and compare schedules that fit those constraints. The goal is to make the choices understandable before registration day.

[Open Scarlet Sync](https://scarletsync.app/)

## My contribution

I founded Scarlet Sync and built across the product: collecting and organizing university data, developing the planning interface, and connecting schedules and degree information to an AI assistant. My Python and language-model-assisted data pipeline turns information from legacy university services into records the app can search and use.

The hardest part was getting useful information into one place. Courses, sections, and degree requirements are spread across university sites and arrive in different formats. A clear interface depends on doing that less visible work well.

## A decision that shaped the schedule builder

A schedule can fit on a calendar and still be a poor fit for someone's life. I built the schedule workflow around explicit choices: required courses, allowed sections, unavailable times, and campus preferences. Students can compare alternatives rather than accept a single unexplained recommendation.

That also makes a failed search easier to investigate. If no schedule fits, a student can relax one constraint at a time to find the conflict. Collecting preferences is only useful if people can understand their effect.

## Built through conversations with students

Scarlet Sync grew through conversations with many Rutgers students during development. Hearing how other students approached registration helped shape the product beyond my own experience of choosing classes. That feedback is part of the story behind the features: bringing scattered information together and making it easier to compare choices.

## From course choices to a weekly plan

The app connects several parts of planning a semester:

- **Course explorer:** find courses and inspect section information before choosing what to take.
- **Schedule builder:** compare weekly schedules around course choices, unavailable times, and preferences.
- **Degree planner:** organize courses alongside degree requirements and a longer-term academic plan.
- **Course Sniper:** watch for section openings and receive alerts. Registration still happens in Rutgers WebReg.
- **Professor information:** explore teaching information while comparing courses.
- **Campus tools:** find bus information, dining menus, and available study rooms alongside academic planning.
- **AI assistance:** ask questions about planning and campus information through the app and its ChatGPT and Claude connections.

The walkthrough and rotating gallery below show how these pieces relate. The screenshots are examples of the interface at the time they were captured; course availability and product details can change.

## Limits and what I learned

A saved schedule is a plan, and students still complete registration in Rutgers WebReg. Course availability can change, and degree information needs to be checked against official university requirements. Bringing the information together does not remove the need to keep it current.

The lesson I take from this work is that the interface and the data pipeline are part of the same problem. Helping someone choose a schedule requires understandable choices, dependable data, and a clear explanation when something cannot be generated. Broader coverage and improvements remain ongoing work.

## Under the hood

The web app uses **Next.js, React, TypeScript, and Tailwind CSS**. **Supabase** provides database, authentication, and backend services, while Python supports data collection and processing. The app is hosted on **Vercel**.

[Explore more projects](/projects) · [Get in touch](/contact)
