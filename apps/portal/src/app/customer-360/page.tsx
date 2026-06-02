'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function Customer360Page() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const headers: Record<string,string> = { 'Content-Type': 'application/json', 'X-User-Role': 'SystemAdmin' };
    fetch('http://localhost:3001/api/customers?limit=5', { headers })
      .then(r => r.json())
      .then(d => { setApiData(d.data || d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <WorkspaceLayout title="客户 360° 画像">
      <div className="p-6 space-y-6">
        <div className="proto-card-accent p-5">
          <div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">HW</div><div><h2 className="text-base font-semibold">华为技术有限公司</h2><div className="text-xs text-gray-400">EndUser · 中国深圳 · 客户等级 S</div></div><span className="tag tag-green ml-auto">信用 AAA</span></div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded"><div className="font-bold">47</div><div className="text-xs text-gray-400">总RFQ数</div></div>
            <div className="text-center p-3 bg-gray-50 rounded"><div className="font-bold">38</div><div className="text-xs text-gray-400">成交订单</div></div>
            <div className="text-center p-3 bg-gray-50 rounded"><div className="font-bold">81%</div><div className="text-xs text-gray-400">成交率</div></div>
            <div className="text-center p-3 bg-gray-50 rounded"><div className="font-bold">$2.1M</div><div className="text-xs text-gray-400">总成交额</div></div>
          </div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">动态时间线</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3"><span className="text-xs text-gray-400 w-16">10:30</span><span>新 RFQ: STM32F407VET6 × 5,000pcs</span></div>
            <div className="flex gap-3"><span className="text-xs text-gray-400 w-16">昨天</span><span>报价已发送: $4.35/pcs</span></div>
            <div className="flex gap-3"><span className="text-xs text-gray-400 w-16">3天前</span><span>订单 SO-0892 已发货</span></div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
