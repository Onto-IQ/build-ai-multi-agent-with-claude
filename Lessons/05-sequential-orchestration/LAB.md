# Workshop 3 — Hybrid: ต่อคิว + Teammate → เว็บโชว์ยอดจริง

> ⏱ machine ~18–20 นาที · Start state: มี `docs/EXPLORATION-REPORT.md` จาก Workshop 1 · quality gate ยัง 0/6

## Goal / เป้าหมาย

หน้าเว็บโชว์ยอดจริง (gate ผ่านเคส data-quality และ summary = 2/6) จากงานแบบ **hybrid**:

1. **Sequential (ต่อคิวด้วยไฟล์)** — planner เขียนแผน → ได้ไฟล์แล้วค่อยลงมือ → รีวิวทีหลัง  
2. **Teammate (โหมดทีม)** — ตอนลงมือ ให้ `data` / `backend` / `frontend` เป็นเพื่อนทีมสามคนที่คุยกันเองได้

## สังเกต handoff (หัวใจของแล็บนี้)

| จาก | ไฟล์ / โหมด | ถึง |
|---|---|---|
| Workshop 1 Part A | `docs/EXPLORATION-REPORT.md` | planner อ่านก่อนวางแผน |
| Workshop 1 Part B | `docs/TEAMS-REVIEW.md` | อ่านคู่กันถ้ามี |
| planner (ต่อคิว) | `docs/TASKS.md` | developer อ่านแผน |
| developer + **3 teammates** | `docs/DESIGN.md` + SQL + แก้ `server.js` / `web/` | คุณรัน SQL เอง |
| สคริปต์ของคุณ | `data/dataset.csv` (แทนที่) | เว็บโชว์ยอดจริง |
| developer (รอบรีวิว · **ปิดโหมดทีมแล้ว**) | `docs/REVIEW.md` | ตัวคุณ + Workshop 4 |

> 📚 **hybrid คืออะไร:** ขั้นใหญ่ต่อคิวด้วยไฟล์ (แผนต้องมาก่อนลงมือ · รีวิวต้องมาหลังมีของจริง) · แต่**ในขั้นลงมือ** ใช้โหมดทีมให้เพื่อนชื่อ `data`, `backend`, `frontend` ประสานกันเอง — ไม่ใช่สำรวจแบบ Explore อย่างเดียวแบบ Module 3

## Steps / ขั้นตอน

### A — สร้าง specialty agent + วางแผน (ต่อคิว · ยังไม่เปิดโหมดทีม)

1. สร้างเอเจนต์ทั้งสองตัวใน TUI แล้วกดอนุญาตเมื่อถามสิทธิ์เขียน `.claude/`

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

2. **ปิด TUI แล้วเปิด `claude` ใหม่** — เอเจนต์ใหม่ถูกโหลดตอนเซสชันเริ่มเท่านั้น

3. สั่ง planner (เลือกอย่างใดอย่างหนึ่ง) — `@` = เรียกตรง:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@planner Read docs/EXPLORATION-REPORT.md and data/README.md, then write docs/TASKS.md: the ordered tasks to clean data/dataset.csv and prove it, organized as three tracks (data, backend, frontend), who owns each file, and which task must never touch scripts/quality-gate.js.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@planner อ่าน docs/EXPLORATION-REPORT.md กับ data/README.md แล้วเขียน docs/TASKS.md: ลิสต์งานเรียงลำดับเพื่อทำความสะอาด data/dataset.csv และพิสูจน์ผล จัดเป็นสามส่วน (data, backend, frontend) ใครเป็นเจ้าของไฟล์ไหน และงานไหนห้ามแตะ scripts/quality-gate.js
```

📦 **Handoff ที่ 1:** เปิด `docs/TASKS.md` ด้วยตา — ของที่ส่งต่อให้ขั้นลงมือ

4. **ปิด `claude`** ก่อนเปิดโหมดทีม

### B — เปิดโหมดทีม แล้วให้ developer สร้าง Teammate สามคน

5. สร้างไฟล์ตั้งค่าบนเครื่องคุณ (เหมือน Workshop 1 Part B แต่เพดานรอบเป็น **30**):

ชื่อไฟล์เป๊ะ ๆ: `.claude/settings.local.json` ในโฟลเดอร์ `C:\dev\multi-agent-workshop`

**คัดลอกทั้งก้อนนี้** ไปวาง แล้ว Save:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "CLAUDE_CODE_MAX_TURNS": "30"
  }
}
```

