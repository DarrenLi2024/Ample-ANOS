/**
 * ANOS 飞书多维表格全量创建 — 所有 P0+P1 表 (约20张)
 * 基于 docs/42-ANOS数据中台建表蓝图 + docs/72-飞书多维表格实施手册
 * 
 * 运行: npx tsx scripts/feishu/create-all-tables.ts
 * 整个脚本运行约需 3-5 分钟 (飞书 API 限流 100次/分钟)
 */

const APP_ID = 'cli_a954e269f6385bca';
const APP_SECRET = 'ddotELJC0WZOsrrFPsGIOh1cpEYet0ms';

// ============================================================================
// L0 主数据层 (6张)
// ============================================================================
const L0_MASTER = [
  {
    name: '01_Customer_Base',
    desc: '客户主数据 — 一客户一档，含信用/评分/风险',
    fields: [
      { field_name: 'CustomerID', type: 1 },
      { field_name: 'CustomerCode', type: 1 },
      { field_name: 'CustomerName', type: 1 },
      { field_name: 'Country', type: 1 },
      { field_name: 'City', type: 1 },
      { field_name: 'Industry', type: 1 },
      { field_name: 'CustomerType', type: 1 },
      { field_name: 'CustomerLevel', type: 1 },
      { field_name: 'CreditLevel', type: 1 },
      { field_name: 'CreditLimit', type: 2 },
      { field_name: 'PaymentTerm', type: 1 },
      { field_name: 'AccountOwner', type: 1 },
      { field_name: 'FirstOrderDate', type: 5 },
      { field_name: 'CustomerScore', type: 2 },
      { field_name: 'RiskLevel', type: 1 },
      { field_name: 'Status', type: 1 },
      { field_name: 'Source', type: 1 },
      { field_name: 'SourceType', type: 1 },
      { field_name: 'SourceURL', type: 1 },
      { field_name: 'CapturedAt', type: 5 },
      { field_name: 'CreatedAt', type: 5 },
    ],
  },
  {
    name: '02_Contact_Base',
    desc: '联系人表 — 与Customer 1:N',
    fields: [
      { field_name: 'ContactID', type: 1 },
      { field_name: 'CustomerID', type: 1 },
      { field_name: 'ContactName', type: 1 },
      { field_name: 'Title', type: 1 },
      { field_name: 'Department', type: 1 },
      { field_name: 'Email', type: 1 },
      { field_name: 'Mobile', type: 1 },
      { field_name: 'WeChat', type: 1 },
      { field_name: 'LinkedIn', type: 1 },
      { field_name: 'InfluenceScore', type: 2 },
      { field_name: 'DecisionLevel', type: 1 },
      { field_name: 'IsPrimary', type: 3 },
    ],
  },
  {
    name: '03_Supplier_Base',
    desc: '供应商主数据 — 含评分/风险/授权状态',
    fields: [
      { field_name: 'SupplierID', type: 1 },
      { field_name: 'SupplierCode', type: 1 },
      { field_name: 'SupplierName', type: 1 },
      { field_name: 'Country', type: 1 },
      { field_name: 'SupplierType', type: 1 },
      { field_name: 'AuthorizationStatus', type: 1 },
      { field_name: 'PaymentMethod', type: 1 },
      { field_name: 'PreferredBrands', type: 1 },
      { field_name: 'SupplierScore', type: 2 },
      { field_name: 'PriceScore', type: 2 },
      { field_name: 'QualityScore', type: 2 },
      { field_name: 'RiskScore', type: 2 },
      { field_name: 'DeliveryReliability', type: 2 },
      { field_name: 'Status', type: 1 },
      { field_name: 'Source', type: 1 },
    ],
  },
  {
    name: '04_Product_Base',
    desc: '产品主数据 — Brand+MPN 唯一键',
    fields: [
      { field_name: 'ProductID', type: 1 },
      { field_name: 'Brand', type: 1 },
      { field_name: 'MPN', type: 1 },
      { field_name: 'Description', type: 1 },
      { field_name: 'Category', type: 1 },
      { field_name: 'Package', type: 1 },
      { field_name: 'Lifecycle', type: 1 },
      { field_name: 'RoHS', type: 3 },
      { field_name: 'IsDomestic', type: 3 },
      { field_name: 'HeatIndex', type: 2 },
      { field_name: 'ShortageIndex', type: 2 },
      { field_name: 'LocalizationIndex', type: 2 },
    ],
  },
  {
    name: '05_Brand_Base',
    desc: '品牌库 — 国产替代指数',
    fields: [
      { field_name: 'BrandID', type: 1 },
      { field_name: 'BrandName', type: 1 },
      { field_name: 'Manufacturer', type: 1 },
      { field_name: 'Country', type: 1 },
      { field_name: 'IsDomestic', type: 3 },
      { field_name: 'PopularityIndex', type: 2 },
      { field_name: 'LocalizationIndex', type: 2 },
    ],
  },
  {
    name: '06_Employee_Base',
    desc: '员工主数据 — 用于飞书组织架构同步',
    fields: [
      { field_name: 'EmployeeID', type: 1 },
      { field_name: 'Name', type: 1 },
      { field_name: 'Department', type: 1 },
      { field_name: 'Title', type: 1 },
      { field_name: 'Email', type: 1 },
      { field_name: 'Role', type: 1 },
    ],
  },
];

