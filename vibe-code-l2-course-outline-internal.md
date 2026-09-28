> **เอกสารภายใน** — ฉบับเก็บประวัติการทาน (ภาคผนวก ก–ข), แหล่งอ้างอิง (ภาคผนวก จ) และบันทึกการปรับปรุง (ภาคผนวก ง) สำหรับย้อนที่มาของเนื้อหา | ฉบับเผยแพร่: `vibe-code-l2-course-outline-rev1.md`

# Build AI Multi-Agent with Claude Code

**Course ID:** VIBE-CODE-L2 | **หมวดหมู่:** Artificial Intelligence | **ประเภท:** Public Course

---

## 1. ข้อมูลหลักสูตร

| รายการ | รายละเอียด |
|---|---|
| ชื่อหลักสูตร (EN) | BUILD AI MULTI-AGENT WITH CLAUDE CODE |
| ชื่อหลักสูตร (TH) | สร้าง Multi-Agent Systems โดยใช้ Claude Code ในระดับ Production |
| Course ID | VIBE-CODE-L2 |
| หมวดหมู่ | Artificial Intelligence |
| ระยะเวลา | 2 วัน (12 ชั่วโมง) 09.00 – 16.00 น. |

---

## 2. วัตถุประสงค์

ผู้เข้าอบรมจะสามารถ:

1. สั่งงาน Subagent หลายตัวแบบ **Swarm (ขนาน)** ด้วย Prompt เดียว โดยไม่ต้องควบคุมทีละตัว
2. สร้าง **Specialty Agent** เฉพาะทางของตนเองบน Claude Code ด้วย Markdown + YAML โดยใช้ Prompt เป็นหลัก
3. ออกแบบการทำงานแบบ **Orchestration** (Leader แจกงาน) และ **Sequential** (ต่อกระบวนการทีละด่าน) ให้เหมาะกับลักษณะงาน
4. ทำงานแบบ **Leader-first**: ส่งโจทย์ให้ Leader วางแผนและมอบหมายก่อนเสมอ แล้วเห็นพัฒนาการของทีมผ่าน Plan และ Task List ตลอดงาน
5. ควบคุมคุณภาพ สิทธิ์ และงบประมาณ Token ด้วย Permission Boundary และ Guardrails แล้วส่งมอบงานขึ้น Production

---

## 3. หลักสูตรนี้เหมาะสำหรับ

1. นักพัฒนาที่ต้องการเพิ่มประสิทธิภาพและคุณภาพงานด้วย AI
2. Tech Lead ที่ต้องการเข้าใจการทำงานของ AI Agent เพื่อใช้วางแผนและตัดสินใจเชิงเทคนิค
3. เจ้าของกิจการหรือ Founder ที่ต้องการนำ **AI Agent** มาช่วยงานอัตโนมัติในกระบวนการทำงานจริง **และต้องการสร้างทีม Agent**
4. ผู้ที่สนใจ AI และต้องการเรียนรู้ผ่านการลงมือทำ มากกว่าการอ่านเอกสารเชิงเทคนิค

---

## 4. พื้นฐานของผู้เข้าอบรม (Prerequisites)

1. สามารถใช้ Terminal / Command Line / **PowerShell** เบื้องต้นได้ (cd, ls, mkdir)
2. สามารถเขียน Prompt ได้เป็นอย่างดี
3. **มีความรู้พื้นฐานการใช้ Git ร่วมกับ GitHub**

---

## 5. ความต้องการของระบบ

1. ระบบปฏิบัติการ Windows 11 / 10
2. Claude Account (Free) — ผู้เรียนจัดเตรียมล่วงหน้าก่อนวันอบรม
3. Claude for Desktop (สำหรับใช้งาน Claude Code)
4. Google Antigravity หรือ VS Code
5. Subscription: Claude (ทาง 9Expert invite ผู้เรียนระหว่างการอบรม)
6. **Node.js (Latest version) — Manual ให้ผู้อบรม**

---

## 6. หัวข้อฝึกอบรม

