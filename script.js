/* ============================================================
   SUNKU MANOJ KUMAR — PORTFOLIO CORE SCRIPTS & MICRO-INTERACTIONS
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. THEME SWITCHER (Light / Dark Mode)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const currentTheme = localStorage.getItem('manoj_theme') || 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('manoj_theme', newTheme);
      updateThemeIcon(newTheme);
    });
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

  // 2. AMBIENT CONSTELLATION PARTICLES (Lightweight, non-intrusive)
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    const particleCount = Math.min(width > 768 ? 45 : 20, 60);

    for (let i = 0; i < particleCount; i++) {
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
      const lineColor = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(37, 99, 235, 0.06)';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
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

  // 3. TYPED ROLE TEXT IN HERO
  const roles = [
    'Full-Stack Developer',
    'Python & Django Engineer',
    'React.js Specialist',
    'AI & Computer Vision Explorer'
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

      let speed = isDeleting ? 40 : 80;
      if (!isDeleting && cIdx === fullText.length) {
        speed = 2000;
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

  // 4. NAVBAR SCROLL EFFECT & SCROLLSPY
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

  // 5. MOBILE MENU TOGGLE
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  if (menuToggleBtn && mobileNavDrawer) {
    menuToggleBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('open');
      const isOpen = mobileNavDrawer.classList.contains('open');
      menuToggleBtn.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    mobileNavDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
        menuToggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // 6. HERO CODE WINDOW TABS & SIMULATED EXECUTION
  const windowTabs = document.querySelectorAll('.window-tab');
  const codePanes = document.querySelectorAll('.code-tab-pane');
  const windowBadge = document.getElementById('window-badge');
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

      if (windowBadge && tab.dataset.badge) {
        windowBadge.textContent = tab.dataset.badge;
      }
      if (consoleDrawer) {
        consoleDrawer.classList.remove('open');
      }
    });
  });

  // Simulated code execution
  if (runCodeBtn && consoleDrawer) {
    runCodeBtn.addEventListener('click', () => {
      consoleDrawer.classList.add('open');
      if (activeTabKey === 'pane-fastapi') {
        consoleDrawer.innerHTML = `
          <div><span class="console-prefix">$</span> uvicorn main:app --reload --port 8000</div>
          <div class="console-info">[INFO] Started server process [PID: 4182]</div>
          <div class="console-info">[INFO] Application startup complete. Docs available at /docs</div>
          <div class="console-success"><i class="fa-solid fa-check"></i> [200 OK] GET /api/developer → { name: "Sunku Manoj Kumar", status: "Available" }</div>
        `;
      } else if (activeTabKey === 'pane-ai') {
        consoleDrawer.innerHTML = `
          <div><span class="console-prefix">$</span> python emotion_ai.py --stream webcam:0</div>
          <div class="console-info">[INFO] Loading DeepFace VGG-Face / Facenet weights...</div>
          <div class="console-info">[INFO] Real-time video stream connected (1080p @ 60 FPS)</div>
          <div class="console-success"><i class="fa-solid fa-brain"></i> Prediction: Happy (Confidence: 98.4%) | Latency: 14ms</div>
        `;
      } else {
        consoleDrawer.innerHTML = `
          <div><span class="console-prefix">$</span> npm run dev</div>
          <div class="console-info">VITE v5.2.0 ready in 142 ms</div>
          <div class="console-success"><i class="fa-solid fa-check"></i> React 18 DOM tree successfully mounted. Hot Module Replacement active.</div>
        `;
      }
    });
  }

  // Copy code button
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const activePane = document.querySelector('.code-tab-pane.active');
      if (activePane) {
        navigator.clipboard.writeText(activePane.innerText.trim()).then(() => {
          const originalText = copyCodeBtn.innerHTML;
          copyCodeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          copyCodeBtn.style.background = '#10b981';
          copyCodeBtn.style.color = '#fff';
          setTimeout(() => {
            copyCodeBtn.innerHTML = originalText;
            copyCodeBtn.style.background = '';
            copyCodeBtn.style.color = '';
          }, 2000);
        });
      }
    });
  }

  // 7. PROJECT CATEGORY FILTER
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 8. ANIMATED STAT COUNTERS
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isFloat = counter.getAttribute('data-float') === 'true';
      const duration = 1500;
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

  // 9. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origBtnHtml = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

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
        } else {
          throw new Error('Submission error');
        }
      } catch (err) {
        formFeedback.className = 'form-feedback error';
        formFeedback.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Could not deliver message directly. Please contact manojsunku2026@gmail.com';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHtml;
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 7000);
      }
    });
  }

  // Current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
