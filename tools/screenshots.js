#!/usr/bin/env node
/*
 * Scans assets/img/screenshots/<project-id>/ and writes data/screenshots.json.
 *
 * Drop image files into a project folder and run this script (or just start
 * serve.bat / serve.ps1 — they run it automatically). The site then uses the
 * first image as the card cover and shows all of them in the project modal.
 *
 * Cover rules, in order:
 *   1. a file whose name starts with "cover" or "обложка"
 *   2. otherwise the first image after natural sorting (1, 2, 10, ...)
 *
 *   node tools/screenshots.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SHOTS_DIR = path.join(ROOT, 'assets', 'img', 'screenshots');
const OUT_FILE = path.join(ROOT, 'data', 'screenshots.json');
const REL_PREFIX = 'assets/img/screenshots/';

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

const natural = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

function isImage(name) {
  return IMAGE_EXT.has(path.extname(name).toLowerCase());
}

function isCover(name) {
  const base = name.toLowerCase();
  return base.startsWith('cover') || base.startsWith('обложка');
}

function listImages(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return { images: [], count: 0 };
  }

  const files = entries
    .filter((e) => e.isFile() && isImage(e.name))
    .map((e) => e.name)
    .sort((a, b) => natural.compare(a, b));

  if (!files.length) return { images: [], count: 0 };

  const coverIdx = files.findIndex(isCover);
  if (coverIdx > 0) {
    const [cover] = files.splice(coverIdx, 1);
    files.unshift(cover);
  }

  return { images: files, count: files.length };
}

function main() {
  if (!fs.existsSync(SHOTS_DIR)) {
    console.error('Missing folder: ' + SHOTS_DIR);
    process.exit(1);
  }

  const projects = {};
  let projectsWithShots = 0;
  let totalImages = 0;

  const dirs = fs.readdirSync(SHOTS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => natural.compare(a, b));

  for (const id of dirs) {
    const { images, count } = listImages(path.join(SHOTS_DIR, id));
    if (!count) continue;

    const urls = images.map((f) => REL_PREFIX + id + '/' + f);
    projects[id] = { cover: urls[0], images: urls };
    projectsWithShots++;
    totalImages += count;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    projectCount: projectsWithShots,
    imageCount: totalImages,
    projects
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8');

  console.log('screenshots.json: ' + projectsWithShots + ' project(s), ' + totalImages + ' image(s)');
  if (!projectsWithShots) {
    console.log('  (folders are empty — drop images into assets/img/screenshots/<project-id>/)');
  }
}

main();
