# Module 4 — การสร้างและกำหนดสเปก Specialty Agent

> **เวลา:** ~55 นาที (สอน 25 + Workshop 2 30) | **ผลลัพธ์ที่คาดหวัง:** ผู้เรียนสร้าง Subagent เฉพาะทางของตัวเองด้วย Markdown + YAML ผ่าน Prompt และเรียกใช้ได้ 3 วิธี

## 1. CLAUDE.md — คู่มือประจำบ้านของ Agent

`CLAUDE.md` คือไฟล์ instruction ที่ Claude Code โหลดทุกครั้งที่เริ่มงาน — เหมาะกับข้อมูลที่ "ทุก Agent ต้องรู้":

- โครงสร้างโปรเจกต์, คำสั่ง build/test ที่ใช้ได้, ข้อตกลงการเขียนโค้ด
- ระดับโฟลเดอร์: ไฟล์เดียวที่ root ของโปรเจกต์ (ทีมแชร์ผ่าน Git) และ `~/.claude/CLAUDE.md` (ส่วนตัว ทุกโปรเจกต์)

**ใครได้ไฟล์นี้:** ตามเอกสารทางการ Subagent ทั้ง built-in และ custom โหลด CLAUDE.md อัตโนมัติ — ยกเว้น **Explore** กับ **Plan** ที่ตัด CLAUDE.md และ git status snapshot ออกเพื่อให้งานค้น/วิเคราะห์เร็วและถูก (อ้างเอกสารทางการ — ยังไม่ได้ทดลองเอง)

**ใส่อะไร — 3 หมวดที่ทุก Agent ทุกงานต้องใช้จริง** (ตัวอย่างกติกาที่พิมพ์บ่อยในโปรเจกต์จริง):

| หมวด | ตัวอย่าง |
|---|---|
| คำสั่งที่ใช้ | `npm test`, `npm run typecheck` |
| กติกาของโปรเจกต์ | เงินเป็นสตางค์จำนวนเต็ม · ห้าม log token |
| เขตความรับผิดชอบ | `web/` = frontend · `src/routes` + `src/services` = backend · `tests/` = QA |

และเราพิสูจน์ด้วย run ของคอร์สเองว่ากติกาเดินทางถึง Subagent จริง (✅ tested — runs/module-04/run-013): subagent ที่ถูกสั่ง "ห้ามใช้ tool" ยังอ้างกฎจาก CLAUDE.md ได้เป๊ะทุกคำ — กฎไปอยู่ใน context ของมันโดยไม่ต้องสั่งซ้ำ

**อะไรที่ *ไม่ควร* ใส่:** รายละเอียดของงานใดงานหนึ่ง — ทุก Agent ทุกงานต้องแบกมันไปด้วยเปล่า ๆ ข้อมูลเฉพาะงานให้อยู่ใน **ไฟล์ brief แยก** แทน เช่น สัญญากลางประจำฟีเจอร์ (โครงเดียวกับ `docs/PRODUCT-SPEC.md` ที่ Capstone ใช้) หรือ `CHANGELOG.md` ที่ใช้เป็นสัญญาระหว่าง repo แล้ว **อ้างไฟล์นั้นไว้ในข้อความมอบงาน** — Agent ตัวที่ทำงานนั้นเท่านั้นที่จะไปอ่าน

หลักการเขียน: **สั้น ชัด ใช้งานได้จริง** — เขียนยาวเปลือง context ทุก turn

## 2. Specialty Agent = Markdown + YAML Frontmatter

ไฟล์หนึ่งไฟล์ = Agent หนึ่งตัว โครงคือ **YAML frontmatter** (ส่วนตั้งค่าระหว่างเส้น `---` สองเส้น) ตามด้วยเนื้อหาที่จะกลายเป็น **system prompt** ของ agent ตัวนั้น — เก็บที่ `.claude/agents/` (ทีมแชร์ผ่าน Git) หรือ `~/.claude/agents/` (ส่วนตัว):

