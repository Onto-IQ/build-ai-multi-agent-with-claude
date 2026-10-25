# run-009 — Thai Prompt: สร้าง Specialty Agent (product-writer)

- **Module/Workshop:** Module 4 / Workshop 2 — เกณฑ์ B1–B3 (ทดสอบ **prompt ภาษาไทย** สร้าง agent)
- **เวลา:** 2026-09-29T04:20+07:00 | **Claude Code:** 2.1.284 | **โหมด:** headless `-p --permission-mode bypassPermissions --max-turns 10` (ตามข้อสรุป run-003)
- **Working dir:** `labs-sandbox/demo-shop`

- **Prompt ที่ส่ง (ไทยล้วน):** สั่งสร้าง `.claude/agents/product-writer.md` — copywriter สินค้าภาษาไทย โดยระบุ frontmatter เป็นภาษาไทย (name product-writer / description นักเขียนคำโฆษณา... ใช้ proactively... / tools Read,Grep,Glob / model sonnet) และ body 3 ส่วน

- **ผลลัพธ์จริง (frontmatter ที่ถูกสร้าง — คัดลอกมาตรง):**

```yaml
---
name: product-writer
description: นักเขียนคำโฆษณาสินค้า (copywriter) ภาษาไทยประจำร้าน demo-shop นี้ ใช้ proactively เมื่อต้องเขียนหรือแก้คำบรรยายสินค้า หน้าขาย หรือข้อความบน storefront
tools: Read, Grep, Glob
model: sonnet
---
```

- **ข้อสังเกต (ประสบการณ์ที่เขียนลงสื่อ):**
  1. **สั่งเป็นภาษาไทย แต่ "ค่า" ที่เป็น machine-readable ยังถูกเขียนถูกต้อง** — `name: product-writer` เป็น Latin kebab-case, `tools`/`model` ตรงสเปก (สำคัญมาก: ถ้า Claude เผลอใส่ "ชื่อไทย" ใน name จะใช้ @-mention ไม่ได้ — ครั้งนี้ไม่เกิด)
  2. `description` เป็นภาษาไทยได้เต็มที่ และวลี trigger **"ใช้ proactively เมื่อ..."** ถูกแปลรูปแบบมาได้ถูกตำแหน่ง (routing อ่าน description ได้)
  3. **Body ของ system prompt ถูกเขียนเป็นภาษาอังกฤษโดย default** ("You are the Thai product copywriter...") แม้สั่งเป็นไทย — ถ้าอยากได้ body ไทย ต้องระบุ "เขียน body เป็นภาษาไทย" ใน prompt (เป็นทางเลือก ไม่ใช่ข้อผิดพลาด — system prompt ภาษาอังกฤษเป็นค่าที่พบบ่อยในอุตสาหกรรม)
  4. ใช้ bypassPermissions ตามบทเรียน run-003 — ผ่านรอบเดียว ไม่ต้อง iterate
- **สรุป:** **PASS** — Thai prompt สร้าง agent ได้ถูกต้องครบ
