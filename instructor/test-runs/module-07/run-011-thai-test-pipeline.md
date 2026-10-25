# run-011 — Thai Prompt: งานเทคนิคล้วน (เขียน + รัน test script ของ pipeline)

- **Module/Workshop:** Module 7 / Workshop 4 (ส่วนต่อยอด) — เกณฑ์ B1–B3 (ทดสอบ **prompt ภาษาไทย** กับงานเทคนิคเชิงลึก)
- **เวลา:** 2026-09-29T04:45+07:00 | **Claude Code:** 2.1.284 | **โหมด:** headless `-p --permission-mode acceptEdits --allowedTools "Bash(node:*)" --max-turns 25`
- **Working dir:** `labs-sandbox/demo-shop`

- **Prompt ที่ส่ง (ไทย):** สั่งเขียน `scripts/test-create-product.js` ทดสอบ POST /api/products 3 เคส (สำเร็จ / ขาดฟิลด์ / field แปลกปลอม) โดยให้อ่านเงื่อนไขจาก docs/DESIGN.md ก่อน, spawn server เอง, exit 0/2, ห้ามแก้ server.js, เขียนแล้วรันเลย

- **ผลลัพธ์จริง (หลักฐานสำคัญ):**

```text
ข้อควรทราบเรื่องเคส 1 (สมมติฐานที่ผมตัดสินใจเอง): คุณสั่งว่า "ส่ง name กับ price ครบ"
แต่ DESIGN.md §3 + §5 V4 ระบุว่า stock required — ถ้าส่งแค่ 2 ฟิลด์จะได้ 400 ตามสเปก
ผมจึงส่ง stock ด้วยเพื่อให้เป็นเคสสำเร็จจริง (ถ้าต้องการแบบ 2 ฟิลด์ บอกได้ ผมแก้ให้)

ตรวจว่าเทสต์จับของพังได้จริง (mutation check): รันบนสำเนา temp — baseline green,
แล้วพัง server.js ทีละข้อ: name ไม่ trim → caught, price หาย → caught,
unknown field ได้ 201 → caught, id = max+2 → caught และทุก mutation ออก exit 2 ✓
ตัว server.js จริงไม่ถูกแตะ (untracked เฉพาะไฟล์เทสต์ใหม่ไฟล์เดียว)
```

ยืนยันอิสระ (รันเองหลังจบ): **3/3 PASS, TEST_EXIT=0** — case-1 ได้ 201 + `Location` header + item โผล่ใน GET, case-2 ได้ 400 `VALIDATION_FAILED` + `REQUIRED_NUMBER` + count ไม่เพิ่ม, case-3 ได้ 400 `UNKNOWN_FIELD` exactly 1 entry

- **ข้อสังเกต (ประสบการณ์ที่เขียนลงสื่อ):**
  1. **Agent จับข้อขัดแย้งระหว่าง prompt กับสัญญากลาง** แล้วตัดสินใจฝั่งสเปก + แจ้งการตัดสินใจอย่างโปร่งใส — พิสูจน์ว่า "สัญญากลางเป็นลายลักษณ์อักษร" จาก W4 ทำงานจริงแม้คนสั่งจะคลาดเคลื่อน
  2. Assertion ทุกเคสอ้างมาตราสเปก (§3, §4.1, §5 V4/V5, §6.1, §8) — ภาษาไทยไม่ลดความสามารถเชื่อมโยงสเปก
  3. คุณภาพวิศวกรรมเกินโจทย์: ใช้ port 3100 กันชน quality-gate (3000), refuse-to-run ถ้า port ถูกยึด, reap child ทุกเส้นทาง (exit/SIGINT/SIGTERM/uncaughtException/watchdog 45s)
  4. **Mutation check เป็นลูกเล่นทอง** — พิสูจน์ว่า "เทสต์ผ่าน" มีความหมาย (เทสต์ที่ไม่จับของพัง = เทสต์หลอก) — เพิ่มเป็นกิจกรรมเสริมใน lab ได้เลย
  5. **จุดสังเกตภาษา:** คำตอบไทยยาวมีตัวอักษรจีนหลุด 1 ตำแหน่ง ("ถูกเก็บ**在一次**") — ปรากฏการณ์ code-switching ของโมเดลในข้อความเทคนิคยาว ไม่กระทบความถูกต้องทางเทคนิค แต่**ควร proofread สิ่งที่ agent เขียนเป็นเอกสาร** — ประสบการณ์จริงที่ต้องแชร์ผู้เรียน
- **สรุป:** **PASS** — Thai prompt ทำงานเทคนิคล้วนได้เต็มประสิทธิภาพ
