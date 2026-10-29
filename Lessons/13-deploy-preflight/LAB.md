# Lab — จากบัญชี Vercel ถึง Deploy (Module 13: Deploy & Pre-flight)

> ⏱ machine ~15–20 นาที · Start state: อยู่ใน workshop repo · quality gate exit 0 มีแดชบอร์ดจาก Workshop 9 และ feature จาก Workshop 8

## Goal / เป้าหมาย

เดินครบสี่ช่วง: **(1) สมัคร/ล็อกอิน Vercel → (2) preflight ในเครื่อง → (3) ติดตั้ง MCP ผ่าน Prompt → (4) Deploy ผ่าน Prompt** แล้วเก็บหลักฐาน URL + commit  
ถ้าห้องนี้ผู้สอนสั่งหยุดก่อนขึ้นของจริง ให้จบหลังช่วง 2–3 พร้อมผล gate

## ภาพรวมลำดับ

| ขั้น | ทำอะไร | ผลที่ต้องมี |
|---|---|---|
| 1 | สร้างบัญชี Vercel (Hobby ฟรี) | ล็อกอินแดชบอร์ดได้ |
| 2–4 | preflight ในเครื่อง | gate 6/6 · health ไม่มี `sk-` · คีย์ว่าง · ปิดเซิร์ฟเวอร์ |
| 5 | Prompt ติดตั้ง MCP + OAuth | `/mcp` มี `vercel` · ตรวจอ่านอย่างเดียว PASS |
| 6 | Prompt Deploy | production URL + commit |
| 7 | เปิด URL ยืนยัน | หน้าแดชบอร์ดขึ้นจริง |

---

## Steps / ขั้นตอน

### 1) สร้างบัญชี Vercel (หรือล็อกอินถ้ามีแล้ว)

ทำใน**เบราว์เซอร์** — ไม่ผ่าน Claude:

