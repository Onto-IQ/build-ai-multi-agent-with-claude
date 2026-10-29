# Module 6 — แก้ crash ด้วย QA handoff / Fix with a QA handoff

> ⏱ ~45 นาที · 🎯 แยกคนเขียนกับคนพิสูจน์ · รอบ A คนจัดคิว handoff · รอบ B encode สัญญาเดิมให้เครื่องวิ่ง · quality gate **6/6**

แบบฝึกหัด (prompt ที่ต้องคัดลอก) อยู่ที่ **[LAB.md](LAB.md)** — หน้านี้สำหรับอ่านทบทวนแนวคิด

## Key idea / แนวคิดหลัก — เล่าเป็นเรื่อง

Workshop 3 จบด้วยเว็บที่โชว์ยอดจริงแล้ว แต่ gate ยัง **2/6** — เหลือ crash จาก JSON พัง, health ที่รั่ว token, และโน้ตที่ไม่ได้ตรวจ/ไม่ได้เก็บลงไฟล์

ถ้าสั่ง `@developer` แก้ต่อเลย บทเรียนจะหายไป: คนที่เพิ่งเขียนโค้ดมัก “รู้สึกว่าเทสแล้วเวิร์ก” โดยไม่ได้รีโปรดิวส์บั๊กด้วย request จริง

เลยเปิดบทบาท **qa** คนละไฟล์เอเจนต์ — มี Bash ให้ออก request ได้ แต่**ห้ามแก้** `server.js` · งานของ qa คือรีโปรดิวส์ → เขียน `docs/QA-REPORT.md` → หลัง developer แก้แล้วรันรีโปรดิวส์เดิมซ้ำแล้ว append ผล

> EN: Separate the writer from the prover. QA reproduces with real requests, writes a file handoff, never edits server.js. Developer fixes only the findings. Gate closes at 6/6.

### ตอบข้อโต้แย้ง: “ให้คนเป็น Orchestrator ไม่ practical”

ในงานจริง**ไม่มีคนพิมพ์ต่อทุกข้อความแทนเอเจนต์** — แต่ยังมี orchestrator เสมอ แค่ย้ายจาก “นิ้วคุณ” ไปเป็น leader agent / skill / hook / CI

สิ่งที่ไม่ practical คือการให้คนส่งแชททีละประโยคตลอดโปรดักชัน · สิ่งที่ practical คือ**ถือสัญญาและจุดหยุด** (ใครทำอะไร · ส่งไฟล์อะไร · เมื่อไหร่ถึงถือว่าผ่าน)

วันนี้คุณถือสัญญาก่อน (รอบ A) · ท้ายแล็บ encode สัญญาเดิมให้เครื่องวิ่งซ้ำ (รอบ B) · วันพรุ่งนี้คอร์สจะให้เครื่องถือสัญญาแทนมากขึ้น (Skills → Guardrails → Capstone)

| ที่มักเข้าใจผิด | ที่คอร์สสอน |
|---|---|
| ทุกโปรดักชันต้องมีคนคลิกทีละขั้น | คลิกทีละขั้น = **รอบเรียนรู้** รอบเดียว แล้ว encode |
| ไม่มี orchestrator = ทันสมัยกว่า | ไม่มีสัญญา = กลับไปมุก “เทสแล้วเวิร์ก” |
| Practical = ให้เอเจนต์คุยกันเองจนจบ | Practical = **สัญญาเดียวกัน** ให้คนหรือเครื่องวิ่งก็ได้ |

## Concept / เนื้อหา

| บทบาท | ทำ | ห้าม |
|---|---|---|
| `qa` | รีโปรดิวส์ · เขียน/อัปเดต `QA-REPORT.md` · ตรวจซ้ำหลังแก้ | แก้ `server.js` / แตะ `quality-gate.js` / แก้ CSV |
| `developer` | แก้ตาม findings ในรายงานเท่านั้น | เดาบั๊กเองโดยไม่อ่านรายงาน · แตะ gate |
| คุณ | รัน `npm run gate` เป็นหลักฐานปิด | ให้เอเจนต์เป็นคนเดียวที่ “บอกว่าผ่าน” |

### วงจร handoff (หัวใจของบทนี้)

