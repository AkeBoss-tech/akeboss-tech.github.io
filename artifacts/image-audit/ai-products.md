# AI / Product Portfolio Visual Asset Audit

Read-only asset audit performed 2026-08-06. No portfolio code or media was changed or copied. Paths below are canonical absolute paths on this device; the website's `public/images` directory is a symlink to `../images`.

## Executive recommendation

| Project | Hero | Card | Gallery / demo | Readiness |
| --- | --- | --- | --- | --- |
| Lykke | `wiki-quality-v2-reading-surface.png` | `visual-lab-three-surface.png` | multi-source builder, video studio, realtime tutor, artifact library | Ready from fixture/test artifacts; retire the current course-data screenshots. |
| Clean Your Data | `graph.png` | `graph.png` | `cleaning.png`, `analysis.png` | Ready; all three source screenshots are already used by the site. |
| Personal Assistant | New sanitized welcome-state capture | Same sanitized capture | Agents, memory, and tool-run states using a demo identity | Not ready; both existing screenshots contain a personal email and must be excluded. Source app is not present in the supplied `agentic-assistant` directory. |
| Grokipedia API | Current Grokipedia search surface until a stronger capture exists | Current search surface | Search suggestions, article result, CLI output | One safe existing image; recapture the local client app to demonstrate the package rather than only its brand. |
| KRAIL / Knowledge | Current architecture SVG | Current architecture SVG | Terminal GIF and preview | Ready. Prefer diagram for small surfaces and animated terminal demo on the detail page. |
| RAIL | `krail-command-center-desktop.png` | A 16:9 crop of that command center | Ontology explorer and mobile command center | Ready from public fixture data; a fresh healthy/populated state would improve the story. |

## How the current site uses project media

- Each project's frontmatter `image` is reused in the projects feed/card, the project detail hero, metadata/structured data, and the generated OpenGraph image input.
- Markdown `<img>` tags become inline detail-page gallery content. For the featured Lykke entry, parsed `mediaImages` also feed the featured-case-study cover and thumbnail strip.
- Lykke additionally appears on the home Yoshi scene (`hero`, `study`, `discover`) and CV (`hero`).
- The moodboard directly reuses Lykke `discover`, Clean Your Data `graph`, Personal Assistant `hero`, and Grokipedia API `hero`.
- Responsive derivatives in `lib/generated-responsive-images.json` are build outputs of these same sources, not independent candidates.

## 1. Lykke (`lykke`)

### Current inventory and usage

| Current asset | Dimensions | Current use | Audit note |
| --- | ---: | --- | --- |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/lykke/hero.png` | 3008×1714 | Frontmatter image; cards/feed; detail hero and first inline image; OG input; home scene; CV | Authentic class/calendar UI, but it contains course identifiers, assignment names/dates, class membership counts, and a real workspace. Exclude under the requested student/course privacy rule. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/lykke/study.png` | 3024×1724 | Inline detail image and featured/home media | Contains real course/source filenames, assignments, recent creations, an avatar, and private course state. Exclude. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/lykke/infographic.png` | 3022×1722 | Inline detail image and featured media | Strong feature evidence, but surrounding UI exposes course/source/assignment state and an avatar. Exclude unless a new fixture-based capture is made. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/lykke/discover.png` | 1944×1768 | Inline detail image, featured/home media, moodboard | Explicitly shows Akash Dubey and course names. Exclude from a privacy-safe portfolio set. |

### Ranked candidates

