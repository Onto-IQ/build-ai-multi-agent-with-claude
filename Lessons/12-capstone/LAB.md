# Workshop 9 — แดชบอร์ดและสรุปผู้บริหาร ด้วยทีมเต็มวง

> ⏱ machine ~15 นาที · Start state: อยู่ใน workshop repo · quality gate exit 0 · feature จาก Workshop 8 อยู่ในโค้ด · agents 5 ตัวใน `.claude/agents/`

## Goal / เป้าหมาย

ทีม 5 บทบาทที่ใช้เอเจนต์ไฟล์จริง (ไม่ใช่แจกงานแบบ ad-hoc) ส่งแดชบอร์ดฉบับ release พร้อมสรุปผู้บริหารที่ยอดตรง API และ**ยืนยันว่า feature ของคุณจาก Workshop 8 รอดจนถึงรอบ release**

## สังเกต handoff (สายส่งงานเต็มสาย)

| จาก | ไฟล์ | ถึง |
|---|---|---|
| Workshop 8 | `docs/FEATURE-PLAN.md` + `docs/QA-REPORT.md` | ทีมทั้งหมด (สเปก + สิ่งที่ต้องไม่พัง) |
| planner | `docs/TASKS.md` ฉบับ release | developer + writer |
| data-researcher | ตัวเลขกิจการ/ทุน | writer |
| developer | `web/` + endpoints | qa |
| qa | ผล gate + feature check | writer ปิดท้าย |
| writer | `docs/EXECUTIVE-SUMMARY.md` | คุณ + Module 13 |

## Steps / ขั้นตอน

1. จุดเทียบก่อนตั้งทีม

```powershell
npm run gate
```

ผลที่คาดหวัง: exit 0 ถ้ายังแดง ให้กลับ Workshop 7 หรือใช้ catch-up `w9`

> 📚 **รู้เพิ่ม:** ทีมห้าตัวที่วิ่งบนของแดง จะสร้างของเสียสองชั้น — งานที่ทำไปกับข้อมูลเสีย และงานที่ต้องทำใหม่ ตรวจ gate ก่อนตั้งทีมจึงไม่ใช่พิธีกรรม

