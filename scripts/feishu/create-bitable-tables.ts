/**
 * 飞书多维表格批量创建脚本 — 一键创建 8 张 P0 表
 * 
 * 运行: 在终端中执行
 *   cd "/Users/lirundong/Documents/Ample ANOS"
 *   npx tsx scripts/feishu/create-bitable-tables.ts
 */

const APP_ID = 'cli_a954e269f6385bca';
const APP_SECRET = 'ddotELJC0WZOsrrFPsGIOh1cpEYet0ms';

// ============================================================================
// 8 张 P0 表定义
// ============================================================================
const TABLES = [
  {
    name: '01_Customer_Base',
    fields: [
      { field_name: 'CustomerID', type: 1 },
      { field_name: 'CustomerName', type: 1 },
      { field_name: 'Country', type: 1 },
      { field_name: 'CustomerLevel', type: 1 },
      { field_name: 'CreditLevel', type: 1 },
      { field_name: 'AccountOwner', type: 1 },
      { field_name: 'Status', type: 1 },
      { field_name: 'Source', type: 1 },
      { field_name: 'SourceType', type: 1 },
    ],
  },
  {
    name: '02_Supplier_Base',
    fields: [
      { field_name: 'SupplierID', type: 1 },
      { field_name: 'SupplierName', type: 1 },
      { field_name: 'Country', type: 1 },
      { field_name: 'SupplierType', type: 1 },
      { field_name: 'AuthorizationStatus', type: 1 },
      { field_name: 'Status', type: 1 },
      { field_name: 'Source', type: 1 },
    ],
  },
  {
    name: '03_Product_Base',
    fields: [
      { field_name: 'ProductID', type: 1 },
      { field_name: 'Brand', type: 1 },
      { field_name: 'MPN', type: 1 },
      { field_name: 'Category', type: 1 },
      { field_name: 'Lifecycle', type: 1 },
    ],
  },
  {
    name: '04_Inquiry_Base',
    fields: [
      { field_name: 'InquiryID', type: 1 },
      { field_name: 'CustomerID', type: 1 },
      { field_name: 'MPN', type: 1 },
      { field_name: 'Quantity', type: 2 },
      { field_name: 'TargetPrice', type: 2 },
      { field_name: 'Priority', type: 1 },
      { field_name: 'Status', type: 1 },
      { field_name: 'Source', type: 1 },
    ],
  },
  {
    name: '05_Supply_Resource_Base',
    fields: [
      { field_name: 'ResourceID', type: 1 },
      { field_name: 'SupplierID', type: 1 },
      { field_name: 'MPN', type: 1 },
      { field_name: 'StockQty', type: 2 },
      { field_name: 'Price', type: 2 },
      { field_name: 'LeadTimeDays', type: 2 },
      { field_name: 'Status', type: 1 },
      { field_name: 'Source', type: 1 },
    ],
  },
  {
    name: '06_Opportunity_Base',
    fields: [
      { field_name: 'OpportunityID', type: 1 },
      { field_name: 'InquiryID', type: 1 },
      { field_name: 'SupplyResourceID', type: 1 },
      { field_name: 'MatchScore', type: 2 },
      { field_name: 'Status', type: 1 },
    ],
  },
  {
    name: '07_AR_Risk_Base',
    fields: [
      { field_name: 'ARID', type: 1 },
      { field_name: 'CustomerID', type: 1 },
      { field_name: 'DueDate', type: 1 },
      { field_name: 'OutstandingAmount', type: 2 },
      { field_name: 'OverdueDays', type: 2 },
      { field_name: 'RiskLevel', type: 1 },
      { field_name: 'Status', type: 1 },
    ],
  },
  {
    name: '08_Agent_Audit_Log',
    fields: [
      { field_name: 'AuditID', type: 1 },
      { field_name: 'AgentID', type: 1 },
      { field_name: 'Action', type: 1 },
      { field_name: 'ConfidenceScore', type: 2 },
      { field_name: 'Timestamp', type: 1 },
    ],
  },
];

// ============================================================================
// 飞书 API 调用
// ============================================================================
async function getToken(): Promise<string> {
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
  });
  const data = await res.json() as any;
  if (data.code !== 0) throw new Error(`Token error: ${data.msg}`);
  return data.tenant_access_token;
}

async function createBitable(token: string, name: string): Promise<{ bitable_id: string; url: string }> {
  const res = await fetch('https://open.feishu.cn/open-apis/bitable/v1/apps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  const data = await res.json() as any;
  if (data.code !== 0) {
    // 如果是重名或权限问题，返回错误但不中断
    console.log(`   ⚠️  ${data.msg}`);
    return { bitable_id: '', url: '' };
  }
  return {
    bitable_id: data.data?.app?.app_token || '',
    url: data.data?.app?.url || '',
  };
}

async function addFields(token: string, bitableId: string, tableId: string, fields: any[]) {
  for (const field of fields) {
    const res = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${bitableId}/tables/${tableId}/fields`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(field),
    });
    const data = await res.json() as any;
    if (data.code !== 0 && data.code !== 172001) { // 172001 = 字段已存在
      console.log(`     ⚠️  ${field.field_name}: ${data.msg}`);
    }
  }
}

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  ANOS 飞书多维表格批量创建           ║');
  console.log('╚══════════════════════════════════════╝\n');

  // 1. 获取 Token
  console.log('🔑 获取飞书 Token...');
  const token = await getToken();
  console.log('   ✅ Token 获取成功\n');

  // 2. 逐张创建
  const results: { name: string; url: string }[] = [];
  for (const table of TABLES) {
    console.log(`📊 创建: ${table.name}`);
    
    // 创建多维表格
    const { bitable_id, url } = await createBitable(token, table.name);
    if (!bitable_id) {
      console.log(`   ⚠️  跳过 (创建失败)\n`);
      continue;
    }

    // 获取默认表格ID
    const tableRes = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${bitable_id}/tables`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const tableData = await tableRes.json() as any;
    const defaultTableId = tableData.data?.items?.[0]?.table_id || '';

    if (defaultTableId && table.fields.length > 0) {
      // 添加字段
      console.log(`   添加 ${table.fields.length} 个字段...`);
      await addFields(token, bitable_id, defaultTableId, table.fields);
    }

    results.push({ name: table.name, url });
    console.log(`   ✅ 完成 → ${url}\n`);
  }

  // 3. 汇总
  console.log('═══════════════════════════════════════');
  console.log(`✅ 创建完成: ${results.length}/${TABLES.length} 张表\n`);
  console.log('📋 多维表格链接:');
  results.forEach((r) => {
    if (r.url) console.log(`   ${r.name}: ${r.url}`);
    else console.log(`   ${r.name}: 创建失败，请手动创建`);
  });
  console.log('');
  console.log('💡 提示: 打开任意多维表格 → 右上角「...」→ 移动到空间 → ANOS Data Hub');
}

main().catch((err) => {
  console.error('❌ 执行失败:', err.message);
  process.exit(1);
});
