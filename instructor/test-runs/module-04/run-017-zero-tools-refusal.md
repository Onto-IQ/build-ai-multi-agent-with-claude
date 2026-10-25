# run-017 — tools เหลือศูนย์: subagent ถูกปฏิเสธสตาร์ตพร้อมข้อความเฉพาะ

- **Module/Workshop:** Module 4 (หัวข้อ 2 — บล็อก "เพดานเครื่องมือที่ระบบกำหนดเอง")
- **เวลา:** 2026-10-17T12:55+07:00 | **Claude Code:** 2.1.302 | **โหมด:** headless `-p` + Task dispatch
- **Sandbox:** `labs-sandbox/agent-lab/` — เพิ่ม `.claude/agents/zero-tools.md`: `tools: NoSuchTool` (เครื่องมือที่ไม่มีอยู่จริง)

## คำสั่งรัน

```bash
claude -p "Use the zero-tools subagent to say hi." --allowedTools "Task" --max-turns 15
```

## ผลจริง (ข้อความ error ที่ Leader ได้รับ)

```text
Agent 'zero-tools' would be spawned with zero tools — refusing.
Its tools list resolved to nothing: unrecognized [NoSuchTool].
```

Subagent ไม่ถูกสร้างเลย — ไม่มี graceful degrade ไปเป็น default toolset

## ข้อสังเกต

1. ตรงกับเอกสารทางการ: "Claude Code usually refuses to launch the subagent and the Agent tool returns an error naming the unresolved entries" ("Agent would be spawned with zero tools")
2. ความต่างเชิงออกแบบที่สอนได้: ชื่อ *ฟิลด์* frontmatter สะกดผิด = ถูกเมินเงียบ ๆ (run-013) แต่ชื่อ *เครื่องมือ* ใน `tools` resolve ไม่ได้ = ปฏิเสธสตาร์ตทันที — validation คนละระดับ
3. ก่อน v2.1.208 พฤติกรรมเดิมคือปล่อยสตาร์ตแบบไม่มี tool แล้วได้ผลว่าง (ตาม docs) — เวอร์ชันเก่าอาจต่างจากนี้

## สรุป: PASS
