# Lab — จำข้อตกลงของโปรเจกต์ (Module 10: Context Engineering & Memory)

> ⏱ machine ~6 นาที · Start state: มี `data-researcher` + `qa` (และเอเจนต์อื่นครบจาก Workshop ก่อนหน้า)

## Goal / เป้าหมาย

ใส่ `memory: project` ให้ **สองตัวที่ได้ประโยชน์ชัด** (`data-researcher` + `qa`) จดโน้ตคนละแบบ แล้วเปิดเซสชันใหม่พิสูจน์ว่าแต่ละตัวพกความจำของตัวเอง — เทียบกับ `@developer` ที่**ยังไม่มี** memory

## Steps / ขั้นตอน

1. ใน TUI ที่ workshop repo `C:\dev\multi-agent-workshop` เปิด memory ให้สองตัว (เลือกอย่างใดอย่างหนึ่ง) แล้วกดอนุญาตเมื่อแก้ `.claude/`

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Add memory: project to the frontmatter of both .claude/agents/data-researcher.md and .claude/agents/qa.md. Keep name, description, tools, and any mcpServers line on each file exactly as they are. Do not change the bodies. Do not add memory to developer, planner, or release-manager.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
เพิ่ม memory: project ใน frontmatter ของทั้ง .claude/agents/data-researcher.md และ .claude/agents/qa.md คง name, description, tools และบรรทัด mcpServers (ถ้ามี) ของแต่ละไฟล์ไว้เหมือนเดิม ห้ามแก้ body ห้ามใส่ memory ให้ developer, planner หรือ release-manager
```

ผลที่คาดหวัง: ทั้งสองไฟล์มีบรรทัดประมาณนี้ใน frontmatter และ `developer.md` **ยังไม่มี** `memory:`

```yaml
memory: project
```

> 📚 **ทำไมสองตัวนี้:** `data-researcher` จำกติกาโดเมน/สแต็ก · `qa` จำวิธีพิสูจน์ (“รีโปรดิวส์ก่อนเขียนรายงาน”) — คนละประโยชน์ คนละโน้ต · `developer` / `writer` ไม่ใส่ เพราะต้องยึดแผนและตัวเลขล่าสุดบนดิสก์

2. **ปิด TUI แล้วเปิด `claude` ใหม่** — frontmatter โหลดตอนเซสชันเริ่ม

3. ให้แต่ละตัวจดโน้ตของบทบาทตัวเอง (วางทีละบล็อกหรือรวมในรอบเดียวก็ได้):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@data-researcher Remember this project note: Registry Insight uses plain Node http and no dependencies. Do not suggest Express unless asked.

@qa Remember this project note: Always reproduce bugs with a real HTTP request before writing docs/QA-REPORT.md. Never trust a developer claim that "it works" without your own reproduction. Do not edit server.js.
```

**เวอร์ชันไทย (ใช้ได้เต็มที่):**

```text
@data-researcher จดไว้ว่า Registry Insight ใช้ Node http ล้วน ไม่มี dependency ห้ามแนะนำ Express ถ้าไม่ได้ขอ

@qa จดไว้ว่าต้องรีโปรดิวส์บั๊กด้วย HTTP request จริงก่อนเขียน docs/QA-REPORT.md ห้ามเชื่อคำบอกว่า "เวิร์กแล้ว" โดยไม่รีโปรดิวส์เอง ห้ามแก้ server.js
```

4. `/exit` แล้วเปิด `claude` ใหม่จากโฟลเดอร์เดิม — ถาม**สามคำถาม**นี้ทีละข้อ (อย่าใบ้คำตอบใน prompt):

**ก) ตัวที่มี memory ด้านสแต็ก**

```text
@data-researcher ขอแนะนำวิธีทำแอปนี้ให้ดีขึ้นหน่อย
```

ผลที่อยากเห็น: อ้างว่าไม่ใช้ Express / ใช้ Node http ล้วน ถ้าไม่ได้ขอ

**ข) ตัวที่มี memory ด้านวิธีพิสูจน์**

```text
@qa นักพัฒนาบอกว่าแก้ notes แล้วเวิร์ก คุณจะเริ่มตรวจยังไง สั้น ๆ
```

ผลที่อยากเห็น: พูดถึงรีโปรดิวส์ด้วย request จริง / ไม่เชื่อคำบอกก่อนมีหลักฐาน

**ค) ตัวที่ไม่มี memory (ตัวเทียบ)**

```text
@developer ขอแนะนำวิธีทำแอปนี้ให้ดีขึ้นหน่อย
```

ผลที่อยากเห็น: มักไม่พกโน้ตเดียวกับ researcher (อาจพูดกว้างหรือชี้ไฟล์แผน) — จุดสอนคือ **memory ไม่แชร์ข้ามบทบาท** แม้เป็น `project`

ถ้าก) หรือ ข) ไม่อ้างโน้ต ให้จดว่าความจำข้ามเซสชันไม่เกิดในรุ่นที่คุณใช้ แล้วไปต่อได้ — รอบนี้ยังไม่ได้ล็อกผลในสคริปต์ของคอร์ส

## ✅ Checkpoint

- [ ] `data-researcher.md` และ `qa.md` มี `memory: project`
- [ ] `developer.md` **ไม่มี** `memory:`
- [ ] เปิดเซสชันใหม่หลังจดโน้ตแล้วถามครบสามข้อ (researcher / qa / developer)
- [ ] จดผลว่าใครอ้างโน้ตของตัวเองได้บ้าง

## 🛠 Troubleshooting

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| แก้ frontmatter ไม่ได้ใน headless | `.claude/**` ถูกปฏิเสธ | ใช้ TUI |
| เซสชันใหม่ไม่จำ | ยังไม่รีสตาร์ท หรือคนละโฟลเดอร์ | เปิดจาก workshop repo แล้วอ่านไฟล์เอเจนต์ |
| `qa` ไม่มีไฟล์เอเจนต์ | ยังไม่ถึง/ข้าม Workshop 4 | สร้าง `qa.md` ตาม Workshop 4 หรือ catch-up `w4` |
| ทั้ง researcher และ developer ตอบคล้ายกัน | โน้ตไปโผล่ใน CLAUDE.md หรือถามไม่ระบุ `@` | เรียกด้วย `@` ชัด · เทียบเฉพาะหลังรีสตาร์ท |
| หมดเทิร์น | `--max-turns` ต่ำ | อยู่ใน TUI |
| `Agent type not found` | ยังไม่รีสตาร์ทหลังสร้าง/แก้เอเจนต์ | ปิดแล้วเปิด `claude` ใหม่ |

## 🆘 Behind? Catch up

เพิ่มบรรทัด `memory: project` ใน `data-researcher.md` และ `qa.md` ด้วยมือ แล้วไป Workshop 8

## Stretch / ต่อยอด

เพิ่ม `memory: project` ให้ `release-manager` (จำจุดพลาดตอนปล่อย เช่น port ค้าง) — **ยังไม่ใส่ `writer`** เพราะตัวเลขต้องมาจาก API/CSV ทุกครั้ง

## Solution → solutions/w2/

ไม่มีไฟล์คำตอบเพิ่ม โครงฟิลด์อยู่ในชีต frontmatter
