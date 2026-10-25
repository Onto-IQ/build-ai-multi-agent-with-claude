'use strict';

const fs = require('fs');
const path = require('path');

const text = fs.readFileSync(path.join(__dirname, 'drop-in', '.claude', 'agents', 'data-researcher.md'), 'utf8');
const fence = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(text);
if (!fence) {
  console.log('FAIL | frontmatter fence');
  process.exit(1);
}

const meta = {};
for (const line of fence[1].split(/\r?\n/)) {
  const match = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
  if (match) meta[match[1]] = match[2].trim();
}
const body = fence[2];
const tools = (meta.tools || '').split(',').map((item) => item.trim());
const checks = [
  ['name', meta.name === 'data-researcher'],
  ['description', /Use proactively/.test(meta.description || '')],
  ['tools Read', tools.includes('Read')],
  ['tools Grep', tools.includes('Grep')],
  ['tools Glob', tools.includes('Glob')],
  ['no Bash', !tools.includes('Bash')],
  ['no Edit', !tools.includes('Edit')],
  ['no Write', !tools.includes('Write')],
  ['model', meta.model === 'sonnet'],
  ['body evidence', /file:line/.test(body)],
  ['body read-only', /Read-only/.test(body)],
];

let failed = 0;
for (const [label, pass] of checks) {
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${label}`);
  if (!pass) failed += 1;
}
if (failed > 0) process.exit(1);
console.log('w2 check: passed');
