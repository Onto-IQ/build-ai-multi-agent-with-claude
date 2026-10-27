# Workshop 6 — แดชบอร์ดและสรุปผู้บริหาร

> ⏱ 90 นาที · Start state: quality gate exit 0 จาก Workshop 5

## Goal / เป้าหมาย

มีห้าไฟล์บทบาท สเปก งานที่มี dependency แดชบอร์ดที่อ่าน `/api/summary` และสรุปผู้บริหารที่ยอดตรงกับ API

## Steps / ขั้นตอน

1. จาก `sandbox/sales-insight` รัน `node scripts/quality-gate.js` ก่อนตั้งทีม

```bash
node scripts/quality-gate.js
```

ผลที่คาดหวัง: exit 0 ถ้ายังแดง ให้กลับ Workshop 5 หรือใช้ catch-up ของ w5

> 📚 **รู้เพิ่ม:** ทีมห้าตัวที่วิ่งบนของแดง จะสร้างของเสียสองชั้น — งานที่ทำไปกับข้อมูลเสีย และงานที่ต้องทำใหม่ ตรวจ gate ก่อนตั้งทีมจึงไม่ใช่พิธีกรรม

2. เปิด TUI แล้ววาง prompt ห้าบทบาทจากบทเรียน กดอนุญาตเมื่อเขียน `.claude/agents/`

ผลที่คาดหวัง: มีไฟล์ planner, researcher, developer, writer, qa และมี `docs/PRODUCT-SPEC.md` กับ `docs/TASKS.md`

> 📚 **ตรวจจริงบน CLI 2.1.310:** ผู้นำอาจแจกงานเป็น agent เฉพาะงาน (ad-hoc) โดยไม่เขียนไฟล์เอเจนต์ — ถ้ารายงานจบแล้ว `.claude/agents/` ยังว่าง ให้สั่งเพิ่มตรง ๆ เช่น "เขียนไฟล์เอเจนต์ทั้ง 5 บทบาทจากทีมที่เพิ่งทำงานลง .claude/agents/ (planner, researcher, developer, writer, qa) แต่ละไฟล์มี frontmatter: name, description, tools, model" แล้วจึงเช็ค checkpoint ได้

> 📚 **รู้เพิ่ม:** ขั้น 0 คือสัญญากลางของห้าคน — ไม่มี PRODUCT-SPEC ห้าบทบาทจะจบงานคนละแอป TASKS.md บอกใครรอใคร จึงเป็นตัวกันทั้งทำซ้ำและชนไฟล์

3. ปิดเซิร์ฟเวอร์เก่า แล้วเปิดของใหม่

```bash
node server.js
```

เปิด `http://127.0.0.1:3000` ผลที่คาดหวัง: เห็นยอด ออเดอร์ และชื่อภาคจาก API จากนั้น Ctrl+C

4. รัน quality gate อีกครั้งหลังปิดเซิร์ฟเวอร์ และเปิด `docs/EXECUTIVE-SUMMARY.md` เทียบยอดกับ JSON

ผลที่คาดหวัง: quality gate ยัง exit 0 และตัวเลขในสรุปตรงกับ `totalRevenue`

> 📚 **รู้เพิ่ม:** เลขคนละชุดระหว่างสรุปผู้บริหารกับ API คือของเสียชิ้นใหญ่ที่สุดของงานแบบนี้ — เทียบกับ `totalRevenue` ทุกครั้งก่อนส่ง

## ✅ Checkpoint

- [ ] ไฟล์เอเจนต์ครบห้าบทบาท และมี `name` กับ `tools`
- [ ] TASKS บอกว่า developer กับ writer รอสเปก
- [ ] หน้า `/` โหลด `/api/summary`
- [ ] `/api/health` ไม่มี `sk-`
- [ ] quality gate exit 0
- [ ] สรุปผู้บริหารเป็นไทยและไม่มียอดคนละชุด

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ทีมจบแต่ไฟล์ไม่เกิด | เป็นแผน ไม่ได้สั่งให้ทำ | เติม Execute, do not only plan |
| เขียนเอเจนต์ไม่ได้ใน headless | `.claude/**` ถูกปฏิเสธ | ใช้ TUI |
| หมดเทิร์นกลางสเปก | `--max-turns` ต่ำ | อยู่ใน TUI ถ้าจะทดลอง headless ให้เผื่อเทิร์นกว้างและอย่าสำรวจซ้ำ |
| quality gate ยัง exit 2 (FAIL)เพราะพอร์ต | เซิร์ฟเวอร์ยังเปิด | Ctrl+C ก่อนรัน `node scripts/quality-gate.js` หรือตั้ง `PORT` |
| ยอดในสรุปไม่ตรง API | writer ไม่ได้อ่าน JSON | ให้ qa ส่งยอดจาก `/api/summary` กลับไปแก้สรุป |
| งบ Pro หมด | ห้าตัวแพงประมาณ 15 เท่าของแชท | ยุบเหลือ planner, developer, qa |
| คิดเงินรายครั้ง | `ANTHROPIC_API_KEY` | unset ก่อนเปิด TUI |

## 🆘 Behind? Catch up

```bash
node scripts/catch-up.js w6
```

ได้แดชบอร์ด สเปก สรุป และเซิร์ฟเวอร์ที่ quality gate ผ่าน ทับ CSV ด้วยชุดสะอาด ยังไม่ได้รวม hook ของ Workshop 5 ถ้าต้องการ hook ให้ catch-up `w5` ก่อน แล้วค่อยวางไฟล์หน้าเว็บจาก `w6` ที่คุณยังไม่มี

## Stretch / ต่อยอด

เพิ่มตารางช่องทางบนหน้าเดิม โดยไม่เปลี่ยนสูตรรายได้

## Solution → solutions/w6/

`node solutions/w6/check.js`
