#!/usr/bin/env node
'use strict';

/**
 * Workshop 5 server: survives invalid JSON and totals with per-line rounding.
 * Still uses a simple comma split, so the CSV must already be clean.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const HOST = '127.0.0.1';
const ROOT = __dirname;
const CSV_PATH = path.join(ROOT, 'data', 'sales.csv');
const WEB_ROOT = path.join(ROOT, 'web');
const notes = [];

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function summaryFromCsv() {
  const lines = fs.readFileSync(CSV_PATH, 'utf8').split(/\r?\n/).filter((line) => line.trim() !== '');
  const header = lines.shift().split(',').map((cell) => cell.trim());
  let totalRevenue = 0;
  let orderCount = 0;
  for (const line of lines) {
    const cells = line.split(',');
    const record = {};
    header.forEach((name, index) => {
      record[name] = (cells[index] || '').trim();
    });
    const qty = Number(record.qty);
    const price = Number(record.unit_price_thb);
    const discount = Number(record.discount_pct);
    if (!Number.isFinite(qty) || !Number.isFinite(price) || !Number.isFinite(discount)) continue;
    const lineRevenue = roundMoney(qty * price * (1 - discount / 100));
    totalRevenue = roundMoney(totalRevenue + lineRevenue);
    orderCount += 1;
  }
  return { orderCount, totalRevenue, source: 'workshop-5' };
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
      return sendJson(res, 200, summaryFromCsv());
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
      notes.push({ text: String(body.text || '').slice(0, 200) });
      sendJson(res, 201, { ok: true, count: notes.length });
    });
    return;
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
