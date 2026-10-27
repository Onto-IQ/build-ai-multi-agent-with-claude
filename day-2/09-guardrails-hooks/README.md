# Module 9 — Quality gate / Guardrails, hooks และ cost gate

> ⏱ ~55 นาที · 🎯 ทำให้ quality gate สามเคสผ่าน และมี hook ที่บล็อกคำสั่งอันตราย พร้อม cost gate · Turn the three gate cases green, and add a command hook plus a cost gate.

## Key idea / แนวคิดหลัก — เล่าเป็นเรื่อง

ถึงตอนนี้เราได้ยินกันมาทั้งวันว่า "บอกกติกาใน prompt" แล้วทำงานได้ — แต่ prompt คือคำขอ ไม่ใช่กำแพง เอเจนต์ที่ลืมอ่าน อ่านผิด หรือตีความต่างไป จะทะลุ prompt ไปได้เฉย ๆ วันนี้คือวันของสิ่งที่**บังคับได้จริง**: กฎที่รันเองทุกครั้งโดยไม่ขออนุญาตจากใคร

เครื่องมือชั้นแรกคือ quality gate — สคริปต์ตรวจสามเคสของแอป ที่ถูกออกแบบมาให้**แดงตั้งแต่ต้น** เพราะข้อมูลกับตัวรับ POST ถูกปลูกปัญหาไว้ตั้งแต่โครงเริ่ม งานของคุณคือแก้แอปให้เขียว — ไม่ใช่แก้ gate เองให้เขียว ซึ่งเป็นกับดักที่ผู้เรียนเจอจริงทุกรุ่น

เครื่องมือชั้นที่สองคือ **hook** — สคริปต์ของคุณที่ Claude Code เรียกตรงจุดสำคัญ กฎกลไกมีข้อเดียวที่ต้องจำให้ขาด: **exit code 2 คือการบล็อก** — exit อื่นไม่บล็อก และข้อความที่ hook พิมพ์ออก stdout Claude จะอ่านต่อ ดังนั้นตอนบล็อก ให้เขียนเหตุผลไว้ที่ stderr แทน

ส่วน cost gate คือ hook อีกตัวที่อ่าน `total_cost_usd` เพดานของห้องนี้ตั้งไว้ที่ 2 USD และ output ไม่เกิน 20000 token เป็นค่าสอน — หลังซ้อมจริงแล้วให้จดตัวเลขจากรันจริงแล้วค่อยขยับเพดานของคุณเอง

> EN: Permissions and hooks enforce rules. Exit 2 blocks. Fix the app and the CSV, not the gate.

## Concept / เนื้อหา

สามชั้นของการคุมเอเจนต์ เรียงจากบางไปหนา (แผ่นอ้างอิง):

| ชั้น | เครื่องมือ | กันอะไร |
|---|---|---|
| สิทธิ์ | `tools`, `disallowedTools`, กล่องใน TUI | เอเจนต์ทำเกินบทบาท |
| คนอยู่ในวง | หยุดก่อนเขียนทับไฟล์ใหญ่ ๆ | งานหลุดทางโดยไม่มีคนดู |
| Hook | `PreToolUse`, `TaskCompleted` | กฎที่รันเองทุกครั้ง |

`PreToolUse` ดัก**ก่อน**เครื่องมือรัน (เช่น ห้ามคำสั่งอันตราย) ส่วน `TaskCompleted` ดักตอนเอเจนต์จะปิดงาน (เช่น ห้ามปิดทั้งที่ gate ยังแดง)

ในคำตอบอ้างอิง hook แรกอ่าน JSON จาก stdin แล้วบล็อก `rm -rf`, `taskkill`, `Remove-Item -Recurse` และคำสั่งที่ไปป้อนเชลล์ ส่วน hook ที่สองบล็อกเมื่องานจะจบทั้งที่ quality gate ยังไม่ผ่าน โดยดูฟิลด์ `qualityGatePassed` ใน payload ตัวอย่าง

quality gate สามเคสที่ต้องเขียว:

1. `data-quality` — `data/sales.csv` ต้องไม่มี violation
2. `bad-json-does-not-crash` — `POST /api/notes` ด้วยของที่ไม่ใช่ JSON แล้ว `/api/health` ยังตอบ
3. `summary-matches-valid-rows` — ยอดและจำนวนออเดอร์ตรงกับแถวที่ใช้ได้ โดยปัดสตางค์ทีละแถว