> **ไฟล์ definition อยู่ได้ห้าแหล่ง — ชื่อซ้ำกัน แหล่งที่สูงกว่าชนะ** (ตามเอกสารทางการ): 1. **Managed settings** (ทั้งองค์กร — admin กำหนดตำแหน่งมาตรฐาน) 2. flag `--agents '{...}'` ตอนเปิด CLI (session เดียวเท่านั้น — เหมาะกับการทดลองหรือสคริปต์ CI) 3. `.claude/agents/` ของโปรเจกต์ (roster ของทีม — commit ลง git) 4. `~/.claude/agents/` (ผู้ช่วยส่วนตัว ใช้ได้ทุกโปรเจกต์) 5. `agents/` ใน plugin (แจกข้ามทีมข้าม repo) · จัดโฟลเดอร์ย่อยได้ (ระบบสแกนแบบ recursive) โดยตัวตนของ agent มาจาก `name` เท่านั้น ไม่เกี่ยวกับ path — ยกเว้นใน plugin ที่โฟลเดอร์ย่อยกลายเป็นส่วนหนึ่งของชื่อ (`my-plugin:review:security`) · monorepo: ระบบค้นทุกระดับจากโฟลเดอร์ที่เปิดขึ้นไปจนถึง root — ชื่อซ้ำตัวที่ใกล้ working directory ชนะ · **ห้ามชื่อซ้ำในโฟลเดอร์เดียวกัน**: จะโหลดแค่ไฟล์เดียวโดยไม่มีกติกาแน่นอนว่าไฟล์ไหน — `/doctor` ช่วยหาไฟล์ซ้ำได้ · agent ที่มาจาก plugin ถูกเมินฟิลด์ `hooks`/`mcpServers`/`permissionMode` เพื่อความปลอดภัย (plugin ต้องแจก hook และ MCP server ผ่านไฟล์ของ plugin เอง) · แนวทางทีม: roster หลักเก็บใน `.claude/agents/` เพื่อรีวิวผ่าน PR ได้เหมือนโค้ด, ส่วนตัวเก็บใน `~/.claude/agents/`, และ roster ที่นิ่งพอจะใช้ข้าม repo ค่อยห่อเป็น plugin

เรียกความสัมพันธ์ให้ตรง: **ไฟล์ = definition** (ตำแหน่งงานที่ประกาศไว้) · **การ dispatch หนึ่งครั้ง = instance** (คนที่มาทำงานในตำแหน่งนั้นหนึ่งรอบ) — งานจบ instance จบ แต่ definition ยังอยู่ให้เรียกรอบถัดไป และภายใน session เดียว Claude ยังเก็บ agent ID ไว้ **resume instance เดิม**ได้ (ประวัติทำงานยังครบ) ยกเว้น Explore/Plan ที่ one-shot (ตามเอกสารทางการ — ยังไม่ได้ทดลอง resume เอง)

> ไฟล์ definition เดียวกันถูกนำไปสร้าง instance ได้สามบริบท และแต่ละบริบทหยิบส่วนของไฟล์ไปใช้ไม่เท่ากัน: **Subagent** (เรียกผ่าน Agent tool — ทั้งคอร์สนี้ใช้แบบนี้), **Workflow agent** (สคริปต์ workflow เรียกเองด้วย `agent(prompt, { agentType: ... })` — Guided Demo ใน Module 7 หัวข้อ 6) และ **Teammate** ของ Agent Teams (experimental — Module 1) ยืนยันแล้วด้วยการทดสอบ: workflow `agent({agentType})` ใช้ body กับฟิลด์ `tools`/`model` จริง แต่**ไม่ preload skills** — ต่างจาก Subagent ที่ preload ตาม frontmatter (✅ tested — runs/module-04/run-015) · ฝั่ง teammate: ใช้ `tools`/`model`/`disallowedTools` จริง แต่**ไม่ preload skills** เช่นกัน — ความรู้ที่จำเป็นต่องานของ teammate ให้ย้ายไปเขียนใน body หรือใส่ใน spawn prompt และระบบเติม `SendMessage` ให้เสมอ (session ที่มี Task tools จะได้ `TaskCreate`/`TaskGet`/`TaskList`/`TaskUpdate` เพิ่ม และ `disallowedTools` ห้าม tool เหล่านี้ไม่ได้) ส่วน body ถูกใช้ต่างกันระหว่าง in-process (ต่อท้าย system prompt เดิม) กับ split-pane (แทนที่ทั้งหมด) (ตามเอกสารทางการ)

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

