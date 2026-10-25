# Frontmatter ชีตสั้น

ไฟล์เอเจนต์อยู่ที่ `.claude/agents/<ชื่อ>.md` เปิดด้วย YAML ระหว่าง `---` แล้วตามด้วยวิธีทำงาน

| ฟิลด์ | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| `name` | ชื่อที่เรียก เป็นภาษาอังกฤษ ไม่มีช่องว่าง | `data-researcher` |
| `description` | ตัวตัดสินว่าจะส่งงานให้เอเจนต์นี้หรือไม่ เขียนสั้น และขึ้นต้นงานที่อยากให้ถูกเรียกเองด้วย `Use proactively` | `Use proactively for data-quality questions.` |
| `tools` | allowlist | `Read, Grep, Glob` |
| `disallowedTools` | ตัดเครื่องมือออกจากชุดที่ได้ ถ้าชื่อเดียวกันอยู่ทั้งสองรายการ ตัวนั้นหลุดออก | `WebFetch, WebSearch` |
| `model` | ทางลัดของรุ่น ใช้ชื่อตระกูล | `haiku`, `sonnet`, `opus` |
| `permissionMode` | โหมดสิทธิ์ของเอเจนต์ตัวนี้ มีผลเมื่อเซสชันหลักยังเป็นโหมด default | `plan` |
| `skills` | โหลด skill เข้า context ตั้งแต่เริ่ม ใน subagent | `release-checklist` |
| `memory` | จำข้ามเซสชัน | `project` |

ชื่อรุ่นตัวเต็มเปลี่ยนบ่อยในห้องใช้ชื่อตระกูล แล้วให้ Claude Code เป็นคนเลือกไอดีปัจจุบัน รายละเอียดฟิลด์ที่เหลือ เช่น `isolation` และเพดาน tools อยู่ใน `instructor/deep-dives/module-04-agent-definitions.md`

`description` ถูกส่งเข้าเซสชันหลักตลอด อย่าเขียนขั้นตอนยาวไว้ที่นั่น ขั้นตอนอยู่ที่ตัวเนื้อด้านล่าง

การเขียนไฟล์ใต้ `.claude/` ใน TUI จะมีกล่องให้กดอนุญาต ใน `claude -p` การเขียนพาธนี้ถูกปฏิเสธได้ทุกแบบของ `--allowedTools` แล็บของคอร์สจึงทำใน TUI
