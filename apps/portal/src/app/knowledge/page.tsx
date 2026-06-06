'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { Search, BookOpen, Shield, FileText } from 'lucide-react';

function detectRole() { return (typeof window !== 'undefined' ? localStorage.getItem('anos_user_role') || 'Procurement' : 'Procurement'); }


const sources = [
  { icon: <Search size={18} />, title: '销售 SOP', desc: '客户开发、RFQ处理、报价审批、订单跟进', count: 12, color: 'tag-blue' },
  { icon: <BookOpen size={18} />, title: '采购 SOP', desc: '供应商开发、询价比价、采购执行', count: 8, color: 'tag-purple' },
  { icon: <Shield size={18} />, title: '风控/回款规则', desc: '信用评估、AR逾期、催收流程', count: 6, color: 'tag-red' },
  { icon: <FileText size={18} />, title: '产品知识库', desc: '品牌型号、封装、国产替代、Datasheet', count: 15, color: 'tag-green' },
];

export default function KnowledgePage() {
  return (
    <WorkspaceLayout title="知识中心"
      role={detectRole()} agentStatuses={[{ label: 'Knowledge Agent', color: 'tag tag-green' }]}>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {sources.map(s => (
            <div key={s.title} className="proto-card p-5 hover:border-brand-300 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-3"><span className={`tag ${s.color}`}>{s.icon}</span><div><div className="font-semibold text-sm">{s.title}</div><div className="text-xs text-gray-400">{s.count} 篇文档</div></div></div>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
