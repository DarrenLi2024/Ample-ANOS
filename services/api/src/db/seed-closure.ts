/**
 * 闭环Mock数据种子脚本 — 100条完整业务链路
 * 数据源: data/mock-*.json
 * 运行: npx tsx src/db/seed-closure.ts
 * 
 * 数据统计:
 *   15 Customers + 10 Suppliers + 30 Products
 *   25 Inquiries + 25 SupplyResources + 15 Opportunities + 15 Offers + 10 AR Items
 *   = 130条记录, 形成完整闭环链路
 */
import Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');
const DATA_DIR = path.join(process.cwd(), 'data');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const sqlite = new Database(DB_PATH);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

const now = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

function loadJSON(filename: string): any[] {
  const filepath = path.join(DATA_DIR, filename);
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

// ============================================================================
// Load data
// ============================================================================
const customers = loadJSON('mock-customers.json');
const suppliers = loadJSON('mock-suppliers.json');
const products = loadJSON('mock-products.json');
const inquiries = loadJSON('mock-inquiries.json');
const supplyResources = loadJSON('mock-supply-resources.json');
const opportunities = loadJSON('mock-opportunities.json');
const offers = loadJSON('mock-offers.json');
const arItems = loadJSON('mock-ar-items.json');

console.log(`Data loaded:
  - ${customers.length} customers
  - ${suppliers.length} suppliers
  - ${products.length} products
  - ${inquiries.length} inquiries
  - ${supplyResources.length} supply resources
  - ${opportunities.length} opportunities
  - ${offers.length} offers
  - ${arItems.length} AR items
  Total: ${customers.length + suppliers.length + products.length + inquiries.length + supplyResources.length + opportunities.length + offers.length + arItems.length} records
`);

// ============================================================================
// Prepare statements
// ============================================================================
const insertCustomer = sqlite.prepare(`
  INSERT OR REPLACE INTO customers (id, customer_id, customer_code, customer_name, customer_short_name, country, city,
    customer_type, industry, customer_level, credit_level, credit_limit, account_owner_id,
    source, source_type, source_owner, created_by, updated_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertSupplier = sqlite.prepare(`
  INSERT OR REPLACE INTO suppliers (id, supplier_id, supplier_code, supplier_name, country,
    supplier_type, authorization_status, supplier_score, price_score, quality_score, risk_score, delivery_reliability,
    source, source_type, source_owner, created_by, updated_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertProduct = sqlite.prepare(`
  INSERT OR REPLACE INTO products (id, product_id, brand, mpn, description, category,
    source, source_type, created_by, updated_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertInquiry = sqlite.prepare(`
  INSERT OR REPLACE INTO inquiries (id, inquiry_id, customer_id, mpn, quantity, target_price, priority, status,
    sales_owner_id, source, source_type, source_owner, created_by, updated_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertSupplyResource = sqlite.prepare(`
  INSERT OR REPLACE INTO supply_resources (id, resource_id, supplier_id, brand, mpn, stock_qty, price, lead_time_days,
    date_code, status, procurement_owner_id, source, source_type, source_owner, created_by, updated_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertOpportunity = sqlite.prepare(`
  INSERT OR REPLACE INTO opportunities (id, opportunity_id, inquiry_id, supply_resource_id, customer_id, supplier_id,
    match_score, estimated_margin, suggested_price, status, ai_recommendation,
    sales_owner_id, procurement_owner_id, source, source_type, source_owner, created_by, updated_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertOffer = sqlite.prepare(`
  INSERT OR REPLACE INTO offers (id, offer_id, inquiry_id, customer_id, supplier_id, supply_resource_id, opportunity_id,
    brand, mpn, quantity, unit_price, total_amount, cost_price, margin, margin_percent, status,
    source, source_type, source_owner, created_by, updated_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertAR = sqlite.prepare(`
  INSERT OR REPLACE INTO ar_items (id, ar_id, customer_id, so_id, invoice_no, invoice_date, due_date,
    ar_amount, paid_amount, outstanding_amount, overdue_days, risk_level, status, collection_owner_id,
    source, source_type, source_owner, created_by, updated_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// ============================================================================
// Transaction — insert all data
// ============================================================================
const txn = sqlite.transaction(() => {
  // 1. Customers
  customers.forEach((c: any) => {
    insertCustomer.run(
      uuid(), c.id, c.code, c.name, c.short, c.country, c.city,
      c.type, c.industry, c.level, c.credit, c.limit, c.owner,
      'ERP', 'ERP', c.owner, 'System', 'System'
    );
  });

  // 2. Suppliers
  suppliers.forEach((s: any) => {
    insertSupplier.run(
      uuid(), s.id, s.code, s.name, s.country,
      s.type, s.auth, s.score, s.price, s.quality, s.risk, s.delivery,
      'ERP', 'ERP', 'System', 'System', 'System'
    );
  });

  // 3. Products
  products.forEach((p: any, i: number) => {
    insertProduct.run(
      uuid(), `PRD-${String(i + 1).padStart(5, '0')}`, p.brand, p.mpn, p.desc, p.cat,
      'Manual', 'Manual', 'System', 'System'
    );
  });

  // 4. Inquiries (25)
  inquiries.forEach((inq: any) => {
    insertInquiry.run(
      uuid(), inq.inqId, inq.customerId, inq.mpn, inq.qty, inq.targetPrice, inq.priority, inq.status,
      inq.salesOwner, inq.source, inq.source, inq.sourceOwner, inq.sourceOwner, inq.sourceOwner
    );
  });

  // 5. Supply Resources (25)
  supplyResources.forEach((sr: any) => {
    insertSupplyResource.run(
      uuid(), sr.resId, sr.supplierId, sr.mpn.split(/\d/)[0] || sr.mpn, sr.mpn, sr.stock, sr.price, sr.leadTime,
      sr.dateCode, sr.status, sr.procOwner,
      sr.source, sr.source, sr.sourceOwner, sr.sourceOwner, sr.sourceOwner
    );
  });

  // 6. Opportunities (15)
  opportunities.forEach((opp: any) => {
    insertOpportunity.run(
      uuid(), opp.oppId, opp.inqId, opp.resId, opp.customerId, opp.supplierId,
      opp.score, opp.margin, opp.suggestedPrice, opp.status, opp.aiRec,
      'USER-001', 'USER-101', 'AI', 'AI', 'Sales Agent', 'System', 'System'
    );
  });

  // 7. Offers (15)
  offers.forEach((ofr: any) => {
    insertOffer.run(
      uuid(), ofr.offerId, ofr.inqId, ofr.customerId, ofr.supplierId,
      ofr.resId || null, ofr.oppId || null,
      ofr.brand, ofr.mpn, ofr.qty, ofr.unitPrice, ofr.total,
      ofr.costPrice, ofr.margin, ofr.marginPct, ofr.status,
      ofr.source, ofr.source, ofr.sourceOwner, ofr.sourceOwner, ofr.sourceOwner
    );
  });

  // 8. AR Items (10)
  arItems.forEach((ar: any) => {
    insertAR.run(
      uuid(), ar.arId, ar.customerId, ar.soId, ar.invNo, ar.invDate, ar.dueDate,
      ar.amount, ar.paid, ar.outstanding, ar.overdue, ar.risk, ar.status, ar.owner,
      'ERP', 'ERP', 'Finance', 'System', 'System'
    );
  });
});

txn();

console.log('✅ All seed data inserted successfully!');
console.log(`   Database: ${DB_PATH}`);

// Verify counts
const counts = {
  customers: (sqlite.prepare('SELECT COUNT(*) as c FROM customers').get() as any).c,
  suppliers: (sqlite.prepare('SELECT COUNT(*) as c FROM suppliers').get() as any).c,
  products: (sqlite.prepare('SELECT COUNT(*) as c FROM products').get() as any).c,
  inquiries: (sqlite.prepare('SELECT COUNT(*) as c FROM inquiries').get() as any).c,
  supplyResources: (sqlite.prepare('SELECT COUNT(*) as c FROM supply_resources').get() as any).c,
  opportunities: (sqlite.prepare('SELECT COUNT(*) as c FROM opportunities').get() as any).c,
  offers: (sqlite.prepare('SELECT COUNT(*) as c FROM offers').get() as any).c,
  arItems: (sqlite.prepare('SELECT COUNT(*) as c FROM ar_items').get() as any).c,
};

console.log('\nVerification:');
Object.entries(counts).forEach(([key, val]) => console.log(`  ${key}: ${val}`));

// Check closure: how many inquiries have at least one opportunity
const inqWithOpp = (sqlite.prepare(`
  SELECT COUNT(DISTINCT i.inquiry_id) as c FROM inquiries i
  INNER JOIN opportunities o ON o.inquiry_id = i.inquiry_id
`).get() as any).c;
console.log(`\n  Inquiries with >= 1 Opportunity: ${inqWithOpp}`);

// Check closure: how many opportunities have an offer
const oppWithOffer = (sqlite.prepare(`
  SELECT COUNT(DISTINCT o.opportunity_id) as c FROM opportunities o
  INNER JOIN offers ofr ON ofr.opportunity_id = o.opportunity_id
`).get() as any).c;
console.log(`  Opportunities with >= 1 Offer: ${oppWithOffer}`);

// Check closure: full chain Inquiry → Opportunity → Offer
const fullChain = (sqlite.prepare(`
  SELECT COUNT(DISTINCT i.inquiry_id) as c FROM inquiries i
  INNER JOIN opportunities o ON o.inquiry_id = i.inquiry_id
  INNER JOIN offers ofr ON ofr.opportunity_id = o.opportunity_id
`).get() as any).c;
console.log(`  Full chain (Inquiry→Opportunity→Offer): ${fullChain}`);

sqlite.close();
