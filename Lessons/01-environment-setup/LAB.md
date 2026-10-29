# Lab 0 — ตรวจเครื่อง

> ⏱ machine ~3 นาที · Start state: clone สด (หรือ download ZIP + snapshot ตามหมายเหตุด้านล่าง)

## Goal / เป้าหมาย

`node scripts/verify-setup.mjs` ผ่าน ทั้งสอง repo พร้อม และ starter quality gate จบด้วย exit 2 — แล็บนี้ต้องจบก่อนแตะ claude ครั้งแรกของคอร์ส

## สองโลกของคอร์สนี้

งานทั้งหมดแบ่งอยู่สอง repo ที่แยกกัน:

| Repo | มีอะไร | คุณทำอะไรที่นี่ |
|---|---|---|
| **course repo** (โฟลเดอร์บทเรียนที่ clone มา) | บทเรียน แล็บ สคริปต์ตรวจ | อ่านแล็บ รัน `catch-up` / `check-solutions` และ `verify-setup` แบบครบสอง repo |
| **workshop repo** (`C:\dev\multi-agent-workshop`) | แอป Registry Insight ล้วน | รัน `claude` ตลอดคอร์ส · รัน `npm run verify` / `npm start` / `npm run gate` · ผลงานทุกชิ้นอยู่ที่นี่ |

ที่ course repo จงใจ**ไม่มีโค้ดแอป** — เมื่อคุณรัน claude ที่ workshop repo agent จะเห็นเฉพาะแอป ไม่เห็นเฉลยหรือเนื้อหาบทเรียน

## Steps / ขั้นตอน

1. เปิด PowerShell ที่ course repo (โฟลเดอร์บทเรียน ที่มี `Lessons/`) แล้วตรวจรุ่น

```powershell
node --version
git --version
claude --version
echo $env:ANTHROPIC_API_KEY
```

ผลที่คาดหวัง: Node เป็น 20 ขึ้นไป, Claude Code เป็น 2.1.296 ขึ้นไป, บรรทัดตัวแปรว่าง ถ้าคีย์โผล่ให้ปิดด้วย `Remove-Item Env:ANTHROPIC_API_KEY`

> 📚 **รู้เพิ่ม:** ทำไมคีย์ต้องว่าง — ถ้ามี `ANTHROPIC_API_KEY` ค้างอยู่ Claude จะใช้คีย์นั้นแทนบัญชี Pro/Team ของคลาสทันที และค่าใช้จ่ายไปโผล่ที่บัญชีส่วนตัวแบบจ่ายตามการใช้ โดยไม่มีกล่องเตือนให้เห็น

2. clone workshop repo — ใช้ URL ที่ผู้สอนแจ้ง

```powershell
git clone <URL-workshop-repo> C:\dev\multi-agent-workshop
```

ผลที่คาดหวัง: ได้โฟลเดอร์ `C:\dev\multi-agent-workshop` ที่มี `package.json`, `server.js`, `data/`, `web/`

> 📚 **`package.json` คืออะไร (ไม่ต้องเป็น dev):** ไฟล์ชื่อเมนูคำสั่งของโปรเจกต์นี้ · เปิดดูจะเจอหัวข้อ `"scripts"` ซึ่งเป็น**ชื่อเล่น**ที่ผูกกับคำสั่งจริง เช่น `"start"` → `node server.js` · `"gate"` → `node scripts/quality-gate.js` · พอพิมพ์ `npm run gate` แปลว่า “เปิดเมนูแล้วกดรายการ gate” — คุณไม่ต้องจำ path ยาว ๆ ของสคริปต์ · **ห้ามแก้** `scripts/quality-gate.js` เพื่อให้ผ่าน (แอบแก้ข้อสอบ) แต่**อ่าน** `package.json` ได้เต็มที่

> 📚 **รู้เพิ่ม:** ทุกคำสั่งในแล็บถัด ๆ ไปเขียน path ตายตัวไว้ที่ `C:\dev\multi-agent-workshop` เพื่อให้ copy-paste ได้ทั้งคอร์ส · `catch-up` / `verify-setup` (course) / `check-solutions` ชี้ path นี้เป็นค่าเริ่มต้น · ถ้าเก็บคนละที่ ให้ copy `.env.example` → `.env` แล้วแก้ `WORKSHOP_DIR` (หรือตั้ง `$env:WORKSHOP_DIR`) — แนะนำ path ตายตัว

