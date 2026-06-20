# Wiki Explainer Roadmap

This roadmap turns concepts already present across the site into Lykke-style educational HTML pages. Each page should teach the concept directly, include a visual or interactive artifact, and connect back to the relevant portfolio or writing source.

## Proposed Route

- Index: `/wiki`
- Topic pages: `/wiki/[slug]`
- Content registry: `lib/wiki-topics.ts`
- Interactive components: `components/wiki/`
- First build batch: 8-12 high-value pages, then expand in clusters.

## Production Workflow

1. Pick a batch of 5-10 topics from one domain.
2. For each topic, generate a source-grounded page outline using the `generate-wiki` skill.
3. Convert artifact markers into real React components: SVG diagrams, small simulations, quizzes, flashcards, timelines, maps, or charts.
4. Add each topic to the wiki registry with title, slug, source files, domain, related project, difficulty, and artifact type.
5. Run `npm run build` and visually check desktop/mobile layouts.
6. Ship in batches so each cluster has consistent quality.

## Parallel Thread Plan

- Thread A: AI systems, agents, RAG, research infrastructure, and APIs.
- Thread B: Robotics, path planning, control, vision, hardware, and games.
- Thread C: Data science, economics, transit, statistics, and visualization.
- Thread D: Math, education tools, scheduling, language learning, and health.
- Integration thread: registry, shared page layout, navigation, SEO, and final verification.

## 100 Topics

