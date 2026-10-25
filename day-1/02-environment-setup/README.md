# Module 2 — ตั้งเครื่อง / Environment setup

> ⏱ ~30 นาที · 🎯 รู้ว่าแล็บใช้ TUI (`claude`) ไม่ใช่ `claude -p` และรู้ว่า `ANTHROPIC_API_KEY` จะทับบัญชีคลาส · Use the TUI for labs, and know which environment variable overrides the class login.

## Key idea / แนวคิดหลัก — เล่าเป็นเรื่อง

เหตุการณ์ที่เจอบ่อยที่สุดในห้องเรียนแบบนี้ไม่ใช่เรื่องเอเจนต์ฉลาดหรือไม่ฉลาด แต่คือเรื่องเล็ก ๆ สองเรื่อง: เปิด Claude จากผิดที่ และมีค่าที่ตั้งทิ้งไว้จากงานเก่า

เรื่องแรก — ขอบเขตของ Claude Code คือ**โฟลเดอร์ที่เปิด** ไม่ใช่ทั้งเครื่อง เปิดจากที่ผิด เอเจนต์ก็ทำงานกับโฟลเดอร์ผิดทั้งรอบ เรื่องที่สอง — ถ้าเครื่องมี `ANTHROPIC_API_KEY` ตั้งค่าค้างไว้ Claude จะใช้คีย์นั้นแทนบัญชี Pro/Team ของคลาสทันที และค่าใช้จ่ายไปโผล่ที่บัญชีส่วนตัวแบบจ่ายตามการใช้ ไม่มีเสียงเตือนตอนเกิด

แล็บทั้งหมดของคอร์สนี้ทำงานใน **TUI** (พิมพ์ `claude` ธรรมดา) เพราะ TUI มีหน้าจอให้เห็นเครื่องมือที่กำลังทำงาน และ**มีปุ่มให้คุณกดอนุญาต**เอง — ส่วนโหมด `claude -p` จบในคำสั่งเดียว ไม่มีหน้าจอให้กด สิทธิ์จึงแคบกว่า (เขียนไฟล์ใน `.claude/**` หรือรัน Bash มักถูกปฏิเสธ) แล็บในห้องจึงไม่เริ่มด้วยทางนั้น

ข้อสุดท้ายที่ตรวจตอนนี้จะประหยัดเวลาตอนบ่าย: เวอร์ชันของ Claude Code ต้องอย่างน้อย **2.1.296** — รุ่นต่ำกว่านี้จะไม่มีข้อความช่วยจำ ("did you mean") เวลาสะกดชื่อฟิลด์ในไฟล์เอเจนต์ผิด ซึ่งเป็นเครื่องมือ debug ที่ Module 4 จะใช้

> EN: Open Claude from the project folder. Labs run in the TUI. A set API key replaces the class subscription.

## Concept / เนื้อหา

โหมดทำงานสองแบบ (แผ่นอ้างอิง):

| โหมด | คำสั่ง | ใช้เมื่อ |
|---|---|---|
| TUI | `claude` | ทุกแล็บในห้อง |
| Print | `claude -p "โจทย์"` | เฉพาะขั้นที่แล็บเขียนตัวเลือก `--allowedTools` และ `--max-turns` ให้ |

ตัวแปรที่ต้องรู้จัก:

| ชื่อ | ผล |
|---|---|
| `ANTHROPIC_API_KEY` | ใช้แทนการล็อกอินบัญชี Pro/Team — ต้องว่างตอนเรียน |
| `PORT` | พอร์ตของ `server.js` และ quality gate — ค่าเริ่มต้น 3000 |
| `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` | จำนวนเอเจนต์ย่อยที่ทำงานพร้อมกันได้สูงสุด ค่าว่างคือค่าเริ่มต้น |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | ตั้งเป็น `1` เฉพาะตอนสาธิตทีม |

การตั้งค่าผู้ใช้รายเครื่องอยู่ที่ `~/.claude/settings.json` — ไฟล์ `settings.local.json` เป็นของเครื่องนั้น ไม่ควรเข้า git ส่วน Windows แล็บเขียนด้วย bash จึงใช้ Git Bash ไม่ใช่ PowerShell

ขั้นติดตั้งทั้งชุดอยู่ใน [SETUP.md](../../SETUP.md) — แล็บนี้แค่ตรวจว่าเครื่องผ่าน ไม่ได้อธิบายแนวคิดซ้ำ

