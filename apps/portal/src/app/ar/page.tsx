'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { getARItems } from '@/lib/api';

function detectRole() { return (typeof window !== 'undefined' ? localStorage.getItem('anos_user_role') || 'Procurement' : 'Procurement'); }


export default function ArPage() {
  const [arData, setArData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getARItems().then(res => {
      setArData(res.data || []);
    }).catch(err => {
      console.error('AR fetch failed:', err);
    }).finally(() => setLoading(false));
  }, []);

  const totalAR = arData.reduce((s, a) => s + (a.ar_amount || 0), 0);
  const totalOverdue = arData.filter(a => ['L3_Warning','L4_High'].includes(a.risk_level)).reduce((s, a) => s + (a.outstanding_amount || 0), 0);
  const totalPaid = arData.reduce((s, a) => s + (a.paid_amount || 0), 0);
  const totalAmount = arData.reduce((s, a) => s + (a.ar_amount || 0), 0);
  const collectionRate = totalAmount > 0 ? Math.round(totalPaid / totalAmount * 100) : 0;

  return (
    <WorkspaceLayout title="AR 中心"
      role={detectRole()}>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="proto-card p-4"><div className="text-xs text-gray-400 uppercase">总应收</div><div className="text-xl font-bold">${(totalAR / 10000).toFixed(0)}万</div></div>
          <div className="proto-card p-4"><div className="text-xs text-gray-400 uppercase">高风险逾期</div><div className="text-xl font-bold text-red-600">${(totalOverdue / 10000).toFixed(0)}万</div></div>
          <div className="proto-card p-4"><div className="text-xs text-gray-400 uppercase">回款率</div><div className="text-xl font-bold text-green-600">{collectionRate}%</div></div>
          <div className="proto-card p-4"><div className="text-xs text-gray-400 uppercase">AR 笔数</div><div className="text-xl font-bold">{arData.length}</div></div>
        </div>
        <div className="proto-card overflow-hidden">
          <table className="proto-table">
            <thead><tr><th>AR ID</th><th>客户</th><th>发票号</th><th>应收金额</th><th>已回款</th><th>未回款</th><th>逾期天数</th><th>风险等级</th></tr></thead>
            <tbody>
              {arData.map(ar => (
                <tr key={ar.ar_id} className="cursor-pointer hover:bg-gray-50">
                  <td className="font-mono text-xs text-brand-600">{ar.ar_id}</td>
                  <td className="font-medium">{ar.customer_id}</td>
                  <td className="text-xs text-gray-500">{ar.invoice_no || 'N/A'}</td>
                  <td>${(ar.ar_amount / 1000).toFixed(0)}K</td>
                  <td className={ar.paid_amount > 0 ? 'text-green-600' : 'text-red-600'}>${(ar.paid_amount / 1000).toFixed(0)}K</td>
                  <td className={ar.outstanding_amount > 0 ? 'text-red-600 font-medium' : 'text-gray-400'}>${(ar.outstanding_amount / 1000).toFixed(0)}K</td>
                  <td className={ar.overdue_days > 30 ? 'text-red-600 font-medium' : ar.overdue_days > 0 ? 'text-amber-600' : ''}>{ar.overdue_days}天</td>
                  <td><span className={`tag ${ar.risk_level === 'L4_High' ? 'tag-red' : ar.risk_level === 'L3_Warning' ? 'tag-yellow' : ar.risk_level === 'L2_Watch' ? 'tag-blue' : 'tag-green'}`}>{ar.risk_level?.replace('L1_Low','L1').replace('L2_Watch','L2').replace('L3_Warning','L3').replace('L4_High','L4')}</span></td>
                </tr>
              ))}
              {arData.length === 0 && !loading && (
                <tr><td colSpan={8} className="text-center text-gray-400 py-8">暂无 AR 数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div className="text-center text-gray-400 py-8">加载中...</div>}
      </div>
    </WorkspaceLayout>
  );
}
