# Lab 0 — ตรวจเครื่อง

> ⏱ 25 นาที · Start state: clone สด

## Goal / เป้าหมาย

`node scripts/verify-setup.mjs` ผ่าน เปิดแอปได้ และstarter quality gate จบด้วย exit 2

## Steps / ขั้นตอน

1. เปิด PowerShell ที่ราก repo แล้วตรวจรุ่น

```powershell
node --version
git --version
claude --version
echo $env:ANTHROPIC_API_KEY
```

ผลที่คาดหวัง: Node เป็น 20 ขึ้นไป, Claude Code เป็น 2.1.296 ขึ้นไป, บรรทัดตัวแปรว่าง ถ้าคีย์โผล่ให้ปิดด้วย `Remove-Item Env:ANTHROPIC_API_KEY`

> 📚 **รู้เพิ่ม:** ทำไมคีย์ต้องว่าง — ถ้ามี `ANTHROPIC_API_KEY` ค้างอยู่ Claude จะใช้คีย์นั้นแทนบัญชี Pro/Team ของคลาสทันที และค่าใช้จ่ายไปโผล่ที่บัญชีส่วนตัวแบบจ่ายตามการใช้ โดยไม่มีกล่องเตือนให้เห็น

> 📚 **clone หรือ ZIP:** คำสั่ง `git status` / `git diff` ในแล็บทุกตัวต้องมีโฟลเดอร์ `.git` ซึ่งมีเฉพาะเมื่อ `git clone` — ถ้าคุณ download ZIP แทน ให้ทำ snapshot เริ่มต้นหนึ่งครั้งที่ราก repo: `git init` → `git add -A` → `git commit -m "start from zip"` แล้วทุกแล็บเทียบ "แตะไฟล์หรือยัง" กับจุดเริ่มนี้ได้ทั้งคอร์ส (แนะนำ clone มากกว่า — อัปเดตคอร์สด้วย `git pull` ได้)

2. ล็อกอินใน TUI

```powershell
claude
```

พิมพ์ `/status` แล้ว `/exit`

ผลที่คาดหวัง: เห็นบัญชีของคลาส ไม่ใช่โหมด API key

3. รันสคริปต์ตรวจ — ต้องอยู่ที่ราก repo (โฟลเดอร์ที่มี `scripts/`) เท่านั้น

```powershell
node scripts/verify-setup.mjs
```

ผลที่คาดหวัง: `verify-setup: passed` และมีบรรทัดว่าstarter quality gateเป็น exit 2

4. เปิดแอปคนละเทอร์มินัล

```powershell
node server.js
```

เปิด `http://127.0.0.1:3000` แล้วกลับมาหยุดด้วย Ctrl+C

ผลที่คาดหวัง: หน้าตาบอกว่าแดชบอร์ดยังไม่พร้อม

5. รัน quality gate หลังปิดเซิร์ฟเวอร์แล้ว

```powershell
node scripts/quality-gate.js
```

ผลที่คาดหวัง: exit 2, มี `FAIL | data-quality`, `FAIL | bad-json-does-not-crash`, `FAIL | summary-matches-valid-rows`

> 📚 **รู้เพิ่ม:** exit 2 วันนี้ไม่ใช่ความพังของเครื่อง — ข้อมูลใน `sales.csv` กับตัวรับ `POST /api/notes` ถูกปลูกปัญหาไว้ตั้งแต่โครงเริ่ม เพื่อให้ Workshop 5 มีงานแก้จริง คุณจะได้เห็น gate เปลี่ยนจากแดงเป็นเขียวด้วยตัวเองในบ่ายวันที่สอง

## ✅ Checkpoint

- [ ] `claude --version` ≥ 2.1.296
- [ ] `echo $env:ANTHROPIC_API_KEY` ว่าง
- [ ] `node scripts/verify-setup.mjs` ผ่าน
- [ ] หน้า `http://127.0.0.1:3000` เปิดได้และปิดเซิร์ฟเวอร์แล้ว
- [ ] quality gate เป็น exit 2 โดยไม่ได้แก้ไฟล์

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| `claude` ไม่พบ หรือชี้ไฟล์เก่า | PATH หรือ alias | ดู SETUP.md ขั้นที่ 2 |
| `fatal: not a git repository` ตอนรัน git | โฟลเดอร์มาจาก download ZIP (ไม่มี `.git`) | ทำ snapshot ตามหมายเหตุขั้นที่ 1 หรือ `git clone` ใหม่ |
| `Cannot find module .../verify-setup.mjs` | รันจากผิดโฟลเดอร์ (เช่นอยู่ในโฟลเดอร์แอป) หรือ clone จากสำเนาเก่า | กลับไปราก repo (โฟลเดอร์ที่มี `scripts/`) แล้วรันใหม่ ถ้าไม่มีไฟล์จริงให้ `git pull` หรือ clone ใหม่จาก main |
| port 3000 busy (port busy) | เซิร์ฟเวอร์ค้าง | Ctrl+C หรือ `$env:PORT=3001; node server.js` |
| quality gate แสดง port busy | ยังไม่ปิด `node server.js` | ปิดก่อนรัน `node scripts/quality-gate.js` |
| `claude -p` ไม่ตอบ CLAUDE-OK | ยังไม่ล็อกอิน หรือคีย์ API ทับ | ล็อกอินใน TUI แล้วปิดคีย์ (`Remove-Item Env:ANTHROPIC_API_KEY`) |
| คำสั่ง bash จากบทความอื่น (`export`, `echo $VAR`) | แล็บนี้ใช้ PowerShell | `$env:VAR` แทน `export` · `echo $env:VAR` |
| `claude --version` ต่างกันในแต่ละเทอร์มินัล | ติดตั้งซ้ำสองที่ (native + npm) อัปเดตไม่พร้อมกัน | เก็บตัวเดียว: `npm uninstall -g @anthropic-ai/claude-code` แล้วอัปเดตตัว native ด้วย `claude update` |
| อยากให้ quality gate exit 0 ภายในวันนี้ | ยังไม่ถึง Workshop 5 | ปล่อยให้แดงไว้ |

อย่าใช้ `--max-turns` สั้น ๆ กับการบ้านที่ต้องเขียนไฟล์ รอบจะหมดก่อนมีผลงาน และอย่าใช้ `taskkill /IM node.exe` (ฆ่า Node ทั้งเครื่อง) หรือ `taskkill //IM node.exe` (รูปแบบ Git Bash)

## 🆘 Behind? Catch up

ไม่มีไฟล์ของแล็บนี้ให้คัดลอก ถ้าสคริปต์ตรวจไม่ผ่านให้เรียกผู้สอนก่อน Workshop 1

## Stretch / ต่อยอด

รัน `node scripts/check-solutions.mjs` ดูว่าคำตอบอ้างอิงทั้งหกแล็บผ่าน ขณะที่ quality gate ในโฟลเดอร์แอปยังแดง

## Solution → solutions/w1/

Lab 0 ไม่มีโฟลเดอร์คำตอบ งานแรกที่ส่งคือ Workshop 1
