#!/usr/bin/env node
'use strict';

/**
 * Registry Insight server — Workshop 3 backend track.
 * /api/summary now parses data/dataset.csv with the shared quoted-CSV reader
 * (lib/csv.js) and only counts rows the data dictionary accepts, so the
 * numbers match lib/inspect-data.js. Everything else is still the starter.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const HOST = '127.0.0.1';
const ROOT = __dirname;
const CSV_PATH = path.join(ROOT, 'data', 'dataset.csv');
const WEB_ROOT = path.join(ROOT, 'web');
const { parseCsv } = require(path.join(ROOT, 'lib', 'csv'));

// Sample value for the guardrails lab. It is not a live credential.
const SAMPLE_TOKEN = 'sk-sample-not-a-real-key';
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
  const { records } = parseCsv(fs.readFileSync(CSV_PATH, 'utf8'));
  let totalCapital = 0;
  let companyCount = 0;
  for (const record of records) {
    if (!/^\d{13}$/.test(String(record.reg_no || '').trim())) continue;
    const capital = Number(String(record.capital || '').replace(/[,\s]/g, ''));
    const regDate = String(record.reg_date || '').trim();
    if (!Number.isFinite(capital) || capital < 0) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(regDate)) continue;
    if (!String(record.company_name || '').trim()) continue;
    totalCapital = roundMoney(totalCapital + capital);
    companyCount += 1;
  }
  return { companyCount, totalCapital, source: 'registry-insight' };
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
    return sendJson(res, 200, { ok: true, sampleToken: SAMPLE_TOKEN });
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
      const body = JSON.parse(raw);
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
  console.log(`registry-insight listening on http://${HOST}:${PORT}`);
});
