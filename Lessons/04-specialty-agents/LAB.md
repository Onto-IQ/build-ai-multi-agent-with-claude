# Workshop 2 — สร้าง data-researcher (อ่านอย่างเดียว)

> ⏱ machine ~8 นาที · Start state: หลัง Workshop 1 ยังไม่มี `.claude/agents/data-researcher.md`  
> หมายเหตุ: **ยังไม่แตะ MCP** ในวันแรก — ต่อ MCP ใน Workshop 6

## Goal / เป้าหมาย

มีไฟล์เอเจนต์ที่ Claude เขียนให้ frontmatter ครบ เรียกแล้วอธิบาย `POST /api/notes` พร้อมหลักฐาน `server.js:บรรทัด` โดยไม่แก้ไฟล์แอป

## Steps / ขั้นตอน

1. เปิด TUI จากโฟลเดอร์แอป

```bash
claude
```

2. วาง prompt สร้างไฟล์ทั้งชุด ครั้งเดียว แล้วกดอนุญาตเมื่อ TUI ถามสิทธิ์เขียน `.claude/` (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
In this folder, create .claude/agents/data-researcher.md.
Frontmatter exactly: name data-researcher; description starts with "Use proactively" and says the agent is read-only; tools Read, Grep, Glob; model sonnet.
Body sections: Method, Output format with file:line evidence, Constraints that forbid Edit, Write, and Bash.
Do not change server.js or the CSV.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ในโฟลเดอร์นี้ ให้สร้าง .claude/agents/data-researcher.md
frontmatter ต้องตรงนี้: name เป็น data-researcher; description ขึ้นต้น Use proactively และบอกว่าอ่านอย่างเดียว; tools เป็น Read, Grep, Glob; model เป็น sonnet
เนื้อหามี Method, รูปแบบคำตอบที่อ้าง file:line, และ Constraints ที่ห้าม Edit, Write, Bash
ห้ามแก้ server.js หรือ CSV
```

ผลที่คาดหวัง: ไฟล์ `.claude/agents/data-researcher.md` โผล่จริง เปิดดูแล้วมี `name`, `description`, `tools`, `model`

> 📚 **รู้เพิ่ม:** ทำไมระบบบังคับให้กดอนุญาตไฟล์ `.claude/` — เพราะไฟล์ในนี้คือคำสั่งประจำตัวที่เอเจนต์จะถือปฏิบัติ ถ้าให้เขียนอัตโนมัติทั้งโฟลเดอร์ ใครบางคนจะปลูกคำสั่งผ่านไฟล์ธรรมดาเข้ามาได้ จึงตั้งใจให้ต้องมีคนกดทุกครั้ง

3. **ปิด TUI แล้วเปิด `claude` ใหม่** — เอเจนต์ใหม่ถูกโหลดตอนเซสชันเริ่มเท่านั้น

4. สั่งใช้เอเจนต์ (เลือกอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Use the data-researcher subagent. Explain POST /api/notes citing server.js:line for every claim. Do not edit files.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ให้ subagent data-researcher อธิบายว่า POST /api/notes ทำอะไร โดยทุกข้ออ้างต้องระบุ server.js:บรรทัด ห้ามแก้ไฟล์
```

ผลที่คาดหวัง: คำตอบมีหลักฐานแบบ `server.js:` อย่างน้อยหนึ่งจุด

> 📚 **รู้เพิ่ม:** ทำไมต้องเปิดเซสชันใหม่ — Claude Code อ่านรายชื่อเอเจนต์จากไฟล์คอนฟิกตอนเซสชันเริ่มเท่านั้น (ตรวจจริงบน CLI 2.1.310) ถ้าสั่งเรียกในเซสชันเดิมทันทีที่สร้างไฟล์ จะขึ้น `Agent type 'data-researcher' not found` แม้ไฟล์จะโผล่แล้ว — ปิด TUI เปิดใหม่จึงจะเรียกได้

5. ปิด TUI แล้วเปิดไฟล์ด้วยตาอีกครั้ง

## ✅ Checkpoint

- [ ] ไฟล์ถูกสร้างโดย Claude ใน TUI ไม่ใช่การก็อปจาก `solutions/`
- [ ] `tools` มี Read, Grep, Glob และไม่มี Bash, Edit, Write
- [ ] `model` เป็น `sonnet`
- [ ] คำตอบมี `server.js:` อย่างน้อยหนึ่งจุด
- [ ] `git diff` ไม่แตะ `server.js` หรือ CSV
- [ ] **ยังไม่มี** `.mcp.json` ในราก workshop (MCP มาใน Workshop 6)

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ไม่มีไฟล์ ทั้งที่ข้อความบอกว่าเขียนแล้ว | ยังไม่กดอนุญาต หรือเขียนผิดโฟลเดอร์ | ดูกล่องใน TUI แล้วเปิดไฟล์ที่ตำแหน่งนั้นด้วยตา |
| `claude -p` ปฏิเสธ `.claude/**` | headless กันการเขียนคอนฟิกที่รันได้ | กลับมาทำใน TUI |
| สั่งใช้เอเจนต์แล้วขึ้น `Agent type 'data-researcher' not found` | สร้างไฟล์เอเจนต์ทับเซสชันเดิม — ระบบโหลดรายชื่อเอเจนต์ตอนเริ่มเซสชัน | ปิด TUI เปิด `claude` ใหม่แล้วสั่งอีกครั้ง |
| หมดเทิร์น ไม่มีไฟล์ | prompt กำกวมหรือ `--max-turns` ต่ำ | ใช้ prompt ในบทเรียน และอย่าตั้งเพดานสั้น |
| เอเจนต์แก้ `server.js` | ไม่ได้ห้าม หรือ tools กว้างไป | คืนไฟล์ด้วย git แล้วสร้างใหม่ด้วย tools ที่อ่านอย่างเดียว |
| frontmatter ภาษาไทยในชื่อฟิลด์ | แปล `name` หรือ `tools` | สั่งให้เขียนฟิลด์เป็นอังกฤษตามชีต |
| บัญชีถูกคิดเงินรายครั้ง | `ANTHROPIC_API_KEY` | unset แล้วเปิด TUI ใหม่ |

## 🆘 Behind? Catch up

```bash
node scripts/catch-up.js w2
```

จาก course repo (ไฟล์จะถูก copy ลง workshop repo) จะได้ไฟล์เอเจนต์อ้างอิง ให้อ่าน frontmatter แล้วค่อยทำรอบเรียกใช้เอง

## Stretch / ต่อยอด

สร้างเอเจนต์ตัวที่สองสำหรับงานที่คุณทำบ่อย โดยใช้ฟิลด์ชุดเดียวกัน แล้วอธิบายว่า `description` จะชวนให้ถูกเรียกตอนไหน

## Solution → solutions/w2/

`solutions/w2/drop-in/.claude/agents/data-researcher.md` ตรวจด้วย `node solutions/w2/check.js` (จาก course repo)
