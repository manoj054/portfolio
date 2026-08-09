document.addEventListener('DOMContentLoaded', () => {
  // Update footer year
  const yearEl = document.querySelector('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile navigation toggle
  const toggleButton = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleButton && navLinks) {
    toggleButton.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Contact form submission handler
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const sendBtn = document.getElementById('contact-send-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('contact-name').value.trim();
      const emailVal = document.getElementById('contact-email').value.trim();
      const messageVal = document.getElementById('contact-message').value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        if (formStatus) {
          formStatus.innerHTML = '<span style="color: #fbbf24; font-weight: 600;">⚠️ Please fill in all fields.</span>';
        }
        return;
      }

      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
      }
      if (formStatus) {
        formStatus.innerHTML = '<span style="color: #93c5fd; font-weight: 600;">⏳ Sending your message...</span>';
      }

      const isLocalFile = window.location.protocol === 'file:';

      if (isLocalFile) {
        // When running locally from local HTML file (file://), open Gmail composer directly to deliver message to email
        setTimeout(() => {
          const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=manojsunku2026@gmail.com&su=Portfolio Inquiry from ${encodeURIComponent(nameVal)}&body=${encodeURIComponent('Name: ' + nameVal + '\nEmail: ' + emailVal + '\n\nMessage:\n' + messageVal)}`;
          window.open(mailtoUrl, '_blank');

          if (formStatus) {
            formStatus.innerHTML = '<span style="color: #4ade80; font-weight: 600;">✔️ Opening Gmail to send message directly to manojsunku2026@gmail.com!</span>';
          }
          contactForm.reset();
          if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
          }
        }, 600);
        return;
      }

      // On live web server / GitHub Pages: submit asynchronously via FormSubmit API
      try {
        const response = await fetch('https://formsubmit.co/ajax/manojsunku2026@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            message: messageVal,
            _subject: 'Portfolio Inquiry from ' + nameVal,
            _captcha: 'false'
          })
        });

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true)) {
          if (formStatus) {
            formStatus.innerHTML = '<span style="color: #4ade80; font-weight: 600;">✔️ Your message has been sent successfully!</span>';
          }
          contactForm.reset();
        } else {
          // Fallback to Gmail compose if FormSubmit requires activation or returns error
          const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=manojsunku2026@gmail.com&su=Portfolio Inquiry from ${encodeURIComponent(nameVal)}&body=${encodeURIComponent('Name: ' + nameVal + '\nEmail: ' + emailVal + '\n\nMessage:\n' + messageVal)}`;
          window.open(mailtoUrl, '_blank');
          if (formStatus) {
            formStatus.innerHTML = '<span style="color: #4ade80; font-weight: 600;">✔️ Opening Gmail to send your message to manojsunku2026@gmail.com!</span>';
          }
          contactForm.reset();
        }
      } catch (err) {
        const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=manojsunku2026@gmail.com&su=Portfolio Inquiry from ${encodeURIComponent(nameVal)}&body=${encodeURIComponent('Name: ' + nameVal + '\nEmail: ' + emailVal + '\n\nMessage:\n' + messageVal)}`;
        window.open(mailtoUrl, '_blank');
        if (formStatus) {
          formStatus.innerHTML = '<span style="color: #4ade80; font-weight: 600;">✔️ Opening Gmail to send your message to manojsunku2026@gmail.com!</span>';
        }
        contactForm.reset();
      } finally {
        if (sendBtn) {
          setTimeout(() => {
            sendBtn.disabled = false;
            sendBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
          }, 1200);
        }
      }
    });
  }

  // Interactive Particle System for space-canvas
  const canvas = document.getElementById('space-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const numParticles = Math.min(120, Math.floor(window.innerWidth / 10));

    let mouse = { x: null, y: null, radius: 160 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    }

    window.addEventListener('resize', resize);

    class Particle {
      constructor(x, y, dx, dy, size, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.baseSize = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update() {
        if (this.x > width || this.x < 0) this.dx = -this.dx;
        if (this.y > height || this.y < 0) this.dy = -this.dy;

        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = forceDirectionX * force * 3;
            const directionY = forceDirectionY * force * 3;

            this.x -= directionX;
            this.y -= directionY;

            if (this.size < this.baseSize * 2.5) {
              this.size += 0.5;
            }
          } else if (this.size > this.baseSize) {
            this.size -= 0.1;
          }
        } else if (this.size > this.baseSize) {
          this.size -= 0.1;
        }

        this.x += this.dx;
        this.y += this.dy;
        this.draw();
      }
    }

    function initParticles() {
      particles = [];
      const colors = ['#7c3aed', '#06b6d4', '#ff7a6b'];
      for (let i = 0; i < numParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (width - size * 2) + size;
        let y = Math.random() * (height - size * 2) + size;
        let dx = (Math.random() - 0.5) * 1.2;
        let dy = (Math.random() - 0.5) * 1.2;
        let color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, dx, dy, size, color));
      }
    }

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = dx * dx + dy * dy;

          if (distance < 15000) {
            let opacity = 1 - distance / 15000;
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.fillStyle = 'rgba(6, 8, 22, 0.3)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connectParticles();
    }

    resize();
    animate();
  }
});
