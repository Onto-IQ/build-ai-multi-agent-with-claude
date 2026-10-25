'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');

const repo = path.join(__dirname, '..', '..');
const sandbox = path.join(repo, 'sandbox', 'sales-insight');
const dropIn = path.join(__dirname, 'drop-in');

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

function runNode(script, args, options) {
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

function get(port, route) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path: route }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, text: Buffer.concat(chunks).toString('utf8') });
      });
    });
    req.on('error', reject);
  });
}

function fail(message) {
  console.log(`FAIL | ${message}`);
  process.exit(1);
}

function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const fence = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!fence) return null;
  const meta = {};
  for (const line of fence[1].split(/\r?\n/)) {
    const match = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (match) meta[match[1]] = match[2].trim();
  }
  return meta;
}

async function main() {
  const handler = require(path.join(dropIn, 'api', 'summary.js'));
  const apiBody = await new Promise((resolve) => {
    const res = {
      statusCode: 0,
      headers: {},
      setHeader(name, value) {
        this.headers[name] = value;
      },
      end(payload) {
        resolve(JSON.parse(payload));
      },
    };
    handler({}, res);
  });
  if (apiBody.totalRevenue !== 10778 || apiBody.orderCount !== 16) {
    fail(`api/summary ${JSON.stringify(apiBody)}`);
  }
  console.log('PASS | api/summary.js returns 16 orders and 10778');

  const summaryMd = fs.readFileSync(path.join(dropIn, 'docs', 'EXECUTIVE-SUMMARY.md'), 'utf8');
  for (const phrase of ['10778', '16', 'กลาง', 'สาขา', 'เซ็ตของฝาก', '## ยอดขาย', '## ข้อเสนอแนะ']) {
    if (!summaryMd.includes(phrase)) fail(`executive summary missing ${phrase}`);
  }
  console.log('PASS | executive summary');

  const spec = fs.readFileSync(path.join(dropIn, 'docs', 'PRODUCT-SPEC.md'), 'utf8');
  const tasks = fs.readFileSync(path.join(dropIn, 'docs', 'TASKS.md'), 'utf8');
  if (!spec.includes('/api/summary') || !tasks.includes('T3') || !tasks.includes('T1')) fail('shared contract');
  console.log('PASS | PRODUCT-SPEC and TASKS');

  const roles = ['planner', 'researcher', 'developer', 'writer', 'qa'];
  for (const role of roles) {
    const meta = frontmatter(path.join(dropIn, '.claude', 'agents', `${role}.md`));
    if (!meta || meta.name !== role || !meta.description || !meta.tools || !meta.model) fail(`agent ${role}`);
  }
  console.log('PASS | 5 role agents');

  const vercel = fs.readFileSync(path.join(dropIn, 'vercel.json'), 'utf8');
  if (!vercel.includes('api/summary.js')) fail('vercel.json');
  console.log('PASS | vercel.json points at api/summary.js');

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sales-w6-'));
  const port = await freePort();
  let child = null;
  try {
    fs.cpSync(sandbox, tmp, { recursive: true });
    fs.cpSync(dropIn, tmp, { recursive: true });
    const gate = await runNode(path.join(tmp, 'scripts', 'quality-gate.js'), [], {
      cwd: tmp,
      env: { ...process.env, PORT: String(port) },
    });
    if (gate.code !== 0 || !gate.stdout.includes('quality gate: 3/3 passed')) {
      fail(`quality gate exit ${gate.code}\n${gate.stdout}`);
    }
    console.log('PASS | capstone overlay passes the quality gate');

    const appPort = await freePort();
    child = spawn(process.execPath, ['server.js'], {
      cwd: tmp,
      env: { ...process.env, PORT: String(appPort) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('server boot timeout')), 8000);
      const poke = setInterval(() => {
        get(appPort, '/api/health').then(() => {
          clearTimeout(timer);
          clearInterval(poke);
          resolve();
        }).catch(() => {});
      }, 100);
    });
    const health = await get(appPort, '/api/health');
    if (health.status !== 200 || health.text.includes('sk-') || health.text.includes('sampleToken')) {
      fail(`health leak or status ${health.status} ${health.text}`);
    }
    console.log('PASS | health has no sample token');
    const page = await get(appPort, '/');
    if (page.status !== 200 || !page.text.includes('ยอดขายหลังทำความสะอาดข้อมูล')) fail('dashboard html');
    console.log('PASS | dashboard html');
    const summary = JSON.parse((await get(appPort, '/api/summary')).text);
    if (summary.totalRevenue !== 10778 || !summary.topRegion || summary.topRegion.name !== 'กลาง') {
      fail(`live summary ${JSON.stringify(summary)}`);
    }
    console.log('PASS | live /api/summary');
  } finally {
    if (child && child.exitCode === null) {
      await new Promise((resolve) => {
        child.once('exit', resolve);
        child.kill('SIGKILL');
        setTimeout(resolve, 2000);
      });
    }
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        fs.rmSync(tmp, { recursive: true, force: true });
        break;
      } catch (err) {
        if (attempt === 4) throw err;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }
  console.log('w6 check: passed');
}

main().catch((err) => fail(err.stack || err.message));
