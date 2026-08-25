# Robotics visual asset audit

Audit date: 2026-08-06  
Scope: read-only review of robotics-related portfolio pages, posts, homepage media, and the supplied local source projects.  
Site repository: `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io`

## Executive finding

The current site has plenty of authentic FRC evidence, but its most prominent robotics images are among its weakest: the FRC portfolio card is a low-resolution workshop snapshot, both robotics-post heroes are generic AI illustrations, the ARC-L homepage gallery is made of extremely shallow paper strips, and the TAMP page uses only a schematic. The fastest credible improvement is to reuse the best already-public real-robot and competition material, then capture a small, sanitized set of project-specific stills for the private TAMP and pRRTCDuo work.

Publication-safety boundary used in this audit:

- **Safe/public:** assets already committed to this public website; assets tracked by the public `arc-l/dual-arm` repository; upstream Hugging Face LeRobot README media with attribution.
- **Clearance required:** untracked `dual-arm` results and all material from the private `DuoZhangRobotics/pRRTC` remote, including tracked branch outputs. These were inspected only to judge whether a fresh public capture would be worthwhile; they are not recommended for direct publication.
- **Not portfolio-authentic:** upstream LeRobot promotional media. It may illustrate a clearly attributed LeRobot section, but it should never imply that the pictured robots, diagram, or footage were produced by Akash.
- No credentials, logs containing identity data, private dashboards, or secret-bearing screens are recommended.

Quality shorthand below: **A** = hero-ready; **B** = strong supporting visual; **C** = useful evidence but needs crop/context; **D** = weak, generic, illegible, or replace.

## Current visual inventory and usage

### Portfolio and homepage

| Current visual (absolute path) | Dimensions/type | Current usage | Content and assessment |
|---|---:|---|---|
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/tamp-research/hero.svg` | 1200×675 viewBox, SVG | `_portfolio/tamp-research.md` frontmatter card image and repeated inline hero | Custom trace-supervised TAMP loop diagram. **B for article, C for card:** accurate and legible, but it proves architecture rather than embodied robotics. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/2024.png` | 618×550 PNG | `_portfolio/robot-code.md` card image | Team 1257 robot beside a collapsed wooden practice structure. Authentic but soft, cluttered, and visually reads as failure/cleanup. **D hero/card.** |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/random_environment.png` | 1127×789 PNG | `_portfolio/path-finder.md` card and first inline figure; also `app/cv/page.tsx` | Finished A* grid with visited cells and path. Clear but plain. **B article, C card.** |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/environment_settings.png` | 850×383 PNG | `_portfolio/path-finder.md` setup figure | Terminal prompts for grid/environment configuration. **C article only:** useful procedural evidence, not visually distinctive. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/drawn_environment.png` | 1126×781 PNG | `_portfolio/path-finder.md` environment figure | User-drawn obstacle grid before/around search. **B article/gallery:** simple, clean, and more authored-looking than the random grid. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/homepage/arc-lab/dipn-manipulation.png` | 1200×262 PNG | `components/home-yoshi-scene.tsx`, ARC-L homepage gallery | DIPN robot-manipulation pipeline strip with real UR robot and blocks. **C:** relevant and public-facing, but too shallow for responsive cards and belongs to prior lab work rather than Akash's own output. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/homepage/arc-lab/tabletop-rearrangement.png` | 1200×172 PNG | `components/home-yoshi-scene.tsx`, ARC-L homepage gallery | Can-rearrangement task plus graph/path diagrams. **C/D:** severe letterbox aspect ratio; little robot presence. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/homepage/arc-lab/path-planning.png` | 1200×187 PNG | `components/home-yoshi-scene.tsx`, ARC-L homepage gallery | Multi-agent grid/path-planning diagrams. **C/D:** legible only when enlarged and not specific to current work. |

### Robotics-tagged post heroes

