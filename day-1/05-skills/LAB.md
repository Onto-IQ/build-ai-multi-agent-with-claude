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

แล็บนี้ไม่มีโฟลเดอร์ `solutions/w` เขียนสี่ขั้นด้วยมือตามบทเรียนได้ภายในห้านาที

## Stretch / ต่อยอด

ให้ data-researcher คง tools อ่านอย่างเดียว และสร้างเอเจนต์ `release-manager` ต่างหากที่ preload skill นี้

## Solution → solutions/w2/

ไม่มีคำตอบแยก โครงไฟล์อยู่ในบทเรียน
