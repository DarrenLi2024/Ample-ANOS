/**
 * Agent 推理引擎
 * Phase 1: 规则驱动 — Sales/Credit Agent 基于数据给出建议
 */

import { Hono } from 'hono';
import Database from 'better-sqlite3';
import path from 'node:path';
import { jwtAuth } from '../middleware/jwt';
import { v4 as uuid } from 'uuid';

const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');
function getDb() { const sqlite = new Database(DB_PATH); sqlite.pragma('journal_mode = WAL'); return sqlite; }

export const agentReasoningRoutes = new Hono().use('*', jwtAuth);
// ============================================================================
// Knowledge Index Helpers
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';

const KNOWLEDGE_INDEX_PATH = path.join(process.cwd(), 'data', 'knowledge-index.json');

interface DocEntry {
  file: string;
  title: string;
  path: string;
  summary: string;
  size: number;
}

function loadKnowledgeIndex(): DocEntry[] {
  try {
    const raw = fs.readFileSync(KNOWLEDGE_INDEX_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}


async function aiKnowledgeSearch(query: string, index: DocEntry[]): Promise<DocEntry[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey || index.length === 0) {
    // Fallback to keyword search
    return searchKnowledgeIndex(index, query);
  }
  
  try {
    const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.openai.com';
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    
    // Build document list for AI to rank
    const docList = index.map((d, i) => `${i}: ${d.title} - ${d.summary.slice(0, 200)}`).join('\n');
    
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: `你是一个文档检索引擎。用户查询: "${query}"。\n\n以下是文档索引:\n${docList.slice(0, 3000)}\n\n请找出与查询最相关的3-5篇文档。只返回文档编号（如: 0,3,7），不返回其他内容。`
        }],
        max_tokens: 50,
        temperature: 0,
      }),
    });
    
    const data: any = await response.json();
    const aiResponse = data?.choices?.[0]?.message?.content || '';
    const ids = aiResponse.match(/\d+/g)?.map(Number).filter((n: number) => n < index.length) || [];
    
    if (ids.length > 0) {
      return ids.map((i: number) => index[i]).filter(Boolean);
    }
  } catch {}
  
  return searchKnowledgeIndex(index, query);
}

