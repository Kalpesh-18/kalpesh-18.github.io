/**
 * animations.js — Scroll-driven UI animations
 *
 * Exports four independent initializers — import and call each in main.js:
 *
 *   initNav()          — scrolled class + mobile menu toggle
 *   initScrollReveal() — IntersectionObserver fade-in for .reveal elements
 *   initCounters()     — animated number counters in the hero stats
 *   initSkillBars()    — animates .bar-fill width when skill groups enter view
 *
 * To add a new animation: write a new exported function here and call it
 * in main.js. No other files need to change.
 */

// ─────────────────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Adds `.scrolled` to #nav when the page scrolls past 40px.
 * Wires the mobile hamburger toggle for small screens.
 */
export function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  // Scroll state
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile menu
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Close on any nav link click
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Watches all `.reveal` elements and adds `.visible` when they enter the
 * viewport. Stagger delay is applied to sibling cards (projects, skills).
 */
export function initScrollReveal() {
  const STAGGER_PARENTS = ['.projects-grid', '.skills-grid'];

  // Apply stagger data attributes to child reveals
  STAGGER_PARENTS.forEach((sel) => {
    const parent = document.querySelector(sel);
    if (!parent) return;
    parent.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 90}ms`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// ─────────────────────────────────────────────────────────────────────────────
// COUNTERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Animates elements with `data-target` from 0 to their target value.
 * Supports decimals via `data-decimal="true"`.
 */
export function initCounters() {
  const animate = (el) => {
    const isDecimal = el.dataset.decimal === 'true';
    const target    = parseFloat(el.dataset.target);
    const duration  = 1600; // ms
    const start     = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = isDecimal
        ? (ease * target).toFixed(2)
        : Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll('.stat-value[data-target]').forEach((el) =>
    observer.observe(el)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LEETCODE DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Animates the LeetCode dashboard when it scrolls into view:
 *  - SVG ring stroke-dashoffset counts up to represent 343/~900 solved
 *  - Difficulty bars (.lc-diff-fill) fill to their data-w widths
 *  - Language bars (.lc-lang-fill) fill to their data-w widths
 */
export function initLeetcodeDashboard() {
  const dashboard = document.querySelector('.lc-dashboard');
  if (!dashboard) return;

  // Circumference for r=34 circle: 2π×34 ≈ 213.6
  const CIRCUMFERENCE = 213.6;
  // 343 problems out of ~900 total on LeetCode ≈ 38% of ring
  const SOLVED_RATIO  = 343 / 900;

  const animateDashboard = () => {
    // Ring
    const ring = dashboard.querySelector('.ring-fill');
    if (ring) {
      const offset = CIRCUMFERENCE - SOLVED_RATIO * CIRCUMFERENCE;
      ring.style.strokeDashoffset = offset;
    }

    // Difficulty + language bars — driven by data-w attribute (percentage 0–100)
    dashboard.querySelectorAll('.lc-diff-fill, .lc-lang-fill').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = (bar.dataset.w ?? '0') + '%';
      }, i * 100);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateDashboard();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(dashboard);
}


/**
 * When a `.skill-group` enters the viewport, its `.bar-fill` elements
 * animate to the width specified by `data-level` on the parent `.skill-bar`.
 * Each bar is staggered by 110ms.
 */
export function initSkillBars() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll('.skill-bar').forEach((bar, i) => {
          setTimeout(() => {
            const fill  = bar.querySelector('.bar-fill');
            const level = bar.dataset.level ?? '0';
            if (fill) fill.style.width = `${level}%`;
          }, i * 110);
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.skill-group').forEach((el) =>
    observer.observe(el)
  );
}
