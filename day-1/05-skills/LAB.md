# Lab — release checklist

> ⏱ 15 นาที · Start state: อยู่ใน `ราก repo` หลัง Workshop 2

## Goal / เป้าหมาย

มี `SKILL.md` ที่ถูกอ้างเมื่อสั่งให้เตรียมปล่อยของ

## Steps / ขั้นตอน

1. เปิด TUI แล้ววาง prompt สร้าง skill (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Create .claude/skills/release-checklist/SKILL.md.
Frontmatter: name release-checklist; description "Use before releasing the Sales Insight app".
Body: four checks — server boots, quality gate result is recorded, /api/health must not contain sk-, server is stopped before the gate.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
สร้าง .claude/skills/release-checklist/SKILL.md
frontmatter: name เป็น release-checklist และ description เป็นภาษาอังกฤษว่า Use before releasing the Sales Insight app
เนื้อหาเป็น 4 ขั้น: เซิร์ฟเวอร์ขึ้น, จดผล quality gate, /api/health ห้ามมี sk-, ปิดเซิร์ฟเวอร์ก่อนรัน `node scripts/quality-gate.js`
```

ผลที่คาดหวัง: มีไฟล์ `.claude/skills/release-checklist/SKILL.md` และ frontmatter มี `name` กับ `description`

2. เปิดเซสชันใหม่หรือพิมพ์ต่อ

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
I want to release the sales insight app now. Walk me through it.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ฉันจะปล่อย Sales Insight ตอนนี้ พาฉันทำทีละขั้น
```

ผลที่คาดหวัง: คำตอบพาดถึงการเปิดเซิร์ฟเวอร์ quality gate และคำว่า `sk-` ถ้าไม่พาด ให้สั่งชื่อ `release-checklist` ตรง ๆ แล้วจดว่า description ยังไม่ตรงกับประโยคที่พิมพ์

> 📚 **รู้เพิ่ม:** `description` ต้องเป็นอังกฤษเพราะเป็นสิ่งที่ Claude ใช้จับคู่งานกับ skill — ประโยคที่คุณพิมพ์ ("I want to release…") ต้องชนกับคำใน description ถึงจะถูกหยิบเอง

3. เพิ่ม `skills: release-checklist` ให้เอเจนต์ตัวเดียวที่คุณตั้งใจ ไม่ต้องเพิ่มให้ data-researcher ถ้าคุณยังอยากให้ตัวนั้นอ่านอย่างเดียว

> 📚 **รู้เพิ่ม:** ใส่เฉพาะตัวที่ต้องใช้ — เนื้อหาของ skill จะถูกส่งเข้า context ของเอเจนต์นั้นทุกงาน ใส่ทุกตัวเท่ากับจ่าย token ซ้ำในงานที่ไม่ต้องใช้

## ✅ Checkpoint

- [ ] ไฟล์ skill อยู่ตำแหน่งที่ถูกต้อง
- [ ] `description` เป็นอังกฤษและพูดถึงการปล่อยของ
- [ ] มีอย่างน้อยสี่ขั้นในเนื้อหา
- [ ] ทดสอบใน TUI หนึ่งรอบ และจดว่าถูกหยิบเองหรือต้องเอ่ยชื่อ

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| เขียนไฟล์ไม่ได้ใน `claude -p` | headless กัน `.claude/**` | ใช้ TUI แล้วกดอนุญาต |
| ไม่ถูกหยิบ | description ไม่ตรงประโยคที่พิมพ์ | เอ่ยชื่อ skill หรือปรับ description |
| หมดเทิร์น | `--max-turns` ต่ำ | อยู่ใน TUI |
| เอเจนต์ไปแก้เซิร์ฟเวอร์ | prompt ไม่ได้ห้าม | เติมว่าห้ามแก้ `server.js` ในรอบนี้ |

## 🆘 Behind? Catch up

แล็บนี้ไม่มี catch-up เขียนสี่ขั้นด้วยมือตามบทเรียนได้ภายในห้านาที

## Stretch / ต่อยอด — สร้าง `release-manager` ที่ preload skill นี้

`data-researcher` ยังเป็นตัวอ่านอย่างเดียวเหมือนเดิม งานปล่อยของอยู่กับเอเจนต์ใหม่ต่างหาก — นี่คือเหตุผลที่ skill ไม่ควรแปะทุกตัว

1. ใน TUI วาง prompt สร้างเอเจนต์ (เลือกอย่างใดอย่างหนึ่ง) แล้วกดอนุญาตเมื่อถามสิทธิ์เขียน `.claude/`

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
In this folder, create .claude/agents/release-manager.md.
Frontmatter exactly: name release-manager; description "Use when the Sales Insight app is about to be released"; tools Read, Grep, Glob, Bash; model sonnet; skills release-checklist.
Body: you are the release manager. Run the release-checklist skill in order and report each check as PASS or FAIL with evidence. Never print any value that starts with sk-. Do not change server.js or the CSV.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ในโฟลเดอร์นี้ ให้สร้าง .claude/agents/release-manager.md
frontmatter ต้องตรงนี้: name เป็น release-manager; description ว่า Use when the Sales Insight app is about to be released; tools เป็น Read, Grep, Glob, Bash; model เป็น sonnet; skills เป็น release-checklist
เนื้อหา: คุณคือ release manager ให้รัน release-checklist skill ตามลำดับ แล้วรายงานผลข้อละ PASS หรือ FAIL พร้อมหลักฐาน ห้ามพิมพ์ค่าที่ขึ้นต้นด้วย sk- ห้ามแก้ server.js หรือ CSV
```

ผลที่คาดหวัง: มีไฟล์ `.claude/agents/release-manager.md` เปิดดูแล้วมี `skills: release-checklist` ครบ และมี `Bash` ใน tools (ต่างจาก data-researcher) เพราะเช็กลิสต์ต้องรันเซิร์ฟเวอร์กับ quality gate

2. ปิด TUI แล้วเปิด `claude` ใหม่จากโฟลเดอร์เดิม — เหตุผลเดียวกับ Workshop 2: เอเจนต์ถูกโหลดตอนเซสชันเริ่ม สั่งเรียกในเซสชันเดิมจะขึ้น `Agent type not found`

3. ทดสอบว่า skill เดินทางกับเอเจนต์จริง — วาง prompt (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Use the release-manager subagent to run the release checklist now. Report PASS or FAIL for each check.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ให้ subagent release-manager รัน release checklist เลย รายงานผลข้อละ PASS หรือ FAIL
```

ผลที่คาดหวัง: release-manager เดินเช็กลิสต์สี่ข้อเองโดยคุณไม่ต้องเอ่ยชื่อ skill และกดอนุญาตคำสั่ง node ตามที่มันขอ

4. เทียบไฟล์ทั้งสองด้วยตา

```bash
cat .claude/agents/release-manager.md
cat .claude/agents/data-researcher.md
```

จุดที่ต้องเห็น: ต่างกันที่ `description` (งาน release), `tools` (มี Bash เพราะต้องรันของ) และบรรทัด `skills: release-checklist` — นี่คือเหตุผลที่ไม่เอาหน้าที่ปล่อยของไปแปะที่ตัวอ่านอย่างเดียว

เฉลยอ้างอิง: `solutions/w2/stretch/release-manager.md`

## Solution → solutions/w2/

ไม่มีคำตอบแยกสำหรับตัวแล็บ โครงไฟล์อยู่ในบทเรียน · ฉบับอ้างอิงของ Stretch: `solutions/w2/stretch/release-manager.md`
