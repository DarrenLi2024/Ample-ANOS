/**
 * ERP 数据导入脚本
 * 支持 Excel/CSV → ANOS SQLite 数据库
 * 
 * 用法:
 *   npx tsx scripts/import/erp-import.ts --source ./erp-customers.xlsx --type customer
 */
import Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import path from 'node:path';
import fs from 'node:fs';

interface ImportConfig {
  source: string;
  type: 'customer' | 'supplier' | 'product' | 'inquiry' | 'ar';
  dryRun?: boolean;
}

// ============================================================================
// 字段映射 (ERP → ANOS)
// ============================================================================
const CUSTOMER_MAPPING: Record<string, string> = {
  '客户编码': 'customer_code',
  '客户名称': 'customer_name',
  '国家': 'country',
  '城市': 'city',
  '行业': 'industry',
  '客户等级': 'customer_level',
  '信用等级': 'credit_level',
  '信用额度': 'credit_limit',
  '付款方式': 'payment_method',
  '账期': 'payment_term',
  '销售负责人': 'account_owner',
};

const SUPPLIER_MAPPING: Record<string, string> = {
  '供应商编码': 'supplier_code',
  '供应商名称': 'supplier_name',
  '国家': 'country',
  '供应商类型': 'supplier_type',
  '授权状态': 'authorization_status',
  '付款方式': 'payment_method',
};

const PRODUCT_MAPPING: Record<string, string> = {
  '品牌': 'brand',
  '型号': 'mpn',
  '描述': 'description',
  '类别': 'category',
  '封装': 'package_type',
  '生命周期': 'lifecycle',
  '是否国产': 'is_domestic',
};

// ============================================================================
// 简易 CSV 解析 (生产环境可用 papaparse/xlsx)
// ============================================================================
function parseCSV(content: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = content.trim().split('\n');
  const headers = lines[0]!.split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]!.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

function mapFields(row: Record<string, string>, mapping: Record<string, string>): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const [erpField, anosField] of Object.entries(mapping)) {
    if (row[erpField]) {
      mapped[anosField] = row[erpField];
    }
  }
  return mapped;
}

// ============================================================================
// 导入执行
// ============================================================================
async function importData(config: ImportConfig) {
  const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');

  if (!fs.existsSync(config.source)) {
    console.error(`❌ 源文件不存在: ${config.source}`);
    process.exit(1);
  }

  const content = fs.readFileSync(config.source, 'utf-8');
  const { headers, rows } = parseCSV(content);

  console.log(`📂 源文件: ${config.source}`);
  console.log(`📋 检测到 ${rows.length} 条记录`);
  console.log(`🏷️  字段: ${headers.join(', ')}`);
  console.log('');

  if (config.dryRun) {
    console.log('🔍 Dry Run 模式 — 仅预览，不写入数据库\n');
    rows.slice(0, 3).forEach((row, i) => {
      console.log(`Row ${i + 1}:`, JSON.stringify(row, null, 2));
    });
    return;
  }

  const sqlite = new Database(DB_PATH);
  sqlite.pragma('foreign_keys = ON');

  let mapping: Record<string, string>;
  let table: string;
  let idPrefix: string;

  switch (config.type) {
    case 'customer':
      mapping = CUSTOMER_MAPPING;
      table = 'customers';
      idPrefix = 'C';
      break;
    case 'supplier':
      mapping = SUPPLIER_MAPPING;
      table = 'suppliers';
      idPrefix = 'S';
      break;
    case 'product':
      mapping = PRODUCT_MAPPING;
      table = 'products';
      idPrefix = 'PRD';
      break;
    default:
      console.error(`❌ 不支持的导入类型: ${config.type}`);
      process.exit(1);
  }

  const txn = sqlite.transaction(() => {
    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      const mapped = mapFields(row, mapping);

      const customerName = mapped['customer_name'] || mapped['supplier_name'];
      if (!customerName) {
        skipped++;
        continue;
      }

      const id = uuid();
      const businessId = `${idPrefix}-${Date.now()}-${imported}`;

      try {
        sqlite.prepare(`
          INSERT INTO ${table} (id, ${idPrefix === 'C' ? 'customer_id' : idPrefix === 'S' ? 'supplier_id' : 'product_id'}, ${idPrefix === 'C' ? 'customer_code' : idPrefix === 'S' ? 'supplier_code' : ''}, ${idPrefix === 'C' || idPrefix === 'S' ? `${idPrefix === 'C' ? 'customer_name' : 'supplier_name'}, source, source_type` : 'brand, mpn, source, source_type'})
          VALUES (?, ?, ?, ?, 'ERP', 'ERP')
        `).run(id, businessId, `${idPrefix}-IMP-${imported}`, customerName);
        imported++;
      } catch (err: any) {
        if (err.message?.includes('UNIQUE')) {
          skipped++;
        } else {
          throw err;
        }
      }
    }

    console.log(`✅ 导入完成: ${imported} 条成功, ${skipped} 条跳过`);
  });

  txn();
  sqlite.close();
}

// ============================================================================
// CLI
// ============================================================================
const args = process.argv.slice(2);
const config: ImportConfig = {
  source: '',
  type: 'customer',
  dryRun: false,
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--source' && args[i + 1]) config.source = args[i + 1]!;
  if (args[i] === '--type' && args[i + 1]) config.type = args[i + 1] as any;
  if (args[i] === '--dry-run') config.dryRun = true;
}

if (!config.source) {
  console.log(`
ANOS ERP 数据导入工具

用法:
  npx tsx scripts/import/erp-import.ts --source <文件路径> --type <customer|supplier|product> [--dry-run]

示例:
  npx tsx scripts/import/erp-import.ts --source ./erp-customers.csv --type customer --dry-run
  npx tsx scripts/import/erp-import.ts --source ./erp-suppliers.csv --type supplier
  `);
  process.exit(0);
}

importData(config);
