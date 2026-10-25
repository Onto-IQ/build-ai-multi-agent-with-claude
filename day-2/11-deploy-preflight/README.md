# Module 11 — ส่งขึ้นของจริง / Deploy and preflight

> ⏱ ~30 นาที · 🎯 มีเช็กลิสต์ก่อนปล่อยเอเจนต์ และรู้ว่าการ deploy ขึ้น Vercel ยังต้องมีคนทำให้จบหนึ่งรอบ · Run a preflight before any deploy. A live Vercel URL is still a human step.

## Key idea / แนวคิดหลัก — เล่าเรื่อง

บทเรียนที่แท้จริงของบทสุดท้ายนี้ไม่ใช่เทคนิค deploy — แต่คือการรู้ว่า**ตอนไหนยังห้าม deploy** ของที่แดงขึ้นของจริงคือของเสียที่คนภายนอกเห็น ดังนั้นกฎข้อแรกเข้มที่สุด: ยังไม่ deploy ถ้า quality gate ยังไม่ exit 0

เรื่องที่สองคือการซื่อสัตย์กับขอบเขตของเอเจนต์: ให้เอเจนต์รายงาน URL กับ commit ที่ขึ้นจริงได้ **ถ้ารอบนั้นขึ้นสำเร็จ** — แต่ไฟล์ตรวจใน repo ของเรา (เช่น `vercel.json` ในเฉลย) ยังไม่เรียก Vercel เอง มีไว้บอกว่าตั้งค่าอย่างไรเท่านั้น ไม่ได้แปลว่ามี URL จริงแล้ว เอเจนต์ที่บอกว่า "ขึ้นแล้ว" โดยไม่มี URL คือสัญญาณให้คุณหยุดและตรวจ

และเรื่องที่สามคือแผนสำรองของห้องเรียน: ถ้าเวลาไม่พอ ผู้สอนทำให้ดูหนึ่งเครื่องหลัง quality gate ผ่าน — ผู้เรียนทุกคนยังต้องมีเช็กลิสต์กับผล gate ของตัวเองครบ ก่อนวันเรียนบัญชี Vercel ต้องสมัครมาแล้ว ไม่ใช่ของที่สมัครกลางชั่วโมงสุดท้าย

> EN: Gate first. Then deploy. This repo's checks do not call Vercel.

## Concept / เนื้อหา

เช็กลิสต์ก่อนกดให้เอเจนต์ deploy — รันทุกข้อเรียงจากบนลงล่าง ข้อไหนไม่ผ่านแก้ข้อนั้นก่อน:

| # | ข้อ | เหตุผล |
|---|---|---|
| 1 | เปิด Claude จาก `sandbox/sales-insight` | ขอบเขตของเอเจนต์ |
| 2 | quality gate exit 0 | ของเสียไม่ขึ้นของจริง |
| 3 | ไม่มี `sk-` ใน `/api/health` | ไม่ส่งค่าตัวอย่างออกไป |
| 4 | `ANTHROPIC_API_KEY` ว่าง | ไม่หลุดไปคิดเงินรายครั้ง |
| 5 | เซิร์ฟเวอร์ในเครื่องถูกปิดแล้ว | quality gate ไม่เจอ port busy |
| 6 | รู้ว่าจะหยุดเมื่อเอเจนต์วน | มีคนดูอยู่ |
| 7 | บัญชี Vercel ล็อกอินแล้ว | ไม่ไปสมัครกลางแล็บ |

ไฟล์ตั้งค่าในเฉลย `solutions/w6/drop-in/vercel.json` ชี้หน้า `web/` และฟังก์ชัน `api/summary.js` — ฟังก์ชันนั้นอ่าน CSV ที่สะอาด แต่ยังไม่ได้ถูกเรียกบนคลาวด์ในรอบจัดโครงสร้างนี้ บอกไว้ตรง ๆ เพื่อไม่ให้เข้าใจเกินของจริง

ความล้มเหลวที่ควรจำรวมอยู่ที่ [reference/failure-modes.md](../../reference/failure-modes.md)

## ลงมือทำตามลำดับ

1. เดินเช็กลิสต์เจ็ดข้อข้างบนให้ครบ — ข้อ 2 ตรวจด้วยมือคุณ:

```bash
cd sandbox/sales-insight
node scripts/quality-gate.js && echo GATE-GREEN
```

