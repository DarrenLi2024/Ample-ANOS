/**
 * 扩展种子数据 — 补齐 Inquiry / SupplyResource / AR / Agent 测试数据
 * 运行: npx tsx src/db/seed-extended.ts
 */
import Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import path from 'node:path';

const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');
const sqlite = new Database(DB_PATH);

const now = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

// 20条 RFQ
const inquiries = [
  { customerId: 'C-001', mpn: 'STM32F407VET6', qty: 5000, targetPrice: 4.5, priority: 'High', status: 'New' },
  { customerId: 'C-002', mpn: 'TMS320F28335PGFA', qty: 2000, targetPrice: 9.0, priority: 'Urgent', status: 'Matched' },
  { customerId: 'C-003', mpn: 'EP4CE22F17C8N', qty: 1000, targetPrice: 35.0, priority: 'Medium', status: 'Quoting' },
  { customerId: 'C-004', mpn: 'STM32H743ZIT6', qty: 800, targetPrice: 12.0, priority: 'Medium', status: 'New' },
  { customerId: 'C-005', mpn: 'W25Q128JVSIM', qty: 10000, targetPrice: 0.6, priority: 'Medium', status: 'Won' },
  { customerId: 'C-006', mpn: 'ATmega328P-AU', qty: 3000, targetPrice: 1.2, priority: 'Low', status: 'New' },
  { customerId: 'C-007', mpn: 'MSP430F5529IPN', qty: 1500, targetPrice: 3.8, priority: 'Medium', status: 'Parsing' },
  { customerId: 'C-008', mpn: 'MAX3232EIPWR', qty: 5000, targetPrice: 0.35, priority: 'High', status: 'New' },
  { customerId: 'C-009', mpn: 'LMR14030SDDAR', qty: 2000, targetPrice: 1.5, priority: 'Urgent', status: 'New' },
  { customerId: 'C-010', mpn: 'ESP32-WROOM-32E', qty: 10000, targetPrice: 1.8, priority: 'High', status: 'Matched' },
  { customerId: 'C-001', mpn: 'STM32F103C8T6', qty: 20000, targetPrice: 1.5, priority: 'Medium', status: 'Quoted' },
  { customerId: 'C-002', mpn: 'GD32F103C8T6', qty: 10000, targetPrice: 0.8, priority: 'Low', status: 'New' },
  { customerId: 'C-003', mpn: 'AM3358BZCZ100', qty: 500, targetPrice: 25.0, priority: 'High', status: 'New' },
  { customerId: 'C-004', mpn: 'MT41K256M16TW-107:P', qty: 3000, targetPrice: 3.2, priority: 'Medium', status: 'Parsing' },
  { customerId: 'C-005', mpn: 'LAN8720A-CP-TR', qty: 5000, targetPrice: 0.9, priority: 'Medium', status: 'New' },
  { customerId: 'C-006', mpn: 'MP1584EN-LF-Z', qty: 8000, targetPrice: 0.4, priority: 'Low', status: 'New' },
  { customerId: 'C-007', mpn: 'OPA333AIDBVR', qty: 3000, targetPrice: 0.65, priority: 'Medium', status: 'Quoting' },
  { customerId: 'C-008', mpn: 'SN65HVD230DR', qty: 2000, targetPrice: 1.1, priority: 'High', status: 'New' },
  { customerId: 'C-009', mpn: 'TLV1117-33CDCYR', qty: 10000, targetPrice: 0.12, priority: 'Medium', status: 'New' },
  { customerId: 'C-010', mpn: 'CH340G', qty: 5000, targetPrice: 0.25, priority: 'Low', status: 'Won' },
];

