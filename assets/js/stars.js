
function createStars() {
  const container = document.getElementById('starsContainer');
  const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  if (isLight) {
    createClouds(container);
  } else {
    createDarkModeStars(container);
  }
}

function createDarkModeStars(container) {
  const starCount = 200;
  const shootingStarCount = 3;

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

  for (let i = 0; i < shootingStarCount; i++) {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    shootingStar.style.left = Math.random() * 100 + '%';
    shootingStar.style.top = Math.random() * 100 + '%';
    shootingStar.style.animationDelay = (Math.random() * 8) + 's';
    container.appendChild(shootingStar);
  }
}

function createClouds(container) {
  const clouds = [
    { w: 180, h: 60, blur: 18, layers: 3 },
    { w: 140, h: 50, blur: 14, layers: 2 },
    { w: 220, h: 75, blur: 22, layers: 3 },
    { w: 100, h: 40, blur: 10, layers: 2 },
    { w: 160, h: 55, blur: 16, layers: 3 },
    { w: 130, h: 45, blur: 13, layers: 2 },
    { w: 200, h: 65, blur: 20, layers: 3 },
    { w: 90,  h: 35, blur:  9, layers: 2 },
    { w: 170, h: 58, blur: 17, layers: 2 },
    { w: 250, h: 80, blur: 24, layers: 3 },
    { w: 115, h: 42, blur: 11, layers: 2 },
    { w: 145, h: 52, blur: 15, layers: 2 },
  ];

  clouds.forEach((cfg, i) => {
    const top      = 5 + Math.random() * 62;   // keep in sky (not near earth)
    const left     = Math.random() * 120 - 20;  // can start off-screen
    const opacity  = 0.55 + Math.random() * 0.35;
    const duration = 70 + Math.random() * 90;   // very slow: 70–160 s
    const delay    = -(Math.random() * duration);
    const glitter  = Math.random() < 0.5;       // half the clouds shimmer

    // Wrapper
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      position: absolute;
      left: ${left}%;
      top: ${top}%;
      animation: cloudDrift ${duration}s ${delay}s linear infinite;
    `;

    // Build a fluffy cloud from stacked blurred ellipses
    for (let l = 0; l < cfg.layers; l++) {
      const puff = document.createElement('div');
      const scaleW = 0.6 + l * 0.25;
      const scaleH = 0.7 + l * 0.15;
      const offX   = (l - 1) * cfg.w * 0.3;
      const offY   = l * -8;
      puff.style.cssText = `
        position: absolute;
        width: ${cfg.w * scaleW}px;
        height: ${cfg.h * scaleH}px;
        left: ${offX}px;
        top: ${offY}px;
        background: rgba(255,255,255,${opacity - l * 0.08});
        border-radius: 50%;
        filter: blur(${cfg.blur - l * 2}px);
      `;
      wrap.appendChild(puff);
    }

    // Optional glitter layer (tiny bright specks inside the cloud)
    if (glitter) {
      const sparkCount = 4 + Math.floor(Math.random() * 5);
      for (let s = 0; s < sparkCount; s++) {
        const spark = document.createElement('div');
        const sz    = 2 + Math.random() * 4;
        const sparkDur = 1.5 + Math.random() * 2.5;
        spark.style.cssText = `
          position: absolute;
          width: ${sz}px;
          height: ${sz}px;
          left: ${10 + Math.random() * 80}%;
          top: ${20 + Math.random() * 60}%;
          background: rgba(255,255,255,0.95);
          border-radius: 50%;
          filter: blur(0.5px);
          animation: sparkleCloud ${sparkDur}s ${-Math.random() * sparkDur}s infinite ease-in-out;
        `;
        wrap.appendChild(spark);
      }
    }

    container.appendChild(wrap);
  });
}

document.addEventListener('DOMContentLoaded', createStars);
