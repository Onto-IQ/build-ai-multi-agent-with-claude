# Review — clean-export.sql

ตรวจเทียบ `scripts/clean-export.sql` กับ `docs/DESIGN.md`

- แถวหัวตาราง ชื่อไฟล์ และ "ทั่วประเทศ" ถูกกรองด้วย `try_cast(seq_raw AS BIGINT) IS NOT NULL` ตรงรายการ fatal
- `reg_no` ถูกบังคับ `^[0-9]{13}$` ก่อนเข้าไฟล์สะอาด จึงไม่มี duplicate-reg-no ตามที่วัดจริง
- วันที่ พ.ศ. ถูกแปลงเป็น ISO ด้วย `strptime - INTERVAL 543 YEAR` และทุนถูกตัดลูกน้ำก่อน CAST ตรงรายการ repair
- จังหวัดถูกเลือกด้วย `strpos` ตำแหน่งมากสุด (`row_number ... ORDER BY name_pos DESC`) ไม่ใช่ match แรกที่เจอ — เคส "ถนนบางนา-ตราด" (กรุงเทพฯ) จึงไม่หลุดไปตราด
- ผลลัพธ์ 16,772 แถว ทุนรวม 45,341,868,784 บาท ตรงกับตัวเลขอ้างอิงใน DESIGN.md และ `npm run gate` เคส data-quality + summary เขียว
