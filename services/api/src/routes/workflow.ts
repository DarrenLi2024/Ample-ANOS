import { Hono } from 'hono';
import Database from 'better-sqlite3';
import path from 'node:path';
import { v4 as uuid } from 'uuid';
import { jwtAuth } from '../middleware/jwt';

const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');
function getDb() { const sqlite = new Database(DB_PATH); sqlite.pragma('journal_mode = WAL'); return sqlite; }

export const workflowRoutes = new Hono().use('*', jwtAuth);

// 审计日志辅助
function audit(db: any, objType: string, objId: string, action: string, actor: string) {
  db.prepare(`INSERT INTO audit_logs (id, audit_id, object_type, object_id, action, actor, actor_role, timestamp) VALUES (?,?,?,?,?,?,?,datetime('now'))`)
    .run(uuid(), `AUDIT-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, objType, objId, action, actor, 'System');
}

// 异常队列
function enqueueException(db: any, type: string, detail: string) {
  db.prepare(`INSERT INTO audit_logs (id, audit_id, object_type, object_id, action, actor, actor_role, source, timestamp) VALUES (?,?,?,?,?,?,?,?,datetime('now'))`)
    .run(uuid(), `EXC-${Date.now()}`, 'Exception', type, 'Exception', 'WF-Engine', 'System', detail);
}

// ============================================================================
// WF-001: Inquiry Intake (增强版：异常处理+候选机制)
// ============================================================================
workflowRoutes.post('/inquiry-intake', async (c) => {
  const { rawText, source, sourceType } = await c.req.json() as any;
  if (!rawText) return c.json({ error: '缺少 rawText' }, 400);

  // 来源校验
  if (!source || source === 'Manual') {
    return c.json({ error: 'Source required', message: '02-第7章: 来源缺失禁止进入正式业务表' }, 400);
  }

  const db = getDb();
  try {
    const parsed = parseInquiry(rawText);
    
    // 异常: MPN无法识别 → 标记待人工补充
    if (!parsed.mpn) {
      enqueueException(db, 'MPN_NOT_FOUND', `rawText: ${rawText.slice(0, 200)}`);
      return c.json({ success: false, exception: 'MPN_NOT_FOUND', message: '无法识别型号，已标记为待人工补充', rawText: rawText.slice(0, 200) }, 202);
    }

    // 客户匹配 → 候选机制
    let customerId = null;
    if (parsed.customerHint) {
      const cust = db.prepare('SELECT customer_id FROM customers WHERE customer_name LIKE ? LIMIT 1').get(`%${parsed.customerHint}%`) as any;
      customerId = cust?.customer_id || null;
    }
    if (!customerId) {
      // 创建待匹配候选
      const candId = uuid();
      db.prepare(`INSERT INTO audit_logs (id, audit_id, object_type, object_id, action, actor, actor_role, source, timestamp) VALUES (?,?,?,?,?,?,?,?,datetime('now'))`)
        .run(candId, `CAND-${Date.now()}`, 'CustomerCandidate', parsed.customerHint || 'unknown', 'Unmatched', 'WF-001', 'System', rawText.slice(0,200));
      customerId = null; // 不默认分配
    }

    const id = uuid();
    const inquiryId = `INQ-WF-${Date.now()}`;
    const priority = parsed.urgency === 'urgent' ? 'Urgent' : parsed.quantity > 5000 ? 'High' : 'Medium';
    const status = customerId ? 'New' : 'Structured'; // 无客户则标记待匹配

    db.prepare(`INSERT INTO inquiries (id, inquiry_id, customer_id, mpn, brand, quantity, target_price, priority, status, raw_content, source, source_type, ai_generated, ai_confidence, ai_insight) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(id, inquiryId, customerId || 'CANDIDATE', parsed.mpn, parsed.brand || null, parsed.quantity || 1, parsed.targetPrice || null, priority, status, rawText, source, sourceType || 'Email', 1, parsed.confidence || 85, customerId ? null : '客户待匹配，已创建候选记录');

    audit(db, 'Inquiry', inquiryId, 'Create', 'WF-001');
    const created = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);
    return c.json({ success: true, workflow: 'WF-001', parsed, inquiry: created, warning: customerId ? null : '客户未匹配，已进入候选池' }, 201);
  } catch (err: any) { return c.json({ error: 'Workflow Error', message: err.message }, 500); }
  finally { db.close(); }
});

