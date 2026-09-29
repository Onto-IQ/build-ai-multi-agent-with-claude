# Module 3 — Parallel Execution ด้วย Swarm Pattern

> **เวลา:** ~60 นาที (สอน 25 + Workshop 1 35) | **ผลลัพธ์ที่คาดหวัง:** ผู้เรียนสั่งงาน Subagent หลายตัวขนานกันจาก Prompt เดียว และได้รายงานรวมกลับมาที่ Leader

## 1. Subagent ทำงานอย่างไร

เมื่อ Leader (บทสนทนาหลักของ Claude Code) ได้รับโจทย์ มันสามารถ **dispatch Subagent** — สำเนาที่มี:

- **Context แยก** — ไม่เห็นบทสนทนาหลัก (ได้เฉพาะโจทย์ที่ Leader เขียนส่งให้)
- **Tools ของตัวเอง** — เช่น Explore อ่านได้อย่างเดียว
- **ขอบเขตชัดเจน** — ทำจบแล้ว "สรุปผล" กลับมาเท่านั้น

ประโยชน์ที่แท้จริง: งานที่ output ยาวมาก (สแกน 20 ไฟล์, ค้น 50 หน้าเว็บ) จะไม่ท่วม context ของบทสนทนาหลัก — Subagent อ่านเองแล้วสรุปสั้น ๆ มาให้

## 2. Leader-first Interaction — วิธีสั่งที่ถูก

หลักการ: **ส่ง "โจทย์ระดับสูง" ให้ Leader ก่อน แล้วให้ Leader เป็นคนแตกงาน** — อย่าสั่งละเอียดเอง เพราะ Leader รู้จักเครื่องมือและจัดการ dispatch ให้

Anatomy ของ prompt สั่ง Swarm ที่ดี:

```text
[1. บริบท]     สิ่งที่ Leader ควรรู้ก่อน (แอปอะไร, อยู่ไหน)
[2. เป้าหมาย]   ผลลัพธ์สุดท้ายหน้าตาเป็นอย่างไร
[3. การแตกงาน]  ให้แบ่งเป็นกี่ส่วน แต่ละส่วนทำอะไร (หรือให้ Leader เสนอ)
[4. รูปแบบผล]   รายงานรวมยาวเท่าไร โครงหน้าตาอย่างไร
[5. ขอบเขต]     ห้ามทำอะไร (แก้ไขไฟล์, รันคำสั่งที่เสี่ยง)
```

## 3. Prompt ตัวอย่างหลักของ Workshop 1 ✅ tested (runs/module-03/)

```text
This is a small Node.js demo shop project. Dispatch 3 parallel Explore
subagents to investigate it:
1. Map the project structure and how the server starts.
2. List every HTTP endpoint and what each one does.
3. Flag suspicious code patterns worth a security/quality review.
Return ONE consolidated report under 300 words, grouped by the 3 areas.
Do not modify any files.
```

อ่านทีละส่วน:

| ส่วน | ทำหน้าที่ |
|---|---|
| `Dispatch 3 parallel Explore subagents` | บอก Leader ให้ใช้ tool สร้าง Subagent ชนิดอ่านอย่างเดียว 3 ตัวพร้อมกัน |
| เลข 1–3 (สาม task) | งานที่ "ไม่ขึ้นต่อกัน" — จึงขนานได้ปลอดภัย |
| `Return ONE consolidated report under 300 words` | บังคับ Leader สรุปรวม ไม่ตอกย้ำรายงานดิบยาว ๆ |
| `Do not modify any files` | ขอบเขต — ป้องกัน Agent แก้โค้ดเกินหน้าที่ |

### เวอร์ชันภาษาไทย (✅ tested — runs/module-03/run-008)

```text
นี่คือโปรเจกต์ร้านค้าตัวอย่างที่เขียนด้วย Node.js จง dispatch Explore subagent แบบขนานกัน 3 ตัวเพื่อสำรวจโปรเจกต์นี้:
1. สำรวจโครงสร้างโปรเจกต์และวิธีที่ server เริ่มทำงาน
2. รายการ HTTP endpoint ทั้งหมดพร้อมระบุว่าแต่ละตัวทำอะไร
3. ชี้ code pattern ที่น่าสงสัยซึ่งควรได้รับการ review เรื่องความปลอดภัยหรือคุณภาพ
ส่งรายงานรวมเป็นชุดเดียวไม่เกิน 300 คำ แบ่งตาม 3 หมวดข้างต้น ห้ามแก้ไขไฟล์ใด ๆ
```

ผลจริงเทียบกับเวอร์ชัน EN (run-002): dispatch ขนานเหมือนกันทุกประการ แต่**รายงานออกเป็นภาษาไทยทั้งชุด** — สิ่งที่ควรเป็นภาษาเทคนิค (`server.js:86`, ชื่อ endpoint, HTTP method) ยังถูกพิมพ์ถูกต้อง และ Agent จัด severity HIGH/MEDIUM/LOW ให้เอง

## 4. วิธีรัน — 2 โหมด

**TUI แบบโต้ตอบ (ในชั้นเรียน):**

```bash
cd labs-sandbox/demo-shop
claude
```

แล้ววาง prompt ข้างบน — สังเกตหน้าจอ: Leader จะเรียก Task tool แล้วแสดง Subagent ทำงานพร้อมกัน

**Headless (สำหรับทดสอบ/ระบบอัตโนมัติ):**

```bash
claude -p "<prompt>" --allowedTools "Task" --max-turns 20
```

- `--allowedTools "Task"` — อนุญาตการ dispatch Subagent ล่วงหน้า (headless ไม่มีคนกดอนุมัติ)
- `--max-turns 20` — เพดานรอบการทำงาน กันวนไม่สิ้นสุด

## 5. ผลที่คาดหวัง (จากการรันจริง)

Leader dispatch 3 Subagents → รายงานรวมแบ่ง 3 หมวด: โครงสร้างโปรเจกต์ / endpoints ทั้งหมด (ระบุ GET /api/products, GET /api/products/:id, POST /api/cart/total, GET /api/admin/stats) / จุดน่าสงสัย (เช่น JSON.parse ไม่มี try-catch, hardcoded token) — transcript จริงดูได้ที่ [runs/module-03/](../../runs/module-03/)

## 6. กับดักที่พบบ่อย

- สั่ง "หาทุกอย่าง" โดยไม่จำกัดความยาวรายงาน → ได้ผลลัพธ์ท่วม context
- แตกงานที่ "ขึ้นต่อกัน" ให้ขนาน → ผลขัดแย้งกัน (ตัวหนึ่งสมมติ A อีกตัวสมมติ B)
- ลืม `Do not modify` ในงานสำรวจ → Agent แก้โค้ดไปด้วยโดยไม่ได้ขอ
