# Workshop 6 — ต่อ MCP ระดับโปรเจกต์ + SQL วิเคราะห์ข้อมูลจริง

> ⏱ machine ~15 นาที · Start state: อยู่ใน workshop repo · `data/dataset.csv` สะอาดแล้วจาก Workshop 3 · gate 6/6 · **ยังไม่มี** `.mcp.json` (ตั้งค่าในแล็บนี้)

## Goal / เป้าหมาย

สร้าง `.mcp.json` ระดับโปรเจกต์ (DuckDB read-only) ด้วยตัวเอง อนุมัติใน TUI ผูกเข้า `data-researcher` แล้ววิเคราะห์ SQL จนได้ตารางยอดอ้างอิงต่อภาค สำหรับ writer ใน Workshop 9

## Steps / ขั้นตอน

### 1) สร้าง `.mcp.json` ที่ราก workshop (คัดลอกทั้งก้อน)

ในเทอร์มินัลที่ workshop repo (`C:\dev\multi-agent-workshop`) สร้างไฟล์ด้วยเนื้อหาด้านล่าง **เป๊ะ ๆ** — pin `--python 3.12` ห้ามตัด (Python ใหม่กว่านี้ทำ `cryptography` build ล้ม)

**PowerShell:**

```powershell
@'
{
  "mcpServers": {
    "data-duckdb": {
      "command": "uvx",
      "args": [
        "--python",
        "3.12",
        "mcp-server-motherduck",
        "--db-path",
        "data/warehouse.duckdb"
      ]
    }
  }
}
'@ | Set-Content -Path .mcp.json -Encoding utf8
```

**Git Bash / macOS / Linux:**

```bash
cat > .mcp.json <<'EOF'
{
  "mcpServers": {
    "data-duckdb": {
      "command": "uvx",
      "args": [
        "--python",
        "3.12",
        "mcp-server-motherduck",
        "--db-path",
        "data/warehouse.duckdb"
      ]
    }
  }
}
EOF
```

ตรวจด้วยตา:

```powershell
Get-Content .mcp.json
```

```bash
cat .mcp.json
```

ผลที่คาดหวัง: มีเซิร์ฟเวอร์ชื่อ `data-duckdb` · คำสั่ง `uvx` · มี `--python` `3.12` · มี `--db-path` `data/warehouse.duckdb` · **ไม่มี** `--read-write` (read-only ตามดีไซน์)

> 📚 **รู้เพิ่ม:** นี่คือ MCP แบบ **project scope** — ไฟล์อยู่ใน repo ทั้งทีมได้คอนฟิกเดียวกัน ไม่ต้อง `claude mcp add` คนละเครื่อง ครั้งแรกที่เปิด TUI Claude จะถามอนุมัติเซิร์ฟเวอร์จากไฟล์นี้

### 2) เปิด TUI แล้วอนุมัติ MCP

```bash
claude
```

เมื่อขึ้นกล่อง **New MCP server found: data-duckdb** ให้เลือกอนุญาตใช้ในโปรเจกต์นี้ (หรือ “this and all future MCP servers in this project”) อย่าเลือก Continue without

ตรวจรายการ (เทอร์มินัลลูกนอก TUI ก็ได้):

```bash
claude mcp list
```

ผลที่คาดหวัง: รายการมี `data-duckdb`

### 3) ผูก MCP เข้า data-researcher แล้วรีสตาร์ทเซสชัน

