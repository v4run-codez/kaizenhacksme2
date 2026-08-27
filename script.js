/**
 * KAIZEN HACKS — SPRINT // 2026
 * HIGH-PRECISION RUNTIME & INTERACTIVE ENGINE
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DOM Elements
  const body = document.body;
  const pageLoader = document.getElementById('page-loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderStatus = document.getElementById('loader-status');
  const scrollProgress = document.getElementById('scroll-progress');
  const mainNav = document.getElementById('main-nav');
  const bgGrid = document.getElementById('bg-grid');
  const orb1 = document.getElementById('orb-1');
  const orb2 = document.getElementById('orb-2');
  const matrixCanvas = document.getElementById('matrix-canvas');
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineSection = document.getElementById('timeline');
  const footerClock = document.getElementById('footer-clock');
  const toastContainer = document.getElementById('toast-container');
  const applyModal = document.getElementById('apply-modal');
  const applyForm = document.getElementById('apply-form');
  const modalSuccess = document.getElementById('modal-success-state');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDoneBtn = document.getElementById('modal-done-btn');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');

  /* ============================================================
     1. PROCEDURAL SOUND SYNTHESIZER (WEB AUDIO API)
     ============================================================ */
  let audioEnabled = true;
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!audioEnabled || prefersReducedMotion) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.02);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
        osc.start(now);
        osc.stop(now + 0.02);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.04);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'tab') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.03);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Audio Toggle Button
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      const onIcon = audioToggleBtn.querySelector('.audio-icon-on');
      const offIcon = audioToggleBtn.querySelector('.audio-icon-off');
      if (audioEnabled) {
        if (onIcon) onIcon.style.display = 'block';
        if (offIcon) offIcon.style.display = 'none';
        showToast('AUDIO EFFECTS: ACTIVE');
        playSound('click');
      } else {
        if (onIcon) onIcon.style.display = 'none';
        if (offIcon) offIcon.style.display = 'block';
        showToast('AUDIO EFFECTS: MUTED');
      }
    });
  }

  /* ============================================================
     2. AMBIENT MATRIX DIGITAL TEXTURE (DARK MODE ONLY)
     ============================================================ */
  function initMatrixRain() {
    if (!matrixCanvas || prefersReducedMotion) return;
    const ctx = matrixCanvas.getContext('2d');
    if (!ctx) return;

    let width = (matrixCanvas.width = window.innerWidth);
    let height = (matrixCanvas.height = window.innerHeight);

    const chars = '改善KAIZEN0123456789SDG_NODE_DELHI_V2.6';
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops = Array(columns).fill(1);

    function draw() {
      if (document.documentElement.getAttribute('data-theme') === 'light') {
        return;
      }
      ctx.fillStyle = 'rgba(6, 9, 8, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(40, 122, 91, 0.12)';
      ctx.font = `${fontSize}px JetBrains Mono`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    setInterval(draw, 60);

    window.addEventListener('resize', () => {
      width = matrixCanvas.width = window.innerWidth;
      height = matrixCanvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    });
  }

  /* ============================================================
     3. SYSTEM BOOT LOADER
     ============================================================ */
  function initLoader() {
    if (prefersReducedMotion) {
      if (pageLoader) pageLoader.style.display = 'none';
      body.classList.remove('loading');
      return;
    }

    if (loaderBar) loaderBar.style.width = '100%';

    setTimeout(() => {
      if (loaderStatus) loaderStatus.textContent = 'SYS_OK // NODE_DELHI ACTIVE';
    }, 300);

    setTimeout(() => {
      if (pageLoader) pageLoader.classList.add('loaded');
      body.classList.remove('loading');
      playSound('click');
    }, 600);
  }

  /* ============================================================
     4. SCROLL PROGRESS & STICKY NAV
     ============================================================ */
  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollProgress && docHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      scrollProgress.style.width = pct + '%';
    }

    if (mainNav) {
      if (scrollY > 25) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    }

    if (bgGrid && !prefersReducedMotion) {
      bgGrid.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0)`;
    }

    if (orb1 && !prefersReducedMotion) {
      orb1.style.transform = `translate3d(0, ${scrollY * -0.05}px, 0)`;
    }
    if (orb2 && !prefersReducedMotion) {
      orb2.style.transform = `translate3d(0, ${scrollY * 0.04}px, 0)`;
    }

    if (timelineSection && timelineProgress) {
      const rect = timelineSection.getBoundingClientRect();
      const windowH = window.innerHeight;
      if (rect.top <= windowH && rect.bottom >= 0) {
        const total = rect.height;
        const visible = windowH - rect.top;
        const pct = Math.min(100, Math.max(0, (visible / total) * 100));
        timelineProgress.style.height = pct + '%';
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ============================================================
     5. HUD CARD INTERACTIVE TAB CONTROLLER
     ============================================================ */
  function initHudTabs() {
    const tabBtns = document.querySelectorAll('.hud-tab-btn');
    const tabPanes = document.querySelectorAll('.hud-tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(`tab-${targetTab}`);
        if (targetPane) {
          targetPane.classList.add('active');
        }

        playSound('tab');
      });

      btn.addEventListener('mouseenter', () => playSound('hover'));
    });
  }

  /* ============================================================
     6. THEME TOGGLE CONTROLLER
     ============================================================ */
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem('kaizen-theme', theme);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('kaizen-theme') || 'dark';
    applyTheme(savedTheme);

    const toggleHandler = () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      playSound('click');
      showToast(`THEME MODE: ${nextTheme.toUpperCase()}`);
    };

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleHandler);
      themeToggleBtn.addEventListener('mouseenter', () => playSound('hover'));
    }
    if (mobileThemeToggle) {
      mobileThemeToggle.addEventListener('click', toggleHandler);
    }
  }

  /* ============================================================
     7. LIVE UTC & TELEMETRY CLOCK
     ============================================================ */
  function updateClock() {
    if (footerClock) {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      footerClock.textContent = `UTC ${h}:${m}:${s}`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  /* ============================================================
     8. TOAST NOTIFICATION SYSTEM
     ============================================================ */
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color:var(--accent);">■</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  /* ============================================================
     9. APPLICATION DOSSIER MODAL
     ============================================================ */
  function openModal(eventName) {
    if (!applyModal) return;
    const heading = document.getElementById('modal-event-heading');
    if (heading && eventName) {
      heading.textContent = `REGISTER FOR ${eventName.toUpperCase()}`;
    }
    applyModal.classList.add('active');
    applyModal.setAttribute('aria-hidden', 'false');
    playSound('click');
  }

  function closeModal() {
    if (!applyModal) return;
    applyModal.classList.remove('active');
    applyModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      if (applyForm) applyForm.style.display = 'flex';
      if (modalSuccess) modalSuccess.style.display = 'none';
      if (applyForm) applyForm.reset();
    }, 250);
  }

  function initModal() {
    const triggers = [
      document.getElementById('nav-apply-btn'),
      document.getElementById('mobile-apply-btn'),
      document.getElementById('hero-card-claim-btn'),
      document.getElementById('final-apply-btn'),
      document.getElementById('venue-click-target')
    ];

    document.querySelectorAll('.apply-trigger-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const evName = btn.getAttribute('data-event') || 'GREENTECH IDEATHON';
        openModal(evName);
      });
      btn.addEventListener('mouseenter', () => playSound('hover'));
    });

    triggers.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => openModal('GREENTECH IDEATHON'));
        btn.addEventListener('mouseenter', () => playSound('hover'));
      }
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);

    if (applyModal) {
      applyModal.addEventListener('click', (e) => {
        if (e.target === applyModal) closeModal();
      });
    }

    if (applyForm) {
      applyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-dossier-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'TRANSMITTING DOSSIER...';
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>SUBMIT REGISTRATION DOSSIER →</span>';
          }
          if (applyForm) applyForm.style.display = 'none';
          if (modalSuccess) modalSuccess.style.display = 'block';
          playSound('success');
          showToast('DOSSIER LOGGED // SEAT RESERVED IN REVIEW QUEUE');
        }, 500);
      });
    }

    const cliBtn = document.getElementById('terminal-preview-btn');
    if (cliBtn) {
      cliBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('curl -s https://kaizen.dev/sprint | bash').then(() => {
          showToast('COPIED CLI COMMAND TO CLIPBOARD');
          playSound('click');
        }).catch(() => {
          showToast('CLI INGESTION READY: curl kaizen.dev');
        });
      });
    }
  }

  /* ============================================================
     10. MOBILE NAVIGATION DRAWER
     ============================================================ */
  function initMobileDrawer() {
    if (!mobileToggle || !mobileDrawer) return;

    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('active');
      if (isOpen) {
        mobileDrawer.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('active');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
      playSound('click');
    });

    if (drawerClose) {
      drawerClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
        playSound('click');
      });
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================================================
     11. FAQ ACCORDION INTERACTION
     ============================================================ */
  function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');

      if (trigger && content) {
        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');
          
          faqItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('is-open');
              const otherTrig = other.querySelector('.faq-trigger');
              const otherCont = other.querySelector('.faq-content');
              if (otherTrig) otherTrig.setAttribute('aria-expanded', 'false');
              if (otherCont) otherCont.style.maxHeight = null;
            }
          });

          if (isOpen) {
            item.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = null;
          } else {
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
            content.style.maxHeight = content.scrollHeight + 'px';
            playSound('tab');
          }
        });

        trigger.addEventListener('mouseenter', () => playSound('hover'));
      }
    });
  }

  /* ============================================================
     12. INTERSECTION OBSERVER FOR SCROLL REVEALS
     ============================================================ */
  function initObserver() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('active'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
  }

  /* ============================================================
     13. INITIALIZE SYSTEM UPON DOM LOAD
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLoader();
    initMatrixRain();
    initHudTabs();
    initModal();
    initMobileDrawer();
    initFaq();
    initObserver();
  });

})();
