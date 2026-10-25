# run-008 — Thai Prompt: Swarm Exploration (เทียบคู่กับ run-002 EN)

- **Module/Workshop:** Module 3 / Workshop 1 — เกณฑ์ B1–B3 (ครั้งนี้: **ทดสอบ prompt ภาษาไทย**)
- **เวลา:** 2026-09-29T04:10+07:00 | **Claude Code:** 2.1.284 | **โหมด:** headless `-p --allowedTools "Task" --max-turns 20`
- **Working dir:** `labs-sandbox/demo-shop` (ตอนนี้โค้ดใหญ่ขึ้นมากหลังผ่าน W4/W5/W6: server.js + web/ + mcp/ + docs/)

- **Prompt ที่ส่ง (ไทยล้วน — คู่กับเวอร์ชันอังกฤษใน run-002):**

```text
นี่คือโปรเจกต์ร้านค้าตัวอย่างที่เขียนด้วย Node.js จง dispatch Explore subagent แบบขนานกัน 3 ตัวเพื่อสำรวจโปรเจกต์นี้:
1. สำรวจโครงสร้างโปรเจกต์และวิธีที่ server เริ่มทำงาน
2. รายการ HTTP endpoint ทั้งหมดพร้อมระบุว่าแต่ละตัวทำอะไร
3. ชี้ code pattern ที่น่าสงสัยซึ่งควรได้รับการ review เรื่องความปลอดภัยหรือคุณภาพ
ส่งรายงานรวมเป็นชุดเดียวไม่เกิน 300 คำ แบ่งตาม 3 หมวดข้างต้น ห้ามแก้ไขไฟล์ใด ๆ
```

- **ผลลัพธ์จริง (ย่อ):** รายงาน **ภาษาไทยทั้งชุด** แบ่ง 3 หมวดตามโจทย์:
  1. Persistence/Endpoint/Review pattern — ตาราง endpoint 6 แถวพร้อม `file:line` (`:86`, `:99`, `:151`, `:189`, `:201`, `:251`)
  2. จัด severity เอง: **HIGH** (trust boundary `discountPercent:100` → ซื้อของราคา 0; credential hardcode `:13`; **DoS** ที่ `:153` cart/total ไม่จำกัด body ต่างจาก products ที่มีการ์ด), **MEDIUM** (unauth write, stock ไม่เช็ก, limit NaN), **LOW** (token ผิดตอบ 200, avgPrice NaN)
  3. ปิดท้าย "Checked & clean" (XSS/traversal/SQL ปลอด) + หมายเหตุปมปลูก

- **ข้อสังเกต (ประสบการณ์ที่เขียนลงสื่อ):**
  1. **ภาษาของ prompt = ภาษาของรายงาน** — สั่งไทยได้รายงานไทย แต่สิ่งที่ควรเป็น "ภาษาเทคนิค" (ชื่อ endpoint, `file:line`, ชื่อฟังก์ชัน) ยังถูกพิมพ์ถูกต้องเป็นอังกฤษ
  2. คุณภาพ dispatch/ขนาน/รวมรายงาน**ไม่ต่างจาก EN** (เทียบ run-002 ตรง ๆ)
  3. โจทย์ "ความปลอดภัยหรือคุณภาพ" ในภาษาไทยถูกตีความกว้างและจัด severity ให้เอง — เขียนเป็นทิป: "ใส่เกณฑ์ severity ใน prompt ถ้าอยากได้ระดับที่กำหนด"
  4. โค้ดที่โตขึ้น (หลัง W4–W6) ทำให้เจอปมใหม่จริง (DoS ที่ cart/total) — sandbox มีชีวิต ไม่ใช่ตัวอย่างนิ่ง
- **สรุป:** **PASS** — Thai prompt ใช้ได้เต็มรูปแบบกับ Swarm
