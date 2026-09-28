# Module 7 — Orchestration & Sequential Workflows

> **เวลา:** ~60 นาที (สอน 25 + Workshop 4 35) | **ผลลัพธ์ที่คาดหวัง:** ผู้เรียนต่อ Agent เป็น pipeline ที่ output ด่านหน้าเป็น input ด่านหลัง และให้ Leader กำกับด้วย Task List

## 1. ทำไมต้อง Sequential — ทบทวนด้วยเหตุผล ไม่ใช่ความเชื่อ

จาก Module 1: ขนานได้เฉพาะงานที่ "ไม่ต้องรู้ผลกัน" ในทางกลับกัน **pipeline ซอฟต์แวร์แทบทุกสายต้องต่อคิว**:

```text
Design (สัญญากลาง: สเปก+API) → Implementation (สร้างตามสเปก) → Review (ตรวจกับสเปก)
```

- ด่าน Build ต้องมี design ก่อน — ไม่งั้นเดาเอง
- ด่าน Review ต้องมีโค้ดจริง — ไม่งั้นตรวจอะไร?
- **สัญญากลาง (design doc) คือสิ่งที่ทำให้ด่าน Build ขนานได้ (Frontend/Backend) โดยไม่ชนกัน**

## 2. Leader-first Orchestration — ให้ Leader คุมสถานะ

ใน TUI Leader บริหารงานผ่าน **Task List** ที่ผู้เรียนมองเห็น (⬜ Pending / 🔄 In Progress / ✅ Completed) — โจทย์ที่ดีต้องบังคับให้ Leader โชว์ความคืบหน้า:

```text
Before starting, create a task list for the 3 stages and keep it updated
as you complete each stage. I want to see progress: Pending → In Progress → Completed.
```

("แล้วเห็นพัฒนาการ" = ผู้เรียนมอง task list ไหล ไม่ใช่รอเงียบ ๆ 5 นาที)

## 3. Agent Teams — เมื่ออยากให้ Agent คุยกันเอง

ฟีเจอร์ experimental: เปิดด้วย `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` แล้วสั่งเป็นภาษาธรรมชาติ:

```text
Spawn a team of 3 teammates: one designer, one implementer, one reviewer.
Designer writes the plan first; implementer waits for it; reviewer checks at the end.
```

- Teammates คุยกันผ่าน **SendMessage** + แชร์ Task List (dependency ปลดล็อกอัตโนมัติ)
- **เริ่มที่ 3–5 ตัว** — token โตเป็นเส้นตรงตามจำนวนสมาชิก
- ยัง experimental → ในโปรดักชันจริง ใช้ sequential pipeline แบบทำเองก่อน แล้วค่อยพิจารณาทีม

## 4. Prompt ตัวอย่างหลักของ Workshop 4 (Sequential 3 ด่าน)

```text
Work on this demo-shop project in 3 sequential stages. Create a task list first
and keep every stage's status updated while you work.

Stage 1 — Design: write docs/DESIGN.md proposing how to add a POST /api/products
endpoint: request/response JSON shape, validation rules, error codes (404/400/500
separated). Do not write code yet.

Stage 2 — Implement: implement exactly what DESIGN.md specifies in server.js.
No extra features.

Stage 3 — Review: review the new code against DESIGN.md. List any mismatch,
missing validation, or style issue as findings with file:line. Fix nothing.

Rules: each stage reads the previous stage's output. Report a 5-line summary
of what each stage produced.
```

Anatomy:

| ส่วน | ทำหน้าที่ |
|---|---|
| `in 3 sequential stages` + task list | บังคับลำดับ + ความเห็นพัฒนาการ |
| `Do not write code yet` / `Fix nothing` | กันด่านล้ำหน้า (ทุกด่านมีขอบเขตตายตัว) |
| `implement exactly what DESIGN.md specifies` | สัญญากลางคือแหล่งความจริงเดียว |
| `Report a 5-line summary` | คุม output ให้กระชับ |

## 5. Headless ทดสอบ (✅ tested — runs/module-07/run-005)

```bash
claude -p "<prompt ข้อ 4>" --permission-mode acceptEdits --max-turns 30
```

(`acceptEdits` ให้เขียนไฟล์โค้ด/docs อัตโนมัติ — ระวัง: ไม่คลุม `.claude/**` ดู run-003)

> ⚠️ **ข้อค้นพบจากการรันจริง (run-005):** ใน headless จะ **ปฏิเสธ Bash ทุกคำสั่งโดย default** — Stage Implement ทำได้แค่ "เขียนโค้ดแบบ static" โดยไม่ได้ `node --check`/รันจริง และ Reviewer จะแจ้งเองว่า "not executed" ถ้า lab ของคุณต้องรันคำสัง ให้เพิ่มเช่น `--allowedTools "Bash(node:*)"` **หรือรันใน TUI แล้วกดอนุมัติ** (แนะนำสำหรับผู้เรียน)

## กับดักที่พบบ่อย

- ไม่บังคับ task list → Leader ทำเงียบ ๆ จบหมด ผู้เรียนไม่เห็นพัฒนาการ
- ไม่ห้าม "Fix nothing" ในด่าน Review → ด่านตรวจแก้โค้ดเอง ทำให้ trace ไม่ได้ว่าใครแก้อะไร
- ปล่อย Stage 1 เขียนสเปกกำกวม → Stage 2 เดา → Review จับ mismatch ได้ (จริง ๆ อันหลังคือ "บทเรียนที่ดี" ให้สอนเรื่องคุณภาพสัญญากลาง)
- **รัน headless แล้วคิดว่า "โค้ดถูกรันทดสอบแล้ว"** → ไม่ใช่! ดู warning "not executed" จาก Reviewer เสมอ (เคสจริง run-005)
