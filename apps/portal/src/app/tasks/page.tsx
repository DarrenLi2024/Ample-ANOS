'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function TasksPage() {
  return (
    <WorkspaceLayout title="待办事项">
      <div className="flex items-center justify-center flex-1 h-full">
        <div className="text-center p-12">
          <div className="text-5xl mb-5 opacity-30">✅</div>
          <h2 className="text-xl font-semibold text-gray-400">待办事项</h2>
          <p className="text-[14px] text-gray-400 mt-2 max-w-md">统一待办管理、审批中心。该功能将在 Phase 1 后续迭代中上线。</p>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
