/* ================================================================
   js/pages/coming-soon.js — Avartanam Test Labs
   Purpose: JS for coming-soon.html. Covers: countdown timer to launch date, live DD:HH:MM:SS display.
            Page-specific JavaScript only — do not include elsewhere.
================================================================ */

/* ── Countdown to a launch date (90 days from now) ── */
  (function() {
    var launch = new Date();
    launch.setDate(launch.getDate() + 90);

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function tick() {
      var now  = new Date();
      var diff = Math.max(0, launch - now);
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000)  / 60000);
      var s = Math.floor((diff % 60000)    / 1000);
      document.getElementById('csD').textContent = pad(d);
      document.getElementById('csH').textContent = pad(h);
      document.getElementById('csM').textContent = pad(m);
      document.getElementById('csS').textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ── Notify form ── */
  function csNotify() {
    var email = document.getElementById('csEmail').value.trim();
    if (!email || !email.includes('@')) {
      document.getElementById('csEmail').style.borderColor = '#f87171';
      return;
    }
    document.getElementById('csNotifyForm').style.display = 'none';
    document.getElementById('csSuccess').style.display    = 'block';
  }