# Module 13 — ส่งขึ้นของจริง / Deploy and preflight

> ⏱ ~30 นาที · 🎯 เดินครบ สมัคร Vercel → preflight → ติดตั้ง MCP ผ่าน Prompt → Deploy ผ่าน Prompt · Full path: account → MCP prompt → deploy. A live URL is still a human-confirmed step.

## Key idea / แนวคิดหลัก — เล่าเรื่อง

บทเรียนที่แท้จริงของบทสุดท้ายนี้ไม่ใช่เทคนิค deploy — แต่คือการรู้ว่า**ตอนไหนยังห้าม deploy** ของที่แดงขึ้นของจริงคือของเสียที่คนภายนอกเห็น ดังนั้นกฎข้อแรกเข้มที่สุด: ยังไม่ deploy ถ้า quality gate ยังไม่ exit 0

ลำดับที่ถูกต้องคือ **บัญชี → เชื่อม MCP → แล้วค่อยขึ้นของจริง** การมีบัญชีอย่างเดียวยังไม่พอ Claude ต้องมี remote MCP `vercel` และ OAuth จบก่อน สั่ง deploy ถึงจะไม่ติดสิทธิ์กลางทาง

เรื่องที่สองคือการซื่อสัตย์กับขอบเขตของเอเจนต์: ให้เอเจนต์รายงาน URL กับ commit ที่ขึ้นจริงได้ **ถ้ารอบนั้นขึ้นสำเร็จ** — แต่ไฟล์ตรวจใน repo ของเรา (เช่น `vercel.json` ในเฉลย) ยังไม่เรียก Vercel เอง มีไว้บอกว่าตั้งค่าอย่างไรเท่านั้น ไม่ได้แปลว่ามี URL จริงแล้ว เอเจนต์ที่บอกว่า "ขึ้นแล้ว" โดยไม่มี URL คือสัญญาณให้คุณหยุดและตรวจ

และเรื่องที่สามคือแผนสำรองของห้องเรียน: ถ้าเวลาไม่พอ ผู้สอนทำให้ดูหนึ่งเครื่องหลัง quality gate ผ่าน — ผู้เรียนทุกคนยังต้องมีเช็กลิสต์กับผล gate ของตัวเองครบ

> EN: Account → MCP → Gate → Deploy. This repo's checks do not call Vercel.

## Concept / เนื้อหา

ลำดับสี่ช่วง (รายละเอียด copy-paste อยู่ใน [LAB.md](LAB.md)):

