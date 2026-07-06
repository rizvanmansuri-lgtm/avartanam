/* ================================================================
   js/pages/consultancy.js — Avartanam Test Labs
   Purpose: JS for consultancy.html. Covers: gallery data override (sets page-specific image slides before service-page.js runs).
            Page-specific JavaScript only — do not include elsewhere.
================================================================ */

// Override gallery data before service-page.js loads
    window.__PAGE_IMAGE_SLIDES = [
      { src: "images/services/consultancy/consultancy-0.jpg", alt: "Certification Consultancy" },
    { src: "images/services/consultancy/consultancy-1.jpg", alt: "WPC BIS Advisory" },
    { src: "images/services/consultancy/consultancy-2.jpg", alt: "Regulatory Guidance" },
    { src: "images/services/consultancy/consultancy-3.jpg", alt: "Product Certification" }
    ];
    window.__PAGE_VIDEO_EMBED = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0";