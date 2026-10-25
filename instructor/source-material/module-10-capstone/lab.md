# Workshop 6 (Capstone) — Autonomous Business Web App Delivery

## บริบท

สองวันของคอร์สสะสมมาหมดแล้ว: Swarm (W1) → Specialty Agent (W2) → MCP (W3) → Sequential Pipeline (W4) → Guardrails (W5) — ตอนนี้รวมทุกอย่างเป็นทีมเดียวที่ส่งมอบงานจริง

## โจทย์

ประกอบทีม Specialty Agents (สร้างไฟล์ agent เองให้ครบ 5 บทบาท) แล้วรัน Capstone ตามโครง prompt ใน `lesson.md` จนได้:

1. `docs/PRODUCT-SPEC.md` ที่ใช้เป็นสัญญากลางได้จริง
2. เว็บแอป demo-shop ที่ขยายตาม spec (มีหน้าร้าน + API ที่ spec กำหนด)
3. ผล quality-gate ผ่าน
4. Git commits ที่เห็นพัฒนาการ v1 → v2

## ขั้นเริ่มต้น

```bash
cd labs-sandbox/demo-shop
git tag v1-pre-capstone
claude
```

## เกณฑ์ผ่าน

- [ ] ไฟล์ agent ครบ 5 บทบาทใน `.claude/agents/` (สร้างผ่าน prompt ทั้งหมด)
- [ ] PRODUCT-SPEC.md มี: หน้าจอ, endpoints, acceptance criteria — และ task list มี dependency ชัด
- [ ] มีหลักฐานว่า Frontend/Backend ถูก dispatch หลัง Spec เสร็จ (ลำดับใน task list)
- [ ] โค้ดใหม่ทำงานได้: `node server.js` + gate ผ่าน
- [ ] `git log --oneline v1-pre-capstone..HEAD` แสดงพัฒนาการเป็นขั้น
- [ ] รายงานรวม ≤ 400 คำ อ้าง deliverable ราย agent

## Hint

- สร้าง agent ทีละตัวด้วย pattern จาก W2 (จำ: TUI กดอนุมัติ / headless ใช้ bypass เฉพาะ sandbox)
- ถ้าทีม "จบแต่ไม่มีอะไรเปลี่ยน" — ตรวจว่า prompt บังคับ "Execute now" หรือ Leader แค่ "วางแผนเล่า"

## Solution แนวทาง

โครง prompt เต็มอยู่ใน `lesson.md` หัวข้อ 3 (มีทั้ง **EN — ✅ tested run-007** และ **TH version**) — หัวใจ 3 จุด: (1) Step 0 สัญญากลางก่อน (2) กติกา dependency "must NOT run before" (3) คุมรายงานรวม

> หลักฐานการรันจริงฉบับ EN (run-007): ทีมส่งมอบ v1→v3, QA verdict YELLOW แยก blocker/สเปกยอมรับได้, gate 3/3 — ผู้สอนควรรันฉบับไทยทดลองก่อนสอน 1 รอบ (โครงเดียวกัน) แล้วเก็บ transcript ตามแบบ runs/

## ต่อยอด (หลังจบคอร์ส)

ปรับ capstone นี้กับงานจริงของคุณ: เปลี่ยน "เว็บร้านค้า" เป็นโจทย์ธุรกิจของคุณเอง คงโครงสัญญากลาง + dependency ไว้เหมือนเดิม
