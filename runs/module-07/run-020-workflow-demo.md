# run-020 — Workflow Guided Demo: map-and-check ใน demo-shop (2 agents, schema + ตรวจซ้ำ)

- **Module/Workshop:** Module 7 (หัวข้อ 6 — Workflow Guided Demo)
- **เวลา:** 2026-10-17T13:35+07:00 | **Claude Code:** 2.1.302 | **โหมด:** headless `-p "/map-and-check"` + `--permission-mode bypassPermissions` (sandbox ทิ้งได้)
- **Sandbox:** `labs-sandbox/demo-shop/` — ไฟล์ `.claude/workflows/map-and-check.js` (ตัวอย่างเต็มอยู่ใน lesson หัวข้อ 6): meta 2 phases → agent แรก (haiku, มี schema) สรุป endpoints เป็น JSON → agent ที่สอง (haiku) อ่าน server.js ตรวจว่าสรุปครบไหม

## ผลจริง

- **Phase Map:** สรุป endpoints ได้ **8 รายการ** เป็น JSON ตาม schema (method/path/does — คำอธิบายเป็นภาษาไทย) ครอบ GET /api/products, GET /api/products/:id, POST /api/products/:id (dead route คืน 404 เสมอ), POST /api/cart/total, GET /api/admin/stats, static routes และ catch-all
- **Phase Check:** ตรวจโดยอ่าน server.js เอง → **"OK — ครบทั้ง 8 routes"** พร้อมหมายเหตุพฤติกรรมน่าสนใจ 2 ข้อ (dead route ตั้งใจ, /api/admin/stats คืน error body ด้วย HTTP 200) — จับปม QA ที่ปลูกไว้ใน sandbox ได้เองโดยไม่ได้สั่ง

## ข้อสังเกต

1. Template ที่พิมพ์ลง lesson รันผ่านตรง ๆ ทั้งไฟล์ — meta/phases/phase()/schema/Thai prompts/haiku ทำงานครบ
2. Thai prompt + schema ไม่มีปัญหา (สอดคล้อง run-008–011)
3. transcript ของ workflow ถูกเก็บที่ `~/.claude/projects/<project>/<sessionId>/subagents/workflows/wf_<id>/journal.jsonl` — เปิดดูสดด้วย `/workflows` ใน TUI
4. ค่าใช้จ่ายรอบนี้เล็กมาก (agent 2 ตัวบน haiku อ่านไฟล์เดียว) — เหมาะเป็น demo แรกก่อนขยาย

## สรุป: PASS
