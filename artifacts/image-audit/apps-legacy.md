# Apps, web, mobile, game, and legacy portfolio visual audit

Audit date: 2026-08-06  
Website repository: `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io`  
Mode: read-only asset review; no source images were edited, copied, or generated.

## Scope and method

This audit covers the explicitly requested projects—FlaminGo, FBLA Mobile App, FBLA Coding and Programming, The Campus Chronicle, ESL Worksheet Generator, AP Calculus Problem Generator, High School Programming Projects, and Kenny's Racing Game—plus A* Path Finder, the one remaining portfolio entry that is clearly a legacy software build and not already covered by Scarlet Sync, robotics, an AI-product audit, or a data/research audit.

The review included:

- all relevant originals under `images/portfolio`;
- the current frontmatter and inline-media references in `_portfolio/*.md`;
- the generated responsive-image manifest and its derived AVIF/WebP variants;
- sibling directories under `/Users/akashdubey/Documents/CodingProjects`, including Git remote configs and filenames/content matching the project names.

No matching local sibling clone was found for `ASD-final-project`, `ESL-Worksheet`, `path-finder`, `fbla-app`, the Campus Chronicle, FlaminGo, or the calculus generator. The website repository is therefore the only verified local source of authentic imagery for these projects. The responsive files under `public/generated-images` are derivatives of the originals, not additional compositions, and are not ranked separately.

## How images are currently used

Every project frontmatter `image` is used in the project archive/card and as the 16:9 project-page hero. Archive cards use `object-cover`; project pages use `object-contain`. Inline Markdown images and GIFs form the detail gallery. This means a strong hero must tolerate a centered 16:9 crop, while narrow phone captures and tall terminal captures are better reserved for gallery roles.

| Project | Current card/hero | Current inline media | Assessment |
|---|---|---|---|
| FlaminGo | `images/portfolio/flamingo/image.png` | Same title slide; embedded YouTube demo | Polished but not product evidence; names nine team members and shows no app UI. |
| FBLA Mobile App | `images/portfolio/android/title.png` | `scroll.gif`, `people.gif`, `select.gif`, `added.gif`, `saved.gif`; embedded Google Slides | Good title card, but the authentic screens are tiny GIFs and several show identifiable or third-party portraits. |
| FBLA Coding and Programming | `images/portfolio/fbla/main.png` | `prez.png`, `search.png`, `908.png`, `form.png`, `comments.png` | Authentic and varied; the search/results workflow is stronger than the current landing-page hero. |
| Campus Chronicle | `images/portfolio/newspaper/front_page.png` | `science_page.png`, `author_page.png`, `article_page.png`; two YouTube links | Good UI coverage, but some frames contain student names/faces and third-party article art. |
| ESL Worksheet Generator | `images/portfolio/esl/home.png` | `working.gif`, repeated `home.png` | The current hero is authentic and legible; there is no finished worksheet/result screenshot. |
| AP Calculus Generator | `images/portfolio/home.png` | `derivative.png`, `integral.png`, `revolve.png` | The hero is a setup prompt and is also incorrectly reused by School Projects. The result frames prove the generator better. |
| High School Programming Projects | `images/portfolio/home.png` | None | Misleading: the borrowed calculus screenshot does not represent the umbrella entry. No dedicated local asset exists. |
| Kenny's Racing Game | `images/portfolio/racing/title.png` | `kenny.gif`, `two.png`, `grand.png`; embedded YouTube demo | Strong local action coverage; the title menu is less persuasive than gameplay. |
| A* Path Finder | `images/portfolio/random_environment.png` | `environment_settings.png`, `drawn_environment.png` | Authentic result coverage; the hand-drawn environment is more legible than the current noisy random maze. |

## Priority recommendations

1. Replace the School Projects hero first; it currently duplicates and misattributes the calculus generator UI.
2. Capture real FlaminGo app screens from the existing demo, especially posture analysis or balance testing.
3. Promote `racing/grand.png`, `drawn_environment.png`, and `fbla/search.png` from gallery frames to cards/heroes.
4. Add finished-output captures for ESL and calculus; both currently emphasize setup/code rather than the user payoff.
5. Treat phone GIFs as gallery motion only. They are 240 px wide, 5.7–8.0 MB each, and are poor card sources.
6. Before publication, remove or mask student names/faces, emails, phone numbers, or real submissions. Retain third-party art/logos only when the screenshot needs them to explain the built interface.

## Project-by-project candidates

### FlaminGo

Current inventory:

- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/flamingo/image.png` — 2546×1434 PNG, 1,260,558 bytes. Current card, hero, and first inline image. A pink presentation cover with flamingo mark, product name/tagline, and team names.
- The portfolio body embeds YouTube video `2UDaCEb_5cE`; there is no local video or app-screen asset to rank.

Ranked candidates:

1. **Fresh posture-analysis screen from the existing demo** — best hero and card. Capture the app actively tracking a body pose with keypoints or a clear spine-angle/form overlay, with no person recognizable if possible. This immediately substantiates the Vision feature. Capture at the source video's native resolution or directly from the simulator/device, ideally at least 1170×2532 for a phone frame; place the phone on a simple pink/neutral background in a 16:9 canvas. Keep the phone and overlay in the middle 60% so both `object-cover` cards and 16:9 heroes survive.
2. **Fresh three-screen app composite** — hero alternative and opening gallery image. Use home/dashboard, balance test, and exercise/rep-counting screens from the demo. Keep all text large enough to read at 1280 px page width and avoid HealthKit details, notifications, profile names, or other personal health data. A 1920×1080 composite is preferred.
3. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/flamingo/image.png` — fallback card/hero. It is sharp, brand-consistent, and already near 16:9, but it reads as a pitch-deck cover rather than a product. If retained as a card, use a centered 16:9 crop and remove the bottom team-name band from the visible crop; keep the full slide only in the gallery/presentation context.

Fresh-capture procedure: open the embedded demo at full-screen 1080p, pause on a stable app state rather than a transition, hide playback controls, and capture the application region. Prefer simulator/device source capture over a YouTube frame if the original app is available. Audit every frame for health metrics and background faces before publication.

### FBLA Mobile App — Portfolio Maker

Current inventory:

- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/android/title.png` — 1103×621 PNG, 206,270 bytes. Current card/hero; a clean “Portfolio Maker / FBLA App Dev” title card with two creator names.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/android/scroll.gif` — 240×426 GIF, 199 frames, 13.27 s, 5,733,532 bytes. Scrolls an individual portfolio.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/android/people.gif` — 240×426 GIF, 220 frames, 14.67 s, 7,150,149 bytes. Browses saved portfolios.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/android/select.gif` — 240×426 GIF, 220 frames, 14.67 s, 7,001,178 bytes. Selects an individual portfolio.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/android/added.gif` — 240×426 GIF, 226 frames, 15.07 s, 6,118,285 bytes. Shows a newly added portfolio.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/android/saved.gif` — 240×426 GIF, 226 frames, 15.07 s, 8,009,371 bytes. Demonstrates persistence after closing/reopening.

Ranked candidates:

1. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/android/title.png` — best existing hero/card. It is the only landscape, privacy-safe local asset and fits 16:9 almost exactly. Use uncropped or trim only a few pixels from the right; keep the main title centered. Move it to gallery position two only after a clean product composite is captured.
2. **Fresh privacy-safe three-phone composite** — ideal future hero. Recapture the app with fictional profiles and original/avatar-placeholder art: portfolio list, portfolio creation form, and saved-detail view. Export at 1920×1080 with three 9:16 phones, leaving 8–10% outer padding. This demonstrates browse/create/persist in one image without relying on famous-person portraits.
3. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/android/added.gif` — best existing motion gallery candidate because it shows creation/output, not just navigation. Do not use as a card: it is only 240 px wide and shows an identifiable person and biographical details. Recapture with a fictional profile or mask the portrait and name.
4. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/android/saved.gif` — useful secondary gallery proof of persistence. It includes OS/app-switcher chrome plus a third-party portrait; retain only after recapture with sample content. Tight crop to the device screen, not the surrounding monitor.
5. `scroll.gif`, `people.gif`, and `select.gif` at the verified paths above — supporting gallery motion only. They are redundant with one another and include recognizable public figures/portraits. Use at most one after replacing the content with fictional examples.

Fresh-capture procedure: run the app/emulator with a seeded fictional profile, capture native screenshots rather than photographing the monitor, and record one 5–8 second 30 fps interaction per feature. Remove status-bar notifications and use a 360×800 or larger emulator; export GIF/WebM only after the still hero is selected.

### FBLA Coding and Programming — CTE Partnerships

Current inventory:

- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/fbla/main.png` — 636×587 PNG, 94,341 bytes. Current card/hero; responsive landing page with project logo, search field, and value proposition.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/fbla/search.png` — 798×559 PNG, 127,854 bytes. Search query, filters, sorting, and organization results.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/fbla/908.png` — 615×511 PNG, 61,019 bytes. Organization detail screen with categories and contact cards.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/fbla/form.png` — 405×540 PNG, 18,664 bytes. Request-organization form.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/fbla/comments.png` — 597×363 PNG, 46,396 bytes. Disqus reactions/comments with names and first-person testimony.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/fbla/prez.png` — 868×496 PNG, 207,903 bytes. Presentation cover with project logo and three creator names.

Ranked candidates:

1. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/fbla/search.png` — recommended hero/card. It shows the core product loop—query, filters, sorting, and results—in one authentic frame. Crop to 16:9 by trimming the lowest result row and a small amount from the bottom; preserve the search query, filter rail, and first full result. Business logos are integral to this directory UI, but they should not be detached or presented as original artwork.
2. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/fbla/main.png` — gallery opener or narrow-card fallback. It has the strongest project branding but too much vertical whitespace and a near-square aspect. For 16:9, retain the navigation, logo, title, search, and the top of “Why Choose Us?”; do not crop out the search interaction.
3. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/fbla/908.png` — second gallery image. It proves the detail-view information architecture. For a wide gallery placement, use the upper 65% and omit the phone/contact cards if publishing real contact information would be inappropriate.
4. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/fbla/form.png` — tertiary gallery/mobile column. Preserve the full form vertically; do not stretch into a hero.
5. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/fbla/prez.png` — presentation link thumbnail only. It is privacy-safe enough given project credits but shows no working software.

