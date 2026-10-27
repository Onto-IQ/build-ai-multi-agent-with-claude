'use strict';

const fs = require('fs');
const path = require('path');
const { clean } = require('./drop-in/scripts/clean-sales');
const { analyze } = require('../../lib/inspect-sales');

const root = path.join(__dirname, '..', '..');
const messyPath = path.join(root, 'data', 'sales.csv');
const committedPath = path.join(__dirname, 'drop-in', 'data', 'sales.clean.csv');
const design = fs.readFileSync(path.join(__dirname, 'drop-in', 'docs', 'DESIGN.md'), 'utf8');
const review = fs.readFileSync(path.join(__dirname, 'drop-in', 'docs', 'REVIEW.md'), 'utf8');

const expectedIds = [
  'ORD-1001', 'ORD-1002', 'ORD-1003', 'ORD-1004', 'ORD-1005', 'ORD-1006', 'ORD-1007',
  'ORD-1010', 'ORD-1011', 'ORD-1012', 'ORD-1016', 'ORD-1018', 'ORD-1019', 'ORD-1020',
  'ORD-1021', 'ORD-1022',
];

function fail(message) {
  console.log(`FAIL | ${message}`);
  process.exit(1);
}

const fresh = clean(fs.readFileSync(messyPath, 'utf8'));
const committed = fs.readFileSync(committedPath, 'utf8').replace(/\r\n/g, '\n');
if (fresh !== committed) fail('committed sales.clean.csv differs from a fresh clean run');
console.log('PASS | committed csv matches cleaner');

const inspected = analyze(fresh);
if (inspected.violations.length !== 0) fail(`clean csv still has ${inspected.violations.length} violations`);
console.log('PASS | clean csv has 0 violations');

const ids = inspected.asIsRows.map((row) => row.orderId);
if (ids.join() !== expectedIds.join()) fail(`ids ${ids.join(',')}`);
console.log('PASS | kept order ids');

if (inspected.stats.totalRevenue !== 10778) fail(`revenue ${inspected.stats.totalRevenue}`);
if (inspected.stats.orderCount !== 16) fail(`orders ${inspected.stats.orderCount}`);
console.log('PASS | 16 orders and 10778 THB');

if (!design.includes('duplicate-order-id') || !design.includes('qty * unit_price_thb')) fail('DESIGN.md contract');
console.log('PASS | DESIGN.md');
if (!review.includes('clean-sales.js') || !review.includes('DESIGN.md') || !review.includes('duplicate-order-id')) {
  fail('REVIEW.md');
}
console.log('PASS | REVIEW.md');
console.log('w4 check: passed');
