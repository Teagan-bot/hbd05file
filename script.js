/* ==========================================================================
   GOLDEN DAISY & GOLD DUST CELEBRATION PARTICLES
   ========================================================================== */

class GoldenDaisyParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animating = false;
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Draw a golden daisy with 8 petals and a warm center
  drawDaisy(ctx, x, y, size, rotation, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;

    const petalCount = 8;
    const petalLength = size;
    const petalWidth = size * 0.45;

    // Draw Golden/Cream Petals
    ctx.fillStyle = '#F9F6F0'; // Paper Cream
    for (let i = 0; i < petalCount; i++) {
      ctx.beginPath();
      ctx.rotate((Math.PI * 2) / petalCount);
      ctx.ellipse(0, petalLength / 2, petalWidth / 2, petalLength / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Golden Yellow Center
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = '#E2A03F'; // Golden Daisy Yellow
    ctx.fill();

    // Subtle inner gold border
    ctx.strokeStyle = '#B87A28';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  // Burst explosion/fountain of daisies & gold dust
  triggerWishBurst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 60) {
    for (let i = 0; i < count; i++) {
      const isDaisy = Math.random() > 0.35; // 65% daisies, 35% glowing gold dust
      
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3, // Upward trajectory bias
        size: isDaisy ? Math.random() * 12 + 10 : Math.random() * 4 + 2,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.1,
        opacity: 1,
        fadeRate: Math.random() * 0.012 + 0.005,
        gravity: 0.12,
        friction: 0.98,
        isDaisy: isDaisy
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.render();
    }
  }

  render() {
    if (!this.animating) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Physics update
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.opacity -= p.fadeRate;

      // Remove dead particles
      if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      // Draw particle
      if (p.isDaisy) {
        this.drawDaisy(this.ctx, p.x, p.y, p.size, p.rotation, p.opacity);
      } else {
        // Gold dust sparkle
        this.ctx.save();
        this.ctx.globalAlpha = p.opacity;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = '#E2A03F';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#E2A03F';
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.render());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

/* ==========================================================================
   INITIALIZATION & PAGE INTERACTION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Simulate Loading Screen Progress
  const progressFill = document.getElementById('progress-fill');
  const loadingScreen = document.getElementById('loading-screen');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 25 + 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.style.opacity = '0';
          loadingScreen.style.visibility = 'hidden';
        }
      }, 400);
    }
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }, 200);

  // 2. Initialize Celebration Particle Engine
  const celebrationEngine = new GoldenDaisyParticleEngine('celebration-canvas');

  // 3. Wish Button Event
  const wishButton = document.getElementById('make-wish-btn');
  if (wishButton) {
    wishButton.addEventListener('click', (e) => {
      const rect = wishButton.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      // Burst directly at the button
      celebrationEngine.triggerWishBurst(originX, originY, 70);

      // Delayed secondary burst across top screen
      setTimeout(() => {
        celebrationEngine.triggerWishBurst(window.innerWidth / 2, window.innerHeight / 3, 40);
      }, 350);
    });
  }

  // Expose engine trigger globally
  window.triggerWishDaisies = (x, y, count) => {
    celebrationEngine.triggerWishBurst(x, y, count);
  };
});
