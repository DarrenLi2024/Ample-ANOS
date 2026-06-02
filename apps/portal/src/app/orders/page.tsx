'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function OrdersPage() {
  return (
    <WorkspaceLayout title="SO Center — 订单中心" commandBarPlaceholder="查询订单、跟踪发货...">
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-xl font-semibold text-gray-500">SO Center 开发中</h2>
        <p className="text-sm text-gray-400 mt-2">订单管理与 ERP 同步将在 Phase 1 后续迭代完成</p>
      </div>
    </WorkspaceLayout>
  );
}
