'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { KpiCard } from '@/components/KpiCard';
import { DollarSign, AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { getARItems } from '@/lib/api';

function detectRole() { return (typeof window !== 'undefined' ? localStorage.getItem('anos_user_role') || 'Procurement' : 'Procurement'); }


const rTag: Record<string, string> = { L4_High: 'tag-red', L3_Warning: 'tag-yellow', L2_Watch: 'tag-blue', L1_Low: 'tag-green' };
const riskLabel: Record<string, string> = { L4_High: 'L4', L3_Warning: 'L3', L2_Watch: 'L2', L1_Low: 'L1' };

export default function RiskCenterPage() {
  const [arData, setArData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState('');

  useEffect(() => {
    getARItems().then(res => {
      setArData((res.data || []).map((r: any) => ({
        id: r.ar_id,
        customer: r.customer_id,
        outstanding: r.outstanding_amount || 0,
        paid: r.paid_amount || 0,
        overdue: r.overdue_days || 0,
        risk: r.risk_level || 'L1_Low',
        status: r.status || 'Open',
        suggestion: r.ai_collection_suggestion || '关注',
      })));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalAR = arData.reduce((s, r) => s + r.outstanding + r.paid, 0);
  const totalOverdue = arData.filter(r => r.overdue > 0).reduce((s, r) => s + r.outstanding, 0);
  const avgOverdue = arData.filter(r => r.overdue > 0).length > 0
    ? Math.round(arData.filter(r => r.overdue > 0).reduce((s, r) => s + r.overdue, 0) / arData.filter(r => r.overdue > 0).length)
    : 0;
  const highRiskCount = arData.filter(r => ['L4_High', 'L3_Warning'].includes(r.risk)).length;

  return (
    <WorkspaceLayout title="风控中心"
      role={detectRole()}
      agentStatuses={[{ label: 'Credit Agent', color: 'tag tag-yellow' }]}
      rightPanel={
        <div className="p-4 space-y-5">
          <div className="proto-card-accent p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">风险雷达</h3>
            <div className="space-y-2">
              {arData.filter(r => r.overdue > 30).slice(0, 5).map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-md bg-gray-50 text-sm">
                  <div><div className="font-medium text-gray-800">{r.customer}</div><div className="text-gray-400 text-xs">{r.status}</div></div>
                  <div className="text-right"><div className="font-semibold text-gray-900 text-sm">${r.outstanding.toLocaleString()}</div><span className={`tag ${rTag[r.risk] || 'tag-gray'}`}>{riskLabel[r.risk] || 'L1'} · {r.overdue}天</span></div>
                </div>
              ))}
              {arData.filter(r => r.overdue > 30).length === 0 && (
                <div className="text-center text-gray-400 text-sm py-4">暂无高风险项目</div>
              )}
            </div>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="总应收" value={`$${(totalAR / 1000000).toFixed(1)}M`} change={`${arData.length} 笔`} trend="up" icon={<DollarSign size={15} />} />
          <KpiCard label="逾期总额" value={`$${(totalOverdue / 1000).toFixed(0)}K`} change={`${arData.filter(r => r.overdue > 0).length} 笔`} trend="up" icon={<AlertTriangle size={15} />} />
          <KpiCard label="平均逾期" value={`${avgOverdue}天`} change={`高风险 ${highRiskCount} 笔`} trend="up" icon={<Clock size={15} />} />
          <KpiCard label="回款率" value={`${totalAR > 0 ? Math.round(arData.reduce((s, r) => s + r.paid, 0) / totalAR * 100) : 0}%`} change={`${arData.filter(r => r.status === 'Paid' || r.status === 'Partial').length}/${arData.length}`} trend="down" icon={<TrendingDown size={15} />} />
        </div>

        {loading && <div className="text-center text-gray-400 py-8">加载中...</div>}

        <div className="proto-card overflow-hidden">
          <table className="proto-table">
            <thead><tr><th>客户</th><th>未回款金额</th><th>已回款</th><th>逾期天数</th><th>风险等级</th><th>建议处置</th></tr></thead>
            <tbody>
              {arData.map((r, i) => (
                <tr key={i} className="cursor-pointer hover:bg-gray-50">
                  <td className="font-medium">{r.customer}</td>
                  <td className="font-semibold text-sm">${r.outstanding.toLocaleString()}</td>
                  <td className="text-green-600">${r.paid.toLocaleString()}</td>
                  <td><span className={r.overdue > 60 ? 'text-red-600 font-medium' : r.overdue > 30 ? 'text-amber-600' : ''}>{r.overdue} 天</span></td>
                  <td><span className={`tag ${rTag[r.risk] || 'tag-gray'}`}>Level {riskLabel[r.risk] || 'L1'}</span></td>
                  <td className="text-gray-600 text-sm">{r.suggestion}</td>
                </tr>
              ))}
              {arData.length === 0 && !loading && (
                <tr><td colSpan={6} className="text-center text-gray-400 py-8">暂无 AR 数据</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {highRiskCount > 0 && (
          <AgentSuggestionCard agentName="Credit Agent" agentType="Credit"
            conclusion={`共有 ${highRiskCount} 笔高风险 AR 需要立即处置。${arData.filter(r => r.risk === 'L4_High').length} 笔严重逾期建议暂停发货并启动法务催收。`}
            evidence={arData.filter(r => r.overdue > 30).slice(0, 3).map(r => `${r.customer}: 逾期 ${r.overdue} 天 · $${r.outstanding.toLocaleString()}`)}
            sourceId="AR-RISK-001" generatedAt={generatedAt} confidenceScore={91}
            suggestedActions={[
              { label: '暂停高风险客户发货', risk: 'high' as const },
              { label: '发送催收函', risk: 'medium' as const },
              { label: '核查关联客户', risk: 'low' as const },
            ]}
            requiresApproval={true} />
        )}
      </div>
    </WorkspaceLayout>
  );
}
