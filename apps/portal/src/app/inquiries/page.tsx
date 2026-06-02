'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { BottomCommandBar } from '@/components/BottomCommandBar';
import { FileSearch, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function InquiryCenterPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const mockInquiries = [
    { id: 'INQ-001', customer: '华为', mpn: 'STM32F407VET6', qty: 5000, status: 'New', priority: 'High', time: '10:30' },
    { id: 'INQ-002', customer: '比亚迪', mpn: 'TMS320F28335PGFA', qty: 2000, status: 'Matched', priority: 'Urgent', time: '09:15' },
    { id: 'INQ-003', customer: 'Flex Ltd.', mpn: 'EP4CE22F17C8N', qty: 1000, status: 'Quoting', priority: 'Medium', time: '昨天' },
    { id: 'INQ-004', customer: '大疆', mpn: 'STM32H743ZIT6', qty: 800, status: 'New', priority: 'Medium', time: '昨天' },
    { id: 'INQ-005', customer: '海康威视', mpn: 'W25Q128JVSIM', qty: 10000, status: 'Won', priority: 'Medium', time: '2天前' },
  ];

  const statusIcons: Record<string, React.ReactNode> = {
    New: <FileSearch size={14} className="text-blue-500" />,
    Matched: <TrendingUp size={14} className="text-green-500" />,
    Quoting: <Clock size={14} className="text-yellow-500" />,
    Won: <CheckCircle size={14} className="text-green-600" />,
    Lost: <XCircle size={14} className="text-red-500" />,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center h-12 px-6 bg-white border-b border-gray-200 shrink-0">
          <h1 className="text-lg font-semibold text-gray-900">Inquiry Center — 询价中心</h1>
        </header>
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">客户</th>
                    <th className="px-4 py-3">型号</th>
                    <th className="px-4 py-3">数量</th>
                    <th className="px-4 py-3">状态</th>
                    <th className="px-4 py-3">优先级</th>
                    <th className="px-4 py-3">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInquiries.map((inq) => (
                    <tr key={inq.id} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3 font-mono text-xs">{inq.id}</td>
                      <td className="px-4 py-3 font-medium">{inq.customer}</td>
                      <td className="px-4 py-3 font-mono text-xs">{inq.mpn}</td>
                      <td className="px-4 py-3">{inq.qty.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs">
                          {statusIcons[inq.status]}
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${inq.priority === 'Urgent' ? 'bg-red-100 text-red-700' : inq.priority === 'High' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                          {inq.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{inq.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <AgentSuggestionCard
                agentName="Sales Agent"
                agentType="Sales"
                conclusion="比亚迪 TMS320F28335PGFA 询价已匹配到3个供应资源，建议优先联系 Avnet（交期最短）和 Arrow（价格最优）。"
                evidence={['Avnet: $8.50/pcs 库存3000 交期2周', 'Arrow: $8.10/pcs 库存5000 交期4周', 'Mouser: $9.20/pcs 库存1000 交期1周']}
                generatedAt="2026-06-02 10:45"
                confidenceScore={85}
                suggestedActions={[
                  { label: '选择 Avnet 报价', risk: 'low' },
                  { label: '选择 Arrow 报价（更低价）', risk: 'low' },
                ]}
                requiresApproval={true}
              />
            </div>
          </main>
          <aside className="w-[420px] border-l border-gray-200 bg-white overflow-y-auto p-4 shrink-0">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">客户智能卡</h3>
            <SourceCard
              source="比亚迪采购部"
              sourceType="Email"
              sourceOwner="李经理"
              eventTime="2026-06-02 09:15"
              capturedAt="2026-06-02 09:17"
              verifiedBy="Tony Li"
              confidenceScore={92}
              status="verified"
            />
          </aside>
        </div>
        <BottomCommandBar placeholder="输入 RFQ 或上传询价文件..." />
      </div>
    </div>
  );
}
EOF

echo "Inquiry Center page created"