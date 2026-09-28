# run-006 — Workshop 5: Quality Gate Loop (เขียน gate → FAIL → แก้ → PASS)

- **Module/Workshop:** Module 9 / Workshop 5 — เกณฑ์ B1–B3
- **เวลา:** 2026-09-29T03:05–03:25+07:00 | **Claude Code:** 2.1.284 | **โหมด:** headless `-p --permission-mode acceptEdits`
- **Working dir:** `labs-sandbox/demo-shop`

## รอบการทดลอง (ทั้งหมดรันจริง)

| Iter | การทดสอบ | ผลลัพธ์จริง | บทเรียน |
|---|---|---|---|
| 1 | Agent เขียน `scripts/quality-gate.js` (`--max-turns 15`) | ❌ ไฟล์ไม่เกิด — Agent ใช้ turns สำรวจ (DESIGN.md, server.js) จนครบเพดาน แล้วจบในข้อความ "Writing it now." | **Turn budget เป็น stop condition จริง** — งานสำรวจกิน turns ก่อนลงมือ |
| 2 | เพิ่มเป็น `--max-turns 25` + สั่ง "write the file FIRST" | ✅ ไฟล์เกิด + **รัน gate จริง: case-1 PASS, case-2 FAIL (server crash หลังรับ JSON เสีย — ECONNRESET), case-3 FAIL (server ตายไปก่อน), รวม 2/3, GATE_EXIT=2** | Gate จับปมปลูกได้เป๊ะตามดีไซน์ |
| 3 | Agent แก้ `server.js` ตาม findings (parse→400, validate ids→404, clamp discount, GET ไม่พบ→404) | ✅ **Gate รันซ้ำ: 3/3 PASS, GATE_EXIT=0** — `bad request -> status=400; after it /api/products -> status=200`, `case-3 status=404` | วงจร gate-driven fix สมบูรณ์ |

## Artifact ที่เกิดขึ้นจริง

- `labs-sandbox/demo-shop/scripts/quality-gate.js` — spawn server + 3 test cases + exit 0/2 (เขียนโดย agent)
- `labs-sandbox/demo-shop/server.js` — แก้ตาม findings (JSON parse guard, id validation, discount clamp, 404)

## ข้อสังเกตเพิ่มเติม

1. Agent อ่าน DESIGN.md (จาก W4) เองแล้วสรุปว่า "Cases 2 and 3 are expected to go red" ก่อนเขียน gate — แสดงว่า artifact ข้าม workshop เชื่อมโยงกันจริง (D3)
2. Gate ที่ agent เขียน ตรวจแบบ "หลัง POST เสีย ต้องยังตอบได้" — ใช่แค่เช็ค response เดียว แต่ตรวจ **availability** ต่อ — เกินสเปกที่ให้เล็กน้อยในทางที่ดี
3. บทเรียนตรงตัวกับ Module 11 Failure Modes: "Loop/turn budget" และ "Trust but verify" มีทั้งคู่ในรอบนี้

## สรุป: **PASS** (iteration 2 สำหรับการเขียน gate / วงจรรวมสมบูรณ์)
