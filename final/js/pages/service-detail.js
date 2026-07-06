/* ================================================================
   js/pages/service-detail.js — Avartanam Test Labs
   Purpose: JS for service-detail.html (dynamic service template). Covers: full service-page init (gallery, tabs, quote modal), openQuoteModal / closeQuoteModal helper wrappers.
            Page-specific JavaScript only — do not include elsewhere.
================================================================ */

(function () {
    'use strict';

    /* ── Helpers ─────────────────────────────────── */
    function esc(s) {
      return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    function statusChip(s) {
      var map = { Active:'blue', 'In Stock':'green', 'Active Service':'blue', Available:'green' };
      var cls = map[s] || 'gray';
      return '<span class="sd-chip sd-chip--' + cls + '">' + esc(s) + '</span>';
    }
    function emptyRow(cols, msg) {
      return '<tr><td colspan="' + cols + '" style="text-align:center;padding:2rem;color:#9ca3af;">' + esc(msg) + '</td></tr>';
    }

    /* ── Tab switching ───────────────────────────── */
    document.querySelectorAll('.sd-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.sd-tab').forEach(function(t){ t.classList.remove('active'); });
        document.querySelectorAll('.sd-panel').forEach(function(p){ p.classList.remove('active'); });
        tab.classList.add('active');
        var panelId = 'panel-' + tab.getAttribute('data-panel');
        var panel = document.getElementById(panelId);
        if (panel) panel.classList.add('active');
      });
    });

    /* ── Load data ───────────────────────────────── */
    var params = new URLSearchParams(window.location.search);
    var id     = params.get('id') || '';
    var type   = params.get('type') || 'service'; // 'service' or 'product'

    var allServices = window.ATL_PRODUCTS    || [];
    var allProducts = window.ATL_HW_PRODUCTS || [];

    var item = null;
    if (type === 'product') {
      item = allProducts.filter(function(p){ return p.id === id; })[0];
    } else {
      item = allServices.filter(function(p){ return p.id === id; })[0];
    }

    document.getElementById('sdLoading').style.display = 'none';

    if (!item) {
      document.getElementById('sdNotFound').style.display = 'block';
      return;
    }

    /* ── Update page title ───────────────────────── */
    document.title = item.name + ' — Avartanam Test Labs';

    /* ── Hero ────────────────────────────────────── */
    document.getElementById('heroBreadName').textContent  = item.name;
    document.getElementById('heroStatus').textContent     = item.status || 'Active Service';
    document.getElementById('heroTitle').textContent      = item.name;
    document.getElementById('heroDesc').textContent       = item.desc;

    // Meta pills
    var metaItems = [
      { lbl: 'Item Code',      val: item.partNo || '—' },
      { lbl: 'Category',        val: item.categoryLabel || '—' },
      { lbl: 'Accreditation',   val: item.accreditation || '—' },
      { lbl: 'Lead Time',       val: item.leadTime || '—' },
    ];
    document.getElementById('heroMeta').innerHTML = metaItems.map(function(m){
      return '<div class="sd-hero__meta-item"><span class="sd-hero__meta-lbl">' + esc(m.lbl) + '</span><span class="sd-hero__meta-val">' + esc(m.val) + '</span></div>';
    }).join('');

    // Hero image
    var imgWrap = document.getElementById('heroImgWrap');
    if (item.image) {
      imgWrap.innerHTML = '<img src="' + esc(item.image) + '" alt="' + esc(item.name) + '">';
    }

    /* ── Overview: specs ─────────────────────────── */
    var specsEl = document.getElementById('overviewSpecs');
    var specRows = [];
    if (item.specs) {
      // Hardware product with specs object
      Object.keys(item.specs).forEach(function(k){
        specRows.push({ k: k, v: item.specs[k] });
      });
    } else {
      // Service — build specs from data
      specRows = [
        { k: 'Category',          v: item.categoryLabel },
        { k: 'Item Code',          v: item.partNo },
        { k: 'Accreditation',     v: item.accreditation },
        { k: 'Lead Time',         v: item.leadTime },
        { k: 'Primary Standard',  v: (item.standards || []).slice(0,2).join(' · ') || '—' },
        { k: 'Sub-services',      v: (item.options || []).length + ' options available' },
        { k: 'Report Format',     v: 'NABL Test Report · PDF / DOCX' },
        { k: 'Test Environment',  v: item.category === 'rf' ? 'OTA Anechoic Chamber / Shielded Room' : item.category === 'emi' ? '10m Semi-Anechoic Chamber' : item.category === 'environmental' ? 'Environmental Stress Chamber' : 'NABL Accredited Lab' },
        { k: 'Operating Temp.',   v: item.category === 'environmental' ? '-40°C to +125°C' : 'Ambient (23 ± 5°C)' },
        { k: 'Standards (all)',   v: (item.standards || []).join(' · ') || '—' },
      ];
    }
    specsEl.innerHTML = specRows.map(function(r){
      return '<div class="sd-spec-cell"><div class="sd-spec-cell__key">' + esc(r.k) + '</div><div class="sd-spec-cell__val">' + esc(r.v) + '</div></div>';
    }).join('');

    // Overview actions
    document.getElementById('overviewActions').innerHTML = [
      '<button type="button" onclick="openQuoteModal()" class="sd-btn sd-btn--red">',
        '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
        'Request Quote',
      '</button>',
      '<a href="tel:+917486031238" class="sd-btn sd-btn--primary">',
        '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.77 2.38 2 2 0 012.76.2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.28-1.09a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
        'Call Us',
      '</a>',
    ].join('');
    // Set service name in quote modal
    var qmSvc = document.getElementById('qmServiceName');
    if (qmSvc) qmSvc.textContent = item.name + ' — Fill in your details and we\'ll get back to you shortly.';

    /* ── Options tab ─────────────────────────────── */
    var optBody = document.getElementById('optionsBody');
    var opts = item.options || [];
    if (opts.length) {
      optBody.innerHTML = opts.map(function(o, i){
        return [
          '<tr>',
            '<td><code style="font-size:.78rem;background:#f3f4f6;padding:.15rem .4rem;border-radius:4px;">' + esc(o.partNo) + '</code></td>',
            '<td style="font-weight:600;max-width:200px;">' + esc(o.service) + '</td>',
            '<td>' + esc(o.standard) + '</td>',
            '<td style="max-width:260px;font-size:.78rem;color:#6b7280;">' + esc(o.scope) + '</td>',
            '<td>' + statusChip(o.accr) + '</td>',
            '<td>' + esc(o.leadTime) + '</td>',
            '<td>' + statusChip(o.status || 'Active') + '</td>',
            '<td><a href="mailto:sales@avartanamlabs.com?subject=Quote: ' + encodeURIComponent(o.partNo) + '" class="sd-tbl-btn sd-tbl-btn--navy">Quote</a></td>',
          '</tr>'
        ].join('');
      }).join('');
    } else {
      optBody.innerHTML = emptyRow(8, 'No sub-options available for this item.');
    }

    /* ── Equipment tab ───────────────────────────── */
    var equipBody = document.getElementById('equipBody');
    var boards = item.boards || [];
    if (boards.length) {
      equipBody.innerHTML = boards.map(function(b){
        return [
          '<tr>',
            '<td>' + esc(b.name) + '</td>',
            '<td><code style="font-size:.78rem;background:#f3f4f6;padding:.15rem .4rem;border-radius:4px;">' + esc(b.model) + '</code></td>',
            '<td>' + esc(b.type) + '</td>',
            '<td><span style="font-family:\'IBM Plex Mono\',monospace;font-size:.8rem;">' + esc(b.freq) + '</span></td>',
            '<td>' + statusChip(b.cert) + '</td>',
            '<td>' + statusChip(b.avail || 'Available') + '</td>',
          '</tr>'
        ].join('');
      }).join('');
    } else {
      equipBody.innerHTML = emptyRow(6, 'No equipment listed for this item.');
    }

    /* ── Documents tab ───────────────────────────── */
    var docsBody = document.getElementById('docsBody');
    var docs = item.docs || [];
    if (docs.length) {
      docsBody.innerHTML = docs.map(function(d){
        var fmtColor = d.format === 'PDF' ? '#fee2e2:#991b1b' : d.format === 'XLSX' ? '#dcfce7:#166534' : '#dbeafe:#1e40af';
        var parts = fmtColor.split(':');
        return [
          '<tr>',
            '<td style="font-weight:600;">' + esc(d.title) + '</td>',
            '<td>' + esc(d.type) + '</td>',
            '<td>' + esc(d.std) + '</td>',
            '<td>' + esc(d.rev) + '</td>',
            '<td><span style="background:' + parts[0] + ';color:' + parts[1] + ';padding:.15rem .5rem;border-radius:4px;font-size:.72rem;font-weight:700;">' + esc(d.format) + '</span></td>',
            '<td>' + esc(d.size) + '</td>',
            '<td><a href="mailto:sales@avartanamlabs.com?subject=Document Request: ' + encodeURIComponent(d.title) + '" class="sd-tbl-btn sd-tbl-btn--outline">Request</a></td>',
          '</tr>'
        ].join('');
      }).join('');
    } else {
      docsBody.innerHTML = emptyRow(7, 'No documents listed.');
    }

    /* ── Software tab ────────────────────────────── */
    var softBody = document.getElementById('softwareBody');
    var software = item.software || [];
    if (software.length) {
      softBody.innerHTML = software.map(function(s){
        return [
          '<tr>',
            '<td style="font-weight:600;">' + esc(s.name) + '</td>',
            '<td>' + esc(s.ver) + '</td>',
            '<td>' + esc(s.platform) + '</td>',
            '<td>' + statusChip(s.license) + '</td>',
            '<td style="font-size:.8rem;color:#6b7280;max-width:280px;">' + esc(s.desc) + '</td>',
            '<td><a href="mailto:sales@avartanamlabs.com?subject=Software Access: ' + encodeURIComponent(s.name) + '" class="sd-tbl-btn sd-tbl-btn--navy">Access</a></td>',
          '</tr>'
        ].join('');
      }).join('');
    } else {
      softBody.innerHTML = emptyRow(6, 'No software listed.');
    }

    /* ── Videos tab ──────────────────────────────── */
    var vidBody = document.getElementById('videosBody');
    var videos = item.videos || [];
    if (videos.length) {
      vidBody.innerHTML = videos.map(function(v, i){
        return [
          '<tr>',
            '<td style="color:#9ca3af;font-size:.8rem;">' + (i+1) + '</td>',
            '<td style="font-weight:600;">' + esc(v.title) + '</td>',
            '<td>' + statusChip(v.type) + '</td>',
            '<td>' + esc(v.dur) + '</td>',
            '<td style="font-size:.8rem;color:#6b7280;max-width:280px;">' + esc(v.desc) + '</td>',
            '<td><a href="mailto:sales@avartanamlabs.com?subject=Video Access: ' + encodeURIComponent(v.title) + '" class="sd-tbl-btn sd-tbl-btn--outline">Watch</a></td>',
          '</tr>'
        ].join('');
      }).join('');
    } else {
      vidBody.innerHTML = emptyRow(6, 'No videos listed.');
    }

    /* ── Show overview panel ─────────────────────── */
    document.getElementById('panel-overview').classList.add('active');

  })();

