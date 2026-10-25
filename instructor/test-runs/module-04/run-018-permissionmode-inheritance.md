# run-018 — permissionMode ของ definition ถูกเมินเมื่อ session หลักอยู่โหมดสิทธิ์สูง

- **Module/Workshop:** Module 4 (หัวข้อ 2 — ตาราง frontmatter ฟิลด์ `permissionMode` + กับดัก)
- **เวลา:** 2026-10-17T13:05–13:10+07:00 | **Claude Code:** 2.1.302 | **โหมด:** headless `-p` + Task dispatch (คู่เทียบสองโหมด session)
- **Sandbox:** `labs-sandbox/agent-lab/` — เพิ่ม `.claude/agents/writer-probe.md`: `tools: Write`, `permissionMode: plan`

## ทดสอบ A — session หลัก `--permission-mode acceptEdits`

```bash
claude -p "Use the writer-probe subagent: write the file marker-accept.txt containing PROBE-OK. ..." --permission-mode acceptEdits --max-turns 15
```

ผลจริง: **เขียนสำเร็จ** — `marker-accept.txt` มีอยู่จริง เนื้อหา `PROBE-OK` (ยืนยันสองทาง: Write tool รายงาน success + Leader ตรวจด้วย Glob/Read) — `permissionMode: plan` ใน definition **ถูกเมิน**

## ทดสอบ B — session หลักโหมด default (ไม่ใส่ flag)

```bash
claude -p "Use the writer-probe subagent: write the file marker-default.txt containing PROBE-OK. ..." --max-turns 15
```

ผลจริง: **BLOCKED** — Write ถูกปฏิเสธด้วยข้อความ `Cannot write to ...\marker-default.txt while in plan mode` ไฟล์ไม่เกิดขึ้น — `permissionMode: plan` มีผลจริง

## กฎตามเอกสารทางการ (ข้อความตรง)

- "When the main conversation is in `bypassPermissions`, `acceptEdits`, or auto mode ... the subagent runs in that same mode and Claude Code ignores the `permissionMode` you set."
- "When the main conversation is in `default`, `dontAsk`, or `plan` mode, the subagent runs in the permission mode you set."
- `dontAsk` มีจริง: "Auto-deny permission prompts. Explicitly allowed tools still work"
- ข้อยกเว้นเพิ่ม: definition ที่ตั้ง `bypassPermissions` (ต้อง v2.1.267+) หรือ `auto` (เมื่อไม่พร้อมใช้) จะคงโหมด session แม้อยู่โหมด default · ไม่ตั้งค่า = สืบทอดจาก session

## ข้อสังเกต

1. คู่เทียบนี้ออกแบบง่ายและตัดสินชัด — ใช้เป็นสดุกสอนได้ (ไฟล์ marker เกิด/ไม่เกิด ด้วยตา)
2. กระบวนการ: dispatch แรกของ Leader พลาดเอง (`InputValidationError: description missing`) แล้ว retry สำเร็จ — เป็นความผิดพลาดของ caller ไม่เกี่ยวกับนโยบายสิทธิ์

## สรุป: PASS

ยืนยันอิสระ: ข้ออ้างของเอกสารอ้างอิงภายนอก ("session สูงกว่า = definition ถูกเมิน") ตรงทั้ง docs และการทดสอบของคอร์ส
