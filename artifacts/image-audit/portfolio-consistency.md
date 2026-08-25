# Portfolio image consistency audit

Audited: 2026-08-06  
Scope: read-only review of project frontmatter and body media, homepage imagery, project feed and detail components, CV collage, writing heroes, the responsive-image manifest/build script, and existing screenshot artifacts. No site code or image asset was changed.

## Executive diagnosis

The portfolio has enough strong source material for a convincing visual system, but it currently behaves as several separate systems: polished 2025–26 product screenshots, old school-project title slides, dense research figures, generic AI-illustrated writing covers, and a large personal-photo journal. The component layer then forces the same project cover through incompatible crops. This makes image quality depend more on where an image happens to render than on whether it communicates the project.

The most serious problems are:

1. **Several primary covers do not show the work.** `/images/portfolio/home.png` is a generic terminal capture shared by two projects; the TopCoder cover is a GitHub repository header; the Puerto Rico cover is a title slide; and the FRC cover is a low-resolution lab photo. These weaken comprehension and trust before the copy is read.
2. **One cover is asked to satisfy four different render contracts.** The project feed renders featured covers at natural aspect ratio, selected cards at 5:4 with `object-cover`, archive tiles at 16:10 with `object-cover`, and detail heroes inside a 16:9 box with `object-contain`. The CV adds square, 2:1, and 1:1 mosaic crops. Text-heavy UI and charts cannot survive all of these.
3. **Duplication substitutes for visual evidence.** Twenty-one of 28 project pages repeat the detail hero as the first body image. Scarlet Sync uses the exact same screenshot twice in its homepage gallery. The active photo journal contains the same beach photograph twice under different names.
4. **The homepage is visually rich but operationally overbuilt.** Forty literal image references in `home-yoshi-scene.tsx` total 353.6 MiB of source assets. Responsive variants keep delivery sizes lower, but 15 orientation-tagged photos have manifest dimensions opposite their displayed orientation, risking layout shifts.
5. **Writing covers are coherent with each other but not with the rest of the portfolio.** All nine are square, synthetic-looking illustrations. They look like a generated series rather than evidence from the actual period, project, or event described.
6. **Screenshot evidence is fragmented and stale.** Current project-feed screenshots exist, but all existing homepage artifacts represent older layouts, and there is no screenshot coverage for project details, writing, or the CV collage.

## Priority and flag definitions

- **P0 — replace first:** the image fails to identify the project, materially misrepresents the work, is duplicated across distinct projects, or breaks badly in a primary crop.
- **P1 — replace in the main pass:** the image is relevant but text-heavy, weakly legible, stale-looking, poorly cropped, or too generic to function as strong portfolio evidence.
- **P2 — retain or polish:** the image communicates the project and has sufficient resolution; changes should focus on crop derivatives, color consistency, or supporting gallery depth.
- **ID:** identity failure; the image does not clearly show what was built or learned.
- **DUP:** exact or functional duplication.
- **CROP:** important content is at risk in 5:4, 16:10, square, or wide mosaic crops.
- **TEXT:** essential meaning depends on text too small to read at card size.
- **LOW:** source is below the recommended master dimensions for its primary use.
- **STALE:** visibly old UI or a title/presentation frame used where current evidence should appear.
- **STYLE:** visual language conflicts with the wider portfolio or is indistinguishable from another project.
- **GOOD:** relevant, legible, and technically adequate for its present tier.

## Verified render contracts

These recommendations are derived from actual component usage, not generic web-image guidance.

