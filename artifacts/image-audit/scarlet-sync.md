# Scarlet Sync visual asset audit

Read-only audit performed 2026-08-06. No product or website code was changed and no media was copied. All paths below were verified locally. The strongest source set is the scripted `first-time-schedule` training flow in `astra-scheduling`: it shows authentic current Scarlet Sync UI with generic course data and no account identity, email address, student identifier, transcript, or credential.

## Executive recommendation

Replace the old landing-page screenshot with a small set of current product states rather than another single repeated image. The best existing hero source is candidate 1 (`07-review-generated-schedule.png`); the best compact card source is candidate 2 (`09-generated-schedules.png`); and the best ready-made 16:9 video/poster composition is candidate 5 (`preview-36s.png`). For a polished final result, recapture the same scripted states after changing the schedule title from **Rename Me** to **Demo Schedule** and eliminating the persistent lower-right **1 Error** toast. The existing assets are good enough to establish composition, but a clean recapture is preferable for a public portfolio hero.

## Current Scarlet Sync visuals and usage

| Current visual | Technical details | Where used / status | Audit |
|---|---:|---|---|
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/scarlet-sync/home.png` | PNG, 3024×1964, 1.540:1 | `_portfolio/scarlet-sync.md` frontmatter (project card/detail hero) and inline article image; `components/home-yoshi-scene.tsx` twice in the Scarlet Sync homepage gallery (the first through project frontmatter, the second directly); `app/cv/page.tsx` as the 2×2 lead CV mosaic tile; `app/resume/opengraph-image.tsx` as the résumé social-image source; `app/image-sitemap.xml/route.ts` for `/resume`. | Authentic but visibly old. It shows a marketing/landing page, not the core scheduling interaction, includes “Akash Dubey” in the account area, and is repeated rather than providing a real gallery narrative. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/generated-images/images/portfolio/scarlet-sync/home/` | Generated AVIF + WebP derivatives at widths 160, 320, 640, 960, 1280 | Responsive derivatives of the master above, indexed by `lib/generated-responsive-images.json`; served by `ResponsiveImage` consumers when applicable. | Not independent creative; replacing the master requires regenerating this set. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/company-logos/scarlet-sync.png` | PNG, 180×180, 1:1 | `components/home-yoshi-scene.tsx` timeline logo; `app/cv/page.tsx` experience logo. | Good current brand mark; retain. It is not a product screenshot. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/generated-images/company-logos/scarlet-sync/` | Generated AVIF + WebP at widths 160 and 180 | Responsive derivatives indexed by `lib/generated-responsive-images.json`. | Retain with the logo. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/videos/scarlet-sync-demo.mp4` | H.264 MP4, 3840×2160, 30 fps, 45.367 s, 38,311,031 bytes | No production-code reference was found. It is a current repository asset but appears orphaned. Frames at 0–10 s are mostly black/red title animation. A sampled scheduling frame at 20 s visibly opens an “Overlay friends” menu containing multiple full names and avatars. | **Do not publish or derive a poster from this file.** It contains identifiable friend/account data and should remain archival unless re-edited from a demonstrably synthetic source. |
| YouTube privacy-mode embed `D4D3lKWCRjM` | Remote iframe | `app/moodboard/page.tsx`, tile titled “Scarlet Sync live.” | Separate from the local MP4. Not suitable as a deterministic site image without a local, reviewed poster. |
| `ScarletSyncVisual` in `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/components/visuals.tsx` | Animated code-generated 3×3 abstract grid | The dispatcher maps slug `scarlet-sync` to it, but no current consumer/import of `DynamicProjectVisual` was found. | Generic abstraction, not an authentic screenshot. Do not favor it over product UI. |

## Ranked replacement candidates

The `.png` training sources numbered 1–4 and 6–8 are actually JPEG-encoded files despite their extension. Preserve that fact during any future ingest or convert them to real PNG/WebP rather than copying with a misleading MIME type.

1. **Generated weekly schedule — strongest hero**  
   Source: `/Users/akashdubey/Documents/CodingProjects/astra-scheduling/docs/training-videos/assets/first-time-schedule/07-review-generated-schedule.png`  
   JPEG-encoded `.png`, 1658×788, 2.104:1. Shows three selected courses, the course-search panel, a populated five-day schedule, availability bands, term, credit count, share/save controls, and generation count. This communicates the product’s core value in one glance and is much more product-specific than the old landing page. Concern: title reads “Rename Me” and a small “1 Error” toast is present at lower right.

2. **Ranked generated schedules — strongest compact differentiator**  
   Source: `/Users/akashdubey/Documents/CodingProjects/astra-scheduling/docs/training-videos/assets/first-time-schedule/09-generated-schedules.png`  
   JPEG-encoded `.png`, 1658×788, 2.104:1. Shows detailed course cards, “100 ranked options,” schedule scores, sorting, regeneration, and the generated-schedules tab. This explains optimization rather than merely showing a calendar, making it especially strong for a project card or secondary gallery frame. No student identity is shown. Concern: small error toast at bottom right; top of the schedule grid is intentionally clipped because the capture focuses lower on results.

3. **Preference tuning — strongest workflow/detail frame**  
   Source: `/Users/akashdubey/Documents/CodingProjects/astra-scheduling/docs/training-videos/assets/first-time-schedule/08-preferences.png`  
   JPEG-encoded `.png`, 1658×788, 2.104:1. Shows term selection, open-section/logistics toggles, availability overlay, priority weights, autosave, regenerate action, and the resulting schedule. It makes the constraint-solving story visible and pairs well with candidate 1. Concern: “Rename Me” and the lower-right error toast.

4. **Search and add a course — clearest input state**  
   Source: `/Users/akashdubey/Documents/CodingProjects/astra-scheduling/docs/training-videos/assets/first-time-schedule/02-search-course.png`  
   JPEG-encoded `.png`, 1658×788, 2.104:1. Shows direct course-code search, fuzzy matches, add/in-plan states, and an empty schedule ready to populate. Strong as the first frame in a three-image workflow sequence. Concern: “Rename Me”; selected text/cursor state makes it feel instructional rather than editorial.

5. **Framed weekly-grid training still — best existing 16:9/poster**  
   Source: `/Users/akashdubey/Documents/CodingProjects/astra-scheduling/docs/training-videos/renders/first-time-schedule/preview-36s.png`  
   PNG, 1920×1080, 16:9. Shows a clean “Demo Schedule” inside an inset browser-like frame with the caption “Review the weekly grid” and a 5/8 progress marker. It is already composed for video and avoids the “Rename Me” title. Strong poster or editorial break. Concern: lower-right “1 Error” is visible inside the UI; caption makes it less suitable as a raw product screenshot.

6. **Dark scheduling workspace — strongest alternate visual tone**  
   Source: `/Users/akashdubey/Documents/CodingProjects/astra-scheduling/out/screenshots/scheduling-shared-canvas-loaded.png`  
   JPEG-encoded `.png`, 1422×800, 1.778:1. Shows the modern dark scheduling workspace, selected courses, generated grid, public/save/copy controls, and dock. It adds tonal variety and is visually striking at card size. Concern: title “Rename Me,” “6 Credits (Too few),” a partially visible error panel, and screenshot edges clip parts of the app; use only with a deliberate crop or recapture.

7. **Three-course populated grid — best colorful mosaic crop**  
   Source: `/Users/akashdubey/Documents/CodingProjects/astra-scheduling/docs/training-videos/assets/first-time-schedule/06-three-courses-added.png`  
   JPEG-encoded `.png`, 1658×788, 2.104:1. Shows a dense, colorful populated schedule and three selected courses without the lower-page results view. It remains legible when cropped tighter than candidate 1, so it works well in the CV mosaic. Concern: “Rename Me” and error toast.

8. **Motion-demo deliverable — optional replacement video**  
   Source: `/Users/akashdubey/Documents/CodingProjects/astra-scheduling/docs/training-videos/renders/first-time-schedule-v2/first-time-schedule-motion.mp4`  
   H.264 MP4, 1920×1080, 30 fps, 32.366 s, 1,490,276 bytes. A concise scripted first-schedule workflow assembled from the same generic training states, far smaller and more task-focused than the current 4K 45-second MP4. Representative frames at 8, 16, 24, and 31 s showed no email, student ID, credential, or friend list. Concern: it includes “First Schedule Demo,” the generic `akash's schedule` label near the end, a `Build Sdule` typo in that end state, the UI’s error toast, and a visible cursor. Use only after a full continuous-playback QA or, preferably, regenerate it from the clean recapture.

