# Module 8 — MCP

> ⏱ ~35 นาที · 🎯 ต่อ MCP แบบ stdio เข้า Claude Code แล้วเรียกเครื่องมือด้วยชื่อ `mcp__เซิร์ฟเวอร์__เครื่องมือ` · Connect a local stdio MCP server and call one tool by its full name.

## Key idea / แนวคิดหลัก — เล่าเป็นเรื่อง

ถึงตอนนี้เอเจนต์ของเรามีเครื่องมือในตัวครบที่จำเป็น แต่มีของที่มันไม่มี: ข้อมูลที่อยู่นอกโปรเจกต์ หรือโปรแกรมที่คุณเขียนเอง — **MCP (Model Context Protocol)** คือทางต่อของพวกนั้น มันคือข้อตกลงรูปแบบข้อความ (JSON-RPC) ที่ทำให้เอเจนต์เรียกใช้เครื่องมือที่อยู่นอกตัวมันได้เหมือนเครื่องมือในตัว

อย่าสับสนกับ Workshop 3: วันที่แล้วคุณรันคำสั่ง `duckdb` **เองในเทอร์มินัล** เพื่ออ่าน SQL ที่เอเจนต์เขียน — นั่นคือเครื่องมือของคน · วันนี้เราต่อสายให้เอเจนต์เรียกถามข้อมูลผ่าน MCP ได้เอง (เครื่องยนต์ข้อมูลคล้ายกัน แต่**คนกดรัน** กับ **เอเจนต์เรียกผ่านโปรโตคอล** คนละเรื่อง)

ในห้องนี้เราใช้ชนิดที่ง่ายที่สุดคือ `stdio` — เซิร์ฟเวอร์ MCP เป็นแค่สคริปต์ Node บนเครื่องเดียวกับ Claude ที่คุยกันผ่านบรรทัดข้อความ ไม่ต้องมีเน็ต ไม่ต้องมีพอร์ต และกฎข้อหนึ่งของมันเข้มงวดมาก: **stdout ของสคริปต์นี้คือสายของโปรโตคอล** — พิมพ์อย่างอื่นลงไปนอก JSON แม้บรรทัดเดียว สายก็พังทันที (ถ้าจะดีบัก ให้พิมพ์ลง stderr)

อีกเรื่องที่มักสับสน: `stdio` คือชนิดของ**สาย** ส่วน `node script.js` คือ**วิธียก**เซิร์ฟเวอร์ขึ้น — อย่าเผลอเขียนสลับกันในไฟล์ตั้งค่า

> EN: Stdio MCP means newline-delimited JSON on stdout. The tool name in Claude is mcp__server__tool.

## Concept / เนื้อหา

ชนิดของสายที่มีให้เลือก (แผ่นอ้างอิง — ห้องนี้ใช้แค่ตัวแรก):

| Transport | ใช้เมื่อ |
|---|---|
| stdio | สคริปต์บนเครื่องเดียวกับ Claude Code |
| HTTP | บริการปลายทาง |
| WebSocket | งานที่เซิร์ฟเวอร์ผลักเหตุการณ์ — ในห้องนี้ไม่ใช้ |

วันแรกของคอร์ส **ยังไม่มี** `.mcp.json` — ผู้เรียนสร้างเองใน Workshop 6 ด้วยบล็อกคัดลอกใน [LAB.md](LAB.md) ภายใต้ชื่อ `data-duckdb` (เซิร์ฟเวอร์ official `mcp-server-motherduck`) ชื่อเต็มของเครื่องมือในสายตา Claude คือ `mcp__data-duckdb__execute_query` — ชื่อสามส่วนต่อกันด้วยขีดล่างสองตัว: คำนำหน้า `mcp__`, ชื่อที่ตั้งไว้ใน `.mcp.json`, แล้วชื่อเครื่องมือ

ขอบเขตการลงทะเบียนมีสามระดับ: `local` (อยู่เครื่องนี้), `project` (อยู่ในไฟล์ `.mcp.json` แชร์กับ repo ได้) และ `user` — และถ้าต้องการผูกเครื่องมือนี้เข้ากับเอเจนต์ตัวใดตัวหนึ่งโดยเฉพาะ ให้ใส่ `mcpServers` ใน frontmatter ของเอเจนต์นั้น

Workshop 6 = สร้าง `.mcp.json` → อนุมัติใน TUI → ผูก `data-researcher` → เรียก `execute_query` วิเคราะห์ SQL จริงหลายขั้น แล้วเก็บผลเป็นไฟล์อ้างอิงของทีม

## ลงมือทำตามลำดับ

ทุกขั้นทำจากโฟลเดอร์แอป workshop:

