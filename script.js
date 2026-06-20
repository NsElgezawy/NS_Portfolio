/* ============================================
   Anas Mohamed El-Gezawy — Portfolio Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading Screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('loader-hidden');
    }, 350);
  });

  /* ---------- Theme Toggle ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  if (localStorage.getItem('theme') === 'dark') {
    html.classList.add('dark');
  } else if (!localStorage.getItem('theme') &&
             window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.classList.add('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      html.classList.toggle('dark');
      localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  /* ---------- Mobile Menu ---------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  /* ---------- Smooth Scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Fade-in on Scroll ---------- */
  const fadeObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, fadeObserverOptions);

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  /* ---------- Rotating Typing Animation ---------- */
  const typingEl = document.getElementById('typing-text');
  const typingWords = ['Artificial Intelligence', 'Machine Learning', 'Natural Language Processing', 'Computer Vision'];

  if (typingEl) {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const currentWord = typingWords[wordIndex];

      if (!deleting) {
        charIndex++;
        typingEl.textContent = currentWord.slice(0, charIndex);
        if (charIndex === currentWord.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        typingEl.textContent = currentWord.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % typingWords.length;
        }
      }
      setTimeout(typeLoop, deleting ? 45 : 90);
    }

    setTimeout(typeLoop, 700);
  }

  /* ---------- Animated Stat Counters ---------- */
  const statEls = document.querySelectorAll('.stat-number[data-count]');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  statEls.forEach(el => countObserver.observe(el));

  /* ---------- Project Filtering ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('project-search');
  let activeFilter = 'all';

  function applyProjectFilters() {
    const query = (searchInput && searchInput.value || '').trim().toLowerCase();

    projectCards.forEach(card => {
      const categories = (card.getAttribute('data-category') || '').split(',');
      const text = card.textContent.toLowerCase();
      const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
      const matchesSearch = query === '' || text.includes(query);
      card.classList.toggle('is-hidden', !(matchesFilter && matchesSearch));
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      applyProjectFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyProjectFilters);
  }

  /* ---------- Resume Download Tracking ---------- */
  const resumeLinks = document.querySelectorAll('.resume-download-link');

  function bumpCounter(namespace, key) {
    return fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
      .then(res => res.json())
      .then(data => data.value)
      .catch(() => {
        const localKey = `${namespace}-${key}`;
        const current = parseInt(localStorage.getItem(localKey) || '0', 10) + 1;
        localStorage.setItem(localKey, current);
        return current;
      });
  }

  resumeLinks.forEach(link => {
    link.addEventListener('click', () => {
      bumpCounter('nselgezawy-portfolio', 'resume-downloads').then(count => {
        if (typeof count === 'number') {
          console.log(`Resume downloaded ${count} time(s).`);
        }
      });
    });
  });

  /* ---------- Visitor Counter ---------- */
  const visitorCounterEl = document.getElementById('visitor-counter');

  if (visitorCounterEl) {
    bumpCounter('nselgezawy-portfolio', 'visits').then(count => {
      visitorCounterEl.textContent = (typeof count === 'number' ? count : '—').toLocaleString();
    });
  }

  /* ---------- Back to Top ---------- */
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop && backToTop.classList.add('show');
    } else {
      backToTop && backToTop.classList.remove('show');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Hero Parallax ---------- */
  const hero = document.querySelector('#home');
  window.addEventListener('scroll', () => {
    if (!hero) return;
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
      hero.style.backgroundPositionY = `${scrolled * 0.4}px`;
    }
  });

});