| Use | Actual component behavior | Recommended master | Safe-content guidance |
|---|---|---:|---|
| Project detail hero | `aspect-video`; image is `object-contain`; desktop `sizes` tops out around 42rem | **1920 × 1080, 16:9** | Keep the primary subject within the central 80%; avoid browser chrome smaller than 18 px at master size. |
| Featured project cover | Natural-height contained image; collage below uses one tall and two small `object-cover` cells | **1920 × 1080, 16:9** cover plus **1200 × 1500, 4:5** and two **1200 × 800, 3:2** details | Featured projects need at least four distinct images; do not reuse the hero in the collage. |
| Selected-work card | `aspect-ratio: 5 / 4`, min-height 28–36rem, `object-cover`, copy overlays the bottom | **1600 × 1280, 5:4** derivative | Put the focal UI/action in the upper/central 70%; the bottom 25% is obscured by gradient and copy. |
| Archive tile | `aspect-ratio: 16 / 10`, `object-cover` | **1600 × 1000, 16:10** derivative | Keep text out of the outer 12%; favor one readable subject over whole-screen screenshots. |
| Markdown/gallery image | Full width, natural aspect, approximately 64rem maximum | **1920 px wide** for UI; **1600 px wide** for charts/photos | Preserve native ratio; use detail callouts instead of shrinking dashboards or posters into one frame. |
| Writing card | Fixed 12rem height, `object-cover`; card width about 24rem | **1600 × 1000, 16:10** derivative | The image must work without embedded title text and retain its subject in a shallow crop. |
| Writing detail hero | Full width with `max-height: 34rem`, `object-cover` | **1920 × 1080, 16:9** | Keep focal content within the center 70% vertically; square masters currently lose large top/bottom areas. |
| CV mosaic regular cell | 2-column mobile / 4-column desktop, 9–11rem rows, `object-cover` | **1200 × 1200, 1:1** derivative | Use subject-led images; do not rely on chart labels or UI text. |
| CV mosaic wide cell | Two columns by one row, about 2:1, `object-cover` | **1600 × 800, 2:1** derivative | Use a wide crop prepared separately, not the project hero. |
| CV mosaic large cell | Two columns by two rows, approximately square | **1600 × 1600, 1:1** derivative | Preserve the product/device/robot as the single focal object. |
| Homepage portrait | Circular 1:1 frame with `object-position: 50% 42%` | **1600 × 1600, 1:1** | Leave head-and-shoulders room and test the circular mask at 288–400 px. |
| Homepage visual journal | Masonry columns at natural aspect; lightbox up to 92vw | **1600–2400 px long edge**, normalized orientation | Keep natural aspect; source originals above 4000–5700 px are unnecessary for the generated 1280 px maximum. |
| Homepage timeline/gallery | Primary images mostly natural/contained; secondary grid images can cover 2-column cells | **1920 × 1080** primary plus **1200 × 900** supporting images | Use a consistent dark/light framing treatment and provide distinct views for each point. |

**Strategy implication:** preserve one canonical, uncropped 16:9 project hero, but generate authored crop derivatives for selected, archive, and CV use. Do not expect CSS `object-cover` to art-direct screenshots, plots, posters, or title slides.

## Complete project-to-current-image matrix

“Feed tier” reflects the actual sets in `components/project-feed-search.tsx`: three frontmatter-featured projects, seven hard-coded selected projects, and the remaining archive tiles. “Feed media” is the image list actually returned by `lib/content.ts`; Markdown-image syntax is not extracted into that list.

