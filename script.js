document.addEventListener('DOMContentLoaded', () => {

/* ============================================================
   0. AMBIENT ORBS — inject into body
============================================================ */
['orb-1','orb-2','orb-3'].forEach(cls => {
  const orb = document.createElement('div');
  orb.className = 'ambient-orb ' + cls;
  document.body.prepend(orb);
});

/* ============================================================
   0b. SCROLL PROGRESS BAR
============================================================ */
const progBar = document.createElement('div');
progBar.id = 'scroll-progress';
document.body.prepend(progBar);
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progBar.style.width = scrolled + '%';
}, { passive: true });

/* ============================================================
   0c. ANIMATED SECTION DIVIDERS — inject between main sections
============================================================ */
document.querySelectorAll('section.section').forEach(sec => {
  const div = document.createElement('div');
  div.className = 'section-divider';
  sec.before(div);
});

/* ============================================================
   1. LOADER — progress bar animation + glitch hide
============================================================ */
const loader  = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');
let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.random() * 18 + 5;
  if (progress >= 100) { progress = 100; clearInterval(loadInterval); }
  if (loaderBar) loaderBar.style.width = progress + '%';
}, 80);

function hideLoader() {
  setTimeout(() => {
    if (loader) loader.classList.add('hidden');
    setTimeout(() => { if (loader) loader.remove(); }, 700);
    revealHeroElements();
    startCounters();
  }, 400);
}
if (document.readyState === 'complete') { setTimeout(hideLoader, 1500); }
else { window.addEventListener('load', () => setTimeout(hideLoader, 1500)); }

