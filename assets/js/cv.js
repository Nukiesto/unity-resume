(function () {
  'use strict';

  var LEVEL_CLASS = {
    'Основное': '',
    'Уверенно': 'is-strong',
    'Знаком': 'is-familiar'
  };

  function $(sel, root) { return (root || document).querySelector(sel); }

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

  function contact(icon, value, href, external) {
    var inner = window.icon(icon, 'link') + '<span>' + esc(value) + '</span>';
    if (href) {
      return '<a class="cv-contact" href="' + esc(href) + '"' +
        (external ? ' target="_blank" rel="noopener"' : '') + '>' + inner + '</a>';
    }
    return '<div class="cv-contact">' + inner + '</div>';
  }

  /* ---------------- head ---------------- */

  function renderHead(cv) {
    var p = cv.personal;
    var variants = (cv.positionVariants || []).length
      ? '<div class="cv-variants">' + esc(cv.positionVariants.join(' · ')) + '</div>'
      : '';

    var metaParts = [p.city, p.workFormat, cv.salary ? 'Ожидания: ' + cv.salary : '']
      .filter(Boolean);
    var headMeta = '<div class="cv-head-meta">' + esc(metaParts.join(' · ')) + '</div>';

    var contacts = [
      contact('mail', p.email, 'mailto:' + p.email, false),
      contact('phone', p.phone, 'tel:' + p.phoneHref, false),
      contact('telegram', p.telegram, p.telegramHref, true),
      contact('github', p.github, p.githubHref, true),
      contact('vk', p.vk, p.vkHref, true)
    ].join('');

    return '' +
      '<header class="cv-head">' +
        '<div class="cv-head-main">' +
          '<h1 class="cv-name">' + esc(p.name) + '</h1>' +
          '<div class="cv-position">' + esc(cv.position) + '</div>' +
          variants +
          headMeta +
        '</div>' +
        '<div class="cv-head-side">' + contacts + '</div>' +
      '</header>';
  }

  /* ---------------- sections ---------------- */

  function renderSummary(cv) {
    if (!cv.summary) return '';
    return '' +
      '<section class="cv-section">' +
        '<h2>О себе</h2>' +
        '<p class="cv-summary">' + esc(cv.summary) + '</p>' +
      '</section>';
  }

  function renderSkills(cv) {
    var rows = (cv.skillGroups || []).map(function (g) {
      var level = LEVEL_CLASS.hasOwnProperty(g.level) ? LEVEL_CLASS[g.level] : 'is-familiar';
      var levelTag = g.level
        ? '<span class="cv-skill-level ' + level + '">' + esc(g.level) + '</span>'
        : '';
      var items = (g.items || []).map(function (i) {
        return '<span>' + esc(i) + '</span>';
      }).join('');
      return '' +
        '<div class="cv-skill-row">' +
          '<div class="cv-skill-name">' + esc(g.title) + levelTag + '</div>' +
          '<div class="cv-skill-items">' + items + '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<section class="cv-section">' +
        '<h2>Навыки</h2>' +
        '<div class="cv-skills">' + rows + '</div>' +
      '</section>';
  }

  function renderWork(cv) {
    var jobs = (cv.work || []).map(function (w) {
      var bullets = (w.bullets || []).length
        ? '<ul class="cv-job-list">' + w.bullets.map(function (b) {
            return '<li>' + esc(b) + '</li>';
          }).join('') + '</ul>'
        : '';
      var stack = (w.stack || []).length
        ? '<div class="cv-job-stack"><b>Стек:</b> ' + esc(w.stack.join(', ')) + '</div>'
        : '';
      var meta = [w.type, w.location].filter(Boolean).join(' · ');

      return '' +
        '<article class="cv-job">' +
          '<div class="cv-job-head">' +
            '<div class="cv-job-title">' +
              esc(w.position) + ' — <span class="cv-job-company">' + esc(w.company) + '</span>' +
            '</div>' +
            '<div class="cv-job-period">' + esc(w.period) + '</div>' +
          '</div>' +
          (meta ? '<div class="cv-job-meta">' + esc(meta) + '</div>' : '') +
          stack + bullets +
        '</article>';
    }).join('');

    return '' +
      '<section class="cv-section">' +
        '<h2>Опыт работы</h2>' +
        jobs +
      '</section>';
  }

  function renderProjects(cv, projects) {
    var byId = {};
    projects.forEach(function (p) { byId[p.id] = p; });

    var cards = (cv.projectIds || []).map(function (id) {
      var p = byId[id];
      if (!p) return '';
      var tags = (p.tags || []).slice(0, 5).join(', ');
      return '' +
        '<article class="cv-project">' +
          '<div class="cv-project-top">' +
            '<div class="cv-project-title">' + esc(p.title) + '</div>' +
            '<div class="cv-project-year">' + esc(p.year || '') + '</div>' +
          '</div>' +
          '<div class="cv-project-desc">' + esc(p.subtitle || p.description || '') + '</div>' +
          (tags ? '<div class="cv-project-stack">' + esc(tags) + '</div>' : '') +
        '</article>';
    }).filter(Boolean).join('');

    if (!cards) return '';

    return '' +
      '<section class="cv-section">' +
        '<h2>Ключевые проекты</h2>' +
        '<div class="cv-projects">' + cards + '</div>' +
      '</section>';
  }

  function renderEducation(cv) {
    var edu = (cv.education || [])[0];
    if (!edu) return '';
    var title = esc(edu.institution) + (edu.code ? ' · ' + esc(edu.code) : '');
    return '' +
      '<section class="cv-section">' +
        '<h2>Образование</h2>' +
        '<div class="cv-edu-degree">' + title + '</div>' +
        '<div class="cv-edu-line">' + esc(edu.program) + ' · ' + esc(edu.degree) + '</div>' +
        (edu.full ? '<div class="cv-edu-line">' + esc(edu.full) + '</div>' : '') +
        '<div class="cv-edu-period">' + esc(edu.period) + '</div>' +
      '</section>';
  }

  function renderAchievements(cv) {
    var items = (cv.achievements || []).map(function (a) {
      return '' +
        '<div class="cv-ach-item">' +
          '<span class="cv-ach-icon">' + window.icon('award', 'award') + '</span>' +
          '<span>' +
            '<span class="cv-ach-title">' + esc(a.title) + '</span>' +
            '<span class="cv-ach-detail">' + esc(a.detail || '') + '</span>' +
          '</span>' +
        '</div>';
    }).join('');

    if (!items) return '';
    return '' +
      '<section class="cv-section">' +
        '<h2>Достижения</h2>' +
        '<div class="cv-ach">' + items + '</div>' +
      '</section>';
  }

  function renderLanguages(cv) {
    var rows = (cv.languages || []).map(function (l) {
      return '<div class="cv-lang-row"><b>' + esc(l.name) + '</b><span>' + esc(l.level) + '</span></div>';
    }).join('');
    if (!rows) return '';
    return '' +
      '<section class="cv-section">' +
        '<h2>Языки</h2>' +
        '<div class="cv-langs">' + rows + '</div>' +
      '</section>';
  }

  function renderFooter(cv) {
    var p = cv.personal;
    var left = 'Обновлено: ' + esc(cv.updated || '');
    var right = 'Портфолио: ' + esc(p.site);
    return '<div class="cv-note"><span>' + left + '</span><span>' + right + '</span></div>';
  }

  /* ---------------- init ---------------- */

  function render(cv, projects) {
    document.title = cv.personal.name + ' — ' + cv.position + ' · CV';
    var salary = cv.salary ? '<div class="cv-job-meta">Ожидания: ' + esc(cv.salary) + '</div>' : '';

    var html = '' +
      renderHead(cv) +
      renderSummary(cv) +
      renderSkills(cv) +
      renderWork(cv) +
      renderProjects(cv, projects) +
      '<div class="cv-cols">' + renderEducation(cv) + renderAchievements(cv) + '</div>' +
      renderLanguages(cv) +
      renderFooter(cv);

    var page = $('#cvPage');
    if (page) page.innerHTML = html;

    var meta = $('#cvMeta');
    if (meta) {
      meta.innerHTML = esc(cv.personal.workFormat) +
        (cv.salary ? ' · ' + esc(cv.salary) : '');
    }

    var printBtn = $('#cvPrint');
    if (printBtn) {
      printBtn.addEventListener('click', function () { window.print(); });
    }
  }

  function fail(err) {
    var page = $('#cvPage');
    if (page) {
      page.innerHTML = '<p style="color:#b91c1c">Ошибка загрузки CV: ' + esc(err.message) + '</p>';
    }
    console.error(err);
  }

  function init() {
    Promise.all([
      loadJSON('../data/cv.json'),
      loadJSON('../data/projects.json')
    ]).then(function (res) {
      var projects = (res[1].projects || []).filter(function (p) { return !p.hidden; });
      render(res[0], projects);
    }).catch(fail);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
