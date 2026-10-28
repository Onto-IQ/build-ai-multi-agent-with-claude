# Handoff — Two-repo + Real-data Walkthrough (2026-10-28)

> **สถานะ 2026-10-28 สายค่ำ: §4.1–§4.5 เสร็จหมดแล้ว (เหลือ §4.6 Phase F)** — อ่าน §8 ผลจริงก่อนทำอะไรต่อ
> อ่านทั้งไฟล์ก่อนเริ่ม · ห้าม commit/push course repo ซ้ำโดยไม่จำเป็น

## 8. ผลจริงบนเครื่อง C:\dev (2026-10-28) — §4.1–§4.5 เสร็จสมบูรณ์ + ยกระดับปลายทางเป็น release v2 แล้ว

> **สำคัญ (ปรับหลังคอมเมนต์เจ้าของคอร์ส):** ปลายทางเดิมดูจนเป็น "prompt เดียวก็ทำได้" — เพิ่ม PRODUCT-SPEC v2 (ใน `solutions/w9/drop-in/docs/`) ให้หน้า `/` เป็นแดชบอร์ด 7 ส่วน: การ์ด KPI 4 ใบ · กราฟแท่งทุนรายเดือน SVG จาก `GET /api/monthly` ใหม่ · แท่งรายภาค · ตารางจังหวัด (feature W8) · แผงโน้ตบน notes API (เดิมมี API ไม่มี UI) · ฟุตเตอร์ · สร้างด้วยเอเจนต์จริง ตรวจ qa ผ่านทุกเกณฑ์ gate ยัง 6/6 — **เด็ค Phase F ใช้ภาพจริงที่ `reference/screenshots/` (v2-final-top/bottom/mobile.png)**
> **รอบโต้ตอบ (ล่าสุด):** spec เพิ่มหมวด "การโต้ตอบของผู้ใช้" — ค้นหาจังหวัด (ไม่สนสระ/วรรณยุกต์) · คลิกหัวคอลัมน์จัดเรียง (aria-sort + ลูกศร) · เลือกจำนวนแถว 10/20/ทั้งหมด · สลับกราฟแท่ง/เส้น — ทั้งหมด client-side จากข้อมูลที่ fetch แล้ว ไม่เพิ่ม endpoint ตรวจด้วยเบราว์เซอร์จริงครบทุกอย่าง + caption ไดนามิกตามจำนวนแถว (walkthrough-wip `7eb2eaf` · course `3d7325d`)
> **ภาพ TUI สำหรับเด็ค (ได้แล้ว):** `reference/screenshots/tui-01..05` — เริ่มเซสชัน workshop + manual mode on · prompt W5 ใน input · release-manager เป็น background agent + กล่องอนุมัติ Bash · dialog ที่ 2 · รายงาน PASS/FAIL ตารางเต็ม — W5-invoke บน TUI วัดได้ **2 นาที 14 วิ** (headless 51 วิ)
> **กับดักใหญ่ที่แท้จริงของ TUI harness (เจอตัวจริง):** สั่ง WT ด้วย `-Command "Set-Location '...'; claude"` = WT แยก argument ไม่ครบ → `Set-Location` หาย → **claude รันใน cwd ของคนเปิด (course repo!)** — นี่คือเหตุที่ transcript ไม่เกิด/หน้าต่าง "ตาย" รอบก่อน ต้องสร้าง `start-tui.ps1` แล้วส่งด้วย `-File` เสมอ · สูตรที่เวิร์กกับ WT: Focus (ALT+minimize/restore+SetForegroundWindow) → เคลียร์ input ด้วย Backspace (hold 100ms) → `Set-Clip` → Ctrl+V แบบเว้นจังหวะ (60/150ms) → Enter ที่ hold 150ms · **SendInput KEYEVENTF_UNICODE ไม่ถึง input ของ WT** (คีย์ VK ปกติถึง แต่โดนแปลง layout ไทย)