// ============================================================================
// L1 交易数据层 (6张)
// ============================================================================
const L1_TRADING = [
  {
    name: '11_Inquiry_Base',
    desc: '询价主表 — RFQ结构化存储',
    fields: [
      { field_name: 'InquiryID', type: 1 },
      { field_name: 'CustomerID', type: 1 },
      { field_name: 'ContactID', type: 1 },
      { field_name: 'Brand', type: 1 },
      { field_name: 'MPN', type: 1 },
      { field_name: 'Quantity', type: 2 },
      { field_name: 'TargetPrice', type: 2 },
      { field_name: 'Currency', type: 1 },
      { field_name: 'RequiredDate', type: 5 },
      { field_name: 'Priority', type: 1 },
      { field_name: 'Status', type: 1 },
      { field_name: 'WinProbability', type: 2 },
      { field_name: 'SalesOwner', type: 1 },
      { field_name: 'AISuggestion', type: 1 },
      { field_name: 'Source', type: 1 },
      { field_name: 'SourceType', type: 1 },
      { field_name: 'CreatedAt', type: 5 },
    ],
  },
  {
    name: '12_Offer_Base',
    desc: '报价表 — 含毛利/审批状态',
    fields: [
      { field_name: 'OfferID', type: 1 },
      { field_name: 'InquiryID', type: 1 },
      { field_name: 'CustomerID', type: 1 },
      { field_name: 'SupplierID', type: 1 },
      { field_name: 'MPN', type: 1 },
      { field_name: 'Quantity', type: 2 },
      { field_name: 'UnitPrice', type: 2 },
      { field_name: 'TotalAmount', type: 2 },
      { field_name: 'Currency', type: 1 },
      { field_name: 'CostPrice', type: 2 },
      { field_name: 'Margin', type: 2 },
      { field_name: 'MarginPercent', type: 2 },
      { field_name: 'Status', type: 1 },
      { field_name: 'SalesOwner', type: 1 },
      { field_name: 'CreatedAt', type: 5 },
    ],
  },
  {
    name: '13_SO_Base',
    desc: '销售订单表 — ERP同步源',
    fields: [
      { field_name: 'SOID', type: 1 },
      { field_name: 'CustomerID', type: 1 },
      { field_name: 'OfferID', type: 1 },
      { field_name: 'OrderAmount', type: 2 },
      { field_name: 'Currency', type: 1 },
      { field_name: 'OrderDate', type: 5 },
      { field_name: 'DeliveryDate', type: 5 },
      { field_name: 'Status', type: 1 },
      { field_name: 'CollectionRisk', type: 1 },
      { field_name: 'Source', type: 1 },
    ],
  },
  {
    name: '14_PO_Base',
    desc: '采购订单表',
    fields: [
      { field_name: 'POID', type: 1 },
      { field_name: 'SupplierID', type: 1 },
      { field_name: 'SOID', type: 1 },
      { field_name: 'PurchaseAmount', type: 2 },
      { field_name: 'OrderDate', type: 5 },
      { field_name: 'Status', type: 1 },
    ],
  },
  {
    name: '15_Inventory_Base',
    desc: '库存中心 — 库存主表',
    fields: [
      { field_name: 'InventoryID', type: 1 },
      { field_name: 'MPN', type: 1 },
      { field_name: 'Brand', type: 1 },
      { field_name: 'Warehouse', type: 1 },
      { field_name: 'AvailableQty', type: 2 },
      { field_name: 'ReservedQty', type: 2 },
      { field_name: 'InTransitQty', type: 2 },
      { field_name: 'LastUpdated', type: 5 },
    ],
  },
  {
    name: '16_Supply_Resource_Base',
    desc: '供应资源池 — 多源供应信息',
    fields: [
      { field_name: 'ResourceID', type: 1 },
      { field_name: 'SupplierID', type: 1 },
      { field_name: 'Brand', type: 1 },
      { field_name: 'MPN', type: 1 },
      { field_name: 'StockQty', type: 2 },
      { field_name: 'Price', type: 2 },
      { field_name: 'LeadTimeDays', type: 2 },
      { field_name: 'DateCode', type: 1 },
      { field_name: 'MOQ', type: 2 },
      { field_name: 'ResourceScore', type: 2 },
      { field_name: 'MatchScore', type: 2 },
      { field_name: 'Status', type: 1 },
      { field_name: 'Source', type: 1 },
      { field_name: 'SourceURL', type: 1 },
      { field_name: 'CapturedAt', type: 5 },
    ],
  },
];