// 20条供应资源
const supplyResources = [
  { supplierId: 'S-001', mpn: 'STM32F407VET6', stockQty: 8000, price: 4.2, leadTime: 14 },
  { supplierId: 'S-002', mpn: 'TMS320F28335PGFA', stockQty: 3000, price: 8.5, leadTime: 14 },
  { supplierId: 'S-003', mpn: 'STM32F407VET6', stockQty: 5000, price: 4.1, leadTime: 7 },
  { supplierId: 'S-004', mpn: 'ESP32-WROOM-32E', stockQty: 15000, price: 1.7, leadTime: 7 },
  { supplierId: 'S-005', mpn: 'W25Q128JVSIM', stockQty: 20000, price: 0.55, leadTime: 3 },
  { supplierId: 'S-006', mpn: 'STM32H743ZIT6', stockQty: 1200, price: 11.5, leadTime: 21 },
  { supplierId: 'S-007', mpn: 'EP4CE22F17C8N', stockQty: 2000, price: 33.0, leadTime: 14 },
  { supplierId: 'S-008', mpn: 'ATmega328P-AU', stockQty: 5000, price: 1.1, leadTime: 7 },
  { supplierId: 'S-009', mpn: 'MAX3232EIPWR', stockQty: 10000, price: 0.3, leadTime: 3 },
  { supplierId: 'S-010', mpn: 'MSP430F5529IPN', stockQty: 2500, price: 3.5, leadTime: 10 },
  { supplierId: 'S-001', mpn: 'GD32F103C8T6', stockQty: 15000, price: 0.7, leadTime: 7 },
  { supplierId: 'S-002', mpn: 'STM32F103C8T6', stockQty: 30000, price: 1.3, leadTime: 14 },
  { supplierId: 'S-003', mpn: 'LMR14030SDDAR', stockQty: 4000, price: 1.4, leadTime: 7 },
  { supplierId: 'S-004', mpn: 'AM3358BZCZ100', stockQty: 800, price: 23.0, leadTime: 21 },
  { supplierId: 'S-005', mpn: 'MT41K256M16TW-107:P', stockQty: 5000, price: 3.0, leadTime: 7 },
  { supplierId: 'S-006', mpn: 'LAN8720A-CP-TR', stockQty: 8000, price: 0.8, leadTime: 7 },
  { supplierId: 'S-007', mpn: 'MP1584EN-LF-Z', stockQty: 12000, price: 0.35, leadTime: 3 },
  { supplierId: 'S-008', mpn: 'OPA333AIDBVR', stockQty: 5000, price: 0.6, leadTime: 7 },
  { supplierId: 'S-009', mpn: 'SN65HVD230DR', stockQty: 4000, price: 1.0, leadTime: 7 },
  { supplierId: 'S-010', mpn: 'CH340G', stockQty: 10000, price: 0.2, leadTime: 3 },
];

// 10条 AR
const arItems = [
  { customerId: 'C-008', dueDate: '2026-02-28', arAmount: 380000, paidAmount: 0 },
  { customerId: 'C-004', dueDate: '2026-03-26', arAmount: 250000, paidAmount: 0 },
  { customerId: 'C-007', dueDate: '2026-04-18', arAmount: 180000, paidAmount: 0 },
  { customerId: 'C-006', dueDate: '2026-05-01', arAmount: 120000, paidAmount: 0 },
  { customerId: 'C-005', dueDate: '2026-05-11', arAmount: 90000, paidAmount: 0 },
  { customerId: 'C-003', dueDate: '2026-06-15', arAmount: 500000, paidAmount: 300000 },
  { customerId: 'C-001', dueDate: '2026-06-30', arAmount: 2000000, paidAmount: 1800000 },
  { customerId: 'C-002', dueDate: '2026-07-15', arAmount: 800000, paidAmount: 600000 },
  { customerId: 'C-009', dueDate: '2026-07-30', arAmount: 3000000, paidAmount: 2800000 },
  { customerId: 'C-010', dueDate: '2026-08-01', arAmount: 500000, paidAmount: 450000 },
];

const txn = sqlite.transaction(() => {
  // Insert inquiries
  const insertInq = sqlite.prepare(
    'INSERT OR IGNORE INTO inquiries (id, inquiry_id, customer_id, mpn, quantity, target_price, priority, status, source, source_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  );
  inquiries.forEach((inq, i) => {
    insertInq.run(
      uuid(), `INQ-${String(i + 1).padStart(4, '0')}`, inq.customerId, inq.mpn, inq.qty, inq.targetPrice, inq.priority, inq.status, 'Manual', 'Manual',
    );
  });

  // Insert supply resources
  const insertSR = sqlite.prepare(
    'INSERT OR IGNORE INTO supply_resources (id, resource_id, supplier_id, mpn, stock_qty, price, lead_time_days, status, source, source_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  );
  supplyResources.forEach((sr, i) => {
    insertSR.run(
      uuid(), `SR-${String(i + 1).padStart(4, '0')}`, sr.supplierId, sr.mpn, sr.stockQty, sr.price, sr.leadTime, 'New', 'Manual', 'Manual',
    );
  });

  // Insert AR
  const insertAR = sqlite.prepare(
    'INSERT OR IGNORE INTO ar_items (id, ar_id, customer_id, due_date, ar_amount, paid_amount, outstanding_amount, overdue_days, risk_level, status, source, source_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  );
  arItems.forEach((ar, i) => {
    const dueDate = new Date(ar.dueDate);
    const overdueDays = Math.max(0, Math.floor((Date.now() - dueDate.getTime()) / 86400000));
    let riskLevel = 'L1_Low';
    if (overdueDays > 90) riskLevel = 'L4_High';
    else if (overdueDays > 60) riskLevel = 'L3_Warning';
    else if (overdueDays > 30) riskLevel = 'L2_Watch';
    insertAR.run(
      uuid(), `AR-${String(i + 1).padStart(4, '0')}`, ar.customerId, ar.dueDate, ar.arAmount, ar.paidAmount, ar.arAmount - ar.paidAmount, overdueDays, riskLevel, overdueDays > 0 ? 'Overdue' : 'Open', 'ERP', 'ERP',
    );
  });
});

txn();

console.log(`✅ Extended seed data inserted:
  - ${inquiries.length} inquiries (20)
  - ${supplyResources.length} supply resources (20)
  - ${arItems.length} AR items (10)`);

sqlite.close();
