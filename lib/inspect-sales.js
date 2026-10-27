'use strict';

/**
 * Data-quality spec for the starter sales file.
 * Flags problems. Does not write a cleaned file — that is Workshop 4.
 */

const { parseCsv } = require('./csv');

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

const CHANNELS = {
  สาขา: 'สาขา',
  shopee: 'Shopee',
  lazada: 'Lazada',
  line: 'LINE',
};

const FATAL = new Set([
  'missing-order-id',
  'duplicate-order-id',
  'bad-date',
  'missing-province',
  'unknown-province',
  'missing-product',
  'bad-channel',
  'bad-qty',
  'bad-price',
  'bad-discount',
]);

function isValidYmd(year, month, day) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function parseDate(raw) {
  const text = String(raw ?? '').trim();
  let year;
  let month;
  let day;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else if (dmy) {
    day = Number(dmy[1]);
    month = Number(dmy[2]);
    year = Number(dmy[3]);
  } else {
    return null;
  }
  if (year >= 2400) year -= 543;
  if (!isValidYmd(year, month, day)) return null;
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function parseMoney(raw) {
  let text = String(raw ?? '').trim().replace(/฿/g, '').replace(/\s/g, '');
  if (!text) return null;
  const hasComma = text.includes(',');
  const hasDot = text.includes('.');
  if (hasComma && hasDot) {
    if (text.lastIndexOf(',') > text.lastIndexOf('.')) {
      text = text.replace(/\./g, '').replace(',', '.');
    } else {
      text = text.replace(/,/g, '');
    }
  } else if (hasComma) {
    const parts = text.split(',');
    if (parts.length === 2 && parts[1].length > 0 && parts[1].length <= 2) {
      text = `${parts[0]}.${parts[1]}`;
    } else {
      text = text.replace(/,/g, '');
    }
  }
  if (!/^\d+(\.\d+)?$/.test(text)) return null;
  const value = Number(text);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100) / 100;
}

function parseQty(raw) {
  const text = String(raw ?? '').trim();
  if (!/^[1-9]\d*$/.test(text)) return null;
  return Number(text);
}

function parseDiscount(raw) {
  const text = String(raw ?? '').trim();
  if (text === '') return 0;
  if (!/^\d+(\.\d+)?$/.test(text)) return null;
  const value = Number(text);
  if (value < 0 || value > 100) return null;
  return value;
}

function canonicalChannel(raw) {
  const key = String(raw ?? '').trim().toLowerCase();
  return CHANNELS[key] || null;
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function lineRevenue(qty, price, discount) {
  return roundMoney(qty * price * (1 - discount / 100));
}

function issuesFor(record, seen) {
  const issues = [];
  const orderId = String(record.order_id ?? '').trim();
  if (!orderId) {
    issues.push('missing-order-id');
  } else if (seen.has(orderId)) {
    issues.push('duplicate-order-id');
  } else {
    seen.add(orderId);
  }

  const iso = parseDate(record.order_date);
  if (!iso) issues.push('bad-date');
  else if (String(record.order_date ?? '').trim() !== iso) issues.push('date-format');

  const province = String(record.province ?? '').trim();
  const region = String(record.region ?? '').trim();
  if (!province) {
    issues.push('missing-province');
  } else if (!PROVINCE_REGION[province]) {
    issues.push('unknown-province');
  } else if (region !== PROVINCE_REGION[province]) {
    issues.push('region-mismatch');
  }

  const productRaw = String(record.product ?? '');
  const product = productRaw.trim();
  if (!product) issues.push('missing-product');
  else if (productRaw !== product) issues.push('product-whitespace');

  const channel = canonicalChannel(record.channel);
  if (!channel) issues.push('bad-channel');
  else if (String(record.channel ?? '').trim() !== channel) issues.push('channel-format');

  if (parseQty(record.qty) === null) issues.push('bad-qty');
  const price = parseMoney(record.unit_price_thb);
  if (price === null) issues.push('bad-price');
  else if (!/^\d+(\.\d{1,2})?$/.test(String(record.unit_price_thb ?? '').trim())) issues.push('money-format');
  if (parseDiscount(record.discount_pct) === null) issues.push('bad-discount');

  return issues;
}

function summarize(rows) {
  const byRegion = {};
  const byChannel = {};
  const byProduct = {};
  let totalRevenue = 0;
  for (const row of rows) {
    totalRevenue = roundMoney(totalRevenue + row.revenue);
    byRegion[row.region] = roundMoney((byRegion[row.region] || 0) + row.revenue);
    byChannel[row.channel] = roundMoney((byChannel[row.channel] || 0) + row.revenue);
    byProduct[row.product] = roundMoney((byProduct[row.product] || 0) + row.revenue);
  }
  const top = (map) => Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'th'))[0] || null;
  return {
    orderCount: rows.length,
    totalRevenue: roundMoney(totalRevenue),
    byRegion,
    byChannel,
    byProduct,
    topRegion: top(byRegion),
    topChannel: top(byChannel),
    topProduct: top(byProduct),
  };
}

function analyze(csvText) {
  const { header, records } = parseCsv(csvText);
  const violations = [];
  const asIsRows = [];
  const required = ['order_id', 'order_date', 'region', 'province', 'channel', 'product', 'qty', 'unit_price_thb', 'discount_pct'];
  for (const name of required) {
    if (!header.includes(name)) {
      violations.push({ line: 1, orderId: '', code: 'bad-header', detail: name });
    }
  }

  const seen = new Set();
  for (const record of records) {
    const codes = issuesFor(record, seen);
    for (const code of codes) {
      violations.push({
        line: record.__line,
        orderId: String(record.order_id ?? '').trim(),
        code,
      });
    }
    if (codes.length > 0) continue;
    const qty = parseQty(record.qty);
    const price = parseMoney(record.unit_price_thb);
    const discount = parseDiscount(record.discount_pct);
    asIsRows.push({
      orderId: String(record.order_id).trim(),
      orderDate: String(record.order_date).trim(),
      region: String(record.region).trim(),
      province: String(record.province).trim(),
      channel: String(record.channel).trim(),
      product: String(record.product).trim(),
      qty,
      unitPrice: price,
      discountPct: discount,
      revenue: lineRevenue(qty, price, discount),
    });
  }

  const counts = {};
  for (const item of violations) counts[item.code] = (counts[item.code] || 0) + 1;

  return {
    violations,
    counts,
    asIsRows,
    stats: summarize(asIsRows),
  };
}

module.exports = {
  PROVINCE_REGION,
  FATAL,
  analyze,
  parseDate,
  parseMoney,
  parseQty,
  parseDiscount,
  canonicalChannel,
  lineRevenue,
  roundMoney,
  summarize,
};
