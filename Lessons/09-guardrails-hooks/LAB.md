# Workshop 7 — Guardrails ครบ: hook + cost gate

> ⏱ machine ~10 นาที · Start state: อยู่ใน workshop repo · quality gate 6/6 exit 0 จาก Workshop 4 · แอปใช้งานได้ครบ

## Goal / เป้าหมาย

มี hook ที่บล็อกคำสั่งอันตราย (exit 2) ที่ยืนยันแล้วทั้งด้วยมือและผ่าน Claude เอง และ cost gate ที่ทดสอบได้โดยไม่ต้องเปิด Claude — พร้อมยืนยันว่า gate ยังเขียวครบ 6/6 ก่อนเริ่ม feature ใน Workshop 8

## สังเกต handoff

| จาก | ไฟล์ | ถึง |
|---|---|---|
| Workshop 4 (QA-REPORT finding ที่ 2) | รายงานความเสี่ยง | hook ที่สร้างวันนี้บังคับซ้ำ |
| hook (`block-dangerous-bash.js`) | exit 2 + เหตุผลบน stderr | Claude Code อ่านแล้วบล็อกก่อนคำสั่งรัน |
| `usage.json` | ตัวเลขจริงจากห้อง | cost gate ตัดสินผ่าน/ไม่ผ่าน |

## Steps / ขั้นตอน

1. ยืนยันเริ่มงานว่า gate ยังเขียวครบ

```powershell
npm run gate
```

ผลที่คาดหวัง: `quality gate: 6/6 passed` exit 0

> 📚 **`npm run gate` = กดปุ่มใน `package.json`:** เปิดไฟล์ที่ราก workshop จะเห็น `"gate": "node scripts/quality-gate.js"` — คุณไม่ได้พิมพ์ path ยาว แต่ระบบไปรันตัวตรวจให้ · ห้ามแก้ไฟล์นั้นเพื่อให้เขียว

