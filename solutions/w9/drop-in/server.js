#!/usr/bin/env node
'use strict';

/**
 * Sales Insight server — capstone release build (Workshop 9).
 * All Workshop 4 fixes (safe JSON, validation, persisted notes, clean health)
 * plus the release summary served from lib/summary.js, which is the same
 * module the Vercel function in api/summary.js uses.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const HOST = '127.0.0.1';
const ROOT = __dirname;
const CSV_PATH = path.join(ROOT, 'data', 'dataset.csv');
const NOTES_PATH = path.join(ROOT, 'data', 'notes.json');
const WEB_ROOT = path.join(ROOT, 'web');
const { parseCsv } = require(path.join(ROOT, 'lib', 'csv'));
const { buildSummary } = require(path.join(ROOT, 'lib', 'summary'));

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readNotes() {
  try {
    const parsed = JSON.parse(fs.readFileSync(NOTES_PATH, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(NOTES_PATH, `${JSON.stringify(notes, null, 2)}\n`);
}

function contentType(filePath) {
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

function serveStatic(res, fileName) {
  const resolved = path.resolve(WEB_ROOT, fileName);
  const rel = path.relative(WEB_ROOT, resolved);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('not found');
    return;
  }
  fs.readFile(resolved, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType(resolved), 'Content-Length': buf.length });
    res.end(buf);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);

  if (url.pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true });
  }

  if (url.pathname === '/api/summary' && req.method === 'GET') {
    try {
      const { records } = parseCsv(fs.readFileSync(CSV_PATH, 'utf8'));
      return sendJson(res, 200, buildSummary(records));
    } catch (err) {
      console.error('summary failed', err);
      return sendJson(res, 500, { error: 'SUMMARY_FAILED' });
    }
  }

  if (url.pathname === '/api/notes' && req.method === 'POST') {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      let body;
      try {
        body = JSON.parse(raw);
      } catch (err) {
        return sendJson(res, 400, { error: 'INVALID_JSON' });
      }
      if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return sendJson(res, 400, { error: 'INVALID_JSON' });
      }
      const text = typeof body.text === 'string' ? body.text.trim() : '';
      if (!text) {
        return sendJson(res, 400, { error: 'INVALID_TEXT' });
      }
      const notes = readNotes();
      notes.push({ text: text.slice(0, 200), at: new Date().toISOString() });
      saveNotes(notes);
      sendJson(res, 201, { ok: true, count: notes.length });
    });
    return;
  }

  if (url.pathname === '/api/notes' && req.method === 'GET') {
    return sendJson(res, 200, { notes: readNotes() });
  }

  if (req.method === 'GET') {
    if (url.pathname === '/' || url.pathname === '/index.html') return serveStatic(res, 'index.html');
    if (url.pathname === '/styles.css') return serveStatic(res, 'styles.css');
    if (url.pathname === '/app.js') return serveStatic(res, 'app.js');
  }

  sendJson(res, 404, { error: 'NOT_FOUND' });
});

server.listen(PORT, HOST, () => {
  console.log(`sales-insight listening on http://${HOST}:${PORT}`);
});
