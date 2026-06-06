/**
 * 角色驱动 Portal 配置
 * 基于 GA-010 交易防火墙 + GA-011 角色权限隔离矩阵
 * 
 * 核心原则:
 *   - 销售面对客户，采购面对供应商
 *   - 采购只看到 Sales 名字 + 客户编码（匿名化）
 *   - 销售看不到供应商名称，仅供应商编码
 *   - 跨域信息通过 Match Engine 脱敏后传递
 */

export type Role = 'Sales' | 'Procurement' | 'Risk' | 'CEO' | 'QC' | 'SupplyChain' | 'Finance' | 'Admin';

export interface PortalConfig {
  role: Role;
  label: string;
  greeting: string;
  kpis: KpiConfig[];
  tasks: TaskConfig[];
  feed: FeedConfig[];
  agentStatuses: AgentStatusConfig[];
  agentSuggestion: AgentSuggestionConfig | null;
  sourceCard: SourceCardConfig | null;
  rightPanelWidgets: string[];
}

interface KpiConfig { label: string; icon: string; value: string | number; change: string; trend: 'up' | 'down' | 'neutral' }
interface TaskConfig { title: string; object: string; assignee: string; dueDate: string; aiSuggestion: string; priority: 'low' | 'medium' | 'high' | 'urgent' }
interface FeedConfig { icon: string; title: string; desc: string; time: string }
interface AgentStatusConfig { label: string; color: string }
interface SourceCardConfig { source: string; sourceType: string; sourceOwner: string; eventTime: string; capturedAt: string; verifiedBy: string; confidenceScore: number; status: 'verified' | 'unverified' }
interface AgentSuggestionConfig { agentName: string; agentType: string; conclusion: string; evidence: string[]; confidenceScore: number; suggestedActions: { label: string; risk: 'low' | 'medium' | 'high' }[]; requiresApproval: boolean }

// ============================================================================
// 采购视角 PORTAL — 面向供应商，服务内部 Sales
// ============================================================================
export const procurementPortal: PortalConfig = {
  role: 'Procurement',
  label: '采购工作台',
  greeting: '你好 采购试点-1！今日 5 位 Sales 提交了询价需求，供应资源池已更新。',
  kpis: [
    { label: 'Sales 提交需求', icon: 'FileSearch', value: 5, change: '+2 vs 昨日', trend: 'up' },
    { label: '供应资源池', icon: 'Package', value: 47, change: '+8 vs 昨日', trend: 'up' },
    { label: '已匹配商机', icon: 'Lightbulb', value: 3, change: '+1 vs 昨日', trend: 'up' },
    { label: '待处理报价', icon: 'FileText', value: 2, change: '持平', trend: 'neutral' },
  ],
  agentSuggestion: {
    agentName: 'Procurement Agent',
    agentType: 'Procurement',
    conclusion: 'Sales Pilot 提交了 STM32F407VET6 询价需求 5,000pcs。Arrow 报价 $4.10 库存 8,000pcs 交期2周为最优选择。建议匹配。',
    evidence: ['Arrow: $4.10 8,000pcs 2周', 'Mouser: $4.20 5,000pcs 1周', 'Avnet: $4.35 3,000pcs 3周'],
    confidenceScore: 90,
    suggestedActions: [
      { label: '匹配 SR-0001 供应资源', risk: 'low' },
      { label: '向 Sales Pilot 反馈报价', risk: 'low' },
    ],
    requiresApproval: false,
  },
  tasks: [
    {
      title: '匹配供应资源 STM32F407',
      object: 'Sales Pilot · 客户 C-001 · STM32F407VET6 × 5,000',
      assignee: '采购试点-1',
      dueDate: '今天',
      aiSuggestion: 'Arrow $4.10 最优，建议优先匹配',
      priority: 'high',
    },
    {
      title: 'Offer 解析 · 供应商报价单',
      object: '●●●● · TMS320F28335 × 2,000',
      assignee: '采购试点-1',
      dueDate: '今天',
      aiSuggestion: 'AI 解析完成后确认写入供应资源池',
      priority: 'medium',
    },
  ],
  feed: [
    { icon: 'Zap', title: 'Sales Pilot 新询价', desc: 'STM32F407VET6 × 5,000pcs · 目标价 $4.50', time: '10分钟前' },
    { icon: 'Package', title: 'Arrow 供应资源更新', desc: 'STM32F407VET6 库存 8,000pcs · $4.10/pcs', time: '30分钟前' },
    { icon: 'Lightbulb', title: '商机匹配成功', desc: 'Sales Lisa 询价 · TMS320F28335 × SR-0003 匹配度 85%', time: '1小时前' },
  ],
  agentStatuses: [
    { label: 'Procurement Agent', color: 'tag tag-purple' },
  ],
  sourceCard: {
    source: 'Arrow Electronics 报价单',
    sourceType: 'Email',
    sourceOwner: 'Arrow Sales Rep',
    eventTime: '2026-06-04 08:00',
    capturedAt: '2026-06-04 08:05',
    verifiedBy: 'Procurement Agent',
    confidenceScore: 92,
    status: 'verified',
  },
  rightPanelWidgets: ['agentDock', 'sourceCard'],
};

