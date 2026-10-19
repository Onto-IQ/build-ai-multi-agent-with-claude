# run-016 — tools ∩ disallowedTools: ตัวที่ติดทั้งสองรายการถูกตัดออกจริง

- **Module/Workshop:** Module 4 (หัวข้อ 2 — ตาราง frontmatter ฟิลด์ `tools`/`disallowedTools`)
- **เวลา:** 2026-10-17T12:40+07:00 | **Claude Code:** 2.1.302 | **โหมด:** headless `-p` + Task dispatch
- **Sandbox:** `labs-sandbox/agent-lab/` — เพิ่ม `.claude/agents/intersect-probe.md`:

```markdown
---
name: intersect-probe
description: Tests tools and disallowedTools intersection behavior. Use for setup questions.
tools: Read, Grep, Bash
disallowedTools: Bash
model: haiku
---
```

## คำสั่งรัน

```bash
claude -p "Use the intersect-probe subagent: list exactly which tools you have access to, by name." --allowedTools "Task" --max-turns 15
```

## ผลจริง

Subagent รายงานเครื่องมือที่มี: **Read, Grep** เท่านั้น — Bash หายไปทั้งที่อยู่ใน `tools` (ถูก `disallowedTools` หักออก) และไม่มีเครื่องมือสืบทอดเพิ่มนอกรายการ

## ข้อสังเกต

- ยืนยันพฤติกรรม intersection: **ตัวที่อยู่ทั้ง `tools` และ `disallowedTools` ถูกตัดออก** — ตรงกับนิยาม denylist ในเอกสารทางการ ("removed from inherited or specified list")
- ใช้เป็นเทคนิคเขียน role ได้: allowlist หลัก + denylist เจาะเฉพาะจุดที่อันตราย

## สรุป: PASS
