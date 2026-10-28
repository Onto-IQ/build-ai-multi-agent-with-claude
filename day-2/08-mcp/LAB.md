# Workshop 6 — MCP ระดับทีม + SQL วิเคราะห์ข้อมูลจริง

> ⏱ machine ~10 นาที · Start state: อยู่ใน workshop repo · `data/dataset.csv` สะอาดแล้วจาก Workshop 3 · gate 6/6

## Goal / เป้าหมาย

ใช้ MCP `data-duckdb` ที่มากับโปรเจกต์ (DuckDB read-only) วิเคราะห์ข้อมูลจริงหลายขั้นด้วย SQL จนได้ตารางยอดอ้างอิงต่อภาค แล้วเก็บเป็นไฟล์ที่ writer ใน Workshop 9 ต้องใช้ต่อ

## Steps / ขั้นตอน

1. ทบทวน `.mcp.json` — MCP ตัวนี้เป็น **read-only by default** (ไม่มีธง `--read-write`) และเป็นของทั้งทีมเพราะประกาศระดับโปรเจกต์ ลองถามเอเจนต์ใน TUI (เลือกอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Use the data-duckdb MCP execute_query tool to run: SELECT month, count(*) AS companies, sum(TRY_CAST(replace(replace(capital_raw, ',', ''), ' ', '') AS BIGINT)) AS capital_thb FROM businesses_raw GROUP BY month ORDER BY month. Report the table. Do not edit files.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ใช้ tool execute_query ของ MCP data-duckdb รัน: SELECT month, count(*) AS companies, sum(TRY_CAST(replace(replace(capital_raw, ',', ''), ' ', '') AS BIGINT)) AS capital_thb FROM businesses_raw GROUP BY month ORDER BY month แล้วรายงานตาราง ห้ามแก้ไฟล์
```

> 📚 **รู้เพิ่ม:** ใช้ `TRY_CAST` ไม่ใช่ `CAST` เพราะข้อมูลดิบมีแถวหัวตาราง 9 แถวปนอยู่ — `CAST` ล้มทั้ง query ทันทีที่เจอค่าที่แปลงไม่ได้ ส่วน `TRY_CAST` ให้ NULL แล้วข้าม (เลขเดือนที่ได้คือยอดจริงของแถวข้อมูล)

ผลที่คาดหวัง: ตารางรายเดือนจากข้อมูลจริง — ม.ค. 18,620,752,814 · ก.พ. 14,815,712,210 · มิ.ย. 11,905,403,760 บาท

2. เก็บผลวิเคราะห์เป็นไฟล์ของทีม — สร้าง `scripts/analysis.sql` ที่รวมทุนต่อภาคแล้ว `COPY` ออกเป็น `docs/region-capital.csv` สั่ง claude ใน TUI (เลือกอย่างหนึ่ง) แล้วกดอนุญาต:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Create scripts/analysis.sql for DuckDB: join data/dataset.csv province against a province-to-region mapping table written as a VALUES list, group by region, and COPY the result (region, companies, capital_thb) to docs/region-capital.csv. Order by capital descending. Run nothing yet.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
สร้าง scripts/analysis.sql สำหรับ DuckDB: จับคู่คอลัมน์ province จาก data/dataset.csv กับตารางแผนที่จังหวัดเป็นภาคแบบ VALUES list แล้ว GROUP BY region และ COPY ผล (region, companies, capital_thb) ไปที่ docs/region-capital.csv เรียงทุนมากไปน้อย ยังไม่ต้องรัน
```

3. รันด้วยมือคุณเอง — หลักฐานจากเทอร์มินัลของคุณ

```powershell
duckdb -c ".read scripts/analysis.sql"
```

ผลที่คาดหวัง: `docs/region-capital.csv` มี 6 แถว ยอดรวม 16,772 กิจการ / 45,341,868,784 บาท โดย กลาง 10,068 กิจการ / 31,680,888,983 บาท

4. เขียน `docs/ANALYSIS.md` สั้น ๆ — ตาราง + ข้อสังเกตหนึ่งประโยคที่อ้างตัวเลขจากไฟล์เท่านั้น สั่ง claude ก็ได้เขียนเองก็ได้

📦 **Handoff:** `docs/region-capital.csv` + `docs/ANALYSIS.md` = ชุดตัวเลขอ้างอิงของ writer ใน Workshop 9 — ห้ามเดาตัวเลขนอกไฟล์นี้

## ✅ Checkpoint

- [ ] `.mcp.json` ยังเป็น read-only (ไม่มี `--read-write`)
- [ ] `scripts/analysis.sql` รันผ่าน duckdb จริง
- [ ] `docs/region-capital.csv` มี 6 ภาค รวม 16,772 กิจการ / 45,341,868,784 บาท
- [ ] `docs/ANALYSIS.md` อ้างเฉพาะตัวเลขจากไฟล์

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| MCP ไม่ตอบ | ยังไม่กดอนุญาต `.mcp.json` หรือยังไม่ได้ติดตั้ง uv | ติดตั้ง uv ตาม SETUP.md แล้วกดอนุญาตตอน claude ถาม |
| `duckdb: command not found` | DuckDB CLI ยังไม่อยู่บน PATH | ติดตั้งตาม SETUP.md ขั้นที่ 1 |
| ยอดไม่ตรงเอกสาร | join จังหวัดพลาด (จังหวัดอื่นปนกลางประโยคที่อยู่) | ใช้คอลัมน์ `province` จากไฟล์สะอาดเป็นตัว join ไม่ใช่ LIKE ทั้งข้อความ |
| CSV ออกมาว่าง | รันจากโฟลเดอร์อื่น | `docs/...` เป็น path สัมพัทธ์ — ต้องรันจากราก workshop repo |

## 🆘 Behind? Catch up

จาก course repo (ไฟล์ถูก copy ลง workshop repo):

```bash
node scripts/catch-up.js w6
```

ได้ `scripts/analysis.sql` + `docs/ANALYSIS.md` ฉบับอ้างอิง ตรวจด้วย `node solutions/w6/check.js` (จาก course repo)

## Stretch / ต่อยอด

เพิ่มตาราง "จังหวัดที่ทุนสูงสุด 10 อันดับ" ลง `docs/ANALYSIS.md` โดยเขียน SQL เอง — แล้วเทียบกับ `/api/summary` ให้ตรงกัน

## Solution → solutions/w6/

`solutions/w6/drop-in/scripts/analysis.sql` + `docs/ANALYSIS.md`