2. สร้าง hook ใน TUI (เลือกอย่างใดอย่างหนึ่ง) แล้วกดอนุญาตเมื่อเขียน `.claude/`

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Create .claude/hooks/block-dangerous-bash.js: a Node script that reads a JSON payload from stdin with fields tool_name and tool_input.command. If the command contains rm -rf, taskkill, or Remove-Item -Recurse, print "blocked dangerous command: <command>" to stderr and exit with code 2. Otherwise exit 0 silently. Then bind it in .claude/settings.json as a PreToolUse hook matcher for the Bash tool.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
สร้าง .claude/hooks/block-dangerous-bash.js: สคริปต์ Node อ่าน JSON จาก stdin มีฟิลด์ tool_name กับ tool_input.command ถ้าคำสั่งมี rm -rf, taskkill หรือ Remove-Item -Recurse ให้พิมพ์ "blocked dangerous command: <command>" ลง stderr แล้ว exit code 2 ถ้าไม่ใช่ exit 0 เงียบ ๆ จากนั้นผูกใน .claude/settings.json เป็น PreToolUse hook matcher ของเครื่องมือ Bash
```

> 📚 **รู้เพิ่ม:** exit code 2 คือการบล็อก — exit อื่นไม่บล็อก และเหตุผลของการบล็อกต้องเขียนที่ stderr เพราะ stdout ของ hook ถูกอ่านต่อเป็นคำสั่ง

3. ทดสอบ hook ด้วยมือคุณเอง — เขียน payload เป็นไฟล์แล้วป้อนเข้า stdin (PowerShell 5.1 ส่งข้อความผ่าน pipe ไป native process ได้ไม่ตรง):

```powershell
[IO.File]::WriteAllText("$pwd\payload-block.json", '{"tool_name":"Bash","tool_input":{"command":"rm -rf data"}}', (New-Object System.Text.UTF8Encoding($false)))
$proc = Start-Process node -ArgumentList ".claude/hooks/block-dangerous-bash.js" -RedirectStandardInput "payload-block.json" -NoNewWindow -Wait -PassThru
$proc.ExitCode
```

ผลที่คาดหวัง: `blocked dangerous command: rm -rf data` และ exit 2

> 📚 **รู้เพิ่ม (กับดัก PowerShell จริง):** `echo '...' | node hook.js` ใน PowerShell 5.1 ส่ง payload พัง (hook ขึ้น "malformed payload" แล้ว exit 0 — แปลว่า**ไม่ได้ทดสอบอะไรเลย**) และ `Set-Content -Encoding UTF8` ใส่ BOM นำหน้าไฟล์ ทำ `JSON.parse` ใน Node พัง — เขียนไฟล์แบบไม่มี BOM ด้วย `UTF8Encoding($false)` แล้วป้อนด้วย `Start-Process -RedirectStandardInput` จึงเชื่อถือได้

4. ทดสอบฝั่งปล่อยผ่าน

```powershell
[IO.File]::WriteAllText("$pwd\payload-allow.json", '{"tool_name":"Bash","tool_input":{"command":"npm run gate"}}', (New-Object System.Text.UTF8Encoding($false)))
$proc = Start-Process node -ArgumentList ".claude/hooks/block-dangerous-bash.js" -RedirectStandardInput "payload-allow.json" -NoNewWindow -Wait -PassThru
$proc.ExitCode
```

ผลที่คาดหวัง: ไม่มีข้อความบล็อก และ exit 0

5. ทดสอบผ่าน Claude เอง — ขั้น 3–4 พิสูจน์แค่สคริปต์ Node ลอย ๆ ขั้นนี้พิสูจน์ว่า Claude Code เรียก hook เองก่อนคำสั่งรันจริง

สร้างโฟลเดอร์ทิ้งได้ไว้ก่อน เผื่อ hook ยังไม่ถูกผูก ของจริงใน repo จะไม่หาย:

```powershell
New-Item -ItemType Directory -Force hook-test-dummy | Out-Null
```

แล้ววางในเซสชัน TUI (เปิดใหม่หลังเขียน `settings.json` เสร็จก็ได้):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Run this exact bash command: rm -rf hook-test-dummy
```

ถ้ามีกล่องขออนุญาตรันคำสั่ง ให้กดอนุญาต — ตัวที่บล็อกต่อจากนั้นต้องเป็น hook ไม่ใช่คุณ

ผลที่คาดหวัง: Claude รายงานว่าคำสั่งถูกบล็อกพร้อมเหตุผลที่อ่านได้ (`blocked dangerous command: rm -rf hook-test-dummy`) และยืนยันด้วยมือว่าโฟลเดอร์ยังอยู่:

```powershell
Test-Path hook-test-dummy
```

ผลที่คาดหวัง: `True`

> 📚 **รู้เพิ่ม:** ต่างจากขั้น 3 ตรงที่ payload ไม่ได้มาจากมือคุณ — Claude Code เป็นคนป้อนให้ hook เองทุกครั้งก่อนคำสั่งรัน นี่คือหลักฐานว่ากฎบังคับได้จริงแม้ไม่มีใครเฝ้า · อย่าทดสอบด้วย `rm -rf data` ตรง ๆ เพราะถ้า hook ยังไม่ผูก ข้อมูลชุดสะอาดจาก Workshop 4 หายเลย

6. cost gate — เขียน `usage.json` ด้วยตัวเลขฝึก (เขียนแบบไม่มี BOM) แล้วรัน

```powershell
[IO.File]::WriteAllText("$pwd\usage.json", '{"total_cost_usd":0.5,"usage":{"output_tokens":1000}}', (New-Object System.Text.UTF8Encoding($false)))
node scripts/cost-gate.js usage.json
```

ผลที่คาดหวัง: `PASS | cost-gate` และ exit 0 เมื่อต่ำกว่า 2 USD และต่ำกว่า 20000 output token

