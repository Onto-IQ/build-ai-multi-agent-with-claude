# SETUP — เครื่องใหม่ก่อนวันเรียน

**Windows ใช้ PowerShell เป็นหลัก** (แล็บในคอร์สเขียนแบบ `$env:…` / `$LASTEXITCODE`) · บน macOS / Linux ใช้ Terminal ปกติ · Git Bash เป็นทางเลือก — ถ้าใช้ bash ให้แปลง `$env:VAR` เป็น `export VAR` / `echo $VAR` ตามตารางท้ายไฟล์

## 1. ติดตั้ง Node.js 20 ขึ้นไป และ Git

ตรวจ:

```powershell
node --version
git --version
```

ผลที่คาดหวัง: เลขเวอร์ชันของ Node ขึ้นต้นด้วย `v20`, `v22` หรือ `v24` และ Git พิมพ์ `git version`

ติดตั้งเครื่องมือข้อมูลเพิ่มสองตัว (ใช้ในแล็บข้อมูลจริงตั้งแต่ Workshop 2):

- **DuckDB CLI** — ดาวน์โหลดจาก <https://duckdb.org/docs/install/current-release/> (เลือก windows amd64 หรือ arm64) แตกไฟล์แล้วเอา `duckdb.exe` ให้อยู่บน PATH ตรวจด้วย `duckdb --version`
- **uv** — ตัวรัน MCP ของ DuckDB: `winget install astral-sh.uv` หรือ PowerShell `irm https://astral.sh/uv/install.ps1 | iex` ตรวจด้วย `uvx --version`

ถ้า `node` ไม่พบหลังติดตั้ง ให้ปิดแล้วเปิดเทอร์มินัลใหม่

## 2. ติดตั้ง Claude Code แล้วล็อกอิน

```powershell
npm install -g @anthropic-ai/claude-code
claude --version
```

ผลที่คาดหวัง: เวอร์ชัน **2.1.296 ขึ้นไป** ถ้าต่ำกว่านี้ให้รัน `claude update`

เปิดโหมดโต้ตอบครั้งแรก:

```powershell
claude
```

ล็อกอินผ่านเบราว์เซอร์ด้วยบัญชีที่ผู้จัดให้ พิมพ์ `/status` แล้วออกด้วย `/exit`

ถ้าเคยตั้ง `ANTHROPIC_API_KEY` ไว้ คีย์นี้จะทับการล็อกอินของคลาส และรอบนั้นจะถูกคิดเงินแบบจ่ายตามการใช้ ตรวจแล้วเอาออกจากเซสชันนี้:

```powershell
echo $env:ANTHROPIC_API_KEY
Remove-Item Env:ANTHROPIC_API_KEY -ErrorAction SilentlyContinue
```

ผลที่คาดหวังของบรรทัดแรก: ว่าง

(Git Bash / macOS / Linux: `echo "$ANTHROPIC_API_KEY"` แล้ว `unset ANTHROPIC_API_KEY`)

บน Windows ถ้า `claude` ยังชี้ไปที่ของเก่าหลังอัปเกรด Node ให้ตรวจด้วย `Get-Command claude` (หรือใน Git Bash: `type -a claude`) แล้วติดตั้งใหม่ใต้ Node ตัวที่ใช้อยู่

## 3. โคลนสอง repo แล้วตรวจทั้งก้อน

คอร์สนี้ใช้สอง repo แยกกัน:

```text
<โฟลเดอร์ที่ clone course repo>   ← บทเรียน + สคริปต์ตรวจ (repo นี้)
C:\dev\multi-agent-workshop       ← แอป Registry Insight (ข้อมูลจริงจาก data.go.th) — ที่ที่คุณรัน claude ตลอดคอร์ส
```

```powershell
git clone <url-ของ-course-repo>
cd build-ai-multi-agent-with-claude
git clone <url-ของ-workshop-repo> C:/dev/multi-agent-workshop

# 1) ตรวจที่ workshop (โฟลเดอร์แอป — ไม่สับสนว่าให้รันฝั่งไหน)
cd C:/dev/multi-agent-workshop
npm run verify

# 2) ตรวจครบสอง repo ที่ course (เจอ workshop ตาม WORKSHOP_DIR)
cd <path-to-course-repo>
node scripts/verify-setup.mjs
```

ผลที่คาดหวัง:
- ที่ workshop: `verify-setup (workshop): passed`
- ที่ course: `verify-setup: passed` พร้อม `workshop project found` · พอร์ต 3000 ว่าง · starter gate exit 2

> สคริปต์ชื่อ `verify-setup.mjs` มี**ทั้งสอง repo** — รันในโฟลเดอร์ไหนได้ผลของโฟลเดอร์นั้น

> 📚 **ถ้า download ZIP แทน `git clone` (course repo):** โฟลเดอร์ที่แตกออกมาไม่มี `.git` คำสั่ง `git status` / `git diff` ในแล็บจะขึ้น `fatal: not a git repository` — ทำ snapshot เริ่มต้นหนึ่งครั้งก็ใช้ได้ทั้งคอร์ส:

```powershell
git init
git add -A
git commit -m "start from zip"
```

แนะนำ `git clone` มากกว่า เพราะอัปเดตของคอร์สภายหลังด้วย `git pull` ได้

