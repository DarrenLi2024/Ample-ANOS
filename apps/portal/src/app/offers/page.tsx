'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';

const resources = [
  { id: 'SR-001', supplier: 'Arrow Electronics', mpn: 'STM32F407VET6', stock: 8000, price: '$4.20', leadTime: '2周', score: 92, status: 'Verified' },
  { id: 'SR-002', supplier: 'Avnet', mpn: 'TMS320F28335PGFA', stock: 3000, price: '$8.50', leadTime: '2周', score: 88, status: 'Matched' },
  { id: 'SR-003', supplier: 'Mouser', mpn: 'STM32F407VET6', stock: 5000, price: '$4.10', leadTime: '1周', score: 95, status: 'Verified' },
  { id: 'SR-004', supplier: 'Digi-Key', mpn: 'ESP32-WROOM-32E', stock: 15000, price: '$1.70', leadTime: '1周', score: 90, status: 'New' },
  { id: 'SR-005', supplier: '华强电子', mpn: 'W25Q128JVSIM', stock: 20000, price: '$0.55', leadTime: '3天', score: 85, status: 'New' },
];

export default function OffersPage() {
  return (
    <WorkspaceLayout title="采购工作台"
      agentStatuses={[{ label: 'Procurement Agent', color: 'tag tag-purple' }]}
      rightPanel={
        <div className="p-4 space-y-5">
          <SourceCard source="Arrow Electronics" sourceType="Email" sourceOwner="采购部" eventTime="2026-06-02 08:00" capturedAt="2026-06-02 08:05" verifiedBy="Procurement Agent" confidenceScore={90} status="verified" />
          <div className="proto-card p-4"><h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">需求匹配</h3>
            <div className="space-y-2 text-sm"><div className="flex justify-between"><span>待匹配RFQ</span><span className="font-semibold text-brand-600">5 条</span></div><div className="flex justify-between"><span>可匹配资源</span><span className="font-semibold text-green-600">12 条</span></div></div>
          </div>
        </div>
      }>
      <div className="p-6 space-y-6">
        <div className="proto-card overflow-hidden">
          <table className="proto-table">
            <thead><tr><th>ID</th><th>供应商</th><th>型号</th><th>库存</th><th>价格</th><th>交期</th><th>评分</th><th>状态</th></tr></thead>
            <tbody>{resources.map(r => (
              <tr key={r.id} className="cursor-pointer"><td className="font-mono text-xs text-brand-600">{r.id}</td><td className="font-medium">{r.supplier}</td><td className="font-mono text-xs">{r.mpn}</td><td>{r.stock.toLocaleString()}</td><td>{r.price}</td><td>{r.leadTime}</td><td><span className="text-brand-600 font-medium">{r.score}%</span></td>
                <td><span className={`tag ${r.status==='Verified'?'tag-green':r.status==='Matched'?'tag-purple':'tag-blue'}`}>{r.status}</span></td></tr>
            ))}</tbody>
          </table>
        </div>
        <AgentSuggestionCard agentName="Procurement Agent" agentType="Procurement"
          conclusion="Arrow STM32F407VET6 报价 $4.20 库存 8,000，建议采购。Mouser 同型号 $4.10 交期更短但库存较少。推荐优先向 Mouser 下单 3,000pcs + Arrow 补 2,000pcs。"
          evidence={['Mouser: $4.10 5,000pcs 1周', 'Arrow: $4.20 8,000pcs 2周', '当前RFQ需求量: 5,000pcs']} sourceId="SRC-003" generatedAt="2026-06-02 11:00" confidenceScore={90}
          suggestedActions={[{label:'向 Mouser 采购 3,000pcs',risk:'low'},{label:'向 Arrow 采购 2,000pcs',risk:'low'}]} requiresApproval={true} />
      </div>
    </WorkspaceLayout>
  );
}
