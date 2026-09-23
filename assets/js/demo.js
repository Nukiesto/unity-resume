(function () {
  'use strict';

  var stage = document.getElementById('demoStage');
  var warn = document.getElementById('demoWarn');
  if (!stage) return;

  function gzipSupported() {
    if (typeof DecompressionStream !== 'function') return false;
    try { return !!new DecompressionStream('gzip'); } catch (e) { return false; }
  }

  function showWarn(text) {
    if (!warn) return;
    warn.textContent = text;
    warn.classList.add('show');
  }

  if (!gzipSupported()) {
    showWarn('Ваш браузер может не поддерживать потоковую распаковку gzip. Если демо не запустится — откройте его в Chrome 80+, Edge, Firefox 113+ или Safari 16.4+.');
  }

  var launched = false;
  function launch() {
    if (launched) return;
    launched = true;

    stage.innerHTML = '' +
      '<div class="demo-loading">' +
        '<div class="spinner"></div>' +
        '<div style="font-size:14px;color:var(--text-soft)">Загружаем SurvMine…</div>' +
        '<div class="demo-bar"><i id="demoBarFill"></i></div>' +
        '<div style="font-size:12.5px;color:var(--muted)">Распаковка движка может занять до минуты</div>' +
      '</div>';

    var bar = document.getElementById('demoBarFill');
    var p = 0;
    var timer = setInterval(function () {
      p = Math.min(92, p + Math.random() * 9);
      if (bar) bar.style.width = p + '%';
    }, 420);

    var frame = document.createElement('iframe');
    frame.className = 'demo-frame';
    frame.title = 'SurvMine WebGL демо';
    frame.allow = 'fullscreen; gamepad; autoplay';
    frame.setAttribute('allowfullscreen', '');
    frame.src = 'demo/survmine/index.html';

    frame.addEventListener('load', function () {
      clearInterval(timer);
      if (bar) bar.style.width = '100%';
      setTimeout(function () {
        stage.innerHTML = '';
        stage.appendChild(frame);
        stage.style.padding = '0';
      }, 260);
    });

    setTimeout(function () {
      if (stage.querySelector('.demo-loading') && frame.parentNode !== stage) {
        clearInterval(timer);
        stage.innerHTML = '';
        stage.appendChild(frame);
        stage.style.padding = '0';
      }
    }, 30000);
  }

  ['demoStart', 'demoStart2'].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', launch);
  });
})();
