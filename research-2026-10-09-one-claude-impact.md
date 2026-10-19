# รายงานทีมวิจัย: ผลกระทบจากการรวม Cowork เข้า Chat ("one Claude") และทิศทางหลักสูตร VIBE-CODE-L2

**วันที่:** 2026-10-09 · **สถานะ:** ✅ ผ่านการซักค้าน (2 รอบ, ปิดข้อกังวลครบ 9/9 — ดู §9)

**องค์ประกอบทีมวิจัยและเกต:** (1) Course Material Analyst — สแกน repo ทั้งหมด (2) External Landscape Researcher — สำรวจข่าว/เอกสารทางการ (3) Curriculum Strategist — วิเคราะห์ทางเลือก (4) **Cross-examiner (นักซักค้าน)** — ตรวจสอบย้อนหลังทุกข้ออ้าง ทั้งใน repo และเว็บ มีอำนาจ **ไม่ปล่อยผ่าน** จนกว่าข้อกังวลทุกข้อจะถูกปิด — รอบ 1 ให้ FAIL (9 ข้อ) รอบ 2 ให้ PASS (0 ข้อคงค้าง)

---

## 1. คำตอบสั้น (TL;DR)

ข่าวจริง ยืนยันจากแหล่งทางการแล้ว — Anthropic รวม Cowork เข้ากับ chat เป็น "one Claude" (~16 ก.ย. 2026) **แต่ฝั่ง Claude Code CLI ไม่กระทบ** ตรงตามสมมติฐานเจ้าของหลักสูตร หลักสูตรเรา**ไม่มีเนื้อหา Cowork ให้แก้เลยแม้แต่จุดเดียว** (ตรวจด้วย find-based sweep ครอบทั้ง tracked/untracked = 0 hit) สิ่งที่ต้องทำจึงไม่ใช่ "ซ่อมของเสีย" แต่คือ **patch ความถูกต้อง 3 จุด + ยกระดับ positioning ให้ทันกระแส** คำแนะนำ: **ทาง B — patch + repositioning เบา (~3.5–4 person-days)** พร้อมปิด "หนี้เก่า" 1 อย่างที่ซักค้านจับได้ (module-11 deploy ไม่เคยทดสอบจริง)

---

## 2. สิ่งที่ตรวจสอบพบ

### [ยืนยันทางการ] การรวม Cowork เข้า chat — "one Claude" (~16 ก.ย. 2026)
- ไม่มี mode tabs อีกต่อไป — Claude เลือกเองว่าจะตอบเร็วหรือรันงานแบบ agentic เต็มรูปแบบจากบทสนทนาเดียว
- Rollout: Pro/Max ก่อน ("next few weeks"), Team/Free ตามมา "soon", Enterprise = public beta ปิดเป็น default (admin ได้แจ้งล่วงหน้า ≥30 วัน) · **สลับกลับไม่ได้**
- **แท็บ "Code" และ model picker คงเดิม** (อ้างอิง: support.claude.com/en/articles/16761823 — blog ไม่ได้พูดถึงจุดนี้)
- ของเดิมยกไปใช้ต่อได้: projects, connectors, skills, artifacts; instructions ระดับ Cowork ย้ายไป Settings > General "Instructions for Claude"; auto web search (ตัด toggle); Deep Research ผ่าน `/deep-research`; scheduled/recurring tasks; check-in แบบ Manual (default) / Auto
- Claude Docs & Slides (beta ณ ประกาศ 16 ก.ย. — มีรายงาน ~8 ต.ค. ว่าขยายถึงทุกแผน; ตรวจซ้ำตอนพิมพ์จริงตามข้อ 9c)

### [ยืนยันทางการ] Claude Code CLI ไม่กระทบ
- สาย 2.1.x พัฒนาต่อเนื่อง: 2.1.287 (1 ต.ค.) → 2.1.295 (8 ต.ค.) + hooks/MCP/Claude Mods หลายรอบ — ฐาน positioning ที่พิสูจน์ได้อิสระจาก changelog ทางการ (code.claude.com/docs/en/changelog)
- Agent Teams: **ยังเป็น experimental** — banner ทางการระบุ "Agent teams are experimental and disabled by default" เปิดด้วย `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` → label "(experimental)" ใน material ของเรา **ถูกอยู่แล้ว** (เอกสารทางการ: code.claude.com/docs/en/agent-teams, ตรวจ 2026-10-09)
- โมเดลเป็นตระกูล 5.5 แล้ว (Opus/Sonnet/Haiku 5.5) แต่ aliases (`sonnet`/`haiku`/`opus`) ยัง resolve ปกติ — เนื้อหาเราใช้ aliases ล้วน จึงไม่มีปัญหาค้างเวอร์ชัน

