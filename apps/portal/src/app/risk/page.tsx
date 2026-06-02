'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { KpiCard } from '@/components/KpiCard';
import { DollarSign, AlertTriangle, Clock, TrendingDown } from 'lucide-react';

const risks = [
  { customer: '汇顶科技', outstanding: 380000, overdue: 95, risk: 'L4', credit: 'C', action: '停单 + 法务催收' },
  { customer: '海康威视', outstanding: 250000, overdue: 68, risk: 'L3', credit: 'B', action: '催收函 + 暂停新单' },
  { customer: 'Jabil Inc.', outstanding: 180000, overdue: 45, risk: 'L2', credit: 'A', action: '电话催收 + 邮件提醒' },
  { customer: 'Flex Ltd.', outstanding: 120000, overdue: 32, risk: 'L2', credit: 'AA', action: '邮件提醒' },
  { customer: '大疆创新', outstanding: 90000, overdue: 22, risk: 'L1', credit: 'AA', action: '关注' },
];

const rTag: Record<string, string> = { L4: 'tag-red', L3: 'tag-yellow', L2: 'tag-blue', L1: 'tag-green' };

export default function RiskCenterPage() {
  return (
    <WorkspaceLayout title="风控中心"
      agentStatuses={[{ label: 'Credit Agent', color: 'tag tag-yellow' }]}
      rightPanel={
        <div className="p-4 space-y-5">
          <div className="proto-card-accent p-4">
            <h3 className="text-[16px] font-semibold text-gray-400 uppercase tracking-wide mb-3">风险雷达</h3>
            <div className="space-y-2">
              {risks.slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-md bg-gray-50 text-[16px]">
                  <div><div className="font-medium text-gray-800">{r.customer}</div><div className="text-gray-400 text-[16px]">信用 {r.credit}</div></div>
                  <div className="text-right"><div className="font-semibold text-gray-900">${r.outstanding.toLocaleString()}</div><span className={`tag ${rTag[r.risk]}`}>{r.risk} · {r.overdue}天</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="总应收" value="$2.1M" change="+5% vs 上月" trend="up" icon={<DollarSign size={15} />} />
          <KpiCard label="逾期总额" value="$1.02M" change="+12% vs 上月" trend="up" icon={<AlertTriangle size={15} />} />
          <KpiCard label="平均逾期" value="52天" change="+8天 vs 上月" trend="up" icon={<Clock size={15} />} />
          <KpiCard label="预计坏账" value="$85K" change="-3% vs 上月" trend="down" icon={<TrendingDown size={15} />} />
        </div>

        <div className="proto-card overflow-hidden">
          <table className="proto-table">
            <thead><tr><th>客户</th><th>未回款金额</th><th>逾期天数</th><th>信用等级</th><th>风险等级</th><th>建议处置</th></tr></thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={i} className="cursor-pointer">
                  <td className="font-medium">{r.customer}</td>
                  <td className="font-semibold">${r.outstanding.toLocaleString()}</td>
                  <td><span className={r.overdue>60?'text-red-600 font-medium':''}>{r.overdue} 天</span></td>
                  <td><span className="tag tag-gray">{r.credit}</span></td>
                  <td><span className={`tag ${rTag[r.risk]}`}>Level {r.risk.slice(1)}</span></td>
                  <td className="text-gray-600 text-[16px]">{r.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AgentSuggestionCard agentName="Credit Agent" agentType="Credit"
          conclusion="汇顶科技已逾期 95 天，信用评分从 B 降至 C。建议立即暂停该客户所有新订单发货，并发送法务催收函。同时核查是否有其他关联客户存在类似逾期。"
          evidence={['逾期金额 $380,000', '最后回款日期: 95 天前', '信用评分: B → C 持续下降', '历史逾期次数: 3 次']}
          sourceId="AR-RISK-001" generatedAt="2026-06-02 11:00" confidenceScore={91}
          suggestedActions={[{ label: '暂停发货', risk: 'high' }, { label: '发送法务催收函', risk: 'medium' }, { label: '核查关联客户', risk: 'low' }]}
          requiresApproval={true} />
      </div>
    </WorkspaceLayout>
  );
}
