/**
 * ERP API 客户端 (ICERP V2)
 * 对接 http://erp-api.360ic.com
 * 
 * 功能: Token管理 + 客户/供应商/物料/订单查询
 */

const ERP_BASE = process.env.ERP_API_URL || 'http://erp-api.360ic.com';
const ERP_PLATFORM = process.env.ERP_PLATFORM || 'ANOS';
const ERP_USER = process.env.ERP_USER || 'admin';

let cachedErpToken: { token: string; expiresAt: number } | null = null;

/** 获取 ERP Token */
export async function getErpToken(): Promise<string> {
  if (cachedErpToken && cachedErpToken.expiresAt > Date.now() + 60000) {
    return cachedErpToken.token;
  }
  const res = await fetch(`${ERP_BASE}/api/Service/GetToken?platform=${ERP_PLATFORM}&userId=${ERP_USER}`);
  const data = await res.json() as any;
  if (data.code !== 200) throw new Error(`ERP Token error: ${data.info}`);
  const token = data.data.SignToken;
  // 默认1.5小时过期
  cachedErpToken = { token, expiresAt: Date.now() + 5400000 };
  return token;
}

/** ERP 通用查询 */
async function erpQuery(endpoint: string, fieldKeys: string, limit = 100, filters?: any[]) {
  const token = await getErpToken();
  const body: any = { FieldKeys: fieldKeys, Limit: limit, OrderString: 'autoid' };
  if (filters?.length) body.FilterString = filters;

  const res = await fetch(`${ERP_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'token': token },
    body: JSON.stringify(body),
  });
  const data = await res.json() as any;
  if (data.Message) throw new Error(data.Message);
  return data.Data || data.data || [];
}

/** 客户查询 */
export async function erpGetCustomers(limit = 100) {
  return erpQuery('/api/v1/BD_Customer/executebillquery', 'Number,Name,ClassTypeName,Phone,Address,CreateDate', limit);
}

/** 供应商查询 */
export async function erpGetSuppliers(limit = 100) {
  return erpQuery('/api/v1/BD_Supplier/executebillquery', 'Number,Name,ClassTypeName,Phone,Address', limit);
}

/** 物料查询 */
export async function erpGetMaterials(limit = 100) {
  return erpQuery('/api/v1/BD_MATERIAL/executebillquery', 'Number,Name,Code,Model,Unit,CreateDate', limit);
}

/** 采购订单查询 */
export async function erpGetPurchaseOrders(limit = 50) {
  return erpQuery('/api/v1/PUR_PurchaseOrder/executebillquery', 'Number,Date,VendorName,Amount,Status', limit);
}

/** ERP 健康检查 */
export async function erpHealthCheck(): Promise<boolean> {
  try {
    await getErpToken();
    return true;
  } catch {
    return false;
  }
}
