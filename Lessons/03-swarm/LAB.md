# Workshop 1 — สำรวจแบบขนาน: Explore + Agent Teams

> ⏱ machine ~10–12 นาที (Part A ~4 + Part B ~6–8) · Start state: starter quality gate ยัง exit 2

## Goal / เป้าหมาย

ได้รายงานสำรวจจาก **Explore swarm** แล้วให้ **Agent Teams** ท้าทายและคัดความเสี่ยงก่อนส่งต่อ planner — ทั้งสองรอบห้ามแก้ไฟล์แอป

---

## Part A — Explore swarm (subagents)

### เป้าหมายส่วนนี้

ได้รายงานเดียวจาก prompt เดียว ครบโครงสร้าง คุณภาพข้อมูล และจุดเสี่ยง

### ขั้นตอน

1. เข้า workshop repo `C:\dev\multi-agent-workshop` แล้วเปิด TUI

```bash
claude
```

2. วาง prompt ทั้งชุด ครั้งเดียว (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Dispatch 3 parallel Explore subagents on this Registry Insight app.
1) Map the runtime files and how to start the server.
2) Read data/README.md and the failure text from npm run gate. Do not fix anything.
3) Trace GET /api/summary and POST /api/notes far enough to name the risky behavior.
Do not modify files. Return one report under 300 words with headings: structure, data quality, risks.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ส่ง Explore subagent 3 ตัวทำพร้อมกันในแอป Registry Insight
1) แผนที่ไฟล์ที่ใช้รัน และวิธียกเซิร์ฟเวอร์
2) อ่าน data/README.md และข้อความ FAIL จาก npm run gate ห้ามแก้
3) ไล่ GET /api/summary กับ POST /api/notes พอให้ชี้พฤติกรรมที่เสี่ยง
ห้ามแก้ไขไฟล์ ส่งรายงานเดียวไม่เกิน 300 คำ มีหัวข้อ โครงสร้าง, คุณภาพข้อมูล, จุดเสี่ยง
```

ผลที่คาดหวัง: leader เรียกเอเจนต์ย่อยมากกว่าหนึ่งตัว แล้วตอบรายงานเดียวที่มีสามหัวข้อ ระบุ `server.js`, `data/dataset.csv`, `scripts/quality-gate.js` และพูดถึง `POST /api/notes` กับ `GET /api/summary`

3. ให้รายงานกลายเป็นไฟล์ — วาง prompt (เลือกอย่างใดอย่างหนึ่ง): เพราะ Workshop 3 จะให้ planner อ่านไฟล์นี้ต่อ

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Write the final report to docs/EXPLORATION-REPORT.md with headings: structure, data quality, risks. Each risk must cite file:line.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
เขียนรายงานฉบับสุดท้ายลง docs/EXPLORATION-REPORT.md มีหัวข้อ โครงสร้าง, คุณภาพข้อมูล, จุดเสี่ยง ทุกจุดเสี่ยงต้องอ้าง file:line
```

📦 **Handoff ที่ 1 ของคอร์ส:** รายงานของทีมสำรวจ กลายเป็นไฟล์ที่ planner ใน Workshop 3 ต้องอ่านต่อ

> 📚 **รู้เพิ่ม:** จุดของ prompt เดียวคือให้ leader แตกงานเอง — สามก้อนอ่านไฟล์คนละชุดจึงวิ่งขนานได้ และสิ่งที่กลับมาหาคุณเป็นแค่บทสรุป ไม่ใช่เนื้อไฟล์เต็ม บทสนทนาหลักจึงยังเบาพอคุยงานต่อ

4. ออกจาก TUI แล้วตรวจว่าไม่มีไฟล์แอปถูกแก้ — workshop repo เป็น repo จาก `git clone` จึงใช้ git ตรวจได้

```bash
git status --short
```

ผลที่คาดหวัง: เห็นเฉพาะ `?? docs/EXPLORATION-REPORT.md` (หรือไฟล์ docs ที่คุณสั่งเขียน) — ไฟล์แอปอื่นทุกไฟล์ไม่ถูกแก้

5. รัน quality gateเองในเทอร์มินัล อย่าให้เอเจนต์รันแทนในรอบนี้

