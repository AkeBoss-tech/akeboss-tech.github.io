# Data Science and Research Portfolio Image Audit

Audit date: 2026-08-06  
Scope: `hic-tad-analysis`, `llm-research`, `depth-estimation`, `economic-grapher`, `rutgers-bus-analysis`, `asa-fall-data`, `drp-spring-2025`, `puerto-rico-migration`, `nostradamus`, and `top-coder-challenge`.

## Executive recommendations

1. **HiC-TAD:** use the ranked deletion summary as the card/hero if collaborator naming and unpublished-result clearance are confirmed; otherwise keep the current combined-boundary hero. Add the polymer/contact panel and cell-type comparison as detail images.
2. **NOSTRADAMUS:** keep the current 3D hero. Its four existing portfolio screenshots already form the strongest complete visual story in this group.
3. **Puerto Rico migration:** replace the title-slide card with the median-income comparison or total-population trend; retain the title slide only as an opening detail frame.
4. **Rutgers bus analysis:** use the animated bus map on detail pages, but use the nine-route load grid as the static card/OG image. The present map screenshot is attractive but includes browser controls and small legend text.
5. **Depth estimation:** replace the poster at card size with the disparity map; keep the poster as a detail/opening artifact.
6. **ASA Fall Data Challenge:** export slide 4 or slide 6 from the existing PDF for the card. The current cover is a title slide and communicates little analytical work.
7. **LLM research, economic grapher, DRP, and TopCoder:** existing assets are too sparse or generic for a strong visual case study. Capture or generate the result-focused visuals in the checklist below before changing their cards.

## How images are currently used

- The frontmatter `image` is reused for project-index cards/tiles, the project detail hero, structured-data image metadata, and the project Open Graph renderer.
- Detail heroes use `object-contain` in a 16:9 frame. Portrait or dense poster assets therefore receive large empty margins or become too small.
- Featured case studies build their collage from unique HTML `<img src="...">` tags in Markdown. Markdown image syntax (`![...](...)`) is **not** included by `extractImages()`. This currently hides the secondary depth-estimation figures from index collages.
- In this audit, only `nostradamus` is a Featured Case Study. `hic-tad-analysis`, `llm-research`, `top-coder-challenge`, `puerto-rico-migration`, and `rutgers-bus-analysis` are Selected Work cards. The other scoped projects are archive tiles.

## Public-safety screen

- Recommended files are rendered images or presentation pages, not raw data. No credentials, API keys, private URLs, or row-level records were observed in the recommended visuals.
- HiC-TAD figures include named collaborator shorthand (for example, “Edward” and “Jingyun”) and potentially unpublished experimental/model results. Obtain collaborator/PI clearance and replace personal shorthand with locus names before public use when possible.
- Puerto Rico visuals are aggregates derived from Census/ACS/IPUMS-style sources. Confirm source notes, weighting, universe definitions, and IPUMS attribution before publication; never publish the underlying person-level microdata.
- Rutgers bus visuals are aggregated transit observations and public-location traces. Do not add vehicle/operator identifiers or exact raw logs.
- NOSTRADAMUS maps use third-party basemaps and government datasets. Preserve required map/data attribution in any crop; avoid publishing API tokens, live military identifiers, or current sensitive infrastructure details.
- ASA slides name student contributors and a school. The chart-led slides below avoid faces, but contributor-name publication should still match team consent.
- The NJDEP climate-risk folders were deliberately not used: they do not map cleanly to a scoped portfolio slug, contain agency/partner branding and project documents, and may be sponsored or pre-publication work. Treat them as clearance-required, not as a general-purpose source library.

## Project audits

### 1. `hic-tad-analysis`

**Current inventory/usage.** Frontmatter/card/detail hero: `/images/portfolio/hic-tad/hero.png` (1612x1768 PNG). The page also uses `tad-triangles.png`, `multiscale-insulation.png`, `polymer-3d.png`, `deletion-celltype.png`, and `deletion-scan.png`; all six are eligible for the Selected Work media inventory, though the card itself still shows only the portrait hero.

