'use client';
import { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { getInquiries, getOpportunities } from '@/lib/api';

function detectRole() { return (typeof window !== 'undefined' ? localStorage.getItem('anos_user_role') || 'Procurement' : 'Procurement'); }


export default function InquiryCenterPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState('');
  const [filter, setFilter] = useState('全部');

  useEffect(() => {
    Promise.all([
      getInquiries().catch(() => ({ data: [] })),
      getOpportunities().catch(() => ({ data: [] })),
    ]).then(([inqRes, oppRes]) => {
      setInquiries(inqRes.data || []);
      setOpportunities(oppRes.data || []);
    }).catch(err => console.error('Fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === '全部' ? inquiries : inquiries.filter(i => i.status === filter);

  // Count matched opportunities per inquiry
  const matchedCount = (inqId: string) => opportunities.filter(o => o.inquiry_id === inqId).length;

  const statusTag = (s: string) => {
    const map: Record<string,string> = { New:'tag-blue', Matched:'tag-purple', Quoting:'tag-yellow', Quoted:'tag-yellow', Won:'tag-green', Lost:'tag-red', Parsing:'tag-gray' };
    return 'tag ' + (map[s] || 'tag-gray');
  };
  const priorityTag = (p: string) => {
    const map: Record<string,string> = { Urgent:'tag-red', High:'tag-yellow', Medium:'tag-blue', Low:'tag-gray' };
    return 'tag ' + (map[p] || 'tag-gray');
  };

  return (
    <WorkspaceLayout title="询价中心"
      role={detectRole()}
      agentStatuses={[{ label: 'Sales Agent', color: 'tag tag-blue' }]}
      topBarChildren={
        <div className="flex items-center gap-2 ml-6">
          {['全部','New','Matched','Quoted','Won'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${filter === f ? 'bg-brand-500 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
              {f}
            </button>
          ))}
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {loading && <div className="text-center text-gray-400 py-12">加载中...</div>}
        <div className="proto-card overflow-hidden">
          <table className="proto-table">
            <thead><tr><th>Inquiry ID</th><th>客户</th><th>品牌</th><th>型号</th><th>数量</th><th>目标价</th><th>状态</th><th>优先级</th><th>匹配数</th><th>时间</th></tr></thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.inquiry_id} className="cursor-pointer hover:bg-gray-50">
                  <td className="font-mono text-sm text-brand-600">{i.inquiry_id}</td>
                  <td className="font-medium">{i.customer_id}</td>
                  <td className="text-gray-500">{i.brand || 'N/A'}</td>
                  <td className="font-mono text-sm">{i.mpn}</td>
                  <td>{i.quantity?.toLocaleString()}</td>
                  <td className="font-medium">{i.target_price ? '$' + i.target_price.toFixed(2) : 'N/A'}</td>
                  <td><span className={statusTag(i.status)}>{i.status}</span></td>
                  <td><span className={priorityTag(i.priority)}>{i.priority}</span></td>
                  <td>{matchedCount(i.inquiry_id) > 0 ? <span className="text-brand-600 font-medium">{matchedCount(i.inquiry_id)}</span> : <span className="text-gray-300">—</span>}</td>
                  <td className="text-gray-400 text-xs">{i.created_at?.slice(0, 10) || 'N/A'}</td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={10} className="text-center text-gray-400 py-8">暂无数据</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <AgentSuggestionCard agentName="Sales Agent" agentType="Sales"
          conclusion={`当前共 ${inquiries.length} 条询价，其中 ${inquiries.filter(i => i.status === 'New').length} 条待处理。建议优先处理 High/Urgent 优先级的 New 询价。`}
          evidence={inquiries.filter(i => i.status === 'New' && ['Urgent','High'].includes(i.priority)).slice(0, 3).map(i => `${i.inquiry_id}: ${i.mpn} × ${i.quantity} @ $${i.target_price}`)}
          sourceId="SRC-INQ-001" generatedAt={generatedAt} confidenceScore={88}
          suggestedActions={[{ label: '查看所有 New 询价', risk: 'low' }]}
          requiresApproval={false} />
      </div>
    </WorkspaceLayout>
  );
}
