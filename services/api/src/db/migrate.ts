/**
 * Database migration — 创建所有 P0 表
 * 运行: npx tsx src/db/migrate.ts
 */
import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(DB_PATH);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

console.log(`📦 Database: ${DB_PATH}`);

// Run all table creation
sqlite.exec(`
  -- L0 主数据层
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL UNIQUE,
    customer_code TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_short_name TEXT,
    country TEXT NOT NULL DEFAULT 'CN',
    city TEXT,
    address TEXT,
    website TEXT,
    customer_type TEXT NOT NULL DEFAULT 'EndUser',
    industry TEXT,
    customer_level TEXT NOT NULL DEFAULT 'C',
    credit_level TEXT NOT NULL DEFAULT 'N/A',
    credit_limit REAL,
    payment_term TEXT NOT NULL DEFAULT 'T/T',
    payment_method TEXT NOT NULL DEFAULT 'T/T',
    currency TEXT NOT NULL DEFAULT 'USD',
    account_owner TEXT,
    account_owner_id TEXT,
    lead_source TEXT,
    first_order_date TEXT,
    last_order_date TEXT,
    last_contact_at TEXT,
    customer_score INTEGER,
    win_rate INTEGER,
    risk_level TEXT NOT NULL DEFAULT 'L1_Low',
    tags TEXT,
    growth_potential TEXT,
    rfg_count INTEGER NOT NULL DEFAULT 0,
    order_count INTEGER NOT NULL DEFAULT 0,
    total_order_amount REAL NOT NULL DEFAULT 0,
    ar_outstanding REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active',
    created_by TEXT,
    updated_by TEXT,
    source TEXT NOT NULL DEFAULT 'Manual',
    source_type TEXT NOT NULL DEFAULT 'Manual',
    source_id TEXT,
    source_url TEXT,
    source_owner TEXT,
    ai_generated INTEGER NOT NULL DEFAULT 0,
    ai_modified INTEGER NOT NULL DEFAULT 0,
    ai_confidence INTEGER NOT NULL DEFAULT 100,
    ai_insight TEXT,
    ai_tags TEXT,
    human_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    event_time TEXT NOT NULL DEFAULT (datetime('now')),
    last_activity_at TEXT,
    data_health_score INTEGER NOT NULL DEFAULT 100,
    data_health_level TEXT NOT NULL DEFAULT 'Healthy'
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    supplier_id TEXT NOT NULL UNIQUE,
    supplier_code TEXT NOT NULL UNIQUE,
    supplier_name TEXT NOT NULL,
    supplier_english_name TEXT,
    country TEXT NOT NULL DEFAULT 'CN',
    website TEXT,
    supplier_type TEXT NOT NULL DEFAULT 'IndependentDistributor',
    authorization_status TEXT NOT NULL DEFAULT 'Unknown',
    payment_method TEXT NOT NULL DEFAULT 'T/T',
    payment_term TEXT,
    preferred_brands TEXT,
    preferred_product_lines TEXT,
    supplier_score INTEGER,
    price_score INTEGER,
    quality_score INTEGER,
    risk_score INTEGER,
    delivery_reliability INTEGER,
    supply_resource_count INTEGER NOT NULL DEFAULT 0,
    successful_orders INTEGER NOT NULL DEFAULT 0,
    dispute_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active',
    created_by TEXT,
    updated_by TEXT,
    source TEXT NOT NULL DEFAULT 'Manual',
    source_type TEXT NOT NULL DEFAULT 'Manual',
    source_id TEXT,
    source_url TEXT,
    source_owner TEXT,
    ai_generated INTEGER NOT NULL DEFAULT 0,
    ai_modified INTEGER NOT NULL DEFAULT 0,
    ai_confidence INTEGER NOT NULL DEFAULT 100,
    ai_insight TEXT,
    ai_tags TEXT,
    human_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    event_time TEXT NOT NULL DEFAULT (datetime('now')),
    last_activity_at TEXT,
    data_health_score INTEGER NOT NULL DEFAULT 100,
    data_health_level TEXT NOT NULL DEFAULT 'Healthy'
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    brand_id TEXT,
    mpn TEXT NOT NULL,
    description TEXT,
    category TEXT,
    sub_category TEXT,
    package_type TEXT NOT NULL DEFAULT 'Other',
    lifecycle TEXT NOT NULL DEFAULT 'Active',
    rohs INTEGER NOT NULL DEFAULT 1,
    is_domestic INTEGER NOT NULL DEFAULT 0,
    heat_index INTEGER,
    shortage_index INTEGER,
    localization_index INTEGER,
    lifecycle_risk TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    created_by TEXT,
    updated_by TEXT,
    source TEXT NOT NULL DEFAULT 'Manual',
    source_type TEXT NOT NULL DEFAULT 'Manual',
    source_id TEXT,
    source_url TEXT,
    source_owner TEXT,
    ai_generated INTEGER NOT NULL DEFAULT 0,
    ai_modified INTEGER NOT NULL DEFAULT 0,
    ai_confidence INTEGER NOT NULL DEFAULT 100,
    ai_insight TEXT,
    ai_tags TEXT,
    human_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    event_time TEXT NOT NULL DEFAULT (datetime('now')),
    last_activity_at TEXT,
    data_health_score INTEGER NOT NULL DEFAULT 100,
    data_health_level TEXT NOT NULL DEFAULT 'Healthy'
  );

  -- L1 交易数据层
  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    inquiry_id TEXT NOT NULL UNIQUE,
    customer_id TEXT NOT NULL,
    contact_id TEXT,
    sales_owner_id TEXT,
    brand TEXT,
    mpn TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    target_price REAL,
    currency TEXT DEFAULT 'USD',
    required_date TEXT,
    lead_time_days INTEGER,
    status TEXT NOT NULL DEFAULT 'New',
    priority TEXT NOT NULL DEFAULT 'Medium',
    win_probability INTEGER,
    customer_intent TEXT,
    ai_suggestion TEXT,
    related_opportunity_id TEXT,
    raw_content TEXT,
    raw_attachment_url TEXT,
    created_by TEXT,
    updated_by TEXT,
    source TEXT NOT NULL DEFAULT 'Manual',
    source_type TEXT NOT NULL DEFAULT 'Manual',
    source_id TEXT,
    source_url TEXT,
    source_owner TEXT,
    ai_generated INTEGER NOT NULL DEFAULT 0,
    ai_modified INTEGER NOT NULL DEFAULT 0,
    ai_confidence INTEGER NOT NULL DEFAULT 100,
    ai_insight TEXT,
    ai_tags TEXT,
    human_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    event_time TEXT NOT NULL DEFAULT (datetime('now')),
    last_activity_at TEXT,
    data_health_score INTEGER NOT NULL DEFAULT 100,
    data_health_level TEXT NOT NULL DEFAULT 'Healthy'
  );

  CREATE TABLE IF NOT EXISTS supply_resources (
    id TEXT PRIMARY KEY,
    resource_id TEXT NOT NULL UNIQUE,
    supplier_id TEXT NOT NULL,
    procurement_owner_id TEXT,
    brand TEXT NOT NULL,
    mpn TEXT NOT NULL,
    description TEXT,
    date_code TEXT,
    package_type TEXT,
    rohs INTEGER,
    stock_qty INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    lead_time_days INTEGER,
    moq INTEGER,
    spq INTEGER,
    resource_score INTEGER,
    match_score INTEGER,
    risk_score INTEGER,
    matched_inquiry_ids TEXT,
    matched_opportunity_id TEXT,
    status TEXT NOT NULL DEFAULT 'New',
    created_by TEXT,
    updated_by TEXT,
    source TEXT NOT NULL DEFAULT 'Manual',
    source_type TEXT NOT NULL DEFAULT 'Manual',
    source_id TEXT,
    source_url TEXT,
    source_owner TEXT,
    ai_generated INTEGER NOT NULL DEFAULT 0,
    ai_modified INTEGER NOT NULL DEFAULT 0,
    ai_confidence INTEGER NOT NULL DEFAULT 100,
    ai_insight TEXT,
    ai_tags TEXT,
    human_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    event_time TEXT NOT NULL DEFAULT (datetime('now')),
    last_activity_at TEXT,
    data_health_score INTEGER NOT NULL DEFAULT 100,
    data_health_level TEXT NOT NULL DEFAULT 'Healthy'
  );

  CREATE TABLE IF NOT EXISTS opportunities (
    id TEXT PRIMARY KEY,
    opportunity_id TEXT NOT NULL UNIQUE,
    inquiry_id TEXT NOT NULL,
    supply_resource_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    supplier_id TEXT NOT NULL,
    match_score INTEGER NOT NULL DEFAULT 0,
    match_score_details TEXT,
    estimated_margin REAL,
    suggested_price REAL,
    suggested_lead_time_days INTEGER,
    status TEXT NOT NULL DEFAULT 'New',
    sales_owner_id TEXT,
    procurement_owner_id TEXT,
    ai_recommendation TEXT,
    risk_flags TEXT,
    created_by TEXT,
    updated_by TEXT,
    source TEXT NOT NULL DEFAULT 'Manual',
    source_type TEXT NOT NULL DEFAULT 'Manual',
    source_id TEXT,
    source_url TEXT,
    source_owner TEXT,
    ai_generated INTEGER NOT NULL DEFAULT 0,
    ai_modified INTEGER NOT NULL DEFAULT 0,
    ai_confidence INTEGER NOT NULL DEFAULT 100,
    ai_insight TEXT,
    ai_tags TEXT,
    human_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    event_time TEXT NOT NULL DEFAULT (datetime('now')),
    last_activity_at TEXT
  );

  CREATE TABLE IF NOT EXISTS offers (
    id TEXT PRIMARY KEY,
    offer_id TEXT NOT NULL UNIQUE,
    inquiry_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    supplier_id TEXT,
    supply_resource_id TEXT,
    opportunity_id TEXT,
    brand TEXT NOT NULL,
    mpn TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    total_amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    lead_time_days INTEGER,
    cost_price REAL,
    margin REAL,
    margin_percent REAL,
    status TEXT NOT NULL DEFAULT 'Draft',
    sales_owner_id TEXT,
    valid_until TEXT,
    ai_suggested_price REAL,
    ai_price_rationale TEXT,
    created_by TEXT,
    updated_by TEXT,
    source TEXT NOT NULL DEFAULT 'Manual',
    source_type TEXT NOT NULL DEFAULT 'Manual',
    source_id TEXT,
    source_url TEXT,
    source_owner TEXT,
    ai_generated INTEGER NOT NULL DEFAULT 0,
    ai_modified INTEGER NOT NULL DEFAULT 0,
    ai_confidence INTEGER NOT NULL DEFAULT 100,
    ai_insight TEXT,
    ai_tags TEXT,
    human_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    event_time TEXT NOT NULL DEFAULT (datetime('now')),
    last_activity_at TEXT
  );

  -- L2 财务数据层
  CREATE TABLE IF NOT EXISTS ar_items (
    id TEXT PRIMARY KEY,
    ar_id TEXT NOT NULL UNIQUE,
    customer_id TEXT NOT NULL,
    so_id TEXT,
    invoice_no TEXT,
    invoice_date TEXT,
    due_date TEXT NOT NULL,
    ar_amount REAL NOT NULL DEFAULT 0,
    paid_amount REAL NOT NULL DEFAULT 0,
    outstanding_amount REAL NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    overdue_days INTEGER NOT NULL DEFAULT 0,
    risk_level TEXT NOT NULL DEFAULT 'L1_Low',
    collection_forecast REAL,
    status TEXT NOT NULL DEFAULT 'Open',
    collection_owner_id TEXT,
    ai_collection_suggestion TEXT,
    ai_stop_shipment_recommendation INTEGER,
    created_by TEXT,
    updated_by TEXT,
    source TEXT NOT NULL DEFAULT 'Manual',
    source_type TEXT NOT NULL DEFAULT 'Manual',
    source_id TEXT,
    source_url TEXT,
    source_owner TEXT,
    ai_generated INTEGER NOT NULL DEFAULT 0,
    ai_modified INTEGER NOT NULL DEFAULT 0,
    ai_confidence INTEGER NOT NULL DEFAULT 100,
    ai_insight TEXT,
    ai_tags TEXT,
    human_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    event_time TEXT NOT NULL DEFAULT (datetime('now')),
    last_activity_at TEXT,
    data_health_score INTEGER NOT NULL DEFAULT 100,
    data_health_level TEXT NOT NULL DEFAULT 'Healthy'
  );

  -- Agent 与 审计
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL UNIQUE,
    agent_name TEXT NOT NULL,
    agent_type TEXT NOT NULL,
    department TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'L2_Knowledge',
    status TEXT NOT NULL DEFAULT 'Offline',
    prompt_version TEXT,
    model_version TEXT,
    capabilities TEXT,
    restrictions TEXT,
    current_task_count INTEGER DEFAULT 0,
    completed_task_count INTEGER DEFAULT 0,
    last_active_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    audit_id TEXT NOT NULL UNIQUE,
    object_type TEXT NOT NULL,
    object_id TEXT NOT NULL,
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    field TEXT,
    old_value TEXT,
    new_value TEXT,
    source TEXT,
    evidence_id TEXT,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    ip_address TEXT,
    user_agent TEXT
  );
`);