> 📚 **เก็บ workshop repo ไว้ที่อื่นได้:** ค่าเริ่มต้นของ `catch-up` / `verify-setup` (course) / `check-solutions` คือ `C:\dev\multi-agent-workshop` · ถ้าเก็บคนละที่ ให้ copy `.env.example` → `.env` แล้วแก้ `WORKSHOP_DIR=...` (gitignore แล้ว) หรือตั้ง `$env:WORKSHOP_DIR` ชั่วคราว — แนะนำ path เริ่มต้น เพราะคำสั่งในแล็บ copy-paste ได้ทั้งคอร์ส

ถ้ายังไม่ล็อกอิน Claude — ใส่ `--skip-claude` ได้ทั้งสองฝั่ง:

```powershell
cd C:/dev/multi-agent-workshop
node scripts/verify-setup.mjs --skip-claude

cd <path-to-course-repo>
node scripts/verify-setup.mjs --skip-claude
```

แล้วกลับมาทำขั้นที่ 2 ให้จบก่อน Lab 0

ทดลองโหมดพิมพ์ครั้งเดียว หลังล็อกอินแล้วเท่านั้น:

```powershell
claude -p "Reply with exactly: CLAUDE-OK"
```

ผลที่คาดหวัง: ข้อความ `CLAUDE-OK`

## 4. เปิดแอป — ใน workshop repo

```powershell
cd C:/dev/multi-agent-workshop
npm start
```

เปิด `http://127.0.0.1:3000` ต้องเห็นหน้าแดชบอร์ดชุดเริ่มต้น หยุดเซิร์ฟเวอร์ด้วย Ctrl+C ก่อนรัน quality gate

```powershell
npm run gate
```

ผลที่คาดหวัง: exit code 2 และมีบรรทัด `FAIL | data-quality` นี่คือสถานะตั้งใจของจุดเริ่มต้น ไม่ใช่เครื่องพัง  
(PowerShell ไม่โชว์ exit code เอง — ดูด้วย `echo $LASTEXITCODE`)

ถ้าขึ้น `port 3000 is already in use` แปลว่าเซิร์ฟเวอร์เก่ายังรันอยู่ ปิดมัน หรือรันใหม่ด้วยพอร์ตอื่น:

```powershell
$env:PORT = 3001; npm start
```

(Git Bash / macOS / Linux: `PORT=3001 npm start`)

บน Windows อย่าใช้ `taskkill /IM node.exe` หรือ `taskkill //IM node.exe` เพราะจะฆ่าทุกโปรเซส Node รวมถึงงานอื่น หา PID ของพอร์ตนั้นแล้วปิดเฉพาะตัว

## ปัญหาที่พบบ่อย

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| `claude: command not found` / ไม่รู้จักคำสั่ง | โฟลเดอร์ global ของ npm ไม่อยู่ใน PATH | `npm config get prefix` แล้วเติม bin ของ prefix นั้นเข้า PATH จากนั้นเปิดเทอร์มินัลใหม่ |
| `Cannot find module ... cli.js` | PATH หรือ alias ชี้ install เก่า | ติดตั้งซ้ำด้วย Node ตัวปัจจุบัน แล้วตรวจ `Get-Command claude` |
| port 3000 busy (port busy) | มีเซิร์ฟเวอร์ค้าง | Ctrl+C ในเทอร์มินัลนั้น หรือ `$env:PORT = 3001; npm start` |
| `verify-setup` FAIL: workshop project not found | ยังไม่ได้ clone workshop repo หรือเก็บคนละ path | clone ตามขั้นที่ 3 หรือตั้ง `$env:WORKSHOP_DIR` ชี้โฟลเดอร์ที่ clone ไว้แล้วรันใหม่ |
| ล็อกอินแล้วแต่ถูกคิดเงินรายครั้ง | `ANTHROPIC_API_KEY` ยังอยู่ | `Remove-Item Env:ANTHROPIC_API_KEY` แล้วเปิด `claude` ใหม่ |
| คำสั่ง `mkdir -p` / `export` / `echo $VAR` พัง | วาง syntax bash ใน PowerShell | ใช้คำสั่ง PowerShell ในไฟล์นี้ · หรือเปิด Git Bash แล้วใช้ตารางแปลงด้านล่าง |
| `PORT=3001` is not recognized | syntax bash ใน PowerShell | `$env:PORT = 3001; npm start` |

## แปลงคำสั่งสั้น ๆ (ถ้าใช้ Git Bash / macOS / Linux)

| PowerShell (หลักในคอร์ส) | Bash |
|---|---|
| `echo $env:ANTHROPIC_API_KEY` | `echo "$ANTHROPIC_API_KEY"` |
| `Remove-Item Env:ANTHROPIC_API_KEY` | `unset ANTHROPIC_API_KEY` |
| `$env:PORT = 3001; npm start` | `PORT=3001 npm start` |
| `echo $LASTEXITCODE` | `echo $?` |
| `$env:WORKSHOP_DIR = "D:\path"` | `export WORKSHOP_DIR=/path` |

## สิ่งที่สคริปต์นี้ยังไม่ตรวจ

การพิมพ์ใน TUI, hook ที่ Claude Code เรียกเอง, การ deploy ขึ้น Vercel และเครื่อง macOS ต้องเดินด้วยคน รายการนี้เขียนไว้ท้าย [README.md](README.md)
