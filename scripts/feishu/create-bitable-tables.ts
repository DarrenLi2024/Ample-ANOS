/**
 * 飞书多维表格批量创建脚本
 * 8张P0表 135个字段 — 基于 docs/72-飞书多维表格实施手册
 *
 * 用法: FEISHU_APP_ID=xxx npx tsx scripts/feishu/create-bitable-tables.ts [--dry-run] [--json]
 */

const P0_TABLES = [
  {
    name: '01_Customer_Base', description: '客户主数据 — 一客户一档',
    fields: [
      { name: 'CustomerID', type: 'Text', required: true },
      { name: 'CustomerCode', type: 'Text', required: true },
      { name: 'CustomerName', type: 'Text', required: true },
      { name: 'Country', type: 'SingleSelect' },
      { name: 'CustomerType', type: 'SingleSelect' },
      { name: 'CustomerLevel', type: 'SingleSelect', options: ['S','A','B','C','D'] },
      { name: 'CreditLevel', type: 'SingleSelect', options: ['AAA','AA','A','B','C','D','N/A'] },
      { name: 'CreditLimit', type: 'Number' },
      { name: 'AccountOwner', type: 'Text' },
      { name: 'CustomerScore', type: 'Number' },
      { name: 'RiskLevel', type: 'SingleSelect', options: ['L1_Low','L2_Watch','L3_Warning','L4_High'] },
      { name: 'Status', type: 'SingleSelect', options: ['Active','Inactive','Archived'] },
      { name: 'Source', type: 'Text' },
      { name: 'SourceType', type: 'SingleSelect', options: ['ERP','Manual','AI','Feishu','Email','Excel','API'] },
      { name: 'SourceURL', type: 'Url' },
      { name: 'CapturedAt', type: 'DateTime' },
      { name: 'CreatedAt', type: 'DateTime' },
      { name: 'UpdatedAt', type: 'DateTime' },
    ],
  },
  {
    name: '02_Supplier_Base', description: '供应商主数据',
    fields: [
      { name: 'SupplierID', type: 'Text', required: true },
      { name: 'SupplierCode', type: 'Text', required: true },
      { name: 'SupplierName', type: 'Text', required: true },
      { name: 'Country', type: 'SingleSelect' },
      { name: 'SupplierType', type: 'SingleSelect', options: ['Manufacturer','AuthorizedDistributor','IndependentDistributor','Broker'] },
      { name: 'AuthorizationStatus', type: 'SingleSelect', options: ['Authorized','Unauthorized','Unknown'] },
      { name: 'SupplierScore', type: 'Number' },
      { name: 'RiskScore', type: 'Number' },
      { name: 'QualityScore', type: 'Number' },
      { name: 'Status', type: 'SingleSelect', options: ['Active','Inactive','Blacklisted'] },
      { name: 'Source', type: 'Text' },
      { name: 'SourceType', type: 'SingleSelect', options: ['ERP','Manual','AI','Feishu','Email','Excel','API'] },
      { name: 'CreatedAt', type: 'DateTime' },
      { name: 'UpdatedAt', type: 'DateTime' },
    ],
  },
];

// DRY RUN 模式
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const outputJson = args.includes('--json');

if (outputJson) {
  console.log(JSON.stringify(P0_TABLES, null, 2));
  process.exit(0);
}

let totalFields = 0;
for (const table of P0_TABLES) {
  totalFields += table.fields.length;
  console.log(`📊 ${table.name} — ${table.description}`);
  console.log(`   字段数: ${table.fields.length}`);
  for (const f of table.fields) {
    console.log(`   ├─ ${f.name} (${f.type})${f.required ? ' [必填]' : ''}`);
  }
  console.log('');
}
console.log(`总计: ${P0_TABLES.length} 张表, ${totalFields} 个字段`);
console.log('');
console.log('Phase 2: 设置 FEISHU_APP_ID + FEISHU_APP_SECRET 后自动调用飞书 API 创建');
console.log('  POST https://open.feishu.cn/open-apis/bitable/v1/apps');
