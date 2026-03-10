---
title: "Economic Drivers of Puerto Rican Migration"
excerpt: "A data-driven interactive web experience analyzing Puerto Rican migration patterns from 1950 to 2024, combining quantitative census data with literary narratives."
image: "/images/portfolio/puerto-rico/image.png"
collection: portfolio
tags: [Data, Research, Web]
rank: 5
---

<img src='/images/portfolio/puerto-rico/image.png' width='100%' align='center'>

Most historical analyses rely purely on text, but numbers often tell the most compelling stories of demographic shifts. This project is a comprehensive, interactive data visualization website that tracks and analyzes the profound economic drivers behind Puerto Rican migration to the mainland United States from 1950 to 2024.

<p align="center">
  <strong><a href="https://akashdubey.me/puerto-rico-migration/" target="_blank" rel="noopener noreferrer">View the Interactive Website</a></strong> | <strong><a href="https://github.com/AkeBoss-tech/puerto-rico-migration" target="_blank" rel="noopener noreferrer">View on GitHub</a></strong>
</p>

---

## Data-Driven Storytelling

The project bridges the gap between historical literature (specifically Piri Thomas's *Down These Mean Streets*) and quantitative demographic realities. By fusing literary analysis with deep datasets from the **U.S. Census Bureau, IPUMS USA, and Federal Reserve Economic Data (FRED)**, the platform visualizes the structural forces that drove mass displacement and resettlement.

### The Three Eras of Migration
The interactive experience guides users through three distinct historical phases:

1. **The Great Migration (1950s–1970s)**: Driven by *Operation Bootstrap's* shift from agriculture to manufacturing, displacing hundreds of thousands of workers who hyper-concentrated in New York City (representing 88% of mainland Puerto Ricans in 1940).
2. **The Dispersion (1980s–2000s)**: The shift away from New York and the rise of a U.S.-born mainland majority—the "Nuyorican" shift.
3. **The Modern Exodus (2010s–Present)**: Driven by modern debt crises and natural disasters, visualizing the massive geographic reorientation toward Florida and the American South.

---

## Technical Implementation

The website is explicitly designed for smooth, scroll-driven storytelling.

* **Frontend:** Built with vanilla HTML/CSS, utilizing CSS animations (`IntersectionObserver`) for staggered, fade-in loading of text and graphs as the user scrolls.
* **Data Visualization:** Employs **Python (Pandas) and Plotly** to generate rich, interactive HTML charts. These standalone interactive iframe graphs allow users to hover over data points, zoom into specific timelines, and toggle demographic variables natively in the browser without a backend server.
* **Data Engineering:** Cleaned, processed, and merged multiple decades of raw IPUMS microdata and historical census records to create continuous time-series analyses.
