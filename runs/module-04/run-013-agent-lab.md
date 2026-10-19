# run-013 — Agent Lab: ตรวจสอบ frontmatter, silent skip, validate, code word, omitClaudeMd

- **Module/Workshop:** Module 4 (หัวข้อ 1–2, 6) — คุณสมบัติไฟล์ agent และการตรวจสอบ
- **เวลา:** 2026-10-17T11:20–11:27+07:00 | **Claude Code:** 2.1.284 | **โหมด:** headless `-p` + `claude plugin validate`
- **Sandbox:** `labs-sandbox/agent-lab/` — ไฟล์ทดสอบ 10 ตัว (สร้างไว้ล่วงหน้าด้วยสคริปต์ ไม่ให้ Claude สร้างเอง เพื่อคุมเงื่อนไข): ok-probe (ตัวควบคุม + code word), no-name, no-desc, no-frontmatter, bad-yaml (quote ไม่ปิด), dash-name (`-dashy`), colon-name (`re:viewer`), typo-field (`disallowedtools` ตัวเล็ก), md-reader, md-reader-omit (`omitClaudeMd: true`) + `CLAUDE.md` มี RULE ONE ตัวยง ("the project mascot is a purple octopus named ORBIT")

## ทดสอบที่ 1 — `claude plugin validate` เห็นอะไร

```bash
cd labs-sandbox/agent-lab
claude plugin validate .claude        # และ .claude/agents — ผลเหมือนกันทั้งคู่, EXIT=1
```

ผลจริง: รายงานแค่ 2 ไฟล์เท่านั้น

- `bad-yaml.md` → **ERROR**: "YAML frontmatter failed to parse ... At runtime this agent does not load at all — with no frontmatter name it is treated as a co-located reference document and skipped."
- `no-desc.md` → **WARNING**: "No description in frontmatter."
- ไม่ถูกกล่าวถึงเลย: no-name, no-frontmatter, dash-name, colon-name, typo-field, ok-probe

## ทดสอบที่ 2 — session โหลด agent ตัวไหนจริง

```bash
claude -p "Which custom subagents are available in this session? List only their names, one per line, nothing else. Do not use any tools." --max-turns 5
```

ผลจริง:

```text
md-reader
md-reader-omit
ok-probe
typo-field
```

→ โหลดเฉพาะ 4 ไฟล์ถูกต้อง ไฟล์พัง 6 ไฟล์หายเงียบ ๆ (ไม่มี warning ใน session) · `typo-field` โหลดปกติทั้งที่ field สะกดผิด

## ทดสอบที่ 3 — debug log บอกอะไร (ค้นไฟล์ใน `~/.claude/debug/`)

- `bad-yaml.md`: `[WARN] Failed to parse YAML frontmatter ...` + `[ERROR] ... failed to parse and was ignored`
- `colon-name.md`: `[ERROR] ... has invalid name 're:viewer': names must not contain ':' (reserved for plugin namespacing)`
- `dash-name.md`: `[ERROR] ... has invalid name '-dashy': names must not start with '-'`
- `no-desc.md`: `[DEBUG] ... is missing required 'description' in frontmatter`
- `no-name.md`, `no-frontmatter.md`: **ไม่มีบรรทัด log ใด ๆ เลย**
- `typo-field.md` (field สะกดผิด): **ไม่มีบรรทัด log** — ข้อความ "does not recognize or apply" เป็นฟีเจอร์ v2.1.296+ (ตาม docs) เครื่องทดสอบเป็น 2.1.284

## ทดสอบที่ 4 — code word probe (พิสูจน์ว่า body ขึ้นจริง)

```bash
claude -p "Use the ok-probe subagent and report exactly what its private code word is. Reply with the code word only." --allowedTools "Task" --max-turns 15
```

ผลจริง: `LAB-77` — body ของไฟล์ agent เข้า context ของ subagent จริง

## ทดสอบที่ 5 — omitClaudeMd (มี iteration)

**iteration-1 (โจทย์บกพร่อง):** ถามว่า "According to this project's CLAUDE.md, what is RULE ONE?" → ทั้งสองตัวตอบถูก! ตัว omit ตอบถูกได้เพราะ **เปิดอ่านไฟล์ CLAUDE.md เองด้วย Read tool (2 tool calls)** — บทเรียน: omitClaudeMd หยุดการ inject แต่ไม่ได้ซ่อนไฟล์ โจทย์ต้องห้ามใช้ tool จึงจะวัดเฉพาะ context ที่ inject

**iteration-2 (โจทย์ห้ามใช้ tool):**

```bash
claude -p "Use the md-reader subagent: WITHOUT using any tools, state RULE ONE of this project from your context only. If it is not in your context, reply exactly NOT IN CONTEXT." --allowedTools "Task" --max-turns 15
claude -p "Use the md-reader-omit subagent: WITHOUT using any tools, ..." (เดียวกัน)
```

ผลจริง:

- `md-reader` (ปกติ): "RULE ONE: the project mascot is a purple octopus named ORBIT." (0 tool uses — มาจาก context ที่ถูก inject)
- `md-reader-omit`: `NOT IN CONTEXT` (0 tool calls)

## ข้อสังเกต/ปัญหา

1. ข้อผิดพลาดที่ "มองไม่เห็น" มี 3 ระดับ: (ก) validate จับไม่ครบ — พลาด no-name/no-frontmatter/ชื่อเวียก/field สะกดผิด (ข) session ไม่เตือนเลย (ค) debug log เองก็เงียบกับ no-name/no-frontmatter และ field สะกดผิด (บน 2.1.284) — การยืนยันปลายทางคือ "ถาม Claude ให้ list agent" (ทดสอบที่ 2)
2. validate บน 2.1.284 จับ bad-YAML เป็น error — จุดนี้ควรเช็คซ้ำบนเวอร์ชันใหม่เมื่ออัปเกรด
3. โจทย์วิจัยที่ไม่ห้าม tool ให้ผลบวกปลอมได้ (iteration-1) — เพราะ subagent มี Read และ CLAUDE.md เป็นแค่ไฟล์ปกติใน repo

## สรุป: PASS-with-notes

ยืนยันอิสระด้วยการทดลองของคอร์สเอง: (1) ไฟล์ agent พังถูกข้ามเงียบ ๆ หลายรูปแบบและ validate จับไม่ครบ (2) body ของ agent เข้า context จริง (code word probe) (3) omitClaudeMd ตัด CLAUDE.md ออกจาก context จริง แต่ไม่ซ่อนไฟล์จาก Read