ใน TUI (เลือกอย่างหนึ่ง) แล้วกดอนุญาตแก้ไฟล์เอเจนต์:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Add mcpServers: data-duckdb to the frontmatter of .claude/agents/data-researcher.md. Keep the tools line exactly as it is.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
เพิ่ม mcpServers: data-duckdb ใน frontmatter ของ .claude/agents/data-researcher.md คงบรรทัด tools เดิมไว้
```

**ปิด TUI แล้วเปิด `claude` ใหม่** — MCP และ frontmatter โหลดตอนเซสชันเริ่มเท่านั้น

frontmatter ที่ถูกต้องต้องมีบรรทัดประมาณนี้:

```yaml
mcpServers: data-duckdb
```

### 4) เรียก SQL จริงผ่าน MCP

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Use the data-duckdb MCP execute_query tool to run: SELECT month, count(*) AS companies, sum(TRY_CAST(replace(replace(capital_raw, ',', ''), ' ', '') AS BIGINT)) AS capital_thb FROM businesses_raw GROUP BY month ORDER BY month. Report the table. Do not edit files.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ใช้ tool execute_query ของ MCP data-duckdb รัน: SELECT month, count(*) AS companies, sum(TRY_CAST(replace(replace(capital_raw, ',', ''), ' ', '') AS BIGINT)) AS capital_thb FROM businesses_raw GROUP BY month ORDER BY month แล้วรายงานตาราง ห้ามแก้ไฟล์
```

> 📚 **รู้เพิ่ม:** ใช้ `TRY_CAST` ไม่ใช่ `CAST` เพราะข้อมูลดิบมีแถวหัวตาราง 9 แถวปนอยู่ — `CAST` ล้มทั้ง query ทันทีที่เจอค่าที่แปลงไม่ได้ ส่วน `TRY_CAST` ให้ NULL แล้วข้าม

ผลที่คาดหวัง: ตารางรายเดือนจากข้อมูลจริง — ม.ค. 18,620,752,814 · ก.พ. 14,815,712,210 · มิ.ย. 11,905,403,760 บาท

### 5) เก็บผลวิเคราะห์เป็นไฟล์ของทีม

สร้าง `scripts/analysis.sql` ที่รวมทุนต่อภาคแล้ว `COPY` ออกเป็น `docs/region-capital.csv` สั่ง claude ใน TUI (เลือกอย่างหนึ่ง) แล้วกดอนุญาต:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Create scripts/analysis.sql for DuckDB: join data/dataset.csv province against a province-to-region mapping table written as a VALUES list, group by region, and COPY the result (region, companies, capital_thb) to docs/region-capital.csv. Order by capital descending. Run nothing yet.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
สร้าง scripts/analysis.sql สำหรับ DuckDB: จับคู่คอลัมน์ province จาก data/dataset.csv กับตารางแผนที่จังหวัดเป็นภาคแบบ VALUES list แล้ว GROUP BY region และ COPY ผล (region, companies, capital_thb) ไปที่ docs/region-capital.csv เรียงทุนมากไปน้อย ยังไม่ต้องรัน
```

### 6) รันด้วยมือคุณเอง

```powershell
duckdb -c ".read scripts/analysis.sql"
```

ผลที่คาดหวัง: `docs/region-capital.csv` มี 6 แถว ยอดรวม 16,772 กิจการ / 45,341,868,784 บาท โดย กลาง 10,068 กิจการ / 31,680,888,983 บาท

### 7) เขียน `docs/ANALYSIS.md`

สั้น ๆ — ตารางจาก `docs/region-capital.csv` + ข้อสังเกตหนึ่งประโยคที่อ้างตัวเลขจากไฟล์เท่านั้น สั่งใน TUI (เลือกอย่างใดอย่างหนึ่ง) แล้วกดอนุญาต:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@data-researcher Read docs/region-capital.csv only. Write docs/ANALYSIS.md in Thai with: (1) a short title and one sentence stating the source files (dataset.csv clean · analysis.sql · region-capital.csv), (2) a markdown table of all six regions with companies and capital_thb exactly as in the CSV, (3) one observation sentence that cites numbers from that table only. Do not invent totals or regions. Do not edit scripts/analysis.sql or .mcp.json.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@data-researcher อ่านเฉพาะ docs/region-capital.csv แล้วเขียน docs/ANALYSIS.md เป็นภาษาไทย โดยมี (1) ชื่อเรื่องสั้น + ประโยคหนึ่งบอกแหล่งที่มา (dataset.csv สะอาด · analysis.sql · region-capital.csv) (2) ตาราง markdown ทั้ง 6 ภาค พร้อมจำนวนกิจการและทุน ตาม CSV เป๊ะ (3) ข้อสังเกตหนึ่งประโยคที่อ้างตัวเลขจากตารางนั้นเท่านั้น ห้ามเดายอดหรือภาคเพิ่ม ห้ามแก้ scripts/analysis.sql หรือ .mcp.json
```

