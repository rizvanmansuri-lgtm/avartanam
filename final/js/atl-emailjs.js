/* ================================================================
   atl-emailjs.js — Avartanam Test Labs
   EmailJS integration for all 4 forms:
     1. Contact Form        (#atlContactForm)   — index.html
     2. Quote/Request Form  (#quoteForm)        — all service pages
     3. Brochure Form       (#broForm)          — all pages
     4. Buy/Product Modal   (#buyForm)          — index.html

   HOW TO CONFIGURE:
   ─────────────────
   Fill in the 3 placeholder values below with your EmailJS details.
   Everything else is wired and ready.

   Where to find them → https://dashboard.emailjs.com
     · Public Key  : Account → API Keys → Public Key
     · Service ID  : Email Services → your service → Service ID
     · Template IDs: Email Templates → each template → Template ID

   TEMPLATE VARIABLES (use these in your EmailJS templates):
   ──────────────────────────────────────────────────────────
   Contact Form:   {{from_name}} {{from_email}} {{phone}} {{service}}
                   {{company}} {{message}} {{form_type}} {{page_url}}
   Quote Form:     {{from_name}} {{from_email}} {{phone}} {{company}}
                   {{request_type}} {{quantity}} {{message}}
                   {{service_name}} {{form_type}} {{page_url}}
   Brochure Form:  {{from_name}} {{from_email}} {{phone}} {{country}}
                   {{company}} {{industry}} {{job_title}}
                   {{document_name}} {{form_type}} {{page_url}}
   Buy Form:       {{from_name}} {{from_email}} {{phone}} {{company}}
                   {{request_type}} {{message}} {{product_name}}
                   {{form_type}} {{page_url}}
================================================================ */

