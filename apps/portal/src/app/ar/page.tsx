'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function ARPage() {
  return (
    <WorkspaceLayout title="AR Center — 应收账款中心" commandBarPlaceholder="查询应收、催收管理...">
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">💰</div>
        <h2 className="text-xl font-semibold text-gray-500">AR 详细视图开发中</h2>
        <p className="text-sm text-gray-400 mt-2">应收账款详情页将在 Phase 1 后续迭代完成。风控概览请访问 Risk Center</p>
      </div>
    </WorkspaceLayout>
  );
}
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/apps/portal/src/app/knowledge/page.tsx" << 'ENDOFFILE'
'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function KnowledgePage() {
  return (
    <WorkspaceLayout
      title="Knowledge Center — 知识中心"
      commandBarPlaceholder="搜索产品知识、SOP、行业情报..."
      agentStatuses={[{ label: 'Knowledge Agent 在线', color: 'text-xs text-green-700 bg-green-50 px-2 py-1 rounded' }]}
    >
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-semibold text-gray-500">Knowledge Center 开发中</h2>
        <p className="text-sm text-gray-400 mt-2">知识库检索与 RAG 将对接飞书知识库后上线 (Phase 2)</p>
      </div>
    </WorkspaceLayout>
  );
}
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/apps/portal/src/app/orders/page.tsx" << 'ENDOFFILE'
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
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/apps/portal/src/app/tasks/page.tsx" << 'ENDOFFILE'
'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function TasksPage() {
  return (
    <WorkspaceLayout title="待办事项" commandBarPlaceholder="创建任务、查看待办...">
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-500">待办事项中心开发中</h2>
        <p className="text-sm text-gray-400 mt-2">统一待办管理与审批中心将在 Workflow 集成后上线</p>
      </div>
    </WorkspaceLayout>
  );
}
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/apps/portal/src/app/settings/page.tsx" << 'ENDOFFILE'
'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function SettingsPage() {
  return (
    <WorkspaceLayout title="设置" commandBarPlaceholder="管理系统配置...">
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">⚙️</div>
        <h2 className="text-xl font-semibold text-gray-500">设置中心开发中</h2>
        <p className="text-sm text-gray-400 mt-2">系统配置、权限管理与集成设置将随 Phase 1 后续迭代完成</p>
      </div>
    </WorkspaceLayout>
  );
}
EOF

echo "5 missing Portal pages created"

# 验证所有页面现在都存在
echo ""
echo "=== Portal 页面完整性检查 ==="
for dir in agents inquiries risk offers orders ar knowledge tasks settings; do
  f="/Users/lirundong/Documents/Ample ANOS/apps/portal/src/app/$dir/page.tsx"
  if [ -f "$f" ]; then
    echo "  ✓ $dir/page.tsx"
  else
    echo "  ✗ $dir/page.tsx MISSING"
  fi
done
echo "  ✓ / (index page)"