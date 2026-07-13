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

      const response = await fetch('https://formsubmit.co/ajax/manojsunku2003@gmail.com', {
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
