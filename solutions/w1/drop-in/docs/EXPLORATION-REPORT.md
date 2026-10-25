# รายงานสำรวจ Sales Insight (Workshop 1)

## โครงสร้าง

แอป Node ล้วน ไม่มี dependency จุดเข้าคือ `server.js` ข้อมูลอยู่ที่ `data/sales.csv` quality gate อยู่ที่ `scripts/quality-gate.js` MCP ตั้งต้นคือ `mcp/echo-server.js` มี tool เดียวชื่อ echo หน้าเว็บตั้งต้นอยู่ที่ `web/`

## คุณภาพข้อมูล

`scripts/quality-gate.js` ตรวจ `data/sales.csv` แล้วไม่ผ่าน รหัสที่ quality gate รายงานได้แก่ duplicate-order-id, bad-date, date-format, money-format, bad-qty, missing-province, missing-order-id, region-mismatch, channel-format, product-whitespace และ bad-price ไฟล์ปนวันที่ใช้ไม่ได้ วันที่คนละรูปแบบ ราคามีจุลภาคหรือสัญลักษณ์บาท และรหัสออเดอร์ซ้ำ

## จุดเสี่ยง

- `GET /api/summary` ใช้ตัวแยกจุลภาคตรง ๆ แถวที่มีจุลภาคในราคาจึงเลื่อนคอลัมน์ ตัวเลขไม่ตรงกับแถวที่สมบูรณ์อยู่แล้ว
- `POST /api/notes` เรียก `JSON.parse` โดยไม่มี try/catch บอดี้ที่ไม่ใช่ JSON ทำให้โปรเซสล่ม
- `GET /api/health` ส่งค่าตัวอย่างที่ขึ้นต้นด้วย `sk-` ออกมาใน JSON

งานนี้เป็นงานสำรวจ ห้ามแก้ไฟล์
