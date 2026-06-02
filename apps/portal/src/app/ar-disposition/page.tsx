'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function ArDispositionPage() {
  return (
    <WorkspaceLayout title="AR 风险处置">
      <div className="p-6 space-y-6">
        <div className="proto-card-accent p-5">
          <div className="flex items-center justify-between mb-4"><h2 className="text-base font-semibold">汇顶科技 · AR 详情</h2><span className="tag tag-red">L4 高风险</span></div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div><span className="text-xs text-gray-400">应收总额</span><div className="font-bold text-red-600">$380,000</div></div>
            <div><span className="text-xs text-gray-400">逾期天数</span><div className="font-bold text-red-600">95 天</div></div>
            <div><span className="text-xs text-gray-400">信用评分</span><div className="font-bold">B → C ↓</div></div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">账龄分布</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span>0-30天</span><span>$120,000</span></div>
              <div className="flex justify-between text-sm"><span>30-60天</span><span>$140,000</span></div>
              <div className="flex justify-between text-sm font-semibold text-red-600"><span>60-90+天</span><span>$120,000</span></div>
            </div>
          </div>
          <div className="flex gap-2"><button className="btn-primary bg-red-500 hover:bg-red-600">暂停发货</button><button className="btn-outline">发送催收函</button><button className="btn-outline">启动法务</button></div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
