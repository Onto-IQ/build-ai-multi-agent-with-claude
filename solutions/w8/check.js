#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const crit = fs.readFileSync(path.join(__dirname, 'FEATURE-CRITERIA.md'), 'utf8');
let ok = true;
function check(label, cond) {
  console.log(`${cond ? 'PASS' : 'FAIL'} | ${label}`);
  if (!cond) ok = false;
}

check('criteria mentions deploy on Vercel', /Vercel/.test(crit));
check('criteria requires quality gate stays green', /quality gate/i.test(crit));
check('criteria requires at least two agents with handoff', /agents อย่างน้อย 2/.test(crit));
check('criteria forbids sk- and gate edits', /sk-/.test(crit) && /quality-gate\.js/.test(crit));

console.log(ok ? 'w8 check: passed' : 'w8 check: failed');
process.exit(ok ? 0 : 1);
