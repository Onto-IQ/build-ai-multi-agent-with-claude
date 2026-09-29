# Workshop 3 (Guided Demo) — Tool Extension with MCP Server

## บริบท

Demo นำโดยผู้สอน ผู้เรียนพิมพ์ตามทีละคำสั่ง — เป้าหมายคือเห็นทั้งสาย: **สร้าง server → ลงทะเบียน → เห็น tool → เรียกผ่าน Agent → ผูกให้ Specialty Agent**

## โจทย์ของผู้เรียน

ทำตาม 4 ขั้นใน `lesson.md` หัวข้อ 4 ให้ครบ แล้วจดสิ่งที่เห็นในแต่ละขั้น

## เกณฑ์ผ่าน

- [ ] `claude mcp list` แสดง `shop-echo` connected
- [ ] Headless run เรียก `mcp__shop-echo__echo` สำเร็จ และผลลัพธ์ที่รายงานกลับมาตรงกับที่ส่ง (`hello-multi-agent`)
- [ ] อธิบายได้ว่าถ้าลืม `--` ตอน `claude mcp add` จะเกิดอะไรขึ้น
- [ ] (ท้าทาย) แก้ `echo-server.js` ให้มี tool ใหม่ `shout` ที่แปลงข้อความเป็นตัวพิมพ์ใหญ่ แล้วเรียกได้จริง

## จุดสังเกตสำหรับผู้สอน

- ให้ผู้เรียนเปิด `mcp/echo-server.js` คู่กัน — ชี้ว่า `tools/list` กับ `tools/call` คือสอง method ที่ Agent ใช้จริง
- ถ้า tool ไม่ขึ้น: 90% มาจาก server พิมพ์อย่างอื่นลง stdout (debug log) — ให้ลบ console.log ออก

## Hint

ชื่อ tool ใน permission คือ `mcp__shop-echo__echo` — underscore สองตัวคั่น server กับ tool

**เวอร์ชันไทยของคำสั่งขั้น 3 (✅ tested — runs/module-06/run-010 พร้อมการทดสอบ Unicode ไทย):** ใช้คำสั่ง TH ใน `lesson.md` หัวข้อ 4 — และลองเปลี่ยนข้อความเป็นภาษาของคุณเอง (ผลรันจริง: ไทย+เลขไทยผ่านครบทั้งสาย ไม่มี mojibake)

## Solution (ท้าทาย)

ใน `handleToolsCall` เพิ่ม case `shout` ที่ return `{ content: [{ type: 'text', text: String(text).toUpperCase() }] }` และเพิ่ม entry ใน `tools/list`
