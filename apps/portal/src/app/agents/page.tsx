'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { BottomCommandBar } from '@/components/BottomCommandBar';
import { Bot, CheckCircle, Clock, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { clsx } from 'clsx';

const agents = [
  { id: 'AG-SALES', name: 'Sales Agent', type: 'Sales', department: '销售部', level: 'L3_Reasoning', status: 'Online', tasks: 12, completed: 347 },
  { id: 'AG-PROC', name: 'Procurement Agent', type: 'Procurement', department: '采购部', level: 'L2_Knowledge', status: 'Online', tasks: 8, completed: 215 },
  { id: 'AG-CREDIT', name: 'Credit Agent', type: 'Credit', department: '财务部', level: 'L3_Reasoning', status: 'WaitingApproval', tasks: 3, completed: 128 },
  { id: 'AG-KNOWLEDGE', name: 'Knowledge Agent', type: 'Knowledge', department: '知识管理', level: 'L2_Knowledge', status: 'Online', tasks: 5, completed: 89 },
  { id: 'AG-CEO', name: 'CEO Agent', type: 'CEO', department: '管理层', level: 'L2_Knowledge', status: 'Offline', tasks: 0, completed: 42 },
];

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  Online: { icon: <CheckCircle size={14} />, label: '在线', color: 'text-green-600 bg-green-50' },
  Busy: { icon: <Activity size={14} />, label: '忙碌', color: 'text-blue-600 bg-blue-50' },
  WaitingApproval: { icon: <Clock size={14} />, label: '等待确认', color: 'text-yellow-600 bg-yellow-50' },
  Error: { icon: <AlertTriangle size={14} />, label: '异常', color: 'text-red-600 bg-red-50' },
  Offline: { icon: <XCircle size={14} />, label: '离线', color: 'text-gray-500 bg-gray-100' },
};

export default function AgentCenterPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center h-12 px-6 bg-white border-b border-gray-200 shrink-0">
          <h1 className="text-lg font-semibold text-gray-900">Agent Center — 智能体中心</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
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
                    <span className={clsx('text-xs px-2 py-1 rounded flex items-center gap-1', s.color)}>
                      {s.icon} {s.label}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="block text-gray-400">当前任务</span>
                      <span className="font-semibold text-gray-900">{agent.tasks}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400">累计完成</span>
                      <span className="font-semibold text-gray-900">{agent.completed}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
        <BottomCommandBar placeholder="管理 Agent、查看任务..." />
      </div>
    </div>
  );
}
EOF

# Create placeholder pages
for page in offers orders ar knowledge tasks settings; do
  PageName=$(echo "$page" | sed 's/./\U&/')
  cat > "/Users/lirundong/Documents/Ample ANOS/apps/portal/src/app/$page/page.tsx" << EOF
'use client';
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { BottomCommandBar } from '@/components/BottomCommandBar';

export default function ${PageName}Page() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center h-12 px-6 bg-white border-b border-gray-200 shrink-0">
          <h1 className="text-lg font-semibold text-gray-900">$page</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-semibold text-gray-500">$page 页面开发中</h2>
            <p className="text-sm text-gray-400 mt-2">Phase 1 优先完成后端服务和核心工作台</p>
          </div>
        </main>
        <BottomCommandBar />
      </div>
    </div>
  );
}
EOF
done

echo "Agent Center + placeholder pages created"