> 📚 **clone หรือ ZIP (course repo):** คำสั่ง `git status` / `git diff` ในแล็บต้องอาศัยโฟลเดอร์ `.git` ซึ่งมีเฉพาะเมื่อ `git clone` — ถ้าคุณ download ZIP ของ course repo แทน ให้ทำ snapshot เริ่มต้นหนึ่งครั้งที่ course repo: `git init` → `git add -A` → `git commit -m "start from zip"` แล้วทุกแล็บเทียบ "แตะไฟล์บทเรียนหรือยัง" กับจุดเริ่มนี้ได้ทั้งคอร์ส (แนะนำ clone มากกว่า — อัปเดตคอร์สด้วย `git pull` ได้)

3. ล็อกอินใน TUI

```powershell
claude
```

พิมพ์ `/status` แล้ว `/exit`

ผลที่คาดหวัง: เห็นบัญชีของคลาส ไม่ใช่โหมด API key

4. รันสคริปต์ตรวจที่ **workshop repo** ก่อน (โฟลเดอร์แอป — มี `server.js`)

```powershell
cd C:\dev\multi-agent-workshop
npm run verify
```

ผลที่คาดหวัง: `verify-setup (workshop): passed` และ starter quality gate เป็น exit 2

> 📚 **รู้เพิ่ม:** สคริปต์ชื่อเดียวกันมีสองที่ — รันในโฟลเดอร์ไหนได้ผลของโฟลเดอร์นั้น · ที่ workshop ตรวจเครื่อง+บูตแอป · ที่ course (ขั้นถัดไป) ตรวจว่าเจอ workshop ตาม `WORKSHOP_DIR` ด้วย

5. (แนะนำ) รันสคริปต์ตรวจครบสอง repo ที่ **course repo** (โฟลเดอร์ที่มี `Lessons/`)

```powershell
cd <path-to-course-repo>
node scripts/verify-setup.mjs
```

ผลที่คาดหวัง: `verify-setup: passed` พร้อมบรรทัด `workshop project found` และ starter quality gate เป็น exit 2

6. เปิดแอปคนละเทอร์มินัล — **ใน workshop project**

```powershell
cd C:\dev\multi-agent-workshop
npm start
```

เปิด `http://127.0.0.1:3000` แล้วกลับมาหยุดด้วย Ctrl+C

ผลที่คาดหวัง: หน้าบอกว่าแดชบอร์ด**ยังไม่พร้อม** และ**ไม่มีตัวเลขตั้งต้นที่ใช้ได้** (เช่น จำนวนกิจการเป็น 0 หรือไม่โชว์ยอดจริง) — นี่คือสถานะ Initial ตามดีไซน์ ไม่ใช่เครื่องพัง

7. รัน quality gate หลังปิดเซิร์ฟเวอร์แล้ว — ยังอยู่ใน workshop project

```powershell
npm run gate
```

ผลที่คาดหวัง: exit 2, แดง **0/6** — `FAIL | data-quality`, `FAIL | bad-json-does-not-crash`, `FAIL | summary-matches-valid-rows`, `FAIL | health-no-secrets`, `FAIL | notes-validation`, `FAIL | notes-persists`

> 📚 **รู้เพิ่ม (ทาง A — คงบาร์ Initial):** อย่าพยายามทำให้ gate เขียวใน Lab 0 และอย่าคาดหวังยอดสรุปจริงตอนเริ่ม คอร์สตั้งใจให้ **ไม่มีข้อมูลตั้งต้นที่ใช้งานได้** บนหน้าเว็บจนกว่าจะผ่าน Workshop 3–4 · ไฟล์ดิบใน `data/` กับบั๊กใน `server.js` ถูกปลูกไว้ให้แดงครบ 6 เคส · เส้นทางคือ 0/6 → 2/6 (หลัง W3) → 6/6 (หลัง W4) — ห้าม sync ไฟล์สะอาดหรือแก้ gate บน branch `main`

## ✅ Checkpoint

