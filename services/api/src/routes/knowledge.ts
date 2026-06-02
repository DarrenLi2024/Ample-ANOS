/**
 * 知识库 API 路由
 * 提供知识检索和知识源元数据查询
 */
import { Hono } from 'hono';
import { jwtAuth } from '../middleware/jwt';

export const knowledgeRoutes = new Hono().use('*', jwtAuth);

// ============================================================================
// 知识源注册表（P0试行版 — Phase 2 对接飞书知识库）
// ============================================================================
const KNOWLEDGE_SOURCES = [
  {
    sourceId: 'KS-SALES-001',
    sourceType: 'SalesSOP',
    title: '销售 SOP',
    description: '销售标准操作流程：客户开发、RFQ处理、报价审批、订单跟进、客户维护',
    documentCount: 12,
    lastSyncedAt: '2026-06-01',
    status: 'Active',
    ownerDepartment: '销售部',
    ownerId: 'sales1',
    feishuUrl: '', // 🔴 FollowUp F3: 待业务提供 URL
  },
  {
    sourceId: 'KS-PROC-001',
    sourceType: 'ProcurementSOP',
    title: '采购 SOP',
    description: '采购标准操作流程：供应商开发、询价、比价、采购执行、供应商管理',
    documentCount: 8,
    lastSyncedAt: '2026-06-01',
    status: 'Active',
    ownerDepartment: '采购部',
    ownerId: 'proc1',
    feishuUrl: '',
  },
  {
    sourceId: 'KS-RISK-001',
    sourceType: 'RiskRules',
    title: '风控/回款规则',
    description: '风险控制规则：信用评估、AR逾期处理、催收流程、法务升级、客户信用冻结标准',
    documentCount: 6,
    lastSyncedAt: '2026-06-01',
    status: 'Active',
    ownerDepartment: '财务部',
    ownerId: 'risk1',
    feishuUrl: '',
  },
  {
    sourceId: 'KS-PROD-001',
    sourceType: 'ProductKnowledge',
    title: '产品知识库',
    description: '电子元器件产品知识：品牌、型号、封装、生命周期、国产替代、Datasheet',
    documentCount: 15,
    lastSyncedAt: '2026-06-01',
    status: 'Active',
    ownerDepartment: '产品部',
    ownerId: 'proc1',
    feishuUrl: '',
  },
];

// ============================================================================
// Agent Skill 注册表
// ============================================================================
const AGENT_SKILLS = [
  {
    skillId: 'SKILL-001',
    skillName: '销售流程查询',
    skillType: 'qa',
    knowledgeSources: ['SalesSOP'],
    usedByAgents: ['Sales Agent', 'CEO Agent'],
    triggerKeywords: ['销售流程', '报价流程', '客户开发', 'RFQ处理', '订单跟进', '如何报价', '报价审批'],
    systemPrompt: '当用户询问销售相关流程时，检索销售SOP知识库获取标准流程答案。',
    examples: ['销售员: 客户要求降价怎么处理？\nAgent: 根据销售SOP第3.2节，先核实成本...'],
    mcpToolName: 'knowledge-search-advanced',
    status: 'Active',
    requiresApproval: false,
  },
  {
    skillId: 'SKILL-002',
    skillName: '采购流程查询',
    skillType: 'qa',
    knowledgeSources: ['ProcurementSOP'],
    usedByAgents: ['Procurement Agent', 'CEO Agent'],
    triggerKeywords: ['采购流程', '供应商开发', '询价流程', '比价', '如何采购', '供应商评估'],
    systemPrompt: '当用户询问采购相关流程时，检索采购SOP知识库获取标准流程答案。',
    examples: ['采购员: 新供应商怎么入库？\nAgent: 根据采购SOP第2.1节，需要先...'],
    mcpToolName: 'knowledge-search-advanced',
    status: 'Active',
    requiresApproval: false,
  },
  {
    skillId: 'SKILL-003',
    skillName: '风控规则查询',
    skillType: 'qa',
    knowledgeSources: ['RiskRules'],
    usedByAgents: ['Credit Agent', 'Risk Agent', 'CEO Agent'],
    triggerKeywords: ['风控', '信用评估', 'AR逾期', '催收', '回款', '风险等级', '信用冻结', '停单'],
    systemPrompt: '当评估客户风险或处理AR逾期时，检索风控规则知识库确保处置建议符合公司制度。',
    examples: ['风控: 客户逾期60天怎么处理？\nAgent: 根据风控规则第4条，逾期60-90天应...'],
    mcpToolName: 'knowledge-search-advanced',
    status: 'Active',
    requiresApproval: true,
  },
  {
    skillId: 'SKILL-004',
    skillName: '产品知识检索',
    skillType: 'search',
    knowledgeSources: ['ProductKnowledge'],
    usedByAgents: ['Sales Agent', 'Procurement Agent', 'Knowledge Agent'],
    triggerKeywords: ['产品', '型号', '品牌', '封装', '生命周期', 'EOL', '国产替代', 'Datasheet', '技术参数'],
    systemPrompt: '当用户询问产品技术参数、型号替代或生命周期信息时，检索产品知识库获取权威数据。',
    examples: ['销售员: STM32F407VET6 有国产替代吗？\nAgent: 根据产品知识库，国产替代方案有...'],
    mcpToolName: 'knowledge-search-advanced',
    status: 'Active',
    requiresApproval: false,
  },
];

