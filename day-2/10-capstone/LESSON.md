# Module 10 — Capstone ห้าบทบาท / Five-role team

> ⏱ ~90 นาที · 🎯 ทีม 5 บทบาทส่งแดชบอร์ดและสรุปผู้บริหารจาก PRODUCT-SPEC ชุดเดียว · Five roles deliver a dashboard and an executive summary from one shared spec.

## Key idea / แนวคิดหลัก — เล่าเป็นเรื่อง

ทุกอย่างที่ฝึกมาทั้งวันรวมกันอยู่ตรงนี้: งานใหญ่พอที่จะต้องมีทั้งขนาน (วันนี้เช้า) ทั้งต่อคิว (บ่าย) และมีคนหลายบทบาทที่แต่ละคนต้องรู้ว่าตัวเองรอใคร — และกติกาเดียวที่กุมทั้งหมดไว้คือข้อความจาก Module 3: **แบ่งตาม context ไม่ใช่ตามประเภทงาน**

แต่ยังมีหนึ่งขั้นที่ต้องทำก่อนแตกงานทุกครั้งในงานขนาดนี้: ขั้น 0 — เขียน `docs/PRODUCT-SPEC.md` (หน้าจอ, endpoints, เกณฑ์ยอมรับ) กับ `docs/TASKS.md` (ใครทำอะไร ใครรอใคร) ขึ้นมาก่อน เหตุผลเดียวกับ DESIGN.md ของ Workshop 4 แต่ขยายวง: ห้าบทบาทที่ไม่มีสเปกกลาง คือห้าคนที่จบงานคนละแอป

บทบาทที่ต้องเน้นเป็นพิเศษคือ **qa** — ตัวนี้เชื่อ exit code ของ quality gate กับเนื้อ JSON ของ `/api/health` เท่านั้น **ไม่เชื่อคำบอกของผู้พัฒนา** และ **writer** ต้องใช้ตัวเลขจาก API เท่านั้น ห้ามคิดยอดเอง เพราะสรุปผู้บริหารที่เลขไม่ตรงกับแดชบอร์ดคือของเสียชิ้นใหญ่ที่สุดของงานแบบนี้

> EN: Spec and task dependencies first. Then build. QA believes the gate, not the chat.

## Concept / เนื้อหา

ห้าบทบาท ไฟล์หลัก และสิ่งที่แต่ละคนรอ (แผ่นอ้างอิง):

| บทบาท | ไฟล์หลัก | ขึ้นกับ |
|---|---|---|
| planner | `docs/PRODUCT-SPEC.md`, `docs/TASKS.md` | ไม่มี |
| researcher | ตัวเลขจาก CSV ที่สะอาด | สเปก |
| developer | `server.js`, `web/`, `api/summary.js` | สเปก |
| writer | `docs/EXECUTIVE-SUMMARY.md` และข้อความบนหน้า | สเปกและตัวเลข |
| qa | ผล quality gate และรายการที่ไม่ผ่าน | ของที่ developer กับ writer ส่ง |

หน้าจอที่สเปกต้องกำหนดไว้: ออเดอร์ที่ใช้ได้ รายได้ ภาคนำ ช่องทางนำ สินค้านำ และตารางตามภาค — และ API ที่สเปกต้องกำหนดไว้: `GET /api/health` ไม่มี `sk-`, `GET /api/summary` มียอดกับจำนวนออเดอร์, `POST /api/notes` ที่ข้อความส่งเข้าไปพังแล้วโปรเซสไม่ตาย

ข้อจำกัดทางเทคนิคคงเดิมทั้งวัน: แอปยังเป็น Node ล้วน ไม่ใส่ dependency และถ้างบ Pro ของห้องไม่พอสำหรับห้าตัวพร้อมกัน ให้ยุบเป็นสามตัวคือ planner, developer และ qa แล้วให้คนเขียนสรุปเองจาก JSON ของ `/api/summary` — quality gate ยังต้องเขียวเหมือนเดิม

## ลงมือทำตามลำดับ

เริ่มได้เมื่อ Workshop 5 จบแล้ว (quality gate exit 0):

```bash
cd sandbox/sales-insight
claude
```

1. จดสถานะก่อนเริ่มไว้เทียบท้ายงาน:

```bash
git add -A && git commit -m "before capstone" && git rev-parse --short HEAD
```

2. วาง prompt จากหัวข้อถัดไป — สังเกตลำดับที่ task list เดิน: planner ทำขั้น 0 คนเดียวจบก่อน แล้ว researcher / developer+writer วิ่ง แล้ว qa ปิดท้าย

3. ตรวจผลรวมด้วยตาคุณสามจุด:

