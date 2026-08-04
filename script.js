const toggleButton = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const contactCard = document.querySelector('.contact__card');
const contactForm = document.querySelector('.contact__form');
const formStatus = document.querySelector('.form-status');
const contactToggle = document.querySelector('.contact-toggle');

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

// Space Animation Canvas Logic
const canvas = document.getElementById('space-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let stars = [];
  const numStars = 400;
  
  // Resize canvas to fit window
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  // Initialize stars
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * width,
      size: Math.random() * 2 + 0.5,
      color: `rgba(${Math.floor(Math.random() * 50 + 205)}, ${Math.floor(Math.random() * 50 + 205)}, 255, ${Math.random()})`
    });
  }
  
  // Shooting star
  let shootingStar = {
    x: 0,
    y: 0,
    length: 0,
    speed: 0,
    opacity: 0,
    active: false,
    angle: 0
  };
  
  function spawnShootingStar() {
    if (!shootingStar.active && Math.random() < 0.005) {
      shootingStar.active = true;
      shootingStar.x = Math.random() * width;
      shootingStar.y = 0;
      shootingStar.length = Math.random() * 80 + 20;
      shootingStar.speed = Math.random() * 15 + 10;
      shootingStar.opacity = 1;
      shootingStar.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // Roughly diagonal
    }
  }
  
  function updateShootingStar() {
    if (shootingStar.active) {
      shootingStar.x -= Math.cos(shootingStar.angle) * shootingStar.speed;
      shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
      shootingStar.opacity -= 0.015;
      
      if (shootingStar.opacity <= 0 || shootingStar.x < 0 || shootingStar.y > height) {
        shootingStar.active = false;
      }
    }
  }
  
  function drawShootingStar() {
    if (shootingStar.active) {
      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(
        shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.length,
        shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
      );
      ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  
  function animate() {
    // Clear with a slight fade to create motion blur trails
    ctx.fillStyle = 'rgba(6, 8, 22, 0.2)';
    ctx.fillRect(0, 0, width, height);
    
    // Move and draw stars
    stars.forEach(star => {
      // Move star closer (decrease z)
      star.z -= 2;
      
      // Reset star if it passes the screen
      if (star.z <= 0) {
        star.x = Math.random() * width - width / 2;
        star.y = Math.random() * height - height / 2;
        star.z = width;
      }
      
      // Calculate 2D projection
      const projection = width / star.z;
      const xProjected = star.x * projection + width / 2;
      const yProjected = star.y * projection + height / 2;
      
      // Calculate size based on depth
      const sizeProjected = star.size * projection;
      
      // Only draw if within bounds
      if (xProjected > 0 && xProjected < width && yProjected > 0 && yProjected < height) {
        ctx.beginPath();
        ctx.arc(xProjected, yProjected, sizeProjected, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
      }
    });
    
    spawnShootingStar();
    updateShootingStar();
    drawShootingStar();
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

