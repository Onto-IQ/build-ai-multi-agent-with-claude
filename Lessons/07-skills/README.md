# Module 7 — Skills

> ⏱ ~25 นาที · 🎯 เขียน SKILL.md ที่ถูกหยิบเมื่อจะปล่อยของ และผูกเข้า frontmatter ของเอเจนต์ได้ · Add a skill folder and preload it on one agent.

## Key idea / แนวคิดหลัก — เล่าเป็นเรื่อง

ทุกครั้งที่จะปล่อยแอปของจริง มีขั้นตอนชุดเดิมที่ต้องทำซ้ำ: เซิร์ฟเวอร์ต้องขึ้น ต้องจดผลตรวจ ต้องเช็คว่าไม่มีข้อมูลลับหลุดออกไป แล้วปิดเซิร์ฟเวอร์ก่อนรัน gate — ปัญหาคือคนจำขั้นตอนพวกนี้ได้ไม่เหมือนกัน ทั้งคนและเอเจนต์

**Skill** คือคำตอบของโจทย์ซ้ำ ๆ แบบนี้ — มันคือไฟล์ขั้นตอนที่เก็บไว้ในโปรเจกต์ และ Claude จะ**โหลดขึ้นมาเองเมื่องานตรงกับคำอธิบาย** ไม่ต้องวางขั้นตอนซ้ำในทุก prompt สิ่งสำคัญคือต้องแยกให้ออกว่า skill ไม่ใช่เอเจนต์ตัวที่สอง: เอเจนต์คือ "คนทำงานอีกคนในบทสนทนาคนละห้อง" ส่วน skill คือ "คู่มือประจำงานที่วางไว้ในห้องเดียวกัน" — ใช้เอเจนต์เมื่องานยาวต้องแยกบริบท ใช้ skill เมื่องานซ้ำที่ต้องทำเหมือนเดิมทุกครั้ง

และเช่นเดียวกับทุกอย่างในบทที่ผ่านมา การผูกมันเข้ากับเอเจนต์ทำได้ใน frontmatter — ใส่ `skills:` เมื่อเอเจนต์ตัวนั้นต้องมีขั้นตอนนี้ติดตัวทุกงาน ไม่ต้องใส่ให้ทุกตัว

> EN: A skill is a how-to that loads when the description matches. Preload it only on the agent that always needs it.

## Concept / เนื้อหา

ตารางแยกสองอย่างนี้ให้ชัด (แผ่นอ้างอิง):

| | Subagent | Skill |
|---|---|---|
| เป็นใคร | คนทำงานคนละบทสนทนา | ขั้นตอนในบทสนทนาเดียวกัน |
| ที่อยู่ | `.claude/agents/*.md` | `.claude/skills/<ชื่อ>/SKILL.md` |
| ใช้เมื่อ | งานยาวที่ต้องแยกบริบท | งานซ้ำที่ต้องทำเหมือนเดิมทุกครั้ง |

Skill ที่แล็บนี้จะสร้างเก็บที่ `.claude/skills/release-checklist/SKILL.md` ขั้นตอนข้างในมีสี่ข้อ: เปิดเซิร์ฟเวอร์ให้ขึ้นบรรทัด listening, จดผลของ quality gate, เช็คว่าคำตอบของ `/api/health` ไม่มีสตริง `sk-`, และปิดเซิร์ฟเวอร์ก่อนรัน `npm run gate`

กฎการเขียนข้อความมีข้อเดียวที่หักล้างไม่ได้: บรรทัด `description` **เป็นภาษาอังกฤษ** เพราะเป็นตัวที่ Claude ใช้จับว่างานไหนควรหยิบ skill นี้ — ส่วนเนื้อขั้นตอนเป็นไทยได้เต็มที่

## ลงมือทำตามลำดับ

```bash
claude
```

1. วาง prompt จากหัวข้อถัดไป แล้วกดอนุมัติเมื่อ Claude ขอเขียนไฟล์
2. เปิดไฟล์ตรวจด้วยตา:

