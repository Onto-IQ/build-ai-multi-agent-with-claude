# PRODUCT-SPEC — Sales Insight dashboard

สัญญากลางของทีม Capstone ทุกบทบาทยึดไฟล์นี้

## หน้าจอ

หน้าเดียวที่ `/` แสดงออเดอร์ที่ใช้ได้ รายได้รวม ภาคที่นำ ช่องทางที่นำ สินค้าที่นำ และตารางรายได้ตามภาค ภาษาไทย อ่านบนจอโทรศัพท์ได้

## API

- `GET /api/health` → `200` `{ "ok": true }` ห้ามมีฟิลด์หรือสตริงที่ขึ้นต้นด้วย `sk-`
- `GET /api/summary` → `200` มี `orderCount`, `totalRevenue`, `topRegion`, `topChannel`, `topProduct`, `byRegion`
- `POST /api/notes` บอดี้ที่ไม่ใช่ JSON ได้ `400` และโปรเซสต้องไม่ตาย

## ข้อมูล

ใช้ `data/sales.csv` ที่ผ่าน quality gate แล้วเท่านั้น รายได้ต่อแถวปัดเป็นสตางค์ก่อนรวม

## เกณฑ์ยอมรับ

- `node scripts/quality-gate.js` exit 0
- เปิด `/` แล้วเห็นตัวเลขจาก `/api/summary`
- มี `docs/EXECUTIVE-SUMMARY.md` ที่ยอดรวมตรงกับ API
