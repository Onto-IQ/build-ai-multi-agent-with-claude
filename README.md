# Build AI Multi-Agent with Claude Code

หลักสูตร 2 วัน (VIBE-CODE-L2) สำหรับสร้างทีมเอเจนต์ด้วย Claude Code ตั้งแต่สำรวจงานแบบขนาน ไปจนถึงแดชบอร์ดยอดขายที่พร้อมตรวจคุณภาพก่อนส่งขึ้น Vercel

เอกสารนี้ภาษาไทย คำสั่งและชื่อฟิลด์เป็นภาษาอังกฤษ ทุกแล็บมีคู่ prompt อังกฤษ/ไทย

## ได้อะไรจากสองวันนี้

1. ตั้งเครื่องและล็อกอิน Claude Code ให้พร้อมก่อนเริ่มงานกลุ่ม
2. สร้าง specialty agent ด้วย Markdown + YAML frontmatter แล้วผูก skill กับ MCP
3. เลือกได้ว่าเมื่องานควรวิ่งขนาน (swarm) หรือต่อคิว (sequential) และสั่ง leader ให้แตกงาน
4. วางขอบเขตสิทธิ์ hook และงบต้นทุนก่อนปล่อยเอเจนต์แก้ไฟล์
5. ให้ทีม 5 บทบาททำความสะอาดข้อมูลยอดขาย สรุปผู้บริหาร และทำแดชบอร์ดจากสัญญากลางชุดเดียวกัน

## เหมาะกับใคร

ผู้เรียนที่ใช้เทอร์มินัลได้ระดับ `cd` / `ls` / `mkdir` เขียน prompt กำหนดบทบาทได้ และใช้ Git ได้พื้นฐาน พื้นหลังด้านข้อมูลหรือ Power BI ใช้ได้ งานในห้องคือการสั่งเอเจนต์กับแอป Node ขนาดเล็ก ไม่ต้องเขียนเฟรมเวิร์กเว็บมาก่อน

## กำหนดการ

วันที่ 1 — พื้นฐาน เครื่อง และเอเจนต์เฉพาะทาง

| เวลา | โมดูล | แล็บ |
|---|---|---|
| เช้า | [01 สถาปัตยกรรมเอเจนต์](day-1/01-agent-foundations/README.md) | สาธิตสั้น |
| เช้า | [02 ตั้งเครื่อง](day-1/02-environment-setup/README.md) | [Lab 0](day-1/02-environment-setup/LAB.md) |
| เช้า | [03 Swarm](day-1/03-swarm/README.md) | [Workshop 1](day-1/03-swarm/LAB.md) |
| บ่าย | [04 Specialty agent](day-1/04-specialty-agents/README.md) | [Workshop 2](day-1/04-specialty-agents/LAB.md) |
| บ่าย | [05 Skills](day-1/05-skills/README.md) | [แล็บสั้น](day-1/05-skills/LAB.md) |
| บ่าย | [06 MCP](day-1/06-mcp/README.md) | [Workshop 3](day-1/06-mcp/LAB.md) guided demo |

วันที่ 2 — งานทีละขั้น quality gate และ capstone

| เวลา | โมดูล | แล็บ |
|---|---|---|
| เช้า | [07 Sequential pipeline](day-2/07-sequential-orchestration/README.md) | [Workshop 4](day-2/07-sequential-orchestration/LAB.md) |
| เช้า | [08 Context และ memory](day-2/08-context-memory/README.md) | [แล็บสั้น](day-2/08-context-memory/LAB.md) |
| เช้า | [09 Guardrails และ hooks](day-2/09-guardrails-hooks/README.md) | [Workshop 5](day-2/09-guardrails-hooks/LAB.md) |
| บ่าย | [10 Capstone 5 บทบาท](day-2/10-capstone/README.md) | [Workshop 6](day-2/10-capstone/LAB.md) |
| บ่าย | [11 Deploy และ preflight](day-2/11-deploy-preflight/README.md) | [แล็บส่งงาน](day-2/11-deploy-preflight/LAB.md) |

โครงรายชั่วโมงฉบับเต็มอยู่ที่ [`instructor/outline-rev1.md`](instructor/outline-rev1.md)

## สิ่งที่ต้องมีก่อนวันเรียน