## Placement recommendations

| Placement | Selection | Crop / treatment |
|---|---|---|
| Project detail hero / primary project image | Candidate 1 | Prefer a fresh clean recapture at 1920×1080. For the existing 1658×788 file in a 16:9 box, crop to **1401×788** using source rectangle **x=128, y=0, w=1401, h=788**. This sacrifices the extreme left nav and far-right edge while keeping search, schedule title, weekdays, and core course blocks. Do not stretch the native 2.104:1 image. |
| Project card / search-feed thumbnail | Candidate 2 | Use a **4:3 crop of 1051×788**, approximately **x=397, y=0, w=1051, h=788**, centered on course-detail cards and ranked schedule options. This deliberately omits the icon rail and most of the preference panel so the “100 ranked options” concept remains readable at small size. |
| CV mosaic lead tile | Candidate 7 | For a square tile, crop **788×788** at approximately **x=615, y=0, w=788, h=788** to emphasize the colored weekly grid. For the current 2×2 tile if it renders closer to 4:3, use **x=365, y=0, w=1051, h=788**. Keep weekday headers and at least three colored course blocks. |
| Homepage gallery | Three-frame sequence: candidate 4 → candidate 3 → candidate 2 | This tells input → constraints → optimized results. For a wide feature frame, retain native 2.104:1 or crop gently to 2:1 (**1576×788**, x≈41). For stacked/square secondary tiles, crop candidate 3 around the preference controls (**x=0–788**) and candidate 2 around ranked results (**x≈700–1488**); do not reuse the hero image twice. |
| Optional video poster | Candidate 5 | Keep native 1920×1080. If the player applies `object-cover`, lock it to 16:9. Avoid automatic first-frame poster generation from the current local MP4 because its opening is nearly black. A clean recapture should remove the in-UI error toast rather than painting it out. |
| Optional replacement demo video | Candidate 8 | 16:9, contain rather than crop; muted autoplay only if the portfolio already honors reduced-motion preferences. Review the entire 32.366 s before publishing. |

