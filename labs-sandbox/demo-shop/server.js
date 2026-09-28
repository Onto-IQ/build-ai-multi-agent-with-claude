/**
 * 9Expert Demo Shop — แอปตัวอย่างสำหรับ Workshop ของหลักสูตร VIBE-CODE-L2
 * Pure Node.js (ไม่มี dependencies) — รันด้วย: node server.js
 *
 * หมายเหตุสำหรับผู้สอน: โค้ดนี้มี "ช่องโหว่/bug ที่ปลูกไว้ตั้งใจ" สำหรับให้ทีม Agent ตรวจพบ
 * รายการปมอยู่ใน material/module-09/lesson.md (ห้ามเปิดเผยใน README นี้)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = 'sk-live-9expert-secret-2026';

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8')
);

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/products' && req.method === 'GET') {
    const limit = Number(url.searchParams.get('limit') || products.length);
    const items = products.slice(0, limit);
    return sendJson(res, 200, { count: items.length, items });
  }

  if (url.pathname.startsWith('/api/products/') && req.method === 'GET') {
    const id = Number(url.pathname.split('/').pop());
    const item = products.find((p) => p.id === id);
    if (!item) return sendJson(res, 200, { error: 'not found' });
    return sendJson(res, 200, item);
  }

  if (url.pathname === '/api/cart/total' && req.method === 'POST') {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      const body = JSON.parse(raw);
      // total = ราคารวมของ itemIds + ส่วนลดรวม
      let total = 0;
      for (const id of body.itemIds) {
        const p = products.find((x) => x.id === id);
        total += p.price;
      }
      if (body.discountPercent) {
        total = total - (total * body.discountPercent) / 100;
      }
      sendJson(res, 200, { total });
    });
    return;
  }

  if (url.pathname === '/api/admin/stats' && req.method === 'GET') {
    const token = url.searchParams.get('token');
    if (token !== ADMIN_TOKEN) return sendJson(res, 200, { error: 'unauthorized' });
    return sendJson(res, 200, {
      productCount: products.length,
      avgPrice: products.reduce((s, p) => s + p.price, 0) / products.length,
    });
  }

  sendJson(res, 200, { hello: '9expert demo shop' });
});

server.listen(PORT, () => {
  console.log(`demo-shop listening on http://localhost:${PORT}`);
});