1. **Hero — public fixture wiki reading surface.** `/Users/akashdubey/Documents/CodingProjects/lykke/out/screenshots/wiki-quality-v2-reading-surface.png` — **1422×800**. Full Lykke chrome around a polished “Relations and Functions” wiki with navigation, key concepts, and Ask AI. It communicates the product's source-grounded learning experience in one frame without student identity or private coursework. Crop guidance: keep the full 16:9 frame for hero; for a card, crop roughly 6–8% from the left and 8–10% from the right while retaining the Lykke header and the two central definition cards.
2. **Card / visual hook — Visual Lab 3D surface.** `/Users/akashdubey/Documents/CodingProjects/lykke/out/screenshots/visual-lab-three-surface.png` — **1422×800**. High-contrast, immediately legible generated interactive learning artifact. Best card image because the subject remains readable at small sizes. Crop guidance: native 16:9; preserve the “A 3D wave surface” title and cyan surface, trimming only the outer black frame.
3. **Gallery — source review / course builder.** `/Users/akashdubey/Documents/CodingProjects/lykke/out/screenshots/2026-08-02-wiki-multi-source-discovery.png` — **1316×1214**. Shows a CRISPR course-builder workspace, selected public sources, approval-oriented AI copy, and suggested next actions. Strong evidence for multi-source grounding and human review. Crop guidance: for 16:9, crop vertically to the upper 740 px so the title, assistant prompt, and two selected source cards remain; do not crop the source panel entirely.
4. **Gallery — semantic video studio with AI assistant.** `/Users/akashdubey/Documents/CodingProjects/lykke/artifacts/video-studio-demo/final-03-studio-assistant.png` — **2370×1333**. Full video studio with eigenvector lesson, semantic timeline, transcript/current moment, and AI Assistant actions. It is the clearest single proof of the video tutor. Crop guidance: native 16:9; trim the bottom white margin and at most 3% from each side.
5. **Gallery / alternate dark hero — realtime video tutor.** `/Users/akashdubey/Documents/CodingProjects/lykke/out/screenshots/openai-realtime-video-tutor-relations-functions.png` — **1422×800**. Dark, cinematic tutor state comparing relations and functions with captions and playback controls. Use after the light wiki hero to show range. Crop guidance: native 16:9; retain title bar, both mapping panels, subtitle box, and playback controls.
6. **Portrait gallery detail — generated artifact library.** `/Users/akashdubey/Documents/CodingProjects/lykke/out/screenshots/2026-08-02-wiki-artifact-library.png` — **736×933**. Demonstrates reusable diagram, image, interactive, quiz, and study-guide outputs. Best as a portrait inset, not a hero. Crop guidance: remove the gray browser perimeter but retain the modal title, five artifact cards, and “Add your own artifact” controls.

Optional motion asset: `/Users/akashdubey/Documents/CodingProjects/lykke/new-web-app/public/videos/hero/page2-interactive-demo.mp4` — **1266×722, 8.0 s**. Use as a hover/demo clip only after reviewing its full playback for fixture-only content; its poster should be one of the safe stills above.

Privacy: the six ranked stills use public/demo subject matter and showed no API keys, credentials, personal messages, student names, or private course records on visual inspection. Avoid analytics plots in `/lykke/artifacts/analytics/` unless axes/labels are confirmed to be aggregated and non-identifying.

## 2. Clean Your Data (`clean-your-data`)

### Current inventory and usage

The three website images are byte-identical (`shasum`) to the source screenshots in `/Users/akashdubey/Documents/CodingProjects/clean-your-data/docs/screenshots/`. `cleaning.png` is renamed to `hero.png` on the site; `graph.png` and `analysis.png` retain their names. The hero is used on cards/feed/detail/OG, while graph and analysis are inline detail images; graph is also on the moodboard.

### Ranked candidates

1. **Hero and card — visualization result.** `/Users/akashdubey/Documents/CodingProjects/clean-your-data/docs/screenshots/graph.png` — **3024×1722**. The scatterplot, natural-language request, file overview, agent trace, and export control make the product understandable immediately. It is stronger than the current cleaning hero at card size. Crop guidance: use a 16:9 crop from approximately x=350–2930 to keep the file summary and full chart; for cards, center the chart and preserve the prompt bubble.
2. **Gallery — transparent cleaning execution.** `/Users/akashdubey/Documents/CodingProjects/clean-your-data/docs/screenshots/cleaning.png` — **3018×1718**. Shows the plain-English request, generated pandas code, execution result, input summary, and download action. This is the best “how it works” frame. Crop guidance: remove the large empty right-side conversation area; retain the left data panel, generated-code accordion, request, and bottom agent selector.
3. **Gallery — statistical analysis.** `/Users/akashdubey/Documents/CodingProjects/clean-your-data/docs/screenshots/analysis.png` — **3024×1720**. Shows a logistic-regression prompt, performance metrics, classification report, and the dataset overview. It proves the tool goes beyond cleaning. Crop guidance: use a 16:9 center-left crop; preserve the prompt and top of the analysis report, but the entire report need not fit.

