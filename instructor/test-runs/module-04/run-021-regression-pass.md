# run-021 — Regression pass หลังรวมเนื้อหาใหม่ทั้งหมด (บน 2.1.302)

- **Module/Workshop:** Module 4 (หัวข้อ 2, 6) + Module 7 (หัวข้อ 6) — ยืนยันว่าตัวอย่างที่พิมพ์ลงสื่อยังทำงานได้ผลเดิมหลังแก้ไขสื่อหลายรอบ
- **เวลา:** 2026-10-19+07:00 | **Claude Code:** 2.1.302 | **โหมด:** headless `-p` + Task dispatch

## ผลจริงรายรายการ

| รายการ | คาดหวัง | ผลจริง |
|---|---|---|
| R1 — รายชื่อ agent ที่โหลด (agent-lab) | เฉพาะไฟล์ valid 8 ตัว | ✓ `intersect-probe, iso-probe, md-reader, md-reader-omit, ok-probe, typo-field, writer-probe, zero-tools` — malformed 6 ไฟล์ (no-name/no-desc/no-frontmatter/bad-yaml/dash-name/colon-name) ยังถูกข้ามเงียบ ๆ เหมือน run-013 |
| R2 — code word probe (`ok-probe`) | `LAB-77` | ✓ `LAB-77` |
| R3 — `tools: NoSuchTool` (zero-tools) | ปฏิเสธสตาร์ต | ✓ "Agent 'zero-tools' would be spawned with zero tools — refusing. Its tools list resolved to nothing: unrecognized [NoSuchTool]." |
| R4 — workflow `/map-and-check` (demo-shop) | 2 phases จบสมบูรณ์ + Check ยืนยันความครบ | ✓ `สรุปได้ 13 endpoint — ผลตรวจ: OK` |

## ข้อสังเกต

1. R4 ได้ **13 endpoints** ขณะที่ run-020 ได้ 8 — ต่างกันเพราะสถานะ demo-shop มี `POST /api/products` เพิ่มจาก Workshop 4 (run-005/011) — workflow ครอบคลุมสถานะปัจจุบันเสมอ และ phase Check ยืนยันความครบให้เอง
2. R1–R3 ผลตรงกับ run-013/017 ทุกข้อบนเวอร์ชัน 2.1.302 (ไม่มี regression)

## สรุป: PASS
