'use strict';

const PROVINCE_REGION = {
  เชียงใหม่: 'เหนือ',
  เชียงราย: 'เหนือ',
  ขอนแก่น: 'ตะวันออกเฉียงเหนือ',
  นครราชสีมา: 'ตะวันออกเฉียงเหนือ',
  กรุงเทพมหานคร: 'กลาง',
  นนทบุรี: 'กลาง',
  ชลบุรี: 'ตะวันออก',
  ระยอง: 'ตะวันออก',
  สุราษฎร์ธานี: 'ใต้',
  สงขลา: 'ใต้',
  กาญจนบุรี: 'ตะวันตก',
};

function parseCsv(text) {
  const src = String(text).replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const table = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i += 1;
        } else inQuotes = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      table.push(row);
      row = [];
      field = '';
    } else field += ch;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    table.push(row);
  }
  const filtered = table.filter((cells) => cells.some((cell) => String(cell).trim() !== ''));
  const header = filtered[0].map((cell) => cell.trim());
  return filtered.slice(1).map((cells) => {
    const record = {};
    header.forEach((name, index) => {
      record[name] = cells[index] === undefined ? '' : cells[index];
    });
    return record;
  });
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function topEntry(map) {
  const found = Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'th'))[0];
  if (!found) return null;
  return { name: found[0], revenue: found[1] };
}

function buildSummary(csvText) {
  const byRegion = {};
  const byChannel = {};
  const byProduct = {};
  let totalRevenue = 0;
  let orderCount = 0;
  for (const record of parseCsv(csvText)) {
    const qty = Number(String(record.qty).trim());
    const price = Number(String(record.unit_price_thb).trim());
    const discount = Number(String(record.discount_pct).trim());
    if (!Number.isFinite(qty) || !Number.isFinite(price) || !Number.isFinite(discount)) continue;
    const revenue = roundMoney(qty * price * (1 - discount / 100));
    totalRevenue = roundMoney(totalRevenue + revenue);
    orderCount += 1;
    const region = PROVINCE_REGION[String(record.province).trim()] || String(record.region).trim();
    const channel = String(record.channel).trim();
    const product = String(record.product).trim();
    byRegion[region] = roundMoney((byRegion[region] || 0) + revenue);
    byChannel[channel] = roundMoney((byChannel[channel] || 0) + revenue);
    byProduct[product] = roundMoney((byProduct[product] || 0) + revenue);
  }
  const asList = (map) => Object.entries(map)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue || a.name.localeCompare(b.name, 'th'));
  return {
    orderCount,
    totalRevenue,
    topRegion: topEntry(byRegion),
    topChannel: topEntry(byChannel),
    topProduct: topEntry(byProduct),
    byRegion: asList(byRegion),
    byChannel: asList(byChannel),
    byProduct: asList(byProduct),
    source: 'workshop-6',
  };
}

module.exports = { buildSummary };
