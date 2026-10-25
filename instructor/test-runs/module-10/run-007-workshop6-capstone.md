# run-007 — Workshop 6 (Capstone): ทีม Multi-Agent สร้างเว็บแอปธุรกิจแบบ Leader-first

- **Module/Workshop:** Module 10 / Workshop 6 — เกณฑ์ B1–B3
- **เวลา:** 2026-09-29T03:30–03:55+07:00 | **Claude Code:** 2.1.284
- **โหมด:** headless `-p --permission-mode acceptEdits --allowedTools "Task" "Bash(node:*)" "Bash(git:*)" --max-turns 45`

## การทดลอง

| Attempt | ผล | บทเรียน |
|---|---|---|
| 1 | ❌ **exit 1 ตั้งแต่เริ่ม** — ผู้เขียนสื่อรัน `taskkill //F //IM node.exe` (smoke test sandbox) ขณะ capstone กำลัง spawn node processes → ฆ่าตัวเองตาย | **อย่า kill process แบบกว้างขณะระบบ multi-process ทำงาน — kill ด้วย PID เสมอ** |
| 2 | ✅ **สำเร็จเต็มรูปแบบ (exit 0)** — รายละเอียดด้านล่าง | — |

## ผล Attempt 2 — ทีม 5 Agent ส่งมอบจริง (ข้อความรายงานของ Leader, ย่อ)

```text
Agents delivered
- research   → docs/RESEARCH.md + data/products.mock.json (12 items, ids 1-5 match runtime)
- backend    → server.js static handler (lines 198-250), pure insertion, AC-3/AC-1 kept green
- frontend   → web/{index,products,product,cart}.html + app.js + styles.css;
               zero hardcoded product data, AC-5/6/8 satisfied
- writer     → docs/COPY.md (4 pages, 5 runtime + 3 future blurbs, body 96-133 words, single CTA)
- qa-reviewer→ docs/QA-REPORT.md. Verdict YELLOW: gate 3/3, 0 BLOCKER, 3 MAJOR

Gate result — node scripts/quality-gate.js → quality gate: 3/3 passed (exit 0), re-run after fix still 3/3

Fixes applied — F-3 only (redundant cart btn removed at web/cart.html:55).
F-1 (fractional total) and F-2 (unknown-path 200) judged spec-permitted: §2 explicitly
allows fractional prices ... §7 lists "catch-all 200" as out-of-scope — dropped, not patched.

Commits (v1 → v3 evidence)
- d80b28a v1 — PRODUCT-SPEC contract + research handoff
- 5e34a9d v2 — static handler + storefront pages + page copy (parallel build)
- 354466a v3 — remove redundant cart CTA (F-3 fix) + QA report
- eb12073 v3 — mark all tasks Completed in TASKS.md
```

## การตรวจยืนยันอิสระ (หลังรัน)

- `curl http://localhost:3000/` → 200, `/cart.html` → 200, `/api/products` → 200 (static handler ทำงานจริง)
- `node scripts/quality-gate.js` → **3/3 passed, exit 0**
- `git log --oneline` แสดง v1 → v3 ตรงตามที่รายงาน (พัฒนาการเห็นด้วยตา)
- หมายเหตุกระบวนการ: gate FAIL รอบหนึ่งเพราะ **port 3000 ชนกับ server ที่ผู้ตรวจสตาร์ตเอง** — gate จับ conflict ถูกต้อง; แก้ด้วย scoped kill ต่อ PID แล้วผ่าน (ยืนยันซ้ำว่า gate ไม่หลอก)

## จุดเด่นที่สอนได้จาก run นี้

1. **Dependency ถูกเคารพ** — v1 (สัญญากลาง+research) commit ก่อน parallel build เสมอ
2. **QA ตัดสินแบบมีเหตุผล** — ไม่ patch ทุก finding แต่แยก "blocker vs spec-permitted" อ้างมาตราในสเปก (F-1/F-2 dropped โดยอ้าง §2/§7)
3. **สัญญากลางป้องกันการเดา** — frontend "zero hardcoded product data", research ทำ mock data ที่ id ตรงกับ runtime
4. **พัฒนาการมองเห็น** — task list + git commits v1→v3 ตลอดทาง

## สรุป: **PASS** (attempt 2)
