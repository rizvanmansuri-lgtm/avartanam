/* ================================================================
   js/pages/upcoming-trade-shows.js — Avartanam Test Labs
   Purpose: JS for upcoming-trade-shows.html. Covers: nav shadow on scroll, filter pills for trade show cards, dynamic card rendering from embedded data.
            Page-specific JavaScript only — do not include elsewhere.
================================================================ */

/* ── Nav shadow on scroll ─────────────────────────────────── */
window.addEventListener('scroll', function() {
  document.getElementById('siteNav').classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Filter pills ─────────────────────────────────────────── */
document.getElementById('filterBar').addEventListener('click', function(e) {
  var pill = e.target.closest('.filter-pill');
  if (!pill) return;
  document.querySelectorAll('.filter-pill').forEach(function(p){ p.classList.remove('active'); });
  pill.classList.add('active');
  var cat = pill.getAttribute('data-cat');
  document.querySelectorAll('.ev-item').forEach(function(item) {
    item.style.display = (cat === 'all' || item.getAttribute('data-cat') === cat) ? '' : 'none';
  });
});

/* ── Modal ────────────────────────────────────────────────── */
function openRegModal(eventName, type) {
  document.getElementById('modalEventName').textContent = eventName || 'Event';
  document.getElementById('regModal').classList.add('open');
  document.getElementById('regSuccess').classList.remove('show');
  document.getElementById('regFormWrap').style.display = '';

  /* Always reset submit button state when modal opens */
  var submitBtn = document.getElementById('rSubmit');
  submitBtn.style.display = '';
  submitBtn.disabled = false;
  submitBtn.textContent = type === 'enquire' ? 'SEND ENQUIRY' : 'REGISTER INTEREST';

  document.getElementById('regForm').reset();
  document.querySelectorAll('.m-input').forEach(function(i){ i.classList.remove('bad'); });
  document.querySelectorAll('.m-err').forEach(function(e){ e.style.display = 'none'; });
  document.body.style.overflow = 'hidden';

  /* Change modal header + submit button colour based on type */
  var head = document.querySelector('#regModal .modal-head');
  if (type === 'enquire') {
    head.style.background = 'linear-gradient(135deg, #c00000, #B00000)';
    submitBtn.style.background = '#B00000';
    submitBtn.onmouseover = function(){ this.style.background='#8a0000'; };
    submitBtn.onmouseout  = function(){ this.style.background='#B00000'; };
  } else {
    head.style.background = '';   /* reset to CSS default (navy) */
    submitBtn.style.background = '';
    submitBtn.onmouseover = null;
    submitBtn.onmouseout  = null;
  }
}
function closeRegModal() {
  document.getElementById('regModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeRegModal(); });

/* ── Form validation ──────────────────────────────────────── */
document.getElementById('regForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var ok = true;

  function chk(id, errId, type) {
    var el = document.getElementById(id);
    var err = document.getElementById(errId);
    var val = el.value.trim();
    var bad = false;
    if (type === 'required') bad = val === '';
    else if (type === 'email') bad = val === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    else if (type === 'phone') {
      var d = val.replace(/[\s\-\(\)\+]/g,'');
      if (d.length===12 && d.slice(0,2)==='91') d=d.slice(2);
      bad = val==='' || !/^\d{10}$/.test(d);
    }
    el.classList.toggle('bad', bad);
    err.style.display = bad ? 'block' : 'none';
    if (bad) ok = false;
  }

  chk('rFirst',   'reFirst',   'required');
  chk('rLast',    'reLast',    'required');
  chk('rEmail',   'reEmail',   'email');
  chk('rPhone',   'rePhone',   'phone');
  chk('rCompany', 'reCompany', 'required');

  if (!ok) return;

  var btn = document.getElementById('rSubmit');
  btn.disabled = true; btn.textContent = 'Sending…';

  setTimeout(function() {
    document.getElementById('regFormWrap').style.display = 'none';
    document.getElementById('regSuccess').classList.add('show');
    setTimeout(closeRegModal, 4500);
  }, 1000);
});

/* Clear errors on input */
['rFirst','rLast','rEmail','rPhone','rCompany'].forEach(function(id) {
  var el = document.getElementById(id);
  var errMap = { rFirst:'reFirst', rLast:'reLast', rEmail:'reEmail', rPhone:'rePhone', rCompany:'reCompany' };
  var err = document.getElementById(errMap[id]);
  if (!el) return;
  el.addEventListener('input', function() {
    el.classList.remove('bad');
    if (err) err.style.display = 'none';
  });
});