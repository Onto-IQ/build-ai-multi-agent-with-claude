# Workshop 4 — แก้สามปมด้วย QA handoff

> ⏱ machine ~12 นาที (รอบ A) + ~3–5 นาที (รอบ B ถ้าทำ) · Start state: quality gate 2/6 (เหลือ `bad-json-does-not-crash`, `health-no-secrets`, `notes-validation`, `notes-persists`) · มี planner + developer จาก Workshop 3

## Goal / เป้าหมาย

quality gate **6/6 exit 0** และ `POST /api/notes` บันทึกข้อมูลได้จริงโดยเซิร์ฟเวอร์ไม่ล้มและไม่รั่วของ — จบด้วยวงจร handoff ครบรอบ: qa รายงาน → developer แก้ → qa ตรวจซ้ำ

> 📚 **รอบ A แล้วค่อยรอบ B:** รอบ A คุณกดทีละจังหวะเพื่อเห็นสัญญาบนดิสก์ · รอบ B encode สัญญาเดิมเป็น conductor prompt ให้เครื่องวิ่งซ้ำ (ยังหยุดให้คุณรัน gate) — ตอบข้อโต้แย้ง “ให้คนเป็น orchestrator ไม่ practical”: practical คือถือสัญญา ไม่ใช่พิมพ์แชทแทนเอเจนต์ทุกประโยค

## สังเกต handoff (วงจรปิด)

| จาก | ไฟล์/หลักฐาน | ถึง |
|---|---|---|
| Workshop 3 (backend ยังไม่จบครบ) | `server.js` ที่ยัง crash รั่ว token เก็บโน้ตในหน่วยความจำ | qa สืบสวน |
| qa | `docs/QA-REPORT.md` (3 findings) | developer แก้ตามรายงาน |
| developer (แก้) | `server.js` ใหม่ | qa ตรวจซ้ำ + คุณรัน gate |

## Steps / ขั้นตอน — รอบ A (บังคับ)

1. ดูของแดงก่อนแก้ — รัน gate แล้วจดบรรทัด FAIL ทั้งสี่

```powershell
npm run gate
```

ผลที่คาดหวัง: `FAIL | bad-json-does-not-crash`, `FAIL | health-no-secrets`, `FAIL | notes-validation`, `FAIL | notes-persists`

2. สร้างเอเจนต์ qa ใน TUI (เลือกอย่างใดอย่างหนึ่ง) แล้วกดอนุญาต

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
In this folder, create .claude/agents/qa.md.
Frontmatter: name qa; description "Use when implementation claims to be done. Reproduces the bug, writes the QA report, and re-verifies after the fix"; tools Read, Grep, Glob, Bash; model sonnet.
Body: you are QA. You reproduce bugs with real requests before writing anything. You write docs/QA-REPORT.md with findings citing server.js:line and the exact reproduction. After a fix, you re-run the same reproduction and append the result. You never modify server.js or data/dataset.csv.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ในโฟลเดอร์นี้ สร้าง .claude/agents/qa.md
frontmatter: name เป็น qa; description ว่า Use when implementation claims to be done. Reproduces the bug, writes the QA report, and re-verifies after the fix; tools เป็น Read, Grep, Glob, Bash; model เป็น sonnet
เนื้อหา: คุณคือ QA ต้องรีโปรดิวส์บั๊กด้วย request จริงก่อนเขียนอะไร เขียน docs/QA-REPORT.md ระบุ finding พร้อม server.js:บรรทัด และวิธีรีโปรดิวส์ หลังมีการแก้ ให้รันรีโปรดิวส์เดิมซ้ำแล้ว append ผล ห้ามแก้ server.js หรือ data/dataset.csv
```

3. **ปิด TUI แล้วเปิด `claude` ใหม่** — กฎเดิม: เอเจนต์ใหม่โหลดตอนเซสชันเริ่ม

4. สั่ง qa สืบสวน (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@qa Four quality gate cases still fail: bad-json-does-not-crash, health-no-secrets, notes-validation, notes-persists. Reproduce each with real requests, find the root causes in server.js, and write docs/QA-REPORT.md with three findings (crash, token leak, notes not validated or persisted), each citing server.js:line and the exact reproduction. Do not fix anything.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@qa เคส quality gate ยังแดงสี่เคส: bad-json-does-not-crash, health-no-secrets, notes-validation, notes-persists รีโปรดิวส์ทีละเคสด้วย request จริง หา root cause ใน server.js แล้วเขียน docs/QA-REPORT.md สาม findings (crash, token รั่ว, โน้ตไม่ถูกตรวจและไม่ถูกเก็บ) ทุก finding อ้าง server.js:บรรทัด และวิธีรีโปรดิวส์ ห้ามแก้อะไร
```

