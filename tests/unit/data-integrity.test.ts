import { describe, it, expect } from 'vitest';
import Database from 'better-sqlite3';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'data', 'anos.db');

describe('数据库完整性验证', () => {
  let db: ReturnType<typeof Database>;

  beforeAll(() => {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  });

  afterAll(() => {
    db.close();
  });

  it('所有核心表应存在且包含数据', () => {
    const tables = ['customers', 'suppliers', 'products', 'inquiries', 'supply_resources', 'opportunities', 'offers', 'ar_items'];
    for (const table of tables) {
      const row = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as any;
      expect(row.count, `${table} should have data`).toBeGreaterThan(0);
    }
  });

  it('客户数量应 >= 10', () => {
    const row = db.prepare('SELECT COUNT(*) as count FROM customers').get() as any;
    expect(row.count).toBeGreaterThanOrEqual(10);
  });

  it('询价数量应 >= 20', () => {
    const row = db.prepare('SELECT COUNT(*) as count FROM inquiries').get() as any;
    expect(row.count).toBeGreaterThanOrEqual(20);
  });

  it('供应资源数量应 >= 20', () => {
    const row = db.prepare('SELECT COUNT(*) as count FROM supply_resources').get() as any;
    expect(row.count).toBeGreaterThanOrEqual(20);
  });

  it('商机数量应 >= 10', () => {
    const row = db.prepare('SELECT COUNT(*) as count FROM opportunities').get() as any;
    expect(row.count).toBeGreaterThanOrEqual(10);
  });

  it('AR项目数量应 >= 5', () => {
    const row = db.prepare('SELECT COUNT(*) as count FROM ar_items').get() as any;
    expect(row.count).toBeGreaterThanOrEqual(5);
  });

  it('至少存在完整闭环链路 (Inquiry → Opportunity → Offer)', () => {
    const row = db.prepare(`
      SELECT COUNT(DISTINCT i.inquiry_id) as count
      FROM inquiries i
      JOIN opportunities o ON o.inquiry_id = i.inquiry_id
      JOIN offers ofr ON ofr.opportunity_id = o.opportunity_id
    `).get() as any;
    expect(row.count).toBeGreaterThanOrEqual(10);
  });

  it('至少有 Won 状态的询价', () => {
    const row = db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'Won'").get() as any;
    expect(row.count).toBeGreaterThanOrEqual(2);
  });

  it('至少存在高风险 (L4_High) AR项目', () => {
    const row = db.prepare("SELECT COUNT(*) as count FROM ar_items WHERE risk_level = 'L4_High'").get() as any;
    expect(row.count).toBeGreaterThanOrEqual(1);
  });

  it('Source 字段应都有值', () => {
    const tables = ['customers', 'suppliers', 'inquiries', 'supply_resources', 'ar_items'];
    for (const table of tables) {
      const rows = db.prepare(`SELECT COUNT(*) as count FROM ${table} WHERE source IS NULL OR source = ''`).get() as any;
      expect(rows.count, `${table} should have no empty source`).toBe(0);
    }
  });

  it('授权分销商和独立分销商都应存在', () => {
    const authCount = db.prepare("SELECT COUNT(*) as count FROM suppliers WHERE supplier_type = 'AuthorizedDistributor'").get() as any;
    const indepCount = db.prepare("SELECT COUNT(*) as count FROM suppliers WHERE supplier_type = 'IndependentDistributor'").get() as any;
    expect(authCount.count).toBeGreaterThanOrEqual(3);
    expect(indepCount.count).toBeGreaterThanOrEqual(2);
  });
});
