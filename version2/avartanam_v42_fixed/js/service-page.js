/**
 * service-page.js  —  Avartanam Test Labs
 * Handles: Tab switching · Scroll Gallery (vertical desktop / horizontal mobile) · Quote Modal · Form validation
 */

(function () {
  'use strict';

  var IMAGE_SLIDES = window.__PAGE_IMAGE_SLIDES || [
    { src: 'images/services/rf/antenna-radiation-pattern-0.jpg', alt: 'Service Image' }
  ];
  var VIDEO_EMBED_SRC = window.__PAGE_VIDEO_EMBED || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';
  var AUTO_SCROLL_INTERVAL = 3000;

  var currentSlideIndex = 0;
  var autoScrollTimer   = null;
  var isHovering        = false;
  var isVideoPlaying    = false;

  function isMobile() { return window.innerWidth <= 767; }

  function getSlideSize() {
    var display = document.getElementById('galleryDisplay');
    if (!display) return 320;
    if (isMobile()) {
      /* Try the display element, then the hero column, then full viewport */
      var w = display.offsetWidth;
      if (w < 10) {
        var heroCol = display.closest('.col-12');
        if (heroCol) w = heroCol.offsetWidth;
      }
      if (w < 10) w = window.innerWidth - 32; /* 16px padding each side */
      return w;
    }
    var h = display.offsetHeight;
    return h > 50 ? h : 320;
  }

  function applySlideLayout(animate) {
    var track = document.getElementById('galleryScrollTrack');
    if (!track) return;
    var slides = track.querySelectorAll('.gallery-scroll-slide');
    var size   = getSlideSize();
    var trans  = animate ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';

    if (isMobile()) {
      track.style.flexDirection = 'row';
      track.style.width         = (slides.length * size) + 'px';
      track.style.height        = '';
      slides.forEach(function (s) {
        s.style.width     = size + 'px';
        s.style.minWidth  = size + 'px';
        s.style.height    = '240px';
        s.style.minHeight = '240px';
        s.style.display   = 'block';
        s.style.visibility = 'visible';
      });
      track.style.transition = trans;
      track.style.transform  = 'translateX(-' + (currentSlideIndex * size) + 'px)';
    } else {
      track.style.flexDirection = 'column';
      track.style.width         = '';
      track.style.height        = '';
      slides.forEach(function (s) {
        s.style.width     = '';
        s.style.minWidth  = '';
        s.style.height    = size + 'px';
        s.style.minHeight = size + 'px';
        s.style.display   = 'block';
        s.style.visibility = 'visible';
      });
      track.style.transition = trans;
      track.style.transform  = 'translateY(-' + (currentSlideIndex * size) + 'px)';
    }
  }

  /* ── 1. TABS ── */
  function initTabs() {
    var tabs   = document.querySelectorAll('.sd-tab');
    var panels = document.querySelectorAll('.sd-panel');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');
        var panel = document.getElementById('panel-' + tab.getAttribute('data-panel'));
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ── 2. GALLERY ── */
  function scrollToSlide(index, animate) {
    var track = document.getElementById('galleryScrollTrack');
    if (!track) return;
    /* Use actual DOM slide count — always in sync, never mismatches __PAGE_IMAGE_SLIDES */
    var domSlides = track.querySelectorAll('.gallery-scroll-slide');
    var total = domSlides.length || IMAGE_SLIDES.length;
    currentSlideIndex = ((index % total) + total) % total;
    applySlideLayout(animate);
    highlightImageThumb(currentSlideIndex);
  }

  function advanceSlide() { scrollToSlide(currentSlideIndex + 1, true); }

  function highlightImageThumb(idx) {
    var imageThumbs = Array.from(document.querySelectorAll('.gallery-thumb:not(.gallery-thumb--video)'));
    document.querySelectorAll('.gallery-thumb').forEach(function (t) {
      t.classList.toggle('active', imageThumbs.indexOf(t) === idx);
    });
  }

  function startAutoScroll() {
    if (autoScrollTimer || isVideoPlaying) return;
    autoScrollTimer = setInterval(function () {
      if (!isHovering && !isVideoPlaying) advanceSlide();
    }, AUTO_SCROLL_INTERVAL);
  }

  function stopAutoScroll() {
    if (autoScrollTimer) { clearInterval(autoScrollTimer); autoScrollTimer = null; }
  }

  function showVideo() {
    isVideoPlaying = true; stopAutoScroll();
    var track = document.getElementById('galleryScrollTrack');
    var vw    = document.getElementById('galleryVideoWrap');
    var ifr   = document.getElementById('galleryIframe');
    if (track) track.style.opacity = '0';
    if (vw)    vw.classList.add('active');
    if (ifr)   ifr.src = VIDEO_EMBED_SRC;
    document.querySelectorAll('.gallery-thumb').forEach(function (t) {
      t.classList.toggle('active', t.classList.contains('gallery-thumb--video'));
    });
  }

  function hideVideo() {
    isVideoPlaying = false;
    var track = document.getElementById('galleryScrollTrack');
    var vw    = document.getElementById('galleryVideoWrap');
    var ifr   = document.getElementById('galleryIframe');
    if (vw)  vw.classList.remove('active');
    if (ifr) ifr.src = '';
    if (track) track.style.opacity = '1';
    highlightImageThumb(currentSlideIndex);
    startAutoScroll();
  }

  window.showGalleryItem = function (thumbIndex) {
    if (thumbIndex === 1) { showVideo(); } else { if (isVideoPlaying) hideVideo(); }
  };

  function initGallery() {
    var imageThumbs = Array.from(document.querySelectorAll('.gallery-thumb:not(.gallery-thumb--video)'));
    document.querySelectorAll('.gallery-thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        if (thumb.classList.contains('gallery-thumb--video')) {
          showVideo();
        } else {
          if (isVideoPlaying) hideVideo();
          stopAutoScroll();
          scrollToSlide(imageThumbs.indexOf(thumb), true);
          startAutoScroll();
        }
      });
    });
    ['galleryDisplay','galleryThumbs'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('mouseenter', function () { isHovering = true; });
      el.addEventListener('mouseleave', function () { isHovering = false; });
    });
    scrollToSlide(0, false);
    startAutoScroll();
  }

  /* ── 3. QUOTE MODAL ── */
  window.openQuoteModal = function () {
    var overlay = document.getElementById('quoteOverlay');
    if (!overlay) return;
    stopAutoScroll();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    var form = document.getElementById('quoteForm');
    if (form) {
      form.reset(); form.style.display = '';
      form.querySelectorAll('.qf-input,.qf-select,.qf-textarea').forEach(function (el) { el.classList.remove('err'); });
      form.querySelectorAll('.qf-err').forEach(function (el) { el.classList.remove('show'); });
    }
    var succ = document.getElementById('quoteSuccess');
    var sub  = document.getElementById('quoteSubmit');
    if (succ) succ.classList.remove('show');
    if (sub)  { sub.disabled = false; sub.textContent = 'Submit Request'; }
  };

  window.closeQuoteModal = function () {
    var overlay = document.getElementById('quoteOverlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    hideVideo(); startAutoScroll();
  };

  window.handleOverlayClick = function (e) {};

  /* ── 4. FORM VALIDATION ── */
  function initQuoteForm() {
    var form   = document.getElementById('quoteForm');
    var submit = document.getElementById('quoteSubmit');
    if (!form || !submit) return;

    function validateField(inputId, errId, type) {
      var el = document.getElementById(inputId);
      var er = document.getElementById(errId);
      if (!el) return true;
      var val = el.value.trim();
      var bad = false;
      if (type === 'required')   bad = !val;
      else if (type === 'email') bad = !val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      else if (type === 'phone') {
        var d = val.replace(/[\s\-\(\)\+]/g,'');
        // Strip country code: 91XXXXXXXXXX (12 digits) or 0XXXXXXXXXX (11 digits)
        if (d.length === 12 && d.slice(0,2) === '91') d = d.slice(2);
        if (d.length === 11 && d.slice(0,1) === '0')  d = d.slice(1);
        bad = !val || !/^\d{10}$/.test(d);
      }
      el.classList.toggle('err', bad);
      if (er) er.classList.toggle('show', bad);
      return !bad;
    }

    ['qfFirst','qfLast','qfEmail','qfPhone','qfCompany'].forEach(function (id) {
      var el = document.getElementById(id);
      var er = document.getElementById('err' + id.replace('qf',''));
      if (el) el.addEventListener('input', function () { el.classList.remove('err'); if (er) er.classList.remove('show'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      if (!validateField('qfFirst',  'errFirst',  'required')) ok = false;
      if (!validateField('qfLast',   'errLast',   'required')) ok = false;
      if (!validateField('qfEmail',  'errEmail',  'email'))    ok = false;
      if (!validateField('qfPhone',  'errPhone',  'phone'))    ok = false;
      if (!validateField('qfCompany','errCompany','required'))  ok = false;
      if (!ok) return;
      submit.disabled = true; submit.textContent = 'Submitting…';
      form.style.display = 'none';
      var succ = document.getElementById('quoteSuccess');
      if (succ) succ.classList.add('show');
    });
  }

  /* ── INIT ── */
  function init() {
    initTabs(); initGallery(); initQuoteForm();
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { scrollToSlide(currentSlideIndex, false); }, 120);
    });
    /* Re-apply layout on full page load (images loaded, real dimensions available) */
    window.addEventListener('load', function () {
      scrollToSlide(0, false);
      /* Extra safety: re-apply after brief delay on mobile for late-rendering browsers */
      if (isMobile()) {
        setTimeout(function() { scrollToSlide(currentSlideIndex, false); }, 100);
        setTimeout(function() { scrollToSlide(currentSlideIndex, false); }, 400);
      }
    });
    /* Also force a re-layout shortly after DOMContentLoaded on mobile */
    if (isMobile()) {
      setTimeout(function() { scrollToSlide(0, false); }, 50);
      setTimeout(function() { scrollToSlide(0, false); }, 250);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ── Gallery Lightbox / Fullscreen ───────────────────────── */
(function () {
  function initGalleryLightbox() {
    var display = document.getElementById('galleryDisplay');
    if (!display) return;

    /* Inject fullscreen button into gallery display */
    var btn = document.createElement('button');
    btn.className = 'gallery-fullscreen-btn';
    btn.title = 'View fullscreen';
    btn.setAttribute('aria-label', 'View image fullscreen');
    btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
      + '<polyline points="15 3 21 3 21 9"/>'
      + '<polyline points="9 21 3 21 3 15"/>'
      + '<line x1="21" y1="3" x2="14" y2="10"/>'
      + '<line x1="3" y1="21" x2="10" y2="14"/>'
      + '</svg>';
    /* Append to gallery-main (parent) so it's not clipped by overflow:hidden on display */
    var galleryMain = display.parentNode;
    if (galleryMain) {
      galleryMain.style.position = 'relative';
      galleryMain.appendChild(btn);
    } else {
      display.appendChild(btn);
    }

    /* Build lightbox overlay (shared, appended once to body) */
    var overlay = document.getElementById('galleryLightbox');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'galleryLightbox';
      overlay.className = 'gallery-lightbox-overlay';
      overlay.innerHTML =
        '<button class="gallery-lightbox-close" id="lbClose" aria-label="Close">'
        + '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        + '</button>'
        + '<button class="gallery-lightbox-nav gallery-lightbox-prev" id="lbPrev" aria-label="Previous image">'
        + '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>'
        + '</button>'
        + '<img class="gallery-lightbox-img" id="lbImg" src="" alt=""/>'
        + '<button class="gallery-lightbox-nav gallery-lightbox-next" id="lbNext" aria-label="Next image">'
        + '<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>'
        + '</button>'
        + '<span class="gallery-lightbox-counter" id="lbCounter"></span>';
      document.body.appendChild(overlay);
    }

    var lbImg     = document.getElementById('lbImg');
    var lbCounter = document.getElementById('lbCounter');
    var lbClose   = document.getElementById('lbClose');
    var lbPrev    = document.getElementById('lbPrev');
    var lbNext    = document.getElementById('lbNext');

    /* Collect all slide images */
    function getSlides() {
      return Array.prototype.slice.call(
        document.querySelectorAll('#galleryScrollTrack .gallery-scroll-slide')
      );
    }

    var currentLbIdx = 0;

    function openLightbox(idx) {
      var slides = getSlides();
      if (!slides.length) return;
      currentLbIdx = ((idx % slides.length) + slides.length) % slides.length;
      lbImg.src = slides[currentLbIdx].src;
      lbImg.alt = slides[currentLbIdx].alt || '';
      lbCounter.textContent = (currentLbIdx + 1) + ' / ' + slides.length;
      lbPrev.style.display = slides.length > 1 ? '' : 'none';
      lbNext.style.display = slides.length > 1 ? '' : 'none';
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    function navigate(dir) {
      var slides = getSlides();
      currentLbIdx = ((currentLbIdx + dir) + slides.length) % slides.length;
      lbImg.src = slides[currentLbIdx].src;
      lbImg.alt = slides[currentLbIdx].alt || '';
      lbCounter.textContent = (currentLbIdx + 1) + ' / ' + slides.length;
    }

    /* Helper: get the current active slide index correctly on mobile (translateX) and desktop (translateY) */
    function getActiveSlideIdx() {
      var track = document.getElementById('galleryScrollTrack');
      if (!track) return 0;
      var transform = track.style.transform || '';
      var mobile = window.innerWidth <= 767;
      if (mobile) {
        var mxMatch = transform.match(/translateX\(\s*-?([\d.]+)px\s*\)/);
        var slideW = display.offsetWidth || window.innerWidth;
        var valX = mxMatch ? parseFloat(mxMatch[1]) : 0;
        return slideW > 0 ? Math.round(valX / slideW) : 0;
      } else {
        var myMatch = transform.match(/translateY\(\s*-?([\d.]+)px\s*\)/);
        var slideH = display.offsetHeight || 320;
        var valY = myMatch ? parseFloat(myMatch[1]) : 0;
        return slideH > 0 ? Math.round(valY / slideH) : 0;
      }
    }

    /* Open on fullscreen button click */
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(getActiveSlideIdx());
    });

    /* Open lightbox on single tap of image on mobile (not a swipe) */
    var tapStartX = 0, tapStartY = 0, tapMoved = false;
    display.addEventListener('touchstart', function (e) {
      tapStartX = e.touches[0].clientX;
      tapStartY = e.touches[0].clientY;
      tapMoved  = false;
    }, { passive: true });
    display.addEventListener('touchmove', function (e) {
      if (Math.abs(e.touches[0].clientX - tapStartX) > 8 ||
          Math.abs(e.touches[0].clientY - tapStartY) > 8) {
        tapMoved = true;
      }
    }, { passive: true });
    display.addEventListener('touchend', function (e) {
      if (!tapMoved) {
        e.preventDefault();
        openLightbox(getActiveSlideIdx());
      }
    });

    /* Also open on double-click of main display image on desktop */
    display.addEventListener('dblclick', function () {
      openLightbox(getActiveSlideIdx());
    });

    lbClose.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeLightbox(); });
    lbPrev.addEventListener('click', function (e) { e.stopPropagation(); navigate(-1); });
    lbNext.addEventListener('click', function (e) { e.stopPropagation(); navigate(1); });

    /* Touch swipe inside lightbox to navigate images */
    var lbSwipeStartX = 0, lbSwipeMoved = false;
    overlay.addEventListener('touchstart', function (e) {
      lbSwipeStartX = e.touches[0].clientX;
      lbSwipeMoved  = false;
    }, { passive: true });
    overlay.addEventListener('touchmove', function (e) {
      if (Math.abs(e.touches[0].clientX - lbSwipeStartX) > 10) lbSwipeMoved = true;
    }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      if (!lbSwipeMoved) { closeLightbox(); return; }
      var diff = e.changedTouches[0].clientX - lbSwipeStartX;
      if (Math.abs(diff) > 40) navigate(diff < 0 ? 1 : -1);
    });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   navigate(-1);
      if (e.key === 'ArrowRight')  navigate(1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryLightbox);
  } else {
    initGalleryLightbox();
  }
})();