```text
gate 2/6 (ของแดงจาก W3)
    → @qa รีโปรดิวส์ + เขียน QA-REPORT.md   (handoff 1)
    → @developer แก้ตาม findings            (handoff 2)
    → คุณรัน npm run gate → 6/6
    → @qa รันรีโปรดิวส์เดิมซ้ำ + append      (ปิดวงจร)
```

ของส่งบนดิสก์:

| ของส่ง | บทบาท |
|---|---|
| gate แดง 4 เคส | จุดเริ่ม — อย่าแก้ก่อนมีรายงาน |
| `docs/QA-REPORT.md` | สัญญา findings (crash · token · notes) + บรรทัด `server.js` + วิธีรีโปรดิวส์ |
| `server.js` หลังแก้ | ของจาก developer ตามรายงานเท่านั้น |
| หัวข้อ Evidence after fix ในรายงานเดิม | หลักฐานว่าบั๊กเดิมหาย — ใช้ต่อตอน deploy (Module 13) |

### ทำไมต้องแยก qa ออกจาก developer

| ถ้าใช้มือเดียว | จะเกิดอะไร |
|---|---|
| developer เขียนแล้ว “เทสในหัว” | พลาดเคสที่ gate จับได้ (เช่น body ไม่ใช่ JSON) |
| แก้โดยไม่อ้างบรรทัด | รายงานย้อนรอยไม่ได้ตอนรีวิว/deploy |
| ให้คนเดียวทั้งเขียนและปิดเคส | สอนนิสัย “ผ่านเพราะฉันบอก” แทน “ผ่านเพราะมีหลักฐาน” |

รายงานเป็น**ไฟล์**จึงตัดมุก “ผมเทสแล้วเวิร์ก” — อีกฝ่ายอ่าน finding ได้โดยไม่ต้องนั่งดูแชทยาว

### สี่เคสที่เหลือจาก Workshop 3 (ตั้งใจค้างไว้)

| เคส gate | อาการที่ qa ต้องรีโปรดิวส์ |
|---|---|
| `bad-json-does-not-crash` | `POST /api/notes` ด้วย body ที่ไม่ใช่ JSON → เซิร์ฟเวอร์ล้ม |
| `health-no-secrets` | `/api/health` โชว์ token / สตริงคล้าย `sk-` |
| `notes-validation` | ขาด `text` หรือ text ว่างแล้วยังไม่ตอบ 400 ตามสัญญา |
| `notes-persists` | โน้ตอยู่ในหน่วยความจำอย่างเดียว — รีสตาร์ทแล้วหาย |

Workshop 3 สั่ง teammate **ห้าม** แก้สี่เคสนี้ — ถ้าได้ 6/6 ตั้งแต่ W3 แสดงว่าทีมช่วยเกินสเปก (ใช้ catch-up `w3` ถ้าห้องต้องการซ้อมเส้นทาง 2/6 → 6/6)

## ลำดับในห้อง (ภาพรวม)

### รอบ A — บังคับ (เรียนรู้สัญญา · คนจัดคิว)

1. รัน `npm run gate` — จด FAIL ทั้งสี่ (ยังไม่แก้)
2. สร้าง `.claude/agents/qa.md` → ปิด TUI แล้วเปิด `claude` ใหม่
3. `@qa` สืบสวนสี่เคส → ได้ `docs/QA-REPORT.md` สาม findings (ห้ามแก้ของ)
4. `@developer` แก้ตามรายงานเท่านั้น
5. คุณรัน gate เอง → คาด **6/6 exit 0**
6. `@qa` รันรีโปรดิวส์เดิมซ้ำ → append Evidence after fix

### รอบ B — สั้น (encode สัญญาเดิม · conductor prompt)

หลังรอบ A ผ่านแล้ว (หรือใช้ catch-up แล้วอยากซ้อมเส้นทางอัตโนมัติ): สั่ง **prompt เดียว** ให้ main จัดคิว `@qa` → `@developer` ตามไฟล์เดิม — **ยังไม่เปิด Agent Teams** — และ**หยุดก่อน gate** ให้คุณรัน `npm run gate` เอง แล้วค่อยให้ `@qa` append Evidence

ข้อความเต็มอยู่ที่ [LAB.md](LAB.md) หัวข้อรอบ B

แผนที่ไปต่อในคอร์ส (อย่าคิดว่า W4 จบแล้ว automated ทั้งระบบ):

