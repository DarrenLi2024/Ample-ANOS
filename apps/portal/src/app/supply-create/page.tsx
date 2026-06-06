'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

function detectRole() { return (typeof window !== 'undefined' ? localStorage.getItem('anos_user_role') || 'Procurement' : 'Procurement'); }


export default function SupplyCreatePage() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const headers: Record<string,string> = { 'Content-Type': 'application/json', 'X-User-Role': 'SystemAdmin' };
    fetch('http://localhost:3001/api/supply-resources', { headers })
      .then(r => r.json())
      .then(d => { setApiData(d.data || d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <WorkspaceLayout title="供应资源解析 · 创建"
      role={detectRole()}>
      <div className="p-6 space-y-6">
        <div className="proto-card-accent p-5"><h2 className="text-base font-semibold mb-4">📊 报价单解析</h2><div className="bg-gray-50 p-4 rounded-lg text-sm mb-4"><p className="font-medium">Arrow Electronics 库存报价单</p><p className="text-gray-500 mt-1">STM32F407VET6 · 8,000pcs · $4.20/pcs · 交期2周</p></div>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4"><div><span className="text-gray-400">供应商</span><div className="font-semibold">Arrow Electronics</div></div><div><span className="text-gray-400">型号</span><div className="font-mono font-semibold">STM32F407VET6</div></div><div><span className="text-gray-400">库存</span><div className="font-semibold">8,000 pcs</div></div><div><span className="text-gray-400">价格</span><div className="font-semibold">$4.20/pcs</div></div></div>
          <div className="flex gap-3"><button className="btn-primary">写入供应资源池</button><button className="btn-outline">修改</button></div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
