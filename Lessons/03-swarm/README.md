# Module 3 — Swarm / Parallel exploration + Agent Teams

> ⏱ ~80 นาที · 🎯 Part A: สั่งครั้งเดียวให้ Explore สามตัวสำรวจแล้วรวมรายงาน · Part B: เปิดโหมดทีมให้เพื่อนทีมท้าทายรายงาน มีรายการงานร่วม · ทั้งสองรอบห้ามแก้ไฟล์แอป

## Key idea / แนวคิดหลัก — เล่าเป็นเรื่อง

วันจริงของแอป Registry Insight จะมีคำถามสามกลุ่มที่ตอบไม่จบ: โครงสร้างโปรเจกต์เดินอย่างไร ข้อมูลใน CSV สะอาดแค่ไหน และโค้ดส่วนไหนมีพฤติกรรมเสี่ยง ถ้าให้บทสนทนาหลักอ่านทุกไฟล์เองตามลำดับ คำตอบที่ยาวจะท่วมบทสนทนาทีละนิด จนถึงจุดหนึ่ง Claude เริ่มลืมสิ่งที่คุยกันไปแล้วด้านบน

**Part A — Swarm (Explore subagents)** คือทางออกรอบแรก: คุณสั่ง leader เพียงครั้งเดียว มันแตกงานเป็นเอเจนต์ย่อยสามตัวที่อ่านคนละส่วนพร้อมกัน แต่ละตัวเปิดไฟล์เองในโลกของตัวเอง แล้วส่งกลับมาแค่บทสรุป — บทสนทนาหลักจึงเบาพอจะคุยงานต่อ

ข้อกันพลาดอยู่ที่คำว่า "พร้อมกัน": swarm ใช้ได้เฉพาะก้อนงานที่ไม่ต้องรอผลกัน เราเลือก `Explore` เพราะอ่านอย่างเดียว — อ่านได้เร็ว และแก้ไฟล์ไม่ได้แม้จะอยาก

**Part B — Agent Teams** ต่อเมื่อมีรายงานแล้ว: เพื่อนทีมเป็น Claude คนละชุดความจำ มีรายการงานร่วมและคุยกันเองได้ ไม่ต้องส่งทุกข้อความผ่านหัวหน้า ใช้เมื่ออยากให้พวกเขาท้าทาย/ช่วยกันเอง — แพงกว่าคุยคนเดียวประมาณ **15 เท่า** คลาสมีสปอนเซอร์จึงให้ทุกคนทำ ไม่ใช่แค่ดูสาธิต

> EN: Part A = three Explore subagents, one short report. Part B = Agent Teams that challenge the report via shared tasks and peer messages.

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

### Part B — Explore กับ Agent Teams ต่างกันยังไง

| | Part A — Explore | Part B — Agent Teams |
|---|---|---|
| เปิดยังไง | เปิด `claude` แล้วสั่งได้เลย | ต้องสร้างไฟล์ `.claude/settings.local.json` ก่อน แล้วค่อยเปิด `claude` |
| การคุยกัน | ผู้ช่วยส่งสรุปกลับหัวหน้าเป็นหลัก | เพื่อนทีมคุยกันเองได้ + มีรายการงานร่วม |
| เหมาะกับ | อ่านคนละส่วนแล้วสรุปสั้น | ให้ช่วยท้าทายรายงาน / ถกกันเอง |
| ค่าใช้จ่าย | ถูกกว่าในสองรอบของบทนี้ | แพงกว่ามาก (~15 เท่าของแชทคนเดียว) |
| `claude -p` | ใช้ได้ถ้าจำเป็น | **ใช้ไม่ได้กับโหมดทีม** — ต้องเปิดหน้าจอ `claude` |

หลัง Part B ต้อง **ลบไฟล์ `settings.local.json`** ก่อนไป Workshop 2 — ไม่งั้น Claude อาจยังเปิดโหมดทีมอยู่โดยที่คุณไม่ได้ขอ (ไฟล์นี้ไม่หายเองเมื่อปิดหน้าต่าง)

## ลงมือทำตามลำดับ

ทำตาม [LAB.md](LAB.md) — สรุปลำดับห้อง:

1. Part A ใน `claude` ด้วย prompt Explore สามตัว → เขียน `docs/EXPLORATION-REPORT.md`
2. `git status` + `npm run gate` (พิมพ์ `echo $LASTEXITCODE` ได้ `2`)
3. ปิด `claude` → สร้าง `.claude/settings.local.json` ตาม LAB → เปิด `claude` ใหม่
4. Part B ด้วย prompt Agent Teams สามชื่อ → เขียน `docs/TEAMS-REVIEW.md` → สั่งเพื่อนทีมปิดงาน
5. ปิด `claude` → **ลบ** `settings.local.json` (เป็นขั้นเรียน ไม่ใช่แค่เก็บกวาด)

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

## เปิดโหมดทีม — คัดลอกใส่ไฟล์

ก่อน Part B ให้สร้างไฟล์ชื่อ `.claude/settings.local.json` ในโฟลเดอร์แอป แล้ว**คัดลอกทั้งก้อนนี้**ไปวาง บันทึก (Save) แล้วค่อยเปิด `claude` ใหม่:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "CLAUDE_CODE_MAX_TURNS": "20"
  }
}
```

- `...AGENT_TEAMS` = `"1"` → เปิดโหมดทีม  
- `...MAX_TURNS` = `"20"` → เพดานไม่เกิน 20 รอบ  

จบ Part B แล้ว **ลบทั้งไฟล์** นี้ทิ้ง (คลิกขวา → Delete) — ไม่งั้นรอบถัดไปยังเป็นโหมดทีมอยู่

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
- ลืมลบไฟล์ `settings.local.json` — Workshop ถัดไปอาจยังเป็นโหมดทีมโดยไม่ตั้งใจ
- Part B ไม่ใส่ `CLAUDE_CODE_MAX_TURNS` หรือใส่ต่ำเกินไป — ทีมยังไม่ทันสรุปก็หมดรอบ (ในคอร์สใช้ `"20"`)

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
<summary>4. ทำไมต้องลบ settings.local.json หลัง Part B</summary>
ไฟล์นี้บอก Claude ว่า “เปิดโหมดทีมอยู่” และไม่หายเองเมื่อปิดหน้าต่าง — ลืมลบแล้วรอบถัดไปอาจเป็นทีมใหญ่โดยไม่ตั้งใจ
</details>

## Go deeper

- [คู่ prompt](../../reference/prompt-pairs-th-en.md)
- [Claude Code — Agent teams](https://code.claude.com/docs/en/agent-teams)