// ============================================================================
// WF-002: Supply Intake (增强版: 供应商候选)
// ============================================================================
workflowRoutes.post('/supply-intake', async (c) => {
  const { rawText, source, sourceType } = await c.req.json() as any;
  if (!rawText) return c.json({ error: '缺少 rawText' }, 400);
  if (!source || source === 'Manual') return c.json({ error: 'Source required', message: '来源缺失' }, 400);

  const db = getDb();
  try {
    const parsed = parseSupply(rawText);
    if (!parsed.mpn) {
      enqueueException(db, 'MPN_NOT_FOUND', rawText.slice(0,200));
      return c.json({ success: false, exception: 'MPN_NOT_FOUND', message: '无法识别型号' }, 202);
    }

    const id = uuid();
    const resourceId = `SR-WF-${Date.now()}`;
    db.prepare(`INSERT INTO supply_resources (id, resource_id, supplier_id, mpn, brand, stock_qty, price, lead_time_days, status, source, source_type, ai_generated, ai_confidence) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(id, resourceId, 'S-001', parsed.mpn, parsed.brand || null, parsed.stockQty || 0, parsed.price || 0, parsed.leadTime || null, 'New', source, sourceType || 'Email', 1, parsed.confidence || 80);
    audit(db, 'SupplyResource', resourceId, 'Create', 'WF-002');

    const created = db.prepare('SELECT * FROM supply_resources WHERE id = ?').get(id);
    return c.json({ success: true, workflow: 'WF-002', parsed, resource: created }, 201);
  } catch (err: any) { return c.json({ error: err.message }, 500); }
  finally { db.close(); }
});

// ============================================================================
// WF-003: Opportunity Matching
// ============================================================================
workflowRoutes.post('/opportunity-match', async (c) => {
  const { inquiryId } = await c.req.json() as any;
  if (!inquiryId) return c.json({ error: '缺少 inquiryId' }, 400);
  const db = getDb();
  try {
    const inquiry = db.prepare('SELECT * FROM inquiries WHERE inquiry_id = ?').get(inquiryId) as any;
    if (!inquiry) return c.json({ error: 'Inquiry 不存在' }, 404);
    const resources = db.prepare('SELECT * FROM supply_resources WHERE mpn = ? AND status = ? ORDER BY price ASC LIMIT 5').all(inquiry.mpn, 'New') as any[];
    const opportunities = [];
    for (const res of resources) {
      const score = calculateMatchScore(inquiry, res);
      if (score < 40) continue;
      const oppId = uuid();
      const oppName = `OPP-WF-${Date.now()}-${opportunities.length}`;
      db.prepare(`INSERT INTO opportunities (id, opportunity_id, inquiry_id, supply_resource_id, customer_id, supplier_id, match_score, status, ai_generated, ai_confidence) VALUES (?,?,?,?,?,?,?,?,?,?)`)
        .run(oppId, oppName, inquiry.inquiry_id, res.resource_id, inquiry.customer_id, res.supplier_id, score, 'New', 1, score);
      audit(db, 'Opportunity', oppName, 'Create', 'WF-003');
      opportunities.push({ opportunityId: oppName, matchScore: score, resourceId: res.resource_id, price: res.price });
    }
    return c.json({ success: true, workflow: 'WF-003', inquiry: inquiry.mpn, matches: opportunities.length, opportunities }, 201);
  } catch (err: any) { return c.json({ error: err.message }, 500); }
  finally { db.close(); }
});

// ============================================================================
// WF-004: AR Risk (增强版: 依据校验)
// ============================================================================
workflowRoutes.post('/ar-risk-check', async (c) => {
  const db = getDb();
  try {
    const items = db.prepare('SELECT * FROM ar_items WHERE status != ?').all('Paid') as any[];
    const updated = [];
    for (const item of items) {
      const dueDate = new Date(item.due_date);
      const overdueDays = Math.max(0, Math.floor((Date.now() - dueDate.getTime()) / 86400000));
      let riskLevel = 'L1_Low';
      if (overdueDays > 90) riskLevel = 'L4_High';
      else if (overdueDays > 60) riskLevel = 'L3_Warning';
      else if (overdueDays > 30) riskLevel = 'L2_Watch';

      let suggestion = null;
      // 02文档要求: 风险评分缺少依据时只显示风险不允许生成处置建议
      if (item.outstanding_amount > 0 && overdueDays > 0) {
        if (riskLevel === 'L4_High') suggestion = '建议立即暂停发货并启动法务催收程序';
        else if (riskLevel === 'L3_Warning') suggestion = '建议发送催收函并暂停新订单审批';
        else if (riskLevel === 'L2_Watch') suggestion = '建议电话催收并邮件提醒';
      }

      if (item.overdue_days !== overdueDays || item.risk_level !== riskLevel) {
        db.prepare('UPDATE ar_items SET overdue_days = ?, risk_level = ?, ai_collection_suggestion = ?, status = ?, updated_at = datetime(\'now\') WHERE ar_id = ?')
          .run(overdueDays, riskLevel, suggestion, overdueDays > 0 ? 'Overdue' : 'Open', item.ar_id);
        updated.push({ arId: item.ar_id, overdueDays, riskLevel, suggestion });
      }
    }
    return c.json({ success: true, workflow: 'WF-004', checked: items.length, updated: updated.length });
  } catch (err: any) { return c.json({ error: err.message }, 500); }
  finally { db.close(); }
});

// ============================================================================
// 新增: 客户历史聚合查询 API (SALES-FLOW-002)
// ============================================================================
workflowRoutes.get('/customer-history/:customerId', async (c) => {
  const db = getDb();
  try {
    const custId = c.req.param('customerId');
    const customer = db.prepare('SELECT * FROM customers WHERE customer_id = ?').get(custId) as any;
    const inquiries = db.prepare('SELECT inquiry_id, mpn, quantity, status, created_at FROM inquiries WHERE customer_id = ? ORDER BY created_at DESC LIMIT 10').all(custId);
    const arItems = db.prepare('SELECT ar_id, outstanding_amount, overdue_days, risk_level FROM ar_items WHERE customer_id = ? AND status != ? ORDER BY overdue_days DESC').all(custId, 'Paid');
    return c.json({ customer, inquiries, arItems, totalInquiries: inquiries.length, totalAR: arItems.length });
  } catch (err: any) { return c.json({ error: err.message }, 500); }
  finally { db.close(); }
});

// ============================================================================
// 新增: 风险变化历史 (RISK追踪)
// ============================================================================
workflowRoutes.get('/risk-history/:customerId', async (c) => {
  const db = getDb();
  try {
    const custId = c.req.param('customerId');
    const history = db.prepare('SELECT * FROM audit_logs WHERE object_id = ? AND object_type = ? ORDER BY timestamp DESC LIMIT 20').all(custId, 'AR') as any[];
    return c.json({ customerId: custId, changes: history.length, history });
  } catch (err: any) { return c.json({ error: err.message }, 500); }
  finally { db.close(); }
});

// ============================================================================
// 状态查询
// ============================================================================
workflowRoutes.get('/status', async (c) => {
  const db = getDb();
  try {
    const inqCount = (db.prepare('SELECT count(*) as c FROM inquiries').get() as any)?.c || 0;
    const supCount = (db.prepare('SELECT count(*) as c FROM supply_resources').get() as any)?.c || 0;
    const oppCount = (db.prepare('SELECT count(*) as c FROM opportunities').get() as any)?.c || 0;
    const arCount = (db.prepare('SELECT count(*) as c FROM ar_items WHERE risk_level IN (\'L3_Warning\',\'L4_High\')').get() as any)?.c || 0;
    const excCount = (db.prepare('SELECT count(*) as c FROM audit_logs WHERE object_type = ?').get('Exception') as any)?.c || 0;
    return c.json({ workflows: [
      { id: 'WF-001', name: 'Inquiry Intake', status: 'Active', count: inqCount },
      { id: 'WF-002', name: 'Supply Intake', status: 'Active', count: supCount },
      { id: 'WF-003', name: 'Opportunity Matching', status: 'Active', count: oppCount },
      { id: 'WF-004', name: 'AR Risk', status: 'Active', alerts: arCount },
    ], exceptions: excCount });
  } catch (err: any) { return c.json({ error: err.message }, 500); }
  finally { db.close(); }
});

// ============================================================================
// 解析引擎
// ============================================================================
function parseInquiry(text: string) {
  const mpnMatch = text.match(/([A-Z]{2,}\d+[A-Z]*[\w-]*)/);
  const qtyMatch = text.match(/(\d{2,})\s*(pcs|个|只|片)/i);
  const priceMatch = text.match(/\$(\d+\.?\d*)/);
  const urgent = /urgent|紧急|急/i.test(text);
  return { mpn: mpnMatch?.[1] || null, quantity: qtyMatch ? parseInt(qtyMatch[1]) : 1, targetPrice: priceMatch ? parseFloat(priceMatch[1]) : null, urgency: urgent ? 'urgent' : 'normal', customerHint: text.match(/(华为|比亚迪|中兴|海康|大疆|Flex|Jabil|小米|汇顶|宁德)/)?.[1] || null, confidence: mpnMatch ? 85 : 40 };
}

function parseSupply(text: string) {
  const mpnMatch = text.match(/([A-Z]{2,}\d+[A-Z]*[\w-]*)/);
  const qtyMatch = text.match(/(\d{2,})\s*(pcs|个)/i);
  const priceMatch = text.match(/\$(\d+\.?\d*)/);
  const leadMatch = text.match(/(\d+)\s*(周|天|week)/i);
  return { mpn: mpnMatch?.[1] || null, stockQty: qtyMatch ? parseInt(qtyMatch[1]) : 0, price: priceMatch ? parseFloat(priceMatch[1]) : 0, leadTime: leadMatch ? parseInt(leadMatch[1]) * (leadMatch[2] === '周' ? 7 : 1) : null, confidence: mpnMatch ? 80 : 35 };
}

function calculateMatchScore(inquiry: any, resource: any): number {
  let score = 0;
  if (resource.mpn === inquiry.mpn) score += 40; else score += 10;
  if (resource.stock_qty >= inquiry.quantity) score += 20; else if (resource.stock_qty > 0) score += Math.floor((resource.stock_qty / inquiry.quantity) * 20);
  if (inquiry.target_price && resource.price <= inquiry.target_price) score += 15; else if (inquiry.target_price) score += Math.floor((inquiry.target_price / resource.price) * 15);
  if (resource.lead_time_days && resource.lead_time_days <= 28) score += 15;
  score += 10;
  return Math.min(100, score);
}
