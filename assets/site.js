(function () {
  var C = window.SHAMIL || {};
  var D = C.downloads || {};
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  $$('[data-v]').forEach(function (e) { e.textContent = C.version; });
  $$('[data-rel]').forEach(function (e) { e.textContent = C.released; });
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
  $$('[data-note]').forEach(function (e) {
    var d = D[e.dataset.note]; if (d) e.textContent = d.note + ' · ' + d.size;
  });
  $$('[data-dl]').forEach(function (a) {
    var d = D[a.dataset.dl]; if (!d) return;
    a.href = d.url; a.setAttribute('download', d.file);
    if (a.classList.contains('link') && !a.textContent) a.textContent = d.file + (d.size ? ' (' + d.size + ')' : '');
  });
  if (C.contactEmail) {
    $$('[data-contact]').forEach(function (e) { e.innerHTML = ' · <a href="mailto:' + C.contactEmail + '">' + C.contactEmail + '</a>'; });
  }

  // Suggest the right button for this visitor
  var isWin = /Windows/i.test(navigator.userAgent);
  if (isWin) $$('.hero .dl').forEach(function (a) {
    a.classList.toggle('gold', a.dataset.dl === 'windows');
    a.classList.toggle('glassbtn', a.dataset.dl !== 'windows');
    if (a.dataset.dl === 'windows') a.parentNode.insertBefore(a, a.parentNode.firstChild);
  });

  // Checksums
  var sums = document.getElementById('sums');
  ['mac', 'windows', 'windowsZip'].forEach(function (k) {
    var d = D[k]; if (!d) return;
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + d.file + '</td><td><code>' + d.sha256 + '</code></td><td><button class="copy">Copy</button></td>';
    tr.querySelector('button').onclick = function (ev) {
      try { navigator.clipboard.writeText(d.sha256); ev.target.textContent = 'Copied'; } catch (e) {}
      setTimeout(function () { ev.target.textContent = 'Copy'; }, 1500);
    };
    sums.appendChild(tr);
  });

  // Install tabs
  $$('[data-tab]').forEach(function (b) {
    b.onclick = function () {
      $$('[data-tab]').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      $$('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== b.dataset.tab; });
    };
  });
  if (isWin) document.querySelector('[data-tab="win"]').click();

  // Tutorial video
  if (C.tutorialVideo) {
    var s = document.getElementById('tutorial'); s.hidden = false;
    s.querySelector('video').src = C.tutorialVideo;
  }

  // Lightbox
  var lb = document.querySelector('.lightbox');
  $$('figure img').forEach(function (img) {
    img.onclick = function () { lb.querySelector('img').src = img.src; lb.hidden = false; };
  });
  lb.onclick = function () { lb.hidden = true; };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.hidden = true; });

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$('.sec, .strip').forEach(function (s) { s.classList.add('rv'); io.observe(s); });
  }
})();