2. สร้าง **writer** — เอเจนต์ตัวที่ 6 ตัวสุดท้าย (เลือกอย่างใดอย่างหนึ่ง) แล้วกดอนุญาต:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
In this folder, create .claude/agents/writer.md.
Frontmatter: name writer; description "Use when figures must become a Thai executive summary"; tools Read, Grep, Glob, Write, Bash; model sonnet.
Body: you are the writer. You write docs/EXECUTIVE-SUMMARY.md in Thai. Prefer figures from handoff files written by other agents (docs/QA-REPORT.md, docs/region-capital.csv, data-researcher notes, or a short figures file from qa / release-manager). Do not invent numbers. If you must re-check a live endpoint and the machine is Windows, use PowerShell via Bash tool, for example: powershell -NoProfile -Command "Invoke-RestMethod http://127.0.0.1:3000/api/summary | ConvertTo-Json -Compress" — only when the server is already running; do not start long-lived servers yourself. Keep file names and endpoint names in English. Never edit server.js, web/, or scripts/quality-gate.js.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ในโฟลเดอร์นี้ สร้าง .claude/agents/writer.md
frontmatter: name เป็น writer; description ว่า Use when figures must become a Thai executive summary; tools เป็น Read, Grep, Glob, Write, Bash; model เป็น sonnet
เนื้อหา: คุณคือ writer เขียน docs/EXECUTIVE-SUMMARY.md เป็นไทย ยึดตัวเลขจากไฟล์ handoff ของเอเจนต์อื่นก่อน (docs/QA-REPORT.md, docs/region-capital.csv, โน้ต data-researcher หรือไฟล์ยอดสั้นจาก qa / release-manager) ห้ามเดาตัวเลข ถ้าต้องเช็ก endpoint สดและเครื่องเป็น Windows ให้ใช้ PowerShell ผ่านเครื่องมือ Bash เช่น powershell -NoProfile -Command "Invoke-RestMethod http://127.0.0.1:3000/api/summary | ConvertTo-Json -Compress" — เฉพาะเมื่อเซิร์ฟเวอร์เปิดอยู่แล้ว ห้ามสตาร์ทเซิร์ฟเวอร์ค้างเอง ชื่อไฟล์กับ endpoint คงภาษาอังกฤษ ห้ามแก้ server.js, web/, หรือ scripts/quality-gate.js
```

> 📚 **รู้เพิ่ม:** เดิมถ้า writer ไม่มี Bash จะเรียก API เองไม่ได้ ตัวเลขต้องมาจากรายงาน/ไฟล์ที่ qa · data-researcher · release-manager ส่งต่อเท่านั้น — รอบนี้ใส่ **Bash** แล้วให้ใช้ PowerShell บน Windows เมื่อจำเป็น แต่**ยังให้ยึดไฟล์ handoff เป็นค่าเริ่ม** เพื่อไม่ให้สรุปคนละชุดกับของที่ทีมตรวจแล้ว

3. **โหลดเอเจนต์ใหม่** — ทำอย่างใดอย่างหนึ่งแล้วค่อยเรียก `@writer`:
   - ปิด TUI แล้วเปิด `claude` ใหม่จาก workshop repo หรือ
   - ในเซสชันเดิมเปิดเมนู `/agents` ให้ระบบเห็นไฟล์ใหม่

   คราวนี้ `.claude/agents/` ควรครบ 6 ตัว: planner, data-researcher, developer, qa, release-manager, writer

4. วาง prompt ทีมเต็มวง (เลือกอย่างใดอย่างหนึ่ง) — กดอนุญาตตามที่ทีมขอ:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Build the final Registry Insight release with your existing agent team: planner, data-researcher, developer, qa, writer (they are in .claude/agents/).
planner first: verify docs/PRODUCT-SPEC.md still matches the app, and update docs/TASKS.md to include the Workshop 8 feature as a task that must survive the release.
data-researcher: report company count and total capital from data/dataset.csv (or via the data-duckdb MCP).
developer and qa may run only after planner finishes. developer builds the release dashboard exactly as docs/PRODUCT-SPEC.md describes: 4 KPI cards, an SVG monthly capital chart from a new GET /api/monthly with a bar/line toggle, region bars, the Workshop 8 provinces table with search, sortable columns and a 10/20/all row selector, and a notes panel over the notes API. qa runs npm run gate and checks /api/health has no sk-.
writer last: creates docs/EXECUTIVE-SUMMARY.md in Thai using figures from handoff files first (QA-REPORT, region-capital.csv, researcher/qa notes); if needed on Windows, re-check /api/summary with PowerShell via Bash. Mentions the Workshop 8 feature. Never invent numbers.
Agents that need another agent's output must NOT run before it.
Report under 400 words and name each deliverable.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
สร้าง release ฉบับสุดท้ายของ Registry Insight ด้วยทีมเอเจนต์ที่มีอยู่: planner data-researcher developer qa writer (อยู่ใน .claude/agents/)
planner เริ่มก่อน: ตรวจว่า docs/PRODUCT-SPEC.md ยังตรงกับแอป และอัปเดต docs/TASKS.md ให้มี feature จาก Workshop 8 เป็นงานที่ต้องรอดถึง release
data-researcher: รายงานจำนวนกิจการและทุนรวมจาก data/dataset.csv (หรือผ่าน MCP data-duckdb)
developer กับ qa ทำงานได้หลัง planner เสร็จเท่านั้น developer สร้างแดชบอร์ดฉบับ release ตาม docs/PRODUCT-SPEC.md เป๊ะ: การ์ด KPI 4 ใบ กราฟแท่งทุนรายเดือน SVG จาก GET /api/monthly ใหม่ที่สลับแท่ง/เส้นได้ แท่งรายภาค ตารางจังหวัดจาก feature Workshop 8 ที่ค้นหา จัดเรียง และเลือกจำนวนแถวได้ และแผงโน้ตบน notes API qa รัน npm run gate และตรวจว่า /api/health ไม่มี sk-
writer ปิดท้าย: เขียน docs/EXECUTIVE-SUMMARY.md เป็นไทย ใช้ตัวเลขจากไฟล์ handoff ก่อน (QA-REPORT, region-capital.csv, โน้ต researcher/qa) ถ้าจำเป็นบน Windows ค่อยเช็ก /api/summary ด้วย PowerShell ผ่าน Bash พูดถึง feature จาก Workshop 8 ห้ามเดาตัวเลข
งานที่ต้องใช้ผลของอีกตัว ห้ามรันก่อนตัวนั้นเสร็จ
รายงานรวมไม่เกิน 400 คำ และระบุของส่งของแต่ละบทบาท
```