> 📚 **Note:**  
> - `...AGENT_TEAMS` = `"1"` → เปิดโหมดทีม (Teammate)  
> - `...MAX_TURNS` = `"30"` → เพดานไม่เกิน 30 รอบ (งานลงมือยาวกว่าสำรวจใน Workshop 1)  
> - ไฟล์นี้เป็นของเครื่องคุณคนเดียว · **ไม่หายเอง** เมื่อปิดหน้าต่าง · ต้องลบเองหลังขั้นนี้

6. เปิด `claude` ใหม่ (หลัง Save แล้วเท่านั้น):

```powershell
cd C:\dev\multi-agent-workshop
claude
```

> ใช้หน้าจอ `claude` ธรรมดา — **อย่า** ใช้ `claude -p` เพราะโหมดทีมจะไม่ทำงาน

7. สั่ง developer ให้เป็นหัวหน้าทีม สร้าง Teammate ชื่อ **data**, **backend**, **frontend** (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@developer Act as team lead. Read docs/TASKS.md.
Enable an agent team (not Explore subagents). Spawn exactly 3 named teammates:
- data — write docs/DESIGN.md (cleaning contract: junk-row drop, พ.ศ. to ISO dates, comma capitals, province extraction) and scripts/clean-export.sql (DuckDB SQL reading data/raw/dbd-2558.parquet, exporting data/dataset.csv)
- backend — rewrite summary computation in server.js to parse with lib/csv.js instead of naive comma split; count only rows the data dictionary accepts (13-digit reg_no, ISO reg_date, numeric capital)
- frontend — update web/app.js so the dashboard shows order count and revenue from /api/summary plus a small line naming the data source

Use a shared task list. The three teammates data, backend, and frontend must message each other at least 5 times before you synthesize.
Do not touch scripts/quality-gate.js. Cite which task numbers you completed.
When finished, ask each teammate by name to shut down (message data, then backend, then frontend). Do not call Stop Task using the names data/backend/frontend — those are teammate names, not task IDs.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@developer ทำหน้าที่หัวหน้าทีม อ่าน docs/TASKS.md
ใช้ Agent Teams (ไม่ใช่ Explore) สร้าง teammate ชื่อชัดเจน 3 ตัว:
- data — เขียน docs/DESIGN.md (สัญญาทำความสะอาด: แถวหัวตารางทิ้ง พ.ศ. เป็น ค.ศ. ทุนมีลูกน้ำ ดึงจังหวัดจากที่อยู่) และ scripts/clean-export.sql (DuckDB SQL อ่าน data/raw/dbd-2558.parquet ส่งออก data/dataset.csv)
- backend — เขียนส่วนคำนวณ summary ใน server.js ใหม่ด้วย lib/csv.js แทนการ split จุลภาคตรง ๆ และนับเฉพาะแถวที่ผ่านพจนานุกรมข้อมูล (reg_no 13 หลัก, reg_date ISO, capital เป็นตัวเลข)
- frontend — ปรับ web/app.js ให้แดชบอร์ดโชว์จำนวนกิจการกับทุนรวมจาก /api/summary พร้อมบรรทัดเล็กบอกที่มาของข้อมูล

ใช้รายการงานร่วม เพื่อนทีม data, backend, frontend ต้องส่งข้อความหากันอย่างน้อย 5 ครั้งก่อนที่คุณจะสรุป
ห้ามแตะ scripts/quality-gate.js รายงานว่าทำ task เลขอะไรครบบ้าง
จบแล้วให้สั่ง teammate ทีละชื่อให้ shut down (ส่งข้อความหา data แล้ว backend แล้ว frontend) ห้ามใช้ Stop Task โดยใส่ชื่อ data/backend/frontend เป็นรหัสงาน — นั่นคือชื่อเพื่อนทีม ไม่ใช่รหัสในรายการงาน
```

ผลที่คาดหวัง: แผงเอเจนต์มีชื่อ `data` / `backend` / `frontend` · มีรายการงานร่วม · ได้ DESIGN + SQL + การแก้ backend/frontend

📦 **Handoff ที่ 2:** `docs/TASKS.md` → ของที่เพื่อนทีมลงมือ

8. ออกจาก `claude` แล้ว **ลบทั้งไฟล์** `.claude/settings.local.json` (คลิกขวา → Delete) — ต้องทำก่อนรอบรีวิว ไม่งั้น Workshop ถัดไปยังเป็นโหมดทีม

### C — คุณรันของจริง + รีวิว (ต่อคิว · โหมดทีมปิดแล้ว)

9. รัน SQL ด้วยมือคุณเอง (workshop repo):

```powershell
duckdb -c ".read scripts/clean-export.sql"
```

ผลที่คาดหวัง: `data/dataset.csv` สะอาด 16,772 แถว (วันที่ ISO ทุนไม่มีลูกน้ำ มีคอลัมน์ province)

> 📚 **รู้เพิ่ม:** ถ้า gate รายงาน `unknown-province` ให้ชี้ `lib/inspect-data.js` แล้วสั่ง developer แก้กฎดึงจังหวัดต่อ (เปิด `claude` ใหม่หลังลบ settings แล้ว)

10. เปิด `http://127.0.0.1:3000` (`npm start` ในเทอร์มินัลลูก) — **16,772 กิจการ, ทุนรวม 45,341,868,784 บาท**

📦 **Handoff ที่ 3:** SQL → CSV สะอาด → เว็บที่ผู้ใช้เห็น

11. รัน quality gate:

```powershell
npm run gate
echo $LASTEXITCODE
```

ผลที่คาดหวัง: **2/6 passed** และ `$LASTEXITCODE` เป็น `2` — อีกสี่เคสยังแดง ไปแก้ใน Workshop 4

12. เปิด `claude` ใหม่ (**ไม่มี** `settings.local.json` แล้ว) แล้วสั่งรีวิว:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@developer Compare scripts/clean-export.sql against docs/DESIGN.md and write docs/REVIEW.md with the differences. Fix nothing.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@developer เทียบ scripts/clean-export.sql กับ docs/DESIGN.md แล้วเขียน docs/REVIEW.md สรุปจุดต่าง ห้ามแก้ของ
```

## ✅ Checkpoint

- [ ] มี `planner.md` และ `developer.md` จาก TUI
- [ ] `docs/TASKS.md` มาก่อนขั้น Teammate — เห็นลำดับต่อคิวด้วยไฟล์
- [ ] มี `.claude/settings.local.json` ตอนขั้น B (Teams = 1, MAX_TURNS = 30) แล้ว**ลบแล้ว**ก่อนรีวิว
- [ ] เพื่อนทีมชื่อ `data`, `backend`, `frontend` และ prompt บังคับคุยกันอย่างน้อย 5 ครั้ง
- [ ] มี `docs/DESIGN.md`, `docs/REVIEW.md`, `scripts/clean-export.sql`
- [ ] หน้าเว็บโชว์ยอดจริง (16,772 / 45,341,868,784)
- [ ] quality gate 2/6
- [ ] `git diff -- scripts/quality-gate.js` ว่าง

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| `Agent type not found` | ยังไม่รีสตาร์ทหลังสร้างไฟล์เอเจนต์ | ปิดแล้วเปิด `claude` ใหม่ |
| ได้แค่ Explore ไม่มี teammate ชื่อ | ยังไม่มี settings หรือเปิด `claude` ก่อน Save | ตรวจไฟล์ → เปิดใหม่ → สั่งชัดว่า agent team |
| ใช้ `claude -p` แล้วไม่มีทีม | โหมดทีมต้องใช้หน้าจอโต้ตอบ | ใช้ `claude` อย่างเดียว |
| หมดรอบกลางคัน | งานลงมือยาว | ตรวจว่า MAX_TURNS เป็น `"30"` · Save แล้วเปิดใหม่ |
| `Stop Task` / `No task found with ID: data` (หรือ backend/frontend) | หัวหน้าสับสน **ชื่อเพื่อนทีม** กับ **รหัสงานในรายการ** | ปกติเจอตอนปิดทีม · ถ้ามี DESIGN/SQL/แก้ไฟล์ครบแล้วไปต่อได้ · รอบหน้าให้สั่ง shut down ทีละชื่อเพื่อน ไม่ใช่ Stop Task ด้วยชื่อนั้น |
| หน้าเว็บยังของเดิม | ยังไม่รัน SQL | รันขั้น 9 ซ้ำ |
| แล็บหลังยังเป็นทีมใหญ่เอง | ลืมลบ `settings.local.json` | ลบไฟล์แล้วเปิด `claude` ใหม่ |
| port busy | เซิร์ฟเวอร์ค้าง | ปิดก่อนรัน gate หรือตั้ง `PORT` |

## 🆘 Behind? Catch up

```bash
node scripts/catch-up.js w3
```

ได้ `docs/DESIGN.md`, `docs/REVIEW.md`, `scripts/clean-export.sql` และ `data/dataset.csv` ฉบับสะอาด

## Stretch / ต่อยอด

หลังลบ settings แล้ว สั่ง planner เพิ่ม task เรื่อง BOM ใน CSV แล้วให้ `@developer` ทำตาม — ซ้อม handoff ต่อคิวโดยไม่เปิดโหมดทีม

## Solution → solutions/w3/

ตรวจด้วย `node solutions/w3/check.js` (จาก course repo) ยอดอ้างอิงหลังสะอาดคือ 16,772 กิจการ และ 45,341,868,784 บาท