```bash
npm run gate
```

ผลที่คาดหวัง: ยังเป็น exit 2

> 📚 **รู้เพิ่ม:** รัน gate ด้วยมือคุณเอง ไม่ให้เอเจนต์รันแทน — รอบสำรวจยังไม่ให้สิทธิ์รันคำสั่ง และนี่คือนิสัยที่ใช้จนจบคอร์ส: หลักฐานผ่าน/ไม่ผ่านต้องมาจากเทอร์มินัลของคุณ ไม่ใช่คำบอกของเอเจนต์

### ✅ Checkpoint Part A

- [ ] ใช้ prompt เดียว ไม่ได้ถามทีละชิ้นงานสามรอบ
- [ ] รายงานมีสามหัวข้อและไม่ยาวจนอ่านในห้านาทีไม่จบ
- [ ] ระบุอย่างน้อยสองเส้นทางคือ `/api/summary` และ `/api/notes`
- [ ] `git status` ไม่มีความแก้จากเอเจนต์ในไฟล์แอป
- [ ] quality gate ยังแดง

---

## Part B — Agent Teams (experimental · แล็บจริง)

> ส่วนนี้เป็นแล็บบังคับ ไม่ใช่แค่สาธิตผู้สอน — สปอนเซอร์คลาสรองรับ token ของทีม (~15× แชทเดียว)

### เป้าหมายส่วนนี้

เปิด Agent Teams แล้วให้เพื่อนทีม **คุยกันเอง + ใช้รายการงานร่วม** เพื่อท้าทายรายงานจาก Part A แล้วเขียน `docs/TEAMS-REVIEW.md`

### ขั้นตอน

1. **ปิด TUI รอบ Part A ถ้ายังเปิดอยู่** แล้วเปิด flag เฉพาะเซสชันนี้ (PowerShell):

```powershell
$env:CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = "1"
cd C:\dev\multi-agent-workshop
claude
```

> ต้องเป็น TUI เท่านั้น — โหมด `claude -p` ไม่สร้าง teammate แม้เปิด flag แล้ว

