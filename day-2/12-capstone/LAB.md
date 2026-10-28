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
Frontmatter: name writer; description "Use when figures must become a Thai executive summary"; tools Read, Grep, Glob, Write; model sonnet.
Body: you are the writer. You write docs/EXECUTIVE-SUMMARY.md in Thai using only figures from the API or from another agent's report. You never invent a number. Keep file names and endpoint names in English.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ในโฟลเดอร์นี้ สร้าง .claude/agents/writer.md
frontmatter: name เป็น writer; description ว่า Use when figures must become a Thai executive summary; tools เป็น Read, Grep, Glob, Write; model เป็น sonnet
เนื้อหา: คุณคือ writer เขียน docs/EXECUTIVE-SUMMARY.md เป็นไทยโดยใช้ตัวเลขจาก API หรือจากรายงานของเอเจนต์อีกตัวเท่านั้น ห้ามเดาตัวเลข ชื่อไฟล์กับ endpoint คงภาษาอังกฤษ
```

3. **ปิด TUI แล้วเปิด `claude` ใหม่** — คราวนี้ `.claude/agents/` ครบ 6 ตัวโหลดพร้อมกัน: planner, data-researcher, developer, qa, release-manager, writer

4. วาง prompt ทีมเต็มวง (เลือกอย่างใดอย่างหนึ่ง) — กดอนุญาตตามที่ทีมขอ:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Build the final Registry Insight release with your existing agent team: planner, data-researcher, developer, qa, writer (they are in .claude/agents/).
planner first: verify docs/PRODUCT-SPEC.md still matches the app, and update docs/TASKS.md to include the Workshop 8 feature as a task that must survive the release.
data-researcher: report company count and total capital from data/dataset.csv (or via the data-duckdb MCP).
developer and qa may run only after planner finishes. developer upgrades the dashboard pages for release. qa runs npm run gate and checks /api/health has no sk-.
writer last: creates docs/EXECUTIVE-SUMMARY.md in Thai using only figures from the API or docs/region-capital.csv, and mentions the Workshop 8 feature.
Agents that need another agent's output must NOT run before it.
Report under 400 words and name each deliverable.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
สร้าง release ฉบับสุดท้ายของ Registry Insight ด้วยทีมเอเจนต์ที่มีอยู่: planner data-researcher developer qa writer (อยู่ใน .claude/agents/)
planner เริ่มก่อน: ตรวจว่า docs/PRODUCT-SPEC.md ยังตรงกับแอป และอัปเดต docs/TASKS.md ให้มี feature จาก Workshop 8 เป็นงานที่ต้องรอดถึง release
data-researcher: รายงานจำนวนกิจการและทุนรวมจาก data/dataset.csv (หรือผ่าน MCP data-duckdb)
developer กับ qa ทำงานได้หลัง planner เสร็จเท่านั้น developer อัปเกรดหน้าแดชบอร์ดเป็นฉบับ release qa รัน npm run gate และตรวจว่า /api/health ไม่มี sk-
writer ปิดท้าย: เขียน docs/EXECUTIVE-SUMMARY.md เป็นไทย ใช้ตัวเลขจาก API หรือ docs/region-capital.csv เท่านั้น และพูดถึง feature จาก Workshop 8
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
| ยอดในสรุปไม่ตรง API | writer ไม่ได้อ่าน JSON | สั่ง qa ส่งยอดจาก `/api/summary` กลับไปให้ writer แก้ |
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
