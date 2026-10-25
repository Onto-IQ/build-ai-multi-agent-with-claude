> ผู้สอนเท่านั้น ฉบับเต็มก่อนตัดบันทึกการทดสอบ รวม Workflow demo บทเรียนผู้เรียนอยู่ที่ `day-2/07-sequential-orchestration/LESSON.md`

# Module 7 — Orchestration & Sequential Workflows

> **เวลา:** ~60–70 นาที (สอน 25 + Workshop 4 35 + Demo §6 เลือกสอนได้ ~10) | **ผลลัพธ์ที่คาดหวัง:** ผู้เรียนต่อ Agent เป็น pipeline ที่ output ของขั้นก่อนหน้าเป็น input ของขั้นถัดไป ให้ Leader กำกับด้วย Task List และรู้ว่าเมื่อไหร่ควรย้ายแผนไปไว้ในสคริปต์ (Workflow)

## 1. ทำไมต้อง Sequential — ทบทวนด้วยเหตุผล ไม่ใช่ความเชื่อ

จาก Module 1: ขนานได้เฉพาะงานที่ "ไม่ต้องรู้ผลกัน" ในทางกลับกัน **pipeline ซอฟต์แวร์แทบทุกสายต้องต่อคิว**:

```text
Design (สัญญากลาง: สเปก+API) → Implementation (สร้างตามสเปก) → Review (ตรวจกับสเปก)
```

- ด่าน Build ต้องมี design ก่อน — ไม่งั้นเดาเอง
- ด่าน Review ต้องมีโค้ดจริง — ไม่งั้นตรวจอะไร?
- **สัญญากลาง (design doc) คือสิ่งที่ทำให้ด่าน Build ขนานได้ (Frontend/Backend) โดยไม่ชนกัน**

## 2. Leader-first Orchestration — ให้ Leader คุมสถานะ

ใน TUI Leader บริหารงานผ่าน **Task List** ที่ผู้เรียนมองเห็น (⬜ Pending / 🔄 In Progress / ✅ Completed) — โจทย์ที่ดีต้องบังคับให้ Leader โชว์ความคืบหน้า:

```text
Before starting, create a task list for the 3 stages and keep it updated
as you complete each stage. I want to see progress: Pending → In Progress → Completed.
```

("แล้วเห็นพัฒนาการ" = ผู้เรียนมอง task list ไหล ไม่ใช่รอเงียบ ๆ 5 นาที)

## 3. Agent Teams — เมื่ออยากให้ Agent คุยกันเอง

ฟีเจอร์ experimental: เปิดด้วย `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` แล้วสั่งเป็นภาษาธรรมชาติ:

```text
Spawn a team of 3 teammates: one designer, one implementer, one reviewer.
Designer writes the plan first; implementer waits for it; reviewer checks at the end.
```

- Teammates คุยกันผ่าน **SendMessage** + แชร์ Task List (dependency ปลดล็อกอัตโนมัติ)
- **เริ่มที่ 3–5 ตัว** — token โตเป็นเส้นตรงตามจำนวนสมาชิก
- ยัง experimental → ในโปรดักชันจริง ใช้ sequential pipeline แบบทำเองก่อน แล้วค่อยพิจารณาทีม

> **ข้อจำกัดที่ต้องรู้ก่อนใช้** (ตามเอกสารทางการ): สร้าง teammate ได้**เฉพาะ session แบบ interactive** — ใน `-p` แม้เปิด teams ไว้ Claude จะไม่ spawn teammate (subagent ที่ถูกตั้งชื่อจะรันเป็น subagent ปกติ) จึงใช้ใน CI แบบ headless ไม่ได้ · **หนึ่ง session หนึ่งทีม** (ชื่อทีมสร้างอัตโนมัติจาก session ID) · **ทีมซ้อนทีมไม่ได้** — teammate สร้าง teammate ต่อไม่ได้ มี lead เดียวคือ session หลัก · **resume แล้ว teammate ไม่กลับมา** (`/resume` และ `/rewind` ไม่ restore in-process teammates — lead อาจพยายามส่งข้อความหาคนที่ไม่มีแล้ว) · มี hook ประจำทีมสามตัว `TeammateIdle` / `TaskCreated` / `TaskCompleted` — exit code 2 ใช้ปิดกั้น (เช่น ห้ามปิด task จนเทสต์เขียว) แล้วส่ง feedback กลับให้ teammate เป็นคำสั่งทำต่อ (เชื่อม Module 9)

## 4. Prompt ตัวอย่างหลักของ Workshop 4 (Sequential 3 ด่าน)

```text
Work on this demo-shop project in 3 sequential stages. Create a task list first
and keep every stage's status updated while you work.

Stage 1 — Design: write docs/DESIGN.md proposing how to add a POST /api/products
endpoint: request/response JSON shape, validation rules, error codes (404/400/500
separated). Do not write code yet.

Stage 2 — Implement: implement exactly what DESIGN.md specifies in server.js.
No extra features.

Stage 3 — Review: review the new code against DESIGN.md. List any mismatch,
missing validation, or style issue as findings with file:line. Fix nothing.

Rules: each stage reads the previous stage's output. Report a 5-line summary
of what each stage produced.
```

