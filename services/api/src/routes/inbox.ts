/**
 * AI Inbox API — 统一智能入口
 * 
 * POST /api/inbox/submit  — 提交内容，AI分类+路由
 * POST /api/inbox/classify — 仅分类，不写入
 * GET  /api/inbox/stats   — Inbox 统计数据
 */
import { Hono } from 'hono';
import { jwtAuth } from '../middleware/jwt';
import { v4 as uuid } from 'uuid';
import Database from 'better-sqlite3';
import path from 'node:path';

const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');

function getDb() {
  const sqlite = new Database(DB_PATH);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  return sqlite;
}

export const inboxRoutes = new Hono().use('*', jwtAuth);

// ============================================================================
// 意图分类引擎
// ============================================================================
function classifyIntent(text: string): {
  intent: 'Demand' | 'Supply' | 'Knowledge' | 'Risk' | 'Unknown';
  confidence: number;
  extracted: Record<string, any>;
} {
  const lower = text.toLowerCase();
  const mpnMatch = text.match(/[A-Z]{2,}\d+[A-Z\d\-]*/g);
  const mpn = mpnMatch?.[0] || undefined;
  const allMpns = mpnMatch || [];
  const brandMatch = text.match(/\b(ST|TI|ADI|Intel|AMD|Micron|Microchip|Winbond|Espressif|NXP|Infineon)\b/i);
  const brand = brandMatch?.[1] || undefined;
  const qtyMatch = text.match(/(\d{2,})\s*(个|pcs|片|颗|只|[Kk])/);
  const quantity = qtyMatch ? parseInt(qtyMatch[1]) : undefined;
  const priceMatch = text.match(/\$?(\d+\.?\d*)\s*(元|USD|美金|RMB)/);
  const targetPrice = priceMatch ? parseFloat(priceMatch[1]) : undefined;

  const queryKeywords = ['查看', '查询', '最新', '列表', '显示', '有哪些', '帮我查', '看看', 'show', 'list'];
  const demandKeywords = ['询价', 'rfq', '需要', '买', 'find', 'looking for', '需求', '求购', '帮我找', '找一下', '有没有', '要买', '采购'];
  const supplyKeywords = ['供应', '现货', '库存', 'offer', 'supply', '可出', '有货', '渠道', '报价单', '代理', '有人接', '联系', '批次', '原装', '正品', '全新'];
  const knowledgeKeywords = ['sop', '流程', '怎么做', 'how to', '规定', '制度', '操作手册', '知识', '政策'];
  const riskKeywords = ['逾期', '风险', '催收', 'ar', '信用', '回款', '欠款', '坏账'];

  let intent: 'Demand' | 'Supply' | 'Knowledge' | 'Risk' | 'Query' | 'Unknown' = 'Unknown';
  let confidence = 50;

  // 优先级: 查询>需求>供应>知识>风险
  const hasQuery = queryKeywords.some(k => lower.includes(k));
  const hasDemand = demandKeywords.some(k => lower.includes(k));
  const hasSupply = supplyKeywords.some(k => lower.includes(k));
  const hasKnowledge = knowledgeKeywords.some(k => lower.includes(k));
  const hasRisk = riskKeywords.some(k => lower.includes(k));
  const hasMPNAndQty = !!(mpn && quantity);

  // 查询类：查看/显示/列表 → 不创建资产，返回查询意图
  if (hasQuery) {
    if (hasSupply || /offer|supply|供应|资源/i.test(lower)) { intent = 'Query'; confidence = 90; }
    else if (hasDemand || /inquiry|询价|需求|rfq/i.test(lower)) { intent = 'Query'; confidence = 90; }
    else if (hasRisk || /ar|风险|逾期/i.test(lower)) { intent = 'Query'; confidence = 90; }
    else { intent = 'Query'; confidence = 80; }
  }

  if (intent !== 'Query' && hasDemand) { intent = 'Demand'; confidence = mpn ? 88 : 75; }
  else if (hasSupply) { intent = 'Supply'; confidence = mpn ? 85 : 72; }
  else if (hasKnowledge) { intent = 'Knowledge'; confidence = 70; }
  else if (hasRisk) { intent = 'Risk'; confidence = 78; }
  // 无关键词匹配时: 有价格信号 → Supply; 纯型号+数量 → Demand
  else if (hasMPNAndQty && !targetPrice) { intent = 'Demand'; confidence = 70; }
  else if (hasMPNAndQty && targetPrice) { intent = 'Supply'; confidence = 75; }
  else if (mpn) { intent = 'Supply'; confidence = 65; }

  return {
    intent,
    confidence,
    extracted: { mpn, brand, quantity, targetPrice, allMpns },
  };
}