📦 **Handoff ที่ 1:** `docs/QA-REPORT.md` สาม findings — ของที่ qa ส่งต่อให้ developer

5. สั่ง developer แก้ตามรายงาน (เลือกอย่างใดอย่างหนึ่ง) — กดอนุญาตเมื่อแก้ `server.js`

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@developer Read docs/QA-REPORT.md and fix exactly the three findings: make POST /api/notes answer 400 { error: 'INVALID_JSON' } for a non-JSON or non-object body, answer 400 { error: 'INVALID_TEXT' } when text is missing or empty, persist every note to data/notes.json and add GET /api/notes returning the stored notes, and make /api/health return { ok: true } with no token of any shape. Keep everything else unchanged. Do not touch scripts/quality-gate.js.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@developer อ่าน docs/QA-REPORT.md แล้วแก้เฉพาะสาม findings: POST /api/notes ด้วยของที่ไม่ใช่ JSON หรือไม่ใช่ object ต้องตอบ 400 { error: 'INVALID_JSON' }, ขาด text หรือ text ว่างต้องตอบ 400 { error: 'INVALID_TEXT' }, เก็บทุกโน้ตลง data/notes.json และเพิ่ม GET /api/notes คืนโน้ตที่เก็บไว้, และ /api/health ตอบ { ok: true } ไม่มี token รูปแบบใด อย่าเปลี่ยนอย่างอื่น ห้ามแตะ scripts/quality-gate.js
```

📦 **Handoff ที่ 2:** รายงาน → โค้ดที่แก้แล้ว

6. รัน gate ด้วยมือคุณเอง — **6/6 exit 0**

```powershell
npm run gate
```

ผลที่คาดหวัง: `quality gate: 6/6 passed` และ exit 0 — เว็บใช้งานได้ครบทั้งโชว์ยอดและบันทึกจริง (โน้ตอยู่รอดแม้รีสตาร์ทเซิร์ฟเวอร์)

7. ปิดวงจร: สั่ง qa ตรวจซ้ำ (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@qa Re-run the reproduction from docs/QA-REPORT.md against the fixed server and append the result to the report as "Evidence after fix".
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@qa รันรีโปรดิวส์ใน docs/QA-REPORT.md ซ้ำกับ server ตัวที่แก้แล้ว แล้ว append ผลเข้ารายงานในหัวข้อ Evidence after fix
```

📦 **Handoff ปิดวงจร:** รายงานเดียวกันมีทั้ง finding และหลักฐานหลังแก้ — โยงไปหา Module 13 ตอน deploy

## Steps / ขั้นตอน — รอบ B (สั้น · encode สัญญาเดิม)

ทำหลังรอบ A ผ่านแล้ว · หรือใช้จับภาพ conductor หลัง catch-up (โฟกัสจุดหยุดก่อน gate และห้ามเปิด Teams)