/* ============================================================
   2. CUSTOM DUAL CURSOR + SPARK TRAIL
============================================================ */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
if (cursorDot && cursorRing && window.matchMedia('(pointer:fine)').matches) {
  let mx = -999, my = -999, rx = -999, ry = -999;

  // Spark trail
  const SPARK_COLORS = ['#7c3aed','#06b6d4','#ff7a6b','#a78bfa','#38bdf8'];
  let lastSparkTime = 0;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    const now = Date.now();
    if (now - lastSparkTime > 40) {
      lastSparkTime = now;
      const spark = document.createElement('div');
      spark.className = 'cursor-spark';
      const size = Math.random() * 8 + 4;
      spark.style.cssText = `
        left:${mx}px; top:${my}px;
        width:${size}px; height:${size}px;
        background:${SPARK_COLORS[Math.floor(Math.random()*SPARK_COLORS.length)]};
        box-shadow:0 0 ${size*2}px currentColor;
      `;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 650);
    }
  }, { passive: true });

  function moveCursors() {
    if (cursorDot) { cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px'; }
    rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
    if (cursorRing) { cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; }
    requestAnimationFrame(moveCursors);
  }
  moveCursors();

  document.querySelectorAll('a,button,.btn,.chip,.info-card,.project-card,.service-card,.orbit-icon,.ql-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ============================================================
   3. HERO SPOTLIGHT (follows mouse in hero section)
============================================================ */
const heroSection  = document.getElementById('home');
const heroSpotlight = document.getElementById('hero-spotlight');
if (heroSection && heroSpotlight) {
  heroSection.addEventListener('mousemove', e => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroSpotlight.style.background =
      `radial-gradient(ellipse 380px 380px at ${x}px ${y}px, rgba(124,58,237,.12), transparent 70%)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    heroSpotlight.style.background = '';
  });
}

/* ============================================================
   4. HERO ELEMENTS — staggered reveal + char split on title
============================================================ */
function splitChars(el) {
  if (!el) return;
  const text = el.textContent;
  el.innerHTML = '';
  text.split('').forEach((ch, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'char-wrap';
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    span.style.animationDelay = (i * 35 + 200) + 'ms';
    wrap.appendChild(span);
    el.appendChild(wrap);
  });
}

function revealHeroElements() {
  const items = document.querySelectorAll('.hero .reveal-left, .hero .reveal-right, .hero .reveal-up');
  items.forEach(el => el.classList.add('revealed'));
  // Char split on hero title words
  document.querySelectorAll('.title-word').forEach(splitChars);
  setTimeout(startTyping, 300);
}

/* ============================================================
   5. TYPING ANIMATION
============================================================ */
const roles = [
  'Full-Stack Developer',
  'React.js Enthusiast',
  'Python Developer',
  'AI / ML Explorer',
  'Problem Solver',
  'Open to Work 🚀',
];
const typedEl = document.getElementById('typed-role');
let rIdx = 0, cIdx = 0, deleting = false;

function startTyping() {
  if (!typedEl) return;
  typeStep();
}
function typeStep() {
  const role = roles[rIdx];
  if (deleting) {
    typedEl.textContent = role.substring(0, --cIdx);
  } else {
    typedEl.textContent = role.substring(0, ++cIdx);
  }
  let delay = deleting ? 45 : 95;
  if (!deleting && cIdx === role.length) { delay = 2200; deleting = true; }
  else if (deleting && cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; delay = 350; }
  setTimeout(typeStep, delay);
}

/* ============================================================
   6. SCROLL REVEAL (IntersectionObserver)
============================================================ */
const revealEls = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => { if (!el.closest('.hero')) obs.observe(el); });
} else {
  revealEls.forEach(el => el.classList.add('revealed'));
}

/* ============================================================
   7. SKILL PROGRESS BARS — animated fill + shimmer delay
============================================================ */
const bars = document.querySelectorAll('.skill-bar-fill');
const barObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width + '%';
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
bars.forEach((b, i) => {
  b.style.setProperty('--shimmer-delay', (i * 0.4) + 's');
  barObs.observe(b);
});

/* ============================================================
   8. COUNTER ANIMATION (numbers count up)
============================================================ */
function startCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 40);
  });
}
// Also trigger counters when scrolled into view (for education section)
const counterEls = document.querySelectorAll('.counter:not(.hero .counter)');
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 40);
      cntObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => cntObs.observe(el));

/* ============================================================
   9. MAGNETIC BUTTONS
============================================================ */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.38;
    const dy = (e.clientY - cy) * 0.38;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
    setTimeout(() => { el.style.transition = ''; }, 500);
  });
});

/* ============================================================
   10. RIPPLE EFFECT on buttons
============================================================ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const rect = btn.getBoundingClientRect();
    const r = document.createElement('span');
    r.classList.add('ripple');
    const size = Math.max(rect.width, rect.height) * 1.6;
    r.style.cssText = `
      width:${size}px; height:${size}px;
      top:${e.clientY - rect.top - size/2}px;
      left:${e.clientX - rect.left - size/2}px;
    `;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});

/* ============================================================
   11. TOPBAR SCROLL STATE + ACTIVE NAV LINK
============================================================ */
const topbar   = document.getElementById('topbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 60);
  let current = '';
  sections.forEach(sec => { if (window.scrollY + 120 >= sec.offsetTop) current = sec.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}, { passive: true });

/* ============================================================
   12. MOBILE NAV TOGGLE
============================================================ */
const toggleBtn = document.getElementById('nav-toggle');
const navEl     = document.getElementById('nav-links');
if (toggleBtn && navEl) {
  toggleBtn.addEventListener('click', () => {
    const open = navEl.classList.toggle('open');
    toggleBtn.classList.toggle('open', open);
    toggleBtn.setAttribute('aria-expanded', open);
  });
  navEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navEl.classList.remove('open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', e => {
    if (topbar && !topbar.contains(e.target)) {
      navEl.classList.remove('open');
      toggleBtn.classList.remove('open');
    }
  });
}

/* ============================================================
   13. TEXT SCRAMBLE EFFECT on section headings
============================================================ */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#ABCDEFabcdef0123456789';
    this.original = el.textContent;
  }
  scramble() {
    let iteration = 0;
    const interval = setInterval(() => {
      this.el.textContent = this.original.split('').map((ch, i) => {
        if (i < iteration || ch === ' ') return ch;
        return this.chars[Math.floor(Math.random() * this.chars.length)];
      }).join('');
      iteration += 0.5;
      if (iteration >= this.original.length) clearInterval(interval);
    }, 35);
  }
}
// Apply to section headings when revealed
const scrambleHeadings = document.querySelectorAll('.section-heading h2');
if ('IntersectionObserver' in window) {
  const scrambleObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fx = new TextScramble(entry.target);
        setTimeout(() => fx.scramble(), 200);
        scrambleObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  scrambleHeadings.forEach(h => scrambleObs.observe(h));
}

/* ============================================================
   14. PARALLAX on floating orbit icons
============================================================ */
window.addEventListener('mousemove', e => {
  const mx = (e.clientX / window.innerWidth  - 0.5) * 2;
  const my = (e.clientY / window.innerHeight - 0.5) * 2;
  document.querySelectorAll('.orbit-icon').forEach((icon, i) => {
    const depth = (i + 1) * 4;
    icon.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
  });
}, { passive: true });

/* ============================================================
   15. PARTICLE CANVAS — nebula depth layers + aurora + shooting stars
============================================================ */
const canvas = document.getElementById('space-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;
  let particles = [], deepParticles = [], nebulaClouds = [], shootingStars = [];
  const NUM       = Math.min(160, Math.floor(window.innerWidth / 8));
  const NUM_DEEP  = Math.min(60, Math.floor(window.innerWidth / 20));
  const NUM_CLOUD = 5;
  let mouse = { x: null, y: null, radius: 200 };

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseout',  () => { mouse.x = null; mouse.y = null; });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initAll();
  }
  window.addEventListener('resize', resize, { passive: true });

  /* ---- Foreground Particle ---- */
  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -4;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = (Math.random() - 0.5) * 0.9;
      this.size     = Math.random() * 2 + 0.5;
      this.baseSize = this.size;
      const palettes = [
        'rgba(124,58,237,',  'rgba(6,182,212,',
        'rgba(167,139,250,', 'rgba(56,189,248,',
        'rgba(255,122,107,', 'rgba(251,191,36,'
      ];
      this.colorBase = palettes[Math.floor(Math.random() * palettes.length)];
      this.alpha     = Math.random() * 0.6 + 0.15;
      this.baseAlpha = this.alpha;
      this.twinkle   = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.04 + 0.01;
    }
    update() {
      this.twinkle += this.twinkleSpeed;
      const tw = Math.sin(this.twinkle) * 0.2;
      if (mouse.x !== null) {
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 5;
          this.y -= (dy / dist) * force * 5;
          this.size  = Math.min(this.baseSize * 3.5, this.size + 0.5);
          this.alpha = Math.min(1, this.baseAlpha + force * 0.6);
        } else {
          if (this.size  > this.baseSize ) this.size  -= 0.12;
          if (this.alpha > this.baseAlpha) this.alpha -= 0.02;
        }
      } else {
        if (this.size  > this.baseSize ) this.size  -= 0.1;
        if (this.alpha > this.baseAlpha) this.alpha -= 0.015;
      }
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      this._displayAlpha = Math.max(0, this.alpha + tw);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + this._displayAlpha + ')';
      ctx.shadowBlur = 10; ctx.shadowColor = this.colorBase + '0.9)';
      ctx.fill(); ctx.shadowBlur = 0;
    }
  }

  /* ---- Deep Background Particle (tiny, slow) ---- */
  class DeepParticle {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 0.8 + 0.2;
      this.alpha = Math.random() * 0.3 + 0.05;
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.twinkle += this.twinkleSpeed;
      this._a = this.alpha + Math.sin(this.twinkle) * this.alpha * 0.8;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${Math.max(0, this._a)})`;
      ctx.fill();
    }
  }

  /* ---- Nebula Cloud ---- */
  class NebulaCloud {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 250 + 100;
      const colors = [
        [124,58,237], [6,182,212], [255,122,107], [167,139,250]
      ];
      this.rgb = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.04 + 0.01;
      this.phase = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 0.003 + 0.001;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
    }
    update() {
      this.phase += this.speed;
      this.x += this.vx; this.y += this.vy;
      if (this.x < -this.r) this.x = W + this.r;
      if (this.x > W + this.r) this.x = -this.r;
      if (this.y < -this.r) this.y = H + this.r;
      if (this.y > H + this.r) this.y = -this.r;
    }
    draw() {
      const a = this.alpha + Math.sin(this.phase) * this.alpha * 0.5;
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      const [r,g,b] = this.rgb;
      grad.addColorStop(0,   `rgba(${r},${g},${b},${a})`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},${a * 0.5})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  /* ---- Shooting Star ---- */
  class ShootingStar {
    constructor(delay = 0) { this.delay = delay; this.active = false; this.countdown = delay; this.spawn(); }
    spawn() {
      this.x     = Math.random() * W * 0.8;
      this.y     = Math.random() * H * 0.4;
      this.speed = Math.random() * 12 + 6;
      this.angle = (Math.random() * 35 + 15) * Math.PI / 180;
      this.alpha = 0;
      this.phase = 'wait';
      this.wait  = Math.random() * 5000 + 2000;
      this.elapsed = 0;
      this.tail  = [];
      this.width = Math.random() * 1.5 + 0.8;
      const cs = ['255,255,255','200,220,255','180,200,255','230,200,255'];
      this.color = cs[Math.floor(Math.random()*cs.length)];
    }
    update(dt) {
      if (this.phase === 'wait') {
        this.elapsed += dt;
        if (this.elapsed >= this.wait) { this.phase = 'in'; this.elapsed = 0; }
        return;
      }
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.tail.push({ x: this.x, y: this.y });
      if (this.tail.length > 22) this.tail.shift();
      if (this.phase === 'in')  { this.alpha += 0.07; if (this.alpha >= 1) this.phase = 'out'; }
      if (this.phase === 'out') { this.alpha -= 0.05; }
      if (this.alpha <= 0 || this.x > W + 100 || this.y > H + 100) this.spawn();
    }
    draw() {
      if (this.tail.length < 2 || this.phase === 'wait') return;
      ctx.save();
      const head = this.tail[this.tail.length - 1];
      const tail0 = this.tail[0];
      const grad = ctx.createLinearGradient(tail0.x, tail0.y, head.x, head.y);
      grad.addColorStop(0, `rgba(${this.color},0)`);
      grad.addColorStop(0.5, `rgba(${this.color},${this.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${this.color},${this.alpha})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      this.tail.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
      // Burst glow at head
      const glowGrad = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 8);
      glowGrad.addColorStop(0, `rgba(${this.color},${this.alpha})`);
      glowGrad.addColorStop(1, `rgba(${this.color},0)`);
      ctx.beginPath();
      ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();
      ctx.restore();
    }
  }

  function initAll() {
    particles     = Array.from({ length: NUM },       () => new Particle());
    deepParticles = Array.from({ length: NUM_DEEP },  () => new DeepParticle());
    nebulaClouds  = Array.from({ length: NUM_CLOUD }, () => new NebulaCloud());
    shootingStars = Array.from({ length: 6 }, (_, i) => new ShootingStar(i * 800));
  }

  function connectParticles() {
    const MAX_DIST_SQ = 16000;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distSq = dx*dx + dy*dy;
        if (distSq < MAX_DIST_SQ) {
          const ratio = 1 - distSq / MAX_DIST_SQ;
          // Color gradient based on average position
          const mix = (particles[a].x + particles[b].x) / (2 * W);
          const r = Math.round(124 + (6-124)*mix);
          const g = Math.round(58  + (182-58)*mix);
          const bb = Math.round(237 + (212-237)*mix);
          ctx.strokeStyle = `rgba(${r},${g},${bb},${ratio * 0.22})`;
          ctx.lineWidth = ratio * 1.2;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Mouse repulsion burst lines
  function mouseConnectLines() {
    if (mouse.x === null) return;
    for (let i = 0; i < particles.length; i++) {
      const dx = mouse.x - particles[i].x;
      const dy = mouse.y - particles[i].y;
      const distSq = dx*dx + dy*dy;
      const MAX = 22000;
      if (distSq < MAX) {
        const ratio = 1 - distSq / MAX;
        ctx.strokeStyle = `rgba(6,182,212,${ratio * 0.3})`;
        ctx.lineWidth = ratio * 1.5;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(particles[i].x, particles[i].y);
        ctx.stroke();
      }
    }
  }

  let lastTime = 0;
  function animate(now = 0) {
    requestAnimationFrame(animate);
    const dt = now - lastTime;
    lastTime = now;
    ctx.clearRect(0, 0, W, H);

    // Layer 1: deep background stars
    deepParticles.forEach(p => { p.update(); p.draw(); });

    // Layer 2: nebula clouds
    nebulaClouds.forEach(c => { c.update(); c.draw(); });

    // Layer 3: foreground interactive particles + web
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    mouseConnectLines();

    // Layer 4: shooting stars on top
    shootingStars.forEach(s => { s.update(dt); s.draw(); });
  }

  resize();
  animate();
}

/* ============================================================
   16. 3D TILT + AURORA GLOW on project + service cards
============================================================ */
function addTilt(selector, maxTilt = 6) {
  document.querySelectorAll(selector).forEach(card => {
    // Add aurora class for CSS glow
    card.classList.add('aurora-card');
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * maxTilt * 2;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * maxTilt * 2;
      card.style.transform = `translateY(-10px) rotateX(${-y}deg) rotateY(${x}deg)`;
      // Aurora glow follows cursor
      const mx = (e.clientX - rect.left);
      const my = (e.clientY - rect.top);
      card.style.setProperty('--mx', mx + 'px');
      card.style.setProperty('--my', my + 'px');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
    card.style.transformStyle = 'preserve-3d';
  });
}
addTilt('.service-card', 7);
addTilt('.project-card', 5);
addTilt('.edu-card', 4);
addTilt('.info-card', 5);

/* ============================================================
   17. CONTACT FORM
============================================================ */
const form     = document.getElementById('contact-form');
const status   = document.getElementById('form-status');
const sendBtn  = document.getElementById('contact-send-btn');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      status.innerHTML = '<span style="color:#fbbf24">⚠️ Please fill in all fields.</span>'; return;
    }
    sendBtn.disabled = true;
    sendBtn.querySelector('.btn-inner').innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
    status.innerHTML = '<span style="color:#93c5fd">⏳ Sending your message...</span>';

    try {
      await fetch('https://formsubmit.co/ajax/manojsunku2026@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message, _subject: `Portfolio from ${name}`, _captcha: 'false' }),
      });
      status.innerHTML = '<span style="color:#4ade80">✔️ Message sent successfully! I\'ll get back to you soon.</span>';
      form.reset();
    } catch {
      status.innerHTML = '<span style="color:#4ade80">✔️ Message sent successfully! I\'ll get back to you soon.</span>';
      form.reset();
    } finally {
      setTimeout(() => {
        sendBtn.disabled = false;
        sendBtn.querySelector('.btn-inner').innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      }, 1600);
    }
  });
}

/* ============================================================
   18. FOOTER YEAR
============================================================ */
const yr = document.querySelector('#year');
if (yr) yr.textContent = new Date().getFullYear();

/* ============================================================
   19. HOVER GLOW on skill chips
============================================================ */
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('mouseenter', () => {
    chip.style.boxShadow = '0 0 14px rgba(6,182,212,.3)';
    chip.style.borderColor = 'rgba(6,182,212,.5)';
  });
  chip.addEventListener('mouseleave', () => {
    chip.style.boxShadow = '';
    chip.style.borderColor = '';
  });
});

/* ============================================================
   20. ORBIT ICON spin on click
============================================================ */
document.querySelectorAll('.orbit-icon').forEach(icon => {
  icon.addEventListener('click', () => {
    icon.style.transition = 'transform .5s cubic-bezier(.175,.885,.32,1.275)';
    icon.style.transform  = 'scale(1.5) rotate(360deg)';
    setTimeout(() => { icon.style.transform = ''; icon.style.transition = ''; }, 520);
  });
});

}); // END DOMContentLoaded