### [ตรวจแล้วใน repo] ผลกระทบต่อหลักสูตร
- **"Cowork" = 0 hit ทั้ง repo** (ครอบทั้ง tracked/untracked); "desktop" โผล่ 3 ไฟล์ตรงเป้าแก้พอดี (rev1:49, internal:54, .gitignore[Desktop.ini — false positive])
- แกนหลัก 11 modules / 6 workshops ใช้ Claude Code CLI ล้วน (transcripts จริงใน `runs/` บน claude 2.1.284) — **ไม่กระทบจาก merge เลย**
- จุดกระทบจริง = ความถูกต้องสะสม 3 จุด: (ก) env requirements ใน outline ทั้ง 2 ฉบับ (ข) module-01 §2 "แผนที่ Multi-Agent ปี 2026" ไม่มี one-Claude map (ค) module-11 deploy surface กำกวม + ไม่เคยทดสอบ (§4)

### [รายงานบุคคลที่สาม — รอยืนยันทางการ] ทิศทาง cloud
- มีรายงาน (~6 ต.ค. 2026) ว่า task แบบ Cowork ใหม่จะรันใน cloud sandbox เป็น default และ Dispatch ปิดรับผู้ใช้ใหม่ — **ใช้เป็นสัญญาณทิศทางเท่านั้น ห้ามพิมพ์ลงเอกสารการตลาดก่อนมีเอกสารทางการ** (ซักค้านรอบ 1 จับว่าเดิมเราอ้างข้อนี้เกินหลักฐาน — แก้แล้ว)
- จุดยืนที่พิสูจน์ได้อิสระ: CLI คือ dev surface ที่มีการลงทุนต่อเนื่อง (changelog) และรันบนเครื่องผู้เรียนโดยการออกแบบ

---

## 3. ทางเลือกเชิงกลยุทธ์

| | A: Minimal patch | **B: Patch + repositioning เบา (แนะนำ)** | C: ปรับใหญ่ (bridge module / แตก 2 คอร์ส) |
|---|---|---|---|
| ขอบเขต | แก้เฉพาะ env lines | B + refresh module-01 + positioning + FAQ + regression | เพิ่ม module เรื่อง Claude app หรือแยกคอร์ส |
| ข้อดี | ถูกสุด ไม่แตะ gate | ถูกต้อง + ทันสมัย + เก็บโอกาสตลาด (คู่แข่ง Cowork-branded ล้าสมัย) | ครอบคลุม ecosystem |
| ข้อเสีย | module-01 เก่าต่อหน้าผู้เรียนที่เพิ่งเจอข่าว | ต้อง re-run gate บาง criteria | ขัด constraint เพิ่งผ่าน gate v3, เบลอ audience, 5–10+ วัน |
| ต้นทุน | ~0.5–1 วัน | **~3.5–4 วัน** | 5–10+ วัน |

**เหตุผลเลือก B:** A ไม่พอ (ปล่อยส่วนที่อ้าง "ปี 2026" ให้ค้างความจริงของปี 2026) · C เกินจำเป็น (Anthropic เอง route งาน dev ไป Claude Code — หลักสูตรเรายืนตรงจุดนั้นอยู่แล้ว) · B เป็น smallest change set ที่ได้ทั้ง accurate + current + better-positioned โดยไม่แตะโครงสร้าง 11 modules / 6 workshops

---

## 4. หนี้เก่าที่ซักค้านพบ (ไม่เกี่ยวกับ merge โดยตรง แต่ต้องปิดก่อนรอบอบรมถัดไป)

**module-11 deploy (Vercel) ไม่เคยถูกทดสอบจริง** — ไม่มี transcript deploy ใน `runs/` เลย (run-007 จบที่ build + gate 3/3 ที่ commits v1→v3), บทเรียนไม่มีป้าย ✅ tested ต่างจาก module อื่น (material/README.md:40 ประกาศ convention ไว้) — ขัดมาตรฐาน B1/C1 ของ QUALITY-GATE ตัวเอง

---

## 5. Checklist ฉบับอนุมัติ (รวม ≈ 3.5–4 person-days)