| Rank | Candidate | Dimensions/type | Legibility and safety | Recommended placement and crop |
|---|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/HiC-TAD-Library/media/deletion_scan_edward_chr12_10kb_ranked_summary.png` | 2679x1167 PNG | Excellent at explaining the central result; title/axes remain readable. Contains “Edward” shorthand and a possibly unpublished ranking: clearance required. | **Hero/card** after relabeling to locus/insulator. For 16:9, trim only outer white margins; retain both the triangle and full ranking panel. |
| 2 | `/Users/akashdubey/Documents/CodingProjects/HiC-TAD-Library/media/mouse_deletion_chr12_27333532_27336455_celltype_comparison.png` | 3567x2362 PNG | Strong six-panel experimental comparison; too dense for a small card but excellent at full detail width. Same clearance caveat. | **Detail.** Use uncropped or a shallow 3:2 crop; do not remove row/column labels or diverging-color legend. |
| 3 | `/Users/akashdubey/Documents/CodingProjects/HiC-TAD-Library/media/Mir9-2_Chr13_polymer_3d_panel.png` | 1981x1011 PNG | Visually distinctive 3D/result pairing and readable at medium size. Public genomic coordinates only. | **Card alternative/detail.** Near-2:1 already; crop a small amount from both sides for 16:9 while preserving both colorbars. |
| 4 | `/Users/akashdubey/Documents/CodingProjects/HiC-TAD-Library/media/full_tad_triangles_combined.png` | 2634x2312 PNG | Publication-quality, but stacked portrait layout becomes small in a 16:9 card. Matches an asset already public on the portfolio. | **Detail.** Keep full frame; for a card, crop to one triangle only and add a short title outside the image. |
| 5 | `/Users/akashdubey/Documents/CodingProjects/HiC-TAD-Library/media/Sox11_Chr12_multiscale_insulation.png` | 1446x730 PNG | Clean, high-contrast scientific heatmap; labels need full-width display. | **Detail/card secondary.** Crop outer whitespace only; never crop window-size labels or genomic axis. |
| 6 | `/Users/akashdubey/Documents/CodingProjects/HiC-TAD-Library/media/synthesis_exp2_contact_panels.png` | 2259x1239 PNG | Very compelling contact/delta comparison. Likely newer research than the current public page: highest clearance risk in this list. | **Detail only after explicit research clearance.** Preserve all seven panels and both legends; no tight card crop. |

**Decision:** the current 1612x1768 combined-boundary hero is scientifically sound but a poor 16:9 card. Promote rank 1 if cleared, otherwise use rank 3 for the card and keep the current hero in the article.

### 2. `llm-research`

**Current inventory/usage.** The only portfolio visual is `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/llm-research/image.png` (2318x1632 PNG), used as card and detail hero. It is a tall webpage screenshot: the visible “4.1%” result is below a large navigation/intro area and becomes illegible on cards. The source repo contains `/Users/akashdubey/Documents/CodingProjects/llm-research/dev/nanochat.png` (1180x272 PNG) and `/Users/akashdubey/Documents/CodingProjects/llm-research/nanochat/logo.svg` (SVG), but these are upstream NanoChat branding rather than project results and are not recommended as portfolio evidence.

| Rank | Candidate | Dimensions/type | Legibility and safety | Recommended placement and crop |
|---|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/llm-research/image.png` | 2318x1632 PNG | Safe-looking public project screenshot, but too much navigation and prose; result cards are clipped near the bottom. | **Detail only.** Crop from just above “Current Results” through the metric cards, excluding browser/nav chrome; do not use the current full screenshot as the card. |

**Fresh capture/generation checklist.** Capture a 16:9 benchmark summary with base vs post-trained GSM8K accuracy, parameter count, tokens/second, and training steps; export a loss/eval-accuracy curve from local logs; capture an Amarel/SLURM pipeline diagram with usernames, job IDs, filesystem paths, hostnames, and allocation/account names removed; include model/checkpoint provenance and evaluation sample size; verify no W&B private-project URL or token appears.

### 3. `depth-estimation`

**Current inventory/usage.** Card/detail hero: `poster.png` (2500x1666 PNG). `results.png`, `boxplot.png`, `right_image.jpg`, and `stereo_disparity_map.png` appear in Markdown but are not included in `mediaImages` because they use Markdown image syntax.