- [ ] `claude --version` ≥ 2.1.296
- [ ] `echo $env:ANTHROPIC_API_KEY` ว่าง
- [ ] `C:\dev\multi-agent-workshop` มี `package.json` และ `server.js`
- [ ] `npm run verify` ผ่านที่ workshop repo (`verify-setup (workshop): passed`)
- [ ] (แนะนำ) `node scripts/verify-setup.mjs` ผ่านที่ course repo ด้วย
- [ ] หน้า `http://127.0.0.1:3000` เปิดได้และปิดเซิร์ฟเวอร์แล้ว
- [ ] quality gate เป็น exit 2 โดยไม่ได้แก้ไฟล์

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| `claude` ไม่พบ หรือชี้ไฟล์เก่า | PATH หรือ alias | ดู SETUP.md ขั้นที่ 2 |
| `fatal: not a git repository` ตอนรัน git ที่ course repo | โฟลเดอร์มาจาก download ZIP (ไม่มี `.git`) | ทำ snapshot ตามหมายเหตุขั้นที่ 1 หรือ `git clone` ใหม่ |
| `verify-setup` FAIL ว่า workshop project not found | ยังไม่ได้ clone workshop repo หรือ clone ไว้คนละ path | clone ตามขั้นที่ 2 หรือตั้ง `$env:WORKSHOP_DIR` ชี้โฟลเดอร์ที่ clone ไว้แล้วรันใหม่ |
| `Cannot find module .../verify-setup.mjs` | รันจากโฟลเดอร์ที่ไม่มีสคริปต์ หรือ clone เก่า | ที่ workshop ใช้ `npm run verify` · ที่ course ใช้ `node scripts/verify-setup.mjs` ในโฟลเดอร์ที่มี `Lessons/` · `git pull` ถ้ายังไม่มีไฟล์ |
| `this folder looks like the course repo` จาก workshop verify | รัน `npm run verify` ใน course โดยผิด | `cd C:\dev\multi-agent-workshop` แล้วรันใหม่ |
| port 3000 busy (port busy) | เซิร์ฟเวอร์ค้าง | Ctrl+C หรือ `$env:PORT=3001; npm start` (ใน workshop repo) |
| quality gate แสดง port busy | ยังไม่ปิดเซิร์ฟเวอร์ | ปิดก่อนรัน `npm run gate` |
| `claude -p` ไม่ตอบ CLAUDE-OK | ยังไม่ล็อกอิน หรือคีย์ API ทับ | ล็อกอินใน TUI แล้วปิดคีย์ (`Remove-Item Env:ANTHROPIC_API_KEY`) |
| คำสั่ง bash จากบทความอื่น (`export`, `echo $VAR`) | แล็บนี้ใช้ PowerShell | `$env:VAR` แทน `export` · `echo $env:VAR` |
| `claude --version` ต่างกันในแต่ละเทอร์มินัล | ติดตั้งซ้ำสองที่ (native + npm) อัปเดตไม่พร้อมกัน | เก็บตัวเดียว: `npm uninstall -g @anthropic-ai/claude-code` แล้วอัปเดตตัว native ด้วย `claude update` |
| อยากให้ quality gate exit 0 ภายในวันนี้ | ยังไม่ถึง Workshop 3–4 | ปล่อยให้แดง 0/6 ไว้ |

อย่าใช้ `--max-turns` สั้น ๆ กับการบ้านที่ต้องเขียนไฟล์ รอบจะหมดก่อนมีผลงาน และอย่าใช้ `taskkill /IM node.exe` (ฆ่า Node ทั้งเครื่อง) หรือ `taskkill //IM node.exe` (รูปแบบ Git Bash)

## 🆘 Behind? Catch up

ไม่มีไฟล์ของแล็บนี้ให้คัดลอก ถ้าสคริปต์ตรวจไม่ผ่านให้เรียกผู้สอนก่อน Workshop 1

## Stretch / ต่อยอด

รัน `node scripts/check-solutions.mjs` (ที่ course repo) ดูว่าคำตอบอ้างอิงทั้งเก้าแล็บผ่าน ขณะที่ quality gate ใน workshop repo ยังแดง 0/6

## Solution → solutions/w1/

Lab 0 ไม่มีโฟลเดอร์คำตอบ งานแรกที่ส่งคือ Workshop 1
