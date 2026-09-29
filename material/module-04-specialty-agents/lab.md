# Workshop 2 — Specialty Agent Creation via Prompt

## บริบท

ทีมคุณถามคำถาม "โค้ดนี่ทำงานยังไง" กับ Leader บ่อยมาก จน context ของบทสนทนาหลักโดนรายละเอียดโค้ดกลบ คุณจะสร้าง **Code Researcher Agent** — ตัวอ่านอย่างเดียวที่รับคำถาม ไปค้นเอง แล้วสรุปพร้อมหลักฐาน line numbers

## โจทย์

สร้าง agent ไฟล์เดียวที่ `.claude/agents/code-researcher.md` **โดยให้ Claude เขียนไฟล์ให้** (prompt-driven) แล้วพิสูจน์ว่าใช้งานได้จริง

## ขั้นเริ่มต้น

```bash
cd labs-sandbox/demo-shop
claude
```

## เกณฑ์ผ่าน (ตรวจได้จริง)

- [ ] ไฟล์ `.claude/agents/code-researcher.md` ถูกสร้างโดย Claude (ไม่ใช่พิมพ์เอง)
- [ ] Frontmatter มี `name`, `description`, `tools: Read, Grep, Glob`, `model` ครบ
- [ ] Body มี 3 ส่วน: Method / Output format / Constraints (read-only)
- [ ] เรียกใช้ได้: `claude -p "Use the code-researcher subagent to explain how POST /api/cart/total works..."` ตอบพร้อม evidence รูปแบบ `server.js:NN` ทุกประเด็น (✅ ยืนยันจาก run จริง: agent อ้าง server.js:41-54 และจับ risk เรื่อง discountPercent ที่ไม่ validate)
- [ ] คำตอบมีโครงชัดเจน: คำอธิบายวิธีทำงาน + ส่วน risks (หัวข้อเป๊ะ ๆ แบบ Answer/Evidence/Risks เป็น "แนวทาง" — จากการรันจริง agent อาจจัดเป็นขั้นตอน+สอง risks ซึ่งถือว่าผ่าน ถ้าครบ evidence และ risks)

## Hint (กดเมื่อติด 15 นาที)

ใน prompt สร้างไฟล์ ให้ระบุชื่อฟิลด์ frontmatter ตรง ๆ (`name`, `description`, `tools`, `model`) — อย่าปล่อยให้ Claude เดาโครงสร้าง

## Solution

ดู prompt เต็มใน `lesson.md` หัวข้อ 5 (✅ tested ทั้ง EN และ TH) — และบล็อก Markdown ตัวอย่างในหัวข้อ 2 คือหน้าตาไฟล์ที่ผ่านเกณฑ์

**เวอร์ชันไทย (✅ tested — run-009):** ใช้ prompt ไทยใน `lesson.md` หัวข้อ 5 ตรง ๆ — จำ 3 กฎ: (1) ระบุชื่อ/ฟิลด์ frontmatter เป็นภาษาอังกฤษเสมอ (2) ระบุ "ภายใน working directory ปัจจุบัน" กันความกำกวม (3) อยากได้ system prompt ไทยต้องสั่งเพิ่ม

> 📚 กรณีศึกษาเปรียบเทียบ: prompt กำกวม ("สร้าง subagent ให้โปรเจกต์นี้หน่อย") → ล้มเหลวหมดเทิร์นโดยไม่มีผลงาน (runs/module-04/run-012) — อ่านคู่กับ run-009 ก่อนขึ้นสอน

## ต่อยอด (โจทย์ปลายเปิด)

สร้าง agent ที่สองของคุณเองสำหรับงานที่คุณทำบ่อยในชีวิตจริง (เช่น `trip-researcher` หรือ `post-writer`) โดยใช้ template เดียวกัน — แล้วอธิบายว่า `description` ของคุณช่วย auto-delegation อย่างไร