| ช่วง | สิ่งที่ทำ | หลักฐาน |
|---|---|---|
| A. บัญชี | สมัคร/ล็อกอิน Hobby ที่ [vercel.com/signup](https://vercel.com/signup) | เข้าแดชบอร์ดได้ |
| B. Preflight | gate 6/6 · health ไม่มี `sk-` · คีย์ว่าง · ปิดเซิร์ฟเวอร์ | ผลเทอร์มินัล |
| C. MCP | Prompt ติดตั้ง + `/mcp` OAuth | เอเจนต์รายงาน PASS อ่านอย่างเดียว |
| D. Deploy | Prompt deploy (หรือ `npx vercel --prod`) | production URL + commit |

เช็กลิสต์ก่อนกด deploy — รันทุกข้อเรียงจากบนลงล่าง ข้อไหนไม่ผ่านแก้ข้อนั้นก่อน:

| # | ข้อ | เหตุผล |
|---|---|---|
| 1 | เปิด Claude จาก workshop repo (`C:\dev\multi-agent-workshop`) | ขอบเขตของเอเจนต์ |
| 2 | มีบัญชี Vercel (Hobby) ล็อกอินแล้ว | OAuth มีบัญชีให้ผูก |
| 3 | quality gate exit 0 | ของเสียไม่ขึ้นของจริง |
| 4 | ไม่มี `sk-` ใน `/api/health` (PowerShell: `$env:PORT=3001; npm start` แล้ว `Invoke-RestMethod …/api/health`) | ไม่ส่งค่าตัวอย่างออกไป |
| 5 | `ANTHROPIC_API_KEY` ว่าง (`echo $env:ANTHROPIC_API_KEY`) | ไม่หลุดไปคิดเงินรายครั้ง |
| 6 | เซิร์ฟเวอร์ในเครื่องถูกปิดแล้ว | quality gate ไม่เจอ port busy |
| 7 | Claude มีการเชื่อม `vercel` (`/mcp` OAuth PASS) | สั่ง deploy แล้วมีสิทธิ์จริง |
| 8 | รู้ว่าจะหยุดเมื่อเอเจนต์วน | มีคนดูอยู่ |

ไฟล์ตั้งค่าในเฉลย `solutions/w9/drop-in/vercel.json` ชี้หน้า `web/` และฟังก์ชัน `api/summary.js` — ฟังก์ชันนั้นอ่าน CSV ที่สะอาด แต่ยังไม่ได้ถูกเรียกบนคลาวด์ในรอบจัดโครงสร้างนี้ บอกไว้ตรง ๆ เพื่อไม่ให้เข้าใจเกินของจริง

ความล้มเหลวที่ควรจำรวมอยู่ที่ [reference/failure-modes.md](../../reference/failure-modes.md)

## ลงมือทำตามลำดับ

ทำตาม [LAB.md](LAB.md) ขั้น 1→7 โดยสรุป:

1. **สมัคร/ล็อกอิน** Vercel Hobby  
2. **`npm run gate`** ให้เขียว  
3. **health ที่พอร์ต 3001** ไม่มี `sk-` แล้ว Ctrl+C  
4. **ตรวจคีย์ว่าง**  
5. **Prompt ติดตั้ง MCP** + `/mcp` OAuth  
6. **Prompt Deploy** (เมื่อผู้สอนอนุญาต / พร้อมเอง)  
7. **เปิด URL** ยืนยัน

ทางสำรองหลัง gate เขียวและการเชื่อมผ่าน: `npx vercel --prod`

## Prompt pattern — บัญชีพร้อมแล้ว → เชื่อม → deploy

### A) ตั้งการเชื่อม Vercel MCP (ยังไม่ขึ้นของจริง)

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

### B) Deploy (หลังการเชื่อม PASS)

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

> 📚 **ทำไมแนะนำ EN:** ผลลัพธ์ทั้งหมด (URL, commit, ข้อความ error ของ Vercel) เป็นอังกฤษ — สั่งเป็นอังกฤษทำให้รายงานกับหลักฐานอยู่ภาษาเดียวกัน

| ส่วน | หน้าที่ |
|---|---|
| สมัคร Hobby ก่อน | มีบัญชีให้ OAuth |
| ตั้ง MCP + `/mcp` OAuth | มีการเชื่อมก่อนสั่งขึ้นของจริง |
| รัน quality gate ก่อน | preflight ในตัวคำสั่ง |
| ถ้าไม่ผ่านให้หยุด | กันของแดงขึ้นของจริง |
| ส่ง URL กับ commit | รู้ว่าอะไรขึ้น |
| ห้ามพิมพ์ sk- / ห้ามใส่คีย์ Anthropic บน Vercel | กันค่าหลุดและเสี่ยงเกินจำเป็น |

## Common pitfalls / กับดัก

- สมัครแผน Pro trial โดยไม่ตั้งใจ — ใช้ Hobby ฟรีสำหรับแล็บนี้
- สั่ง deploy ทั้งที่ quality gate ยังเป็น exit 2 — ของแดงขึ้นของจริงให้คนอื่นเห็น
- สั่ง deploy ทั้งที่ยังไม่มี MCP / ยังไม่ OAuth — ติดสิทธิ์กลางทาง
- ไม่มีบัญชี Vercel กลางชั่วโมงสุดท้าย — สมัครในขั้น 1 ของ LAB หรือมาก่อนวันเรียน
- ใช้ `claude -p` — Bash ที่เรียก CLI ถูกปฏิเสธ ขั้นเชื่อม/deploy ทำใน TUI
- เซิร์ฟเวอร์ในเครื่องค้างที่พอร์ต 3000 — สับสนกับ URL จริงบนคลาวด์ คนละโลกกัน
- เอเจนต์บอกว่าขึ้นแล้วโดยไม่มี URL — ถือว่ายังไม่ขึ้นจนกว่าจะเห็น URL เปิดได้จริง
- วาง `ANTHROPIC_API_KEY` ในตัวแปรของ Vercel โดยไม่จำเป็น — แอปนี้ไม่ใช้คีย์นั้น

## Quick check / ทบทวน

<details>
<summary>1. ลำดับถูกต้องก่อนขึ้นของจริงคืออะไร</summary>
บัญชี Vercel → preflight (gate + health) → MCP `/mcp` OAuth → แล้วค่อย Prompt deploy
</details>

<details>
<summary>2. อะไรต้องเขียวก่อน deploy</summary>
quality gate เป็น exit 0 และ health ไม่มี sk- และการเชื่อม vercel PASS
</details>

<details>
<summary>3. ไฟล์ vercel.json ในเฉลยบอกอะไรได้</summary>
บอกว่าตั้งเส้นทางไฟล์อย่างไร — ยังไม่ได้ยืนยันว่า deploy สำเร็จหรือมี URL
</details>

<details>
<summary>4. ห้องไม่ทัน deploy ทำอย่างไร</summary>
ผู้สอนทำให้ดูหนึ่งเครื่อง แล้วผู้เรียนเก็บเช็กลิสต์กับผล quality gate ของตัวเอง (อย่างน้อยจบช่วงบัญชี + preflight)
</details>

## Go deeper

- [Failure modes](../../reference/failure-modes.md)
- [Vercel signup](https://vercel.com/signup) · [Vercel MCP](https://vercel.com/docs/agent-resources/vercel-mcp) · Claude Code เรื่องการเชื่อม MCP
- บันทึกว่าของเก่าไม่เคยถูก deploy
