/* ================================================================
   atl-emailjs.js — Avartanam Test Labs
   EmailJS integration for all 4 forms:
     1. Contact Form        (#atlContactForm)   — index.html
     2. Quote/Request Form  (#quoteForm)        — all service pages
     3. Brochure Form       (#broForm)          — all pages
     4. Buy/Product Modal   (#buyForm)          — index.html

   ⚠ FREE-PLAN SETUP (2 templates total, shared by all 4 forms):
   ─────────────────────────────────────────────────────────────
   Every form now sends TWO emails per submission, using the SAME
   two templates every time:
     · EMAILJS_TEMPLATE_ADMIN → notifies YOU  (fixed "To Email")
     · EMAILJS_TEMPLATE_USER  → auto-replies to the VISITOR
                                 ("To Email" = {{from_email}})

   Because one template now has to work for 4 different forms with
   different fields, all form-specific fields (service, quantity,
   brochure name, product name, etc.) are collapsed into a single
   {{details}} text block. Both templates only ever need these
   variables:

       {{form_type}}   {{from_name}}   {{from_email}}
       {{phone}}       {{details}}     {{page_url}}

   HOW TO CONFIGURE:
   ─────────────────
   1. Fill in the 4 placeholder values below (public key, service id,
      and the 2 template IDs).
   2. In the EmailJS dashboard, build exactly 2 templates:

      Template "Admin Notification" (EMAILJS_TEMPLATE_ADMIN)
        · To Email   : your fixed inbox, e.g. info@avartanamlabs.com
        · Reply To   : {{from_email}}
        · Subject    : New {{form_type}} — {{from_name}}
        · Body       : {{from_name}} / {{from_email}} / {{phone}}
                        {{details}}
                        Page: {{page_url}}

      Template "User Auto-Reply" (EMAILJS_TEMPLATE_USER)
        · To Email   : {{from_email}}
        · Reply To   : your fixed inbox (so replies land with you)
        · Subject    : Thanks for contacting Avartanam Test Labs
        · Body       : Hi {{from_name}}, thanks for your {{form_type}}.
                        We received the following details:
                        {{details}}
                        We'll be in touch shortly.

   That's it — no matter which of the 4 forms fires, both templates
   just render whatever text is in {{details}}.
================================================================ */

