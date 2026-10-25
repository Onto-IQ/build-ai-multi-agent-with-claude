# ผู้สอนเท่านั้น

โฟลเดอร์นี้ไม่ใช่ทางเดินของผู้เรียน มีบันทึกทดสอบ เฉลยปมที่ปลูกไว้ และชุดสาธิต frontmatter พัง

## จังหวะในห้อง

วันแรกเช้า: โมดูล 1–3 จบ Workshop 1 ก่อนอาหารกลางวัน บ่าย: โมดูล 4–6 Workshop 3 เป็น guided demo ประมาณ 20 นาที ถ้าห้องช้าให้ตัด stretch ของ Workshop 2

วันที่สองเช้า: โมดูล 7–9 เกตทั้งสามเคสต้องเขียวก่อนอาหารกลางวัน บ่าย: capstone 5 บทบาท แล้ว preflight ถ้า Vercel ทั้งห้องไม่ทัน ให้ผู้สอน deploy สาธิตหนึ่งเครื่องหลังเกตผ่าน

ผู้เรียนที่ลงเรียนซ้ำ: ส่ง SETUP.md กับ `node scripts/verify-setup.mjs` ประมาณหนึ่งสัปดาห์ก่อนวันเรียน อย่าเริ่ม Workshop 1 บนเครื่องที่สคริปต์นี้ยังไม่ผ่าน

## เฉลยปมในแซนด์บ็อกซ์เริ่มต้น

รัน `node scripts/quality-gate.js` จาก `sandbox/sales-insight` ต้องได้ exit 2

เคสที่เห็นบน Windows วันที่ 2026-10-19:

- `data-quality` — 18 violations: `bad-date=2`, `bad-price=1`, `bad-qty=2`, `channel-format=2`, `date-format=3`, `duplicate-order-id=1`, `missing-order-id=1`, `missing-province=1`, `money-format=3`, `product-whitespace=1`, `region-mismatch=1`
- `bad-json-does-not-crash` — `POST /api/notes` ด้วยข้อความ `not-json` แล้วโปรเซสตาย เพราะ `JSON.parse` ใน `server.js` ไม่มี try/catch
- `summary-matches-valid-rows` — เซิร์ฟเวอร์รายงาน `serverRevenue=7529.25` จาก 24 แถว เกตต้องการ `4168` จาก 8 แถวที่สะอาดอยู่แล้ว ตัวอ่านชุดเริ่มต้นผ่าจุลภาคตรง ๆ จึงเลื่อนคอลัมน์เมื่อราคาอยู่ในเครื่องหมายคำพูด

`GET /api/health` ของชุดเริ่มต้นส่ง `sampleToken` ค่า `sk-sample-not-a-real-key` เกตสามเคสไม่ได้จับข้อนี้ Workshop 6 ต้องเอาออกจาก JSON

แถวที่ตัวทำความสะอาดอ้างอิงทิ้ง: ORD-1007 แถวที่สอง, ORD-1008, ORD-1009, ORD-1013, ORD-1014, ORD-1015, ORD-1017 และแถวที่ `order_id` ว่าง

แถวที่ซ่อมแล้วเก็บ รวมวันที่ `02/03/2025`, ราคา `"1,250.00"` กับ `"1.250,50"`, ปี 2568 ที่ลบ 543, ช่องทาง `shopee` / `SHOPEE`, ภาคของเชียงใหม่ที่ไฟล์ดิบเขียนว่าใต้, และชื่อสินค้าที่มีช่องว่างหัวท้าย

ยอดหลังสะอาด: **16 ออเดอร์, 10778 บาท** ภาคนำคือกลาง (5181) ช่องทางนำคือสาขา (3870) สินค้านำคือเซ็ตของฝาก (3426.50)

งบ Cost Gate ในคำตอบอ้างอิงคือ 2 USD และ output ไม่เกิน 20000 token เป็นเพดานสำหรับห้องเรียน ยังไม่มี `total_cost_usd` จากรัน TUI ของแซนด์บ็อกซ์นี้ ให้จดตัวเลขจริงตอนซ้อม แล้วปรับเพดานถ้าห้องชนลิมิตของแผน Pro

## ที่ย้ายมา

| ของเดิม | ตอนนี้อยู่ |
|---|---|
| `runs/` | `instructor/test-runs/` รันแบบ headless ไม่ใช่ TUI |
| `QUALITY-GATE.md` | `instructor/quality-gate.md` เกณฑ์ชุดเก่า วันที่ในไฟล์คือ 29 ก.ย. |
| รายงาน one Claude | `instructor/research/` |
| บทเรียนโมดูล 4 และ 7 ฉบับยาว | `instructor/deep-dives/` |
| บทเรียนชุดเดิมที่เหลือ | `instructor/source-material/` |
| outline เผยแพร่ | `instructor/outline-rev1.md` |
| จดหมายก่อนเรียน | `instructor/ops/preclass-email-faq.md` |
| agent-lab และ agent-lab-fat | ชุดชี้ไฟล์ frontmatter พัง สำหรับสาธิต |
| demo-shop ที่แก้จบแล้ว | `instructor/archive/demo-shop/` ไม่ใช้ในห้องนี้ |

ชื่อศูนย์ฝึกในไฟล์ปัจจุบันถูกทำให้เป็นกลางแล้ว ประวัติ git เก่ายังค้นชื่อเดิมได้ ไม่ได้เขียนประวัติใหม่และไม่ได้ force-push

## สิ่งที่ยังต้องคนเดิน

TUI บนแซนด์บ็อกซ์ Sales Insight, hook จริงใน Claude Code, deploy Vercel, และ macOS เครื่องที่ใช้จัดโครงสร้างนี้มี Claude Code 2.1.283 ซึ่งต่ำกว่าเพดาน 2.1.296 ต้อง `claude update` ก่อนซ้อม
