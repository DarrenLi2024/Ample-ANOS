'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function TasksPage() {
  return (
    <WorkspaceLayout
      title="待办事项"
      commandBarPlaceholder="创建任务、查看待办..."
    >
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-500">待办事项 开发中</h2>
        <p className="text-sm text-gray-400 mt-2">统一待办管理与审批中心将在 Workflow 集成后上线</p>
      </div>
    </WorkspaceLayout>
  );
}
