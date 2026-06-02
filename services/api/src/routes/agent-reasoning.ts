/**
 * Agent 推理引擎
 * Phase 1: 规则驱动 — Sales/Credit Agent 基于数据给出建议
 */

import { Hono } from 'hono';
import Database from 'better-sqlite3';
import path from 'node:path';
import { jwtAuth } from '../middleware/jwt';

const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');
function getDb() { const sqlite = new Database(DB_PATH); sqlite.pragma('journal_mode = WAL'); return sqlite; }

export const agentReasoningRoutes = new Hono().use('*', jwtAuth);

// ============================================================================
// Sales Agent: 询价分析 → 报价建议
// ============================================================================
agentReasoningRoutes.post('/sales/quote-suggestion', async (c) => {
  const { inquiryId } = await c.req.json() as any;
  const db = getDb();
  try {
    const inquiry = db.prepare('SELECT * FROM inquiries WHERE inquiry_id = ?').get(inquiryId) as any;
    if (!inquiry) return c.json({ error: 'Inquiry not found' }, 404);

    const customer = db.prepare('SELECT * FROM customers WHERE customer_id = ?').get(inquiry.customer_id) as any;
    const resources = db.prepare('SELECT * FROM supply_resources WHERE mpn = ? ORDER BY price ASC LIMIT 5').all(inquiry.mpn) as any[];

    // 规则推理
    const avgPrice = resources.length > 0 ? resources.reduce((s: number, r: any) => s + r.price, 0) / resources.length : inquiry.target_price || 4.0;
    const suggestedPrice = Math.round(avgPrice * 1.05 * 100) / 100;
    const confidence = resources.length >= 3 ? 88 : resources.length >= 1 ? 75 : 50;

    const evidence = resources.slice(0, 3).map((r: any) => `${r.supplier_id}: $${r.price} 库存${r.stock_qty} 交期${r.lead_time_days || '?'}天`);

    const actions = [];
    if (resources.length > 0) {
      actions.push({ label: `报价 $${suggestedPrice}/pcs (推荐)`, risk: 'low' });
      actions.push({ label: `报价 $${Math.round(suggestedPrice * 1.08 * 100) / 100}/pcs (含buffer)`, risk: 'medium' });
    }
    if (customer?.risk_level === 'L4_High' || customer?.risk_level === 'L3_Warning') {
      actions.push({ label: '⚠ 客户风险较高，建议预收款', risk: 'high' });
    }

    return c.json({
      agent: 'Sales Agent',
      conclusion: `${inquiry.mpn} 建议报价 $${suggestedPrice}/pcs，基于${resources.length}个供应资源${customer ? `，客户信用 ${customer.credit_level || 'N/A'}` : ''}。`,
      evidence,
      confidenceScore: confidence,
      suggestedActions: actions,
      requiresApproval: true,
    });
  } catch (err: any) { return c.json({ error: err.message }, 500); }
  finally { db.close(); }
});

// ============================================================================
// Credit Agent: AR风险分析 → 处置建议
// ============================================================================
agentReasoningRoutes.post('/credit/risk-analysis', async (c) => {
  const { customerId } = await c.req.json() as any;
  const db = getDb();
  try {
    const arItems = db.prepare('SELECT * FROM ar_items WHERE customer_id = ? AND status != ? ORDER BY overdue_days DESC').all(customerId, 'Paid') as any[];
    const customer = db.prepare('SELECT * FROM customers WHERE customer_id = ?').get(customerId) as any;

    const totalOutstanding = arItems.reduce((s: number, a: any) => s + (a.outstanding_amount || 0), 0);
    const maxOverdue = arItems.length > 0 ? Math.max(...arItems.map((a: any) => a.overdue_days || 0)) : 0;

    let riskLevel = 'L1_Low';
    let conclusion = '';
    const actions: any[] = [];

    if (maxOverdue > 90) {
      riskLevel = 'L4_High';
      conclusion = `严重逾期 ${maxOverdue} 天，未回款 $${totalOutstanding.toLocaleString()}。建议立即暂停发货并启动法务催收。`;
      actions.push({ label: '暂停发货', risk: 'high' }, { label: '启动法务催收', risk: 'high' });
    } else if (maxOverdue > 60) {
      riskLevel = 'L3_Warning';
      conclusion = `逾期 ${maxOverdue} 天，未回款 $${totalOutstanding.toLocaleString()}。建议发送催收函并暂停新订单。`;
      actions.push({ label: '发送催收函', risk: 'medium' }, { label: '暂停新订单审批', risk: 'medium' });
    } else if (maxOverdue > 30) {
      riskLevel = 'L2_Watch';
      conclusion = `逾期 ${maxOverdue} 天，未回款 $${totalOutstanding.toLocaleString()}。建议电话催收并邮件提醒。`;
      actions.push({ label: '电话催收', risk: 'low' }, { label: '邮件提醒', risk: 'low' });
    } else {
      conclusion = `AR 状态正常，未回款 $${totalOutstanding.toLocaleString()}。`;
    }

    return c.json({
      agent: 'Credit Agent',
      conclusion,
      evidence: [
        `未回款总额: $${totalOutstanding.toLocaleString()}`,
        `最大逾期天数: ${maxOverdue} 天`,
        `客户信用等级: ${customer?.credit_level || 'N/A'}`,
        `AR 笔数: ${arItems.length}`,
      ],
      confidenceScore: arItems.length > 0 ? 90 : 70,
      riskLevel,
      suggestedActions: actions,
      requiresApproval: riskLevel !== 'L1_Low',
    });
  } catch (err: any) { return c.json({ error: err.message }, 500); }
  finally { db.close(); }
});
