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

5. รัน quality gateเองในเทอร์มินัล อย่าให้เอเจนต์รันแทนในรอบนี้ — แล้วพิมพ์ exit code ให้เห็นชัด (PowerShell ไม่โชว์เองหลังคำสั่ง):

```powershell
npm run gate
echo $LASTEXITCODE
```

ผลที่คาดหวัง: บรรทัดสุดท้ายเป็น `2` — แปลว่า quality gate **ไม่ผ่านตามที่ออกแบบ** (ยังมี FAIL) ไม่ใช่คำสั่งพัง · ผ่านแล้วจะเป็น `0`

> 📚 **รู้เพิ่ม:** รัน gate ด้วยมือคุณเอง ไม่ให้เอเจนต์รันแทน — รอบสำรวจยังไม่ให้สิทธิ์รันคำสั่ง และนี่คือนิสัยที่ใช้จนจบคอร์ส: หลักฐานผ่าน/ไม่ผ่านต้องมาจากเทอร์มินัลของคุณ ไม่ใช่คำบอกของเอเจนต์

### ✅ Checkpoint Part A

- [ ] ใช้ prompt เดียว ไม่ได้ถามทีละชิ้นงานสามรอบ
- [ ] รายงานมีสามหัวข้อและไม่ยาวจนอ่านในห้านาทีไม่จบ
- [ ] ระบุอย่างน้อยสองเส้นทางคือ `/api/summary` และ `/api/notes`
- [ ] `git status` ไม่มีความแก้จากเอเจนต์ในไฟล์แอป
- [ ] `echo $LASTEXITCODE` ได้ `2` หลัง `npm run gate` (ยังแดงตามดีไซน์)

---

## Part B — Agent Teams (เปิดโหมดทีม)

> ส่วนนี้ทำทุกคน — ไม่ใช่แค่ดูผู้สอนสาธิต · คลาสมีสปอนเซอร์รองรับค่าใช้จ่ายของทีม (แพงกว่าคุยคนเดียวประมาณ 15 เท่า)

### เป้าหมายส่วนนี้

เปิดโหมด **Agent Teams** ให้ Claude สร้างเพื่อนทีม 3 คนที่**คุยกันเองได้** และมี**รายการงานร่วม** แล้วให้พวกเขาช่วยท้าทายรายงานจาก Part A จากนั้นเขียนไฟล์ `docs/TEAMS-REVIEW.md`

### ขั้นตอน

1. **ปิดหน้าต่าง `claude` ของ Part A** (พิมพ์ `/exit` หรือปิดหน้าต่าง) — ต้องปิดก่อน เพราะเราจะเปลี่ยนไฟล์ตั้งค่าแล้วเปิดใหม่

2. **สร้างไฟล์ตั้งค่าบนเครื่องคุณ** เพื่อเปิดโหมดทีม

เปิดโฟลเดอร์ `C:\dev\multi-agent-workshop` ใน Cursor หรือ VS Code แล้วสร้างไฟล์ชื่อนี้เป๊ะ ๆ:

`.claude/settings.local.json`

(โฟลเดอร์ `.claude` น่าจะมีอยู่แล้วจาก `/init` · ถ้ายังไม่มี ให้สร้างโฟลเดอร์ `.claude` ก่อน แล้วค่อยสร้างไฟล์)

