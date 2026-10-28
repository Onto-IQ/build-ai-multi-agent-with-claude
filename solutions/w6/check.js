'use strict';

/**
 * Workshop 6 check: the project-scope .mcp.json registers the official
 * read-only DuckDB MCP, and the team's analysis SQL produces the real
 * region totals the capstone writer will cite.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const workshop = process.env.WORKSHOP_DIR
  ? path.resolve(process.env.WORKSHOP_DIR)
  : 'C:\\dev\\multi-agent-workshop';
const dropIn = path.join(__dirname, 'drop-in');

function fail(message) {
  console.log(`FAIL | ${message}`);
  process.exit(1);
}

// Canonical config ships in the w6 drop-in (learners create it in Workshop 6 — starter has none).
const mcpPath = fs.existsSync(path.join(dropIn, '.mcp.json'))
  ? path.join(dropIn, '.mcp.json')
  : path.join(workshop, '.mcp.json');
if (!fs.existsSync(mcpPath)) fail('.mcp.json missing (expected in solutions/w6/drop-in or workshop after W6)');
const mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
const servers = mcpConfig.mcpServers || {};
const duck = Object.values(servers).find((s) => JSON.stringify(s).includes('mcp-server-motherduck'));
if (!duck) fail('.mcp.json has no DuckDB (mcp-server-motherduck) server');
if (JSON.stringify(duck).includes('--read-write')) fail('DuckDB MCP must stay read-only (no --read-write)');
if (!JSON.stringify(duck).includes('--python') || !JSON.stringify(duck).includes('3.12')) {
  fail('.mcp.json must pin uvx --python 3.12 (newer Python breaks cryptography build)');
}
console.log('PASS | .mcp.json registers the official read-only DuckDB MCP');

const analysisSql = fs.readFileSync(path.join(dropIn, 'scripts', 'analysis.sql'), 'utf8');
if (!analysisSql.includes('read_csv') || !analysisSql.includes('docs/region-capital.csv')) {
  fail('analysis.sql must read data/dataset.csv and export docs/region-capital.csv');
}
console.log('PASS | analysis.sql reads the cleaned dataset and exports region totals');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'registry-w6-'));
fs.cpSync(workshop, tmp, { recursive: true });
fs.cpSync(path.join(__dirname, '..', 'w3', 'drop-in'), tmp, { recursive: true });
fs.cpSync(dropIn, tmp, { recursive: true });

const clean = spawnSync('duckdb', ['-c', '.read scripts/clean-export.sql'], { cwd: tmp, stdio: 'ignore' });
if (clean.status !== 0) fail('clean-export.sql failed (w3 deliverable required)');
const analysis = spawnSync('duckdb', ['-c', '.read scripts/analysis.sql'], { cwd: tmp, stdio: 'ignore' });
if (analysis.status !== 0) fail('analysis.sql failed');

const expected = {
  กลาง: { companies: 10068, capital_thb: 31680888983 },
  ตะวันออก: { companies: 1813, capital_thb: 4171833600 },
  ใต้: { companies: 1584, capital_thb: 3617193200 },
  เหนือ: { companies: 1480, capital_thb: 2659568000 },
  อีสาน: { companies: 1480, capital_thb: 2607565001 },
  ตะวันตก: { companies: 347, capital_thb: 604820000 },
};
const lines = fs.readFileSync(path.join(tmp, 'docs', 'region-capital.csv'), 'utf8').trim().split('\n').slice(1);
let totalCompanies = 0;
for (const line of lines) {
  const [region, companies, capital] = line.split(',');
  const want = expected[region];
  if (!want) fail(`unexpected region ${region}`);
  if (Number(companies) !== want.companies || Number(capital) !== want.capital_thb) {
    fail(`${region}: got ${companies}/${capital}, want ${want.companies}/${want.capital_thb}`);
  }
  totalCompanies += Number(companies);
}
if (totalCompanies !== 16772) fail(`regions cover ${totalCompanies} companies, want 16772`);
console.log('PASS | region-capital.csv matches the real reference numbers (16,772 companies)');
console.log('w6 check: passed');