Privacy: the frames appear to use a synthetic `HireTrain2025F.csv` dataset (aggregate rows/columns, institution-like labels, follower counts) and show no names, messages, credentials, or keys. Confirm the dataset is synthetic/licensed before publication; otherwise recapture with a purpose-built fixture. No stronger unused source image exists on device.

## 3. Personal Assistant (`personal-assistant`)

### Current inventory and privacy decision

| Current asset | Dimensions | Current use | Decision |
| --- | ---: | --- | --- |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/personal-assistant/hero.png` | 3024×1964 | Frontmatter/cards/feed/detail/OG and moodboard | **Exclude.** It exposes `akashdub06@gmail.com` in two locations and shows a live “Active Agents Detected” state. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/personal-assistant/finance.png` | 3024×1964 | Inline detail image | **Exclude.** It exposes the same personal email in two locations; the generated answer is also visually repetitive/unfinished. |

The supplied source path `/Users/akashdubey/Documents/CodingProjects/agentic-assistant` contains only `requirements.txt` and `scripts/compatible_requirements.txt` outside its virtual environment. No UI source, screenshots, diagrams, or demos are available there, so no privacy-safe existing candidate can be verified.

### Ranked recapture candidates (not yet present on disk)

1. **Hero/card — sanitized welcome state.** Restore/locate the Jarvis UI, use an account labeled `Demo User` with `demo@example.invalid`, open the main Chat surface with Bronny Orchestrator selected, and stop all running agents before capture. Show the 15 agents/tools summary and four capability cards; no sessions, email, avatar, or system notification should be visible. Target 1440×810.
2. **Gallery — Agents catalog.** Open the **Agents** nav item and capture a grid/list of named specialist agents with tool counts and descriptions. Use fixture agents only; collapse any log/output drawer. Target 1440×900.
3. **Gallery — persistent Memory.** Open **Memory**, populate 3–5 clearly fictional preference/memory records, and capture semantic search plus a selected record. Do not use real messages, contacts, calendar data, or documents. Target 1440×900.
4. **Gallery — clean tool run.** In Chat, ask a non-personal task such as “Compare two public benchmark datasets and summarize the tradeoffs,” then capture the orchestrator-to-specialist handoff and successful result. Use public fixture data and remove timestamps/user identity.
5. **Diagram fallback.** If the UI cannot be recovered, create a source-grounded architecture diagram from the documented stack only after the actual agent/tool topology is verified. The current portfolio prose alone is not sufficient evidence for a new diagram.

Do not attempt to make the two current screenshots safe with a loose crop: the personal email appears in both the header and lower-left session identity, making accidental exposure likely across responsive crops.

## 4. Grokipedia API (`grokipedia-api`)

### Current inventory and usage

`/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/grokipedia-api/hero.png` — **1794×1012**. Used as frontmatter/cards/feed/detail/OG and moodboard. It is a safe, polished Grokipedia search landing screen, but it primarily proves the consuming app/brand rather than the cross-language SDK, async client, CLI, or MCP integration.

The package repository `/Users/akashdubey/Documents/CodingProjects/grokipedia-api` contains no raster screenshots, diagrams, or demo videos. The companion app `/Users/akashdubey/Documents/CodingProjects/grokipedia` contains only default React logo assets; those are not Grokipedia identity and should not be used.

### Ranked candidates / capture targets

