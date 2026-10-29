'use strict';

const fs = require('fs');
const path = require('path');

function checkFile(relPath, required) {
  const full = path.join(__dirname, 'drop-in', relPath);
  const body = fs.readFileSync(full, 'utf8');
  let failed = 0;
  for (const phrase of required) {
    const pass = body.includes(phrase);
    console.log(`${pass ? 'PASS' : 'FAIL'} | ${relPath} contains ${phrase}`);
    if (!pass) failed += 1;
  }
  return failed;
}

let failed = 0;

failed += checkFile('docs/EXPLORATION-REPORT.md', [
  'server.js',
  'data/dataset.csv',
  'scripts/quality-gate.js',
  'data/raw/dbd-2558.parquet',
  'bad-seq',
  'bad-reg-date',
  '/api/summary',
  '/api/notes',
  'ห้ามแก้ไฟล์',
  '## โครงสร้าง',
  '## คุณภาพข้อมูล',
  '## จุดเสี่ยง',
]);

failed += checkFile('docs/TEAMS-REVIEW.md', [
  '## agreement',
  '## disputed',
  '## next sequential step',
  'server.js',
  '/api/summary',
  '/api/notes',
  'Workshop 3',
]);

if (failed > 0) process.exit(1);
console.log('w1 check: passed');
