# Workshop 4 — Design, clean, review

> ⏱ 40 นาที · Start state: quality gate ยัง exit 2 และยังไม่มี `scripts/clean-sales.js`

## Goal / เป้าหมาย

มี `docs/DESIGN.md` สคริปต์ทำความสะอาด และ `docs/REVIEW.md` โดยยังไม่ต้องทำให้ quality gate สามเคสเขียว

## Steps / ขั้นตอน

1. จุดเทียบก่อนลงมือ

```bash
git status --short
claude
```

2. วาง prompt สามขั้นครั้งเดียว (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Run three stages now, not as a plan.
Stage 1: Write docs/DESIGN.md for cleaning data/sales.csv. List fatal row drops and repairs. Include the revenue formula. Do not write code yet.
Stage 2: Write scripts/clean-sales.js (node only, no dependencies) that implements DESIGN.md. Do not edit server.js.
Stage 3: Write docs/REVIEW.md comparing the script to DESIGN.md. Cite clean-sales.js. Fix nothing.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
เดินสามขั้นตอนนี้ อย่าหยุดที่แผน
ขั้น 1: เขียน docs/DESIGN.md สำหรับทำความสะอาด data/sales.csv ระบุแถวที่ทิ้งกับแถวที่ซ่อม และสูตรรายได้ ห้ามเขียนโค้ด
ขั้น 2: เขียน scripts/clean-sales.js ด้วย Node ล้วนตาม DESIGN.md ห้ามแก้ server.js
ขั้น 3: เขียน docs/REVIEW.md เทียบสคริปต์กับ DESIGN.md ให้อ้าง clean-sales.js ห้ามแก้ของ
```

ผลที่คาดหวัง: เกิด `docs/DESIGN.md`, `scripts/clean-sales.js`, `docs/REVIEW.md` ในโฟลเดอร์แอป

> 📚 **รู้เพิ่ม:** วัดผลแล็บนี้ด้วยไฟล์ ไม่ใช่ความเรียงขั้นในแชท — DESIGN.md ทำให้ขั้นเขียนไม่ต้องเดา และ REVIEW.md มีตัวเทียบที่เป็นธรรม ถ้าไม่มีสองไฟล์นี้ งานสามขั้นจะเหลือแค่เรื่องเล่า

3. ปิด TUI แล้วรันสคริปต์เอง

```bash
node scripts/clean-sales.js data/sales.csv data/sales.clean.csv
```

ผลที่คาดหวัง: มีไฟล์ `data/sales.clean.csv` และจำนวนแถวข้อมูลน้อยกว่าไฟล์ดิบ `server.js` ยังไม่ถูกแก้

> 📚 **รู้เพิ่ม (จากการรันจริง):** agent ที่เขียนสคริปต์อาจเลือก interface ต่างจาก checkpoint ข้างบน — รอบทดสอบจริง agent เขียน `clean-sales.js` แบบไม่รับพารามิเตอร์ (default `data/sales.csv` → `data/sales.clean.csv`) พร้อม flag `--in-place` และ REVIEW.md ของ agent เองรายงานจุดนี้เป็น finding — ถ้าคำสั่งใน checkpoint ใช้ไม่ได้ ให้รัน `node scripts/clean-sales.js` ไม่ใส่ argument เพื่อดู usage ของสคริปต์ที่ได้มา แล้วปรับตาม

4. รัน `node scripts/quality-gate.js`

```bash
node scripts/quality-gate.js
```

ผลที่คาดหวัง: quality gate อาจยังไม่ exit 0 ครบ เพราะ `data/sales.csv` ยังเป็นไฟล์ดิบ และ `POST /api/notes` ยังทำให้เซิร์ฟเวอร์ล้ม — แก้ใน Workshop 5

> 📚 **รู้เพิ่ม:** gate ยังแดงเพราะสายงานวันนี้แตะแค่สายทำความสะอาดข้อมูล ปัญหาใน `server.js` ถูกเก็บไว้แก้ใน Workshop 5 โดยตั้งใจ — และ**ห้ามแตะ `scripts/quality-gate.js` เพื่อให้เขียว** ตัวตรวจตายตัว แก้ตัวตรวจเท่ากับลบหลักฐานทั้งชุด

## ✅ Checkpoint

- [ ] `docs/DESIGN.md` มีทั้งรายการที่ทิ้งและสูตร `qty * unit_price_thb`
- [ ] `scripts/clean-sales.js` รันด้วย `node` อย่างเดียวแล้วเขียนไฟล์ออก
- [ ] `docs/REVIEW.md` อ้าง `clean-sales.js` และ `DESIGN.md`
- [ ] `git diff -- server.js` ว่าง
- [ ] อธิบายได้ว่าทำไม quality gate ยังแดง (ถ้ายังแดง)

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| มีแต่ข้อความสามขั้น | ไม่ได้สั่งให้ทำตอนนี้ | เติม "Execute each stage now, not as a plan." |
| headless ไม่ยอมรัน node | Bash ถูกปฏิเสธ | รันสคริปต์เองใน Git Bash และทำแล็บใน TUI |
| หมดเทิร์นที่ขั้น 1 | `--max-turns` ต่ำ | อยู่ใน TUI |
| สคริปต์ไปแก้ `scripts/quality-gate.js` ให้ exit 0 | ไม่มีข้อห้าม | คืน `scripts/quality-gate.js` จาก git แล้วห้ามแตะไฟล์นั้น |
| port busy | เซิร์ฟเวอร์ค้าง | ปิดก่อนรัน `node scripts/quality-gate.js` หรือตั้ง `PORT` |
| เขียน `.claude` ไม่ได้ | ใช้ `claude -p` | กลับไป TUI |

## 🆘 Behind? Catch up

```bash
node scripts/catch-up.js w4
```

ได้สคริปต์ DESIGN รีวิว และ `data/sales.clean.csv` ไฟล์ดิบ `data/sales.csv` ยังอยู่

## Stretch / ต่อยอด

เพิ่มขั้นทดสอบที่อ่าน CSV สะอาดแล้วนับแถว โดยห้ามแก้ `server.js`

## Solution → solutions/w4/

ตรวจด้วย `node solutions/w4/check.js` ยอดอ้างอิงหลังสะอาดคือ 16 ออเดอร์ และ 10778 บาท
