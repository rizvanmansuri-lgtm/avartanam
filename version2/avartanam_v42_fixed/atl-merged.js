/* =====================================================
   atl-merged.js  —  Avartanam Test Labs
   Unified JS: Navbar · Scroll-spy · Stat counters ·
   Scroll reveal · Product grid · Tabs · Contact form ·
   Buy modal
   Requires: Bootstrap 5 bundle + products-data.js
===================================================== */
(function () {
  "use strict";

  /* ── util ─────────────────────────────────────── */
  function $  (sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$ (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function setText(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
  function esc(s) {
    return String(s || "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }

  /* ── state ────────────────────────────────────── */
  var bsModal      = null;
  var activeFilter = "all";
  var visibleCount = 6;
  var activeProduct = null;

  /* ════════════════════════════════════════════════
     NAVBAR  (mega menu + sticky)
  ════════════════════════════════════════════════ */
  function initNav() {
    var nav    = document.getElementById("atlNav");
    var burger = document.getElementById("navBurger");
    var mobile = document.getElementById("navMobile");

    /* ── Sticky shadow on scroll ─────────────────── */
    window.addEventListener("scroll", function () {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 50);
    }, { passive: true });

    /* ── Mobile hamburger toggle ─────────────────── */
    if (burger && mobile) {
      burger.addEventListener("click", function () {
        var open = mobile.classList.toggle("open");
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open);
      });
    }

    /* ── Mega menu: instant smooth close on mouseout ── */

    function getNavBottom() {
      /* V21 FIX: Always use the nav bar's own bottom edge as the reference.
         In many pages the .atl-sticky-header only wraps the util-bar (top black
         strip), while the <nav> sits as a sibling element — so the sticky-header
         rect.bottom only gives us the util-bar bottom, not the full header bottom.
         Using nav.getBoundingClientRect().bottom gives the true bottom of the
         complete header (util-bar + nav), which is where the mega panel must start. */
      if (nav) {
        var navRect = nav.getBoundingClientRect();
        if (navRect.height > 0) return navRect.bottom;
      }
      var stickyHeader = document.querySelector(".atl-sticky-header");
      if (stickyHeader) {
        var rect = stickyHeader.getBoundingClientRect();
        return rect.bottom;
      }
      var util  = document.querySelector(".atl-util-bar");
      var utilH = (util && util.offsetHeight) ? util.offsetHeight : 0;
      var navH  = nav ? nav.offsetHeight : 64;
      return utilH + navH;
    }

    function openItem(item) {
      /* Cancel any pending close for this item */
      if (item._closeTimer) { clearTimeout(item._closeTimer); item._closeTimer = null; }
      /* Immediately close any other open mega */
      $$(".atl-nav__item--mega").forEach(function (i) {
        if (i !== item) {
          if (i._closeTimer) { clearTimeout(i._closeTimer); i._closeTimer = null; }
          i.classList.remove("mega-open");
        }
      });
      var panel = item.querySelector(".atl-mega__panel");
      var navBottom = getNavBottom();
      /* Panel top is 0 — the overlay div itself starts at navBottom */
      if (panel) panel.style.top = "0px";
      /* Move the overlay div to START at the header bottom — this ensures
         the header area is physically outside the overlay so it stays
         fully clickable and visible while the mega menu is open */
      var overlay = item.querySelector(".atl-mega");
      if (overlay) {
        overlay.style.top = navBottom + "px";
        overlay.style.clipPath = "none"; /* no longer needed — div starts below header */
      }
      item.classList.add("mega-open");
    }

    function closeItem(item) {
      /* No delay — remove mega-open immediately so CSS transition fires at once */
      if (item._closeTimer) { clearTimeout(item._closeTimer); item._closeTimer = null; }
      item.classList.remove("mega-open");
    }

    function closeAll() {
      $$(".atl-nav__item--mega").forEach(function (i) { closeItem(i); });
    }

    /* ── Grace period for smooth close ──────────────────────────────
       CLOSE_GRACE: ms the cursor can be outside the panel/button
       before the menu closes. 180ms feels natural — not snappy,
       not laggy. Matches the CSS close transition (0.18s).
    ────────────────────────────────────────────────────────────── */
    var CLOSE_GRACE = 300; /* slow close grace period */

    /* Helper: is point (x,y) inside an element's bounding box? */
    function inRect(el, x, y) {
      if (!el) return false;
      var r = el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }

    $$(".atl-nav__item--mega").forEach(function (item) {

      /* ── Open on hover over the nav button ──────────── */
      item.addEventListener("mouseenter", function () { openItem(item); });

      /* ── mousemove on the full-screen overlay backdrop ──
         When the mega is open, the backdrop (pointer-events:all)
         covers the whole page. We track the cursor position on
         every move: if it's outside BOTH the panel AND the nav
         button, we start the grace timer; if it re-enters either,
         we cancel it. This is the most reliable way to detect
         "mouse left the panel box" regardless of child elements.
      ──────────────────────────────────────────────────── */
      var megaOverlay = item.querySelector(".atl-mega");
      var megaPanel   = item.querySelector(".atl-mega__panel");
      var navBtn      = item.querySelector(".atl-nav__link--has-mega");

      if (megaOverlay) {
        megaOverlay.addEventListener("mousemove", function (e) {
          if (!item.classList.contains("mega-open")) return;
          var cx = e.clientX, cy = e.clientY;
          var overPanel = inRect(megaPanel, cx, cy);
          var overBtn   = inRect(navBtn,   cx, cy);
          /* Also treat the entire nav bar as a safe zone — this keeps
             Products / Solutions / About Us / Contact Us fully interactive
             and visible while any mega is open. Without this, moving the
             cursor from the panel up toward another nav link starts the
             close timer and causes other header links to appear hidden. */
          var overNav   = nav ? inRect(nav, cx, cy) : false;

          if (overPanel || overBtn || overNav) {
            /* Cursor is inside the safe zone — cancel any pending close */
            if (item._closeTimer) {
              clearTimeout(item._closeTimer);
              item._closeTimer = null;
            }
            /* If cursor moved onto a DIFFERENT mega nav item, open it */
            if (overNav && !overPanel && !overBtn) {
              var hovered = document.elementFromPoint(cx, cy);
              if (hovered) {
                var otherItem = hovered.closest(".atl-nav__item--mega");
                if (otherItem && otherItem !== item) {
                  /* Slow hover-switch between mega items */
                  if (item._switchTimer) { clearTimeout(item._switchTimer); item._switchTimer = null; }
                  (function(target){ item._switchTimer = setTimeout(function(){ item._switchTimer = null; openItem(target); }, 600); })(otherItem);
                }
              }
            }
          } else {
            /* Cursor is outside panel, button and nav — start grace timer */
            if (!item._closeTimer) {
              item._closeTimer = setTimeout(function () {
                item.classList.remove("mega-open");
                item._closeTimer = null;
              }, CLOSE_GRACE);
            }
          }
        });

        /* When the cursor leaves the overlay entirely (exits viewport
           or moves to a sibling element with pointer-events:none),
           close with full grace period */
        megaOverlay.addEventListener("mouseleave", function () {
          if (!item.classList.contains("mega-open")) return;
          if (item._closeTimer) { clearTimeout(item._closeTimer); item._closeTimer = null; }
          item._closeTimer = setTimeout(function () {
            item.classList.remove("mega-open");
            item._closeTimer = null;
          }, CLOSE_GRACE);
        });
      }

      /* ── Also open when hovering the nav item itself ─── */
      item.addEventListener("mouseleave", function (e) {
        /* If moving into the mega overlay or panel, do nothing */
        var related = e.relatedTarget;
        if (megaOverlay && related && megaOverlay.contains(related)) { return; }
        if (megaPanel   && related && megaPanel.contains(related))   { return; }
        /* Extra guard: if cursor is physically over the panel area, don't close */
        if (megaPanel && item.classList.contains("mega-open")) {
          var pr = megaPanel.getBoundingClientRect();
          if (e.clientX >= pr.left && e.clientX <= pr.right &&
              e.clientY >= pr.top  && e.clientY <= pr.bottom) { return; }
        }
        /* Moving somewhere completely outside — start grace */
        if (!item._closeTimer) {
          item._closeTimer = setTimeout(function () {
            item.classList.remove("mega-open");
            item._closeTimer = null;
          }, CLOSE_GRACE);
        }
      });
    });

    document.addEventListener("click", function (e) {
      if (nav && !nav.contains(e.target)) closeAll();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });

    /* Close megamenu when cursor moves anywhere outside header+panel */
    document.addEventListener("mousemove", function (e) {
      var cx = e.clientX, cy = e.clientY;
      $$(".atl-nav__item--mega.mega-open").forEach(function (item) {
        var megaPanel = item.querySelector(".atl-mega__panel");
        var navBtn    = item.querySelector(".atl-nav__link--has-mega");
        var overPanel = inRect(megaPanel, cx, cy);
        var overBtn   = inRect(navBtn, cx, cy);
        var overNav   = nav ? inRect(nav, cx, cy) : false;
        if (!overPanel && !overBtn && !overNav) {
          if (!item._closeTimer) {
            item._closeTimer = setTimeout(function () {
              item.classList.remove("mega-open");
              item._closeTimer = null;
            }, CLOSE_GRACE);
          }
        } else {
          if (item._closeTimer) {
            clearTimeout(item._closeTimer);
            item._closeTimer = null;
          }
        }
      });
    });

    /* ── Plain nav items (About Us, Contact Us, etc.) ──────────────
       When the user hovers a non-mega nav link while a mega is open,
       close the mega immediately so the nav bar looks consistent and
       no mega panel lingers behind the plain link.
    ──────────────────────────────────────────────────────────────── */
    document.querySelectorAll(".atl-nav__item:not(.atl-nav__item--mega)").forEach(function(plainItem) {
      plainItem.addEventListener("mouseenter", function() {
        closeAll();
      });
    });

    /* Expose as global so onclick="toggleMega(...)" works on all pages */
    window.toggleMega = function(itemId) {
      var item = document.getElementById(itemId);
      if (!item) return;
      if (item.classList.contains('mega-open')) { closeItem(item); } else { openItem(item); }
    };
    window.ATL_toggleMega = window.toggleMega;

  }

  function cardHTML(p) {
    var tags = p.standards.slice(0,3).map(function(s){
      return '<span class="atl-prod-tag">' + esc(s) + '</span>';
    }).join("");
    var subCount = p.options ? p.options.length : 0;
    var subLabel = subCount === 1 ? '1 Service' : subCount + ' Sub-services';
    var imgHtml = p.image
      ? '<div class="atl-prod-card__img"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy"></div>'
      : '<div class="atl-prod-card__top atl-top--' + esc(p.color) + '"><span class="atl-prod-badge atl-badge--' + esc(p.color) + '">' + esc(p.badge) + '</span><span class="atl-prod-nabl">' + esc(p.accreditation) + '</span></div>';
    return [
      '<div class="col-12 col-sm-6 col-xl-4 atl-prod-item" data-cat="' + esc(p.category) + '">',
        '<div class="atl-prod-card" style="height:100%;display:flex;flex-direction:column;">',
          imgHtml,
          '<div class="atl-prod-card__badges">',
            '<span class="atl-prod-badge atl-badge--' + esc(p.color) + '">' + esc(p.badge) + '</span>',
            '<span class="atl-prod-nabl">' + esc(p.accreditation) + '</span>',
          '</div>',
          '<div class="atl-prod-body" style="flex:1;">',
            '<span class="atl-prod-cat">' + esc(p.categoryLabel) + '</span>',
            '<h3 class="atl-prod-name">' + esc(p.name) + '</h3>',
            '<p class="atl-prod-desc">' + esc(p.desc.slice(0,120)) + '\u2026</p>',
            '<div class="atl-prod-tags">' + tags + '</div>',
            '<div class="atl-prod-svc-count">',
              '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
              subLabel,
            '</div>',
            '<div class="atl-prod-actions" style="margin-top:.75rem;">',
              '<a class="atl-btn-detail" href="' + esc(p.pageUrl || ('service-detail.html?id=' + p.id + '&type=service')) + '" target="_blank">Details →</a>',
              '<button class="atl-btn-buy"    data-action="buy"    data-id="' + esc(p.id) + '">&#x1F6D2; Buy / Quote</button>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join("");
  }

  function bindFilters() {
    var pills = $$(".atl-filter-pill");
    pills.forEach(function(pill){
      pill.addEventListener("click", function(){
        pills.forEach(function(p){ p.classList.remove("atl-filter-pill--on"); });
        pill.classList.add("atl-filter-pill--on");
        activeFilter  = pill.getAttribute("data-cat");
        visibleCount  = 6;
        renderGrid();
      });
    });
    var lb = document.getElementById("loadMoreBtn");
    if (lb) lb.addEventListener("click", function(){ visibleCount += 6; renderGrid(); });
  }

  /* ════════════════════════════════════════════════
     PRODUCT DETAIL TABS
  ════════════════════════════════════════════════ */
  function loadDetail(id) {
    var p = findById(id);
    if (!p) return;
    activeProduct = p;

    /* ── 1. NEW: Product Detail Card (screenshot 2 style) ── */
    loadProductDetailCard(p);

    /* ── 2. Existing: Renesas tab panel ── */
    setText("dCat",    p.categoryLabel);
    setText("dTitle",  p.name);
    setText("dDesc",   p.desc);
    setText("dPartNo", p.partNo);
    fillOptions(p); fillDocs(p); fillBoards(p); fillSoftware(p); fillVideos(p);
    switchTab("options");

    /* Scroll to product detail card first */
    setTimeout(function(){
      var s = document.getElementById("pdSection");
      if (s) s.scrollIntoView({ behavior:"smooth", block:"start" });
    }, 80);
  }

  /* ────────────────────────────────────────────────
     Product Detail Card — screenshot 2 layout
  ──────────────────────────────────────────────── */
  function loadProductDetailCard(p) {
    var wrap = document.getElementById("pdSection");
    if (!wrap) return;
    wrap.style.display = "block";

    /* Header */
    setText("pdFamily",   p.categoryLabel);
    setText("pdPartNo",   p.partNo);
    setText("pdTitle",    p.name);
    setText("pdSubtitle", p.badge + " — " + p.categoryLabel);
    setText("pdDesc",     p.desc);

    /* Spec table */
    var opt0 = p.options[0] || {};
    setText("specCat",    p.categoryLabel);
    setText("specStd",    p.standards[0] || "—");
    setText("specScope",  opt0.scope  || "Various product types");
    setText("specAccr",   p.accreditation);
    setText("specLead",   p.leadTime);
    setText("specEnv",    getEnvLabel(p));
    setText("specReport", "NABL Test Report · PDF / DOCX");
    setText("specTemp",   getTempLabel(p));

    /* Chip / visual render */
    var renderEl = document.getElementById("pdChipRender");
    if (renderEl) {
      if (p.image) {
        renderEl.innerHTML = '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">';
      } else {
        renderEl.innerHTML = buildChipSVG(p);
      }
    }

    /* Documents list */
    var docsEl = document.getElementById("pdDocsList");
    if (docsEl) {
      docsEl.innerHTML = p.docs.slice(0,4).map(function(d) {
        var icon = d.format === "PDF" ? pdfIconSVG() : d.format === "XLSX" ? xlsxIconSVG() : docIconSVG();
        return [
          '<div class="atl-pd-doc-row">',
            '<div class="atl-pd-doc-left">',
              '<div class="atl-pd-doc-icon">' + icon + '</div>',
              '<div>',
                '<div class="atl-pd-doc-name">' + esc(d.title) + '</div>',
              '</div>',
            '</div>',
            '<span class="atl-pd-doc-meta">' + esc(d.size) + ' ' + esc(d.format) + '</span>',
          '</div>'
        ].join("");
      }).join("");
    }

    /* View tab switcher */
    document.querySelectorAll(".atl-pd-view-tab").forEach(function(btn) {
      btn.addEventListener("click", function() {
        document.querySelectorAll(".atl-pd-view-tab").forEach(function(b){ b.classList.remove("atl-pd-view-tab--on"); });
        btn.classList.add("atl-pd-view-tab--on");
      });
    });
  }

  /* Helper: build chip SVG per product colour */
  function buildChipSVG(p) {
    var colorMap = {
      blue:"#1B50A0", red:"#A51C30", green:"#0a7c45",
      purple:"#5E3DB8", teal:"#0C6E6E", orange:"#B55A10", navy:"#0D2147"
    };
    var c = colorMap[p.color] || "#0D2147";
    return [
      '<svg class="atl-pd-chip-svg" width="160" height="160" viewBox="0 0 160 160" fill="none">',
        '<rect x="30" y="30" width="100" height="100" rx="10" fill="' + c + '" opacity=".12" stroke="' + c + '" stroke-width="1.5"/>',
        '<rect x="44" y="44" width="72" height="72" rx="7" fill="' + c + '" opacity=".25" stroke="' + c + '" stroke-width="1"/>',
        '<rect x="54" y="54" width="52" height="52" rx="5" fill="' + c + '" opacity=".8"/>',
        /* Pins left */
        '<line x1="30" y1="65" x2="16" y2="65" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="30" y1="80" x2="16" y2="80" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="30" y1="95" x2="16" y2="95" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>',
        /* Pins right */
        '<line x1="130" y1="65" x2="144" y2="65" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="130" y1="80" x2="144" y2="80" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="130" y1="95" x2="144" y2="95" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>',
        /* Pins top */
        '<line x1="65" y1="30" x2="65" y2="16" stroke="#A51C30" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="80" y1="30" x2="80" y2="16" stroke="#A51C30" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="95" y1="30" x2="95" y2="16" stroke="#A51C30" stroke-width="3" stroke-linecap="round"/>',
        /* Pins bottom */
        '<line x1="65" y1="130" x2="65" y2="144" stroke="#A51C30" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="80" y1="130" x2="80" y2="144" stroke="#A51C30" stroke-width="3" stroke-linecap="round"/>',
        '<line x1="95" y1="130" x2="95" y2="144" stroke="#A51C30" stroke-width="3" stroke-linecap="round"/>',
        /* Centre text */
        '<text x="80" y="77" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="9" fill="rgba(255,255,255,.7)">' + esc(p.partNo.replace("ATL-","")) + '</text>',
        '<text x="80" y="90" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="7.5" fill="rgba(255,255,255,.5)">AVARTANAM</text>',
        '<text x="80" y="101" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="7" fill="rgba(255,255,255,.4)">ELECTRONICS</text>',
      '</svg>'
    ].join("");
  }

  function getEnvLabel(p) {
    var m = { medical:"Shielded Test Room / Anechoic Chamber", emi:"10m Semi-Anechoic Chamber", rf:"OTA Chamber / Shielded Room", electrical:"Safety Test Bay", environmental:"Environmental Stress Chamber", power:"Power Quality Analyser Station" };
    return m[p.category] || "NABL Accredited Lab";
  }
  function getTempLabel(p) {
    if (p.category === "environmental") return "-40°C to +125°C";
    return "Ambient (23 ± 5°C)";
  }
  function pdfIconSVG() { return '<svg width="14" height="14" fill="none" stroke="#A51C30" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>'; }
  function xlsxIconSVG() { return '<svg width="14" height="14" fill="none" stroke="#0a7c45" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>'; }
  function docIconSVG()  { return '<svg width="14" height="14" fill="none" stroke="#1B50A0" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>'; }

  /* ════════════════════════════════════════════════
     HARDWARE PRODUCT DETAIL  (AFL0001 / AFL0003 / Coil Antenna)
  ════════════════════════════════════════════════ */
  window.loadHWDetail = function(id) {
    var prods = window.ATL_HW_PRODUCTS || [];
    var p = prods.filter(function(x){ return x.id === id; })[0];
    if (!p) return;
    activeProduct = p;

    var wrap = document.getElementById("hwPdSection");
    if (!wrap) return;
    wrap.style.display = "block";

    /* Header */
    setText("hwPdFamily",   p.family || p.categoryLabel);
    setText("hwPdPartNo",   p.partNo);
    setText("hwPdTitle",    p.name);
    setText("hwPdSubtitle", p.badge + " — " + p.categoryLabel);
    setText("hwPdDesc",     p.desc);

    /* Specs table — from p.specs object */
    var tbody = document.getElementById("hwPdSpecsBody");
    if (tbody && p.specs) {
      tbody.innerHTML = Object.keys(p.specs).map(function(k){
        return "<tr><td class='atl-pd-spec-key'>" + esc(k) + "</td><td class='atl-pd-spec-val'>" + esc(p.specs[k]) + "</td></tr>";
      }).join("");
    }

    /* Chip SVG */
    var renderEl = document.getElementById("hwPdChipRender");
    if (renderEl) {
      if (p.image) {
        renderEl.innerHTML = '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">';
      } else {
        renderEl.innerHTML = buildChipSVG(p);
      }
    }

    /* Docs list */
    var docsEl = document.getElementById("hwPdDocsList");
    if (docsEl) {
      docsEl.innerHTML = p.docs.slice(0,4).map(function(d){
        var icon = d.format === "PDF" ? pdfIconSVG() : d.format === "S2P" ? docIconSVG() : docIconSVG();
        return [
          '<div class="atl-pd-doc-row">',
            '<div class="atl-pd-doc-left">',
              '<div class="atl-pd-doc-icon">' + icon + '</div>',
              '<div><div class="atl-pd-doc-name">' + esc(d.title) + '</div></div>',
            '</div>',
            '<span class="atl-pd-doc-meta">' + esc(d.size) + ' ' + esc(d.format) + '</span>',
          '</div>'
        ].join("");
      }).join("");
    }

    /* Scroll to detail */
    setTimeout(function(){
      wrap.scrollIntoView({ behavior:"smooth", block:"start" });
    }, 80);
  };

  function fillOptions(p) {
    var tb = document.getElementById("tbOptions");
    if (!tb) return;
    tb.innerHTML = p.options.map(function(o){
      var sCls = o.status === "Active" ? "atl-chip--green" : "atl-chip--orange";
      return [
        "<tr>",
          "<td><code>" + esc(o.partNo) + "</code></td>",
          "<td><strong>" + esc(o.service) + "</strong></td>",
          "<td>" + esc(o.standard) + "</td>",
          "<td style='white-space:normal;max-width:200px'>" + esc(o.scope) + "</td>",
          "<td><span class='atl-chip atl-chip--navy'>" + esc(o.accr) + "</span></td>",
          "<td>" + esc(o.leadTime) + "</td>",
          "<td><span class='atl-chip " + sCls + "'>" + esc(o.status) + "</span></td>",
          "<td><button class='atl-tbl-btn atl-tbl-btn--red'",
            " data-name='" + esc(o.service) + "'",
            " data-partno='" + esc(o.partNo) + "'",
            " data-std='" + esc(o.standard) + "'",
            " onclick='ATL_openBuyInline(this)'>Request Quote</button></td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function fillDocs(p) {
    var tb = document.getElementById("tbDocs");
    if (!tb) return;
    tb.innerHTML = p.docs.map(function(d){
      var fc = d.format === "PDF" ? "atl-chip--red" : d.format === "XLSX" ? "atl-chip--green" : "atl-chip--blue";
      return [
        "<tr>",
          "<td><strong>" + esc(d.title) + "</strong></td>",
          "<td><span class='atl-chip atl-chip--navy'>" + esc(d.type) + "</span></td>",
          "<td>" + esc(d.std) + "</td>",
          "<td>" + esc(d.rev) + "</td>",
          "<td><span class='atl-chip " + fc + "'>" + esc(d.format) + "</span></td>",
          "<td>" + esc(d.size) + "</td>",
          "<td><button class='atl-tbl-btn atl-tbl-btn--navy'>⬇ Download</button></td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function fillBoards(p) {
    var tb = document.getElementById("tbBoards");
    if (!tb) return;
    tb.innerHTML = p.boards.map(function(b){
      var ac = b.avail === "Available" ? "atl-chip--green" : "atl-chip--orange";
      return [
        "<tr>",
          "<td><strong>" + esc(b.name) + "</strong></td>",
          "<td><code>" + esc(b.model) + "</code></td>",
          "<td>" + esc(b.type) + "</td>",
          "<td>" + esc(b.freq) + "</td>",
          "<td><span class='atl-chip atl-chip--navy'>" + esc(b.cert) + "</span></td>",
          "<td><span class='atl-chip " + ac + "'>" + esc(b.avail) + "</span></td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function fillSoftware(p) {
    var tb = document.getElementById("tbSoftware");
    if (!tb) return;
    tb.innerHTML = p.software.map(function(s){
      var lc = (s.license === "Free" || s.license === "Free Template") ? "atl-chip--green" : "atl-chip--blue";
      return [
        "<tr>",
          "<td><strong>" + esc(s.name) + "</strong></td>",
          "<td><code>" + esc(s.ver) + "</code></td>",
          "<td>" + esc(s.platform) + "</td>",
          "<td><span class='atl-chip " + lc + "'>" + esc(s.license) + "</span></td>",
          "<td style='white-space:normal;max-width:240px'>" + esc(s.desc) + "</td>",
          "<td><button class='atl-tbl-btn atl-tbl-btn--navy'>↗ Get Tool</button></td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function fillVideos(p) {
    var tb = document.getElementById("tbVideos");
    if (!tb) return;
    tb.innerHTML = p.videos.map(function(v, i){
      var tc = v.type === "Webinar" ? "atl-chip--blue" : v.type === "Demo" ? "atl-chip--green" : "atl-chip--orange";
      return [
        "<tr>",
          "<td>" + (i+1) + "</td>",
          "<td><strong>" + esc(v.title) + "</strong></td>",
          "<td><span class='atl-chip " + tc + "'>" + esc(v.type) + "</span></td>",
          "<td>" + esc(v.dur) + "</td>",
          "<td style='white-space:normal;max-width:220px'>" + esc(v.desc) + "</td>",
          "<td><button class='atl-tbl-btn atl-tbl-btn--red'>▶ Watch</button></td>",
        "</tr>"
      ].join("");
    }).join("");
  }

  function bindTabs() {
    $$(".atl-tab").forEach(function(tab){
      tab.addEventListener("click", function(){ switchTab(tab.getAttribute("data-panel")); });
    });
  }
  function switchTab(id) {
    $$(".atl-tab").forEach(function(t){ t.classList.toggle("atl-tab--on", t.getAttribute("data-panel") === id); });
    $$(".atl-panel").forEach(function(p){ p.classList.toggle("atl-panel--on", p.id === "panel-" + id); });
  }

  window.ATL_openBuyInline = function(btn) {
    fillModal(btn.getAttribute("data-name"), btn.getAttribute("data-partno"), btn.getAttribute("data-std"));
  };
  window.openQuoteModal = function() {
    var p = activeProduct;
    fillModal(p ? p.name : "General Enquiry", p ? p.partNo : "ATL-GEN-001", p ? p.standards[0] : "N/A");
  };

  /* ════════════════════════════════════════════════
     BUY MODAL
  ════════════════════════════════════════════════ */
  function fillModal(name, partNo, standard) {
    setText("mProductName", name);
    setText("mPartNo",      partNo);
    setText("mStandard",    standard);
    var t = document.getElementById("buyModalTitle");
    if (t) t.textContent = "Request Quote — " + name;
    var f = document.getElementById("buyForm");
    if (f) { f.reset(); f.querySelectorAll(".cu-input.is-invalid").forEach(function(el){ el.classList.remove("is-invalid"); }); }
    var s = document.getElementById("buySuccess");
    if (s) s.classList.remove("show");
    if (bsModal) bsModal.show();
  }

  function initBuyForm() {
    var form = document.getElementById("buyForm");
    var sub  = document.getElementById("buySubmit");
    var suc  = document.getElementById("buySuccess");
    if (!form) return;
    function validateBuyField(el) {
      if (!el) return true;
      var val = el.value.trim();
      var bad = false;
      if (el.type === "email") {
        bad = !val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      } else if (el.type === "tel") {
        var d = val.replace(/[\s\-\(\)\+]/g, "");
        if (d.length === 12 && d.slice(0,2) === "91") d = d.slice(2);
        if (d.length === 11 && d.slice(0,1) === "0")  d = d.slice(1);
        bad = !val || !/^\d{10}$/.test(d);
      } else {
        bad = !val;
      }
      el.classList.toggle("is-invalid", bad);
      var errEl = el.parentElement ? el.parentElement.querySelector(".cu-err") : null;
      if (errEl) errEl.style.display = bad ? "block" : "none";
      return !bad;
    }
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var reqs = form.querySelectorAll("[required], #fPhone");
      var ok = true;
      reqs.forEach(function(el){ if (!validateBuyField(el)) ok = false; });
      if (!ok) return;
      sub.disabled = true; sub.textContent = "Submitting…";
      setTimeout(function(){
        form.reset(); reqs.forEach(function(el){ el.classList.remove("is-invalid"); });
        sub.disabled = false; sub.textContent = "Submit Request";
        if (suc) suc.classList.add("show");
        setTimeout(function(){ if(suc) suc.classList.remove("show"); if(bsModal) bsModal.hide(); }, 3200);
      }, 1100);
    });
    form.querySelectorAll("input,select,textarea").forEach(function(el){
      el.addEventListener("input", function(){ el.classList.remove("is-invalid"); });
    });
  }


  /* ════════════════════════════════════════════════
     GLOBAL TOAST HELPER
  ════════════════════════════════════════════════ */
  function showToast(title, sub) {
    var overlay  = document.getElementById("atlToastOverlay");
    var elTitle  = document.getElementById("atlToastTitle");
    var elSub    = document.getElementById("atlToastSub");
    var elClose  = document.getElementById("atlToastClose");
    var elProg   = document.getElementById("atlToastProgress");
    if (!overlay) return;

    // Set content
    if (elTitle) elTitle.textContent = title || "Submitted Successfully!";
    if (elSub)   elSub.innerHTML  = sub  || "Our team will contact you within <strong>24 hours</strong>.";

    // Reset progress animation by re-cloning the bar
    if (elProg) {
      var fresh = elProg.cloneNode(true);
      elProg.parentNode.replaceChild(fresh, elProg);
    }

    // Show
    overlay.classList.add("atl-toast--visible");
    document.body.style.overflow = "hidden";

    // Auto-dismiss after 6s
    var dismissTimer = setTimeout(function() { hideToast(); }, 6000);

    // Close button
    if (elClose) {
      elClose.onclick = function() {
        clearTimeout(dismissTimer);
        hideToast();
      };
    }

    // Click backdrop to close
    overlay.onclick = function(e) {
      if (e.target === overlay) {
        clearTimeout(dismissTimer);
        hideToast();
      }
    };
  }

  function hideToast() {
    var overlay = document.getElementById("atlToastOverlay");
    if (!overlay) return;
    overlay.classList.remove("atl-toast--visible");
    document.body.style.overflow = "";
  }

  /* ════════════════════════════════════════════════
     CONTACT FORM
  ════════════════════════════════════════════════ */
  function initContactForm() {
    /* Handled by inline script in index.html — no-op here */
  }

  /* ── helpers ─────────────────────────────────── */
  function findById(id) { return (window.ATL_PRODUCTS || []).find(function(p){ return p.id === id; }) || null; }

  /* ════════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════════ */
  function init() {
    /* Bootstrap modal */
    var el = document.getElementById("buyModal");
    if (el && window.bootstrap) bsModal = new bootstrap.Modal(el);

    initNav();
    initScrollSpy();
    initReveal();
    initCounters();

    if (window.ATL_PRODUCTS) {
      renderGrid();
      bindFilters();
      bindTabs();
      initBuyForm();
    }

    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();

/* ══════════════════════════════════════════════════
   TASK 7: Scroll-triggered animation observer
══════════════════════════════════════════════════ */
(function() {
  if (!window.IntersectionObserver) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  function observe() {
    document.querySelectorAll('[data-anim]').forEach(function(el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
})();

/* ══════════════════════════════════════════════════
   TASK 9: Mobile accordion — Services & Products
   toggleMobileAcc called via onclick="toggleMobileAcc(this)"
══════════════════════════════════════════════════ */
window.toggleMobileAcc = function(btn) {
  var macc = btn.closest('.atl-nav__macc');
  if (!macc) return;
  var body   = macc.querySelector('.atl-nav__macc-body');
  var isOpen = btn.classList.contains('open');

  /* Close all other accordions */
  document.querySelectorAll('.atl-nav__macc-btn.open').forEach(function(b) {
    if (b !== btn) {
      b.classList.remove('open');
      var sib = b.closest('.atl-nav__macc').querySelector('.atl-nav__macc-body');
      if (sib) sib.classList.remove('open');
    }
  });

  btn.classList.toggle('open', !isOpen);
  if (body) body.classList.toggle('open', !isOpen);
};

window.mobileNavClick = function(section) {
  var mobile = document.getElementById('navMobile');
  var burger = document.getElementById('navBurger');
  if (mobile) mobile.classList.remove('open');
  if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  var el = document.getElementById(section);
  if (el) setTimeout(function() { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
  return false;
};

/* ══════════════════════════════════════════════════
   TASK 10: Mobile brochure dropdown — tap to open,
   and "List of Certificates" tap-to-expand submenu
══════════════════════════════════════════════════ */
(function() {
  function isMobileNav() { return window.innerWidth <= 991; }

  document.addEventListener('DOMContentLoaded', function() {

    /* ── Main brochure dropdown: click-to-open on mobile ── */
    var btn  = document.getElementById('brochureBtn');
    var dd   = document.getElementById('brochureDropdown');
    var menu = document.getElementById('brochureMenu');
    var nav  = document.getElementById('atlNav');

    if (btn && dd && menu) {
      /* Position menu right below nav on desktop (JS sets fixed position) */
      function positionMenu() {
        if (isMobileNav()) return; /* CSS handles mobile */
        if (!nav) return;
        var navRect = nav.getBoundingClientRect();
        var btnRect = btn.getBoundingClientRect();
        menu.style.top   = navRect.bottom + 'px';
        menu.style.right = (window.innerWidth - btnRect.right) + 'px';
        menu.style.left  = 'auto';
      }

      var closeTimer = null;
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
        }, 180);
      }

      if (isMobileNav()) {
        /* Mobile: click to toggle open/close */
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var isOpen = dd.classList.contains('open');
          if (isOpen) {
            dd.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
          } else {
            dd.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            /* Ensure menu stays within viewport */
            setTimeout(function() {
              var menuRect = menu.getBoundingClientRect();
              if (menuRect.right > window.innerWidth) {
                menu.style.right = '0';
                menu.style.left = 'auto';
              }
              if (menuRect.left < 0) {
                menu.style.left = '0';
                menu.style.right = 'auto';
              }
            }, 10);
          }
        });
      } else {
        btn.addEventListener('mouseenter', openMenu);
        btn.addEventListener('mouseleave', scheduleClose);
        menu.addEventListener('mouseenter', function() {
          if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        });
        menu.addEventListener('mouseleave', scheduleClose);
      }

      window.addEventListener('scroll',  function() { if (dd.classList.contains('open')) positionMenu(); }, { passive: true });
      window.addEventListener('resize',  function() { if (dd.classList.contains('open')) positionMenu(); });
      document.addEventListener('click', function(e) {
        if (!dd.contains(e.target)) {
          dd.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* ── "List of Certificates" sub-row: tap to expand on mobile ── */
    var hasSub = document.querySelector('.atl-brochure-item--has-sub');
    if (hasSub) {
      hasSub.addEventListener('click', function(e) {
        if (!isMobileNav()) return; /* Desktop uses CSS hover */
        e.stopPropagation();
        hasSub.classList.toggle('sub-open');
      });
    }
  });
})();

/* ══════════════════════════════════════════════════
   navClick — smooth scroll to section on homepage,
   or navigate to that page if section not on current page.
   Used by logo, footer links, and inline onclick attrs.
══════════════════════════════════════════════════ */
window.navClick = function(section) {
  var el = document.getElementById(section);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return false; /* prevent href navigation */
  }
  /* Section not on this page — navigate to homepage with hash */
  var sectionMap = {
    'home':         'index.html',
    'about':        'about.html',
    'contact':      'contact.html',
    'reliable':     'index.html#reliable',
    'why-choose-us':'index.html#why-choose-us',
    'our-customers':'index.html#our-customers',
  };
  var dest = sectionMap[section] || 'index.html';
  window.location.href = dest;
  return false;
};

/* ══════════════════════════════════════════════════
   Fix mobile nav "Services" links that were
   redirecting to contact page.
   All service sub-links in mobile nav use real hrefs
   so no JS fix needed there — but we guard the
   accordion toggle to NOT navigate.
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  /* Fix: "View All Services" on homepage goes to services-page.html
     On mobile, some pages may have this anchored to contact — correct it */
  var viewAllBtn = document.getElementById('viewAllServicesBtn');
  if (viewAllBtn) {
    viewAllBtn.setAttribute('href', 'services-page.html');
    viewAllBtn.onclick = null;
  }

  /* Fix: "Explore Products" on homepage */
  var exploreBtn = document.querySelector('.atl-home-hero__btns .atl-btn-primary');
  if (exploreBtn) {
    exploreBtn.setAttribute('href', 'products.html');
    exploreBtn.onclick = null;
    /* Ensure tap/click always navigates — belt-and-suspenders for mobile */
    exploreBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      window.location.href = 'products.html';
    });
  }
});


/* ═══════════════════════════════════════════════════════════════
   BROCHURE MODAL — GLOBAL FIXES
   1. Custom fixed-position dropdowns for Country & Industry
      (prevents native <select> from opening upward inside overflow modal)
   2. Auto-download the brochure PDF after form submit
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Shared state ─────────────────────────────────────── */
  var _pendingBrochureUrl = '';   // set when user clicks a brochure item

  /* ── Custom dropdown builder ──────────────────────────── */
  function buildCustomSelect(nativeSelect) {
    if (!nativeSelect || nativeSelect.dataset.customDone) return;
    nativeSelect.dataset.customDone = '1';

    /* Hide native select but keep it in the form for validation */
    nativeSelect.style.cssText = 'position:absolute;opacity:0;pointer-events:none;width:0;height:0;';

    var id      = nativeSelect.id;
    var options = Array.from(nativeSelect.options);

    /* Build wrapper */
    var wrapper = document.createElement('div');
    wrapper.className = 'csd-wrap';
    wrapper.setAttribute('role', 'combobox');
    wrapper.setAttribute('aria-haspopup', 'listbox');
    wrapper.setAttribute('aria-expanded', 'false');
    wrapper.setAttribute('aria-controls', id + '-list');

    /* Trigger button */
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'csd-trigger qf-select';
    trigger.setAttribute('aria-haspopup', 'listbox');
    var placeholder = options[0] ? options[0].text : 'Select…';
    trigger.innerHTML = '<span class="csd-label">' + placeholder + '</span>' +
      '<svg class="csd-arrow" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>';

    /* Listbox (rendered fixed so it escapes overflow:auto on modal) */
    var list = document.createElement('ul');
    list.className = 'csd-list';
    list.id = id + '-list';
    list.setAttribute('role', 'listbox');
    list.style.display = 'none';

    options.forEach(function (opt, idx) {
      if (idx === 0 && opt.disabled) return; /* skip placeholder option */
      var li = document.createElement('li');
      li.className = 'csd-option';
      li.setAttribute('role', 'option');
      li.setAttribute('data-value', opt.value);
      li.textContent = opt.text;
      li.addEventListener('mousedown', function (e) {
        e.preventDefault(); /* prevent trigger blur before selection */
        selectOption(opt.value, opt.text);
        closeList();
      });
      list.appendChild(li);
    });

    /* Position list using fixed coords of trigger */
    function positionList() {
      var rect = trigger.getBoundingClientRect();
      list.style.position  = 'fixed';
      list.style.top       = (rect.bottom + 4) + 'px';
      list.style.left      = rect.left + 'px';
      list.style.width     = rect.width + 'px';
      list.style.zIndex    = '99999';
      list.style.maxHeight = Math.min(220, window.innerHeight - rect.bottom - 8) + 'px';
    }

    function openList() {
      positionList();
      list.style.display = 'block';
      wrapper.setAttribute('aria-expanded', 'true');
      trigger.classList.add('csd-open');
    }

    function closeList() {
      list.style.display = 'none';
      wrapper.setAttribute('aria-expanded', 'false');
      trigger.classList.remove('csd-open');
    }

    function selectOption(value, text) {
      nativeSelect.value = value;
      /* Fire change event so any validation listeners pick it up */
      nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      trigger.querySelector('.csd-label').textContent = text;
      trigger.classList.remove('err');
      /* Clear error span */
      var errSpan = document.getElementById(id.replace('bro', 'broErr').replace('Country','Country').replace('Industry','Industry'));
      if (!errSpan) errSpan = nativeSelect.parentElement.querySelector('.qf-err');
      if (errSpan) errSpan.classList.remove('show');
      /* Sync err class with native */
      nativeSelect.classList.remove('err');
    }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (list.style.display === 'block') {
        closeList();
      } else {
        /* Close any other open lists first */
        document.querySelectorAll('.csd-list').forEach(function(l){ l.style.display='none'; });
        document.querySelectorAll('.csd-trigger').forEach(function(t){ t.classList.remove('csd-open'); });
        openList();
      }
    });

    /* Close on outside click */
    document.addEventListener('click', function () { closeList(); });
    /* Reposition on scroll/resize */
    window.addEventListener('resize', function () { if (list.style.display === 'block') positionList(); });
    document.addEventListener('scroll', function () { if (list.style.display === 'block') positionList(); }, true);

    /* Patch validateBroForm to check the wrapper trigger for err class */
    wrapper.appendChild(trigger);
    nativeSelect.parentElement.insertBefore(wrapper, nativeSelect);
    /* The list must be in <body> so overflow doesn't clip it */
    document.body.appendChild(list);

    /* Patch: mirror 'err' class from native select to trigger */
    var origAdd = nativeSelect.classList.add.bind(nativeSelect.classList);
    var origRemove = nativeSelect.classList.remove.bind(nativeSelect.classList);
    nativeSelect.classList.add = function () {
      origAdd.apply(null, arguments);
      if (Array.prototype.indexOf.call(arguments, 'err') >= 0) trigger.classList.add('err');
    };
    nativeSelect.classList.remove = function () {
      origRemove.apply(null, arguments);
      if (Array.prototype.indexOf.call(arguments, 'err') >= 0) trigger.classList.remove('err');
    };
  }

  /* ── Inject CSS for custom select ────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '.csd-wrap{position:relative;width:100%}',
    '.csd-trigger{display:flex;align-items:center;justify-content:space-between;width:100%;',
    '  padding:.6rem .85rem;border:1.5px solid #e5e7eb;border-radius:8px;',
    '  font-size:.85rem;color:#6b7280;background:#fff;cursor:pointer;',
    '  text-align:left;outline:none;transition:border-color .18s,box-shadow .18s;box-sizing:border-box;}',
    '.csd-trigger.csd-open,.csd-trigger:focus{border-color:#031885;box-shadow:0 0 0 3px rgba(3,24,133,.08);color:#111827;}',
    '.csd-trigger.err{border-color:#B00000;}',
    '.csd-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.csd-arrow{flex-shrink:0;margin-left:.5rem;transition:transform .18s;color:#9ca3af;}',
    '.csd-trigger.csd-open .csd-arrow{transform:rotate(180deg);}',
    '.csd-list{list-style:none;margin:0;padding:4px 0;',
    '  background:#fff;border:1.5px solid #e5e7eb;border-radius:8px;',
    '  box-shadow:0 8px 32px rgba(0,0,0,.14);overflow-y:auto;',
    '  animation:csdIn .15s ease both;}',
    '@keyframes csdIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}',
    '.csd-option{padding:.52rem .85rem;font-size:.85rem;color:#111827;cursor:pointer;',
    '  transition:background .1s;}',
    '.csd-option:hover{background:#f0f3ff;color:#031885;}',
  ].join('');
  document.head.appendChild(style);

  /* ── Intercept brochure item clicks to store PDF URL ─── */
  document.addEventListener('click', function (e) {
    var item = e.target.closest('.atl-brochure-item:not(.atl-brochure-item--has-sub)');
    if (item && item.href && item.href.indexOf('REPLACE_LINK') === -1) {
      _pendingBrochureUrl = item.href;
    } else if (item) {
      /* placeholder URL — store anyway so download attempt is made */
      _pendingBrochureUrl = item.href || '';
    }
    /* Also handle sd-card-brochure buttons */
    var cardBro = e.target.closest('.sd-card-brochure');
    if (cardBro) {
      _pendingBrochureUrl = cardBro.href || cardBro.dataset.href || '';
    }
  }, true); /* capture phase so we get it before the handler that opens the modal */

  /* ── Init on DOM ready ────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    var _selectsBuilt = false;

    /* Build custom selects LAZILY — only the first time the modal opens.
       The modal is display:none on load, so getBoundingClientRect() returns
       all zeros if we try to build now. We must wait until the overlay is
       visible so the trigger has real pixel coordinates. */
    function buildSelectsOnce() {
      if (_selectsBuilt) return;
      _selectsBuilt = true;
      var countrySelect  = document.getElementById('broCountry');
      var industrySelect = document.getElementById('broIndustry');
      if (countrySelect)  buildCustomSelect(countrySelect);
      if (industrySelect) buildCustomSelect(industrySelect);
    }

    /* Watch the overlay for the .open class being added */
    var overlay = document.getElementById('broOverlay');
    if (overlay) {
      /* MutationObserver fires synchronously after class change,
         before the next paint — still enough time to build the selects
         since positionList() is only called when user taps the trigger. */
      var mo = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.type === 'attributes' && overlay.classList.contains('open')) {
            buildSelectsOnce();
          }
        });
      });
      mo.observe(overlay, { attributes: true, attributeFilter: ['class'] });

      /* Backdrop click closes */
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
      });
    }

    /* ESC key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var ov = document.getElementById('broOverlay');
        if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
      }
    });

    /* ── Patch form submit to auto-download after success ── */
    var form = document.getElementById('broForm');
    if (!form) return;

    /* Remove the old inline submit listener by cloning */
    var oldForm = form.cloneNode(true);
    form.parentNode.replaceChild(oldForm, form);
    form = oldForm;

    /* Re-hook close button after cloneNode */
    var closeBtn = document.getElementById('broClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        var ov = document.getElementById('broOverlay');
        if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateBroFormGlobal(form)) return;

      var btn = document.getElementById('broSubmit');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      setTimeout(function () {
        /* Show success state */
        form.style.display = 'none';
        var successEl = document.getElementById('broSuccess');
        if (successEl) successEl.classList.add('show');

        /* ── AUTO-DOWNLOAD ── */
        if (_pendingBrochureUrl && _pendingBrochureUrl.indexOf('REPLACE_LINK') === -1) {
          var a = document.createElement('a');
          a.href = _pendingBrochureUrl;
          a.download = _pendingBrochureUrl.split('/').pop() || 'brochure.pdf';
          a.target = '_blank';
          a.rel = 'noopener';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }

        /* Auto-close modal after 3.2 s */
        setTimeout(function () {
          var ov = document.getElementById('broOverlay');
          if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
          /* Reset form for next use */
          setTimeout(function () {
            form.style.display = '';
            if (successEl) successEl.classList.remove('show');
            form.reset();
            /* Reset custom select labels */
            document.querySelectorAll('.csd-trigger .csd-label').forEach(function (lbl) {
              var wrap = lbl.closest('.csd-wrap');
              if (!wrap) return;
              var nat = wrap.nextElementSibling;
              if (nat && nat.options && nat.options[0]) lbl.textContent = nat.options[0].text;
            });
            if (btn) { btn.disabled = false; btn.textContent = 'Get My Brochure'; }
            _pendingBrochureUrl = '';
          }, 400);
        }, 3200);
      }, 900);
    });
  });

  /* ── Validation (mirrors inline validateBroForm) ──────── */
  function validateBroFormGlobal(form) {
    var ok = true;
    function chk(id, errId, testFn) {
      var el  = form.querySelector('#' + id)  || document.getElementById(id);
      var err = form.querySelector('#' + errId) || document.getElementById(errId);
      if (!el) return;
      var valid = testFn(el.value.trim());
      el.classList.toggle('err', !valid);
      if (err) err.classList.toggle('show', !valid);
      if (!valid) ok = false;
    }
    chk('broFirst',    'broErrFirst',    function(v){ return v.length >= 2; });
    chk('broLast',     'broErrLast',     function(v){ return v.length >= 2; });
    chk('broEmail',    'broErrEmail',    function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); });
    chk('broPhone',    'broErrPhone',    function(v){
      var digits = v.replace(/[\s\-\(\)]/g, '');
      if (!/^\d+$/.test(digits)) return false;
      var dialEl = form.querySelector('#broDialCode') || document.getElementById('broDialCode');
      var dial = dialEl ? dialEl.value : '+91';
      if (dial === '+91') return digits.length === 10;
      return digits.length >= 6 && digits.length <= 15;
    });
    chk('broCountry',  'broErrCountry',  function(v){ return v !== ''; });
    chk('broCompany',  'broErrCompany',  function(v){ return v.length >= 2; });
    chk('broState',    'broErrState',    function(v){ return v.length >= 2; });
    chk('broIndustry', 'broErrIndustry', function(v){ return v !== ''; });
    return ok;
  }

})();
