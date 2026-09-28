# Workshop 5 — Quality & Cost Guardrails with Hooks

## บริบท

ร้านกำลังจะเปิดจริง แต่ demo-shop มีปมที่ทีม Agent ตรวจพบตั้งแต่ Workshop 1 คุณจะสร้าง **Quality Gate** ที่บล็อกงานที่ทำให้ server ล่ม และเรียนรู้การอ่านค่าใช้จ่าย Token เพื่อทำ **Cost Gate**

## โจทย์

1. เขียน hook `PreToolUse` ที่บล็อกคำสั่ง Bash ที่จะ "ฆ่า server" (kill/node ที่ลงท้าย kill) ด้วย exit code 2
2. เขียน `quality-gate.js` (Node ล้วน): start server → ยิง 3 เคส → ตัดสินผ่าน/ไม่ผ่าน
   - GET `/api/products` → 200 และมี items
   - POST `/api/cart/total` body เสีย (`not-json`) → **ต้องไม่ crash server** (ตอบ 4xx ก็ได้ — สังเกตว่าปัจจุบัน crash!)
   - GET `/api/products/999` → ต้องตอบ 404 (ปัจจุบันตอบ 200)
3. รัน Agent ให้ "แก้ปมที่ gate จับได้" แล้วรัน gate ซ้ำจนผ่าน

## ขั้นเริ่มต้น

```bash
cd labs-sandbox/demo-shop
git add -A && git commit -m "before guardrails"
mkdir -p .claude/hooks scripts
```

## เกณฑ์ผ่าน

- [ ] `quality-gate.js` ตรวจ 3 เคสข้างบน และ exit 0 เมื่อผ่าน / exit 2 เมื่อไม่ผ่าน
- [ ] Hook บล็อกคำสั่ง kill ได้จริง (ทดสอบโดยให้ agent รันคำสั่ง kill แล้วเห็นการถูก block + ข้อความ feedback)
- [ ] หลังให้ agent แก้: `node scripts/quality-gate.js` exit 0
- [ ] Cost note: รันซ่อมด้วย `--output-format json` แล้วจดค่า `total_cost_usd` จากผลลัพธ์ (จะใช้ต่อใน Cost Gate)

## Hint

- Gate script: spawn `node server.js`, รอ "listening", ใช้ fetch ยิงเคส, เช็คสถานะ, แล้ว `process.exit(ผล)` — อย่าลืม kill child process ในทุกเส้นทาง
- สำหรับ "ต้องไม่ crash": ถ้า server ตายระหว่างเคส 2 แปลว่า gate จับได้ → exit 2 ทันที

## Solution (แนวทาง)

Gate ให้เขียนแบบ: เคส 1 ผ่าน → เคส 2 POST `not-json` แล้ว GET ซ้ำ (ถ้า server ตาย = fail) → เคส 3 เช็ค status === 404 หลัง agent แก้แล้ว gate จะผ่านเพราะ: JSON.parse มี try/catch ตอบ 400, id ไม่พบตอบ 404 — ดู code ตัวอย่างได้จากการให้ agent เขียน (ซึ่งเป็นตัวอย่างที่ดีของ "ให้ agent สร้าง gate ที่จะมาจับ agent เอง")

## ต่อยอด (โจทย์ปลายเปิด)

เขียน hook `TaskCompleted` ที่รัน `node scripts/quality-gate.js` อัตโนมัติทุกครั้งที่ agent ประกาศงานเสร็จ — แล้วทดสอบกับโจทย์ที่ละเมิด gate
