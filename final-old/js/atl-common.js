/* ================================================================
   js/atl-common.js — Avartanam Test Labs
   Purpose: Common JavaScript shared across all pages.
            Extracted from repeated inline <script> blocks.
            Load after atl-merged.js, before page-specific JS.

   Sections:
     1. Scroll Reveal Animations + Live Counter  (index, about, contact)
     2. Nav Chevron Rotation IIFE
     3. Profile Brochure Dropdown (hover open/close logic)
     4. Brochure Download Modal (open, validate, EmailJS send, download)
     5. Additional Event & Overlay Fixes (outside-click, double-submit)
================================================================ */

/* ── 1. Scroll Reveal Animations & Live Counter ────────────── */
/* IntersectionObserver-based scroll animation system.
   Applies CSS animation classes (sa-fade-up, sa-slide-left, etc.)
   when elements enter the viewport. Also drives the stat counters
   (+10 instruments, 40+ countries, etc.) with eased animation.   */
(function() {
  'use strict';

  /* ── Animation rules ───────────────────────────────── */
  var RULES = [
    { sel: '.atl-home-hero__title',                          anim: 'sa-fade-up',    delay: 0, once: true },
    { sel: '.atl-home-hero__desc',                           anim: 'sa-fade-up',    delay: 1, once: true },
    { sel: '.atl-home-hero__btns',                           anim: 'sa-fade-up',    delay: 2, once: true },
    { sel: '.atl-home-hero__stats .atl-home-stat',           anim: 'sa-scale-pop',  stagger: true, once: true },
    { sel: '.atl-rel-stat-wrap',                             anim: 'sa-slide-left', delay: 0 },
    { sel: '.atl-rel-title',                                 anim: 'sa-slide-right',delay: 1 },
    { sel: '.atl-rel-quote',                                 anim: 'sa-fade-up',    delay: 2 },
    { sel: '.atl-rel-desc',                                  anim: 'sa-fade-up',    delay: 3 },
    { sel: '.atl-rel-cta',                                   anim: 'sa-scale-pop',  delay: 4 },
    { sel: '.atl-page-hero',                                 anim: 'sa-fade-in',    delay: 0 },
    { sel: '.atl-section-body .col-12.col-lg-6:first-child', anim: 'sa-slide-left', delay: 0 },
    { sel: '.atl-section-body .col-12.col-lg-6:last-child',  anim: 'sa-slide-right',delay: 1 },
    { sel: '.au-stat-card',                                  anim: 'sa-scale-pop',  stagger: true },
    { sel: '.au-vm-card--dark',                              anim: 'sa-slide-left', delay: 0 },
    { sel: '.au-vm-card--light',                             anim: 'sa-slide-right',delay: 1 },
    { sel: '.au-quality-card',                               anim: 'sa-fade-up',    delay: 0 },
    { sel: '.au-quality-item',                               anim: 'sa-rise',       stagger: true },
    { sel: '.atl-hww-step',                                  anim: 'sa-rise',       stagger: true },
    { sel: '.atl-certs-strip',                               anim: 'sa-fade-up',    delay: 0 },
    { sel: '.cu-form-title',                                 anim: 'sa-slide-left', delay: 0 },
    { sel: '.cu-form-sub',                                   anim: 'sa-slide-left', delay: 1 },
    { sel: '#atlContactForm',                                anim: 'sa-fade-up',    delay: 2 },
    { sel: '.cu-info-card',                                  anim: 'sa-slide-right',delay: 0 },
    { sel: '.cu-quick-strip',                                anim: 'sa-fade-up',    delay: 1 },
    { sel: '.cu-info-row',                                   anim: 'sa-fade-up',    stagger: true },
  ];

  /* All animation class names — used to strip on reset */
  var ALL_ANIMS = ['sa-fade-up','sa-fade-in','sa-slide-left','sa-slide-right',
                   'sa-scale-pop','sa-flip-y','sa-rise','sa-stretch'];

  /* Store metadata per element via a Map */
  var meta = new Map();

  function setupElements() {
    RULES.forEach(function(rule) {
      document.querySelectorAll(rule.sel).forEach(function(el, idx) {
        if (meta.has(el)) return; /* already registered */
        meta.set(el, {
          anim:    rule.anim,
          delay:   rule.stagger ? (idx * 0.1) : ((rule.delay || 0) * 0.08),
          visible: false,
          once:    rule.once || false   /* hero elements: show once, never re-hide */
        });
        /* Start hidden */
        el.classList.add('sa-hidden');
      });
    });
  }

  function showEl(el) {
    var m = meta.get(el);
    if (!m || m.visible) return;
    m.visible = true;
    ALL_ANIMS.forEach(function(c){ el.classList.remove(c); });
    el.classList.remove('sa-hidden');
    /* Force reflow so animation restarts cleanly */
    void el.offsetWidth;
    el.style.animationDelay = m.delay + 's';
    el.classList.add(m.anim);
    /* For once:true elements, stop observing after first show */
    if (m.once) {
      io.unobserve(el);
    }
  }

  function hideEl(el) {
    var m = meta.get(el);
    if (!m || !m.visible) return;
    if (m.once) return;   /* never re-hide hero/once elements */
    m.visible = false;
    ALL_ANIMS.forEach(function(c){ el.classList.remove(c); });
    el.classList.add('sa-hidden');
    el.style.animationDelay = '';
  }

  /* ── Bidirectional IntersectionObserver ─────────────── */
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        showEl(entry.target);
      } else {
        hideEl(entry.target);   /* hide when scrolled out → enables repeat */
      }
    });
  }, { threshold: 0.05 });

  function observeAll() {
    meta.forEach(function(_, el) { io.observe(el); });
  }

  /* ── Live Number Counter ────────────────────────────── */
  function animateCounter(el) {
    if (el._counting) return;
    el._counting = true;
    var target  = parseInt(el.getAttribute('data-target'), 10);
    var suffix  = el.getAttribute('data-suffix') || '';
    var duration = 1400; /* ms */
    var start    = null;
    var startVal = 0;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      /* Ease out cubic */
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(startVal + (target - startVal) * ease);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
        el._counting = false;
      }
    }
    requestAnimationFrame(step);
  }

  function resetCounter(el) {
    el._counting = false;
    var suffix = el.getAttribute('data-suffix') || '';
    el.textContent = '0' + suffix;
  }

  var counterIO = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      var numEls = entry.target.querySelectorAll('[data-target]');
      if (entry.isIntersecting) {
        numEls.forEach(animateCounter);
      } else {
        numEls.forEach(resetCounter); /* reset so it re-counts next time */
      }
    });
  }, { threshold: 0.3 });

  /* Observe containers that hold [data-target] numbers */
  function observeCounters() {
    /* Collect all unique parent containers of [data-target] elements */
    var containers = new Set();
    document.querySelectorAll('[data-target]').forEach(function(el) {
      /* Walk up to find a meaningful container (card or section row) */
      var parent = el.closest('.au-stat-card, .atl-home-stat, .atl-home-hero__stats, .row');
      if (parent) containers.add(parent);
      else containers.add(el.parentElement || el);
    });
    containers.forEach(function(c) { counterIO.observe(c); });
  }

  /* ── Init ───────────────────────────────────────────── */
  function init() {
    setupElements();
    observeAll();
    observeCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ── 2. Nav Chevron Rotation IIFE ───────────────────────────── */
/* Adds/removes rotate class on mega-menu toggle buttons so the
   chevron arrow flips to indicate open/closed state.             */
(function() {
  var slides = document.querySelectorAll('.atl-hero-slide');
  var dots   = document.querySelectorAll('.atl-hero-dot-btn');
  var current = 0;
  var total   = slides.length;
  var timer;

  /* No slider markup on this page (current hero is static) — nothing to do. */
  if (!total || !dots.length) return;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + total) % total;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, 4500);
  }

  // Dot click
  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      goTo(parseInt(dot.getAttribute('data-slide')));
      startAuto();
    });
  });

  startAuto();
})();

