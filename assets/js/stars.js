
function createStars() {
const container = document.getElementById('starsContainer');
const starCount = 200;
const shootingStarCount = 3;

// Create twinkling stars
for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = Math.random() * 3 + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--twinkle-duration', (Math.random() * 3 + 2) + 's');
    container.appendChild(star);
}

// Create shooting stars
for (let i = 0; i < shootingStarCount; i++) {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    shootingStar.style.left = Math.random() * 100 + '%';
    shootingStar.style.top = Math.random() * 100 + '%';
    shootingStar.style.animationDelay = (Math.random() * 8) + 's';
    container.appendChild(shootingStar);
}
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', createStars);
