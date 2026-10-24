---
title: "Healthcare Simulation at Rutgers Health Hack"
excerpt: "Synthetic patient encounters, faculty authoring, evidence-linked feedback, and a playable hospital world—and what building them taught us about deploying AI in healthcare."
image: "/images/portfolio/healthcare-simulation/patient-encounter.jpg"
collection: portfolio
date: "2026-10-11"
tags: [AI, Healthcare, Simulation, Web]
featured: false
rank: 3
---

At Rutgers Health Hack 2026, our team explored a broad question: **how could AI help people practice the conversations, reasoning, and coordination that healthcare requires?** The work grew across patient encounters, faculty tools, streaming voice, care-team handoffs, and a playable hospital environment. This case study brings those related explorations together while keeping their implementations distinct.

My work across the project included researching requirements and datasets, developing the domain and evidence model, integrating and checking patient workflows, and exploring voice and avatar tradeoffs. The prototypes were a team effort; the repositories below preserve the implementation history.

[HealthHacks research and hospital prototype](https://github.com/CANTSOAR/healthhacks26) · [Poscere source](https://github.com/CANTSOAR/lowhangingfruit26) · [CaseClimb source](https://github.com/anvi-k/CaseClimb)

**Context:** Rutgers Health Hack, October 9–11, 2026. **Stage:** hackathon prototypes and research explorations. Patient cases and portraits shown here are synthetic; screenshots illustrate product behavior, not clinical validation or learner outcomes.

## From a hospital world to a patient encounter

The original idea was an interactive hospital: patients, staff, rooms, equipment, charts, and eventually staffing and flow experiments. The Virtual Patient Encounter challenge gave us a concrete first workflow: a faculty member creates a patient case, a learner interviews that patient, information becomes available through the encounter, and feedback explains what the learner elicited or missed.

That focus made the broader idea easier to reason about. We could first explore how a conversation and chart stay consistent, then extend the same questions to handoffs and shared state across roles.

| Exploration | What it focused on |
| --- | --- |
| **Poscere / lowhangingfruit26** | Faculty case authoring, patient encounters, charts, formative feedback, courses, and care journeys. |
| **CaseClimb / lowhangingfruit** | A focused patient-case workflow, editable communication templates, progressive disclosure, and streaming voice. |
| **Hospital world** | Spatial exploration, playable roles, equipment interactions, navigation, and bounded AI conversations. |

These are related prototypes with separate architectures and delivery states. The hospital world is an illustrative local simulation, and the patient platforms use simulated clinical records.

## Faculty controls the case

<img src="/images/portfolio/healthcare-simulation/faculty-disclosure.jpg" alt="Poscere Patient Studio showing authored facts grouped by disclosure conditions, including volunteered information and information revealed when asked">

*The disclosure editor makes case facts and reveal conditions inspectable. This demonstration case is marked AI-drafted and not faculty-reviewed; its published UI state does not establish clinical approval.*

The case needs more than a personality prompt. It needs patient facts, an initial chart, attached artifacts, disclosure conditions, learning objectives, and a rubric. Keeping those pieces outside the generated conversation gives the application a stable record to work from.

We learned to distinguish **what is true in the case**, **what the patient can disclose**, and **what the learner has actually learned**. A friendly or guarded delivery should not silently change the patient's clinical history. Generated case content remains a draft until appropriately reviewed.

<img src="/images/portfolio/healthcare-simulation/case-workflow.svg" alt="Case workflow: author facts, artifacts and objectives; review and publish; then interview and progressively reveal chart information; log the encounter and produce formative feedback for faculty review">

*A conceptual workflow across the patient prototypes. Review and publication controls differ by implementation; dialogue checks do not guarantee that every generated sentence stays within the case.*

## Conversation and chart together

<img src="/images/portfolio/healthcare-simulation/patient-encounter.jpg" alt="Poscere synthetic patient Walter Henshaw beside a simulated chart with medications, vitals and tabs for notes, results and documents">

*A patient encounter with an animated portrait, conversation area, and simulated chart. The portrait is not a live patient video, and the chart has no connection to an EHR.*

Learners can ask questions, inspect available information, request authored results, and summarize what they found. Progressive disclosure makes information gathering part of the experience instead of presenting a complete answer at the start.

The engineering challenge was keeping the visible chart, disclosure state, and generated reply aligned. Poscere uses a reply audit, but that check runs after the reply is displayed and can miss errors. This taught us to describe grounding as a set of controls with observable limitations.

## Feedback that can be inspected

<img src="/images/portfolio/healthcare-simulation/feedback.jpg" alt="Poscere demo encounter feedback showing a rubric summary, missed findings, instructor review flag and suggestions for the next attempt">

*A demo encounter's formative feedback, including omissions and a review flag. Demo identities and scores are illustrative, not results from a learner study.*

Feedback should connect an observation to an objective and the actual encounter. What did the learner ask? Which facts were elicited? Which important topics remained unexplored? What would make the next attempt better?

Evidence makes those judgments easier to inspect, but a quote does not establish that a clinical interpretation is correct. Faculty correction and agreement with independent human raters remain necessary steps before treating automated scores as validated assessment.

## Care happens across roles

<img src="/images/portfolio/healthcare-simulation/care-journeys.jpg" alt="Poscere Care Journeys showing emergency medicine, cardiology, pharmacy and dietitian roles across encounters for one synthetic patient">

*A shared patient journey across professional roles. The learner takes one role while AI counterparts fill the others.*

Care journeys extend the encounter into shared information, uncertainty, disagreements, and SBAR handoffs. The interesting question becomes: **what did an earlier encounter establish, and how should that influence the next person?** Recording the source, role, timing, and status of information helps make that progression inspectable.

## CaseClimb and streaming voice

<img src="/images/portfolio/healthcare-simulation/caseclimb-templates.jpg" alt="CaseClimb new-case chooser offering a clinical history template and editable communication templates for Alex, Maya, Jordan and Evelyn">

*CaseClimb's locally verified template chooser. Each starter becomes an editable patient draft in the same authoring workflow.*

CaseClimb explored a narrower path through faculty authoring, ten-minute conversations, progressively disclosed charts, and evidence-linked feedback. Communication practice became patient-case templates rather than a separate chat mode.

Its AWS streaming work also exposed practical details: live transcription, streamed reply audio, captions, access controls, session budgets, and recovery. A provider's “audio complete” event does not necessarily mean the browser has finished playing the sound. The interface needs to follow the actual playback lifecycle.

The template consolidation was verified locally; it should not be read as proof that every later change reached the temporary workshop deployment.

## Exploring the hospital as a system

<img src="/images/portfolio/healthcare-simulation/hospital-world.jpg" alt="Working hospital-world prototype with a first-person technician role, navigation map and guided training objectives in an authored research department">

*The running local prototype: a playable role, spatial navigation, and training objectives. Interiors, tasks, equipment quantities, and timings are authored simulation content.*

The hospital prototype explored movement, role switching, equipment readiness, inventory, and guided tasks. A deterministic engine owns movement and equipment effects; bounded AI dialogue supplies conversations. Generated text does not operate equipment or execute medical orders.

<img src="/images/portfolio/healthcare-simulation/hospital-atlas.jpg" alt="Hospital-world atlas showing an illustrative clinical research floor with selectable rooms and a department directory">

*The atlas and navigation share the simulation's room model. Public service references informed program categories; the floor plan is original design.*

Public maps, footprints, and service directories were useful references, but they did not give us measured interiors, real staffing, live inventory, or operational calibration. That boundary shaped the data model: a source-supported fact and an authored simulation assumption need different labels.

## Visual realism and its tradeoffs

<img src="/images/portfolio/healthcare-simulation/early-hospital-concept.jpg" alt="Early AI-generated MediTwin design concept showing an isometric emergency department with a patient sidebar and simulated workflow markers">

*An early AI-generated design concept, not a screenshot of the running application. Comparing it with the prototype helped us separate visual ambition from implemented behavior.*

We explored animated portraits, timestamped speech, live avatars, and generated-video experiments. Timing, believable emotion, provider limits, latency, and cost all affected what was practical. Poscere's portrait animation moves the jaw with speech; it does not produce phoneme-specific mouth shapes.

The next useful experiment is a controlled comparison: hold the case and feedback constant, then compare voice and portrait with a live avatar. Measure performance on another case, distraction, latency, and cost—not only whether the avatar looks impressive.

## Conversations about the future of hospital AI

During the event, I spoke with Dr. Joshua J. Raymond and Jared about technology in hospitals, deploying AI, Palantir-like ideas, and the future. I also spoke with Jay Naik and Dr. Naveena Yanamala, who invited us to reconnect later. These were general conversations that broadened how I thought about the project, rather than formal reviews of its clinical content.

They left me with a larger question: **what would it take to connect an AI prototype to the way a hospital actually works?** A shared model could relate patients, staff, rooms, equipment, events, and permissions. Useful deployment would also need accountable workflow owners, integration with existing systems, inspectable decisions, and evaluation in the intended setting.

The Palantir comparison is a direction for thinking about connected operational software. Our ontology and provenance work explored parts of that idea; a hospital-wide operating platform remains future work.

## What I would carry forward

- **Start with a stable case model.** Conversation, charts, artifacts, and objectives need to agree.
- **Design review into authoring and feedback.** Consistency checks and citations help inspection; clinical correctness requires qualified judgment.
- **Keep simulation responsibilities explicit.** Rules control the modeled world; language models provide bounded dialogue.
- **Evaluate realism separately.** Better animation and better learning are different questions.
- **Treat deployment as part of the product.** Streaming, failures, permissions, cost, and hosting lifetime affect the experience.
- **Preserve source and assumption boundaries.** Public hospital data cannot silently become real-time operational truth.

The next step would be one faculty-reviewed module, expert review of feedback, and a small supervised evaluation on unseen cases. The prototypes demonstrate workflows and engineering possibilities; they have not established clinical correctness, educational effectiveness, or production readiness. Their temporary workshop hosting also makes the source repositories and dated screenshots the more durable record.

## Sources and further reading

- [Project research and requirements](https://github.com/CANTSOAR/healthhacks26/tree/main/research)
- [Poscere implementation and limitations](https://github.com/CANTSOAR/lowhangingfruit26)
- [CaseClimb implementation and streaming research](https://github.com/anvi-k/CaseClimb)
- [Rutgers Health Hack leadership](https://www.ruhealthhack.com/leadership)
- [Joshua Raymond's Rutgers profile](https://rwjms.rutgers.edu/people/joshua-raymond)

*Images document successive prototype states from October 2026. They are not one continuous session or evidence of hospital participation or endorsement.*
