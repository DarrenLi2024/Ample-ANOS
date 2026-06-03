'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function OrdersPage() {
  return (
    <WorkspaceLayout title="采购订单">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <button className="px-3 py-1.5 text-xs rounded-md bg-brand-500 text-white font-medium">全部</button>
          <button className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">待确认</button>
          <button className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">已下单</button>
        </div>
        <div className="proto-card overflow-hidden">
          <table className="proto-table">
            <thead><tr><th>PO ID</th><th>供应商</th><th>型号</th><th>数量</th><th>单价</th><th>金额</th><th>状态</th><th>日期</th></tr></thead>
            <tbody>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">PO-0103</td><td className="font-medium">Arrow Electronics</td><td className="font-mono text-xs">STM32F407VET6</td><td>5,000</td><td>$4.10</td><td>$20,500</td><td><span className="tag tag-green">已确认</span></td><td className="text-gray-400">06-02</td></tr>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">PO-0102</td><td className="font-medium">Avnet</td><td className="font-mono text-xs">TMS320F28335PGFA</td><td>2,000</td><td>$8.50</td><td>$17,000</td><td><span className="tag tag-yellow">待确认</span></td><td className="text-gray-400">06-01</td></tr>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">PO-0101</td><td className="font-medium">Mouser</td><td className="font-mono text-xs">ESP32-WROOM-32E</td><td>10,000</td><td>$1.70</td><td>$17,000</td><td><span className="tag tag-purple">待审批</span></td><td className="text-gray-400">05-30</td></tr>
              <tr className="cursor-pointer"><td className="font-mono text-xs text-brand-600">PO-0098</td><td className="font-medium">Digi-Key</td><td className="font-mono text-xs">W25Q128JVSIM</td><td>10,000</td><td>$0.55</td><td>$5,500</td><td><span className="tag tag-green">已完成</span></td><td className="text-gray-400">05-28</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
