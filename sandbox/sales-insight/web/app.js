'use strict';

async function load() {
  const status = document.getElementById('status');
  try {
    const res = await fetch('/api/summary');
    const body = await res.json();
    document.getElementById('orders').textContent = body.orderCount;
    document.getElementById('revenue').textContent = body.totalRevenue;
    status.textContent = 'โหลด /api/summary แล้ว — อย่าใช้ตัวเลขนี้ตัดสินใจจนกว่า quality gate จะผ่าน';
  } catch (err) {
    status.textContent = 'โหลดสรุปไม่สำเร็จ';
  }
}

load();
