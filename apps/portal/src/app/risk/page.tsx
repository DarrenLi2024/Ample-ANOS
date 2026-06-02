'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { KpiCard } from '@/components/KpiCard';
import { DollarSign, AlertTriangle, Clock, TrendingDown } from 'lucide-react';

const arRisks = [
  { customer: '汇顶科技', outstanding: 380000, overdueDays: 95, risk: 'L4_High', action: '停单+法务催收' },
  { customer: '海康威视', outstanding: 250000, overdueDays: 68, risk: 'L3_Warning', action: '催收函+暂停新单' },
  { customer: 'Jabil Inc.', outstanding: 180000, overdueDays: 45, risk: 'L2_Watch', action: '电话催收' },
  { customer: 'Flex Ltd.', outstanding: 120000, overdueDays: 32, risk: 'L2_Watch', action: '邮件提醒' },
  { customer: '大疆', outstanding: 90000, overdueDays: 22, risk: 'L1_Low', action: '关注' },
];

const riskColors: Record<string, string> = {
  L4_High: 'bg-red-100 text-red-700', L3_Warning: 'bg-orange-100 text-orange-700',
  L2_Watch: 'bg-yellow-100 text-yellow-700', L1_Low: 'bg-green-100 text-green-700',
};

export default function RiskCenterPage() {
  return (
    <WorkspaceLayout
      title="AR Risk Center — 风控中心"
      commandBarPlaceholder="查询客户风险、生成催收建议..."
      agentStatuses={[{ label: 'Credit Agent 等待确认', color: 'text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded' }]}
      rightPanel={
        <>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">风险雷达</h3>
          <div className="space-y-2">
            {arRisks.slice(0, 3).map((r, i) => (
              <div key={i} className="p-3 border border-gray-100 rounded">
                <div className="flex justify-between mb-1"><span className="font-medium text-sm">{r.customer}</span><span className={`text-xs px-1.5 py-0.5 rounded ${riskColors[r.risk]}`}>{r.risk}</span></div>
                <div className="text-xs text-gray-500">${r.outstanding.toLocaleString()} · {r.overdueDays}天</div>
              </div>
            ))}
          </div>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="总应收" value="$2.1M" change="+5% vs 上月" trend="up" icon={<DollarSign size={16} />} />
        <KpiCard label="逾期总额" value="$1.02M" change="+12% vs 上月" trend="up" icon={<AlertTriangle size={16} />} />
        <KpiCard label="平均逾期天数" value="52" change="+8天 vs 上月" trend="up" icon={<Clock size={16} />} />
        <KpiCard label="预计坏账" value="$85K" change="-3% vs 上月" trend="down" icon={<TrendingDown size={16} />} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3">客户</th><th className="px-4 py-3">未回款</th><th className="px-4 py-3">逾期天数</th>
              <th className="px-4 py-3">风险等级</th><th className="px-4 py-3">建议动作</th>
            </tr>
          </thead>
          <tbody>
            {arRisks.map((r, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 font-medium">{r.customer}</td>
                <td className="px-4 py-3">${r.outstanding.toLocaleString()}</td>
                <td className="px-4 py-3">{r.overdueDays}天</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded font-medium ${riskColors[r.risk]}`}>{r.risk}</span></td>
                <td className="px-4 py-3 text-gray-600">{r.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AgentSuggestionCard
        agentName="Credit Agent" agentType="Credit"
        conclusion="汇顶科技已逾期95天，信用评分降至C级。建议立即暂停发货并启动法务催收程序。"
        evidence={['逾期金额 $380,000', '最近一次回款: 95天前', '信用评分: B→C 持续下降']}
        sourceId="AR-RISK-001" generatedAt="2026-06-02 11:00"
        confidenceScore={91}
        suggestedActions={[{ label: '暂停发货', risk: 'high' }, { label: '发送法务催收函', risk: 'medium' }]}
        requiresApproval={true}
      />
    </WorkspaceLayout>
  );
}
