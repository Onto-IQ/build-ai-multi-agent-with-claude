# Build AI Multi-Agent with Claude Code

**Course ID:** VIBE-CODE-L2 | **หมวดหมู่:** Artificial Intelligence | **ประเภท:** Public Course  
**ระยะเวลา:** 2 วัน (12 ชั่วโมง) 09:00 – 16:00 น.

---

## 1. ข้อมูลหลักสูตร

| รายการ | รายละเอียด |
|---|---|
| **ชื่อหลักสูตร (EN)** | BUILD AI MULTI-AGENT WITH CLAUDE CODE |
| **ชื่อหลักสูตร (TH)** | สร้าง Multi-Agent Systems โดยใช้ Claude Code ในระดับ Production |
| **Course ID** | VIBE-CODE-L2 |
| **หมวดหมู่** | Artificial Intelligence |

---

## 2. วัตถุประสงค์หลักสูตร

ผู้เข้าอบรมจะสามารถ:

1. บริหารจัดการสภาพแวดล้อม พารามิเตอร์ และโปรไฟล์การทำงานของ Claude Code บน Local Environment ได้อย่างถูกต้อง
2. ออกแบบและสร้าง **Specialty Agents** ด้วย Markdown + YAML Frontmatter พร้อมติดตั้ง Skills และเชื่อมต่อเครื่องมือภายนอกผ่าน MCP (Model Context Protocol)
3. ออกแบบสถาปัตยกรรมการทำงานร่วมกันของ Agent ทั้งแบบ **Swarm (Parallel)**, **Sequential Pipeline** และ **Leader-first Orchestration** ผ่าน Prompt
4. วางระบบควบคุมคุณภาพ ความปลอดภัย และงบประมาณ Token ด้วย **Permission Boundaries, Approval Gates** และ **Hooks/Guardrails**
5. พัฒนาและส่งมอบระบบงานจริง (Business Web Application) สู่ Production Platform (Vercel) ร่วมกันเป็นทีมภายใต้สัญญากลาง (Shared Contract)

---

## 3. กลุ่มเป้าหมายและพื้นฐานที่จำเป็น

### กลุ่มเป้าหมาย
* **Developers / Software Engineers** ที่ต้องการยกระดับจาก AI Chatbot สู่ Autonomous Agentic Workflows
* **Tech Leads / System Architects** ที่ต้องการวางโครงสร้าง Multi-Agent Systems เพื่อใช้งานจริงในทีมและองค์กร
* **Founders / Technical Builders** ที่ต้องการใช้ทีม AI Agent อัตโนมัติขับเคลื่อนการพัฒนาและส่งมอบซอฟต์แวร์

### พื้นฐานของผู้เข้าอบรม (Prerequisites)
* สามารถใช้งาน Terminal / Command Line / PowerShell เบื้องต้นได้ (`cd`, `ls`, `mkdir`)
* มีทักษะการเขียน Prompt เพื่อกำหนดบทบาท วัตถุประสงค์ และขอบเขตการทำงานของ AI
* มีความรู้พื้นฐานเกี่ยวกับการจัดการ Source Control ด้วย Git และ GitHub

---

## 4. ความต้องการของระบบ (Environment Requirements)

* **ระบบปฏิบัติการ:** Windows 10 / 11, macOS หรือ Linux
* **Software:** Node.js (Latest LTS version), Git, VS Code หรือ Cursor
* **Claude Platform:** Claude Account และ Claude Code CLI (ติดตั้งผ่าน npm ใช้งานผ่าน Terminal)
* **Subscription:** สิทธิ์การใช้งาน Claude Pro / Team (ทางผู้จัดเตรียม Account ให้ระหว่างอบรม)

---

## 5. กำหนดการและเนื้อหาหลักสูตร

```text
วันที่ 1: Foundation, Local Environment & Agent Specialization
├── เช้า:  Architecture, Environment Setup & Swarm Pattern
└── บ่าย:  Specialty Agents, Skills & MCP Integration

วันที่ 2: Coordination, Production Guardrails & Capstone Deployment
├── เช้า:  Sequential Pipelines, Memory & Quality Gates
└── บ่าย:  End-to-End Capstone Project & Deployment
```

> **หมายเหตุการจัดเวลา:** Workshop 3 ออกแบบเป็น Guided Demo สั้น (≈20 นาที) เพื่อให้ช่วงบ่ายวันที่ 1 ครอบคลุมทั้ง Skills และ MCP ได้พอดีเวลา — ผู้สอนปรับระดับความลึกของ Workshop 4–5 ตามความคืบหน้าของชั้นเรียน

---

### วันที่ 1 — ช่วงเช้า (09:00 – 12:00 น.)
#### Foundation, Setup & Swarm Pattern