| Current visual (absolute path) | Dimensions/type | Current usage | Content and assessment |
|---|---:|---|---|
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/freshmen-reflection-hero.png` | 1024×1024 JPEG encoded with `.png` extension | `2021-6-20-freshmen.md` hero | Generic illustrated remote-learning/Arduino desk. **D:** not documentary and not specific to the robotics work. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/october-journal-hero.png` | 1024×1024 JPEG encoded with `.png` extension | `2022-10-8-oct-journal.md` hero | Generic illustrated school robotics hallway. **D:** bright but synthetic and nonspecific. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/december-journal-hero.png` | 1024×1024 JPEG encoded with `.png` extension | `2022-12-17-dec-journal.md` hero | Generic “Robotics OS” screen/beach split illustration. **D:** invented interface/text and weak topical connection. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics-journal-hero.png` | 1024×1024 JPEG encoded with `.png` extension | `2023-3-23-robotics-journal.md` hero | AI-style cone-handling robot with pseudo-CAD overlays. **D:** visually polished but not Team 1257's robot/game reality. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics-programming-hero.png` | 1024×1024 JPEG encoded with `.png` extension | `2024-4-3-robotics-chief.md` hero | AI-style warehouse/AprilTag navigation scene. **D:** generic, invented interface text, and unrelated robot geometry. |

### 2023 Charged Up robotics journal

All paths below are used inline by `_posts/2023-3-23-robotics-journal.md` unless marked unused.

