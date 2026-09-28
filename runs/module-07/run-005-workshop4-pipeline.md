# run-005 — Workshop 4: Sequential Pipeline (Design → Build → Review)

- **Module/Workshop:** Module 7 / Workshop 4 — เกณฑ์ B1–B3
- **เวลา:** 2026-09-29T02:40–03:00+07:00 | **Claude Code:** 2.1.284 | **โหมด:** headless `-p --permission-mode acceptEdits --max-turns 30`
- **Working dir:** `labs-sandbox/demo-shop` (checkpoint commit ก่อนรัน)

- **คำสั่งรัน:** prompt 3 ด่านเต็มตาม material/module-07 หัวข้อ 4 (Design → Implement → Review, มี task list + "Fix nothing")

- **ผลลัพธ์จริง (ย่อจาก stdout):**

```text
Stage 2 — implement (ย่อ):
1. Added MAX_BODY_BYTES/validateProduct()/errorBody() ... exactly per §2/§6.2.
3. No existing line edited — verified by reading all six original handlers
   at their new offsets; the planted bugs at :95, :155, :172 are untouched as §10 requires.
5. **Not executed:** every Bash call was denied (node --check, node server.js, curl, git diff).
   The §9 cases are static traces, not observed output — F1, F2, F4 are exactly the class
   of defect only a live run would confirm. Syntax is unverified by any tool.

Stage 3 — review (13 findings, nothing fixed):
1. One genuine contract violation: F1, the push-inside-the-500-try, which defeats
   §6.3's "product is not added" guarantee.
2. Two defects originate in the *spec*, not the code: F2 (chunked Buffer idiom DESIGN.md
   told me to copy) and F3 (no error code for valid-JSON-wrong-shape).
5. Net: code is faithful to the letter of the spec; the gaps that remain are spec gaps,
   and Stage 2's verification claim is the weakest link because nothing was executed.
```

- **การตรวจ artifact หลังรัน:**
  - `docs/DESIGN.md` ✓ — มี request/response shape, validation rules, error codes (400/404/500 แยก)
  - `server.js` ✓ — `POST /api/products` + `validateProduct()` + `MAX_BODY_BYTES`; `git diff --stat` = **111 insertions, 0 deletions** (คำสัญญา "ไม่แตะบรรทัดเดิม" จริง)
  - Review ✓ — 13 findings อ้างสเปกเป็น §, จับ contract violation จริง (F1: push ข้างใน try ของ 500 ทำให้สินค้าถูกเพิ่มแม้ตอบ 500)
  - Task list/status ✓ — รายงานรวม 5 บรรทัดต่อด่านตามสัญญา

- **ข้อสังเกต / การปรับปรุง:**
  1. **headless ปฏิเสธ Bash ทุกคำสั่งโดย default** (`node --check`, `curl`, `git diff` โดน deny) → Stage 2 ไม่ได้ "รันจริง" — reviewer สรุปเองว่า "static traces, not observed output" — **สื่อต้องสอน: ถ้า lab ต้องรันคำสังใน headless ให้เพิ่ม `--allowedTools "Bash(node:*)"` (ตาม pattern ที่ต้องใช้) หรือรันใน TUI แล้วกดอนุมัติ**
  2. Review stage เจอ "bug ในสเปก" 2 จุด — เป็นหลักฐานสอนได้ดีที่สุด: **คุณภาพของ pipeline ถูกจำกัดด้วยคุณภาพของสัญญากลาง**
  3. "Fix nothing" ถูกเคารพ 100% — trace ย้อนได้ว่าใครเขียนอะไร
- **สรุป:** **PASS** (iteration 1) — พร้อมข้อปรับ 1 จุดใน material (Bash permission ใน headless)