ผลที่คาดหวัง: มีไฟล์บทบาทครบ 6 ตัว แดชบอร์ดฉบับ release `docs/EXECUTIVE-SUMMARY.md` เป็นไทย และรายงานที่ระบุว่า feature ของคุณรอดมาถึง release

5. ปิดเซิร์ฟเวอร์เก่า เปิดของใหม่ เปิด `http://127.0.0.1:3000` — เห็นจำนวนกิจการ ทุนรวม ภาคนำ และ feature ของคุณ จากนั้น Ctrl+C

6. รัน gate ซ้ำหลังปิดเซิร์ฟเวอร์ และเปิด `docs/EXECUTIVE-SUMMARY.md` เทียบยอดกับ JSON

```powershell
npm run gate
```

ผลที่คาดหวัง: ยัง exit 0 และตัวเลขในสรุปตรงกับ `totalRevenue`

> 📚 **รู้เพิ่ม:** เลขคนละชุดระหว่างสรุปผู้บริหารกับ API คือของเสียชิ้นใหญ่ที่สุดของงานแบบนี้ — เทียบกับ `totalRevenue` ทุกครั้งก่อนส่ง

## ✅ Checkpoint

- [ ] `.claude/agents/` ครบ 6 ตัว ทุกไฟล์มี `name` กับ `tools`
- [ ] TASKS ฉบับ release มี feature จาก Workshop 8 เป็นงานที่ต้องรอด
- [ ] หน้า `/` โหลด `/api/summary` และโชว์ feature ของคุณ
- [ ] `/api/health` ไม่มี `sk-`
- [ ] quality gate exit 0
- [ ] สรุปผู้บริหารเป็นไทย ไม่มียอดคนละชุด

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ทีมจบแต่ไฟล์ไม่เกิด | เป็นแผน ไม่ได้สั่งให้ทำ | เติม Execute, do not only plan |
| หมดเทิร์นกลางสเปก | งานยาว | อยู่ใน TUI และสั่งว่าห้ามสำรวจซ้ำ |
| feature หายจากหน้าเว็บหลังทีมทำงาน | ไม่ได้ใส่ไว้ใน TASKS | สั่ง developer "restore the Workshop 8 feature per docs/FEATURE-PLAN.md" |
| ยอดในสรุปไม่ตรง API | writer ไม่ได้อ่าน handoff / ไม่เทียบ JSON | สั่ง qa เขียนยอดจาก `/api/summary` ลงไฟล์สั้น ๆ แล้วให้ writer อ่านไฟล์นั้น (หรือให้ writer รัน PowerShell Invoke-RestMethod แล้วเทียบ) |
| `Agent type not found: writer` | ยังไม่โหลดเอเจนต์ใหม่ | รีสตาร์ท `claude` หรือเปิด `/agents` แล้วเรียกใหม่ |
| งบ Pro หมด | ห้าตัวแพงประมาณ 15 เท่าของแชท | ยุบเหลือ planner, developer, qa |
| คิดเงินรายครั้ง | `ANTHROPIC_API_KEY` | unset ก่อนเปิด TUI |

## 🆘 Behind? Catch up

จาก course repo (ไฟล์ถูก copy ลง workshop repo):

```bash
node scripts/catch-up.js w9
```

ได้แดชบอร์ด สเปก สรุป เซิร์ฟเวอร์ฉบับผ่าน gate และเอเจนต์อ้างอิงครบ

## Stretch / ต่อยอด

สั่ง release-manager รัน release checklist กับฉบับนี้ — ผล PASS/FAIL เป็นของที่ Module 13 ใช้ต่อ

## Solution → solutions/w9/

ตรวจด้วย `node solutions/w9/check.js` (จาก course repo)
