/* ============================================================
   SUNKU MANOJ KUMAR — PORTFOLIO CORE SCRIPTS 2026 (ULTRA EDITION)
   Three.js 3D WebGL Earth, Interactive CLI Terminal, GitHub Heatmap,
   Card 3D Tilt, Live AI Emotion Lab, API Tester, Command Palette
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. TOAST NOTIFICATION SYSTEM
  // ============================================================
  const toastContainer = document.getElementById('toast-container') || createToastContainer();

  function createToastContainer() {
    const el = document.createElement('div');
    el.id = 'toast-container';
    el.className = 'toast-container';
    document.body.appendChild(el);
    return el;
  }

  function showToast(message, type = 'info', iconClass = 'fa-solid fa-circle-check') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    playAudioTone('pop');

    setTimeout(() => {
      toast.style.animation = 'slideToastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ============================================================
  // 2. SYNTHESIZED SOUND EFFECTS (Web Audio API - Zero Asset Dependency)
  // ============================================================
  let audioCtx = null;
  let soundEnabled = localStorage.getItem('manoj_sound') === 'true';

  const soundToggleBtns = document.querySelectorAll('#sound-toggle-btn, #dock-sound-btn');
  updateSoundIcon();

  soundToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('manoj_sound', soundEnabled);
      updateSoundIcon();
      if (soundEnabled) {
        initAudioContext();
        playAudioTone('success');
        showToast('Sound effects enabled', 'info', 'fa-solid fa-volume-high');
      } else {
        showToast('Sound effects muted', 'info', 'fa-solid fa-volume-xmark');
      }
    });
  });

  function updateSoundIcon() {
    soundToggleBtns.forEach(btn => {
      btn.innerHTML = soundEnabled
        ? '<i class="fa-solid fa-volume-high"></i>'
        : '<i class="fa-solid fa-volume-xmark"></i>';
      btn.title = soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX';
    });
  }

  function initAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playAudioTone(type = 'click') {
    if (!soundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'pop') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {
      // Audio context might fail on restricted environments
    }
  }

  // ============================================================
  // 3. THEME SWITCHER (Dark Default / Light Mode)
  // ============================================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const currentTheme = localStorage.getItem('manoj_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  function toggleTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('manoj_theme', newTheme);
    updateThemeIcon(newTheme);
    playAudioTone('click');
    showToast(`Switched to ${newTheme} mode`, 'info', newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun');
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
      themeIcon.title = 'Switch to Light Mode';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeIcon.title = 'Switch to Dark Mode';
    }
  }

  // ============================================================
  // 4. READING PROGRESS BAR & BACK TO TOP
  // ============================================================
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const progressCircle = document.getElementById('progress-circle');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    if (progressCircle) {
      const maxOffset = 140;
      const offset = maxOffset - (scrollPercent / 100) * maxOffset;
      progressCircle.style.strokeDashoffset = offset;
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playAudioTone('click');
    });
  }

  // ============================================================
  // 5. 3D CARD TILT & SPOTLIGHT CURSOR FOLLOWER
  // ============================================================
  const tiltCards = document.querySelectorAll('.project-card, .skill-category-card, .pillar-card, .exp-sub-card, .github-card');
  
  tiltCards.forEach(card => {
    card.classList.add('spotlight-card');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D subtle tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // ============================================================
  // 6. AMBIENT CONSTELLATION PARTICLES (Mouse Repulsion)
  // ============================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const mouse = { x: -9999, y: -9999, radius: 110 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    const count = Math.min(width > 768 ? 55 : 24, 65);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const dotColor = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(37, 99, 235, 0.35)';
      const lineColor = isDark ? 'rgba(56, 189, 248, 0.09)' : 'rgba(37, 99, 235, 0.07)';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse avoidance
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distToMouse = Math.hypot(dx, dy);
        if (distToMouse < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - distToMouse) / mouse.radius;
          p.x -= Math.cos(angle) * force * 1.6;
          p.y -= Math.sin(angle) * force * 1.6;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);
  }

  // ============================================================
  // 7. TYPEWRITER HEADLINE IN HERO
  // ============================================================
  const roles = [
    'Full-Stack Python & AI Developer',
    'Enterprise Backend Architect (FastAPI & Django)',
    'React.js & TypeScript Specialist',
    'Computer Vision Engineer (OpenCV & DeepFace)'
  ];
  const typedEl = document.getElementById('hero-typed-text');
  if (typedEl) {
    let rIdx = 0, cIdx = 0, isDeleting = false;
    function typeRole() {
      const fullText = roles[rIdx];
      if (isDeleting) {
        typedEl.textContent = fullText.substring(0, --cIdx);
      } else {
        typedEl.textContent = fullText.substring(0, ++cIdx);
      }

      let speed = isDeleting ? 30 : 65;
      if (!isDeleting && cIdx === fullText.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && cIdx === 0) {
        isDeleting = false;
        rIdx = (rIdx + 1) % roles.length;
        speed = 300;
      }
      setTimeout(typeRole, speed);
    }
    typeRole();
  }

  // ============================================================
  // 8. NAVBAR SCROLL EFFECT & SCROLLSPY
  // ============================================================
  const navbarWrapper = document.getElementById('navbar-wrapper');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrapper?.classList.add('scrolled');
    } else {
      navbarWrapper?.classList.remove('scrolled');
    }

    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ============================================================
  // 9. MOBILE NAV DRAWER
  // ============================================================
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  if (menuToggleBtn && mobileNavDrawer) {
    menuToggleBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('open');
      const isOpen = mobileNavDrawer.classList.contains('open');
      menuToggleBtn.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
      playAudioTone('click');
    });

    mobileNavDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
        menuToggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // ============================================================
  // 10. HERO CODE WINDOW TABS & SIMULATED EXECUTION
  // ============================================================
  const windowTabs = document.querySelectorAll('.window-tab');
  const codePanes = document.querySelectorAll('.code-tab-pane');
  const runCodeBtn = document.getElementById('run-code-btn');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  const consoleDrawer = document.getElementById('terminal-console-drawer');

  let activeTabKey = 'pane-fastapi';

  windowTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      windowTabs.forEach(t => t.classList.remove('active'));
      codePanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      activeTabKey = tab.dataset.target;
      const targetPane = document.getElementById(activeTabKey);
      if (targetPane) targetPane.classList.add('active');

      if (consoleDrawer) {
        consoleDrawer.classList.remove('open');
      }
      playAudioTone('click');
    });
  });

  if (runCodeBtn && consoleDrawer) {
    runCodeBtn.addEventListener('click', () => {
      playAudioTone('click');
      consoleDrawer.classList.add('open');
      consoleDrawer.innerHTML = '<div class="console-info"><i class="fa-solid fa-spinner fa-spin"></i> Initializing production runtime...</div>';

      setTimeout(() => {
        playAudioTone('success');
        if (activeTabKey === 'pane-fastapi') {
          consoleDrawer.innerHTML = `
            <div><span class="console-prefix">$</span> uvicorn main:app --reload --port 8000</div>
            <div class="console-info">[INFO] FastAPI 2.0 microservice initialized [PID: 4182]</div>
            <div class="console-info">[INFO] Async PostgreSQL pool connected (asyncpg 0.29.0)</div>
            <div class="console-success"><i class="fa-solid fa-check"></i> [200 OK] GET /api/developer → { name: "Sunku Manoj Kumar", role: "Full-Stack Python", status: "Active" } (Latency: 12ms)</div>
          `;
        } else if (activeTabKey === 'pane-ai') {
          consoleDrawer.innerHTML = `
            <div><span class="console-prefix">$</span> python emotion_ai.py --stream webcam:0</div>
            <div class="console-info">[INFO] Loading DeepFace VGG-Face / Facenet neural weights...</div>
            <div class="console-info">[INFO] OpenCV 4.9.0 CUDA stream attached (1080p @ 60 FPS)</div>
            <div class="console-success"><i class="fa-solid fa-brain"></i> Emotion Detected: "Happy" (Confidence: 98.4%) | Inference: 14.2ms</div>
          `;
        } else if (activeTabKey === 'pane-react') {
          consoleDrawer.innerHTML = `
            <div><span class="console-prefix">$</span> pnpm run dev</div>
            <div class="console-info">VITE v5.4.0 ready in 118 ms</div>
            <div class="console-success"><i class="fa-solid fa-check"></i> React 18 + TypeScript DOM mounted. RTK Query state synchronized.</div>
          `;
        } else {
          consoleDrawer.innerHTML = `
            <div><span class="console-prefix">$</span> pytest tests/ -v</div>
            <div class="console-info">collected 18 items</div>
            <div class="console-success"><i class="fa-solid fa-check-double"></i> 18 passed in 0.42s (100% test coverage)</div>
          `;
        }
      }, 350);
    });
  }

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const activePane = document.querySelector('.code-tab-pane.active');
      if (activePane) {
        navigator.clipboard.writeText(activePane.innerText.trim()).then(() => {
          showToast('Code copied to clipboard!', 'success', 'fa-regular fa-copy');
        });
      }
    });
  }

  // ============================================================
  // 11. INTERACTIVE LIVE AI & API PLAYGROUND LAB
  // ============================================================
  const pgTabBtns = document.querySelectorAll('.pg-tab-btn');
  const pgTabViews = document.querySelectorAll('.playground-tab-view');

  pgTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pgTabBtns.forEach(b => b.classList.remove('active'));
      pgTabViews.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.dataset.view;
      const targetView = document.getElementById(targetId);
      if (targetView) targetView.classList.add('active');

      if (targetId === 'pg-3d-earth') {
        initEarth3DCanvas();
      }

      playAudioTone('click');
    });
  });

  // 11A. FACE EMOTION AI LAB SIMULATOR
  const emotionCanvas = document.getElementById('emotion-canvas');
  const presetBtns = document.querySelectorAll('.preset-thumb-btn');
  const dominantVal = document.getElementById('dominant-emotion-val');
  const dominantConf = document.getElementById('dominant-confidence-val');
  const fillHappy = document.getElementById('fill-happy');
  const fillNeutral = document.getElementById('fill-neutral');
  const fillSurprise = document.getElementById('fill-surprise');
  const fillFocused = document.getElementById('fill-focused');

  const emotionPresets = {
    happy: {
      name: 'Happy',
      confidence: '98.4%',
      distribution: { happy: 98.4, neutral: 1.2, surprise: 0.4, focused: 0.0 },
      primaryColor: '#10b981',
      faceMood: 'smile'
    },
    focused: {
      name: 'Focused',
      confidence: '96.2%',
      distribution: { happy: 2.1, neutral: 14.5, surprise: 0.2, focused: 83.2 },
      primaryColor: '#3b82f6',
      faceMood: 'neutral'
    },
    surprise: {
      name: 'Surprised',
      confidence: '97.8%',
      distribution: { happy: 6.2, neutral: 0.8, surprise: 92.0, focused: 1.0 },
      primaryColor: '#f59e0b',
      faceMood: 'surprise'
    },
    thinking: {
      name: 'Analytical',
      confidence: '94.5%',
      distribution: { happy: 1.5, neutral: 22.0, surprise: 1.5, focused: 75.0 },
      primaryColor: '#a855f7',
      faceMood: 'thinking'
    }
  };

  function renderEmotionSim(presetKey) {
    if (!emotionCanvas) return;
    const ctx = emotionCanvas.getContext('2d');
    const w = emotionCanvas.width = 440;
    const h = emotionCanvas.height = 330;

    const preset = emotionPresets[presetKey] || emotionPresets.happy;

    // Dark cyber backdrop
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, w, h);

    // Digital grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const cx = w / 2;
    const cy = h / 2 - 10;
    const fw = 140;
    const fh = 180;

    // Bounding Box
    ctx.strokeStyle = preset.primaryColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(cx - fw / 2, cy - fh / 2, fw, fh);
    ctx.setLineDash([]);

    // Bounding Box Corners
    ctx.lineWidth = 3;
    const corner = 16;
    ctx.beginPath();
    ctx.moveTo(cx - fw / 2, cy - fh / 2 + corner);
    ctx.lineTo(cx - fw / 2, cy - fh / 2);
    ctx.lineTo(cx - fw / 2 + corner, cy - fh / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + fw / 2 - corner, cy - fh / 2);
    ctx.lineTo(cx + fw / 2, cy - fh / 2);
    ctx.lineTo(cx + fw / 2, cy - fh / 2 + corner);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - fw / 2, cy + fh / 2 - corner);
    ctx.lineTo(cx - fw / 2, cy + fh / 2);
    ctx.lineTo(cx - fw / 2 + corner, cy + fh / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + fw / 2 - corner, cy + fh / 2);
    ctx.lineTo(cx + fw / 2, cy + fh / 2);
    ctx.lineTo(cx + fw / 2, cy + fh / 2 - corner);
    ctx.stroke();

    // 68 Facial Landmark Dots simulation
    ctx.fillStyle = '#38bdf8';
    const landmarks = [
      {x: cx - 40, y: cy - 40}, {x: cx - 25, y: cy - 44}, {x: cx - 12, y: cy - 42},
      {x: cx + 12, y: cy - 42}, {x: cx + 25, y: cy - 44}, {x: cx + 40, y: cy - 40},
      {x: cx - 30, y: cy - 25}, {x: cx - 20, y: cy - 25}, {x: cx + 20, y: cy - 25}, {x: cx + 30, y: cy - 25},
      {x: cx, y: cy - 15}, {x: cx, y: cy - 5}, {x: cx, y: cy + 5}, {x: cx - 8, y: cy + 8}, {x: cx + 8, y: cy + 8},
      {x: cx - 24, y: preset.faceMood === 'smile' ? cy + 24 : cy + 28},
      {x: cx, y: preset.faceMood === 'smile' ? cy + 34 : preset.faceMood === 'surprise' ? cy + 42 : cy + 28},
      {x: cx + 24, y: preset.faceMood === 'smile' ? cy + 24 : cy + 28},
      {x: cx - 50, y: cy}, {x: cx - 45, y: cy + 35}, {x: cx - 25, y: cy + 60},
      {x: cx, y: cy + 70},
      {x: cx + 25, y: cy + 60}, {x: cx + 45, y: cy + 35}, {x: cx + 50, y: cy}
    ];

    landmarks.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(landmarks[0].x, landmarks[0].y);
    landmarks.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.stroke();

    ctx.fillStyle = preset.primaryColor;
    ctx.font = '600 11px JetBrains Mono';
    ctx.fillText(`${preset.name.toUpperCase()} [${preset.confidence}]`, cx - fw / 2, cy - fh / 2 - 8);

    if (dominantVal) dominantVal.textContent = preset.name;
    if (dominantConf) dominantConf.textContent = preset.confidence;
    if (fillHappy) fillHappy.style.width = `${preset.distribution.happy}%`;
    if (fillNeutral) fillNeutral.style.width = `${preset.distribution.neutral}%`;
    if (fillSurprise) fillSurprise.style.width = `${preset.distribution.surprise}%`;
    if (fillFocused) fillFocused.style.width = `${preset.distribution.focused}%`;
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.dataset.preset;
      renderEmotionSim(presetKey);
      playAudioTone('click');
    });
  });

  renderEmotionSim('happy');

  // 11B. INTERACTIVE REST API TESTER
  const apiEndpointSelect = document.getElementById('api-endpoint-select');
  const apiExecuteBtn = document.getElementById('api-execute-btn');
  const apiResponseBody = document.getElementById('api-response-body');
  const apiStatusBadge = document.getElementById('api-status-badge');
  const apiTimeBadge = document.getElementById('api-time-badge');
  const apiCopyBtn = document.getElementById('api-copy-btn');

  const apiResponses = {
    '/api/v1/developer/profile': {
      status: '200 OK',
      time: '14.2 ms',
      payload: {
        status: "success",
        developer: {
          name: "Sunku Manoj Kumar",
          title: "Full Stack Python Developer & AI Engineer",
          company: "VN Softverg Technology",
          experience_years: "Active Industry Role (June 2026 – Present)",
          education: "B.Tech CSE (AI) - 2026 Batch",
          core_stack: ["FastAPI", "React.js", "PostgreSQL", "Python", "OpenCV", "DeepFace"],
          contact: {
            email: "manojsunku2026@gmail.com",
            phone: "+91 7780391473",
            github: "https://github.com/manoj054",
            linkedin: "https://linkedin.com/in/manoj-kumar-sunku-a43a5033a"
          }
        }
      }
    },
    '/api/v1/ai/predict-emotion': {
      status: '200 OK',
      time: '18.6 ms',
      payload: {
        status: "processed",
        model: "DeepFace-VGG-Face-v2",
        inference_latency: "14.2ms",
        faces_detected: 1,
        predictions: [
          {
            dominant_emotion: "happy",
            confidence_score: 0.9842,
            probabilities: {
              happy: 0.9842,
              neutral: 0.0121,
              surprise: 0.0037,
              sad: 0.0000
            },
            facial_landmarks: "68_points_mapped"
          }
        ]
      }
    },
    '/api/v1/lms/tenant-health': {
      status: '200 OK',
      time: '21.0 ms',
      payload: {
        service: "AI-LMS Enterprise Multi-Tenant Platform",
        active_tenants: 12,
        db_pool: "asyncpg connected",
        jwt_rbac: "active",
        health: "100% operational",
        avg_response_time: "24ms"
      }
    },
    '/api/v1/projects/summary': {
      status: '200 OK',
      time: '11.8 ms',
      payload: {
        total_projects: 6,
        categories: ["Enterprise SaaS", "Computer Vision", "Full-Stack Backend", "WebGL 3D"],
        featured: [
          "AI-Powered Learning Management System",
          "Real-Time Face Emotion Classifier",
          "Enterprise HRM Biometric Engine",
          "3D Earth Orbit Portal"
        ],
        github_profile: "https://github.com/manoj054"
      }
    }
  };

  if (apiExecuteBtn && apiEndpointSelect) {
    apiExecuteBtn.addEventListener('click', () => {
      const endpoint = apiEndpointSelect.value;
      const data = apiResponses[endpoint] || apiResponses['/api/v1/developer/profile'];

      playAudioTone('click');
      apiExecuteBtn.disabled = true;
      apiExecuteBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Calling API...';

      setTimeout(() => {
        apiExecuteBtn.disabled = false;
        apiExecuteBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Execute Request ⚡';
        playAudioTone('success');

        if (apiStatusBadge) apiStatusBadge.textContent = data.status;
        if (apiTimeBadge) apiTimeBadge.textContent = data.time;
        if (apiResponseBody) apiResponseBody.textContent = JSON.stringify(data.payload, null, 2);
      }, 280);
    });
  }

  if (apiCopyBtn && apiResponseBody) {
    apiCopyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(apiResponseBody.textContent).then(() => {
        showToast('JSON response copied!', 'success', 'fa-regular fa-copy');
      });
    });
  }

  // 11C. INTERACTIVE DEVELOPER CLI TERMINAL
  const cliInput = document.getElementById('cli-input');
  const cliOutput = document.getElementById('cli-output');
  const cliHistory = [];
  let cliHistoryIdx = -1;

  if (cliInput && cliOutput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = cliInput.value.trim().toLowerCase();
        if (cmd) {
          cliHistory.push(cmd);
          cliHistoryIdx = cliHistory.length;
          handleCliCommand(cmd);
          cliInput.value = '';
          playAudioTone('click');
        }
      } else if (e.key === 'ArrowUp') {
        if (cliHistory.length > 0 && cliHistoryIdx > 0) {
          cliHistoryIdx--;
          cliInput.value = cliHistory[cliHistoryIdx];
        }
      } else if (e.key === 'ArrowDown') {
        if (cliHistoryIdx < cliHistory.length - 1) {
          cliHistoryIdx++;
          cliInput.value = cliHistory[cliHistoryIdx];
        } else {
          cliHistoryIdx = cliHistory.length;
          cliInput.value = '';
        }
      }
    });
  }

  function handleCliCommand(cmd) {
    appendCliLine(`guest@manoj-portfolio:~$ ${cmd}`, '#f8fafc');

    switch (cmd) {
      case 'help':
        appendCliLine(`Available Commands:
  • bio           - Display developer summary & background
  • skills        - List core technical competencies
  • projects      - View all 6 flagship projects
  • experience    - View VN Softverg Technology details
  • contact       - Show email, phone & WhatsApp
  • resume        - Open resume in a new tab
  • theme         - Toggle Dark / Light mode
  • clear         - Clear terminal output`, '#38bdf8');
        break;

      case 'bio':
      case 'about':
        appendCliLine(`Sunku Manoj Kumar
Full Stack Python Developer & AI Engineer
Current: Full Stack Developer @ VN Softverg Technology (June 2026 – Present)
Academics: B.Tech CSE (AI) @ AITS (7.76 CGPA) • Perfect 10/10 SSC Merit
Philosophy: Writing type-safe, asynchronous architectures with low latency & high throughput.`, '#34d399');
        break;

      case 'skills':
        appendCliLine(`Technical Competency Matrix:
  [Backend]  FastAPI (94%), Python 3.12 (95%), Django (90%), PostgreSQL (90%), asyncpg
  [Frontend] React.js (92%), TypeScript (88%), Redux Toolkit, Three.js (82%)
  [AI / ML]  OpenCV (90%), DeepFace (92%), CNN (86%), MediaPipe (84%)
  [DevOps]   Git, GitHub, Docker, Postman, Linux`, '#a78bfa');
        break;

      case 'projects':
        appendCliLine(`Featured Projects:
  1. AI-Powered Resume & Job Description Matcher (FastAPI + TF-IDF + React 19)
  2. Real-Time Face Emotion Detector (OpenCV + DeepFace + Flask)
  3. CodeQuest: AI Programming Quiz Platform (FastAPI + React + PostgreSQL + AI)
  4. AI-LMS Enterprise Platform (FastAPI + PostgreSQL + React + RTK Query)
  5. Enterprise HRM & Biometric Attendance Engine (FastAPI + Geofencing)
  6. Zero-Trust JWT Authentication (FastAPI + Bcrypt + RBAC)
  7. 3D Earth Animated Login Portal (React Three Fiber + Shaders)
  8. Employee Management Directory (Full-Stack CRUD + Fuzzy Search)`, '#38bdf8');
        break;

      case 'experience':
        appendCliLine(`VN Softverg Technology (June 2026 – Present)
Role: Full Stack Python Developer
Impact: Engineered AI-LMS with multi-tenant schema isolation, sub-35ms async queries, and HRM attendance validation pipelines.`, '#10b981');
        break;

      case 'contact':
        appendCliLine(`Contact Details:
  Email:    manojsunku2026@gmail.com
  Phone:    +91 77803 91473
  WhatsApp: https://wa.me/917780391473
  GitHub:   https://github.com/manoj054
  LinkedIn: https://linkedin.com/in/manoj-kumar-sunku-a43a5033a`, '#34d399');
        break;

      case 'resume':
        window.open('assets/Manoj_Kumar_Sunku_Resume.pdf', '_blank');
        appendCliLine('Opening Manoj Kumar Sunku Resume PDF...', '#fbbf24');
        break;

      case 'theme':
        toggleTheme();
        appendCliLine('Theme toggled successfully.', '#a78bfa');
        break;

      case 'clear':
        if (cliOutput) cliOutput.innerHTML = '';
        return;

      default:
        appendCliLine(`Command not found: "${cmd}". Type "help" to see valid commands.`, '#f87171');
        break;
    }

    if (cliOutput) cliOutput.scrollTop = cliOutput.scrollHeight;
  }

  function appendCliLine(text, color = '#38bdf8') {
    if (!cliOutput) return;
    const div = document.createElement('div');
    div.className = 'cli-history-line';
    div.style.color = color;
    div.textContent = text;
    cliOutput.appendChild(div);
    cliOutput.scrollTop = cliOutput.scrollHeight;
  }

  // 11D. THREE.JS 3D EARTH WEBGL VIEWER
  let earthRenderer = null, earthScene = null, earthCamera = null, earthGlobe = null;
  let isEarthInitialized = false;

  function initEarth3DCanvas() {
    if (isEarthInitialized) return;
    const canvasWrap = document.getElementById('earth-webgl-canvas');
    if (!canvasWrap || typeof THREE === 'undefined') return;

    isEarthInitialized = true;
    const width = canvasWrap.clientWidth || 400;
    const height = canvasWrap.clientHeight || 350;

    earthScene = new THREE.Scene();
    earthCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    earthCamera.position.z = 2.8;

    earthRenderer = new THREE.WebGLRenderer({ canvas: canvasWrap, alpha: true, antialias: true });
    earthRenderer.setSize(width, height);
    earthRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create 3D Earth Globe with Procedural Canvas Texture
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const eCtx = earthCanvas.getContext('2d');

    // Deep blue ocean gradient
    const oceanGrad = eCtx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#0b1d3a');
    oceanGrad.addColorStop(0.5, '#0d2b56');
    oceanGrad.addColorStop(1, '#0b1d3a');
    eCtx.fillStyle = oceanGrad;
    eCtx.fillRect(0, 0, 1024, 512);

    // Continents simulation
    eCtx.fillStyle = '#10b981';
    for (let i = 0; i < 48; i++) {
      const rx = (Math.sin(i * 1.5) * 0.5 + 0.5) * 1024;
      const ry = (Math.cos(i * 2.1) * 0.4 + 0.5) * 512;
      const rad = 25 + (i % 7) * 12;
      eCtx.beginPath();
      eCtx.arc(rx, ry, rad, 0, Math.PI * 2);
      eCtx.fill();
    }

    // Grid coordinates
    eCtx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    eCtx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 64) {
      eCtx.beginPath();
      eCtx.moveTo(x, 0);
      eCtx.lineTo(x, 512);
      eCtx.stroke();
    }

    const texture = new THREE.CanvasTexture(earthCanvas);
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 25,
      specular: new THREE.Color('#38bdf8')
    });

    earthGlobe = new THREE.Mesh(geometry, material);
    earthScene.add(earthGlobe);

    // Glowing Atmosphere Wireframe Halo
    const haloGeo = new THREE.SphereGeometry(1.08, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: '#06b6d4',
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    earthScene.add(halo);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    earthScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x60a5fa, 1.2);
    dirLight.position.set(5, 3, 5);
    earthScene.add(dirLight);

    // Interactive Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    canvasWrap.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !earthGlobe) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      earthGlobe.rotation.y += deltaX * 0.008;
      earthGlobe.rotation.x += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    function animateEarth() {
      requestAnimationFrame(animateEarth);
      if (!isDragging && earthGlobe) {
        earthGlobe.rotation.y += 0.004;
      }
      halo.rotation.y -= 0.002;
      earthRenderer.render(earthScene, earthCamera);
    }
    animateEarth();
  }

  // ============================================================
  // 12. GITHUB HEATMAP GENERATOR
  // ============================================================
  const heatmapGrid = document.getElementById('heatmap-grid');
  if (heatmapGrid) {
    const totalDays = 52 * 7;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < totalDays; i++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      
      // Seed realistic distribution
      const rand = Math.random();
      let level = '0';
      if (rand > 0.85) level = '4';
      else if (rand > 0.68) level = '3';
      else if (rand > 0.45) level = '2';
      else if (rand > 0.25) level = '1';

      if (level !== '0') cell.setAttribute('data-level', level);

      cell.title = `Contributions: ${level === '0' ? 'No commits' : level * 3 + ' commits'}`;
      fragment.appendChild(cell);
    }
    heatmapGrid.appendChild(fragment);
  }

  // ============================================================
  // 13. LIVE SKILL SEARCH & FILTER
  // ============================================================
  const skillSearchInput = document.getElementById('skill-search-input');
  const allSkillBadges = document.querySelectorAll('.skill-badge');

  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      allSkillBadges.forEach(badge => {
        const text = badge.innerText.toLowerCase();
        if (query && text.includes(query)) {
          badge.classList.add('active-search');
        } else {
          badge.classList.remove('active-search');
        }
      });
    });
  }

  // ============================================================
  // 14. COMMAND PALETTE (Ctrl + K / Cmd + K)
  // ============================================================
  const paletteOverlay = document.getElementById('palette-overlay');
  const paletteInput = document.getElementById('palette-input');
  const paletteItems = document.querySelectorAll('.palette-item');
  const paletteTriggers = document.querySelectorAll('.command-palette-trigger, #dock-cmd-btn');

  function openPalette() {
    if (!paletteOverlay) return;
    paletteOverlay.classList.add('open');
    paletteInput?.focus();
    if (paletteInput) paletteInput.value = '';
    filterPaletteItems('');
    playAudioTone('pop');
  }

  function closePalette() {
    if (!paletteOverlay) return;
    paletteOverlay.classList.remove('open');
    playAudioTone('click');
  }

  paletteTriggers.forEach(btn => btn.addEventListener('click', openPalette));

  if (paletteOverlay) {
    paletteOverlay.addEventListener('click', (e) => {
      if (e.target === paletteOverlay) closePalette();
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteOverlay?.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape') {
      if (paletteOverlay?.classList.contains('open')) closePalette();
      closeProjectModal();
    } else if (e.key.toLowerCase() === 't' && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      toggleTheme();
    }
  });

  if (paletteInput) {
    paletteInput.addEventListener('input', (e) => {
      filterPaletteItems(e.target.value.toLowerCase().trim());
    });
  }

  function filterPaletteItems(query) {
    paletteItems.forEach(item => {
      const text = item.innerText.toLowerCase();
      if (!query || text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  paletteItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      executePaletteAction(action);
      closePalette();
    });
  });

  function executePaletteAction(action) {
    if (!action) return;
    if (action.startsWith('#')) {
      const target = document.querySelector(action);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'resume') {
      window.open('assets/Manoj_Kumar_Sunku_Resume.pdf', '_blank');
    } else if (action === 'copy-email') {
      navigator.clipboard.writeText('manojsunku2026@gmail.com').then(() => {
        showToast('Email copied to clipboard!', 'success', 'fa-solid fa-envelope');
      });
    } else if (action === 'copy-phone') {
      navigator.clipboard.writeText('+91 77803 91473').then(() => {
        showToast('Phone number copied to clipboard!', 'success', 'fa-solid fa-phone');
      });
    } else if (action === 'whatsapp') {
      window.open('https://wa.me/917780391473', '_blank');
    } else if (action === 'theme') {
      toggleTheme();
    } else if (action === 'github') {
      window.open('https://github.com/manoj054', '_blank');
    } else if (action === 'linkedin') {
      window.open('https://linkedin.com/in/manoj-kumar-sunku-a43a5033a', '_blank');
    }
  }

  // ============================================================
  // 15. PROJECT FILTER & QUICK VIEW MODAL
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = (card.dataset.category || '').toLowerCase().split(/\s+/);
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      playAudioTone('click');
    });
  });

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');

  const projectDataMap = {
    'resume-matcher': {
      title: "AI-Powered Resume & Job Description Matcher",
      badge: "Personal Project • AI / NLP System",
      desc: "AI-driven resume parsing and job description matching web application calculating contextual match scores using TF-IDF vectorization and cosine similarity. Features real-time resume file extraction, skill gap analytics, and interactive score breakdowns.",
      features: [
        { title: "TF-IDF & Cosine Similarity Engine", desc: "Calculates mathematical cosine similarity between candidate resume tokens and job requirement vectors for unbiased ranking." },
        { title: "Automated Resume Parsing", desc: "Extracts candidate contact details, skills, years of experience, and education from PDF & DOCX resumes." },
        { title: "Skill Gap & Match Radar", desc: "Interactive visualization highlighting matching skills, missing critical keywords, and targeted recommendations." },
        { title: "FastAPI + React 19 Architecture", desc: "Clean asynchronous backend with background processing, SQLite match history, and modern responsive frontend." }
      ],
      github: "https://github.com/manoj054/Resume-Matcher"
    },
    'emotion-ai': {
      title: "Real-Time Face Emotion Detector",
      badge: "Personal Project • Computer Vision",
      desc: "Computer vision utility designed for live perception analysis. Captures video streams from webcams or uploaded photographs, maps 68 facial landmark coordinates, and performs multi-class emotion classification with high confidence.",
      features: [
        { title: "Real-Time Frame Processing", desc: "Continuous 60 FPS video stream capture using OpenCV matrix manipulation." },
        { title: "DeepFace Neural Inference", desc: "Multi-class emotion classification achieving 98.4% precision across test benchmarks." },
        { title: "Flask Backend Media Pipeline", desc: "Handles multipart image uploads, storage, and asynchronous analytical reporting." },
        { title: "Visual Landmark Mesh", desc: "Real-time overlay of facial mesh wireframes and probability telemetry." }
      ],
      github: "https://github.com/manoj054/Face-Emotion-Detector"
    },
    'code-quest': {
      title: "AI-Powered Programming Quiz Platform (CodeQuest)",
      badge: "Personal Project • AI EdTech Platform",
      desc: "Interactive coding assessment and quiz platform generating dynamic programming questions, hints, and explanations using AI models. Features secure Google OAuth, timed challenges, and real-time leaderboards.",
      features: [
        { title: "Dynamic AI Question Generation", desc: "Generates varied programming questions across difficulty tiers with context-aware hint engine and solutions." },
        { title: "Google OAuth 2.0 & Role Dashboards", desc: "Secure authentication supporting Admin management and Student quiz taking with granular permissions." },
        { title: "PostgreSQL & SQLModel Persistence", desc: "Scalable schema design handling user attempts, question banks, and instant score leaderboards." },
        { title: "Automated Grading & Timed Challenges", desc: "Real-time timer countdowns, immediate score calculation, and performance analytics." }
      ],
      github: "https://github.com/manoj054/CodeQuest"
    },
    'ai-lms': {
      title: "AI-Powered Learning Management System (AI-LMS)",
      badge: "Enterprise SaaS • VN Softverg",
      desc: "Enterprise-grade multi-tenant learning management system engineered with complete organizational isolation, RBAC security, and dynamic curriculum analytics. Handles large-scale asynchronous user requests and provides interactive modules for corporate trainees.",
      features: [
        { title: "Multi-Tenant Schema Isolation", desc: "Prevents any data cross-talk across organizational accounts with scoped PostgreSQL tenancy." },
        { title: "FastAPI + SQLModel Async Engine", desc: "Engineered asynchronous endpoints delivering sub-35ms query responses via asyncpg." },
        { title: "React 18 + Redux Toolkit Frontend", desc: "Single-page responsive dashboard built with TypeScript, Material-UI, and RTK Query caching." },
        { title: "Automated Database Migrations", desc: "Seamless schema versioning using Alembic with 100% data integrity." }
      ],
      github: "https://github.com/manoj054/authentication"
    },
    'hrm-biometric': {
      title: "Enterprise HRM & Smart Biometric Attendance System",
      badge: "Full-Stack Backend",
      desc: "Production workforce check-in and attendance tracking engine featuring triple-layer verification (device fingerprinting, GPS geofencing, and network IP validation) to prevent proxy attendance.",
      features: [
        { title: "Triple-Layer Verification", desc: "Validates device UUID, physical coordinates, and network IP subnet on every punch." },
        { title: "Automated Work-Hour Engine", desc: "Asynchronously computes daily hours, overtime, and leave balances in real-time." },
        { title: "Real-Time Manager Alerts", desc: "Sends instant notifications on shift discrepancies and attendance anomalies." },
        { title: "High-Throughput FastAPI REST", desc: "Engineered to handle shift-change peak traffic with zero downtime." }
      ],
      github: "https://github.com/manoj054/authentication"
    },
    'earth-3d': {
      title: "3D Earth Animated Login & Orbit Portal",
      badge: "Frontend & 3D WebGL",
      desc: "Cinematic authentication portal featuring an interactive 3D Earth globe with custom Rayleigh atmospheric scattering shaders, dynamic cloud geometry, smooth orbital camera physics, and glassmorphic inputs.",
      features: [
        { title: "60 FPS WebGL Engine", desc: "Rendered using Three.js and React Three Fiber with zero rendering lag." },
        { title: "Custom Atmospheric Shaders", desc: "GLSL lighting shaders producing realistic sunrise and night-city light glows." },
        { title: "Interactive Orbital Controls", desc: "Smooth drag-to-rotate camera controls with damping physics." },
        { title: "Glassmorphism Interface", desc: "Floating login card with backdrop blur and real-time form validation." }
      ],
      github: "https://github.com/manoj054/react"
    },
    'secure-auth': {
      title: "Zero-Trust JWT Auth & RBAC Microservice",
      badge: "Backend & Security",
      desc: "High-security microservice architecture delivering JSON Web Token (JWT) issuance, cryptographic password hashing via Bcrypt, refresh token rotation, and granular endpoint permission gates.",
      features: [
        { title: "Cryptographic Password Salting", desc: "Bcrypt hashing with 12 salt rounds for OWASP compliance." },
        { title: "Role-Based Access Control (RBAC)", desc: "FastAPI dependency injection protecting endpoints by user permission roles." },
        { title: "OpenAPI / Swagger Specs", desc: "Self-documenting interactive API documentation with automated schema definitions." },
        { title: "Persistent Audit Trail", desc: "Logs all login attempts, failed credentials, and token refresh cycles." }
      ],
      github: "https://github.com/manoj054/authentication"
    },
    'employee-crud': {
      title: "Modern Employee Directory & Instant Analytics",
      badge: "Full-Stack CRUD",
      desc: "Full-featured employee management application providing end-to-end CRUD capabilities, instant sub-5ms client-side fuzzy search, departmental filtering, CSV data exports, and persistent storage synchronization.",
      features: [
        { title: "Sub-5ms Instant Search", desc: "Fuzzy search indexing matching across employee names, roles, and departments." },
        { title: "Complete CRUD Lifecycle", desc: "Add, view, edit, and delete employee profiles with confirmation safety gates." },
        { title: "Dual Storage Sync", desc: "Synchronizes state simultaneously across browser LocalStorage and backend REST endpoints." },
        { title: "Data Export Utilities", desc: "One-click export of directory tables to CSV and JSON formats." }
      ],
      github: "https://github.com/manoj054/javascript"
    }
  };

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.project;
      const data = projectDataMap[key];
      if (!data || !projectModal) return;

      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-badge').textContent = data.badge;
      document.getElementById('modal-desc').textContent = data.desc;
      document.getElementById('modal-github-link').href = data.github;

      const featuresContainer = document.getElementById('modal-features-container');
      if (featuresContainer) {
        featuresContainer.innerHTML = data.features.map(f => `
          <div class="modal-feature-box">
            <strong><i class="fa-solid fa-circle-check" style="color:#10b981;margin-right:6px"></i>${f.title}</strong>
            <p>${f.desc}</p>
          </div>
        `).join('');
      }

      projectModal.classList.add('open');
      playAudioTone('pop');
    });
  });

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('open');
      playAudioTone('click');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // ============================================================
  // 16. SKILLS CATEGORY FILTER & ANIMATED PROFICIENCY METERS
  // ============================================================
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      skillCategoryCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      playAudioTone('click');
    });
  });

  const skillBars = document.querySelectorAll('.skill-meter-fill');
  let skillsAnimated = false;

  function runSkillBars() {
    skillBars.forEach(bar => {
      const targetPercent = bar.getAttribute('data-percent') || '85%';
      bar.style.width = targetPercent;
    });
  }

  const skillsSection = document.getElementById('skills');
  if (skillsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        runSkillBars();
        observer.unobserve(skillsSection);
      }
    }, { threshold: 0.2 });
    observer.observe(skillsSection);
  } else {
    runSkillBars();
  }

  // ============================================================
  // 17. ANIMATED STAT COUNTERS
  // ============================================================
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isFloat = counter.getAttribute('data-float') === 'true';
      const duration = 1600;
      const step = 20;
      let current = 0;
      const increment = target / (duration / step);

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = isFloat ? target.toFixed(2) : Math.round(target);
          clearInterval(timer);
        } else {
          counter.textContent = isFloat ? current.toFixed(2) : Math.round(current);
        }
      }, step);
    });
  }

  const statSection = document.getElementById('education');
  if (statSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        runCounters();
        observer.unobserve(statSection);
      }
    }, { threshold: 0.2 });
    observer.observe(statSection);
  } else {
    runCounters();
  }

  // ============================================================
  // 18. RECRUITER FAQ ACCORDION
  // ============================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
      playAudioTone('click');
    });
  });

  // ============================================================
  // 19. 1-CLICK CLIPBOARD COPY BUTTONS
  // ============================================================
  const copyButtons = document.querySelectorAll('.copy-trigger-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`, 'success', 'fa-solid fa-copy');
        });
      }
    });
  });

  // ============================================================
  // 20. CONTACT FORM SUBMISSION
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origBtnHtml = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';
      playAudioTone('click');

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://formsubmit.co/ajax/manojsunku2026@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(formData))
        });

        if (response.ok) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully.';
          contactForm.reset();
          playAudioTone('success');
          showToast('Message sent successfully! I will reply shortly.', 'success', 'fa-solid fa-paper-plane');
        } else {
          throw new Error('Submission error');
        }
      } catch (err) {
        formFeedback.className = 'form-feedback error';
        formFeedback.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Could not send directly. Please email manojsunku2026@gmail.com';
        showToast('Submission error. Please email directly.', 'error', 'fa-solid fa-circle-exclamation');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHtml;
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 8000);
      }
    });
  }

  // Footer Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
