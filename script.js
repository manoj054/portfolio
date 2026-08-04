const toggleButton = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const contactCard = document.querySelector('.contact__card');
const contactForm = document.querySelector('.contact__form');
const formStatus = document.querySelector('.form-status');

if (year) {
  year.textContent = new Date().getFullYear();
}

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

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Stop native submission and redirect

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        _subject: 'Portfolio Inquiry'
      };

      const response = await fetch("https://formsubmit.co/ajax/manojsunku2003@gmail.com", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        formStatus.innerHTML = '✔️ The form was submitted successfully!';
        formStatus.style.color = '#9df7c5';
        contactForm.reset();
      } else {
        formStatus.innerHTML = 'Something went wrong. Please try again later.';
        formStatus.style.color = '#ff7a6b';
      }
    } catch (error) {
      formStatus.innerHTML = 'Unable to send your message right now. Please try again.';
      formStatus.style.color = '#ff7a6b';
    } finally {
      setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        }
      }, 3000);
    }
  });
}

// Interactive Particle System Logic for space-canvas
const canvas = document.getElementById('space-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  const numParticles = Math.min(120, Math.floor(window.innerWidth / 10)); // Responsive particle count
  
  // Mouse interaction
  let mouse = { x: null, y: null, radius: 160 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  // Resize canvas to fit window
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
      // Boundary collision
      if (this.x > width || this.x < 0) this.dx = -this.dx;
      if (this.y > height || this.y < 0) this.dy = -this.dy;
      
      // Mouse interaction
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
          // Gradient line
          const gradient = ctx.createLinearGradient(particles[a].x, particles[a].y, particles[b].x, particles[b].y);
          gradient.addColorStop(0, particles[a].color.replace(')', `, ${opacity})`).replace('rgb', 'rgba').replace('#7c3aed', `rgba(124, 58, 237, ${opacity})`).replace('#06b6d4', `rgba(6, 182, 212, ${opacity})`).replace('#ff7a6b', `rgba(255, 122, 107, ${opacity})`));
          gradient.addColorStop(1, particles[b].color.replace(')', `, ${opacity})`).replace('rgb', 'rgba').replace('#7c3aed', `rgba(124, 58, 237, ${opacity})`).replace('#06b6d4', `rgba(6, 182, 212, ${opacity})`).replace('#ff7a6b', `rgba(255, 122, 107, ${opacity})`));
          
          ctx.strokeStyle = gradient;
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

if (contactToggle && contactForm && contactCard) {
  contactToggle.addEventListener('click', () => {
    const isVisible = contactForm.classList.toggle('contact__form--visible');
    contactToggle.classList.toggle('contact-toggle--hidden', isVisible);
    contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        _subject: 'Portfolio Inquiry'
      };

      const response = await fetch("https://formsubmit.co/ajax/77cbb6eb8c99d8ff1901ae7cb45d9fed", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        formStatus.textContent = 'Your message has been sent successfully.';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again later.';
      }
    } catch (error) {
      formStatus.textContent = 'Unable to send your message right now. Please try again.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      }
    }
  });
}

// Interactive Particle System Logic for space-canvas
const canvas = document.getElementById('space-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  const numParticles = Math.min(120, Math.floor(window.innerWidth / 10)); // Responsive particle count
  
  // Mouse interaction
  let mouse = { x: null, y: null, radius: 160 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  // Resize canvas to fit window
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
      // Boundary collision
      if (this.x > width || this.x < 0) this.dx = -this.dx;
      if (this.y > height || this.y < 0) this.dy = -this.dy;
      
      // Mouse interaction
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
          // Gradient line
          const gradient = ctx.createLinearGradient(particles[a].x, particles[a].y, particles[b].x, particles[b].y);
          gradient.addColorStop(0, particles[a].color.replace(')', `, ${opacity})`).replace('rgb', 'rgba').replace('#7c3aed', `rgba(124, 58, 237, ${opacity})`).replace('#06b6d4', `rgba(6, 182, 212, ${opacity})`).replace('#ff7a6b', `rgba(255, 122, 107, ${opacity})`));
          gradient.addColorStop(1, particles[b].color.replace(')', `, ${opacity})`).replace('rgb', 'rgba').replace('#7c3aed', `rgba(124, 58, 237, ${opacity})`).replace('#06b6d4', `rgba(6, 182, 212, ${opacity})`).replace('#ff7a6b', `rgba(255, 122, 107, ${opacity})`));
          
          ctx.strokeStyle = gradient;
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
    // Add a trailing effect by filling with semi-transparent background
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