| หลัง W4 | ใครถือสัญญา |
|---|---|
| W5 Skills | checklist ซ้ำได้โดยไม่ต้องจำขั้นตอน |
| W7 Hooks + gate | เครื่องบังคับ stop condition |
| Capstone | leader-first จัดคิวบทบาทบนสเปกเดียว |

## สิ่งที่ต้องจำ (ทบทวน)

| จุด | ความหมาย |
|---|---|
| QA ≠ developer | คนพิสูจน์ห้ามแก้โค้ดที่กำลังตรวจ |
| รีโปรดิวส์ก่อนเขียนรายงาน | finding ที่ไม่มี request จริง = เดา |
| รายงานเป็นไฟล์ handoff | developer อ่านสัญญา ไม่เดาจากแชท |
| แก้ตาม findings เท่านั้น | อย่า “เก็บงาน” เกินรายงานในรอบนี้ |
| คุณเป็นคนปิด gate | `npm run gate` คือหลักฐาน ไม่ใช่คำพูดเอเจนต์ |
| รอบ A แล้วค่อยรอบ B | เห็นสัญญาก่อน แล้วค่อยให้เครื่องวิ่งซ้ำ |
| ปิดเซิร์ฟเวอร์ก่อน gate | port 3000 ค้างทำให้ผลเพี้ยน (เหมือน W3) |

## Common pitfalls / กับดัก

- สั่ง developer แก้ก่อนมี `QA-REPORT.md`
- qa มีสิทธิ์ Edit/Write โค้ดแอป — ต้องไม่มีใน tools ของ qa (มี Bash สำหรับ request ได้)
- ลืมรีสตาร์ท TUI หลังสร้าง `qa.md` → `Agent type not found`
- gate ยังแดงเพราะเซิร์ฟเวอร์เก่าค้างพอร์ต
- developer แตะ `scripts/quality-gate.js` เพื่อให้ผ่านแบบปลอม
- ได้ 6/6 แล้วข้ามขั้น qa ตรวจซ้ำ — วงจร handoff ยังไม่ปิด
- ข้ามรอบ A ไปรอบ B ตั้งแต่ต้น — จะไม่เห็นจุดหยุด handoff
- เปิด Agent Teams ในรอบ B — บทนี้สอนสัญญาไฟล์ ไม่ใช่ Teammate คุยกันเอง

## Quick check / ทบทวน

<details>
<summary>1. ทำไมไม่ให้ developer แก้สี่เคสแดงเองตั้งแต่ต้น</summary>
เพราะบทนี้สอนการแยกคนเขียนกับคนพิสูจน์ — ต้องมีรายงานเป็นไฟล์ก่อนลงมือแก้
</details>

<details>
<summary>2. qa แก้ server.js ได้ไหม</summary>
ไม่ได้ — qa รีโปรดิวส์และเขียนรายงานเท่านั้น มี Bash สำหรับยิง request ได้ แต่ห้าม Edit โค้ดแอป
</details>

<details>
<summary>3. ทำไมต้องให้คุณรัน npm run gate เอง</summary>
เพื่อมีหลักฐานนอกแชทว่า 6/6 จริง — ไม่ให้อาศัยคำพูดเอเจนต์อย่างเดียว
</details>

<details>
<summary>4. Evidence after fix อยู่ไฟล์ไหน</summary>
append ใน docs/QA-REPORT.md ไฟล์เดิม — ไม่สร้างรายงานใหม่ทิ้งของเก่า
</details>

<details>
<summary>5. รอบ B แทนที่การมี orchestrator ได้เลยไหม</summary>
ไม่ได้แทนในความหมาย “ไม่มี orchestrator” — รอบ B แค่ย้ายนิ้วคุณไปเป็น conductor prompt ที่วิ่งสัญญาเดิม และยังหยุดให้คุณปิดด้วย gate
</details>

## Go deeper

- [LAB.md](LAB.md) — แบบฝึกหัด Workshop 4
- [Module 5 — Hybrid](../05-sequential-orchestration/README.md) (ของแดง 2/6 ที่ส่งต่อมา)
- [Module 9 — Guardrails](../09-guardrails-hooks/README.md) (gate + hook ชั้นถัดไป)
- [Module 13 — Deploy](../13-deploy-preflight/README.md) (ใช้รายงานเป็นหลักฐานก่อนขึ้นของจริง)
- [Failure modes](../../reference/failure-modes.md)
