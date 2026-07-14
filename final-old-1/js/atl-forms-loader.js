/* ═══════════════════════════════════════════════════════════
   atl-forms-loader.js — Avartanam Test Labs
   Dynamically loads shared forms (atl-forms.html) into every page.
   Also patches quoteServiceName from page-specific data attribute.
═══════════════════════════════════════════════════════════ */
(function() {
  // Depth-aware root path: pages in /products/ need ../
  var scripts = document.querySelectorAll('script[src]');
  var loaderSrc = '';
  scripts.forEach(function(s) {
    if (s.src && s.src.indexOf('atl-forms-loader') !== -1) loaderSrc = s.src;
  });
  var base = loaderSrc ? loaderSrc.replace(/js\/atl-forms-loader\.js.*/, '') : '';

  function injectForms(html) {
    var container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    // Set quote service name if page defines window.__PAGE_SERVICE_NAME
    if (window.__PAGE_SERVICE_NAME) {
      var pill = document.getElementById('quoteServiceName');
      if (pill) pill.textContent = window.__PAGE_SERVICE_NAME;
    }

    // Dispatch event so atl-merged.js can wire up form events
    document.dispatchEvent(new CustomEvent('atlFormsReady'));
  }

  // Skip if forms already in page (pages with inline forms)
  if (document.getElementById('quoteOverlay') && document.getElementById('broOverlay')) {
    // Already embedded inline — just dispatch ready
    document.dispatchEvent(new CustomEvent('atlFormsReady'));
    return;
  }

  fetch(base + 'atl-forms.html')
    .then(function(r) { return r.text(); })
    .then(injectForms)
    .catch(function() {
      // Fallback: forms already embedded or fetch failed silently
    });
})();
