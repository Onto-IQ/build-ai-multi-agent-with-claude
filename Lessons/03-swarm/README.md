# Module 3 — Swarm / Parallel exploration + Agent Teams

> ⏱ ~80 นาที · 🎯 Part A: prompt เดียวปล่อย Explore สามตัวรวมรายงาน · Part B: เปิด Agent Teams ให้ teammate ท้าทายรายงานผ่าน mailbox + รายการงานร่วม · Explore swarm then Agent Teams challenge — both read-only.

## Key idea / แนวคิดหลัก — เล่าเป็นเรื่อง

วันจริงของแอป Registry Insight จะมีคำถามสามกลุ่มที่ตอบไม่จบ: โครงสร้างโปรเจกต์เดินอย่างไร ข้อมูลใน CSV สะอาดแค่ไหน และโค้ดส่วนไหนมีพฤติกรรมเสี่ยง ถ้าให้บทสนทนาหลักอ่านทุกไฟล์เองตามลำดับ คำตอบที่ยาวจะท่วมบทสนทนาทีละนิด จนถึงจุดหนึ่ง Claude เริ่มลืมสิ่งที่คุยกันไปแล้วด้านบน

**Part A — Swarm (Explore subagents)** คือทางออกรอบแรก: คุณสั่ง leader เพียงครั้งเดียว มันแตกงานเป็นเอเจนต์ย่อยสามตัวที่อ่านคนละส่วนพร้อมกัน แต่ละตัวเปิดไฟล์เองในโลกของตัวเอง แล้วส่งกลับมาแค่บทสรุป — บทสนทนาหลักจึงเบาพอจะคุยงานต่อ

ข้อกันพลาดอยู่ที่คำว่า "พร้อมกัน": swarm ใช้ได้เฉพาะก้อนงานที่ไม่ต้องรอผลกัน เราเลือก `Explore` เพราะอ่านอย่างเดียว — อ่านได้เร็ว และแก้ไฟล์ไม่ได้แม้จะอยาก

**Part B — Agent Teams** ต่อเมื่อมีรายงานแล้ว: teammate เป็น Claude เต็มตัวคนละหน้าต่างบริบท มีรายการงานร่วมและส่งข้อความหากันได้โดยไม่ผ่าน lead ทุกครั้ง ใช้เมื่อต้องการให้พวกเขาสังเคราะห์/ท้าทายกันเอง — ไม่ใช่แค่รายงานกลับมาเงียบ ๆ ราคาประมาณ **~15×** แชทเดียว คลาสนี้มีสปอนเซอร์รองรับจึงเป็นแล็บบังคับ ไม่ใช่แค่สาธิต

> EN: Part A = three Explore subagents, one short report. Part B = experimental Agent Teams that challenge the report via shared tasks and peer messages.

## Concept / เนื้อหา

### Part A — แบ่งงานสำรวจ

ตัวชี้ว่าแบ่งถูกหรือผิดอยู่ที่ขอบเขต ในแล็บนี้เราแตกงานเป็นสามก้อนที่ไม่ง้อกัน:

1. **โครงสร้าง** — `server.js`, `web/`, `mcp/`, `scripts/` และวิธียกเซิร์ฟเวอร์
2. **ข้อมูล** — คอลัมน์ใน `data/README.md` และข้อความ FAIL ที่ quality gate รายงาน
3. **ความเสี่ยง** — ทางที่เซิร์ฟเวอร์อ่าน CSV และทางที่รับ `POST /api/notes`

สามก้อนนี้อ่านไฟล์คนละชุด ไม่มีใครต้องรอคำตอบของอีกตัว จึงวิ่งขนานได้จริง

สัญญาณบอกว่าแบ่งผิด (เจอสักข้อแปลว่าต้องรวมหรือแบ่งใหม่):

| อาการ | ความหมาย |
|---|---|
| เอเจนต์ย่อยส่งข้อความหากันยาว | งานผูกกันเกินกว่าจะแยก |
| ไฟล์ชน | เจ้าของไฟล์ไม่ชัด |
| รอกันเป็นทอด | นี่คืองานต่อคิว ไม่ใช่ swarm |
| สรุปคนละสมมติฐาน | ยังไม่บอกกันว่าข้อมูลต้องเชื่อมกันยังไง |

