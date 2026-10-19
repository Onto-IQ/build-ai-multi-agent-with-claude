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
| [module-04/run-013](module-04/run-013-agent-lab.md) | Agent Lab — silent-skip 6 รูปแบบ + validate จับไม่ครบ + code word probe + omitClaudeMd คู่เทียบ | PASS-with-notes (iteration 2 ใน probe omit) |
| [module-04/run-014](module-04/run-014-fat-description-and-v1302.md) | เวอร์ชัน 2.1.302 — warning คำอธิบาย 15k token (ไม่เห็นใน headless) + did-you-mean ฟิลด์สะกดผิด + validate ซ้ำ | PASS-with-notes |
| [module-04/run-015](module-04/run-015-workflow-agenttype.md) | Workflow `agent({agentType})` — body/model/tools ✓, **skills ไม่ preload** (ต่างจาก subagent) เทียบสอง path | PASS |
| [module-04/run-016](module-04/run-016-tools-disallowedtools-intersection.md) | tools ∩ disallowedTools — ตัวที่ติดทั้งสองรายการถูกตัดออก (Read, Grep, Bash + ห้าม Bash → เหลือ Read, Grep) | PASS |
| [module-04/run-017](module-04/run-017-zero-tools-refusal.md) | `tools: NoSuchTool` → ปฏิเสธสตาร์ตพร้อมข้อความ "zero tools — refusing" | PASS |
| [module-04/run-018](module-04/run-018-permissionmode-inheritance.md) | permissionMode ของ definition ถูกเมินเมื่อ session หลักเป็น acceptEdits (plan เขียนได้จริง) / มีผลเมื่อ session default | PASS |
| [module-04/run-019](module-04/run-019-isolation-worktree.md) | isolation: worktree — path/branch จริง `.claude/worktrees/agent-<id>` + `worktree-agent-<id>`, แตกจาก default branch, ไม่ merge กลับอัตโนมัติ | PASS |
| [module-07/run-020](module-07/run-020-workflow-demo.md) | Workflow Guided Demo — map-and-check (2 agents, schema JSON, ตรวจซ้ำ) ใน demo-shop | PASS |
| [module-04/run-021](module-04/run-021-regression-pass.md) | Regression pass หลังรวมเนื้อหาใหม่ — silent-skip/code word/zero-tools/workflow demo ยังได้ผลเดิมบน 2.1.302 | PASS |
