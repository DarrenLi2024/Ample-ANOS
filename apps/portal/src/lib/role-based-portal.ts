/**
 * 角色驱动 Portal 配置
 * 每个角色有独立的: 默认首页 / KPI卡片 / 动态流 / Agent建议 / 任务卡片 / 右侧面板
 */

export type Role = 'Sales' | 'Procurement' | 'Risk' | 'CEO' | 'QC' | 'SupplyChain' | 'Finance' | 'Admin';

export interface PortalConfig {
  role: Role;
  label: string;
  greeting: string;
  kpis: KpiConfig[];
  agentSuggestion: AgentSuggestionConfig;
  tasks: TaskConfig[];
  feed: FeedConfig[];
  agentStatuses: AgentStatusConfig[];
  sourceCard: SourceCardConfig | null;
  rightPanelWidgets: string[]; // 'agentDock' | 'sourceCard' | 'riskOverview' | 'matchPanel'
}

interface KpiConfig { label: string; icon: string; value: string | number; change: string; trend: 'up' | 'down' | 'neutral' }
interface TaskConfig { title: string; object: string; assignee: string; dueDate: string; aiSuggestion: string; priority: 'low'|'medium'|'high'|'urgent' }
interface FeedConfig { icon: string; title: string; desc: string; time: string }
interface AgentStatusConfig { label: string; color: string }
interface SourceCardConfig { source: string; sourceType: string; sourceOwner: string; eventTime: string; capturedAt: string; verifiedBy: string; confidenceScore: number; status: 'verified'|'unverified' }
interface AgentSuggestionConfig { agentName: string; agentType: string; conclusion: string; evidence: string[]; confidenceScore: number; suggestedActions: {label:string;risk:'low'|'medium'|'high'}[]; requiresApproval: boolean }

// ============================================================================
// 采购视角 PORTAL
// ============================================================================
export const procurementPortal: PortalConfig = {
  role: 'Procurement',
  label: 'Procurement',
  greeting: '你好 采购试点-1！今日 5 位 Sales 提交了询价需求，供应资源池已更新 8 条新报价。',
  kpis: [
    { label: 'Sales 提交需求', icon: 'FileSearch', value: 5, change: '+2 vs 昨日', trend: 'up' },
    { label: '供应资源池', icon: 'Package', value: 47, change: '+8 vs 昨日', trend: 'up' },
    { label: '已匹配商机', icon: 'Lightbulb', value: 3, change: '+1 vs 昨日', trend: 'up' },
    { label: '待处理报价', icon: 'FileText', value: 2, change: '持平', trend: 'neutral' },
  ],
  agentSuggestion: {
    agentName: 'Procurement Agent',
    agentType: 'Procurement',
    conclusion: 'Sales Pilot 提交 STM32F407VET6 询价 5,000pcs，Arrow 报价 $4.10 库存 8,000pcs 交期2周为最优选择。建议优先匹配。',
    evidence: ['Arrow: $4.10 8,000pcs 2周', 'Mouser: $4.20 5,000pcs 1周', 'Avnet: $4.35 3,000pcs 3周'],
    confidenceScore: 90,
    suggestedActions: [
      { label: '匹配 Arrow 供应资源', risk: 'low' },
      { label: '向 Sales Pilot 发送报价', risk: 'low' },
      { label: '询价 Digi-Key 补充供应', risk: 'medium' },
    ],
    requiresApproval: false,
  },
  tasks: [
    { title: '匹配供应资源 STM32F407', object: 'Sales Pilot · STM32F407VET6 × 5,000', assignee: '采购试点-1', dueDate: '今天', aiSuggestion: 'Arrow $4.10 最优，建议优先匹配', priority: 'high' },
    { title: 'Offer 解析 · Avnet 报价单', object: 'Avnet · TMS320F28335 × 2,000', assignee: '采购试点-1', dueDate: '今天', aiSuggestion: 'AI 已解析 MPN/数量/价格，确认后写入供应池', priority: 'medium' },
  ],
  feed: [
    { icon: 'Zap', title: 'Sales Pilot 新询价', desc: 'STM32F407VET6 × 5,000pcs · 目标价 $4.50', time: '10分钟前' },
    { icon: 'Package', title: 'Arrow 供应资源更新', desc: 'STM32F407VET6 库存 8,000pcs · $4.10/pcs', time: '30分钟前' },
    { icon: 'Lightbulb', title: '商机匹配成功', desc: 'Sales Lisa · TMS320F28335 × Arrow 匹配度 85%', time: '1小时前' },
  ],
  agentStatuses: [
    { label: 'Procurement Agent', color: 'tag tag-purple' },
  ],
  sourceCard: {
    source: 'Arrow Electronics 报价单',
    sourceType: 'Email',
    sourceOwner: 'Arrow Sales Rep',
    eventTime: '2026-06-03 08:00',
    capturedAt: '2026-06-03 08:05',
    verifiedBy: 'Procurement Agent',
    confidenceScore: 92,
    status: 'verified',
  },
  rightPanelWidgets: ['agentDock', 'sourceCard', 'offerParse'],
};