> โครงหัวข้อปรับธีมใหม่ตามแนวปฏิบัติล่าสุดของ Claude Code (official docs + Anthropic Engineering + community 2025–2026) เส้นทางการเรียน: **ลอง Swarm ก่อน → สร้าง Specialty Agent → ทำงานแบบ Orchestration / Sequential ผ่าน Prompt โดยมี Leader เป็นศูนย์กลาง → เห็นพัฒนาการ** (ที่มา: ภาคผนวก ง และแหล่งอ้างอิง ภาคผนวก จ)

### 🌊 วันที่ 1 — ช่วงเช้า (09:00 – 12:00 น.) · ลอง Swarm ก่อน: หนึ่ง Prompt เรียกทัพ Subagent

**1. AI Agent ทำงานเป็นทีมได้ยังไง (ฉบับล่าสุด)**
- Agent คืออะไร และต่างจาก Chatbot อย่างไร
- Tool Calling: วงจร "โมเดลเลือกเครื่องมือ → รัน → รับผลลัพธ์" ที่ทำให้ Agent ลงมือทำงานได้จริง ไม่ใช่แค่คุย
- ประเภท Multi-Agent ใน Claude Code วันนี้: Subagent / Agent Teams / Background Agents
- Orchestrator–Worker Pattern จาก Anthropic Engineering — Lead Agent วางแผน แล้วแจกงานให้ Subagent ขนานกันทำ
- เมื่อไหร่ควร Swarm (ขนาน) เมื่อไหร่ควร Sequential — ขนานเฉพาะงานอิสระ งานที่พึ่งพากันให้ต่อคิว
- ต้นทุนที่ต้องรู้: Multi-agent ใช้ Token ~15 เท่าของแชทเดี่ยว — จัด Effort ให้เหมาะกับความยากของโจทย์

**2. Technical Environment Setup**
- คำสั่งพื้นฐานในการใช้งานบน Terminal
- การตั้งค่า VS Code เช่น จัดการ Workspace
- เข้าใจโครงสร้างเอกสาร JSON
- การตั้งค่า Environment Variables
- ตรวจเวอร์ชัน Claude Code ล่าสุด และ Environment Flag ที่เกี่ยวกับ Agent

**3. Swarm ครั้งแรก: สั่งงาน Subagent หลายตัวพร้อมกันผ่าน Prompt**
- Built-in Subagents (Explore / Plan / General-purpose) ทำงานใน Context แยกของตัวเอง
- ส่งโจทย์ให้ Leader ก่อน → Leader แตกงานและปล่อย Subagent ขนาน 3–5 ตัวพร้อมกัน
- เห็นความคืบหน้าของแต่ละตัว และรวมผลกลับสู่บทสนทนาหลัก
- 🛠 **Workshop:** ใช้ Prompt เดียวสั่ง Leader ปล่อยทัพ Subagent สำรวจ/วิเคราะห์ Codebase พร้อมกัน แล้วรวมรายงานเป็นชุดเดียว

### 🎼 วันที่ 1 — ช่วงบ่าย (13:00 – 16:00 น.) · ประกอบกองทัพ: สร้าง Specialty Agent + Orchestration

**4. สร้าง Specialty Agent ด้วย Prompt**
- CLAUDE.MD คืออะไร
- โฟลเดอร์ `.claude/agents/` — Subagent คือ Markdown + YAML frontmatter (name, description, tools, model, permissionMode)
- สร้างผ่าน Prompt โดยให้ Claude เขียนไฟล์ Agent ให้ แทนการเขียนเองทั้งหมด
- การกำหนด Model ที่แตกต่างกันในแต่ละ Specialist Agent
- วิธีเรียกใช้งาน: Auto-delegation / @-mention / `claude --agent`
- 🛠 **Workshop:** สร้าง Specialty Agent ตัวแรก (Code Researcher Agent) ผ่าน Prompt

**5. Skills: ติดตั้งทักษะเฉพาะทางให้ Agent**
- รู้จักกับโฟลเดอร์ .claude/skills
- Skill คืออะไร / ส่วนประกอบของ Skill / Skill.MD คืออะไร
- ตัวอย่างการประยุกต์ใช้ Skill
- โหลด Skill ให้ Subagent ล่วงหน้าผ่าน frontmatter (skills)

