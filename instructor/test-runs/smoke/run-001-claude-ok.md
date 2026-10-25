# run-001 — ยืนยัน Claude Code CLI + Auth (Smoke Test)

- **Module/Workshop:** Module 2 (Environment Setup) — เกณฑ์ B1/B4
- **เวลา:** 2026-09-29T01:50+07:00 | **Claude Code:** 2.1.284 (npm global) | **โหมด:** headless `-p` | **OS:** Windows 11 (Git Bash)
- **คำสั่งรัน:**

```bash
claude -p "Reply with exactly: CLAUDE-OK"
# (หลังแก้ alias เก่าใน ~/.bashrc ที่ชี้ไป node 24.13.0 ที่ถูกลบ → ชี้ cli-wrapper.cjs ของ npm global แทน)
```

- **Prompt ที่ส่ง:** `Reply with exactly: CLAUDE-OK`

- **ผลลัพธ์จริง (stdout):**

```text
⚠ claude.ai connectors are disabled because ANTHROPIC_API_KEY or another auth source is set and takes precedence over your claude.ai login · Unset it to load your organization's connectors
CLAUDE-OK
```

- **ข้อสังเกต:**
  1. Headless mode ทำงานและ auth ผ่าน (ตอบตรงตามที่สั่ง) — การทดสอบ prompt ทั้งหมดของคอร์สใช้โหมดนี้ได้
  2. มี warning เรื่อง claude.ai connectors ถูกปิดเพราะเครื่องตั้ง `ANTHROPIC_API_KEY` ไว้ — **ไม่ใช่ความผิดพลาด** เป็นพฤติกรรมปกติเมื่อมี API key override login — ควรสอนผู้เรียนให้รู้จัก warning นี้
  3. `claude --version` บน alias ใหม่ = 2.1.284
- **การปรับปรุง:** ไม่มี (ผ่านรอบแรก)
- **สรุป:** **PASS**
