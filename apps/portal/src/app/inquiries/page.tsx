'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';

const inquiries = [
  { id: 'INQ-2026-001', customer: '华为技术', mpn: 'STM32F407VET6', qty: 5000, targetPrice: '$4.50', status: 'New', priority: 'High', time: '10:30', score: 92 },
  { id: 'INQ-2026-002', customer: '比亚迪', mpn: 'TMS320F28335PGFA', qty: 2000, targetPrice: '$9.00', status: 'Matched', priority: 'Urgent', time: '09:15', score: 85 },
  { id: 'INQ-2026-003', customer: 'Flex Ltd.', mpn: 'EP4CE22F17C8N', qty: 1000, targetPrice: '$35.00', status: 'Quoting', priority: 'Medium', time: '昨天', score: 78 },
  { id: 'INQ-2026-004', customer: '大疆创新', mpn: 'STM32H743ZIT6', qty: 800, targetPrice: '$12.00', status: 'New', priority: 'Medium', time: '昨天', score: 0 },
  { id: 'INQ-2026-005', customer: '海康威视', mpn: 'W25Q128JVSIM', qty: 10000, targetPrice: '$0.60', status: 'Won', priority: 'High', time: '2天前', score: 95 },
];

export default function InquiryCenterPage() {
  return (
    <WorkspaceLayout title="询价中心"
      agentStatuses={[{ label: 'Sales Agent', color: 'tag tag-blue' }]}
      topBarChildren={
        <div className="flex items-center gap-2 ml-6">
          <button className="px-3 py-1.5 text-xs rounded-md bg-brand-500 text-white font-medium">全部</button>
          <button className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">New</button>
          <button className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">Matched</button>
          <button className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">Won</button>
        </div>
      }
      rightPanel={
        <div className="p-4 space-y-5">
          <SourceCard source="比亚迪采购部" sourceType="Email" sourceOwner="李经理"
            eventTime="2026-06-02 09:15" capturedAt="2026-06-02 09:17" verifiedBy="Tony Li" confidenceScore={92} status="verified" />
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <div className="proto-card overflow-hidden">
          <table className="proto-table">
            <thead><tr><th>Inquiry ID</th><th>客户</th><th>型号</th><th>数量</th><th>目标价</th><th>状态</th><th>优先级</th><th>匹配度</th><th>时间</th></tr></thead>
            <tbody>
              {inquiries.map(i => (
                <tr key={i.id} className="cursor-pointer">
                  <td className="font-mono text-[12px] text-brand-600">{i.id}</td>
                  <td className="font-medium">{i.customer}</td>
                  <td className="font-mono text-[12px]">{i.mpn}</td>
                  <td>{i.qty.toLocaleString()}</td>
                  <td>{i.targetPrice}</td>
                  <td><span className={`tag ${i.status==='New'?'tag-blue':i.status==='Matched'?'tag-purple':i.status==='Quoting'?'tag-yellow':'tag-green'}`}>{i.status}</span></td>
                  <td><span className={`tag ${i.priority==='Urgent'?'tag-red':i.priority==='High'?'tag-yellow':'tag-gray'}`}>{i.priority}</span></td>
                  <td>{i.score > 0 ? <span className="text-brand-600 font-medium">{i.score}%</span> : <span className="text-gray-300">—</span>}</td>
                  <td className="text-gray-400 text-[12px]">{i.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AgentSuggestionCard agentName="Sales Agent" agentType="Sales"
          conclusion="比亚迪 TMS320F28335PGFA 已匹配到 3 个供应资源。Avnet 交期最短(2周)、Arrow 价格最优($8.10)。建议优先联系 Avnet。"
          evidence={['Avnet: $8.50/pcs · 库存 3,000 · 交期 2 周', 'Arrow: $8.10/pcs · 库存 5,000 · 交期 4 周', 'Mouser: $9.20/pcs · 库存 1,000 · 交期 1 周']}
          sourceId="SRC-002" generatedAt="2026-06-02 10:45" confidenceScore={85}
          suggestedActions={[{ label: '选择 Avnet 报价', risk: 'low' }, { label: '选择 Arrow 报价 (更低价格)', risk: 'low' }]}
          requiresApproval={true} />
      </div>
    </WorkspaceLayout>
  );
}