Do not promote `comments.png`: it contains identifiable names and real-looking testimony, and the third-party Disqus UI is not the strongest evidence of authored work. If comments matter to the story, recapture with seeded fictional comments and no account menu.

### The Campus Chronicle

Current inventory:

- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/newspaper/front_page.png` — 1319×897 PNG, 624,389 bytes. Current card/hero and moodboard image; publication homepage with article grid.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/newspaper/science_page.png` — 1397×832 PNG, 917,638 bytes. Science category page with strong feature cards and ranked sidebar.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/newspaper/author_page.png` — 1330×878 PNG, 135,078 bytes. Authors grid with student names, bios, and one face.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/newspaper/article_page.png` — 1067×884 PNG, 352,278 bytes. Article template with author identity and third-party product art.

Ranked candidates:

1. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/newspaper/science_page.png` — recommended hero/card. It is closest to 16:9, has a distinctive editorial hierarchy, and avoids visible student faces. Use a centered 16:9 crop that keeps “All Science Stories,” both large story cards, and the ranked sidebar. The story photographs remain third-party editorial content embedded in the authentic project screenshot; do not extract or reuse them independently.
2. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/newspaper/front_page.png` — primary gallery/overview image and acceptable card fallback. Crop a 16:9 band from the top, retaining the masthead, lead story, and first three secondary headlines. The current full-frame card crop can cut article context unpredictably.
3. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/newspaper/article_page.png` — secondary gallery image to demonstrate typography and article structure. Prefer a recapture using a project-written/sample article and original/cleared feature image; otherwise keep this only as a contextual screenshot because it names a student and prominently reproduces brand artwork.
4. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/newspaper/author_page.png` — do not publish more prominently. It exposes student names/bios and a face. A safe replacement would use placeholder avatars and role labels, or a crop of the masthead plus anonymous cards.

Fresh-capture option: if the site still builds, seed one clearly fictional article and three fictional authors, then capture homepage, category, and article layouts at 1440×900. This preserves the authentic design while removing privacy and licensing ambiguity.

### ESL Worksheet Generator

Current inventory:

- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/esl/home.png` — 1216×810 PNG, 54,023 bytes. Current card/hero and inline image; landing page with worksheet types, levels, and custom-story form.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/esl/working.gif` — 426×240 GIF, 226 frames, 15.07 s, 4,912,078 bytes. Development/code-and-terminal recording in VS Code rather than the user workflow.

Ranked candidates:

1. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/esl/home.png` — best existing hero/card. It clearly communicates the available worksheet types and custom-input workflow. Crop to 16:9 from the top, preserving the title, the four generator choices, and the “Generate a custom worksheet” heading; the bottom form may be cut on cards but should remain intact on the project page.
2. **Fresh before/after composite** — ideal replacement hero. Place the custom-story input on the left and the generated worksheet/PDF on the right, using neutral public-domain or author-written sample text. Capture at 1920×1080 with the output occupying at least half the width. This shows the payoff missing from current assets.
3. **Fresh completed worksheet capture** — gallery image. Show one vocabulary or rearrangement worksheet with answer blanks and a clear level indicator; use a full-page 4:3 or portrait capture at 1200 px minimum width.
4. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/esl/working.gif` — development-process appendix only. It is low resolution, visually dense, and may reveal editor paths or terminal details. Do not use as card, hero, or primary gallery media.