อ่านฟิลด์ทั้งหมดเป็น 3 กลุ่ม: **ตัวตน** — `name` กับ `description` คือสองฟิลด์**บังคับ**เท่านั้น (บอกว่า agent นี้คือใคร + ควรเรียกเมื่อไหร่) · **ขอบเขต** — ฟิลด์ที่เหลือบอกว่าทำอะไรได้/ใช้อะไรได้ · **วิธีทำงาน** — body หลังเส้น `---` ปิด คือ system prompt บอกว่าทำงานอย่างไร

**Frontmatter fields ที่ใช้บ่อย:**

| Field | ค่า | หน้าที่ |
|---|---|---|
| `name` | kebab-case, ไม่ซ้ำ, ≤ 256 ตัวอักษร — ห้ามมี `:` (สงวนให้ชื่อแบบ plugin-scoped) และห้ามขึ้นต้น `-` (ไฟล์จะถูกข้าม) | ชื่อเรียก (@-mention) และค่า `agent_type` ที่ hooks ใช้จับคู่ (Module 9) |
| `description` | สั้น ชี้เงื่อนไขการใช้ | **หัวใจของ auto-delegation** — Leader อ่านสิ่งนี้เพื่อเลือก agent |
| `tools` | `Read, Grep, Glob` | allowlist — ไม่ใส่ = ได้ทุกเครื่องมือที่ subagent ใช้ได้ |
| `disallowedTools` | เช่น `Write, Edit` | denylist — หักเครื่องมือออกจากชุดที่ได้ รูปแบบเดียวกับ `tools` (ระบุ `mcp__server` ก็ได้) — ตั้งคู่กับ `tools` เมื่อไหร่ ตัวที่อยู่ทั้งสองรายการถูกตัดออก (✅ tested — run-016: `tools: Read, Grep, Bash` + `disallowedTools: Bash` → เหลือ Read, Grep) |
| `model` | `sonnet` / `haiku` / `opus` / `fable` / ชื่อเต็มเช่น `claude-opus-5-5` / `inherit` | Model routing — งานเบ็ดเตล็ดใช้ตัวเร็ว งานยากใช้ตัวแข็ง |
| `permissionMode` | `default` / `acceptEdits` / `plan` / `dontAsk` / `bypassPermissions` | โหมดสิทธิ์ของ agent ตัวนั้น — **มีผลเฉพาะเมื่อ session หลักอยู่โหมด default/dontAsk/plan** ส่วน session โหมด acceptEdits/bypassPermissions/auto จะบังคับ Subagent ใช้โหมดเดียวกับ session และเมินค่าที่ตั้ง (✅ tested — run-018) ไม่ตั้ง = สืบทอดจาก session |
| `omitClaudeMd` | `true` | งดโหลด CLAUDE.md ทุกระดับสำหรับ agent ตัวนี้ (ตั้งแต่ v2.1.271) |
| `isolation` | `worktree` | ให้ agent รันบนสำเนา repo แยก (git worktree) — ✅ tested — run-019: สร้างที่ `<repo>/.claude/worktrees/agent-<id>` บน branch `worktree-agent-<id>` แตกจาก default branch การแก้ค้างใน worktree **ไม่ commit ไม่ merge กลับอัตโนมัติ** — ดูเกร็ดและข้อควรรู้หลังตาราง |
| `effort` | `low` / `medium` / `high` / `xhigh` / `max` | ตั้ง effort ของ agent ตัวนี้โดยเฉพาะ — ทับค่า effort ของ session (ค่าที่มีได้ขึ้นกับ model) · ถูกทับกลับได้สองทาง: Claude ระบุ effort ตอนเรียก (v2.1.292+) และ env `CLAUDE_CODE_EFFORT_LEVEL` ที่ทับทุกอย่าง |
| `skills` | ชื่อ skill เช่น `writing-guide` | preload เนื้อหา skill เข้า context ตั้งแต่เริ่ม — ไม่ใส่ก็ยังเรียก skill เองได้ผ่าน Skill tool (เรื่อง skill อยู่ Module 5) |
| `maxTurns` | จำนวน เช่น `15` | เพดานรอบการทำงาน — ถึงลิมิตแล้วคืนผลที่มี (partial) และสั่ง resume ต่อได้ |
| `background` | `true` | บังคับรันเบื้องหลังเสมอ แม้ Claude จะขอรัน foreground (ได้ชุดเครื่องมือพื้นฐานเล็กกว่า) |
| `memory` | `project` / `user` / `local` | โฟลเดอร์ความจำถาวรของ agent ตัวนั้น — รายละเอียดและแบบฝึกอยู่ Module 8 |