### 8.1 สภาพแวดล้อมที่ติดตั้งแล้ว
- Node 24.22.1 · Git 2.56.0 · claude 2.1.312 (login ผ่าน, `claude -p` ตอบได้) · **DuckDB CLI v2.0.0 ที่ `%LOCALAPPDATA%\Programs\duckdb`** (release v2.0.0 แจก `.tar.gz` ไม่ใช่ `.zip` — แก้ตาราง §3 แล้ว) · uv 0.13.6 ผ่าน winget
- **PATH ระดับ user แล้ว**: ทั้ง duckdb dir และ uvx dir (WinGet Packages) — แต่โพรเซสที่เปิดค้างก่อนติดตั้งไม่เห็น ต้อง prepend PATH ต่อคำสั่ง หรือเปิด shell ใหม่
- `verify-setup` = **passed ทุกบรรทัด** (WORKSHOP_DIR=C:\dev\multi-agent-workshop)
- **TUI harness บนเครื่องนี้ใช้ไม่ได้จริง**: หน้าต่างตายเองดาครั้ง, clipboard manager ("Glassly") แย่ง clipboard ระหว่าง paste, คีย์บอร์ดไทยทำ y→ั, conhost ไม่มีฟอนต์ไทย — **pivot ไป headless `claude -p --dangerously-skip-permissions` ทั้ง walkthrough** (ทำงานเสถียร 100%) · ค้นพบสำคัญ: **headless เขียน `.claude/**` ได้ปกติเมื่อ bypass** (ทรับ "headless กัน .claude/**" ใน LAB ใช้กับ default permission เท่านั้น)
- MCP data-duckdb ใช้ได้เมื่อ uvx อยู่ PATH ของ claude · ยืนยัน end-to-end: execute_query ตอบ 16,781 แถว

### 8.2 ผลแล็บ + เวลาเครื่อง (headless — เร็วกว่า TUI ห้องเรียนหลายเท่า อย่าเอาไปตั้งตารางเวลาห้อง)
| แล็บ | ผล | เวลาเครื่อง |
|---|---|---|
| W5 invoke release-manager | PASS 4/4 ไม่เอ่ยชื่อ skill + w5 check ผ่าน | 51 วิ |
| W6 ครบ (MCP query → analysis.sql → รันเอง → ANALYSIS.md → check) | ตารางรายเดือนตรงเอกสาร · region-capital.csv ตรงอ้างอิง · **w6 check passed** | ~1 นาที 40 วิ |
| W7 hook + cost gate | บล็อก exit 2 + ข้อความ / ปล่อย exit 0 · catch-up w7 จ่าย cost-gate · under=0/over=2 ถูก · **hook ขวาง taskkill ของ developer จริงใน W8** | ~2 นาที |
| M10 memory | `memory: project` + จดไฟล์ `.claude/agent-memory/` · เซสชันใหม่ไม่เสนอ Express และอ้างกติกา no-dependency (ไม่อ้างไฟล์ memory ตรง ๆ เพราะ memory ผูก subagent — จดเป็นข้อสังเกต) | 1 นาที 39 วิ |
| W8 feature จังหวัด | planner(91วิ) → developer(2น09วิ) gate 6/6 เอง → coach curl ยืนยัน `/api/provinces` + 400 INVALID_LIMIT → qa(2น53วิ) append QA-REPORT · **w8 check passed** | ~7 นาที |
| W9 capstone | writer สร้าง (20วิ) → ทีมเต็มวงตามลำดับ dependency (4น30วิ) → EXECUTIVE-SUMMARY ไทยตรง API ทุกหลัก · **w9 check passed** · agents ครบ 6 | ~5.5 นาที |
| M13 preflight | gate 6/6 · health 3001 `{"ok":true}` ไม่มี sk- · key ว่าง · server ปิดสนิท · **deploy: บันทึกว่าผู้สอนสาธิต (ไม่มีบัญชี Vercel)** | ~1 นาที |
| **Isolation check §4.4** | **0 ไฟล์ transcript ตรงเงื่อนไขทุก pattern** — เอเจนต์ไม่เคยเห็นบทเรียน/เฉลย ✓ | — |

