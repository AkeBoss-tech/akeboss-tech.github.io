---
title: "Scarlet Sync"
excerpt: "A complete scheduling and degree planning solution for Rutgers"
image: "/images/portfolio/scarlet-sync/home.png"
collection: portfolio
rank: 1
---

<img src='/images/portfolio/scarlet-sync/home.png' width='100%' align='center'>


Navigating the complexities of university course registration can be a frustrating and time-consuming ordeal. Juggling degree requirements, professor preferences, campus locations, and personal availability often feels like a high-stakes puzzle with too many pieces. **Scarlet Sync** was born from this exact challenge, transforming the tedious process of scheduling into a seamless, intelligent, and user-friendly experience for Rutgers University students. It's more than just a CS project; it's a practical solution to a common problem.

---

## Why hasn't this been done before?

Accessing the data for degrees at Rutgers is an immense challenge. It is hard for people to get access to the data that they need, often its hidden across multiple different sites. My first step towards solving this problem was using a variety of ethical scraping techniques (as well as LLM based structured output extraction) to get all the classes, sections, and degree plans at Rutgers. This was a difficult process and would be hard for someone with limited scraping expertise. Thanfully, I have a lot of experience trying to hack around with websites and extracting info from pages.

---

## A User-First Approach to a University-Wide Problem

The core philosophy behind Scarlet Sync is simple: **put the student's experience first**. Instead of forcing users to manually sift through thousands of course sections, Scarlet Sync empowers them with smart, intuitive tools.

The centerpiece is the **AI-powered schedule generator**. Students can simply input their desired courses, block off times they're unavailable (like for work or sports), and specify their preferred campus locations. The algorithm then gets to work, generating multiple optimized, conflict-free schedules in seconds. This allows students to visualize their semester and make informed decisions based not just on course availability, but on what works best for *their* life.

Key features designed around the user include:

* **Integrated Professor Ratings**: No more cross-referencing with other sites. Make confident decisions with RateMyProfessor data built directly into the course search.
* **Advanced Filtering**: Quickly narrow down options by department, instructor, course credits, or keywords to find exactly what you need.
* **Degree Planning**: Look beyond a single semester. With our degree planning tools, you can map out your entire academic career, track your progress, and ensure you're on the path to graduation.
* **Social & Collaborative**: Share potential schedules with friends to coordinate classes and study groups, making registration a collaborative effort.

---

## The Technology Powering the Solution 

To deliver a fast, reliable, and modern user experience, Scarlet Sync is built on a carefully selected, cutting-edge tech stack. Each technology was chosen for its specific strengths in creating a scalable and efficient web application.

* **Frontend (The User Experience)**
    * **Next.js 15 & React 19**
    * **TypeScript**
    * **Tailwind CSS**

* **Backend**
    * **Supabase**
        * Edge Functions
        * Authentication
        * Postgres

* **Deployment & Infrastructure**
    * Hosted on **Vercel**
    * **Porkbun**

[Check it out!](https://scarletsync.app/)
