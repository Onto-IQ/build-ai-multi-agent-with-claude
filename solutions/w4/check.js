#!/usr/bin/env node
'use strict';

/**
 * Workshop 4 check: the fixed server must survive bad payloads, validate
 * note bodies, leak no secrets on /api/health, and persist notes to disk
 * across a real process restart.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

// The app lives in its own workshop repo (override with WORKSHOP_DIR).
const workshop = process.env.WORKSHOP_DIR
  ? path.resolve(process.env.WORKSHOP_DIR)
  : 'D:\\dev\\multi-agent-workshop';
const dropIn = path.join(__dirname, 'drop-in');

let ok = true;
function check(label, cond) {
  console.log(`${cond ? 'PASS' : 'FAIL'} | ${label}`);
  if (!cond) ok = false;
}

function request(port, method, route, body) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path: route, method, timeout: 4000 }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
    if (body) req.write(body);
    req.end();
  });
}

function boot(tmp, port) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['server.js'], { cwd: tmp, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
    const deadline = Date.now() + 8000;
    const poke = setInterval(() => {
      request(port, 'GET', '/api/health')
        .then((res) => {
          if (res.status === 200) {
            clearInterval(poke);
            resolve(child);
          }
        })
        .catch(() => {});
      if (Date.now() > deadline) {
        clearInterval(poke);
        reject(new Error('server boot timeout'));
      }
    }, 150);
  });
}

async function main() {
  const qaReport = fs.existsSync(path.join(dropIn, 'docs', 'QA-REPORT.md'));
  check('drop-in has docs/QA-REPORT.md with the three findings', qaReport);
  const qaAgent = fs.readFileSync(path.join(dropIn, '.claude', 'agents', 'qa.md'), 'utf8');
  check('qa agent has Bash in tools', /tools:.*Bash/.test(qaAgent));

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sales-w4-'));
  fs.cpSync(workshop, tmp, { recursive: true });
  fs.cpSync(dropIn, tmp, { recursive: true });
  const appPort = 3100 + Math.floor(Math.random() * 500);
  let server = await boot(tmp, appPort);
  try {
    const bad = await request(appPort, 'POST', '/api/notes', 'not-json');
    check(`POST not-json answers ${bad.status} (not a crash)`, bad.status === 400);
    const health = await request(appPort, 'GET', '/api/health');
    check('server still answers /api/health after the bad POST', health.status === 200);
    check('/api/health leaks no sk- value', !health.body.includes('sk-'));

    const nope = await request(appPort, 'POST', '/api/notes', JSON.stringify({ nope: 1 }));
    check(`POST without text answers ${nope.status} (want 400)`, nope.status === 400);

    const mark = `w4-check-${Date.now()}`;
    const stored = await request(appPort, 'POST', '/api/notes', JSON.stringify({ text: mark }));
    check(`POST valid note answers ${stored.status} (want 201)`, stored.status === 201);
    const readBack = await request(appPort, 'GET', '/api/notes');
    check('GET /api/notes returns the stored note', readBack.status === 200 && readBack.body.includes(mark));

    // Real persistence: kill the process, boot a fresh one, note survives.
    server.kill('SIGKILL');
    await new Promise((r) => setTimeout(r, 400));
    server = await boot(tmp, appPort);
    const after = await request(appPort, 'GET', '/api/notes');
    check('note survives a full server restart', after.status === 200 && after.body.includes(mark));
  } finally {
    if (server && server.exitCode === null) server.kill('SIGKILL');
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(ok ? 'w4 check: passed' : 'w4 check: failed');
  process.exit(ok ? 0 : 1);
}

main().catch((err) => { console.error(err); process.exit(1); });
