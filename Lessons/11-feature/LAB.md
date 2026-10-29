# Workshop 8 — Feature ของคุณ (vibe code ด้วยทีม)

> ⏱ machine 45–60 นาที · Start state: อยู่ใน workshop repo · quality gate 6/6 exit 0 · hook + cost gate พร้อมจาก Workshop 7 · agents ครบ (อย่างน้อย planner, developer, qa)

## Goal / เป้าหมาย

feature ใหม่ที่**คุณเลือกจากเมนู 5 แบบ** (หรือประโยคเองในกรอบเดียวกัน) ถูกสร้างด้วยทีม agents แบบมี handoff ชัด แล้วพร้อมไป Capstone / deploy — vibe coding ตามสเปกของคุณ ไม่ใช่แก้ของคนอื่น

## เกณฑ์กำกับ (ตรวจทุกข้อก่อนเรียกว่าเสร็จ)

1. **Deploy ได้จริง** — feature อยู่ใน build ที่ขึ้น Vercel (Module 13) และเปิดได้จาก URL จริง
2. **Quality gate ยังเขียว** — `npm run gate` ยัง exit 0 หลัง feature เข้าโค้ด
3. **ใช้ agents อย่างน้อย 2 ตัว แบบมี handoff** — ตัวหนึ่งวางแผน/วิเคราะห์เป็นไฟล์ อีกตัวทำตามไฟล์นั้น (ห้ามคุยกันในแชทล้วน)
4. **ไม่แตะของต้องห้าม** — ห้ามพิมพ์ค่าที่ขึ้นต้นด้วย `sk-` ห้ามแก้ `scripts/quality-gate.js` และห้ามเพิ่ม dependency (Node ล้วน)

เฉพาะฉบับเต็ม: `solutions/w8/FEATURE-CRITERIA.md` (ตรวจด้วย `node solutions/w8/check.js`)

## เลือก Feature — เมนู 5 แบบ (เลือก 1)

ข้อมูลจริง query ได้หลายมุม — เลือก**หนึ่งรหัส**แล้วคัดลอกประโยค `<FEATURE>` ไปใช้ใน prompt

| รหัส | ชื่อ | ประโยค `<FEATURE>` ที่แนะนำ (คัดลอกได้) |
|---|---|---|
| **A** ★ | ตารางจังหวัดแบบโต้ตอบ | `an interactive provinces table: search by province name, sortable columns for company count and capital, and a 10/20/all row selector` |
| **B** | Top ทุนจดทะเบียน | `a Top capital table showing the highest-capital companies with a control to switch between top 10 and top 20` |
| **C** | เปรียบเทียบรายเดือน | `month comparison cards or bars for jan/feb/jun showing company count and total capital side by side` |
| **D** | ค้นหาตามวัตถุประสงค์ | `an objective keyword search box that lists matching companies with name and capital from the cleaned dataset` |
| **E** | Export CSV ตามตัวกรอง | `a Download CSV button that exports the current province (or region) summary visible on the page` |

★ **A แนะนำ** ถ้าจะเข้า Capstone แบบสเปกตารางจังหวัดต่อได้ลื่น

ภาษาไทยสำหรับเขียนลงกระดาษ (ถ้าต้องการ):

| รหัส | ประโยคไทยสั้น ๆ |
|---|---|
| A | ตารางจังหวัด ค้นหาได้ เรียงคอลัมน์ได้ เลือกแถว 10/20/ทั้งหมด |
| B | ตารางกิจการทุนสูงสุด สลับ Top 10 / Top 20 ได้ |
| C | เปรียบเทียบ ม.ค. ก.พ. มิ.ย. ทั้งจำนวนกิจการและทุน |
| D | ช่องค้นหาคำในวัตถุประสงค์ แล้วโชว์รายชื่อกิจการ |
| E | ปุ่มดาวน์โหลด CSV ของสรุปจังหวัด/ภาคที่เห็นบนหน้า |

จดรหัสที่เลือกไว้ในแชทหรือกระดาษก่อนขั้นถัดไป: `รหัส = ___`

## Steps / ขั้นตอน

1. เลือกหนึ่งรหัสจากตารางด้านบน แล้วตั้งค่า `<FEATURE>` = ประโยคในคอลัมน์อังกฤษ (หรือประโยคไทยที่ความหมายเดียวกัน)

