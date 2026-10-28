# Workshop 5 — Skills & release-manager

> ⏱ machine ~8 นาที · Start state: อยู่ใน workshop repo หลัง Workshop 4 (quality gate 6/6) · มี planner, developer, qa, data-researcher แล้ว

## Goal / เป้าหมาย

มี `SKILL.md` ที่ถูกหยิบใช้เองเมื่อสั่งเตรียมปล่อยของ และมี `release-manager` เป็นเอเจนต์ตัวที่ 5 ที่ preload skill นี้ — จบแล็บ `.claude/agents/` มี 5 ตัว

## สังเกต handoff

| จาก | ไฟล์ | ถึง |
|---|---|---|
| คุณ (ความตั้งใจ "อยากปล่อยของ") | ประโยค trigger | skill ถูกหยิบเอง |
| skill | เช็กลิสต์สี่ขั้น | ผู้เรียน + release-manager |
| release-manager | ผลตรวจ PASS/FAIL | คุณ และ Module 13 ตอน deploy |

## Steps / ขั้นตอน

1. สร้าง skill ใน TUI (เลือกอย่างใดอย่างหนึ่ง) แล้วกดอนุญาต:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Create .claude/skills/release-checklist/SKILL.md.
Frontmatter: name release-checklist; description "Use before releasing the Registry Insight app".
Body: four checks — server boots, quality gate result is recorded, /api/health must not contain sk-, server is stopped before the gate.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
สร้าง .claude/skills/release-checklist/SKILL.md
frontmatter: name เป็น release-checklist และ description เป็นภาษาอังกฤษว่า Use before releasing the Registry Insight app
เนื้อหาเป็น 4 ขั้น: เซิร์ฟเวอร์ขึ้น, จดผล quality gate, /api/health ห้ามมี sk-, ปิดเซิร์ฟเวอร์ก่อนรัน `npm run gate`
```

ผลที่คาดหวัง: มีไฟล์ `.claude/skills/release-checklist/SKILL.md` frontmatter มี `name` กับ `description` อังกฤษ

> 📚 **รู้เพิ่ม:** `description` ต้องเป็นอังกฤษเพราะเป็นสิ่งที่ Claude ใช้จับคู่งานกับ skill — ประโยคที่คุณพิมพ์ต้องชนกับคำใน description ถึงจะถูกหยิบเอง

2. ทดสอบว่าถูกหยิบเอง — พิมพ์ใน TUI (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
I want to release the sales insight app now. Walk me through it.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ฉันจะปล่อย Registry Insight ตอนนี้ พาฉันทำทีละขั้น
```

ผลที่คาดหวัง: คำตอบเดินครบสี่ขั้น ถ้าไม่ถูกหยิบเอง ให้ดูสองจุด: คำใน `description` ตรงกับประโยคที่พิมพ์หรือไม่ หรือเรียกชื่อ `release-checklist` ตรง ๆ ก่อน แล้วจดว่าถูกหยิบเองหรือต้องเอ่ยชื่อ

3. สร้าง `release-manager` — เอเจนต์ตัวที่ 5 ที่ preload skill นี้ (เลือกอย่างใดอย่างหนึ่ง) แล้วกดอนุญาต:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
In this folder, create .claude/agents/release-manager.md.
Frontmatter exactly: name release-manager; description "Use when the Registry Insight app is about to be released"; tools Read, Grep, Glob, Bash; model sonnet; skills release-checklist.
Body: you are the release manager. Run the release-checklist skill in order and report each check as PASS or FAIL with evidence. Never print any value that starts with sk-. Do not change server.js or the CSV.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ในโฟลเดอร์นี้ สร้าง .claude/agents/release-manager.md
frontmatter ต้องตรงนี้: name เป็น release-manager; description ว่า Use when the Registry Insight app is about to be released; tools เป็น Read, Grep, Glob, Bash; model เป็น sonnet; skills เป็น release-checklist
เนื้อหา: คุณคือ release manager ให้รัน release-checklist skill ตามลำดับ แล้วรายงานผลข้อละ PASS หรือ FAIL พร้อมหลักฐาน ห้ามพิมพ์ค่าที่ขึ้นต้นด้วย sk- ห้ามแก้ server.js หรือ CSV
```

ผลที่คาดหวัง: `.claude/agents/release-manager.md` มี `skills: release-checklist` ครบ และ tools มี `Bash` (ต่างจาก data-researcher เพราะต้องรันเซิร์ฟเวอร์กับ gate)

4. **ปิด TUI แล้วเปิด `claude` ใหม่** — เอเจนต์ใหม่โหลดตอนเซสชันเริ่ม

5. ทดสอบว่า skill เดินทางกับเอเจนต์จริง — วาง prompt (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Use the release-manager subagent to run the release checklist now. Report PASS or FAIL for each check.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ให้ subagent release-manager รัน release checklist เลย รายงานผลข้อละ PASS หรือ FAIL
```

ผลที่คาดหวัง: release-manager เดินเช็กลิสต์สี่ขั้นเองโดยคุณไม่ต้องเอ่ยชื่อ skill กดอนุญาตคำสั่ง node ตามที่มันขอ

📦 **Handoff:** ผลตรวจ PASS/FAIL ที่ release-manager สรุป คือสิ่งที่ Module 13 จะเรียกดูอีกครั้งก่อน deploy

6. เทียบไฟล์ทั้งสองด้วยตา

```powershell
Get-Content .claude/agents/release-manager.md
Get-Content .claude/agents/data-researcher.md
```

จุดที่ต้องเห็น: ต่างกันที่ `description` (งาน release), `tools` (มี Bash เพราะต้องรันของ) และบรรทัด `skills: release-checklist` — เหตุผลที่ไม่เอาหน้าที่ปล่อยของไปแปะที่ตัวอ่านอย่างเดียว

## ✅ Checkpoint

- [ ] `.claude/skills/release-checklist/SKILL.md` มี `description` อังกฤษและสี่ขั้นครบ
- [ ] จดแล้วว่าถูกหยิบเองหรือต้องเอ่ยชื่อ
- [ ] `.claude/agents/` มี 5 ตัว: data-researcher, planner, developer, qa, release-manager
- [ ] release-manager เดินเช็กลิสต์เองโดยไม่ต้องเอ่ยชื่อ skill

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ไม่ถูกหยิบเอง | description ไม่ตรงประโยคที่พิมพ์ | เอ่ยชื่อ `release-checklist` ตรง ๆ หรือปรับ description |
| `Agent type not found` | ยังไม่ได้รีสตาร์ท TUI | ปิดแล้วเปิดใหม่ |
| release-manager หยุดกลางเช็กลิสต์ | ยังไม่กดอนุญาตคำสั่ง node | กดอนุญาตในกล่องของ TUI |
| headless เขียน skill ไม่ได้ | headless กัน `.claude/**` | ใช้ TUI แล้วกดอนุญาต |

## 🆘 Behind? Catch up

แล็บนี้ไม่มี catch-up — เขียนสี่ขั้นด้วยมือตามบทเรียนได้ภายในห้านาที

## Stretch / ต่อยอด

สั่ง release-manager ตรวจซ้ำหลังแก้ตาม Workshop 7 — แล้วดูว่าผลเปลี่ยนจาก FAIL เป็น PASS ตรงไหน

## Solution → solutions/w5/

ตรวจด้วย `node solutions/w5/check.js`
