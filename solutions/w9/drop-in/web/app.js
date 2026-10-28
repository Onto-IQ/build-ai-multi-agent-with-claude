'use strict';

function money(value) {
  return new Intl.NumberFormat('th-TH', { maximumFractionDigits: 0 }).format(value);
}

async function load() {
  const status = document.getElementById('status');
  try {
    const res = await fetch('/api/summary');
    const body = await res.json();
    document.getElementById('companies').textContent = body.companyCount;
    document.getElementById('capital').textContent = money(body.totalCapital);
    document.getElementById('province').textContent = body.topProvince ? body.topProvince.name : '—';
    document.getElementById('region').textContent = body.topRegion ? body.topRegion.name : '—';
    const tbody = document.getElementById('regions');
    tbody.innerHTML = '';
    for (const row of body.byRegion || []) {
      const tr = document.createElement('tr');
      const name = document.createElement('td');
      const capital = document.createElement('td');
      name.textContent = row.name;
      capital.textContent = money(row.revenue);
      tr.appendChild(name);
      tr.appendChild(capital);
      tbody.appendChild(tr);
    }
    status.textContent = 'แหล่งข้อมูล: /api/summary — ตัวเลขชุดเดียวกับ quality gate';
  } catch (err) {
    status.textContent = 'โหลดสรุปไม่สำเร็จ';
  }
}

load();
