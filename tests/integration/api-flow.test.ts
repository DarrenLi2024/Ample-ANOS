/**
 * 集成测试: 端到端业务链路
 * 客户创建 → 询价 → 供应资源 → 匹配 → 报价 → AR风险
 */
import { describe, it, expect, beforeAll } from 'vitest';

const API = 'http://localhost:3001';
const HEADERS = { 'Content-Type': 'application/json', 'X-User-Role': 'SystemAdmin' as string };

describe('ANOS 端到端业务链路', () => {
  let customerId = '';
  let inquiryId = '';
  let resourceId = '';
  let opportunityId = '';

  it('1. 创建客户', async () => {
    const res = await fetch(`${API}/api/customers`, {
      method: 'POST', headers: HEADERS,
      body: JSON.stringify({ customerName: 'E2E测试客户', country: 'CN', customerLevel: 'B', source: 'Test' }),
    });
    expect(res.status).toBe(201);
    const data = await res.json() as any;
    customerId = data.customer_id;
    expect(customerId).toBeTruthy();
  });

  it('2. 创建询价 (Inquiry)', async () => {
    const res = await fetch(`${API}/api/inquiries`, {
      method: 'POST', headers: HEADERS,
      body: JSON.stringify({ customerId, mpn: 'STM32F407VET6', quantity: 5000, targetPrice: 4.5, priority: 'High', source: 'Test' }),
    });
    expect(res.status).toBe(201);
    const data = await res.json() as any;
    inquiryId = data.inquiry_id;
    expect(inquiryId).toBeTruthy();
  });

  it('3. 创建供应资源', async () => {
    const res = await fetch(`${API}/api/supply-resources`, {
      method: 'POST', headers: HEADERS,
      body: JSON.stringify({ supplierId: 'S-001', mpn: 'STM32F407VET6', stockQty: 8000, price: 4.2, leadTimeDays: 14, source: 'Test' }),
    });
    expect(res.status).toBe(201);
    const data = await res.json() as any;
    resourceId = data.resource_id;
    expect(resourceId).toBeTruthy();
  });

  it('4. Workflow: Inquiry Intake (WF-001)', async () => {
    const res = await fetch(`${API}/api/workflow/inquiry-intake`, {
      method: 'POST', headers: HEADERS,
      body: JSON.stringify({ rawText: '需要 STM32F407VET6 5000pcs 目标价 $4.50 急', source: 'Email', sourceType: 'Email' }),
    });
    expect(res.status).toBe(201);
    const data = await res.json() as any;
    expect(data.success).toBe(true);
  });

  it('5. Workflow: Supply Intake (WF-002)', async () => {
    const res = await fetch(`${API}/api/workflow/supply-intake`, {
      method: 'POST', headers: HEADERS,
      body: JSON.stringify({ rawText: 'Arrow STM32F407VET6 库存8000pcs 报价$4.20 交期2周', source: 'Email', sourceType: 'Email' }),
    });
    expect(res.status).toBe(201);
    const data = await res.json() as any;
    expect(data.success).toBe(true);
  });

  it('6. Workflow: Opportunity Match (WF-003)', async () => {
    const res = await fetch(`${API}/api/workflow/opportunity-match`, {
      method: 'POST', headers: HEADERS,
      body: JSON.stringify({ inquiryId }),
    });
    expect(res.status).toBe(201);
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    if (data.opportunities?.length > 0) {
      opportunityId = data.opportunities[0].opportunityId;
    }
  });

  it('7. 创建报价 (Offer)', async () => {
    const res = await fetch(`${API}/api/offers`, {
      method: 'POST', headers: HEADERS,
      body: JSON.stringify({ inquiryId, customerId, supplierId: 'S-001', brand: 'STMicroelectronics', mpn: 'STM32F407VET6', quantity: 5000, unitPrice: 4.35, source: 'Test' }),
    });
    expect(res.status).toBe(201);
  });

  it('8. Workflow: AR Risk Check (WF-004)', async () => {
    const res = await fetch(`${API}/api/workflow/ar-risk-check`, {
      method: 'POST', headers: HEADERS,
    });
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.success).toBe(true);
  });

  it('9. 审计日志查询', async () => {
    const res = await fetch(`${API}/api/audit?objectType=Inquiry`, { headers: HEADERS });
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.data).toBeDefined();
  });
});
