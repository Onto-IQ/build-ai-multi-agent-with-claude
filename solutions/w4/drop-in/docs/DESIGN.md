# DESIGN — ทำความสะอาด sales.csv

สัญญากลางของ Workshop 4 ขั้น Implement และขั้น Review ต้องยึดไฟล์นี้

## ผลลัพธ์

สคริปต์ `scripts/clean-sales.js` อ่าน CSV แล้วเขียน CSV ใหม่ที่ `node scripts/quality-gate.js` เคส `data-quality` ผ่าน (0 violations)

คอลัมน์เท่าเดิม ลำดับแถวเท่าลำดับที่เก็บไว้ ห้ามเพิ่ม dependency

## ทิ้งทั้งแถว (fatal)

- `missing-order-id`, `duplicate-order-id` (เก็บแถวแรกของรหัสนั้น)
- `bad-date` — วันที่ไม่มีอยู่จริง หรืออ่านรูปแบบไม่ได้
- `missing-province`, `unknown-province`, `missing-product`
- `bad-channel`, `bad-qty`, `bad-price`, `bad-discount`

## ซ่อมแล้วเก็บ (repair)

- `date-format` — เขียนเป็น `YYYY-MM-DD` ปีคริสต์ศักราช (ปี พ.ศ. ที่ ≥ 2400 ลบ 543)
- `money-format` — ตัด `฿` และตัวคั่นหลักพัน ถ้ามีทั้ง `.` และ `,` ตัวคั่นตัวท้ายคือทศนิยม
- `channel-format` — เป็น `สาขา`, `Shopee`, `Lazada` หรือ `LINE`
- `region-mismatch` — เขียนภาคให้ตรงจังหวัด
- `product-whitespace` — ตัดช่องว่างหัวท้าย

## รายได้

`qty * unit_price_thb * (1 - discount_pct / 100)` ปัดเป็นสตางค์ทีละแถวแล้วค่อยรวม

starter quality gate ยังไม่ผ่านที่ `server.js` การซ่อม `POST /api/notes` เป็นงาน Workshop 5