| Rank | Candidate | Dimensions/type | Legibility and safety | Recommended placement and crop |
|---|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/stereo/stereo_disparity_map.png` | 1920x1080 PNG | Bold, immediately recognizable computer-vision output; no people or readable private details observed. | **Hero/card.** Exact 16:9; use as-is. Add an external caption/legend explaining near/far colors because none is embedded. |
| 2 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/stereo/poster.png` | 2500x1666 PNG | Complete research artifact but far too text-dense for a card. Contains author/school names already visible on the public page. | **Detail/opening artifact.** Keep full 3:2 frame; do not crop away methods/results/reference columns. |
| 3 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/stereo/results.png` | 999x543 PNG | The main quantitative comparison is readable at detail width; title is long and legend small. | **Detail/card alternative.** Crop only outer whitespace; for card use, enlarge legend/axis text in a fresh export rather than raster-upscaling. |
| 4 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/stereo/right_image.jpg` | 1920x1080 JPEG | Useful input context but visually ordinary. EXIF reports GPS metadata presence; strip all EXIF/GPS before republishing a derivative. | **Detail only.** Use paired beside the disparity map; preserve matching 16:9 framing. |
| 5 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/stereo/boxplot.png` | 558x451 PNG | Understandable but low resolution and not visually strong enough for a hero. | **Detail only.** Re-export at 2x/3x with larger labels; do not upscale this raster. |

### 4. `economic-grapher`

**Current inventory/usage.** The sole asset is `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/vis/economic-plotter.png` (1168x837 PNG), used for card and detail hero. It shows a useful Phillips Curve and series controls, but is vertically cropped, includes tiny labels, and retains a Streamlit share badge at bottom right.

| Rank | Candidate | Dimensions/type | Legibility and safety | Recommended placement and crop |
|---|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/vis/economic-plotter.png` | 1168x837 PNG | Public FRED series IDs and aggregate data are safe; UI/chart text is too small at card size. | **Detail only.** Crop to the chart plus the two series inputs; remove the partial top edge and share badge. Preserve the FRED source line. |

**Fresh capture/generation checklist.** Run the app at a 1440x900 viewport; capture one clean 16:9 frame containing both selected series and the full plot; turn off browser/Streamlit chrome; use a visually clear recession-aware time-series or dual-axis example in addition to the Phillips Curve; keep series IDs, units, date range, source, and transformation visible; do not expose API keys or local exception traces.

### 5. `rutgers-bus-analysis`

**Current inventory/usage.** Card/detail hero: `bus-data.png` (867x761 PNG). The HTML article also includes route-load, LX-load, loop-time, capacity, weekly-operations, speed, and animated-map assets, making this the richest already-public data project after HiC-TAD.

| Rank | Candidate | Dimensions/type | Legibility and safety | Recommended placement and crop |
|---|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/bus/image-1.png` | 1489x989 PNG | Nine small multiples clearly show daily route patterns; axes remain readable at medium width. Aggregated public-transit data. | **Static hero/card.** Crop a little outer whitespace to 3:2; for 16:9 retain all nine panels and trim only top/bottom margins. |
| 2 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/bus/buses.gif` | 640x480 GIF | Most compelling demonstration of the collection pipeline; low resolution but motion adds value. No vehicle IDs visible. | **Detail hero/inline demo, not OG.** Keep 4:3; do not crop map attribution or legend. Provide a static poster frame and reduced-motion fallback. |
| 3 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/bus/image-8.png` | 841x678 PNG | Strong comparative distribution; route labels and outliers are clear. | **Detail.** Keep full frame; trim outer whitespace only. |
| 4 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/bus/image-7.png` | 996x547 PNG | Good route-speed temporal pattern and near-16:9 shape. | **Card alternative/detail.** Use as-is or crop only a few pixels of outer border; retain title and both axes. |
| 5 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/bus/image-4.png` | 579x507 PNG | Useful operations context but modest resolution. | **Detail only.** Re-export before large use; no raster upscaling. |
| 6 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/bus/bus-data.png` | 867x761 PNG | Attractive map with controls, but route legend and timestamp are small and it looks like an unfinished widget screenshot. | **Replace as current card; retain as detail context.** Crop neither attribution nor legend; a fresh high-DPI capture is preferable. |

### 6. `asa-fall-data`

**Current inventory/usage.** Card/detail hero: `Capture.PNG` (903x507 PNG), a title-slide raster. The article embeds the 10-page `presentation.pdf` (720x405 pt per page, 16:9) but the PDF pages are not image candidates in the current project-feed parser.