## ลงมือทำตามลำดับ

```bash
node scripts/quality-gate.js
```

1. เริ่มด้วยการรัน gate เองในเทอร์มินัล — ต้องเห็น **FAIL (exit 2)** ตามออกแบบ จดว่าเคสไหนแดง

2. เปิด TUI แล้ววาง prompt จากหัวข้อถัดไป — ให้เอเจนต์แก้ข้อมูลกับ `server.js`

3. **อย่าเชื่อคำว่า "ผ่าน"** — รัน gate ซ้ำด้วยมือคุณใน Git Bash อีกครั้ง:

```bash
node scripts/quality-gate.js && echo GATE-GREEN
```

   ต้องได้ exit 0 และคำว่า `GATE-GREEN` — นี่คือหลักฐานเดียวที่นับ

4. หลัง gate เขียว ติดตั้ง hook ตามคำตอบอ้างอิง แล้วลองสั่งคำสั่งต้องห้าม (เช่น ขอให้ลบโฟลเดอร์ด้วย `rm -rf`) — คำสั่งต้องถูกบล็อกพร้อมเหตุผลที่อ่านได้

## Prompt pattern — เลือกใช้อย่างใดอย่างหนึ่ง

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
scripts/quality-gate.js currently FAILS. Replace data/sales.csv with a cleaned file and change server.js only enough that all three cases pass. Do not edit scripts/quality-gate.js. Then show me the command output.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
scripts/quality-gate.js ตอนนี้ FAIL ให้แทนที่ data/sales.csv ด้วยไฟล์ที่สะอาด และแก้ server.js น้อยที่สุดจน quality gate สามเคสผ่าน ห้ามแก้ scripts/quality-gate.js แล้วแสดงผลคำสั่งให้ดู
```

> 📚 **ทำไมแนะนำ EN:** งานเทคนิคหนักแบบนี้คอร์สทดสอบภาษาไทยมาแล้วและผ่าน (แม้จับข้อขัดแย้งของสเปกได้) — แนะนำ EN เพราะรายงาน findings จะอยู่ภาษาเดียวกับ output ของ quality gate ที่คุณต้องเทียบ

| ส่วน | หน้าที่ |
|---|---|
| currently FAILS | ชี้ของที่ตรวจ |
| only enough | กันการเขียนแอปใหม่ |
| Do not edit the gate | กันการแก้ตัวตรวจ |
| show the output | บังคับให้มีหลักฐาน ไม่ใช่คำรับรอง |

## Common pitfalls / กับดัก

- แก้ `scripts/quality-gate.js` แทนการแก้ข้อมูลหรือ `server.js` — เท่ากับแอบแก้ข้อสอบให้ตัวเองสอบผ่าน ตัวตรวจตายตัวแล้วเสียหลักฐานทั้งชุด
- ใช้ `claude -p` — Bash ถูกปฏิเสธ quality gate จึงไม่ถูกยืนยัน
- `--max-turns` ต่ำ — หมดรอบตอนอ่านไฟล์ ยังไม่ทันได้ try/catch
- hook พิมพ์ข้อความบล็อกทาง stdout — เอเจนต์อ่านแล้วสับสนว่าเป็นคำสั่งต่อ บล็อกให้เขียนที่ stderr
- คิดว่า exit 1 คือบล็อก — ตัวบล็อกคือ 2 เท่านั้น
- รัน `taskkill //IM node.exe` ระหว่าง quality gate — ฆ่าเซิร์ฟเวอร์ทั้งห้อง สั่งตัวตายเฉพาะตัว

## Quick check / ทบทวน

<details>
<summary>1. exit 2 ของ hook แปลว่าอะไร</summary>
เครื่องมือหรือการปิดงานนั้นถูกบล็อก
</details>

<details>
<summary>2. ทำไมวันแรก quality gate ต้องแดง</summary>
เพราะข้อมูลและตัวรับ POST ยังเป็นจุดเริ่มต้นที่ปลูกไว้
</details>

<details>
<summary>3. เพดาน 2 USD มาจากไหน</summary>
เป็นเพดานห้องเรียน จนกว่าจะมี total_cost_usd จากรันจริง
</details>

## Go deeper

- [Failure modes](../../reference/failure-modes.md)