function searchKnowledgeIndex(index: DocEntry[], query: string): DocEntry[] {
  const cleanQuery = query.replace(/[?？]/g, '').toLowerCase();
  // Split into individual words AND keep the full phrase
  const keywords = cleanQuery.split(/[\s,，。！？]+/).filter(k => k.length > 1);
  
  const scored = index.map(doc => {
    let score = 0;
    const titleLower = doc.title.toLowerCase();
    const summaryLower = doc.summary.toLowerCase();
    
    // Title match (high weight)
    for (const kw of keywords) {
      if (titleLower.includes(kw)) score += 15;
    }
    // Full phrase match in title
    if (titleLower.includes(cleanQuery)) score += 25;
    
    // Summary match (medium weight)
    for (const kw of keywords) {
      if (summaryLower.includes(kw)) score += 5;
    }
    if (summaryLower.includes(cleanQuery)) score += 15;
    
    // Cross-reference: "Agent" + "标准" both in title = strong match
    if (keywords.length >= 2) {
      const titleHits = keywords.filter(k => titleLower.includes(k)).length;
      if (titleHits >= 2) score += 10;
      const summaryHits = keywords.filter(k => summaryLower.includes(k)).length;
      if (summaryHits >= 2) score += 5;
    }
    
    return { doc, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(s => s.doc);
}

function loadDocumentContent(filepath: string): string {
  try {
    return fs.readFileSync(filepath, 'utf-8');
  } catch {
    return '';
  }
}

function extractRelevantPassages(content: string, query: string, docTitle: string): Array<{title: string; file: string; passage: string; lines: string}> {
  const keywords = query.split(/[\s,，。！？]+/).filter(k => k.length > 1);
  const lines = content.split('\n');
  const results: Array<{title: string; file: string; passage: string; lines: string}> = [];
  
  // Find paragraphs that match any keyword
  let currentPara: string[] = [];
  let paraStart = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Paragraph boundary
    if (!trimmed || trimmed.startsWith('---') || (trimmed.startsWith('#') && currentPara.length > 0)) {
      if (currentPara.length > 0) {
        const text = currentPara.join(' ');
        const lower = text.toLowerCase();
        const matchCount = keywords.filter(k => lower.includes(k)).length;
        if (matchCount >= 2 || lower.includes(query.toLowerCase())) {
          results.push({
            title: docTitle,
            file: '',
            passage: text.slice(0, 600),
            lines: `L${paraStart+1}-L${i}`,
          });
        }
      }
      currentPara = [];
      paraStart = i + 1;
      continue;
    }
    
    if (trimmed) {
      if (currentPara.length === 0) paraStart = i;
      currentPara.push(trimmed);
    }
  }
  
  // Last paragraph
  if (currentPara.length > 0) {
    const text = currentPara.join(' ');
    const lower = text.toLowerCase();
    if (keywords.filter(k => lower.includes(k)).length >= 2) {
      results.push({
        title: docTitle,
        file: '',
        passage: text.slice(0, 600),
        lines: `L${paraStart+1}-L${lines.length}`,
      });
    }
  }
  
  // Return top 3 most relevant passages
  return results.slice(0, 3);
}

function extractRelevantSection(content: string, query: string): string {
  const lines = content.split('\n');
  const keywords = query.split(/[\s,，。！？]+/).filter(k => k.length > 1);
  
  // Find the paragraph most relevant to the query
  let bestParagraph = '';
  let bestScore = 0;
  let currentParagraph = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('---')) {
      if (currentParagraph && bestScore > 0) {
        bestParagraph = currentParagraph;
        break;
      }
      currentParagraph = '';
      continue;
    }
    currentParagraph += (currentParagraph ? ' ' : '') + trimmed;
    
    let score = 0;
    for (const kw of keywords) {
      if (currentParagraph.toLowerCase().includes(kw)) score += 5;
    }
    if (score > bestScore) {
      bestScore = score;
      bestParagraph = currentParagraph;
    }
  }
  
  return (bestParagraph || content.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('---')).slice(0, 3).join(' ')).slice(0, 800);
}


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

    // Standardized output per SA-007
    // Create inquiry if it doesn't exist
    let createdInquiryId = '';
    if (!inquiry) {
      try {
        createdInquiryId = `INQ-${Date.now().toString(36).toUpperCase()}`;
        db.prepare(`INSERT INTO inquiries (id, inquiry_id, customer_id, mpn, quantity, target_price, priority, status, source, source_type, source_owner, event_time)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
          uuid(), createdInquiryId, 'C-001',
          (await c.req.json() as any).mpn || 'Unknown', (await c.req.json() as any).quantity || 1,
          (await c.req.json() as any).targetPrice || null,
          'High', 'New', 'AI Inbox', 'Agent', 'Sales Agent',
          new Date().toISOString(),
        );
      } catch {}
    }

    const salesEvidence = [
      ...evidence,
      `客户: ${customer?.customer_name || 'C-001'}`,
      `生成时间: ${new Date().toISOString()}`,
      createdInquiryId ? `已创建 Inquiry: ${createdInquiryId}` : '',
    ].filter(Boolean);

    return c.json({
      agent: 'Sales Agent',
      conclusion: `${inquiry?.mpn || 'N/A'} 建议报价 $${suggestedPrice}/pcs，基于${resources.length}个供应资源。${createdInquiryId ? '已创建 Inquiry: ' + createdInquiryId : ''}`,
      evidence: salesEvidence,
      confidenceScore: confidence,
      suggestedActions: actions,
      requiresApproval: true,
      createdId: createdInquiryId || undefined,
      sourceTimestamp: inquiry?.created_at || new Date().toISOString(),
      capturedTimestamp: new Date().toISOString(),
    });
  } catch (err: any) { return c.json({ error: err.message }, 500); }
  finally { db.close(); }
});
// ============================================================================
// Knowledge Agent: 知识检索 + 查询路由
// ============================================================================
agentReasoningRoutes.post('/knowledge/search', async (c) => {
  const { content } = await c.req.json() as any;
  const query = (content || '').trim();
  
  // Step 1: Retrieve relevant documents
  const index = loadKnowledgeIndex();
  const results = searchKnowledgeIndex(index, query.toLowerCase());
  
  if (results.length === 0) {
    return c.json({
      agent: 'Knowledge Agent',
      conclusion: `在 ${index.length} 篇文档中未找到与"${query.slice(0, 80)}"直接相关的内容。请尝试其他关键词。`,
      evidence: [`搜索文档数: ${index.length}`, `匹配: 0 条`],
      confidenceScore: 40,
      suggestedActions: [{ label: '换一个问法试试', risk: 'low' }],
      requiresApproval: false,
      sourceTimestamp: new Date().toISOString(),
      capturedTimestamp: new Date().toISOString(),
    });
  }
  
  // Step 2: Extract relevant passages with line numbers
  const topDocs = results.slice(0, 8);
  const passages: Array<{title: string; file: string; passage: string; lines: string}> = [];
  
  for (const doc of topDocs) {
    const docContent = loadDocumentContent(doc.path);
    const docPassages = extractRelevantPassages(docContent, query, doc.title);
    docPassages.forEach(p => { p.file = doc.file; });
    passages.push(...docPassages);
  }
  
  // Step 3: Generate response via LLM — synthesize from passages
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.openai.com';
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  
  if (apiKey && passages.length > 0) {
    try {
      // Build context from passages
      const context = passages.map((p, i) => 
        `[REF${i+1}] ${p.title}\n${p.passage}\n(来源: ${p.file}, ${p.lines})`
      ).join('\n\n');
      
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{
            role: 'user',
            content: `你是 ANOS 知识库助手。请基于以下文档内容，回答用户的问题。\n\n用户问题: ${query}\n\n参考文档内容:\n${context.slice(0, 6000)}\n\n要求:\n1. 综合多篇文档内容，重新组织语言输出\n2. 正文中引用文档时标注 [REF编号]\n3. 在末尾列出参考文献: [REF1] 文档标题 (文件:行号)\n4. 如果文档内容不足以回答，请诚实说明\n5. 回答要结构化、专业、易读`
          }],
          max_tokens: 1500,
          temperature: 0.3,
        }),
      });
      
      const aiData: any = await response.json();
      const aiResponse = aiData?.choices?.[0]?.message?.content;
      
      if (aiResponse) {
        // Build references list
        const refs = passages.map((p, i) => 
          `[REF${i+1}] ${p.title} — ${p.file} (${p.lines})`
        );
        
        return c.json({
          agent: 'Knowledge Agent',
          conclusion: aiResponse,
          evidence: [
            `检索文档: ${results.length} 篇`,
            `提取段落: ${passages.length} 段`,
            `生成模型: ${model}`,
          ],
          knowledgeResults: passages.map((p, i) => ({
            title: p.title,
            content: p.passage.slice(0, 400),
            source: p.file,
            refId: `REF${i+1}`,
          })),
          references: refs,
          confidenceScore: Math.min(70 + results.length * 3, 95),
          suggestedActions: [
            { label: '追问更多细节', risk: 'low' },
          ],
          requiresApproval: false,
          sourceTimestamp: new Date().toISOString(),
          capturedTimestamp: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error('Knowledge RAG error:', e);
    }
  }
  
  // Fallback: return passages without AI synthesis
  const excerpts = passages.slice(0, 5).map(p => ({
    title: p.title,
    content: p.passage.slice(0, 500),
    source: p.file,
    lines: p.lines,
  }));
  
  return c.json({
    agent: 'Knowledge Agent',
    conclusion: `在 ${index.length} 篇文档中找到 ${results.length} 篇相关内容。以下是关键段落摘要（AI生成不可用，返回原始摘录）：`,
    evidence: [`检索: ${results.length} 篇`, `段落: ${passages.length} 段`],
    knowledgeResults: excerpts,
    references: passages.map((p, i) => `[REF${i+1}] ${p.title} — ${p.file} (${p.lines})`),
    confidenceScore: results.length > 2 ? 70 : 50,
    suggestedActions: [{ label: '查看完整文档', risk: 'low' }],
    requiresApproval: false,
    sourceTimestamp: new Date().toISOString(),
    capturedTimestamp: new Date().toISOString(),
  });
});

// ============================================================================
// Procurement Agent: 供应信息解析 + 补充信息
// ============================================================================
agentReasoningRoutes.post('/procurement/parse-offer', async (c) => {
  const { content, sourceTime } = await c.req.json() as any;
  const db = getDb();
  
  try {
    // Step 1: 提取所有 MPN
    const mpnMatches = content.match(/[A-Z]{2,}\d+[A-Z\d\-]*/g) || [];
    const uniqueMpns = [...new Set(mpnMatches)];
    
    // Step 2: 从数据库查询已知信息
    const enriched: any[] = [];
    for (const mpn of uniqueMpns.slice(0, 10)) {
      const product = db.prepare('SELECT brand, category, description FROM products WHERE mpn = ?').get(mpn) as any;
      const existingOffer = db.prepare('SELECT price, supplier_id FROM supply_resources WHERE mpn = ? ORDER BY created_at DESC LIMIT 3').all(mpn) as any[];
      
      enriched.push({
        mpn,
        brand: product?.brand || extractBrandFromMpn(mpn),
        category: product?.category || 'Unknown',
        description: product?.description || null,
        historicalPrices: existingOffer.map(o => ({ price: o.price, supplier: o.supplier_id })),
        knownInDb: !!product,
      });
    }
    
    // Step 3: 提取时间戳信息
    const dcmatch = content.match(/(\d{2})\+/g);
    const dateCodes = dcmatch ? [...new Set(dcmatch)] : [];
    const leadTimeMatch = content.match(/(\d+)[-\s]?(week|周|day|天)/i);
    const leadTime = leadTimeMatch ? leadTimeMatch[1] + leadTimeMatch[2] : null;
    const qtyMatches = content.match(/(\d+)\s*[Kk]/g);
    const qtys = qtyMatches ? qtyMatches.map(q => parseInt(q) * 1000) : [];
    const textQtys = content.match(/(\d{2,})\s*(pcs|片|个)/g);
    
    // Step 4: 结构化输出
    const items = uniqueMpns.slice(0, 10).map((mpn, i) => {
      const enriched_info = enriched[i];
      return {
        mpn,
        brand: enriched_info?.brand || 'Unknown',
        category: enriched_info?.category || 'Unknown',
        description: enriched_info?.description,
        quantity: qtys[i] || (textQtys && i < textQtys.length ? parseInt(textQtys[i]) : 100),
        dateCode: dateCodes[i] || dateCodes[0] || null,
        leadTime: leadTime,
        historicalPrices: enriched_info?.historicalPrices || [],
        knownInDb: enriched_info?.knownInDb || false,
        sourceTimestamp: sourceTime || new Date().toISOString(),
        capturedTimestamp: new Date().toISOString(),
      };
    });
    
    // Build standardized output per SA-007 Agent Prompt Library
    const knownCount = enriched.filter(e => e.knownInDb).length;
    const evidence = [
      `识别型号: ${uniqueMpns.length} 个`,
      `数据库已有信息: ${knownCount} 个`,
      `信息源时间: ${sourceTime || '当前时间'}`,
      `录入时间: ${new Date().toISOString()}`,
    ];
    
    const suggestedActions = [
      { label: '存入 Offer Base', risk: 'low' },
      { label: '自动匹配 Inquiry', risk: 'low' },
      { label: '验证价格与库存', risk: 'medium' },
    ];
    
    // Execute: Insert via internal insert (avoids HTTP overhead)
    const createdIds: string[] = [];
    for (const item of items) {
      try {
        const resourceId = `SR-${Date.now().toString(36).toUpperCase()}-${createdIds.length}`;
        const id = uuid();
        db.prepare(`INSERT INTO supply_resources (id, resource_id, supplier_id, brand, mpn, stock_qty, price, date_code, status, source, source_type, source_owner)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
          id, resourceId, 'S-005',
          item.brand || 'Unknown', item.mpn,
          item.quantity || 100, 0,
          item.dateCode || null,
          'New', 'AI Inbox', 'Agent', 'Procurement Agent'
        );
        createdIds.push(resourceId);
      } catch (e: any) { console.error('Insert error:', e.message); }
    }

    const finalEvidence = [
      ...evidence,
      createdIds.length > 0 ? `已创建 ${createdIds.length} 条 SupplyResource: ${createdIds.slice(0, 3).join(', ')}` : '未创建新记录',
    ];

    return c.json({
      agent: 'Procurement Agent',
      conclusion: `识别到 ${uniqueMpns.length} 个供应型号（${knownCount} 个已有数据库信息）。已创建 ${createdIds.length} 条 SupplyResource。信息源时间: ${sourceTime || '未提供'}，录入时间: ${new Date().toISOString()}`,
      evidence: finalEvidence,
      confidenceScore: uniqueMpns.length > 0 ? 85 : 60,
      suggestedActions,
      requiresApproval: false,
      items,
      createdIds,
      rawContent: content.slice(0, 500),
      sourceTimestamp: sourceTime || new Date().toISOString(),
      capturedTimestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  } finally {
    db.close();
  }
});

