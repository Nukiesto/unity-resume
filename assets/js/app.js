(function () {
  'use strict';

  var CATEGORY_LABEL = {
    games: 'Игра',
    vr: 'VR / XR',
    sdk: 'SDK',
    tools: 'Инструмент',
    backend: 'Бэкенд',
    apps: 'Приложение',
    archive: 'Архив'
  };

  var STATUS_CLASS = {
    'Готовый продукт': 'green',
    'В эксплуатации': 'green',
    'В разработке': 'accent',
    'Прототип': 'amber',
    'Тестовый проект': 'violet',
    'Архив': 'slate'
  };

  var state = { filter: 'all', query: '', projects: [], featured: [] };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function loadJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Не удалось загрузить ' + url + ' (' + r.status + ')');
      return r.json();
    });
  }

  /* ---------------- profile ---------------- */

  function renderProfile(p) {
    document.title = p.name + ' — ' + p.role;
    $('#brandName').textContent = p.name;
    $('#brandRole').textContent = p.role;
    $('#heroName').textContent = p.name;
    $('#heroRole').textContent = p.role;
    $('#heroTagline').textContent = p.tagline;
    $('#aboutSummary').textContent = p.summary;
    if (p.availability) $('#heroAvailability').textContent = p.availability;

    $('#stats').innerHTML = (p.stats || []).map(function (s) {
      return '<div class="stat"><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></div>';
    }).join('');

    $('#skillsGrid').innerHTML = (p.skillGroups || []).map(function (g) {
      return '' +
        '<article class="skill-card">' +
          '<div class="skill-card-head">' +
            '<span class="focus-icon">' + window.icon(g.icon, 'code') + '</span>' +
            '<h3>' + esc(g.title) + '</h3>' +
          '</div>' +
          '<div class="chips">' + (g.items || []).map(function (i) {
            return '<span class="chip">' + esc(i) + '</span>';
          }).join('') + '</div>' +
        '</article>';
    }).join('');

    $('#timeline').innerHTML = (p.experience || []).map(function (e) {
      var bullets = (e.bullets || []).length
        ? '<ul class="tl-list">' + e.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>'
        : '';
      var link = (e.link && e.link.href)
        ? '<div style="margin-top:16px"><a class="btn btn-ghost btn-sm" href="' + esc(e.link.href) + '" target="_blank" rel="noopener">' + esc(e.link.label || 'Ссылка') + '</a></div>'
        : (e.link && e.link.label ? '<div style="margin-top:16px"><span class="pill amber">' + esc(e.link.label) + ' · ссылка будет добавлена</span></div>' : '');
      return '' +
        '<div class="tl-item reveal">' +
          '<div class="tl-card">' +
            '<div class="tl-top"><h3>' + esc(e.role) + '</h3>' +
              (e.kind ? '<span class="pill accent">' + esc(e.kind) + '</span>' : '') +
            '</div>' +
            '<div class="tl-meta">' + esc(e.period || '') + '</div>' +
            '<p class="tl-desc">' + esc(e.description || '') + '</p>' +
            bullets + link +
          '</div>' +
        '</div>';
    }).join('');

    $('#languages').innerHTML = (p.languages || []).map(function (l) {
      return '<div class="lang-row"><strong>' + esc(l.name) + '</strong><span>' + esc(l.level) + '</span></div>';
    }).join('');

    var edu = (p.education || [])[0];
    if (edu) {
      $('#educationInline').innerHTML =
        '<div style="font-size:14.5px;font-weight:600">' + esc(edu.institution) + '</div>' +
        '<div style="font-size:13px;color:var(--muted);margin-top:2px">' + esc(edu.program) + '</div>' +
        '<div style="font-size:13px;color:var(--muted)">' + esc(edu.degree) + '</div>';
      $('#eduTitle').textContent = edu.institution + ' — ' + edu.program;
      $('#eduSubtitle').textContent = edu.note || '';
      $('#eduDegree').textContent = edu.degree;
    }

    $('#contactGrid').innerHTML = (p.contacts || []).map(function (c) {
      return '' +
        '<a class="contact-card" href="' + esc(c.href) + '"' + (c.href.indexOf('mailto:') === 0 ? '' : ' target="_blank" rel="noopener"') + '>' +
          '<span class="focus-icon">' + window.icon(c.icon, 'link') + '</span>' +
          '<span><strong>' + esc(c.label) + '</strong><span>' + esc(c.value) + '</span></span>' +
        '</a>';
    }).join('');

    var gh = (p.contacts || []).filter(function (c) { return c.icon === 'github'; })[0];
    if (gh) $('#navGithub').href = gh.href;
    var tg = (p.contacts || []).filter(function (c) { return c.icon === 'telegram'; })[0];
    if (tg) $('#navTelegram').href = tg.href;
  }

  /* ---------------- projects ---------------- */

  function statusPill(project, compact) {
    var cls = STATUS_CLASS[project.status] || 'slate';
    return '<span class="pill ' + cls + '">' + esc(project.status) + '</span>';
  }

  function cardHTML(p) {
    var grad = (p.cover && p.cover.gradient) || ['#7c5cff', '#22d3ee'];
    var icon = window.icon(p.cover && p.cover.icon, 'code');
    var mono = (p.cover && p.cover.monogram) || p.title.slice(0, 2).toUpperCase();
    var tags = (p.tags || []).slice(0, 4).map(function (t) {
      return '<span class="tag-mini">' + esc(t) + '</span>';
    }).join('');
    var links = '';
    if (p.links && p.links.github) {
      links += '<a href="' + esc(p.links.github) + '" target="_blank" rel="noopener" data-stop aria-label="Репозиторий">' + window.icon('github') + '</a>';
    }
    if (p.links && p.links.demo) {
      links += '<a href="' + esc(p.links.demo) + '"' + (p.links.demo.charAt(0) === '#' ? '' : ' target="_blank" rel="noopener"') + ' data-stop aria-label="Демо">' + window.icon('play') + '</a>';
    }
    links += '<a href="#" data-open="' + esc(p.id) + '" data-stop aria-label="Подробнее">' + window.icon('link') + '</a>';

    return '' +
      '<article class="pcard reveal" data-id="' + esc(p.id) + '" tabindex="0" role="button" aria-label="' + esc(p.title) + '">' +
        '<div class="pcard-cover" style="background:linear-gradient(135deg,' + esc(grad[0]) + ',' + esc(grad[1]) + ')">' +
          '<div class="pcard-badges">' +
            (p.featured ? '<span class="badge-cover star">★ Избранное</span>' : '') +
            '<span class="badge-cover">' + esc(CATEGORY_LABEL[p.category] || p.category) + '</span>' +
          '</div>' +
          '<span class="cover-mono">' + esc(mono) + '</span>' +
          '<span class="cover-icon">' + icon + '</span>' +
        '</div>' +
        '<div class="pcard-body">' +
          '<h3>' + esc(p.title) + '</h3>' +
          '<div class="pcard-sub">' + esc(p.subtitle || '') + '</div>' +
          '<p class="pcard-desc">' + esc(p.description || '') + '</p>' +
          '<div class="pcard-tags">' + tags + '</div>' +
          '<div class="pcard-foot">' +
            '<span class="pcard-engine">' + esc(p.engine || '') + '</span>' +
            '<span class="pcard-links">' + links + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function matches(p) {
    if (state.filter === 'featured') { if (!p.featured) return false; }
    else if (state.filter !== 'all') { if (p.category !== state.filter) return false; }
    var q = state.query.trim().toLowerCase();
    if (!q) return true;
    var hay = [p.title, p.subtitle, p.engine, p.category, p.status, p.description]
      .concat(p.tags || []).join(' ').toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function renderFilters() {
    var defs = [{ id: 'all', label: 'Все проекты' }, { id: 'featured', label: 'Избранное' }].concat(
      Object.keys(CATEGORY_LABEL).filter(function (k) { return k !== 'archive'; }).map(function (k) {
        return { id: k, label: CATEGORY_LABEL[k] };
      })
    );
    defs.push({ id: 'archive', label: CATEGORY_LABEL.archive });

    $('#filters').innerHTML = defs.map(function (d) {
      var count = d.id === 'all'
        ? state.projects.length
        : state.projects.filter(function (p) {
            return d.id === 'featured' ? p.featured : p.category === d.id;
          }).length;
      return '<button class="filter-btn' + (state.filter === d.id ? ' active' : '') + '" data-filter="' + d.id + '">' +
        esc(d.label) + '<span class="count">' + count + '</span></button>';
    }).join('');
  }

  function renderLibrary() {
    var filtered = state.projects.filter(matches);
    var showingAll = state.filter === 'all' && !state.query.trim();

    $('#featuredBlock').style.display = showingAll ? '' : 'none';
    if (showingAll) {
      var feat = state.projects.filter(function (p) { return p.featured; });
      $('#featuredGrid').innerHTML = feat.map(cardHTML).join('');
    }

    $('#allBlock').style.display = '';
    var list = showingAll
      ? state.projects.filter(function (p) { return !p.featured; })
      : filtered;
    $('.lib-label', $('#allBlock')).textContent = showingAll ? 'Все проекты' : 'Результаты: ' + filtered.length;
    $('#projectsGrid').innerHTML = list.map(cardHTML).join('');
    $('#emptyState').style.display = filtered.length ? 'none' : '';

    observeReveals();
  }

  /* ---------------- modal ---------------- */

  var lastFocus = null;

  function openModal(id) {
    var p = state.projects.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var grad = (p.cover && p.cover.gradient) || ['#7c5cff', '#22d3ee'];
    var mono = (p.cover && p.cover.monogram) || p.title.slice(0, 2).toUpperCase();
    var tags = (p.tags || []).map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('');
    var highlights = (p.highlights || []).length
      ? '<div class="modal-block-title">Ключевые особенности</div><ul class="modal-list">' +
        p.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>'
      : '';
    var links = '';
    if (p.links && p.links.github) {
      links += '<a class="btn btn-ghost btn-sm" href="' + esc(p.links.github) + '" target="_blank" rel="noopener">' + window.icon('github') + 'Репозиторий</a>';
    }
    if (p.links && p.links.demo) {
      links += '<a class="btn btn-primary btn-sm" href="' + esc(p.links.demo) + '"' + (p.links.demo.charAt(0) === '#' ? '' : ' target="_blank" rel="noopener"') + '>' + window.icon('play') + 'Открыть демо</a>';
    }
    if (p.links && p.links.registry) {
      links += '<a class="btn btn-ghost btn-sm" href="' + esc(p.links.registry) + '" target="_blank" rel="noopener">' + window.icon('award') + 'Реестр ЭВМ</a>';
    }

    $('#modalPanel').innerHTML = '' +
      '<div class="modal-cover" style="background:linear-gradient(135deg,' + esc(grad[0]) + ',' + esc(grad[1]) + ')">' +
        '<button class="modal-close" data-close aria-label="Закрыть">' + window.icon('close') + '</button>' +
        '<span class="cover-mono">' + esc(mono) + '</span>' +
        '<span class="cover-icon">' + window.icon(p.cover && p.cover.icon, 'code') + '</span>' +
      '</div>' +
      '<div class="modal-body">' +
        '<h2>' + esc(p.title) + '</h2>' +
        '<div class="modal-sub">' + esc(p.subtitle || '') + '</div>' +
        '<div class="modal-meta">' +
          '<span class="pill accent">' + esc(CATEGORY_LABEL[p.category] || p.category) + '</span>' +
          statusPill(p) +
          (p.year ? '<span class="pill slate">' + esc(p.year) + '</span>' : '') +
          (p.engine ? '<span class="pill slate">' + esc(p.engine) + '</span>' : '') +
        '</div>' +
        '<p class="modal-desc">' + esc(p.description || '') + '</p>' +
        highlights +
        (tags ? '<div class="modal-block-title">Технологии</div><div class="modal-tags">' + tags + '</div>' : '') +
        (links ? '<div class="modal-links">' + links + '</div>' : '') +
      '</div>';

    lastFocus = document.activeElement;
    $('#modal').classList.add('open');
    $('#modal').setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    var closeBtn = $('.modal-close', $('#modalPanel'));
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    $('#modal').classList.remove('open');
    $('#modal').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  /* ---------------- reveals ---------------- */

  var revealObserver = null;
  function observeReveals() {
    if (!('IntersectionObserver' in window)) {
      $all('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            revealObserver.unobserve(en.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    }
    $all('.reveal:not(.in)').forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------- init ---------------- */

  function bindEvents() {
    $('#filters').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      state.filter = btn.getAttribute('data-filter');
      renderFilters();
      renderLibrary();
    });

    var searchTimer;
    $('#searchInput').addEventListener('input', function (e) {
      clearTimeout(searchTimer);
      var v = e.target.value;
      searchTimer = setTimeout(function () {
        state.query = v;
        renderLibrary();
      }, 140);
    });

    document.addEventListener('click', function (e) {
      var open = e.target.closest('[data-open]');
      if (open) { e.preventDefault(); openModal(open.getAttribute('data-open')); return; }
      if (e.target.closest('[data-close]')) { closeModal(); return; }
      var stop = e.target.closest('[data-stop]');
      if (stop) return;
      var card = e.target.closest('.pcard');
      if (card && !e.target.closest('a')) { openModal(card.getAttribute('data-id')); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('#modal').classList.contains('open')) closeModal();
      if (e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('pcard')) {
        openModal(document.activeElement.getAttribute('data-id'));
      }
    });

    var nav = $('#nav');
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 12); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    $('#navToggle').addEventListener('click', function () {
      $('#navLinks').classList.toggle('open');
    });
    $all('#navLinks a').forEach(function (a) {
      a.addEventListener('click', function () { $('#navLinks').classList.remove('open'); });
    });
  }

  function init() {
    $('#year').textContent = new Date().getFullYear();
    bindEvents();
    observeReveals();

    Promise.all([loadJSON('data/profile.json'), loadJSON('data/projects.json')])
      .then(function (res) {
        renderProfile(res[0]);
        state.projects = res[1].projects || [];
        renderFilters();
        renderLibrary();
        observeReveals();
      })
      .catch(function (err) {
        console.error(err);
        $('#projectsGrid').innerHTML = '<div class="empty-state">Ошибка загрузки данных: ' + esc(err.message) + '</div>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
