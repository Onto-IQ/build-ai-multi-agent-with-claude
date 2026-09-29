# Build AI Multi-Agent with Claude Code

หลักสูตรฝึกอบรมเชิงปฏิบัติ 2 วัน (VIBE-CODE-L2) — สร้าง Multi-Agent Systems ด้วย Claude Code ตั้งแต่ Swarm แรกจนถึง Capstone ที่ Deploy ขึ้น Production

> 🇹🇭 เอกสารทั้งหมดเป็นภาษาไทย (ศัพท์เทคนิคเป็นอังกฤษ) — ทุก prompt หลักมี **คู่ภาษาอังกฤษ/ไทย** และผ่านการทดสอบจริงกับ Claude Code TUI พร้อมเก็บ transcript เป็นหลักฐาน

## โครงสร้าง Repository

| โฟลเดอร์/ไฟล์ | คืออะไร |
|---|---|
| [`vibe-code-l2-course-outline-rev1.md`](vibe-code-l2-course-outline-rev1.md) | Course Outline ฉบับเผยแพร่ (12 หัวข้อ, 2 วัน, Workshop 1–6) |
| [`material/`](material/README.md) | สื่อการสอนครบ 11 Modules — lesson + prompts (TH/EN) + แบบฝึกหัดพร้อมเกณฑ์ผ่าน |
| [`runs/`](runs/README.md) | บันทึกการทดสอบ prompt จริง (~18 รอบ) พร้อม transcript และบทเรียน iteration |
| [`labs-sandbox/demo-shop/`](labs-sandbox/demo-shop/) | เว็บแอปร้านค้าตัวอย่าง (Pure Node.js ไม่มี dependency) ที่ใช้เป็น "โครงการจริง" ของทุก Workshop |
| [`QUALITY-GATE.md`](QUALITY-GATE.md) | เกณฑ์คุณภาพ 19 ข้อ + หลักฐานการผ่านทุกข้อ |

## เริ่มใช้งานเร็ว ๆ นี้

```bash
# 1. ติดตั้ง Claude Code (ต้องมี Node.js ≥ 20)
npm install -g @anthropic-ai/claude-code

# 2. เปิด sandbox
cd labs-sandbox/demo-shop
node server.js          # http://localhost:3000

# 3. เรียนตามลำดับ
#    material/module-01 → module-11 (ทุก lesson มีขั้นตอน + prompt TH/EN)
```

## จุดขายของสื่อชุดนี้

- **ทดสอบจริง ไม่ใช่ทฤษฎี** — prompt ทุกตัวใน Workshop ถูกรันจริงกับ Claude Code แล้วเก็บผลไว้ใน `runs/` รวมถึงกรณี**ล้มเหลว**และวิธี iterate (เช่น permission ของ `.claude/**`, turn budget, Agent อ้างเขียนไฟล์ปลอม)
- **สองภาษาเต็มรูปแบบ** — prompt ไทยทดสอบแล้วว่าทำงานได้เท่าอังกฤษ (รวม Unicode ไทยผ่าน MCP ไม่มี mojibake)
- **มีระบบคุณภาพ** — เกณฑ์ 19 ข้อพร้อมหลักฐานอ้างอิงทุกข้อ

## เอกสารประกอบ

- Course Outline ฉบับเผยแพร่: [vibe-code-l2-course-outline-rev1.md](vibe-code-l2-course-outline-rev1.md)
- เกณฑ์คุณภาพและหลักฐาน: [QUALITY-GATE.md](QUALITY-GATE.md)
