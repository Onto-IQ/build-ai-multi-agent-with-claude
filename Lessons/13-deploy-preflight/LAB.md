# Lab — preflight ก่อน Vercel (Module 13: Deploy & Pre-flight)

> ⏱ machine ~10 นาที · Start state: อยู่ใน workshop repo · quality gate exit 0 มีแดชบอร์ดจาก Workshop 9 และ feature จาก Workshop 8

## Goal / เป้าหมาย

เดินเช็กลิสต์ครบ และพยายาม deploy หนึ่งครั้งถ้าบัญชี Vercel พร้อม ถ้าไม่พร้อม ให้จบที่เช็กลิสต์กับผล quality gate

## Steps / ขั้นตอน

1. ปิด `npm start` ถ้ายังเปิดอยู่ แล้วรัน `npm run gate`

```bash
npm run gate
```

ผลที่คาดหวัง: `quality gate: 6/6 passed`

> 📚 **รู้เพิ่ม:** ของที่แดงขึ้นของจริง คือของเสียที่คนภายนอกเห็นก่อนเรา — quality gate จึงเป็นด่านเดียวที่ตัดสินได้ว่าพร้อมหรือยัง ไม่ใช่ความมั่นใจของเอเจนต์

2. เปิด `/api/health` อีกครั้งสั้น ๆ แล้วปิดเซิร์ฟเวอร์ ตรวจว่าไม่มี `sk-`

```bash
PORT=3001 npm start
```

ผลที่คาดหวัง: `{"ok":true}` จากนั้น Ctrl+C ใช้พอร์ต 3001 กันชนกับของที่อาจค้างที่ 3000

> 📚 **รู้เพิ่ม:** พอร์ต 3001 คือการตรวจของใหม่โดยไม่ง้อเซิร์ฟเวอร์เก่าที่อาจค้าง — ถ้ามันค้างจริง รอบตรวจของคุณจะไม่ถูกมันลากไปด้วย

3. ตรวจบัญชี

```bash
echo "$ANTHROPIC_API_KEY"
```

ผลที่คาดหวัง: ว่าง และคุณล็อกอิน Vercel ได้ในเบราว์เซอร์

4. เปิด TUI แล้ววาง prompt deploy เฉพาะเมื่อผู้สอนบอกว่าห้องนี้ deploy จริง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Deploy this Registry Insight app to Vercel with the Vercel connection.
Before deploying, run npm run gate. If it fails, stop and report.
After deploying, give me the production URL and the commit that was deployed.
Do not print any sk- value.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
Deploy แอป Registry Insight ขึ้น Vercel โดยใช้การเชื่อม Vercel
ก่อน deploy ให้รัน npm run gate ถ้าไม่ผ่านให้หยุดแล้วรายงาน
หลัง deploy ส่ง production URL และ commit ที่ขึ้นจริง
ห้ามพิมพ์ค่าที่ขึ้นต้นด้วย sk-
```

ผลที่คาดหวังถ้าขึ้นได้: มี URL และมีรหัส commit ถ้าไม่ขึ้น: มีรายงานว่าหยุดที่ quality gate หรือติดสิทธิ์ ไม่มีคำว่าขึ้นแล้วโดยไม่มี URL

> 📚 **รู้เพิ่ม:** URL กับ commit คือหลักฐานสองชิ้นของการ deploy — คำว่า "ขึ้นแล้ว" โดยไม่มีสองอย่างนี้ไม่นับ และสคริปต์ตรวจใน repo ก็ไม่ได้เรียก Vercel แทนคุณ

## ✅ Checkpoint

- [ ] quality gate exit 0 ก่อนคิดถึง Vercel
- [ ] health ไม่มี `sk-`
- [ ] `ANTHROPIC_API_KEY` ว่าง
- [ ] เซิร์ฟเวอร์ท้องถิ่นถูกปิดแล้ว
- [ ] มี URL จริง หรือมีบันทึกว่าห้องนี้ให้ผู้สอนสาธิต และคุณเก็บผล quality gateไว้

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| quality gate ยัง exit 2 (FAIL) | ข้อมูลหรือเซิร์ฟเวอร์ยังไม่ใช่ชุด Workshop 3–7 | catch-up `w7` แล้วตรวจหน้าจาก `w9` |
| port busy | ของเก่ายังฟังอยู่ | ปิดหรือเปลี่ยน `PORT` |
| headless ไม่ยอมเรียก vercel | Bash ถูกปฏิเสธ | ใช้ TUI หรือรัน CLI เอง |
| ไม่มีบัญชี Vercel | ยังไม่สมัคร | หยุดที่เช็กลิสต์ ผู้สอนสาธิต |
| ได้คำว่า deployed แต่ไม่มี URL | ไม่มีหลักฐาน | อย่าเช็คผ่านข้อนี้ |
| หมดเทิร์นกลางทาง | `--max-turns` ต่ำ | อยู่ใน TUI |

สคริปต์ `node scripts/check-solutions.mjs` ไม่ได้เรียก Vercel การผ่านของสคริปต์ไม่ได้แทน URL

## 🆘 Behind? Catch up

จาก course repo (ไฟล์ถูก copy ลง workshop repo):

```bash
node scripts/catch-up.js w9
```

แล้วรัน `npm run gate` ใน workshop repo ให้ได้ exit 0 การได้ URL ยังเป็นขั้นที่คนทำ

## Stretch / ต่อยอด

ถ้ารอบนี้ขึ้นได้ ให้เปิด URL จริงแล้วเทียบยอดกับ `docs/EXECUTIVE-SUMMARY.md`

## Solution → solutions/w9/

`vercel.json` กับ `api/summary.js` อยู่ใน `solutions/w9/drop-in/` ยังไม่มี URL ที่ตรวจอัตโนมัติ
