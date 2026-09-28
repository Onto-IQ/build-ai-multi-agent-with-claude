# Module 4 — การสร้างและกำหนดสเปก Specialty Agent

> **เวลา:** ~55 นาที (สอน 25 + Workshop 2 30) | **ผลลัพธ์ที่คาดหวัง:** ผู้เรียนสร้าง Subagent เฉพาะทางของตัวเองด้วย Markdown + YAML ผ่าน Prompt และเรียกใช้ได้ 3 วิธี

## 1. CLAUDE.md — คู่มือประจำบ้านของ Agent

`CLAUDE.md` คือไฟล์ instruction ที่ Claude Code โหลดทุกครั้งที่เริ่มงาน — เหมาะกับข้อมูลที่ "ทุก Agent ต้องรู้":

- โครงสร้างโปรเจกต์, คำสั่ง build/test ที่ใช้ได้, ข้อตกลงการเขียนโค้ด
- ระดับโฟลเดอร์: ไฟล์เดียวที่ root ของโปรเจกต์ (ทีมแชร์ผ่าน Git) และ `~/.claude/CLAUDE.md` (ส่วนตัว ทุกโปรเจกต์)

หลักการเขียน: **สั้น ชัด ใช้งานได้จริง** — เขียนยาวเปลือง context ทุก turn

## 2. Specialty Agent = Markdown + YAML Frontmatter

ไฟล์หนึ่งไฟล์ = Agent หนึ่งตัว เก็บที่ `.claude/agents/` (ทีมแชร์ผ่าน Git) หรือ `~/.claude/agents/` (ส่วนตัว):

```markdown
---
name: code-researcher
description: Explains how code works and researches codebase questions. Use proactively for "how does X work" questions.
tools: Read, Grep, Glob
model: sonnet
---

You are a code research specialist for this repository.

## Method
1. Search before answering — never guess file contents.
2. Cite evidence as `file:line` for every claim.

## Output format
- **Answer** (2–4 sentences)
- **Evidence** (bullets with file:line)
- **Risks** (if any)

## Constraints
- Read-only. Never modify files.
```

**Frontmatter fields ที่ใช้บ่อย:**

| Field | ค่า | หน้าที่ |
|---|---|---|
| `name` | kebab-case, ไม่ซ้ำ | ชื่อเรียก (@-mention) |
| `description` | สั้น ชี้เงื่อนไขการใช้ | **หัวใจของ auto-delegation** — Leader อ่านสิ่งนี้เพื่อเลือก agent |
| `tools` | `Read, Grep, Glob` | allowlist — ไม่ใส่ = ได้ทุกเครื่องมือ |
| `model` | `sonnet` / `haiku` / `opus` / `inherit` | Model routing — งานเบ็ดเตล็ดใช้ตัวเร็ว งานยากใช้ตัวแข็ง |
| `permissionMode` | `acceptEdits`, `plan`, ... | โหมดสิทธิ์ของ agent ตัวนั้น |

> เคล็ดลับ description: ใส่วลี "Use proactively for ..." เพื่อชวน Leader ใช้ agent นี้อัตโนมัติเมื่อเจอโจทย์ตรงประเภท

## 3. Model Routing — จับคู่งานกับ Model

| งาน | Model | เหตุผล |
|---|---|---|
| สแกน/ค้นเร็ว, จัดหมวด | `haiku` | ถูกและเร็ว |
| วิเคราะห์ logic, สรุปงานวิจัย | `sonnet` | สมดุล |
| ตัดสินใจสถาปัตยกรรม, งานยากมาก | `opus` | คุณภาพสูงสุด |

## 4. เรียกใช้ 3 วิธี

1. **Auto-delegation** — Leader อ่าน `description` แล้วเลือกเองเมื่อโจทย์ตรง
2. **@-mention** — พิมพ์ `@code-researcher <โจทย์>` = บังคับใช้ตัวนี้
3. **CLI flag** — `claude --agent code-researcher` = ทั้ง session ใช้ persona นี้

