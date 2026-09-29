# สื่อการสอน — Build AI Multi-Agent with Claude Code (VIBE-CODE-L2)

> สื่อประกอบการสอนฉบับผู้สอนและผู้เรียน จัดตาม Module 1–11 ใน outline ฉบับเผยแพร่
> คุณภาพควบคุมด้วย [QUALITY-GATE.md](../QUALITY-GATE.md) — ทุก prompt หลักถูกทดสอบจริงกับ Claude Code TUI และเก็บหลักฐานไว้ใน [runs/](../runs/)

## โครงสร้างสื่อต่อ Module

| ไฟล์ | สำหรับใคร | เนื้อหา |
|---|---|---|
| `lesson.md` | ผู้สอน + ผู้เรียน | แนวคิด, คำอธิบาย, ขั้นตอนทำตาม (พร้อมคำสั่ง copy ได้), prompt ตัวอย่าง + anatomy |
| `lab.md` | ผู้เรียน | แบบฝึกหัด Workshop: บริบท → โจทย์ → เกณฑ์ผ่าน → hint/solution (เฉพาะ Module ที่มี Workshop) |

| Module | หัวข้อ | Workshop |
|---|---|---|
| [module-01](module-01-agent-foundations/lesson.md) | สถาปัตยกรรม AI Agent และแนวโน้มปัจจุบัน | — |
| [module-02](module-02-environment-setup/lesson.md) | Technical Environment & Workspace Setup | — |
| [module-03](module-03-swarm-parallel/lesson.md) | Parallel Execution ด้วย Swarm Pattern | Workshop 1 |
| [module-04](module-04-specialty-agents/lesson.md) | การสร้าง Specialty Agent | Workshop 2 |
| [module-05](module-05-skills/lesson.md) | Skills และ Extended Tools | — |
| [module-06](module-06-mcp/lesson.md) | MCP (Model Context Protocol) | Workshop 3 (Guided Demo) |
| [module-07](module-07-orchestration-sequential/lesson.md) | Orchestration & Sequential Workflows | Workshop 4 |
| [module-08](module-08-context-memory/lesson.md) | Context Engineering & Persistent Memory | — |
| [module-09](module-09-guardrails-hooks/lesson.md) | Production Guardrails, Permissions & Hooks | Workshop 5 |
| [module-10](module-10-capstone/lesson.md) | Capstone Project (Leader-first) | Workshop 6 (Capstone) |
| [module-11](module-11-deploy-preflight/lesson.md) | Production Deployment & Pre-flight | (ต่อเนื่อง Capstone) |

## Sandbox สำหรับฝึก

`labs-sandbox/demo-shop/` — เว็บแอปร้านค้าตัวอย่าง (Pure Node.js ไม่มี dependency) ใช้เป็น "โครงการจริง" ให้ทีม Agent วิเคราะห์/ตรวจสอบ/พัฒนาต่อตลอดหลักสูตร

```bash
cd labs-sandbox/demo-shop
node server.js          # เปิดที่ http://localhost:3000
```

> โค้ดมีข้อผิดพลาดที่ปลูกไว้ตั้งใจสำหรับ Workshop ด้าน QA/Security — รายการปมอยู่ใน lesson ของ Module 9 (ส่วนผู้สอนเท่านั้น)

## รูปแบบการเขียน (Conventions)

- ทุก prompt ที่ผ่านการทดสอบจริงจะมีป้าย `✅ tested` พร้อมลิงก์ไป transcript ใน `runs/`
- บล็อกคำสั่งที่ผู้เรียนต้องพิมพ์ใช้ ```bash, ผลลัพธ์ที่คาดหวังใช้ ```text พร้อมหัว "ผลลัพธ์ที่คาดหวัง"
- **ทุก prompt หลักมีคู่ภาษาอังกฤษ/ไทย** พร้อมผลการทดสอบจริงทั้งสองภาษา (ดูสรุปด้านล่าง)
- ทุก lab ปิดท้ายด้วย "เกณฑ์ผ่าน" ที่ตรวจได้จริง + ส่วน hint/solution

## คู่มือ Prompt ไทย/อังกฤษ — สรุปจากการทดสอบจริง 5 รอบเพิ่มเติม (run-008–012)

คอร์สนี้ทดสอบ prompt ภาษาไทยกับงานหลักทุกประเภทแล้ว — สรุปประสบการณ์ที่พิสูจน์ด้วย transcript:

| ประเด็น | ผลจริง | หลักฐาน |
|---|---|---|
| **ภาษา prompt = ภาษาคำตอบ** | สั่งไทยได้รายงานไทยทั้งชุด แต่ file:line/ชื่อ endpoint/ฟังก์ชันยังเป็นภาษาเทคนิคถูกต้อง | run-008 vs run-002 |
| **ค่า machine-readable ยังถูกต้อง** | สั่ง frontmatter เป็นไทย → `name` ออกมา Latin kebab-case, `tools`/`model` ตรงสเปก | run-009 |
| **ภาษาไทยผ่าน MCP ไม่เพี้ยน** | สวัสดี+เลขไทย ๐๑๒๓ ผ่าน tool call→server→กลับ context ครบ ไม่มี mojibake (agent ตรวจถึงระดับ codepoint) | run-010 |
| **สัญญากลางแก้ความคลาดเคลื่อนของคนสั่ง** | prompt ไทยขาด `stock` แต่ agent จับข้อขัดแย้งกับ DESIGN.md เอง + ทำ mutation check พิสูจน์เทสต์ | run-011 |
| **ความกำกวมใช้ได้ทุกภาษา — และแพงทุกภาษา** | "สร้าง subagent ให้โปรเจกต์นี้หน่อย" + max-turns 8 → หมดเทิร์น ไม่มีไฟล์ ไม่มีคำตอบ | run-012 vs run-009 |
| **ต้อง proofread ผลงาน agent** | พบตัวอักษรภาษาอื่นหลุด 1 ตำแหน่งในคำตอบไทยยาว ("在一次") — ไม่กระทบเทคนิค แต่เอกสารต้องตรวจ | run-011 |

**คำแนะนำการเขียน prompt แบบสองภาษา:**

1. เลือกภาษาตาม**ผู้อ่านผลลัพธ์** — งานที่ deliverable เป็นเอกสารไทย ใช้ prompt ไทยจะได้ผลลัพธ์ไทยทันที
2. **สิ่งที่ห้ามแปล:** ชื่อฟิลด์ (`name/tools/model`), ชื่อ tool (`mcp__...`), คำสั่ง CLI, path — จากการทดสอบ Claude แยกให้ถูกอยู่แล้ว แต่อย่าเขียนสั่งกำกวม
3. **เกณฑ์การตรวจใส่ใน prompt** ("ถอดรหัสถูกหรือเพี้ยน", "รายงาน ≤300 คำ") ทำให้ Agent สร้างวิธีตรวจเอง — ใช้ได้ทั้งสองภาษา
4. **ความครบถ้วนของสเปกสำคัญกว่าภาษา** — โจทย์กำกวมล้มเหลวทั้ง EN (run-003 iter-2) และ TH (run-012)