| Current visual (absolute path) | Dimensions/type | Usage/content | Quality |
|---|---:|---|---|
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image13.png` | 1010×732 PNG | Initial robot CAD/design | **B:** strong engineering evidence; crop interface margin only. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image11.png` | 1280×784 PNG | Programming change/contribution graph | **C:** useful process evidence, text-heavy. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image6.png` | 1140×1092 PNG | Claw subsystem code | **C:** readable only in article, never a card. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image1.png` | 1915×940 PNG | Custom autonomous/path-planning dashboard | **B:** authored software artifact with good width; crop window chrome. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image8.png` | 1999×1500 PNG | PhotonVision/AprilTag camera view | **A/B:** strongest technical visual in the post; real scene plus overlays. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image12.png` | 716×441 PNG | Companion pose/vision view | **C:** supports image8 but too small for hero. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image9.png` | 827×681 PNG | First-competition troubleshooting/robot view | **C:** authentic but composition is secondary. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image5.gif` | 426×240 GIF, 199 frames | First match; moving robot with unstable wrist | **C:** valuable narrative evidence, low resolution. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image4.gif` | 426×240 GIF, 225 frames | Robot flips and rights itself | **B/C:** memorable action, low resolution and failure-oriented. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image3.png` | 1589×936 PNG | Cube-shooter testing/action | **A/B:** authentic robot action and good resolution; strong replacement hero if the key frame is clean. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image10.gif` | 426×240 GIF, 223 frames | 2× autonomous trajectory simulation | **B/C:** shows software-to-motion work but is low-res. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image2.png` | 299×481 PNG | Controller/button mapping | **D/C:** narrow and tiny; article reference only. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image7.png` | 1200×1000 PNG | **Unused orphan** in `images/posts/robotics` | Not currently rendered. Inspect/provenance-check before considering; no page context establishes meaning. |

### 2024 Crescendo programming/build post

All paths below are used inline by `_posts/2024-4-3-robotics-chief.md`.

| Current visual (absolute path) | Dimensions/type | Usage/content | Quality |
|---|---:|---|---|
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/black.png` | 1058×711 PNG | Simulated camera/vision view | **B/C:** technical and relevant, visually dark. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/sim.png` | 380×286 PNG | Robot CAD in AdvantageScope | **D/C:** useful proof but too small for reuse. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/shooter.png` | 681×526 PNG | Shooter code/PID screenshot | **C:** article evidence only. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/gittt.png` | 982×532 PNG | Git branch/network graph | **C:** process detail, not robotics visually. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/gittmerged.png` | 794×258 PNG | Merged branch/network graph | **D/C:** extremely shallow. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/controller_commands.png` | 648×297 PNG | Drive-controls utility code | **C:** article only. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/configure.png` | 428×561 PNG | Controller configuration code | **C:** article only. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/speaker_aim.png` | 639×262 PNG | Speaker-aim command composition | **C:** strong technical detail but too shallow. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comms.png` | 999×117 PNG | PathPlanner named commands | **D/C:** nearly illegible at card size. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/bot_prog.png` | 756×1008 PNG | Partially built 2024 robot on workbench | **A/B:** authentic, detailed robot hardware; portrait crop limits hero use. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/images/image3.jpg` | 1500×1999 JPEG | Hands configuring Blinkin LEDs on control hardware | **A/B:** strongest human/engineering action shot; protect hands and controller in crop. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/images/image2.png` | 1562×868 PNG | Command architecture paired with 2024 robot CAD states | **A/B:** authored software-to-hardware evidence with a strong landscape ratio. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/images/image4.png` | 1920×1080 PNG | Large autonomous-path set | **B:** crisp full-HD software/planning visual; slightly busy. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/images/image6.png` | 853×552 PNG | Dynamic pathfinding/code excerpt | **C:** technical article evidence. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/images/image5.png` | 1919×1022 PNG | AutoChooser/NoteChooser dashboard | **B:** crisp and project-specific; crop window chrome. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/images/image1.gif` | 480×300 GIF, 225 frames | Selected autonomous sequence in simulation | **B/C:** compelling motion-planning proof, modest resolution. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image1.png` | 1599×874 PNG | Opening-match robot stalled/uncontrolled | **C:** authentic narrative frame but failure-led and distant. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image2.gif` | 426×240 GIF, 216 frames | AdvantageScope/log behavior during gyro fault | **C:** diagnostically strong, visually compressed. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image3.jpg` | 1080×1080 JPEG | Gyro log stuck near zero | **B/C:** clear debugging evidence, not a hero. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image4.gif` | 426×240 GIF, 214 frames | Qualification 33 successful autonomous trajectory | **A/B:** best comeback/action narrative; source resolution is the weakness. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image5.jpg` | 799×533 JPEG | Team celebration with 2024 event winner banner | **B for story/gallery, D for robotics card:** authentic outcome, but the robot is absent. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image6.gif` | 426×240 GIF, 100 frames | Worn wheel versus replacement | **B/C:** memorable mechanical detail; extract still for article only. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image7.gif` | 426×240 GIF, 145 frames | Blue-banner celebration after event win | **B:** strong human outcome, low-res and not robot-centric. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image8.jpg` | 1999×1333 JPEG | Team/Engineering Inspiration group portrait | **A for story/gallery, C for robotics card:** excellent resolution and outcome, but robot absent. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image9.gif` | 426×240 GIF, 226 frames | Swerve module setpoint-versus-state log | **C:** strong diagnostic artifact, low-res. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image10.gif` | 426×240 GIF, 150 frames | Arm collision (“sledgehammer”) plus AdvantageScope/controller view | **C:** memorable failure/debugging sequence, not promotional. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/dcmp/image1.gif` | 240×426 GIF, 211 frames | Vertical driver-practice sequence | **C:** authentic action but very low-res and portrait. |
| `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/dcmp/image2.png` | 981×87 PNG | “Score only if note present” code | **D:** too shallow for meaningful visual reuse. |

## Ranked replacement candidates

### A. ARC-L homepage research gallery

These are safe because the source repository is public and the files are tracked. Confirm contribution/credit wording before implying personal authorship.

