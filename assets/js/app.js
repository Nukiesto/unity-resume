(function () {
  'use strict';

  var CATEGORY_LABEL = {
    games: 'Игра',
    vr: 'VR / XR',
    media: 'VR/AR-медиа',
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

  var state = { filter: 'all', query: '', sort: 'default', projects: [], featured: [], shots: {} };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function setText(sel, value, root) {
    var el = $(sel, root);
    if (el) el.textContent = value;
    return el;
  }

  function setHTML(sel, value, root) {
    var el = $(sel, root);
    if (el) el.innerHTML = value;
    return el;
  }

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
    setText('#brandName', p.name);
    setText('#brandRole', p.role);
    setText('#heroName', p.name);
    setText('#heroRole', p.role);
    setText('#heroTagline', p.tagline);
    setText('#aboutSummary', p.summary);

    setHTML('#stats', (p.stats || []).map(function (s) {
      return '<div class="stat"><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></div>';
    }).join(''));

    setHTML('#skillsGrid', (p.skillGroups || []).map(function (g) {
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
    }).join(''));

    var experience = (p.experience || []).slice().sort(function (a, b) {
      return (Number(b.year) || 0) - (Number(a.year) || 0);
    });
    setHTML('#timeline', experience.map(function (e) {
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
    }).join(''));

    setHTML('#languages', (p.languages || []).map(function (l) {
      return '<div class="lang-row"><strong>' + esc(l.name) + '</strong><span>' + esc(l.level) + '</span></div>';
    }).join(''));

    var edu = (p.education || [])[0];
    if (edu) {
      var period = edu.period
        ? '<span class="edu-period">' + esc(edu.period) + '</span>'
        : '';
      setHTML('#educationInline',
        '<div class="edu-item">' +
          '<div class="edu-item-top">' +
            '<strong>' + esc(edu.institution) + '</strong>' + period +
          '</div>' +
          '<div class="edu-line">' + esc(edu.program) + '</div>' +
          '<div class="edu-line">' + esc(edu.degree) + '</div>' +
        '</div>');
    }

    setHTML('#achievements', (p.achievements || []).map(function (a) {
      return '' +
        '<div class="ach-row">' +
          '<span class="ach-icon">' + window.icon(a.icon, 'award') + '</span>' +
          '<span><strong>' + esc(a.title) + '</strong><span>' + esc(a.detail || '') + '</span></span>' +
        '</div>';
    }).join(''));

    setHTML('#contactGrid', (p.contacts || []).map(function (c) {
      return '' +
        '<a class="contact-card" href="' + esc(c.href) + '"' + (c.href.indexOf('mailto:') === 0 ? '' : ' target="_blank" rel="noopener"') + '>' +
          '<span class="focus-icon">' + window.icon(c.icon, 'link') + '</span>' +
          '<span><strong>' + esc(c.label) + '</strong><span>' + esc(c.value) + '</span></span>' +
        '</a>';
    }).join(''));

    var gh = (p.contacts || []).filter(function (c) { return c.icon === 'github'; })[0];
    if (gh) {
      var ghBtn = $('#navGithub');
      if (ghBtn) ghBtn.href = gh.href;
    }
    var tg = (p.contacts || []).filter(function (c) { return c.icon === 'telegram'; })[0];
    if (tg) {
      var tgBtn = $('#navTelegram');
      if (tgBtn) tgBtn.href = tg.href;
      var writeBtn = $('#heroWrite');
      if (writeBtn) writeBtn.href = tg.href;
    }
  }

  /* ---------------- projects ---------------- */

  function statusPill(project, compact) {
    var cls = STATUS_CLASS[project.status] || 'slate';
    return '<span class="pill ' + cls + '">' + esc(project.status) + '</span>';
  }

  /* Screenshots come from data/screenshots.json, regenerated by
     tools/screenshots.js from assets/img/screenshots/<id>/. */
  function shotsFor(id) {
    var entry = state.shots[id];
    if (!entry || !entry.images || !entry.images.length) return [];
    return entry.images;
  }

  /* Percent-encode each path segment so filenames with spaces or
     non-latin characters (e.g. "обложка.png") resolve correctly. */
  function shotUrl(src) {
    return String(src).split('/').map(encodeURIComponent).join('/');
  }

  function cardHTML(p) {
    var grad = (p.cover && p.cover.gradient) || ['#7c5cff', '#22d3ee'];
    var icon = window.icon(p.cover && p.cover.icon, 'code');
    var mono = (p.cover && p.cover.monogram) || p.title.slice(0, 2).toUpperCase();
    var shot = shotsFor(p.id)[0];
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
    if (p.links && (p.links.registry || p.links.registryPdf)) {
      links += '<a href="' + esc(p.links.registry || p.links.registryPdf) + '" target="_blank" rel="noopener" data-stop aria-label="Реестр ЭВМ">' + window.icon('award') + '</a>';
    }
    links += '<a href="#" data-open="' + esc(p.id) + '" data-stop aria-label="Подробнее">' + window.icon('link') + '</a>';

    var coverInner = shot
      ? '<img class="cover-img" src="' + esc(shotUrl(shot)) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async" onerror="this.classList.add(\'is-missing\')">'
      : '<span class="cover-mono">' + esc(mono) + '</span>';

    return '' +
      '<article class="pcard reveal" data-id="' + esc(p.id) + '" tabindex="0" role="button" aria-label="' + esc(p.title) + '">' +
        '<div class="pcard-cover' + (shot ? ' has-shot' : '') + '" style="background:linear-gradient(135deg,' + esc(grad[0]) + ',' + esc(grad[1]) + ')">' +
          '<div class="pcard-badges">' +
            (p.featured ? '<span class="badge-cover star">★ Избранное</span>' : '') +
            '<span class="badge-cover">' + esc(CATEGORY_LABEL[p.category] || p.category) + '</span>' +
          '</div>' +
          coverInner +
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

  /* Highest 4-digit year found in the project's `year` string
     (handles "2026" and ranges like "2025–2026"). */
  function projectYear(p) {
    var found = String(p.year || '').match(/\d{4}/g);
    if (!found || !found.length) return 0;
    return Math.max.apply(null, found.map(Number));
  }

  function byTitle(a, b) {
    return a.title.localeCompare(b.title, 'ru', { sensitivity: 'base' });
  }

  function sortProjects(list) {
    var out = list.slice();
    switch (state.sort) {
      case 'year-desc':
        out.sort(function (a, b) { return projectYear(b) - projectYear(a) || byTitle(a, b); });
        break;
      case 'year-asc':
        out.sort(function (a, b) { return projectYear(a) - projectYear(b) || byTitle(a, b); });
        break;
      case 'title-asc':
        out.sort(byTitle);
        break;
      case 'title-desc':
        out.sort(function (a, b) { return byTitle(b, a); });
        break;
      case 'featured':
        out.sort(function (a, b) {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || byTitle(a, b);
        });
        break;
      default:
        break;
    }
    return out;
  }

  function renderFilters() {
    var defs = [{ id: 'all', label: 'Все проекты' }, { id: 'featured', label: 'Избранное' }].concat(
      Object.keys(CATEGORY_LABEL).filter(function (k) { return k !== 'archive'; }).map(function (k) {
        return { id: k, label: CATEGORY_LABEL[k] };
      })
    );
    defs.push({ id: 'archive', label: CATEGORY_LABEL.archive });

    setHTML('#filters', defs.map(function (d) {
      var count = d.id === 'all'
        ? state.projects.length
        : state.projects.filter(function (p) {
            return d.id === 'featured' ? p.featured : p.category === d.id;
          }).length;
      return '<button class="filter-btn' + (state.filter === d.id ? ' active' : '') + '" data-filter="' + d.id + '">' +
        esc(d.label) + '<span class="count">' + count + '</span></button>';
    }).join(''));
  }

  function renderLibrary() {
    var filtered = state.projects.filter(matches);
    var showingAll = state.filter === 'all' && !state.query.trim();

    var featuredBlock = $('#featuredBlock');
    if (featuredBlock) featuredBlock.style.display = showingAll ? '' : 'none';
    if (showingAll) {
      var feat = state.projects.filter(function (p) { return p.featured; });
      setHTML('#featuredGrid', sortProjects(feat).map(cardHTML).join(''));
    }

    var allBlock = $('#allBlock');
    if (allBlock) allBlock.style.display = '';
    var list = showingAll
      ? state.projects.filter(function (p) { return !p.featured; })
      : filtered;
    list = sortProjects(list);
    var label = $('.lib-label', allBlock);
    if (label) label.textContent = showingAll ? 'Все проекты' : 'Результаты: ' + filtered.length;
    setHTML('#projectsGrid', list.map(cardHTML).join(''));
    var empty = $('#emptyState');
    if (empty) empty.style.display = filtered.length ? 'none' : '';

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
    if (p.links && p.links.registryPdf) {
      links += '<a class="btn btn-ghost btn-sm" href="' + esc(p.links.registryPdf) + '" target="_blank" rel="noopener">' + window.icon('award') + 'Свидетельство (PDF)</a>';
    }

    var panel = $('#modalPanel');
    var modal = $('#modal');
    if (!panel || !modal) return;

    var shots = shotsFor(p.id);
    var coverBlock = shots.length
      ? '<div class="modal-cover has-shot" style="background:linear-gradient(135deg,' + esc(grad[0]) + ',' + esc(grad[1]) + ')">' +
          '<button class="modal-close" data-close aria-label="Закрыть">' + window.icon('close') + '</button>' +
          '<img class="cover-img" src="' + esc(shotUrl(shots[0])) + '" alt="' + esc(p.title) + '" decoding="async" ' +
            'data-lightbox="0" data-gallery="' + esc(p.id) + '" onerror="this.classList.add(\'is-missing\')">' +
        '</div>'
      : '<div class="modal-cover" style="background:linear-gradient(135deg,' + esc(grad[0]) + ',' + esc(grad[1]) + ')">' +
          '<button class="modal-close" data-close aria-label="Закрыть">' + window.icon('close') + '</button>' +
          '<span class="cover-mono">' + esc(mono) + '</span>' +
          '<span class="cover-icon">' + window.icon(p.cover && p.cover.icon, 'code') + '</span>' +
        '</div>';

    var gallery = shots.length > 1
      ? '<div class="modal-block-title">Скриншоты · ' + shots.length + '</div>' +
        '<div class="modal-gallery">' + shots.map(function (src, i) {
          return '<button class="shot" data-lightbox="' + i + '" data-gallery="' + esc(p.id) + '" ' +
                 'aria-label="Открыть скриншот ' + (i + 1) + '">' +
                 '<img src="' + esc(shotUrl(src)) + '" alt="' + esc(p.title) + ' — скриншот ' + (i + 1) + '" loading="lazy" decoding="async" ' +
                 'onerror="this.parentNode.classList.add(\'is-missing\')"></button>';
        }).join('') + '</div>'
      : '';

    panel.innerHTML = '' +
      coverBlock +
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
        gallery +
        (links ? '<div class="modal-links">' + links + '</div>' : '') +
      '</div>';

    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    var closeBtn = $('.modal-close', panel);
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    var modal = $('#modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------------- lightbox ---------------- */

  var lbState = { images: [], index: 0 };

  function openLightbox(projectId, index) {
    var images = shotsFor(projectId);
    if (!images.length) return;
    var el = $('#lightbox');
    if (!el) return;
    lbState.images = images;
    lbState.index = Math.max(0, Math.min(images.length - 1, index || 0));
    renderLightbox();
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    var close = $('[data-lb-close]', el);
    if (close) close.focus();
  }

  function renderLightbox() {
    var el = $('#lightbox');
    if (!el) return;
    var total = lbState.images.length;
    var src = lbState.images[lbState.index];
    var counter = total > 1 ? '<div class="lb-counter">' + (lbState.index + 1) + ' / ' + total + '</div>' : '';
    var prev = total > 1 ? '<button class="lb-nav lb-prev" data-lb-step="-1" aria-label="Предыдущий">' + window.icon('chevron-left') + '</button>' : '';
    var next = total > 1 ? '<button class="lb-nav lb-next" data-lb-step="1" aria-label="Следующий">' + window.icon('chevron-right') + '</button>' : '';

    el.innerHTML = '' +
      '<div class="lb-backdrop" data-lb-close></div>' +
      '<button class="lb-close" data-lb-close aria-label="Закрыть">' + window.icon('close') + '</button>' +
      prev +
      '<img class="lb-image" src="' + esc(shotUrl(src)) + '" alt="Скриншот ' + (lbState.index + 1) + '">' +
      next + counter;
  }

  function lbStep(delta) {
    var total = lbState.images.length;
    if (total < 2) return;
    lbState.index = (lbState.index + delta + total) % total;
    renderLightbox();
  }

  function closeLightbox() {
    var el = $('#lightbox');
    if (!el) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    if (!$('#modal') || !$('#modal').classList.contains('open')) {
      document.body.classList.remove('no-scroll');
    }
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

  function on(sel, event, handler) {
    var el = $(sel);
    if (el) el.addEventListener(event, handler);
  }

  function bindEvents() {
    on('#filters', 'click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      state.filter = btn.getAttribute('data-filter');
      renderFilters();
      renderLibrary();
    });

    var searchTimer;
    on('#searchInput', 'input', function (e) {
      clearTimeout(searchTimer);
      var v = e.target.value;
      searchTimer = setTimeout(function () {
        state.query = v;
        renderLibrary();
      }, 140);
    });

    on('#sortSelect', 'change', function (e) {
      state.sort = e.target.value;
      renderLibrary();
    });

    document.addEventListener('click', function (e) {
      var lb = e.target.closest('[data-lightbox]');
      if (lb) {
        e.preventDefault();
        openLightbox(lb.getAttribute('data-gallery'), Number(lb.getAttribute('data-lightbox')));
        return;
      }
      if (e.target.closest('[data-lb-close]')) { closeLightbox(); return; }
      var lbStepBtn = e.target.closest('[data-lb-step]');
      if (lbStepBtn) { e.preventDefault(); lbStep(Number(lbStepBtn.getAttribute('data-lb-step'))); return; }
      var open = e.target.closest('[data-open]');
      if (open) { e.preventDefault(); openModal(open.getAttribute('data-open')); return; }
      if (e.target.closest('[data-close]')) { closeModal(); return; }
      var stop = e.target.closest('[data-stop]');
      if (stop) return;
      var card = e.target.closest('.pcard');
      if (card && !e.target.closest('a')) { openModal(card.getAttribute('data-id')); }
    });

    document.addEventListener('keydown', function (e) {
      var lb = $('#lightbox');
      if (e.key === 'Escape' && lb && lb.classList.contains('open')) { closeLightbox(); return; }
      if (lb && lb.classList.contains('open')) {
        if (e.key === 'ArrowRight') lbStep(1);
        if (e.key === 'ArrowLeft') lbStep(-1);
        return;
      }
      var modal = $('#modal');
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
      if (e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('pcard')) {
        openModal(document.activeElement.getAttribute('data-id'));
      }
    });

    var nav = $('#nav');
    if (nav) {
      var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 12); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    on('#navToggle', 'click', function () {
      var links = $('#navLinks');
      if (links) links.classList.toggle('open');
    });
    $all('#navLinks a').forEach(function (a) {
      a.addEventListener('click', function () {
        var links = $('#navLinks');
        if (links) links.classList.remove('open');
      });
    });
  }

  function init() {
    setText('#year', new Date().getFullYear());
    bindEvents();
    observeReveals();

    Promise.all([loadJSON('data/profile.json'), loadJSON('data/projects.json')])
      .then(function (res) {
        try {
          renderProfile(res[0]);
        } catch (err) {
          console.error('Ошибка отрисовки профиля:', err);
        }
        state.projects = res[1].projects || [];
        renderFilters();
        renderLibrary();
        observeReveals();
      })
      .catch(function (err) {
        console.error(err);
        setHTML('#projectsGrid', '<div class="empty-state">Ошибка загрузки данных: ' + esc(err.message) + '</div>');
      });

    /* Screenshots are optional: a missing file must not break the page. */
    fetch('data/screenshots.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.projects) return;
        state.shots = data.projects;
        if (state.projects.length) renderLibrary();
      })
      .catch(function () { /* no screenshots yet */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
