/**
 * ══════════════════════════════════════════════════════════════════
 *  AVARTANAM TEST LABS — DOCUMENT LINKS CONFIG
 *  ─────────────────────────────────────────────────────────────────
 *  Replace the URL strings below with your actual hosted file links
 *  (Google Drive, Dropbox, AWS S3, your server, etc.)
 *
 *  After updating a link here, it automatically updates EVERYWHERE
 *  on the website — nav dropdown, mobile nav, brochure cards, footer.
 *
 *  HOW TO UPDATE:
 *    1. Host your file (Google Drive → Share → "Anyone with link" →
 *       copy the direct download URL)
 *    2. Replace the placeholder string below with your real URL
 *    3. Save and upload this file. Done.
 * ══════════════════════════════════════════════════════════════════
 */

window.ATL_DOCS = {

  /* ── Brochures ────────────────────────────────────────────────── */
  COMPANY_PROFILE_BROCHURE:   'https://REPLACE_LINK_COMPANY_PROFILE_BROCHURE.pdf',
  RF_TESTING_BROCHURE:        'https://REPLACE_LINK_RF_TESTING_BROCHURE.pdf',
  EMI_EMC_BROCHURE:           'https://REPLACE_LINK_EMI_EMC_BROCHURE.pdf',
  PRODUCT_CATALOG_AFL:        'https://REPLACE_LINK_PRODUCT_CATALOG_AFL.pdf',

  /* ── Certificates ─────────────────────────────────────────────── */
  NABL_CERT:                  'https://REPLACE_LINK_NABL_ACCREDITATION_CERT.pdf',
  BIS_CERT:                   'https://REPLACE_LINK_BIS_RECOGNITION_CERT.pdf',
  WPC_CERT:                   'https://REPLACE_LINK_WPC_RECOGNITION_CERT.pdf',
  ISO17025_CERT:              'https://REPLACE_LINK_ISO17025_CERT.pdf',
  SCOPE_OF_ACCREDITATION:     'https://REPLACE_LINK_SCOPE_OF_ACCREDITATION.pdf',

  /* ── Case Studies ─────────────────────────────────────────────── */
  CASE_STUDY_IOT:             'https://REPLACE_LINK_CASE_STUDY_IOT.pdf',
  CASE_STUDY_WPC:             'https://REPLACE_LINK_CASE_STUDY_WPC.pdf',
  CASE_STUDY_EMI:             'https://REPLACE_LINK_CASE_STUDY_EMI.pdf',
  CASE_STUDY_ANTENNA_DESIGN:  'https://REPLACE_LINK_CASE_STUDY_ANTENNA_DESIGN.pdf',
  CASE_STUDY_PCB_REVIEW:      'https://REPLACE_LINK_CASE_STUDY_PCB_REVIEW.pdf',

};

/* ──────────────────────────────────────────────────────────────────
   AUTO-PATCHER: replaces all placeholder hrefs on the page with
   real links from ATL_DOCS. Runs once on DOMContentLoaded.
   You do NOT need to touch this code.
────────────────────────────────────────────────────────────────── */
(function () {
  var MAP = {
    'REPLACE_LINK_COMPANY_PROFILE_BROCHURE.pdf':  window.ATL_DOCS.COMPANY_PROFILE_BROCHURE,
    'REPLACE_LINK_RF_TESTING_BROCHURE.pdf':       window.ATL_DOCS.RF_TESTING_BROCHURE,
    'REPLACE_LINK_EMI_EMC_BROCHURE.pdf':          window.ATL_DOCS.EMI_EMC_BROCHURE,
    'REPLACE_LINK_PRODUCT_CATALOG_AFL.pdf':       window.ATL_DOCS.PRODUCT_CATALOG_AFL,
    'REPLACE_LINK_NABL_ACCREDITATION_CERT.pdf':   window.ATL_DOCS.NABL_CERT,
    'REPLACE_LINK_BIS_RECOGNITION_CERT.pdf':      window.ATL_DOCS.BIS_CERT,
    'REPLACE_LINK_WPC_RECOGNITION_CERT.pdf':      window.ATL_DOCS.WPC_CERT,
    'REPLACE_LINK_ISO17025_CERT.pdf':             window.ATL_DOCS.ISO17025_CERT,
    'REPLACE_LINK_SCOPE_OF_ACCREDITATION.pdf':    window.ATL_DOCS.SCOPE_OF_ACCREDITATION,
    'REPLACE_LINK_CASE_STUDY_IOT.pdf':            window.ATL_DOCS.CASE_STUDY_IOT,
    'REPLACE_LINK_CASE_STUDY_WPC.pdf':            window.ATL_DOCS.CASE_STUDY_WPC,
    'REPLACE_LINK_CASE_STUDY_EMI.pdf':            window.ATL_DOCS.CASE_STUDY_EMI,
    'REPLACE_LINK_CASE_STUDY_ANTENNA_DESIGN.pdf': window.ATL_DOCS.CASE_STUDY_ANTENNA_DESIGN,
    'REPLACE_LINK_CASE_STUDY_PCB_REVIEW.pdf':     window.ATL_DOCS.CASE_STUDY_PCB_REVIEW,
  };

  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('a[href]');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      for (var placeholder in MAP) {
        if (href && href.indexOf(placeholder) !== -1) {
          a.setAttribute('href', MAP[placeholder]);
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          break;
        }
      }
    });
  });
})();
