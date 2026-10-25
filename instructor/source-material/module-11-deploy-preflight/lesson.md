# Module 11 — Production Deployment & Pre-flight Checklist

> **เวลา:** ~30 นาที | **ผลลัพธ์ที่คาดหวัง:** งานของทีม Agent ขึ้น Production (Vercel) และผู้เรียนมี Checklist ติดตัวก่อนส่งมอบทุกครั้ง

## 1. Deploy ด้วย Claude Code Integration (Vercel)

แนวทางที่หลักสูตรใช้: deploy ผ่าน **Claude Code** — เชื่อม Vercel เข้ากับ Claude Code เป็น Connector/Integration แล้วให้ Leader รับผิดชอบขั้นตอน deploy ผ่าน Prompt — ผู้เรียนสั่งเป้าหมาย ไม่ใช่พิมพ์คำสั่ง deploy เอง

> ⚠️ **สถานะการทดสอบ (ตรงไปตรงมา):** Workshop นี้**ยังไม่เคยรันจริงเพื่อเก็บ transcript** ใน `runs/` (ต่างจาก Workshop อื่น) — ทั้ง path Connector นี้และทางเลือก Vercel CLI ด้านล่างต้องทดสอบจริงและเก็บ transcript ก่อนใช้สอนรอบถัดไป (รายละเอียด: รายงานวิจัย `research-2026-10-09-one-claude-impact.md` §4)

```text
Deploy this project to Vercel. Use the Vercel connection.
Before deploying: run scripts/quality-gate.js — if it fails, stop and report.
After deploying: give me the production URL and the commit that was deployed.
```

**เวอร์ชันไทย (โครงตรงกัน):**

```text
Deploy โปรเจกต์นี้ขึ้น Vercel โดยใช้ Vercel connection
ก่อน deploy: รัน scripts/quality-gate.js — ถ้าไม่ผ่านให้หยุดและรายงานเลย
หลัง deploy: ส่ง production URL และ commit ที่ถูก deploy มาให้ผม
```

> ทั้งสองเวอร์ชันมีโครงเดียวกัน: Pre-flight ฝังใน prompt (`ก่อน deploy: รัน gate — ไม่ผ่านให้หยุด`) + traceability (`ส่ง commit ที่ขึ้นจริงมาให้`) — หลักไม่ต่างกันตามภาษา

- `Before deploying: run gate` = Pre-flight ฝังใน prompt (ผ่านด่านก่อนขึ้นจริง)
- `give me the commit` = traceability — รู้ว่าขึ้นโค้ดเวอร์ชันไหน

ทางเลือกที่ควบคุมเองได้: ใช้ Vercel CLI (`vercel --prod`) ผ่าน Bash — เหมาะเมื่อยังไม่ต่อ Connector; เปรียบเทียบให้ผู้เรียนเห็นว่าทั้งสองแบบคือ "การมอบหมายให้ Agent" เหมือนกัน

## 2. Pre-flight Checklist ก่อนส่งงานมอบให้ Agent ทำงานอัตโนมัติ

ติ๊กให้ครบก่อนกด Enter ทุกครั้ง:

| # | ข้อตรวจ | ทำไม |
|---|---|---|
| 1 | Working dir ถูกโปรเจกต์ (ไม่ใช่ root/home) | ขอบเขตอำนาจของ Agent |
| 2 | Git สะอาด + commit ล่าสุดมี tag | ย้อนได้เมื่อพัง |
| 3 | Scope ของเครื่องมือที่ให้ (allowedTools) น้อยที่สุดที่พอ | ลดรัศมีความเสียหาย |
| 4 | มี Gate รันก่อนงานสำคัญ | กันของเสียไหลผ่าน |
| 5 | Prompt ระบุ "ผลลัพธ์รูปแบบอะไร ยาวเท่าไร" | คุม context |
| 6 | Task list เปิดให้เห็น | เห็นพัฒนาการ |
| 7 | งบ Token ของงานนี้คุ้มไหม (เทียบ 15×) | ต้นทุนจริงของทีม |
| 8 | แผน B เมื่อ Agent ติด loop | Stop condition |

## 3. Failure Modes ที่ควรระวัง (สรุปจากทั้งคอร์ส + การทดสอบจริง)

| อาการ | ที่เจอจริงที่ไหน | กันด้วย |
|---|---|---|
| Agent อ้างว่าทำแล้วแต่ไม่ได้ทำ | run-003 (เขียนไฟล์) | Verify บน filesystem |
| ทีมขนานแล้วไปคนละทิศ | บทเรียนข้อ 11 | Shared contract ก่อน dispatch |
| Output ท่วม context | W1 ถ้าไม่จำกัดความยาว | คุมรูปแบบ/ความยาวรายงาน |
| Loop ไม่รู้จบ / turn budget หมดก่อนลงมือ | run-006 (max-turns 15 หมดตอนสำรวจ) | Stop Condition + `--max-turns` ให้พอ + สั่ง "ทำก่อนสำรวจเยอะ" |
| Permission ที่ไม่คิดว่าต้องอนุมัติ | run-003 (`.claude/**`), run-005 (Bash ใน headless) | ทดลองก่อนขึ้นจริง / ดู denial ด้วย stream-json |
| **Kill process แบบกว้างขณะระบบทำงาน** | run-007 attempt 1 (`taskkill node.exe` ฆ่า capstone ตาย) | Kill ด้วย **PID เฉพาะ** (`netstat -ano` หา port → `taskkill //PID`) |
| Port ชนกับ server เดิม | run-007 (gate จับ "port busy" ถูกต้อง) | ปิด server เก่าก่อนรัน gate / ใช้ PORT อื่น |

## 4. ปิดคอร์ส — เทียบพัฒนาการ

ให้ผู้เรียนตอบ 3 คำถาม พร้อมหลักฐานจาก repo ของตัวเอง:

1. ตอนเริ่ม (v1) server ล่มด้วย POST 1 ครั้งไหม? ตอนนี้ (v2) ยังไหม? — `git diff` + gate ผล
2. ทีม Agent ที่คุณประกอบ ใช้ pattern อะไรตรงจุดไหน และถ้าเลิกสัญญากลางจะเกิดอะไร?
3. Cost ของ run สุดท้าย (`--output-format json`) คุ้มกับงานที่ได้ไหม — อ้างตัวเลข

## อ้างอิง

- Vercel Documentation — Deploying (vercel.com/docs), Claude Code — MCP/Connector setup
