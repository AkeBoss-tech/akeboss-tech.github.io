---
title: "Trace-Supervised Dual-Arm TAMP"
excerpt: "A research system for dual-arm task and motion planning where traces train feasibility, scheduling, and duration guidance while motion checking remains the final verifier."
image: "/images/portfolio/tamp-research/hero.svg"
collection: portfolio
tags: [AI, Robotics, Research, Infrastructure]
rank: 5
date: 2026-06-15
---

<img src='/images/portfolio/tamp-research/hero.svg' width='100%' align='center'>

This project investigates how **Task and Motion Planning (TAMP)** can generate structured training data, and how learned models can make later planning faster without replacing the planner. The initial target is dual-arm manipulation, where symbolic plans often fail late because of geometry, timing, collision, or shared-workspace constraints.

The guiding principle is: **learning guides planning; TAMP and motion checking remain the final verifier.** Learned models rank, prune, or repair candidate plans, but IK, collision checking, trajectory optimization, and execution validation still decide whether a plan is real.

<p align="center">
  <strong><a href="https://github.com/AkeBoss-tech/TAMP-research" target="_blank" rel="noopener noreferrer">View on GitHub</a></strong>
</p>

---

## Research Goal

The first research goal is an early feasibility predictor: a model that estimates whether an action or partial plan is likely to survive IK, collision, and motion checks. If the predictor works, the planner should make fewer expensive motion calls, reduce late geometric failures, lower median and tail planning time, and preserve or improve task success on held-out scene seeds.

The broader roadmap includes symbolic skeleton ranking, dual-arm overlap prediction, action-duration prediction, learned grasp and placement proposals, and failure-aware replanning.

---

## System Pipeline

The system is built around trace supervision:

1. Generate randomized dual-arm tabletop, shelf, handoff, block tower, and container insertion tasks
2. Produce candidate symbolic action skeletons
3. Assign actions to arms with greedy or OR-Tools CP-SAT scheduling
4. Run IK, collision, and motion checks through analytic and cuRobo-backed adapters
5. Log successful and failed attempts as traces
6. Build Parquet datasets from those traces
7. Train feasibility, duration, and scheduling guidance models
8. Insert learned guidance back into planning
9. Compare learned guidance against planner-only baselines

---

## Integrations

The repo includes a serious robotics and ML stack:

* **Planning**: PDDLStream, heuristic planning, continuous planning adapters
* **Scheduling**: greedy scheduling and OR-Tools CP-SAT
* **Motion**: analytic refinement, cuRobo v2 GPU IK and trajectory optimization
* **Simulation and runtime**: Isaac Sim 5.0 dual-Franka execution, ROS 2 Jazzy, BehaviorTree.CPP
* **Learning**: PyTorch Geometric GPU training, checkpoint-backed inference, auxiliary predictors
* **Tracking and data**: JSONL traces, Parquet datasets, MLflow, benchmark dashboards
* **Visualization**: per-task HTML reports, graph, schedule, motion, execution, replanning, MCAP/Rerun export hooks

The project is private research infrastructure, so the public page focuses on the system design and technical direction rather than exposing internal artifacts.

