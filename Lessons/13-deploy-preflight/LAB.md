# Lab — จากบัญชี Vercel ถึง Deploy (Module 13: Deploy & Pre-flight)

> ⏱ machine ~15–20 นาที · Start state: อยู่ใน workshop repo · quality gate exit 0 มีแดชบอร์ดจาก Workshop 9 และ feature จาก Workshop 8

## Goal / เป้าหมาย

เดินครบสี่ช่วง: **(1) สมัคร/ล็อกอิน Vercel → (2) preflight ในเครื่อง → (3) ล็อกอิน Vercel CLI ผ่าน Prompt → (4) Deploy ผ่าน Prompt (CLI)** แล้วเก็บหลักฐาน URL + commit  
**ไม่ใช้ Vercel MCP** ในแล็บนี้ — กันสถานะ `Needs authentication` / connector ซ้ำกับ `claude.ai Vercel`  
ถ้าห้องนี้ผู้สอนสั่งหยุดก่อนขึ้นของจริง ให้จบหลังช่วง 2–3 พร้อมผล gate

## ภาพรวมลำดับ

| ขั้น | ทำอะไร | ผลที่ต้องมี |
|---|---|---|
| 1 | สร้างบัญชี Vercel (Hobby ฟรี) | ล็อกอินแดชบอร์ดได้ |
| 2–4 | preflight ในเครื่อง | gate 6/6 · health ไม่มี `sk-` · คีย์ว่าง · ปิดเซิร์ฟเวอร์ |
| 5 | Prompt ล็อกอิน **Vercel CLI** (ไม่แตะ MCP) | `npx vercel whoami` ขึ้นชื่อบัญชี |
| 6 | Prompt Deploy ด้วย CLI | production URL + commit |
| 7 | เปิด URL ยืนยัน | หน้าแดชบอร์ดขึ้นจริง |

> ถ้าเคยเพิ่ม MCP ชื่อ `vercel` จากรอบเก่า ให้ลบก่อนเริ่มขั้น 5: `claude mcp remove vercel -s local` (ไม่ต้องแตะ connector `claude.ai Vercel` ถ้ามี — แล็บนี้ไม่ใช้)

---

## Steps / ขั้นตอน

### 1) สร้างบัญชี Vercel (หรือล็อกอินถ้ามีแล้ว)

ทำใน**เบราว์เซอร์** — ไม่ผ่าน Claude:

