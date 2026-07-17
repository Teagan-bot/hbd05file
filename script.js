/* ============================================================
   HAPPY BIRTHDAY MARI — script.js
   Vanilla JS only. No frameworks.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     UTILITIES
  --------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
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
      <div class="cake-tier cake-tier-1">
        <div class="cake-drip"></div>
        <div class="cake-gold-band"></div>
        <span class="cake-heart" style="left:10%;top:8px;">💗</span>
        <span class="cake-heart" style="right:10%;top:8px;">💗</span>
      </div>
      <div class="cake-tier cake-tier-2">
        <div class="cake-drip"></div>
        <div class="cake-gold-band"></div>
        <span class="cake-berry" style="left:14%;top:10px;"></span>
        <span class="cake-berry" style="right:14%;top:10px;"></span>
        <span class="cake-mini-flower" style="left:44%;top:6px;">🌸</span>
      </div>
      <div class="cake-tier cake-tier-3">
        <div class="cake-drip"></div>
        <div class="cake-gold-band"></div>
        ${Array.from({ length: 6 }).map((_, i) =>
          `<span class="cake-pearl" style="left:${10 + i * 14}%; top:14px;"></span>`).join('')}
        <span class="cake-mini-flower" style="left:20%; bottom:6px;">🌷</span>
        <span class="cake-mini-flower" style="right:20%; bottom:6px;">🌸</span>
      </div>
    `;
    if (big) wrap.style.transform = 'scale(1.15)';
    return wrap;
  }

  function buildBouquetBloom({ x, y, size, colors, delay }) {
    const bloom = document.createElement('div');
    bloom.className = 'bloom';
    bloom.style.left = x + '%';
    bloom.style.bottom = y + 'px';
    bloom.style.animation = `petal-fall-none 0s`; // placeholder, sway handled by parent
    bloom.innerHTML = `
      <div class="bloom-petal-ring" style="animation: bouquet-sway ${rand(3.5,5.5)}s ease-in-out ${delay}s infinite; transform-origin:bottom center;">
        ${colors.map((c, i) => `<span style="background:${c}; transform: translate(-50%,-50%) rotate(${i * 60}deg) translateY(-7px); width:${size}px; height:${size*1.3}px;"></span>`).join('')}
        <div style="position:absolute; left:50%; top:50%; width:${size*0.5}px; height:${size*0.5}px; border-radius:50%; background:#D9B67E; transform:translate(-50%,-50%);"></div>
      </div>
    `;
    return bloom;
  }

  function buildBouquet() {
    const wrap = document.createElement('div');
    wrap.className = 'bouquet';
    wrap.style.width = '100%';

    const flowersEl = document.createElement('div');
    flowersEl.className = 'bouquet-flowers';

    const palette = [
      ['#FF9EBB', '#FFC4D6', '#FFD9E4'], // rose
      ['#FFB6C9', '#FFE1EC', '#FF8FA9'], // tulip
      ['#FFD6E8', '#FFF0F5', '#FFB6C9'], // cherry blossom
      ['#F7A8C4', '#FFC9DB', '#F58FAF'], // peony
    ];

    const positions = [
      { x: 18, y: 40, size: 16 }, { x: 32, y: 60, size: 14 },
      { x: 48, y: 70, size: 18 }, { x: 62, y: 58, size: 15 },
      { x: 76, y: 42, size: 16 }, { x: 40, y: 30, size: 12 },
      { x: 58, y: 32, size: 12 }, { x: 25, y: 20, size: 10 },
      { x: 70, y: 22, size: 10 },
    ];

    positions.forEach((p, i) => {
      const bloom = buildBouquetBloom({
        x: p.x, y: p.y, size: p.size,
        colors: palette[i % palette.length],
        delay: i * 0.15,
      });
      flowersEl.appendChild(bloom);
    });

    // baby's breath dots
    for (let i = 0; i < 14; i++) {
      const dot = document.createElement('span');
      dot.style.cssText = `position:absolute; left:${rand(10,90)}%; bottom:${rand(20,80)}px; width:4px; height:4px; border-radius:50%; background:#fff; box-shadow:0 0 3px rgba(255,255,255,0.9);`;
      flowersEl.appendChild(dot);
    }

    const wrapPaper = document.createElement('div');
    wrapPaper.className = 'bouquet-wrap';
    wrapPaper.innerHTML = `<div class="bouquet-ribbon"></div>`;

    wrap.appendChild(flowersEl);
    wrap.appendChild(wrapPaper);
    return wrap;
  }

  function buildCat({ size = 100, idle = true } = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'cat-mini' + (idle ? ' cat-idle' : '');
    wrap.innerHTML = `
      <svg viewBox="0 0 160 150" style="overflow:visible;">
        <ellipse cx="80" cy="140" rx="46" ry="7" fill="rgba(138,106,90,0.18)"/>
        <path class="cat-tail-idle" d="M118 95 Q150 90 145 55 Q142 38 122 45"
          fill="none" stroke="#F0964A" stroke-width="12" stroke-linecap="round"/>
        <ellipse cx="82" cy="100" rx="42" ry="28" fill="#F0964A"/>
        <path d="M58 100 Q58 122 82 122 Q106 122 106 100 Z" fill="#FFF3E4"/>
        <circle class="cat-ear-twitch" cx="55" cy="58" r="4" fill="#F0964A" opacity="0"/>
        <g class="cat-ear-twitch">
          <path d="M42 42 L34 20 L54 38 Z" fill="#F0964A"/>
          <path d="M42 40 L37 26 L48 36 Z" fill="#FFC4D6"/>
        </g>
        <path d="M78 40 L86 16 L64 36 Z" fill="#F0964A"/>
        <path d="M78 38 L83 24 L70 34 Z" fill="#FFC4D6"/>
        <circle cx="60" cy="62" r="30" fill="#F0964A"/>
        <circle class="cat-blink-slow" cx="50" cy="60" r="4" fill="#3B2417"/>
        <circle class="cat-blink-slow" cx="70" cy="58" r="4" fill="#3B2417"/>
        <circle cx="60" cy="70" r="2.4" fill="#FF8FA3"/>
        <path d="M55 74 Q60 78 65 74" stroke="#3B2417" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M30 66 L46 68 M30 72 L46 71 M74 68 L90 66 M74 71 L90 72" stroke="#fff" stroke-width="1" opacity="0.7"/>
        <!-- birthday hat -->
        <g transform="translate(60,22) rotate(-8)">
          <path d="M-14 8 L0 -22 L14 8 Z" fill="#FFB6C9"/>
          <circle cx="0" cy="-22" r="4" fill="#fff"/>
          <rect x="-14" y="5" width="28" height="5" rx="2" fill="#D9B67E"/>
        </g>
        <!-- ribbon collar -->
        <path d="M62 96 Q82 102 102 96" stroke="#FF8FA9" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="82" cy="100" r="4" fill="#C98E9D"/>
        <!-- flower near ear -->
        <g transform="translate(30,44)">
          <circle r="4" fill="#FF7CA3"/>
          <circle cx="5" cy="-2" r="3.4" fill="#FFB6C9"/>
          <circle cx="-5" cy="-2" r="3.4" fill="#FFB6C9"/>
          <circle cx="0" cy="-6" r="3.4" fill="#FFD2E0"/>
        </g>
      </svg>
    `;
    wrap.style.width = size + 'px';
    return wrap;
  }

  /* ---------------------------------------------------------
     MOUNT SCENE ELEMENTS
  --------------------------------------------------------- */
  function mountScenes() {
    $('#hero-cake-wrap').appendChild(buildCake());
    $('#hero-bouquet-mini').appendChild(buildBouquet());
    $('#hero-cat').appendChild(buildCat({ size: 110 }));

    $('#bouquet-stage').appendChild(buildBouquet());

    $('#cake-stage').appendChild(buildCake({ big: true }));

    const decor = $('.companion-decor');
    if (decor) {
      decor.appendChild(scatterEmoji(['💗', '✨', '🐾', '🌸'], 10));
    }

    // Companion photo fallback (if assets/my-cat.png is missing) is handled
    // separately by setupCompanionFallback(), which swaps in an illustrated
    // placeholder so the layout never breaks.
  }

  // simpler + robust companion fallback: check image load, swap manually
  function setupCompanionFallback() {
    const img = $('#companion-photo');
    if (!img) return;
    const frame = img.parentElement;
    const showFallback = () => {
      if ($('#companion-fallback')) return;
      const fb = document.createElement('div');
      fb.className = 'companion-fallback';
      fb.id = 'companion-fallback';
      frame.innerHTML = '';
      frame.appendChild(fb);
    };
    img.addEventListener('error', showFallback, { once: true });
    // if already broken (cached) recheck
    if (img.complete && img.naturalWidth === 0) showFallback();
  }

  function scatterEmoji(list, count) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.textContent = list[Math.floor(rand(0, list.length))];
      span.style.cssText = `position:absolute; left:${rand(0,100)}%; top:${rand(0,100)}%; font-size:${rand(12,20)}px; opacity:${rand(0.3,0.7)}; animation: sparkle-twinkle ${rand(2,4)}s ease-in-out ${rand(0,2)}s infinite;`;
      frag.appendChild(span);
    }
    const holder = document.createElement('div');
    holder.style.cssText = 'position:absolute; inset:0;';
    holder.appendChild(frag);
    return holder;
  }

  /* ---------------------------------------------------------
     LOADING SCREEN
  --------------------------------------------------------- */
  function initLoadingScreen() {
    const screen = $('#loading-screen');
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

    // spawn floating petals/hearts/sparkles on loading screen
    spawnDecor($('.loading-petals'), 'petal', 16);
    spawnDecor($('.loading-hearts'), 'heart', 10);
    spawnDecor($('.loading-sparkles'), 'sparkle', 14);

    catTrack.classList.add('walking');
    let pawInterval = setInterval(() => {
      const mark = document.createElement('span');
      mark.className = 'paw-mark';
      const trackRect = catTrack.parentElement.getBoundingClientRect();
      const catRect = catTrack.getBoundingClientRect();
      const relLeft = catRect.left - trackRect.left + catRect.width * 0.35;
      mark.style.left = relLeft + 'px';
      mark.style.top = (catRect.top - trackRect.top + catRect.height * 0.78) + 'px';
      pawTrail.appendChild(mark);
      setTimeout(() => mark.remove(), 1500);
    }, 220);

    let progress = 0;
    let msgIndex = 0;
    messageEl.textContent = messages[0];

    const tick = setInterval(() => {
      progress += rand(4, 9);
      if (progress >= 100) progress = 100;
      fill.style.width = progress + '%';
      percentLabel.textContent = Math.floor(progress) + '%';

      const newMsgIndex = Math.min(messages.length - 1, Math.floor((progress / 100) * messages.length));
      if (newMsgIndex !== msgIndex) {
        msgIndex = newMsgIndex;
        messageEl.style.opacity = 0;
        setTimeout(() => {
          messageEl.textContent = messages[msgIndex];
          messageEl.style.opacity = 1;
        }, 180);
      }

      if (progress >= 100) {
        clearInterval(tick);
        clearInterval(pawInterval);
        finishLoading();
      }
    }, 220);

    function finishLoading() {
      // cat jump celebration + confetti burst on loading screen
      catTrack.style.transition = 'transform 0.5s ease';
      catTrack.style.transform = 'translateY(-20px) scale(1.1)';
      burstConfettiOnce(screen);

      setTimeout(() => {
        screen.classList.add('fade-out');
        revealSite();
        setTimeout(() => screen.remove(), 1000);
      }, 700);
    }
  }

  function spawnDecor(container, type, count) {
    if (!container) return;
    const emojiFor = { heart: '💗' };
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = `decor-${type}`;
      el.style.left = rand(0, 100) + '%';
      const dur = rand(5, 11);
      const delay = rand(0, 6);
      if (type === 'petal') {
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = delay + 's';
        el.style.top = rand(-10, 0) + '%';
      } else if (type === 'heart') {
        el.textContent = emojiFor.heart;
        el.style.bottom = rand(-10, 0) + '%';
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = delay + 's';
      } else if (type === 'sparkle') {
        el.style.top = rand(0, 100) + '%';
        el.style.animationDelay = delay + 's';
      }
      container.appendChild(el);
    }
  }

  function burstConfettiOnce(container) {
    for (let i = 0; i < 26; i++) {
      const piece = document.createElement('div');
      const colors = ['#FFB6C9', '#D9B67E', '#C98E9D', '#FFF9F5', '#FF8FA9'];
      piece.style.cssText = `
        position:absolute; left:50%; top:40%; width:8px; height:8px;
        background:${colors[Math.floor(rand(0, colors.length))]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        z-index:5; pointer-events:none;
      `;
      container.appendChild(piece);
      const angle = rand(0, Math.PI * 2);
      const dist = rand(80, 260);
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist - 60;
      piece.animate([
        { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${x}px, ${y}px) rotate(${rand(180, 720)}deg)`, opacity: 0 },
      ], { duration: rand(900, 1600), easing: 'cubic-bezier(.2,.8,.2,1)' });
      setTimeout(() => piece.remove(), 1700);
    }
  }

  function revealSite() {
    const site = $('#site');
    site.classList.remove('hidden-site');
    site.style.opacity = 0;
    requestAnimationFrame(() => {
      site.style.transition = 'opacity 1s ease';
      site.style.opacity = 1;
    });
  }

  /* ---------------------------------------------------------
     AMBIENT BACKGROUND PARTICLES (petals / hearts / sparkles / paw prints for whole site)
  --------------------------------------------------------- */
  function initAmbientDecor() {
    document.querySelectorAll('.section').forEach((section) => {
      const layer = document.createElement('div');
      layer.style.cssText = 'position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:0;';
      spawnDecor(layer, 'petal', 5);
      spawnDecor(layer, 'sparkle', 6);
      const paw = document.createElement('span');
      paw.className = 'decor-paw';
      paw.textContent = '🐾';
      paw.style.left = rand(5, 90) + '%';
      paw.style.top = rand(10, 85) + '%';
      layer.appendChild(paw);
      section.style.position = section.style.position || 'relative';
      section.prepend(layer);
    });
  }

  /* ---------------------------------------------------------
     DOT NAV ACTIVE STATE
  --------------------------------------------------------- */
  function initDotNav() {
    const dots = $$('.dot-nav .dot');
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
    let blown = false;

    cakeStage.addEventListener('click', () => {
      if (blown) return;
      blown = true;
      const flame = $('[data-flame]', cakeStage);
      const smoke = $('[data-smoke]', cakeStage);
      const glow = $('.cake-glow', cakeStage);

      if (flame) flame.classList.add('out');
      if (smoke) smoke.classList.add('rise');
      if (glow) glow.classList.add('on');

      wishSent.classList.remove('hidden');
      launchCelebration({ heavy: true, origin: cakeStage.getBoundingClientRect() });
    });
  }

  /* ---------------------------------------------------------
     ENVELOPE / LETTER
  --------------------------------------------------------- */
  function initEnvelope() {
    const envelope = $('#envelope');
    const hint = $('#envelope-hint');
    envelope.addEventListener('click', () => {
      const opening = !envelope.classList.contains('open');
      envelope.classList.toggle('open');
      hint.textContent = opening ? 'tap the envelope to close' : 'tap the envelope to open';
      if (opening) {
        spawnDecor(envelope.parentElement, 'heart', 6);
      }
    });
  }

  /* ---------------------------------------------------------
     BUTTONS: celebrate / scroll shortcuts
  --------------------------------------------------------- */
  function initButtons() {
    $('#celebrate-btn').addEventListener('click', (e) => {
      launchCelebration({ heavy: true, origin: e.target.getBoundingClientRect() });
      const heroCat = $('#hero-cat .cat-mini');
      if (heroCat) {
        heroCat.classList.remove('celebrating');
        void heroCat.offsetWidth;
        heroCat.classList.add('celebrating');
      }
      const heroCake = $('#hero-cake-wrap .cake-glow');
      if (heroCake) { heroCake.classList.add('on'); setTimeout(() => heroCake.classList.remove('on'), 1800); }
    });

    $('#wish-scroll-btn').addEventListener('click', () => {
      $('#cake').scrollIntoView({ behavior: 'smooth' });
    });
    $('#letter-scroll-btn').addEventListener('click', () => {
      $('#letter').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     CELEBRATION ENGINE (confetti / petals / hearts / balloons / gold particles)
  --------------------------------------------------------- */
  const celebCanvas = document.getElementById('celebration-canvas');
  const cctx = celebCanvas ? celebCanvas.getContext('2d') : null;
  let celebParticles = [];
  let celebAnimId = null;

  function resizeCelebCanvas() {
    if (!celebCanvas) return;
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
    if (prefersReducedMotion) return;
    const originX = origin ? origin.left + origin.width / 2 : window.innerWidth / 2;
    const originY = origin ? origin.top : window.innerHeight * 0.3;
    const count = heavy ? 90 : 50;

    for (let i = 0; i < count; i++) {
      const kind = pickKind();
      celebParticles.push(makeParticle(kind, originX, originY));
    }
    // balloons rise from bottom
    for (let i = 0; i < (heavy ? 6 : 3); i++) {
      celebParticles.push(makeBalloon());
    }

    if (!celebAnimId) animateCelebration();
    setTimeout(() => {
      celebParticles = celebParticles.filter((p) => Date.now() - p.born < 100); // safety trim handled in loop too
    }, 6000);
  }

  function pickKind() {
    const r = Math.random();
    if (r < 0.35) return 'confetti';
    if (r < 0.55) return 'petal';
    if (r < 0.72) return 'heart';
    if (r < 0.88) return 'sparkle';
    return 'gold';
  }

  function makeParticle(kind, x, y) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(2, 7);
    return {
      kind, born: Date.now(),
      x, y,
      vx: Math.cos(angle) * speed * rand(0.4, 1),
      vy: Math.sin(angle) * speed - rand(2, 5),
      rot: rand(0, 360),
      vr: rand(-8, 8),
      size: rand(5, 10),
      color: CELEB_COLORS[Math.floor(rand(0, CELEB_COLORS.length))],
      gravity: kind === 'heart' || kind === 'sparkle' ? -0.02 : 0.12,
      life: rand(2200, 4200),
    };
  }

  function makeBalloon() {
    return {
      kind: 'balloon', born: Date.now(),
      x: rand(window.innerWidth * 0.1, window.innerWidth * 0.9),
      y: window.innerHeight + 40,
      vx: rand(-0.4, 0.4), vy: -rand(1.2, 2.2),
      size: rand(22, 32),
      color: CELEB_COLORS[Math.floor(rand(0, CELEB_COLORS.length))],
      life: rand(4000, 6000),
    };
  }

  function animateCelebration() {
    cctx.clearRect(0, 0, celebCanvas.width, celebCanvas.height);
    const now = Date.now();
    celebParticles = celebParticles.filter((p) => now - p.born < p.life);

    celebParticles.forEach((p) => {
      const age = (now - p.born) / p.life;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity !== undefined ? p.gravity : 0.1;
      p.rot += p.vr || 0;

      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.globalAlpha = 1 - age;

      if (p.kind === 'confetti') {
        cctx.rotate((p.rot * Math.PI) / 180);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      } else if (p.kind === 'petal') {
        cctx.rotate((p.rot * Math.PI) / 180);
        cctx.fillStyle = p.color;
        cctx.beginPath();
        cctx.ellipse(0, 0, p.size / 2, p.size / 3, 0, 0, Math.PI * 2);
        cctx.fill();
      } else if (p.kind === 'heart') {
        drawHeart(cctx, 0, 0, p.size * 0.9, p.color);
      } else if (p.kind === 'sparkle') {
        cctx.fillStyle = '#fff';
        cctx.shadowColor = '#fff';
        cctx.shadowBlur = 8;
        cctx.beginPath();
        cctx.arc(0, 0, p.size / 4, 0, Math.PI * 2);
        cctx.fill();
      } else if (p.kind === 'gold') {
        cctx.fillStyle = '#D9B67E';
        cctx.rotate((p.rot * Math.PI) / 180);
        cctx.beginPath();
        cctx.moveTo(0, -p.size / 2);
        cctx.lineTo(p.size / 2, 0);
        cctx.lineTo(0, p.size / 2);
        cctx.lineTo(-p.size / 2, 0);
        cctx.closePath();
        cctx.fill();
      } else if (p.kind === 'balloon') {
        cctx.fillStyle = p.color;
        cctx.beginPath();
        cctx.ellipse(0, 0, p.size / 2, p.size / 1.6, 0, 0, Math.PI * 2);
        cctx.fill();
        cctx.strokeStyle = p.color;
        cctx.beginPath();
        cctx.moveTo(0, p.size / 1.6);
        cctx.lineTo(0, p.size / 1.6 + 26);
        cctx.stroke();
      }
      cctx.restore();
    });

    if (celebParticles.length > 0) {
      celebAnimId = requestAnimationFrame(animateCelebration);
    } else {
      celebAnimId = null;
      cctx.clearRect(0, 0, celebCanvas.width, celebCanvas.height);
    }
  }

  function drawHeart(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.fill();
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
    audio.volume = 0.55;

    let userInteracted = false;

    function play() {
      audio.play().then(() => {
        toggleBtn.classList.add('playing');
        icon.textContent = '🎵';
        prompt.classList.remove('show');
      }).catch(() => {
        prompt.classList.add('show');
      });
    }
    function pause() {
      audio.pause();
      toggleBtn.classList.remove('playing');
      icon.textContent = '🎶';
    }

    // attempt autoplay
    play();

    toggleBtn.addEventListener('click', () => {
      userInteracted = true;
      if (audio.paused) play(); else pause();
    });

    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      muteBtn.textContent = audio.muted ? '🔇' : '🔊';
    });

    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value / 100;
    });

    const tapToStart = () => {
      if (!userInteracted && audio.paused) play();
      document.removeEventListener('click', tapToStart);
    };
    document.addEventListener('click', tapToStart);
  }

  /* ---------------------------------------------------------
     GALLERY: pre-check broken images (in case onerror missed due to cache)
  --------------------------------------------------------- */
  function initGalleryFallbacks() {
    $$('.gallery-card img').forEach((img) => {
      if (img.complete && img.naturalWidth === 0) {
        img.parentElement.classList.add('gallery-fallback');
      }
    });
  }

  /* ---------------------------------------------------------
     WANDERING CAT (occasionally walks around and rests near cake)
  --------------------------------------------------------- */
  function initWanderingCat() {
    if (prefersReducedMotion) return;
    const cat = document.createElement('div');
    cat.style.cssText = 'position:fixed; bottom:14px; width:70px; z-index:40; pointer-events:none; left:-80px; transition:left 6s linear;';
    cat.appendChild(buildCat({ size: 70, idle: true }));
    document.body.appendChild(cat);

    function wander() {
      const endX = rand(window.innerWidth * 0.1, window.innerWidth * 0.7);
      cat.style.left = endX + 'px';
      setTimeout(wander, rand(14000, 24000));
    }
    setTimeout(wander, 6000);
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    mountScenes();
    setupCompanionFallback();
    initAmbientDecor();
    initDotNav();
    initWish();
    initEnvelope();
    initButtons();
    initMusic();
    initGalleryFallbacks();
    initWanderingCat();
    initLoadingScreen();
  });
})();