function openQuoteModal() {
  var m = document.getElementById('quoteModal');
  m.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Reset form
  document.getElementById('qmFormWrap').style.display = 'block';
  document.getElementById('qmSuccess').style.display = 'none';
  document.getElementById('qmErr').style.display = 'none';
  ['qmFirst','qmLast','qmEmail','qmPhone','qmCompany','qmDetails'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
}
function closeQuoteModal() {
  document.getElementById('quoteModal').style.display = 'none';
  document.body.style.overflow = '';
}
function submitQuoteForm() {
  var first   = document.getElementById('qmFirst').value.trim();
  var email   = document.getElementById('qmEmail').value.trim();
  var details = document.getElementById('qmDetails').value.trim();
  var errEl   = document.getElementById('qmErr');
  if (!first || !email || !details) {
    errEl.textContent = 'Please fill in your name, email, and project details.';
    errEl.style.display = 'block';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errEl.textContent = 'Please enter a valid email address.';
    errEl.style.display = 'block';
    return;
  }
  var phone = document.getElementById('qmPhone').value.trim();
  if (phone) {
    var d = phone.replace(/[\s\-\(\)\+]/g,'');
    if (d.length===12 && d.slice(0,2)==='91') d = d.slice(2);
    if (d.length===11 && d.slice(0,1)==='0') d = d.slice(1);
    if (!/^\d{10}$/.test(d)) {
      errEl.textContent = 'Please enter a valid 10-digit phone number.';
      errEl.style.display = 'block';
      return;
    }
  }
  errEl.style.display = 'none';
  // Build mailto
  var svc   = document.getElementById('qmServiceName').textContent || 'Service';
  var phone = document.getElementById('qmPhone').value.trim();
  var comp  = document.getElementById('qmCompany').value.trim();
  var last  = document.getElementById('qmLast').value.trim();
  var body  = 'Name: ' + first + ' ' + last + '\nEmail: ' + email + (phone ? '\nPhone: '+phone : '') + (comp ? '\nCompany: '+comp : '') + '\n\nDetails:\n' + details;
  window.location.href = 'mailto:sales@avartanamlabs.com?subject=' + encodeURIComponent('Quote Request - ' + svc) + '&body=' + encodeURIComponent(body);
  // Show success
  document.getElementById('qmFormWrap').style.display = 'none';
  document.getElementById('qmSuccess').style.display = 'block';
}
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeQuoteModal(); });