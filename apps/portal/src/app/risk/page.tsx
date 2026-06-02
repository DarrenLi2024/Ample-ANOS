'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { KpiCard } from '@/components/KpiCard';
import { DollarSign, AlertTriangle, Clock, TrendingDown } from 'lucide-react';

const risks = [
  { customer: '汇顶科技', outstanding: 380000, overdue: 95, risk: 'L4', action: '停单+法务催收' },
  { customer: '海康威视', outstanding: 250000, overdue: 68, risk: 'L3', action: '催收函+暂停新单' },
  { customer: 'Jabil Inc.', outstanding: 180000, overdue: 45, risk: 'L2', action: '电话催收' },
  { customer: 'Flex Ltd.', outstanding: 120000, overdue: 32, risk: 'L2', action: '邮件提醒' },
  { customer: '大疆', outstanding: 90000, overdue: 22, risk: 'L1', action: '关注' },
];

const rcls: Record<string, string> = { L4: 'badge-red', L3: 'badge-yellow', L2: 'badge-blue', L1: 'badge-green' };

export default function RiskCenterPage() {
  return (
    <WorkspaceLayout title="AR Risk Center" commandBarPlaceholder="查询客户风险、生成催收建议..."
      agentStatuses={[{ label: 'Credit Agent 等待确认', color: 'badge badge-yellow' }]}
      rightPanel={<>
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-3">风险雷达</h3>
        <div className="space-y-2">
          {risks.slice(0, 3).map((r, i) => (
            <div key={i} className="p-3 border border-border-light rounded-sm">
              <div className="flex justify-between mb-1"><span className="font-medium text-sm">{r.customer}</span><span className={`badge ${rcls[r.risk]}`}>{r.risk}</span></div>
              <div className="text-xs text-text-tertiary">${r.outstanding.toLocaleString()} · {r.overdue}天</div>
            </div>
          ))}
        </div>
      </>}
    >
      <div className="grid grid-cols-4 gap-5 mb-8">
        <KpiCard label="总应收" value="$2.1M" change="+5%" trend="up" icon={<DollarSign size={15} />} />
        <KpiCard label="逾期总额" value="$1.02M" change="+12%" trend="up" icon={<AlertTriangle size={15} />} />
        <KpiCard label="平均逾期天数" value="52" change="+8天" trend="up" icon={<Clock size={15} />} />
        <KpiCard label="预计坏账" value="$85K" change="-3%" trend="down" icon={<TrendingDown size={15} />} />
      </div>
      <div className="card-gradient overflow-hidden mb-6">
        <table className="table-minimal">
          <thead><tr><th>客户</th><th>未回款</th><th>逾期天数</th><th>风险等级</th><th>建议动作</th></tr></thead>
          <tbody>
            {risks.map((r, i) => (
              <tr key={i} className="cursor-pointer">
                <td className="font-medium">{r.customer}</td><td>${r.outstanding.toLocaleString()}</td><td>{r.overdue}天</td>
                <td><span className={`badge ${rcls[r.risk]}`}>{r.risk}</span></td><td className="text-text-secondary">{r.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AgentSuggestionCard agentName="Credit Agent" agentType="Credit"
        conclusion="汇顶科技已逾期95天，信用评分降至C级。建议立即暂停发货并启动法务催收。"
        evidence={['逾期$380,000', '最后回款95天前', '信用评分B→C持续下降']}
        sourceId="AR-RISK-001" generatedAt="2026-06-02 11:00" confidenceScore={91}
        suggestedActions={[{ label: '暂停发货', risk: 'high' }, { label: '发送法务催收函', risk: 'medium' }]}
        requiresApproval={true} />
    </WorkspaceLayout>
  );
}
