# Lab — จำข้อตกลงของโปรเจกต์ (Module 10: Context Engineering & Memory)

> ⏱ machine ~4 นาที · Start state: มี data-researcher จาก Workshop 2 · มี agents ครบ 5 ตัว

## Goal / เป้าหมาย

ใส่ `memory: project` แล้วทดลองถามข้ามเซสชันเรื่อง Express

## Steps / ขั้นตอน

1. ใน TUI ที่ workshop repo `C:\dev\multi-agent-workshop` ให้เพิ่ม `memory: project` ใน frontmatter ของ data-researcher (เลือกอย่างใดอย่างหนึ่ง) แล้วกดอนุญาตเมื่อแก้ `.claude/`

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Add memory: project to the frontmatter of .claude/agents/data-researcher.md. Keep name, description, tools, and any mcpServers line exactly as they are. Do not change the body.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
เพิ่ม memory: project ใน frontmatter ของ .claude/agents/data-researcher.md คง name, description, tools และบรรทัด mcpServers (ถ้ามี) ไว้เหมือนเดิม ห้ามแก้เนื้อหา body
```

ผลที่คาดหวัง: เปิดไฟล์แล้วยังเป็น tools อ่านอย่างเดียว และมีบรรทัดประมาณนี้ใน frontmatter:

```yaml
memory: project
```

> 📚 **รู้เพิ่ม:** CLAUDE.md กับ memory คนละชั้น — กติกาห้าม Express มีอยู่แล้วใน CLAUDE.md ของ repo แล็บนี้ทดสอบชั้นที่สอง: ความจำที่เอเจนต์**จดเอง**แล้วพกข้ามเซสชัน · หลังแก้ frontmatter **ปิด TUI แล้วเปิด `claude` ใหม่** ก่อนขั้นถัดไป (ฟิลด์โหลดตอนเซสชันเริ่ม)

> 📚 **ทำไมแค่ตัวเดียว:** `memory` ผูกกับไฟล์เอเจนต์รายตัว ไม่ใช่สวิตช์ทั้งโปรเจกต์ · ใส่แค่ `data-researcher` เพื่อเทียบกับตัวที่ไม่มี memory ใน Stretch · กติกาที่ทุกตัวต้องรู้ให้อยู่ `CLAUDE.md` — อย่าเปิด memory ให้ทุกตัวในรอบนี้

2. วาง prompt ให้เอเจนต์จดข้อตกลง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@data-researcher Remember this project note: Registry Insight uses plain Node http and no dependencies. Do not suggest Express unless asked.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@data-researcher จดไว้ว่า Registry Insight ใช้ Node http ล้วน ไม่มี dependency ห้ามแนะนำ Express ถ้าไม่ได้ขอ
```

3. `/exit` แล้วเปิด `claude` ใหม่จากโฟลเดอร์เดิม แล้วถามคำถามที่ลองข้อตกลง — อย่าเอ่ยคำว่า Express เอง สังเกตว่าคำตอบยึดข้อตกลงหรือไม่:

```text
ขอแนะนำวิธีทำแอปนี้ให้ดีขึ้นหน่อย
```

ผลที่คาดหวังที่อยากเห็น: คำตอบอ้างข้อตกลงว่าไม่ใช้ Express ถ้าไม่ได้ขอ ถ้าไม่อ้าง ให้จดว่าความจำข้ามเซสชันไม่เกิดในรุ่นที่คุณใช้ แล้วไปต่อได้ รอบนี้ยังไม่ได้ล็อกผลไว้ในสคริปต์ของคอร์ส

## ✅ Checkpoint

- [ ] frontmatter มี `memory: project`
- [ ] เปิดเซสชันใหม่หนึ่งครั้ง
- [ ] จดผลว่าข้อตกลงถูกอ้างหรือไม่

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| แก้ frontmatter ไม่ได้ใน headless | `.claude/**` ถูกปฏิเสธ | ใช้ TUI |
| เซสชันใหม่ไม่จำ | ฟิลด์ไม่ถูกโหลด หรือคนละโฟลเดอร์ | เปิดจาก workshop repo (`C:\dev\multi-agent-workshop`) แล้วอ่านไฟล์เอเจนต์ |
| หมดเทิร์น | `--max-turns` ต่ำ | อยู่ใน TUI |
| เอเจนต์เสนอ Express อยู่ดี | งานความจำไม่เกิด | จดไว้ เป็นของที่ผู้สอนตามต่อ ไม่บล็อก Workshop 8 |
| `Agent type not found` / ไม่จำหลังแก้ไฟล์ | ยังไม่รีสตาร์ท TUI | ปิดแล้วเปิด `claude` ใหม่จาก workshop repo |

## 🆘 Behind? Catch up

ข้ามได้ เพิ่มบรรทัด `memory: project` ด้วยมือ แล้วไป Workshop 8

## Stretch / ต่อยอด

ถามคำถามเดิมกับเอเจนต์ที่**ไม่ได้**ใส่ memory (เช่น `@developer` หรือ `@qa`) แล้วเทียบกับ `@data-researcher` — จุดสอนคือ memory ไม่แชร์อัตโนมัติข้ามบทบาท แม้ขอบเขตจะเป็น `project`

## Solution → solutions/w2/

ไม่มีไฟล์คำตอบเพิ่ม โครงฟิลด์อยู่ในชีต frontmatter
