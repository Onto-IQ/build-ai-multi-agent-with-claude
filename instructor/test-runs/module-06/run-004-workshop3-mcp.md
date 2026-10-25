# run-004 — Workshop 3 (Guided Demo): MCP Server ต่อกับ Claude Code สำเร็จ

- **Module/Workshop:** Module 6 / Workshop 3 — เกณฑ์ B1–B2
- **เวลา:** 2026-09-29T02:35+07:00 | **Claude Code:** 2.1.284 | **Working dir:** `labs-sandbox/demo-shop`
- **Artifact:** `labs-sandbox/demo-shop/mcp/echo-server.js` (MCP stdio server เขียนด้วย Node ล้วน — สอนโปรโตคอลให้เห็นจริง)

## ขั้นตอนที่รันจริงทั้งหมด

1. **ทดสอบโปรโตคอลด้วยมือ** (pipe JSON-RPC → server): `initialize` ✓ / `tools/list` ✓ ตอบ schema ถูก / `tools/call echo` ✓ ตอบ `{"content":[{"type":"text","text":"hello-multi-agent"}]}`
2. **ลงทะเบียน:**

```bash
claude mcp add shop-echo -- node mcp/echo-server.js
# → "Added stdio MCP server shop-echo ... to local config"
# → File modified: ~/.claude.json [project: <working directory ของ demo-shop>]  (output จริงระบุ path เครื่องผู้รัน — generic แทน)  (scope=local บันทึกที่ ~/.claude.json ต่อโปรเจกต์)
```

3. **ตรวจ:**

```bash
claude mcp list
# → shop-echo: node mcp/echo-server.js - ✔ Connected
```

4. **เรียกผ่าน Agent (headless):**

```bash
claude -p "Use the shop-echo MCP server's echo tool with the text 'hello-multi-agent' and tell me exactly what came back." --allowedTools "mcp__shop-echo__echo" --max-turns 10
```

ผลจริง:

```text
```
hello-multi-agent
```

It echoed the input text back verbatim — the connection is working.
```

## ข้อสังเกต

1. ชื่อ permission ของ MCP tool = `mcp__shop-echo__echo` (double underscore) — ใช้กับ `--allowedTools` ได้ทันที ไม่มีปัญหา deny แบบ `.claude/**` (run-003)
2. `claude mcp list` รัน health check จริง (spawn server + handshake) — ใช้เป็นขั้นตรวจใน lab ได้
3. Scope `local` ถูกเก็บใน `~/.claude.json` ภายใต้ key ของโฟลเดอร์โปรเจกต์ — สอดคล้องเอกสาร official (Local/Project/User)

## สรุป: **PASS** (iteration 1)