* **Module 1: สถาปัตยกรรม AI Agent และแนวโน้มปัจจุบัน**
  * วิวัฒนาการจาก Single Prompt / Chatbot สู่ Autonomous Multi-Agent Systems
  * กลไก Tool Calling: วงจร "โมเดลเลือกเครื่องมือ → รันสคริปต์ → รับ Context กลับเข้าสู่การตัดสินใจ"
  * รูปแบบ Multi-Agent ใน Claude Code: Subagents, Agent Teams และ Background Agents
  * Token Cost Profile & Effort Scaling: การคำนวณและควบคุมค่าใช้จ่าย (~15× token เมื่อเทียบกับแชทเดี่ยว)
  * หลักการตัดสินใจเชิงสถาปัตยกรรม: งานแบบไหนควรขนาน (Swarm) หรืองานแบบไหนควรต่อคิว (Sequential)

* **Module 2: Technical Environment & Workspace Setup**
  * การตั้งค่า Shell Environment, Path และ Environment Variables
  * การจัดเตรียมโครงสร้าง Workspace บน VS Code และการจัดการไฟล์ Config JSON
  * ตรวจสอบเวอร์ชัน Claude Code CLI และการเปิดใช้ Feature Flags ที่เกี่ยวข้องกับ Agent

* **Module 3: Parallel Execution ด้วย Swarm Pattern**
  * สถาปัตยกรรม Built-in Subagents (Explore, Plan, General-purpose) ใน Isolated Context
  * Leader-first Interaction: การส่งโจทย์ระดับสูงให้ Leader วางแผนและแตกงาน
  * การกระจายงานแบบคู่ขนาน (Parallel Dispatching) 3–5 Subagents จาก Prompt เดียว
  * เทคนิคการรวมผลลัพธ์ (Result Aggregation) กลับสู่บทสนทนาหลัก
  * 🛠 **Workshop 1:** ใช้ Prompt เดียวสั่ง Leader ปล่อย Subagents สำรวจ Codebase และวิเคราะห์ Architecture พร้อมกัน แล้วรวมรายงานเป็นชุดเดียว

---

### วันที่ 1 — ช่วงบ่าย (13:00 – 16:00 น.)
#### Customization: Specialty Agents, Skills & MCP

* **Module 4: การสร้างและกำหนดสเปก Specialty Agent**
  * บทบาทของ `CLAUDE.md` ในฐานะ Global/Project System Instruction
  * การสร้าง Agent เฉพาะทางในโฟลเดอร์ `.claude/agents/` ด้วย Markdown + YAML Frontmatter
  * กำหนด Parameter สำคัญ: `name`, `description`, `tools`, `model`, และ `permissionMode`
  * การเลือกใช้ Model ต่างระดับกันตามประเภทงาน (e.g. Sonnet สำหรับงาน Logic / Haiku สำหรับงาน Fast Scan)
  * วิธีเรียกใช้งาน Agent: Auto-delegation, Direct Mention (@-mention) และ CLI Flag (`claude --agent`)
  * 🛠 **Workshop 2:** สร้าง Specialty Agent ตัวแรก (Code Researcher Agent) ผ่าน Prompt-driven Generation

* **Module 5: ขยายความสามารถด้วย Skills และ Extended Tools**
  * สถาปัตยกรรม Skill ภายใต้โฟลเดอร์ `.claude/skills/`
  * โครงสร้างของ `Skill.md`: Interface, Input/Output Definition และ Execution Flow
  * การผูก Skills ให้ Subagent ใช้งานล่วงหน้าผ่าน YAML Frontmatter (`skills`)

* **Module 6: การเชื่อมต่อระบบภายนอกผ่าน MCP (Model Context Protocol)**
  * ประเภท Transport ของ MCP Server: `stdio` (Local CLI), Streamable HTTP และ WebSocket
  * รูปแบบ Deployment: Node.js (`npx`), Docker Container และ Remote URL
  * ขอบเขตการตั้งค่า MCP: Local, Project (`.mcp.json`) และ User Global Scope
  * การผูก MCP Server เฉพาะตัวให้กับ Specialty Agent ผ่าน Frontmatter (`mcpServers`)
  * 🛠 **Workshop 3 (Guided Demo — ทำตามทีละขั้น):** ติดตั้ง MCP Server และผูกเข้ากับ Specialty Agent เพื่อดึงข้อมูลภายนอกแบบอัตโนมัติ

---

### วันที่ 2 — ช่วงเช้า (09:00 – 12:00 น.)
#### Pipeline Orchestration, Memory & Guardrails

* **Module 7: Orchestration & Sequential Workflows**
  * การส่งต่องานแบบ Sequential Pipeline: Output ของด่านหน้าเป็น Input ของด่านถัดไป
  * Leader-first Orchestration: Leader กำกับ Plan Approval, แจกงานตาม Task List และติดตามสถานะ (Pending / In Progress / Completed)
  * Agent Teams: การสื่อสารระหว่าง Teammates ผ่าน `SendMessage` และการแชร์ Shared Task List
  * 🛠 **Workshop 4:** สร้างสายการผลิตซอฟต์แวร์ 3 ด่าน (System Design → Implementation → Code Review) แบบ Sequential