| Project | Feed tier | Current frontmatter image | Source / ratio | Actual feed media | Assessment | Priority |
|---|---|---|---:|---:|---|---|
| American Statistical Association Fall Data Challenge 2023 | Archive | `/images/portfolio/asa-data/Capture.PNG` | 903×507 / 1.78 | 1 | Title slide identifies the event but not the analysis or conclusions; embedded text is unreadable at tile size. `TEXT`, `STALE`, `LOW` | **P1** |
| AP Calculus Problem Generator | Archive | `/images/portfolio/home.png` | 725×695 / 1.04 | 4 | Generic terminal transcript, shared with “High School Programming Projects”; 16:10 crop drops context and does not show generated problems or answers. `ID`, `DUP`, `CROP`, `LOW` | **P0** |
| Data Cleaning Assistant | Selected | `/images/portfolio/clean-your-data/hero.png` | 3018×1718 / 1.76 | 3 | Strong current product UI and a coherent three-image set. Selected 5:4 crop trims a wide dashboard and bottom overlay hides controls. `CROP`; otherwise `GOOD` | **P2** |
| MSDS Final: Depth Estimation | Archive | `/images/portfolio/stereo/poster.png` | 2500×1666 / 1.50 | 1 | High-resolution research poster, but the entire poster is illegible in a card and looks like a submission artifact rather than a visual result. `TEXT`, `CROP` | **P1** |
| q-Binomial Theorem Presentation | Archive | `/images/portfolio/drp.png` | 2444×1370 / 1.78 | 1 | Clean title slide with strong geometry, but communicates “presentation” rather than the theorem or insight. `ID`, `TEXT` | **P1** |
| Economic Series Plotter | Archive | `/images/portfolio/vis/economic-plotter.png` | 1168×837 / 1.40 | 1 | Relevant working UI; labels and chart legend become too small, and the 16:10 crop is tight. `TEXT`, `CROP`, `LOW` | **P1** |
| ESL Worksheet Generator | Archive | `/images/portfolio/esl/home.png` | 1216×810 / 1.50 | 1 | Relevant but visibly old, sparse interface. The useful animated worksheet (`working.gif`) renders in the body but is not extracted into feed media. `STALE`, `LOW` | **P1** |
| FBLA Coding and Programming Project | Archive | `/images/portfolio/fbla/main.png` | 636×587 / 1.08 | 6 | Old landing screen, low-resolution and portrait-ish; project identity depends on readable page copy. Gallery depth is good. `TEXT`, `CROP`, `LOW`, `STALE` | **P1** |
| FBLA Portfolio Making Android App | Archive | `/images/portfolio/android/title.png` | 1103×621 / 1.78 | 1 | Branded presentation title, not an Android product screen; no feed-visible mobile UI evidence. `ID`, `TEXT`, `STALE` | **P1** |
| FlaminGo! | Archive | `/images/portfolio/flamingo/image.png` | 2546×1434 / 1.78 | 1 | Attractive branded title slide, but no iOS interface, posture analysis, or HealthKit result is visible. `ID`, `TEXT` | **P1** |
| Grokipedia API | Archive | `/images/portfolio/grokipedia-api/hero.png` | 1794×1012 / 1.77 | 4* | Minimal search bar is polished but generic and does not show SDK usage or response data. The other three parsed images are remote status badges, not gallery evidence. `ID`, `STYLE` | **P1** |
| HiC-TAD-Library | Selected | `/images/portfolio/hic-tad/hero.png` | 1612×1768 / 0.91 | 6 | Scientifically relevant heatmap/plot, but portrait format is severely cropped in the 5:4 selected card and regular CV cell; axis labels disappear. Strong supporting figures exist. `CROP`, `TEXT` | **P0** |
| ASD Racing Game | Archive | `/images/portfolio/racing/title.png` | 932×881 / 1.06 | 1 | Actual game menu, but low-resolution, low-contrast, and visually dated; 16:10 crop loses the vehicle and controls. `CROP`, `LOW`, `STALE` | **P1** |
| KRAIL | Archive | `/images/portfolio/knowledge/hero.svg` | 1200×675 / 1.78 | 1 | Clear architecture diagram, crisp at all sizes, and relevant. It shares a near-identical diagram language with RAIL and TAMP, so project distinction rests heavily on labels. `STYLE`; otherwise `GOOD` | **P2** |
| SLM Optimization & Post-Training | Selected | `/images/portfolio/llm-research/image.png` | 2318×1632 / 1.42 | 1 | Relevant research summary, but combines long prose, prompt text, and metrics into a single dense frame; selected crop and bottom overlay hide evidence. `TEXT`, `CROP` | **P1** |
| Lykke | Featured | `/images/portfolio/lykke/hero.png` | 3008×1714 / 1.75 | 4 | Strong current product overview and enough distinct supporting screens. Small UI text is acceptable because the composition communicates without it. `GOOD`; verify current UI before launch | **P2** |
| The Campus Chronicle Website | Archive | `/images/portfolio/newspaper/front_page.png` | 1319×897 / 1.47 | 4 | Clearly communicates a publication site; slightly dense in 16:10, but photography and layout remain recognizable. `CROP`; otherwise `GOOD` | **P2** |
| NOSTRADAMUS | Featured | `/images/portfolio/nostradamus/hero.png` | 1512×982 / 1.54 | 4 | Compelling 3D geospatial view with coherent supporting modes. Featured natural-ratio rendering works; detail hero letterboxes slightly. `GOOD` | **P2** |
| A* Path Finder Visualizer | Selected | `/images/portfolio/random_environment.png` | 1127×789 / 1.43 | 3 | The path is visible, but noisy random pixels dominate and selected/CV crops remove edge context. Visual is authentic but rough. `CROP`, `LOW`, `STALE` | **P1** |
| Crazy All-in One AI Assistant | Selected | `/images/portfolio/personal-assistant/hero.png` | 3024×1964 / 1.54 | 2 | Relevant dashboard, but very small UI and broad empty space make it look generic; selected overlay hides lower details. `TEXT`, `CROP` | **P1** |
| Economic Drivers of Puerto Rican Migration | Selected | `/images/portfolio/puerto-rico/image.png` | 1882×926 / 2.03 | 1 | Text-only title page does not show the interactive data experience; 5:4 crop cuts the title and credits. `ID`, `TEXT`, `CROP` | **P0** |
| FRC Robot Code | Archive | `/images/portfolio/2024.png` | 618×550 / 1.12 | 1 | Low-resolution lab photo shows hardware only partially and no code, match, mechanism, or team context. The CV separately uses a higher-resolution upscaled copy. `ID`, `LOW`, `CROP` | **P0** |
| RAIL | Archive | `/images/portfolio/rail/hero.svg` | 1200×675 / 1.78 | 1 | Clear architecture and crisp rendering, but nearly the same dark-box diagram treatment as KRAIL/TAMP weakens identity. `STYLE`; otherwise `GOOD` | **P2** |
| Rutgers Bus Analysis | Selected | `/images/portfolio/bus/bus-data.png` | 867×761 / 1.14 | 8 | Authentic map, but 5:4 crop, tiny route legend, and 867 px source reduce legibility on a large selected card. Better detail images exist. `TEXT`, `CROP`, `LOW` | **P0** |
| Scarlet Sync | Featured | `/images/portfolio/scarlet-sync/home.png` | 3024×1964 / 1.54 | 1 | Strong project identity, but it is the only project image and is repeated twice in the homepage gallery. A single dark homepage cannot substantiate scheduling, AI, and degree planning. `DUP`, `STALE` risk | **P0** |
| High School Programming Projects | Archive | `/images/portfolio/home.png` | 725×695 / 1.04 | 1 | Same generic terminal image as Calculus Generator; the page itself still says “todo: add descriptions.” It cannot serve as an umbrella-project cover. `ID`, `DUP`, `LOW`, `STALE` | **P0** |
| Trace-Supervised Dual-Arm TAMP | Archive | `/images/portfolio/tamp-research/hero.svg` | 1200×675 / 1.78 | 1 | Clear and relevant architecture, crisp at tile size, but visually too close to KRAIL/RAIL and lacks a robot/planning result. `STYLE` | **P2** |
| TopCoder Reimbursement Challenge | Selected | `/images/portfolio/top-coder/hero.png` | 1200×600 / 2.00 | 1 | GitHub repository header with zero visible challenge result, model behavior, rank, or reimbursement curve. The 5:4 crop is especially destructive. `ID`, `TEXT`, `CROP` | **P0** |

