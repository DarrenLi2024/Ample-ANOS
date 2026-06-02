'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function LocalizationPage() {
  return (
    <WorkspaceLayout title="国产替代推荐">
      <div className="p-6 space-y-6">
        <div className="proto-card-accent p-5"><h2 className="text-base font-semibold mb-4">STM32F407VET6 国产替代方案</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded"><div><div className="font-semibold text-sm">GD32F407VET6</div><div className="text-xs text-gray-400">GigaDevice · 管脚兼容 · 性能95%</div></div><span className="tag tag-green">推荐</span></div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded"><div><div className="font-semibold text-sm">AT32F407VET7</div><div className="text-xs text-gray-400">Artery · 管脚兼容 · 性能90%</div></div><span className="tag tag-blue">可选</span></div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
