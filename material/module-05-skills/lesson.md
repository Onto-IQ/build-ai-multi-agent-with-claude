# Module 5 — ขยายความสามารถด้วย Skills และ Extended Tools

> **เวลา:** ~25 นาที | **ผลลัพธ์ที่คาดหวัง:** ผู้เรียนเขียน Skill ของตัวเองได้ และผูกให้ Subagent ใช้ล่วงหน้าผ่าน frontmatter

## 1. Skill คืออะไร — และต่างจาก Subagent

**Skill** = คู่มือปฏิบัติงานที่โหลดเข้า context เมื่อ "งานตรงประเภท" — ความรู้เชิงกระบวนการ (how-to) ไม่ใช่ตัวลงมือทำ

| | Subagent | Skill |
|---|---|---|
| รูปแบบ | ตัวลงมือทำ (context แยก, tools ของตัวเอง) | ชุดคำสั่ง/ความรู้ที่ฉีดเข้า context |
| เก็บที่ | `.claude/agents/*.md` | `.claude/skills/<ชื่อ>/SKILL.md` |
| ใช้เมื่อ | งานหนัก output ยาว ต้องแยก context | ขั้นตอนมาตรฐานที่ต้องทำซ้ำถูกต้องเหมือนกันทุกครั้ง |

## 2. โครงสร้าง Skill

```text
.claude/skills/
└── release-checklist/
    └── SKILL.md
```

`SKILL.md` = YAML frontmatter (`name`, `description`) + body เป็นขั้นตอนปฏิบัติ:

```markdown
---
name: release-checklist
description: Use before releasing the demo-shop — pre-flight steps for config, endpoints and data files.
---

# Release Checklist

1. Run `node server.js` and confirm "listening" within 3 seconds.
2. GET /api/products — expect 200 and 5 items.
3. Search the repo for hardcoded secrets (pattern `sk-`, `token =`).
4. Confirm `git status` is clean before tagging.
```

> **description คือตัว trigger** — Claude อ่านคำอธิบายนี้เพื่อตัดสินใจว่างานปัจจุบัน "ตรงประเภท" พอจะโหลด skill หรือไม่ (progressive disclosure: โหลดเฉพาะเมื่อใช้ ไม่เปลือง context ตลอดเวลา)

## 3. ผูก Skill ให้ Subagent ล่วงหน้า

ใน frontmatter ของ Subagent (จาก Module 4) เพิ่มฟิลด์ `skills`:

```yaml
---
name: release-manager
description: Runs releases for this repo. Use proactively when the user asks to release or ship.
tools: Read, Grep, Glob
model: sonnet
skills: release-checklist
---
```

ต่างจากการปล่อยให้ auto-trigger: การ preload ผ่าน frontmatter ทำให้ **เนื้อหา skill ทั้งหมดอยู่ใน context ของ agent ตั้งแต่เริ่ม** — เหมาะกับ skill ที่ agent ตัวนั้น "จำเป็นต้อง" ใช้ทุกงาน

## 4. ทำตามทีละขั้น (10 นาที)

1. สร้างโฟลเดอร์: `mkdir -p .claude/skills/release-checklist` (ใน `labs-sandbox/demo-shop`)
2. เขียน `SKILL.md` ตามตัวอย่างข้อ 2 (หรือสั่ง Claude: *"Create a skill at .claude/skills/release-checklist/SKILL.md with the steps in my message"* แล้ววาง 4 ขั้นตอน)
3. ทดสอบ trigger:

```bash
claude -p "I want to release the demo shop now. Walk me through it." --max-turns 10
```

ผลที่คาดหวัง: Claude อ้างขั้นตอนจาก release-checklist (รัน server, ตรวจ endpoint, หา secret) — เพราะ description เข้าเงื่อนไข "before releasing"

## 5. กับดักที่พบบ่อย

- `description` กว้างเกิน ("helps with everything") → trigger พร่องเปล่า โหลดทุกงาน
- เขียน body เป็นเรียงความ → ต้องเป็น**ขั้นตอนที่ executable ได้** (คำสั่งชัด ตรวจได้)
- ตั้งชื่อโฟลเดอร์ไม่ตรง `name` ใน frontmatter → สับสนตอน preload

## อ้างอิง

- Claude Code Docs — Skills / SKILL.md, Agent frontmatter `skills` field (code.claude.com/docs)