ผลที่คาดหวัง: `docs/ANALYSIS.md` มีตาราง 6 ภาคตรง CSV (กลาง 10,068 / 31,680,888,983 เป็นต้น) และข้อสังเกตหนึ่งประโยคที่ไม่ invent ตัวเลข

📦 **Handoff:** `docs/region-capital.csv` + `docs/ANALYSIS.md` = ชุดตัวเลขอ้างอิงของ writer ใน Workshop 9 — ห้ามเดาตัวเลขนอกไฟล์นี้

## ✅ Checkpoint

- [ ] สร้าง `.mcp.json` เองจากบล็อกด้านบน (มี `--python` `3.12` · ไม่มี `--read-write`)
- [ ] `claude mcp list` มี `data-duckdb` และกดอนุญาตใน TUI แล้ว
- [ ] `data-researcher` มี `mcpServers: data-duckdb` ใน frontmatter
- [ ] ได้ตารางรายเดือนจาก MCP จริง
- [ ] `scripts/analysis.sql` รันผ่าน duckdb จริง
- [ ] `docs/region-capital.csv` มี 6 ภาค รวม 16,772 กิจการ / 45,341,868,784 บาท
- [ ] `docs/ANALYSIS.md` อ้างเฉพาะตัวเลขจากไฟล์

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| เปิดวันแรกเจอ MCP ทันที | มี `.mcp.json` ค้างจากรอบก่อน | ลบ `.mcp.json` แล้วเริ่มแล็บนี้ใหม่ |
| MCP ไม่ตอบ | ยังไม่กดอนุญาต หรือยังไม่ได้ติดตั้ง uv | ติดตั้ง uv ตาม SETUP.md แล้วกดอนุญาตตอน claude ถาม |
| build cryptography ล้ม | ไม่ได้ pin Python 3.12 | ใช้บล็อก `.mcp.json` ในขั้นที่ 1 เป๊ะ ๆ |
| `duckdb: command not found` | DuckDB CLI ยังไม่อยู่บน PATH | ติดตั้งตาม SETUP.md ขั้นที่ 1 |
| ไม่มี tool `mcp__data-duckdb__*` | ยังไม่รีสตาร์ทหลังสร้างไฟล์ / ยังไม่ผูก frontmatter | ปิด TUI เปิดใหม่ ตรวจ `.mcp.json` + `mcpServers` |
| ยอดไม่ตรงเอกสาร | join จังหวัดพลาด | ใช้คอลัมน์ `province` จากไฟล์สะอาดเป็นตัว join |
| CSV ออกมาว่าง | รันจากโฟลเดอร์อื่น | ต้องรันจากราก workshop repo |

## 🆘 Behind? Catch up

จาก course repo (ไฟล์ถูก copy ลง workshop repo รวม `.mcp.json`):

```bash
node scripts/catch-up.js w6
```

ได้ `.mcp.json` + `scripts/analysis.sql` + `docs/ANALYSIS.md` ฉบับอ้างอิง ตรวจด้วย `node solutions/w6/check.js` (จาก course repo)

## Stretch / ต่อยอด

เพิ่มตาราง "จังหวัดที่ทุนสูงสุด 10 อันดับ" ลง `docs/ANALYSIS.md` โดยเขียน SQL เอง — แล้วเทียบกับ `/api/summary` ให้ตรงกัน

## Solution → solutions/w6/

`solutions/w6/drop-in/.mcp.json` + `scripts/analysis.sql` + `docs/ANALYSIS.md`
