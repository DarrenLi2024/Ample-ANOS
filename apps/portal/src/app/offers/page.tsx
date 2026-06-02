'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';
import { SourceCard } from '@/components/SourceCard';

export default function OffersPage() {
  return (
    <WorkspaceLayout
      title="Offer Center — 报价中心"
      commandBarPlaceholder="查询报价、生成报价草案..."
      agentStatuses={[{ label: 'Sales Agent 在线', color: 'text-xs text-green-700 bg-green-50 px-2 py-1 rounded' }]}
      rightPanel={
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">报价概览</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 border rounded"><span>待审批</span><span className="font-bold text-yellow-600">3</span></div>
            <div className="flex justify-between p-2 border rounded"><span>已发送</span><span className="font-bold text-blue-600">12</span></div>
            <div className="flex justify-between p-2 border rounded"><span>已接受</span><span className="font-bold text-green-600">8</span></div>
          </div>
        </div>
      }
    >
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-xl font-semibold text-gray-500">Offer Center 开发中</h2>
        <p className="text-sm text-gray-400 mt-2">报价管理功能将在 Phase 1 后续迭代中完成</p>
      </div>
    </WorkspaceLayout>
  );
}
EOF

# 2. Orders
cat > "/Users/lirundong/Documents/Ample ANOS/apps/portal/src/app/orders/page.tsx" << 'ENDOFFILE'
'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function OrdersPage() {
  return (
    <WorkspaceLayout title="SO Center — 订单中心" commandBarPlaceholder="查询订单、跟踪发货...">
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-xl font-semibold text-gray-500">SO Center 开发中</h2>
        <p className="text-sm text-gray-400 mt-2">订单管理与 ERP 同步功能将在 Phase 1 后续迭代中完成</p>
      </div>
    </WorkspaceLayout>
  );
}
EOF

# 3. AR
cat > "/Users/lirundong/Documents/Ample ANOS/apps/portal/src/app/ar/page.tsx" << 'ENDOFFILE'
'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function ARPage() {
  return (
    <WorkspaceLayout title="AR Center — 应收账款中心" commandBarPlaceholder="查询应收、催收管理...">
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">💰</div>
        <h2 className="text-xl font-semibold text-gray-500">AR 详细视图开发中</h2>
        <p className="text-sm text-gray-400 mt-2">应收账款详情页面将在 Phase 1 后续迭代中完成。风控概览请访问 Risk Center</p>
      </div>
    </WorkspaceLayout>
  );
}
EOF

# 4. Knowledge
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
        <p className="text-sm text-gray-400 mt-2">知识库检索与 RAG 功能将在 Phase 2 对接飞书知识库后上线</p>
      </div>
    </WorkspaceLayout>
  );
}
EOF

# 5. Tasks
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

# 6. Settings
cat > "/Users/lirundong/Documents/Ample ANOS/apps/portal/src/app/settings/page.tsx" << 'ENDOFFILE'
'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function SettingsPage() {
  return (
    <WorkspaceLayout title="设置" commandBarPlaceholder="管理系统配置...">
      <div className="bg-white rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">⚙️</div>
        <h2 className="text-xl font-semibold text-gray-500">设置中心开发中</h2>
        <p className="text-sm text-gray-400 mt-2">系统配置、权限管理与集成设置功能将在 Phase 1 后续迭代中完成</p>
      </div>
    </WorkspaceLayout>
  );
}
EOF

echo "All 6 placeholder pages created"