### 8.3 บั๊กคอร์สที่พบและแก้แล้ว (commit แล้ว)
1. **LAB W6 prompt `CAST` ล้มจริง** บนข้อมูลดิบ (แถวหัวตาราง 9 แถว) → เปลี่ยน prompt เป็น `TRY_CAST(replace(replace(...)))` + รู้เพิ่ม — commit ใน course repo
2. **LAB W8 developer prompt อ้าง `/api/breakdown` ที่ไม่มีใน starter** → เปลี่ยนเป็น `/api/summary, /api/health, /api/notes` — commit ใน course repo
3. **dataset 2 สายพันธุ์**: starter (main) = build ดิบตั้งใจให้ data-quality แดง (อย่าแตะ!) · canonical หลัง W3 = ตัวใน `solutions/w7,w9/drop-in/data/dataset.csv` ที่ให้เลขอ้างอิง 10,068/31,680,888,983 — เดิม walkthrough-wip มี build เก่า (ให้ กลาง 10,060) จน check.js ไม่ผ่าน → **sync canonical ลง walkthrough-wip แล้ว (321b45a)**
4. **`data/README.md` เลข กลาง ผิด** (31,691,588,983) → แก้เป็น 31,680,888,983 บน main แล้ว
5. อุบัติเหตุที่แก้คืนแล้ว: ผมเผลอ sync canonical dataset ลง main ทำ data-quality เขียวผิดดีไซน์ → **revert กลับ build ดิบ starter (ad0896e)** — main ต้องแดง data-quality ตามดีไซน์เสมอ

### 8.4 คอมมิตล่าสุด
- workshop `main` = **ad0896e** (starter แดง 0/6 + README fix · push แล้ว)
- workshop `walkthrough-wip` = **1032aee** (walkthrough W5–W9 + release v2 dashboard · push แล้ว)
- course repo = commit LAB fixes (TRY_CAST + breakdown + W9 v2 scope) + PRODUCT-SPEC v2 + ภาพจริง `reference/screenshots/`
- ข้อควรรู้เพิ่ม: **dataset ของ starter (main) เป็น build ดิบ + encoding เพี้ยนตั้งแต่ b3f093e ตามดีไซน์** (data-quality แดงจนกว่า W3 clean-export จะซ่อมทั้งค่าและ encoding) — อย่า sync canonical ลง main
- ข้อควรรู้: `w9/check.js` และ `check-solutions.mjs` spawn `duckdb` — ต้องมี duckdb บน PATH ตอนรัน

### 8.5 เหลือทำ — Phase F เท่านั้น (§4.6)
- เด็คอยู่ที่ repo root: `Build-AI-Multi-Agent-Claude-Code-9Expert-v2_updated.pptx`
- **ระวัง: walkthrough รอบนี้เป็น headless ไม่มีภาพ TUI เลย** — ภาพประกอบเด็คต้องเก็บใหม่จาก: หน้าแดชบอร์ด (มี feature จังหวัด) บน walkthrough-wip, output ของ `npm run gate`, ไฟล์ docs (FEATURE-PLAN/QA-REPORT/EXECUTIVE-SUMMARY) หรือถ่าย TUI จริงตอนสอน
- caption path ในเด็ค Phase F ใช้ `C:\dev\multi-agent-workshop` ให้ตรงกับค่าเริ่มต้น `WORKSHOP_DIR` ใน course repo

## 1. สถาปัตยกรรมที่ตกลงไว้ (ห้ามถามซ้ำ)

