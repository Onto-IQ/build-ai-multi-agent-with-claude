#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const skillPath = path.join(__dirname, 'drop-in', '.claude', 'skills', 'release-checklist', 'SKILL.md');
const managerPath = path.join(__dirname, 'release-manager.md');

let ok = true;
function check(label, cond) {
  console.log(`${cond ? 'PASS' : 'FAIL'} | ${label}`);
  if (!cond) ok = false;
}

const skill = fs.readFileSync(skillPath, 'utf8');
check('SKILL.md frontmatter has name release-checklist', /name:\s*release-checklist/.test(skill));
check('SKILL.md description is English and about releasing', /description:\s*"Use before releasing the Sales Insight app"/.test(skill));
const fourChecks = ['server', 'quality-gate', 'sk-', 'stopped'].every((word) => skill.toLowerCase().includes(word));
check('SKILL.md body covers the four checks', fourChecks);

const manager = fs.readFileSync(managerPath, 'utf8');
check('release-manager.md has skills: release-checklist', /skills:\s*release-checklist/.test(manager));
check('release-manager.md has Bash in tools', /tools:.*Bash/.test(manager));
check('release-manager.md forbids printing sk- values', /sk-/.test(manager));

console.log(ok ? 'w5 check: passed' : 'w5 check: failed');
process.exit(ok ? 0 : 1);
