/* ================================================================
   js/pages/contact.js — Avartanam Test Labs
   Purpose: JS for contact.html. Covers: contact form validation, EmailJS submit, thank-you modal open/close.
            Page-specific JavaScript only — do not include elsewhere.
================================================================ */

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM — validation + thank-you modal
   Runs inline AFTER the DOM and atl-merged.js are loaded.
═══════════════════════════════════════════════════════════ */
(function () {

  var form    = document.getElementById('atlContactForm');
  var btn     = document.getElementById('cuSubmitBtn');
  var modal   = document.getElementById('cuThankModal');
  if (!form || !btn) return;

  var FIELDS = [
    { id:'cuFirst',   errId:'cuErrFirst',   type:'required' },
    { id:'cuLast',    errId:'cuErrLast',    type:'required' },
    { id:'cuEmail',   errId:'cuErrEmail',   type:'email'    },
    { id:'cuPhone',   errId:'cuErrPhone',   type:'phone'    },
    { id:'cuService', errId:'cuErrService', type:'select'   },
    { id:'cuCompany', errId:'cuErrCompany', type:'required' },
  ];

  /* Validate one field */
  function chk(f) {
    var el  = document.getElementById(f.id);
    var err = document.getElementById(f.errId);
    if (!el) return true;
    var val = el.value.trim();
    var bad = false;

    if      (f.type === 'required') { bad = val === ''; }
    else if (f.type === 'select')   { bad = val === '' || val === null; }
    else if (f.type === 'email')    { bad = val === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }
    else if (f.type === 'phone') {
      var d = val.replace(/[\s\-\(\)\+]/g, '');
      if (d.length === 12 && d.slice(0,2) === '91') d = d.slice(2);
      bad = val === '' || !/^\d{10}$/.test(d);
    }

    el.classList.toggle('cu-bad', bad);
    if (err) err.style.display = bad ? 'block' : 'none';
    return !bad;
  }

  /* Clear on input */
  FIELDS.forEach(function(f) {
    var el  = document.getElementById(f.id);
    var err = document.getElementById(f.errId);
    if (!el) return;
    ['input','change'].forEach(function(evt) {
      el.addEventListener(evt, function() {
        el.classList.remove('cu-bad');
        if (err) err.style.display = 'none';
      });
    });
  });

  /* Submit */
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var ok = true;
    FIELDS.forEach(function(f) { if (!chk(f)) ok = false; });
    if (!ok) return;

    btn.disabled = true;
    btn.textContent = 'Submitting…';
    form.reset();
    FIELDS.forEach(function(f) {
      var el = document.getElementById(f.id);
      if (el) el.classList.remove('cu-bad');
    });
    btn.disabled = false;
    btn.textContent = 'SUBMIT REQUEST';

    /* Show modal — closes only via ✕ button */
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  });

})();

function closeCuModal() {
  var m = document.getElementById('cuThankModal');
  if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
}

/* Escape key close disabled: use X button (✕) to close */