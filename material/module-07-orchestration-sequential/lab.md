# Workshop 4 — Sequential Pipeline (Design → Build → Review)

## บริบท

เจ้าของร้านอยากได้ API เพิ่มสินค้า (`POST /api/products`) คุณจะให้ทีม Agent ทำแบบสายการผลิต 3 ด่าน เพื่อพิสูจน์ว่า "สัญญากลาง" ทำให้งานไหลต่อกันได้จริง

## โจทย์

รัน pipeline 3 ด่านจาก **prompt เดียว** ตามตัวอย่างใน `lesson.md` หัวข้อ 4 แล้วตรวจ artifact ของแต่ละด่าน

## ขั้นเริ่มต้น

```bash
cd labs-sandbox/demo-shop
git add -A && git commit -m "before pipeline"   # เตรียมจุดเทียบก่อน-หลัง
claude
```

## เกณฑ์ผ่าน (ตรวจได้จริง)

- [ ] `docs/DESIGN.md` ถูกสร้างในด่าน 1 และระบุ request/response shape + error codes
- [ ] `server.js` มี `POST /api/products` ในด่าน 2 และ validation ตรงตาม DESIGN.md
- [ ] ด่าน 3 มี findings แบบ `file:line` (อย่างน้อยตรวจว่า error codes ตรงสเปก)
- [ ] `git diff` แสดงการเปลี่ยนแปลงเฉพาะที่สเปกกำหนด (ไม่มี refactor เกินขอบเขต)
- [ ] ผู้เรียนอธิบายได้ว่าถ้าไม่มี DESIGN.md ด่าน 2 จะเสี่ยงอะไร

## Hint

ถ้า Leader รวมทุกด่านเป็นข้อความเดียวแล้ว "เล่า" แทนการทำจริง ให้เติม "Execute each stage now, not as a plan." ท้าย prompt

## Solution

โครง prompt เต็มอยู่ใน `lesson.md` หัวข้อ 4 (✅ tested) — จุดสำคัญคือธง "Do not write code yet" / "Fix nothing" ที่ล็อกขอบเขตแต่ละด่าน

## ต่อยอด (โจทย์ปลายเปิด)

เพิ่มด่านที่ 4 "Test" ที่เขียน test script (Node ล้วน) ยิง endpoint ใหม่ 3 เคส: สร้างสำเร็จ / body ไม่ครบ → 400 / ชน id ซ้ำ → 400 แล้วสังเกตว่าต้องแก้สัญญากลางหรือไม่

**เวอร์ชันไทยของโจทย์นี้ (✅ tested — runs/module-07/run-011) — ผลที่ได้จริงเกินโจทย์:**

```text
เขียนไฟล์ scripts/test-create-product.js (Node ล้วน ไม่ใช้ dependency) ทดสอบ POST /api/products 3 เคส โดยอ่านเงื่อนไขจาก docs/DESIGN.md ก่อน:
(1) สร้างสำเร็จ — ส่ง name กับ price ครบ ต้องได้ 2xx พร้อม id ใหม่
(2) body ไม่ครบ — ส่งแค่ name ไม่มี price ต้องได้ 400
(3) มี field แปลกปลอม — ต้องได้ 400 พร้อมรายงาน UNKNOWN_FIELD ตามสเปกใน DESIGN.md
จง spawn 'node server.js' เอง รันทุกเคส ปิด child server ทุกเส้นทาง และ exit 0 เมื่อผ่าน / exit 2 เมื่อไม่ผ่าน พิมพ์ผล PASS/FAIL ต่อเคส
ห้ามแก้ server.js ห้ามถามคำถาม — เขียนไฟล์แล้วรันให้เลย แล้วรายงานผล
```

ผลจริง: agent **จับข้อขัดแย้งระหว่าง prompt กับสเปก** (สเปกบังคับ `stock` ด้วย — ไม่ใช่แค่ name+price) แล้วแจ้งการตัดสินใจอย่างโปร่งใส, อ้างมาตรา § ทุก assertion, ทำ **mutation check** (พัง server บนสำเนา temp ทีละจุดเพื่อพิสูจน์ว่าเทสต์จับของเสียได้ — ทุก mutation ออก exit 2), และ 3/3 ผ่านเมื่อผู้สอนรันซ้ำ — บทเรียน: **สัญญากลางที่ดีช่วยแก้ความคลาดเคลื่อนของคนสั่งได้เอง**

