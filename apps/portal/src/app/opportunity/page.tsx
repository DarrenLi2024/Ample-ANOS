'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { OpportunityCard } from '@/components/OpportunityCard';
import { getOpportunities, getInquiries, getSupplyResources } from '@/lib/api';
import { Zap } from 'lucide-react';

function detectRole() { return (typeof window !== 'undefined' && localStorage.getItem('anos_user_role')) || 'Procurement'; }

export default function OpportunityPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const role = detectRole();
  const isBuyer = role === 'Procurement';

  useEffect(() => {
    Promise.all([
      getOpportunities().catch(() => ({ data: [] })),
      getInquiries().catch(() => ({ data: [] })),
      getSupplyResources().catch(() => ({ data: [] })),
    ]).then(([oppRes, inqRes, srRes]) => {
      const opps = (oppRes.data || []).map((o: any) => ({
        type: (o.match_score >= 85 ? 'HighValue' : o.match_score >= 70 ? 'HighValue' : 'Shortage') as any,
        mpn: o.inquiry_id || 'N/A',
        matchScore: o.match_score,
        margin: o.estimated_margin ? Math.round(o.estimated_margin * 100) : undefined,
        winRate: o.match_score ? Math.round(o.match_score * 0.8) : undefined,
        action: o.status === 'Matched' ? (isBuyer ? '支持成交' : '立即报价') : '查看详情',
        customerCode: isBuyer ? (o.customer_id || '●●●●') : undefined,
        salesName: isBuyer ? 'Sales' : undefined,
      }));
      setOpportunities(opps);
    }).catch(console.error).finally(() => setLoading(false));
  }, [isBuyer]);

  return (
    <WorkspaceLayout title="机会中心" role={role}
      rightPanel={
        <div className="p-4">
          <div className="proto-card-accent p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">机会概览</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>总机会</span><span className="font-semibold text-brand-600">{opportunities.length}</span></div>
              <div className="flex justify-between"><span>高价值</span><span className="font-semibold text-green-600">{opportunities.filter(o => o.matchScore >= 85).length}</span></div>
              <div className="flex justify-between"><span>待行动</span><span className="font-semibold text-amber-600">{opportunities.filter(o => o.action.includes('报价') || o.action.includes('成交')).length}</span></div>
            </div>
          </div>
        </div>
      }>
      <div className="p-6">
        {loading && <div className="text-center text-gray-400 py-12">加载中...</div>}
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-amber-500" />
          <h2 className="text-base font-bold text-gray-800">
            {isBuyer ? '商机匹配流' : '机会中心'}
          </h2>
          <span className="text-xs text-gray-400 ml-2">{opportunities.length} 个机会</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {opportunities.map((oc, i) => (
            <OpportunityCard key={i} {...oc} />
          ))}
          {opportunities.length === 0 && !loading && (
            <div className="col-span-3 proto-card p-12 text-center text-gray-400">
              <Zap size={32} className="mx-auto mb-2 opacity-50" />
              <p>暂无机会</p>
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
