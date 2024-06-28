---
title: "FBLA Coding and Programming Project"
excerpt: "CTE Partnerships a website bringing information about local businesses together! <br/><img src='/images/portfolio/fbla/main.png' width='375' height='263'>"
collection: portfolio
---

<h1 align="center"><a href="https://github.com/AkeBoss-tech/fbla-website-app">CTE Partnerships</a></h1>

<p align="center">By: Akash Dubey, Ani Tiwary, and Krish Shetty</p> 

<img src='/images/portfolio/fbla/main.png' width='100%' align='center'>

Our submission for FBLA's Coding and Programming Event 2024. We placed in the top 10 at the State Leadership Conference.

[Live Site](https://fbla-website-app.vercel.app/)

<p align="center">Presentation</p>

[<img src='/images/portfolio/fbla/prez.png' width='100%' align='center'>](https://docs.google.com/presentation/d/1lTFlAu6mtRz1dSESfeCmkwJv9zxPARS8UH0o9SkJL_k/edit?usp=sharing)

## Our Goal

We wanted to combine all the sources of information about community partners into a single, easy-to-use location that updates automatically with new data for our school's Career Technical Education department and its students.

## Process

We gathered data through web scraping and developed a web app to manage it. We also collected feedback to improve our solution.

- **Collecting Data:** Obtained information from online sources, extracted relevant information, and structured it using JSON format.
- **Feedback:** Collected feedback indicating the application was helpful in searching for internship/job opportunities, though some users experienced difficulties in finding specific internships.

## Features

### Search for Businesses
Use filters, keywords, and sorting to find the information you need.
<img src='/images/portfolio/fbla/search.png' width='100%' align='center'>

### View Information about Businesses
For each business, you can see industry information, contact details, and detailed description.

<img src='/images/portfolio/fbla/908.png' width='100%' align='center'>

### Add Organizations
If organizations can't be scrapped from other sites online, they can also be added manually through a form.

<img src='/images/portfolio/fbla/form.png' width='100%' align='center'>

### Comments
Using Disqus, users can leave comments on the website to provide feedback or ask questions about organizations.

<img src='/images/portfolio/fbla/comments.png' width='100%' align='center'>

## Functionality

- **Web Scraping:** We used web scraping techniques to collect data from local websites about various businesses and community partners. This automated process ensures that the information is up-to-date and comprehensive, providing the CTE department with all the data they need in one place.
- **Data Storage:** The collected data is stored in a structured JSON format, making it easy to access and manipulate within our application.
- **Search and Filter:** The app includes robust search and filter functionalities, allowing users to quickly find specific information based on keywords or categories.
- **User Interface:** The user-friendly interface allows users to add new organizations, view detailed information about partners, and leave comments.

## Software Used

- **React:** We used React to build the front end of our application, providing a responsive and interactive user experience.
- **Node.js:** Our backend is powered by Node.js, handling data processing and server-side logic.
- **BeautifySoup:** We used BeautifySoup to scrape data from websites, extracting relevant information about businesses and community partners from the [chamber of commerce](https://business.suburbanchambers.org/list/).
- **GitHub:** Version control and collaboration were managed through GitHub, ensuring efficient team coordination and code management.

## Benefits of a Web-Based Approach

Creating a web-based application makes it easier for both the CTE department and students to access the data. The centralized platform allows for real-time updates and accessibility from any device with an internet connection. This ensures that everyone has the most current information and can make informed decisions regarding partnerships and opportunities.