| Rank | Candidate | Dimensions/type | Legibility and safety | Recommended placement and crop |
|---|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/asa-data/presentation.pdf`, page 4 (“Languages vs Salary”) | PDF page, 720x405 pt | Strong scatterplot plus concise findings; individual labels are readable in a full-width export. Aggregate Stack Overflow survey data. | **Hero/card after exporting page 4 to PNG/WebP at >=1600x900.** Use full slide; do not crop the analytical callouts. |
| 2 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/asa-data/presentation.pdf`, page 6 (“Industry Use of Languages”) | PDF page, 720x405 pt | Best decision-oriented frame; chart and recommendation appear together. Dense at small sizes. | **Detail/hero alternative.** Export full slide at high resolution; for a card, crop to chart plus recommendation arrow while retaining title. |
| 3 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/asa-data/presentation.pdf`, page 7 (“Third Language Selection”) | PDF page, 720x405 pt | Large scatterplot, simpler composition, and clear recommendation. | **Detail/card alternative.** Full-slide 16:9 export; retain the Bash/Shell annotation and right-hand rationale. |
| 4 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/asa-data/Capture.PNG` | 903x507 PNG | Clean title frame but no evidence of analysis; names five contributors and the school. | **Detail opener only.** Exact 16:9-ish frame; use as-is after confirming contributor-name consent. |

**Avoid as primary visuals:** slide 3 duplicates the same pie chart, slide 8 is text-heavy, and the externally hosted group photo should not be pulled into the portfolio without explicit consent/licensing.

### 7. `drp-spring-2025`

**Current inventory/usage.** The only located asset is `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/drp.png` (2444x1370 PNG), used for card and detail hero. It is a polished title slide but contains no mathematical result or diagram.

| Rank | Candidate | Dimensions/type | Legibility and safety | Recommended placement and crop |
|---|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/drp.png` | 2444x1370 PNG | Clean and highly legible; names the author, mentor, program, and term. Confirm mentor-name publication is intended. | **Card/hero until a result slide exists.** Nearly 16:9; crop only the few excess pixels, keeping all attribution text. |

**Fresh capture/generation checklist.** Locate/export the original deck; select one slide that visually derives the q-binomial identity and one combinatorial/Young-diagram or coefficient-table example; render at >=1600x900 with large notation; verify all formulas against the Markdown; include mentor/program credit only where approved; avoid scanned copyrighted textbook pages.

### 8. `puerto-rico-migration`

**Current inventory/usage.** Card/detail hero: `image.png` (1882x926 PNG), a strong title slide but not an analytical visual. Six high-resolution charts exist in the local source repo; the clearest are ranked below.

| Rank | Candidate | Dimensions/type | Legibility and safety | Recommended placement and crop |
|---|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/vibes/puerto-rico-migration/graphs/3_median_income_comparison.png` | 3687x1996 PNG | Best analytical story: two groups, long trend, clear income gap. Confirm whether dollars are nominal/real and correct the legend styling before publication. Aggregate data only. | **Hero/card.** Crop only outer whitespace to 16:9; retain title, both axes, and legend. |
| 2 | `/Users/akashdubey/Documents/CodingProjects/vibes/puerto-rico-migration/graphs/1_total_population_trend.png` | 3743x1996 PNG | Very clean and readable, but the title “Total Sample Population” is ambiguous and could be mistaken for Puerto Rico’s population. | **Card alternative/detail after relabeling.** 1.88:1; slight side crop to 16:9, never crop the recent decline. |
| 3 | `/Users/akashdubey/Documents/CodingProjects/vibes/puerto-rico-migration/graphs/5_employment_status_stacked.png` | 4075x2303 PNG | Strong composition and direct labels, but year ticks overlap at small size. | **Detail after re-export.** Use every-other-year ticks or rotate labels; keep the legend and 100% scale. |
| 4 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/puerto-rico/image.png` | 1882x926 PNG | Elegant title frame and already public; communicates topic, not findings. | **Detail opener/OG fallback.** Near 2:1; crop left/right whitespace gently for 16:9 while retaining source line and author. |

**Do not promote as-is:** `2_pr_born_population.png` has overlapping bar labels/year ticks, `4_age_distribution.png` has severely crowded years, and `6_education_trends.png` contains an “Unknown” series at 100% in early years. Recode/validate and re-export before use.

### 9. `nostradamus`

**Current inventory/usage.** `hero.png` is both card and detail hero. Because the project is featured and all four images are HTML `<img>` assets, the project index currently shows the hero plus a three-image collage (`nightvision`, `data-layers`, `flood-zones`).

| Rank | Candidate | Dimensions/type | Legibility and safety | Recommended placement and crop |
|---|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/nostradamus/hero.png` | 1512x982 PNG | Most cinematic asset; 3D city, river, aircraft, controls, legend, and offline time state are all visible. | **Keep as hero/card.** For 16:9, trim mostly bottom UI and a little top sky; retain logo, city, river, and median-income legend. Blur aircraft identifiers if readable. |
| 2 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/nostradamus/data-layers.png` | 1512x982 PNG | Strong dashboard evidence with map, choropleth, industry metrics, and layer controls. Small text needs detail width. | **Detail/collage.** Keep full frame. If cropped, retain the left stats panel, choropleth, active layer, and required basemap attribution. |
| 3 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/nostradamus/nightvision.png` | 1512x982 PNG | Visually distinctive rendering mode and already used on the moodboard. | **Collage/detail.** Center crop around the 3D scene, preserving the active visual-mode indicator. |
| 4 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/nostradamus/flood-zones.png` | 1512x982 PNG | Best hazard/data-layer evidence; ensure the FEMA layer, legend, and source context remain visible. | **Detail/collage.** Avoid aggressive crop; never remove map/data attribution. |

**Decision:** no replacement is necessary. A future capture should prioritize a cleaner 16:9 hero with the same river/3D composition, fewer aircraft labels, explicit basemap attribution, and no live/current sensitive identifier.

### 10. `top-coder-challenge`

**Current inventory/usage.** The only located asset is `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/top-coder/hero.png` (1200x600 PNG). It is a GitHub repository card showing zero activity statistics and a personal event photo; it does not substantiate model quality or challenge performance.

| Rank | Candidate | Dimensions/type | Legibility and safety | Recommended placement and crop |
|---|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/public/images/portfolio/top-coder/hero.png` | 1200x600 PNG | Legible but weak evidence; personal photo publication appears intentional but should still be confirmed. | **Detail fallback only.** Crop to the repository title/tagline if retained; remove zero-stat row and do not make it the primary card. |

