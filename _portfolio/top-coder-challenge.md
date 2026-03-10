---
title: "TopCoder Reimbursement Challenge — Top Performer"
excerpt: "Reverse-engineered a 60-year-old undocumented travel reimbursement system from 1,000 I/O examples using XGBoost and feature engineering — recognized as a top performer and invited to interview at 8090 AI"
image: "/images/portfolio/top-coder/hero.png"
collection: portfolio
tags: [AI, Data, Algorithms]
rank: 2
---

<img src='/images/portfolio/top-coder/hero.png' width='100%' align='center'>

A black-box reverse engineering challenge: given 1,000 historical input/output examples from a 60-year-old travel reimbursement system with no documentation, no source code, and no formula—replicate it exactly. The system takes three inputs (`trip_duration_days`, `miles_traveled`, `total_receipts_amount`) and returns a single dollar amount. My solution ranked among the **top performers** in the competition and earned an interview invitation from **8090**, an AI company based in Menlo Park.

<p align="center">
  <strong><a href="https://github.com/AkeBoss-tech/top-coder-challenge" target="_blank" rel="noopener noreferrer">View on GitHub</a></strong>
</p>

---

## The Challenge

Most machine learning problems give you labeled data and a known output space. This one gave you 1,000 (input, output) pairs from a system nobody alive fully understands—employee interviews hinted at quirks like a "5-day bonus," receipt penalties near certain thresholds, and mileage tiers, but nothing was confirmed. The goal: produce a `run.sh` script that accepts the three inputs and outputs the reimbursement amount to within cents, in under 5 seconds, with no external dependencies.

Evaluation used four metrics: **exact matches** (±$0.01), **close matches** (±$1.00), **average error**, and a combined accuracy/precision score.

---

## The Approach

Rather than trying to hand-craft rules from the employee interviews (which were contradictory and incomplete), I treated this as a supervised learning problem with heavy feature engineering.

**16 engineered features** derived from the 3 raw inputs:

| Feature Type | Examples |
|---|---|
| Raw inputs | `trip_duration_days`, `miles_traveled`, `total_receipts_amount` |
| Ratios | `miles_per_day`, `receipts_per_day`, `receipts_per_mile` |
| Polynomial | squared terms for each input |
| Log transforms | `log(miles + 1)`, `log(receipts + 1)` |
| Cross terms | `miles × receipts`, `duration × miles` |
| Binary flags | `is_5_day_trip`, `high_receipt_flag`, `low_receipt_flag` |

The model is **XGBoost** (gradient-boosted decision trees), which excels at capturing the non-linear, threshold-based behavior that legacy business logic typically produces. The binary flags were directly motivated by the employee interview hints about special-case handling.

---

## Results

The solution achieved high accuracy on the 1,000 historical cases and generalized well to the hidden evaluation set—well enough to be recognized as a **top performer** in the challenge. This performance led directly to an interview invitation from **8090**, an AI startup in Menlo Park building enterprise intelligence tools.