## Homepage image audit

### Portrait and timeline

- The portrait (`better-akash-enhanced.png`, 1392×1130) is high enough resolution for its 1:1 frame, but it is a 1.23:1 master cropped and scaled into a circle. Keep it only if the face remains sharp at mobile 288 px and desktop 400 px; the eventual replacement master should be square.
- The timeline mixes product UI, scientific plots, wide paper figures, logos, and a building photo. Relevance is generally good, but the visual language jumps between white UI, dark UI, raw plots, and three matching architecture diagrams.
- Scarlet Sync’s homepage gallery has two entries resolving to the exact same `/images/portfolio/scarlet-sync/home.png`; the second needs a distinct schedule, degree-audit, or AI-planning screen.
- The ARC-L images are extreme panoramas (1200×172–262). They are readable when contained but unsuitable for any covered card; prepare a composed 16:9 research overview if they are promoted elsewhere.
- HiC-TAD’s portrait cover is reused as the first Kwan Lab image, repeating its crop/readability weakness on another major surface.

### Visual journal

The active journal contains 22 photos: 19 landscape-coded source files and three portrait sources by stored dimensions. Fifteen sources carry EXIF orientation `6`; the generated WebP/AVIF variants are correctly auto-rotated, but the manifest records pre-rotation width/height. For example, `img_4350.png` is declared 5712×4284 while its generated 1280 px WebP is 1280×1707. This produces an incorrect reserved aspect ratio before decode.

