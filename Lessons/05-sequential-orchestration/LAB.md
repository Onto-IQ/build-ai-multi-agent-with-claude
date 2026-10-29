# Workshop 3 — แผน → ทีมลงมือขนาน 3 สาย → เว็บโชว์ยอดจริง

> ⏱ machine ~14 นาที · Start state: มี `docs/EXPLORATION-REPORT.md` จาก Workshop 1 · quality gate ยัง 0/6

## Goal / เป้าหมาย

หน้าเว็บโชว์ยอดจริง (gate ผ่านเคส data-quality และ summary = 2/6) จากงานที่ planner วางแผนเป็นไฟล์ และ developer ในบทบาท **lead** แตกงานให้ subagent สามสายทำขนานกัน: ข้อมูล, backend, frontend

## สังเกต handoff (หัวใจของแล็บนี้)

| จาก | ไฟล์ | ถึง |
|---|---|---|
| Workshop 1 Part A (Explore) | `docs/EXPLORATION-REPORT.md` | planner อ่านก่อนวางแผน |
| Workshop 1 Part B (Agent Teams) | `docs/TEAMS-REVIEW.md` | อ่านคู่กันถ้ามี — disputed / next step |
| planner | `docs/TASKS.md` | developer (lead) ทำตามแผน |
| developer lead | แตกงาน 3 สายขนาน | data · backend · frontend |
| data สาย | `docs/DESIGN.md` + `scripts/clean-export.sql` | คุณรัน SQL เอง |
| สคริปต์ของคุณ | `data/dataset.csv` (แทนที่) | เว็บแดชบอร์ดโชว์ยอดจริง |
| developer (รอบสอง) | `docs/REVIEW.md` | ตัวคุณ + Workshop 4 |

## Steps / ขั้นตอน

1. สร้างเอเจนต์ทั้งสองตัวใน TUI (คำสั่งเดียวจบ เขียนสองไฟล์) แล้วกดอนุญาตเมื่อถามสิทธิ์เขียน `.claude/`

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
In this folder, create two agent files.

1) .claude/agents/planner.md — Frontmatter: name planner; description "Use proactively to turn an exploration report into a short ordered task plan"; tools Read, Grep, Glob, Write; model sonnet. Body: you are the planner. You read the exploration report and data/README.md, then write docs/TASKS.md: an ordered task list with file ownership. You never write code.

2) .claude/agents/developer.md — Frontmatter: name developer; description "Use proactively to implement one task from docs/TASKS.md"; tools Read, Grep, Glob, Write, Edit, Bash; model sonnet. Body: you are the developer. You implement exactly the tasks assigned to you, citing the task numbers. Node only, no dependencies. Never touch scripts/quality-gate.js.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ในโฟลเดอร์นี้ สร้างไฟล์เอเจนต์สองตัว

1) .claude/agents/planner.md — frontmatter: name เป็น planner; description ว่า Use proactively to turn an exploration report into a short ordered task plan; tools เป็น Read, Grep, Glob, Write; model เป็น sonnet เนื้อหา: คุณคือ planner อ่าน exploration report กับ data/README.md แล้วเขียน docs/TASKS.md เป็นลิสต์งานเรียงลำดับพร้อมเจ้าของไฟล์ ห้ามเขียนโค้ด

2) .claude/agents/developer.md — frontmatter: name เป็น developer; description ว่า Use proactively to implement one task from docs/TASKS.md; tools เป็น Read, Grep, Glob, Write, Edit, Bash; model เป็น sonnet เนื้อหา: คุณคือ developer ทำงานตาม task ที่ได้รับ อ้างหมายเลข task Node ล้วน ห้ามแตะ scripts/quality-gate.js
```

2. **ปิด TUI แล้วเปิด `claude` ใหม่** — เอเจนต์ใหม่ถูกโหลดตอนเซสชันเริ่มเท่านั้น (เหมือน Workshop 2)

3. สั่ง planner ทำ handoff แรก — วาง prompt (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Use the planner subagent. Read docs/EXPLORATION-REPORT.md and data/README.md, then write docs/TASKS.md: the ordered tasks to clean data/dataset.csv and prove it, organized as three tracks (data, backend, frontend), who owns each file, and which task must never touch scripts/quality-gate.js.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ให้ subagent planner อ่าน docs/EXPLORATION-REPORT.md กับ data/README.md แล้วเขียน docs/TASKS.md: ลิสต์งานเรียงลำดับเพื่อทำความสะอาด data/dataset.csv และพิสูจน์ผล จัดเป็นสามสาย (data, backend, frontend) ใครเป็นเจ้าของไฟล์ไหน และงานไหนห้ามแตะ scripts/quality-gate.js
```

