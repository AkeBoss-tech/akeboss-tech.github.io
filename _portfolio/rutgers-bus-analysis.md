---
title: "Rutgers Bus Analysis"
excerpt: "A comprehensive data analysis of the Rutgers University bus transit system"
image: "/images/portfolio/bus/bus-data.png"
collection: portfolio
---

<p align="center">Analysis by Akash Dubey</p> 

<p align="center">Group Members: Charles Tang, Nathaniel Correa, Akash Dubey, and Khang Nguyen</p>

## Project Overview
For our Honors College Forum Social Impact Plan, our group aimed to improve traffic efficiency at Rutgers New Brunswick. Since the primary form of transportation for students is the Rutgers bus system, we conducted an extensive analysis of bus transit data to identify patterns, optimize routes, and improve service reliability.

[View Repository](https://github.com/AkeBoss-tech/RutgersBusAnalysis) | [Interactive Map](https://akeboss-tech.github.io/RutgersBusAnalysis/)

## Data Collection Process
I developed a custom Python script to collect real-time bus data from the Rutgers PassioGO system:
- Polled the PassioGO API every 30 seconds
- Contributed to the PassioGO API with [this pull request](https://github.com/athuler/PassioGo/pull/32)
- Hosted on Azure VM for reliable 24/7 operation
- Collected over 100MB of structured transit data
- Gathered approximately 300,000+ data points over one week

## Key Visualizations

### Route Load Analysis
<img src='/images/portfolio/bus/image-1.png' width='100%' alt='Average Load Across Multiple Routes'>
*Average load patterns across all routes throughout the day*

### LX Route Analysis
<img src='/images/portfolio/bus/image-5.png' width='100%' alt='Average Load of LX over the course of a day'>
*Detailed analysis of the LX route load patterns*

### Route Loop Times
<img src='/images/portfolio/bus/image-8.png' width='100%' alt='Loop times for different routes'>
*Calculated loop completion times for each route*

### Bus Capacity Analysis
<img src='/images/portfolio/bus/image-3.png' width='100%' alt='Most filled buses'>
*Analysis of bus capacity utilization*

### Weekly Operations
<img src='/images/portfolio/bus/image-4.png' width='100%' alt='Total Buses operating during the week'>
*Total number of buses in operation throughout the week*

### Speed Analysis
<img src='/images/portfolio/bus/image-7.png' width='100%' alt='Average speed of a bus'>
*Speed patterns of a bus serving multiple routes (LX, H, REXB, EE, and F Routes)*

### Interactive Visualization
<img src='/images/portfolio/bus/buses.gif' width='100%' alt='Bus Movement Animation'>
*Real-time visualization of bus movements across campus*

## Key Findings
- Peak wait times correlate with class change periods
- Route efficiency varies significantly by time of day
- Load patterns follow predictable daily cycles
- Identified optimal bus distribution patterns

## Technologies Used
- Python 3.11
- Data Analysis: Pandas, NumPy
- Visualization: Matplotlib, Seaborn, Folium
- API Integration: Requests
- Cloud Infrastructure: Azure VM

## Future Improvements
- Real-time prediction model for wait times
- Interactive web dashboard
- iOS and Android apps for real-time tracking
- Machine learning for route optimization
- Weather impact analysis

This project demonstrates the power of data analysis in improving public transit systems and enhancing the student experience at Rutgers University.

*Note: This project is for research and analysis purposes only and is not officially affiliated with Rutgers University.*
