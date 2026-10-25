# Module 6 — การเชื่อมต่อระบบภายนอกผ่าน MCP (Model Context Protocol)

> **เวลา:** ~35 นาที (สอน 15 + Guided Demo 20) | **ผลลัพธ์ที่คาดหวัง:** ผู้เรียนต่อ MCP Server เข้ากับ Claude Code และผูกให้ Specialty Agent ใช้ได้

## 1. MCP อธิบายใน 1 ประโยค

MCP คือ **โปรโตคอลมาตรฐาน (JSON-RPC) สำหรับให้ Agent ต่อ "แหล่งเครื่องมือ/ข้อมูลภายนอก"** — เขียน server ครั้งเดียว ใช้ได้กับทุก client ที่รองรับ MCP

## 2. ชนิดตาม Transport (สเปกทางการ — ตรวจสอบแล้วว่า "Node/Standard/Docker" เดิมไม่ใช่ชนิด)

| Transport | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| `stdio` | Server รันในเครื่องเดียวกับ Claude Code | `npx some-mcp-server`, script ของเราเอง |
| `HTTP` / Streamable HTTP | Remote service | `https://mcp.notion.com/mcp` |
| `SSE` | **deprecated** — เหลือแค่ auto-fallback สำหรับ server เก่า | — |
| `WebSocket` | Server ที่ push event สด | ผ่าน JSON config เท่านั้น |

**แยกให้ขาด:** "Node.js (npx) / Docker / Remote URL" คือ**รูปแบบการติดตั้ง** ไม่ใช่ชนิดของ MCP

**Scope ใน Claude Code:** `Local` (โปรเจกต์นี้ เครื่องนี้) / `Project` (`.mcp.json` แชร์ผ่าน Git) / `User` (ทุกโปรเจกต์ของเรา)

## 3. เห็นโปรโตคอลด้วยตา — MCP Server จิ๋วของคอร์ส

คอร์สนี้ไม่พึ่ง server สำเร็จรูปเพื่อเริ่ม — เราเขียน MCP stdio server ด้วย Node ล้วน 11 ขั้นตอนโปรโตคอล อยู่ที่ `labs-sandbox/demo-shop/mcp/echo-server.js` มี tool เดียวชื่อ `echo` — ผู้เรียนจะเห็นว่า MCP คือ JSON-RPC ผ่าน stdin/stdout ธรรมดา

## 4. Guided Demo (Workshop 3) — ทำตามทีละบรรทัด ✅ tested (runs/module-06/)

**ขั้น 1 — ลงทะเบียน server (scope: local):**

```bash
claude mcp add shop-echo -- node mcp/echo-server.js
```

**ขั้น 2 — ตรวจว่า Claude Code เห็น:**

```bash
claude mcp list
```

ผลที่คาดหวัง: รายการมี `shop-echo` พร้อมสถานะ connected

**ขั้น 3 — เรียก tool ผ่าน Agent จริง:**

```bash
EN: claude -p "Use the shop-echo MCP server's echo tool with the text 'hello-multi-agent' and tell me exactly what came back." --allowedTools "mcp__shop-echo__echo" --max-turns 10
TH: claude -p "เรียกใช้ tool echo ของ MCP server ชื่อ shop-echo โดยส่งข้อความ 'สวัสดีห้องเรียน — ทดสอบภาษาไทย ก-ฮ ๐๑๒๓' แล้วรายงานให้ตรงว่าได้รับข้อความกลับมาแบบไหน ถอดรหัสถูกหรือเพี้ยน" --allowedTools "mcp__shop-echo__echo" --max-turns 10
```

- ชื่อ tool ของ MCP ใน Claude Code = `mcp__<ชื่อ server>__<ชื่อ tool>` — จุดนี้แหละที่ทำให้ Permission ระบุได้ละเอียดระดับ tool
- ผลที่คาดหวัง: EN → echo กลับ `hello-multi-agent`; TH → echo กลับข้อความไทยครบถ้วน
- **Thai Unicode ผ่าน MCP ครบสาย (✅ tested — runs/module-06/run-010):** ส่งไทยผสมเลขไทย (๐๑๒๓) ผ่าน tool call → server → กลับ context **ไม่มี mojibake** — Agent ตรวจระดับ codepoint ให้เอง (U+002D hyphen ไม่เพี้ยนเป็น em dash, U+0E60–0E63 ถูกต้อง) เมื่อเราถามว่า "ถอดรหัสถูกหรือเพี้ยน"

**ขั้น 4 — ผูกให้ Specialty Agent (จาก Module 4):**

เพิ่มใน frontmatter ของ `.claude/agents/code-researcher.md`:

```yaml
mcpServers: shop-echo
```

## 5. กับดักที่พบบ่อย

- ลืม `--` คั่นก่อนคำสั่ง server (`claude mcp add shop-echo -- node ...`) → Claude Code ตีความ flag ของ server เป็นของตัวเอง
- Server พิมพ์อะไรลง stdout นอกจาก JSON-RPC (เช่น console.log debug) → protocol พังทันที (stdio = สายสื่อสารศักดิ์สิทธิ์)
- ลืมว่า tool ชื่อ `mcp__server__tool` ตอนตั้ง permission แบบละเอียด

## อ้างอิง

- Claude Code Docs — MCP (code.claude.com/docs/en/mcp): transports, scopes, `claude mcp add` syntax