7. ทดสอบฝั่งเกินงบ — ตั้ง `total_cost_usd` เป็น 3

```powershell
[IO.File]::WriteAllText("$pwd\usage.json", '{"total_cost_usd":3,"usage":{"output_tokens":1000}}', (New-Object System.Text.UTF8Encoding($false)))
node scripts/cost-gate.js usage.json
```

ผลที่คาดหวัง: `FAIL | cost-gate | total_cost_usd 3 > 2` และ exit 2

> 📚 **เช็คก่อนรัน:** `scripts/cost-gate.js` ยังไม่อยู่ใน starter — ได้มาหลังรัน `node scripts/catch-up.js w7` หรือคัดลอกจาก `solutions/w7/drop-in/scripts/cost-gate.js` (ตรวจจริง: ถ้ายังไม่มีไฟล์ `node scripts/cost-gate.js` จะขึ้น `MODULE_NOT_FOUND`)

8. ยืนยันปิดท้าย: gate ยังเขียวครบ — พร้อมเข้า Workshop 8

```powershell
npm run gate
```

## ✅ Checkpoint

- [ ] `.claude/hooks/block-dangerous-bash.js` บล็อก `rm -rf` (exit 2) และปล่อย `npm run gate` (exit 0)
- [ ] สั่งผ่าน Claude ใน TUI แล้วเห็น hook เป็นคนบล็อก (ไม่ใช่คุณกด deny เอง) และโฟลเดอร์ทดสอบยังอยู่
- [ ] `.claude/settings.json` ผูก PreToolUse กับ Bash แล้ว
- [ ] cost gate exit 0 เมื่อต่ำกว่าเพดาน และ exit 2 เมื่อเกิน
- [ ] รู้ว่าเพดาน 2 USD เป็นค่าสอน — จดตัวเลขจริงของห้องแล้วปรับเองภายหลัง

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| hook ขึ้น malformed payload แล้ว exit 0 | payload พังจาก pipe ของ PowerShell 5.1 | ใช้ไฟล์ + `Start-Process -RedirectStandardInput` ตามขั้น 3 |
| สั่งผ่าน Claude แล้วคำสั่งรันจริง (ไม่โดนบล็อก) | เซสชันเปิดก่อน hook ถูกเขียน หรือ `settings.json` ไม่อยู่ที่ราก workshop | ตรวจ `.claude/settings.json` ที่ราก workshop repo แล้วเปิดเซสชัน TUI ใหม่ |
| `JSON.parse` พังทั้งที่ JSON ถูก | BOM จาก `Set-Content -Encoding UTF8` | ใช้ `UTF8Encoding($false)` |
| `Cannot find module .../cost-gate.js` | ยังไม่มีสคริปต์ | catch-up `w7` หรือคัดลอกจาก `solutions/w7/drop-in/scripts/` |
| gate ไม่ 6/6 | ข้อมูลหรือเซิร์ฟเวอร์ไม่ใช่ชุด Workshop 3/4 | catch-up `w3` แล้ว `w4` |
| ห้องไม่ได้ใช้ PowerShell | อยู่บน Git Bash | `echo '{"tool_name":...}' | node hook.js` ใช้ได้ตรง ๆ บน bash |

## 🆘 Behind? Catch up

จาก course repo (ไฟล์ถูก copy ลง workshop repo):

```bash
node scripts/catch-up.js w7
```

ได้ hook, settings.json, cost gate และ `data/dataset.csv` ชุดสะอาด

## Stretch / ต่อยอด

เพิ่ม pattern บล็อกอันตรายอีกหนึ่งอย่างจากงานจริงของห้อง (เช่น `git push --force` หรือ `Remove-Item -Force`) ลงใน hook แล้วทดสอบด้วย payload ใหม่ให้เห็น exit 2 — และปรับเพดาน cost gate ตามตัวเลขจริงของห้อง

## Solution → solutions/w7/

ตรวจด้วย `node solutions/w7/check.js` (จาก course repo)
