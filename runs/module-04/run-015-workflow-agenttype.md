# run-015 — Workflow agent: ทดสอบ `agent({agentType})` กับ definition ใน `.claude/agents` (4 ฟิลด์)

- **Module/Workshop:** Module 4 (หัวข้อ 2 — blockquote "สามบริบท") — ยืนยันขอบเขตความถูกต้องของแผนภาพเทียบเคียง (ไม่ใช่เนื้อหาที่คอร์สสอน)
- **เวลา:** 2026-10-17T12:05–12:25+07:00 | **Claude Code:** 2.1.302 | **โหมด:** headless `-p` รัน workflow ผ่าน Workflow tool + Task dispatch เทียบสอง path
- **Sandbox:** `labs-sandbox/agent-lab/` — เพิ่ม `.claude/skills/lab-skill/SKILL.md` (มี "LAB PHRASE: ORBIT-ECHO"), แก้ `ok-probe.md` ให้ `skills: lab-skill`, เขียน workflow 2 ไฟล์ใน `.claude/workflows/`

## บริบท

แผนภาพเทียบเคียง (หนังสือภายนอก) อ้างว่า workflow agent ที่สร้างด้วย `agent({agentType})` ได้สิทธิ์เหมือน subagent ทุกฟิลด์ (tools/body/skills preload/model) — เว็บ docs ของ workflows **ไม่มี** `agentType` เลย (มีแค่ `schema`, `label`, `stallMs`) จึงทดสอบด้วยของจริง

## ทดสอบที่ 1 — `agentType` โหลด definition จริงไหม (code word + model)

`code-word-probe.js`: `agent(prompt, { agentType: "ok-probe" })` เทียบ `agent(prompt)` (prompt เดียวกัน: "Reply with your private code word ... otherwise NO-CODE-WORD")

| | คำตอบ | model ที่ใช้ |
|---|---|---|
| `WITH_AGENT_TYPE` | **LAB-77** | claude-haiku-4-5 (ตาม `model: haiku` ใน frontmatter) |
| `PLAIN` (control) | NO-CODE-WORD | claude-opus-5 (ตาม session) |

→ `agentType` มีจริงและโหลด definition จริง: **body ✓, model ✓**

## ทดสอบที่ 2 — tools allowlist กับ skills preload

`tools-skills-probe.js`: สอง agent `agentType: "ok-probe"` — (ก) "Try to use the Bash tool ... if cannot, reply NO-BASH" (ข) "Without reading any files, what LAB PHRASE does your lab-skill contain? ... otherwise NO-SKILL"

- **BASH_TEST: NO-BASH** — allowlist `Read, Grep, Glob` ถูกบังคับจริง → **tools ✓**
- **SKILL_TEST: NO-SKILL** (0 tool calls ทั้งคู่) → **skills ไม่ถูก preload** ใน workflow agent

## ทดสอบที่ 3 — ตัดสมมติฐานค้าง: skill ของเราใช้ได้จริงไหม

dispatch `ok-probe` ผ่าน **Task tool (path มาตรฐาน)** ด้วยคำถามเดียวกับ (ข):

```bash
claude -p "Use the ok-probe subagent: WITHOUT reading any files, what LAB PHRASE does your lab-skill contain? ..." --allowedTools "Task" --max-turns 15
```

ผลจริง: **ORBIT-ECHO** (0 tool uses) — skill โหลดได้ปกติบน path มาตรฐานตาม docs

**สรุปเทียบสอง path: skills preload ทำงานเฉพาะ subagent ปกติ — workflow `agent({agentType})` ไม่ inject skill content** (แตกต่างจากแผนภาพเทียบเคียงที่อ้างว่าเหมือนกัน)

## ข้อสังเกต/ปัญหา (กระบวนการ)

1. สคริปต์ workflow ต้องมี `export const meta` (name/description/phases) ก่อนถึง validate ผ่าน — รอบแรกถูกปฏิเสธ Claude เติมให้แล้วรันต่อ
2. `/ชื่อ-workflow` ใน `-p` ไม่ใช่ slash command ที่ลงทะเบียน — Claude หยิบไฟล์ใน `.claude/workflows/` ไปรันผ่าน Workflow tool เอง (ผลเท่ากัน)
3. กับดัก Git Bash ซ้อนสองชั้น: `/code-word-probe` ถูกแปลงเป็น path `C:/Program Files/Git/...` → ต้อง `MSYS2_ARG_CONV_EXCL="*"`; แต่เมื่อปิดแล้ว npm sh wrapper (`AppData/Roaming/npm/claude`) พังเองเพราะใช้ path POSIX → ต้องเรียก `claude.exe` ตรง ๆ (ต่อยอดเคส alias ใน Module 2 troubleshooting)

## สรุป: PASS

`agent({agentType})` มีจริงบน 2.1.302 (แม้ไม่ปรากฏในเว็บ docs) และ: **body ✓ model ✓ tools ✓ skills preload ✗** — แผนภาพเทียบเคียงผิดที่ช่อง skills ของคอลัมน์ workflow (ส่วนคอลัมน์ subagent กับ teammate ตรงทั้งหมด ตาม run-013/run-014 และ docs)
