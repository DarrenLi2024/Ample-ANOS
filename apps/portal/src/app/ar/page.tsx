'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function ArPage() {
  return (
    <WorkspaceLayout title="AR Center — 应收账款">
      <div className="flex items-center justify-center flex-1 h-full">
        <div className="text-center p-12">
          <div className="text-5xl mb-5 opacity-30">💰</div>
          <h2 className="text-xl font-semibold text-gray-400">AR Center — 应收账款</h2>
          <p className="text-[14px] text-gray-400 mt-2 max-w-md">应收账款详情、账龄分析、回款预测。该功能将在 Phase 1 后续迭代中上线。</p>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
