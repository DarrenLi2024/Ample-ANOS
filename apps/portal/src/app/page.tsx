'use client';
import { useState, useEffect } from 'react';
import { OpportunityCard } from '@/components/OpportunityCard';
import { RiskCard } from '@/components/RiskCard';
import { ActionCard } from '@/components/ActionCard';
import { AgentActionCard } from '@/components/AgentActionCard';
import { DealFunnel } from '@/components/DealFunnel';
import { ValueRanking } from '@/components/ValueRanking';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { PermissionNotice } from '@/components/PermissionNotice';
import {
  getInquiries, getSupplyResources, getOpportunities, getARItems, getCustomers,
} from '@/lib/api';
import { getPortalConfig, type Role } from '@/lib/role-based-portal';
import { useInbox } from '@/lib/InboxProvider';
import {
  Bot, Zap, CheckCircle2, AlertTriangle,
} from 'lucide-react';

// ============================================================================
// 角色检测
// ============================================================================
function detectUserRole(): Role {
  if (typeof window === 'undefined') return 'Procurement';
  const stored = localStorage.getItem('anos_user_role');
  if (stored) return stored as Role;
  return 'Procurement';
}

function isBuyerRole(role: string) { return role === 'Procurement' || role === 'ProcurementManager'; }
function isSalesRole(role: string) { return role === 'Sales' || role === 'SalesManager'; }