```bash
cat .claude/skills/release-checklist/SKILL.md
```

   ต้องเห็น frontmatter (name + description อังกฤษ) และเนื้อขั้นตอนครบสี่ข้อ

3. ทดสอบว่าถูกหยิบเองจริง — พิมพ์ใน TUI ว่า:

```text
I want to release the sales insight app now. Walk me through it.
```

   คำตอบที่ผ่านต้องเดินครบสี่ขั้น ถ้า Claude ไม่หยิบเอง ให้ดูสองจุด: คำใน `description` ตรงกับประโยคที่พิมพ์หรือไม่ หรือเรียกชื่อ `release-checklist` ตรง ๆ ไปก่อน

4. ผูกเข้าเอเจนต์: เพิ่มบรรทัด `skills: release-checklist` ใน frontmatter ของ `data-researcher` (เปิดไฟล์แก้ผ่าน TUI ได้) — จากนี้ทุกงานของนักวิจัยจะมีขั้นตอนปล่อยของติดตัวโดยไม่ต้องสั่ง

## Prompt pattern — เลือกใช้อย่างใดอย่างหนึ่ง

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

> 📚 **ทำไมแนะนำ EN:** ฟิลด์ `description` ต้องเป็นอังกฤษ (เป็นตัวจับว่างานไหนควรใช้ skill) — สั่งเป็นอังกฤษทำให้ข้อความใน description ตรงกับที่คุณตั้งใจเป๊ะ ไม่ผ่านการแปลกลับ TH ก็ทำได้ (คอร์สทดสอบแล้ว: ค่า machine-readable ถูกต้องแม้สั่งไทย)

| ส่วน | หน้าที่ |
|---|---|
| ตำแหน่งไฟล์ SKILL.md | กันไฟล์หลุดไปที่ agents |
| description อังกฤษ | ให้ Claude จับได้ว่างานไหนควรใช้ skill |
| สี่ขั้น | ของที่ต้องโผล่ในคำตอบตอนทดสอบ |

## Common pitfalls / กับดัก

- เขียน skill เป็นเอเจนต์ — ได้ "คนลงมือ" เพิ่มขึ้นโดยไม่มีขั้นตอน ซึ่งตรงข้ามกับที่ต้องการ
- `description` กำกวม — skill ไม่ถูกโหลดเองเงียบ ๆ กลายเป็นไฟล์ที่ไม่มีใครอ่าน
- ใส่ skill ให้ทุกเอเจนต์ — เนื้อหาของ skill ถูกส่งเข้าบทสนทนาทุกตัว ยาวและแพงโดยไม่จำเป็น
- สร้างไฟล์ใน `claude -p` — การเขียน `.claude/**` ถูกปฏิเสธ ทำใน TUI
- ลืมกดอนุญาตใน TUI — ไฟล์ไม่เกิดและรอบนั้นเดินต่อไม่ได้
- คิดว่าสคริปต์ workflow โหลด `skills:` เอง — เส้น subagent กับเส้นสคริปต์ไม่เหมือนกัน (รายละเอียดอยู่ในฉบับผู้สอน)

## Quick check / ทบทวน

<details>
<summary>1. Skill ต่างจาก subagent ตรงไหน</summary>
Skill = ขั้นตอนในบทสนทนาเดียวกัน  Subagent = คนทำงานคนละบทสนทนา
</details>

<details>
<summary>2. ฟิลด์ไหนทำให้ถูกโหลดเอง</summary>
description ที่บอกว่างานแบบไหนควรใช้
</details>

<details>
<summary>3. เมื่อไหร่ถึงใส่ skills: ใน frontmatter</summary>
เมื่อเอเจนต์ตัวนั้นต้องมีขั้นตอนนี้อยู่แล้วทุกงาน
</details>

## Go deeper

- [ชีต frontmatter](../../reference/frontmatter-cheatsheet.md)