2. ทางที่แนะนำคือให้เอเจนต์ทำผ่าน TUI — วาง prompt จากหัวข้อถัดไป แล้วดูว่ามันหยุดเองเมื่อ gate ไม่ผ่านหรือไม่

3. ทางสำรองคือคุณกดเองด้วย Vercel CLI — หลัง gate เขียว:

```bash
vercel --prod
```

4. ปิดงานด้วยหลักฐานสองอย่างที่คุณเก็บเอง: production URL ที่เปิดได้จริง และ commit ที่ขึ้นจริง — จนกว่าจะมีสองอย่างนี้จากรอบจริงหนึ่งรอบ ห้องนี้ยังไม่นับว่า deploy ได้

## Prompt pattern — เลือกใช้อย่างใดอย่างหนึ่ง

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Deploy this Sales Insight app to Vercel with the Vercel connection.
Before deploying, run node scripts/quality-gate.js. If it fails, stop and report.
After deploying, give me the production URL and the commit that was deployed.
Do not print any sk- value.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
Deploy แอป Sales Insight ขึ้น Vercel โดยใช้การเชื่อม Vercel
ก่อน deploy ให้รัน node scripts/quality-gate.js ถ้าไม่ผ่านให้หยุดแล้วรายงาน
หลัง deploy ส่ง production URL และ commit ที่ขึ้นจริง
ห้ามพิมพ์ค่าที่ขึ้นต้นด้วย sk-
```

> 📚 **ทำไมแนะนำ EN:** ผลลัพธ์ทั้งหมด (URL, commit, ข้อความ error ของ Vercel) เป็นอังกฤษ — สั่งเป็นอังกฤษทำให้รายงานกับหลักฐานอยู่ภาษาเดียวกัน

| ส่วน | หน้าที่ |
|---|---|
| รัน quality gate ก่อน | preflight ในตัวคำสั่ง |
| ถ้าไม่ผ่านให้หยุด | กันของแดงขึ้นของจริง |
| ส่ง URL กับ commit | รู้ว่าอะไรขึ้น |
| ห้ามพิมพ์ sk- | กันค่าตัวอย่างหลุดเข้าแชท |

## Common pitfalls / กับดัก

- สั่ง deploy ทั้งที่ quality gate ยังเป็น exit 2 — ของแดงขึ้นของจริงให้คนอื่นเห็น
- ไม่มีบัญชี Vercel กลางชั่วโมงสุดท้าย — สมัครมาก่อนวันเรียนตามเอกสารเตรียมตัว
- ใช้ `claude -p` — Bash ที่เรียก CLI ถูกปฏิเสธ ขั้น deploy ทำใน TUI
- เซิร์ฟเวอร์ในเครื่องค้างที่พอร์ต 3000 — สับสนกับ URL จริงบนคลาวด์ คนละโลกกัน
- เอเจนต์บอกว่าขึ้นแล้วโดยไม่มี URL — ถือว่ายังไม่ขึ้นจนกว่าจะเห็น URL เปิดได้จริง
- วาง `ANTHROPIC_API_KEY` ในตัวแปรของ Vercel โดยไม่จำเป็น — แอปนี้ไม่ใช้คีย์นั้น อย่าเพิ่มความเสี่ยงที่ไม่ต้องมี

## Quick check / ทบทวน

<details>
<summary>1. อะไรต้องเขียวก่อน deploy</summary>
quality gate เป็น exit 0 และ health ไม่มี sk-
</details>

<details>
<summary>2. ไฟล์ vercel.json ในเฉลยบอกอะไรได้</summary>
บอกว่าตั้งเส้นทางไฟล์อย่างไร — ยังไม่ได้ยืนยันว่า deploy สำเร็จหรือมี URL
</details>

<details>
<summary>3. ห้องไม่ทัน deploy ทำอย่างไร</summary>
ผู้สอนทำให้ดูหนึ่งเครื่อง แล้วผู้เรียนเก็บเช็กลิสต์กับผล quality gate ของตัวเอง
</details>

## Go deeper

- [Failure modes](../../reference/failure-modes.md)
- เอกสาร Vercel เรื่อง deploy และเอกสาร Claude Code เรื่องการเชื่อมบริการ
- บันทึกว่าของเก่าไม่เคยถูก deploy: `instructor/research/research-2026-10-09-one-claude-impact.md`