**ที่มาของตาราง:** ค่าและพฤติกรรมของทุกฟิลด์อ้างตามเอกสารทางการของ Claude Code (ตรวจล่าสุด 2026-10-17, เอกสารรุ่น CLI v2.1.296 · ทดสอบจริงบน 2.1.284 และ 2.1.302) ระดับหลักฐานของคอร์สแยกเป็นสองชั้น — **รันจริงพร้อม transcript:** `name`, `description`, `tools`, `model` (run-003, run-009), `omitClaudeMd` (run-013), กฎ tools∩`disallowedTools` (run-016), `permissionMode` (run-018), `isolation` (run-019) · **อ้างเอกสารล้วน:** `maxTurns`, `memory`, `background`, `effort`, `skills`

> เคล็ดลับ description: ใส่วลี "Use proactively for ..." เพื่อชวน Leader ใช้ agent นี้อัตโนมัติเมื่อเจอโจทย์ตรงประเภท และ**เขียนสั้นไว้เสมอ** — description ของทุก agent ถูกส่งเข้า context ของ session หลักตลอดเวลา (Claude ใช้มันตัดสินว่าจะส่งงานให้ใคร) ถ้ารวมกันเกิน 15,000 token Claude Code จะเตือนตอนเปิด session พร้อมบอกยอดรวม (ตามเอกสารทางการ — ทดสอบเองด้วย headless `-p` แล้ว**ไม่เห็น**ตัวเตือนทั้งที่ยัดเกิน 20k token: มันแสดงเฉพาะ startup ของ TUI — run-014) หลักจึงเป็น: description บอกแค่ "ใช้เมื่อไหร่" ส่วนวิธีทำงานย้ายไปไว้ใน body ซึ่งโหลดเฉพาะตอน agent ตัวนั้นถูกเรียก

> ตัด context เพื่อความเร็ว/ราคา: ตั้ง `omitClaudeMd: true` ใน definition แล้วย้ายสิ่งที่ agent ต้องรู้ไปเขียนในข้อความมอบงานแทน (✅ tested — runs/module-04/run-013): คู่เทียบแบบห้ามใช้ tool — agent ปกติอ้างกฎใน CLAUDE.md ได้เป๊ะ ส่วน agent ที่ตั้งค่านี้ตอบ "NOT IN CONTEXT" ⚠️ แต่มัน**ไม่ได้ซ่อนไฟล์** — agent ที่มี Read ยังเปิดอ่าน CLAUDE.md เองได้ถ้าโจทย์ชวนให้อ่าน (รอบแรกของการทดสอบเราก็วัดพลาดเพราะเรื่องนี้)

**ตัวอย่างที่สอง — probe agent จาก Agent Lab ของคอร์ส (✅ tested — runs/module-04/run-013)** ใช้ฟิลด์ `effort` กับ `skills` เพิ่มเข้ามา (วิธีใช้ตัวนี้ตรวจงานอยู่ที่หัวข้อ 6):

```markdown
---
name: ok-probe
description: Valid control agent. Use when asked to report a code word.
tools: Read, Grep, Glob
model: haiku
effort: low
skills: writing-guide
---

You are a valid test agent. Your private code word is LAB-77.
When asked about your setup, answer factually and briefly.
```

**ออกแบบ role ให้ใช้ได้จริง — 3 คำถามก่อนเขียนไฟล์:**