## 5. Prompt-driven Generation — ให้ Claude สร้าง Agent ให้ (แนวทางคอร์ส)

⚠️ ตั้งแต่ Claude Code v2.1.198 ตัวช่วย `/agents` ถูกถอดออก — แนวทางมาตรฐานคือ **ให้ Claude เขียนไฟล์ให้**:

```text
Create a new subagent file at .claude/agents/code-researcher.md for this project.

Purpose: a code research specialist that answers "how does X work" questions.
Frontmatter: name code-researcher, description that mentions code research and
says to use it proactively for how-does-it-work questions, tools Read/Grep/Glob,
model sonnet.
Body: a system prompt with sections Method (search before answering, cite
file:line), Output format (Answer / Evidence / Risks), Constraints (read-only).
Keep the whole file under 40 lines.
```

จุดที่ต้องสอน: prompt นี้ **กำหนดทั้ง frontmatter และโครง body** ให้ครบ — Claude จะเขียนไฟล์ถูกรูปแบบตั้งแต่ครั้งเดียว (✅ tested: runs/module-04/)

## 6. ตรวจว่า Agent ถือกำเนิดถูกต้อง (✅ tested — runs/module-04/run-003)

**ใน TUI:** รัน prompt ข้อ 5 แล้ว **กดอนุมัติ** เมื่อ Claude ขอ permission เขียนไฟล์ `.claude/**` (ระบบจะไม่ยอม auto-approve ไฟล์กลุ่มนี้เพราะเป็น executable config — เป็นมาตรการกัน prompt injection ที่ดี)

**ใน Headless (ทดสอบอัตโนมัติ):** path `.claude/**` ถูก deny ทุกรูปแบบ `--allowedTools` (ทดสอบครบ 3 รูปแบบ ณ v2.1.284) — ต้องใช้:

```bash
claude -p "<prompt สร้าง agent>" --permission-mode bypassPermissions --max-turns 10
```

⚠️ `bypassPermissions` ใช้เฉพาะ sandbox ที่ทิ้งได้ — อย่าใช้บนโปรเจกต์จริง

**ตรวจไฟล์ด้วยตาตัวเองเสมอ** (บทเรียนจากการทดสอบ: Agent อ้างว่าเขียนไฟล์แล้ว 3 จาก 8 รอบ ทั้งที่ Write ถูกปฏิเสธ!):

```bash
cat .claude/agents/code-researcher.md   # frontmatter ครบ 5 ฟิลด์?
```

**แล้วพิสูจน์ว่าใช้งานได้:**

```bash
claude -p "Use the code-researcher subagent to explain how POST /api/cart/total computes the total, and list 2 risks in that logic." --allowedTools "Task" --max-turns 15
```

ผลจริงที่ได้: คำอธิบาย 5 ขั้นอ้าง `server.js:41-54`, ชี้ risks เรื่อง `discountPercent` ไม่ validate (ตัวอย่าง attack: `discountPercent:-50` → คิดเงินเพิ่ม!) และ unhandled throw ทำ server ล่ม — transcript เต็มที่ runs/module-04/run-003

> **เคล็ดลับ debugging ที่ใช้จริง:** อยากเห็นว่า Agent เรียก tool อะไรและถูก deny ตรงไหน ให้เพิ่ม `--output-format stream-json --verbose` (ธงคู่บังคับ) แล้ว grep `"is_error":true`

## กับดักที่พบบ่อย

- `description` เขียนกำกวม → auto-delegation ไม่ยอมเลือกตัวนี้ (ต้อง @-mention ตลอด)
- ให้ tools เกินจำเป็น (ลืมตัด `Edit/Write` ใน agent อ่านอย่างเดียว) → เสี่ยงโดนแก้ไฟล์
- ตั้งชื่อซ้ำกับ built-in (`explore`) → ชนกัน
- **cwd เป็น subfolder** → Agent อาจถามกลับว่า "โปรเจกต์" คืออันไหน — ระบุ "INSIDE THE CURRENT WORKING DIRECTORY" ใน prompt สร้างไฟล์ (✅ เคสจริงจาก run-003)
