'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function CeoDashboardPage() {
  return (
    <WorkspaceLayout title="CEO 经营驾驶舱">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="proto-card p-4"><div className="text-xs text-gray-400 uppercase">今日营收</div><div className="text-2xl font-bold">$1.2M</div><div className="text-xs text-green-600">↑ 8%</div></div>
          <div className="proto-card p-4"><div className="text-xs text-gray-400 uppercase">活跃RFQ</div><div className="text-2xl font-bold">47</div></div>
          <div className="proto-card p-4"><div className="text-xs text-gray-400 uppercase">AR风险</div><div className="text-2xl font-bold text-red-600">$1.02M</div></div>
          <div className="proto-card p-4"><div className="text-xs text-gray-400 uppercase">OIQ指数</div><div className="text-2xl font-bold text-brand-600">78</div></div>
        </div>
        <div className="proto-card p-5"><h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">机会地图</h3><div className="h-40 flex items-center justify-center text-gray-300 text-sm">📊 图表区域 — Phase 2 对接 ECharts</div></div>
        <div className="proto-card p-5"><h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Agent 工作概览</h3><div className="grid grid-cols-3 gap-3 text-sm"><div>Sales Agent: <span className="text-green-600 font-medium">12 任务</span></div><div>Procurement Agent: <span className="text-purple-600 font-medium">8 任务</span></div><div>Credit Agent: <span className="text-amber-600 font-medium">3 预警</span></div></div></div>
      </div>
    </WorkspaceLayout>
  );
}