1. **หนึ่งตำแหน่ง หนึ่งความรับผิดชอบ** — definition ที่ดีอธิบายตัวเองได้ในประโยคเดียว ("reviewer ตรวจความถูกต้องและความปลอดภัย อ่านอย่างเดียว") ส่วน "ผู้ช่วยโค้ดทั่วไป" ไม่ผ่าน เพราะ Leader จะไม่รู้ว่าควรเลือกมันเมื่อไหร่เหนือ general-purpose ที่มีอยู่แล้ว ถ้ารู้สึกว่า description เริ่มยาวเพื่ออธิบายว่า agent ทำอะไรบ้าง — นั่นคือสัญญาณว่าควรแยกเป็นสองตำแหน่ง
2. **อ่านอย่างเดียว หรือแก้ได้ — ตัดสินก่อนเรื่องอื่น** เพราะมันกำหนดความเสี่ยงของทั้งระบบ: อ่านอย่างเดียวใช้ `tools: Read, Grep, Glob` (explorer / reviewer / auditor) — ถ้าต้องรันคำสั่งดูข้อมูลอย่าง `git log` ค่อยเพิ่ม `Bash` แต่จำไว้ว่า Bash ทำได้ทุกอย่าง จะกันการเขียนแบบจริงจังต้องใช้ permission rules หรือ hooks (Module 9) — ตั้ง `permissionMode: plan` เพียงอย่างเดียวไม่พอ (ดูกับดักท้ายบท)
3. **แก้ได้ = ใช้ default แล้วตัดเฉพาะที่อันตราย** — งานเขียนโค้ดปล่อย default tools แล้วกันด้วย `disallowedTools` เช่น implementer ที่ไม่ควรออกเน็ต: `disallowedTools: WebFetch, WebSearch` (และจำกลไกจากตารางข้างบน: ตัวที่ติดทั้งสองรายการเมื่อตั้งคู่กันถูกตัดออก — ✅ tested — run-016)

**เพดานเครื่องมือที่ระบบกำหนดเอง — มีผลแม้เราจะไม่ได้ตั้งอะไรเลย:**

- **กลุ่มที่ Subagent ไม่มีวันได้** แม้พิมพ์ไว้ใน `tools` — `AskUserQuestion` (Subagent ถามผู้ใช้ไม่ได้), `EnterPlanMode`, `ScheduleWakeup`, `Workflow`, `WaitForMcpServers`, `EndConversation` และ `ExitPlanMode` (ยกเว้นเมื่อ `permissionMode: plan`) ส่วน `Agent` จะถูกตัดเมื่ออยู่ชั้นลึกสุดที่อนุญาต (ตามเอกสารทางการ)
- **ความลึกการซ้อน default 3 ชั้นใต้บทสนทนาหลัก** — ปรับได้ด้วย `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` โดยตั้ง `1` = ปิดการซ้อน (Subagent แรกจะไม่มี `Agent` เลย)
- **Subagent เบื้องหลังได้ built-in ชุดที่เล็กกว่า** (Read, Grep, Glob, Bash, Edit, Write, WebFetch, WebSearch, Skill, SendMessage ฯลฯ) แต่ได้ **MCP tool ครบ** — definition เดียวกันจึงได้เครื่องมือไม่เท่ากันเมื่อรันเบื้องหน้ากับเบื้องหลัง โดยระบบไม่เตือน (fork และ subagent ที่ resume เป็นข้อยกเว้น)
- **`tools` ที่ resolve ไม่ได้ = ปฏิเสธสตาร์ตทันที** (✅ tested — run-017): `tools: NoSuchTool` → `Agent 'zero-tools' would be spawned with zero tools — refusing. Its tools list resolved to nothing: unrecognized [NoSuchTool].` — สังเกตความต่างจากชื่อ *ฟิลด์* ที่สะกดผิด (ถูกเมินเงียบ ๆ): ชื่อ *เครื่องมือ* ถูกตรวจและปฏิเสธตรงจุดนี้

**เกร็ด `isolation: worktree` — สำเนาแยก แต่ไม่ merge กลับให้ (✅ tested — run-019):**

- worktree อยู่ที่ `<repo>/.claude/worktrees/agent-<id>` บน branch `worktree-agent-<id>` แตกจาก **default branch** — ไม่ใช่ branch ที่คุณกำลังทำงานอยู่ (ปรับเป็น HEAD ปัจจุบันได้ด้วย `worktree.baseRef: "head"`)
- การแก้ไขค้างอยู่ใน worktree แบบ **ยังไม่ commit และไม่ merge กลับอัตโนมัติ** — สิ่งที่ต้องทำเอง: เพิ่ม `.claude/worktrees/` ลง `.gitignore`, commit ใน worktree แล้ว merge branch กลับ (หรือสั่ง Lead ทำ) · worktree ที่ไม่มีการแก้ไขอะไรเลยจะถูกเก็บกวาดอัตโนมัติ
- Bash ของ agent ถูกบังคับรันภายใน worktree — คำสั่งที่พยายามชี้ git กลับ checkout หลัก หรือคำสั่งที่ตรวจไม่ได้ว่า git จะทำงานที่ไหน ถูกปฏิเสธ (ตามเอกสารทางการ)
- เมื่อไหร่ไม่ต้องใช้ worktree: agent อ่านอย่างเดียว (เปลืองเวลาและพื้นที่เปล่า) · งานที่ต้องทำต่อกันเป็นลำดับ (ทำใน checkout เดียวทีละขั้นง่ายกว่า) · งานที่แบ่งเจ้าของไฟล์กันชัดแล้ว (ยังต้องระวังไฟล์ร่วมอย่าง `package.json`) · งานข้าม repo (worktree เป็นสำเนาของ repo เดียว)
- ⚠️ เมื่อเปิด Agent Teams ไว้ subagent ที่ถูกแปลงเป็น teammate **ไม่รับ** `isolation` จาก frontmatter — จะได้ isolation จริงต้องส่ง isolation ตอนเรียก ซึ่งจะได้ subagent ปกติแทน (ตามเอกสารทางการ)

