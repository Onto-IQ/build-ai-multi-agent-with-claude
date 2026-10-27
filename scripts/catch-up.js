#!/usr/bin/env node
'use strict';

/**
 * Copies a workshop solution into the repo root.
 * Usage: node scripts/catch-up.js w4
 */

const fs = require('fs');
const path = require('path');

const workshop = process.argv[2];
const known = new Set(['w1', 'w2', 'w3', 'w4', 'w5', 'w6']);
const root = path.join(__dirname, '..');

if (!known.has(workshop)) {
  console.error('usage: node scripts/catch-up.js <w1|w2|w3|w4|w5|w6>');
  process.exit(2);
}

const src = path.join(root, 'solutions', workshop, 'drop-in');
const dest = root;
fs.cpSync(src, dest, { recursive: true });
console.log(`catch-up: copied solutions/${workshop}/drop-in into the repo root`);
if (workshop === 'w5' || workshop === 'w6') {
  console.log('data/sales.csv is now the cleaned file.');
}