Objective findings:

- The 40 literal image references in `home-yoshi-scene.tsx` total **353.6 MiB** of source assets. The responsive layer prevents those originals from being the normal browser choice, but the repository/source estate is needlessly heavy.
- `img_6293.png` and `beach1.png` are exact byte-identical duplicates and both appear in the current 22-photo journal under “Atlantic Reflection” and “Beach One.” Remove one from the eventual curated set.
- Fourteen additional files in `images/homepage/2026-05-24/` are exact duplicates of files retained under `2026-05-10/`; most duplicates are not referenced twice, but they make provenance and future selection error-prone.
- The journal has good personal authorship and stronger brand value than stock imagery, but 22 equal-weight location photos dilute the portfolio’s builder/research identity. Curate 8–12, led by images that connect to Rutgers, NVIDIA, research travel, or a specific story.
- Tonality ranges from bright daytime landmarks to near-black fog and neon scenes. A shared grade (black point, saturation ceiling, and caption contrast) would make the set feel intentional without erasing the personal-photography character.
- Caption legibility depends on a bottom gradient and text shadow. Bright pale images such as beaches and sky scenes should be checked at 320–390 px widths; no current homepage screenshot artifact covers the active masonry implementation.

## Writing hero audit

All nine writing covers are 1024×1024 JPEGs stored with `.png` filenames. The responsive pipeline handles them, but the format/extension mismatch is confusing, and square masters are poorly matched to both the 16:10 card crop and 16:9-ish detail hero crop.

| Article | Current hero | Assessment | Priority |
|---|---|---|---|
| Freshmen Year Reflection | `freshmen-reflection-hero.png` | Generic illustrated study desk/video call; polished but not demonstrably tied to the year. `STYLE`, `ID` | P2 |
| October Journal | `october-journal-hero.png` | Synthetic school corridor/robotics club scene; strong color but not specific evidence. `STYLE`, `ID` | P2 |
| December Journal | `december-journal-hero.png` | Generic robotics dashboard illustration; fine as editorial art, weak as personal archive. `STYLE` | P2 |
| Sophomore Year Reflection | `sophomore-reflection-hero.png` | Collage illustration with science/code motifs; broad and generic. `STYLE`, `ID` | P2 |
| Robotics Journal | `robotics-journal-hero.png` | Dramatic illustrated FRC robot; relevant but more cinematic than the site’s evidence-led project imagery. `STYLE` | P1 |
| Junior Year Reflection | `junior-reflection-hero.png` | Generic calculus holograms; it does not represent the many real artifacts in the article. `ID`, `STYLE` | P1 |
| First Post! | `first-post-hero.png` | Generic “future” driving illustration; least connected to its article. `ID`, `STYLE` | P1 |
| Doing Things! | `doing-things-hero.png` | Photorealistic electronics scene, but still generic and disconnected from the specific update. `ID` | P1 |
| Programming through the 2024 Robotics Season | `robotics-programming-hero.png` | Synthetic QR-marker warehouse rather than the real robot, code, or match; high-value article deserves authentic evidence. `ID`, `STYLE` | P1 |

