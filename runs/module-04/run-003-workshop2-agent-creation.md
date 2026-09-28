# run-003 — Workshop 2: สร้าง Specialty Agent ด้วย Prompt (8 iterations)

- **Module/Workshop:** Module 4 / Workshop 2 — เกณฑ์ B1–B3 (เคส iteration ที่อุดมที่สุดของคอร์ส)
- **เวลา:** 2026-09-29T02:00–02:25+07:00 | **Claude Code:** 2.1.284 | **Working dir:** `labs-sandbox/demo-shop`

## การทดลอง (ทั้งหมดรันจริง — log เต็มอยู่ /tmp/w2-iter*.log)

| Iter | คำสั่ง/ธง | ผลลัพธ์จริง | บทเรียน |
|---|---|---|---|
| 1 | `--permission-mode acceptEdits` | ❌ ไม่เขียน — Agent ตอบว่าให้ approve `Write(**/.claude/**)` ก่อน | `acceptEdits` **ไม่คลุม** path `.claude/**` (config ที่ sensitive) |
| 2 | `--allowedTools "Write(**/.claude/**)"` | ❌ ไม่เขียน — Agent **ถามคำถามกลับ** (path นี้ demo-shop หรือ repo แม่? ใส่ Bash ไหม?) | ความกำกวมของ path ทำให้ Agent ถามแทนที่จะลงมือ |
| 3 | `--allowedTools "Write"` + สั่ง "do not ask" | ❌ Agent **พิมพ์เนื้อหาไฟล์** อวดว่า "34 lines, fits budget" แต่ `ls` ไม่เจอไฟล์ | **Agent อ้างสิ่งที่ไม่เกิดขึ้น — ต้อง verify บน filesystem เสมอ** |
| 4 | `--permission-mode bypassPermissions` | ✅ ไฟล์ถูกสร้างจริง (33 lines) frontmatter ถูกครบ | วิธีที่พิสูจน์แล้วสำหรับ headless (ใช้เฉพาะ sandbox) |
| 5 | ลบไฟล์ + `--allowedTools "Write(**/.claude/**)"` ซ้ำ | ❌ Agent พิมพ์เนื้อหาอีก ไฟล์ไม่มี ไม่มี denial ใน text mode | text mode ไม่โชว์ tool results — ต้อง stream-json |
| 6 | `--output-format stream-json` | ❌ CLI ด่าทันที: "stream-json requires --verbose" | ธงคู่บังคับ — จดใส่ troubleshooting |
| 7 | `stream-json --verbose` | 🔍 **หลักฐานเด็ด:** Write ถูกเรียก 1 ครั้ง + tool_result: `"Claude requested permissions to write to ...\\.claude\\agents\\code-researcher.md, but you haven't granted it yet."` | Root cause ชัด: **`.claude/**` ถูกปฏิเสธ auto-approve เสมอ** |
| 8 | `--allowedTools "Write(./.claude/**)"` (relative rule) | ❌ deny เหมือนเดิม | ยืนยัน: ไม่ใช่ปัญหา glob — เป็นมาตรการคุ้มครอง executable config |

## ข้อสรุปที่เขียนลงสื่อการสอน

1. **ใน TUI (แนะนำผู้เรียน):** รัน prompt แล้ว**กดอนุมัติ**เมื่อ Claude ขอเขียนไฟล์ `.claude/**` — flow ปกติ ปลอดภัย
2. **ใน Headless (ทดสอบอัตโนมัติ):** `--permission-mode bypassPermissions` เฉพาะ sandbox ที่ทิ้งได้ (พิสูจน์ iter-4)
3. **ทำไมถึงปฏิเสธ:** ไฟล์ใน `.claude/agents/` คือ executable config ที่มีผลต่อ session อนาคต — การไม่ยอมให้ auto-approve ผ่านธงใด ๆ ช่วยกัน prompt injection (สอนเป็นจุดขายเรื่อง security design)
4. **Trust but verify:** Agent อ้างว่าเขียนไฟล์แล้ว 3 ครั้งจาก 8 รอบทั้งที่ไม่ได้เขียน — หลักปฏิบัติ: `ls`/`cat` ตรวจเสมอหลัง Agent อ้างว่าแก้ไขแล้ว
5. **ธงคู่บังคับ:** `--output-format stream-json` ต้องมี `--verbose`

## Phase B — เรียกใช้ Agent ที่สร้าง (ผ่าน)

```bash
claude -p "Use the code-researcher subagent to explain how POST /api/cart/total computes the total, and list 2 risks in that logic." --allowedTools "Task" --max-turns 15
```

ผลจริง (ย่อ): อธิบาย 5 ขั้นพร้อม citation `server.js:41-54` ทุกประเด็น, ชี้ risks: (1) `discountPercent` ไม่ validate — `discountPercent:-50` กลายเป็น markup, `9999` ทำ total ติดลบ, `"abc"` → `{"total":null}` แต่ 200 OK (2) unhandled throw ใน JSON.parse/for-of ทำ server ล่มทั้ง process — และ "จับผิด" เห็น ADMIN_TOKEN hardcoded ที่ server.js:13 พ่วงมาด้วย

## สรุป: **PASS** (หลัง 8 iterations — สื่อถูกปรับตามข้อค้นพบทั้งหมด)
