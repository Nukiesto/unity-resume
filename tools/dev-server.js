#!/usr/bin/env node
/*
 * Local dev server for the portfolio site.
 * Used as a fallback by serve.bat when Python is not available.
 *
 *   node tools/dev-server.js [port]
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = parseInt(process.argv[2], 10) || 8080;
const HOST = '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.gz': 'application/gzip',
  '.br': 'application/octet-stream',
  '.wasm': 'application/wasm',
  '.data': 'application/octet-stream',
  '.unityweb': 'application/octet-stream',
  '.bin': 'application/octet-stream',
  '.bundle': 'application/octet-stream',
  '.hash': 'application/octet-stream',
  '.resource': 'application/octet-stream'
};

function send(res, status, body, headers) {
  res.writeHead(status, Object.assign({ 'Cache-Control': 'no-store' }, headers || {}));
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method Not Allowed', { 'Content-Type': 'text/plain; charset=utf-8' });
  }

  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  } catch (e) {
    return send(res, 400, 'Bad Request', { 'Content-Type': 'text/plain; charset=utf-8' });
  }

  if (urlPath.endsWith('/')) urlPath += 'index.html';

  const filePath = path.resolve(path.join(ROOT, urlPath));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    return send(res, 403, 'Forbidden', { 'Content-Type': 'text/plain; charset=utf-8' });
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      return send(res, 404, 'Not Found: ' + urlPath, { 'Content-Type': 'text/plain; charset=utf-8' });
    }

    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    const headers = { 'Content-Type': type, 'Content-Length': stat.size };

    if (req.method === 'HEAD') {
      res.writeHead(200, Object.assign({ 'Cache-Control': 'no-store' }, headers));
      return res.end();
    }

    res.writeHead(200, Object.assign({ 'Cache-Control': 'no-store' }, headers));
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('\n  Port ' + PORT + ' is already in use.');
    console.error('  Try another one:  node tools/dev-server.js ' + (PORT + 1) + '\n');
  } else {
    console.error('\n  Server error: ' + err.message + '\n');
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const url = 'http://' + HOST + ':' + PORT + '/';
  console.log('');
  console.log('  Portfolio dev server');
  console.log('  --------------------');
  console.log('  Local:   ' + url);
  console.log('  Root:    ' + ROOT);
  console.log('');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\n  Stopped.\n');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 500);
});
