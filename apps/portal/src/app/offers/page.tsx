'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { getSupplyResources, getInquiries, getOpportunities } from '@/lib/api';

function detectRole() { return (typeof window !== 'undefined' ? localStorage.getItem('anos_user_role') || 'Procurement' : 'Procurement'); }


export default function OffersPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getSupplyResources().catch(() => ({ data: [] })),
      getInquiries().catch(() => ({ data: [] })),
      getOpportunities().catch(() => ({ data: [] })),
    ]).then(([srRes, inqRes, oppRes]) => {
      const srList = (srRes.data || []).map((s: any) => ({
        id: s.resource_id,
        supplier: s.supplier_id || '●●●●',
        brand: s.brand || 'N/A',
        mpn: s.mpn || 'N/A',
        stock: s.stock_qty || 0,
        price: '$' + (s.price || 0).toFixed(2),
        leadTime: s.lead_time_days ? s.lead_time_days + '天' : 'N/A',
        score: s.resource_score || s.match_score || 75,
        status: s.status === 'Verified' ? 'Verified' : s.status === 'Matched' ? 'Matched' : 'New',
      }));
      setResources(srList);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // Reload when page becomes visible (user navigates back)
    const onVisible = () => { if (document.visibilityState === 'visible') loadData(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const statusTag = (s: string) => s === 'Verified' ? 'tag-green' : s === 'Matched' ? 'tag-purple' : 'tag-blue';

  return (
    <WorkspaceLayout title="供应资源池"
      role={detectRole()}
      agentStatuses={[{ label: 'Procurement Agent', color: 'tag tag-purple' }]}
      rightPanel={
        <div className="p-4 space-y-5">
          <SourceCard source="Arrow Electronics" sourceType="Email" sourceOwner="采购部"
            eventTime="2026-06-04 08:00" capturedAt="2026-06-04 08:05"
            verifiedBy="Procurement Agent" confidenceScore={90} status="verified" />
          <div className="proto-card p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">供应概览</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>供应资源</span><span className="font-semibold text-brand-600">{resources.length} 条</span></div>
              <div className="flex justify-between"><span>已验证</span><span className="font-semibold text-green-600">{resources.filter(r => r.status === 'Verified').length} 条</span></div>
            </div>
          </div>
        </div>
      }>
      <div className="p-6 space-y-6">
        {loading && <div className="text-center text-gray-400 py-8">加载中...</div>}
        <div className="proto-card overflow-hidden">
          <table className="proto-table">
            <thead><tr><th>ID</th><th>供应商</th><th>品牌</th><th>型号</th><th>库存</th><th>价格</th><th>交期</th><th>评分</th><th>状态</th></tr></thead>
            <tbody>{resources.map(r => (
              <tr key={r.id} className="cursor-pointer hover:bg-gray-50">
                <td className="font-mono text-xs text-brand-600">{r.id}</td>
                <td className="font-medium">{r.supplier}</td>
                <td className="text-gray-500">{r.brand}</td>
                <td className="font-mono text-xs">{r.mpn}</td>
                <td>{r.stock.toLocaleString()}</td>
                <td>{r.price}</td>
                <td>{r.leadTime}</td>
                <td><span className="text-brand-600 font-medium">{r.score}%</span></td>
                <td><span className={`tag ${statusTag(r.status)}`}>{r.status}</span></td>
              </tr>
            ))}
            {resources.length === 0 && !loading && (
              <tr><td colSpan={9} className="text-center text-gray-400 py-8">暂无供应资源</td></tr>
            )}
            </tbody>
          </table>
        </div>
        <AgentSuggestionCard agentName="Procurement Agent" agentType="Procurement"
          conclusion={`供应资源池共 ${resources.length} 条记录。请优先验证新入库资源，确保价格和库存信息准确。`}
          evidence={resources.slice(0, 3).map(r => `${r.id}: ${r.mpn} ${r.price} ${r.stock}片`)}
          sourceId="SRC-OFR-001" generatedAt={generatedAt} confidenceScore={88}
          suggestedActions={[{ label: '验证供应资源', risk: 'low' }]}
          requiresApproval={false} />
      </div>
    </WorkspaceLayout>
  );
}
