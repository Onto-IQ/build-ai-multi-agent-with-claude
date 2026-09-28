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
