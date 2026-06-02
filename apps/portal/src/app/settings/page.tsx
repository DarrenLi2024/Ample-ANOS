'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function SettingsPage() {
  return (
    <WorkspaceLayout
      title="设置"
      commandBarPlaceholder="管理系统配置..."
    >
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">⚙️</div>
        <h2 className="text-xl font-semibold text-gray-500">设置 开发中</h2>
        <p className="text-sm text-gray-400 mt-2">系统配置、权限管理与集成设置将在 Phase 1 后续迭代完成</p>
      </div>
    </WorkspaceLayout>
  );
}
