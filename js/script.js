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

  // Simple lightbox for gallery and diagram images (if present)
  const lightboxImages = document.querySelectorAll('.gallery-grid img, .diagram-figure img');
  if (lightboxImages.length > 0) {
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
    lightboxImages.forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Expanded image';
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
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
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

  // Subtle scroll progress indicator under the nav
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  const updateProgress = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = p + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Side images: fade/scale based on proximity to viewport center
  const sideImages = document.querySelectorAll('.side-image');
  if (sideImages.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('is-visible');
        else e.target.classList.remove('is-visible');
      });
    }, { threshold: 0.1 });
    sideImages.forEach(img => io.observe(img));

    const updateSideFX = () => {
      const vh = window.innerHeight;
      sideImages.forEach(img => {
        const r = img.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const dist = Math.abs(center - vh / 2);
        const norm = Math.min(1, dist / (vh / 2));
        const scale = 0.97 + (1 - norm) * 0.06; // 0.97..1.03
        const opacity = 0.6 + (1 - norm) * 0.4; // 0.6..1
        img.style.transform = `scale(${scale.toFixed(3)})`;
        img.style.opacity = opacity.toFixed(2);
      });
    };
    window.addEventListener('scroll', updateSideFX, { passive: true });
    window.addEventListener('resize', updateSideFX);
    updateSideFX();
  }

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

  // Responsive offsets to avoid overlapping CTAs on shorter screens
  const applyHeroOffsets = () => {
    const h = window.innerHeight;
    const root = document.documentElement;
    if (h < 800) {
      root.style.setProperty('--left-hero-offset', '16rem');
      root.style.setProperty('--right-hero-offset', '42rem');
    } else {
      root.style.setProperty('--left-hero-offset', '22rem');
      root.style.setProperty('--right-hero-offset', '52rem');
    }
  };
  applyHeroOffsets();
  window.addEventListener('resize', applyHeroOffsets);
});