**6. MCP: เชื่อมเครื่องมือภายนอกให้ Agent**
- ชนิดของ MCP Server ตาม Transport: stdio (เรียกใช้ในเครื่อง) / HTTP หรือ Streamable HTTP (remote — แนะนำ) / SSE (เลิกใช้แล้ว รองรับแบบ fallback) / WebSocket
- รูปแบบการติดตั้งที่พบบ่อย: Node.js (npx), Docker container, Remote URL
- Scope ของ MCP Server ใน Claude Code: Local / Project (.mcp.json) / User
- เครื่องมือจาก MCP Server มอบให้ Agent ผ่านกลไก Tool Calling เดิม (ข้อ 1) — Claude เลือกเรียกเองตามคำอธิบายของ Tool
- ผูก MCP Server เฉพาะตัวให้ Subagent ผ่าน frontmatter (mcpServers)

**7. Orchestration: Leader วางแผน แจกงาน เก็บผล**
- Leader-first: ส่งโจทย์ให้ Leader ก่อน → อนุมัติ Plan → Leader แตกงานเป็น Task มอบให้ Specialty Agent
- เทคนิคเขียน Delegation Prompt: objective ชัดเจน, ระบุ output format, tool guidance และ task boundary (กันงานซ้ำซ้อน/ตกหล่น)
- Effort Scaling: จำนวน Agent และ Tool Calls ตามความยากของโจทย์
- เห็นพัฒนาการ: Task List ของ Leader — pending / in progress / completed
- 🛠 **Workshop:** สั่ง Leader จัดทีม Specialty Agents (Frontend, Backend, QA) แบบ Orchestration แล้วติดตามความคืบหน้าจาก Task List

### 🔗 วันที่ 2 — ช่วงเช้า (09:00 – 12:00 น.) · ต่อสายการผลิต + คุมชน

**8. Sequential Workflow: งานที่ต้องต่อคิว**
- เมื่อไหร่ต้อง Sequential — งานมี dependency หรือต้องแชร์ Context (งานขนานที่ไม่มีสัญญาผูกพัน จะตัดสินใจขัดแย้งกันเอง)
- ต่อ Subagent เป็น Pipeline: Output ด่านหน้า คือ Input ด่านหลัง
- Agent Teams (experimental): Leader + Teammates แชร์ Task List และสื่อสารถึงกันผ่าน SendMessage — เริ่มที่ 3–5 ตัว
- 🛠 **Workshop:** ต่อสายการผลิต 3 ด่าน (ออกแบบ → สร้าง → ตรวจ) ให้งานไหลต่อกันแบบ Sequential

**9. Context Management & Persistent Memory**
- เทคนิค Context Management / การจัดการ Memory ของ Agent ระดับ Project, Global
- Context Isolation ของ Subagent — ทำไมการสรุปผลสั้น ๆ กลับสู่ Leader จึงสำคัญ
- Persistent Memory ผ่าน frontmatter (user / project / local) ให้ Agent จำได้ข้าม Session

**10. Permission Boundary & Hooks (Guardrails)**
- การกำหนดขอบเขตสิทธิของ Agent — tools allowlist, disallowedTools, permissionMode
- Gate Logic: การตั้งเงื่อนไขหยุดงาน (Stop Condition) และ Human-in-the-Loop ผ่านระบบอนุมัติ
- Hooks เป็นด่านคุณภาพ: PreToolUse / TaskCompleted (exit code 2 = บล็อกและส่งข้อเสนอแก้)
- 🛠 **Workshop:** สร้าง "Quality Gate" ตรวจจับ Error และ "Cost Gate" ป้องกัน Token Overflow

### 🚀 วันที่ 2 — ช่วงบ่าย (13:00 – 16:00 น.) · รวมผล ส่งมอบ เห็นพัฒนาการ