**ต่อยอด 2 — เขียน Workflow ตรวจ demo-shop แบบมี agent หักล้าง (ใช้ความรู้หัวข้อ 6 ของ lesson)**

โจทย์ปลายเปิด: เขียน workflow `.claude/workflows/find-and-refute.js` ของคุณเอง 2 เฟส — **Find:** agent หนึ่งสแกน `server.js` แล้วรายงาน "ปัญหาที่พบ" เป็น array (แต่ละข้อมี title + บรรทัด + เหตุผล) · **Refute:** ต่อหนึ่งปัญหา ให้อีก agent อ่านโค้ดจริงแล้วพยายาม**หักล้าง** — รายงานเฉพาะข้อที่รอดจากการหักล้าง (เทคนิค adversarial verification: agent ที่หาเจอ ≠ ข้อสรุปจริง)

เกณฑ์ผ่าน:

- [ ] ไฟล์มี `export const meta` ครบ และรันจนจบโดยไม่ throw
- [ ] ผลลัพธ์รวมทุก finding และ**กรอง `null` ก่อนใช้** — workflow ไม่พังแม้ agent บางตัวล้ม
- [ ] มีอย่างน้อยหนึ่งข้อที่ refuter ยืนยันว่าจริง (demo-shop ปลูกปม QA ไว้จริง — รายการอยู่ใน lesson ของ Module 9 ฝั่งผู้สอน)
- [ ] ผู้เรียนอธิบายได้ว่าทำไมต้องมีตัวหักล้าง และข้อไหนโดนหักล้างจนตกไป

Hint (โครง — API ทุกตัวผ่านการทดสอบแล้วใน run-015/run-020 เติม schema กับ prompt ให้เต็มเอง):

```javascript
export const meta = { name: "find-and-refute", description: "ตรวจหาปัญหาแล้วให้อีก agent หักล้าง", phases: [{ title: "Find" }, { title: "Refute" }] };
const FINDINGS = { /* schema: object มี findings เป็น array ของ { title, file, line, why } */ };
const VERDICT = { /* schema: object มี { holds: boolean, reason: string } */ };
phase("Find");
const found = await agent("สแกน server.js … รายงานปัญหาเป็น JSON", { model: "haiku", schema: FINDINGS });
phase("Refute");
const survived = [];
for (const f of found.findings ?? []) {
  const v = await agent(`อ่าน server.js แล้วพยายามหักล้างข้อนี้: ${JSON.stringify(f)} — ยังยืนได้ตอบ holds: true`, { model: "haiku", schema: VERDICT });
  if (v?.holds) survived.push(f);
}
console.log(`รอด ${survived.length}/${(found.findings ?? []).length} ข้อ`);
```

> ⚠️ **กัน "เกมกับตัวตรวจ"** (สำคัญถ้าคุณขยายโจทย์เป็น "วนแก้จนเทสต์ผ่าน"): workflow ที่ถูกสั่งให้ทำให้ตัวตรวจเขียว อาจเลือกแก้ *ตัวตรวจ* แทน *โค้ด* — เช่น เพิ่มไฟล์เทสต์ลง `exclude` ของ tsconfig ทำให้เขียวทั้งที่โค้ดยังเป็นบั๊ก (มีรายงานจากผู้ใช้จริงว่าเกิดได้ แม้ prompt ห้ามแก้ไฟล์เทสต์ เพราะมันไปแก้ config แทน) ให้ระบุใน prompt ว่า **ห้ามแก้ไฟล์ config ของตัวตรวจทุกชนิด** (`tsconfig.json`, `vitest.config.*`, กฎ linter, CI) และ**อ่าน diff ของ config ก่อนรับงานทุกครั้ง** — ถ้าใช้ซ้ำบ่อย กันแบบแน่นอนด้วย permission rule `deny Edit(tsconfig.json)` (Module 9) · อยากให้การหักล้างแข็งแรงขึ้น: ส่ง refuter 3 ตัวอิสระกันด้วย `parallel` แล้วใช้เสียงข้างมาก (แลกกับค่าใช้จ่าย ×3)