## 3. Model Routing — จับคู่งานกับ Model

| งาน | Model | เหตุผล |
|---|---|---|
| สแกน/ค้นเร็ว, จัดหมวด | `haiku` | ถูกและเร็ว |
| วิเคราะห์ logic, สรุปงานวิจัย | `sonnet` | สมดุล |
| ตัดสินใจสถาปัตยกรรม, งานยากมาก | `opus` | คุณภาพสูงสุด |

**ลำดับที่ระบบใช้เลือก model ของ Subagent (ตัวแรกที่มีค่าชนะ — ตามเอกสารทางการ):**

1. model ที่ Claude ระบุตอนเรียกครั้งนั้น (per-invocation `model` parameter — เช่น คุณสั่งว่า "ใช้ Haiku")
2. model ใน definition — `inherit` = ใช้ model เดียวกับ session หลัก
3. env `CLAUDE_CODE_SUBAGENT_MODEL`
4. model ของ session หลัก

(✅ ข้อ 2 ชนะข้อ 4 ยืนยันแล้ว — run-015: definition `haiku` วิ่งบน haiku ขณะ session เป็น opus · หมายเหตุเวอร์ชัน: ก่อน v2.1.251 env var มาก่อน definition และมี `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` บังคับใช้ env var กับทุกตัวได้)

> กติกา alias ตระกูลเดียวกัน: ถ้า session หลักใช้ model ในตระกูลเดียวกับ alias ที่ระบุ (session เป็น Opus, definition เขียน `model: opus`) Subagent จะได้ model ของ session **เป๊ะทุกตัวอักษร รวมถึง context window แบบ 1m** ถ้า session เปิดไว้ — ไม่ใช่รุ่นที่ alias ชี้อยู่ (ปกตินี่คือสิ่งที่ต้องการ) · และเวลาสงสัยว่า Subagent ตัวไหนรันบน model อะไร ให้เปิด `/tasks` ระหว่างที่มันทำงาน (ใช้ได้ใน TUI)

## 4. เรียกใช้ 3 วิธี

1. **Auto-delegation** — Leader อ่าน `description` แล้วเลือกเองเมื่อโจทย์ตรง
2. **@-mention** — พิมพ์ `@code-researcher <โจทย์>` = **รับประกันว่าตัวนี้ถูกเรียก** (แต่ข้อความมอบงานยังเป็น Claude เขียน)
3. **CLI flag หรือ settings** — `claude --agent code-researcher` หรือตั้ง `"agent": "code-researcher"` ใน `.claude/settings.json` = session หลักกลายเป็น agent ตัวนี้ทั้งเครื่องมือ model และ **system prompt ถูกแทนที่ทั้งหมดด้วย body ของ agent** (ยกเว้น body ว่าง) — flag ทับ setting และการเลือกคงอยู่หลัง resume

**Subagent สำเร็จรูปที่มีให้ (ตามเอกสารทางการ):**

| ตัว | ทำอะไร | ข้อสังเกต |
|---|---|---|
| `Explore` | ค้น/ทำความเข้าใจโค้ด (อ่านอย่างเดียว, เร็ว) | ข้าม CLAUDE.md และ git status · one-shot เรียกต่อไม่ได้ (ไม่มี agent ID) |
| `Plan` | ค้นข้อมูลระหว่าง plan mode (อ่านอย่างเดียว) | ถูกใช้อัตโนมัติใน plan mode · one-shot |
| `general-purpose` | งานหลายขั้นที่ต้องทั้งค้นและแก้ | **ตัว fallback เมื่อไม่ระบุชนิด** — Agent call ที่ไม่ระบุ subagent_type จะล้มถ้าไม่มีตัวนี้ |
| `claude` | งานทั่วไปที่ไม่เข้ากับตัวเฉพาะทาง | default agent ของ background session |

