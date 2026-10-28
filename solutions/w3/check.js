'use strict';

/**
 * Workshop 3 check: the data track's DuckDB SQL produces a dataset.csv that
 * passes the gate's data rules, and the backend track's server matches the
 * reference numbers on the cleaned data (gate: data-quality + summary green).
 */

const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');

// The app lives in its own workshop repo (override with WORKSHOP_DIR).
const workshop = process.env.WORKSHOP_DIR
  ? path.resolve(process.env.WORKSHOP_DIR)
  : 'D:\\dev\\multi-agent-workshop';
const dropIn = path.join(__dirname, 'drop-in');

function fail(message) {
  console.log(`FAIL | ${message}`);
  process.exit(1);
}

const design = fs.readFileSync(path.join(dropIn, 'docs', 'DESIGN.md'), 'utf8');
if (!design.includes('reg_date') || !design.includes('capital') || !design.includes('2558')) {
  fail('DESIGN.md contract (พ.ศ. conversion, capital parsing)');
}
console.log('PASS | DESIGN.md covers the cleaning contract');

if (!fs.existsSync(path.join(dropIn, 'scripts', 'clean-export.sql'))) {
  fail('drop-in has scripts/clean-export.sql');
}
if (!fs.existsSync(path.join(dropIn, 'server.js'))) {
  fail('drop-in has the backend-track server.js');
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'registry-w3-'));
fs.cpSync(workshop, tmp, { recursive: true });
fs.cpSync(dropIn, tmp, { recursive: true });

const duck = spawnSync('duckdb', ['-c', '.read scripts/clean-export.sql'], {
  cwd: tmp,
  stdio: ['ignore', 'pipe', 'pipe'],
});
if (duck.status !== 0) fail(`clean-export.sql failed: ${duck.stderr}`);
const cleaned = fs.readFileSync(path.join(tmp, 'data', 'dataset.csv'), 'utf8');
const dataLines = cleaned.trim().split('\n').length - 1;
if (dataLines !== 16772) fail(`cleaned dataset has ${dataLines} rows, want 16772`);
console.log(`PASS | clean-export.sql produced 16772 clean rows`);

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function runNode(args, cwd, env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, { cwd, env });
    let stdout = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stdout += chunk; });
    child.on('close', (code) => resolve({ code, stdout }));
  });
}

(async () => {
  const gatePort = await freePort();
  const gate = await runNode([path.join(tmp, 'scripts', 'quality-gate.js')], tmp, {
    ...process.env,
    PORT: String(gatePort),
  });
  if (!gate.stdout.includes('PASS | data-quality')) fail(`data-quality still red\n${gate.stdout}`);
  if (!gate.stdout.includes('PASS | summary-matches-valid-rows')) fail(`summary still red\n${gate.stdout}`);
  console.log('PASS | gate: data-quality and summary green after the three tracks');
  console.log('w3 check: passed');
  process.exit(0);
})();