- Windows 10/11, macOS หรือ Linux บน Windows ใช้ **Git Bash** หรือ WSL คำสั่งในแล็บเป็น bash
- [Node.js 20 LTS ขึ้นไป](https://nodejs.org/) ตรวจบน Node 24.19.0
- Git
- บัญชี Claude Pro หรือ Team ที่ผู้จัดส่งให้ระหว่างอบรม
- Claude Code CLI รุ่น **2.1.296 ขึ้นไป** (`npm install -g @anthropic-ai/claude-code` แล้ว `claude update` ถ้าต่ำกว่า)
- VS Code หรือ Cursor
- บัญชี [Vercel](https://vercel.com/) สำหรับโมดูล 11 สมัครฟรีก่อนวันเรียน
- ปิดตัวแปร `ANTHROPIC_API_KEY` ระหว่างเรียน ถ้าเครื่องตั้งค่านี้ไว้ การล็อกอินของคลาสจะถูกคีย์นี้ทับ และค่าใช้จ่ายจะคิดแบบจ่ายตามการใช้

รายการติดตั้งทีละขั้นอยู่ที่ [SETUP.md](SETUP.md)

## เช็กลิสต์วันแรก

จากรากของ repo นี้:

```bash
node scripts/verify-setup.mjs
```

ผ่านเมื่อ Node กับ Git พร้อม หน้าsandbox ตอบได้ และ quality gate ชุดเริ่มต้นจบด้วย exit 2 ถ้ายังไม่ล็อกอิน Claude ให้ใส่ `--skip-claude` ชั่วคราว แล้วกลับมาล็อกอินใน Lab 0

เปิดแอป:

```bash
cd sandbox/sales-insight
node server.js
```

เบราว์เซอร์ที่ `http://127.0.0.1:3000` แล้วหยุดด้วย Ctrl+C แอปไม่มี `npm install`

## ถ้าตามไม่ทัน

จากราก repo คัดลอกผลของแล็บที่ข้ามเข้าsandbox แล้วอ่าน `SOLUTION.md` ในโฟลเดอร์นั้น

```bash
node scripts/catch-up.js w1
node scripts/catch-up.js w2
node scripts/catch-up.js w3
node scripts/catch-up.js w4
node scripts/catch-up.js w5
node scripts/catch-up.js w6
```

`w5` และ `w6` เขียนทับ `data/sales.csv` ด้วยไฟล์ที่สะอาดแล้ว อย่าใช้คำสั่งนี้ถ้ายังอยากเห็นไฟล์ดิบด้วยตัวเอง

ตรวจคำตอบอ้างอิงทั้งชุด:

```bash
node scripts/check-solutions.mjs
```

คำสั่งนี้ต้องได้starter quality gateเป็น exit 2 และ `solutions/w1` ถึง `w6` ผ่านทุกข้อ

## แผนที่ repo

| ที่ | ใช้ทำอะไร |
|---|---|
| `sandbox/sales-insight/` | แอปเริ่มต้น ข้อมูลยอดขายยังไม่สะอาด quality gate ต้องไม่ผ่าน |
| `day-1/` `day-2/` | บทเรียนและแล็บ |
| `solutions/w1` … `w6` | ผลอ้างอิงของแต่ละแล็บ พร้อม `check.js` |
| `reference/` | ชีต frontmatter, คู่ prompt, failure modes, อภิธาน |
| `instructor/` | บันทึกทดสอบ เฉลย และชุดสาธิต หน้านี้ไม่ใช่ทางเดินของผู้เรียน |

## เวอร์ชันที่ตรวจแล้ว

| รายการ | ค่า |
|---|---|
| วันที่ตรวจสคริปต์ | 2026-10-19 |
| Node | 24.19.0 (ขั้นต่ำของคอร์สคือ 20) |
| Git | 2.51.0.windows.1 |
| ระบบที่รันสคริปต์ | Windows, Git Bash ไม่จำเป็นสำหรับสคริปต์ Node |
| Claude Code ขั้นต่ำของคอร์ส | 2.1.296 |
| รัน headless ชุดเก่า | 2.1.302 ดู `instructor/test-runs/` |

สคริปต์ `verify-setup` และ `check-solutions` ผ่านบนเครื่องนี้โดยไม่เรียก Claude แล็บที่เปิด TUI, hook ที่ยิงจากใน Claude Code, การ deploy จริงขึ้น Vercel และรันบน macOS ยังต้องมีคนเดินหนึ่งรอบก่อนวันสอน

## วิธีใช้ในห้อง

เปิด Claude Code จากโฟลเดอร์ `sandbox/sales-insight` ด้วยคำสั่ง `claude` แล็บออกแบบมาสำหรับโหมดโต้ตอบนี้ ใช้ `claude -p` เฉพาะขั้นที่แล็บเขียนธงและธงสิทธิ์ไว้ให้ครบ การเขียนไฟล์ใต้ `.claude/` ในโหมด headless ถูกปฏิเสธได้แม้ใส่ `--allowedTools` และ Bash ในโหมด headless ไม่ถูกเปิดให้เอง