**11. Capstone: ทีม Specialty Agents สร้างเว็บแอปธุรกิจจริงแบบ Leader-first**
- หลักทีมที่ร่วมงานเดียวกัน: โจทย์เดียว ชิ้นงานเดียว — Leader กำหนด Product Spec + Task List เป็น "สัญญากลาง" ที่ทุก Agent อ้างอิงร่วมกัน (กันการไปคนละทิศ)
- ส่งโจทย์ธุรกิจให้ Leader → อนุมัติ Plan → เลือกใช้ Swarm / Orchestration / Sequential ผสมกันตามช่วงงาน
- สายส่งงานของทีม (ทุกบทบาทส่งงานต่อกัน จบที่ชิ้นงานเดียว):
  - **Planner** — แตกโจทย์เป็น Product Spec และ Task ให้ทีม
  - **Researcher + Competitive** — เก็บข้อมูลตลาด/คู่แข่งเป็น input ออกแบบของทีม
  - **Data Analyst** — เตรียมชุดข้อมูล/ตัวเลขที่แอปต้องแสดง ส่งให้ Backend
  - **Frontend/UI + Backend/Logic** — สร้างแอปขนานกันบน Spec เดียวกัน (ขนานได้เพราะสัญญาชัดเจน)
  - **Writer** — เขียนเนื้อหาจริงของแอปตาม Spec เดียวกัน
  - **QA/Reviewer** — ตรวจว่าทุกส่วนทำงานร่วมกันได้ แล้วส่งกลับ Leader
- แพทเทิร์นเดียวกันใช้กับงานประจำวัน: โจทย์เดียว ทีมเฉพาะทางส่งงานต่อกัน เช่น วางแผนทริป (Planner + Researcher) หรือโพสต์ขายของ (Writer + Researcher)
- Synthesize Pattern: Aggregation Logic รวม Output จากทุก Agent ให้เป็นชิ้นงานเดียว
- เห็นพัฒนาการ: ติดตามผ่าน Task List และ Git Checkpoint — เทียบ v1 → v2 ที่ทีม Agent ปรับปรุงให้เอง
- 🛠 **Workshop (Capstone):** ทีม Specialty Agents สร้างเว็บแอปธุรกิจจริงตามสายส่งงานด้านบน โดย Leader คุมสัญญากลาง มอบงาน และรีวิวความคืบหน้า

**12. Deploy to Vercel + Pre-flight Checklist**
- Connector Vercel in Claude
- Pre-flight Checklist ก่อนส่งงานมอบให้ Agent ทำงานอัตโนมัติ
- สรุปบทเรียน: เทียบก่อน–หลังความสามารถของทีม Agent ตลอดคอร์ส

---

## 7. สรุปรายการ Workshop และ Capstone

| # | Workshop | อยู่ในหัวข้อ |
|---|---|---|
| 1 | หนึ่ง Prompt ปล่อยทัพ Subagent แบบ Swarm สำรวจ Codebase พร้อมกัน | ข้อ 3 — วันที่ 1 เช้า |
| 2 | สร้าง Specialty Agent (Code Researcher Agent) ผ่าน Prompt | ข้อ 4 — วันที่ 1 บ่าย |
| 3 | Leader จัดทีม Specialty Agents (Frontend, Backend, QA) แบบ Orchestration + ติดตาม Task List | ข้อ 7 — วันที่ 1 บ่าย |
| 4 | สายการผลิต 3 ด่าน (ออกแบบ → สร้าง → ตรวจ) แบบ Sequential | ข้อ 8 — วันที่ 2 เช้า |
| 5 | สร้าง "Quality Gate" ตรวจจับ Error และ "Cost Gate" ป้องกัน Token Overflow | ข้อ 10 — วันที่ 2 เช้า |
| 6 | Capstone: ทีม Specialty Agents สายส่งงาน (Planner → Researcher → Frontend/Backend → Writer → QA) สร้างเว็บแอปธุรกิจจริงแบบ Leader-first | ข้อ 11 — วันที่ 2 บ่าย |

---

## ภาคผนวก

### ก. ประเด็นที่รอการยืนยันจากเจ้าของหลักสูตร

