'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { DealFunnel } from '@/components/DealFunnel';
import { ValueRanking } from '@/components/ValueRanking';
import { getInquiries, getOpportunities, getCustomers } from '@/lib/api';
import { TrendingUp } from 'lucide-react';

function detectRole() { return (typeof window !== 'undefined' && localStorage.getItem('anos_user_role')) || 'Sales'; }

export default function PerformancePage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [opps, setOpps] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const role = detectRole();

  useEffect(() => {
    Promise.all([
      getInquiries().catch(() => ({ data: [] })),
      getOpportunities().catch(() => ({ data: [] })),
      getCustomers().catch(() => ({ data: [] })),
    ]).then(([inqRes, oppRes, custRes]) => {
      setInquiries(inqRes.data || []);
      setOpps(oppRes.data || []);
      setCustomers(custRes.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const funnelStages = [
    { label: 'Inquiry', count: inquiries.length, color: 'bg-blue-500' },
    { label: 'Matched', count: inquiries.filter(i => i.status === 'Matched').length, color: 'bg-purple-500' },
    { label: 'Quoted', count: inquiries.filter(i => ['Quoted','Quoting'].includes(i.status)).length, color: 'bg-amber-500' },
    { label: 'Won', count: inquiries.filter(i => i.status === 'Won').length, color: 'bg-green-500' },
  ];

  const wonCount = inquiries.filter(i => i.status === 'Won').length;
  const conversionRate = inquiries.length > 0 ? Math.round(wonCount / inquiries.length * 100) : 0;

  return (
    <WorkspaceLayout title="业绩中心" role={role}>
      <div className="p-6 space-y-6">
        {loading && <div className="text-center text-gray-400 py-8">加载中...</div>}

        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={18} className="text-green-500" />
          <h2 className="text-base font-bold text-gray-800">业绩概览</h2>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '总询价', value: inquiries.length, color: 'text-blue-600' },
            { label: '总商机', value: opps.length, color: 'text-purple-600' },
            { label: '已成交', value: wonCount, color: 'text-green-600' },
            { label: '转化率', value: `${conversionRate}%`, color: 'text-amber-600' },
          ].map((kpi, i) => (
            <div key={i} className="proto-card p-4">
              <div className="text-xs text-gray-400 uppercase">{kpi.label}</div>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="proto-card p-4">
            <DealFunnel stages={funnelStages} />
          </div>
          <div className="proto-card p-4">
            <ValueRanking
              title="客户价值排行"
              items={customers.slice(0, 5).map(c => ({
                id: c.customer_id || c.id,
                name: c.customer_name || c.customer_id,
                value: `$${((c.total_order_amount || 0)/10000).toFixed(0)}万`,
                change: 'up' as const,
                detail: `成交${c.order_count || 0}笔`,
              }))}
            />
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