📦 **Handoff ที่ 1 เกิดแล้ว:** เปิด `docs/TASKS.md` ด้วยตา — นี่คือของที่ planner ส่งต่อให้ developer

4. สั่ง developer ในบทบาท **lead** แตกงานขนานสามสาย (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Use the developer subagent as a lead. Read docs/TASKS.md and dispatch three parallel subagents, one per track.
data: write docs/DESIGN.md (the cleaning contract: junk-row drop, พ.ศ. to ISO dates, comma capitals, province extraction) and scripts/clean-export.sql (DuckDB SQL reading data/raw/dbd-2558.parquet, exporting data/dataset.csv).
backend: rewrite the summary computation in server.js to parse with lib/csv.js instead of the naive comma split, and count only rows the data dictionary accepts (13-digit reg_no, ISO reg_date, numeric capital).
frontend: update web/app.js so the dashboard shows the order count and revenue from /api/summary plus a small line naming the data source.
Do not touch scripts/quality-gate.js. Cite which task numbers you completed.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ให้ subagent developer ทำหน้าที่ lead อ่าน docs/TASKS.md แล้วแตกงานให้ subagent สามตัวทำขนานกัน สายละหนึ่ง
data: เขียน docs/DESIGN.md (สัญญาทำความสะอาด: แถวหัวตารางทิ้ง พ.ศ. เป็น ค.ศ. ทุนมีลูกน้ำ ดึงจังหวัดจากที่อยู่) และ scripts/clean-export.sql (DuckDB SQL อ่าน data/raw/dbd-2558.parquet ส่งออก data/dataset.csv)
backend: เขียนส่วนคำนวณ summary ใน server.js ใหม่ด้วย lib/csv.js แทนการ split จุลภาคตรง ๆ และนับเฉพาะแถวที่ผ่านพจนานุกรมข้อมูล (reg_no 13 หลัก, reg_date ISO, capital เป็นตัวเลข)
frontend: ปรับ web/app.js ให้แดชบอร์ดโชว์จำนวนกิจการกับทุนรวมจาก /api/summary พร้อมบรรทัดเล็กบอกที่มาของข้อมูล
ห้ามแตะ scripts/quality-gate.js รายงานว่าทำ task เลขอะไรครบบ้าง
```

📦 **Handoff ที่ 2:** `docs/TASKS.md` → SQL ทำความสะอาดจริงใน `scripts/clean-export.sql`

5. **รัน SQL ทำความสะอาดด้วยมือคุณเอง** — หลักฐานต้องมาจากเทอร์มินัลของคุณ (ที่ workshop repo) SQL เขียนทับ `data/dataset.csv` เป็นฉบับสะอาดให้เลย

```powershell
duckdb -c ".read scripts/clean-export.sql"
```

ผลที่คาดหวัง: ได้ `data/dataset.csv` ฉบับสะอาด 16,772 แถว (วันที่ ISO ทุนไม่มีลูกน้ำ มีคอลัมน์ province)

> 📚 **รู้เพิ่ม (จากการรันจริง):** agent ที่เขียน SQL อาจเลือกวิธีดึงจังหวัดต่างจากด้านบน — เคสที่ต้องเช็คคือที่อยู่ที่พูดถึงจังหวัดอื่นกลางประโยค (เช่น ถนนบางนา-ตราด ซึ่งอยู่ในกรุงเทพฯ) ถ้า gate รายงาน `unknown-province` ให้ชี้ `lib/inspect-data.js` แล้วสั่ง developer แก้กฎการดึงจังหวัดต่อ

6. เปิด `http://127.0.0.1:3000` (รัน `npm start` ในเทอร์มินัลลูก) — **หน้าเว็บโชว์ยอดจริงแล้ว: 16,772 กิจการ, ทุนรวม 45,341,868,784 บาท**

📦 **Handoff ที่ 3:** สคริปต์ที่สาย data เขียน → ข้อมูลสะอาด → เว็บที่ผู้ใช้เห็น (ที่สาย frontend จัดหน้าให้)

7. รัน quality gate ด้วยมือคุณเอง

```powershell
npm run gate
```

ผลที่คาดหวัง: **2/6 passed** — `data-quality` และ `summary-matches-valid-rows` เขียว อีกสี่เคสยังแดง (`bad-json-does-not-crash`, `health-no-secrets`, `notes-validation`, `notes-persists`) ไปแก้ใน Workshop 4

8. สั่ง developer รอบสอง: รีวิวงานตัวเอง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Use the developer subagent again. Compare scripts/clean-export.sql against docs/DESIGN.md and write docs/REVIEW.md with the differences. Fix nothing.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ให้ subagent developer รอบใหม่ เทียบ scripts/clean-export.sql กับ docs/DESIGN.md แล้วเขียน docs/REVIEW.md สรุปจุดต่าง ห้ามแก้ของ
```

## ✅ Checkpoint

- [ ] `.claude/agents/` มี planner.md และ developer.md ที่ Claude เขียนใน TUI
- [ ] `docs/TASKS.md`, `docs/DESIGN.md`, `docs/REVIEW.md` เกิดจริงและอ้างกันและกัน
- [ ] รายงานของ developer lead อ้างงานครบสามสาย (data, backend, frontend)
- [ ] หน้าเว็บโชว์ยอดจริง (16,772 กิจการ / 45,341,868,784 บาท ตรงกับไฟล์สะอาด)
- [ ] quality gate 2/6 — อีกสี่เคสยังแดงตามที่วางไว้
- [ ] `git diff -- scripts/quality-gate.js` ว่าง (ตัวตรวจไม่มีใครแตะ)

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| สั่งใช้ planner แล้วขึ้น `Agent type not found` | ยังไม่ได้รีสตาร์ท TUI หลังสร้างไฟล์ | ปิดแล้วเปิด `claude` ใหม่ |
| ได้แผน แต่ไม่ได้ไฟล์ | planner ถูกสั่งให้เขียนโค้ด | planner มีแค่ Write — ตรวจว่าสั่งเขียน `docs/TASKS.md` เท่านั้น |
| หน้าเว็บยังโชว์ของเดิม | ยังไม่ได้รัน SQL ส่งออกไฟล์สะอาด | รัน `duckdb -c ".read scripts/clean-export.sql"` ในขั้น 5 ซ้ำ |
| gate ยัง 1/6 | แทนที่ CSV แล้วแต่ไฟล์สะอาดยังมี violation | ดูรายงาน FAIL แล้วสั่ง developer แก้สคริปต์ตาม รอบนี้แก้ได้ |
| สาย backend แก้ summary แล้วยอดยังเพี้ยน | ยังอ่านราคาแบบตัดลูกน้ำขาด | ชี้ `lib/inspect-sales.js` ให้เทียบวิธีอ่านเงิน แล้วสั่งแก้ต่อ |
| สคริปต์ไปแก้ `scripts/quality-gate.js` | ไม่มีข้อห้ามใน TASKS.md | คืนไฟล์จาก git แล้วเติมข้อห้ามใน TASKS.md สั่งใหม่ |
| port busy | เซิร์ฟเวอร์ค้าง | ปิดก่อนรัน gate หรือตั้ง `PORT` |

## 🆘 Behind? Catch up

จาก course repo (ไฟล์ถูก copy ลง workshop repo):

```bash
node scripts/catch-up.js w3
```

ได้ `docs/DESIGN.md`, `docs/REVIEW.md`, `scripts/clean-export.sql` และ `data/dataset.csv` ฉบับสะอาด

## Stretch / ต่อยอด

สั่ง planner เพิ่ม task "ตรวจว่า clean-export.sql ทนกับไฟล์ CSV ที่มี BOM" แล้วให้ developer ทำตาม — ซ้อม handoff รอบที่สาม

## Solution → solutions/w3/

ตรวจด้วย `node solutions/w3/check.js` (จาก course repo) ยอดอ้างอิงหลังสะอาดคือ 16,772 กิจการ และ 45,341,868,784 บาท
