# run-019 — isolation: worktree ทำงานจริงอย่างไร (path, branch, การไม่ merge กลับ)

- **Module/Workshop:** Module 4 (หัวข้อ 2 — ฟิลด์ `isolation` + บล็อกเกร็ด worktree)
- **เวลา:** 2026-10-17T13:20+07:00 | **Claude Code:** 2.1.302 | **โหมด:** headless `-p` + Task dispatch (`--permission-mode bypassPermissions` — sandbox ทิ้งได้)
- **Sandbox:** `labs-sandbox/agent-lab/` — เพิ่ม `.claude/agents/iso-probe.md`: `tools: Bash`, `isolation: worktree`

## คำสั่งรัน

```bash
claude -p "Use the iso-probe subagent: report pwd, git rev-parse --show-toplevel, git branch --show-current, git status --porcelain. Then create iso-marker.txt containing ISO-OK and run git status again." --permission-mode bypassPermissions --max-turns 20
```

## ผลจริง

| คำสั่ง | ผลลัพธ์ |
|---|---|
| `pwd` / `git rev-parse --show-toplevel` | `D:\...\build-ai-multi-agent-with-claude\.claude\worktrees\agent-af5e203d4d5ed1c77` |
| `git branch --show-current` | `worktree-agent-af5e203d4d5ed1c77` |
| `git status --porcelain` (ก่อน) | ว่าง — worktree สะอาด (แตกจาก main @ f059a56) |
| `git status --porcelain` (หลังสร้าง iso-marker.txt) | `?? iso-marker.txt` — untracked ไม่ commit ไม่ merge |

- worktree อยู่ที่ **repo root** ไม่ใช่โฟลเดอร์ session (`labs-sandbox/agent-lab`) — ตรงรูปแบบ `<repo>/.claude/worktrees/agent-<id>` และ branch `worktree-agent-<id>` พอดี
- checkout หลักไม่ถูกแตะ — ไฟล์ marker อยู่ใน worktree เท่านั้น

## เก็บกวาด (หลังทดสอบ)

```bash
git worktree remove --force .claude/worktrees/agent-af5e203d4d5ed1c77
git branch -D worktree-agent-af5e203d4d5ed1c77
git worktree prune
```

## ข้อสังเกต

1. ยืนยันทุกข้ออ้างเชิงกลไกของเอกสารอ้างอิงภายนอก (path, branch, แตกจาก default branch, ไม่ merge กลับอัตโนมัติ) — docs หน้า sub-agents/worktrees สนับสนุนครบ: Bash/PowerShell รันใน worktree, คำสั่งที่ชี้ git กลับ checkout หลักถูก block (คำสั่งที่ตรวจไม่ได้ก็ถูกปฏิเสธ), worktree ที่ไม่มีการแก้ถูกเก็บกวาดอัตโนมัติ, และ docs แนะนำเพิ่ม `.claude/worktrees/` ลง `.gitignore`
2. ทางเลือก base branch: docs ระบุ `worktree.baseRef: "head"` เปลี่ยนจาก default branch เป็น HEAD ปัจจุบันได้
3. เคส Agent Teams: เอกสารหน้า agent-teams ยืนยันข้อความตรง — การเรียกที่ "passes `isolation` on the call itself" ถูกยกเว้นจากกฎ teammate-launching จึงได้ subagent ปกติ และ `isolation` ไม่อยู่ในรายการฟิลด์ที่ teammate รับจาก definition

## สรุป: PASS
