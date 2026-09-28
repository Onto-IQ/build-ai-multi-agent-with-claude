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
