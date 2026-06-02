'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function OrdersPage() {
  return (
    <WorkspaceLayout title="订单中心">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <button className="px-3 py-1.5 text-xs rounded-md bg-brand-500 text-white font-medium">全部</button>
          <button className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">待发货</button>
          <button className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">已完成</button>
        </div>
        <div className="proto-card overflow-hidden">
          <table className="proto-table">
            <thead><tr><th>订单ID</th><th>客户</th><th>型号</th><th>金额</th><th>状态</th><th>回款风险</th><th>日期</th></tr></thead>
            <tbody>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">SO-0892</td><td className="font-medium">华为</td><td className="font-mono text-xs">STM32F407VET6</td><td>$21,750</td><td><span className="tag tag-green">已发货</span></td><td><span className="tag tag-green">L1</span></td><td className="text-gray-400">05-28</td></tr>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">SO-0887</td><td className="font-medium">比亚迪</td><td className="font-mono text-xs">TMS320F28335</td><td>$17,000</td><td><span className="tag tag-yellow">待发货</span></td><td><span className="tag tag-yellow">L2</span></td><td className="text-gray-400">05-25</td></tr>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">SO-0875</td><td className="font-medium">Flex Ltd.</td><td className="font-mono text-xs">EP4CE22F17C8N</td><td>$33,000</td><td><span className="tag tag-purple">待付款</span></td><td><span className="tag tag-yellow">L2</span></td><td className="text-gray-400">05-20</td></tr>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">SO-0860</td><td className="font-medium">大疆</td><td className="font-mono text-xs">STM32H743ZIT6</td><td>$9,600</td><td><span className="tag tag-green">已完成</span></td><td><span className="tag tag-green">L1</span></td><td className="text-gray-400">05-15</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