## Privacy, redaction, and authenticity notes

- Candidates 1–5 and 7 use catalog course names/codes and generic demo schedule titles; no email, RUID, phone number, transcript, grade, private student profile, or credential is visible.
- Candidate 6 uses generic courses and a `REL` avatar but no personal name. Treat it as acceptable only if that avatar is an intentional test fixture; a clean anonymous avatar is preferable in a recapture.
- The current 4K `public/videos/scarlet-sync-demo.mp4` is not privacy-safe for public reuse: a sampled frame at 20 s shows a friend-overlay menu with multiple full names and avatars. Do not extract stills from it or re-enable it on the site.
- Do **not** use screenshots under `reports/ui-audit/browser-authenticated-2026-07-17/` without a separate manual privacy review. They are explicitly labeled as live authenticated sessions and may contain real account state.
- Do **not** use the current `10-saved-end-state.png` as-is: it exposes an `akash's schedule` label. It is not sensitive in the same way as a student record, but it weakens the anonymous-demo standard and is unnecessary when safer alternatives exist.
- Fixture screenshots containing “Jordan’s academic overview” were excluded from the ranked list even though they appear synthetic; the scheduling training flow is both safer and more relevant.
- The recurring “1 Error” toast is not a privacy problem, but it is a product-quality problem. Prefer state recapture over pixel redaction. If an existing still must ship temporarily, crop it out; do not blur it, because a blur implies concealed sensitive content.
- Course identifiers and public catalog metadata are not student data. Nevertheless, avoid any capture that combines them with a real person’s saved plan, grades, degree progress, or identity.

## Fresh capture list (recommended)

Existing files are substantially better than the website’s current landing-page image, but they are not fully portfolio-ready because of the placeholder schedule title and error toast. Reproduce the existing scripted first-schedule flow with a synthetic/demo account and capture these exact states:

1. **`/scheduling` — hero, generated schedule:** desktop 1920×1080, light mode, schedule title `Demo Schedule`, three generic catalog courses selected, 12–16 credits, generated weekly grid visible, no toast/error/loading state, no browser chrome, no account/profile popover.
2. **`/scheduling` — preferences:** same viewport and demo schedule; Preferences tab open with open-sections, availability overlay, term, and priority controls visible alongside the populated grid.
3. **`/scheduling` — ranked options:** scroll to Detailed Course Information + Generated Schedules; show 3–4 scored alternatives and sorting controls, with no warning/error banner unless the banner is intentional explanatory copy.
4. **`/scheduling` — search/add:** search a generic public course code and show one `In plan` plus several `Add` results while the schedule grid remains visible.
5. **`/degree-planning` — populated plan:** synthetic degree fixture only, showing requirements/flowsheet and progress without a person’s name, grades, uploaded transcript, or student ID. This adds breadth to the CV/homepage mosaic beyond scheduling.
6. **`/ai-assistant` or assistant overlay on `/scheduling` — grounded planning response:** synthetic prompt and response, no chat history or account identity; show an artifact or schedule recommendation sourced from generic catalog data.
7. **Mobile scheduling state:** 390×844 or 430×932, populated demo schedule with the course list/schedule interaction visible. Use only as a secondary mosaic image, not the project hero.
8. **Video poster frame:** 1920×1080 from the clean hero state, with pointer moved off-canvas and all transient controls/tooltips dismissed.

Capture both light and dark variants for states 1–3 if time permits, but keep one theme within a single gallery sequence. Use deterministic fixture/demo data, disable notifications and analytics overlays, wait for fonts/maps/data to settle, and inspect every frame at 100% before export.

## Verification performed

- Searched production website references with `rg` across `_portfolio`, `components`, `app`, `lib`, and `public`.
- Enumerated image/video candidates in both repositories, including training assets, rendered videos, Storybook/design-system screenshots, UI-audit reports, and prior screenshots.
- Inspected the current master image; sampled the current 4K video at 0, 5, 10, 20, 30, and 40 s; sampled the replacement motion demo at 8, 16, 24, and 31 s; and visually reviewed the complete 13-image first-schedule sequence, selected rendered previews, and newer dark scheduling captures.
- Verified dimensions and actual encodings with `file`, `sips`, and `ffprobe`.
- Verified every recommended source path exists at the time of this audit.
