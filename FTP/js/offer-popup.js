/* Offer popup – shows on page load, once per browser session.
   Edit CONFIG below to change image, link, delay or expiry. */
(function () {
  var CONFIG = {
    image: 'images/diwali-offer-202611051017.jpg',
    link: 'https://wa.me/916358365151?text=' + encodeURIComponent('Hi, I want to book Antenna Gain & Measurement service with the Diwali 30% offer.'),
    alt: 'Diwali Special Offer – 30% off Antenna Gain & Measurement Service',
    delay: 1000,                 // ms after page load
    expires: '2026-11-30T23:59:59+05:30', // offer stops showing after this
    storageKey: 'atlOfferPopupSeen'
  };

  if (new Date() > new Date(CONFIG.expires)) return;
  try { if (sessionStorage.getItem(CONFIG.storageKey)) return; } catch (e) {}

  var lastFocus;
  var el = document.createElement('div');
  el.className = 'offer-popup';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Special offer');
  el.innerHTML =
    '<div class="offer-popup__box">' +
      '<button type="button" class="offer-popup__close" aria-label="Close offer">&times;</button>' +
      '<a class="offer-popup__link" href="' + CONFIG.link + '" target="_blank" rel="noopener">' +
        '<img class="offer-popup__img" src="' + CONFIG.image + '" alt="' + CONFIG.alt + '">' +
      '</a>' +
    '</div>';

  function close() {
    el.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    try { sessionStorage.setItem(CONFIG.storageKey, '1'); } catch (e) {}
    setTimeout(function () { el.remove(); }, 350);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  function open() {
    lastFocus = document.activeElement;
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { el.classList.add('is-open'); });
    el.querySelector('.offer-popup__close').focus();
    document.addEventListener('keydown', onKey);
  }

  el.addEventListener('click', function (e) {
    if (e.target === el || e.target.closest('.offer-popup__close')) close();
  });

  window.addEventListener('load', function () { setTimeout(open, CONFIG.delay); });
})();
