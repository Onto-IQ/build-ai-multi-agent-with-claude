#!/usr/bin/env node
/**
 * Phase F teaching deck — two-repo + Registry Insight + M1–M13 / W1–W9.
 * Run: node scripts/build-phasef-deck.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import pptxgen from 'pptxgenjs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const shots = path.join(root, 'reference', 'screenshots');
const out = path.join(root, 'Build-AI-Multi-Agent-Claude-Code-9Expert-v2_updated.pptx');

const THEME = {
  name: 'Registry Insight Course',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '1A2332',
    lt1: 'FFFFFF',
    dk2: '2C3E50',
    lt2: 'F4F1EA',
    accent1: 'C45C26',
    accent2: '3D5A4C',
    accent3: '8B7355',
    accent4: '5B7C99',
    accent5: 'B8860B',
    accent6: '6B4F3A',
    hlink: '2C5F8A',
    folHlink: '1A2332',
  },
};

const C = {
  ink: '1A2332',
  muted: '5A6570',
  paper: 'F7F4EF',
  white: 'FFFFFF',
  accent: 'C45C26',
  forest: '3D5A4C',
  line: 'D9D2C5',
};

function img(name) {
  return path.join(shots, name);
}

async function main() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.author = '9Expert Training';
  pres.title = 'Build AI Multi-Agent with Claude Code';
  pres.subject = 'VIBE-CODE-L2 Phase F';
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };

  const addSection = (title) => {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    s.addText(title, {
      x: 0.7, y: 2.8, w: 12, h: 1.2,
      fontSize: 40, bold: true, color: C.white, margin: 0, isTextBox: true,
    });
    return s;
  };

  const content = (title) => {
    const s = pres.addSlide();
    s.background = { color: C.paper };
    s.addText(title, {
      x: 0.55, y: 0.35, w: 12.2, h: 0.55,
      fontSize: 28, bold: true, color: C.ink, margin: 0, isTextBox: true,
    });
    return s;
  };

  // --- Title ---
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    s.addText('9Expert · VIBE-CODE-L2', {
      x: 0.7, y: 1.6, w: 12, h: 0.4, fontSize: 16, color: C.accent, margin: 0, isTextBox: true,
    });
    s.addText('Build AI Multi-Agent\nwith Claude Code', {
      x: 0.7, y: 2.2, w: 12, h: 1.6, fontSize: 44, bold: true, color: C.white, margin: 0, isTextBox: true,
    });
    s.addText('Registry Insight · ข้อมูลจริง data.go.th · สอง repo · M1–M13 / W1–W9', {
      x: 0.7, y: 4.2, w: 12, h: 0.45, fontSize: 18, color: 'CADCFC', margin: 0, isTextBox: true,
    });
    s.addText('Phase F deck · path มาตรฐาน C:\\dev\\multi-agent-workshop', {
      x: 0.7, y: 6.7, w: 12, h: 0.35, fontSize: 14, color: '8A9BB0', margin: 0, isTextBox: true,
    });
  }

  addSection('สถาปัตยกรรมคอร์ส');

  {
    const s = content('สอง repo — บทเรียนแยกจากแอป');
    const cards = [
      { t: 'course repo', d: 'Lessons/ M1–M13 · solutions/w1–w9 · scripts ตรวจ\nไม่มีโค้ดแอป — เอเจนต์ผู้เรียนไม่เห็นเฉลย' },
      { t: 'workshop repo', d: 'C:\\dev\\multi-agent-workshop\nแอป Registry Insight · รัน claude ที่นี่ทั้งคอร์ส' },
    ];
    cards.forEach((c, i) => {
      const x = 0.55 + i * 6.3;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: 1.3, w: 5.9, h: 3.2, fill: { color: C.white }, rectRadius: 0.1,
        shadow: { type: 'outer', color: '000000', blur: 8, offset: 3, opacity: 0.08 },
      });
      s.addText(c.t, { x: x + 0.35, y: 1.55, w: 5.2, h: 0.5, fontSize: 22, bold: true, color: C.accent, margin: 0, isTextBox: true });
      s.addText(c.d, { x: x + 0.35, y: 2.25, w: 5.2, h: 1.8, fontSize: 16, color: C.ink, margin: 0, isTextBox: true });
    });
  }

  {
    const s = content('Initial Lab vs Phase F branch');
    s.addText([
      { text: 'main (Initial)', options: { bold: true, breakLine: true } },
      { text: 'starter แจกผู้เรียน · gate แดง 0/6 · ไม่มี .mcp.json · ไม่มี mcp/ ของเก่า', options: { breakLine: true } },
      { text: '', options: { breakLine: true } },
      { text: 'coach-walkthrough (Coach TUI จากต้นจนจบ)', options: { bold: true, breakLine: true } },
      { text: 'W1→W9 + M10/M13 ผ่าน Claude TUI · gate 0/6→2/6→6/6 · agents 6 · .mcp.json หลัง W6 · dashboard v2', options: { breakLine: true } },
      { text: '', options: { breakLine: true } },
      { text: 'phasef-deck', options: { bold: true, breakLine: true } },
      { text: 'สาขาทดสอบ UI redesign แยกจาก Initial (อย่าทับ main)', options: { breakLine: true } },
    ], { x: 0.55, y: 1.1, w: 12.2, h: 4.2, fontSize: 17, color: C.ink, margin: 0, isTextBox: true });
  }

  {
    const s = content('ข้อมูลจริง — DBD 2558 จาก data.go.th');
    const stats = [
      { n: '16,781', l: 'แถวดิบ' },
      { n: '16,772', l: 'กิจการหลังสะอาด' },
      { n: '45.3B', l: 'ทุนรวม (บาท)' },
      { n: '6/6', l: 'gate หลัง W4' },
    ];
    stats.forEach((st, i) => {
      const x = 0.55 + i * 3.15;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: 1.4, w: 2.95, h: 2.4, fill: { color: C.white }, rectRadius: 0.08,
      });
      s.addText(st.n, { x, y: 1.8, w: 2.95, h: 0.9, fontSize: 32, bold: true, color: C.accent, align: 'center', margin: 0, isTextBox: true });
      s.addText(st.l, { x: x + 0.15, y: 2.85, w: 2.65, h: 0.5, fontSize: 14, color: C.muted, align: 'center', margin: 0, isTextBox: true });
    });
    s.addText('ภาคนำ: กลาง 31,680,888,983 · จังหวัดนำ: กรุงเทพมหานคร', {
      x: 0.55, y: 4.2, w: 12.2, h: 0.4, fontSize: 16, color: C.ink, margin: 0, isTextBox: true,
    });
  }

  {
    const s = content('Quality gate — 6 เคส');
    s.addText('data-quality · summary-matches-valid-rows · bad-json-does-not-crash\nhealth-no-secrets · notes-validation · notes-persists', {
      x: 0.55, y: 1.2, w: 12.2, h: 1.0, fontSize: 18, color: C.ink, margin: 0, isTextBox: true,
    });
    s.addText('เส้นทาง:  0/6 (starter)  →  2/6 (หลัง W3)  →  6/6 (หลัง W4)', {
      x: 0.55, y: 2.5, w: 12.2, h: 0.5, fontSize: 20, bold: true, color: C.forest, margin: 0, isTextBox: true,
    });
    s.addText('คำสั่งในเอกสาร = npm start / npm run gate', {
      x: 0.55, y: 3.4, w: 12.2, h: 0.4, fontSize: 16, color: C.muted, margin: 0, isTextBox: true,
    });
  }

  addSection('กำหนดการ M1–M13');

  {
    const s = content('วันที่ 1 — พื้นฐานถึง Skills');
    const rows = [
      ['M1', 'ตั้งเครื่อง / Lab 0', 'clone สอง repo · verify-setup'],
      ['M2', 'สถาปัตยกรรม + /init', 'onboard CLAUDE.md'],
      ['M3 / W1', 'Swarm', 'สำรวจขนาน 3 สาย'],
      ['M4 / W2', 'Specialty agent', 'data-researcher — ยังไม่ต่อ MCP'],
      ['M5 / W3', 'Hybrid', 'แผน→Teammate data/be/fe→รีวิว'],
      ['M6 / W4', 'Fix + QA', 'gate → 6/6'],
      ['M7 / W5', 'Skills', 'release-manager + checklist'],
    ];
    s.addTable(
      [
        [
          { text: 'โมดูล', options: { bold: true, fill: { color: C.ink }, color: C.white } },
          { text: 'หัวข้อ', options: { bold: true, fill: { color: C.ink }, color: C.white } },
          { text: 'ผลหลัก', options: { bold: true, fill: { color: C.ink }, color: C.white } },
        ],
        ...rows.map((r) => r.map((c) => ({ text: c, options: { fill: { color: C.white }, color: C.ink } }))),
      ],
      { x: 0.55, y: 1.15, w: 12.2, colW: [1.6, 3.2, 7.4], border: [{ pt: 0.5, color: C.line }], fontSize: 13, fontFace: 'Calibri' },
    );
  }

  {
    const s = content('วันที่ 2 — MCP ถึง Deploy');
    const rows = [
      ['M8 / W6', 'MCP', 'สร้าง .mcp.json เอง · SQL · region-capital'],
      ['M9 / W7', 'Guardrails', 'hook + cost gate'],
      ['M10', 'Memory', 'memory: project'],
      ['M11 / W8', 'Feature', 'ตารางจังหวัด + โต้ตอบ'],
      ['M12 / W9', 'Capstone', 'ทีม 6 บทบาท · PRODUCT-SPEC v2'],
      ['M13', 'Preflight', 'gate / health / Vercel'],
    ];
    s.addTable(
      [
        [
          { text: 'โมดูล', options: { bold: true, fill: { color: C.ink }, color: C.white } },
          { text: 'หัวข้อ', options: { bold: true, fill: { color: C.ink }, color: C.white } },
          { text: 'ผลหลัก', options: { bold: true, fill: { color: C.ink }, color: C.white } },
        ],
        ...rows.map((r) => r.map((c) => ({ text: c, options: { fill: { color: C.white }, color: C.ink } }))),
      ],
      { x: 0.55, y: 1.15, w: 12.2, colW: [1.8, 2.8, 7.6], border: [{ pt: 0.5, color: C.line }], fontSize: 14, fontFace: 'Calibri' },
    );
  }

  addSection('Workshop สาระสำคัญ');

  {
    const s = content('W2 — Specialty agent (วันแรกยังไม่มี MCP)');
    s.addText('สร้าง .claude/agents/data-researcher.md · tools Read, Grep, Glob\nอธิบาย POST /api/notes ด้วย server.js:บรรทัด\n\n.mcp.json มาทีหลังใน M8 / W6 — starter ไม่มีไฟล์นี้', {
      x: 0.55, y: 1.3, w: 12.2, h: 3.5, fontSize: 20, color: C.ink, margin: 0, isTextBox: true,
    });
  }

  {
    const s = content('W5 — Skills + release-manager (TUI จริง)');
    s.addImage({ path: img('tui-01-manual-start.png'), x: 0.4, y: 1.1, w: 4.1, h: 2.7 });
    s.addImage({ path: img('tui-02-prompt-typed.png'), x: 4.6, y: 1.1, w: 4.1, h: 2.7 });
    s.addImage({ path: img('tui-05-report.png'), x: 8.8, y: 1.1, w: 4.1, h: 2.7 });
    s.addText('manual mode · prompt · รายงาน PASS/FAIL · path: C:\\dev\\multi-agent-workshop', {
      x: 0.55, y: 4.0, w: 12.2, h: 0.4, fontSize: 14, color: C.muted, margin: 0, isTextBox: true,
    });
  }

  {
    const s = content('W5 — permission dialogs');
    s.addImage({ path: img('tui-03-busy.png'), x: 0.5, y: 1.1, w: 6.0, h: 4.0 });
    s.addImage({ path: img('tui-04-dialog2.png'), x: 6.8, y: 1.1, w: 6.0, h: 4.0 });
  }

  {
    const s = content('W6 — สร้าง .mcp.json ในบท MCP (ไม่มากับ starter)');
    s.addText([
      { text: 'ผู้เรียน copy บล็อกจาก Lessons/08-mcp/LAB.md', options: { breakLine: true } },
      { text: 'uvx --python 3.12 mcp-server-motherduck --db-path data/warehouse.duckdb', options: { breakLine: true } },
      { text: 'อ่านอย่างเดียว · ห้าม --read-write · pin Python 3.12', options: { breakLine: true } },
      { text: 'อนุมัติใน TUI → ผูก mcpServers: data-duckdb → execute_query', options: { breakLine: true } },
    ], { x: 0.55, y: 1.3, w: 12.2, h: 3.2, fontSize: 18, color: C.ink, margin: 0, isTextBox: true });
  }

  {
    const s = content('ทีม 6 บทบาท (สะสมถึง W9)');
    const roles = ['data-researcher', 'planner', 'developer', 'qa', 'release-manager', 'writer'];
    roles.forEach((r, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 0.55 + col * 4.15;
      const y = 1.3 + row * 2.0;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 3.9, h: 1.6, fill: { color: C.white }, rectRadius: 0.08,
      });
      s.addText(r, {
        x: x + 0.25, y: y + 0.55, w: 3.4, h: 0.5,
        fontSize: 18, bold: true, color: C.ink, margin: 0, isTextBox: true,
      });
    });
  }

  addSection('Coach walkthrough — Claude TUI');

  {
    const s = content('Coach บน branch coach-walkthrough');
    s.addText('รัน W1–W9 + M10/M13 จาก Initial ผ่าน Claude TUI จริง · capture สำหรับเด็ค\nmain คงเป็น starter แดง · งานทั้งหมดอยู่บน coach-walkthrough', {
      x: 0.55, y: 1.15, w: 12.2, h: 1.0, fontSize: 18, color: C.ink, margin: 0, isTextBox: true,
    });
    const steps = [
      'W1 Explore + Agent Teams → EXPLORATION-REPORT + TEAMS-REVIEW',
      'W2 data-researcher + citations',
      'W3 planner/developer → gate 2/6',
      'W4 qa → developer → gate 6/6',
      'W5 skill + release-manager 4/4',
      'W6 .mcp.json + SQL + region-capital',
      'W7 hook + cost-gate',
      'W8 ตารางจังหวัด /api/provinces',
      'W9 ทีม 6 ตัว + EXEC summary',
    ];
    steps.forEach((t, i) => {
      const col = i < 5 ? 0 : 1;
      const row = i < 5 ? i : i - 5;
      s.addText(`• ${t}`, {
        x: 0.7 + col * 6.2, y: 2.3 + row * 0.55, w: 5.9, h: 0.5,
        fontSize: 15, color: C.ink, margin: 0, isTextBox: true,
      });
    });
  }

  {
    const s = content('TUI — เริ่มเซสชัน + สำรวจ W1');
    s.addImage({ path: img('coach-tui-00-launch.png'), x: 0.4, y: 1.05, w: 4.1, h: 2.7 });
    s.addImage({ path: img('coach-w1-approve.png'), x: 4.65, y: 1.05, w: 4.1, h: 2.7 });
    s.addImage({ path: img('coach-w1-report.png'), x: 8.9, y: 1.05, w: 4.1, h: 2.7 });
    s.addText('manual mode · อนุมัติเขียนไฟล์ · รายงานสามหัวข้อ', {
      x: 0.55, y: 4.0, w: 12.2, h: 0.4, fontSize: 15, color: C.muted, margin: 0, isTextBox: true,
    });
  }

  {
    const s = content('TUI — สร้างเอเจนต์ + เขียนรายงาน');
    s.addImage({ path: img('coach-w2-create-agent.webp'), x: 0.5, y: 1.1, w: 6.0, h: 4.0 });
    s.addImage({ path: img('coach-w1-wrote-report.webp'), x: 6.8, y: 1.1, w: 6.0, h: 4.0 });
  }

  {
    const s = content('TUI — Capstone release (W9)');
    s.addImage({ path: img('coach-w9-tui-final.webp'), x: 0.8, y: 1.05, w: 11.7, h: 5.2 });
  }

  addSection('Capstone — Registry Insight v2');

  {
    const s = content('PRODUCT-SPEC v2 — แดชบอร์ด 7 ส่วน + โต้ตอบ');
    s.addText('KPI 4 · /api/monthly SVG · แท่งภาค · ตารางจังหวัด (ค้น/เรียง/10·20·ทั้งหมด) · โน้ต · ฟุตเตอร์\nสลับแท่ง/เส้น · ตัวเลขจาก API เท่านั้น · gate ยัง 6/6 · Node http ล้วน', {
      x: 0.55, y: 1.2, w: 12.2, h: 1.4, fontSize: 18, color: C.ink, margin: 0, isTextBox: true,
    });
  }

  {
    const s = content('แดชบอร์ดจริง — ส่วนบน (coach-walkthrough)');
    s.addImage({ path: img('coach-dash-top.png'), x: 0.8, y: 1.05, w: 11.7, h: 5.5 });
  }

  {
    const s = content('แดชบอร์ดจริง — ทั้งหน้า (coach-walkthrough)');
    s.addImage({ path: img('coach-dash-full.png'), x: 1.8, y: 0.95, w: 9.7, h: 5.7 });
  }

  {
    const s = content('มือถือ + TUI พร้อม cwd มาตรฐาน');
    s.addImage({ path: img('v2-final-mobile.png'), x: 0.6, y: 1.1, w: 4.2, h: 5.4 });
    s.addImage({ path: img('phasef-tui-ready-cwd.png'), x: 5.3, y: 1.4, w: 7.4, h: 4.6 });
    s.addText('Claude Code · C:\\dev\\multi-agent-workshop', {
      x: 5.3, y: 6.2, w: 7.4, h: 0.35, fontSize: 14, color: C.muted, margin: 0, isTextBox: true,
    });
  }

  {
    const s = content('Gate 6/6 บน coach-walkthrough (ยืนยันแล้ว)');
    s.addText('PASS | data-quality\nPASS | bad-json-does-not-crash\nPASS | summary-matches-valid-rows\nPASS | health-no-secrets\nPASS | notes-validation\nPASS | notes-persists\n\nquality gate: 6/6 passed\nbranch: coach-walkthrough · M13 health {\"ok\":true} · ANTHROPIC_API_KEY ว่าง', {
      x: 0.55, y: 1.15, w: 12.2, h: 5.2, fontSize: 18, color: C.forest, fontFace: 'Consolas', margin: 0, isTextBox: true,
    });
  }

  addSection('ปิดคอร์ส');

  {
    const s = content('Best practices สั้น ๆ');
    const items = [
      'เปิด claude จาก workshop เท่านั้น — ไม่ใช่ course repo',
      'manual mode ในห้องเรียน · อนุมัติ Bash/เขียนไฟล์เอง',
      'อย่า sync dataset สะอาดลง main (starter ต้องแดง data-quality)',
      'MCP สร้างใน W6 · อย่าใส่ .mcp.json ใน Initial starter',
      'หลักฐานจาก npm run gate / duckdb — ไม่เชื่อคำบอกอย่างเดียว',
    ];
    items.forEach((t, i) => {
      s.addText(`${i + 1}.  ${t}`, {
        x: 0.7, y: 1.25 + i * 0.75, w: 12, h: 0.6,
        fontSize: 18, color: C.ink, margin: 0, isTextBox: true,
      });
    });
  }

  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    s.addText('พร้อมสอน', {
      x: 0.7, y: 2.5, w: 12, h: 0.9, fontSize: 44, bold: true, color: C.white, margin: 0, isTextBox: true,
    });
    s.addText('course: Lessons/ · workshop main = Initial · coach-walkthrough = Coach TUI จบคอร์ส', {
      x: 0.7, y: 3.6, w: 12, h: 0.5, fontSize: 18, color: 'CADCFC', margin: 0, isTextBox: true,
    });
    s.addText('github.com/Onto-IQ/build-ai-multi-agent-with-claude\ngithub.com/Onto-IQ/multi-agent-workshop', {
      x: 0.7, y: 4.5, w: 12, h: 0.9, fontSize: 16, color: '8A9BB0', margin: 0, isTextBox: true,
    });
  }

  await pres.writeFile({ fileName: out });

  // applyTheme if available
  try {
    const skillDir = path.join(
      process.env.USERPROFILE || '',
      '.claude/skills/synced/be6fab03-8c88-4497-8296-a6e84b0846e0_146d45e7-bf31-4133-bd3c-7f1b82987ce9/pptx/scripts',
    );
    const { applyTheme } = require(path.join(skillDir, 'apply_theme.js'));
    await applyTheme(out, THEME);
    console.log('theme applied');
  } catch (err) {
    console.warn('applyTheme skipped:', err.message);
  }

  console.log('wrote', out);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
