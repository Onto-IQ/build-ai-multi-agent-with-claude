# Workshop 1 — สำรวจแอปแบบขนาน

> ⏱ 35 นาที · Start state: starter quality gate ยัง exit 2

## Goal / เป้าหมาย

ได้รายงานเดียวจาก prompt เดียว ครบโครงสร้าง คุณภาพข้อมูล และจุดเสี่ยง โดยไม่แก้ไฟล์

## Steps / ขั้นตอน

1. เข้าโฟลเดอร์แอปแล้วเปิด TUI

```bash
claude
```

2. วาง prompt ทั้งชุด ครั้งเดียว (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Dispatch 3 parallel Explore subagents on this Sales Insight app.
1) Map the runtime files and how to start the server.
2) Read data/README.md and the failure text from node scripts/quality-gate.js. Do not fix anything.
3) Trace GET /api/summary and POST /api/notes far enough to name the risky behavior.
Do not modify files. Return one report under 300 words with headings: structure, data quality, risks.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ส่ง Explore subagent 3 ตัวทำพร้อมกันในแอป Sales Insight
1) แผนที่ไฟล์ที่ใช้รัน และวิธียกเซิร์ฟเวอร์
2) อ่าน data/README.md และข้อความ FAIL จาก node scripts/quality-gate.js ห้ามแก้
3) ไล่ GET /api/summary กับ POST /api/notes พอให้ชี้พฤติกรรมที่เสี่ยง
ห้ามแก้ไขไฟล์ ส่งรายงานเดียวไม่เกิน 300 คำ มีหัวข้อ โครงสร้าง, คุณภาพข้อมูล, จุดเสี่ยง
```

ผลที่คาดหวัง: leader เรียกเอเจนต์ย่อยมากกว่าหนึ่งตัว แล้วตอบรายงานเดียวที่มีสามหัวข้อ ระบุ `server.js`, `data/sales.csv`, `scripts/quality-gate.js` และพูดถึง `POST /api/notes` กับ `GET /api/summary`

> 📚 **รู้เพิ่ม:** จุดของ prompt เดียวคือให้ leader แตกงานเอง — สามก้อนอ่านไฟล์คนละชุดจึงวิ่งขนานได้ และสิ่งที่กลับมาหาคุณเป็นแค่บทสรุป ไม่ใช่เนื้อไฟล์เต็ม บทสนทนาหลักจึงยังเบาพอคุยงานต่อ

3. ออกจาก TUI แล้วตรวจว่าไม่มีอะไรเปลี่ยน — ต้องเป็น repo จาก `git clone` หรือผ่าน snapshot จาก Lab 0 แล้ว (โฟลเดอร์จาก ZIP ล้วนไม่มี `.git` ใช้ git ไม่ได้)

```bash
git status --short
```

ผลที่คาดหวัง: ไม่มีไฟล์ของแอปถูกแก้จากการสำรวจ ไฟล์ที่คุณจดโน้ตเองไม่นับ

4. รัน quality gateเองในเทอร์มินัล อย่าให้เอเจนต์รันแทนในรอบนี้

```bash
node scripts/quality-gate.js
```

ผลที่คาดหวัง: ยังเป็น exit 2

> 📚 **รู้เพิ่ม:** รัน gate ด้วยมือคุณเอง ไม่ให้เอเจนต์รันแทน — รอบสำรวจยังไม่ให้สิทธิ์รันคำสั่ง และนี่คือนิสัยที่ใช้จนจบคอร์ส: หลักฐานผ่าน/ไม่ผ่านต้องมาจากเทอร์มินัลของคุณ ไม่ใช่คำบอกของเอเจนต์

## ✅ Checkpoint

- [ ] ใช้ prompt เดียว ไม่ได้ถามทีละชิ้นงานสามรอบ
- [ ] รายงานมีสามหัวข้อและไม่ยาวจนอ่านในห้านาทีไม่จบ
- [ ] ระบุอย่างน้อยสองเส้นทางคือ `/api/summary` และ `/api/notes`
- [ ] `git status` ไม่มีความแก้จากเอเจนต์
- [ ] quality gate ยังแดง

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ได้แผน แต่ไม่ได้รายงาน | prompt ไม่ได้สั่งให้ทำตอนนี้ | เติมว่าให้ส่งเอเจนต์ย่อยจริง ไม่ใช่แค่เสนอแผน |
| ไฟล์ถูกแก้ | ไม่มีประโยคห้ามแก้ | `git checkout -- .` ในแอปถ้าคุณยังไม่ต้องการของนั้น แล้วสั่งใหม่ |
| `claude -p` ไม่ยอมรัน quality gate | headless ปิด Bash เป็นค่าเริ่มต้น | รัน `node scripts/quality-gate.js`เองใน Git Bash |
| หมดเทิร์น | `--max-turns` ต่ำไป | อยู่ใน TUI หรือใส่ `--max-turns 20` เฉพาะตอน headless |
| สำรวจผิดโฟลเดอร์ | เปิด `claude` นอก `ราก repo` | ออกแล้วเปิดใหม่จากโฟลเดอร์แอป |
| port busy ตอนรัน quality gate | เซิร์ฟเวอร์ค้าง | ปิดก่อน หรือตั้ง `PORT` |

## 🆘 Behind? Catch up

จากราก repo:

```bash
node scripts/catch-up.js w1
```

แล้วอ่าน `docs/EXPLORATION-REPORT.md`

## Stretch / ต่อยอด

เปลี่ยนก้อนที่ 3 เป็นคำถามว่าถ้าจะเพิ่มหน้า "ยอดรายจังหวัด" ต้องแตะไฟล์ใดบ้าง โดยยังห้ามแก้ไฟล์

## Solution → solutions/w1/

รายงานอ้างอิงอยู่ที่ `solutions/w1/drop-in/docs/EXPLORATION-REPORT.md` ตรวจด้วย `node solutions/w1/check.js`