Fresh-capture procedure: open the hosted demo at a 1440×900 viewport, enter a short author-written story with no personal information, capture the filled input state, submit, and capture the first complete output screen. Hide browser bookmarks/profile chrome.

### AP Calculus Problem Generator

Current inventory:

- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/home.png` — 725×695 PNG, 94,541 bytes. Current card/hero; terminal quiz configuration with time limit and question-type prompts. Also incorrectly reused as the School Projects hero.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/derivative.png` — 300×582 PNG, 16,566 bytes. Portrait terminal capture of a derivative multiple-choice question and answer result.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/integral.png` — 255×750 PNG, 20,131 bytes. Tall terminal capture of an exponential-integral question and answer result.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/revolve.png` — 820×687 PNG, 28,521 bytes. Wide terminal capture of a generated volume-of-revolution setup question and symbolic choices.

Ranked candidates:

1. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/revolve.png` — recommended existing card/hero. It most clearly demonstrates nontrivial generated mathematics and has the best usable width. Crop to 16:9 by trimming the bottom after option `b` or by placing the full terminal frame on a dark 16:9 background; never crop the question stem or the squared integrand.
2. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/home.png` — first gallery/context image. It explains configurability but is near-square, verbose, and visually ends mid-prompt. Use uncropped with `object-contain`, not as a cover crop.
3. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/derivative.png` — gallery column paired with `integral.png`. It shows correctness feedback, but at 300 px wide it is too small for a hero.
4. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/integral.png` — gallery column paired with `derivative.png`; same limitations, plus a very tall aspect ratio.
5. **Fresh landscape quiz session** — preferred future hero. Run the generator in a 120×32 terminal or browser shell, choose a mix of question types, and capture one complete question with four choices plus the scored answer in a single 1600×900 frame. Use a clean prompt with no usernames, home paths, Replit account chrome, or notifications.

### High School Programming Projects

Current inventory:

- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/home.png` — 725×695 PNG, 94,541 bytes. Current card/hero, but it belongs to the calculus generator and does not represent the umbrella entry.
- The entry links to separate Amazon Books, Record Islands, Depth Estimation, and ASD project sources but contains no dedicated inline visual. Local sibling clones for those named legacy repositories were not found during this audit.

Ranked candidates:

1. **Fresh four-panel “early builds” composite** — required replacement hero. Capture one authentic frame each from Amazon Books analysis, Record Islands scraper/output, an ASD project, and the already documented depth-estimation work. Label each panel in plain text and export 1920×1080. Keep the central 80% meaningful so a card crop does not isolate only one project. This is the only candidate that honestly represents the umbrella entry.
2. **Fresh Record Islands result** — card alternative if the entry is narrowed to that project. Show the scraper's structured output or visualization, not source code. Use a 16:9 capture at 1440×810 or larger and remove tokens, URLs containing account identifiers, and raw personal records.
3. **Fresh Amazon Books result** — gallery candidate. Show an original chart/table or model result from the case study with title and axes intact. Do not use retailer cover art as the visual focus.
4. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/stereo/results.png` — 999×543 PNG; existing authentic Depth Estimation result and a possible gallery-only fallback if the umbrella page keeps its MSDS Final section. It should not become the umbrella card because Depth Estimation already has its own portfolio entry.
5. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/home.png` — remove from this entry. It is not a valid candidate except as an explicit, captioned calculus panel within a broader composite.

Fresh-capture procedure: first revise the page's `todo` outline into a stable list of projects, then capture one output—not code—for each surviving item. Use the same 16:9 canvas, border, and label treatment across panels. If only one or two projects can be recovered, split them into separate entries rather than presenting a vague umbrella card.

### Kenny's Racing Game

Current inventory:

- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/racing/title.png` — 932×881 PNG, 134,099 bytes. Current card/hero; menu over a top-down track with a real person's face used as a crest.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/racing/kenny.gif` — 426×240 GIF, 127 frames, 8.47 s, 4,601,520 bytes. In-race third-person action clip.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/racing/two.png` — 934×878 PNG, 299,239 bytes. Split-screen two-player race with HUD and minimaps.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/racing/grand.png` — 1207×880 PNG, 387,561 bytes. Grand Prix field with player car, competitors, HUD, and minimap.

Ranked candidates:

1. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/racing/grand.png` — recommended hero/card and strongest existing asset in this audit. It immediately communicates 3D racing, AI competitors, position, and track context. Crop to 16:9 from the vertical center, keeping `6th`, the pack of cars, the green direction arrow, and the player car. It is already used effectively on the moodboard.
2. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/racing/kenny.gif` — primary motion gallery. It is native 16:9 and shows the game in action, but 426×240 is too soft for a large hero. Keep as a small autoplay/loop preview or recapture the same sequence at 1280×720+.
3. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/racing/two.png` — second gallery image. It proves local multiplayer. Keep the full split boundary visible; use `object-contain` or a 4:3 gallery slot rather than forcing a 16:9 crop.
4. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/racing/title.png` — menu/branding gallery image only. Do not prioritize it as hero: it contains an identifiable face and weaker game evidence. If the face is a collaborator and consent is not explicit, replace the crest before using it prominently.

Fresh-capture option: replay the existing live demo or source build at 1920×1080 and capture a close pack entering a corner, with the player in the foreground and HUD readable. Hide browser tabs and choose a frame without motion blur or overlapping text.

### A* Path Finder

Current inventory:

- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/random_environment.png` — 1127×789 PNG, 67,043 bytes. Current card/hero; dense random maze with visited turquoise region and yellow path.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/environment_settings.png` — 850×383 PNG, 29,310 bytes. Terminal configuration and controls.
- `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/drawn_environment.png` — 1126×781 PNG, 26,693 bytes. Hand-drawn obstacle course with visited area and a clean yellow solution path.

Ranked candidates:

1. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/drawn_environment.png` — recommended hero/card. The long yellow solution path and turquoise explored region are much easier to parse than the random maze. Crop to 16:9 by removing the lower black area and thin top terminal sliver, while preserving both the left start and right goal/path endpoint.
2. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/random_environment.png` — gallery image for stress-testing/dense exploration. Use a centered crop that preserves the complete red-to-red yellow path. The white noise makes it less suitable for small cards.
3. `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/environment_settings.png` — gallery/context image. It explains controls and heuristic selection and is already close to a wide ratio. Crop only the final blank line; preserve the Euclidean/taxicab prompt and control list.
4. **Fresh animated run** — ideal gallery upgrade. Record a 6–10 second 1280×720+ sequence from start through exploration to the final yellow path. Use a hand-drawn environment with large corridors, no terminal/browser chrome, and a modest grid size so the frontier is visible at card scale.

## Publication and capture standards

- **Hero/card master:** 1920×1080 or at least 1280×720, sRGB, with the key action in the central 60–70%.
- **Gallery still:** preserve native UI aspect when it carries information; use `object-contain` for phone/terminal frames.
- **Motion:** prefer short muted MP4/WebM for quality and file size; keep GIF only for small legacy embeds. The current phone GIFs are 5.7–8.0 MB despite being only 240 px wide.
- **Privacy:** use fictional seed data; clear OS notifications, account menus, bookmarks, health details, emails, phone numbers, student names, and faces unless explicit publication consent exists.
- **Third-party media:** it is acceptable when visibly embedded in an authentic project screenshot and necessary to explain the interface. Do not isolate, enlarge, or reuse article photography, brand art, or portrait images as decorative portfolio art.
- **Authenticity:** prefer working-state UI, generated output, or gameplay over pitch covers, logos, code editors, or presentation title slides.

## Recommended final role map

| Project | Card/hero | Gallery lead | Secondary gallery |
|---|---|---|---|
| FlaminGo | Fresh posture-analysis capture | Fresh three-screen composite | Existing title slide |
| FBLA Mobile | Existing `android/title.png` until recapture | Fresh fictional-profile composite | Recaptured create/persist motion |
| FBLA Coding | Existing `fbla/search.png` | `fbla/main.png` | `fbla/908.png`, then `fbla/form.png` |
| Campus Chronicle | Existing `newspaper/science_page.png` | `newspaper/front_page.png` | Safe recapture of an article page |
| ESL Worksheet | Existing `esl/home.png` until recapture | Fresh before/after composite | Fresh completed worksheet |
| Calculus Generator | Existing `revolve.png` until recapture | Fresh complete quiz session | `home.png`, then derivative/integral pair |
| School Projects | Fresh four-panel composite | One output per surviving subproject | `stereo/results.png` only if explicitly captioned |
| Kenny's Racing | Existing `racing/grand.png` | Existing `racing/kenny.gif` | Existing `racing/two.png` |
| A* Path Finder | Existing `drawn_environment.png` | Fresh animated run | `random_environment.png`, then settings |

## Verification notes

All absolute local paths named as existing candidates above were verified with filesystem checks. Raster dimensions were read from the files with `sips`; GIF frame counts and durations were verified with `ffprobe`. Frontmatter and inline usage were confirmed directly against the nine relevant `_portfolio/*.md` files, and the card/hero crop behavior was confirmed in the Next.js components. No files outside this report were intentionally changed.