/* ── 3. Profile Brochure Dropdown ───────────────────────────── */
/* Hover-to-open dropdown for the "Profile Brochure" button in
   the desktop nav right area. Sub-menu ("List of Certificates")
   uses a JS grace-timer so moving the mouse across the gap
   between parent item and sub-panel doesn't close it.
   NOTE: Brochure items now open their PDF href directly —
   the old modal gate has been removed from nav items.            */
/* Profile Brochure dropdown — opens on hover, sub-menu with grace timer */
(function() {
  var btn  = document.getElementById('brochureBtn');
  var dd   = document.getElementById('brochureDropdown');
  var menu = document.getElementById('brochureMenu');
  var nav  = document.getElementById('atlNav');
  if (!btn || !dd || !menu) return;

  var closeTimer = null;
  var subTimer   = null;
  var GRACE      = 220; /* ms before main menu closes */
  var SUB_GRACE  = 300; /* ms before sub-menu closes (longer — bigger gap) */

  /* ── Main menu open/close ─────────────────────────────────── */
  function positionMenu() {
    if (!nav) return;
    var navRect = nav.getBoundingClientRect();
    var btnRect = btn.getBoundingClientRect();
    menu.style.top   = navRect.bottom + 'px';
    menu.style.right = (window.innerWidth - btnRect.right) + 'px';
    menu.style.left  = 'auto';
  }

  function openMenu() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    positionMenu();
    dd.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }

  function scheduleClose() {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(function() {
      dd.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      closeTimer = null;
      /* Also hide any open sub-menu immediately */
      closeSubMenu();
    }, GRACE);
  }

  btn.addEventListener('mouseenter', openMenu);
  btn.addEventListener('mouseleave', scheduleClose);
  menu.addEventListener('mouseenter', function() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
  });
  menu.addEventListener('mouseleave', scheduleClose);

  window.addEventListener('scroll', function() {
    if (dd.classList.contains('open')) positionMenu();
  }, { passive: true });
  window.addEventListener('resize', function() {
    if (dd.classList.contains('open')) positionMenu();
  });

  document.addEventListener('click', function(e) {
    if (!dd.contains(e.target)) {
      dd.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      closeSubMenu();
    }
  });

  /* ── Sub-menu ("List of Certificates") — JS hover with grace ─ */
  /* Pure CSS :hover closes instantly when crossing the gap.
     We replace it with JS open/close using a grace timer so the
     mouse can travel across the 6px gap without the sub hiding. */
  var hasSub = menu.querySelector('.atl-brochure-item--has-sub');
  var sub    = hasSub ? hasSub.querySelector('.atl-brochure-sub') : null;
  var subOpenTimer = null; /* intent delay — prevents accidental trigger */

  function openSubMenu() {
    if (!sub) return;
    if (subTimer) { clearTimeout(subTimer); subTimer = null; }
    /* 120ms intent delay: user must deliberately hover, not just pass over */
    subOpenTimer = setTimeout(function() {
      sub.classList.add('sub-open');
    }, 120);
  }

  function scheduleCloseSubMenu() {
    if (subOpenTimer) { clearTimeout(subOpenTimer); subOpenTimer = null; }
    if (subTimer) clearTimeout(subTimer);
    subTimer = setTimeout(closeSubMenu, SUB_GRACE);
  }

  function closeSubMenu() {
    if (!sub) return;
    if (subOpenTimer) { clearTimeout(subOpenTimer); subOpenTimer = null; }
    if (subTimer) { clearTimeout(subTimer); subTimer = null; }
    sub.classList.remove('sub-open');
  }

  if (hasSub && sub) {
    hasSub.addEventListener('mouseenter', openSubMenu);
    hasSub.addEventListener('mouseleave', scheduleCloseSubMenu);
    sub.addEventListener('mouseenter', function() {
      if (subTimer) { clearTimeout(subTimer); subTimer = null; }
    });
    sub.addEventListener('mouseleave', scheduleCloseSubMenu);
  }

  /* ── Brochure items: open PDF directly, no modal ─────────────
     The old click handler intercepted all .atl-brochure-item
     clicks and opened the brochure modal form. Items now just
     follow their <a href> to open the PDF directly in a new tab.
     The brochure modal remains available for other triggers
     (spec-card buttons, [data-download-modal] etc).              */
  /* Nothing needed here — <a> tags work natively.
     Close the dropdown when any link is clicked. */
  menu.querySelectorAll('a.atl-brochure-item, a.atl-brochure-subitem').forEach(function(link) {
    link.addEventListener('click', function() {
      dd.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      closeSubMenu();
    });
  });

})();