2. วาง prompt ทั้งชุด ครั้งเดียว (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Enable an agent team (not Explore subagents). Spawn exactly 3 named teammates:
- structure-scout — verifies runtime layout claims in docs/EXPLORATION-REPORT.md
- data-scout — verifies data-quality claims against data/README.md and gate FAIL text
- devil-advocate — challenges every risk; looks for overstated or missing risks

Use a shared task list. Teammates must message each other at least once before the lead synthesizes.
Do not modify application files.
Write docs/TEAMS-REVIEW.md with headings: agreement, disputed, next sequential step.
Keep the whole file under 250 words. Cite file:line for disputed items.
When finished, ask all teammates to shut down.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
ใช้ Agent Teams (ไม่ใช่ Explore subagent) สร้าง teammate ชื่อชัดเจน 3 ตัว:
- structure-scout — ตรวจข้ออ้างเรื่องโครงสร้างใน docs/EXPLORATION-REPORT.md
- data-scout — ตรวจข้ออ้างคุณภาพข้อมูลกับ data/README.md และข้อความ FAIL ของ gate
- devil-advocate — ท้าทายทุกจุดเสี่ยง หาข้อที่พูดเกินหรือขาด

ใช้รายการงานร่วม Teammate ต้องส่งข้อความหากันอย่างน้อยหนึ่งครั้งก่อนที่ lead จะสรุป
ห้ามแก้ไฟล์แอป
เขียน docs/TEAMS-REVIEW.md มีหัวข้อ: agreement, disputed, next sequential step
ทั้งไฟล์ไม่เกิน 250 คำ ข้อ disputed ต้องอ้าง file:line
จบแล้วให้ teammate ทุกตัว shut down
```

ผลที่คาดหวัง:

- แผงเอเจนต์มี teammate ชื่อ (ไม่ใช่แค่ Explore นิรนามสามตัว)
- มี shared task list (Ctrl+T ใน TUI ถ้าต้องการเปิดดู)
- ได้ `docs/TEAMS-REVIEW.md` สามหัวข้อ และ teammate ถูกสั่งปิด

3. ออกจาก TUI แล้ว **ปิด flag** เพื่อไม่ให้แล็บถัดไปกลายเป็น teammate โดยไม่ตั้งใจ:

```powershell
Remove-Item Env:CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS -ErrorAction SilentlyContinue
```

4. ตรวจไฟล์:

```bash
git status --short
```

ผลที่คาดหวัง: มี `docs/EXPLORATION-REPORT.md` และ `docs/TEAMS-REVIEW.md` — ไม่มี diff ใน `server.js` / `web/` / `scripts/` จากสองรอบนี้

> 📚 **รู้เพิ่ม:** Part A = subagent ส่งสรุปกลับ lead อย่างเดียว · Part B = teammate มี mailbox + รายการงานร่วม จึงท้าทายกันได้โดยไม่ให้คุณเป็นคนกลางทุกข้อความ — นี่คือเหตุผลที่เปิด Teams หลังมีรายงานสำรวจแล้ว ไม่ใช่แทนที่ Explore

### ✅ Checkpoint Part B

- [ ] ตั้ง `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` ก่อนเปิด `claude`
- [ ] prompt ระบุ **agent team** / teammate ชื่อชัดเจน (ไม่สั่งแค่ Explore)
- [ ] มี `docs/TEAMS-REVIEW.md` ครบสามหัวข้อ agreement / disputed / next sequential step
- [ ] ปิด flag หลังจบ Part B
- [ ] ไฟล์แอปยังไม่ถูกแก้

---

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ได้แผน แต่ไม่ได้รายงาน | prompt ไม่ได้สั่งให้ทำตอนนี้ | เติมว่าให้ส่งเอเจนต์ย่อยจริง ไม่ใช่แค่เสนอแผน |
| ไฟล์ถูกแก้ | ไม่มีประโยคห้ามแก้ | `git checkout -- .` ในแอปถ้าคุณยังไม่ต้องการของนั้น แล้วสั่งใหม่ |
| `claude -p` ไม่ยอมรัน quality gate | headless ปิด Bash เป็นค่าเริ่มต้น | รัน `npm run gate` เองในเทอร์มินัลที่ workshop repo |
| หมดเทิร์น | `--max-turns` ต่ำไป | อยู่ใน TUI หรือใส่ `--max-turns 20` เฉพาะตอน headless (Part A เท่านั้น) |
| สำรวจผิดโฟลเดอร์ | เปิด `claude` นอก workshop repo | ออกแล้วเปิดใหม่ที่ `C:\dev\multi-agent-workshop` |
| port busy ตอนรัน quality gate | เซิร์ฟเวอร์ค้าง | ปิดก่อน หรือตั้ง `PORT` |
| Part B ได้แค่ Explore ไม่มี teammate | ไม่ได้เปิด flag หรือ prompt ไม่พูดว่า agent team | ออก TUI → ตั้ง env → เปิดใหม่ → สั่งชัดว่าต้องการ agent team |
| Part B ใช้ `-p` แล้วไม่มีทีม | teammate ต้องใช้ TUI | ใช้ `claude` แบบโต้ตอบเท่านั้น |
| แล็บหลัง Part B แตกเป็น teammate เอง | ลืมปิด flag | `Remove-Item Env:CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` |

## 🆘 Behind? Catch up

จาก course repo (สคริปต์จะ copy ผลลง workshop repo ให้):

```bash
node scripts/catch-up.js w1
```

แล้วอ่าน `docs/EXPLORATION-REPORT.md` และ `docs/TEAMS-REVIEW.md` ใน workshop repo

## Stretch / ต่อยอด

- Part A: เปลี่ยนก้อนที่ 3 เป็นคำถามว่าถ้าจะเพิ่มหน้า "ยอดรายจังหวัด" ต้องแตะไฟล์ใดบ้าง โดยยังห้ามแก้ไฟล์
- Part B: ให้ devil-advocate เสนอสมมติฐานบั๊กแข่งกันสองข้อ แล้วให้ทีมเลือกข้อที่ควรไล่ก่อนใน Workshop 3

## Solution → solutions/w1/

รายงานอ้างอิงอยู่ที่ `solutions/w1/drop-in/docs/` ตรวจด้วย `node solutions/w1/check.js` (จาก course repo)
