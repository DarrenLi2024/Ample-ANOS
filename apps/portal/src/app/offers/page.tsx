'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { FileText } from 'lucide-react';

export default function OffersPage() {
  return (
    <WorkspaceLayout title="报价中心">
      <div className="flex items-center justify-center flex-1 h-full">
        <div className="text-center p-12">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-400">报价中心</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-md">该功能将在 Phase 1 后续迭代中上线。</p>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
