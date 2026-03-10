---
title: "FlaminGo! — Your Personal Bone Health Companion"
excerpt: "An iOS app empowering women 50+ to build stronger bones and prevent falls using Vision AI for posture analysis and HealthKit for movement tracking. Built for HealthHack2025."
image: "/images/portfolio/flamingo/image.png"
collection: portfolio
tags: [Mobile, AI, HealthTech]
rank: 5
---

<img src='/images/portfolio/flamingo/image.png' width='100%' align='center'>

After menopause, women lose bone density at an accelerated rate, significantly increasing the risk of osteoporosis and life-altering fractures. **FlaminGo!** is an iOS application designed to bridge the gap between annual doctor visits by providing daily, actionable insights about bone health, movement patterns, and fall risk. It makes strength training and balance assessment accessible, trackable, and motivating.

<p align="center">
  <strong><a href="https://github.com/priyarana1/HealthHack2025" target="_blank" rel="noopener noreferrer">View on GitHub</a></strong>
</p>

---

## Demo

<iframe width="560" height="315" src="https://www.youtube.com/embed/2UDaCEb_5cE" title="FlaminGo! Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## Key Features

### 🧍 AI-Powered Posture & Balance Assessment
Using the iOS **Vision framework** (`VNDetectHumanBodyPoseRequest`), FlaminGo! performs real-time camera-based posture analysis. It tracks 17 body keypoints to measure spine angles and track forward lean progression (kyphosis). It also includes balance testing (single-leg stands) to detect asymmetry and predict fall risks better than standard clinical proxy assessments.

### 🔬 Advanced Fall Risk Prediction
The app calculates a comprehensive **Composite Risk Score (0-100)** by analyzing:
* Walking Asymmetry (25%)
* Balance Performance (25%)
* Spine Angle (20%)
* Activity Consistency (15%)
* Speed Decline (15%)

Using time-series analysis and linear regression, it identifies high-risk periods and provides early warning alerts for concerning mobility trends.

### 💪 Evidence-Based Strength Training
Weight-bearing exercise is the #1 non-pharmaceutical intervention for building bone density. FlaminGo! includes an intelligent exercise library (Strength, Balance, Flexibility, Pelvic Floor) with AI-powered rep counting and form quality assessment to ensure users perform movements safely.

### 🔒 Privacy-First Architecture
Built completely with **SwiftData** and **HealthKit**, the app functions 100% locally. 
* No cloud sync or servers
* Camera images are processed on-device and instantly discarded
* Fully compliant with Apple's strict health privacy guidelines

## Technologies Used
* **Languages & Frameworks:** Swift 5.9, SwiftUI 4.0
* **Data Integration:** HealthKit, SwiftData
* **Machine Learning & AI:** Vision framework, AVFoundation
* **Analytics & UI:** Swift Charts, UserNotifications