| # | ชนิด | งาน | เวลา |
|---|---|---|---|
| 1 | ความถูกต้อง | `vibe-code-l2-course-outline-rev1.md:49` — ตัด "Claude for Desktop" ให้เหลือ Claude Code CLI (npm) + ที่นั่ง Pro/Team | 15 นาที |
| 2 | ความถูกต้อง | `vibe-code-l2-course-outline-internal.md` env block **บรรทัด 52–57** ทั้งบล็อก ให้เข้ากับ rev1:47–50: (a) Windows-only → Win/mac/Linux (b) "Google Antigravity หรือ VS Code" → "VS Code หรือ Cursor" (c) "(Free)" → Pro/Team (d) ตัด parens "Claude for Desktop (สำหรับใช้งาน Claude Code)" (e) ปรับเรื่องที่นั่ง (invite ระหว่างอบรม vs ผู้จัดเตรียมให้) เป็นเรื่องเดียว (f) Node.js "Latest version + Manual" → "Latest LTS" | 1–2 ชม. |
| 3 | ความถูกต้อง | `material/module-01-agent-foundations/lesson.md` §2 — เพิ่มแผนที่ one-Claude: **Claude app = knowledge work + agentic อัตโนมัติ / Claude Code = dev work + รันบนเครื่องผู้ใช้**; คง label "(experimental)" ของ Agent Teams (ยังถูกตามเอกสารทางการ 2026-10-09) + เพิ่ม "มีเอกสารทางการแล้ว แต่ปิดโดย default ต้องเปิดด้วย flag (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`)" | ครึ่งวัน |
| 4 | ความถูกต้อง | module-01 §1 — ประโยคเดียว: เส้นแบ่ง chatbot-vs-agent ในแอปใหม่เบลอลง (แชทเดียวกันรันงานเองได้) แต่ dev workflow จริงยังอยู่ที่ CLI | 30 นาที |
| 5 | ความถูกต้อง | `material/module-11-deploy-preflight/lesson.md` — ระบุ surface ให้ชัดว่า deploy ผ่าน Claude Code ด้วย Vercel integration แบบใด + ระบุสถานะทดสอบตรงไปตรงมา | 1 ชม. |
| 6 | ตรวจสอบ | module-04 model table — ยืนยัน aliases ยัง resolve บนตระกูล 5.5; **ห้าม pin เวอร์ชัน** | 30 นาที |
| 7 | การตลาด | หน้า course + intro — positioning ยืนบนฐานพิสูจน์ได้: "multi-agent ระดับ production บน Claude Code — dev surface ที่ Anthropic ลงทุนต่อเนื่อง (9 releases ใน 8 วันของ ต.ค.) และรันบนเครื่องคุณ"; ประเด็น local-vs-cloud ใช้เฉพาะหลังมีเอกสารทางการ | ครึ่งวัน–1 วัน |
| 8 | ops | Pre-class email/FAQ — ต้องติดตั้งอย่างเดียวคือ CLI + Node ≥ 20; เรื่องข่าว one Claude: "หน้าตาแอปอาจต่างกันตามแผนและเวลา rollout (Pro/Max ก่อน, Team ตามมา) แต่คอร์สนี้ใช้ CLI ล้วน ไม่มีขั้นตอนไหนต้องพึ่ง UI ใหม่" + กติกา instructor: ห้ามสาธิตฟีเจอร์แอปที่ครึ่งห้องยังไม่มี | ครึ่งวัน |
| 9 | Regression | (a) รัน deploy จริง 1 รอบตาม module-11 + เก็บ transcript ตาม template `runs/` (ปิดหนี้เก่า §4) (b) re-run QUALITY-GATE criteria ที่โดนแก้ + re-date `QUALITY-GATE.md` (ปัจจุบันลงวันที่ 29 ก.ย.) พร้อมหลักฐานใหม่ (c) ตรวจ fact ใหม่ทุกข้อที่พิมพ์ อ้าง official source ก่อนเสมอ (รวมถึงสถานะ Docs & Slides ณ วันพิมพ์) | 1 วัน |

## 6. Anti-recommendations (สิ่งที่ต้อง *ไม่* ทำ)

1. **ไม่เพิ่ม bridge module เรื่อง Claude app/Cowork** — Desktop app ไม่ถูกใช้ใน module ไหนเลย เพิ่มแล้วเบลอ audience
2. **ไม่แตกเป็น 2 หลักสูตรตอนนี้** — ยังไม่มีหลักฐาน demand; window ตลาดเก็บได้ด้วยการ ship เร็ว
3. **ไม่ pin model versions (5.5)** — aliases ยัง resolve อยู่ และ pins เน่าเร็ว
4. **ไม่ใช้ framing "Cowork is gone"** — ความสามารถถูกรวม ไม่ได้ตาย; เสี่ยงผิดความจริง + ดู clickbait
5. **ไม่แนะให้ผู้เรียนต้องมี Desktop app** — implication นี้คือ bug ที่กำลังจะแก้ (item 1–2)
6. **ไม่ใช้ข่าว cloud-sandbox (บุคคลที่สาม) ในเอกสารใด** จนกว่าจะยืนยันทางการ
7. **ไม่อ้างว่า Agent Teams พ้นสถานะ experimental** — เอกสารทางการยืนยันว่ายังเป็น experimental

