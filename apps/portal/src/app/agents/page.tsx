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
          if (!s) return null;
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