Anatomy:

| ส่วน | ทำหน้าที่ |
|---|---|
| `in 3 sequential stages` + task list | บังคับลำดับ + ความเห็นพัฒนาการ |
| `Do not write code yet` / `Fix nothing` | กันด่านล้ำหน้า (ทุกด่านมีขอบเขตตายตัว) |
| `implement exactly what DESIGN.md specifies` | สัญญากลางคือแหล่งความจริงเดียว |
| `Report a 5-line summary` | คุม output ให้กระชับ |

### เวอร์ชันภาษาไทย (โครงตรงกัน — องค์ประกอบย่อยทดสอบแล้วใน run-011)

```text
ทำงานกับ demo-shop นี้เป็น 3 ด่านต่อเนื่องกัน สร้าง task list ก่อน แล้วอัปเดตสถานะทุกด่านระหว่างทำ

ด่าน 1 — Design: เขียน docs/DESIGN.md เสนอวิธีเพิ่ม POST /api/products: รูปแบบ request/response JSON,
กฎ validation, error codes (แยก 404/400/500) ยังไม่ต้องเขียนโค้ดในด่านนี้

ด่าน 2 — Implement: ลงมือทำตาม DESIGN.md ใน server.js เท่านั้น ห้ามเพิ่มฟีเจอร์เกินสเปก

ด่าน 3 — Review: ตรวจโค้ดใหม่กับ DESIGN.md รายงาน mismatch/ขาด validation/ประเด็นสไตล์
เป็น findings พร้อม file:line ห้ามแก้เอง

กติกา: แต่ละด่านต้องอ่านผลของด่านก่อนหน้า สรุปรายงานด่านละ 5 บรรทัด
```

**ผลจากการทดสอบภาษาไทยกับงานเทคนิค (✅ run-011 — โจทย์ "เขียน test script ตาม DESIGN.md" ภาษาไทย):** Agent อ่านสเปกก่อนลงมือ, **จับข้อขัดแย้งระหว่าง prompt กับสเปก** (สั่งส่ง 2 ฟิลด์ แต่สเปกบังคับ stock) แล้วตัดสินใจฝั่งสเปกพร้อมแจ้งเหตุผล, อ้างมาตรา § ทุก assertion, ทำ **mutation check** พิสูจน์ว่าเทสต์จับของพังได้จริง — ภาษาไทยไม่ลดความสามารถเชื่อมโยงสเปก

## 5. Headless ทดสอบ (✅ tested — runs/module-07/run-005)

```bash
claude -p "<prompt ข้อ 4>" --permission-mode acceptEdits --max-turns 30
```

(`acceptEdits` ให้เขียนไฟล์โค้ด/docs อัตโนมัติ — ระวัง: ไม่คลุม `.claude/**` ดู run-003)

> ⚠️ **ข้อค้นพบจากการรันจริง (run-005):** ใน headless จะ **ปฏิเสธ Bash ทุกคำสั่งโดย default** — Stage Implement ทำได้แค่ "เขียนโค้ดแบบ static" โดยไม่ได้ `node --check`/รันจริง และ Reviewer จะแจ้งเองว่า "not executed" ถ้า lab ของคุณต้องรันคำสัง ให้เพิ่มเช่น `--allowedTools "Bash(node:*)"` **หรือรันใน TUI แล้วกดอนุมัติ** (แนะนำสำหรับผู้เรียน)

## 6. Workflow — ย้ายแผนไปไว้ในสคริปต์ (Guided Demo — เลือกสอนได้ ~10 นาที)

ใน Workshop 4 เราถือแผนด้วย prompt + Task List — Leader เป็นคนจำเองว่าถึงด่านไหน พอสำหรับ pipeline 3 ด่าน แต่ถ้างานใหญ่ขึ้น (หลายสิบ agent, ต้องรันซ้ำเป็นครั้งคราว, มีลูป/เงื่อนไขซ้อนกัน) การให้ LLM จำแผนจะเริ่มหลุด ทางออกของ Claude Code คือ **Workflow** — ย้ายลูปและเงื่อนไขไปไว้ในสคริปต์ JavaScript ที่ runtime รันให้ โครงของงานจึง deterministic ผลระหว่างทางอยู่ในตัวแปร และ Claude เห็นแค่คำตอบสุดท้าย — ไม่ต้องเปิด environment variable ใด ๆ (ต่างจาก Agent Teams หัวข้อ 3) และใช้ได้ใน `-p` เลย (✅ tested — runs/module-07/run-020)

**ทำตาม 10 นาที** — สร้างไฟล์ `labs-sandbox/demo-shop/.claude/workflows/map-and-check.js` (✅ tested — run-020: agent แรกสรุป endpoint ได้ครบ 8 ตัวเป็น JSON, agent ที่สองตรวจแล้วตอบ "ครบทั้ง 8 routes"):