// ============================================================================
// L2 财务数据层 (5张)
// ============================================================================
const L2_FINANCE = [
  {
    name: '21_AR_Base',
    desc: '应收中心 — 逾期监控',
    fields: [
      { field_name: 'ARID', type: 1 },
      { field_name: 'CustomerID', type: 1 },
      { field_name: 'SOID', type: 1 },
      { field_name: 'InvoiceNo', type: 1 },
      { field_name: 'InvoiceDate', type: 5 },
      { field_name: 'DueDate', type: 5 },
      { field_name: 'ARAmount', type: 2 },
      { field_name: 'PaidAmount', type: 2 },
      { field_name: 'OutstandingAmount', type: 2 },
      { field_name: 'OverdueDays', type: 2 },
      { field_name: 'RiskLevel', type: 1 },
      { field_name: 'Status', type: 1 },
      { field_name: 'CollectionOwner', type: 1 },
      { field_name: 'AICollectionSuggestion', type: 1 },
    ],
  },
  {
    name: '22_AP_Base',
    desc: '应付中心',
    fields: [
      { field_name: 'APID', type: 1 },
      { field_name: 'SupplierID', type: 1 },
      { field_name: 'POID', type: 1 },
      { field_name: 'APAmount', type: 2 },
      { field_name: 'OutstandingAmount', type: 2 },
      { field_name: 'DueDate', type: 5 },
      { field_name: 'Status', type: 1 },
    ],
  },
  {
    name: '23_Credit_Base',
    desc: '信用中心',
    fields: [
      { field_name: 'CustomerID', type: 1 },
      { field_name: 'CreditLimit', type: 2 },
      { field_name: 'UsedCredit', type: 2 },
      { field_name: 'AvailableCredit', type: 2 },
      { field_name: 'CreditScore', type: 2 },
      { field_name: 'LastReviewDate', type: 5 },
    ],
  },
  {
    name: '24_Risk_Case_Base',
    desc: '风险事件表',
    fields: [
      { field_name: 'RiskID', type: 1 },
      { field_name: 'RiskType', type: 1 },
      { field_name: 'Source', type: 1 },
      { field_name: 'Severity', type: 1 },
      { field_name: 'Owner', type: 1 },
      { field_name: 'Status', type: 1 },
      { field_name: 'Resolution', type: 1 },
      { field_name: 'CreatedAt', type: 5 },
    ],
  },
  {
    name: '25_Opportunity_Base',
    desc: '商机表 — 供需匹配',
    fields: [
      { field_name: 'OpportunityID', type: 1 },
      { field_name: 'InquiryID', type: 1 },
      { field_name: 'SupplyResourceID', type: 1 },
      { field_name: 'CustomerID', type: 1 },
      { field_name: 'SupplierID', type: 1 },
      { field_name: 'MatchScore', type: 2 },
      { field_name: 'MatchScoreDetail', type: 1 },
      { field_name: 'SuggestedPrice', type: 2 },
      { field_name: 'EstimatedMargin', type: 2 },
      { field_name: 'Status', type: 1 },
      { field_name: 'CreatedAt', type: 5 },
    ],
  },
];

