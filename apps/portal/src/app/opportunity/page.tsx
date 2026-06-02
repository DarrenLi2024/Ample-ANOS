'use client';
import { SourceCard } from '@/components/SourceCard';
import { HumanApprovalPanel } from '@/components/HumanApprovalPanel';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function OpportunityPage() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const headers: Record<string,string> = { 'Content-Type': 'application/json', 'X-User-Role': 'SystemAdmin' };
    fetch('http://localhost:3001/api/opportunities', { headers })
      .then(r => r.json())
      .then(d => { setApiData(d.data || d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <WorkspaceLayout title="Opportunity 详情">
      <div className="p-6 space-y-6">
        <div className="proto-card-accent p-5">
          <div className="flex items-center justify-between mb-4"><h2 className="text-base font-semibold">OPP-001 · STM32F407VET6</h2><span className="tag tag-purple">匹配度 92%</span></div>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="p-3 bg-gray-50 rounded"><div className="text-xs text-gray-400">客户</div><div className="font-medium">华为技术</div></div>
            <div className="p-3 bg-gray-50 rounded"><div className="text-xs text-gray-400">供应商</div><div className="font-medium redacted">SR-001</div></div>
            <div className="p-3 bg-gray-50 rounded"><div className="text-xs text-gray-400">供应价格</div><div className="font-medium text-redacted">●●●●</div></div>
            <div className="p-3 bg-gray-50 rounded"><div className="text-xs text-gray-400">预估毛利</div><div className="font-medium text-green-600">$0.85/pcs</div></div>
          </div>
          <div className="flex gap-2"><button className="btn-primary">生成报价</button><button className="btn-outline">查看供应资源</button></div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
