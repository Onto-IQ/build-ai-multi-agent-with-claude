# คู่ prompt ไทย / อังกฤษ

เลือกภาษาตามคนอ่านผลลัพธ์ ถ้าต้องส่งรายงานภาษาไทย ให้สั่งเป็นไทย ชื่อไฟล์ ชื่อฟิลด์ ชื่อเครื่องมือ และคำสั่ง CLI ไม่ต้องแปล

| หลัก | วิธีใช้ |
|---|---|
| ภาษาของคำสั่งไปกับภาษาของคำตอบ | สั่งไทยได้รายงานไทย ชื่อ `server.js` และรหัส violation ยังเป็นอังกฤษ |
| ฟิลด์เครื่องอ่านต้องเป๊ะ | `name`, `tools`, `model`, `mcp__server__tool` เขียนอังกฤษใน prompt |
| ใส่เกณฑ์ตรวจในตัว prompt | เช่น "รายงานไม่เกิน 300 คำ" หรือ "อ้าง `file:line`" |
| ความครบของสเปกสำคัญกว่าภาษา | คำสั่งกำกวมสั้น ๆ จบโดยไม่มีไฟล์ได้ทั้งสองภาษา |
| ตรวจไฟล์จริง | อย่าเชื่อประโยค "เขียนให้แล้ว" จนกว่าจะเปิดไฟล์หรือรันสคริปต์ |

ตัวอย่างคู่ที่ใช้ทั้งคอร์ส:

```text
EN: Dispatch 3 parallel Explore subagents. Do not modify files. Report under 300 words.
TH: จง dispatch Explore subagent แบบขนาน 3 ตัว ห้ามแก้ไขไฟล์ รายงานรวมไม่เกิน 300 คำ
```

```text
EN: Enable an agent team (not Explore). Spawn 3 named teammates with a shared task list. They must message each other at least 5 times. Write docs/TEAMS-REVIEW.md under 250 words. Then shut down teammates.
TH: ใช้ Agent Teams (ไม่ใช่ Explore) สร้าง teammate ชื่อชัด 3 ตัวพร้อมรายการงานร่วม ต้องส่งข้อความหากันอย่างน้อย 5 ครั้ง เขียน docs/TEAMS-REVIEW.md ไม่เกิน 250 คำ แล้วให้ shut down
```

```text
EN: Reply with exactly: CLAUDE-OK
TH: ตอบกลับมาเป๊ะ ๆ ว่า: CLAUDE-OK
```

ข้อความทดสอบ MCP ที่ใช้ในแล็บ:

```text
สวัสดี — ทดสอบ ก-ฮ ๐๑๒๓
```

ให้ถามต่อว่าข้อความที่กลับมาตรงทุกตัวหรือเพี้ยน เลขไทยในช่วงนี้คือ U+0E50 ถึง U+0E53