1. **ยังไม่เปิด** `settings.local.json` / Agent Teams — ใช้ specialty agent อย่างเดียว
2. วาง conductor prompt (เลือกอย่างใดอย่างหนึ่ง) แล้วกดอนุญาตเมื่อถูกถาม

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Run the QA fix cycle using specialty agents only (no Agent Teams).
1) Invoke @qa — reproduce the four red gate cases (bad-json-does-not-crash, health-no-secrets, notes-validation, notes-persists); write docs/QA-REPORT.md with three findings citing server.js:line and the exact reproduction; do not edit server.js or quality-gate.js.
2) Invoke @developer — read that report and fix exactly those findings; do not touch scripts/quality-gate.js.
3) Stop. Tell me to run: npm run gate
Do not claim the gate passed until I paste the gate output. After I confirm 6/6, invoke @qa to append "Evidence after fix" to the same QA-REPORT.md.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
รันวงจรแก้ด้วย QA โดยใช้ specialty agent อย่างเดียว (ห้ามเปิด Agent Teams)
1) เรียก @qa — รีโปรดิวส์สี่เคสแดง (bad-json-does-not-crash, health-no-secrets, notes-validation, notes-persists) แล้วเขียน docs/QA-REPORT.md สาม findings อ้าง server.js:บรรทัด และวิธีรีโปรดิวส์ ห้ามแก้ server.js หรือ quality-gate.js
2) เรียก @developer — อ่านรายงานนั้นแล้วแก้เฉพาะ findings ห้ามแตะ scripts/quality-gate.js
3) หยุด แล้วบอกให้ฉันรัน: npm run gate
ห้ามประกาศว่า gate ผ่านจนกว่าฉันจะวางผล gate มา หลังฉันยืนยัน 6/6 ให้เรียก @qa append หัวข้อ Evidence after fix ใน QA-REPORT.md ไฟล์เดิม
```

3. เมื่อเอเจนต์หยุด — รัน gate เอง วางผลกลับในแชท แล้วให้ขั้น Evidence เดินต่อ

```powershell
npm run gate
```

📦 **จุดสอนรอบ B:** orchestrator ไม่หาย — ย้ายจากนิ้วคุณไปเป็น conductor prompt ที่วิ่ง**สัญญาเดิม** และยังมีจุดหยุดให้คนปิดด้วย gate

## ✅ Checkpoint

- [ ] `docs/QA-REPORT.md` มีสาม findings + `server.js:บรรทัด` + วิธีรีโปรดิวส์ + ผลหลังแก้
- [ ] quality gate 6/6 exit 0 โดยไม่ได้แก้ `scripts/quality-gate.js`
- [ ] `POST /api/notes` ด้วยของที่ไม่ใช่ JSON ได้ 400 และเซิร์ฟเวอร์ไม่ล้ม
- [ ] โน้ตที่บันทึกอยู่รอดจากการรีสตาร์ทเซิร์ฟเวอร์ (เก็บลง `data/notes.json`)
- [ ] `/api/health` ไม่มี `sk-` หรือ token รูปแบบใด
- [ ] `.claude/agents/` มี qa.md ที่มี Bash ใน tools
- [ ] (รอบ B ถ้าทำ) conductor หยุดก่อน gate · ไม่ได้เปิด Agent Teams · Evidence อยู่ไฟล์เดิม
- [ ] จบวันที่ 1: เว็บโชว์ยอดจริง + บันทึกได้จริง

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| qa เขียนรายงานแต่ไม่รีโปรดิวส์จริง | ไม่ได้สั่งให้ทดสอบก่อน | เติม "reproduce with a real POST first" ใน prompt |
| developer แก้เกินขอบเขต | ไม่ได้กำหนดขอบเขต | สั่งซ้ำว่า "fix exactly the finding, nothing else" |
| port busy ตอนรัน gate | เซิร์ฟเวอร์ที่ qa ทดสอบยังค้าง | ปิดก่อนรัน gate หรือตั้ง `PORT` |
| gate ยัง 2/6 | แก้แล้วแต่ไม่ได้ปิดเซิร์ฟเวอร์เก่าก่อนรัน gate | ปิด `npm start` แล้วรัน gate ใหม่ |
| เคส notes-persists ยังแดง | เก็บโน้ตในตัวแปร ไม่ได้ลงไฟล์ | ชี้ finding ที่ 3 ใน QA-REPORT แล้วสั่ง developer แก้ต่อ |
| `Agent type not found` | ยังไม่ได้รีสตาร์ท TUI | ปิดแล้วเปิดใหม่ |
| รอบ B ประกาศผ่านก่อนมีผล gate | prompt ไม่บังคับจุดหยุด | ย้ำ "Stop. Tell me to run npm run gate" แล้ววางผลเอง |
| รอบ B เปิด Teammate เอง | สับสนกับ Workshop 3 | สั่งซ้ำ "specialty agents only · no Agent Teams" |

## 🆘 Behind? Catch up

จาก course repo (ไฟล์ถูก copy ลง workshop repo):

```bash
node scripts/catch-up.js w4
```

ได้ `server.js` ฉบับแก้แล้ว พร้อมตัวอย่าง `docs/QA-REPORT.md` และเอเจนต์ qa อ้างอิง

## Stretch / ต่อยอด

- รอบ B ด้านบน (conductor prompt) — ซ้อม encode สัญญาหลังรอบ A
- สั่ง qa เพิ่ม finding ที่สี่จากการสำรวจใน Workshop 1 (เช่น พฤติกรรม 404 หรือ method แปลก) ลงใน QA-REPORT เดิม — ไว้ให้ Workshop 7 ใช้ต่อ

## Solution → solutions/w4/

ตรวจด้วย `node solutions/w4/check.js` (จาก course repo — สคริปต์ copy แอปจาก workshop repo ผสมฉบับ drop-in ไปทดสอบในโฟลเดอร์ชั่วคราวเอง)