1. เปิด [https://vercel.com/signup](https://vercel.com/signup)
2. สมัครด้วย GitHub / Google / Email (แนะนำ GitHub ถ้ารูปแบบ deploy ผูก repo ทีหลัง)
3. เลือกแผน **Hobby** (ฟรี · งานส่วนตัว/เรียน) — **อย่า**กดลิงก์ที่ขึ้น Pro trial โดยไม่ตั้งใจ
4. ยืนยันอีเมล/OTP ถ้ามี จนเข้าแดชบอร์ด `https://vercel.com/dashboard` ได้

ผลที่คาดหวัง: เห็นแดชบอร์ด Vercel · ยัง**ไม่ต้อง**สร้างโปรเจกต์ด้วยมือในขั้นนี้

> 📚 **รู้เพิ่ม:** บัญชีคือสิทธิ์ที่ OAuth ของ MCP จะขอในขั้น 5 · สมัครกลางชั่วโมง deploy มักไม่ทัน — ถ้าห้องเตรียมตัวไว้แล้ว ขั้นนี้แค่ยืนยันว่าล็อกอินอยู่

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

ผลที่คาดหวัง: ว่าง (ใช้ล็อกอิน Claude Code ตามแพ็กเกจคอร์ส ไม่คิดเงินรายครั้งจากคีย์หลุด) · บัญชี Vercel ยังล็อกอินในเบราว์เซอร์ตามขั้น 1

---

### 5) ติดตั้ง MCP Vercel ผ่าน Prompt (ยังไม่ deploy)

เปิด TUI จาก workshop repo:

```powershell
claude
```

วาง prompt อย่างใดอย่างหนึ่ง:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Set up the official Vercel connection for this Claude Code session so we can deploy later.
Add the remote MCP server named vercel at https://mcp.vercel.com if it is not already configured.
Then tell me to open /mcp, select vercel, and finish the browser OAuth with the Vercel account I already signed into.
After I confirm auth, verify with a read-only check (for example list teams or list projects) and report PASS or FAIL with short evidence.
Do not deploy. Do not create a new Vercel project yet. Do not print tokens, cookies, or any sk- value.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ตั้งการเชื่อม Vercel อย่างเป็นทางการให้เซสชัน Claude Code นี้ เพื่อเตรียม deploy ทีหลัง
ถ้ายังไม่มี ให้เพิ่ม remote MCP ชื่อ vercel ที่ https://mcp.vercel.com
แล้วบอกให้ฉันเปิด /mcp เลือก vercel แล้วทำ OAuth ในเบราว์เซอร์ด้วยบัญชี Vercel ที่ล็อกอินไว้แล้วให้จบ
หลังฉันยืนยันว่า auth แล้ว ให้ตรวจแบบอ่านอย่างเดียว (เช่น list teams หรือ list projects) แล้วรายงาน PASS หรือ FAIL พร้อมหลักฐานสั้น ๆ
ห้าม deploy ห้ามสร้างโปรเจกต์ Vercel ใหม่ตอนนี้ ห้ามพิมพ์ token · cookie หรือค่าที่ขึ้นต้นด้วย sk-
```

ทำตามที่เอเจนต์บอก: ใน TUI พิมพ์ `/mcp` → เลือก `vercel` → Authenticate → อนุญาตในเบราว์เซอร์ด้วยบัญชีขั้น 1

ผลที่คาดหวัง: มีเซิร์ฟเวอร์ `vercel` · OAuth จบ · เอเจนต์รายงาน **PASS** จากเครื่องมืออ่านอย่างเดียว · **ยังไม่มี** production URL

**ทางสำรองถ้าเอเจนต์ไม่เพิ่ม MCP ให้เอง** — ปิด TUI รันใน PowerShell ที่ workshop repo แล้วเปิด `claude` ใหม่:

```powershell
claude mcp add --transport http vercel https://mcp.vercel.com
claude
```

แล้ว `/mcp` → `vercel` → Authenticate เหมือนด้านบน

> 📚 **รู้เพิ่ม:** การเชื่อม ≠ การ deploy · ขั้นนี้แค่ให้ Claude เรียกบัญชี Vercel ของคุณได้

---

### 6) Deploy ผ่าน Prompt

วาง prompt นี้**เฉพาะเมื่อ** ขั้น 5 เป็น PASS และ (ถ้าอยู่ในห้องเรียน) ผู้สอนบอกว่าห้องนี้ deploy จริง:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Deploy this Registry Insight app to Vercel with the Vercel connection we just set up.
Before deploying, run npm run gate. If it fails, stop and report.
Prefer using the existing vercel.json and api/ under this workshop repo if present.
After deploying, give me the production URL and the commit that was deployed.
Do not print any sk- value. Do not add ANTHROPIC_API_KEY as a Vercel env var.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
Deploy แอป Registry Insight ขึ้น Vercel โดยใช้การเชื่อม Vercel ที่เพิ่งตั้งไว้
ก่อน deploy ให้รัน npm run gate ถ้าไม่ผ่านให้หยุดแล้วรายงาน
ถ้ามี vercel.json และโฟลเดอร์ api/ ใน workshop repo นี้ให้ใช้ตามนั้น
หลัง deploy ส่ง production URL และ commit ที่ขึ้นจริง
ห้ามพิมพ์ค่าที่ขึ้นต้นด้วย sk- ห้ามใส่ ANTHROPIC_API_KEY เป็นตัวแปรบน Vercel
```

ผลที่คาดหวังถ้าขึ้นได้: มี **URL** และมี **รหัส commit** · ถ้าไม่ขึ้น: รายงานว่าหยุดที่ gate หรือติดสิทธิ์ — ไม่มีคำว่า "ขึ้นแล้ว" โดยไม่มี URL

**ทางสำรอง CLI** (หลัง gate เขียว และการเชื่อมผ่านแล้ว):

```powershell
npx vercel --prod
```

> 📚 **รู้เพิ่ม:** URL กับ commit คือหลักฐานสองชิ้นของการ deploy — คำว่า "ขึ้นแล้ว" โดยไม่มีสองอย่างนี้ไม่นับ และสคริปต์ตรวจใน repo ก็ไม่ได้เรียก Vercel แทนคุณ

### 7) ยืนยันบนของจริง

เปิด production URL จากขั้น 6 ในเบราว์เซอร์ เทียบยอดคร่าว ๆ กับ `docs/EXECUTIVE-SUMMARY.md` (หรือแดชบอร์ดท้องถิ่นที่เคยเห็น)

ผลที่คาดหวัง: หน้าโหลดได้ · ไม่มี `sk-` ใน response ที่มองเห็น · ยอดไม่เพี้ยนแบบชัดเจน

---

## ✅ Checkpoint

- [ ] มีบัญชี Vercel (Hobby) และล็อกอินแดชบอร์ดได้
- [ ] quality gate exit 0
- [ ] health ไม่มี `sk-` และเซิร์ฟเวอร์ท้องถิ่นถูกปิดแล้ว
- [ ] `ANTHROPIC_API_KEY` ว่าง
- [ ] MCP `vercel` + `/mcp` OAuth ผ่าน (หรือบันทึกว่าผู้สอนสาธิต)
- [ ] มี production URL + commit หรือบันทึกว่าห้องนี้ให้ผู้สอนสาธิต และเก็บผล gate ไว้

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| สมัครแล้วขึ้น Pro trial / ถามบัตร | กดลิงก์แผนผิด | กลับไป signup แล้วเลือก Hobby ฟรี |
| quality gate ยัง exit 2 (FAIL) | ข้อมูลหรือเซิร์ฟเวอร์ยังไม่ใช่ชุด Workshop 3–7 | catch-up `w9` แล้วรัน gate ใหม่ |
| `PORT=3001` is not recognized / คำสั่งพัง | วาง syntax bash ใน PowerShell | ใช้ `$env:PORT = 3001; npm start` ตามขั้น 3 |
| port busy | ของเก่ายังฟังอยู่ | ปิดหรือเปลี่ยน `PORT` (`$env:PORT = 3001`) |
| `Unable to connect` / connection refused ที่ 3001 | เซิร์ฟเวอร์ยังไม่ขึ้น หรือเรียกผิดพอร์ต | รอเทอร์มินัล A โชว์ listening แล้วเรียก `3001` อีกครั้ง |
| ไม่มีเครื่องมือ vercel ในแชท | ยังไม่เพิ่ม MCP หรือยังไม่ OAuth | รัน `claude mcp add --transport http vercel https://mcp.vercel.com` แล้ว `/mcp` → Authenticate |
| `/mcp` ไม่มี vercel / OAuth ค้าง | endpoint ผิด หรือเบราว์เซอร์ยังไม่จบ | ยืนยัน URL คือ `https://mcp.vercel.com` · ล็อกอินบัญชีขั้น 1 แล้ว auth ใหม่ |
| OAuth ปฏิเสธ / บัญชีไม่ตรง | ล็อกอิน Vercel คนละอีเมล | ล็อกเอาต์แล้วเข้าด้วยบัญชีที่สมัครในขั้น 1 |
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
