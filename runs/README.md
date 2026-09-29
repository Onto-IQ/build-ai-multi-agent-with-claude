# runs/ — บันทึกการทดสอบ Prompt จริงกับ Claude Code TUI

ทุก run บันทึกตาม template นี้ (เกณฑ์ B1–B3 ใน QUALITY-GATE.md):

```markdown
# run-XXX — <ชื่อการทดสอบ>
- **Module/Workshop:** <อ้างอิง>
- **เวลา:** <ISO timestamp> | **Claude Code:** <เวอร์ชัน> | **โหมด:** headless `-p`
- **คำสั่งรัน:** ```bash ...```
- **Prompt ที่ส่ง:** (verbatim)
- **ผลลัพธ์จริง:** (stdout ที่ได้ — ตัดเฉพาะส่วนสำคัญได้ แต่ห้ามแต่ง)
- **ข้อสังเกต/ปัญหา:** ...
- **การปรับปรุง:** (ถ้าล้มเหลว → prompt รอบถัดไปเปลี่ยนอะไร) → iteration-N
- **สรุป:** PASS / FAIL / PASS-with-notes
```

## ดัชนี Run

| Run | การทดสอบ | ผล |
|---|---|---|
| [smoke/run-001](smoke/run-001-claude-ok.md) | ยืนยัน CLI + auth ทำงาน (`-p` headless) | PASS |
| [module-03/run-002](module-03/run-002-workshop1-swarm.md) | Workshop 1 — Swarm สำรวจ codebase 3 subagents | PASS (iteration 1) |
| [module-04/run-003](module-04/run-003-workshop2-agent-creation.md) | Workshop 2 — สร้าง Specialty Agent + เรียกใช้ | PASS (8 iterations — พบ permission rule ของ `.claude/**` + กรณี Agent อ้างเขียนไฟล์ปลอม) |
| [module-06/run-004](module-06/run-004-workshop3-mcp.md) | Workshop 3 — MCP server (stdio) ต่อ Claude Code สายเต็ม | PASS (iteration 1) |
| [module-07/run-005](module-07/run-005-workshop4-pipeline.md) | Workshop 4 — Sequential Pipeline 3 ด่าน (Design→Build→Review) | PASS (iteration 1 — พบ headless deny Bash) |
| [module-09/run-006](module-09/run-006-workshop5-quality-gate-loop.md) | Workshop 5 — Quality Gate loop (เขียน gate → FAIL → แก้ → PASS) | PASS (iteration 2 — turn budget lesson) |
| [module-10/run-007](module-10/run-007-workshop6-capstone.md) | Workshop 6 — Capstone ทีม 5 agents v1→v3 | PASS (attempt 2 — scoped kill lesson) |
| [module-03/run-008](module-03/run-008-thai-swarm.md) | **Thai** swarm prompt (เทียบ EN) — รายงานไทยทั้งชุด + severity | PASS |
| [module-04/run-009](module-04/run-009-thai-agent-creation.md) | **Thai** prompt สร้าง agent — frontmatter ถูกต้อง, body default EN | PASS |
| [module-06/run-010](module-06/run-010-thai-unicode-mcp.md) | **Thai Unicode** ผ่าน MCP (ไทย+เลขไทย ครบสาย ไม่ mojibake) | PASS |
| [module-07/run-011](module-07/run-011-thai-test-pipeline.md) | **Thai** pipeline งานเทคนิค — จับข้อขัดแย้งกับสเปก + mutation check | PASS |
| [module-04/run-012](module-04/run-012-thai-ambiguous-failure.md) | **Thai** prompt กำกวม (กรณีศึกษาเชิงลบ) | FAIL ตามดีไซน์ — หมดเทิร์น ไม่มีผลงาน |