1. **Current safe hero/card.** `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/grokipedia-api/hero.png` — **1794×1012**. Keep until a stronger package-specific composite is captured. Crop guidance: native 16:9; keep the Grokipedia wordmark/version and full search bar, trimming only outer empty space.
2. **Search-suggestions proof (capture needed).** Run the companion client from `/Users/akashdubey/Documents/CodingProjects/grokipedia`, open `/`, type `machine learning`, wait for the debounced result list, and capture the search input plus 5–8 suggestions. This directly exercises `GrokipediaClient.search`. Target 1440×810.
3. **Article-result proof (capture needed).** In the same app, open `/article/Python_(programming_language)` (or select a fixture-safe result), wait for content/citations, and capture the header, article title, two sections, sidebar outline, and citation area. Avoid error/loading states. Target 1440×900.
4. **Cross-language CLI/API composite (capture needed).** In clean terminals, run one Python search and the equivalent Node/TypeScript search using public queries; capture both outputs side by side with package/version labels. Hide shell username, filesystem path, tokens, request headers, and environment variables. Target 1600×900.
5. **MCP/async gallery artifact (capture needed).** Demonstrate `grokipedia-mcp` exposing search/get-page tools or a bounded `get_many_pages` async run with 3 public topics. Capture structured results and timings only, not server environment or configuration.

Privacy: the current hero is safe on visual inspection. The package/source files contain no ready-made visual candidate beyond that hero. Any live API capture must be reviewed for server errors that could reveal request metadata.

## 5. KRAIL / Knowledge (`knowledge`)

### Current inventory and usage

`/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/knowledge/hero.svg` — **1200×675 viewBox**. Used as frontmatter/cards/archive/detail/OG and repeated inline. It is a dark architecture diagram connecting capture, knowledge, think, workflows/MCP, and repo-backed provenance.

### Ranked candidates

1. **Hero/card — architecture diagram.** `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/knowledge/hero.svg` — **1200×675**. Retain for small and social surfaces: its five-node story is clearer than terminal text at card scale. Crop guidance: preserve the full 16:9 viewBox; do not crop the lower workflows/MCP node or top provenance node.
2. **Detail-page demo — animated terminal.** `/Users/akashdubey/Documents/CodingProjects/knowledge/artifacts/demo/krail-terminal-demo.gif` — **1400×900**. Authentic CLI sequence covering setup/search/think/graph/workflow dry-run. Strongest evidence of a working headless product. Use full-width in the gallery with a static poster and reduced-motion fallback.
3. **Static gallery/poster.** `/Users/akashdubey/Documents/CodingProjects/knowledge/artifacts/demo/krail-terminal-demo-preview.png` — **1400×900**. Final terminal state with citations, suggested next actions, graph entities, and workflow steps. Crop guidance: retain the title bar and bottom completion line; for a 16:9 card crop, remove some upper transcript rather than the commands/output at the bottom.

Privacy: the terminal demo includes the prompt `akash@knowledge`, which is identity-adjacent but not a credential. If a strict anonymous presentation is desired, recapture the same scripted demo using `demo@krail`; do not digitally edit the existing frame in a way that could create mismatched animation frames. No keys, private messages, or secrets were visible.

Recommended recapture state if desired: run the documented minimal-project flow (`doctor`, `capture`, `search --explain`, `think`, `graph entities`, and a workflow `--dry-run`) against `/Users/akashdubey/Documents/CodingProjects/knowledge/examples/minimal-project`, using synthetic regional indicators and a neutral shell prompt.

## 6. RAIL (`rutgers-agentic-intelligence-labs`)

### Current inventory and usage

`/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/rail/hero.svg` — **1200×675 viewBox**. Used as frontmatter/cards/archive/detail/OG and repeated inline. It is an architecture diagram for research repo → hydration engine → operator UI, with agent surfaces and an integrity layer. It is accurate to the older/broader portfolio narrative, but the current source README describes RAIL more narrowly as the visual/operational control plane for published KRAIL; a live UI is now more authentic.

### Ranked candidates

