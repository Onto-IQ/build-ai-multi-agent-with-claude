# Workshop 4 — แก้ crash ด้วย QA handoff

- `drop-in/docs/QA-REPORT.md` — รายงานของ qa ที่ระบุจุด crash พร้อม `server.js:บรรทัด`
- `drop-in/server.js` — server ฉบับที่ crash ถูกแก้แล้ว (try/catch + 400 INVALID_JSON)
- `drop-in/.claude/agents/qa.md` — เอเจนต์ qa อ้างอิง (Read, Grep, Glob, Bash)
- ตรวจด้วย `node solutions/w4/check.js` (ต้องรันที่ราก repo หลังแทนที่ server.js ของแอป)
