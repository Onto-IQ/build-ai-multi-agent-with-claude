#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const repo = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
// The app lives in its own workshop repo; the course repo only ships lessons.
const workshop = process.env.WORKSHOP_DIR
  ? path.resolve(process.env.WORKSHOP_DIR)
  : 'C:\\dev\\multi-agent-workshop';
const skipClaude = process.argv.includes('--skip-claude');
const skipPrompt = skipClaude || process.argv.includes('--skip-claude-prompt');

const problems = [];
const notes = [];

function note(message) {
  notes.push(message);
  console.log(`OK   | ${message}`);
}

function warn(message) {
  notes.push(message);
  console.log(`WARN | ${message}`);
}

function bad(message) {
  problems.push(message);
  console.log(`FAIL | ${message}`);
}

function parseVersion(text) {
  const match = /(\d+)\.(\d+)\.(\d+)/.exec(text);
  if (!match) return null;
  return match.slice(1, 4).map(Number);
}

function atLeast(found, minimum) {
  if (!found) return false;
  for (let i = 0; i < minimum.length; i += 1) {
    if (found[i] > minimum[i]) return true;
    if (found[i] < minimum[i]) return false;
  }
  return true;
}

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

function portOpen(port) {
  return new Promise((resolve) => {
    const sock = net.connect({ host: '127.0.0.1', port });
    const settle = (open) => {
      sock.destroy();
      resolve(open);
    };
    sock.setTimeout(400);
    sock.once('connect', () => settle(true));
    sock.once('error', () => settle(false));
    sock.once('timeout', () => settle(false));
  });
}

function get(port, route) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path: route, timeout: 4000 }, (res) => {
      res.resume();
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
  });
}

function runNode(args, cwd, env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, { cwd, env });
    let stdout = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stdout += chunk;
    });
    child.on('close', (code) => resolve({ code, stdout }));
  });
}

async function commandVersion(bin, args) {
  try {
    const result = await exec(bin, args, { windowsHide: true });
    return `${result.stdout || ''}${result.stderr || ''}`.trim();
  } catch (err) {
    return null;
  }
}

async function main() {
  if (existsSync(path.join(repo, 'Lessons'))) {
    note('course repo has Lessons/ lesson folders');
  } else {
    bad('course repo is missing Lessons/ — re-clone the course repo');
  }

  if (existsSync(path.join(workshop, 'server.js')) && existsSync(path.join(workshop, 'package.json'))) {
    note(`workshop project found at ${workshop}`);
    if (existsSync(path.join(workshop, 'data', 'raw', 'dbd-2558.parquet')) && existsSync(path.join(workshop, 'data', 'warehouse.duckdb'))) {
      note('workshop has the real dataset (dbd-2558.parquet + warehouse.duckdb)');
    } else {
      bad('workshop data is incomplete: expected data/raw/dbd-2558.parquet and data/warehouse.duckdb — re-clone or git pull the workshop repo');
    }
    if (existsSync(path.join(workshop, '.mcp.json'))) {
      warn('workshop already has .mcp.json — starter should not; learners add it in Workshop 6 (MCP). Remove it if you are resetting to day-1 state.');
    }
  } else {
    bad(`workshop project not found at ${workshop}. Clone the workshop repo your instructor shared into that path (or set WORKSHOP_DIR to your copy), then re-run this script.`);
  }

  const nodeVersion = parseVersion(process.version);
  if (atLeast(nodeVersion, [20, 0, 0])) note(`node ${process.version}`);
  else bad(`node ${process.version} is below 20`);

  const gitText = await commandVersion('git', ['--version']);
  if (gitText) note(gitText);
  else bad('git is not on PATH');

  const duckText = await commandVersion('duckdb', ['--version']);
  if (duckText) note(`duckdb ${duckText}`);
  else bad('duckdb is not on PATH. Install the DuckDB CLI and add it to PATH (see SETUP.md)');

  const uvText = await commandVersion('uvx', ['--version']);
  if (uvText) note(`uvx ${uvText} (runs the DuckDB MCP server)`);
  else warn('uv is not on PATH — the data-duckdb MCP server needs it (see SETUP.md)');

  if (await portOpen(3000)) warn('port 3000 is in use. Stop that process or set PORT before npm start');
  else note('port 3000 is free');

  const appPort = await freePort();
  const server = spawn(process.execPath, ['server.js'], {
    cwd: workshop,
    env: { ...process.env, PORT: String(appPort) },
    stdio: 'ignore',
  });
  try {
    let status = 0;
    const deadline = Date.now() + 8000;
    while (Date.now() < deadline && status !== 200) {
      try {
        status = await get(appPort, '/');
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    if (status === 200) note(`app homepage responded on port ${appPort}`);
    else bad('app server did not serve /');
  } finally {
    if (server.exitCode === null) server.kill('SIGKILL');
  }

  const gatePort = await freePort();
  const gate = await runNode(['scripts/quality-gate.js'], workshop, { ...process.env, PORT: String(gatePort) });
  if (gate.code === 2 && gate.stdout.includes('FAIL | data-quality')) {
    note('starter quality gate exits 2 (this is the intended starting state)');
  } else {
    bad(`starter quality gate expected exit 2, got ${gate.code}`);
  }

  if (skipClaude) {
    warn('skipped Claude Code checks (--skip-claude)');
  } else {
    const claudeText = await commandVersion('claude', ['--version']);
    const claudeVersion = parseVersion(claudeText || '');
    if (!claudeText) bad('claude is not on PATH. Install with: npm install -g @anthropic-ai/claude-code');
    else if (!atLeast(claudeVersion, [2, 1, 296])) bad(`${claudeText} is below 2.1.296. Run: claude update`);
    else note(claudeText.split('\n')[0]);

    if (!skipPrompt && claudeText && atLeast(claudeVersion, [2, 1, 296])) {
      const prompt = await runNodeProcess('claude', ['-p', 'Reply with exactly: CLAUDE-OK'], workshop);
      if (prompt.code === 0 && prompt.stdout.includes('CLAUDE-OK')) note('claude -p returned CLAUDE-OK');
      else bad('claude -p did not return CLAUDE-OK. Log in with claude, and unset ANTHROPIC_API_KEY if it overrides the class login.');
    } else if (skipPrompt) {
      warn('skipped claude -p (--skip-claude-prompt)');
    }
  }

  if (problems.length > 0) {
    console.log(`verify-setup: ${problems.length} problem(s)`);
    process.exit(1);
  }
  console.log('verify-setup: passed');
}

function runNodeProcess(bin, args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(bin, args, { cwd: cwd || repo, windowsHide: true });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
    }, 45000);
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