// ============================================================================
// AI Native Action Workspace — SA-019 第3章: 三流合一
// ============================================================================
export default function AIWorkspaceHome() {
  const [userRole, setUserRole] = useState<Role>('Procurement');
  const [loading, setLoading] = useState(true);

  // 数据
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [supplyResources, setSupplyResources] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [arItems, setArItems] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const config = getPortalConfig(userRole);
  const isBuyer = isBuyerRole(userRole);
  const isSales = isSalesRole(userRole);

  // 初始化
  useEffect(() => { setUserRole(detectUserRole()); }, []);

  // 监听 InboxProvider 刷新信号
  const { refreshTrigger } = useInbox();

  // 加载数据 — refreshTrigger 变化时重新加载
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [inqRes, srRes, oppRes, arRes, custRes] = await Promise.all([
          getInquiries().catch(() => ({ data: [] })),
          getSupplyResources().catch(() => ({ data: [] })),
          getOpportunities().catch(() => ({ data: [] })),
          getARItems().catch(() => ({ data: [] })),
          getCustomers().catch(() => ({ data: [] })),
        ]);
        setInquiries(inqRes.data || []);
        setSupplyResources(srRes.data || []);
        setOpportunities(oppRes.data || []);
        setArItems(arRes.data || []);
        setCustomers(custRes.data || []);
      } catch {} finally { setLoading(false); }
    }
    fetchData();
  }, [refreshTrigger]);

  // 角色切换
  const switchRole = (r: Role) => { setUserRole(r); localStorage.setItem('anos_user_role', r); };

  // ========================================================================
  // Opportunity Feed 数据 (SA-019 第16章)
  // ========================================================================
  const opportunityCards = isSales ? [
    // Sales视角: 看到自己的Inquiry匹配结果
    ...opportunities.filter(o => ['New','Matched'].includes(o.status)).slice(0, 4).map(o => ({
      type: (o.match_score >= 85 ? 'HighValue' : o.match_score >= 70 ? 'HighValue' : 'Alternative') as any,
      mpn: o.inquiry_id || 'N/A',
      matchScore: o.match_score,
      margin: o.estimated_margin ? Math.round(o.estimated_margin * 100) : undefined,
      action: o.status === 'Matched' ? '立即报价' : '查看匹配',
      evidence: [o.ai_recommendation || ''],
    }))
  ] : [
    // Buyer视角: 看到Sales的Inquiry × 自己的Offer (SA-019 第18章: 禁止显示CustomerName)
    ...opportunities.filter(o => ['New','Matched'].includes(o.status)).slice(0, 4).map(o => ({
      type: (o.match_score >= 85 ? 'HighValue' : o.match_score >= 70 ? 'HighValue' : 'Shortage') as any,
      mpn: o.inquiry_id || 'N/A',
      customerCode: o.customer_id?.replace(/C-/, '●●●●-') || '●●●●',
      salesName: 'Sales Pilot',  // 采购只能看到Sales名
      matchScore: o.match_score,
      action: o.status === 'Matched' ? '支持成交' : '匹配供应',
    }))
  ];

  // ========================================================================
  // Risk Feed 数据 (SA-019 第18章)
  // Sales: AR逾期风险 / Buyer: 供应商风险
  // GA-011: Buyer对AR=No, 不能看客户AR
  // ========================================================================
  const riskCards = isBuyer
    ? [
        // 采购视角: 供应商风险（低评分供应商、交付延迟等）
        ...supplyResources.filter(s => s.status === 'New').slice(0, 2).map(s => ({
          level: 'L2' as any, type: 'Supplier' as any,
          subject: `供应商 ${s.supplier_id}`,
          amount: s.price ? s.price * (s.stock_qty || 0) : undefined,
          action: '验证资源真实性',
        })),
        // 采购视角: 库存风险提示
        { level: 'L2' as any, type: 'Inventory' as any,
          subject: `${supplyResources.length} 条供应资源`,
          action: supplyResources.filter(s => s.status === 'New').length > 0 ? `${supplyResources.filter(s => s.status === 'New').length} 条待验证` : '库存正常',
        },
      ]
    : arItems
        .filter(a => a.overdue_days > 0 || ['L3_Warning','L4_High'].includes(a.risk_level))
        .slice(0, 3)
        .map(a => ({
          level: (a.risk_level === 'L4_High' ? 'L4' : a.risk_level === 'L3_Warning' ? 'L3' : a.risk_level === 'L2_Watch' ? 'L2' : 'L1') as any,
          type: 'AR' as any,
          subject: `${a.customer_id}`,
          amount: a.outstanding_amount,
          overdue: a.overdue_days,
          action: a.risk_level === 'L4_High' ? '暂停发货 + 法务催收' : a.risk_level === 'L3_Warning' ? '发送催收函' : '电话催收',
        }));

  // ========================================================================
  // Action Feed 数据 (SA-019 第20章)
  // ========================================================================
  const actionCards = isSales ? [
    ...inquiries.filter(i => i.status === 'New' && ['Urgent','High'].includes(i.priority)).slice(0, 2).map(i => ({
      priority: (i.priority === 'Urgent' ? 'urgent' : 'high') as any,
      type: 'Quote' as any,
      title: `报价 ${i.mpn} 给 ${i.customer_id}`,
      description: `${i.quantity}片 · 目标价 $${i.target_price}`,
      suggestion: 'Buyer 已匹配供应资源',
    })),
    ...inquiries.filter(i => i.status === 'Matched').slice(0, 2).map(i => ({
      priority: 'high' as any,
      type: 'FollowUp' as any,
      title: `跟进 ${i.mpn} 匹配结果`,
      description: `客户 ${i.customer_id} · ${i.quantity}片`,
      suggestion: '确认报价',
    })),
    ...arItems.filter(a => a.overdue_days > 30).slice(0, 1).map(a => ({
      priority: 'high' as any,
      type: 'Collect' as any,
      title: `催款 ${a.customer_id}`,
      description: `逾期${a.overdue_days}天 · $${(a.outstanding_amount/1000).toFixed(1)}K`,
      suggestion: '发送催收提醒',
    })),
  ] : [
    // Buyer Action Feed (SA-019 第29章: 待验证Offer)
    ...supplyResources.filter(s => s.status === 'New').slice(0, 3).map(s => ({
      priority: 'high' as any,
      type: 'Verify' as any,
      title: `验证供应资源 ${s.mpn}`,
      description: `${s.supplier_id} · $${s.price} · ${s.stock_qty}片`,
      suggestion: '确认价格和库存',
    })),
    ...opportunities.filter(o => o.status === 'Matched').slice(0, 2).map(o => ({
      priority: 'medium' as any,
      type: 'Match' as any,
      title: `匹配需求 ${o.inquiry_id}`,
      description: `匹配度 ${o.match_score}%`,
      suggestion: '支持 Sales 成交',
    })),
  ];

  // ========================================================================
  // 成交漏斗 (SA-019 第26章)
  // ========================================================================
  const funnelStages = [
    { label: 'Inquiry', count: inquiries.length, color: 'bg-blue-500' },
    { label: 'Matched', count: inquiries.filter(i => i.status === 'Matched').length, color: 'bg-purple-500' },
    { label: 'Quoted', count: inquiries.filter(i => ['Quoted','Quoting'].includes(i.status)).length, color: 'bg-amber-500' },
    { label: 'Won', count: inquiries.filter(i => i.status === 'Won').length, color: 'bg-green-500' },
  ];

  // ========================================================================
  // 价值排行 (SA-019 第26章: 客户价值排行 / 第29章: 供应商排行)
  // ========================================================================
  const rankingItems = isSales
    ? customers.slice(0, 5).map(c => ({
        id: c.customer_id || c.id,
        name: c.customer_name || c.customer_id,
        value: `$${((c.total_order_amount || 0) / 10000).toFixed(0)}万`,
        change: (c.win_rate || 0) > 70 ? 'up' as const : 'flat' as const,
        detail: `成交率${c.win_rate || 0}%`,
      }))
    : [
        { id: 'S-001', name: 'Arrow Electronics', value: '92分', change: 'up' as const, detail: '价格/质量/交付' },
        { id: 'S-003', name: 'Mouser', value: '90分', change: 'up' as const, detail: '交期最快' },
        { id: 'S-004', name: 'Digi-Key', value: '91分', change: 'flat' as const, detail: '现货充足' },
        { id: 'S-002', name: 'Avnet', value: '88分', change: 'flat' as const, detail: '品质稳定' },
        { id: 'S-008', name: 'Future Electronics', value: '87分', change: 'down' as const, detail: '交期偏长' },
      ];

  // ========================================================================
  // Agent 行动中心 (SA-019 第22-24章)
  // ========================================================================
  const highRiskCount = arItems.filter(a => ['L3_Warning','L4_High'].includes(a.risk_level)).length;
  const newInquiryCount = inquiries.filter(i => i.status === 'New').length;
  const newSupplyCount = supplyResources.filter(s => s.status === 'New').length;

  const agentCards = isSales ? [
    {
      agentName: 'Sales Agent', agentType: 'Sales' as const,
      discovery: `${newInquiryCount} 条新询价待处理，${opportunities.filter(o => o.status === 'Matched').length} 个商机已匹配`,
      suggestedAction: `建议优先处理高优先级询价，Buyer 已为 ${opportunities.length} 个商机匹配供应资源`,
      actionButton: { label: '查看机会', action: 'view-opportunities', risk: 'low' as const },
      confidence: 88,
    },
    {
      agentName: 'Credit Agent', agentType: 'Credit' as const,
      discovery: `${highRiskCount} 笔高风险 AR 需关注`,
      suggestedAction: highRiskCount > 0 ? 'AR-0001 逾期96天，建议暂停发货' : 'AR 状态正常',
      actionButton: highRiskCount > 0 ? { label: '查看风险', action: 'view-risk', risk: 'high' as const } : undefined,
      confidence: 92,
    },
    {
      agentName: 'Market Agent', agentType: 'Market' as const,
      discovery: 'STM32F103C8T6 本周需求增长300%',
      suggestedAction: '建议关注国产替代 GD32F103C8T6',
      actionButton: { label: '查看行情', action: 'view-market', risk: 'low' as const },
      confidence: 82,
    },
  ] : [
    {
      agentName: 'Source Agent', agentType: 'Source' as const,
      discovery: `${newSupplyCount} 条新供应资源待验证`,
      suggestedAction: 'Arrow Electronics STM32F407 报价$4.10 库存充足，建议优先验证',
      actionButton: { label: '验证资源', action: 'verify-supply', risk: 'low' as const },
      confidence: 85,
    },
    {
      agentName: 'Match Agent', agentType: 'Match' as const,
      discovery: `${opportunities.length} 个商机可匹配 Sales 需求`,
      suggestedAction: 'SR-0001 命中3条Inquiry，匹配度最高92%',
      actionButton: { label: '查看匹配', action: 'view-match', risk: 'low' as const },
      confidence: 90,
    },
    {
      agentName: 'Price Agent', agentType: 'Price' as const,
      discovery: 'STM32F407VET6 市场均价$4.15',
      suggestedAction: '当前 Arrow 报价$4.10 低于市场价，建议锁定',
      actionButton: { label: '查看行情', action: 'view-price', risk: 'low' as const },
      confidence: 88,
    },
    {
      agentName: 'Supplier Agent', agentType: 'Source' as const,
      discovery: '华强电子世界 评分降至68分',
      suggestedAction: '交付可靠性下降至65%，建议减少依赖',
      actionButton: { label: '查看详情', action: 'view-supplier', risk: 'medium' as const },
      confidence: 82,
    },
  ];


  // ========================================================================


  // ========================================================================
  // Render — SA-019 第25章 Sales首页 / 第29章 Buyer首页
  // ========================================================================
  return (
    <WorkspaceLayout
      title="AI 工作台"
      role={userRole}
      topBarChildren={
        <div className="flex items-center gap-1.5 ml-3">
          <span className="text-xs text-gray-400">视角:</span>
          {(['Procurement','Sales','CEO'] as Role[]).map(r => (
            <button key={r} onClick={() => switchRole(r)}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                userRole === r
                  ? (r === 'Procurement' ? 'bg-purple-500 text-white' : r === 'Sales' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white')
                  : 'text-gray-400 hover:bg-gray-100'
              }`}>
              {r === 'Procurement' ? '采购' : r === 'Sales' ? '销售' : 'CEO'}
            </button>
          ))}
        </div>
      }
      agentStatuses={config.agentStatuses}
      rightPanel={
        <div className="p-4 space-y-4">
          <PermissionNotice reason="role" />
          {/* Agent 行动中心 (SA-019 第22-24章) */}
          {agentCards.map((ac, i) => (
            <AgentActionCard key={i} {...ac} />
          ))}
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {/* ============================================================ */}
        {loading && (
          <div className="text-center text-gray-400 py-12">
            <Bot size={32} className="mx-auto mb-2 opacity-50 animate-pulse" />
            <p className="text-sm">Agent 正在分析数据...</p>
          </div>
        )}

        {/* ============================================================ */}
        {/* 第二屏: Opportunity Feed 机会流 (SA-019 第15-17章) */}
        {/* ============================================================ */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              {isBuyer ? '商机匹配流' : '今日机会'}
            </h2>
            <a href="/opportunity" className="text-xs text-brand-600 hover:text-brand-700 font-medium">查看全部 →</a>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {opportunityCards.length > 0 ? opportunityCards.map((oc, i) => (
              <OpportunityCard key={i} {...oc} />
            )) : (
              <div className="col-span-4 proto-card p-8 text-center text-gray-400">
                <Zap size={28} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无机会，请先通过 AI Inbox 录入需求或供应资源</p>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 第三屏: Risk Feed 风险流 (SA-019 第18-19章) */}
        {/* ============================================================ */}
        {riskCards.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                {isBuyer ? '供应风险' : '风险预警'}
              </h2>
              <a href="/risk" className="text-xs text-brand-600 hover:text-brand-700 font-medium">查看全部 →</a>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {riskCards.map((rc, i) => (
                <RiskCard key={i} {...rc} />
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 第四屏: Action Feed 行动流 (SA-019 第20-21章) */}
        <div id="action-feed-section">
        {/* ============================================================ */}
        <div className="grid grid-cols-2 gap-6">
          <div className="proto-card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800">
                {isBuyer ? '待验证 Offer' : '待办事项'}
              </h2>
            </div>
            <div>
              {actionCards.length > 0 ? actionCards.map((ac, i) => (
                <ActionCard key={i} {...ac} />
              )) : (
                <div className="px-4 py-8 text-center text-gray-400">
                  <CheckCircle2 size={28} className="mx-auto mb-2 text-green-400" />
                  <p className="text-sm">暂无待办事项 🎉</p>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* 第五屏: 成交漏斗(仅销售) + 价值排行 (SA-019 第26/29章) */}
          {/* ============================================================ */}
          <div className="space-y-6">
            {!isBuyer && (
              <div className="proto-card p-4">
                <DealFunnel stages={funnelStages} />
              </div>
            )}
            <div className="proto-card p-4">
              <ValueRanking
                title={isBuyer ? '供应商排行' : '客户价值排行'}
                items={rankingItems}
                valueLabel={isBuyer ? '评分' : '成交额'}
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