**คัดลอกทั้งก้อนด้านล่าง** ไปวางในไฟล์นั้น แล้วบันทึก (Save) — อย่าพิมพ์เองทีละตัว กันพิมพ์ผิด:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "CLAUDE_CODE_MAX_TURNS": "20"
  }
}
```

> 📚 **Note — ไฟล์นี้คืออะไร (อ่านก่อนทำต่อ):**  
> - บรรทัดแรก (`...AGENT_TEAMS` = `"1"`) = **เปิดโหมดทีม**  
> - บรรทัดที่สอง (`...MAX_TURNS` = `"20"`) = **เพดานทำงานไม่เกิน 20 รอบ** กันทีมวิ่งยาวเกินโดยไม่จำเป็น  
> - ไฟล์ชื่อมีคำว่า **`local`** = **ของเครื่องคุณคนเดียว** ไม่ใช่ไฟล์ที่ต้องส่งให้เพื่อนหรืออัปโหลดขึ้น git  
> - คิดง่าย ๆ เหมือน **โน้ตติดตู้เย็นของเครื่องคุณ** ที่ Claude อ่านทุกครั้งตอนเปิด `claude` — โน้ตนี้**ไม่หายเอง** แม้คุณปิดหน้าต่างเทอร์มินัลแล้ว ต้องถอดออกเองทีหลัง  
> - อย่าสับสนกับไฟล์ `settings.json` (ไม่มีคำว่า local) — อันนั้นอาจเป็นของโปรเจกต์ร่วม · ของเรารอบนี้ใช้เฉพาะ **`settings.local.json`**

3. เปิด `claude` ใหม่จากโฟลเดอร์แอป (หลังบันทึกไฟล์แล้วเท่านั้น):

```powershell
cd C:\dev\multi-agent-workshop
claude
```

> ใช้หน้าจอโต้ตอบ `claude` ตามปกติ — **อย่า** ใช้คำสั่ง `claude -p "..."` ใน Part นี้ เพราะโหมดทีมจะไม่ทำงาน

4. วาง prompt ทั้งชุด ครั้งเดียว (เลือกอย่างใดอย่างหนึ่ง):

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

- ด้านล่างหน้าจอมีชื่อเพื่อนทีม (เช่น structure-scout) ไม่ใช่แค่ Explore ธรรมดาสามตัวไม่มีชื่อ
- ได้ไฟล์ `docs/TEAMS-REVIEW.md` มีสามหัวข้อ และเพื่อนทีมถูกสั่งปิดงานแล้ว

5. ออกจาก `claude` แล้ว **ถอดโน้ตออก** — ขั้นนี้ต้องทำ ไม่ใช่ทางเลือก:

ใน Cursor/VS Code ไปที่ไฟล์ `.claude/settings.local.json` แล้ว **ลบทั้งไฟล์** (คลิกขวา → Delete)  
ถ้ารอบนี้คุณวางแค่ข้อความตามด้านบนทั้งก้อน การลบทั้งไฟล์คือวิธีที่ง่ายและถูกต้องที่สุด

ตรวจว่าไม่มีไฟล์นี้แล้ว: ในแถบไฟล์ด้านซ้าย ไม่ควรเห็น `settings.local.json` ใต้โฟลเดอร์ `.claude`

> 📚 **ทำไมต้องถอดออก:** ถ้าทิ้งไฟล์นี้ไว้ Claude จะยังคิดว่า “เปิดโหมดทีมอยู่” ในรอบถัดไป — งาน Workshop ถัดไปอาจกลายเป็นทีมใหญ่โดยที่คุณไม่ได้ขอ และห้องจะเทียบผลกันยาก

6. ตรวจว่าแอปไม่ถูกแก้:

```powershell
git status --short
```

ผลที่คาดหวัง: เห็นไฟล์รายงานใน `docs/` ที่คุณสั่งเขียน — **ไม่** ควรเห็นการแก้ `server.js` หรือไฟล์ใน `web/` / `scripts/`  
ถ้ายังเห็นชื่อ `settings.local.json` ในรายการนี้ **อย่า** รัน `git add` / commit ไฟล์นั้น (มันเป็นของเครื่องคุณ)

> 📚 **รู้เพิ่ม:** Part A = ผู้ช่วยสำรวจส่งสรุปกลับหัวหน้าอย่างเดียว · Part B = เพื่อนทีมคุยกันเองได้และมีรายการงานร่วม จึงท้าทายรายงานกันได้โดยคุณไม่ต้องเป็นคนส่งข้อความทุกครั้ง

### ✅ Checkpoint Part B

- [ ] สร้างไฟล์ `.claude/settings.local.json` ตามตัวอย่าง แล้ว Save ก่อนเปิด `claude`
- [ ] บอกได้ว่าไฟล์นี้เป็น **ของเครื่องคุณคนเดียว** (มีคำว่า local) และต้องถอดออกเอง
- [ ] ใน prompt มีคำว่า agent team / teammate และตั้งชื่อเพื่อนทีมสามคน
- [ ] มีไฟล์ `docs/TEAMS-REVIEW.md` ครบหัวข้อ agreement / disputed / next sequential step
- [ ] **ลบ** `settings.local.json` แล้ว หลังจบ Part B
- [ ] ไฟล์แอป (`server.js` ฯลฯ) ยังไม่ถูกแก้

---

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ได้แผน แต่ไม่ได้รายงาน | prompt ไม่ได้สั่งให้ทำตอนนี้ | เติมว่าให้ส่งเอเจนต์ย่อยจริง ไม่ใช่แค่เสนอแผน |
| ไฟล์ถูกแก้ | ไม่มีประโยคห้ามแก้ | `git checkout -- .` ในแอปถ้าคุณยังไม่ต้องการของนั้น แล้วสั่งใหม่ |
| `claude -p` ไม่ยอมรัน quality gate | headless ปิด Bash เป็นค่าเริ่มต้น | รัน `npm run gate` เองในเทอร์มินัลที่ workshop repo |
| หมดเทิร์นกลางคัน (Part B) | เพดาน 20 รอบพอดีกับงานสั้น — ถ้ารอบนี้จบไม่ทัน | ตรวจว่า prompt สั้นชัด · หรือชั่วคราวเพิ่ม `"CLAUDE_CODE_MAX_TURNS": "30"` ในไฟล์แล้วเปิด `claude` ใหม่ · จบแล็บแล้วลบไฟล์ตามเดิม |
| สำรวจผิดโฟลเดอร์ | เปิด `claude` นอก workshop repo | ออกแล้วเปิดใหม่ที่ `C:\dev\multi-agent-workshop` |
| port busy ตอนรัน quality gate | เซิร์ฟเวอร์ค้าง | ปิดก่อน หรือตั้ง `PORT` |
| Part B ได้แค่ Explore ไม่มีเพื่อนทีมชื่อ | ยังไม่มีไฟล์ตั้งค่า / ลืม Save / เปิด `claude` ก่อนสร้างไฟล์ / prompt ไม่พูดว่า agent team | ปิด `claude` → ตรวจว่ามีไฟล์และ Save แล้ว → เปิดใหม่ → สั่งชัดว่าต้องการ agent team |
| ใช้ `claude -p` แล้วไม่มีทีม | โหมดทีมต้องเปิดหน้าจอโต้ตอบ | ใช้คำสั่ง `claude` อย่างเดียว |
| แล็บหลัง Part B ยังเป็นทีมใหญ่เอง | ลืมลบ `settings.local.json` | ลบไฟล์นั้น แล้วเปิด `claude` ใหม่ |

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
