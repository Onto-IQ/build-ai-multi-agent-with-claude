#!/usr/bin/env node
'use strict';

// Black-box test for `POST /api/products`, against docs/DESIGN.md as the spec.
//
//   case-1  valid name + price + stock   -> 2xx, new server-assigned id (§3, §4.1, §8)
//   case-2  body with only `name`        -> 400, price reported (§4.2, §5 V3)
//   case-3  body with a foreign key      -> 400 + UNKNOWN_FIELD (§5 V5, §4.2)
//
// Boots `node server.js` itself, waits for the port, runs every case, and reaps
// the child on every exit path (including crash, Ctrl-C and watchdog timeout).
//
//   exit 0 -> all cases passed
//   exit 2 -> at least one case failed (or the server never came up)
//
// Pure Node, no dependencies. server.js is never modified.

const { spawn } = require('child_process');
const http = require('http');
const net = require('net');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 3100); // off 3000 so it need not clash with quality-gate
const SERVER_PATH = path.join(__dirname, '..', 'server.js');
const BOOT_TIMEOUT_MS = 8000;
const REQ_TIMEOUT_MS = 4000;
const WATCHDOG_MS = 45000;

const outcomes = [];
let child = null;
let childLog = '';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function report(name, pass, detail) {
  outcomes.push({ name, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | ${detail}`);
}

// A rejected request is still a verdict: a connection error means the server
// died, which must print FAIL rather than throw the runner down with it.
function request(method, route, body) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    const empty = (error) => ({ status: 0, headers: {}, text: '', json: null, parsed: false, error });

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
          done({ status: res.statusCode || 0, headers: res.headers || {}, text, json, parsed, error: null });
        });
      }
    );

    req.on('timeout', () => req.destroy(new Error(`timed out after ${REQ_TIMEOUT_MS}ms`)));
    req.on('error', (err) => done(empty(err.message)));
    if (body) req.write(body);
    req.end();
  });
}

// ---------------------------------------------------------------- spec helpers

// DESIGN.md §4.2 — every failure uses one envelope: error.{code,message,details}.
function envelope(res) {
  const err = res.parsed && res.json ? res.json.error : null;
  if (!err || typeof err !== 'object') return null;
  return err;
}

function envelopeShapeOk(res) {
  const err = envelope(res);
  if (!err) return false;
  const keys = Object.keys(err);
  if (keys.join(',') !== 'code,message,details') return false;
  if (!Array.isArray(err.details)) return false; // §4.2: details always present
  // §4.2: each details entry has exactly two keys, `field` then `rule`.
  return err.details.every((d) => d && Object.keys(d).join(',') === 'field,rule');
}

function ruleFor(res, field) {
  const err = envelope(res);
  if (!err || !Array.isArray(err.details)) return null;
  const hit = err.details.find((d) => d && d.field === field);
  return hit ? hit.rule : null;
}

function is2xx(status) {
  return status >= 200 && status <= 299;
}

function seen(res) {
  return res.error ? `no response (${res.error})` : `status=${res.status} body=${res.text.slice(0, 160)}`;
}

function maxId(items) {
  return items.reduce((max, p) => (p.id > max ? p.id : max), 0);
}

// ------------------------------------------------------------------ lifecycle

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
  for (const name of CASE_NAMES) report(name, false, reason);
}

const CASE_NAMES = [
  'case-1 create product (name+price+stock) -> 2xx with new id',
  'case-2 body missing price -> 400',
  'case-3 unknown field -> 400 + UNKNOWN_FIELD',
];

// ----------------------------------------------------------------- the 3 cases

async function case1() {
  const before = await request('GET', '/api/products');
  if (before.error || !before.parsed || !Array.isArray(before.json.items)) {
    report(CASE_NAMES[0], false, `could not read product list: ${seen(before)}`);
    return;
  }
  const expectedId = maxId(before.json.items) + 1;

  const payload = JSON.stringify({ name: '  Quality Gate Mug  ', price: 210, stock: 60 });
  const res = await request('POST', '/api/products', payload);

  // §4.1 / §8: 2xx, server-assigned id = current max + 1, price echoed as supplied.
  const created = res.parsed ? res.json : null;
  const okShape =
    is2xx(res.status) &&
    created &&
    typeof created === 'object' &&
    created.id === expectedId &&
    created.name === 'Quality Gate Mug' && // §5 note: trimmed once, trimmed value stored
    created.price === 210 &&
    created.stock === 60;
  const okLocation = res.headers.location === `/api/products/${expectedId}`;

  // §8 in-memory only: the new item must now be readable from the list and by id.
  const after = await request('GET', '/api/products');
  const listed =
    after.parsed && Array.isArray(after.json.items)
      ? after.json.items.some((p) => p.id === expectedId)
      : false;
  const byId = await request('GET', `/api/products/${expectedId}`);
  const readable = byId.status === 200 && byId.parsed && byId.json && byId.json.id === expectedId;

  const pass = okShape && okLocation && listed && readable && !childDead();
  const detail = okShape
    ? `status=${res.status} id=${created && created.id} Location=${res.headers.location || 'missing'} listed=${listed} getById=${byId.status}`
    : seen(res);
  report(CASE_NAMES[0], pass, childDead() ? `${detail}; server process is gone` : detail);
}

async function case2() {
  const before = await request('GET', '/api/products');
  const countBefore = before.parsed && Array.isArray(before.json.items) ? before.json.items.length : -1;

  // §3: only `name` sent, `price` absent (§5 V3 -> REQUIRED_NUMBER).
  const res = await request('POST', '/api/products', JSON.stringify({ name: 'No Price Mug' }));

  const okStatus = res.status === 400;
  const err = envelope(res);
  const okEnvelope = okEnvelopeAndCode(res);
  const priceRule = ruleFor(res, 'price');

  // §5: rules run before anything mutated — a rejected body creates nothing.
  const after = await request('GET', '/api/products');
  const countAfter = after.parsed && Array.isArray(after.json.items) ? after.json.items.length : -2;

  // §5: every failing rule is collected, so the also-missing `stock` is reported
  // too, and details order follows V2 -> V5 (price before stock).
  const stockRule = ruleFor(res, 'stock');

  const pass =
    okStatus &&
    okEnvelope &&
    priceRule === 'REQUIRED_NUMBER' &&
    stockRule === 'REQUIRED_INTEGER' &&
    countAfter === countBefore;
  const detail = pass
    ? `status=400 code=${err.code} price=${priceRule} stock=${stockRule} count stayed ${countBefore}`
    : seen(res);
  report(CASE_NAMES[1], pass, detail);
}

function okEnvelopeAndCode(res) {
  const err = envelope(res);
  return envelopeShapeOk(res) && err.code === 'VALIDATION_FAILED' && err.message === 'product failed validation';
}

async function case3() {
  // All three legal fields are valid, so UNKNOWN_FIELD is the only failure (V5).
  // §5 names exactly the traps this rule exists to catch: priceRange / prize / qty.
  const res = await request(
    'POST',
    '/api/products',
    JSON.stringify({ name: 'Trailing Comma Mug', price: 150, stock: 10, priceRange: 'cheap' })
  );

  const okStatus = res.status === 400;
  const err = envelope(res);
  const okEnvelope = okEnvelopeAndCode(res);
  const unknownRule = ruleFor(res, 'priceRange');
  // `name`, `price` and `stock` above are all valid, so V5 must be the *only*
  // entry — the accepted fields must not be dragged into the failure list too.
  const detailsCount = err && Array.isArray(err.details) ? err.details.length : -1;

  const after = await request('GET', '/api/products');
  const items = after.parsed && Array.isArray(after.json.items) ? after.json.items : null;
  const rejected = items ? !items.some((p) => p && p.name === 'Trailing Comma Mug') : false;

  const pass = okStatus && okEnvelope && unknownRule === 'UNKNOWN_FIELD' && detailsCount === 1 && rejected;
  const detail = pass
    ? `status=400 code=${err.code} details=[{field:'priceRange',rule:'UNKNOWN_FIELD'}]; nothing stored`
    : seen(res);
  report(CASE_NAMES[2], pass, detail);
}

// --------------------------------------------------------------------- runner

async function main() {
  // Refuse to test a server we did not start: a leftover process on the port
  // would make the run green for the wrong reasons.
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
    if (outcomes.length === 0) childLog += `\nchild exited early (code=${code} signal=${signal})`;
  });

  if (!(await waitForPort())) {
    console.log(`server did not listen on ${HOST}:${PORT} within ${BOOT_TIMEOUT_MS}ms`);
    console.log(childLog.trim().slice(-500));
    failAll('server never became reachable');
    return 2;
  }

  console.log(`POST /api/products — ${CASE_NAMES.length} cases against docs/DESIGN.md (port ${PORT})`);
  await case1();
  await case2();
  await case3();

  const failed = outcomes.filter((o) => !o.pass).length;
  console.log(
    failed === 0
      ? `test-create-product: ${outcomes.length}/${outcomes.length} passed`
      : `test-create-product: ${failed} of ${outcomes.length} cases failed`
  );
  if (failed > 0 && childLog.trim()) console.log('server log tail:', childLog.trim().slice(-400));
  return failed === 0 ? 0 : 2;
}

// However this process leaves, the child must leave with it.
const watchdog = setTimeout(() => {
  console.log('test-create-product aborted: watchdog fired after ' + WATCHDOG_MS + 'ms');
  failAll('watchdog timeout');
  killChild();
  process.exit(2);
}, WATCHDOG_MS);
watchdog.unref();

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
  console.log(`test-create-product aborted: ${err && err.stack ? err.stack : err}`);
  killChild();
  process.exit(2);
});

main()
  .then((code) => stopServer().then(() => process.exit(code)))
  .catch((err) => {
    console.log(`test-create-product aborted: ${err && err.stack ? err.stack : err}`);
    return stopServer().then(() => process.exit(2));
  });
