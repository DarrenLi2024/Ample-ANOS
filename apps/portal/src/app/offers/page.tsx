'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function OffersPage() {
  return (
    <WorkspaceLayout
      title="Offer Center — 报价中心"
      commandBarPlaceholder="查询报价、创建报价草案..."      agentStatuses={[{ label: "Sales Agent 在线", color: "text-xs text-green-700 bg-green-50 px-2 py-1 rounded" }]}
    >
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-xl font-semibold text-gray-500">Offer Center — 报价中心 开发中</h2>
        <p className="text-sm text-gray-400 mt-2">报价管理功能将在 Phase 1 后续迭代中完成</p>
      </div>
    </WorkspaceLayout>
  );
}
