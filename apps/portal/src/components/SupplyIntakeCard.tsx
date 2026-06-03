'use client';
import { Upload } from 'lucide-react';

export function SupplyIntakeCard() {
  return (
    <div className="proto-card-accent p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Supply Intake Center</h2>
      <p className="text-xs text-gray-400 mb-4">上传供应商报价单、库存表或群聊截图，AI 自动解析为供应资源</p>

      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-300 hover:bg-brand-50/50 cursor-pointer transition-all">
        <Upload size={28} className="mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-gray-500 font-medium">拖拽报价单到此处</p>
        <p className="text-xs text-gray-400 mt-1">或点击上传 Excel · PDF · 图片 · 邮件</p>
      </div>

      <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">支持:</span>
        <span className="tag tag-blue text-xs">Excel</span>
        <span className="tag tag-green text-xs">PDF</span>
        <span className="tag tag-purple text-xs">邮件</span>
        <span className="tag tag-yellow text-xs">截图</span>
      </div>
    </div>
  );
}
