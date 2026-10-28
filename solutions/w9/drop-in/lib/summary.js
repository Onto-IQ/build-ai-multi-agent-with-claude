'use strict';

/**
 * Shared release summary over the cleaned dataset (data/dataset.csv).
 * The same module backs GET /api/summary and the Vercel function in
 * api/summary.js, so the dashboard, the gate, and production always agree.
 */

const PROVINCE_REGION = {
  กรุงเทพมหานคร: 'กลาง', นนทบุรี: 'กลาง', ปทุมธานี: 'กลาง', พระนครศรีอยุธยา: 'กลาง',
  อ่างทอง: 'กลาง', ลพบุรี: 'กลาง', สิงห์บุรี: 'กลาง', ชัยนาท: 'กลาง', สระบุรี: 'กลาง',
  สุพรรณบุรี: 'กลาง', นครปฐม: 'กลาง', สมุทรปราการ: 'กลาง', สมุทรสาคร: 'กลาง',
  สมุทรสงคราม: 'กลาง', นครนายก: 'กลาง',
  ชลบุรี: 'ตะวันออก', ระยอง: 'ตะวันออก', จันทบุรี: 'ตะวันออก', ตราด: 'ตะวันออก',
  ฉะเชิงเทรา: 'ตะวันออก', ปราจีนบุรี: 'ตะวันออก', สระแก้ว: 'ตะวันออก',
  กาญจนบุรี: 'ตะวันตก', เพชรบุรี: 'ตะวันตก', ประจวบคีรีขันธ์: 'ตะวันตก', ราชบุรี: 'ตะวันตก',
  เชียงใหม่: 'เหนือ', ลำพูน: 'เหนือ', ลำปาง: 'เหนือ', อุตรดิตถ์: 'เหนือ', แพร่: 'เหนือ',
  น่าน: 'เหนือ', พะเยา: 'เหนือ', เชียงราย: 'เหนือ', แม่ฮ่องสอน: 'เหนือ',
  นครสวรรค์: 'เหนือ', อุทัยธานี: 'เหนือ', กำแพงเพชร: 'เหนือ', ตาก: 'เหนือ',
  สุโขทัย: 'เหนือ', พิษณุโลก: 'เหนือ', พิจิตร: 'เหนือ', เพชรบูรณ์: 'เหนือ',
  ขอนแก่น: 'อีสาน', อุดรธานี: 'อีสาน', หนองบัวลำภู: 'อีสาน', หนองคาย: 'อีสาน',
  บึงกาฬ: 'อีสาน', เลย: 'อีสาน', มหาสารคาม: 'อีสาน', ร้อยเอ็ด: 'อีสาน',
  กาฬสินธุ์: 'อีสาน', สกลนคร: 'อีสาน', นครพนม: 'อีสาน', มุกดาหาร: 'อีสาน',
  ชัยภูมิ: 'อีสาน', นครราชสีมา: 'อีสาน', บุรีรัมย์: 'อีสาน', สุรินทร์: 'อีสาน',
  ศรีสะเกษ: 'อีสาน', อุบลราชธานี: 'อีสาน', ยโสธร: 'อีสาน', อำนาจเจริญ: 'อีสาน',
  นครศรีธรรมราช: 'ใต้', กระบี่: 'ใต้', พังงา: 'ใต้', สุราษฎร์ธานี: 'ใต้', พัทลุง: 'ใต้',
  สงขลา: 'ใต้', สตูล: 'ใต้', ตรัง: 'ใต้', ภูเก็ต: 'ใต้', ปัตตานี: 'ใต้',
  ยะลา: 'ใต้', นราธิวาส: 'ใต้', ชุมพร: 'ใต้', ระนอง: 'ใต้',
};

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function topEntry(map) {
  const found = Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'th'))[0];
  if (!found) return null;
  return { name: found[0], revenue: found[1] };
}

function buildSummary(records) {
  const byProvince = {};
  const byRegion = {};
  const byMonth = {};
  let totalCapital = 0;
  let companyCount = 0;
  for (const record of records) {
    const regNo = String(record.reg_no || '').trim();
    const capital = Number(String(record.capital || '').replace(/[,\s]/g, ''));
    const regDate = String(record.reg_date || '').trim();
    const name = String(record.company_name || '').trim();
    const province = String(record.province || '').trim();
    if (!/^\d{13}$/.test(regNo)) continue;
    if (!Number.isFinite(capital) || capital < 0) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(regDate)) continue;
    if (!name) continue;
    if (!PROVINCE_REGION[province]) continue;
    totalCapital = roundMoney(totalCapital + capital);
    companyCount += 1;
    byProvince[province] = roundMoney((byProvince[province] || 0) + capital);
    byRegion[PROVINCE_REGION[province]] = roundMoney((byRegion[PROVINCE_REGION[province]] || 0) + capital);
    byMonth[record.month] = roundMoney((byMonth[record.month] || 0) + capital);
  }
  const asList = (map) => Object.entries(map)
    .map(([name2, revenue]) => ({ name: name2, revenue }))
    .sort((a, b) => b.revenue - a.revenue || a.name.localeCompare(b.name, 'th'));
  return {
    companyCount,
    totalCapital,
    topProvince: topEntry(byProvince),
    topRegion: topEntry(byRegion),
    byRegion: asList(byRegion),
    byProvince: asList(byProvince).slice(0, 10),
    byMonth: asList(byMonth),
    source: 'registry-insight-release',
  };
}

module.exports = { buildSummary, PROVINCE_REGION };
