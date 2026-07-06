/* ================================================================
   js/pages/services-page.js — Avartanam Test Labs
   Purpose: JS for services-page.html. Covers: nav shadow on scroll, filter pill interaction for service categories.
            Page-specific JavaScript only — do not include elsewhere.
================================================================ */

/* ── Nav shadow on scroll ────────────────────────────────── */
window.addEventListener('scroll', function() {
  document.getElementById('atlNav').classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Filter pills ────────────────────────────────────────── */
function applyFilter(cat) {
  /* 1. Update active pill */
  document.querySelectorAll('.filter-pill').forEach(function(p) {
    p.classList.toggle('active', p.getAttribute('data-cat') === cat);
  });

  /* 2. Show only cards matching the selected category */
  document.querySelectorAll('.svc-item').forEach(function(item) {
    var match = (cat === 'all' || item.getAttribute('data-cat') === cat);
    item.style.display = match ? '' : 'none';
  });
}

/* Pill click */
document.getElementById('filterBar').addEventListener('click', function(e) {
  var pill = e.target.closest('.filter-pill');
  if (!pill) return;
  applyFilter(pill.getAttribute('data-cat'));
});

/* Auto-filter from URL param e.g. services-page.html?cat=rf */
(function() {
  var params = new URLSearchParams(window.location.search);
  var cat = params.get('cat');
  if (cat) {
    applyFilter(cat);
    setTimeout(function() {
      var bar = document.getElementById('filterBar');
      if (bar) bar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
})();

/* ── Quote modal ─────────────────────────────────────────── */
function openModal(svcName) {
  document.getElementById('modalSvcName').textContent = svcName || 'Service';
  document.getElementById('quoteModal').classList.add('open');
  document.getElementById('modalSuccess').classList.remove('show');
  document.getElementById('modalFormWrap').style.display = '';
  var btn = document.getElementById('qSubmit');
  btn.style.display = '';
  btn.disabled = false;
  btn.textContent = 'SUBMIT REQUEST';
  document.getElementById('quoteForm').reset();
  document.querySelectorAll('.m-input').forEach(function(i){ i.classList.remove('bad'); });
  document.querySelectorAll('.m-err').forEach(function(e){ e.style.display='none'; });
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('quoteModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

/* ── Form validation & submit ─────────────────────────────── */
document.getElementById('quoteForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var ok = true;

  function chk(id, errId, type) {
    var el = document.getElementById(id);
    var err = document.getElementById(errId);
    var val = el.value.trim();
    var bad = false;
    if (type === 'required') bad = val === '';
    else if (type === 'email') bad = val==='' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    else if (type === 'phone') {
      var d = val.replace(/[\s\-\(\)\+]/g,'');
      if (d.length===12 && d.slice(0,2)==='91') d = d.slice(2);
      if (d.length===11 && d.slice(0,1)==='0')  d = d.slice(1);
      bad = val==='' || !/^\d{10}$/.test(d);
    }
    el.classList.toggle('bad', bad);
    err.style.display = bad ? 'block' : 'none';
    if (bad) ok = false;
  }

  chk('qFirst',   'eFirst',   'required');
  chk('qLast',    'eLast',    'required');
  chk('qEmail',   'eEmail',   'email');
  chk('qPhone',   'ePhone',   'phone');
  chk('qCompany', 'eCompany', 'required');

  if (!ok) return;

  var btn = document.getElementById('qSubmit');
  btn.disabled = true;
  btn.textContent = 'Submitting…';

  setTimeout(function() {
    document.getElementById('modalFormWrap').style.display = 'none';
    document.getElementById('modalSuccess').classList.add('show');
    setTimeout(closeModal, 4500);
  }, 1000);
});

/* Clear errors on input */
['qFirst','qLast','qEmail','qPhone','qCompany'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) el.addEventListener('input', function() {
    el.classList.remove('bad');
    var errMap = {qFirst:'eFirst',qLast:'eLast',qEmail:'eEmail',qPhone:'ePhone',qCompany:'eCompany'};
    var errEl = document.getElementById(errMap[id]);
    if (errEl) errEl.style.display = 'none';
  });
});