Replacement direction: use real contemporaneous photos, code/result composites, notebook pages, match footage stills, or deliberately designed editorial collages built from owned artifacts. Establish a restrained writing template—one photo/artifact, one tint, no embedded headline—at 16:9, with an authored 16:10 crop.

## CV mosaic audit

The CV collage contains ten images in a four-column grid with 1:1, 2:1, and large-square slots, all rendered with `object-cover` and no visible captions.

- **Severe crop risk:** HiC-TAD’s 0.91 portrait plot in a square cell; Scarlet Sync’s 1.54 UI in a large square; Rutgers Road’s portrait-oriented displayed image in a 2:1 wide slot.
- **Moderate crop/text risk:** Lykke’s UI, the LLM research summary, and Economic Plotter all depend on small text or chart detail.
- **Best fits:** the upscaled FRC image in a large square, NVIDIA in a square, and DC in a square are subject-led and survive cropping.
- Six of ten images already appear prominently on the homepage or project feed. The collage therefore repeats the site instead of adding human/team/lab/process evidence.
- There are no captions, so viewers cannot distinguish a product, research output, travel photo, or role without already knowing the portfolio.

Replacement direction: rebuild the collage around ten subject-led derivatives—three products, three research/robotics results, two people/process photos, and two place/identity images. Give every cell an authored aspect-specific crop and a short caption or accessible adjacent legend.

## Responsive manifest and delivery findings

- `lib/generated-responsive-images.json` contains **143 assets** and the filesystem contains all **1,270 expected AVIF/WebP variants**.
- Coverage is complete for 75 of 83 local frontmatter/body references supported by the raster builder. The eight uncovered references are three SVG project heroes and five GIFs; these are intentionally outside the script’s raster regex rather than missing variants.
- `ResponsiveImage` falls back to raw `<img>` when an asset is absent from the manifest. SVGs are appropriate as raw vector assets; GIFs can be heavy and should be evaluated separately for poster frames or video conversion.
- The build script discovers both HTML and Markdown references, but `lib/content.ts` only extracts HTML `<img>` tags into `mediaImages`. Consequently, Markdown-only images can render in detail content and receive variants while remaining absent from featured collages and image-sitemap project lists.
- `getSourceDimensions()` records dimensions before `.rotate()` auto-orients generated variants. Fifteen homepage photos therefore receive incorrect `width`/`height` attributes. Record `metadata.autoOrient` dimensions or normalize sources before manifest generation.
- The 1280 px generated maximum is adequate for current CSS display sizes. Do not enlarge low-resolution sources just to reach the suggested master size; replace or re-compose them from original artifacts.

## Duplication and staleness ledger

1. **Twenty-one project detail pages repeat their hero immediately in the article body.** This includes all three featured projects and most modern projects. The detail template already renders the frontmatter cover; body content should begin with new evidence.
2. **`/images/portfolio/home.png` is shared by two distinct projects.** It is low-resolution and generic in both cases.
3. **Scarlet Sync homepage gallery repeats one image twice.** Its frontmatter also contains no supporting media beyond the repeated hero.
4. **`img_6293.png` and `beach1.png` are the same photo and both are active.** Fourteen more exact homepage duplicates exist under parallel date folders.
5. **KRAIL, RAIL, and TAMP use near-identical dark architecture-diagram compositions.** They are not literal duplicates, but they read as one templated family and require close reading to distinguish.
6. **Old project UI is mixed with 2026 product work without an archival treatment.** ESL, FBLA, racing, path finder, and school-project covers look stale next to Lykke and Scarlet Sync. A small “archive / year” visual frame would make this intentional if images are retained.
7. **Writing covers are a repeated synthetic style.** The set is consistent internally but detached from the site’s authentic photography and source-driven research identity.
8. **Screenshot artifacts conflict with current source.** `artifacts/screenshots-final/home-desktop.jpg`, `home-mobile.jpg`, and the root `home-visual-journal*.png` show older homepage structures, while current source uses a circular intro portrait, masonry journal grid, and scroll-driven timeline. Project artifacts also contain several generations (`screenshots`, `screenshots-progress`, `screenshots-final`, plus `projects-tiered-*`), though the tiered project captures match the current feed structure.
9. **Evidence gaps:** there are no current screenshot artifacts for project detail pages, writing index/detail, or the CV mosaic, and no trustworthy current homepage capture.

