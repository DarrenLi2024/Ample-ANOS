'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function TasksPage() {
  return (
    <WorkspaceLayout title="待办事项">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <button className="px-3 py-1.5 text-xs rounded-md bg-brand-500 text-white font-medium">全部</button>
          <button className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">待处理</button>
          <button className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">已完成</button>
        </div>
        <div className="proto-card overflow-hidden">
          <table className="proto-table">
            <thead><tr><th>任务</th><th>关联对象</th><th>优先级</th><th>状态</th><th>截止</th></tr></thead>
            <tbody>
              <tr className="cursor-pointer"><td className="font-medium">审核报价 OFF-003</td><td className="text-xs text-brand-600">华为 · STM32F407</td><td><span className="tag tag-yellow">High</span></td><td><span className="tag tag-blue">待处理</span></td><td className="text-gray-400">今天</td></tr>
              <tr className="cursor-pointer"><td className="font-medium">催收 AR-001 汇顶科技</td><td className="text-xs text-red-600">逾期95天 · $380K</td><td><span className="tag tag-red">Urgent</span></td><td><span className="tag tag-yellow">处理中</span></td><td className="text-gray-400">今天</td></tr>
              <tr className="cursor-pointer"><td className="font-medium">确认供应资源 SR-012</td><td className="text-xs text-brand-600">Arrow · ESP32</td><td><span className="tag tag-blue">Medium</span></td><td><span className="tag tag-blue">待处理</span></td><td className="text-gray-400">明天</td></tr>
              <tr className="cursor-pointer"><td className="font-medium">审核报价 OFF-005</td><td className="text-xs text-brand-600">比亚迪 · TMS320</td><td><span className="tag tag-green">Low</span></td><td><span className="tag tag-green">已完成</span></td><td className="text-gray-400">昨天</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