2. สั่ง planner วางแผน (เลือกอย่างใดอย่างหนึ่ง) — แทน `<FEATURE>` ด้วยประโยคของคุณ:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@planner We are adding a new feature: <FEATURE>. Read docs/PRODUCT-SPEC.md, data/README.md, and the current web/ files, then write docs/FEATURE-PLAN.md: the exact files to create or edit, the endpoint contract if any, the UI changes, and the acceptance checks. Do not write code. Keep scope under about 60 minutes.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@planner เราจะเพิ่ม feature ใหม่: <FEATURE> อ่าน docs/PRODUCT-SPEC.md data/README.md และไฟล์ใน web/ ที่มีอยู่ แล้วเขียน docs/FEATURE-PLAN.md: ไฟล์ไหนต้องสร้างหรือแก้ endpoint contract ถ้ามี การเปลี่ยนหน้าเว็บ และเกณฑ์ตรวจรับ ห้ามเขียนโค้ด จำกัดขอบเขตให้อยู่ในงานประมาณ 60 นาที
```

📦 **Handoff ที่ 1:** `docs/FEATURE-PLAN.md` — สเปกของคุณฉบับทำงานได้

3. สั่ง developer ทำตามแผน (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@developer Implement docs/FEATURE-PLAN.md exactly. Node only, no dependencies. Keep GET /api/summary, /api/health and /api/notes contracts unchanged. After coding, run npm run gate yourself and report the exit code.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@developer ทำตาม docs/FEATURE-PLAN.md เป๊ะ Node ล้วน ไม่มี dependency คง contract ของ GET /api/summary, /api/health และ /api/notes เดิมไว้ หลังเขียนโค้ดเสร็จ รัน npm run gate เองแล้วรายงาน exit code
```

📦 **Handoff ที่ 2:** แผน → โค้ด + ผล gate ที่ developer รันเอง

4. **ตรวจด้วยมือคุณเอง** — เปิดหน้าเว็บดู feature ทำงานจริง แล้วรัน gate

```powershell
npm run gate
```

ผลที่คาดหวัง: ยัง `6/6 passed` exit 0 — ถ้าแดง อย่าไปต่อ สั่ง developer แก้ก่อน

5. สั่ง qa ตรวจรับ feature (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@qa Verify the new feature: <FEATURE>. Check the UI works with real requests, the gate is still 6/6, and nothing prints sk-. Append the result to docs/QA-REPORT.md as a new section. Name the section with the feature code if known (A-E).
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@qa ตรวจรับ feature ใหม่: <FEATURE> ตรวจว่าหน้าเว็บทำงานจริง gate ยัง 6/6 และไม่มีอะไรพิมพ์ sk- แล้ว append ผลเข้า docs/QA-REPORT.md เป็นหัวข้อใหม่ ระบุรหัส A-E ถ้ามี
```

📦 **Handoff ที่ 3:** QA-REPORT.md มีบันทึกรับรอง feature — ของที่จะโชว์ใน Capstone และ deploy

## ✅ Checkpoint

- [ ] เลือกแล้วหนึ่งรหัส (A–E) หรือประโยคเทียบเท่า
- [ ] `docs/FEATURE-PLAN.md` เขียนโดย planner และ developer อ้างถึงมัน
- [ ] feature ทำงานจริงบนหน้าเว็บ (ไม่ใช่แค่โค้ดอยู่)
- [ ] quality gate ยัง 6/6 exit 0
- [ ] `docs/QA-REPORT.md` มีหัวข้อรับรอง feature
- [ ] ใช้ agents ≥2 ตัวพร้อมไฟล์ handoff จริง

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| feature ใหญ่เกินจนไม่จบในชั่วโมง | เลือกโตไป / ผสมหลายรหัส | ตัดเหลือหนึ่งรหัส · ทำแสดงผลก่อน เก็บส่วนเสริมไว้ Stretch |
| gate แดงหลัง developer แก้ | แตะ contract เดิม | สั่ง developer "revert the endpoint change, keep the UI part" |
| planner วางแผนเกินจริง | ไม่ได้บอกขอบเขตเวลา | เติม "keep it under 60 minutes of work" ใน prompt |
| หน้าเว็บไม่รีเฟรช | browser cache | Ctrl+F5 |
| ไม่รู้จะเลือกอะไร | มองเมนูยาว | เลือก **A** แล้วไปต่อ |

## 🆘 Behind? Catch up

แล็บนี้เป็นของคุณเอง — ถ้าต้องการจุดเริ่ม ให้ catch-up จน gate เขียว แล้วเลือก **A** (ตารางจังหวัด) จากเมนู

## Stretch / ต่อยอด

เพิ่มของเล็กจากรหัสอื่นที่**ต่อยอดของเดิม** (เช่น เลือก A แล้ว Stretch ด้วย E = export CSV จากตารางจังหวัด) — ซ้อม handoff วงจรเดิมให้ไวขึ้น อย่าเริ่มสองรหัสขนานกันตั้งแต่ต้น

## Solution → solutions/w8/

เกณฑ์และขั้นต่ำอยู่ที่ `solutions/w8/FEATURE-CRITERIA.md` — ตรวจเกณฑ์ครบด้วย `node solutions/w8/check.js` (จาก course repo)