| Rank | Candidate (verified absolute path) | Dimensions/type | Content | Quality assessment | Crop guidance | Recommended role |
|---:|---|---:|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/dual-arm/assets/ICRA_dual_arm_video_submission_hd.mp4` | 1920×1080 H.264 MP4, 154.0 s | Public ARC-L video containing real dual-UR robot experiments, dependency graphs, simulated grasps, and side/front views | **A:** the strongest authentic robotics source audited. Use a still from a real-robot segment, not a title slide. | Export a 16:9 still around the real-robot experiment sequences; retain both arms, work mat, and manipulated blocks; avoid overlaid slide title when used as hero. | Homepage hero/gallery; short muted loop; article gallery |
| 2 | `/Users/akashdubey/Documents/dual-arm/assets/setup.png` | 1856×1515 PNG | Real dual-arm lab setup with camera/workspace/object annotations plus three manipulation frames | **A/B:** immediate hardware credibility and already public; annotation typography is dated. | For a card, crop the top half to both UR arms and workspace; for article use full image. Do not crop off either base. | Homepage gallery lead; article “setup” figure |
| 3 | `/Users/akashdubey/Documents/dual-arm/assets/system_overview.png` | 8000×4000 PNG | SDAR task/motion system diagram with simulation and real-robot panels | **A/B:** extremely high resolution and substantively rich; too dense for a small card. | Use full-width at 2:1 in an article; for card crop the SDAR-M half containing robot/real-world panels, preserving a caption that says it is a crop. | Article system diagram; secondary gallery |
| 4 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/homepage/arc-lab/dipn-manipulation.png` | 1200×262 PNG | Real UR arm plus learned interaction/grasp pipeline | **C:** the best of the three current strips, but still weak responsively. | Split into two purposeful crops—real setup and pipeline—rather than scaling the entire strip into a card. | Supporting gallery/article only |
| 5 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/homepage/arc-lab/tabletop-rearrangement.png` | 1200×172 PNG | Rearrangement task and dependency/path diagrams | **C/D:** relevant context, poor aspect ratio. | Crop the task photo and graph separately; never use the full strip as hero. | Supporting gallery only |

### B. Trace-supervised dual-arm TAMP portfolio page

The TAMP page explicitly says its infrastructure is private. Only the current custom diagram is immediately safe. The public ARC-L assets below are candidates only if the page accurately distinguishes prior/public lab context from this private TAMP system.

| Rank | Candidate (verified absolute path) | Dimensions/type | Content | Quality assessment | Crop guidance | Recommended role |
|---:|---|---:|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/tamp-research/hero.svg` | 1200×675 SVG | Trace-supervised loop: symbolic plan, schedule, motion verification, trace logger, learned guidance | **B:** accurate, safe, and legible; keep as the architecture figure even after adding robot imagery. | Full 16:9; do not crop nodes/arrows. | Article diagram; fallback card |
| 2 | `/Users/akashdubey/Documents/dual-arm/assets/setup.png` | 1856×1515 PNG | Public dual-arm hardware setup | **A/B if accurately contextualized; otherwise reject:** offers embodiment but may describe a different system. | Landscape crop around two arms and work area; retain a caption identifying the public ARC-L setup. | Context/gallery, not TAMP hero unless relationship is verified |
| 3 | `/Users/akashdubey/Documents/dual-arm/assets/system_overview.png` | 8000×4000 PNG | Public dependency-driven dual-arm planner overview | **B if contextualized; otherwise reject:** visually adjacent, not automatically evidence for the private project. | Preserve full figure for article; avoid a decontextualized robot-only crop. | Related-work/context figure |
| 4 | `/Users/akashdubey/Documents/dual-arm/assets/ICRA_dual_arm_video_submission_hd.mp4` | 1920×1080 MP4 | Public real-robot dual-arm experiment video | **A source, conditional usage:** use only with explicit prior-work/lab caption and credit. | Export clean real-robot frame; no claim that it is private TAMP execution. | Context gallery or linked video |

**Gap:** there is no publication-cleared, project-specific execution frame. Do not use any file under `/Users/akashdubey/Documents/dual-arm/remote-results` or `/Users/akashdubey/Documents/dual-arm/results` without first tracking/publishing or explicitly clearing it; these directories are currently untracked in the public repo.

### C. FRC 2024 robot code / Crescendo