| # | Topic | Domain | Source anchor | Best explainer artifact |
|---:|---|---|---|---|
| 1 | Course Materials to Queryable Knowledge Base | AI education | `_portfolio/lykke.md` | Pipeline diagram |
| 2 | RAG Pipeline for Student Documents | AI education | `_portfolio/lykke.md`, `app/cv/page.tsx` | Interactive retrieval visualizer |
| 3 | Vector Search vs Keyword Search in Study Tools | AI education | `_portfolio/lykke.md` | Query comparison demo |
| 4 | Source-Grounded AI Wikis | AI education | `_portfolio/lykke.md` | Citation and versioning diagram |
| 5 | LangGraph Multi-Agent Study Backend | AI agents | `_portfolio/lykke.md` | Agent routing diagram |
| 6 | Canvas OAuth Ingestion Flow | AI education | `_portfolio/lykke.md`, `app/cv/page.tsx` | Step-through flow diagram |
| 7 | AI-Generated Infographics from Textbooks | AI education | `_portfolio/lykke.md` | Before/after generation demo |
| 8 | Local-First Agent Memory | AI infrastructure | `_portfolio/knowledge.md` | Repo memory architecture diagram |
| 9 | Evidence-Backed Think Envelopes | AI infrastructure | `_portfolio/knowledge.md` | Interactive evidence card |
| 10 | Markdown Frontmatter Knowledge Graphs | AI infrastructure | `_portfolio/knowledge.md` | Graph explorer |
| 11 | MCP Tools for Agent Workflows | AI infrastructure | `_portfolio/knowledge.md`, `_portfolio/rutgers-agentic-intelligence-labs.md`, `_portfolio/grokipedia-api.md` | Tool-call architecture diagram |
| 12 | Repo as System of Record for Research | Research infrastructure | `_portfolio/rutgers-agentic-intelligence-labs.md` | Versioned research lifecycle diagram |
| 13 | Ontology-Backed Research Workspaces | Research infrastructure | `_portfolio/rutgers-agentic-intelligence-labs.md` | Ontology explorer |
| 14 | Research Integrity Records | Research infrastructure | `_portfolio/rutgers-agentic-intelligence-labs.md`, `_portfolio/knowledge.md` | Audit-trail quiz |
| 15 | Small Language Model Post-Training | AI research | `_portfolio/llm-research.md` | Training-stage diagram |
| 16 | Model Size, Speed, and Accuracy Trade-Offs | AI research | `_portfolio/llm-research.md` | Trade-off slider chart |
| 17 | SLURM Training Jobs on HPC Clusters | AI infrastructure | `_portfolio/llm-research.md` | Cluster job scheduler diagram |
| 18 | Quantization and Pruning for Inference Throughput | AI optimization | `_portfolio/llm-research.md` | Model compression demo |
| 19 | Persistent Semantic Memory for AI Assistants | AI agents | `_portfolio/personal-assistant.md` | Memory retrieval demo |
| 20 | Specialist-Agent Orchestration | AI agents | `_portfolio/personal-assistant.md`, `_portfolio/clean-your-data.md` | Agent router diagram |
| 21 | Natural Language to Reproducible Pandas Code | Data agents | `_portfolio/clean-your-data.md` | Transformation preview demo |
| 22 | Sandboxed Code Execution for Data Agents | Data agents | `_portfolio/clean-your-data.md` | Safety boundary diagram |
| 23 | Async API Clients with Rate Limits and Backoff | API engineering | `_portfolio/grokipedia-api.md` | Retry/backoff simulator |
| 24 | Cross-Language SDK Feature Parity | API engineering | `_portfolio/grokipedia-api.md` | Python vs TypeScript comparison board |
| 25 | Data Exploration Agents for CSV Profiling | Data agents | `_portfolio/clean-your-data.md` | CSV profile dashboard |
| 26 | Visualization Agents for Matplotlib and Seaborn | Data agents | `_portfolio/clean-your-data.md` | Prompt-to-chart demo |
| 27 | Statistical Analysis Agents for Regression and Tests | Data agents | `_portfolio/clean-your-data.md` | Model report walkthrough |
| 28 | Proactive Suggestions from Uploaded Data | Data agents | `_portfolio/clean-your-data.md` | Suggestion-ranking demo |
| 29 | Regex Agents for Column Cleaning | Data agents | `_portfolio/clean-your-data.md` | Pattern preview demo |
| 30 | Data Merging Agents for Multi-CSV Workflows | Data agents | `_portfolio/clean-your-data.md` | Join strategy diagram |
| 31 | Hi-C Contact Maps and TAD Triangles | Computational biology | `_portfolio/hic-tad-analysis.md`, `app/cv/page.tsx` | Interactive heatmap |
| 32 | Multi-Scale TAD Boundary Detection | Computational biology | `_portfolio/hic-tad-analysis.md` | Window-size sweep visualizer |
| 33 | Insulation Score and Directionality Index | Computational biology | `_portfolio/hic-tad-analysis.md` | Track overlay diagram |
| 34 | From Contact Matrix to 3D Polymer Model | Computational biology | `_portfolio/hic-tad-analysis.md`, `app/cv/page.tsx` | 3D bead model visualizer |
| 35 | In-Silico CRISPR Deletion Analysis | Computational biology | `_portfolio/hic-tad-analysis.md` | Wild-type vs deletion comparison |
| 36 | Deletion Sensitivity Scans | Computational biology | `_portfolio/hic-tad-analysis.md` | Scan grid visualizer |
| 37 | Synthetic Enhancer Design Pipeline | Computational biology | `_portfolio/hic-tad-analysis.md` | Multi-stage pipeline diagram |
| 38 | A/B Compartments in Chromatin Architecture | Computational biology | `_portfolio/hic-tad-analysis.md` | Compartment track explainer |
| 39 | Chromatin Loops and Boundary Calls | Computational biology | `_portfolio/hic-tad-analysis.md` | Loop and boundary diagram |
| 40 | Variant Effect Prediction from Genomic Context | Computational biology | `_portfolio/hic-tad-analysis.md` | Variant impact cards |
| 41 | A* Search: Open Set, Closed Set, and f-score | Algorithms | `_portfolio/path-finder.md` | Interactive grid visualizer |
| 42 | Heuristics: Manhattan vs Euclidean Distance | Algorithms | `_portfolio/path-finder.md` | Heuristic comparison demo |
| 43 | Random Obstacle Density and Path Solvability | Algorithms | `_portfolio/path-finder.md` | Obstacle density slider |
| 44 | Why A* Beats Blind Search | Algorithms | `_portfolio/path-finder.md` | Search frontier animation |
| 45 | Drawing a Grid World for Path Planning | Algorithms | `_portfolio/path-finder.md` | Editable grid demo |
| 46 | Swerve Drive Basics for FRC Robots | Robotics | `_posts/2024-4-3-robotics-chief.md`, `_portfolio/robot-code.md` | Module vector diagram |
| 47 | Field-Relative vs Robot-Relative Driving | Robotics | `_posts/2024-4-3-robotics-chief.md` | Drivetrain coordinate demo |
| 48 | Gyro Failures and Swerve Instability | Robotics | `_posts/2024-4-3-robotics-chief.md` | Diagnostic timeline |
| 49 | AprilTag Vision for Robot Pose Estimation | Robotics vision | `_posts/2024-4-3-robotics-chief.md`, `_posts/2023-3-23-robotics-journal.md` | Pose estimate diagram |
| 50 | Multi-Camera Pose Estimation | Robotics vision | `_posts/2024-4-3-robotics-chief.md` | Camera fusion diagram |
| 51 | Averaging Vision Pose Estimates | Robotics vision | `_posts/2024-4-3-robotics-chief.md` | Estimate fusion visualizer |
| 52 | Camera Calibration for Robot Vision | Computer vision | `_posts/2024-4-3-robotics-chief.md`, `_portfolio/depth-estimation.md` | Calibration error demo |
| 53 | PathPlanner Autonomous Routes | Robotics | `_posts/2024-4-3-robotics-chief.md`, `_portfolio/robot-code.md` | Field path visualizer |
| 54 | On-the-Fly Trajectory Generation vs Pathfinding | Robotics | `_posts/2024-4-3-robotics-chief.md` | Side-by-side path demo |
| 55 | LocalADStar Pathfinding in FRC | Robotics | `_posts/2024-4-3-robotics-chief.md` | Dynamic obstacle path demo |
| 56 | Customizable Autonomous Mode Selection | Robotics | `_posts/2024-4-3-robotics-chief.md`, `_posts/2023-3-23-robotics-journal.md` | Dashboard chooser demo |
| 57 | SendableChooser and Dashboard-Driven Robot Behavior | Robotics | `_posts/2024-4-3-robotics-chief.md` | Control flow diagram |
| 58 | PID Control for Robot Mechanisms | Controls | `_posts/2024-4-3-robotics-chief.md`, `_posts/2023-3-23-robotics-journal.md` | PID tuning simulator |
| 59 | Velocity PID for Intake and Shooter Wheels | Controls | `_posts/2024-4-3-robotics-chief.md` | Setpoint response demo |
| 60 | Lookup Tables vs Equations for Shooter Tuning | Robotics | `_posts/2024-4-3-robotics-chief.md` | Lookup interpolation visualizer |
| 61 | Shooting While Moving: Predicting Future Robot Pose | Robotics | `_posts/2024-4-3-robotics-chief.md` | Motion prediction demo |
| 62 | Auto-Aiming with Vector Geometry | Robotics | `_posts/2024-4-3-robotics-chief.md` | Vector angle visualizer |
| 63 | Simulating Projectile Shots in Advantage Scope | Robotics | `_posts/2024-4-3-robotics-chief.md` | Projectile trajectory simulator |
| 64 | Break Beam Sensors for Game Piece Detection | Robotics hardware | `_posts/2024-4-3-robotics-chief.md` | Sensor-state diagram |
| 65 | Robot State Machines for LED Feedback | Robotics software | `_posts/2024-4-3-robotics-chief.md` | State machine demo |
| 66 | AdvantageKit Logging and Simulation Separation | Robotics software | `_portfolio/robot-code.md`, `_posts/2024-4-3-robotics-chief.md` | Logging architecture diagram |
| 67 | Reading Robot Logs to Debug Hardware Problems | Robotics software | `_posts/2024-4-3-robotics-chief.md` | Log diagnosis walkthrough |
| 68 | Stereo Vision and Disparity Maps | Computer vision | `_portfolio/depth-estimation.md` | Disparity slider demo |
| 69 | Semi-Global Block Matching | Computer vision | `_portfolio/depth-estimation.md` | Block matching animation |
| 70 | Comparing Stereo Depth to ML Depth Models | Computer vision | `_portfolio/depth-estimation.md` | Model comparison chart |
| 71 | Residuals and T-tests for Model Accuracy | Statistics | `_portfolio/depth-estimation.md` | Residual and p-value demo |
| 72 | Dual-Arm Task and Motion Planning Pipeline | Robotics planning | `_portfolio/tamp-research.md` | TAMP pipeline diagram |
| 73 | Learning-Guided Planning with Final Verification | Robotics planning | `_portfolio/tamp-research.md`, `app/cv/page.tsx` | Planner vs verifier diagram |
| 74 | Learned Feasibility Prediction for Robot Plans | Robotics planning | `_portfolio/tamp-research.md` | Plan pruning demo |
| 75 | Dual-Arm Scheduling with CP-SAT | Robotics planning | `_portfolio/tamp-research.md` | Schedule optimizer visualization |
| 76 | Planner Guidance vs Final Motion Verification | Robotics planning | `_portfolio/tamp-research.md` | Concept quiz |
| 77 | Godot VehicleBody3D Racing Physics | Game engineering | `_portfolio/kenny-racing.md` | Vehicle physics simulator |
| 78 | Racing AI with Path3D Look-Ahead Steering | Game engineering | `_portfolio/kenny-racing.md` | Racing line visualizer |
| 79 | Real-Time Transit Data Collection Loops | Data systems | `_portfolio/rutgers-bus-analysis.md` | Polling architecture diagram |
| 80 | Turning GPS Bus Pings Into Route Timelines | Transit analytics | `_portfolio/rutgers-bus-analysis.md` | Animated route timeline |
| 81 | Campus Bus Load Curves by Time of Day | Transit analytics | `_portfolio/rutgers-bus-analysis.md` | Interactive load chart |
| 82 | Class-Change Peaks and Transit Demand | Transit analytics | `_portfolio/rutgers-bus-analysis.md` | Demand peak visualizer |
| 83 | Route Loop Time Estimation | Transit analytics | `_portfolio/rutgers-bus-analysis.md` | Loop-time calculator |
| 84 | Bus Capacity Utilization | Transit analytics | `_portfolio/rutgers-bus-analysis.md` | Capacity heatmap |
| 85 | Speed Profiles Across Multi-Route Buses | Transit analytics | `_portfolio/rutgers-bus-analysis.md` | Speed profile chart |
| 86 | Weather as a Transit Reliability Variable | Transit analytics | `_portfolio/rutgers-bus-analysis.md` | Scenario simulator |
| 87 | Wait-Time Prediction From Historical Transit Data | Transit analytics | `_portfolio/rutgers-bus-analysis.md` | Prediction model demo |
| 88 | FRED and BLS API Time-Series Plotting | Economics | `_portfolio/economic-grapher.md` | API-to-chart demo |
| 89 | Economic Data Normalization for Graphing | Economics | `_portfolio/economic-grapher.md` | Data cleaning pipeline |
| 90 | Comparing Economic Indicators on Shared Axes | Economics | `_portfolio/economic-grapher.md`, `_posts/2023-6-20-junior.md` | Multi-series chart demo |
| 91 | From Survey Data to Business Recommendation | Statistics | `_portfolio/asa-fall-data.md` | Decision dashboard |
| 92 | Ranking Programming Languages With Survey Evidence | Statistics | `_portfolio/asa-fall-data.md` | Ranking chart demo |
| 93 | Demographic Segmentation in Developer Surveys | Statistics | `_portfolio/asa-fall-data.md` | Segmentation explorer |
| 94 | Data-Driven Historical Storytelling | Data journalism | `_portfolio/puerto-rico-migration.md` | Narrative structure diagram |
| 95 | Three Eras of Puerto Rican Migration | Data journalism | `_portfolio/puerto-rico-migration.md` | Interactive timeline |
| 96 | Geographic Concentration and Dispersion | Data journalism | `_portfolio/puerto-rico-migration.md` | Map visualization |
| 97 | Symmetric Functions as Permutation-Invariant Polynomials | Math | `_portfolio/drp-spring-2025.md` | Variable swap demo |
| 98 | Elementary Symmetric Functions | Math | `_portfolio/drp-spring-2025.md` | Term builder visualizer |
| 99 | q-Integers and the Meaning of q-Analogues | Math | `_portfolio/drp-spring-2025.md` | q-limit slider demo |
| 100 | The q-Binomial Theorem | Math | `_portfolio/drp-spring-2025.md` | Coefficient visualizer |

## Strong First Batch

These are the best first pages because they connect to flagship work and naturally support interactive teaching:

1. RAG Pipeline for Student Documents
2. Source-Grounded AI Wikis
3. Hi-C Contact Maps and TAD Triangles
4. A* Search: Open Set, Closed Set, and f-score
5. Swerve Drive Basics for FRC Robots
6. PID Control for Robot Mechanisms
7. Stereo Vision and Disparity Maps
8. Dual-Arm Task and Motion Planning Pipeline
9. Campus Bus Load Curves by Time of Day
10. The q-Binomial Theorem

## Page Contract

Each finished page should include:

- One concept-first opening paragraph.
- A source connection box linking the project or post where the idea appears.
- A pedagogical visual in the first third of the page.
- At least one worked example or step-through.
- A pitfalls section.
- A compact quiz or flashcard section.
- Related links to projects, writing, and adjacent wiki topics.
