'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function KnowledgePage() {
  return (
    <WorkspaceLayout title="Knowledge Center — 知识中心" commandBarPlaceholder="搜索知识...">
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-semibold text-gray-500">Knowledge Center 开发中</h2>
        <p className="text-sm text-gray-400 mt-2">对接飞书知识库后上线 (Phase 2)</p>
      </div>
    </WorkspaceLayout>
  );
}