(function () {
  'use strict';

  /* ── ① CONFIGURE THESE VALUES ─────────────────────────── */
  var EMAILJS_PUBLIC_KEY   = 'KMVN3y1GgWGZ1f-k-';   // Account → API Keys → Public Key
  var EMAILJS_SERVICE_ID   = 'service_jxnr95d';     // Email Services → Service ID
  var EMAILJS_TEMPLATE_ADMIN = 'template_l8remxm';  // "Admin Notification" template ID
  var EMAILJS_TEMPLATE_USER  = 'template_bwi3tbj'; // "User Auto-Reply" template ID
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

  /* ── HELPER: collapse form-specific fields into one text block ──
     pairs = [ ['Label', value], ['Label', value], ... ]
     Blank/undefined values are skipped so the template stays clean. */
  function buildDetails(pairs) {
    return pairs
      .filter(function (p) { return p[1] !== undefined && p[1] !== null && String(p[1]).trim() !== ''; })
      .map(function (p) { return p[0] + ': ' + p[1]; })
      .join('\n');
  }

  /* ── HELPER: fire BOTH shared templates (admin + user) for one submit ──
     Resolves only when both sends succeed; rejects if either fails. */
  function sendDual(templateParams) {
    return Promise.all([
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ADMIN, templateParams),
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_USER, templateParams)
    ]);
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
        form_type:  'Contact Form',
        from_name:  val('cuFirst') + ' ' + val('cuLast'),
        from_email: val('cuEmail'),
        phone:      val('cuPhone'),
        page_url:   window.location.href,
        details: buildDetails([
          ['Service',  val('cuService')],
          ['Company',  val('cuCompany')],
          ['Message',  val('cuDetails') || '(no additional details)']
        ])
      };

      sendDual(templateParams)
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
        form_type:  'Quote Request',
        from_name:  val('qfFirst') + ' ' + val('qfLast'),
        from_email: val('qfEmail'),
        phone:      val('qfPhone'),
        page_url:   window.location.href,
        details: buildDetails([
          ['Company',       val('qfCompany')],
          ['Service',       serviceName],
          ['Request Type',  val('qfType') || 'Not specified'],
          ['Quantity',      val('qfQty')  || 'Not specified'],
          ['Message',       val('qfDetails') || '(no additional details)']
        ])
      };

      sendDual(templateParams)
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

      var documentName = (function () {
        /* Try to get the brochure name from the button/dropdown context */
        var pill = document.querySelector('.bro-modal__title');
        return pill ? pill.textContent.trim() : 'Brochure';
      }());

      var templateParams = {
        form_type:  'Brochure Download',
        from_name:  val('broFirst') + ' ' + val('broLast'),
        from_email: val('broEmail'),
        phone:      dialCode + ' ' + val('broPhone'),
        page_url:   window.location.href,
        details: buildDetails([
          ['Document',    documentName],
          ['Country',     val('broCountry')],
          ['Company',     val('broCompany')],
          ['Industry',    val('broIndustry')],
          ['Job Title',   val('broJobTitle')]
        ])
      };

      /* Fire-and-forget — UX handled by existing code */
      sendDual(templateParams)
        .catch(function (err) {
          console.error('[ATL EmailJS] Brochure form error:', err);
          /* Silent fail — user already sees success state from existing handler */
        });
    }, true); /* useCapture:true so we run before existing handler */
  }

  /* ================================================================
     4. BUY / PRODUCT INQUIRY MODAL — #buyForm (index.html)
        Replaces the fake setTimeout with real EmailJS send.
        Success state (#buyThankYou) and modal auto-close are preserved.
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
      /* Error note sits in a sibling .rq-err, e.g. #errEmail / #errPhone */
      var errEl = el.parentElement ? el.parentElement.querySelector('.rq-err') : null;
      if (errEl) errEl.style.display = bad ? 'block' : 'none';
      return !bad;
    }

    /* Re-wire live clear */
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        el.classList.remove('is-invalid');
        var errEl = el.parentElement ? el.parentElement.querySelector('.rq-err') : null;
        if (errEl) errEl.style.display = 'none';
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var reqs = form.querySelectorAll('[required], #fPhone');
      var ok = true;
      reqs.forEach(function (el) { if (!validateBuyField(el)) ok = false; });
      if (!ok) return;

      var sub = document.getElementById('buySubmit');
      setBtnState(sub, 'loading');

      /* Real product name lives in the modal chip, not a heading */
      var productNameEl = document.getElementById('mProductName');
      var productName = productNameEl ? productNameEl.textContent.trim() : 'Product Inquiry';

      var templateParams = {
        form_type:  'Product Buy Inquiry',
        from_name:  val('fFirst') + ' ' + val('fLast'),
        from_email: val('fEmail'),
        phone:      val('fPhone'),
        page_url:   window.location.href,
        details: buildDetails([
          ['Product',       productName],
          ['Company',       val('fCompany')],
          ['Request Type',  val('fRequestType') || 'Not specified'],
          ['Quantity',      val('fQty') || 'Not specified'],
          ['Message',       val('fDetails') || '(no additional details)']
        ])
      };

      sendDual(templateParams)
        .then(function () {
          form.reset();
          reqs.forEach(function (el) { el.classList.remove('is-invalid'); });
          setBtnState(sub, 'reset', 'Submit Request');

          /* Swap the form panel for the existing thank-you panel */
          var panel = document.getElementById('buyFormPanel');
          var thanks = document.getElementById('buyThankYou');
          if (panel) panel.style.display = 'none';
          if (thanks) thanks.style.display = 'block';

          setTimeout(function () {
            /* Reset panels back for next time the modal opens */
            if (panel) panel.style.display = '';
            if (thanks) thanks.style.display = 'none';
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