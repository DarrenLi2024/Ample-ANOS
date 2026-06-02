'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function InquiryCreatePage() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const headers: Record<string,string> = { 'Content-Type': 'application/json', 'X-User-Role': 'SystemAdmin' };
    fetch('http://localhost:3001/api/workflow/status', { headers })
      .then(r => r.json())
      .then(d => { setApiData(d.data || d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <WorkspaceLayout title="RFQ 解析 · 创建 Inquiry">
      <div className="p-6 space-y-6">
        <div className="proto-card-accent p-5">
          <h2 className="text-base font-semibold mb-4">📧 原始 RFQ 预览</h2>
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed border border-gray-200">
            <p className="font-medium mb-2">From: 华为采购部 zhang@huawei.com</p>
            <p className="mb-2">Subject: STM32F407VET6 询价需求</p>
            <p>我们需要 5,000pcs STM32F407VET6，目标价格 $4.50/pcs，交期 4 周内。请提供最优报价。</p>
          </div>
        </div>

        <div className="proto-card-accent p-5">
          <h2 className="text-base font-semibold mb-4">🔍 AI 解析结果</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-400">型号</span><div className="font-mono font-semibold text-brand-600">STM32F407VET6</div><span className="tag tag-green ml-2">置信 95%</span></div>
            <div><span className="text-gray-400">数量</span><div className="font-semibold">5,000 pcs</div></div>
            <div><span className="text-gray-400">目标价格</span><div className="font-semibold">$4.50/pcs</div></div>
            <div><span className="text-gray-400">需求交期</span><div className="font-semibold">4 周内</div></div>
            <div><span className="text-gray-400">客户</span><div className="font-semibold">华为技术有限公司</div></div>
            <div><span className="text-gray-400">优先级</span><span className="tag tag-yellow">High</span></div>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
            <button className="btn-primary">✅ 确认创建 Inquiry</button>
            <button className="btn-outline">✏️ 手动修改</button>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
