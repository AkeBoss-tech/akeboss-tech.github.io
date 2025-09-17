---
permalink: /networking/
title: "Networking"
excerpt: "Digital networking card for Akash Dubey"
author_profile: false
redirect_from: 
  - /network/
  - /connect/
author: Akash Dubey
---

{% include base_path %}

<!-- Use the same styling as the home page -->
<style>
  @keyframes color-change {
    0% { color: #FF1E1E; }
    20% { color: #FFB800; }
    40% { color: #00FF66; }
    60% { color: #00FFFF; }
    80% { color: #FF00FF; }
    100% { color: #FF1E1E; }
  }

  .color-transition {
    animation: color-change 8s infinite;
    text-shadow: 0 0 10px rgba(255,255,255,0.3);
  }

  @keyframes rainbow-button {
    0% { background: linear-gradient(45deg, #FF1E1E, #FFB800); }
    25% { background: linear-gradient(45deg, #FFB800, #00FF66); }
    50% { background: linear-gradient(45deg, #00FF66, #00FFFF); }
    75% { background: linear-gradient(45deg, #00FFFF, #FF00FF); }
    100% { background: linear-gradient(45deg, #FF00FF, #FF1E1E); }
  }

  .btn--primary {
    animation: rainbow-button 8s infinite;
    transition: transform 0.3s ease;
    background-image: linear-gradient(45deg, #FF1E1E, #FFB800) !important;
    background-size: 200% 200% !important;
    color: white !important;
    border: none !important;
  }
  
  .rotating-light-border {
    position: relative;
    display: inline-block;
    border-radius: 50%;
    width: 250px;
    height: 250px;
    z-index: -1;
  }

  .rotating-light-border img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }

  .rotating-light-border::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      rgba(255, 255, 255, 0.1),
      white,
      rgba(255, 255, 255, 0.1)
    );
    animation: rotate-light 20s ease-in infinite;
    z-index: -1;
  }

  @keyframes rotate-light {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Social icons animation */
  .fa-fw, .fab, .fas {
    transition: all 0.3s ease;
    font-size: 2em;
    margin: 0.5em;
  }

  .fa-fw:hover, .fab:hover, .fas:hover {
    transform: scale(1.2);
    color: #00FFFF;
    text-shadow: 0 0 10px rgba(0,255,255,0.5);
  }

  /* Add smooth transitions to all elements */
  * {
    transition: all 0.3s ease;
  }

  /* Remove underlines from all links */
  a {
    text-decoration: none !important;
  }

  a:hover {
    text-decoration: none !important;
  }

  .networking-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2em;
    margin: 2em auto;
    max-width: 800px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .personal-statement {
    font-size: 1.2em;
    line-height: 1.6;
    text-align: center;
    margin: 1.5em 0;
    color: #fff;
    text-shadow: 0 0 5px rgba(255,255,255,0.3);
  }

  .contact-info {
    background: rgba(255,255,255,0.1);
    border-radius: 15px;
    padding: 1.5em;
    margin: 2em 0;
    text-align: center;
  }

  /* Button styling to match home page */
  .btn--primary {
    margin: 0.5em;
  }

  @media (max-width: 768px) {
    .rotating-light-border {
      width: 200px;
      height: 200px;
    }
    
    .rotating-light-border::before {
      width: 210px;
      height: 210px;
    }
    
    .fa-fw, .fab, .fas {
      font-size: 1.5em;
      margin: 0.3em;
    }
    
  }
</style>

<!-- Digital Business Card -->
<div class="networking-card">
  <!-- Profile Section -->
  <div class="text-center mb-4">
    <div class="rotating-light-border">
      <img src="{{ base_path }}/images/face.jpg" alt="Akash Dubey">
    </div>
    
    <h1 class="color-transition" style="font-size: 50px; font-weight: bold; margin: 0.5em 0;">Akash Dubey</h1>
    <h2 style="color: #00FFFF; font-size: 1.5em; margin: 0;">Computer Science & Math Student</h2>
    <h3 style="color: #FFB800; font-size: 1.2em; margin: 0.5em 0;">Rutgers University Honors College</h3>
    
    <!-- Social Media Icons -->
    <div class="row" style="justify-content: center; margin: 1em 0;">
      {% if site.author.email %}
        <a href="mailto:{{ site.author.email }}" title="Email"><i class="fas fa-fw fa-envelope" aria-hidden="true"></i></a>
      {% endif %}
      {% if site.author.linkedin %}
        <a href="https://www.linkedin.com/in/{{ site.author.linkedin }}" title="LinkedIn"><i class="fab fa-fw fa-linkedin" aria-hidden="true"></i></a>
      {% endif %}
      {% if site.author.github %}
        <a href="https://github.com/{{ site.author.github }}" title="GitHub"><i class="fab fa-fw fa-github" aria-hidden="true"></i></a>
      {% endif %}
      {% if site.author.instagram %}
        <a href="https://instagram.com/{{ site.author.instagram }}" title="Instagram"><i class="fab fa-fw fa-instagram" aria-hidden="true"></i></a>
      {% endif %}
      {% if site.author.youtube %}
        <a href="{{ site.author.youtube }}" title="YouTube"><i class="fab fa-fw fa-youtube" aria-hidden="true"></i></a>
      {% endif %}
      {% if site.author.discord %}
        <a href="https://discord.com/users/{{ site.author.discord }}" title="Discord"><i class="fab fa-fw fa-discord" aria-hidden="true"></i></a>
      {% endif %}
      {% if site.author.kaggle %}
        <a href="https://kaggle.com/{{ site.author.kaggle }}" title="Kaggle"><i class="fab fa-fw fa-kaggle" aria-hidden="true"></i></a>
      {% endif %}
      {% if site.author.spotify %}
        <a href="{{ site.author.spotify }}" title="Spotify"><i class="fab fa-fw fa-spotify" aria-hidden="true"></i></a>
      {% endif %}
    </div>
  </div>

  <!-- Personal Statement -->
  <div class="personal-statement">
    <p><strong>Passionate innovator</strong> at the intersection of technology and creativity</p>
    <p><strong>10+ years</strong> of coding experience • <strong>Robotics enthusiast</strong> • <strong>Data science explorer</strong></p>
    <p>Soccer player • Cricket fan • Always learning something new</p>
    <p><em>"Building the future, one line of code at a time"</em></p>
  </div>

  <!-- Contact Information -->
  <div class="contact-info">
    <h2 style="color: #00FF66; margin-bottom: 1em; font-size: 2em;">Contact Information</h2>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center;">
      <span style="margin: 0.5em; color: #fff;">akash.dubey@rutgers.edu</span>
      <span style="margin: 0.5em; color: #fff;">Berkeley Heights, NJ</span>
    </div>
    
    <!-- Download Contact Card -->
    <a href="{{ base_path }}/assets/contact.vcf" 
       class="btn btn--primary btn--lg" 
       style="margin: 1em 0.5em;"
       download="Akash_Dubey.vcf">
      <i class="fas fa-address-card"></i> Add to Contacts
    </a>
  </div>


  <!-- Site Navigation -->
  <div style="margin: 2em 0;">
    <h2 style="color: #FFB800; text-align: center; margin-bottom: 1.5em; font-size: 2em;">Explore My Site</h2>
    <div class="row" style="justify-content: center; gap: 1em;">
      <a class="btn btn--primary btn--lg" style="background-color: #FE5801; padding: 1.2em 2em; font-size: 1.2em;" href="{{ base_path }}/portfolio/">Portfolio</a>
      <a class="btn btn--primary btn--lg" style="background-color: #FE5801; padding: 1.2em 2em; font-size: 1.2em;" href="{{ base_path }}/year-archive/">Blog Posts</a>
      <a class="btn btn--primary btn--lg" style="background-color: #FE5801; padding: 1.2em 2em; font-size: 1.2em;" href="{{ base_path }}/files/resume.pdf">Resume</a>
      <a class="btn btn--primary btn--lg" style="background-color: red; padding: 1.2em 2em; font-size: 1.2em;" href="{{ site.author.youtube }}">YouTube Channel</a>
    </div>
  </div>

  <!-- Call to Action -->
  <div class="text-center" style="margin: 2em 0;">
    <h2 style="color: #00FF66; font-size: 2em;">Let's Build Something Amazing Together</h2>
    <p style="color: #fff; margin: 1em 0;">Whether it's a coding project, robotics challenge, or just a chat about tech and sports!</p>
    
    <div class="row" style="justify-content: center; gap: 1em; margin: 1.5em 0;">
      <a href="mailto:{{ site.author.email }}?subject=Let's Connect!" 
         class="btn btn--primary btn--lg" 
         style="background-color: #57CD80; padding: 1.2em 2em; font-size: 1.2em;">
        <i class="fas fa-envelope"></i> Send Email
      </a>
      
      <a href="https://www.linkedin.com/in/{{ site.author.linkedin }}" 
         class="btn btn--primary btn--lg" 
         style="background-color: #57CD80; padding: 1.2em 2em; font-size: 1.2em;">
        <i class="fab fa-linkedin"></i> Connect on LinkedIn
      </a>
      
      <a href="https://github.com/{{ site.author.github }}" 
         class="btn btn--primary btn--lg" 
         style="background-color: #57CD80; padding: 1.2em 2em; font-size: 1.2em;">
        <i class="fab fa-github"></i> Follow on GitHub
      </a>
    </div>
  </div>

</div>
