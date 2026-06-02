'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function OrdersPage() {
  return (
    <WorkspaceLayout title="SO Center — 订单中心">
      <div className="flex items-center justify-center flex-1 h-full">
        <div className="text-center p-12">
          <div className="text-5xl mb-5 opacity-30">📦</div>
          <h2 className="text-xl font-semibold text-gray-400">SO Center — 订单中心</h2>
          <p className="text-[14px] text-gray-400 mt-2 max-w-md">订单管理、发货跟踪、ERP 同步。该功能将在 Phase 1 后续迭代中上线。</p>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
