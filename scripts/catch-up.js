#!/usr/bin/env node
'use strict';

/**
 * Copies a workshop solution into the workshop project (the app repo where
 * learners run claude). Usage: node scripts/catch-up.js w4
 *
 * Destination resolution (see scripts/workshop-dir.js):
 *   WORKSHOP_DIR env → .env.local → .env → C:\dev\multi-agent-workshop
 */

const fs = require('fs');
const path = require('path');
const { resolveWorkshopDir } = require('./workshop-dir');

const workshop = process.argv[2];
const known = new Set(['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9']);
const root = path.join(__dirname, '..');
const { dir: dest, source } = resolveWorkshopDir();

if (!known.has(workshop)) {
  console.error('usage: node scripts/catch-up.js <w1|...|w9>');
  process.exit(2);
}

console.log(`catch-up: target workshop = ${dest} (from ${source})`);

if (!fs.existsSync(path.join(dest, 'server.js'))) {
  console.error(`catch-up: workshop project not found at ${dest}`);
  console.error('clone into C:\\dev\\multi-agent-workshop, or set WORKSHOP_DIR / copy .env.example → .env');
  process.exit(1);
}

const src = path.join(root, 'solutions', workshop, 'drop-in');
if (!fs.existsSync(src)) {
  if (workshop === 'w8') {
    console.log('catch-up: w8 has no drop-in (feature is learner-chosen).');
    console.log('See solutions/w8/FEATURE-CRITERIA.md for the acceptance criteria.');
    process.exit(0);
  }
  console.error(`catch-up: missing solutions/${workshop}/drop-in`);
  process.exit(1);
}

fs.cpSync(src, dest, { recursive: true });
console.log(`catch-up: copied solutions/${workshop}/drop-in → ${dest}`);
if (['w7', 'w9'].includes(workshop)) {
  console.log('data/dataset.csv is now the cleaned file.');
}