ทับ built-in ได้: สร้าง definition ชื่อ `Explore` เองใน `.claude/agents/` (เช่น ตั้ง `model: haiku` ให้ exploration ถูกลง) ระบบจะใช้ตัวของคุณแทนตัวสำเร็จรูป · ปิด Explore/Plan ด้วย `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` (v2.1.198+) — Claude จะอ่านและสำรวจไฟล์เองแทนการ delegate (ตามเอกสารทางการ)

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

### เวอร์ชันภาษาไทย (✅ tested — runs/module-04/run-009: สร้าง `product-writer` agent ผ่านรอบเดียว)

```text
สร้างไฟล์ subagent ใหม่ที่ .claude/agents/product-writer.md ภายใน working directory ปัจจุบัน ห้ามถามคำถามเพิ่ม สร้างไฟล์เลย

Frontmatter: name ใช้ product-writer / description อธิบายว่าเป็นนักเขียนคำโฆษณาสินค้าภาษาไทยสำหรับร้านนี้ ใช้ proactively เมื่อต้องเขียนหรือแก้คำบรรยายสินค้า / tools ให้แค่ Read, Grep, Glob / model ใช้ sonnet
Body: system prompt มี 3 ส่วน — วิธีทำงาน (อ่านสินค้าจริงจาก data ก่อนเขียน ไม่มั่วสเปก/ราคา), รูปแบบผลลัพธ์ (ชื่อสินค้า, คำโฆษณาไม่เกิน 2 ประโยค, จุดขาย 3 ข้อ), ข้อจำกัด (อ่านอย่างเดียว ห้ามแก้ไฟล์)
ไฟล์ทั้งหมดไม่เกิน 40 บรรทัด
```

**สิ่งที่ต้องสังเกตจากการรันจริง:**

- สั่งภาษาไทย แต่ **ค่า machine-readable ออกมาถูกต้องเสมอ** — `name: product-writer` (Latin kebab-case ไม่ใช่ชื่อไทย), `tools`/`model` ตรงสเปก
- `description` เป็นภาษาไทยได้เต็มที่ และวลี trigger **"ใช้ proactively เมื่อ..."** ถูกวางตำแหน่งถูกต้อง
- **Body ของ system prompt จะถูกเขียนเป็นอังกฤษโดย default** แม้สั่งไทย — ถ้าอยากได้ body ภาษาไทย ให้เติม "เขียน body เป็นภาษาไทย" ใน prompt
- ⚠️ **กรณีศึกษาตรงข้าม (run-012):** สั่งแบบกำกวม "สร้าง subagent ให้โปรเจกต์นี้หน่อย แบบที่ใช้งานได้เลย" กับ `--max-turns 8` → **หมดเทิร์น ไม่มีไฟล์ ไม่มีคำตอบ** — ความกำกวมเป็นอุปสรรคในทุกภาษา (เทียบ run-003 ที่ EN กำกวมแล้ว "ถามกลับ")

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

**พิสูจน์อีกชั้น — system prompt ของ agent ขึ้นจริงหรือยัง (✅ tested — runs/module-04/run-013):** ฝังคำลับไว้ใน body ตอนเขียนไฟล์ (ok-probe ในหัวข้อ 2 มีบรรทัด `Your private code word is LAB-77`) แล้ว dispatch ไปถามตรง ๆ — ผลจริง: subagent ตอบ `LAB-77` กลับมา = body ของไฟล์เข้า context จริง และยืนยันว่ากำลังคุยกับ agent ตัวที่ถูกต้อง ไม่ใช่ persona ทั่วไป ประโยค "When asked about your setup, answer factually and briefly" ทำให้ใช้ agent ตัวนี้เป็น**เครื่องตรวจ context** ต่อได้ — การทดสอบ `omitClaudeMd` ใน run-013 ก็ใช้หลักคิดนี้เอง

