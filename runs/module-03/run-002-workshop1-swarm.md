# run-002 — Workshop 1: Parallel Codebase Exploration (Swarm)

- **Module/Workshop:** Module 3 / Workshop 1 — เกณฑ์ B1–B3
- **เวลา:** 2026-09-29T02:00+07:00 | **Claude Code:** 2.1.284 | **โหมด:** headless `-p --allowedTools "Task" --max-turns 20`
- **Working dir:** `labs-sandbox/demo-shop`

- **คำสั่งรัน:**

```bash
claude -p "This is a small Node.js demo shop project. Dispatch 3 parallel Explore subagents to investigate it:
1. Map the project structure and how the server starts.
2. List every HTTP endpoint and what each one does.
3. Flag suspicious code patterns worth a security/quality review.
Return ONE consolidated report under 300 words, grouped by the 3 areas.
Do not modify any files." --allowedTools "Task" --max-turns 20
```

- **ผลลัพธ์จริง (stdout — ย่อหลักฐานสำคัญ, ข้อความเต็มใน terminal):**

```text
All line references check out against the source. Consolidated report:

## demo-shop — 3-agent investigation

**1. Structure & startup**
Two files only: server.js (73 lines) and data/products.json (5 products).
No package.json ... Launch is bare `node server.js`. Raw http.createServer (server.js:24)
... server.listen(PORT) binds all interfaces, not localhost ... products.json is readFileSync'd
once at module scope, outside try/catch ...

**2. Endpoints — 5 branches**
GET /api/products (?limit) | GET /api/products/* | POST /api/cart/total (itemIds, discountPercent)
| GET /api/admin/stats (?token) | any catch-all {hello}
Only `stats` is authenticated.

**3. Suspicious patterns (top, all confirmed)**
1. Unauth remote crash — JSON.parse, for…of body.itemIds, p.price on undefined all unguarded ...
   One bad POST kills the process.
2. Client sets the price — discountPercent unvalidated; 10000 → shop owes buyer.
3. Hardcoded secret in tracked source — ADMIN_TOKEN ... non-constant-time compare.
4. Every error returns 200 — no 404/405 ever.
5. Unbounded body, no rate limiting, float money math, stock never checked, limit NaN/negative.

No files modified.
```

- **ข้อสังเกต:**
  1. Leader dispatch Explore subagents ขนานได้จริงใน headless ด้วย `--allowedTools "Task"` (ไม่ต้อง `--permission-mode`)
  2. รายงานรวมครบ 3 หมวด กระชับ (<300 คำ) อ้าง line numbers ของโค้ดได้ — เกินเกณฑ์ lab เล็กน้อย (เจอ endpoint 5 รวม catch-all)
  3. เจอ "ปมปลูก" ครบ 4 กลุ่มที่ Module 9 จะใช้: crash จาก JSON.parse / discount ไม่ clamp / hardcoded ADMIN_TOKEN / error ตอบ 200
  4. Agent สังเกตคอมเมนต์ใน server.js ที่อ้างถึง answer key ใน module-09 — สื่อการสอนควรเขียนไฟล์นั้นให้เร็ว (กันผู้เรียนงง)
  5. `git status` ยืนยันไม่มีไฟล์ถูกแก้ ✓ (ตรงเงื่อนไข "Do not modify")
- **การปรับปรุง:** prompt ผ่านรอบแรก — ไม่ต้อง iterate จุดที่ปรับในสื่อ: เพิ่มหมายเหตุให้ผู้สอนว่า "รายงานอาจอ้างบรรทัดโค้ด" เป็นสัญญาณบวกของ Explore agent
- **สรุป:** **PASS** (iteration 1)