- **สอง repo**: course repo (บทเรียน+เฉลย+สคริปต์ตรวจ ไม่มีโค้ดแอป) ↔ workshop repo `C:\dev\multi-agent-workshop` (แอป Registry Insight — ผู้เรียนรัน claude ที่นี่)
- **ข้อมูลจริง**: นิติบุคคลจดทะเบียนใหม่ พ.ศ. 2558 (กรมพัฒนาธุรกิจการค้า) จาก data.go.th — 16,781 แถวดิบ → `data/raw/dbd-2558.parquet` + `data/warehouse.duckdb` + ตารางแบน `data/dataset.csv` (ดิบ)
- **ตัวเลขอ้างอิงหลังสะอาด**: **16,772 กิจการ / ทุนรวม 45,341,868,784 บาท** · ภาคนำ กลาง (31,680,888,983) · จังหวัดนำ กรุงเทพมหานคร (23,529,709,183) · แถวดิบ 16,781 = สะอาด 16,772 + หัวตาราง 9
- **MCP จริง**: `.mcp.json` ระดับโปรเจกต์ใน workshop repo → `uvx --python 3.12 mcp-server-motherduck --db-path data/warehouse.duckdb` (read-only by default · view `businesses_raw` ชี้ parquet)
- **Gate 6 เคส**: data-quality · summary-matches-valid-rows · bad-json-does-not-crash · health-no-secrets · notes-validation · notes-persists — เส้นทาง **0/6 (starter) → 2/6 (หลัง W3) → 6/6 (หลัง W4)**
- **เอเจนต์ครบ 6 ตัวสะสม**: data-researcher (W2) · planner+developer (W3) · qa (W4) · release-manager (W5) · writer (W9)
- **โหมดเรียน**: claude TUI ที่ workshop repo · **manual mode เสมอ** (shift+tab จนขึ้น "manual mode on" — วงจร auto→accept edits→plan→manual)
- **สองเอเจนต์**: `.claude/` เป็นของฝั่ง workshop · course repo ใช้ `.zcode/agents/workshop-coach.md` (ZCode ฝั่งผู้สอน — ตรวจสถานะ workshop แบบอ่านอย่างเดียว)
- ทุกคำสั่งในเอกสาร = `npm start` / `npm run gate` (ห้ามกลับไป `node server.js` / `node scripts/quality-gate.js`)

## 2. สิ่งที่ทำเสร็จแล้ว (push แล้วทั้งสอง repo)

### course repo — `Onto-IQ/build-ai-multi-agent-with-claude` @ `92a0514` (origin/main)
- [x] Two-repo split ครบ: ลบโค้ดแอปออก · verify-setup/catch-up/check-solutions retarget `WORKSHOP_DIR` (default `C:\dev\multi-agent-workshop`)
- [x] verify-setup ตรวจ 6 อย่าง: Lessons/ · workshop+parquet+.mcp.json · node · git · **duckdb** · **uvx** · port · boot · gate exit 2 — **PASSED**
- [x] renumber M1–M13 + W1–W9 · README/SETUP/instructor อัปเดต two-repo + ข้อมูลจริงทั้งหมด
- [x] Lab 0 มีขั้น clone workshop + ตาราง "สองโลก" · M2 เพิ่มขั้น `/init` onboard · SETUP.md เพิ่มติดตั้ง DuckDB CLI + uv
- [x] เฉลย w1–w9 สำหรับข้อมูลจริงครบ (w3 ส่ง `clean-export.sql` · w6 ส่ง `analysis.sql`+`ANALYSIS.md` · w4/w7/w9 server ฉบับแก้แล้ว) — **`node scripts/check-solutions.mjs` = PASS ทุกตัว**
- [x] instructor/scripts/prepare-dataset.mjs (ดาวน์โหลด CSV รายเดือน → TIS-620 → Parquet + warehouse.duckdb)
- [x] `.zcode/agents/workshop-coach.md` (ถูกระบบหยิบเป็น agent type แล้ว)
- [x] bulk replace `npm start`/`npm run gate` ทั้งคอร์ส · gitignore anchor `/.claude/` ที่ราก + track เฉพาะ `.zcode/agents/`