```javascript
export const meta = {
  name: "map-and-check",
  description: "Demo: agent แรกสรุป endpoints ใน server.js แล้ว agent ที่สองตรวจว่าสรุปครบไหม",
  phases: [{ title: "Map" }, { title: "Check" }],
};

phase("Map");
const summary = await agent(
  "อ่านไฟล์ server.js ในโปรเจกต์นี้ แล้วสรุป HTTP endpoint ทั้งหมดเป็น JSON array หนึ่งชุด โดยแต่ละรายการมี method, path, และ does (ทำอะไรหนึ่งประโยค)",
  {
    model: "haiku",
    schema: {
      type: "object",
      properties: {
        endpoints: {
          type: "array",
          items: {
            type: "object",
            properties: { method: { type: "string" }, path: { type: "string" }, does: { type: "string" } },
            required: ["method", "path", "does"],
          },
        },
      },
      required: ["endpoints"],
    },
  }
);

phase("Check");
const check = await agent(
  "อ่านไฟล์ server.js แล้วตรวจว่าสรุป endpoint ชุดนี้ครบถ้วนหรือไม่ ตอบสั้น ๆ: ถ้าตกหล่นบอกว่าตกหล่นอะไร ถ้าครบตอบ OK\nสรุปชุดที่ต้องตรวจ:\n" + JSON.stringify(summary),
  { model: "haiku" }
);
console.log(`สรุปได้ ${summary.endpoints.length} endpoint — ผลตรวจ: ${check}`);
```

แล้วเปิด `claude` ใน demo-shop แล้วพิมพ์ `/map-and-check` (ครั้งแรกจะมีหน้าขออนุมัติรัน workflow) หรือรัน headless: `claude -p "/map-and-check" --permission-mode bypassPermissions` — ⚠️ bypass เฉพาะ sandbox ที่ทิ้งได้เท่านั้น

**สิ่งที่ต้องรู้พอนำไปทำเองต่อ:**

- สคริปต์ต้องมี `export const meta` (name/description/phases) ไม่งั้น validate ไม่ผ่าน — ถ้าให้ Claude เขียนให้ (พิมพ์ว่า "use a workflow ...") มันจะเติมให้เอง
- `agent(prompt, options)` = dispatch หนึ่งตัว คืนข้อความ · ใส่ `schema` เพื่อให้ได้ JSON ตามโครง (แบบในตัวอย่าง) · ใส่ `agentType: "<ชื่อ>"` เพื่อใช้ agent จาก `.claude/agents/` ได้ — body/`tools`/`model` มีผล แต่ skills ไม่ถูก preload (✅ tested — run-015)
- ตัวที่ถูกหยุดหรือล้มหนัก **คืน `null`** — กรอง null ออกก่อนใช้เสมอ ห้ามดึง property จากมัน (workflow ทั้งอันจะพัง)
- ผลระหว่างทางอยู่ในตัวแปรของสคริปต์ ไม่ไหลเข้า context ของ session — Claude เห็นแค่สิ่งที่สคริปต์ `console.log`/return ออกมา
- เมื่อทำงานได้ตามต้องการ เปิด `/workflows` เลือกรอบนั้นแล้วบันทึก — จะเรียกเป็น `/<name>` ได้ใน session ถัดไป
- ⚠️ **ค่าใช้จ่าย/ความปลอดภัย:** workflow ขยายได้ใหญ่ (หลายสิบ agent ต่องานเดียวเป็นเรื่องปกติของ pattern แบบตรวจซ้ำหลายเสียง) — ในงาน headless ที่ไม่มีคนเฝ้า **อย่า allow `Workflow` ทั้ง tool** ให้จำกัดเป็น `Workflow(<ชื่อ> ที่บันทึกไว้)` เท่านั้น (บทเรียนจากการทดลองของแหล่งอ้างอิง + run-015 ของเรา)

คอร์สนี้ตั้งใจสอนแค่พอนำไปทำเองต่อ — pattern ขั้นสูง (pipeline/parallel ซ้อนกัน, resume, `/deep-research`) อ่านต่อได้ที่ docs หน้า workflows

## กับดักที่พบบ่อย

- ไม่บังคับ task list → Leader ทำเงียบ ๆ จบหมด ผู้เรียนไม่เห็นพัฒนาการ
- ไม่ห้าม "Fix nothing" ในด่าน Review → ด่านตรวจแก้โค้ดเอง ทำให้ trace ไม่ได้ว่าใครแก้อะไร
- ปล่อย Stage 1 เขียนสเปกกำกวม → Stage 2 เดา → Review จับ mismatch ได้ (จริง ๆ อันหลังคือ "บทเรียนที่ดี" ให้สอนเรื่องคุณภาพสัญญากลาง)
- **รัน headless แล้วคิดว่า "โค้ดถูกรันทดสอบแล้ว"** → ไม่ใช่! ดู warning "not executed" จาก Reviewer เสมอ (เคสจริง run-005)