## ลงมือทำตามลำดับ

ทุกขั้นพิมพ์ตามได้เลย ทำจากโฟลเดอร์รากของ repo:

1. ตรวจเวอร์ชัน:

```bash
claude --version
```

   ต้องได้ 2.1.296 ขึ้นไป — ต่ำกว่านี้รัน `claude update` ก่อน

2. ตรวจว่าคีย์ API ว่าง:

```bash
echo $ANTHROPIC_API_KEY
```

   ควรได้บรรทัดว่าง — ถ้าไม่ว่าง ให้ปิดค่านี้ก่อนเริ่มแล็บอื่น

3. เปิด TUI จากโฟลเดอร์ที่ถูกต้อง แล้ววาง prompt จากหัวข้อถัดไป:

```bash
cd sandbox/sales-insight
claude
```

4. คำตอบที่ผ่านคือข้อความ `CLAUDE-OK` เป๊ะ ๆ — แล้วลองตรวจของจริงก่อนไปต่อ: รัน `node server.js` ในเทอร์มินัลอื่น เปิด `http://localhost:3000` ได้ แล้วรัน `node scripts/quality-gate.js` — **ต้อง FAIL (exit 2) ตามออกแบบ** เพราะข้อมูลและตัวรับ POST ถูกปลูกไว้ให้แก้ใน Workshop 5 ไม่ใช่เครื่องคุณพัง

## Prompt pattern (EN / TH)

```text
EN: Reply with exactly: CLAUDE-OK
TH: ตอบกลับมาเป๊ะ ๆ ว่า: CLAUDE-OK
```

| ส่วน | หน้าที่ |
|---|---|
| exactly / เป๊ะ ๆ | บังคับรูปแบบคำตอบ เพื่อตรวจว่าเอเจนต์ฟังคำสั่งจริง |
| CLAUDE-OK | คำที่สคริปต์ตรวจได้ |

## Common pitfalls / กับดัก

- เปิด `claude` จาก `C:\` หรือ home — เอเจนต์เห็นทั้งเครื่องเป็นขอบเขตทำงาน ทำงานผิดที่ได้ทั้งรอบ
- ใช้ PowerShell 5.1 กับคำสั่งแล็บ (`export`, `echo $VAR`, `mkdir -p`) — คำสั่งพวกนี้เป็นของ bash ใช้ Git Bash
- alias `claude` เก่าหลังอัปเกรด Node — ชี้ไฟล์ที่ถูกลบไปแล้ว ต้องแก้ alias ให้ชี้ติดตั้งใหม่ (บันทึกเคสจริงอยู่ท้าย `instructor/source-material/module-02-environment-setup/lesson.md`)
- ตั้ง `--max-turns` ต่ำในการทดสอบ headless — หมดรอบก่อนมีคำตอบ
- ปล่อย `node server.js` ค้างแล้วรัน quality gate — เจอ **port busy** ปิดเซิร์ฟเวอร์ก่อนรัน gate เสมอ
- คิดว่า `claude -p` ให้สิทธิ์เท่า TUI — Bash กับ `.claude/**` ถูกปฏิเสธได้ในโหมดนี้

## Quick check / ทบทวน

<details>
<summary>1. ทำไมแล็บไม่เริ่มด้วย claude -p</summary>
แล็บต้องกดอนุญาตใน TUI เอง (เช่น อนุญาตเขียน `.claude/` หรือรัน Bash) — `claude -p` เป็น **headless** ไม่มีหน้าจอให้กด และมักบล็อก `.claude/**` กับ Bash
</details>

<details>
<summary>2. quality gate exit 2 วันแรกแปลว่าอะไร</summary>
**starter sandbox** ยัง **FAIL** (quality gate **exit 2**) ตามออกแบบ — ไม่ใช่เครื่องคุณพัง
</details>

<details>
<summary>3. ตรวจอะไรก่อนเปิด claude</summary>
เวอร์ชันอย่างน้อย 2.1.296 และ `ANTHROPIC_API_KEY` ว่าง
</details>

## Go deeper

- [SETUP.md](../../SETUP.md)
- [Failure modes](../../reference/failure-modes.md)
- บันทึก alias เก่าอยู่ท้าย `instructor/source-material/module-02-environment-setup/lesson.md`