### workshop repo — `Onto-IQ/multi-agent-workshop` (2 branches, push แล้ว)
- [x] `main` = **starter สะอาด** `b3f093e` (gate แดง 0/6 ตามดีไซน์) — พร้อมแจกผู้เรียน
- [x] `walkthrough-wip` = `664e8e4` **สถานะ walkthrough W1–W5 ทั้งหมด**: agents 4 ตัว (data-researcher มี mcpServers, planner, developer, qa), release-manager ถูกสร้างแล้วใน branch นี้, skill release-checklist, docs ครบ (EXPLORATION-REPORT/TASKS/DESIGN/REVIEW/QA-REPORT พร้อม Evidence after fix), server.js ฉบับผ่าน 6/6, `scripts/clean-export.sql` + `data/dataset.csv` สะอาด, CLAUDE.md +32 บรรทัดจาก `/init`
- [x] พิสูจน์แล้วบนเครื่องนี้: W1 swarm 3 ตัวขนาน · W2 MCP query จริง (16,781/45,341,868,784) · W3 lead split 3 สาย → gate 2/6 · W4 qa 3 findings → fix → **gate 6/6** → re-verify append · W5 skill ถูกหยิบเอง + เช็กลิสต์ผ่าน 4/4 READY

## 3. สภาพแวดล้อม (เครื่องที่ทดสอบแล้ว — ใช้เป็นฐานติดตั้งเครื่องใหม่)

