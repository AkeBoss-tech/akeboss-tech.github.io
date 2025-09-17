---
permalink: /networking/
title: "Connect With Me"
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

  .site-navigation {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1em;
    margin: 2em 0;
  }

  .nav-button {
    padding: 1em;
    text-align: center;
    border-radius: 10px;
    transition: all 0.3s ease;
    text-decoration: none;
    color: white;
    font-weight: bold;
  }

  .nav-button:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
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
    
    .site-navigation {
      grid-template-columns: 1fr;
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
  </div>

  <!-- Personal Statement -->
  <div class="personal-statement">
    <p>🚀 <strong>Passionate innovator</strong> at the intersection of technology and creativity</p>
    <p>💻 <strong>10+ years</strong> of coding experience • 🤖 <strong>Robotics enthusiast</strong> • 📊 <strong>Data science explorer</strong></p>
    <p>⚽ Soccer player • 🏏 Cricket fan • 🎯 Always learning something new</p>
    <p><em>"Building the future, one line of code at a time"</em></p>
  </div>

  <!-- Contact Information -->
  <div class="contact-info">
    <h3 style="color: #00FF66; margin-bottom: 1em;">📞 Let's Connect!</h3>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center;">
      <span style="margin: 0.5em; color: #fff;">📧 akash.dubey@rutgers.edu</span>
      <span style="margin: 0.5em; color: #fff;">📍 Berkeley Heights, NJ</span>
    </div>
    
    <!-- Download Contact Card -->
    <a href="{{ base_path }}/assets/contact.vcf" 
       class="btn btn--primary btn--lg" 
       style="text-decoration: none; margin: 1em 0.5em;"
       download="Akash_Dubey.vcf">
      <i class="fas fa-address-card"></i> Add to Contacts
    </a>
  </div>

  <!-- Social Media Links -->
  <div class="text-center" style="margin: 2em 0;">
    <h3 style="color: #FF00FF; margin-bottom: 1em;">🌐 Find Me Online</h3>
    <div class="row" style="justify-content: center;">
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

  <!-- Site Navigation -->
  <div style="margin: 2em 0;">
    <h3 style="color: #FFB800; text-align: center; margin-bottom: 1.5em;">🗺️ Explore My Digital World</h3>
    <div class="site-navigation">
      <a href="{{ base_path }}/" class="nav-button" style="background: linear-gradient(135deg, #FF1E1E, #FF6B6B);">
        <i class="fas fa-home"></i><br>Home
      </a>
      <a href="{{ base_path }}/portfolio/" class="nav-button" style="background: linear-gradient(135deg, #FE5801, #FF8A50);">
        <i class="fas fa-briefcase"></i><br>Portfolio
      </a>
      <a href="{{ base_path }}/year-archive/" class="nav-button" style="background: linear-gradient(135deg, #57CD80, #7ED321);">
        <i class="fas fa-blog"></i><br>Blog Posts
      </a>
      <a href="{{ base_path }}/cv/" class="nav-button" style="background: linear-gradient(135deg, #C50070, #E91E63);">
        <i class="fas fa-user-graduate"></i><br>CV
      </a>
      <a href="{{ base_path }}/files/resume.pdf" class="nav-button" style="background: linear-gradient(135deg, #00FFFF, #40E0D0);">
        <i class="fas fa-file-pdf"></i><br>Resume
      </a>
      <a href="{{ base_path }}/background/" class="nav-button" style="background: linear-gradient(135deg, #FF00FF, #DA70D6);">
        <i class="fas fa-info-circle"></i><br>Background
      </a>
    </div>
  </div>

  <!-- Call to Action -->
  <div class="text-center" style="margin: 2em 0;">
    <h3 style="color: #00FF66;">💬 Let's Build Something Amazing Together!</h3>
    <p style="color: #fff; margin: 1em 0;">Whether it's a coding project, robotics challenge, or just a chat about tech and sports!</p>
    
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1em; margin: 1.5em 0;">
      <a href="mailto:{{ site.author.email }}?subject=Let's Connect!" 
         class="btn btn--primary btn--lg" 
         style="text-decoration: none; background: linear-gradient(135deg, #00FF66, #32CD32);">
        <i class="fas fa-envelope"></i> Send Email
      </a>
      
      <a href="https://www.linkedin.com/in/{{ site.author.linkedin }}" 
         class="btn btn--primary btn--lg" 
         style="text-decoration: none; background: linear-gradient(135deg, #0077B5, #0099CC);">
        <i class="fab fa-linkedin"></i> Connect on LinkedIn
      </a>
      
      <a href="https://github.com/{{ site.author.github }}" 
         class="btn btn--primary btn--lg" 
         style="text-decoration: none; background: linear-gradient(135deg, #333, #666);">
        <i class="fab fa-github"></i> Follow on GitHub
      </a>
    </div>
  </div>

  <!-- Fun Fact -->
  <div class="text-center" style="margin: 2em 0; padding: 1em; background: rgba(255,255,255,0.05); border-radius: 10px;">
    <p style="color: #FFB800; font-size: 1.1em;">
      <i class="fas fa-lightbulb"></i> 
      <strong>Fun Fact:</strong> I've been coding for over 10 years and I'm still as excited about it as day one! 🎉
    </p>
  </div>
</div>

<!-- QR Code Section (Optional - you can generate a QR code for this page) -->
<div class="text-center" style="margin: 2em 0;">
  <p style="color: #888; font-size: 0.9em;">
    <i class="fas fa-qrcode"></i> Bookmark this page or share it as your digital business card!
  </p>
</div>