1. **Capstone Workshop เดิมถูกขีดฆ่าในไฟล์ทาน** — ฉบับปรับธีม (29 ก.ย.) เสนอ Capstone ใหม่เป็นข้อ 11 (ทีม Specialty Agents สร้างเว็บแอปธุรกิจจริงแบบ Leader-first) — รอการยืนยัน
2. **ตำแหน่งของ "CLAUDE.MD คืออะไร / รู้จักกับโฟลเดอร์ .claude/agents/"** — ข้อความแทรกในไฟล์ลอยอยู่ข้างหัวข้อ 2 (Technical Environment Setup) แต่เนื้อหาเกี่ยวกับ Claude Code โดยตรง ฉบับเรียบเรียงจึงวางไว้ใต้หัวข้อ 4 (สร้าง Specialty Agent)
3. **"From Solo Builder to Multi-Agent System" เดิมเปลี่ยนชื่อเป็น "Vibe Coding with Sub-Agent"** — ในธีมใหม่บทบาททีม 4 บทบาท (Frontend/UI, Backend/Logic, QA/Reviewer, Competitive) ถูกยุบรวมเป็นส่วนหนึ่งของ Capstone ข้อ 11

### ข. สรุปรอยตรวจแก้ทั้งหมดจากไฟล์ทาน (27 รายการ โดยผู้ทาน: Saksit Jongjaiman, 28 ก.ย. 2026)

| หน้า | ตำแหน่ง/หัวข้อ | รอยแก้ | ผลในฉบับเรียบเรียง |
|---|---|---|---|
| 2 | เหมาะสำหรับ ข้อ 3 | ไฮไลต์คำ "AI" + โน้ต "และต้องการสร้างทีม Agent" | แก้เป็น "AI Agent" และเติมข้อความท้ายข้อ |
| 2 | เหมาะสำหรับ ข้อ 5 (DevOps/SRE) | ขีดฆ่า | ตัดออก |
| 2 | พื้นฐาน ข้อ 1 (Terminal) | โน้ต "/ Power Shell" | เติม PowerShell |
| 2 | พื้นฐาน | โน้ตใหม่ | เพิ่มข้อ 3: Git + GitHub |
| 2 | ระบบ ข้อ 6 (OpenAI API) | ขีดฆ่า + โน้ตใหม่ | แทนที่ด้วย Node.js (Latest version) |
| 2 | หัวข้อ 1 (AI Agent ทำงานเป็นทีม) | โน้ต 2 ใบ | เพิ่ม bullets (Agent คืออะไร / ประโยชน์ / ประเภท Specialist, Sub) |
| 2 | หัวข้อ 3 Workshop | ไฮไลต์ "Reviewer" + โน้ต "Researcher" | เปลี่ยนเป็น Code Researcher Agent |
| 2 | หัวข้อ 4 (OpenCode Setup & Multi-model) | ขีดฆ่าทั้งหัวข้อ | ตัดออก และแทนด้วยหัวข้อ Skills / MCP ที่แทรกไว้ในไฟล์ |
| 2 | (แทรกในไฟล์) | ข้อความเซอริฟใหม่ | CLAUDE.MD / .claude/agents/ / Skills / MCP |
| 3 | หัวข้อ 6 (Persistent Memory) | ขีดฆ่า "RAG vs LLM Wiki" + โน้ต | ตัด RAG vs LLM Wiki, เติม Global/Project Scope |
| 3 | หัวข้อ 7 | โน้ตเปลี่ยนชื่อ + ขีดฆ่า 2 บรรทัด + โน้ตบทบาทใหม่ | เปลี่ยนชื่อเป็น Vibe Coding with Sub-Agent, เพิ่ม Competitive Agent |
| 3 | หัวข้อ 9 (Multi-Agent on OpenCode) | ขีดฆ่าหัวข้อ/คำ "OpenCode" + ไฮไลต์ Workshop พร้อมโน้ต "ย้ายไปข้อ 8, เปลี่ยน OpenCode to Claude" | ยุบรวมเข้าหัวข้อ Multi-Agent และเปลี่ยนเป็น Claude |
| 3 | หัวข้อ 12 (Collaboration Layer) | ขีดฆ่าทั้งหัวข้อ + โน้ตใหม่ | แทนที่ด้วย "Deploy to Vercel — Connector Vercel in Claude" |
| 4 | หัวข้อ 13 (Capstone Workshop) | ขีดฆ่าทั้งหมด | ออกแบบ Capstone ใหม่ในธีมใหม่ (ข้อ 11 — รอยืนยัน) |