| เครื่องมือ | รุ่นที่ทดสอบ | หมายเหตุ |
|---|---|---|
| Node.js | 24.19.0 (ต่ำสุด 20) | |
| Git | 2.51.0.windows.1 | |
| Claude Code | 2.1.312 | ต่ำสุด 2.1.296 · login บัญชีคลาส · **ปิด `ANTHROPIC_API_KEY`** |
| DuckDB CLI | v2.0.0 | `winget install` ไม่มี — release v2.0.0 แจก **`.tar.gz`** (ไม่ใช่ zip) จาก duckdb.org เอา `duckdb.exe` ขึ้น PATH · ทดสอบ `duckdb --version` |
| uv (uvx) | 0.12.16 | `winget install astral-sh.uv` · run แรกโหลดแพ็ก ~1 นาที · `.mcp.json` pin `--python 3.12` แล้ว (**ห้ามเอาออก** — python ล่าสุดทำ `cryptography` build ล้มเพราะไม่มี Rust) |
| PowerShell | 5.1+ | สำหรับ TUI harness + payload ทดสอบ hook |
| TUI harness | `%TEMP%\tui2\` | **คัดลอกโฟลเดอร์นี้จากเครื่องเดิม** (tui2-run.ps1, tui2-lib.ps1, prompts/*.txt 41 ไฟล์ — ภาพ .png ข้ามได้) · ใน tui2-lib.ps1 มี 2 แพตช์สำคัญ: paste ด้วย `keybd_event` Ctrl+V (SendKeys `^v` ส่ง Ctrl ไม่ถึง Windows Terminal) และ guard `FOCUS-FAILED` |

## 4. งานค้าง — เรียงตามลำดับที่ต้องทำ

### 4.1 เตรียมเครื่องใหม่
1. ติดตั้งตามตารางข้างบน (Node, Git, Claude Code + login, DuckDB CLI, uv, PowerShell)
2. `git clone https://github.com/Onto-IQ/build-ai-multi-agent-with-claude` (course) และ `git clone https://github.com/Onto-IQ/multi-agent-workshop C:\dev\multi-agent-workshop`
3. คัดลอก `%TEMP%\tui2\` จากเครื่องเดิมมาไว้ `%TEMP%\tui2\` เครื่องใหม่ (ลบ *.png ได้)
4. ตรวจ: ที่ course repo รัน `node scripts/verify-setup.mjs --skip-claude` ต้องผ่านทุกบรรทัด · ที่ workshop รัน `npm run gate` ต้อง **แดง 0/6** บน main

### 4.2 Resume walkthrough (อยู่ที่ walkthrough-wip)
1. `cd C:\dev\multi-agent-workshop && git checkout walkthrough-wip`
2. เปิด TUI harness: `powershell -File $env:TEMP\tui2\tui2-run.ps1 -Action launch` → **กฎเหล็ก: ต้องมีหน้าต่าง claude เดียว** (เคยเจอ 2 หน้าต่างทำ focus/paste พลาด — kill ทิ้งเริ่มใหม่ และ lib มี guard FOCUS-FAILED แล้ว)
3. shift+tab จน "manual mode on" ก่อนส่งทุก prompt
4. เช็ค `.claude/agents/` มี 5 ตัว (data-researcher, planner, developer, qa, release-manager) — release-manager ถูกสร้างไว้แล้วใน branch นี้ แต่**ยังไม่ได้ invoke** (ขั้นแรกของ 4.3)

### 4.3 แล็บที่เหลือ (prompt ไฟล์อยู่ที่ `%TEMP%\tui2\prompts\` — ตรงกับ LAB.md ทุกตัวอักษร)

| ลำดับ | แล็บ | สิ่งที่ต้องทำ | ผลที่ต้องได้ | เวลาเครื่อง |
|---|---|---|---|---|
| 1 | **W5 ปิดท้าย** | send `w5-invoke.txt` → อนุมัติ Bash → ให้ release-manager เดินเช็กลิสต์เอง | รายงาน PASS/FAIL 4 ข้อ READY โดยไม่เอ่ยชื่อ skill | (ต้องวัด) |
| 2 | **W6 MCP ระดับทีม** | send `w6-query.txt` (SQL รายเดือนผ่าน MCP) → send `w6-analysis-create.txt` (สร้าง scripts/analysis.sql) → **รันเอง** `duckdb -c ".read scripts/analysis.sql"` → send `w6-analysis-md.txt` | `docs/region-capital.csv` 6 ภาค รวม 16,772 / 45,341,868,784 · กลาง 10,068 / 31,680,888,983 · ตรวจด้วย `node solutions/w6/check.js` ที่ course repo | (ต้องวัด) |
| 3 | **W7 Guardrails** | gate ยืนยัน 6/6 → send `w7-create-hook.txt` → ทดสอบ payload ด้วย PowerShell `UTF8Encoding($false)` + `Start-Process -RedirectStandardInput` (บล็อก `rm -rf data` = exit 2, ปล่อย `npm run gate` = exit 0) → cost gate ตาม LAB (under=0, over=3, tokens) | hook + settings.json + cost gate ครบ | (ต้องวัด) |
| 4 | **M10 Memory** | send `m10-memory-frontmatter.txt` → restart → send `m10-remember.txt` → restart → send `m10-check.txt` (อย่าเอ่ยคำว่า Express) | จดผลว่าเอเจนต์อ้างข้อตกลงข้ามเซสชันหรือไม่ (ไม่บล็อก) | (ต้องวัด) |
| 5 | **W8 Feature ของผู้เรียน** | คิด feature 1 ประโยค (ตัวอย่างใช้: ตารางทุนต่อจังหวัดใต้ตารางช่องทาง — prompt ใน `w8-planner.txt` แก้ `<FEATURE>` แล้ว) → send `w8-planner.txt` → send `w8-developer.txt` → **รัน gate เอง** → send `w8-qa.txt` | gate ยัง 6/6 · FEATURE-PLAN.md · QA-REPORT มีหัวข้อรับรอง | (ต้องวัด) |
| 6 | **W9 Capstone 6 บทบาท** | send `w9-create-writer.txt` → **restart** → send `w9-team.txt` (ลำดับ planner→researcher→developer+qa→writer) → รัน gate เอง → เทียบ EXECUTIVE-SUMMARY กับ `/api/summary` | `.claude/agents/` ครบ 6 · `docs/EXECUTIVE-SUMMARY.md` ไทย ยอดตรง API · ตรวจด้วย `node solutions/w9/check.js` | (ต้องวัด) |
| 7 | **M13 Preflight** | เช็กลิสต์ 5 ข้อ (gate 6/6, health ไม่มี sk-, key ว่าง, ปิด server) → ถ้าห้อง deploy จริง send `m13-deploy.txt` | URL จริง + commit หรือบันทึกว่าสาธิต | (ต้องวัด) |

### 4.4 Isolation check (หลังจบแล็บทุกตัว)
```bash
grep -ril "EXPLORATION-REPORT เขียน\|solutions/\|Lessons/\|LAB\.md\|workshop-coach" \
  "$USERPROFILE/.claude/projects/C--dev-multi-agent-workshop/" | head