// ============================================================================
// 销售视角 PORTAL (预留)
// ============================================================================
export const salesPortal: PortalConfig = {
  role: 'Sales',
  label: 'Sales',
  greeting: '你好 Sales Pilot！今日收到 3 条 Buyer 反馈的供应资源，2 个商机待确认。',
  kpis: [
    { label: '我的 RFQ', icon: 'FileSearch', value: 12, change: '+3 vs 昨日', trend: 'up' },
    { label: 'Buyer 反馈', icon: 'Package', value: 8, change: '+2 vs 昨日', trend: 'up' },
    { label: '待报价', icon: 'FileText', value: 3, change: '-1 vs 昨日', trend: 'down' },
    { label: '成交率', icon: 'TrendingUp', value: '81%', change: '+2%', trend: 'up' },
  ],
  agentSuggestion: {
    agentName: 'Sales Agent',
    agentType: 'Sales',
    conclusion: 'Buyer 已匹配 STM32F407VET6 供应资源，Arrow $4.10/pcs 最优。建议报价 $4.35/pcs。',
    evidence: ['Arrow: $4.10 8,000pcs 2周', 'Mouser: $4.20 5,000pcs 1周'],
    confidenceScore: 88,
    suggestedActions: [
      { label: '确认报价 $4.35/pcs', risk: 'low' },
      { label: '报价 $4.50/pcs(含buffer)', risk: 'medium' },
    ],
    requiresApproval: true,
  },
  tasks: [
    { title: '确认报价 STM32F407', object: '客户C-001 · 5,000pcs', assignee: 'Sales Pilot', dueDate: '今天', aiSuggestion: '建议报价 $4.35', priority: 'high' },
  ],
  feed: [
    { icon: 'Package', title: 'Buyer 供应资源已匹配', desc: 'STM32F407VET6 · Arrow $4.10 8,000pcs', time: '10分钟前' },
  ],
  agentStatuses: [
    { label: 'Sales Agent', color: 'tag tag-blue' },
  ],
  sourceCard: null,
  rightPanelWidgets: ['agentDock'],
};

// ============================================================================
// CEO 视角 PORTAL (预留)
// ============================================================================
export const ceoPortal: PortalConfig = {
  role: 'CEO',
  label: 'CEO',
  greeting: '你好 Darren！今日营收 $1.2M，47 条活跃 RFQ，AR 风险 $1.02M。',
  kpis: [
    { label: '今日营收', icon: 'DollarSign', value: '$1.2M', change: '+8%', trend: 'up' },
    { label: '活跃 RFQ', icon: 'FileSearch', value: 47, change: '+5', trend: 'up' },
    { label: 'AR 风险', icon: 'AlertTriangle', value: '$1.02M', change: '+12%', trend: 'up' },
    { label: 'OIQ 指数', icon: 'TrendingUp', value: 78, change: '+3', trend: 'up' },
  ],
  agentSuggestion: {
    agentName: 'CEO Agent',
    agentType: 'CEO',
    conclusion: '今日经营摘要：销售侧 12 条新 RFQ，采购侧 8 条新供应资源，AR 逾期需关注汇顶科技。',
    evidence: ['营收 $1.2M', 'RFQ 47', 'AR 风险 $1.02M'],
    confidenceScore: 85,
    suggestedActions: [],
    requiresApproval: false,
  },
  tasks: [],
  feed: [],
  agentStatuses: [
    { label: 'Sales Agent', color: 'tag tag-blue' },
    { label: 'Procurement Agent', color: 'tag tag-purple' },
    { label: 'Credit Agent', color: 'tag tag-yellow' },
  ],
  sourceCard: null,
  rightPanelWidgets: ['riskOverview'],
};

// ============================================================================
// 角色 → Portal 配置映射
// ============================================================================
export function getPortalConfig(role: Role): PortalConfig {
  switch (role) {
    case 'Procurement': return procurementPortal;
    case 'Sales': return salesPortal;
    case 'CEO': return ceoPortal;
    default: return procurementPortal;
  }
}
