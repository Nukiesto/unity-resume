(function () {
  var S = 'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"';

  function svg(inner, opts) {
    opts = opts || {};
    if (opts.fill) {
      return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + inner + '</svg>';
    }
    return '<svg viewBox="0 0 24 24" ' + S + ' aria-hidden="true">' + inner + '</svg>';
  }

  var ICONS = {
    /* ---- brand / ui ---- */
    github: svg('<path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.6 4.4 18.6 4.7 18.6 4.7c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/>', { fill: true }),
    telegram: svg('<path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.4 13.1l-4.8-1.5c-1-.3-1-1 .2-1.5l18.8-7.2c.9-.3 1.6.2 1.3 1.4z"/>', { fill: true }),
    vk: svg('<path d="M12.8 17.3c-6 0-9.4-4.1-9.6-10.9h3c.1 5 2.3 7.1 4 7.5V6.4h2.8v4.3c1.7-.2 3.5-2.1 4.1-4.3h2.8c-.5 2.7-2.4 4.6-3.8 5.4 1.4.6 3.5 2.3 4.4 5.5h-3.1c-.6-2-2.3-3.6-4.4-3.8v3.8z"/>', { fill: true }),
    mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>'),
    phone: svg('<path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>'),
    print: svg('<path d="M6 9V3h12v6M6 18H4v-6h16v6h-2"/><rect x="7" y="14" width="10" height="7" rx="1"/>'),
    download: svg('<path d="M12 3v12M7 11l5 5 5-5M4 21h16"/>'),
    back: svg('<path d="M19 12H5M11 18l-6-6 6-6"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    play: svg('<path d="M8 5v14l11-7z"/>', { fill: true }),
    external: svg('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'),
    close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
    'chevron-left': svg('<path d="m15 5-7 7 7 7"/>'),
    'chevron-right': svg('<path d="m9 5 7 7-7 7"/>'),
    link: svg('<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'),
    star: svg('<path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z"/>', { fill: true }),
    award: svg('<circle cx="12" cy="9" r="5"/><path d="m8.5 13.5-1.5 8 5-3 5 3-1.5-8"/>'),

    /* ---- skill group icons ---- */
    engine: svg('<path d="M12 3 3 7.5v9L12 21l9-4.5v-9z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>'),
    layers: svg('<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5M3 17l9 5 9-5"/>'),
    network: svg('<circle cx="12" cy="12" r="2.5"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="m6.6 6.6 3.6 3.6M17.4 6.6l-3.6 3.6M6.6 17.4l3.6-3.6M17.4 17.4l-3.6-3.6"/>'),
    vr: svg('<rect x="2" y="7" width="20" height="10" rx="3"/><path d="M8 12h8M12 7v10"/>'),
    wallet: svg('<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20M16 15h2"/>'),
    tools: svg('<path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3z"/><path d="M17 3l4 4M7 7 3 3"/>'),

    /* ---- project cover icons ---- */
    burst: svg('<path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3.5 3.5M15.5 15.5 19 19M19 5l-3.5 3.5M8.5 15.5 5 19"/><circle cx="12" cy="12" r="3"/>'),
    blocks: svg('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>'),
    cube: svg('<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>'),
    minecraft: svg('<path d="M3 7h8V3h10v8h-4v6h-6v4H3z"/><path d="M11 7v10M3 15h8"/>'),
    tank: svg('<rect x="2" y="13" width="20" height="6" rx="2"/><path d="M6 13V9h7l4 4"/><path d="M17 11h5"/>'),
    heart: svg('<path d="M12 20s-7-4.4-9.2-8.6A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5.4C19 15.6 12 20 12 20z"/>'),
    mars: svg('<circle cx="12" cy="12" r="7"/><circle cx="9.5" cy="10" r="1.4"/><circle cx="14" cy="14" r="1.8"/><circle cx="15" cy="9" r="1"/>'),
    train: svg('<rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 10h14M9 16l-2 5M15 16l2 5M8 20h8"/>'),
    firstaid: svg('<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M12 11v5M9.5 13.5h5"/>'),
    flame: svg('<path d="M12 22c4 0 7-2.7 7-6.5 0-4.5-4-6-4-10.5-2 1.5-3 3.5-3 5.5-1-1-1.5-2.5-1.5-4C8 8 5 10.5 5 15.5 5 19.3 8 22 12 22z"/>'),
    gun: svg('<path d="M3 8h13l3 3h2v3h-4l-3 3H9l1-3H3z"/><path d="M7 8v3"/>'),
    globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/>'),
    music: svg('<path d="M9 18V5l10-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'),
    book: svg('<path d="M4 4h7a3 3 0 0 1 3 3v14a2.5 2.5 0 0 0-2.5-2.5H4z"/><path d="M20 4h-7a3 3 0 0 0-3 3v14a2.5 2.5 0 0 1 2.5-2.5H20z"/>'),
    ghost: svg('<path d="M5 21V10a7 7 0 0 1 14 0v11l-2.3-2-2.4 2-2.3-2-2.3 2-2.4-2z"/><path d="M9.5 9.5h.01M14.5 9.5h.01"/>'),
    sword: svg('<path d="M14.5 3H21v6.5L11 19.5l-2.5-2.5z"/><path d="m8.5 16.5-4 4M6 14l4 4M3 21l2-2"/>'),
    strategy: svg('<path d="M4 20V4M4 20h16"/><path d="m7 15 3-4 3 2 4-6"/>'),
    wand: svg('<path d="m4 20 12-12M14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/><path d="M18 12l.7 1.4 1.3.6-1.3.7-.7 1.3-.7-1.3-1.3-.7 1.3-.6z"/>'),
    code: svg('<path d="m8 6-6 6 6 6M16 6l6 6-6 6"/>'),
    server: svg('<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>'),
    database: svg('<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
    bot: svg('<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M8 13h.01M16 13h.01M9 19l-1.5 2M15 19l1.5 2"/>'),
    plugin: svg('<path d="M9 3v4H5v4H3v4h2v4h4v-4h4v4h4v-4h2v-4h-2V7h-4V3z"/>'),
    tool: svg('<path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3z"/>'),
    chart: svg('<path d="M4 20V4M4 20h16"/><rect x="7" y="12" width="3" height="5"/><rect x="12" y="8" width="3" height="9"/><rect x="17" y="5" width="3" height="12"/>'),
    terminal: svg('<rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="m7 9 3 3-3 3M13 15h4"/>'),
    mobile: svg('<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18.5h2"/>')
  };

  window.ICONS = ICONS;
  window.icon = function (name, fallback) {
    return ICONS[name] || ICONS[fallback || 'code'] || '';
  };
})();
