#!/usr/bin/env node
'use strict';

/**
 * Copies a workshop solution into the workshop project (the app repo where
 * learners run claude). Usage: node scripts/catch-up.js w4
 * The default workshop path can be overridden with the WORKSHOP_DIR env var.
 */

const fs = require('fs');
const path = require('path');

const workshop = process.argv[2];
const known = new Set(['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9']);
const root = path.join(__dirname, '..');
const dest = process.env.WORKSHOP_DIR
  ? path.resolve(process.env.WORKSHOP_DIR)
  : 'C:\\dev\\multi-agent-workshop';

if (!known.has(workshop)) {
  console.error('usage: node scripts/catch-up.js <w1|...|w9>');
  process.exit(2);
}

if (!fs.existsSync(path.join(dest, 'server.js'))) {
  console.error(`catch-up: workshop project not found at ${dest}`);
  console.error('clone the workshop repo your instructor shared into that path (or set WORKSHOP_DIR), then re-run');
  process.exit(1);
}

const src = path.join(root, 'solutions', workshop, 'drop-in');
fs.cpSync(src, dest, { recursive: true });
console.log(`catch-up: copied solutions/${workshop}/drop-in into ${dest}`);
if (['w3', 'w4', 'w7', 'w9'].includes(workshop)) {
  console.log('data/dataset.csv is now the cleaned file.');
}
