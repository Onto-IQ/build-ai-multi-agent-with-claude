#!/usr/bin/env node
/**
 * Normalize learner-facing Thai to use English keyphrases (quality gate, port busy, sandbox, …).
 * Run: node scripts/apply-keyphrase-style.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const GLOBS = [
  'day-1',
  'day-2',
  'README.md',
  'SETUP.md',
  'reference/glossary-th-en.md',
  'reference/failure-modes.md',
  'sandbox/sales-insight/README.md',
  'solutions',
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const st = fs.statSync(dir);
  if (st.isFile() && dir.endsWith('.md')) {
    out.push(dir);
    return out;
  }
  if (!st.isDirectory()) return out;
  for (const name of fs.readdirSync(dir)) {
    walk(path.join(dir, name), out);
  }
  return out;
}

function collectFiles() {
  const files = [];
  for (const rel of GLOBS) {
    const abs = path.join(root, rel);
    walk(abs, files);
  }
  return [...new Set(files)];
}

function apply(text) {
  if (text.includes('## Keyphrase ในประโยกไทย')) {
    return text;
  }
  const QG = '\uE000QG\uE001';
  const CG = '\uE000CG\uE001';
  let s = text;
  s = s.replace(/เกตคุณภาพ/g, QG);
  s = s.replace(/เกตต้นทุน/g, CG);

  const rules = [
    [/เกตฟ้องพอร์ตไม่ว่าง/g, 'quality gate รายงาน port busy'],
    [/ปล่อยเซิร์ฟเวอร์ค้าง แล้ว quality gate รายงาน port busy/g, 'ปล่อย `node server.js` ค้าง แล้วรัน quality gate จะเจอ port busy'],
    [/แซนด์บ็อกซ์เริ่มต้น/g, 'starter sandbox'],
    [/แซนด์บ็อกซ์ชุดนี้/g, 'sandbox ชุดนี้'],
    [/แซนด์บ็อกซ์/g, 'sandbox'],
    [/หน้าแซนด์บ็อกซ์/g, 'หน้า sandbox'],
    [/ฟ้องธง/g, 'error เรื่อง flag'],
    [/พอร์ตชนตอนรัน quality gate/g, 'port busy ตอนรัน quality gate'],
    [/พอร์ตชน/g, 'port busy'],
    [/พอร์ต 3000 ไม่ว่าง/g, 'port 3000 busy (port busy)'],
    [/พอร์ตไม่ว่าง/g, 'port busy'],
    [/quality gate ไม่ชนพอร์ต/g, 'quality gate ไม่เจอ port busy'],
    [/รันเกต/g, 'รัน quality gate'],
    [/เกตเริ่มต้น/g, 'starter quality gate'],
    [/เกตสามเคส/g, 'quality gate สามเคส'],
    [/เกตทั้งสามเคส/g, 'quality gate สามเคส'],
    [/เกตทั้งก้อน/g, 'quality gate ครบทุกเคส'],
    [/ไฟล์เกต/g, 'ไฟล์ `scripts/quality-gate.js`'],
    [/คืนไฟล์ quality gate/g, 'คืน `scripts/quality-gate.js`'],
    [/แก้ไฟล์ quality gate/g, 'แก้ `scripts/quality-gate.js`'],
    [/แก้ quality gate แทน/g, 'แก้ `scripts/quality-gate.js` แทน'],
    [/สคริปต์ไปแก้ quality gate/g, 'สคริปต์ไปแก้ `scripts/quality-gate.js`'],
    [/เกตเขียวเพราะแก้ไฟล์ quality gate/g, 'quality gate exit 0 เพราะแก้ `scripts/quality-gate.js`'],
    [/เกตเขียว/g, 'quality gate exit 0'],
    [/เกตแดง/g, 'quality gate ยัง exit 2 (FAIL)'],
    [/เกตไม่เขียว/g, 'quality gate ยังไม่ exit 0'],
    [/อาการที่ quality gate พิมพ์/g, 'ข้อความ FAIL จาก quality gate'],
    [/อาการที่เกตพิมพ์/g, 'ข้อความ FAIL จาก quality gate'],
    [/เกต exit/g, 'quality gate exit'],
    [/เกตยัง/g, 'quality gate ยัง'],
    [/เกตเป็น/g, 'quality gate เป็น'],
    [/เกตใน/g, 'quality gate ใน'],
    [/เกตขึ้น/g, 'quality gate แสดง'],
    [/เกตต้อง/g, 'quality gate ต้อง'],
    [/เกตผ่าน/g, 'quality gate ผ่าน'],
    [/เกตจึง/g, 'quality gate จึง'],
    [/เกตไม่/g, 'quality gate ไม่'],
    [/ผล quality gate/g, 'ผล quality gate'],
    [/ผลเกต/g, 'ผล quality gate'],
    [/ที่ quality gate/g, 'ที่ quality gate'],
    [/ที่เกต/g, 'ที่ quality gate'],
    [/และ quality gate /g, 'และ quality gate '],
    [/และเกต /g, 'และ quality gate '],
    [/การแก้ quality gate/g, 'การแก้ quality gate'],
    [/การแก้เกต/g, 'การแก้ quality gate'],
    [/หยุดที่ quality gate/g, 'หยุดที่ quality gate'],
    [/หยุดที่เกต/g, 'หยุดที่ quality gate'],
    [/เกตและ/g, 'quality gate และ'],
    [/เกต /g, 'quality gate '],
    [/ quality gate คุณภาพ/g, ` ${QG}`],
    [/quality gate \(เกตคุณภาพ\) ของ/g, `${QG} ของ`],
    [/แปลว่า sandbox ยังเป็นจุดเริ่มต้นตามออกแบบ ไม่ใช่เครื่องติดตั้งพัง/g,
      'starter sandbox ยัง FAIL อยู่ (quality gate exit 2) ตามออกแบบ — ไม่ได้แปลว่า `verify-setup` พัง'],
    [/ไม่ใช่เครื่องติดตั้งพัง/g, 'ไม่ใช่ `verify-setup` พัง'],
    [/ก่อนรัน quality gate/g, 'ก่อนรัน `node scripts/quality-gate.js`'],
    [/รัน quality gate แล้ว/g, 'รัน `node scripts/quality-gate.js` แล้ว'],
    [/รัน quality gate จะ/g, 'รัน `node scripts/quality-gate.js` จะ'],
    [/รัน quality gate เอง/g, 'รัน `node scripts/quality-gate.js` เอง'],
    [/รัน quality gate ซ้ำ/g, 'รัน `node scripts/quality-gate.js` ซ้ำ'],
    [/รัน quality gate อีก/g, 'รัน `node scripts/quality-gate.js` อีก'],
    [/รัน quality gate ใน/g, 'รัน `node scripts/quality-gate.js` ใน'],
    [/รัน quality gate หลัง/g, 'รัน `node scripts/quality-gate.js` หลัง'],
    [/รัน quality gate ก่อน/g, 'รัน `node scripts/quality-gate.js` ก่อน'],
    [/รัน quality gate ต้อง/g, 'รัน `node scripts/quality-gate.js` ต้อง'],
    [/รัน quality gate ไม่/g, 'รัน `node scripts/quality-gate.js` ไม่'],
    [/รัน quality gate$/gm, 'รัน `node scripts/quality-gate.js`'],
    [/ปิดก่อนรัน quality gate/g, 'ปิดก่อนรัน `node scripts/quality-gate.js`'],
    [/Ctrl\+C ก่อนรัน quality gate/g, 'Ctrl+C ก่อนรัน `node scripts/quality-gate.js`'],
    [/ระหว่าง quality gate/g, 'ระหว่างรัน quality gate'],
    [/ \| รัน quality gate/g, ' | รัน `node scripts/quality-gate.js`'],
    [/ \| quality gate /g, ' | quality gate '],
    [/cost gate อ่าน/g, 'cost gate (`scripts/cost-gate.js`) อ่าน'],
    [/hook กับ cost gate/g, 'hook กับ cost gate (`scripts/cost-gate.js`)'],
  ];

  for (const [re, rep] of rules) {
    s = s.replace(re, rep);
  }

  s = s.replace(new RegExp(QG, 'g'), 'quality gate');
  s = s.replace(new RegExp(CG, 'g'), 'cost gate');

  // Space before/after keyphrases when glued to Thai/Latin
  s = s.replace(/([ก-ฮ])(quality gate|port busy|starter sandbox|sandbox|headless|verify-setup)/g, '$1 $2');
  s = s.replace(/(quality gate|port busy|sandbox)([ก-ฮ])/g, '$1 $2');
  s = s.replace(/(แล้ว|ที่|และ|ใน|จาก|กับ|หรือ)(quality gate|port busy)/g, '$1 $2');

  // Module 9 heading: restore readable bilingual
  s = s.replace(
    /# Module 9 — quality gate \/ Guardrails/g,
    '# Module 9 — Quality gate / Guardrails and hooks',
  );
  s = s.replace(
    /# Module 9 — quality gate \/ Guardrails and hooks/g,
    '# Module 9 — Quality gate / Guardrails and hooks',
  );

  return s;
}

let changed = 0;
for (const file of collectFiles()) {
  const before = fs.readFileSync(file, 'utf8');
  const after = apply(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed++;
    console.log('updated', path.relative(root, file));
  }
}
console.log(`done: ${changed} file(s)`);
