# Workshop 3 — MCP guided demo

> ⏱ 20 นาที · Start state: มี `mcp/echo-server.js` ใน repo

## Goal / เป้าหมาย

Claude Code เรียก `echo` ได้ และคุณอธิบายชื่อเต็มของเครื่องมือได้

## Steps / ขั้นตอน

1. จาก `ราก repo` ลงทะเบียนเซิร์ฟเวอร์

```bash
claude mcp add sales-echo -- node mcp/echo-server.js
claude mcp list
```

ผลที่คาดหวัง: รายการมี `sales-echo`

> 📚 **รู้เพิ่ม:** `--` คือเส้นแบ่ง "จบคำสั่งของ Claude Code เริ่มคำสั่งของสคริปต์" — ไม่มีมัน Claude Code จะอ่านตัวเลือกหลัง add ไปเป็นของตัวเองแล้ว error ตั้งแต่ขั้นนี้

2. เปิด TUI แล้ววาง prompt (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันไทย (แนะนำ):**

```text
เรียกเครื่องมือ mcp__sales-echo__echo หนึ่งครั้ง โดยตั้งค่าพารามิเตอร์ text ให้มีค่าเป็นสตริงต่อไปนี้เป๊ะ ๆ ทุกตัวอักษร ห้ามแก้ ห้ามย่อ ห้ามตัดคำ:

สวัสดี — ทดสอบ ก-ฮ ๐๑๒๓

จากนั้นรายงาน 2 อย่าง: (1) ค่า text ที่คุณส่งไป (2) ข้อความที่เครื่องมือ echo กลับมา แล้วสรุปว่าตรงกันทุกตัวอักษรหรือไม่ รวมถึงเลขไทย ๐๑๒๓
```

**เวอร์ชันอังกฤษ (ใช้ได้เต็มที่):**

```text
Use the sales-echo MCP echo tool with the text "hello-sales" and quote exactly what came back.
```

ผลที่คาดหวัง: ภาษาอังกฤษได้ `hello-sales` กลับมาตรงตัว ภาษาไทยได้ `สวัสดี — ทดสอบ ก-ฮ ๐๑๒๓` ครบ ไม่เพี้ยนเป็นคนละรหัสตัวอักษร

> 📚 **รู้เพิ่ม:** ข้อความไทย+เลขไทยถูกใส่ตั้งใจ — เพื่อทดสอบว่าตัวอักษรเดินทางไปกลับทั้งสาย (prompt → server → กลับเข้า context) โดยไม่เพี้ยน ถ้าเพี้ยนแปลว่ามีที่ไหนสักแห่งพิมพ์ของแปลกปลอมลง stdout

3. เพิ่ม `mcpServers: sales-echo` ใน frontmatter ของ `data-researcher` ผ่าน TUI แล้วกดอนุญาต

ผลที่คาดหวัง: เปิดไฟล์แล้วยังมี `tools: Read, Grep, Glob` ครบ

## ✅ Checkpoint

- [ ] `claude mcp list` มี `sales-echo`
- [ ] echo ภาษาไทยกลับมาตรงประโยคที่ส่ง
- [ ] พูดชื่อเต็ม `mcp__sales-echo__echo` ได้
- [ ] ไม่ได้ `console.log` เพิ่มใน `echo-server.js`

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| add แล้วerror เรื่อง flagไม่รู้จัก | ไม่มี `--` ก่อน `node` | ใส่ `--` ตามคำสั่งในขั้นที่ 1 |
| เครื่องมือไม่ตอบ และ log มีขยะ | stdout ไม่สะอาด | ดีบักไป stderr เท่านั้น |
| headless เรียกไม่ได้ | ไม่ได้ใส่ `--allowedTools` ชื่อเต็ม | กลับไป TUI |
| หมดเทิร์น | `--max-turns` ต่ำ | ใช้ TUI หรืออย่างน้อย 10 |
| เขียน frontmatter ไม่ได้ | `claude -p` กัน `.claude/**` | TUI แล้วกดอนุญาต |
| สงสัยว่าพอร์ต 3000 เกี่ยว | คนละระบบ | stdio ไม่ใช้พอร์ตเว็บ |

## 🆘 Behind? Catch up

```bash
node scripts/catch-up.js w3
```

ได้ `mcp/sales-server.js` ซึ่งมี `echo`, `lookup_province` และ `shout` ตรวจโปรโตคอลโดยไม่ต้องเปิด Claude ด้วย `node solutions/w3/check.js`

## Stretch / ต่อยอด

ให้เอเจนต์เพิ่มเครื่องมือ `lookup_province` ที่ตอบภาคของจังหวัดในตารางเดียวกับแอป โดยยังไม่พิมพ์อะไรลง stdout นอก JSON

## Solution → solutions/w3/

`solutions/w3/drop-in/mcp/sales-server.js`
