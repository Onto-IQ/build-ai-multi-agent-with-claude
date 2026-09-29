# Workshop 4 — Sequential Pipeline (Design → Build → Test)

## บริบท

เจ้าของร้านอยากได้ API เพิ่มสินค้า (`POST /api/products`) คุณจะให้ทีม Agent ทำแบบสายการผลิต 3 ด่าน เพื่อพิสูจน์ว่า "สัญญากลาง" ทำให้งานไหลต่อกันได้จริง

## โจทย์

รัน pipeline 3 ด่านจาก **prompt เดียว** ตามตัวอย่างใน `lesson.md` หัวข้อ 4 แล้วตรวจ artifact ของแต่ละด่าน

## ขั้นเริ่มต้น

```bash
cd labs-sandbox/demo-shop
git add -A && git commit -m "before pipeline"   # เตรียมจุดเทียบก่อน-หลัง
claude
```

## เกณฑ์ผ่าน (ตรวจได้จริง)

- [ ] `docs/DESIGN.md` ถูกสร้างในด่าน 1 และระบุ request/response shape + error codes
- [ ] `server.js` มี `POST /api/products` ในด่าน 2 และ validation ตรงตาม DESIGN.md
- [ ] ด่าน 3 มี findings แบบ `file:line` (อย่างน้อยตรวจว่า error codes ตรงสเปก)
- [ ] `git diff` แสดงการเปลี่ยนแปลงเฉพาะที่สเปกกำหนด (ไม่มี refactor เกินขอบเขต)
- [ ] ผู้เรียนอธิบายได้ว่าถ้าไม่มี DESIGN.md ด่าน 2 จะเสี่ยงอะไร

## Hint

ถ้า Leader รวมทุกด่านเป็นข้อความเดียวแล้ว "เล่า" แทนการทำจริง ให้เติม "Execute each stage now, not as a plan." ท้าย prompt

## Solution

โครง prompt เต็มอยู่ใน `lesson.md` หัวข้อ 4 (✅ tested) — จุดสำคัญคือธง "Do not write code yet" / "Fix nothing" ที่ล็อกขอบเขตแต่ละด่าน

## ต่อยอด (โจทย์ปลายเปิด)

เพิ่มด่านที่ 4 "Test" ที่เขียน test script (Node ล้วน) ยิง endpoint ใหม่ 3 เคส: สร้างสำเร็จ / body ไม่ครบ → 400 / ชน id ซ้ำ → 400 แล้วสังเกตว่าต้องแก้สัญญากลางหรือไม่

**เวอร์ชันไทยของโจทย์นี้ (✅ tested — runs/module-07/run-011) — ผลที่ได้จริงเกินโจทย์:**

```text
เขียนไฟล์ scripts/test-create-product.js (Node ล้วน ไม่ใช้ dependency) ทดสอบ POST /api/products 3 เคส โดยอ่านเงื่อนไขจาก docs/DESIGN.md ก่อน:
(1) สร้างสำเร็จ — ส่ง name กับ price ครบ ต้องได้ 2xx พร้อม id ใหม่
(2) body ไม่ครบ — ส่งแค่ name ไม่มี price ต้องได้ 400
(3) มี field แปลกปลอม — ต้องได้ 400 พร้อมรายงาน UNKNOWN_FIELD ตามสเปกใน DESIGN.md
จง spawn 'node server.js' เอง รันทุกเคส ปิด child server ทุกเส้นทาง และ exit 0 เมื่อผ่าน / exit 2 เมื่อไม่ผ่าน พิมพ์ผล PASS/FAIL ต่อเคส
ห้ามแก้ server.js ห้ามถามคำถาม — เขียนไฟล์แล้วรันให้เลย แล้วรายงานผล
```

ผลจริง: agent **จับข้อขัดแย้งระหว่าง prompt กับสเปก** (สเปกบังคับ `stock` ด้วย — ไม่ใช่แค่ name+price) แล้วแจ้งการตัดสินใจอย่างโปร่งใส, อ้างมาตรา § ทุก assertion, ทำ **mutation check** (พัง server บนสำเนา temp ทีละจุดเพื่อพิสูจน์ว่าเทสต์จับของเสียได้ — ทุก mutation ออก exit 2), และ 3/3 ผ่านเมื่อผู้สอนรันซ้ำ — บทเรียน: **สัญญากลางที่ดีช่วยแก้ความคลาดเคลื่อนของคนสั่งได้เอง**