ก่อนกดส่ง ตรวจสามข้อ: แต่ละก้อนมีเจ้าของคนเดียว, บอกแล้วว่าข้อมูลต้องเชื่อมกันอย่างไร, และใส่ประโยคห้ามแก้ไฟล์แล้ว

### Part B — Explore swarm ต่างจาก Agent Teams อย่างไร

| | Explore subagents (Part A) | Agent Teams (Part B) |
|---|---|---|
| เปิดยังไง | ค่าเริ่มต้นของ Claude Code | ตั้ง `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` แล้วเปิด TUI |
| การสื่อสาร | สรุปกลับ lead เป็นหลัก | teammate ส่งข้อความหากันได้ + รายการงานร่วม |
| เหมาะกับ | อ่าน/สรุปก้อนอิสระ เร็ว ถูกกว่า | ท้าทายสมมติฐาน ประสานงานที่ต้องคุยกัน |
| Token | ต่ำกว่าในสองแบบของโมดูลนี้ | สูงกว่ามาก (~15× แชทเดียว) |
| Headless `-p` | ใช้ได้ถ้าจำเป็น | **ไม่สร้าง teammate** — ต้อง TUI |

เปิด Teams แล้วยังเปลี่ยนพฤติกรรม delegation ปกติ: subagent ที่ Claude ตั้งชื่ออาจกลายเป็น teammate — **จึงต้องปิด flag หลังจบ Part B** ก่อนไป Workshop 2

## ลงมือทำตามลำดับ

ทำตาม [LAB.md](LAB.md) — สรุปลำดับห้อง:

1. Part A ใน TUI ด้วย prompt Explore สามตัว → เขียน `docs/EXPLORATION-REPORT.md`
2. `git status` + `npm run gate` (ยัง exit 2)
3. ออก TUI → ตั้ง `$env:CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = "1"` → เปิด `claude` ใหม่
4. Part B ด้วย prompt Agent Teams สามชื่อ → เขียน `docs/TEAMS-REVIEW.md` → shut down teammates
5. ออก TUI → ลบ env ของ flag

หมายเหตุ headless: ถ้าต้องรัน Part A นอก TUI จริง ๆ คำสั่งคือ `claude -p "<prompt>" --allowedTools "Task" --max-turns 20` จากโฟลเดอร์แอป — Part B **ห้าม** ใช้ทางนี้

## Prompt pattern — Part A (Explore)

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Dispatch 3 parallel Explore subagents on this Registry Insight app.
1) Map the runtime files and how to start the server.
2) Read data/README.md and the failure text from npm run gate. Do not fix anything.
3) Trace GET /api/summary and POST /api/notes far enough to name the risky behavior.
Do not modify files. Return one report under 300 words with headings: structure, data quality, risks.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ส่ง Explore subagent 3 ตัวทำพร้อมกันในแอป Registry Insight
1) แผนที่ไฟล์ที่ใช้รัน และวิธียกเซิร์ฟเวอร์
2) อ่าน data/README.md และข้อความ FAIL จาก npm run gate ห้ามแก้
3) ไล่ GET /api/summary กับ POST /api/notes พอให้ชี้พฤติกรรมที่เสี่ยง
ห้ามแก้ไขไฟล์ ส่งรายงานเดียวไม่เกิน 300 คำ มีหัวข้อ โครงสร้าง, คุณภาพข้อมูล, จุดเสี่ยง
```

| ส่วน | หน้าที่ |
|---|---|
| Dispatch 3 parallel Explore | บังคับชนิดและจำนวน |
| เลข 1–3 | ก้อนงานคนละบริบท |
| Do not modify / ห้ามแก้ไข | กันเอเจนต์ลงมือแก้ |
| under 300 words | กันสรุปยาวจน leader อ่านไม่ไหว |

## Prompt pattern — Part B (Agent Teams)

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Enable an agent team (not Explore subagents). Spawn exactly 3 named teammates:
- structure-scout — verifies runtime layout claims in docs/EXPLORATION-REPORT.md
- data-scout — verifies data-quality claims against data/README.md and gate FAIL text
- devil-advocate — challenges every risk; looks for overstated or missing risks

Use a shared task list. Teammates must message each other at least once before the lead synthesizes.
Do not modify application files.
Write docs/TEAMS-REVIEW.md with headings: agreement, disputed, next sequential step.
Keep the whole file under 250 words. Cite file:line for disputed items.
When finished, ask all teammates to shut down.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ใช้ Agent Teams (ไม่ใช่ Explore subagent) สร้าง teammate ชื่อชัดเจน 3 ตัว:
- structure-scout — ตรวจข้ออ้างเรื่องโครงสร้างใน docs/EXPLORATION-REPORT.md
- data-scout — ตรวจข้ออ้างคุณภาพข้อมูลกับ data/README.md และข้อความ FAIL ของ gate
- devil-advocate — ท้าทายทุกจุดเสี่ยง หาข้อที่พูดเกินหรือขาด

ใช้รายการงานร่วม Teammate ต้องส่งข้อความหากันอย่างน้อยหนึ่งครั้งก่อนที่ lead จะสรุป
ห้ามแก้ไฟล์แอป
เขียน docs/TEAMS-REVIEW.md มีหัวข้อ: agreement, disputed, next sequential step
ทั้งไฟล์ไม่เกิน 250 คำ ข้อ disputed ต้องอ้าง file:line
จบแล้วให้ teammate ทุกตัว shut down
```