## Ranked shortlist: the 10 most important replacements

1. **AP Calculus Problem Generator cover** — replace shared `home.png` with a composed 16:9 frame showing one generated question, symbolic solution, and result; create a 16:10 archive crop. Highest identity/duplication failure.
2. **High School Programming Projects cover** — give the umbrella page a distinct montage of 3–4 actual projects, or remove the weak umbrella entry from visual prominence. Do not share the Calculus image.
3. **Scarlet Sync visual set** — capture a current 16:9 product hero plus three distinct screens (schedule generation, degree requirements, preference/AI flow). This is the rank-one featured project and currently has only one repeated screenshot.
4. **TopCoder challenge cover** — replace the GitHub header with a results composition: challenge inputs, predicted-vs-actual plot or error distribution, rank/top-performer evidence, and a small model/pipeline cue.
5. **HiC-TAD cover** — create a landscape 16:9 scientific overview combining the Hi-C triangle, TAD boundary annotation, and one structural-variant outcome. Preserve the portrait plot as a detail image, not the card hero.
6. **Rutgers Bus Analysis cover** — export a high-resolution map or dashboard detail with 2–3 routes and one clear finding; simplify or remove the tiny legend for the 5:4 selected crop.
7. **Puerto Rico Migration cover** — replace the title slide with the interactive story itself: map/chart plus a clear 1950→2024 visual change. Prepare an overlay-safe 5:4 crop.
8. **FRC Robot Code cover** — use a sharp match or pit photo showing the full 2024 robot, with a restrained inset of the control/vision/code result. Replace the 618×550 source rather than relying on the upscaled CV copy.
9. **Writing hero system, beginning with the 2024 robotics article** — replace synthetic art with owned photos and artifacts, standardized as 16:9 masters and 16:10 card crops. Roll the template through all nine posts.
10. **CV collage derivatives and composition** — replace the most destructive reused crops (HiC-TAD square, Scarlet Sync square, Rutgers Road 2:1) and add process/team/lab images so the collage contributes new evidence rather than repeating cards.

Near-following P1 work: Depth Estimation poster, FlaminGo title slide, FBLA Mobile title slide, LLM research summary, and the homepage visual-journal dedupe/orientation normalization.

## Replacement-pass QA checklist

### Asset preparation

- [ ] Every project has a unique canonical hero that visibly communicates the project without reading the title.
- [ ] Featured projects have at least four distinct images; selected projects have at least two.
- [ ] Canonical heroes are 16:9; selected 5:4, archive 16:10, writing 16:10, and CV 1:1/2:1 derivatives are authored crops, not blind center crops.
- [ ] No critical text is smaller than 18 px at the master size; screenshots remain understandable with text blurred or unreadable.
- [ ] UI captures contain no private data, personal tokens, emails, student records, or irrelevant browser chrome.
- [ ] Project screenshots represent the current product or are explicitly labeled with their date/version.
- [ ] Photo orientation is normalized into pixels before generation; no source depends on EXIF orientation alone.
- [ ] Hero masters are at least 1600 px wide (prefer 1920); card-only masters at least 1200–1600 px wide; no upscaling of weak sources.
- [ ] Raster formats match file extensions, color profiles are sRGB, and alpha/transparency is intentional.
- [ ] Repeated source files and abandoned derivatives are removed only after reference and Git-history checks.