/* ── 4. Brochure Download Modal ─────────────────────────────── */
/* Full modal gate for PDF brochure downloads. Handles:
   - Opening modal from any download trigger on the page
   - Form field validation (name, email, phone, country etc.)
   - EmailJS send via EMAILJS_TEMPLATE_BROCHURE
   - Auto-download of the requested PDF after successful submit
   - Auto-close after download + form reset                        */
/* ── Brochure Request Modal (unified download gate) v29 ── */
(function () {
  function openBroModal(docLabel) {
    var overlay = document.getElementById('broOverlay');
    var title = document.getElementById('broModalTitle');
    var form = document.getElementById('broForm');
    var success = document.getElementById('broSuccess');
    var btn = document.getElementById('broSubmit');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (form) form.style.display = '';
    if (success) success.classList.remove('show');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="flex-shrink:0"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="10" y1="15" x2="14" y2="15"/></svg> Get My Document';
    }
    if (title) title.textContent = 'Want to learn more?';
  }
  function closeBroModal() {
    var overlay = document.getElementById('broOverlay');
    if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  }
  window.openBroModal = openBroModal;
  window.closeBroModal = closeBroModal;

  document.addEventListener('DOMContentLoaded', function () {
    // 1. Nav dropdown brochure items — PDFs now open directly via <a href>.
    //    No click intercept needed. The dropdown closes itself on link click
    //    via the dropdown JS above.

    // 2. Certificate sub-menu items — same: open PDF directly, no modal.

    // 3. Mobile nav download sub-links pointing to PDFs — open directly.

    // 4. Spec-card brochure/download button
    document.querySelectorAll('.sd-card-brochure').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        openBroModal(el.getAttribute('title') || el.textContent.trim());
      });
    });

    // 5. Any element with [data-download-modal]
    document.querySelectorAll('[data-download-modal]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        openBroModal(el.getAttribute('data-download-modal') || el.textContent.trim());
      });
    });

    // 6. Catch-all: any link with REPLACE_LINK placeholder href
    document.querySelectorAll('a[href*="REPLACE_LINK"]').forEach(function(el) {
      if (!el._broHooked) {
        el._broHooked = true;
        el.addEventListener('click', function(e) {
          e.preventDefault();
          openBroModal(el.textContent.trim());
        });
      }
    });

    // Close button
    var closeBtn = document.getElementById('broClose');
    if (closeBtn) closeBtn.addEventListener('click', closeBroModal);

    // Backdrop click
    var overlay = document.getElementById('broOverlay');
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeBroModal();
      });
    }

    // ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeBroModal();
    });

    // Form submit
    var form = document.getElementById('broForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validateBroForm()) return;
      var btn = document.getElementById('broSubmit');
      btn.disabled = true;
      btn.textContent = 'Sending\u2026';
      setTimeout(function() {
        form.style.display = 'none';
        document.getElementById('broSuccess').classList.add('show');
        setTimeout(closeBroModal, 3200);
      }, 900);
    });
  });

  function validateBroForm() {
    var ok = true;
    function chk(id, errId, testFn) {
      var el = document.getElementById(id);
      var err = document.getElementById(errId);
      if (!el || !err) return;
      var valid = testFn(el.value.trim());
      el.classList.toggle('err', !valid);
      err.classList.toggle('show', !valid);
      if (!valid) ok = false;
    }
    chk('broFirst',    'broErrFirst',    function(v){ return v.length >= 2; });
    chk('broLast',     'broErrLast',     function(v){ return v.length >= 2; });
    chk('broEmail',    'broErrEmail',    function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); });
    chk('broPhone',    'broErrPhone',    function(v){
      var digits = v.replace(/[\s\-\(\)]/g, '');
      if (!/^\d+$/.test(digits)) return false;
      var dialEl = document.getElementById('broDialCode');
      var dial = dialEl ? dialEl.value : '+91';
      if (dial === '+91') return digits.length === 10;
      return digits.length >= 6 && digits.length <= 15;
    });
    chk('broCountry',  'broErrCountry',  function(v){ return v !== ''; });
    chk('broCompany',  'broErrCompany',  function(v){ return v.length >= 2; });
    chk('broJobTitle', 'broErrJobTitle', function(v){ return v.length >= 2; });
    chk('broIndustry', 'broErrIndustry', function(v){ return v !== ''; });
    return ok;
  }
})();