**แก้ไฟล์ agent แล้วไม่ต้องเปิด session ใหม่ (ตามเอกสารทางการ):** Claude Code เฝ้าดู `.claude/agents/` กับ `~/.claude/agents/` ตลอด — ไฟล์ใหม่/ที่แก้ถูกหยิบขึ้นภายในไม่กี่วินาที ข้อยกเว้นเดียว: **โฟลเดอร์ `agents/` ที่ยังไม่มีอยู่ตอนเปิด session** — ไฟล์แรกที่สร้างในโฟลเดอร์ใหม่ต้อง restart หนึ่งครั้งถึงจะเห็น (เจอบ่อยตอนเริ่มโปรเจกต์ใหม่ — ใน sandbox ของ Workshop 2 ไม่กระทบ เพราะมีโฟลเดอร์นี้อยู่แล้ว)

> **เคล็ดลับ debugging ที่ใช้จริง:** อยากเห็นว่า Agent เรียก tool อะไรและถูก deny ตรงไหน ให้เพิ่ม `--output-format stream-json --verbose` (ธงคู่บังคับ) แล้ว grep `"is_error":true`

## กับดักที่พบบ่อย

- `description` เขียนกำกวม → auto-delegation ไม่ยอมเลือกตัวนี้ (ต้อง @-mention ตลอด)
- ให้ tools เกินจำเป็น (ลืมตัด `Edit/Write` ใน agent อ่านอย่างเดียว) → เสี่ยงโดนแก้ไฟล์
- ตั้ง `permissionMode: plan` เผื่อกัน Subagent เขียนไฟล์ แต่ session หลักเปิด `--permission-mode acceptEdits` (หรือ bypassPermissions) → ค่าใน definition **ถูกเมิน Subagent เขียนได้จริง** (✅ tested — run-018: plan ภายใต้ acceptEdits เขียนสำเร็จ / ภายใต้ default ถูกบล็อก) — จะกันเขียนแบบจริงจังให้ใช้ tools allowlist หรือ permission rules (Module 9)
- ตั้งชื่อซ้ำกับ built-in (`explore`) → ชนกัน
- สะกดชื่อฟิลด์ผิด → **ถูกเมินเงียบ ๆ ไม่มี error** — ไฟล์ยังโหลด แต่ฟิลด์นั้นไม่ทำงาน (✅ tested — run-013/run-014: `disallowedtools` ตัวเล็ก → agent โหลดปกติ ไม่มี warning ใน session; บน 2.1.302 debug log มีข้อความพร้อมคำแนะนำ: `has a frontmatter key Claude Code does not recognize or apply: "disallowedtools" (did you mean "disallowedTools"?)` — บน 2.1.284 เงียบ)
- ไฟล์ถูก**ข้ามทั้งไฟล์**โดยไม่เตือนใน session เมื่อ: ไม่มี frontmatter, ไม่มี `name`, มี `name` แต่ไม่มี `description`, ชื่อขึ้นต้น `-`, ชื่อมี `:`, หรือ YAML พัง (✅ tested — run-013: ไฟล์พัง 6 จาก 10 หายเงียบ ๆ) — `claude plugin validate .claude` ช่วยได้บางส่วน: YAML พัง = error, ไม่มี description = warning แต่ไฟล์ไม่มี name/ไม่มี frontmatter และชื่อเวี้ยว **ผ่าน validate ไปเงียบ ๆ** (ตรวจซ้ำบน 2.1.302 เหมือนเดิม — run-014) — ยืนยันขั้นสุดท้ายด้วยการถาม Claude ให้ list agent แล้วนับชื่อ และหาสาเหตุรายไฟล์ได้จาก debug log (`~/.claude/debug/`) ที่มีข้อความเฉพาะ เช่น "invalid name '-dashy': names must not start with '-'" — อีกเหตุผลของกฎ "ตรวจไฟล์ด้วยตาตัวเองเสมอ" (หัวข้อ 6)
- ตั้ง `omitClaudeMd: true` แต่รันผ่าน `claude --agent` (main session) → ค่านี้ถูก ignore — ใช้ได้เฉพาะตอนถูก dispatch เป็น Subagent (ตามเอกสารทางการ)
- **cwd เป็น subfolder** → Agent อาจถามกลับว่า "โปรเจกต์" คืออันไหน — ระบุ "INSIDE THE CURRENT WORKING DIRECTORY" ใน prompt สร้างไฟล์ (✅ เคสจริงจาก run-003)
