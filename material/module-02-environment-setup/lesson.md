# Module 2 — Technical Environment & Workspace Setup

> **เวลา:** ~30 นาที | **ผลลัพธ์ที่คาดหวัง:** เครื่องผู้เรียนพร้อมใช้ Claude Code 100% — ตรวจผ่านทุกขั้นด้วยคำสั่ง verify ที่ให้มา

## Checklist ก่อนเริ่ม

| เครื่องมือ | เวอร์ชันขั้นต่ำ | คำสั่งตรวจ |
|---|---|---|
| Node.js | LTS (≥ 20) | `node --version` |
| npm | ≥ 10 | `npm --version` |
| Git | ใด ๆ ที่ใหม่ | `git --version` |
| Claude Code CLI | ล่าสุด | `claude --version` |
| Editor | VS Code หรือ Cursor | เปิดได้ |

## ขั้นที่ 1 — ติดตั้ง Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
```

ตรวจ:

```bash
claude --version
```

ผลลัพธ์ที่คาดหวัง: หมายเลขเวอร์ชัน (เช่น `2.x.x`) — ถ้า error `Cannot find module ... cli.js` แปลว่า PATH ชี้ไป install เก่า (พบบ่อยกับผู้ใช้ mise/nvm ที่เปลี่ยนเวอร์ชัน Node) — วิธีแก้: ติดตั้งซ้ำด้วยคำสั่งข้างบนภายใต้ Node เวอร์ชันปัจจุบัน

## ขั้นที่ 2 — ล็อกอินครั้งแรก

เปิดโต้ตอบแบบ TUI (Terminal UI) ครั้งแรก:

```bash
claude
```

- ถ้ายังไม่มีบัญชี จะมีขั้นตอน login ผ่านเบราว์เซอร์ (เลือก Claude Pro/Team ที่ผู้จัดเตรียมให้)
- ถ้าเคยล็อกอินไว้ จะเข้าสู่ REPL ได้เลย — ทดลองพิมพ์ `/status` เพื่อดูสถานะบัญชีและ model
- ออกจาก TUI ด้วย `Ctrl+C` สองครั้ง หรือพิมพ์ `/exit`

## ขั้นที่ 3 — โหมดทำงาน 2 แบบที่คอร์สนี้ใช้

| โหมด | คำสั่ง | ใช้เมื่อ |
|---|---|---|
| **TUI แบบโต้ตอบ** | `claude` | เรียน/ทำ workshop ปกติ — มองเห็น tool calls, อนุมัติ permission สด ๆ |
| **Headless (print mode)** | `claude -p "โจทย์"` | รันคำสั่งเดียวจบ, ทำ script, ตรวจงานอัตโนมัติ — คอร์สนี้ใช้โหมดนี้เก็บผลการทดสอบ prompt |

ทดสอบ headless:

```bash
claude -p "Reply with exactly: CLAUDE-OK"
```

ผลลัพธ์ที่คาดหวัง: ข้อความ `CLAUDE-OK` พิมพ์ออกทาง stdout แล้วโปรแกรมจบ

## ขั้นที่ 4 — เตรียม Workspace มาตรฐานของคอร์ส

```bash
cd D:\dev\github\Onto-IQ\build-ai-multi-agent-with-claude
git status
code .
```

- เปิดโฟลเดอร์ `labs-sandbox/demo-shop` ด้วย VS Code
- รันแอปตัวอย่าง: `node server.js` แล้วเปิด `http://localhost:3000` — จบด้วย `Ctrl+C`

> Claude Code ใช้ "โฟลเดอร์ที่เปิด" เป็นขอบเขตการทำงาน (working directory) — อย่ารันจาก `C:\` ราก ให้รันจากโฟลเดอร์โปรเจกต์เสมอ

## ขั้นที่ 5 — ตั้งค่าที่ต้องรู้ (ไม่บังคับ แต่ใช้ใน Module ถัดไป)

| ตัวแปร/ไฟล์ | หน้าที่ | ใช้ใน Module |
|---|---|---|
| `~/.claude/settings.json` | การตั้งค่าระดับผู้ใช้ (permissions, model, hooks) | 9 |
| `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` | จำกัดจำนวน Subagent ขนาน (default 20) | 3 |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | เปิดฟีเจอร์ Agent Teams (experimental) | 7 |

ตรวจว่าเห็นค่า environment:

```bash
echo $CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS
```

(ว่าง = ยังใช้ค่า default 20 — ถือว่าผ่าน)

## ขั้นที่ 6 — สร้าง Git checkpoint แรก

```bash
git add -A
git commit -m "course: init workspace + sandbox"
```

> นิสัยที่ Module ท้าย ๆ จะใช้หนัก: **commit ทุกครั้งที่ Agent ทำงานสำเร็จ** เพื่อให้ย้อน v1→v2 ได้ (เห็นพัฒนาการ)

## ผ่านเกณฑ์ Module นี้เมื่อ

- [ ] `claude --version` แสดงเวอร์ชัน
- [ ] `claude -p "Reply with exactly: CLAUDE-OK"` ตอบ `CLAUDE-OK`
- [ ] demo-shop รันและเปิด localhost:3000 ได้
- [ ] git commit แรกถูกสร้าง

## ปัญหาที่พบบ่อย (Troubleshooting)

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| `claude: command not found` | npm global bin ไม่อยู่ใน PATH | `npm config get prefix` แล้วเติม `<prefix>` ลง PATH |
| `Cannot find module ... cli.js` | PATH ชี้ install ของ Node เวอร์ชันเก่า (mise/nvm) | ติดตั้งซ้ำภายใต้ Node ปัจจุบัน |
| **เคสจริงที่เจอในการพัฒนาคอร์ส:** `type -a claude` พบ **alias ใน `~/.bashrc`** ชี้ cli.js ของ node เวอร์ชันเก่าที่ถูกลบ (mise ลบโฟลเดอร์เก่าหลังอัปเกรด) | alias เก่า override ทุกอย่างใน interactive shell | แก้ alias ใน `~/.bashrc` ให้ชี้ `cli-wrapper.cjs` ของ install ใหม่: `alias claude='node /c/.../npm/node_modules/@anthropic-ai/claude-code/cli-wrapper.cjs'` |
| Login ไม่ผ่าน | นโยบายองค์กร/พร็อกซี | ใช้ token ที่ผู้จัดเตรียม, ตั้ง `ANTHROPIC_BASE_URL` ตามแนวทางผู้ดูแล |
| ขึ้น warning "claude.ai connectors are disabled..." ตอนรัน | เครื่องตั้ง `ANTHROPIC_API_KEY` ไว้ → key มีสิทธิ์สูงกว่า login | **ไม่ใช่ error** — ถ้าอยากใช้ connectors ขององค์กรค่อย unset key |
