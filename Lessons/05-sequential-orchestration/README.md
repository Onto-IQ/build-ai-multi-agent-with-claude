# Module 5 — สายงานต่อคิว + Teammate / Hybrid orchestration

> ⏱ ~70 นาที · 🎯 Hybrid: ขั้นใหญ่ต่อคิวด้วยไฟล์ (แผน → ลงมือ → รีวิว) · ขั้นลงมือใช้ Teammate สามคน (data / backend / frontend) คุยกันอย่างน้อย 5 ครั้ง · เพดาน 30 รอบ

แบบฝึกหัด (prompt / ไฟล์ตั้งค่าที่ต้องคัดลอก) อยู่ที่ **[LAB.md](LAB.md)** — หน้านี้สำหรับอ่านทบทวนแนวคิด

## Key idea / แนวคิดหลัก — เล่าเป็นเรื่อง

เมื่อวาน (Module 3) เราสำรวจขนานได้เพราะงานไม่ง้อกัน วันนี้โจทย์มี**ลำดับที่ข้ามไม่ได้**: ต้องมีแผนเป็นไฟล์ก่อน แล้วค่อยลงมือ แล้วค่อยรีวิว — ถ้าทำพร้อมกันตั้งแต่ต้น จะไม่มีสัญญาให้เทียบ

แต่ตอน**ลงมือ** งานมีสามเจ้าของชัดเจน (ข้อมูล / เซิร์ฟเวอร์ / หน้าเว็บ) ที่ควรคุยกันเองได้ — เลยเปิดโหมดทีมเฉพาะขั้นนั้น ให้เพื่อนชื่อ `data`, `backend`, `frontend` เป็น Teammate มีรายการงานร่วม ส่งข้อความหากันได้อย่างน้อย 5 ครั้ง แล้วหัวหน้า (`developer`) ค่อยสรุป

นี่คือ **hybrid**: โครงใหญ่เป็น sequential · ข้างในขั้นลงมือเป็น Agent Teams

> EN: Sequential file handoffs outside; three named teammates with ≥5 peer messages inside the build step. Max turns 30. Delete local settings before review.

## Concept / เนื้อหา

| ชั้น | แบบไหน | ทำอะไร |
|---|---|---|
| ขั้นใหญ่ | Sequential | planner → `TASKS.md` → ลงมือ → คุณรัน SQL/gate → รีวิว |
| ขั้นลงมือ | Teammate | `data` / `backend` / `frontend` คุยกันเอง + รายการงานร่วม |
| หลังลงมือ | ปิดโหมดทีม | ลบ `settings.local.json` แล้วค่อย `@developer` รีวิว |

ของที่ต้องมีบนดิสก์ระหว่างขั้น:

| ของส่ง | บทบาท |
|---|---|
| `docs/TASKS.md` | แผนจาก planner — ต้องมาก่อน Teammate |
| `docs/DESIGN.md` + `scripts/clean-export.sql` | ของจาก teammate `data` |
| แก้ `server.js` / `web/app.js` | ของจาก `backend` / `frontend` |
| `docs/REVIEW.md` | รีวิวหลังปิดโหมดทีม — ห้ามแก้ของ |

ไฟล์ตั้งค่าขั้น Teammate (ข้อความเต็มอยู่ที่ LAB): เปิด `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` และตั้ง `CLAUDE_CODE_MAX_TURNS` เป็น **30**

## ลำดับในห้อง (ภาพรวม)

1. สร้าง `planner` + `developer` → `@planner` ได้ `TASKS.md`
2. ใส่ `settings.local.json` (Teams + max 30) → เปิด `claude` ใหม่
3. `@developer` สร้าง Teammate `data` / `backend` / `frontend` · คุยกัน ≥ 5 ครั้ง
4. ลบ `settings.local.json`
5. คุณรัน DuckDB + เปิดเว็บ + `npm run gate` (คาด 2/6)
6. `@developer` เขียน `REVIEW.md` โดยห้ามแก้ของ

## สิ่งที่ต้องจำ (ทบทวน)

| จุด | ความหมาย |
|---|---|
| Hybrid | โครงใหญ่ต่อคิว · ขั้นลงมือเป็นทีม |
| ≥ 5 ข้อความระหว่าง teammates | บังคับให้ใช้โหมดทีมจริง ไม่ใช่แค่แตกงานเงียบ ๆ |
| MAX_TURNS 30 | เพดานรอบของขั้นลงมือ (ยาวกว่าสำรวจที่ใช้ 20) |
| ลบ settings ก่อนรีวิว | กันโหมดทีมติดไป Workshop ถัดไป |

## Common pitfalls / กับดัก

- เปิดโหมดทีมตั้งแต่รอบ planner — ขั้นวางแผนไม่ต้องใช้ Teammate
- ลืมลบ `settings.local.json` ก่อนรีวิว / ก่อน Workshop 4
- สั่ง Explore แทน agent team ในขั้นลงมือ
- ใช้ `claude -p` ตอนมีโหมดทีม — จะไม่ได้ teammate
- รีวิวลงมือแก้สคริปต์ทั้งที่สั่งห้าม

## Quick check / ทบทวน

<details>
<summary>1. ส่วนไหนของแล็บนี้เป็น sequential</summary>
แผนต้องมีไฟล์ก่อนลงมือ และรีวิวต้องมาหลังมี DESIGN/SQL — ต่อคิวด้วยไฟล์
</details>

<details>
<summary>2. ส่วนไหนเป็น Teammate</summary>
ขั้นที่ developer สร้างเพื่อนชื่อ data, backend, frontend ให้คุยกันอย่างน้อย 5 ครั้ง
</details>

<details>
<summary>3. ทำไม MAX_TURNS เป็น 30 ไม่ใช่ 20</summary>
ขั้นลงมือสร้างไฟล์และแก้โค้ดยาวกว่าการสำรวจอ่านอย่างเดียวใน Workshop 1
</details>

## Go deeper

- [LAB.md](LAB.md) — แบบฝึกหัด Workshop 3
- [Module 3 — Swarm + Agent Teams](../03-swarm/README.md)
- [Failure modes](../../reference/failure-modes.md)