// ============================================================================
// POST /api/inbox/submit — 提交内容、分类、路由、写入
// ============================================================================
inboxRoutes.post('/submit', async (c) => {
  const db = getDb();
  try {
    const body = await c.req.json();
    const { content, source = 'AI Inbox', sourceType = 'Text', sourceOwner = 'User' } = body as {
      content: string;
      source?: string;
      sourceType?: string;
      sourceOwner?: string;
    };

    if (!content || !content.trim()) {
      return c.json({ error: { code: 'EMPTY_CONTENT', message: '内容不能为空' } }, 400);
    }

    // Step 1: 分类
    const classified = classifyIntent(content);
    const assetId = `ASSET-${classified.intent.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Step 2: 生成 Source Card
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const sourceRecord = {
      assetId,
      content: content.slice(0, 500),
      intent: classified.intent,
      confidence: classified.confidence,
      source,
      sourceType,
      sourceOwner,
      capturedAt: now,
      status: classified.confidence >= 80 ? 'AutoRouted' : 'PendingReview',
    };

    // Step 3: Route to Agent Registry — no direct INSERT
    // Agent endpoints handle all creation logic per SA-020
    const routeResult: any = { routed: false, target: null };
    routeResult.routed = true;
    routeResult.target = classified.intent === 'Demand' ? 'inquiries' : 'supply_resources';
    routeResult.intent = classified.intent;
    routeResult.mpns = (classified.extracted as any)['allMpns'] || [classified.extracted.mpn].filter(Boolean);
    routeResult.classification = {
      intent: classified.intent,
      confidence: classified.confidence,
    };
        // Step 4: 写入审计日志
    db.prepare(`INSERT INTO audit_logs (id, audit_id, object_type, object_id, action, actor, actor_role, source, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      uuid(), `AUD-${Date.now()}`, 'AIInbox', assetId, 'ASSET_REGISTERED',
      'AI Inbox Engine', 'System', source, now,
    );

    return c.json({
      success: true,
      data: {
        ...sourceRecord,
        routeResult,
        suggestion: classified.intent === 'Query'
          ? `已理解查询意图，请前往 ${routeResult.navigateTo} 页面查看。`
          : classified.intent === 'Demand'
            ? (routeResult.batchCount > 1 ? `已批量创建 ${routeResult.batchCount} 条 Inquiry。` : '已创建 Inquiry，Sales Agent 将自动匹配供应资源。')
            : classified.intent === 'Supply'
              ? (routeResult.batchCount > 1 ? `已批量创建 ${routeResult.batchCount} 条 SupplyResource。` : '已登记供应资源，Procurement Agent 将验证并匹配需求。')
              : classified.intent === 'Risk'
                ? 'Credit Agent 将分析风险并生成处置建议。'
              : '已作为通用资产登记，等待人工分类。',
      },
    }, 201);
  } catch (err: any) {
    return c.json({ error: { code: 'INBOX_ERROR', message: err.message } }, 500);
  } finally {
    db.close();
  }
});

// ============================================================================
// POST /api/inbox/classify — 仅分类预览（不写入）
// ============================================================================
inboxRoutes.post('/classify', async (c) => {
  const body = await c.req.json();
  const { content } = body as { content: string };
  if (!content?.trim()) return c.json({ error: '内容不能为空' }, 400);
  const result = classifyIntent(content);
  return c.json({ success: true, data: result });
});

// ============================================================================
// GET /api/inbox/stats — Inbox 统计数据
// ============================================================================
inboxRoutes.get('/stats', async (c) => {
  const db = getDb();
  try {
    const newInquiries = (db.prepare("SELECT COUNT(*) as c FROM inquiries WHERE status = 'New'").get() as any).c;
    const urgentInquiries = (db.prepare("SELECT COUNT(*) as c FROM inquiries WHERE priority IN ('Urgent','High') AND status = 'New'").get() as any).c;
    const totalSupply = (db.prepare('SELECT COUNT(*) as c FROM supply_resources WHERE status != ?').get('Deleted') as any).c;
    const newSupply = (db.prepare("SELECT COUNT(*) as c FROM supply_resources WHERE status = 'New'").get() as any).c;
    const totalOpps = (db.prepare('SELECT COUNT(*) as c FROM opportunities').get() as any).c;
    const newOpps = (db.prepare("SELECT COUNT(*) as c FROM opportunities WHERE status = 'New'").get() as any).c;
    const highRiskAR = (db.prepare("SELECT COUNT(*) as c FROM ar_items WHERE risk_level IN ('L4_High','L3_Warning')").get() as any).c;
    const todayAssets = (db.prepare("SELECT COUNT(*) as c FROM audit_logs WHERE object_type = 'AIInbox' AND date(timestamp) = date('now')").get() as any).c;

    return c.json({
      success: true,
      data: {
        newInquiries, urgentInquiries, totalSupply, newSupply,
        totalOpps, newOpps, highRiskAR, todayAssets,
      },
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  } finally {
    db.close();
  }
});
