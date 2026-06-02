'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { SourceCard } from '@/components/SourceCard';

const API = 'http://localhost:3001';

export default function Customer360Page() {
  const [custData, setCustData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API + '/api/workflow/customer-history/C-001', { headers: { 'X-User-Role': 'SystemAdmin' } })
      .then(r => r.json()).then(d => { setCustData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <WorkspaceLayout title="客户 360°"><div className="p-12 text-center text-sm text-gray-400">加载中...</div></WorkspaceLayout>;
  if (!custData) return <WorkspaceLayout title="客户 360°"><div className="p-12 text-center text-sm text-gray-400">暂无数据</div></WorkspaceLayout>;

  const c = custData.customer || {};
  return (
    <WorkspaceLayout title="客户 360° 画像" rightPanel={<div className="p-4"><SourceCard source="ERP系统" sourceType="ERP" eventTime="2026-06-01" capturedAt="2026-06-01" verifiedBy="System" confidenceScore={95} status="verified" /></div>}>
      <div className="p-6 space-y-6">
        <div className="proto-card-accent p-5">
          <h2 className="text-base font-semibold mb-4">{c.customer_name || '客户详情'}</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded"><div className="font-bold">{custData.totalInquiries || 0}</div><div className="text-xs text-gray-400">RFQ数</div></div>
            <div className="text-center p-3 bg-gray-50 rounded"><div className="font-bold">{c.order_count || 0}</div><div className="text-xs text-gray-400">订单数</div></div>
            <div className="text-center p-3 bg-gray-50 rounded"><div className="font-bold">{c.win_rate || 0}%</div><div className="text-xs text-gray-400">成交率</div></div>
            <div className="text-center p-3 bg-gray-50 rounded"><div className="font-bold">${(c.total_order_amount||0).toLocaleString()}</div><div className="text-xs text-gray-400">成交额</div></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded"><span className="text-xs text-gray-400">信用等级</span><div className="font-medium">{c.credit_level || 'N/A'}</div></div>
            <div className="p-3 bg-gray-50 rounded"><span className="text-xs text-gray-400">风险等级</span><div className="font-medium">{c.risk_level || 'L1_Low'}</div></div>
          </div>
        </div>
        <div className="proto-card p-5"><h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">最近询价</h3>
          <table className="proto-table"><thead><tr><th>ID</th><th>型号</th><th>数量</th><th>状态</th><th>时间</th></tr></thead>
            <tbody>{(custData.inquiries||[]).slice(0,5).map((inq:any,i:number) => (
              <tr key={i}><td className="font-mono text-xs text-brand-600">{inq.inquiry_id?.slice(0,12)}</td><td className="font-mono text-xs">{inq.mpn}</td><td>{inq.quantity}</td><td><span className="tag tag-blue">{inq.status}</span></td><td className="text-gray-400 text-xs">{inq.created_at?.slice(0,10)}</td></tr>
            ))}</tbody></table>
        </div>
        <div className="proto-card p-5"><h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">AR 状态</h3>
          {(custData.arItems||[]).length === 0 ? <p className="text-sm text-gray-400">无逾期应收</p> :
            (custData.arItems||[]).map((ar:any,i:number) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-gray-100 text-sm"><span>{ar.ar_id}</span><span className="text-red-600">${ar.outstanding_amount}</span><span>{ar.overdue_days}天</span></div>
            ))}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
