#!/usr/bin/env node

import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const workshops = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'];

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

function run(script, args, options) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script, ...args], options);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

async function main() {
  const port = await freePort();
  const gate = await run(path.join(repo, 'sandbox', 'sales-insight', 'scripts', 'quality-gate.js'), [], {
    cwd: path.join(repo, 'sandbox', 'sales-insight'),
    env: { ...process.env, PORT: String(port) },
  });
  const starterOk =
    gate.code === 2 &&
    gate.stdout.includes('FAIL | data-quality') &&
    gate.stdout.includes('FAIL | bad-json-does-not-crash') &&
    gate.stdout.includes('FAIL | summary-matches-valid-rows');
  if (!starterOk) {
    console.log(gate.stdout);
    console.log(gate.stderr);
    console.error(`starter gate expected exit 2 with three FAIL lines, got ${gate.code}`);
    process.exit(1);
  }
  console.log('PASS | starter quality gate fails as designed');

  for (const workshop of workshops) {
    const result = await run(path.join(repo, 'solutions', workshop, 'check.js'), [], { cwd: repo });
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    if (result.code !== 0) {
      console.error(`${workshop} check failed with exit ${result.code}`);
      process.exit(result.code || 1);
    }
  }
  console.log('PASS | solutions w1-w6');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