// ============================================================================
// 销售视角 PORTAL — 面向客户，面向内部 Buyer
// ============================================================================
export const salesPortal: PortalConfig = {
  role: 'Sales',
  label: '销售工作台',
  greeting: '你好 Sales Pilot！今日 Buyer 反馈了 8 条供应资源匹配结果，3 个商机待确认报价。',
  kpis: [
    { label: '我的 RFQ', icon: 'FileSearch', value: 12, change: '+3 vs 昨日', trend: 'up' },
    { label: 'Buyer 反馈', icon: 'Package', value: 8, change: '+2 vs 昨日', trend: 'up' },
    { label: '待报价', icon: 'FileText', value: 3, change: '-1 vs 昨日', trend: 'down' },
    { label: '成交率', icon: 'TrendingUp', value: '81%', change: '+2%', trend: 'up' },
  ],
  agentSuggestion: {
    agentName: 'Sales Agent',
    agentType: 'Sales',
    conclusion: 'Buyer 已为 STM32F407VET6 匹配供应资源。建议向客户华为技术报价 $4.35/pcs (基于供应价 $4.10)。',
    evidence: ['供应资源 SR-0001: 8,000pcs 交期2周', '供应资源 SR-0002: 5,000pcs 交期1周', '客户华为技术 信用 AAA'],
    confidenceScore: 88,
    suggestedActions: [
      { label: '确认报价 $4.35/pcs 给华为技术', risk: 'low' },
      { label: '报价 $4.50/pcs (含buffer)', risk: 'medium' },
    ],
    requiresApproval: true,
  },
  tasks: [
    {
      title: '确认报价 华为技术 STM32F407',
      object: '华为技术 · 5,000pcs · 目标价 $4.50',
      assignee: 'Sales Pilot',
      dueDate: '今天',
      aiSuggestion: '建议报价 $4.35，利润率约 6%',
      priority: 'high',
    },
    {
      title: '跟进询价 比亚迪 EP4CE22',
      object: '比亚迪 · EP4CE22F17C8N × 1,000',
      assignee: 'Sales Pilot',
      dueDate: '明天',
      aiSuggestion: 'Buyer 已匹配 2 个供应资源，等待报价确认',
      priority: 'medium',
    },
  ],
  feed: [
    { icon: 'Package', title: 'Buyer 供应资源已匹配', desc: 'STM32F407VET6 · 2个供应资源就绪', time: '10分钟前' },
    { icon: 'Lightbulb', title: '新商机 OPP-0004', desc: '比亚迪 · EP4CE22F17C8N 匹配度 78%', time: '1小时前' },
    { icon: 'AlertCircle', title: 'AR 提醒', desc: '汇顶科技 AR 逾期 96天 风险 L4', time: '2小时前' },
  ],
  agentStatuses: [
    { label: 'Sales Agent', color: 'tag tag-blue' },
  ],
  sourceCard: null,
  rightPanelWidgets: ['agentDock'],
};

// ============================================================================
// CEO 视角 PORTAL — 全局视图
// ============================================================================
export const ceoPortal: PortalConfig = {
  role: 'CEO',
  label: 'CEO 驾驶舱',
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
    conclusion: '今日经营摘要：销售侧 12 条新 RFQ，采购侧 8 条新供应资源。AR 逾期需关注汇顶科技 (96天, $380K)。',
    evidence: ['营收 $1.2M', 'RFQ 47', 'AR 风险 $1.02M', '高风险客户: 汇顶科技'],
    confidenceScore: 85,
    suggestedActions: [
      { label: '查看 AR 风险详情', risk: 'high' },
      { label: '查看销售 Pipeline', risk: 'low' },
    ],
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
  rightPanelWidgets: ['riskOverview', 'matchPanel'],
};

// ============================================================================
// 角色 → Portal 配置映射
// ============================================================================
export function getPortalConfig(role: Role): PortalConfig {
  switch (role) {
    case 'Procurement': return procurementPortal;
    case 'Sales': return salesPortal;
    case 'CEO': return ceoPortal;
    // 风控视角 — 侧重 AR/风险
    case 'Risk':
      return {
        ...procurementPortal,
        role: 'Risk',
        label: '风控工作台',
        greeting: '你好 风控专员！AR 风险池共 10 笔，其中 2 笔高风险需立即处理。',
        kpis: [
          { label: 'AR 总数', icon: 'FileText', value: 10, change: '+1', trend: 'up' },
          { label: '高风险 AR', icon: 'AlertTriangle', value: 2, change: '⚠️', trend: 'down' },
          { label: '总应收', icon: 'DollarSign', value: '$8.15M', change: '-3%', trend: 'down' },
          { label: '回款率', icon: 'TrendingUp', value: '68%', change: '-2%', trend: 'down' },
        ],
        agentStatuses: [{ label: 'Credit Agent', color: 'tag tag-red' }],
      };
    default: return procurementPortal;
  }
}