1. **สร้าง `.mcp.json`** — คัดลอกบล็อกจาก [LAB.md ขั้นที่ 1](LAB.md) (มีเวอร์ชัน PowerShell และ Bash) ตรวจว่ามี `--python` `3.12` และไม่มี `--read-write`

2. เปิด TUI (`claude`) — กดอนุญาตเมื่อขึ้นกล่อง MCP `data-duckdb` แล้วตรวจ:

```bash
claude mcp list
```

   ผลที่ต้องเห็น: รายการมี `data-duckdb`

3. เพิ่มใน frontmatter ของ `data-researcher` แล้ว**รีสตาร์ท TUI**:

```yaml
mcpServers: data-duckdb
```

4. วาง prompt จากหัวข้อถัดไป — เอเจนต์รัน SQL จริงบน Parquet ตัวเลขต้องตรงยอดอ้างอิงในแล็บ

## Prompt pattern — เลือกใช้อย่างใดอย่างหนึ่ง

**เวอร์ชันไทย (แนะนำ) — เขียนแบบล็อกค่าพารามิเตอร์:**

```text
ใช้ tool mcp__data-duckdb__execute_query รันคำสั่ง SQL ต่อไปนี้เป๊ะ ๆ ห้ามแก้:

SELECT month, count(*) AS companies FROM businesses_raw GROUP BY month ORDER BY month

จากนั้นรายงาน 2 อย่าง: (1) SQL ที่รัน (2) ตารางผลลัพธ์พร้อมยอดรวม แล้วสรุปว่ารวมได้กี่แถว
```

**เวอร์ชันอังกฤษ (ใช้ได้เต็มที่):**

```text
Use the data-duckdb MCP execute_query tool to run: SELECT count(*) AS companies FROM businesses_raw — and quote the exact number.
```

> 📚 **รู้เพิ่ม:** ตัวเลขที่ถูกต้องคือ 16,781 (ข้อมูลดิบทั้งหมด รวมแถวหัวตาราง) — หลัง Workshop 3 ทำความสะอาดจะเหลือ 16,772 กิจการ ใช้คู่ตัวเลขนี้อธิบายผลของการทำความสะอาดได้พอดี

ทำขั้นเรียกเครื่องมือใน TUI จะกดอนุญาตเครื่องมือ MCP ได้เอง ถ้าต้องใช้ headless จริง ๆ ต้องใส่ชื่อเต็มและจำนวนรอบทำงาน (เทิร์น) เช่น `--allowedTools "mcp__data-duckdb__execute_query" --max-turns 10` — แล็บในห้องใช้ TUI

## Common pitfalls / กับดัก

- ลืมสร้าง `.mcp.json` แล้วสงสัยว่าทำไมไม่มี MCP — วันแรกไม่มีไฟล์นี้ตามดีไซน์ สร้างในขั้นที่ 1 ของ LAB
- ตัด `--python` `3.12` ออก — `uvx` ดึง Python ใหม่แล้ว build `cryptography` ล้ม
- ใส่ `--read-write` — ผิดดีไซน์คอร์ส (ต้อง read-only)
- พิมพ์ข้อความดีบักลง stdout ของเซิร์ฟเวอร์ MCP เอง — โปรโตคอลพังทันที ดีบักไปที่ stderr เท่านั้น
- ใช้ชื่อ `execute_query` ตอนให้สิทธิ์ — ชื่อจริงในระบบคือ `mcp__data-duckdb__execute_query` เต็มสามส่วน
- ทำใน `claude -p` โดยไม่ใส่ชื่อเต็ม tool — แล็บในห้องใช้ TUI
- ตั้ง `--max-turns` ต่ำ — ยังไม่ทันได้ผลรอบก็จบ

## Quick check / ทบทวน

<details>
<summary>1. stdout ของเซิร์ฟเวอร์ MCP ใส่อะไรได้</summary>
ใส่ได้เฉพาะข้อความ JSON-RPC
</details>

<details>
<summary>2. ชื่อเครื่องมือใน Claude หน้าตาอย่างไร</summary>
mcp__ ตามด้วยชื่อตอน add ตามด้วยชื่อเครื่องมือ
</details>

<details>
<summary>3. local กับ project ต่างกันอย่างไร</summary>
local อยู่เครื่องนี้ project อยู่ใน .mcp.json ที่แชร์กับรีโปได้
</details>

## Go deeper

- [Failure modes](../../reference/failure-modes.md)
- Claude Code docs: MCP
- คำตอบอ้างอิง: `solutions/w6/drop-in/scripts/analysis.sql` กับ `docs/ANALYSIS.md`