| Rank | Candidate (verified absolute path) | Dimensions/type | Content | Quality assessment | Crop guidance | Recommended role |
|---:|---|---:|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/images/image2.png` | 1562×868 PNG | Command architecture paired with four 2024 robot CAD states | **A/B:** strongest landscape proof that connects authored control software to the actual mechanism. | Keep the command flows and all four CAD states; trim only outer whitespace for a 16:9 card. | Replace `_portfolio/robot-code.md` card; technical article/gallery |
| 2 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/images/image3.jpg` | 1500×1999 JPEG | Hands configuring LEDs on real robot control hardware | **A/B:** strongest “programming meets hardware” image and high resolution. | For landscape card, crop across hands, controller, and glowing strip; remove the blank laptop screen and partial faces while avoiding identifiable face fragments. | Robot-code article hero; gallery/action detail |
| 3 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/bot_prog.png` | 756×1008 PNG | Detailed workbench view of 2024 chassis/mechanisms | **A/B:** clear, authentic hardware portrait. | Use 4:5 portrait or crop a 1:1 around chassis; do not force 16:9 because it will cut mechanisms. | Card alternate; gallery |
| 4 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image4.gif` | 426×240 GIF, 214 frames | Robot successfully executes autonomous movement after code recovery | **A/B story, C resolution:** strongest comeback narrative and action proof. | Keep as motion in article; for card extract the cleanest mid-field frame and source the original match video if possible. | Article animation; story gallery |
| 5 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/images/image1.gif` | 480×300 GIF, 225 frames | Custom NoteChooser autonomous sequence running in sim | **B/C:** directly demonstrates authored planning software. | Keep field and chooser panels; crop OS/window chrome only. Prefer MP4/WebM re-encode from original. | Technical gallery/article |
| 6 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/images/image4.png` | 1920×1080 PNG | Full-HD autonomous route set | **B:** crisp planning proof, but busy at card size. | Crop to the field plus 2–3 representative routes; retain full image for article zoom. | Technical article/gallery |
| 7 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image8.jpg` | 1999×1333 JPEG | Team group portrait after Engineering Inspiration recognition | **A human outcome:** high-quality, authentic, and celebratory; not robot-centric. | 3:2 full group; avoid very tight crops that omit team context. | Story/gallery, not project card |
| 8 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/frc24/comp/image6.gif` | 426×240 GIF, 100 frames | Worn tread next to new wheel | **B/C:** excellent engineering-detail story, low-res. | Extract side-by-side comparison frame; label old/new in caption rather than burning text into image. | Article detail |

### D. FRC 2023 Charged Up journal

| Rank | Candidate (verified absolute path) | Dimensions/type | Content | Quality assessment | Crop guidance | Recommended role |
|---:|---|---:|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image8.png` | 1999×1500 PNG | Real field/camera view with AprilTag/vision overlays | **A/B:** immediately communicates robotics perception and is the best replacement for the synthetic post hero. | 4:3 or 16:9 around the annotated camera view; remove unused application chrome, keep tag boxes/axes. | Replace robotics-journal hero; technical gallery |
| 2 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image3.png` | 1589×936 PNG | Real robot cube-shooter action/test | **A/B:** authentic, dynamic, and landscape. | Crop 16:9 around robot and cube trajectory/action; keep enough environment to read the test. | Hero/card/gallery |
| 3 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image13.png` | 1010×732 PNG | Initial robot CAD | **B:** strong authored engineering artifact. | Trim CAD UI and blank margins, retain full robot and key mechanism geometry. | Article/gallery; card alternate |
| 4 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image1.png` | 1915×940 PNG | Custom autonomous/path-planning dashboard | **B:** crisp, project-specific software visual. | Landscape crop around field/path and primary controls; trim window borders. | Technical gallery/article |
| 5 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image10.gif` | 426×240 GIF, 223 frames | Autonomous trajectory simulation | **B/C:** useful motion proof, low resolution. | Preserve field and trajectory; locate original screen recording before prominent placement. | Inline animation |
| 6 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/posts/robotics/image4.gif` | 426×240 GIF, 225 frames | Robot flips and rights itself | **B/C:** memorable real action but failure-oriented and low-res. | Use only within the failure/recovery story; do not use as portfolio card. | Article narrative |

### E. A* path-finder visualizer

No source checkout was found under the supplied workspace; only the three already-published site captures were verifiable.