### ค. ข้อมูลติดต่อ

- ฝ่ายฝึกอบรม / แนะนำหลักสูตร: **02-219-4304** หรือ **084-010-5208**
- อีเมล: training@9expert.co.th | เว็บไซต์: 9Experttraining.com | Social: @9EXPERT
- #อย่าหยุดเรียนรู้

### ง. บันทึกการปรับปรุงฉบับเรียบเรียง

- **29 ก.ย. 2026** — เจ้าของหลักสูตรยืนยันว่า OpenCode และ Multica.ai ไม่อยู่ในหลักสูตร จึงแก้ไขดังนี้:
  - **ชื่อหลักสูตร (TH):** ตัด "× OpenCode เพื่อการประสานข้ามเครื่องมือ" ออก (เดิมตามไฟล์ PDF: "สร้าง Multi-Agent Systems โดยใช้ Claude Code × OpenCode เพื่อการประสานข้ามเครื่องมือ ในระดับ Production พร้อม Failure Mode ที่ควรหลีกเลี่ยง")
  - **วัตถุประสงค์:** ข้อ 2 ตัด "และ OpenCode" ออก | ข้อ 3 เดิมอ้าง Multica.ai เปลี่ยนเป็นการบริหารด้วย Gate Pattern และ Human-in-the-Loop | ข้อ 5 ตัดคำว่า "ต่างเครื่องมือ" และเติมการ Deploy ขึ้น Production
  - ปิดประเด็นรอการยืนยันเดิมข้อ 1 (ชื่อหลักสูตร) และข้อ 2 (วัตถุประสงค์)
- **29 ก.ย. 2026** — จัดลำดับหัวข้อฝึกอบรมใหม่เชิงการสอน (รอบแรก): ย้าย Skills/MCP ไปบ่ายวันที่ 1, เรียง Context Management ก่อน Permission Boundary, ย้าย Vibe Coding with Sub-Agent ไปเปิดเช้าวันที่ 2 ก่อน Multi-Agent on Claude Code
- **29 ก.ย. 2026 (ปรับธีมจากผลวิจัย)** — ค้น official docs + Anthropic Engineering + community แล้วออกแบบเส้นทางใหม่ตามข้อกำหนดของเจ้าของหลักสูตร:
  - **ผู้เรียนลอง Subagent แบบ Swarm ก่อน** (ข้อ 3 เช้าวันที่ 1) ก่อนสร้าง **Specialty Agent** (ข้อ 4) แล้วจึงทำงานแบบ **Orchestration** (ข้อ 7) และ **Sequential** (ข้อ 8)
  - **ทุกอย่างขับเคลื่อนด้วย Prompt เป็นหลัก**: สร้าง Agent ด้วย Prompt, มอบงานด้วย Prompt, Spawn ทีมด้วยภาษาธรรมชาติ
  - **Leader-first**: ส่งโจทย์ให้ Leader ก่อนเสมอ (Plan → อนุมัติ → แจกงาน) ในข้อ 3, 7 และ Capstone ข้อ 11
  - **เห็นพัฒนาการ**: Task List (pending/in progress/completed), Plan Approval, Git Checkpoint, เทียบ v1 → v2
  - เนื้อหาสดจาก official ที่เติมเข้ามา: frontmatter ครบ (tools, model, permissionMode, skills, memory, mcpServers), @-mention และ auto-delegation, Built-in agents (Explore/Plan/General-purpose), Background/Fork, Orchestrator–Worker (90.2% improvement, ~15× token, effort scaling), Agent Teams experimental (shared task list, SendMessage, hooks คุมคุณภาพ), concurrency 20 ตัว / nesting 3 ชั้น
  - ยุบ "Vibe Coding with Sub-Agent" เดิมเข้า Capstone ข้อ 11 — บทบาททีม 4 บทบาทยังใช้ครบ
  - เพิ่มหลักชุมชน: ขนานเฉพาะงานอิสระ / งานที่พึ่งพากันต่อคิว, orchestration logic ลง Code แทน Context