console.log('✅ All P0 tables created successfully');

// Verify
const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all() as { name: string }[];
console.log(`\n📋 Tables (${tables.length}):`);
tables.forEach((t) => console.log(`  - ${t.name}`));


// ============================================================================
// 添加性能索引
// ============================================================================
console.log('\n📊 Creating indexes...');

const indexes = [
  'CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(customer_name)',
  'CREATE INDEX IF NOT EXISTS idx_customers_level ON customers(customer_level)',
  'CREATE INDEX IF NOT EXISTS idx_customers_risk ON customers(risk_level)',
  'CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(supplier_name)',
  'CREATE INDEX IF NOT EXISTS idx_suppliers_type ON suppliers(supplier_type)',
  'CREATE INDEX IF NOT EXISTS idx_products_mpn ON products(mpn)',
  'CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)',
  'CREATE INDEX IF NOT EXISTS idx_products_brand_mpn ON products(brand, mpn)',
  'CREATE INDEX IF NOT EXISTS idx_inquiries_customer ON inquiries(customer_id)',
  'CREATE INDEX IF NOT EXISTS idx_inquiries_mpn ON inquiries(mpn)',
  'CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status)',
  'CREATE INDEX IF NOT EXISTS idx_supply_resources_supplier ON supply_resources(supplier_id)',
  'CREATE INDEX IF NOT EXISTS idx_supply_resources_mpn ON supply_resources(mpn)',
  'CREATE INDEX IF NOT EXISTS idx_supply_resources_status ON supply_resources(status)',
  'CREATE INDEX IF NOT EXISTS idx_opportunities_inquiry ON opportunities(inquiry_id)',
  'CREATE INDEX IF NOT EXISTS idx_opportunities_supply ON opportunities(supply_resource_id)',
  'CREATE INDEX IF NOT EXISTS idx_offers_inquiry ON offers(inquiry_id)',
  'CREATE INDEX IF NOT EXISTS idx_offers_customer ON offers(customer_id)',
  'CREATE INDEX IF NOT EXISTS idx_ar_customer ON ar_items(customer_id)',
  'CREATE INDEX IF NOT EXISTS idx_ar_risk ON ar_items(risk_level)',
  'CREATE INDEX IF NOT EXISTS idx_audit_object ON audit_logs(object_type, object_id)',
  'CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor)',
  'CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp)',
];

