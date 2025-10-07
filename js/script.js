// Global JavaScript for the r3Design multi-page site
// Implements scroll reveal animations, dynamic nav highlighting and a simple gallery lightbox.

document.addEventListener('DOMContentLoaded', () => {
  // Highlight the active navigation link based on current path
  const navLinks = document.querySelectorAll('nav ul li a');
  const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const target = href.replace('.html', '').replace('./', '');
      if (target === page) {
        link.classList.add('active');
      }
    }
  });

  // Scroll reveal using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealElements.forEach(el => revealObserver.observe(el));

  // Simple lightbox for gallery images (if present)
  const galleryImages = document.querySelectorAll('.gallery-grid img');
  if (galleryImages.length > 0) {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.position = 'fixed';
    lightbox.style.top = 0;
    lightbox.style.left = 0;
    lightbox.style.width = '100%';
    lightbox.style.height = '100%';
    lightbox.style.background = 'rgba(0,0,0,0.8)';
    lightbox.style.display = 'none';
    lightbox.style.alignItems = 'center';
    lightbox.style.justifyContent = 'center';
    lightbox.style.zIndex = 2000;
    lightbox.innerHTML = '<span style="position:absolute; top:20px; right:30px; font-size:2rem; color:white; cursor:pointer;">&times;</span><img style="max-width:90%; max-height:90%; border-radius:12px; box-shadow:0 0 30px rgba(0,255,255,0.3);" src="" alt="Expanded image">';
    document.body.appendChild(lightbox);
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('span');
    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
      });
    });
    closeBtn.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    });
  }

  // Dynamically add full-page animations to body (without changing HTML)
  const heroAnimation = document.createElement('div');
  heroAnimation.className = 'hero-animation';

  // Add floating orbs
  for (let i = 1; i <= 3; i++) {
    const orb = document.createElement('div');
    orb.className = `floating-orb orb-${i}`;
    heroAnimation.appendChild(orb);
  }

  // Add particle field
  const particleField = document.createElement('div');
  particleField.className = 'particle-field';
  heroAnimation.appendChild(particleField);

  document.body.appendChild(heroAnimation);

  // Inject an accessible hamburger toggle for mobile navigation
  const navEl = document.querySelector('nav');
  if (navEl) {
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', 'main-navigation');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Toggle navigation');
    toggle.innerHTML = '<svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="18" height="2" rx="1" fill="currentColor"/><rect y="5" width="18" height="2" rx="1" fill="currentColor"/><rect y="10" width="18" height="2" rx="1" fill="currentColor"/></svg>';

    // mark the nav list for aria reference
    const navList = navEl.querySelector('ul');
    if (navList) {
      navList.id = 'main-navigation';
    }

    navEl.appendChild(toggle);

    const setExpanded = (expanded) => {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      if (expanded) navEl.classList.add('nav-open'); else navEl.classList.remove('nav-open');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setExpanded(!isOpen);
    });

    // Close nav when a link is clicked (mobile UX)
    navList && navList.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') setExpanded(false);
    });

    // allow ESC to close when nav is open
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setExpanded(false);
      }
    });
  }
});