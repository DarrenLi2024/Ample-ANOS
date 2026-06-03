'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function ArPage() {
  return (
    <WorkspaceLayout title="AR 中心">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="proto-card p-4"><div className="text-xs text-gray-400 uppercase">总应收</div><div className="text-xl font-bold">$3.2M</div></div>
          <div className="proto-card p-4"><div className="text-xs text-gray-400 uppercase">已逾期</div><div className="text-xl font-bold text-red-600">$1.02M</div></div>
          <div className="proto-card p-4"><div className="text-xs text-gray-400 uppercase">回款率</div><div className="text-xl font-bold text-green-600">68%</div></div>
        </div>
        <div className="proto-card overflow-hidden">
          <table className="proto-table">
            <thead><tr><th>AR ID</th><th>客户</th><th>发票号</th><th>应收金额</th><th>已回款</th><th>逾期天数</th><th>风险等级</th></tr></thead>
            <tbody>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">AR-0001</td><td className="font-medium">Sales Tom</td><td>INV-0892</td><td>$380K</td><td className="text-red-600">$0</td><td className="text-red-600 font-medium">95天</td><td><span className="tag tag-red">L4</span></td></tr>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">AR-0002</td><td className="font-medium">Sales Lisa</td><td>INV-0877</td><td>$250K</td><td className="text-red-600">$0</td><td className="text-amber-600 font-medium">68天</td><td><span className="tag tag-yellow">L3</span></td></tr>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">AR-0003</td><td className="font-medium">Sales Mike</td><td>INV-0850</td><td>$180K</td><td className="text-green-600">$50K</td><td>45天</td><td><span className="tag tag-yellow">L2</span></td></tr>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">AR-0007</td><td className="font-medium">Sales Pilot</td><td>INV-0900</td><td>$2M</td><td className="text-green-600">$1.8M</td><td>0天</td><td><span className="tag tag-green">L1</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
