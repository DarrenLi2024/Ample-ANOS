'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function QuoteApprovalPage() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const headers: Record<string,string> = { 'Content-Type': 'application/json', 'X-User-Role': 'SystemAdmin' };
    fetch('http://localhost:3001/api/offers', { headers })
      .then(r => r.json())
      .then(d => { setApiData(d.data || d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <WorkspaceLayout title="报价建议 · 审批">
      <div className="p-6 space-y-6">
        <div className="proto-card-accent p-5">
          <h2 className="text-base font-semibold mb-4">🤖 AI 报价建议</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-brand-50 rounded-lg text-center"><div className="text-2xl font-bold text-brand-600">$4.35</div><div className="text-xs text-gray-500 mt-1">建议报价/pcs</div></div>
            <div className="p-4 bg-green-50 rounded-lg text-center"><div className="text-2xl font-bold text-green-600">$0.85</div><div className="text-xs text-gray-500 mt-1">预估毛利/pcs</div></div>
            <div className="p-4 bg-gray-50 rounded-lg text-center"><div className="text-2xl font-bold text-gray-700">19.5%</div><div className="text-xs text-gray-500 mt-1">毛利率</div></div>
          </div>
          <div className="text-sm text-gray-600 mb-4">依据: 近5笔成交均价 $4.35 | 市场库存充足 | 客户信用 AAA | 历史成交率 92%</div>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded text-xs text-amber-700 mb-4">⚠ 毛利护栏: 最低报价不低于 $4.10/pcs (毛利率 {'>'} 15%)</div>
          <div className="flex gap-3"><button className="btn-primary">✅ 批准报价</button><button className="btn-outline">调整报价</button><button className="btn-ghost text-red-500">驳回</button></div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