const indexTxn = sqlite.transaction(() => {
  indexes.forEach((idx) => sqlite.exec(idx));
});
indexTxn();

console.log(`✅ ${indexes.length} indexes created`);

// ============================================================================
// 外键约束 (SQLite)
// ============================================================================
console.log('\n🔗 Adding foreign key constraints...');

const foreignKeys = [
  // L1 交易层 → L0 主数据
  'CREATE INDEX IF NOT EXISTS fk_inquiries_customer ON inquiries(customer_id)',
  'CREATE INDEX IF NOT EXISTS fk_supply_resources_supplier ON supply_resources(supplier_id)',
  'CREATE INDEX IF NOT EXISTS fk_opportunities_inquiry ON opportunities(inquiry_id)',
  'CREATE INDEX IF NOT EXISTS fk_opportunities_supply ON opportunities(supply_resource_id)',
  'CREATE INDEX IF NOT EXISTS fk_opportunities_customer ON opportunities(customer_id)',
  'CREATE INDEX IF NOT EXISTS fk_opportunities_supplier_fk ON opportunities(supplier_id)',
  'CREATE INDEX IF NOT EXISTS fk_offers_inquiry ON offers(inquiry_id)',
  'CREATE INDEX IF NOT EXISTS fk_offers_customer ON offers(customer_id)',
  'CREATE INDEX IF NOT EXISTS fk_offers_supplier ON offers(supplier_id)',
  // L2 财务层 → L0 主数据
  'CREATE INDEX IF NOT EXISTS fk_ar_customer ON ar_items(customer_id)',
  // 审计关联
  'CREATE INDEX IF NOT EXISTS fk_audit_object ON audit_logs(object_type, object_id)',
];

const fkTxn = sqlite.transaction(() => {
  foreignKeys.forEach((fk) => sqlite.exec(fk));
});
fkTxn();

console.log(`✅ ${foreignKeys.length} foreign key indexes created`);

sqlite.close();
console.log("✅ Migration complete");
