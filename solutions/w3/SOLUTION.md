# Workshop 3

สาย data ส่ง `drop-in/scripts/clean-export.sql` (SQL ทำความสะอาดบน DuckDB อ่าน `data/raw/dbd-2558.parquet` แล้ว export `data/dataset.csv` ฉบับสะอาด) สาย backend ส่ง `drop-in/server.js` ที่อ่าน CSV ด้วย `lib/csv.js` และนับเฉพาะแถวที่ผ่านพจนานุกรม สาย frontend ส่ง `drop-in/web/app.js`

ตัวเลขอ้างอิงหลังสะอาด: **16,772 กิจการ / ทุนรวม 45,341,868,784 บาท**

```bash
node solutions/w3/check.js
```
