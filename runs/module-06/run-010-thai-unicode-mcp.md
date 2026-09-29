# run-010 — Thai Prompt + Thai Unicode ผ่าน MCP Tool (round-trip test)

- **Module/Workshop:** Module 6 / Workshop 3 — เกณฑ์ B1–B3 (ทดสอบ **ภาษาไทย + Unicode ไทยผ่าน MCP**)
- **เวลา:** 2026-09-29T04:30+07:00 | **Claude Code:** 2.1.284 | **โหมด:** headless `-p --allowedTools "mcp__shop-echo__echo" --max-turns 10`
- **Working dir:** `labs-sandbox/demo-shop`

- **Prompt ที่ส่ง (ไทย):** "เรียกใช้ tool echo ของ MCP server ชื่อ shop-echo โดยส่งข้อความ 'สวัสดี 9Expert — ทดสอบภาษาไทย ก-ฮ ๐๑๒๓' แล้วรายงานให้ตรงว่าได้รับข้อความกลับมาแบบไหน ถอดรหัสถูกหรือเพี้ยน"

- **ผลลัพธ์จริง (ย่อ — Agent เรียก MCP tool แล้วตรวจสอบด้วยตัวเอง):**

```text
| ลูกผสม ASCII+ไทย (9Expert)        | ✅ ไม่เลื่อนตำแหน่ง |
| ขีดกลาง - (hyphen ASCII U+002D)   | ✅ ยังเป็น hyphen ไม่เพี้ยนเป็น em dash |
| เลขไทย ๐๑๒๓ (U+0E60–0E63)         | ✅ ถูกต้อง ไม่ใช่ à¸£... และไม่ใช่เลขอารบิก |
| ลำดับไบต์/การ Normalize            | ✅ ความยาวและลำดับอักขระตรงกับขาไป |

สรุป: ช่องทาง MCP server shop-echo ทำงานด้วย UTF-8 ถูกต้องตั้งแต่ tool call → server →
tool result → กลับเข้า context ไม่มี mojibake, ไม่มี replacement character (\ufffd),
ไม่มี loss ของ multibyte อักขระ
```

- **ข้อสังเกต (ประสบการณ์ที่เขียนลงสื่อ):**
  1. **สาย Unicode ไทยผ่าน MCP ครบทั้งสาย** (prompt → tool call → hand-rolled Node server → tool result → context) ไม่มี mojibake — สำคัญกับผู้เรียนไทยที่กลัวปัญหา "ภาษาไทยเพี้ยน" มากที่สุด
  2. คำถามปิดท้าย "ถอดรหัสถูกหรือเพี้ยน" ทำให้ Agent **ตรวจเชิงลึกระดับ codepoint** เอง (U+002D vs em dash, U+0E60-0E63) — ทิป: ถามเกณฑ์การตรวจใน prompt แล้ว Agent จะสร้างวิธีตรวจเอง
  3. MCP server จิ๋วที่เราเขียน (JSON.stringify + UTF-8 stdout ของ Node) รองรับไทยโดยไม่ต้องทำอะไรพิเศษ — สอนได้ว่า "ทำถูกมาตรฐานตั้งแต่แรก ไทยก็ผ่าน"
- **สรุป:** **PASS** — ไทย/Unicode ผ่าน MCP ครบทั้งสาย
