'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { ListChecks } from 'lucide-react';

export default function TasksPage() {
  return (
    <WorkspaceLayout title="待办事项">
      <div className="flex items-center justify-center flex-1 h-full">
        <div className="text-center p-12">
          <ListChecks size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-400">待办事项</h2>
          <p className="text-lg text-gray-400 mt-2 max-w-md">该功能将在 Phase 1 后续迭代中上线。</p>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
