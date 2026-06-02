/**
 * 飞书多维表格 API 适配器
 * Phase 2: ANOS API → 飞书多维表格 (实时读写)
 */

const APP_ID = 'cli_a954e269f6385bca';
const APP_SECRET = 'ddotELJC0WZOsrrFPsGIOh1cpEYet0ms';
const BASE_URL = 'https://open.feishu.cn/open-apis/bitable/v1';

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) return cachedToken.token;
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
  });
  const data = await res.json() as any;
  cachedToken = { token: data.tenant_access_token, expiresAt: Date.now() + (data.expire || 3600) * 1000 };
  return cachedToken.token;
}

export const TABLE_MAP: Record<string, string> = {
  customers: 'TN4qbN8TXa2W3tsY78ccB16Tnqh',
  suppliers: 'VtInbgFJbazaR2seIMLcTPSmnTb',
  products: 'ViiGb1aAVaojalshcQrcXYNTnhg',
};

interface FeishuTableInfo { bitableId: string; tableId: string; name: string }
const tableCache = new Map<string, FeishuTableInfo>();

export async function resolveTable(tableName: string): Promise<FeishuTableInfo | null> {
  const cached = tableCache.get(tableName);
  if (cached) return cached;
  const bitableId = TABLE_MAP[tableName];
  if (!bitableId) return null;
  try {
    const token = await getToken();
    const res = await fetch(BASE_URL + '/apps/' + bitableId + '/tables', { headers: { 'Authorization': 'Bearer ' + token } });
    const data = await res.json() as any;
    const table = data.data?.items?.[0];
    if (!table?.table_id) return null;
    const info: FeishuTableInfo = { bitableId, tableId: table.table_id, name: table.name };
    tableCache.set(tableName, info);
    return info;
  } catch { return null; }
}

export async function feishuList(tableName: string): Promise<any[]> {
  const t = await resolveTable(tableName);
  if (!t) throw new Error('FEISHU_NOT_AVAILABLE');
  const token = await getToken();
  const res = await fetch(BASE_URL + '/apps/' + t.bitableId + '/tables/' + t.tableId + '/records?page_size=100', { headers: { 'Authorization': 'Bearer ' + token } });
  return (await res.json() as any).data?.items || [];
}

export async function feishuCreate(tableName: string, fields: Record<string, any>) {
  const t = await resolveTable(tableName);
  if (!t) throw new Error('FEISHU_NOT_AVAILABLE');
  const token = await getToken();
  const res = await fetch(BASE_URL + '/apps/' + t.bitableId + '/tables/' + t.tableId + '/records', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ fields }),
  });
  const data = await res.json() as any;
  if (data.code !== 0) throw new Error(data.msg);
  return data.data?.record;
}