### Content and component fit

- [ ] Test each project in all actual contexts: featured natural ratio/collage, selected 5:4 with bottom overlay, archive 16:10, detail 16:9 contain, homepage timeline if used, and CV crop if used.
- [ ] Confirm the detail body does not repeat the hero as its first image.
- [ ] Confirm Scarlet Sync and every other gallery contains distinct images.
- [ ] Verify all visual claims against project content; avoid decorative images that imply unsupported features or results.
- [ ] Write specific alt text for what the image proves, not just the project title or generated filename.
- [ ] Ensure charts use legible labels, colorblind-safe encoding, and a crop that does not remove axes, legend, or conclusion.
- [ ] Ensure writing heroes remain relevant and recognizable in both the shallow card crop and wide detail crop.
- [ ] Ensure CV cells have meaningful subject crops and, ideally, short visible captions or a nearby legend.

### Responsive and performance verification

- [ ] Rebuild the responsive manifest and confirm every referenced raster has expected AVIF/WebP variants.
- [ ] Compare manifest dimensions with actual generated-variant orientation; width/height must reserve the displayed aspect ratio.
- [ ] Verify `srcset` selection at 390, 768, 1440, and 1920 px viewports; avoid downloading source originals for ordinary display.
- [ ] Measure layout shift while homepage masonry images load, especially the 15 currently orientation-tagged photos.
- [ ] Check file weight targets: roughly ≤250 KB for card derivatives, ≤450 KB for desktop heroes, and ≤600 KB for full-width scientific detail images unless evidence justifies more.
- [ ] Convert long/heavy GIFs to MP4/WebM with a poster where motion is important; retain GIF only when demonstrably smaller and accessible.
- [ ] Verify lightbox images are sharp at the largest supported viewport without shipping 4000–5700 px originals.

### Visual/regression QA

- [ ] Capture fresh full-page screenshots for homepage, project feed, one featured detail, one selected detail, one archive detail, writing index/detail, and CV at desktop and mobile; add tablet for the project feed/CV grid.
- [ ] Compare dark and light themes where supported.
- [ ] Check embedded text and caption contrast at 200% browser zoom and a 320 px viewport.
- [ ] Test keyboard focus and lightbox close behavior; decorative overlays must not obscure focus indicators.
- [ ] Review all crops as a contact sheet to catch repeated compositions, color outliers, and overuse of white dashboard screenshots.
- [ ] Archive or clearly date obsolete screenshot directories so future audits do not treat stale layouts as current evidence.

## Verification record

The audit was checked against:

- all 28 `_portfolio/*.md` frontmatter records and parsed HTML body images;
- all nine `_posts/*.md` frontmatter heroes and body image references;
- `lib/content.ts`, `components/project-feed-search.tsx`, `app/projects/[slug]/page.tsx`, `components/markdown.tsx`, `components/post-card.tsx`, `app/writing/[slug]/page.tsx`, `app/cv/page.tsx`, `components/home-yoshi-scene.tsx`, `components/responsive-image.tsx`, `lib/responsive-images.ts`, `scripts/build-responsive-images.mjs`, and the corresponding CSS render rules in `app/globals.css`;
- source metadata collected with Sharp, exact hashes collected with SHA-256, and contact-sheet inspection of all 28 project covers, all nine writing heroes, and all 22 active visual-journal photos;
- all files under `artifacts/screenshots`, `artifacts/screenshots-progress`, and `artifacts/screenshots-final` plus the three root visual-journal artifacts;
- responsive-manifest integrity: 143 manifest assets, 1,270 expected variants, 1,270 present.

Limitations: this was a source- and artifact-based read-only audit. Existing captures do not cover the current homepage, project details, writing, or CV, so no claim is made that every crop defect was observed in a live browser. Crop risks are high-confidence inferences from the exact CSS aspect ratios and source dimensions; all major risks should be confirmed with fresh responsive captures during implementation.