// ============================================================================
// 辅助: 从 MPN 推断品牌
// ============================================================================

// ============================================================================
// Credit Agent: AR 风险分析 → 处置建议
// ============================================================================
agentReasoningRoutes.post('/credit/risk-analysis', async (c) => {
  const { customerId } = await c.req.json() as any;
  const db = getDb();
  try {
    const arItems = db.prepare("SELECT * FROM ar_items WHERE customer_id = ? AND status != 'Paid' ORDER BY overdue_days DESC").all(customerId) as any[];
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
      conclusion = `逾期 ${maxOverdue} 天，未回款 $${totalOutstanding.toLocaleString()}。发送催收函并暂停新订单。`;
      actions.push({ label: '发送催收函', risk: 'medium' }, { label: '暂停新订单审批', risk: 'medium' });
    } else if (maxOverdue > 30) {
      riskLevel = 'L2_Watch';
      conclusion = `逾期 ${maxOverdue} 天，未回款 $${totalOutstanding.toLocaleString()}。电话催收并邮件提醒。`;
      actions.push({ label: '电话催收', risk: 'low' }, { label: '邮件提醒', risk: 'low' });
    } else {
      conclusion = `AR 状态正常，未回款 $${totalOutstanding.toLocaleString()}。`;
    }

    return c.json({
      agent: 'Credit Agent',
      conclusion: conclusion + ` 分析时间: ${new Date().toISOString()}`,
      evidence: [
        `未回款总额: $${totalOutstanding.toLocaleString()}`,
        `最大逾期天数: ${maxOverdue} 天`,
        `客户信用等级: ${customer?.credit_level || 'N/A'}`,
        `AR 笔数: ${arItems.length}`,
        `分析时间: ${new Date().toISOString()}`,
      ],
      confidenceScore: arItems.length > 0 ? 90 : 70,
      riskLevel,
      suggestedActions: actions,
      requiresApproval: riskLevel !== 'L1_Low',
      sourceTimestamp: new Date().toISOString(),
      capturedTimestamp: new Date().toISOString(),
    });
  } catch (err: any) { return c.json({ error: err.message }, 500); }
  finally { db.close(); }
});

function extractBrandFromMpn(mpn: string): string {
  const prefix = (mpn.match(/^[A-Z]+/) || [''])[0];
  const map: Record<string, string> = {
    STM: 'STMicroelectronics', TI: 'TI', TMS: 'TI', LM: 'TI', TLV: 'TI',
    OPA: 'TI', SN: 'TI', MAX: 'Maxim/ADI', AD: 'Analog Devices', ADU: 'ADI',
    MT: 'Micron', IS: 'ISSI', GD: 'GigaDevice', AT: 'Microchip',
    GRM: 'Murata', LSM: 'STMicroelectronics', AU: 'Infineon', IR: 'Infineon',
    EP: 'Intel/Altera', XC: 'AMD/Xilinx', W: 'Winbond', ESP: 'Espressif',
    LAN: 'Microchip', DP: 'TI', ISO: 'TI', MP: 'MPS', CH: 'WCH',
  };
  return map[prefix] || prefix || 'Unknown';
}
