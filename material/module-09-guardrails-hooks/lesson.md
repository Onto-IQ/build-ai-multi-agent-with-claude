# Module 9 — Production Guardrails, Permissions & Hooks

> **เวลา:** ~55 นาที (สอน 20 + Workshop 5 35) | **ผลลัพธ์ที่คาดหวัง:** ผู้เรียนตั้งขอบเขตสิทธิ์, เขียน Hook เป็นด่านคุณภาพ และสร้าง Quality Gate / Cost Gate ได้

> 🔒 **ส่วนผู้สอนเท่านั้น — Answer Key ปมที่ปลูกไว้ใน demo-shop** (ผู้เรียนจะได้ "ค้นเอง" จาก Workshop 1 และ 5)
> 1. `ADMIN_TOKEN` hardcoded ใน source (server.js:13) — secret หลุดเข้า Git
> 2. `JSON.parse(raw)` ไม่มี try/catch (server.js:44) — POST body เสีย = server ล่มทั้ง process
> 3. `for (const id of body.itemIds)` ชน undefined เมื่อไม่ส่ง itemIds (server.js:47)
> 4. `p.price` บน product ที่ไม่มีตัวตน → TypeError แทนที่จะ 404 (server.js:48-49)
> 5. `discountPercent` ไม่ clamp (0–100) → ติดลบ = คิดเงินเพิ่ม, 999 = total ติดลบ, "abc" = NaN → `{"total":null}` แต่ 200 OK
> 6. Error ทุกกรณีตอบ **200** — ไม่มี 404/401/400 แยกเลย
> 7. `limit` query ไม่ validate (NaN/negative → slice แปลก ๆ)
> 8. `server.listen(PORT)` ไม่ระบุ host → bind ทุก interface
> 9. `products.json` อ่านด้วย readFileSync นอก try/catch → ไฟล์เสีย = boot ตาย
> 10. ไม่มี rate limit / ไม่จำกัดขนาด body — float money math

## 1. สามชั้นของ Guardrails

| ชั้น | เครื่องมือ | กันอะไร |
|---|---|---|
| 1. Permissions | `tools` allowlist, `disallowedTools`, `permissionMode` | Agent ทำเกินขอบเขต (เขียน/ลบ/รันคำสั่งอันตราย) |
| 2. Approval Gates | Stop Conditions, Human-in-the-Loop | งานรุดหน้าผิดทิศโดยไม่มีคนเห็น |
| 3. Hooks | `PreToolUse`, `TaskCompleted` ฯลฯ | บังคับมาตรฐานโดยอัตโนมัติทุกครั้ง (ไม่ง้อความจำ agent) |

หลักคิด: **ความจำของ Agent ไม่ใช่กลไกควบคุม** — สิ่งที่สำคัญต้องอยู่ใน config ที่บังคับจริง (hooks/permissions) ไม่ใช่แค่ "บอกไว้ใน prompt"

## 2. Permissions — ฝึกอ่านและเขียนขอบเขต

```yaml
# ใน agent frontmatter
tools: Read, Grep, Glob            # allowlist — ไม่มี Bash/Edit ไปเอง
disallowedTools: WebFetch          # denylist เฉพาะจุด
permissionMode: acceptEdits        # โหมดสิทธิ์
```

จากการทดสอบจริงของคอร์ส (run-003): **ไฟล์ใน `.claude/**` จะถูกปฏิเสธ auto-approve เสมอ** แม้ใส่ `--allowedTools` — ระบบป้องกัน executable config จาก prompt injection อยู่แล้ว เรียนรู้ได้จากข้อความ: `Claude requested permissions to write to ..., but you haven't granted it yet.`

## 3. Hooks — โปรแกรมเล็ก ๆ ที่บังคับมาตรฐาน

Hook = คำสั่ง shell ที่รันอัตโนมัติที่จุด event ต่าง ๆ ตั้งใน `settings.json` (หรือ frontmatter ของ agent):

| Event | ใช้ทำ |
|---|---|
| `PreToolUse` | ดัก tool ก่อนรัน — exit code 2 = **บล็อก** |
| `PostToolUse` | ตรวจผลหลังรัน (เช่น lint ไฟล์ที่เพิ่งแก้) |
| `TaskCompleted` | ด่านสุดท้ายของ agent — exit 2 = งานไม่ผ่าน + feedback กลับ |

โครง hook ที่บล็อก (ตัวอย่าง Quality Gate):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/no-server-kill.js" }]
      }
    ]
  }
}
```

## 4. Quality Gate & Cost Gate — Workshop 5

**Quality Gate** — ด่านตรวจก่อนงานผ่าน: รัน server, ยิง endpoint ทุกตัว, ต้องไม่ crash, ต้องตอบ status code ถูกต้อง ล้มเหลว = exit 2 (งานถูกบล็อก + feedback กลับไปให้ agent แก้)

**Cost Gate** — คุมงบ Token: วัดจาก output ของ run (`--output-format json` มี usage/total cost) + ตั้งกติกา effort scaling ใน prompt (งานง่าย = 1 agent, ยาก = หลาย agent) — จำตัวเลข Module 1: 15× token คือราคาของทีม

## 5. ทำตามทีละขั้น (อยู่ใน lab.md)

ลำดับ: ตรวจ sandbox ด้วยตา → สร้าง hook ดัก crash → สร้าง quality-gate script → รัน agent พร้อม gate → สังเกตการถูกบล็อกและการ feedback กลับ

## กับดักที่พบบ่อย

- Hook พิมพ์อะไรลง stdout ปกติ → ข้อความนั้นกลายเป็น context เข้า agent (พิมพ์เฉพาะตอน block, และลง stderr เมื่อจะ feedback)
- ลืมว่า exit code 2 = บล็อก, exit อื่น ≠ บล็อก
- ใส่ gate ทั้งชุดตั้งแต่แรก → agent ติดด่านตายาว; เริ่มจากด่านที่พังบ่อยที่สุดก่อน
