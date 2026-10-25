# TASKS

| id | เจ้าของ | ขึ้นกับ | สถานะตั้งต้น |
|---|---|---|---|
| T1 | planner | — | เขียน PRODUCT-SPEC.md |
| T2 | researcher | T1 | สรุปยอดจาก CSV ที่สะอาดแล้ว |
| T3 | developer | T1 | ทำ `/api/summary` และหน้า `/` |
| T4 | writer | T1, T2 | เขียน EXECUTIVE-SUMMARY.md และข้อความบนหน้า |
| T5 | qa | T3, T4 | รัน `node scripts/quality-gate.js` และตรวจว่า health ไม่รั่ว `sk-` |

กติกา: งานที่ขึ้นกับงานอื่น ห้ามเริ่มก่อนงานนั้นเสร็จ T3 กับ T4 ทำคนละไฟล์
