# PRODUCT-SPEC — Registry Insight dashboard

สัญญากลางของทีม Capstone ทุกบทบาทยึดไฟล์นี้

## หน้าจอ

หน้าเดียวที่ `/` แสดงจำนวนกิจการจดทะเบียนใหม่ ทุนจดทะเบียนรวม จังหวัดที่ทุนสูงสุด ภาคที่ทุนสูงสุด และตารางทุนรวมตามภาค ภาษาไทย อ่านบนจอโทรศัพท์ได้

## API

- `GET /api/health` → `200` `{ "ok": true }` ห้ามมีฟิลด์หรือสตริงที่ขึ้นต้นด้วย `sk-`
- `GET /api/summary` → `200` มี `companyCount`, `totalCapital`, `topProvince`, `topRegion`, `byRegion`
- `POST /api/notes` บอดี้ที่ไม่ใช่ JSON ได้ `400` และโปรเซสต้องไม่ตาย

## ข้อมูล

ใช้ `data/dataset.csv` ที่ผ่าน quality gate แล้วเท่านั้น (ทุนจดทะเบียนรวมจาก 16,772 กิจการ)

## เกณฑ์ยอมรับ

- `node scripts/quality-gate.js` exit 0
- เปิด `/` แล้วเห็นตัวเลขจาก `/api/summary`
- มี `docs/EXECUTIVE-SUMMARY.md` ที่ยอดรวมตรงกับ API
