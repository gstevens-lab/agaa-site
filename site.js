// Mobile nav
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();

function money(n) {
  if (!isFinite(n)) n = 0;
  return '$' + Math.round(n).toLocaleString('en-US');
}
function num(id) {
  var el = document.getElementById(id);
  var v = el ? parseFloat(String(el.value).replace(/[^0-9.\-]/g, '')) : 0;
  return isFinite(v) ? v : 0;
}
function setText(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

// CD vs MYGA calculator
(function () {
  var form = document.getElementById('cd-calc');
  if (!form) return;
  function calc() {
    var amt = num('cd-amount');
    var cd = num('cd-rate') / 100;
    var mg = num('myga-rate') / 100;
    var yrs = Math.max(1, Math.min(10, Math.round(num('cd-years'))));
    var tax = num('cd-tax') / 100;

    // CD: interest taxed each year, so it compounds at the after-tax rate
    var cdAfterTax = amt * Math.pow(1 + cd * (1 - tax), yrs);
    // MYGA: tax-deferred growth, taxed once on the gain at the end
    var mgPreTax = amt * Math.pow(1 + mg, yrs);
    var mgAfterTax = amt + (mgPreTax - amt) * (1 - tax);

    setText('r-cd', money(cdAfterTax));
    setText('r-myga', money(mgAfterTax));
    setText('r-myga-pre', money(mgPreTax));
    var diff = mgAfterTax - cdAfterTax;
    setText('r-diff', (diff >= 0 ? '+' : '−') + money(Math.abs(diff)));
    setText('r-years', yrs + (yrs === 1 ? ' year' : ' years'));
  }
  form.addEventListener('input', calc);
  calc();
})();

// Income gap calculator
(function () {
  var form = document.getElementById('gap-calc');
  if (!form) return;
  function calc() {
    var need = num('g-need');
    var ss = num('g-ss') + num('g-ss2');
    var pension = num('g-pension');
    var other = num('g-other');
    var yrs = Math.max(1, num('g-years'));
    var have = ss + pension + other;
    var gap = Math.max(0, need - have);
    setText('r-have', money(have) + '/mo');
    setText('r-gap', money(gap));
    setText('r-gap-yr', money(gap * 12) + '/yr');
    setText('r-gap-total', money(gap * 12 * yrs));
    setText('r-gap-years', yrs + ' years');
    var pct = need > 0 ? Math.round((have / need) * 100) : 0;
    setText('r-covered', Math.min(pct, 100) + '%');
    var msg = document.getElementById('r-msg');
    if (msg) {
      msg.textContent = gap > 0
        ? 'Your guaranteed income covers about ' + Math.min(pct, 100) + '% of what you need. The rest has to come from savings each month, through good markets and bad.'
        : 'Your guaranteed income covers your monthly needs. Your savings can be used for growth, emergencies and the things you want to do.';
    }
  }
  form.addEventListener('input', calc);
  calc();
})();
