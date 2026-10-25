# SETUP — เครื่องใหม่ก่อนวันเรียน

ใช้ Git Bash บน Windows ใช้ Terminal บน macOS อย่าเอาคำสั่งในไฟล์นี้ไปวางใน PowerShell 5.1

## 1. ติดตั้ง Node.js 20 ขึ้นไป และ Git

ตรวจ:

```bash
node --version
git --version
```

ผลที่คาดหวัง: เลขเวอร์ชันของ Node ขึ้นต้นด้วย `v20`, `v22` หรือ `v24` และ Git พิมพ์ `git version`

ถ้า `node` ไม่พบหลังติดตั้ง ให้ปิดแล้วเปิดเทอร์มินัลใหม่

## 2. ติดตั้ง Claude Code แล้วล็อกอิน

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

ผลที่คาดหวัง: เวอร์ชัน **2.1.296 ขึ้นไป** ถ้าต่ำกว่านี้ให้รัน `claude update`

เปิดโหมดโต้ตอบครั้งแรก:

```bash
claude
```

ล็อกอินผ่านเบราว์เซอร์ด้วยบัญชีที่ผู้จัดให้ พิมพ์ `/status` แล้วออกด้วย `/exit`

ถ้าเคยตั้ง `ANTHROPIC_API_KEY` ไว้ คีย์นี้จะทับการล็อกอินของคลาส และรอบนั้นจะถูกคิดเงินแบบจ่ายตามการใช้ ตรวจแล้วเอาออกจากเซสชันนี้:

```bash
echo "$ANTHROPIC_API_KEY"
unset ANTHROPIC_API_KEY
```

ผลที่คาดหวังของบรรทัดแรก: ว่าง

บน Windows ถ้า `claude` ยังชี้ไปที่ของเก่าหลังอัปเกรด Node ให้รัน `type -a claude` ใน Git Bash ถ้าเจอ alias ใน `~/.bashrc` ที่ชี้ไฟล์ซึ่งไม่มีอยู่แล้ว ให้แก้ alias หรือติดตั้งใหม่ใต้ Node ตัวที่ใช้อยู่

## 3. โคลน repo แล้วตรวจทั้งก้อน

```bash
git clone <url-ของ-repo-นี้>
cd build-ai-multi-agent-with-claude
node scripts/verify-setup.mjs
```

ผลที่คาดหวัง: บรรทัด `verify-setup: passed` พอร์ต 3000 ว่าง หน้าแอปตอบได้ และstarter quality gateเป็น exit 2

ถ้ายังไม่ล็อกอิน Claude:

```bash
node scripts/verify-setup.mjs --skip-claude
```

แล้วกลับมาทำขั้นที่ 2 ให้จบก่อน Lab 0

ทดลองโหมดพิมพ์ครั้งเดียว หลังล็อกอินแล้วเท่านั้น:

```bash
claude -p "Reply with exactly: CLAUDE-OK"
```

ผลที่คาดหวัง: ข้อความ `CLAUDE-OK`

## 4. เปิด sandbox

```bash
cd sandbox/sales-insight
node server.js
```

เปิด `http://127.0.0.1:3000` ต้องเห็นหน้าแดชบอร์ดชุดเริ่มต้น หยุดเซิร์ฟเวอร์ด้วย Ctrl+C ก่อนรัน `node scripts/quality-gate.js`

```bash
node scripts/quality-gate.js
```

ผลที่คาดหวัง: exit code 2 และมีบรรทัด `FAIL | data-quality` นี่คือสถานะตั้งใจของจุดเริ่มต้น ไม่ใช่เครื่องพัง

ถ้าขึ้น `port 3000 is already in use` แปลว่าเซิร์ฟเวอร์เก่ายังรันอยู่ ปิดมัน หรือรันใหม่ด้วยพอร์ตอื่น:

```bash
PORT=3001 node server.js
```

บน Windows อย่าใช้ `taskkill //IM node.exe` เพราะจะฆ่าทุกโปรเซส Node รวมถึงงานอื่น หา PID ของพอร์ตนั้นแล้วปิดเฉพาะตัว

## ปัญหาที่พบบ่อย

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| `claude: command not found` | โฟลเดอร์ global ของ npm ไม่อยู่ใน PATH | `npm config get prefix` แล้วเติม bin ของ prefix นั้นเข้า PATH จากนั้นเปิดเทอร์มินัลใหม่ |
| `Cannot find module ... cli.js` | PATH หรือ alias ชี้ install เก่า | ติดตั้งซ้ำด้วย Node ตัวปัจจุบัน แล้วตรวจ `type -a claude` |
| port 3000 busy (port busy) | มี `node server.js` ค้าง | Ctrl+C ในเทอร์มินัลนั้น หรือใช้ `PORT` อื่น |
| ล็อกอินแล้วแต่ถูกคิดเงินรายครั้ง | `ANTHROPIC_API_KEY` ยังอยู่ | `unset ANTHROPIC_API_KEY` แล้วเปิด `claude` ใหม่ |
| คำสั่ง `mkdir -p` หรือ `echo $VAR` พัง | อยู่ใน PowerShell | เปิด Git Bash |

## สิ่งที่สคริปต์นี้ยังไม่ตรวจ

การพิมพ์ใน TUI, hook ที่ Claude Code เรียกเอง, การ deploy ขึ้น Vercel และเครื่อง macOS ต้องเดินด้วยคน รายการนี้เขียนไว้ท้าย [README.md](README.md)
