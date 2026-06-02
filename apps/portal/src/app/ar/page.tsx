'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function ArPage() {
  return (
    <WorkspaceLayout
      title="AR Center — 应收账款中心"
      commandBarPlaceholder="查询应收、催收管理..."
    >
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">💰</div>
        <h2 className="text-xl font-semibold text-gray-500">AR Center — 应收账款中心 开发中</h2>
        <p className="text-sm text-gray-400 mt-2">应收账款详情页将在 Phase 1 后续迭代完成</p>
      </div>
    </WorkspaceLayout>
  );
}