(function () {
  'use strict';

  /* ── ① CONFIGURE THESE THREE VALUES ───────────────────── */
  var EMAILJS_PUBLIC_KEY    = 'aNA95KuGQLa0gK375';       // e.g. 'abc123XYZ'
  var EMAILJS_SERVICE_ID    = 'service_5evtjim';       // e.g. 'service_avartanam'
  var EMAILJS_TEMPLATE_CONTACT  = 'template_tdcdtb8';   // Contact form template
  var EMAILJS_TEMPLATE_QUOTE    = 'template_tdcdtb8';     // Quote/request form template
  var EMAILJS_TEMPLATE_BROCHURE = 'template_tdcdtb8';  // Brochure download template
  var EMAILJS_TEMPLATE_BUY      = 'template_tdcdtb8';       // Buy/product inquiry template
  /* ─────────────────────────────────────────────────────── */

  /* ── INIT ─────────────────────────────────────────────── */
  function init() {
    if (!window.emailjs) {
      console.warn('[ATL EmailJS] emailjs not loaded — check script order in HTML.');
      return;
    }
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    wireContactForm();
    wireQuoteForm();
    wireBroForm();
    wireBuyForm();
  }

  /* ── HELPER: get field value safely ──────────────────── */
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  /* ── HELPER: set button loading/reset state ──────────── */
  function setBtnState(btn, state, originalText) {
    if (!btn) return;
    if (state === 'loading') {
      btn.disabled = true;
      btn.setAttribute('data-orig', btn.textContent);
      btn.textContent = 'Sending…';
    } else if (state === 'reset') {
      btn.disabled = false;
      btn.textContent = originalText || btn.getAttribute('data-orig') || 'Submit';
    } else if (state === 'error') {
      btn.disabled = false;
      btn.textContent = 'Try Again';
    }
  }

  /* ── HELPER: show error toast (reuses existing showToast if available) */
  function showErrorMsg(message) {
    if (typeof showToast === 'function') {
      showToast('Send Failed', message || 'Please try again or email us directly.');
      return;
    }
    alert('Could not send message. Please try again or email info@avartanamlabs.com');
  }

  /* ================================================================
     1. CONTACT FORM — #atlContactForm (index.html)
        Replaces the fake setTimeout submit with real EmailJS send.
        Success flow (cuThankModal) is unchanged.
  ================================================================ */
  function wireContactForm() {
    var form = document.getElementById('atlContactForm');
    if (!form) return;

    /* Remove existing submit listeners by cloning the form element */
    var newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    form = newForm;

    /* Re-wire the real-time validation that was on the original form */
    var FIELDS = [
      { id: 'cuFirst',   errId: 'cuErrFirst',   type: 'required' },
      { id: 'cuLast',    errId: 'cuErrLast',    type: 'required' },
      { id: 'cuEmail',   errId: 'cuErrEmail',   type: 'email'    },
      { id: 'cuPhone',   errId: 'cuErrPhone',   type: 'phone'    },
      { id: 'cuService', errId: 'cuErrService', type: 'required' },
      { id: 'cuCompany', errId: 'cuErrCompany', type: 'required' },
    ];

    function chk(field) {
      var el  = document.getElementById(field.id);
      var err = document.getElementById(field.errId);
      if (!el) return true;
      var v = el.value.trim();
      var valid = true;
      if (field.type === 'required') valid = v.length > 0;
      else if (field.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      else if (field.type === 'phone') {
        var d = v.replace(/[\s\-\(\)\+]/g, '');
        if (d.length === 12 && d.slice(0,2) === '91') d = d.slice(2);
        valid = /^\d{10}$/.test(d);
      }
      el.classList.toggle('cu-bad', !valid);
      if (err) err.style.display = valid ? 'none' : 'block';
      return valid;
    }

    FIELDS.forEach(function (f) {
      var el = document.getElementById(f.id);
      if (el) el.addEventListener('input', function () { chk(f); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var ok = true;
      FIELDS.forEach(function (f) { if (!chk(f)) ok = false; });
      if (!ok) return;

      var btn = document.getElementById('cuSubmitBtn');
      setBtnState(btn, 'loading');

      var templateParams = {
        form_type:    'Contact Form',
        from_name:    val('cuFirst') + ' ' + val('cuLast'),
        from_email:   val('cuEmail'),
        phone:        val('cuPhone'),
        service:      val('cuService'),
        company:      val('cuCompany'),
        message:      val('cuDetails') || '(no additional details)',
        page_url:     window.location.href,
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CONTACT, templateParams)
        .then(function () {
          form.reset();
          FIELDS.forEach(function (f) {
            var el = document.getElementById(f.id);
            if (el) el.classList.remove('cu-bad');
          });
          setBtnState(btn, 'reset', 'SUBMIT REQUEST');

          /* Show existing thank-you modal — untouched */
          var modal = document.getElementById('cuThankModal');
          if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
          }
        })
        .catch(function (err) {
          console.error('[ATL EmailJS] Contact form error:', err);
          setBtnState(btn, 'error');
          showErrorMsg();
        });
    });
  }

  /* ================================================================
     2. QUOTE FORM — #quoteForm (all service pages + shared form)
        Replaces the fake hide-form-show-success with real EmailJS send.
        Success state (#quoteSuccess) is unchanged.
  ================================================================ */
  function wireQuoteForm() {
    var form = document.getElementById('quoteForm');
    if (!form) return;

    var newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    form = newForm;

    /* Validation mirrors service-page.js validateField */
    function validateField(id, errId, type) {
      var el  = document.getElementById(id);
      var err = document.getElementById(errId);
      if (!el) return true;
      var v = el.value.trim();
      var valid = true;
      if (type === 'required') valid = v.length > 0;
      else if (type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      else if (type === 'phone') {
        var d = v.replace(/[\s\-\(\)\+]/g, '');
        if (d.length === 12 && d.slice(0,2) === '91') d = d.slice(2);
        valid = /^\d{10}$/.test(d);
      }
      if (el) el.classList.toggle('err', !valid);
      if (err) err.classList.toggle('show', !valid);
      return valid;
    }

    /* Re-wire live validation */
    ['qfFirst','qfLast','qfEmail','qfPhone','qfCompany'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { el.classList.remove('err'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      if (!validateField('qfFirst',   'errFirst',   'required')) ok = false;
      if (!validateField('qfLast',    'errLast',    'required')) ok = false;
      if (!validateField('qfEmail',   'errEmail',   'email'))    ok = false;
      if (!validateField('qfPhone',   'errPhone',   'phone'))    ok = false;
      if (!validateField('qfCompany', 'errCompany', 'required')) ok = false;
      if (!ok) return;

      var submit = document.getElementById('quoteSubmit');
      setBtnState(submit, 'loading');

      /* Get service name from the pill (set by service page) */
      var serviceNameEl = document.getElementById('quoteServiceName');
      var serviceName = serviceNameEl ? serviceNameEl.textContent.trim() : window.__PAGE_SERVICE_NAME || document.title;

      var templateParams = {
        form_type:    'Quote Request',
        from_name:    val('qfFirst') + ' ' + val('qfLast'),
        from_email:   val('qfEmail'),
        phone:        val('qfPhone'),
        company:      val('qfCompany'),
        request_type: val('qfType') || 'Not specified',
        quantity:     val('qfQty')  || 'Not specified',
        message:      val('qfDetails') || '(no additional details)',
        service_name: serviceName,
        page_url:     window.location.href,
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_QUOTE, templateParams)
        .then(function () {
          /* Show existing success state — untouched */
          form.style.display = 'none';
          var succ = document.getElementById('quoteSuccess');
          if (succ) succ.classList.add('show');
          setBtnState(submit, 'reset', 'Submit Request');
        })
        .catch(function (err) {
          console.error('[ATL EmailJS] Quote form error:', err);
          setBtnState(submit, 'error');
          showErrorMsg();
        });
    });
  }

  /* ================================================================
     3. BROCHURE FORM — #broForm (all pages)
        Replaces the fake setTimeout with real EmailJS send.
        Auto-download, success state, and auto-close are all preserved.
  ================================================================ */
  function wireBroForm() {
    var form = document.getElementById('broForm');
    if (!form) return;

    /* We do NOT clone broForm here — the existing brochure code
       in atl-merged.js already manages auto-download and modal reset.
       Instead we intercept at the emailjs.send level by patching
       the submit — we listen BEFORE the existing handler fires,
       and we call emailjs.send in parallel so the existing UX flow
       (show success → download → close) runs exactly as before,
       and the email send happens alongside it.                       */

    form.addEventListener('submit', function (e) {
      /* Note: we don't preventDefault here — the existing handler
         already does that and controls the UX flow.
         We just collect data and fire the email send in parallel.   */

      var broDialEl = document.getElementById('broDialCode');
      var dialCode  = broDialEl ? broDialEl.value : '+91';

      var templateParams = {
        form_type:     'Brochure Download',
        from_name:     val('broFirst') + ' ' + val('broLast'),
        from_email:    val('broEmail'),
        phone:         dialCode + ' ' + val('broPhone'),
        country:       val('broCountry'),
        company:       val('broCompany'),
        industry:      val('broIndustry'),
        job_title:     val('broJobTitle'),
        document_name: (function () {
          /* Try to get the brochure name from the button/dropdown context */
          var pill = document.querySelector('.bro-modal__title');
          return pill ? pill.textContent.trim() : 'Brochure';
        }()),
        page_url:      window.location.href,
      };

      /* Fire-and-forget — UX handled by existing code */
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_BROCHURE, templateParams)
        .catch(function (err) {
          console.error('[ATL EmailJS] Brochure form error:', err);
          /* Silent fail — user already sees success state from existing handler */
        });
    }, true); /* useCapture:true so we run before existing handler */
  }

  /* ================================================================
     4. BUY / PRODUCT INQUIRY MODAL — #buyForm (index.html)
        Replaces the fake setTimeout with real EmailJS send.
        Success state (#buySuccess) and modal auto-close are preserved.
  ================================================================ */
  function wireBuyForm() {
    var form = document.getElementById('buyForm');
    if (!form) return;

    var newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    form = newForm;

    function validateBuyField(el) {
      if (!el) return true;
      var v = el.value.trim();
      var bad = false;
      if (el.type === 'email') {
        bad = !v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      } else if (el.type === 'tel') {
        var d = v.replace(/[\s\-\(\)\+]/g, '');
        if (d.length === 12 && d.slice(0,2) === '91') d = d.slice(2);
        if (d.length === 11 && d.slice(0,1) === '0')  d = d.slice(1);
        bad = !v || !/^\d{10}$/.test(d);
      } else {
        bad = !v;
      }
      el.classList.toggle('is-invalid', bad);
      var errEl = el.parentElement ? el.parentElement.querySelector('.cu-err') : null;
      if (errEl) errEl.style.display = bad ? 'block' : 'none';
      return !bad;
    }

    /* Re-wire live clear */
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('is-invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var reqs = form.querySelectorAll('[required], #fPhone');
      var ok = true;
      reqs.forEach(function (el) { if (!validateBuyField(el)) ok = false; });
      if (!ok) return;

      var sub = document.getElementById('buySubmit');
      var suc = document.getElementById('buySuccess');
      setBtnState(sub, 'loading');

      /* Get product name from modal heading if available */
      var productNameEl = document.querySelector('#buyModal .atl-modal__title, #buyModal h5, #buyModal h4');
      var productName = productNameEl ? productNameEl.textContent.trim() : 'Product Inquiry';

      var templateParams = {
        form_type:    'Product Buy Inquiry',
        from_name:    val('fFirst') + ' ' + val('fLast'),
        from_email:   val('fEmail'),
        phone:        val('fPhone'),
        company:      val('fCompany'),
        request_type: val('fType') || 'Not specified',
        message:      val('fDetails') || '(no additional details)',
        product_name: productName,
        page_url:     window.location.href,
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_BUY, templateParams)
        .then(function () {
          form.reset();
          reqs.forEach(function (el) { el.classList.remove('is-invalid'); });
          setBtnState(sub, 'reset', 'Submit Request');

          /* Show existing success state + auto-close — untouched */
          if (suc) suc.classList.add('show');
          setTimeout(function () {
            if (suc) suc.classList.remove('show');
            /* Close Bootstrap modal */
            var modalEl = document.getElementById('buyModal');
            if (modalEl && window.bootstrap) {
              var bsModal = bootstrap.Modal.getInstance(modalEl);
              if (bsModal) bsModal.hide();
            }
          }, 3200);
        })
        .catch(function (err) {
          console.error('[ATL EmailJS] Buy form error:', err);
          setBtnState(sub, 'error');
          showErrorMsg();
        });
    });
  }

  /* ── BOOT ─────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();