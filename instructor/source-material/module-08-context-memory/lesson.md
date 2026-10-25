# Module 8 — Context Engineering & Persistent Memory

> **เวลา:** ~30 นาที | **ผลลัพธ์ที่คาดหวัง:** ผู้เรียนออกแบบการไหลของ context ให้ทีม Agent ไม่ท่วม และตั้ง Memory ให้ Agent จำข้ามเซสชันได้

## 1. Context Window คือทรัพยากรที่แพงที่สุดในระบบ Multi-Agent

กฎ 3 ข้อที่ควบคุมทุกการออกแบบ:

1. **Context ของแต่ละ Agent แยกกัน** — Subagent ไม่เห็นบทสนทนาหลัก (ได้เฉพาะ task ที่ Leader เขียน)
2. **ทุกอย่างที่ไหลกลับมา กิน context ของ Leader** — รายงาน 2,000 คำ × 5 agent = บานปลาย
3. **Context ที่ดี ≠ Context ที่มาก** — มากมักแปลว่า noise

## 2. Summarization Handoff — หัวใจของการส่งงาน

สิ่งที่ Subagent ควรส่งกลับ Leader ไม่ใช่ "ทุกอย่างที่เจอ" แต่คือ:

- คำตอบของโจทย์ (กระชับ)
- หลักฐานอ้างอิง (`file:line`, ลิงก์)
- ความไม่แน่นอน/สิ่งที่ตรวจไม่ได้

นี่คือเหตุผลที่ lesson ของเราบังคับ "รายงานไม่เกิน 300 คำ" ตั้งแต่ Workshop 1 — และเป็นเหตุผลที่ Anthropic ออกแบบระบบวิจัยให้ subagent "บีบอัดผล" ก่อนส่งกลับเสมอ

**ปฏิบัติ:** เวลาเขียน prompt สั่งทีม ให้มีบรรทัดคุม output เสมอ (`under 300 words`, `5-line summary`, `table only`)

## 3. Persistent Memory — ให้ Agent จำข้ามเซสชัน

Subagent รองรับฟิลด์ `memory` ใน frontmatter — จำได้ 3 ระดับ:

| Scope | จำอะไร | ใช้เมื่อ |
|---|---|---|
| `user` | ของผู้ใช้ ข้ามทุกโปรเจกต์ | ความชอบ/สไตล์ส่วนตัว |
| `project` | ของโปรเจกต์นี้ แชร์ทีม | ข้อตกลงโครงสร้าง/ข้อตกลงโค้ด |
| `local` | โปรเจกต์นี้ เครื่องนี้ | สถานะการทำงานส่วนตัว |

```yaml
---
name: shop-librarian
description: Remembers project decisions. Use proactively at the start of long tasks.
tools: Read, Grep, Glob
memory: project
---
```

> บทบาทของ `CLAUDE.md` (Module 4) กับ `memory` ต่างกัน: CLAUDE.md คือความรู้ที่เรา**เขียนให้** (คงที่) — memory คือสิ่ง agent **เรียนรู้และจัดเก็บเอง** ระหว่างทำงาน

## 4. ทำตามทีละขั้น (10 นาที)

1. เพิ่ม `memory: project` ให้ `code-researcher` ใน sandbox
2. รัน (อังกฤษ/ไทยใช้ได้เหมือนกัน):

```text
EN: Ask the code-researcher subagent to remember: 'demo-shop uses plain Node http, no deps — do not suggest Express unless asked.'
TH: ให้ subagent code-researcher จดไว้ว่า: 'demo-shop ใช้ Node http ล้วน ไม่มี dependency — ห้ามแนะนำ Express เว้นแต่จะขอ'
```
3. ปิดเซสชัน → เปิดใหม่ → ถามซ้ำเรื่อง Express แล้วสังเกตว่า agent อ้างข้อตกลงที่จำไว้

## 5. กับดักที่พบบ่อย

- ให้ทุก agent มี memory ทุก scope → memory กลายเป็นขยะที่โหลดทุกครั้ง
- ใส่ความจริงที่เปลี่ยนบ่อยลง CLAUDE.md → ขัดแย้งกับสถานะจริง (ควรอยู่ในไฟล์ข้อมูล ไม่ใช่ instruction)
- ส่ง raw output กลับ Leader โดยไม่สรุป → context โดนกินใน 2-3 dispatch แรก