```
- ผลที่ต้องได้: **ไม่มีไฟล์ transcript ของ workshop ตรงเงื่อนไข** (เอเจนต์ต้องไม่เคยเห็นบทเรียน/เฉลย) — ถ้าเจอ ให้ดูว่าเป็นคำจาก prompt ของผู้เรียนเองหรือรั่วจริง แล้วบันทึกหลักฐาน
- บันทึกเวลาเครื่องทุกแล็บลงตารางข้างบน (คอลัมน์ "เวลาเครื่อง") แล้วอัปเดต LAB.md ตามที่วัดจริง

### 4.5 Restore workshop กลับ starter (จบ walkthrough เท่านั้น)
```bash
cd C:\dev\multi-agent-workshop
git checkout main
git checkout walkthrough-wip -- .   # ห้าม! ใช้คำสั่งด้านล่างแทน
```
```bash
# วิธีที่ถูก: อยู่บน main แล้วล้างของ untracked ของ walkthrough
git clean -fd docs .claude scripts data/notes.json
git status --short        # ต้องว่าง
npm run gate              # ต้องแดง 0/6 อีกครั้ง
```
(ถ้า push main ไปแล้วไม่ต้อง push ซ้ำ — main บน origin เป็น starter อยู่แล้ว)

### 4.6 Phase F — Deck (หลัง walkthrough จบ)
- เรียง M1–M13 + W1–W9 ตามผังโมดูลใหม่ · สไลด์ใหม่ W3 (lead split) / W4 (3 findings) / W5 / W7 / W8 + หน้า agents 6 ตัว + หน้า two-repo + หน้าข้อมูลจริง data.go.th
- caption path → workshop repo (`C:\dev\multi-agent-workshop`) ทุกที่
- ภาพจาก walkthrough ใหม่ทั้งหมด (ภาพเด็คเก่าเป็น path เก่า Sales Insight — ทิ้ง)
- QA render: LibreOffice→PDF→pymupdf + visual-judge agent ก่อนปิดงาน

## 5. กับดักที่เจอจริง (อ่านก่อนเริ่ม — ประหยัดเวลาหลายชั่วโมง)

| กับดัก | อาการ | วิธีเลี่ยง |
|---|---|---|
| 2 หน้าต่าง claude | paste หาย / ไปโผล่อีกเซสชัน | **หน้าต่างเดียวเสมอ** — ก่อนส่งทุกครั้งเช็ค `tasklist` · lib มี guard FOCUS-FAILED แล้ว |
| SendKeys ส่ง Ctrl ไม่ถึง | ได้ตัว "v" เปล่า | tui2-lib.ps1 ใช้ `keybd_event` Ctrl+V แล้ว (แพตช์แล้ว — คัดลอก lib จากเครื่องนี้) |
| paste พังหลัง dialog | ตัวอักษรแปลก ("v") ลง input | restart หน้าต่าง (`-Action restart`) แล้ว shift+tab ใหม่ ค่อยส่ง |
| `:memory:` + read-only | MCP ล้ม "In-memory databases require --read-write" | ใช้ไฟล์ `data/warehouse.duckdb` (starter มีให้แล้ว) |
| duckdb version 69 | MCP อ่าน warehouse ไม่ได้ | warehouse ต้องสร้างด้วย DuckDB **1.4.x** (`DUCKDB_BIN` ใน prepare-dataset.mjs) — ไฟล์ใน repo ถูกต้องแล้ว ห้ามสร้างใหม่ด้วย CLI v2 |
| uvx python ล่าสุด | build cryptography ล้ม (ไม่มี Rust) | `.mcp.json` pin `--python 3.12` แล้ว — ห้ามเอาออก |
| node fetch data.go.th 404 | download ล้ม | มี User-Agent แล้ว + fallback ไฟล์ `%TEMP%\dbd-raw\` |
| subagent ไม่เห็น duckdb CLI | data track รัน SQL ไม่ได้ | **ตามดีไซน์** — ผู้เรียนรันเองที่เทอร์มินัล (`duckdb -c ".read scripts/clean-export.sql"`) |
| tool ชื่อ execute_query ใช้ `sql` | error missing argument | argument คือ `sql` ไม่ใช่ `query` |
| Developer เช็คผ่าน `node --check` อย่างเดียว | 500 ตอนรันจริง (เคส parseCsv) | สั่ง developer พิสูจน์ด้วย server จริง + curl เสมอ (LAB W4 มีข้อความนี้) |

## 6. เวลาเครื่องที่วัดได้แล้ว (อ้างอิงตอนวางตารางเวลา)

| งาน | เวลาจริง |
|---|---|
| `/init` (M2) | ~4 นาที (2 ครั้งอนุมัติ, +32 บรรทัด) |
| M2 explore + คำถาม swarm/seq | < 2 นาที |
| W1 swarm (3 agents + gate + เขียนไฟล์) | ~6 นาที (agents ตัวละ 10–12 วิ) |
| W2 ครบ (สร้าง+frontmatter+MCP query) | ~12 นาที |
| W3 ครบ (planner + lead 3 สาย + fix + review) | **~50 นาที** (data track เอาเดี่ยว 29 นาที · backend 15 · frontend 10 — ขนานกัน) |
| W4 ครบ (qa สืบสวน + fix + re-verify) | **~60 นาที** (re-verify อืดเพราะเก็บ server ตกค้างหลายรอบ) |
| W5 สร้าง skill + trigger walkthrough | ~8 นาที (ผ่าน 4/4 READY) |
| W5 สร้าง release-manager | ~3 นาที (ยังไม่รวม invoke — งานค้างข้อ 1) |

## 7. Cheat sheet — คำสั่งที่ใช้บ่อย

```bash
# ตรวจเครื่อง (course repo)
node scripts/verify-setup.mjs                 # ต้อง passed
node scripts/check-solutions.mjs              # ต้อง "PASS | solutions w1-w9"

# ที่ workshop repo
npm start                                     # เปิดแอป :3000
npm run gate                                  # main = แดง 0/6 · walkthrough-wip = 6/6
duckdb -c ".read scripts/clean-export.sql"    # W3: ทำ dataset.csv สะอาด
duckdb -c ".read scripts/analysis.sql"        # W6: region-capital.csv

# TUI harness
powershell -File $env:TEMP\tui2\tui2-run.ps1 -Action launch
powershell -File $env:TEMP\tui2\tui2-run.ps1 -Action send -Arg1 <prompt.txt> -Arg2 <tag> -Num 240
powershell -File $env:TEMP\tui2\tui2-run.ps1 -Action approve -Arg1 "~" -Arg2 <tag>
powershell -File $env:TEMP\tui2\tui2-run.ps1 -Action pending   # PENDING=true = มีกล่องขอสิทธิ์
powershell -File $env:TEMP\tui2\tui2-run.ps1 -Action restart -Arg2 <tag>
powershell -File $env:TEMP\tui2\tui2-run.ps1 -Action shot -Arg1 <name.png>

# กลับสู่ starter (จบ walkthrough)
cd C:\dev\multi-agent-workshop && git checkout main && git clean -fd docs .claude scripts
```