- **29 ก.ย. 2026 (บทบาทเสริม)** — เพิ่มบทบาท Specialty Agent ที่นำไปใช้ในชีวิตประจำวันได้ใน Capstone ข้อ 11: Researcher / Writer / Planner / Data Analyst — เลือกเพิ่มตามโจทย์ ควบคู่บทบาทหลักด้านพัฒนา (Frontend/Backend/QA/Competitive)
- **29 ก.ย. 2026 (ทีมร่วมงานเดียวกัน)** — จัดโครงบทบาทใน Capstone ข้อ 11 ใหม่เป็นสายส่งงาน (handoff) ภายใต้ "สัญญากลาง" ของ Leader (Product Spec + Task List): Planner → Researcher/Competitive → Data Analyst → Frontend+Backend (ขนานบนสัญญาเดียว) → Writer → QA → ส่งกลับ Leader — ทุกบทบาทต้องส่งงานต่อกันจบที่ชิ้นงานเดียว ตามหลักชุมชนที่ว่า parallel subagents ที่ไม่มี shared context จะไปคนละทิศ/ตัดสินใจขัดแย้งกัน
- **29 ก.ย. 2026 (ปรับความสอดคล้อง)** — จัดข้อ 11 กับตารางสรุปให้ตรงกัน: ระบุชัดว่า Capstone สร้าง "เว็บแอปธุรกิจจริง" ตามสายส่งงาน (เพื่อรองรับการ Deploy ขึ้น Vercel ในข้อ 12) และเปลี่ยนชื่อหัวข้อ 7 เป็น "สรุปรายการ Workshop และ Capstone"
- **29 ก.ย. 2026 (ตรวจสอบความถูกต้อง)** — ข้อความ "MCP มีกี่ชนิด (Node, Standard, Docker)" จากโน้ตผู้ทานในไฟล์ PDF ไม่ตรงกับสเปก MCP จึงแก้หัวข้อ 6 เป็น:
  - ชนิดตาม Transport (สเปกทางการ): stdio / HTTP (Streamable HTTP) / SSE (deprecated) / WebSocket
  - แยก "รูปแบบการติดตั้ง" ออกชัด: Node.js (npx) / Docker / Remote URL — "Node, Standard, Docker" เดิมเป็นรูปแบบการติดตั้ง ไม่ใช่ชนิดของ MCP ("Standard" น่าจะเพี้ยนจาก "stdio")
  - เพิ่ม Scope ตาม official docs ของ Claude Code: Local / Project (.mcp.json) / User
- **29 ก.ย. 2026 (จัดตำแหน่งเนื้อหา)** — ย้าย "Tool Calling" จากหัวข้อ MCP (ข้อ 6) ไปเป็นพื้นฐานในข้อ 1 เพราะเป็นกลไกพื้นฐานของ Agent ทุกตัว ไม่จำเพาะกับ MCP (ผู้เรียนใช้ตั้งแต่ Swarm ข้อ 3 ที่ยังไม่ใช้ MCP) — ข้อ 6 คงเชื่อมโยงกลับถึงกลไกนี้ในมุมของ MCP

### จ. แหล่งอ้างอิงการวิจัยอัปเดตเนื้อหา (29 ก.ย. 2026)

- Official — Claude Code Docs: Subagents (code.claude.com/docs/en/sub-agents)
- Official — Claude Code Docs: Agent Teams — experimental (code.claude.com/docs/en/agent-teams)
- Official — Anthropic Engineering: "How we built our multi-agent research system" (anthropic.com/engineering/built-multi-agent-research-system)
- Official — Claude Code Docs: MCP (transports, scopes) (code.claude.com/docs/en/mcp)
- Community (2025–2026): แนว "ขนานเฉพาะงานอิสระ / ไล่ลำดับงานที่พึ่งพากัน", การย้าย orchestration logic ลง Code แทน Context, การใช้ Hooks คุมคุณภาพ, ชุด Subagent สำเร็จรูปจากชุมชน (เช่น Loop Engineering, Claude-Flow v3, คอลเลกชัน production-ready subagents บน GitHub)
