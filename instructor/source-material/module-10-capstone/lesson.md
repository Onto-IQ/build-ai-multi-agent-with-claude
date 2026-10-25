# Module 10 — Capstone: ทีม Multi-Agent สร้างระบบธุรกิจจริงแบบ Leader-first

> **เวลา:** ~90 นาที | **ผลลัพธ์ที่คาดหวัง:** ทีม Specialty Agents ส่งมอบ Full-stack Business Web Application ภายใต้สัญญากลาง — และผู้เรียนเห็นพัฒนาการทีละด่านด้วยตาตัวเอง

## 1. โจทย์ Capstone

ธุรกิจร้านค้าออนไลน์อยากได้ "หน้าร้านออนไลน์ + ตะกร้าสินค้าที่คำนวณส่วนลดถูกต้องและปลอดภัย" บน demo-shop ที่ทีมช่วยกันแก้จนผ่าน Quality Gate แล้ว (จาก Module 9)

ทีมที่ต้องประกอบ (แต่ละตัวคือไฟล์ใน `.claude/agents/` ที่ผู้เรียนสร้างเองตามแบบ Module 4):

| Agent | หน้าที่ | ส่งอะไรให้ใคร |
|---|---|---|
| **Planner** | แตกบรีฟธุรกิจเป็น Product Spec + Task Dependency List | Spec → ทุกคน |
| **Researcher** | เก็บฟีเจอร์/ตลาด และเตรียม Mock Data | Input → Planner / Backend |
| **Frontend + Backend** | สร้างระบบขนานกันบนสัญญากลางเดียว | โค้ด → QA |
| **Writer** | เนื้อหาจริงของแอป (Copy หน้าจอ/คำอธิบายสินค้า) ตาม Spec | เนื้อหา → Frontend |
| **QA / Security** | ตรวจโค้ดกับสเปก + รัน quality-gate | Findings → Leader |

## 2. สัญญากลาง (Shared Contract) — หัวใจที่ต้องเห็นก่อนรัน

ก่อน dispatch อะไรทั้งสิ้น Leader ต้องมี:

1. **Product Spec** (`docs/PRODUCT-SPEC.md`) — ฟีเจอร์, หน้าจอ, API, เกณฑ์ยอมรับ
2. **Task Dependency List** — งานไหนต้องรอใคร (Dependency ชัด = ขนานถูกจุด)

กฎทอง: **งานที่ขนานกันต้องมีสัญญากลางเป็นลายลักษณ์อักษรก่อนเสมอ** — ไม่มีข้อยกเว้น (หลักฐานตอกย้ำ: ผู้เรียนเคยเห็นแล้วใน W4 ว่า mismatch เกิดที่ "สเปกกำกวม")

## 3. Prompt หลักของ Capstone (โครง — ผู้เรียนปรับต่อ)

```text
You are the Leader of a multi-agent team building the demo-shop storefront.
Shared contract first, then build.

Step 0: Create docs/PRODUCT-SPEC.md (pages, API endpoints, acceptance criteria)
and a dependency-ordered task list. Show me the task list with statuses
(Pending / In Progress / Completed) and keep it updated until the end.

Step 1: Dispatch the researcher subagent to prepare mock product data and
feature notes. Feed its summary into the spec.

Step 2: Once the spec is written, dispatch frontend and backend developer
subagents IN PARALLEL — both must follow PRODUCT-SPEC.md exactly.
A writer subagent produces the page copy in parallel (same spec).

Step 3: Dispatch the qa-reviewer subagent to review code against the spec
and run scripts/quality-gate.js. Collect findings.

Step 4: Fix blocking findings, then report:
- what each agent delivered (1 line each)
- gate result
- git commits created (v1 -> v2 evidence)

Rules: agents that need another agent's output must NOT run before it.
Everything follows PRODUCT-SPEC.md. Report under 400 words total.
```

## 4. ตาราง Pattern ที่ใช้ปนกัน (สรุปทั้งคอร์ส)

