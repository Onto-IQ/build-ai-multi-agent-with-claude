#!/usr/bin/env node
'use strict';

/**
 * Quality gate for Sales Insight.
 * Exit 0 when every case passes. Exit 2 when any case fails.
 * The starter data and server are expected to fail.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const net = require('net');
const path = require('path');
const { analyze } = require('../lib/inspect-sales');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 3000);
const ROOT = path.join(__dirname, '..');
const SERVER_PATH = path.join(ROOT, 'server.js');
const CSV_PATH = path.join(ROOT, 'data', 'sales.csv');
const BOOT_TIMEOUT_MS = 8000;
const REQ_TIMEOUT_MS = 4000;

const outcomes = [];
let child = null;
let childLog = '';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function report(name, pass, detail) {
  outcomes.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | ${detail}`);
}

function request(method, route, body) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    const req = http.request(
      {
        host: HOST,
        port: PORT,
        path: route,
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        timeout: REQ_TIMEOUT_MS,
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let json = null;
          let parsed = false;
          try {
            json = JSON.parse(text);
            parsed = true;
          } catch {
            parsed = false;
          }
          done({ status: res.statusCode || 0, text, json, parsed, error: null });
        });
      }
    );
    req.on('timeout', () => req.destroy(new Error(`timed out after ${REQ_TIMEOUT_MS}ms`)));
    req.on('error', (err) => done({ status: 0, text: '', json: null, parsed: false, error: err.message }));
    if (body) req.write(body);
    req.end();
  });
}

function portOpen() {
  return new Promise((resolve) => {
    const sock = net.connect({ host: HOST, port: PORT });
    const settle = (open) => {
      sock.destroy();
      resolve(open);
    };
    sock.setTimeout(500);
    sock.once('connect', () => settle(true));
    sock.once('error', () => settle(false));
    sock.once('timeout', () => settle(false));
  });
}

function childDead() {
  return !child || child.exitCode !== null || child.signalCode !== null;
}

async function waitForPort() {
  const deadline = Date.now() + BOOT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await portOpen()) return true;
    if (childDead()) return false;
    await sleep(100);
  }
  return false;
}

function killChild() {
  if (!child || childDead()) return;
  try {
    child.kill('SIGKILL');
  } catch {
    // Already gone.
  }
}

async function stopServer() {
  if (!child || childDead()) return;
  killChild();
  const deadline = Date.now() + 2000;
  while (Date.now() < deadline && !childDead()) await sleep(50);
}

function countsText(counts) {
  return Object.keys(counts)
    .sort()
    .map((code) => `${code}=${counts[code]}`)
    .join(', ');
}

async function main() {
  let csvText = '';
  try {
    csvText = fs.readFileSync(CSV_PATH, 'utf8');
  } catch (err) {
    report('data-quality', false, `cannot read sales.csv (${err.message})`);
    report('bad-json-does-not-crash', false, 'skipped');
    report('summary-matches-valid-rows', false, 'skipped');
    return 2;
  }

  const inspected = analyze(csvText);
  const qualityPass = inspected.violations.length === 0;
  report(
    'data-quality',
    qualityPass,
    qualityPass
      ? `0 violations, as-is orders=${inspected.stats.orderCount}`
      : `${inspected.violations.length} violations: ${countsText(inspected.counts)}`
  );

  if (await portOpen()) {
    const reason = `port ${PORT} is already in use`;
    console.log(reason);
    report('bad-json-does-not-crash', false, 'port busy before boot');
    report('summary-matches-valid-rows', false, 'port busy before boot');
    return 2;
  }

  child = spawn(process.execPath, [SERVER_PATH], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', (chunk) => {
    childLog += chunk;
  });
  child.stderr.on('data', (chunk) => {
    childLog += chunk;
  });

  if (!(await waitForPort())) {
    console.log(childLog.trim().slice(-500));
    report('bad-json-does-not-crash', false, 'server never became reachable');
    report('summary-matches-valid-rows', false, 'server never became reachable');
    return 2;
  }

  const bad = await request('POST', '/api/notes', 'not-json');
  await sleep(200);
  const alive = await request('GET', '/api/health');
  const crashPass = !childDead() && alive.status === 200 && alive.parsed && alive.json && alive.json.ok === true;
  report(
    'bad-json-does-not-crash',
    crashPass,
    `bad=${bad.error || bad.status}; health=${alive.error || alive.status}; dead=${childDead()}`
  );

  if (childDead()) {
    await stopServer();
    child = null;
    childLog = '';
    child = spawn(process.execPath, [SERVER_PATH], {
      cwd: ROOT,
      env: { ...process.env, PORT: String(PORT) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout.on('data', (chunk) => {
      childLog += chunk;
    });
    child.stderr.on('data', (chunk) => {
      childLog += chunk;
    });
    if (!(await waitForPort())) {
      report('summary-matches-valid-rows', false, 'server did not restart for the summary case');
      const failedEarly = outcomes.filter((ok) => !ok).length;
      console.log(`quality gate: ${failedEarly} of ${outcomes.length} cases failed`);
      return 2;
    }
  }

  const summary = await request('GET', '/api/summary');
  const expected = inspected.stats;
  const gotRevenue = summary.parsed && summary.json ? Number(summary.json.totalRevenue) : NaN;
  const gotOrders = summary.parsed && summary.json ? Number(summary.json.orderCount) : NaN;
  const summaryPass =
    summary.status === 200 &&
    gotRevenue === expected.totalRevenue &&
    gotOrders === expected.orderCount;
  report(
    'summary-matches-valid-rows',
    summaryPass,
    `serverRevenue=${gotRevenue} expected=${expected.totalRevenue} serverOrders=${gotOrders} expectedOrders=${expected.orderCount}`
  );

  const failed = outcomes.filter((ok) => !ok).length;
  console.log(
    failed === 0
      ? `quality gate: ${outcomes.length}/${outcomes.length} passed`
      : `quality gate: ${failed} of ${outcomes.length} cases failed`
  );
  return failed === 0 ? 0 : 2;
}

process.on('exit', killChild);
process.on('SIGINT', () => {
  killChild();
  process.exit(2);
});
process.on('SIGTERM', () => {
  killChild();
  process.exit(2);
});

main()
  .then((code) => stopServer().then(() => process.exit(code)))
  .catch((err) => {
    console.log(`quality gate aborted: ${err && err.stack ? err.stack : err}`);
    return stopServer().then(() => process.exit(2));
  });