| Rank | Candidate (verified absolute path) | Dimensions/type | Content | Quality assessment | Crop guidance | Recommended role |
|---:|---|---:|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/drawn_environment.png` | 1126×781 PNG | Authored obstacle grid showing manual environment design | **B:** clean and project-specific; more intentional than the random-grid card. | Crop to grid, removing window frame; 4:3 works best. | Card/hero alternate; gallery |
| 2 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/random_environment.png` | 1127×789 PNG | Random environment with search/visited/path state | **B/C:** communicates result, but the color/state semantics need a caption. | Crop tightly to grid and keep start/goal/path colors; 4:3 or square. | Current card; article result |
| 3 | `/Users/akashdubey/Documents/CodingProjects/akeboss-tech.github.io/images/portfolio/environment_settings.png` | 850×383 PNG | Configuration prompts | **C:** useful workflow evidence but visually weak. | Keep all prompts readable; do not crop vertically. | Article only |

### F. pRRTCDuo / GPU motion planning

**No publication-eligible recommendation.** The verified remote `DuoZhangRobotics/pRRTC` is private. Several visually promising planner GIFs, benchmark plots, and local result videos exist, but the working tree includes modified and untracked experiments, and the local report itself says publication-quality repaired comparisons are still pending. Reusing those figures could disclose unpublished results or imply validated findings that are not final.

Safe next choices, ranked:

1. Capture a new, deliberately public synthetic scene from a released/public baseline configuration, with no private result numbers.
2. Produce a diagram explaining GPU-parallel collision checking and planning using only already-public paper claims and original redrawn geometry.
3. Ask the repository owner/lab for written approval of one specific render and one specific benchmark figure, then copy only the approved exports into the website repository with provenance recorded.

Do **not** publish directly from `/Users/akashdubey/Documents/CodingProjects/pRRTCDuo/pRRTC/results`, `/docs/figures`, or the untracked Baxter video set until clearance is explicit.

### G. LeRobot / VLA experimentation

These assets are tracked in the public Hugging Face LeRobot repository, but they are upstream promotional/documentation media rather than Akash's work. They are acceptable only with explicit upstream attribution and only if a page actually discusses LeRobot experimentation.

| Rank | Candidate (verified absolute path) | Dimensions/type | Content | Quality assessment | Crop guidance | Recommended role |
|---:|---|---:|---|---|---|---|
| 1 | `/Users/akashdubey/Documents/CodingProjects/LeRobot/lerobot/media/readme/so100_video.webp` | 640×334 animated WebP, 28 frames | Dual SO-100 tabletop robot-arm footage | **B visual, D authorship:** attractive robot motion but entirely upstream. | Keep both arms and full tabletop; do not remove attribution in caption. | Attributed article context only |
| 2 | `/Users/akashdubey/Documents/CodingProjects/LeRobot/lerobot/media/readme/VLA_architecture.jpg` | 8947×4565 JPEG | VLA architecture with vision/text/state/action streams | **A technical figure, D authorship:** very crisp but not original. | Full-width 2:1-ish crop; never crop out legend or architecture endpoints. | Attributed article figure |
| 3 | `/Users/akashdubey/Documents/CodingProjects/LeRobot/lerobot/media/readme/robots_control_video.webp` | 640×360 animated WebP, 130 frames | Upstream multi-robot control montage | **B/C visual, D authorship:** useful context; first frames are dark and resolution modest. | Select a bright representative interval; retain full 16:9 frame. | Attributed supporting gallery only |

Preferred alternative: capture Akash's own LeRobot run with the local control UI, a real or simulated robot in frame, and a short caption stating the exact change/experiment performed.

## Prioritized replacement plan

