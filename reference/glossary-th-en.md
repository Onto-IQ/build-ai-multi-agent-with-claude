# อภิธาน

## Keyphrase ในประโยกไทย

ในบทเรียนและแล็บ ให้ใช้ **คำอังกฤษคงที่** (keyphrase) แทนการแปลย่อหรือคำพูดกำกวม:

| Keyphrase | ใช้เมื่อ | อย่าใช้ |
|---|---|---|
| **quality gate** | พูดถึง `node scripts/quality-gate.js`, exit 0/2, FAIL | เกต, เกตฟ้อง, แดง/เขียวอย่างเดียว |
| **cost gate** | `scripts/cost-gate.js`, `total_cost_usd` | เกตต้นทุน (ในประโยก) |
| **port busy** | พอร์ตถูกจอง มักเพราะ `node server.js` ค้าง | พอร์ตชน, พอร์ตไม่ว่าง |
| **starter sandbox** | ชุดเริ่มต้นใน `sandbox/sales-insight` ที่ quality gate ยัง exit 2 | แซนด์บ็อกซ์จุดเริ่มต้นตามออกแบบ |
| **sandbox** | โฟลเดอร์ `sandbox/sales-insight` | แซนด์บ็อกซ์ |
| **headless** | `claude -p` | โหมดพิมพ์ครั้งเดียว (ใช้คู่กับ `-p` ได้) |
| **TUI** | `claude` แบบโต้ตอบ | — |
| **verify-setup** | `node scripts/verify-setup.mjs` | เครื่องติดตั้งพัง |

คอลัมน์ «ไทยในห้องนี้» ด้านล่าง = คำอธิบายสั้น ไม่จำเป็นต้องแทน keyphrase ในประโยก

| English | ไทยในห้องนี้ | ความหมายสั้น |
|---|---|---|
| Tool calling | การเรียกเครื่องมือ | โมเดลเลือกเครื่องมือ รันไทม์ทำให้ แล้วส่งผลกลับเข้า context |
| Subagent | เอเจนต์ย่อย | context แยก สรุปผลกลับผู้เรียก |
| Swarm | งานขนาน | งานย่อยไม่ต้องใช้ผลของกันและกัน (ในคอร์สนี้มักใช้ Explore subagents) |
| Agent Teams | ทีมเอเจนต์ | โหมดให้ Claude สร้างเพื่อนทีมที่คุยกันเองได้และมีรายการงานร่วม — เปิดด้วยไฟล์ `.claude/settings.local.json` |
| settings.local.json | ไฟล์ตั้งค่าบนเครื่องคุณ | ไฟล์ในโฟลเดอร์ `.claude/` ที่เป็นของเครื่องคุณคนเดียว · ไม่ส่งขึ้น git · เปิดโหมดทีมแล้วต้องลบเอง |
| Teammate | เพื่อนทีม | สมาชิกใน Agent Teams ที่หัวหน้าตั้งชื่อให้ |
| Sequential pipeline | งานทีละขั้น | ผลของขั้นก่อนหน้าเป็นอินพุตของขั้นถัดไป |
| Leader | หัวหน้างาน | แตกงาน รวมผล ไม่ได้ลงมือทุกไฟล์เอง |
| Shared contract | สเปกกลาง | สเปกที่ทุกบทบาทยึด เช่น `PRODUCT-SPEC.md` |
| Specialty agent | เอเจนต์เฉพาะทาง | ไฟล์ใน `.claude/agents/` |
| Skill | skill | ขั้นตอนใน `.claude/skills/<ชื่อ>/SKILL.md` |
| DuckDB (CLI) | คำสั่ง duckdb ในเทอร์มินัล | เครื่องมือที่**คน**รันเอง (เช่น Workshop 3 อ่าน `.sql`) — ยังไม่ใช่ MCP |
| MCP | MCP | JSON-RPC ให้**เอเจนต์**เรียกเครื่องมือภายนอก (Workshop 6) — คนละขั้นกับพิมพ์ `duckdb` เอง |
| stdio | stdio | MCP บนเครื่องเดียวกัน — stdout มีได้แค่ JSON |
| Hook | hook | สคริปต์ที่รันเองที่จุดเหตุการณ์ — hook exit 2 = บล็อก |
| Quality gate | quality gate | `scripts/quality-gate.js` — exit 0 ผ่าน, exit 2 ไม่ผ่าน |
| Cost gate | cost gate | `scripts/cost-gate.js` — หยุดเมื่อเกินเพดาน |
| Human-in-the-loop | คนอยู่ในวง | หยุดให้คนอนุมัติก่อนเดินต่อ |
| Preflight | preflight | เช็กลิสต์ก่อน deploy หรือก่อนปล่อยเอเจนต์ทั้งทีม |
