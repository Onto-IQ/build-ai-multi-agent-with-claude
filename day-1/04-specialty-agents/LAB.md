# Workshop 2 — สร้าง data-researcher

> ⏱ 35 นาที · Start state: หลัง Workshop 1 ยังไม่มี `.claude/agents/data-researcher.md`

## Goal / เป้าหมาย

มีไฟล์เอเจนต์ที่ Claude เขียนให้ frontmatter ครบ และเรียกแล้วได้อธิบาย `POST /api/notes` พร้อมเลขบรรทัด

## Steps / ขั้นตอน

1. เปิด TUI จากโฟลเดอร์แอป

```bash
cd sandbox/sales-insight
claude
```

2. วาง prompt สร้างไฟล์จากบทเรียนทั้งชุด ครั้งเดียว แล้วกดอนุญาตเมื่อ TUI ถามสิทธิ์เขียน `.claude/`

ผลที่คาดหวัง: ไฟล์ `.claude/agents/data-researcher.md` โผล่จริง เปิดดูแล้วมี `name`, `description`, `tools`, `model`

> 📚 **รู้เพิ่ม:** ทำไมระบบบังคับให้กดอนุญาตไฟล์ `.claude/` — เพราะไฟล์ในนี้คือคำสั่งประจำตัวที่เอเจนต์จะถือปฏิบัติ ถ้าให้เขียนอัตโนมัติทั้งโฟลเดอร์ ใครบางคนจะปลูกคำสั่งผ่านไฟล์ธรรมดาเข้ามาได้ จึงตั้งใจให้ต้องมีคนกดทุกครั้ง

3. ในเซสชันเดิม สั่งให้ใช้เอเจนต์นั้นอธิบาย `POST /api/notes`

```text
EN: Use the data-researcher subagent to explain POST /api/notes. Cite server.js:line for every claim. Do not edit.
TH: ให้ subagent data-researcher อธิบาย POST /api/notes ทุกข้ออ้าง server.js:บรรทัด ห้ามแก้ไฟล์
```

ผลที่คาดหวัง: คำตอบมีหลักฐานแบบ `server.js:` และพูดถึงการอ่าน JSON ได้ ไม่ต้องใช้คำว่า Answer เป๊ะ

> 📚 **รู้เพิ่ม:** เลขบรรทัดคือหลักฐานว่าเอเจนต์เปิดอ่านไฟล์จริง ไม่ใช่เดาจากชื่อ endpoint — คำตอบที่ไม่ชี้ตำแหน่งไม่มีทางเอาไปใช้ต่อได้

4. ปิด TUI แล้วเปิดไฟล์ด้วยตาอีกครั้ง

## ✅ Checkpoint

- [ ] ไฟล์ถูกสร้างโดย Claude ใน TUI ไม่ใช่การก็อปจาก `solutions/`
- [ ] `tools` มี Read, Grep, Glob และไม่มี Bash, Edit, Write
- [ ] `model` เป็น `sonnet`
- [ ] คำอธิบาย `POST /api/notes` มี `server.js:` อย่างน้อยหนึ่งจุด
- [ ] `git diff` ไม่แตะ `server.js` หรือ CSV

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ไม่มีไฟล์ ทั้งที่ข้อความบอกว่าเขียนแล้ว | ยังไม่กดอนุญาต หรือเขียนผิดโฟลเดอร์ | ดูกล่องใน TUI แล้วเปิดไฟล์ที่ตำแหน่งนั้นด้วยตา |
| `claude -p` ปฏิเสธ `.claude/**` | headless กันการเขียนคอนฟิกที่รันได้ | กลับมาทำใน TUI |
| หมดเทิร์น ไม่มีไฟล์ | prompt กำกวมหรือ `--max-turns` ต่ำ | ใช้ prompt ในบทเรียน และอย่าตั้งเพดานสั้น |
| เอเจนต์แก้ `server.js` | ไม่ได้ห้าม หรือ tools กว้างไป | คืนไฟล์ด้วย git แล้วสร้างใหม่ด้วย tools ที่อ่านอย่างเดียว |
| frontmatter ภาษาไทยในชื่อฟิลด์ | แปล `name` หรือ `tools` | สั่งให้เขียนฟิลด์เป็นอังกฤษตามชีต |
| บัญชีถูกคิดเงินรายครั้ง | `ANTHROPIC_API_KEY` | unset แล้วเปิด TUI ใหม่ |

## 🆘 Behind? Catch up

```bash
node scripts/catch-up.js w2
```

จากราก repo จะได้ไฟล์เอเจนต์อ้างอิง ให้อ่าน frontmatter แล้วค่อยทำรอบเรียกใช้เอง

## Stretch / ต่อยอด

สร้างเอเจนต์ตัวที่สองสำหรับงานที่คุณทำบ่อย โดยใช้ฟิลด์ชุดเดียวกัน แล้วอธิบายว่า `description` จะชวนให้ถูกเรียกตอนไหน

## Solution → solutions/w2/

`solutions/w2/drop-in/.claude/agents/data-researcher.md` ตรวจด้วย `node solutions/w2/check.js`