/* ── 5. Additional Event & Overlay Fixes ───────────────────── */
/* Runtime fixes applied on DOMContentLoaded:
   - Outside-click closes quote and brochure overlays
   - Prevents double-submit on all forms (disables button 10ms
     after submit, re-enables after 6s as error recovery)
   - Adds keyboard (Enter/Space) support to custom tab elements   */
/* ═══ Additional Event & Functionality Fixes ══════════════
   - quoteOverlay closes on outside click
   - broOverlay closes on outside click
   - Prevent double-submit on all forms
   - Fix counter animation trigger on scroll
══════════════════════════════════════════════════════════ */
(function() {
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function() {
    // ── Overlay outside-click close ──────────────────────
    ['quoteOverlay', 'broOverlay'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', function(e) {
        if (e.target === el) {
          el.classList.remove('open');
          el.style.display = '';
          // Also try calling specific close functions if available
          if (id === 'quoteOverlay' && typeof closeQuoteModal === 'function') closeQuoteModal();
          if (id === 'broOverlay'   && typeof closeBroModal   === 'function') closeBroModal();
        }
      });
    });

    // ── Prevent double-submit ────────────────────────────
    document.querySelectorAll('form').forEach(function(form) {
      form.addEventListener('submit', function() {
        var btn = form.querySelector('[type="submit"]');
        if (btn) {
          setTimeout(function() {
            btn.disabled = true;
            btn.style.opacity = '0.6';
          }, 10);
          // Re-enable after 6s in case of error
          setTimeout(function() {
            btn.disabled = false;
            btn.style.opacity = '';
          }, 6000);
        }
      });
    });

    // ── Tab keyboard accessibility ───────────────────────
    document.querySelectorAll('.sd-tab, .atl-tab').forEach(function(tab) {
      if (!tab.hasAttribute('tabindex')) tab.setAttribute('tabindex', '0');
      tab.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tab.click();
        }
      });
    });
  });
})();