// ============================================================================
// L3 知识+智能+Agent (3张)
// ============================================================================
const L3_KAI = [
  {
    name: '31_Knowledge_Base',
    desc: '统一知识目录',
    fields: [
      { field_name: 'KnowledgeID', type: 1 },
      { field_name: 'Title', type: 1 },
      { field_name: 'Category', type: 1 },
      { field_name: 'Department', type: 1 },
      { field_name: 'Owner', type: 1 },
      { field_name: 'SourceURL', type: 1 },
      { field_name: 'ConfidenceScore', type: 2 },
      { field_name: 'CreatedAt', type: 5 },
    ],
  },
  {
    name: '32_Agent_Audit_Log',
    desc: 'Agent审计日志',
    fields: [
      { field_name: 'AuditID', type: 1 },
      { field_name: 'AgentID', type: 1 },
      { field_name: 'ObjectType', type: 1 },
      { field_name: 'ObjectID', type: 1 },
      { field_name: 'Action', type: 1 },
      { field_name: 'Input', type: 1 },
      { field_name: 'Output', type: 1 },
      { field_name: 'ConfidenceScore', type: 2 },
      { field_name: 'Source', type: 1 },
      { field_name: 'Timestamp', type: 5 },
    ],
  },
  {
    name: '33_Event_Store',
    desc: '统一事件中心',
    fields: [
      { field_name: 'EventID', type: 1 },
      { field_name: 'EventType', type: 1 },
      { field_name: 'Source', type: 1 },
      { field_name: 'SourceID', type: 1 },
      { field_name: 'Operator', type: 1 },
      { field_name: 'EventTime', type: 5 },
      { field_name: 'Payload', type: 1 },
    ],
  },
];

// ============================================================================
// 全部表
// ============================================================================
const ALL_TABLES = [...L0_MASTER, ...L1_TRADING, ...L2_FINANCE, ...L3_KAI];

// ============================================================================
// API 调用
// ============================================================================
async function getToken(): Promise<string> {
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
  });
  const data = await res.json() as any;
  return data.tenant_access_token;
}

async function createBitable(token: string, name: string): Promise<string> {
  const res = await fetch('https://open.feishu.cn/open-apis/bitable/v1/apps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ name }),
  });
  const data = await res.json() as any;
  if (data.code !== 0) return '';
  return data.data?.app?.app_token || '';
}

async function addFields(token: string, bitableId: string, tableId: string, fields: any[]) {
  for (const field of fields) {
    await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${bitableId}/tables/${tableId}/fields`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(field),
      }
    );
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log(`║  ANOS 飞书多维表格全量创建 (${ALL_TABLES.length} 张)  ║`);
  console.log('╚══════════════════════════════════════════╝\n');

  const token = await getToken();
  console.log('🔑 Token OK\n');

  const created: string[] = [];
  const skipped: string[] = [];
  let totalFields = 0;

  for (let i = 0; i < ALL_TABLES.length; i++) {
    const table = ALL_TABLES[i]!;
    const progress = `[${String(i + 1).padStart(2, '0')}/${ALL_TABLES.length}]`;
    console.log(`${progress} ${table.name} — ${table.desc}`);

    const bitableId = await createBitable(token, table.name);
    if (!bitableId) {
      console.log(`     ⚠️ 创建失败或已存在\n`);
      skipped.push(table.name);
      continue;
    }

    // 获取默认 tableId
    const tRes = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${bitableId}/tables`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const tData = await tRes.json() as any;
    const tid = tData.data?.items?.[0]?.table_id || '';

    if (tid) {
      console.log(`     ➕ 添加 ${table.fields.length} 个字段...`);
      await addFields(token, bitableId, tid, table.fields);
      totalFields += table.fields.length;
    }

    created.push(table.name);
    console.log(`     ✅ https://tofl681bua.feishu.cn/base/${bitableId}\n`);

    // API 限流: 每张表间隔 1 秒
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log('═══════════════════════════════════════');
  console.log(`✅ 成功: ${created.length} | ⚠️ 跳过: ${skipped.length} | 📊 总字段: ${totalFields}`);
  console.log('');
  console.log('💡 飞书客户端搜索表名可直接打开');
  console.log('💡 L0=6张 L1=6张 L2=5张 L3=3张 = 共20张');
}

main().catch((err) => { console.error('❌', err.message); process.exit(1); });
