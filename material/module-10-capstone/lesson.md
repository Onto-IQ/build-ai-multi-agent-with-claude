# Module 10 — Capstone: ทีม Multi-Agent สร้างระบบธุรกิจจริงแบบ Leader-first

> **เวลา:** ~90 นาที | **ผลลัพธ์ที่คาดหวัง:** ทีม Specialty Agents ส่งมอบ Full-stack Business Web Application ภายใต้สัญญากลาง — และผู้เรียนเห็นพัฒนาการทีละด่านด้วยตาตัวเอง

## 1. โจทย์ Capstone

ธุรกิจจริงของ 9Expert อยากได้ "หน้าร้านออนไลน์ + ตะกร้าสินค้าที่คำนวณส่วนลดถูกต้องและปลอดภัย" บน demo-shop ที่ทีมช่วยกันแก้จนผ่าน Quality Gate แล้ว (จาก Module 9)

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

## 5. เห็นพัฒนาการ — หลักฐาน 3 ชั้น

1. **Task List ระหว่างรัน** — สถานะไหลต่อหน้า
2. **Git Checkpoint หลังจบ** — `git log --oneline` เห็น commit ต่อ stage
3. **เทียบ v1 → v2** — จุดเริ่ม (โค้ดมีปม) vs จุดจบ (ผ่าน gate) ด้วย `git diff v1 v2 --stat`

## กับดักที่พบบ่อย

- ปล่อยทีมก่อน Spec เสร็จ → กลับไป "ไปคนละทิศ" ทันที
- ไม่บอก Leader ว่า "agents that need output must NOT run before it" → จะ dispatch พร้อมกันหมด
- ลืมคุมยาวรายงานรวม → context ของ Leader โดนกินก่อนจบงาน
