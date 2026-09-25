/* ============================================================
   HAPPY BIRTHDAY MARI — script.js
   Vanilla JS only. No frameworks.
   ============================================================ */

// Global handler for inline HTML image onerror attributes
window.handleImageError = function (img) {
  if (!img) return;
  const frame = img.parentElement;
  if (frame && !frame.querySelector('.companion-fallback')) {
    const fb = document.createElement('div');
    fb.className = 'companion-fallback';
    fb.id = 'companion-fallback';
    frame.innerHTML = '';
    frame.appendChild(fb);
  }
};

(function () {
  'use strict';

  /* ---------------------------------------------------------
     UTILITIES
  --------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx \vert{}\vert{} document).querySelector(sel);   const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     REUSABLE MARKUP BUILDERS (cake / bouquet / cat)
  --------------------------------------------------------- */

  function buildCake({ big } = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'cake';
    wrap.innerHTML = `
      <div class="cake-glow"></div>
      <div class="cake-smoke" data-smoke></div>
      <div class="cake-flame" data-flame></div>
      <div class="cake-candle"></div>
      <div class="cake-tier cake-tier-3">
        <div class="cake-drip"></div>
        <div class="cake-gold-band"></div>
      </div>
      <div class="cake-tier cake-tier-2">
        <div class="cake-drip"></div>
        <div class="cake-gold-band"></div>
      </div>
      <div class="cake-tier cake-tier-1">
        <div class="cake-drip"></div>
        <div class="cake-gold-band"></div>
      </div>
    `;
    if (big) wrap.style.transform = 'scale(1.25)';
    return wrap;
  }

  function buildBouquetBloom({ x, y, size, colors, delay }) {
    const bloom = document.createElement('div');
    bloom.className = 'bloom';
    bloom.style.left = x + '%';
    bloom.style.bottom = y + 'px';
    bloom.innerHTML = `
      <div class="bloom-petal-ring" style="animation: bouquet-sway ${rand(3.5, 5.5)}s ease-in-out ${delay}s infinite; transform-origin:bottom center;">
        ${colors.map((c, i) => `<span style="background:${c}; transform: translate(-50\%,-50\%) rotate(${i * 60}deg) translateY(-7px); width:${size}px; height:${size * 1.3}px;"></span>`).join('')}
        <div style="position:absolute; left:50%; top:50%; width:${size * 0.5}px; height:${size * 0.5}px; border-radius:50%; background:#D9B67E; transform:translate(-50%,-50%);"></div>
      </div>
    `;
    return bloom;
  }

  function buildBouquet() {
    const wrap = document.createElement('div');
    wrap.className = 'bouquet';
    wrap.style.width = '100px';

    const flowersEl = document.createElement('div');
    flowersEl.className = 'bouquet-flowers';

    const palette = [
      ['#FF9EBB', '#FFC4D6', '#FFD9E4'],
      ['#FFB6C9', '#FFE1EC', '#FF8FA9'],
      ['#FFD6E8', '#FFF0F5', '#FFB6C9'],
      ['#F7A8C4', '#FFC9DB', '#F58FAF'],
    ];

    const positions = [
      { x: 18, y: 40, size: 16 }, { x: 32, y: 60, size: 14 },
      { x: 48, y: 70, size: 18 }, { x: 62, y: 58, size: 15 },
      { x: 76, y: 42, size: 16 }
    ];

    positions.forEach((p, i) => {
      const bloom = buildBouquetBloom({
        x: p.x, y: p.y, size: p.size,
        colors: palette[i % palette.length],
        delay: i * 0.15,
      });
      flowersEl.appendChild(bloom);
    });

    wrap.appendChild(flowersEl);
    return wrap;
  }

  function buildCat({ size = 100, idle = true } = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'cat-mini' + (idle ? ' cat-idle' : '');
    wrap.innerHTML = `
      <svg viewBox="0 0 160 150" style="overflow:visible; width:${size}px;">
        <ellipse cx="80" cy="140" rx="46" ry="7" fill="rgba(138,106,90,0.18)"/>
        <path class="cat-tail-idle" d="M118 95 Q150 90 145 55 Q142 38 122 45"
          fill="none" stroke="#F0964A" stroke-width="12" stroke-linecap="round"/>
        <ellipse cx="82" cy="100" rx="42" ry="28" fill="#F0964A"/>
        <path d="M58 100 Q58 122 82 122 Q106 122 106 100 Z" fill="#FFF3E4"/>
        <circle cx="60" cy="62" r="30" fill="#F0964A"/>
        <circle cx="50" cy="60" r="4" fill="#3B2417"/>
        <circle cx="70" cy="58" r="4" fill="#3B2417"/>
        <circle cx="60" cy="70" r="2.4" fill="#FF8FA3"/>
        <path d="M55 74 Q60 78 65 74" stroke="#3B2417" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      </svg>
    `;
    return wrap;
  }

  /* ---------------------------------------------------------
     MOUNT SCENE ELEMENTS
  --------------------------------------------------------- */
  function mountScenes() {
    const heroCakeWrap = $('#hero-cake-wrap');
    const heroBouquetMini = $('#hero-bouquet-mini');
    const heroCat = $('#hero-cat');
    const cakeStage = $('#cake-stage');

    if (heroCakeWrap) heroCakeWrap.appendChild(buildCake());
    if (heroBouquetMini) heroBouquetMini.appendChild(buildBouquet());
    if (heroCat) heroCat.appendChild(buildCat({ size: 110 }));
    if (cakeStage) cakeStage.appendChild(buildCake({ big: true }));
  }

  function setupCompanionFallback() {
    const img = $('#companion-photo');
    if (!img) return;
    img.addEventListener('error', () => window.handleImageError(img), { once: true });
    if (img.complete && img.naturalWidth === 0) window.handleImageError(img);
  }

  function spawnDecor(container, type, count) {
    if (!container) return;
    const emojiFor = { heart: '💗', petal: '🌸', sparkle: '✨' };
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = `decor-${type}`;
      el.style.cssText = `position:absolute; left:${rand(0, 100)}%; top:${rand(0, 100)}%; pointer-events:none;`;
      el.textContent = emojiFor[type] || '✨';
      container.appendChild(el);
    }
  }

  /* ---------------------------------------------------------
     LOADING SCREEN
  --------------------------------------------------------- */
  function initLoadingScreen() {
    const screen = $('#loading-screen');
    if (!screen) return;

    const fill = $('#paw-progress-fill');
    const percentLabel = $('#loading-percent');
    const messageEl = $('#loading-message');
    const catTrack = $('#loading-cat');
    const pawTrail = $('#paw-trail');

    const messages = [
      'Preparing Birthday Surprise...',
      'Gathering Flowers...',
      'Decorating the Cake...',
      'Inviting Cute Cats...',
      'Wrapping Love and Wishes...',
      'Almost Ready...',
    ];

    let pawInterval = setInterval(() => {
      if (!catTrack || !pawTrail) return;
      const mark = document.createElement('span');
      mark.className = 'paw-mark';
      mark.textContent = '🐾';
      const trackParent = catTrack.parentElement;
      if (!trackParent) return;
      
      // Calculate position asynchronously without layout thrashing
      const progressRatio = parseFloat(fill.style.width) / 100 || 0;
      mark.style.left = `calc(${progressRatio * 100}% - 10px)`;
      mark.style.top = '15px';
      
      pawTrail.appendChild(mark);
      setTimeout(() => mark.remove(), 1200);
    }, 300);

    let progress = 0;
    let msgIndex = 0;

    const tick = setInterval(() => {
      progress += rand(5, 12);
      if (progress >= 100) progress = 100;
      if (fill) fill.style.width = progress + '%';
      if (percentLabel) percentLabel.textContent = Math.floor(progress) + '%';
      if (catTrack) catTrack.style.transform = `translateX(${progress * 2.8}px)`;

      const newMsgIndex = Math.min(messages.length - 1, Math.floor((progress / 100) * messages.length));
      if (newMsgIndex !== msgIndex && messageEl) {
        msgIndex = newMsgIndex;
        messageEl.textContent = messages[msgIndex];
      }

      if (progress >= 100) {
        clearInterval(tick);
        clearInterval(pawInterval);
        finishLoading();
      }
    }, 200);

    function finishLoading() {
      setTimeout(() => {
        screen.classList.add('fade-out');
        revealSite();
        setTimeout(() => screen.remove(), 800);
      }, 400);
    }
  }

  function revealSite() {
    const site = $('#site');     if (!site) return;     site.classList.remove('hidden-site');   }    /* ---------------------------------------------------------      DOT NAV ACTIVE STATE   --------------------------------------------------------- */   function initDotNav() {     const dots = $$('.dot-nav .dot');
    if (!dots.length) return;
    const sections = dots.map((d) => document.querySelector(d.getAttribute('href')));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sections.indexOf(entry.target);
          dots.forEach((d) => d.classList.remove('active'));
          if (dots[idx]) dots[idx].classList.add('active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach((s) => s && observer.observe(s));
  }

  /* ---------------------------------------------------------
     CAKE / WISH INTERACTION
  --------------------------------------------------------- */
  function initWish() {
    const cakeStage = $('#cake-stage');
    const wishSent = $('#wish-sent');
    if (!cakeStage) return;
    let blown = false;

    cakeStage.addEventListener('click', () => {
      if (blown) return;
      blown = true;
      const flame = $('[data-flame]', cakeStage);

      if (flame) flame.classList.add('out');
      if (wishSent) wishSent.classList.remove('hidden');

      launchCelebration({ heavy: true, origin: cakeStage.getBoundingClientRect() });
    });
  }

  /* ---------------------------------------------------------
     ENVELOPE / LETTER
  --------------------------------------------------------- */
  function initEnvelope() {
    const envelope = $('#envelope');
    const hint = $('#envelope-hint');
    if (!envelope) return;
    envelope.addEventListener('click', () => {
      const opening = !envelope.classList.contains('open');
      envelope.classList.toggle('open');
      if (hint) hint.textContent = opening ? 'tap the envelope to close' : 'tap the envelope to open';
    });
  }

  /* ---------------------------------------------------------
     BUTTONS: celebrate / scroll shortcuts
  --------------------------------------------------------- */
  function initButtons() {
    const celebrateBtn = $('#celebrate-btn');
    const wishScrollBtn = $('#wish-scroll-btn');
    const letterScrollBtn = $('#letter-scroll-btn');

    if (celebrateBtn) {
      celebrateBtn.addEventListener('click', (e) => {
        launchCelebration({ heavy: true, origin: e.target.getBoundingClientRect() });
      });
    }

    if (wishScrollBtn) {
      wishScrollBtn.addEventListener('click', () => {
        const cakeSection = $('#cake');
        if (cakeSection) cakeSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (letterScrollBtn) {
      letterScrollBtn.addEventListener('click', () => {
        const gallerySection = $('#gallery');
        if (gallerySection) gallerySection.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  /* ---------------------------------------------------------
     CELEBRATION ENGINE
  --------------------------------------------------------- */
  const celebCanvas = document.getElementById('celebration-canvas');
  const cctx = celebCanvas ? celebCanvas.getContext('2d') : null;
  let celebParticles = [];
  let celebAnimId = null;

  function resizeCelebCanvas() {
    if (!celebCanvas || !cctx) return;
    celebCanvas.width = window.innerWidth * devicePixelRatio;
    celebCanvas.height = window.innerHeight * devicePixelRatio;
    celebCanvas.style.width = window.innerWidth + 'px';
    celebCanvas.style.height = window.innerHeight + 'px';
    cctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener('resize', resizeCelebCanvas);
  resizeCelebCanvas();

  const CELEB_COLORS = ['#FFB6C9', '#F9E8EF', '#C98E9D', '#D9B67E', '#FF8FA9', '#FFF9F5'];

  function launchCelebration({ heavy = false, origin } = {}) {
    if (prefersReducedMotion || !celebCanvas) return;
    const originX = origin ? origin.left + origin.width / 2 : window.innerWidth / 2;
    const originY = origin ? origin.top : window.innerHeight * 0.3;
    const count = heavy ? 80 : 40;

    for (let i = 0; i < count; i++) {
      celebParticles.push(makeParticle(originX, originY));
    }

    if (!celebAnimId) animateCelebration();
  }

  function makeParticle(x, y) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(2, 7);
    return {
      born: Date.now(),
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - rand(2, 4),
      size: rand(5, 9),
      color: CELEB_COLORS[Math.floor(rand(0, CELEB_COLORS.length))],
      life: rand(2000, 3500),
    };
  }

  function animateCelebration() {
    if (!cctx) return;
    cctx.clearRect(0, 0, celebCanvas.width, celebCanvas.height);
    const now = Date.now();

    // Memory-leak fix: strictly filter out expired particles inline
    celebParticles = celebParticles.filter((p) => now - p.born < p.life);

    celebParticles.forEach((p) => {
      const age = (now - p.born) / p.life;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // Gravity

      cctx.save();
      cctx.globalAlpha = Math.max(0, 1 - age);
      cctx.fillStyle = p.color;
      cctx.beginPath();
      cctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      cctx.fill();
      cctx.restore();
    });

    if (celebParticles.length > 0) {
      celebAnimId = requestAnimationFrame(animateCelebration);
    } else {
      celebAnimId = null;
      cctx.clearRect(0, 0, celebCanvas.width, celebCanvas.height);
    }
  }

  /* ---------------------------------------------------------
     BACKGROUND MUSIC
  --------------------------------------------------------- */
  function initMusic() {
    const audio = $('#bg-music');
    const toggleBtn = $('#music-toggle');
    const icon = $('#music-icon');
    const muteBtn = $('#mute-toggle');
    const volumeSlider = $('#volume-slider');
    const prompt = $('#music-prompt');
    if (!audio) return;

    audio.volume = 0.55;

    function play() {
      audio.play().then(() => {
        if (icon) icon.textContent = '🎵';
        if (prompt) prompt.classList.remove('show');
      }).catch(() => {
        if (prompt) prompt.classList.add('show');
      });
    }

    function pause() {
      audio.pause();
      if (icon) icon.textContent = '🎶';
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (audio.paused) play(); else pause();
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        muteBtn.textContent = audio.muted ? '🔇' : '🔊';
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
      });
    }

    const tapToStart = () => {
      if (audio.paused) play();
      document.removeEventListener('click', tapToStart);
    };
    document.addEventListener('click', tapToStart);
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    mountScenes();
    setupCompanionFallback();
    initDotNav();
    initWish();
    initEnvelope();
    initButtons();
    initMusic();
    initLoadingScreen();
  });
})();