| ส่วน | หน้าที่ |
|---|---|
| agent team / ไม่ใช่ Explore | บังคับโหมด Teams ไม่ให้ถอยกลับไป subagent |
| ชื่อ teammate ชัดเจน | ให้แผงเอเจนต์และ mailbox แยกตัวได้ |
| shared task list | ใช้ coordination ของ Teams จริง |
| message each other | บังคับ peer messaging ไม่ใช่แค่รายงานกลับ lead |
| shut down | ปิด teammate หลังงานจบ |

> 📚 **ทำไมแนะนำ EN:** ภาษาของ prompt เป็นตัวกำหนดภาษาของรายงาน — คอร์สทดสอบคู่กันไว้แล้ว รายงานฉบับนี้ถูกอ้างต่อใน Workshop ถัด ๆ ไป ซึ่งของที่ถูกอ้างเป็นอังกฤษทั้งหมด รายงานอังกฤษจึงต่อกันเนียนที่สุด TH ใช้ได้เต็มสิทธิ์ — ชื่อไฟล์และ endpoint ยังถูกพิมพ์ถูกต้องเสมอ

## Common pitfalls / กับดัก

- สั่ง "หาทุกอย่าง" โดยไม่จำกัดคำ — ได้รายงานยาวกลืนบทสนทนาหลัก
- ลืมประโยคห้ามแก้ไฟล์ — เอเจนต์ย่อยที่เจอบั๊กมัก "ช่วยแก้"
- แตกงานที่ต้องใช้ผลกันให้ขนาน — ก้อนที่รอกันจะสรุปคนละสมมติฐาน
- เปิด Teams แล้วใช้ `claude -p` — ไม่ได้ teammate
- prompt Part B ไม่พูดว่า agent team — ได้ Explore ธรรมดาแล้วคิดว่าจบแล็บแล้ว
- ลืมปิด `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` — Workshop 2+ อาจแตกเป็น teammate โดยไม่ตั้งใจ
- ตั้ง `--max-turns` ต่ำใน headless Part A — รวมรายงานไม่ทัน

## Quick check / ทบทวน

<details>
<summary>1. ทำไมรอบ Part A ใช้ Explore</summary>
เพราะงานคืออ่านและสรุป การแก้ไฟล์เป็นคนละแล็บ และยังไม่ต้องการให้เอเจนต์คุยกันเอง
</details>

<details>
<summary>2. ทำไม Part B ถึงเปิด Agent Teams</summary>
ต้องการให้ teammate ท้าทายและประสานผ่านรายการงานร่วม/ข้อความ — ไม่ใช่แค่สรุปกลับ lead
</details>

<details>
<summary>3. git status หลังแล็บควรเป็นอย่างไร</summary>
มีเอกสารใน `docs/` ที่สั่งเขียน ไม่มีไฟล์ของแอปเปลี่ยนจากการสำรวจ/ทบทวน
</details>

<details>
<summary>4. ทำไมต้องปิด flag หลัง Part B</summary>
เมื่อเปิด Teams การ delegation ปกติอาจกลายเป็น teammate — แล็บถัดไปต้องการพฤติกรรม subagent/specialty ตาม LAB
</details>

## Go deeper

- [คู่ prompt](../../reference/prompt-pairs-th-en.md)
- [Claude Code — Agent teams](https://code.claude.com/docs/en/agent-teams)
