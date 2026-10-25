#!/usr/bin/env node
'use strict';

/**
 * Workshop 4 reference cleaner.
 * Reads a messy sales CSV and writes rows that pass the quality spec.
 * Usage: node clean-sales.js <input.csv> <output.csv>
 */

const fs = require('fs');

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

function isValidYmd(year, month, day) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function parseDate(raw) {
  const text = String(raw ?? '').trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  let year;
  let month;
  let day;
  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else if (dmy) {
    day = Number(dmy[1]);
    month = Number(dmy[2]);
    year = Number(dmy[3]);
  } else return null;
  if (year >= 2400) year -= 543;
  if (!isValidYmd(year, month, day)) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseMoney(raw) {
  let text = String(raw ?? '').trim().replace(/฿/g, '').replace(/\s/g, '');
  if (!text) return null;
  const hasComma = text.includes(',');
  const hasDot = text.includes('.');
  if (hasComma && hasDot) {
    if (text.lastIndexOf(',') > text.lastIndexOf('.')) text = text.replace(/\./g, '').replace(',', '.');
    else text = text.replace(/,/g, '');
  } else if (hasComma) {
    const parts = text.split(',');
    if (parts.length === 2 && parts[1].length > 0 && parts[1].length <= 2) text = `${parts[0]}.${parts[1]}`;
    else text = text.replace(/,/g, '');
  }
  if (!/^\d+(\.\d+)?$/.test(text)) return null;
  const value = Number(text);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100) / 100;
}

function formatMoney(value) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function clean(text) {
  const seen = new Set();
  const kept = [];
  for (const record of parseCsv(text)) {
    const orderId = String(record.order_id ?? '').trim();
    if (!orderId || seen.has(orderId)) continue;
    seen.add(orderId);
    const orderDate = parseDate(record.order_date);
    const province = String(record.province ?? '').trim();
    const region = PROVINCE_REGION[province];
    const product = String(record.product ?? '').trim();
    const channel = CHANNELS[String(record.channel ?? '').trim().toLowerCase()];
    const qtyText = String(record.qty ?? '').trim();
    const qty = /^[1-9]\d*$/.test(qtyText) ? Number(qtyText) : null;
    const price = parseMoney(record.unit_price_thb);
    const discountText = String(record.discount_pct ?? '').trim();
    const discount = discountText === '' ? 0 : /^\d+(\.\d+)?$/.test(discountText) ? Number(discountText) : null;
    const discountOk = discount !== null && discount >= 0 && discount <= 100;
    if (!orderDate || !region || !product || !channel || qty === null || price === null || !discountOk) continue;
    kept.push([orderId, orderDate, region, province, channel, product, String(qty), formatMoney(price), formatMoney(discount)]);
  }
  const header = 'order_id,order_date,region,province,channel,product,qty,unit_price_thb,discount_pct';
  return `${header}\n${kept.map((cells) => cells.join(',')).join('\n')}\n`;
}

function main() {
  const input = process.argv[2];
  const output = process.argv[3];
  if (!input || !output) {
    console.error('usage: node clean-sales.js <input.csv> <output.csv>');
    process.exit(2);
  }
  const cleaned = clean(fs.readFileSync(input, 'utf8'));
  fs.writeFileSync(output, cleaned);
  const orders = cleaned.trim().split(/\n/).length - 1;
  console.log(`clean-sales: wrote ${orders} orders to ${output}`);
}

if (require.main === module) main();

module.exports = { clean };
