/* ═══════════════════════════════════════════════════════════
   PolishPoint — Shared JavaScript
   Navigation, scroll effects, interactive widgets
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initScrollProgress();
  initFAQ();
  initFeatureTabs();
  initCalculator();
  initCounters();
  initSpotlight();
  initRipple();
});

/* ── Navigation ── */
function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (!nav) return;

  // Scroll effect
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  });
  nav.classList.toggle('scrolled', window.scrollY > 40);

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Scroll Progress Bar ── */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  });
}

/* ── FAQ Accordion ── */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = '0';
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ── Feature Tabs ── */
function initFeatureTabs() {
  const tabs = document.querySelectorAll('.feature-tab');
  const panels = document.querySelectorAll('.feature-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ── Savings Calculator ── */
function initCalculator() {
  const monthlySlider = document.getElementById('calc-monthly');
  const yearsSlider = document.getElementById('calc-years');
  if (!monthlySlider || !yearsSlider) return;

  const monthlyVal = document.getElementById('calc-monthly-val');
  const yearsVal = document.getElementById('calc-years-val');
  const theirCost = document.getElementById('calc-theirs');
  const ourCost = document.getElementById('calc-ours');
  const savings = document.getElementById('calc-savings');

  function updateSliderTrack(slider) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = 'linear-gradient(to right, var(--blue-500) 0%, var(--cyan-400) ' + pct + '%, var(--dark-600) ' + pct + '%)';
  }

  function update() {
    const monthly = parseInt(monthlySlider.value);
    const years = parseInt(yearsSlider.value);

    monthlyVal.textContent = '$' + monthly.toLocaleString() + '/mo';
    yearsVal.textContent = years + (years === 1 ? ' year' : ' years');

    updateSliderTrack(monthlySlider);
    updateSliderTrack(yearsSlider);

    const totalTheirs = monthly * 12 * years;
    const totalOurs = 1000 + (50 * 12 * years);

    theirCost.textContent = '$' + totalTheirs.toLocaleString();
    ourCost.textContent = '$' + totalOurs.toLocaleString();

    const saved = totalTheirs - totalOurs;
    savings.textContent = '$' + Math.max(0, saved).toLocaleString();
  }

  monthlySlider.addEventListener('input', update);
  yearsSlider.addEventListener('input', update);
  update();
}

/* ── Animated Counters ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── Cursor Spotlight ── */
function initSpotlight() {
  const spotlight = document.querySelector('.spotlight');
  if (!spotlight || window.innerWidth < 768) return;

  document.addEventListener('mousemove', (e) => {
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top = e.clientY + 'px';
    spotlight.classList.add('visible');
  });
  document.addEventListener('mouseleave', () => {
    spotlight.classList.remove('visible');
  });
}

/* ── Button Ripple Effect ── */
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ── Calendly Integration Helper ── */
function openCalendly() {
  if (typeof Calendly !== 'undefined') {
    Calendly.initPopupWidget({ url: 'https://calendly.com/polishpoint/demo' });
  } else {
    window.open('https://calendly.com/polishpoint/demo', '_blank');
  }
  return false;
}

/* ── Smooth scroll for anchor links ── */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
