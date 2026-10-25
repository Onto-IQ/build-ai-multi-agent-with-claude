'use strict';

const fs = require('fs');
const path = require('path');

const report = fs.readFileSync(path.join(__dirname, 'drop-in', 'docs', 'EXPLORATION-REPORT.md'), 'utf8');
const required = [
  'server.js',
  'data/sales.csv',
  'scripts/quality-gate.js',
  'mcp/echo-server.js',
  'duplicate-order-id',
  'bad-date',
  '/api/summary',
  '/api/notes',
  'ห้ามแก้ไฟล์',
  '## โครงสร้าง',
  '## คุณภาพข้อมูล',
  '## จุดเสี่ยง',
];

let failed = 0;
for (const phrase of required) {
  const pass = report.includes(phrase);
  console.log(`${pass ? 'PASS' : 'FAIL'} | report contains ${phrase}`);
  if (!pass) failed += 1;
}

if (failed > 0) process.exit(1);
console.log('w1 check: passed');