**Fresh capture/generation checklist.** Create a predicted-vs-actual reimbursement scatter with a 45-degree reference line; add residual distribution and absolute-error-by-trip-duration/receipt band; include a compact feature-importance or SHAP summary for the 16 engineered features; show exact/close-match counts and mean error only if they are backed by saved evaluation output; exclude hidden-test records, proprietary organizer data, interview emails, invitation details, and any leaderboard evidence not authorized for redistribution; export a clean 16:9 composite at >=1600x900.

## Capture/export checklist for implementation

- Prefer 16:9 assets at 1600x900 or larger for cards/heroes; retain original aspect ratio for scientific detail figures.
- Export charts from source at 2x rather than upscaling low-resolution PNGs. Increase axis/title/legend text until readable at roughly 600 CSS px width.
- Use cards for one idea and detail galleries for dense multi-panel evidence. Do not force posters, long dashboards, or six-panel figures into tiny crops.
- Preserve scientific legends, units, sample sizes, genomic coordinates, date ranges, and source/attribution lines.
- Strip EXIF/GPS metadata from photographs, especially `stereo/right_image.jpg`.
- Freeze dashboards into deterministic states: no usernames, API keys, local paths, browser chrome, debug panels, current military/aviation identifiers, or private W&B/cluster links.
- Validate analytical claims before visual polish: PR labels/universes/weights, nominal-vs-real dollars, TopCoder metric provenance, LLM checkpoint/eval sample, and HiC publication clearance.
- Produce a static fallback for every GIF/video and honor `prefers-reduced-motion`.
- After adding assets, update the responsive-image manifest and verify desktop/mobile card crops plus Open Graph output.

## Verification notes

- All recommended filesystem paths above were checked locally and existed at audit time.
- Raster dimensions/types were verified using `file`/`sips`; the ASA deck was verified with `pdfinfo` and all 10 pages were rendered and visually reviewed.
- Existing website usage was traced through `_portfolio/*.md`, `lib/content.ts`, `components/project-feed-search.tsx`, and `app/projects/[slug]/page.tsx`.
- Local Git remotes confirm public GitHub origins for the website, HiC-TAD, LLM research, NOSTRADAMUS, and Puerto Rico source repos; publication clearance is still required for newly generated or uncommitted research artifacts.
