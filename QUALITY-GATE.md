# QUALITY GATE — เกณฑ์คุณภาพสื่อการสอน (Udemy-sellable standard)

> เกณฑ์นี้คือมาตรวจของหลักสูตร "Build AI Multi-Agent with Claude Code" (VIBE-CODE-L2)
> สื่อการสอนทุกชิ้นต้องผ่านทุกข้อจึงถือว่า "ขายได้" — ตรวจซ้ำได้ด้วยสคริปต์ + การอ่านจริง

## เกณฑ์ผ่าน (Pass Criteria)

### A. ความครบถ้วน (Coverage) — ต้อง 100%
| รหัส | เกณฑ์ | วิธีตรวจ |
|---|---|---|
| A1 | ทุก Module 1–11 มีไฟล์ lesson ที่อธิบายแนวคิด + ทำตามทีละขั้นได้ | นับไฟล์ใน `material/module-*/lesson.md` = 11 |
| A2 | ทุก Module มี prompt ตัวอย่างพร้อมคำอธิบายว่าแต่ละส่วนของ prompt ทำหน้าที่อะไร | ไฟล์ `prompts.md` หรือ section ใน lesson |
| A3 | ทุก Workshop 1–6 มีแบบฝึกหัด (lab) พร้อมเป้าหมาย + เกณฑ์ตรวจผ่าน (acceptance criteria) | ไฟล์ `material/module-*/lab.md` |
| A4 | ทุก lab มีสิ่งให้ผู้เรียนส่งงาน (deliverable) ที่ตรวจได้จริง (ไฟล์/คำสั่ง/ผลลัพธ์) | อ่าน lab ทุกไฟล์ |

### B. ความถูกต้องที่พิสูจน์ได้ (Tested & Verified) — ต้อง 100%
| รหัส | เกณฑ์ | วิธีตรวจ |
|---|---|---|
| B1 | Prompt หลักของทุก Workshop ถูกรันจริงกับ Claude Code TUI แล้วอย่างน้อย 1 ครั้ง | มี transcript ใน `runs/<module>/run-*.md` |
| B2 | Transcript บันทึกครบ: prompt, คำสั่งรัน, ผลลัพธ์จริง, ข้อสังเกต | อ่านทุกไฟล์ใน runs/ |
| B3 | ถ้า prompt รันแล้วไม่ได้ผลตามที่สอน → แก้ prompt และรันซ้ำจนผ่าน (มีรอบ iteration ≥ 1 ในกรณีที่ล้มเหลว) | run log ระบุ `iteration-1/2/...` |
| B4 | ข้อเท็จจริงใน material (flags, frontmatter fields, transports, scopes, ตัวเลข token) ตรงกับ official docs ที่อ้างอิง | checklist ท้ายไฟล์นี้ |

### C. คุณภาพระดับขายได้ (Course Quality) — ต้องผ่านทุกข้อ
| รหัส | เกณฑ์ | วิธีตรวจ |
|---|---|---|
| C1 | ผู้เรียนทำตามได้โดยไม่ต้องเดา: ทุกขั้นมีคำสั่งที่ copy ได้ + ผลลัพธ์ที่คาดหวัง | อ่านทีละ step จำลองเป็นผู้เรียนใหม่ |
| C2 | ไม่มี placeholder ค้าง (TODO, XXX, "เดี๋ยวใส่ภายหลัง") | `grep -rn "TODO\|XXX\|placeholder" material/` ต้องไม่เจอในเนื้อหา |
| C3 | ตัวอย่างโค้ด/sandbox รันได้จริง (demo-shop สตาร์ตสำเร็จด้วยคำสั่งใน lesson) | รัน `node server.js` ใน sandbox แล้ว curl ได้ |
| C4 | เวลาต่อ Module สอดคล้องกับกำหนดการ (เช้า 3 ชม. / บ่าย 3 ชม.) | รวมเวลาที่ประมาณไว้ในแต่ละ Module ไม่เกินช่วงเวลา |
| C5 | ภาษาไทยลื่น ศัพท์เทคนิคถูกต้อง สะกดชื่อคำสั่ง/ฟิลด์ถูกต้อง | proofread |
| C6 | โครงสร้างไฟล์สม่ำเสมอทุก Module (lesson / prompts / lab ในรูปแบบเดียวกัน) | เทียบข้าม module |

### D. แบบฝึกหัดระดับดีที่สุด (Exercise Quality)
| รหัส | เกณฑ์ |
|---|---|
| D1 | ทุก lab มี: บริบท → โจทย์ → ขั้นเริ่มต้น → เกณฑ์ผ่าน → ทางแก้ (solution) หรือ hint |
| D2 | อย่างน้อย 1 lab ต่อวัน เป็นแบบ "โจทย์ปลายเปิด" ให้ผู้เรียนเลือกเอง (transfer skill) |
| D3 | แบบฝึกหัดเชื่อมโยงกันข้าม module (งานก่อนหน้าถูกใช้ต่อ) — ไม่ใช่เกาะลอย |

