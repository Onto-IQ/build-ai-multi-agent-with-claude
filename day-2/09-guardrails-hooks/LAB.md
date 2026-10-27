# Workshop 5 — Quality gate และ cost gate

> ⏱ 40 นาที · Start state: มีตัวทำความสะอาดจาก Workshop 4 quality gate ยังไม่เขียวครบ (ตามออกแบบ)

## Goal / เป้าหมาย

`node scripts/quality-gate.js` จบด้วย exit 0 และมี hook กับcost gateที่ทดสอบได้โดยไม่ต้องเปิด Claude

## Steps / ขั้นตอน

1. ใน Git Bash ให้เห็นของแดงก่อนลงมือ

```bash
node scripts/quality-gate.js
```

ผลที่คาดหวัง: exit 2 และสามบรรทัด FAIL

> 📚 **รู้เพิ่ม:** ดูหน้าตาของ "แดง" ก่อนแก้เสมอ — ถ้าไม่รู้ว่าเคสไหนแดงอย่างไร คุณจะไม่มีทางรู้ว่าการแก้ของคุณเปลี่ยนอะไร รายงานรอบนี้คือ baseline ที่ขั้นถัดไปจะเทียบด้วย

2. เปิด TUI แล้ววาง prompt (เลือกอย่างใดอย่างหนึ่ง) กดอนุญาตเมื่อจะเขียน `server.js` หรือทับ CSV:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
scripts/quality-gate.js currently FAILS. Replace data/sales.csv with a cleaned file and change server.js only enough that all three cases pass. Do not edit scripts/quality-gate.js. Then show me the command output.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
scripts/quality-gate.js ตอนนี้ FAIL ให้แทนที่ data/sales.csv ด้วยไฟล์ที่สะอาด และแก้ server.js น้อยที่สุดจน quality gate สามเคสผ่าน ห้ามแก้ scripts/quality-gate.js แล้วแสดงผลคำสั่งให้ดู
```

ผลที่คาดหวัง: `data/sales.csv` เป็นชุดที่สะอาด และ `POST /api/notes` ไม่ทำให้โปรเซสตาย

3. ปิดเซิร์ฟเวอร์ที่ค้าง แล้วรัน quality gateเอง

```bash
node scripts/quality-gate.js
```

ผลที่คาดหวัง: `quality gate: 3/3 passed` และ exit 0

> 📚 **รู้เพิ่ม:** นี่คือกฎการเชื่อของบทบาท qa ที่ Capstone จะใช้ต่อ — คำว่า "ผ่าน" ของเอเจนต์ไม่ใช่หลักฐาน exit code จากเทอร์มินัลของคุณเท่านั้นที่นับ

4. ให้ Claude เพิ่ม hook ใน TUI ตามแบบในบทเรียน หรือคัดลอกจากคำตอบอ้างอิงหลังคุณเขียนเองไม่ทัน แล้วลองด้วยมือ — เขียน payload เป็นไฟล์แล้วป้อนเข้า stdin (PowerShell 5.1 ส่งข้อความผ่าน pipe ไป native process ได้ไม่ตรง):

```powershell
[IO.File]::WriteAllText("$pwd\payload-block.json", '{"tool_name":"Bash","tool_input":{"command":"rm -rf data"}}', (New-Object System.Text.UTF8Encoding($false)))
$proc = Start-Process node -ArgumentList ".claude/hooks/block-dangerous-bash.js" -RedirectStandardInput "payload-block.json" -NoNewWindow -Wait -PassThru
$proc.ExitCode
```

ผลที่คาดหวัง: `blocked dangerous command: rm -rf data` และ exit 2

```powershell
[IO.File]::WriteAllText("$pwd\payload-allow.json", '{"tool_name":"Bash","tool_input":{"command":"node scripts/quality-gate.js"}}', (New-Object System.Text.UTF8Encoding($false)))
$proc = Start-Process node -ArgumentList ".claude/hooks/block-dangerous-bash.js" -RedirectStandardInput "payload-allow.json" -NoNewWindow -Wait -PassThru
$proc.ExitCode
```

ผลที่คาดหวัง: ไม่มีข้อความบล็อก และ exit 0

> 📚 **รู้เพิ่ม (กับดัก PowerShell จริง):** `echo '...' | node hook.js` ใน PowerShell 5.1 ส่ง payload พัง (hook ขึ้น "malformed payload" แล้ว exit 0 — แปลว่า**ไม่ได้ทดสอบอะไรเลย**) และ `Set-Content -Encoding UTF8` ของ PowerShell ใส่ BOM นำหน้าไฟล์ ทำ `JSON.parse` ใน Node พัง — เขียนไฟล์แบบไม่มี BOM ด้วย `UTF8Encoding($false)` แล้วป้อนด้วย `Start-Process -RedirectStandardInput` จึงเชื่อถือได้

> 📚 **รู้เพิ่ม:** exit code 2 คือการบล็อก — exit อื่นไม่บล็อก และเหตุผลของการบล็อกต้องเขียนที่ stderr เพราะ stdout ของ hook ถูกอ่านต่อเป็นคำสั่ง

5. เขียน `usage.json` จาก `/cost` ใน TUI ถ้ามี หรือใส่ตัวเลขฝึก — เขียนด้วย PowerShell แบบไม่มี BOM:
`[IO.File]::WriteAllText("$pwd\usage.json", '{"total_cost_usd":0.5,"usage":{"output_tokens":1000}}', (New-Object System.Text.UTF8Encoding($false)))` แล้วรัน

> 📚 **เช็คก่อนรัน:** `scripts/cost-gate.js` ยังไม่อยู่ใน starter — ได้มาหลังรัน `node scripts/catch-up.js w5` หรือคัดลอกจาก `solutions/w5/drop-in/scripts/cost-gate.js` (ตรวจจริง: ถ้ายังไม่มีไฟล์ `node scripts/cost-gate.js` จะขึ้น `MODULE_NOT_FOUND`)

```bash
node scripts/cost-gate.js usage.json
```

ผลที่คาดหวัง: exit 0 เมื่อต่ำกว่า 2 USD และต่ำกว่า 20000 output token ไฟล์ที่ตั้ง `total_cost_usd` เป็น 3 ต้องได้ exit 2

บน Git Bash `echo $?` ใช้ได้ ถ้าอยู่ใน PowerShell ให้กลับไป Git Bash

## ✅ Checkpoint

- [ ] quality gate exit 0 โดยไม่ได้แก้ `scripts/quality-gate.js`
- [ ] `POST` ที่ไม่ใช่ JSON ไม่ทำให้เซิร์ฟเวอร์ตาย
- [ ] hook บล็อก `rm -rf` และปล่อย `node scripts/quality-gate.js`
- [ ] cost gate exit 2 เมื่อเกิน 2 USD
- [ ] รู้ว่าเพดาน 2 USD ยังไม่ใช่ตัวเลขจากรัน TUI ของห้อง

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| port busy | เซิร์ฟเวอร์ยังฟัง 3000 | ปิดก่อน หรือ `PORT=3001 node scripts/quality-gate.js` |
| quality gate exit 0เพราะแก้ไฟล์ `scripts/quality-gate.js` | แก้ตัวตรวจ | คืนไฟล์ `scripts/quality-gate.js`จาก git |
| headless ไม่รัน quality gate | Bash ถูกปฏิเสธ | รัน `node scripts/quality-gate.js`เองหลัง TUI เขียนไฟล์ |
| หมดเทิร์นก่อนมี try/catch | `--max-turns` ต่ำ | อยู่ใน TUI และสั่งว่าห้ามสำรวจซ้ำ |
| `echo $?` ไม่ทำงาน | PowerShell | ใช้ Git Bash |
| ฆ่า Node ไม่ได้แบบปลอดภัย | ใช้ taskkill ทั้งภาพ | ปิดเฉพาะหน้าต่างที่รันเซิร์ฟเวอร์ |
| คีย์ API ทับบัญชี | `ANTHROPIC_API_KEY` | unset ก่อนเปิด TUI |

การที่ hook จะถูก Claude เรียกเองต้องมีบล็อกใน `.claude/settings.json` สคริปต์อย่างเดียวยังไม่ทำงานใน TUI จนกว่าจะผูกเหตุการณ์ `PreToolUse` กับ `TaskCompleted` การผูกในของจริงยังต้องมีคนกดเดินใน TUI หนึ่งรอบ

## 🆘 Behind? Catch up

```bash
node scripts/catch-up.js w5
```

คำสั่งนี้ทับ `data/sales.csv` และ `server.js` ด้วยชุดที่ quality gate ผ่าน แล้วได้ hook กับ cost gate (`scripts/cost-gate.js`) (`scripts/cost-gate.js`)

## Stretch / ต่อยอด

เอา `sampleToken` ออกจาก `/api/health` ก่อนถึง Workshop 6 quality gate สามเคสไม่ได้บังคับข้อนี้

## Solution → solutions/w5/

`node solutions/w5/check.js`
