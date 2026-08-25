# Portfolio image replacement backlog

Consolidated 2026-08-06 from six read-only audits. This is a selection backlog, not an implementation record: no website images or source code have been replaced yet.

## Audit reports

- [Scarlet Sync](./scarlet-sync.md)
- [Robotics, FRC, TAMP, and ARC-L](./robotics.md)
- [AI products](./ai-products.md)
- [Data and research](./data-research.md)
- [Apps and legacy projects](./apps-legacy.md)
- [Portfolio-wide consistency](./portfolio-consistency.md)

## Recommended immediate swaps

These candidates already exist locally and are suitable for a first implementation pass, subject to the notes below.

| Priority | Project/surface | Replace with | Source |
| ---: | --- | --- | --- |
| 1 | FRC Robot Code card | Command architecture paired with robot CAD | `images/posts/frc24/images/image2.png` |
| 2 | 2023 robotics article hero | Real AprilTag/vision camera view | `images/posts/robotics/image8.png` |
| 3 | 2024 robotics article hero | Programming-meets-hardware crop | `images/posts/frc24/images/image3.jpg` |
| 4 | A* Path Finder card | Authored hand-drawn environment and solved path | `images/portfolio/drawn_environment.png` |
| 5 | Racing game card | Grand Prix gameplay frame | `images/portfolio/racing/grand.png` |
| 6 | FBLA website card | Search/filter/results workflow | `images/portfolio/fbla/search.png` |
| 7 | Campus Chronicle card | Science section layout | `images/portfolio/newspaper/science_page.png` |
| 8 | Depth-estimation card | Stereo disparity map | `images/portfolio/stereo/stereo_disparity_map.png` |
| 9 | Rutgers bus card | Nine-route load analysis grid | `images/portfolio/bus/image-1.png` |
| 10 | Clean Your Data hero/card | Visualization result | `/Users/akashdubey/Documents/CodingProjects/clean-your-data/docs/screenshots/graph.png` |
| 11 | Lykke hero | Fixture-backed wiki reading surface | `/Users/akashdubey/Documents/CodingProjects/lykke/out/screenshots/wiki-quality-v2-reading-surface.png` |
| 12 | Lykke card | Fixture-backed Visual Lab surface | `/Users/akashdubey/Documents/CodingProjects/lykke/out/screenshots/visual-lab-three-surface.png` |
| 13 | RAIL hero | Fixture-backed command center | `/Users/akashdubey/Documents/CodingProjects/RAIL/out/screenshots/krail-command-center-desktop.png` |
| 14 | ARC-L homepage gallery | Real dual-arm video still and setup figure | `/Users/akashdubey/Documents/dual-arm/assets/ICRA_dual_arm_video_submission_hd.mp4` and `setup.png` |
| 15 | ASA challenge card | Export presentation page 4 at 1600x900 or larger | `images/portfolio/asa-data/presentation.pdf` |

Keep the current NOSTRADAMUS hero, KRAIL architecture hero, Scarlet Sync logo, and TAMP architecture SVG. They remain useful, even where their galleries should expand.

## Clean recaptures required

1. **Scarlet Sync:** recapture the synthetic scheduling flow at 1920x1080 after renaming the schedule to `Demo Schedule` and removing the error toast. Capture distinct schedule, preference, ranked-option, degree-planning, and assistant states.
2. **Personal Assistant:** replace both current screenshots. They expose a personal Gmail address. Use a fixture identity and capture welcome, agent catalog, memory, and clean tool-run states.
3. **FlaminGo:** capture authentic posture-analysis, balance-test, and exercise screens. The current title slide does not show the product.
4. **High School Programming Projects:** create a distinct 3–4-project montage or remove the umbrella entry from visual prominence. It currently shares the Calculus image.
5. **AP Calculus Generator:** capture a generated question, symbolic solution, and answer rather than the shared terminal setup screen.
6. **TopCoder challenge:** create a result-led composition with predicted-vs-actual/error evidence and top-performer context instead of the GitHub header.
7. **LLM research:** export a clean benchmark summary and training/evaluation curve with private W&B, SLURM, filesystem, and account details removed.
8. **Economic grapher and DRP:** capture the actual analytical or mathematical result rather than UI chrome or a title slide.
9. **Grokipedia API:** capture package-specific Python/TypeScript/CLI evidence; the current image mainly shows the Grokipedia brand.

## Clearance-gated candidates

- Do not publish the current Scarlet Sync 4K demo or extract a poster from it; it exposes friends' names and avatars.
- Do not reuse the existing Personal Assistant screenshots or older Lykke course/workspace screenshots.
- Obtain collaborator/PI clearance before publishing new HiC deletion/synthesis figures. Remove collaborator shorthand from labels where practical.
- Do not publish private pRRTCDuo results or untracked dual-arm outputs without explicit approval. Public ARC-L assets are acceptable when credited and contextualized accurately.
- Treat LeRobot media as attributed upstream context, never as original project evidence.
- Preserve Census/IPUMS, map, dataset, and collaborator attribution where required.

## Visual-system work to do with the swaps

1. Author separate derivatives rather than forcing one cover through every crop: 16:9 hero, 5:4 selected card, 16:10 archive/writing card, and 1:1 or 2:1 CV crops.
2. Remove the duplicated opening body image from the 21 project pages that immediately repeat the detail hero.
3. Give featured projects at least four distinct images and selected projects at least two.
4. Remove one of the active duplicate beach photos and consolidate the additional duplicate homepage sources.
5. Normalize EXIF orientation before responsive generation and fix the 15 manifest entries whose intrinsic dimensions describe the pre-rotation orientation.
6. Regenerate responsive AVIF/WebP assets and validate project cards, detail heroes, homepage galleries, CV crops, Open Graph images, reduced-motion behavior, and mobile layouts.

## Suggested implementation order

1. Apply the safe existing swaps in the table and regenerate responsive assets.
2. Perform the Scarlet Sync fixture recapture because it is the highest-visibility featured project.
3. Replace privacy-risk Lykke and Personal Assistant imagery.
4. Capture result-led art for the remaining P0/P1 projects.
5. Fix crop derivatives, duplication, and responsive orientation metadata.
6. Run the responsive screenshot QA matrix in `portfolio-consistency.md` before publishing.
