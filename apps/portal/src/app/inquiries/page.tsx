'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { SourceCard } from '@/components/SourceCard';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { FileSearch, TrendingUp, Clock, CheckCircle } from 'lucide-react';

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
};

export default function InquiryCenterPage() {
  return (
    <WorkspaceLayout
      title="Inquiry Center — 询价中心"
      commandBarPlaceholder="输入 RFQ 或上传询价文件..."
      agentStatuses={[{ label: 'Sales Agent 在线', color: 'text-xs text-green-700 bg-green-50 px-2 py-1 rounded' }]}
      rightPanel={
        <>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">客户智能卡</h3>
          <SourceCard
            source="比亚迪采购部" sourceType="Email" sourceOwner="李经理"
            eventTime="2026-06-02 09:15" capturedAt="2026-06-02 09:17"
            verifiedBy="Tony Li" confidenceScore={92} status="verified"
          />
        </>
      }
    >
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3">ID</th><th className="px-4 py-3">客户</th><th className="px-4 py-3">型号</th>
              <th className="px-4 py-3">数量</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">优先级</th><th className="px-4 py-3">时间</th>
            </tr>
          </thead>
          <tbody>
            {mockInquiries.map((inq) => (
              <tr key={inq.id} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 font-mono text-xs">{inq.id}</td>
                <td className="px-4 py-3 font-medium">{inq.customer}</td>
                <td className="px-4 py-3 font-mono text-xs">{inq.mpn}</td>
                <td className="px-4 py-3">{inq.qty.toLocaleString()}</td>
                <td className="px-4 py-3"><span className="flex items-center gap-1 text-xs">{statusIcons[inq.status]}{inq.status}</span></td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${inq.priority === 'Urgent' ? 'bg-red-100 text-red-700' : inq.priority === 'High' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{inq.priority}</span>
                </td>
                <td className="px-4 py-3 text-gray-400">{inq.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AgentSuggestionCard
        agentName="Sales Agent" agentType="Sales"
        conclusion="比亚迪 TMS320F28335PGFA 已匹配3个供应资源，建议优先联系 Avnet（交期最短）。"
        evidence={['Avnet: $8.50 库存3000 交期2周', 'Arrow: $8.10 库存5000 交期4周', 'Mouser: $9.20 库存1000 交期1周']}
        sourceId="SRC-002" generatedAt="2026-06-02 10:45"
        confidenceScore={85}
        suggestedActions={[{ label: '选择 Avnet 报价', risk: 'low' }, { label: '选择 Arrow 报价（更低价）', risk: 'low' }]}
        requiresApproval={true}
      />
    </WorkspaceLayout>
  );
}
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/apps/portal/src/app/risk/page.tsx" << 'ENDOFFILE'
'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { AgentSuggestionCard } from '@/components/AgentSuggestionCard';
import { KpiCard } from '@/components/KpiCard';
import { DollarSign, AlertTriangle, Clock, TrendingDown } from 'lucide-react';

const arRisks = [
  { customer: '汇顶科技', outstanding: 380000, overdueDays: 95, risk: 'L4_High', action: '停单+法务催收' },
  { customer: '海康威视', outstanding: 250000, overdueDays: 68, risk: 'L3_Warning', action: '催收函+暂停新单' },
  { customer: 'Jabil Inc.', outstanding: 180000, overdueDays: 45, risk: 'L2_Watch', action: '电话催收' },
  { customer: 'Flex Ltd.', outstanding: 120000, overdueDays: 32, risk: 'L2_Watch', action: '邮件提醒' },
  { customer: '大疆', outstanding: 90000, overdueDays: 22, risk: 'L1_Low', action: '关注' },
];

const riskColors: Record<string, string> = {
  L4_High: 'bg-red-100 text-red-700', L3_Warning: 'bg-orange-100 text-orange-700',
  L2_Watch: 'bg-yellow-100 text-yellow-700', L1_Low: 'bg-green-100 text-green-700',
};

export default function RiskCenterPage() {
  return (
    <WorkspaceLayout
      title="AR Risk Center — 风控中心"
      commandBarPlaceholder="查询客户风险、生成催收建议..."
      agentStatuses={[{ label: 'Credit Agent 等待确认', color: 'text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded' }]}
      rightPanel={
        <>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">风险雷达</h3>
          <div className="space-y-2">
            {arRisks.slice(0, 3).map((r, i) => (
              <div key={i} className="p-3 border border-gray-100 rounded">
                <div className="flex justify-between mb-1"><span className="font-medium text-sm">{r.customer}</span><span className={`text-xs px-1.5 py-0.5 rounded ${riskColors[r.risk]}`}>{r.risk}</span></div>
                <div className="text-xs text-gray-500">${r.outstanding.toLocaleString()} · {r.overdueDays}天</div>
              </div>
            ))}
          </div>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard label="总应收" value="$2.1M" change="+5% vs 上月" trend="up" icon={<DollarSign size={16} />} />
        <KpiCard label="逾期总额" value="$1.02M" change="+12% vs 上月" trend="up" icon={<AlertTriangle size={16} />} />
        <KpiCard label="平均逾期天数" value="52" change="+8天 vs 上月" trend="up" icon={<Clock size={16} />} />
        <KpiCard label="预计坏账" value="$85K" change="-3% vs 上月" trend="down" icon={<TrendingDown size={16} />} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3">客户</th><th className="px-4 py-3">未回款</th><th className="px-4 py-3">逾期天数</th>
              <th className="px-4 py-3">风险等级</th><th className="px-4 py-3">建议动作</th>
            </tr>
          </thead>
          <tbody>
            {arRisks.map((r, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 font-medium">{r.customer}</td>
                <td className="px-4 py-3">${r.outstanding.toLocaleString()}</td>
                <td className="px-4 py-3">{r.overdueDays}天</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded font-medium ${riskColors[r.risk]}`}>{r.risk}</span></td>
                <td className="px-4 py-3 text-gray-600">{r.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AgentSuggestionCard
        agentName="Credit Agent" agentType="Credit"
        conclusion="汇顶科技已逾期95天，信用评分降至C级。建议立即暂停发货并启动法务催收程序。"
        evidence={['逾期金额 $380,000', '最近一次回款: 95天前', '信用评分: B→C 持续下降']}
        sourceId="AR-RISK-001" generatedAt="2026-06-02 11:00"
        confidenceScore={91}
        suggestedActions={[{ label: '暂停发货', risk: 'high' }, { label: '发送法务催收函', risk: 'medium' }]}
        requiresApproval={true}
      />
    </WorkspaceLayout>
  );
}
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/apps/portal/src/app/agents/page.tsx" << 'ENDOFFILE'
'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { Bot, CheckCircle, Clock, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { clsx } from 'clsx';

const agents = [
  { id: 'AG-SALES', name: 'Sales Agent', type: 'Sales', level: 'L3_Reasoning', status: 'Online', tasks: 12, completed: 347 },
  { id: 'AG-PROC', name: 'Procurement Agent', type: 'Procurement', level: 'L2_Knowledge', status: 'Online', tasks: 8, completed: 215 },
  { id: 'AG-CREDIT', name: 'Credit Agent', type: 'Credit', level: 'L3_Reasoning', status: 'WaitingApproval', tasks: 3, completed: 128 },
  { id: 'AG-KNOWLEDGE', name: 'Knowledge Agent', type: 'Knowledge', level: 'L2_Knowledge', status: 'Online', tasks: 5, completed: 89 },
  { id: 'AG-CEO', name: 'CEO Agent', type: 'CEO', level: 'L2_Knowledge', status: 'Offline', tasks: 0, completed: 42 },
];

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  Online: { icon: <CheckCircle size={14} />, label: '在线', color: 'text-green-600 bg-green-50' },
  Busy: { icon: <Activity size={14} />, label: '忙碌', color: 'text-blue-600 bg-blue-50' },
  WaitingApproval: { icon: <Clock size={14} />, label: '等待确认', color: 'text-yellow-600 bg-yellow-50' },
  Error: { icon: <AlertTriangle size={14} />, label: '异常', color: 'text-red-600 bg-red-50' },
  Offline: { icon: <XCircle size={14} />, label: '离线', color: 'text-gray-500 bg-gray-100' },
};

export default function AgentCenterPage() {
  return (
    <WorkspaceLayout title="Agent Center — 智能体中心" commandBarPlaceholder="管理 Agent、查看任务...">
      <div className="grid grid-cols-3 gap-4">
        {agents.map((agent) => {
          const s = statusConfig[agent.status];
          return (
            <div key={agent.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Bot size={28} className="text-primary-500" />
                  <div>
                    <div className="font-semibold text-sm">{agent.name}</div>
                    <div className="text-xs text-gray-400">{agent.type} · {agent.level}</div>
                  </div>
                </div>
                <span className={clsx('text-xs px-2 py-1 rounded flex items-center gap-1', s.color)}>{s.icon} {s.label}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div><span className="block text-gray-400">当前任务</span><span className="font-semibold text-gray-900">{agent.tasks}</span></div>
                <div><span className="block text-gray-400">累计完成</span><span className="font-semibold text-gray-900">{agent.completed}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </WorkspaceLayout>
  );
}
EOF

echo "All pages rewritten with WorkspaceLayout"