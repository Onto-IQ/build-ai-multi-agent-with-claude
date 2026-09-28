#!/usr/bin/env node
'use strict';

// Quality gate for the demo-shop server.
//
// Boots `node server.js` as a child process, waits for the port to accept
// connections, runs three black-box cases, and reaps the child on every path.
//
//   exit 0 -> all cases passed
//   exit 2 -> at least one case failed (or the server never came up)
//
// Pure Node, no dependencies.

const { spawn } = require('child_process');
const http = require('http');
const net = require('net');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 3000);
const SERVER_PATH = path.join(__dirname, '..', 'server.js');
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

// Every case's verdict is computed from data, never from a thrown request:
// a connection error is how we detect a crashed server, and a crash must
// produce FAIL rather than taking the gate down with it.
function request(method, route, body) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    const empty = (error) => ({ status: 0, text: '', json: null, parsed: false, error });

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
        res.on('data', (c) => chunks.push(c));
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
    req.on('error', (err) => done(empty(err.message)));
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
    // Already gone; nothing to reap.
  }
}

async function stopServer() {
  if (!child || childDead()) return;
  killChild();
  const deadline = Date.now() + 2000;
  while (Date.now() < deadline && !childDead()) await sleep(50);
  if (!childDead()) killChild();
}

function failAll(reason) {
  for (const name of ['case-1 GET /api/products', 'case-2 cart/total invalid JSON', 'case-3 GET /api/products/999']) {
    report(name, false, reason);
  }
}

async function main() {
  // Refuse to test a server we did not start: a leftover process on the port
  // would otherwise make the gate green for the wrong reasons.
  if (await portOpen()) {
    console.log(`server.js did not start: port ${PORT} is already in use`);
    failAll('port busy before boot');
    return 2;
  }

  child = spawn(process.execPath, [SERVER_PATH], {
    cwd: path.dirname(SERVER_PATH),
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', (d) => {
    childLog += d;
  });
  child.stderr.on('data', (d) => {
    childLog += d;
  });
  child.on('exit', (code, signal) => {
    if (outcomes.length === 0) {
      childLog += `\nchild exited early (code=${code} signal=${signal})`;
    }
  });

  if (!(await waitForPort())) {
    console.log(`server did not listen on ${HOST}:${PORT} within ${BOOT_TIMEOUT_MS}ms`);
    console.log(childLog.trim().slice(-500));
    failAll('server never became reachable');
    return 2;
  }

  // --- Case 1: product list is served as JSON with an items array ---------
  {
    const name = 'case-1 GET /api/products';
    const res = await request('GET', '/api/products');
    const pass = res.status === 200 && res.parsed && res.json && Array.isArray(res.json.items);
    const detail = res.error
      ? `no response (${res.error})`
      : `status=${res.status} json=${res.parsed} items=${
          res.parsed && res.json && Array.isArray(res.json.items) ? res.json.items.length : 'n/a'
        }`;
    report(name, pass, detail);
  }

  // --- Case 2: malformed JSON must not take the server down --------------
  {
    const name = 'case-2 cart/total invalid JSON';
    const bad = await request('POST', '/api/cart/total', 'not-json');
    const alive = await request('GET', '/api/products');
    const pass = !childDead() && alive.status === 200;
    const badSeen = bad.error ? `no response (${bad.error})` : `status=${bad.status}`;
    const aliveSeen = alive.error ? `no response (${alive.error})` : `status=${alive.status}`;
    let detail = `bad request -> ${badSeen}; after it /api/products -> ${aliveSeen}`;
    if (childDead()) detail += '; server process is gone';
    else if (!pass && alive.status > 0) detail += '; server responded but degraded';
    report(name, pass, detail);
  }

  // --- Case 3: unknown product id is a 404, not a 200 with junk ----------
  {
    const name = 'case-3 GET /api/products/999';
    const res = await request('GET', '/api/products/999');
    const pass = res.status === 404;
    report(name, pass, res.error ? `no response (${res.error})` : `status=${res.status}`);
  }

  const failed = outcomes.filter((ok) => !ok).length;
  console.log(failed === 0 ? `quality gate: ${outcomes.length}/${outcomes.length} passed` : `quality gate: ${failed} of ${outcomes.length} cases failed`);
  return failed === 0 ? 0 : 2;
}

// Last-resort reaping: however this process leaves, the child must leave with it.
process.on('exit', killChild);
process.on('SIGINT', () => {
  killChild();
  process.exit(2);
});
process.on('SIGTERM', () => {
  killChild();
  process.exit(2);
});
process.on('uncaughtException', (err) => {
  console.log(`quality gate aborted: ${err && err.stack ? err.stack : err}`);
  killChild();
  process.exit(2);
});

main()
  .then((code) => stopServer().then(() => process.exit(code)))
  .catch((err) => {
    console.log(`quality gate aborted: ${err && err.stack ? err.stack : err}`);
    return stopServer().then(() => process.exit(2));
  });