## 7. เกณฑ์ความสำเร็จ (รอบอบรมถัดไป)

1. `find . -type f -not -path "./.git/*" -exec grep -li "desktop" {} +` (ครอบ untracked — `grep -r`/`git grep` ตกไฟล์ internal) ไม่เหลือบรรทัดที่ implication ว่าต้องใช้ Desktop app — หมายเหตุ: `.gitignore` จะโดน flag เพราะ `Desktop.ini` เสมอ เป็น false positive ที่ยอมรับ; ตัดสินที่ implication จริงเท่านั้น; env requirements เป็น canonical เดียวกันทั้ง 2 เอกสาร
2. ผู้อ่านใหม่อ่านจบ module-02 ขั้นที่ 1 (คำสั่งติดตั้งอยู่ที่นั่น) + env requirements แล้วรู้ว่าต้องติดตั้ง CLI อย่างเดียว
3. QUALITY-GATE criteria ที่เกี่ยวข้อง re-run ผ่าน + มี transcript deploy จริง 1 รอบใน `runs/` บน 2.1.x ล่าสุด + QUALITY-GATE.md ลงวันที่ใหม่
4. ทุก fact ใหม่ที่พิมพ์ลงเอกสารมีแหล่งอ้างอิง และข่าวบุคคลที่สามถูก tag สถานะชัดเจน
5. Instructor log รอบถัดไปไม่มีคำถามประเภท "ต้องใช้ Desktop ไหม / ตัวไหนคือตัวไหน / ทำไมหน้าจอเพื่อนไม่เหมือนของฉัน"

---

## 8. บันทึกการซักค้าน (Gate Log)

| รอบ | คำตัดสิน | รายละเอียด |
|---|---|---|
| 1 | ❌ **FAIL** — 9 ข้อ (Blocker 2 / Major 3 / Minor 4) | B1: ข่าว cloud-sandbox 6 ต.ค. อ้างเกินหลักฐาน (บุคคลที่สามล้วน) แต่ถูกใช้เป็นฐานธีม "โอกาส" · B2: module-11 deploy ไม่เคยมี transcript ทดสอบ (จับจาก grep ใน runs/ = 0 hit) · M1: ที่นั่ง Team ได้ UI คนละจังหวะ แต่ FAQ ไม่มี caveat · M2: label "(experimental)" ขัด evidence ทีม (ภายหลังตรวจพบ evidence ทีมคลาดเคลื่อน ไม่ใช่ label) · M3: env block internal ขัด rev1 4+ จุด ไม่ใช่งาน 15 นาที · m1–m4: criterion ยึด module ผิด / คำสั่ง grep ตกไฟล์ untracked / คณิตเวลาไม่ปิด / แหล่งอ้าง "Code tab" ผิดที่ |
| 2 | ✅ **PASS** — 0 ข้อคงค้าง | ตรวจซ้ำอิสระทั้ง 9 ข้อ (repo + web 3 จุด) ปิดครบ + ไม่พบปัญหาใหม่; เหลือ 3 จุดสังเกตย่อย **เย็บรวมเข้ารายงานฉบับนี้แล้ว**: (1) date-scope สถานะ Docs & Slides (2) ขยายขอบเขต citation เป็น internal:52–57 + เพิ่มจุดแก้ (f) (3) หมายเหตุ false positive ของ criterion 1 |

## 9. แหล่งอ้างอิง

- [Claude Cowork and chat are now one Claude (official blog)](https://claude.com/blog/cowork-is-now-claude)
- [Claude Cowork and chat are one Claude (Help Center #16761823)](https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude)
- [Anthropic merges Claude chat and Cowork (TechCrunch)](https://techcrunch.com/2026/09/16/anthropic-merges-claude-chat-and-cowork-in-one-interface)
- [Claude Code Changelog](https://code.claude.com/docs/en/changelog) · [Agent Teams (official docs — experimental)](https://code.claude.com/docs/en/agent-teams)
- บุคคลที่สาม (tag ไว้เป็น "รายงาน รอยืนยัน"): Hacking Demand / Medium / Reddit เรื่อง cloud sandbox ~6 ต.ค. 2026