// ============================================================================
// Routes
// ============================================================================

// GET /api/knowledge/sources — 列出所有知识源
knowledgeRoutes.get('/sources', async (c) => {
  const sourceType = c.req.query('sourceType');
  const sources = sourceType
    ? KNOWLEDGE_SOURCES.filter((s) => s.sourceType === sourceType)
    : KNOWLEDGE_SOURCES;
  return c.json({ data: sources, total: sources.length });
});

// GET /api/knowledge/sources/:sourceType — 单个知识源
knowledgeRoutes.get('/sources/:sourceType', async (c) => {
  const source = KNOWLEDGE_SOURCES.find((s) => s.sourceType === c.req.param('sourceType'));
  if (!source) return c.json({ error: { code: 'NOT_FOUND', message: '知识源不存在' } }, 404);
  return c.json(source);
});

// GET /api/knowledge/skills — 列出所有 Agent Skill
knowledgeRoutes.get('/skills', async (c) => {
  const agentType = c.req.query('agentType');
  const skills = agentType
    ? AGENT_SKILLS.filter((s) => s.usedByAgents.includes(agentType))
    : AGENT_SKILLS;
  return c.json({ data: skills, total: skills.length });
});

// GET /api/knowledge/search — 知识检索（Phase 2 对接飞书知识库API）
knowledgeRoutes.get('/search', async (c) => {
  const query = c.req.query('q') || '';
  const sourceTypes = c.req.query('sourceTypes')?.split(',') || [];
  const limit = Math.min(parseInt(c.req.query('limit') || '5'), 20);

  // Phase 1: 基于本地注册表的模拟检索
  // Phase 2: 对接飞书知识库 API 进行真实语义搜索
  const matchedSources = sourceTypes.length > 0
    ? KNOWLEDGE_SOURCES.filter((s) => sourceTypes.includes(s.sourceType))
    : KNOWLEDGE_SOURCES;

  const results = matchedSources.slice(0, limit).map((source) => ({
    content: `${source.title}: ${source.description}`,
    sourceType: source.sourceType,
    sourceTitle: source.title,
    sourceUrl: source.feishuUrl || undefined,
    confidence: query ? 85 : 100,
    retrievedAt: new Date().toISOString(),
    citations: [`${source.title} · ${source.documentCount} 篇文档 · ${source.lastSyncedAt} 更新`],
  }));

  return c.json({
    query,
    results,
    totalFound: matchedSources.length,
    searchTimeMs: 12,
    synthesizedAnswer: query
      ? `关于"${query}"，共检索到 ${results.length} 个相关知识源。Phase 2 对接飞书知识库后将提供完整语义搜索和智能摘要。`
      : undefined,
  });
});
