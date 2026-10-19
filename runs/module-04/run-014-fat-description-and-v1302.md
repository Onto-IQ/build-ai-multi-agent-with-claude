# run-014 — เวอร์ชันใหม่ 2.1.302: ทดสอบ warning คำอธิบาย 15,000 token + ยืนยันข้อความฟิลด์สะกดผิด + validate ซ้ำ

- **โมดูล/เวิร์กช็อป:** โมดูลที่ 4 (หัวข้อ 2) — กลไกคำอธิบายและเวอร์ชัน
- **เวลา:** 2026-10-17T11:36–11:52+07:00 | **Claude Code:** อัปเกรด 2.1.284 → **2.1.302** ระหว่างการทดสอบ (คำสั่ง `claude update`) | **โหมด:** headless `-p` + `claude plugin validate` + debug log
- **แซนด์บ็อกซ์:** `labs-sandbox/agent-lab-fat/` — เอเจนต์ 10 ตัว (`fat-agent-01..10`) สร้างด้วยสคริปต์ description เป็นประโยคฟิลเลอร์ซ้ำ ๆ ปรับขนาด 3 รอบ

## ทดสอบที่ 1 — คำเตือนเมื่อคำอธิบายรวมกันเกิน 15,000 โทเคน (ตามเอกสารทางการ)

เอกสารระบุ: "When the combined descriptions of your subagents, except the built-in ones, exceed 15,000 tokens, Claude Code shows a warning at startup with the total token count."

| รอบ | ขนาด description รวม (10 ไฟล์) | ประมาณ token | ผลใน `-p` (stdout+stderr) | debug log |
|---|---|---|---|---|
| 1 | 40 KB | ~10k | ไม่มีคำเตือน (ยังไม่ถึงเกณฑ์) | — |
| 2 | 80 KB | ~20k | ไม่มีคำเตือน | ไม่มีรายการ |
| 3 | 120 KB | ~28k | ไม่มีคำเตือน (`--debug` ด้วย) | ไม่มีรายการ |

**ข้อสรุปจากของจริง:** ตัวเตือนเกิน 15,000 โทเคน**ไม่ปรากฏในโหมด headless `-p` ทั้ง stdout/stderr/debug log** — เป็นคำเตือนตอนเริ่มต้น (startup) ของ TUI แบบโต้ตอบ (ยังไม่ได้ทดสอบบน TUI — ผู้สอนตรวจซ้ำในห้องได้โดยสร้างเอเจนต์ชุดเดียวกันแล้วเปิด `claude` ปกติ)

## ทดสอบที่ 2 — ฟิลด์สะกดผิดบน 2.1.302 (ฟีเจอร์ v2.1.296+)

```bash
cd labs-sandbox/agent-lab
claude -p "Say OK" --max-turns 3 --debug   # แล้วค้น ~/.claude/debug/*.txt ล่าสุด
```

ผลจริง (ข้อความจริงใน debug log):

```text
[WARN] Agent file ...agents\typo-field.md has a frontmatter key Claude Code does not
recognize or apply: "disallowedtools" (did you mean "disallowedTools"?)
```

→ บน 2.1.302 ข้อความ "does not recognize or apply" **มีจริง พร้อมคำแนะนำ did-you-mean** ตามเอกสาร (ต่างจาก 2.1.284 ที่เงียบ — ดู run-013)

## ทดสอบที่ 3 — `claude plugin validate .claude` ซ้ำบน 2.1.302

ผลจริง: เหมือน 2.1.284 ทุกประการ — bad-yaml.md = **ข้อผิดพลาด** (YAML Parse error + คำอธิบายว่า runtime ข้ามไฟล์), no-desc.md = **คำเตือน**, ไฟล์ที่เหลือ (no-name, no-frontmatter, dash-name, colon-name, typo-field) ไม่ถูกกล่าวถึง, EXIT=1

## ข้อสังเกต/ปัญหา

1. คำเตือน "คำอธิบายเกินงบ" วัดผลใน headless ไม่ได้ — สื่อการสอนจึงเขียนว่า "เตือนตอนเปิดเซสชัน" ได้ตามเอกสาร แต่อย่าสอนว่าจะเห็นใน `-p`
2. เวอร์ชันสำคัญกับ debug message: ครึ่งหนึ่งของประโยชน์จาก `--debug` มีเฉพาะ v2.1.296+ (คอร์สควรบังคับผู้เรียนอัปเดต CLI ≥ 2.1.296 ใน Module 2)
3. การอัปเกรดใช้ `claude update` — ใช้ได้ทันทีกับ `claude -p` รอบถัดไป ไม่ต้องรีสตาร์ตเครื่อง

## สรุป: ผ่านพร้อมข้อสังเกต

(1) เกณฑ์ 15,000 โทเคนยังเป็นข้ออ้างตามเอกสาร — ยืนยันตัวเตือนบน TUI ไม่ได้ด้วยเครื่องมือ headless (2) ข้อความฟิลด์สะกดผิด + did-you-mean ยืนยันจริงบน 2.1.302 (3) validate เหมือนกันทั้งสองเวอร์ชัน
