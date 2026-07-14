/* ================================================================
   js/pages/products.js — Avartanam Test Labs
   Purpose: JS for products.html. Covers: product quote modal open with pre-filled product name, hero slider guard IIFE.
            Page-specific JavaScript only — do not include elsewhere.
================================================================ */

window.openProductQuote = function(id) {
  var prods = window.ATL_HW_PRODUCTS || [];
  var p = prods.find(function(x){ return x.id === id; });
  if (!p) return;
  var el = document.getElementById('mProductName'); if(el) el.textContent = p.name;
  var ep = document.getElementById('mPartNo');      if(ep) ep.textContent = p.partNo;
  var es = document.getElementById('mStandard');    if(es) es.textContent = p.partNo;
  var t  = document.getElementById('buyModalTitle'); if(t) t.textContent = 'Request Quote — ' + p.name;

  // Reset to form view
  var formPanel = document.getElementById('buyFormPanel');
  var thankPanel = document.getElementById('buyThankYou');
  if (formPanel) formPanel.style.display = '';
  if (thankPanel) thankPanel.style.display = 'none';

  // Reset form
  var form = document.getElementById('buyForm');
  if (form) { form.reset(); form.querySelectorAll('.cu-input.is-invalid').forEach(function(el){ el.classList.remove('is-invalid'); }); }

  var modal = new bootstrap.Modal(document.getElementById('buyModal'));
  modal.show();
};

// Handle form submit → show thank you panel
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('buyForm');
  var sub  = document.getElementById('buySubmit');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var ok = true;
    function chkField(id, errId, type) {
      var el = document.getElementById(id);
      var er = document.getElementById(errId);
      if (!el) return true;
      var val = el.value.trim();
      var bad = false;
      if (type === 'required') bad = !val;
      else if (type === 'email') bad = !val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      else if (type === 'phone') {
        var d = val.replace(/[\s\-\(\)\+]/g,'');
        if (d.length===12 && d.slice(0,2)==='91') d = d.slice(2);
        if (d.length===11 && d.slice(0,1)==='0')  d = d.slice(1);
        bad = !val || !/^\d{10}$/.test(d);
      }
      el.classList.toggle('is-invalid', bad);
      if (er) er.style.display = bad ? 'block' : 'none';
      if (bad) ok = false;
      return !bad;
    }
    chkField('fFirst',   null,       'required');
    chkField('fLast',    null,       'required');
    chkField('fEmail',   'errEmail', 'email');
    chkField('fPhone',   'errPhone', 'phone');
    chkField('fCompany', null,       'required');
    // also mark remaining required fields
    form.querySelectorAll('[required]').forEach(function(el){
      if (!['fFirst','fLast','fEmail','fPhone','fCompany'].includes(el.id)) {
        var inv = !el.value.trim(); el.classList.toggle('is-invalid', inv); if (inv) ok = false;
      }
    });
    if (!ok) return;
    sub.disabled = true; sub.textContent = 'Submitting…';
    setTimeout(function() {
      var formPanel = document.getElementById('buyFormPanel');
      var thankPanel = document.getElementById('buyThankYou');
      var titleEl = document.getElementById('buyModalTitle');
      if (formPanel) formPanel.style.display = 'none';
      if (thankPanel) {
        thankPanel.style.display = 'block';
        thankPanel.style.animation = 'rqFadeInUp .45s ease both';
      }
      if (titleEl) titleEl.textContent = 'Request a Quote';
      sub.disabled = false; sub.textContent = 'Submit Request';
    }, 900);
  });
  form.querySelectorAll('input,select,textarea').forEach(function(el) {
    el.addEventListener('input', function() { el.classList.remove('is-invalid'); });
  });

  // Reset modal on close
  var modalEl = document.getElementById('buyModal');
  if (modalEl) {
    modalEl.addEventListener('hidden.bs.modal', function() {
      var formPanel = document.getElementById('buyFormPanel');
      var thankPanel = document.getElementById('buyThankYou');
      if (formPanel) formPanel.style.display = '';
      if (thankPanel) thankPanel.style.display = 'none';
      var f = document.getElementById('buyForm');
      if (f) { f.reset(); f.querySelectorAll('.cu-input.is-invalid').forEach(function(el){ el.classList.remove('is-invalid'); }); }
    });
  }
});

(function() {
  var rules = [
    { sel: '.atl-page-hero__title', anim: 'sa-fade-up',   delay: 0 },
    { sel: '.atl-page-hero__sub',   anim: 'sa-fade-up',   delay: 1 },
    { sel: '.atl-prod-card',        anim: 'sa-scale-pop', stagger: true },
  ];
  var observed = new WeakSet();
  rules.forEach(function(rule) {
    document.querySelectorAll(rule.sel).forEach(function(el, idx) {
      if (observed.has(el)) return;
      observed.add(el);
      el.style.opacity = '0';
      el._saAnim = rule.anim;
      el._saDelay = rule.stagger ? idx * 0.12 : (rule.delay || 0) * 0.08;
    });
  });
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.style.opacity = '';
      el.style.animationDelay = (el._saDelay || 0) + 's';
      el.classList.add(el._saAnim || 'sa-fade-up');
      io.unobserve(el);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.atl-page-hero__title,.atl-page-hero__sub,.atl-prod-card').forEach(function(el) {
    if (el._saAnim) io.observe(el);
  });
})();