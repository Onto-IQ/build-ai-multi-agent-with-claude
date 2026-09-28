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
| [module-01](material/module-01-agent-foundations/lesson.md) | สถาปัตยกรรม AI Agent และแนวโน้มปัจจุบัน | — |
| [module-02](material/module-02-environment-setup/lesson.md) | Technical Environment & Workspace Setup | — |
| [module-03](material/module-03-swarm-parallel/lesson.md) | Parallel Execution ด้วย Swarm Pattern | Workshop 1 |
| [module-04](material/module-04-specialty-agents/lesson.md) | การสร้าง Specialty Agent | Workshop 2 |
| [module-05](material/module-05-skills/lesson.md) | Skills และ Extended Tools | — |
| [module-06](material/module-06-mcp/lesson.md) | MCP (Model Context Protocol) | Workshop 3 (Guided Demo) |
| [module-07](material/module-07-orchestration-sequential/lesson.md) | Orchestration & Sequential Workflows | Workshop 4 |
| [module-08](material/module-08-context-memory/lesson.md) | Context Engineering & Persistent Memory | — |
| [module-09](material/module-09-guardrails-hooks/lesson.md) | Production Guardrails, Permissions & Hooks | Workshop 5 |
| [module-10](material/module-10-capstone/lesson.md) | Capstone Project (Leader-first) | Workshop 6 (Capstone) |
| [module-11](material/module-11-deploy-preflight/lesson.md) | Production Deployment & Pre-flight | (ต่อเนื่อง Capstone) |

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
- ข้อความใน prompt ตัวอย่างเป็นภาษาอังกฤษ (มาตรฐานอุตสาหกรรม ใช้ข้ามเครื่องมือได้) พร้อมคำอธิบายภาษาไทยทีละส่วน — ผู้เรียนสามารถเขียน prompt ภาษาไทยได้เช่นกัน
- ทุก lab ปิดท้ายด้วย "เกณฑ์ผ่าน" ที่ตรวจได้จริง + ส่วน hint/solution (หน้าถัดไปของไฟล์)