1. **Hero — command center desktop.** `/Users/akashdubey/Documents/CodingProjects/RAIL/out/screenshots/krail-command-center-desktop.png` — **1434×1276**. Full fixture-backed Census Research Lab overview with quick actions, health/attention queue, runs, activity, and artifacts. Best product proof. Crop guidance: for 16:9 hero, crop to roughly y=0–806, retaining header, title, quick actions, metrics, and the top of both action/run panels. For a taller detail image, use the full frame.
2. **Gallery — ontology explorer desktop.** `/Users/akashdubey/Documents/CodingProjects/RAIL/out/screenshots/krail-ontology-explorer-desktop.png` — **1434×1325**. Strongest evidence of object-centered knowledge: project search, object/source/claim counts, classes, instances, relationships, provenance, and actions. Crop guidance: use full-width/tall; if 16:9 is required, preserve the top through the first 3–4 table rows and the right entity panel. A `/private/tmp/...` fixture path is visible in the lower provenance panel; crop it out or recapture with a neutral workspace path.
3. **Gallery / responsive proof — command center mobile.** `/Users/akashdubey/Documents/CodingProjects/RAIL/out/screenshots/krail-command-center-mobile.png` — **384×2197**. Demonstrates a complete mobile layout with the same fixture state. Use as a phone-framed portrait inset, never as a hero background. Crop guidance: split into top (title/actions/metrics) and middle (attention/runs) panels if the gallery cannot display long images.
4. **Gallery / responsive ontology.** `/Users/akashdubey/Documents/CodingProjects/RAIL/out/screenshots/krail-ontology-explorer-mobile.png` — **384×1738**. Useful secondary proof that dense ontology state remains usable on mobile. Keep only if the detail page supports a portrait gallery.
5. **Card alternative — existing architecture diagram.** `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/rail/hero.svg` — **1200×675**. Keep only where a diagram reads better than a dense UI screenshot. Before continued use, reconcile its “hydration engine / CLI / SDK / MCP / FastAPI” ownership with the current README's statement that RAIL consumes published KRAIL surfaces rather than containing the engine/SDK/MCP itself.
6. **Do not promote — API unavailable state.** `/Users/akashdubey/Documents/CodingProjects/RAIL/out/screenshots/krail-live-api-unavailable-desktop.png` — **1580×889** (mobile counterpart: `/Users/akashdubey/Documents/CodingProjects/RAIL/out/screenshots/krail-live-api-unavailable-mobile.png`, **481×1041**). This is authentic error-boundary evidence but visually communicates a broken product. Reserve for engineering documentation, not portfolio hero/card/gallery.

Privacy: the recommended RAIL frames use Census/ontology fixture content and reveal no keys, credentials, personal messages, or student data. The ontology explorer's temporary filesystem path is not sensitive but should be removed from public-facing crops. The command-center screenshot includes expected fixture warnings; a healthier populated state would be more persuasive.

Fresh-capture instructions: from `/Users/akashdubey/Documents/CodingProjects/RAIL/RutgersAgenticIntelligenceLabs`, run the documented `make setup` and `make start`, register the included public fixture, then capture `/` after all health checks pass and at least one synthetic artifact exists. Capture `/krail-explore` with the `Transit Affordability` fixture entity selected, `/krail-workflows` with a dry-run completed, and `/krail-analyze` with a public synthetic query/result. Use 1440×900 desktop and 390×844 mobile viewports. Avoid `/krail-live` unavailable states and any linked local project containing private research.

## Verification notes

- Every existing path recommended above was checked with `test -f`/filesystem enumeration and had dimensions read with `sips`; the two MP4s were checked with `ffprobe`.
- Visual inspection covered all current portfolio assets plus every ranked raster/GIF candidate. SVG structure, title/description, and viewBox were read directly.
- Byte hashes confirmed all three Clean Your Data source screenshots are the exact files already deployed by the portfolio; Lykke `discover.png` is likewise duplicated from the source repo, while its other current site images are not byte-identical to the obvious current source exports.
- No candidate was copied, rewritten, or added to the website. Capture targets explicitly marked “capture needed” do not exist yet and therefore are not represented as verified file paths.
