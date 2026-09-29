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
// ⚠️ FAKE token — ปลูกไว้ตั้งใจเพื่อสอน (Module 9) ไม่ใช่ key จริงของผู้ให้บริการใด
const ADMIN_TOKEN = 'sk-live-9expert-secret-2026';

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8')
);

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

const MAX_BODY_BYTES = 8192;
const MAX_NAME_LENGTH = 120;
const MAX_AMOUNT = 1000000;
const ALLOWED_FIELDS = ['name', 'price', 'stock'];

function errorBody(code, message, details) {
  return { error: { code, message, details } };
}

// DESIGN.md §5 — collects every failing rule (V2-V5) so one round-trip tells
// the client all that is wrong. V1 is handled by the caller: it is about the
// body as a whole, not a field. Order of details follows V2 -> V5.
function validateProduct(body) {
  const details = [];

  if (body.name === undefined || body.name === null) {
    details.push({ field: 'name', rule: 'REQUIRED_NON_EMPTY_STRING' });
  } else if (typeof body.name !== 'string') {
    details.push({ field: 'name', rule: 'TYPE_STRING' });
  } else if (body.name.trim() === '') {
    details.push({ field: 'name', rule: 'REQUIRED_NON_EMPTY_STRING' });
  } else if (body.name.trim().length > MAX_NAME_LENGTH) {
    details.push({ field: 'name', rule: 'LENGTH_TOO_LONG' });
  }

  if (body.price === undefined || body.price === null) {
    details.push({ field: 'price', rule: 'REQUIRED_NUMBER' });
  } else if (typeof body.price !== 'number' || !Number.isFinite(body.price)) {
    details.push({ field: 'price', rule: 'TYPE_NUMBER' });
  } else if (body.price <= 0) {
    details.push({ field: 'price', rule: 'NUMBER_NOT_POSITIVE' });
  } else if (body.price > MAX_AMOUNT) {
    details.push({ field: 'price', rule: 'NUMBER_TOO_LARGE' });
  }

  if (body.stock === undefined || body.stock === null) {
    details.push({ field: 'stock', rule: 'REQUIRED_INTEGER' });
  } else if (!Number.isInteger(body.stock)) {
    details.push({ field: 'stock', rule: 'TYPE_INTEGER' });
  } else if (body.stock < 0) {
    details.push({ field: 'stock', rule: 'INTEGER_NEGATIVE' });
  } else if (body.stock > MAX_AMOUNT) {
    details.push({ field: 'stock', rule: 'INTEGER_TOO_LARGE' });
  }

  if (Object.prototype.hasOwnProperty.call(body, 'id')) {
    details.push({ field: 'id', rule: 'FORBIDDEN_FIELD' });
  }

  // 'id' is reported above as FORBIDDEN_FIELD, so it must not also be UNKNOWN_FIELD.
  for (const key of Object.keys(body)) {
    if (!ALLOWED_FIELDS.includes(key) && key !== 'id') {
      details.push({ field: key, rule: 'UNKNOWN_FIELD' });
    }
  }

  return details;
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
    if (!item) return sendJson(res, 404, errorBody('NOT_FOUND', `no product with id ${id}`, []));
    return sendJson(res, 200, item);
  }

  if (url.pathname === '/api/products' && req.method === 'POST') {
    let raw = '';
    let responded = false;
    req.on('data', (c) => {
      if (responded) return;
      raw += c;
      if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
        responded = true;
        sendJson(res, 400, errorBody('BODY_TOO_LARGE', 'request body exceeds 8192 bytes', []));
      }
    });
    req.on('end', () => {
      if (responded) return;
      responded = true;

      let body;
      try {
        body = JSON.parse(raw);
      } catch (err) {
        return sendJson(res, 400, errorBody('INVALID_JSON', 'request body must be valid JSON', []));
      }
      if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        return sendJson(res, 400, errorBody('INVALID_JSON', 'request body must be valid JSON', []));
      }

      const details = validateProduct(body);
      if (details.length > 0) {
        return sendJson(res, 400, errorBody('VALIDATION_FAILED', 'product failed validation', details));
      }

      try {
        const name = body.name.trim();
        const id = products.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1;
        const product = { id, name, price: body.price, stock: body.stock };
        products.push(product);
        res.writeHead(201, {
          'Content-Type': 'application/json; charset=utf-8',
          Location: `/api/products/${id}`,
        });
        res.end(JSON.stringify(product));
      } catch (err) {
        console.error('POST /api/products failed:', err);
        sendJson(res, 500, errorBody('INTERNAL_ERROR', 'internal error while creating product', []));
      }
    });
    return;
  }

  if (url.pathname.startsWith('/api/products/') && req.method === 'POST') {
    return sendJson(res, 404, errorBody('NOT_FOUND', 'no route for this method and path', []));
  }

  if (url.pathname === '/api/cart/total' && req.method === 'POST') {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      let body;
      try {
        body = JSON.parse(raw);
      } catch (err) {
        return sendJson(res, 400, errorBody('INVALID_JSON', 'request body must be valid JSON', []));
      }
      if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        return sendJson(res, 400, errorBody('INVALID_JSON', 'request body must be a JSON object', []));
      }
      if (!Array.isArray(body.itemIds)) {
        return sendJson(res, 400, errorBody('VALIDATION_FAILED', 'itemIds must be an array of product ids', [
          { field: 'itemIds', rule: 'TYPE_ARRAY' },
        ]));
      }

      // total = ราคารวมของ itemIds + ส่วนลดรวม
      let total = 0;
      for (const id of body.itemIds) {
        const p = products.find((x) => x.id === id);
        if (!p) {
          return sendJson(res, 404, errorBody('NOT_FOUND', `no product with id ${id}`, []));
        }
        total += p.price;
      }
      const discountPercent = Number(body.discountPercent);
      if (Number.isFinite(discountPercent) && discountPercent !== 0) {
        const clamped = Math.min(100, Math.max(0, discountPercent));
        total = total - (total * clamped) / 100;
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

  // ── PRODUCT-SPEC §5 — static handler (web/) ─────────────────────────────
  // Placed after every /api/* branch and before the hello catch-all below.
  // No /api/* line above was touched or reordered.
  const WEB_ROOT = path.join(__dirname, 'web');

  // Route -> file in web/. Names are literals from this table, never user input,
  // so nothing can resolve outside web/; the prefix check below is belt-and-braces
  // (§5 note 1: do not rely on URL normalisation for %2e%2e%2f-style requests).
  // Anything not listed falls through to the catch-all, unchanged (§5, §8 note 2).
  const staticFile = (() => {
    const p = url.pathname;
    if (p === '/') return 'index.html';
    if (p === '/products') return 'products.html';
    if (p === '/cart') return 'cart.html';
    if (p.startsWith('/product/')) return 'product.html'; // :id parsed client-side
    if (p === '/styles.css') return 'styles.css';
    if (p === '/app.js') return 'app.js';
    return null;
  })();

  if (staticFile) {
    const notFound = () => {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('not found');
    };

    const resolved = path.resolve(WEB_ROOT, staticFile);
    const rel = path.relative(WEB_ROOT, resolved);
    if (!rel || rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) {
      return notFound(); // path would escape web/
    }

    const contentType = rel.endsWith('.css')
      ? 'text/css'
      : rel.endsWith('.js')
        ? 'text/javascript'
        : 'text/html; charset=utf-8'; // page routes are .html

    fs.readFile(resolved, (err, buf) => {
      if (err) {
        // web/ may not exist yet (frontend owns it) -> 404, never crash.
        if (err.code === 'ENOENT') return notFound();
        console.error('static read failed:', resolved, err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('internal server error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': buf.length });
      res.end(buf);
    });
    return;
  }

  sendJson(res, 200, { hello: '9expert demo shop' });
});

server.listen(PORT, () => {
  console.log(`demo-shop listening on http://localhost:${PORT}`);
});