1. **Replace the FRC Robot Code card immediately.** Use `images/posts/frc24/images/image2.png` for a landscape software-to-hardware card or a landscape crop of `images/posts/frc24/images/image3.jpg` for a hands-on “programming meets hardware” alternative. Retire `images/portfolio/2024.png` from prominent use.
2. **Replace both synthetic robotics-post heroes.** Use `images/posts/robotics/image8.png` for the 2023 journal and a cleaned landscape crop of `images/posts/frc24/images/image3.jpg` (or higher-resolution match still derived from the original video) for the 2024 programming post.
3. **Upgrade the ARC-L homepage gallery.** Lead with a real-robot still exported from the tracked public `assets/ICRA_dual_arm_video_submission_hd.mp4`, follow with a crop of `assets/setup.png`, and keep only one prior-paper strip as historical context. Credit ARC-L and clarify Akash's contribution.
4. **Keep the TAMP SVG, but demote it from being the only visual.** Add one sanitized project-specific simulation frame and one schedule/trace visualization after publication review; until then, the SVG is the only unambiguous project-specific asset.
5. **Do not expose pRRTCDuo results yet.** Obtain clearance for exact exports or make new result-free explanatory visuals from public baselines.
6. **Recapture A*.** A 5–8 second high-resolution screen recording showing open-set expansion and the final path would outperform all current static captures; retain `drawn_environment.png` as the setup still.
7. **Use LeRobot upstream media only as attributed context.** Prefer an original local experiment capture before adding a dedicated portfolio item.

## Fresh-capture checklist

### TAMP / dual-arm planning

- Use a deliberately synthetic, non-proprietary tabletop scene with generic blocks/containers.
- Capture start, mid-plan, simultaneous dual-arm action, and success end-state at 1920×1080 or larger.
- Include one frame where planned trajectories are visible and spatially separated by arm color.
- Export one clean schedule/timeline view with action names generalized if necessary.
- Remove run IDs, usernames, hostnames, filesystem paths, experiment seeds tied to private reports, internal metrics, and private repository URLs.
- Confirm every model/mesh/texture license and that the result itself is approved for publication.
- Caption simulation honestly; do not imply real-robot execution.

### pRRTCDuo

- Obtain PI/repository-owner approval before showing any benchmark number, result plot, or private branch feature.
- Prefer a public-baseline scene with start, goal, obstacle geometry, and one path; omit unpublished performance claims.
- Record at 1080p with consistent camera pose, high-contrast start/goal markers, and a legend readable at mobile width.
- Re-run the approved release commit in a clean checkout; do not capture modified/untracked working-tree output.
- Record provenance: commit SHA, configuration, renderer script, approval date, and credit line.

### FRC

- Search original phone/video/cloud sources for the same Seneca action at native resolution; the embedded GIFs are only 426×240.
- Capture the whole robot at bumper height, one programming-team interaction, one mechanism close-up, and one clean field action.
- Prefer images where Team 1257 is clearly readable and the robot is not hidden by field structures.
- Avoid publishing driver-station IPs, Wi-Fi credentials, student name badges, private messages, or faces of bystanders without appropriate team/event norms.
- For screen captures, hide OS notifications and crop application chrome while retaining axes, legends, and units.

### A* and LeRobot

- A*: record deterministic expansion from a hand-drawn obstacle map through the final yellow path; 1920×1080, no terminal clutter, visible legend.
- LeRobot: capture only a run personally performed or modified, showing input/control, robot/simulation response, and the exact contribution in the caption.
- Replace animated GIF/WebP delivery with MP4/WebM where the site supports it; keep a poster still for cards and reduced-motion users.

## Verification notes

- Every recommended absolute path was checked for existence and opened or probed successfully.
- Dimensions/types were read with Pillow or `ffprobe`; the `.png` post heroes called out above are JPEG-encoded despite their filenames.
- All image references in `_portfolio/tamp-research.md`, `_portfolio/robot-code.md`, `_portfolio/path-finder.md`, `_posts/2023-3-23-robotics-journal.md`, and `_posts/2024-4-3-robotics-chief.md` were inventoried, plus the three ARC-L homepage images and robotics-tagged reflection/journal heroes.
- `images/posts/robotics/image7.png` is present but has no reference in the current site content.
- Source visibility was verified: `arc-l/dual-arm` is public; `DuoZhangRobotics/pRRTC` is private; Hugging Face LeRobot is the public upstream repository.
- This audit created only this Markdown report; no site content or asset files were modified.
