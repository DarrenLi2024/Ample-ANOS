'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function SettingsPage() {
  return (
    <WorkspaceLayout title="设置">
      <div className="flex items-center justify-center flex-1 h-full">
        <div className="text-center p-12">
          <div className="text-5xl mb-5 opacity-30">⚙️</div>
          <h2 className="text-xl font-semibold text-gray-400">设置</h2>
          <p className="text-[14px] text-gray-400 mt-2 max-w-md">系统配置、权限管理、集成设置。该功能将在 Phase 1 后续迭代中上线。</p>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
