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

  /* ---------- Mode Switcher (Professional / Creative / Terminal / Research) ---------- */
  /* Only one special mode may be active at a time, selected from a single
     dropdown menu. Fully reversible and persisted independently from the
     dark/light theme. */
  const transitionOverlay = document.getElementById('theme-transition-overlay');
  const modeSwitcher = document.getElementById('mode-switcher');
  const modeMenuBtn = document.getElementById('mode-menu-btn');
  const modeMenuIcon = document.getElementById('mode-menu-icon');
  const modeMenuLabel = document.getElementById('mode-menu-label');
  const modeMenuDropdown = document.getElementById('mode-menu-dropdown');
  const modeOptions = document.querySelectorAll('.mode-option');

  const specialModes = {
    none: { className: null, icon: '&#127917;', label: 'Modes' },
    creative: { className: 'minecraft-mode', icon: '&#9935;&#65039;', label: 'Creative Mode' },
    terminal: { className: 'terminal-mode', icon: '&#9000;&#65039;', label: 'Terminal Mode' },
    research: { className: 'research-mode', icon: '&#128218;', label: 'Research Mode' }
  };

  function playBlockSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        const start = now + i * 0.045;
        osc.frequency.setValueAtTime(260 - i * 60, start);
        osc.frequency.exponentialRampToValueAtTime(70, start + 0.09);
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.1);
      }

      setTimeout(() => ctx.close(), 400);
    } catch (err) {
      /* Audio not available — fail silently */
    }
  }

  function closeModeDropdown() {
    if (!modeMenuDropdown || !modeMenuBtn) return;
    modeMenuDropdown.classList.remove('open');
    modeMenuBtn.setAttribute('aria-expanded', 'false');
  }

  function openModeDropdown() {
    if (!modeMenuDropdown || !modeMenuBtn) return;
    modeMenuDropdown.classList.add('open');
    modeMenuBtn.setAttribute('aria-expanded', 'true');
  }

  function updateModeUI(activeKey) {
    const active = specialModes[activeKey] || specialModes.none;

    if (modeMenuIcon) modeMenuIcon.innerHTML = active.icon;
    if (modeMenuLabel) modeMenuLabel.textContent = active.label;

    modeOptions.forEach(opt => {
      const isActive = opt.getAttribute('data-mode') === activeKey;
      opt.classList.toggle('active', isActive);
      opt.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  function applySpecialMode(activeKey) {
    Object.keys(specialModes).forEach(key => {
      const className = specialModes[key].className;
      if (className) html.classList.toggle(className, key === activeKey);
    });
    updateModeUI(activeKey);
  }

  function setSpecialMode(activeKey, persist) {
    applySpecialMode(activeKey);
    if (persist) {
      localStorage.setItem('specialMode', activeKey || 'none');
    }
  }

  function migrateLegacySpecialMode() {
    const stored = localStorage.getItem('specialMode');
    if (stored) return stored;
    if (localStorage.getItem('creativeMode') === 'on') return 'creative';
    return 'none';
  }

  const initialSpecialMode = migrateLegacySpecialMode();
  setSpecialMode(initialSpecialMode, false);

  if (modeMenuBtn) {
    modeMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = modeMenuDropdown && modeMenuDropdown.classList.contains('open');
      if (isOpen) {
        closeModeDropdown();
      } else {
        openModeDropdown();
      }
    });
  }

  modeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const nextKey = opt.getAttribute('data-mode') || 'none';
      const currentKey = localStorage.getItem('specialMode') || 'none';

      closeModeDropdown();

      if (nextKey === currentKey) return;

      if (nextKey === 'creative') {
        playBlockSound();
      }

      if (transitionOverlay) transitionOverlay.classList.add('flash');

      setTimeout(() => {
        setSpecialMode(nextKey, true);
        if (transitionOverlay) transitionOverlay.classList.remove('flash');
      }, 180);
    });
  });

  document.addEventListener('click', (e) => {
    if (modeSwitcher && !modeSwitcher.contains(e.target)) {
      closeModeDropdown();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModeDropdown();
  });

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
  const noResults = document.getElementById('no-results');
  let activeFilter = 'all';

  function applyProjectFilters() {
    const query = (searchInput && searchInput.value || '').trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach(card => {
      const categories = (card.getAttribute('data-category') || '').split(',');
      const text = card.textContent.toLowerCase();
      const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
      const matchesSearch = query === '' || text.includes(query);
      const show = matchesFilter && matchesSearch;
      card.classList.toggle('is-hidden', !show);
      if (show) visibleCount++;
    });

    if (noResults) {
      noResults.classList.toggle('hidden', visibleCount !== 0);
    }
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

  /* ---------- Video Modal ---------- */
  const videoModal = document.getElementById('video-modal');
  const videoFrameWrap = document.getElementById('video-modal-frame');
  const videoModalClose = document.getElementById('video-modal-close');

  function openVideoModal(youtubeId) {
    if (!videoModal || !videoFrameWrap) return;
    videoFrameWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" title="Project demo video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal || !videoFrameWrap) return;
    videoModal.classList.remove('open');
    videoFrameWrap.innerHTML = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-youtube-id]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      openVideoModal(trigger.getAttribute('data-youtube-id'));
    });
  });

  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });

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
