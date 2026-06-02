'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { FileSearch, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const inquiries = [
  { id: 'INQ-001', customer: '华为', mpn: 'STM32F407VET6', qty: 5000, status: 'New', priority: 'High', time: '10:30' },
  { id: 'INQ-002', customer: '比亚迪', mpn: 'TMS320F28335PGFA', qty: 2000, status: 'Matched', priority: 'Urgent', time: '09:15' },
  { id: 'INQ-003', customer: 'Flex Ltd.', mpn: 'EP4CE22F17C8N', qty: 1000, status: 'Quoting', priority: 'Medium', time: '昨天' },
  { id: 'INQ-004', customer: '大疆', mpn: 'STM32H743ZIT6', qty: 800, status: 'New', priority: 'Medium', time: '昨天' },
  { id: 'INQ-005', customer: '海康威视', mpn: 'W25Q128JVSIM', qty: 10000, status: 'Won', priority: 'Medium', time: '2天前' },
];

const icons: Record<string, React.ReactNode> = {
  New: <FileSearch size={13} className="text-brand" />, Matched: <TrendingUp size={13} className="text-success" />,
  Quoting: <Clock size={13} className="text-warning" />, Won: <CheckCircle size={13} className="text-success" />,
};

export default function InquiryCenterPage() {
  return (
    <WorkspaceLayout title="Inquiry Center" commandBarPlaceholder="输入 RFQ 或上传询价文件..."
      agentStatuses={[{ label: 'Sales Agent 在线', color: 'badge badge-green' }]}
      rightPanel={<>
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-3">客户智能卡</h3>
        <SourceCard source="比亚迪采购部" sourceType="Email" sourceOwner="李经理" eventTime="2026-06-02 09:15" capturedAt="2026-06-02 09:17" verifiedBy="Tony Li" confidenceScore={92} status="verified" />
      </>}
    >
      <div className="card-gradient overflow-hidden mb-6">
        <table className="table-minimal">
          <thead><tr><th>ID</th><th>客户</th><th>型号</th><th>数量</th><th>状态</th><th>优先级</th><th>时间</th></tr></thead>
          <tbody>
            {inquiries.map(inq => (
              <tr key={inq.id} className="cursor-pointer">
                <td className="font-mono text-xs">{inq.id}</td>
                <td className="font-medium">{inq.customer}</td>
                <td className="font-mono text-xs">{inq.mpn}</td>
                <td>{inq.qty.toLocaleString()}</td>
                <td><span className="flex items-center gap-1 text-xs">{icons[inq.status]}{inq.status}</span></td>
                <td><span className={`badge ${inq.priority === 'Urgent' ? 'badge-red' : inq.priority === 'High' ? 'badge-yellow' : 'badge-blue'}`}>{inq.priority}</span></td>
                <td className="text-text-tertiary">{inq.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AgentSuggestionCard agentName="Sales Agent" agentType="Sales"
        conclusion="比亚迪 TMS320F28335PGFA 已匹配3个供应资源，建议优先联系 Avnet。"
        evidence={['Avnet: $8.50 库存3000 交期2周', 'Arrow: $8.10 库存5000 交期4周']}
        sourceId="SRC-002" generatedAt="2026-06-02 10:45" confidenceScore={85}
        suggestedActions={[{ label: '选择 Avnet 报价', risk: 'low' }, { label: '选择 Arrow 报价', risk: 'low' }]}
        requiresApproval={true} />
    </WorkspaceLayout>
  );
}