* **Module 8: Context Engineering & Persistent Memory**
  * Context Window Isolation: กลไกป้องกัน Context Pollution ใน Subagents
  * การสรุปและสกัด Context สำคัญ (Summarization Handoff) ส่งคืน Leader
  * Persistent Memory Management ระดับ Session, Project และ User Scope เพื่อจำประวัติข้ามเซสชัน

* **Module 9: Production Guardrails, Permissions & Hooks**
  * กำหนดขอบเขตความปลอดภัย: `tools allowlist`, `disallowedTools`, และ Sandboxing
  * Gate Pattern: การตั้ง Stop Conditions และการทำงานแบบ Human-in-the-Loop (HITL)
  * การสร้างระบบตรวจสอบด้วย Hooks: `PreToolUse` และ `TaskCompleted` (Exit Code Enforcement)
  * 🛠 **Workshop 5:** พัฒนา "Quality Gate" ดักจับ Runtime Error และ "Cost Gate" ป้องกัน Token Exceeding

---

### วันที่ 2 — ช่วงบ่าย (13:00 – 16:00 น.)
#### Capstone Project & Production Deployment

* **Module 10: Capstone Project — ทีม Multi-Agent สร้างระบบธุรกิจจริงแบบ Leader-first**
  * สัญญากลาง (Shared Contract): Leader กำหนด Product Spec และ Task Dependency List ให้ทุก Agent ยึดถือร่วมกัน
  * สายส่งงาน (Handoff Pipeline) ของทีม Specialty Agents:
    * **Planner Agent:** วิเคราะห์บรีฟธุรกิจ แตกสเปก และออกแบบ Task List
    * **Researcher / Analyst Agent:** รวบรวมข้อมูลตลาด สเปกฟีเจอร์ และเตรียม Mock Data
    * **Frontend & Backend Developer Agents:** พัฒนาระบบแบบคู่ขนาน (Parallel Execution) ภายใต้สัญญากลางเดียวกัน
    * **Writer Agent:** เขียนเนื้อหาจริงของแอป (Copy, ข้อความหน้าจอ, คำอธิบายฟีเจอร์) ตาม Product Spec ก่อนส่งเข้า QA
    * **QA / Security Reviewer Agent:** ตรวจสอบโค้ด, Unit Test, Accessibility และความปลอดภัย
  * การรวมผลงาน (Result Synthesis) ด้วย Git Checkpoint และ Task Tracking
  * 🛠 **Capstone Workshop:** รวมทีม Specialty Agents สร้าง Full-stack Business Web Application จากโจทย์จริงแบบครบวงจร

* **Module 11: Production Deployment & Pre-flight Checklist**
  * การเชื่อมต่อและ Deploy ระบบขึ้น Production Cloud (Vercel) ผ่าน Claude Integration
  * Production Pre-flight Checklist สำหรับ Autonomous Agentic Systems
  * สรุป Best Practices, Failure Modes ที่ควรระวัง และแนวทางการนำ Multi-Agent ไปใช้จริงในองค์กร

---

## 6. สรุปตาราง Workshop ตลอดหลักสูตร

| # | Workshop | ทักษะสำคัญที่ได้รับ | หัวข้อที่เกี่ยวข้อง |
|:---:|---|---|:---:|
| **1** | Parallel Codebase Exploration (Swarm) | การกระจาย Subagents แบบคู่ขนาน และรวมสรุปผลลัพธ์ผ่าน Prompt เดียว | Module 3 (วันแรก เช้า) |
| **2** | Specialty Agent Creation via Prompt | การเขียน Frontmatter, กำหนด Model Routing และตั้งขอบเขตหน้าที่ของ Agent | Module 4 (วันแรก บ่าย) |
| **3** | Tool Extension with MCP Server (Guided Demo) | การเชื่อมโยงเครื่องมือภายนอกเข้ากับ Subagent ด้วย Model Context Protocol | Module 6 (วันแรก บ่าย) |
| **4** | Sequential Pipeline (Design → Build → Test) | การส่งต่อ Context และ Artifacts ข้ามขั้นตอนการทำงานอย่างเป็นระบบ | Module 7 (วันที่สอง เช้า) |
| **5** | Quality & Cost Guardrails with Hooks | การสร้าง Quality Gate ป้องกัน Bug และ Cost Gate ควบคุม Token Usage | Module 9 (วันที่สอง เช้า) |
| **6** | Capstone: Autonomous Business Web App Delivery | การประสานงานทีม Multi-Agent ภายใต้สัญญากลาง พร้อม Deploy ขึ้น Vercel | Module 10–11 (วันที่สอง บ่าย) |

---

> ฉบับเอกสารภายใน (ประวัติการตรวจทาน ภาคผนวก และแหล่งอ้างอิง): `vibe-code-l2-course-outline-internal.md`