1. เปิด [https://vercel.com/signup](https://vercel.com/signup)
2. สมัครด้วย GitHub / Google / Email (แนะนำ GitHub)
3. เลือกแผน **Hobby** (ฟรี · งานส่วนตัว/เรียน) — **อย่า**กดลิงก์ที่ขึ้น Pro trial โดยไม่ตั้งใจ
4. ยืนยันอีเมล/OTP ถ้ามี จนเข้าแดชบอร์ด `https://vercel.com/dashboard` ได้

ผลที่คาดหวัง: เห็นแดชบอร์ด Vercel · ยัง**ไม่ต้อง**สร้างโปรเจกต์ด้วยมือในขั้นนี้

> 📚 **รู้เพิ่ม:** บัญชีนี้จะใช้ตอน `vercel login` ในขั้น 5 · สมัครกลางชั่วโมง deploy มักไม่ทัน

### 2) Preflight — quality gate

ปิด `npm start` ถ้ายังเปิดอยู่ แล้วรัน:

```powershell
npm run gate
```

ผลที่คาดหวัง: `quality gate: 6/6 passed`

> 📚 **รู้เพิ่ม:** ของที่แดงขึ้นของจริง คือของเสียที่คนภายนอกเห็นก่อนเรา — quality gate จึงเป็นด่านเดียวที่ตัดสินได้ว่าพร้อมหรือยัง ไม่ใช่ความมั่นใจของเอเจนต์

### 3) Preflight — `/api/health` ไม่มี `sk-` แล้วปิดเซิร์ฟเวอร์

ใช้พอร์ต **3001** กันชนกับของที่อาจค้างที่ 3000 · แล็บนี้รันใน **PowerShell** (อย่าวาง `PORT=3001 npm start` — นั่นคือ bash จะขึ้น error)

**เทอร์มินัล A — สตาร์ทเซิร์ฟเวอร์:**

```powershell
$env:PORT = 3001; npm start
```

**เทอร์มินัล B — เรียก health แล้วตรวจว่าไม่มี `sk-`:**

```powershell
$h = Invoke-RestMethod http://127.0.0.1:3001/api/health
$h | ConvertTo-Json -Compress
($h | ConvertTo-Json -Compress) -match 'sk-'
```

ผลที่คาดหวัง: JSON ประมาณ `{"ok":true}` · บรรทัด `-match 'sk-'` เป็น `False` · แล้วกลับไปเทอร์มินัล A กด **Ctrl+C** ปิดเซิร์ฟเวอร์

> 📚 **รู้เพิ่ม:** พอร์ต 3001 คือการตรวจของใหม่โดยไม่ง้อเซิร์ฟเวอร์เก่า · บน Git Bash / macOS / Linux ใช้ `PORT=3001 npm start` กับ `curl -s http://127.0.0.1:3001/api/health` ได้ตามเดิม

### 4) Preflight — คีย์ Anthropic ว่าง

```powershell
echo $env:ANTHROPIC_API_KEY
```

ผลที่คาดหวัง: ว่าง · บัญชี Vercel ยังล็อกอินในเบราว์เซอร์ตามขั้น 1

---

### 5) ล็อกอิน Vercel CLI ผ่าน Prompt (ยังไม่ deploy · ไม่ใช้ MCP)

เปิด TUI จาก workshop repo:

```powershell
claude
```

วาง prompt อย่างใดอย่างหนึ่ง:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Prepare Vercel CLI login for this workshop repo so we can deploy later.
Use only the Vercel CLI (npx vercel). Do not add, configure, or call any Vercel MCP server. Do not open /mcp for Vercel.
If I am not logged in, run npx vercel login and tell me exactly what to do in the browser with the Vercel account I already signed into.
After login, run npx vercel whoami and report PASS or FAIL with the account name only.
Do not deploy. Do not link or create a project yet. Do not print tokens, cookies, or any sk- value.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
เตรียมล็อกอิน Vercel CLI ให้ workshop repo นี้ เพื่อเตรียม deploy ทีหลัง
ใช้เฉพาะ Vercel CLI (npx vercel) ห้ามเพิ่ม ตั้งค่า หรือเรียก Vercel MCP ห้ามเปิด /mcp เพื่อ Vercel
ถ้ายังไม่ล็อกอิน ให้รัน npx vercel login แล้วบอกฉันทีละขั้นว่าต้องทำอะไรในเบราว์เซอร์ด้วยบัญชี Vercel ที่ล็อกอินไว้แล้ว
หลังล็อกอินแล้ว รัน npx vercel whoami แล้วรายงาน PASS หรือ FAIL พร้อมชื่อบัญชีเท่านั้น
ห้าม deploy ห้ามลิงก์หรือสร้างโปรเจกต์ตอนนี้ ห้ามพิมพ์ token · cookie หรือค่าที่ขึ้นต้นด้วย sk-
```

ผลที่คาดหวัง: `npx vercel whoami` ขึ้นชื่อบัญชี · เอเจนต์รายงาน **PASS** · **ยังไม่มี** production URL

**ทางสำรองด้วยมือ** (นอก TUI ใน PowerShell ที่ workshop repo):

```powershell
npx vercel login
npx vercel whoami
```

> 📚 **รู้เพิ่ม:** แล็บนี้เลือก CLI แทน MCP เพราะ MCP มักซ้ำกับ connector `claude.ai Vercel` แล้วค้างที่ Needs authentication — CLI login ชัดและตรวจด้วย `whoami` ได้ทันที

---

### 6) Deploy ผ่าน Prompt (Vercel CLI)

วาง prompt นี้**เฉพาะเมื่อ** ขั้น 5 เป็น PASS และ (ถ้าอยู่ในห้องเรียน) ผู้สอนบอกว่าห้องนี้ deploy จริง:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Deploy this Registry Insight app to Vercel using only the Vercel CLI (npx vercel).
Do not use Vercel MCP or /mcp.
Before deploying, run npm run gate. If it fails, stop and report.
Prefer existing vercel.json and api/ in this workshop repo if present.
Use npx vercel --prod (answer link/create prompts sensibly for a Hobby account).
After deploying, give me the production URL and the commit (or deployment id) that was deployed.
Do not print any sk- value. Do not add ANTHROPIC_API_KEY as a Vercel env var.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
Deploy แอป Registry Insight ขึ้น Vercel โดยใช้เฉพาะ Vercel CLI (npx vercel)
ห้ามใช้ Vercel MCP หรือ /mcp
ก่อน deploy ให้รัน npm run gate ถ้าไม่ผ่านให้หยุดแล้วรายงาน
ถ้ามี vercel.json และโฟลเดอร์ api/ ใน workshop repo นี้ให้ใช้ตามนั้น
ใช้ npx vercel --prod (ตอบคำถามลิงก์/สร้างโปรเจกต์ให้เหมาะกับบัญชี Hobby)
หลัง deploy ส่ง production URL และ commit (หรือ deployment id) ที่ขึ้นจริง
ห้ามพิมพ์ค่าที่ขึ้นต้นด้วย sk- ห้ามใส่ ANTHROPIC_API_KEY เป็นตัวแปรบน Vercel
```

ผลที่คาดหวังถ้าขึ้นได้: มี **URL** และมี **commit หรือ deployment id** · ถ้าไม่ขึ้น: รายงานว่าหยุดที่ gate หรือติดสิทธิ์ — ไม่มีคำว่า "ขึ้นแล้ว" โดยไม่มี URL

**ทางสำรอง CLI เอง** (หลัง gate เขียว และ `whoami` ผ่าน):

```powershell
npx vercel --prod
```

> 📚 **รู้เพิ่ม:** URL กับ commit/deployment id คือหลักฐานของการ deploy — คำว่า "ขึ้นแล้ว" โดยไม่มีหลักฐานไม่นับ และสคริปต์ตรวจใน repo ก็ไม่ได้เรียก Vercel แทนคุณ

### 7) ยืนยันบนของจริง

เปิด production URL จากขั้น 6 ในเบราว์เซอร์ เทียบยอดคร่าว ๆ กับ `docs/EXECUTIVE-SUMMARY.md` (หรือแดชบอร์ดท้องถิ่นที่เคยเห็น)

ผลที่คาดหวัง: หน้าโหลดได้ · ไม่มี `sk-` ใน response ที่มองเห็น · ยอดไม่เพี้ยนแบบชัดเจน

---

## ✅ Checkpoint

- [ ] มีบัญชี Vercel (Hobby) และล็อกอินแดชบอร์ดได้
- [ ] quality gate exit 0
- [ ] health ไม่มี `sk-` และเซิร์ฟเวอร์ท้องถิ่นถูกปิดแล้ว
- [ ] `ANTHROPIC_API_KEY` ว่าง
- [ ] `npx vercel whoami` ผ่าน (ไม่พึ่ง MCP) หรือบันทึกว่าผู้สอนสาธิต
- [ ] มี production URL + commit/deployment id หรือบันทึกว่าห้องนี้ให้ผู้สอนสาธิต และเก็บผล gate ไว้

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| สมัครแล้วขึ้น Pro trial / ถามบัตร | กดลิงก์แผนผิด | กลับไป signup แล้วเลือก Hobby ฟรี |
| quality gate ยัง exit 2 (FAIL) | ข้อมูลหรือเซิร์ฟเวอร์ยังไม่ใช่ชุด Workshop 3–7 | catch-up `w9` แล้วรัน gate ใหม่ |
| `PORT=3001` is not recognized / คำสั่งพัง | วาง syntax bash ใน PowerShell | ใช้ `$env:PORT = 3001; npm start` ตามขั้น 3 |
| port busy | ของเก่ายังฟังอยู่ | ปิดหรือเปลี่ยน `PORT` (`$env:PORT = 3001`) |
| `Unable to connect` / connection refused ที่ 3001 | เซิร์ฟเวอร์ยังไม่ขึ้น หรือเรียกผิดพอร์ต | รอเทอร์มินัล A โชว์ listening แล้วเรียก `3001` อีกครั้ง |
| เอเจนต์ไปเพิ่ม MCP / ขึ้น Needs authentication | ใช้ prompt รอบเก่าที่สั่ง MCP | ลบด้วย `claude mcp remove vercel -s local` แล้วใช้ prompt ขั้น 5 ชุดใหม่ (CLI เท่านั้น) |
| `vercel whoami` ไม่รู้จัก / ไม่ล็อกอิน | ยังไม่ `vercel login` | รัน `npx vercel login` ในเบราว์เซอร์ด้วยบัญชีขั้น 1 |
| headless ไม่ยอมเรียก vercel | Bash ถูกปฏิเสธ | ใช้ TUI หรือรัน `npx vercel --prod` เอง |
| ไม่มีบัญชี Vercel | ยังไม่สมัคร | กลับไปขั้น 1 หรือให้ผู้สอนสาธิต |
| ได้คำว่า deployed แต่ไม่มี URL | ไม่มีหลักฐาน | อย่าเช็คผ่านข้อนี้ |
| หมดเทิร์นกลางทาง | `--max-turns` ต่ำ | อยู่ใน TUI |

สคริปต์ `node scripts/check-solutions.mjs` ไม่ได้เรียก Vercel การผ่านของสคริปต์ไม่ได้แทน URL

## 🆘 Behind? Catch up

จาก course repo (ไฟล์ถูก copy ลง workshop repo):

```powershell
node scripts/catch-up.js w9
```

แล้วรัน `npm run gate` ใน workshop repo ให้ได้ exit 0 — การได้ URL ยังเป็นขั้นที่คนทำ (ขั้น 5–7)

## Stretch / ต่อยอด

เทียบยอดบน URL จริงกับ `docs/EXECUTIVE-SUMMARY.md` แล้วจดสั้น ๆ ว่าตรง/ไม่ตรงข้อไหน

## Solution → solutions/w9/

`vercel.json` กับ `api/summary.js` อยู่ใน `solutions/w9/drop-in/` ยังไม่มี URL ที่ตรวจอัตโนมัติ