## สถานะการผ่านเกณฑ์ (ตารางติดตาม — อัปเดต 2026-09-29 หลังการทดสอบจริงทั้งหมด)

| เกณฑ์ | สถานะ | หลักฐาน |
|---|---|---|
| A1 — 11 lessons | ✅ ผ่าน | `ls material/*/lesson.md` = 11 ไฟล์ |
| A2 — prompts + anatomy | ✅ ผ่าน | M3/M4/M6/M7/M10 มี prompt + ตาราง anatomy; ทุก module มีคำสั่ง/ขั้นตอนกำกับ |
| A3 — 6 labs + acceptance criteria | ✅ ผ่าน | `ls material/*/lab.md` = 6 (W1–W6) ทุกไฟล์มีเกณฑ์ผ่านแบบ checkbox |
| A4 — deliverable ตรวจได้จริง | ✅ ผ่าน | ไฟล์ agent, DESIGN.md, gate exit code, git commits (ดู runs/) |
| B1 — รันจริงทุก Workshop | ✅ ผ่าน | runs 001–007: W1, W2, W3, W4, W5, W6 + smoke ทั้งหมดรันจริงกับ claude CLI 2.1.284 |
| B2 — transcript ครบ | ✅ ผ่าน | ทุก run file มี prompt/คำสั่ง/ผลจริง/ข้อสังเกต |
| B3 — iteration จนผ่าน | ✅ ผ่าน | run-003 (8 รอบ), run-006 (3 รอบ: turn budget), run-007 (2 attempts: scoped kill) — รวม ~13 ครั้งรันจริง |
| B4 — ข้อเท็จจริงตรง official | ✅ ผ่าน | ตรวจจาก docs ที่ fetch สด: frontmatter fields, transports, scopes, 15× token, 90.2% — และ**แก้แล้ว** 2 จุดที่ผิด (MCP "ชนิด", Tool Calling ตำแหน่ง) |
| C1 — ทำตามไม่ต้องเดา | ✅ ผ่าน | ทุก step มีคำสั่ง copy ได้ + ผลลัพธ์ที่คาดหวัง (อ้างจากผลรันจริง) |
| C2 — ไม่มี placeholder | ✅ ผ่าน | `grep TODO\|XXX\|placeholder` บน material/ = CLEAN |
| C3 — sandbox รันได้จริง | ✅ ผ่าน | smoke: products 200, badjson 400 (หลังแก้), notfound 404, หน้าเว็บ 200; gate 3/3 |
| C4 — เวลาต่อช่วง | ✅ ผ่าน (มีหมายเหตุ) | เช้าวันที่ 1 = 135 น., บ่าย = 115 น. (W3 เป็น demo 20 น.), เช้าวันที่ 2 = 145 น. (ผู้สอนยืดหยุ่น W4/W5 ได้ — รันจริง W5 ใช้ ~40 น.), บ่าย = 120 น. |
| C5 — ภาษา/ศัพท์ | ✅ ผ่าน | เขียน+ทวนสอบระหว่างทาง; ศัพท์ตรงตาม docs |
| C6 — โครงสร้างสม่ำเสมอ | ✅ ผ่าน | ทุก module: lesson (จุดประสงค์→เนื้อหา→ขั้นตอน→กับดัก); lab: บริบท→โจทย์→เกณฑ์→hint→solution |
| D1 — โครง lab ครบ | ✅ ผ่าน | ทุก lab มีบริบท/โจทย์/เกณฑ์/hint/solution |
| D2 — โจทย์ปลายเปิด | ✅ ผ่าน | ทุก lab มี "ต่อยอด" — W2 มีโจทย์ชีวิตจริง (trip-researcher / post-writer) |
| D3 — เชื่อมโยงข้าม module | ✅ ผ่าน | demo-shop วิวัฒน์ต่อเนื่อง W1→W4→W5→W6; code-researcher ถูกใช้ซ้ำ; gate จาก W5 ถูกใช้ใน W6 |
| A5 — คู่ prompt TH/EN ครบทุก module | ✅ ผ่าน | ทุก lesson มี prompt คู่ภาษา; labs มีเวอร์ชันไทยที่ tested (run-008–012); README มีตารางสรุปประสบการณ์ Thai/EN |
| B5 — ทดสอบ Thai prompting เพิ่ม 5 รอบ | ✅ ผ่าน | run-008 (Thai swarm), run-009 (Thai agent creation), run-010 (Thai Unicode via MCP), run-011 (Thai pipeline+mutation check), run-012 (Thai ambiguous — instructive FAIL) — รวม ~18 ครั้งรันจริงตลอดคอร์ส |

**ผลรวม: ผ่านทุกเกณฑ์ (17/17) — หลักฐานครบทุกข้อ** | ข้อค้นพบระหว่างทางทั้งหมดถูกหมุนกลับเข้าสื่อการสอน (M2/M4/M7/M11 + runs/)