| ช่วงงาน | Pattern | เหตุผล |
|---|---|---|
| Spec → Research | Sequential | Research ป้อน input ให้ Spec |
| Frontend ∥ Backend ∥ Writer | Swarm | สัญญากลางชัด = ปลอดภัย |
| Build → QA | Sequential | QA ต้องมีของจริง |
| QA → Fix | Orchestration (Leader คุม) | Leader ตัดสิน finding ไหน block |

### เวอร์ชันภาษาไทย (โครงตรงกัน — องค์ประกอบย่อยทดสอบแล้วทั้งหมด: swarm/run-008, agent ไทย/run-009, gate loop/run-006, pipeline ไทย/run-011)

```text
คุณคือ Leader ของทีม Multi-Agent ที่สร้างหน้าร้าน demo-shop สัญญากลางก่อน แล้วค่อยลงมือ ลงมือทุก step เลย ห้ามแค่วางแผนเล่า

Step 0: สร้าง docs/PRODUCT-SPEC.md (หน้าจอ, endpoints, เกณฑ์ยอมรับ) และ task list ที่มีลำดับ dependency
แสดง task list พร้อมสถานะ (Pending / In Progress / Completed) และอัปเดตจนจบงาน

Step 1: Dispatch research subagent เตรียม mock product data และ feature notes แล้วหลอมเข้าสเปก

Step 2: เมื่อสเปกเสร็จ dispatch frontend และ backend developer subagents ขนานกัน — ทั้งคู่ต้องทำตาม
PRODUCT-SPEC.md เป๊ะ พร้อมกันนั้นให้ writer subagent เขียน page copy ตามสเปกเดียวกัน

Step 3: Dispatch qa-reviewer subagent ตรวจโค้ดกับสเปก และรัน scripts/quality-gate.js ผ่าน node แล้วรวบรวม findings

Step 4: แก้ finding ที่เป็น blocker แล้วรายงาน: แต่ละ agent ส่งอะไร (บรรทัดเดียว), ผล gate, git commits ที่สร้าง (หลักฐาน v1 -> v2)

กติกา: agent ที่ต้องใช้ผลของอีกตัว ห้ามรันก่อนตัวนั้นเสร็จ ทุกอย่างยึด PRODUCT-SPEC.md รายงานรวมไม่เกิน 400 คำ
```

> ผลการรันจริงฉบับอังกฤษ (run-007): ทีมส่งมอบครบ — RESEARCH.md + mock data ที่ id ตรง runtime, static handler "pure insertion" ไม่แตะโค้ดเดิม, เว็บ 4 หน้า + copy, QA verdict YELLOW (gate 3/3, 0 blocker), commits v1→v3 — และ QA **แยก blocker กับ "สเปกยอมรับได้"** โดยอ้างมาตราสเปก (F-1/F-2 dropped ตาม §2/§7) แนะนำให้ผู้สอนรันฉบับไทยก่อนขึ้นห้องอีกครั้งเพื่อยืนยันพฤติกรรมเดียวกัน

## 5. เห็นพัฒนาการ — หลักฐาน 3 ชั้น

1. **Task List ระหว่างรัน** — สถานะไหลต่อหน้า
2. **Git Checkpoint หลังจบ** — `git log --oneline` เห็น commit ต่อ stage (ทีมจริงของ run-007 ทำ v1→v3 ให้เอง)
3. **เทียบ v1 → v2** — จุดเริ่ม (โค้ดมีปม) vs จุดจบ (ผ่าน gate) ด้วย `git diff v1 v2 --stat`

## กับดักที่พบบ่อย

- ปล่อยทีมก่อน Spec เสร็จ → กลับไป "ไปคนละทิศ" ทันที
- ไม่บอก Leader ว่า "agents that need output must NOT run before it" → จะ dispatch พร้อมกันหมด
- ลืมคุมยาวรายงานรวม → context ของ Leader โดนกินก่อนจบงาน