```bash
node scripts/quality-gate.js && echo GATE-GREEN
```

   - quality gate ต้อง exit 0 (หลักฐานของ qa ต้องเป็นตัวเลขนี้ ไม่ใช่คำบอก)
   - ตัวเลขใน `docs/EXECUTIVE-SUMMARY.md` ต้องตรงกับ JSON ของ `/api/summary` ทุกตัว
   - `git diff HEAD~1 --stat` ต้องไม่มีสองบทบาทแตะไฟล์เดียวกัน

4. รายงานรวมของ leader ต้องระบุของส่งของแต่ละบทบาท ไม่เกิน 400 คำ — ใช้ตรวจว่าครบตาม TASKS.md

## Prompt pattern (EN / TH)

```text
EN: Build the Sales Insight dashboard with a 5-role team. Execute, do not only plan.
Step 0: Write docs/PRODUCT-SPEC.md (page, endpoints, acceptance) and docs/TASKS.md with dependencies.
planner finishes Step 0 before anyone else starts.
researcher reports order count and revenue from data/sales.csv.
developer and writer may run in parallel only after the spec exists. They must not edit the same files.
writer creates docs/EXECUTIVE-SUMMARY.md in Thai using only figures from the API.
qa runs node scripts/quality-gate.js and checks that /api/health has no sk-.
Agents that need another agent's output must NOT run before it.
Report under 400 words and name each deliverable.
TH: สร้างแดชบอร์ด Sales Insight ด้วยทีม 5 บทบาท ทำให้จริง อย่าหยุดที่แผน
ขั้น 0: เขียน docs/PRODUCT-SPEC.md (หน้าจอ, endpoints, เกณฑ์ยอมรับ) และ docs/TASKS.md ที่มี dependency
planner ทำขั้น 0 ให้เสร็จก่อนคนอื่นเริ่ม
researcher รายงานจำนวนออเดอร์และรายได้จาก data/sales.csv
developer กับ writer ทำขนานได้หลังมีสเปก และห้ามแก้ไฟล์เดียวกัน
writer เขียน docs/EXECUTIVE-SUMMARY.md เป็นไทย โดยใช้ตัวเลขจาก API เท่านั้น
qa รัน node scripts/quality-gate.js และตรวจว่า /api/health ไม่มี sk-
งานที่ต้องใช้ผลของอีกตัว ห้ามรันก่อนตัวนั้นเสร็จ
รายงานรวมไม่เกิน 400 คำ และระบุของส่งของแต่ละบทบาท
```

| ส่วน | หน้าที่ |
|---|---|
| Step 0 | สเปกและ TASKS มาก่อนคนอื่น |
| must NOT run before | กันห้าตัววิ่งพร้อมกันโดยไม่รอสเปก |
| คนละไฟล์ | กัน diff ชน |
| under 400 words | กันรายงานยาวจน leader อ่านไม่ไหว |
| รัน quality gate | qa ต้องมีหลักฐาน |

## Common pitfalls / กับดัก

- ไม่มีประโยค dependency — ห้าตัววิ่งพร้อมกันทั้งที่สเปกยังไม่มี งานจบคนละแอป
- qa รายงานว่าผ่านทั้งที่ไม่ได้รัน `node scripts/quality-gate.js` — นี่คือเหตุผลที่ขั้นตรวจของคุณต้องรัน gate ซ้ำเสมอ
- writer คิดยอดเอง — เลขในสรุปคนละตัวกับ API ตรวจจับได้ด้วยการเทียบกับ JSON จริง
- ใช้ `claude -p` — เขียนเอเจนต์ใต้ `.claude/` ไม่ได้ ทำใน TUI
- `--max-turns` ต่ำ — หมดรอบตอนเขียนสเปก งานใหญ่ต้องเผื่อรอบ
- เซิร์ฟเวอร์ค้างที่พอร์ต 3000 — qa รัน quality gate ไม่ขึ้น ปิดเซิร์ฟเวอร์เก่าก่อนให้ qa เริ่ม

## Quick check / ทบทวน

<details>
<summary>1. ไฟล์กลางของรอบนี้คืออะไร</summary>
PRODUCT-SPEC.md กับ TASKS.md
</details>

<details>
<summary>2. คู่ไหนขนานได้</summary>
developer กับ writer หลังสเปกเสร็จ และคนละไฟล์
</details>

<details>
<summary>3. qa เชื่ออะไร</summary>
exit code ของ quality gate และเนื้อ JSON ของ health ไม่ใช่คำบอกของผู้พัฒนา
</details>

## Go deeper

- [Failure modes](../../reference/failure-modes.md)
- [อภิธาน](../../reference/glossary-th-en.md)
