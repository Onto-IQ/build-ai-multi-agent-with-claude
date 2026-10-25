'use strict';

function money(value) {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

async function load() {
  const status = document.getElementById('status');
  try {
    const res = await fetch('/api/summary');
    const body = await res.json();
    document.getElementById('orders').textContent = body.orderCount;
    document.getElementById('revenue').textContent = money(body.totalRevenue);
    document.getElementById('region').textContent = body.topRegion ? body.topRegion.name : '—';
    document.getElementById('channel').textContent = body.topChannel ? body.topChannel.name : '—';
    document.getElementById('product').textContent = body.topProduct ? body.topProduct.name : '—';
    const tbody = document.getElementById('regions');
    tbody.innerHTML = '';
    for (const row of body.byRegion || []) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td></td><td></td>`;
      tr.children[0].textContent = row.name;
      tr.children[1].textContent = money(row.revenue);
      tbody.appendChild(tr);
    }
    status.textContent = 'แหล่งข้อมูล: /api/summary';
  } catch (err) {
    status.textContent = 'โหลดสรุปไม่สำเร็จ';
  }
}

load();
