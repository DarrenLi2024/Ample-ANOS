'use client';
import { WorkspaceLayout } from '@/components/WorkspaceLayout';

export default function SettingsPage() {
  return (
    <WorkspaceLayout title="设置">
      <div className="p-6 space-y-6 max-w-2xl">
        <div className="proto-card p-5"><h2 className="text-base font-semibold mb-4">系统配置</h2>
          <div className="space-y-4">
            <div><label className="text-xs text-gray-400 uppercase block mb-1">API 地址</label><input className="proto-input" defaultValue="http://localhost:3001" readOnly /></div>
            <div><label className="text-xs text-gray-400 uppercase block mb-1">数据库路径</label><input className="proto-input" defaultValue="data/anos.db" readOnly /></div>
            <div className="flex items-center justify-between py-2"><span className="text-sm">飞书集成</span><span className="tag tag-green">已连接</span></div>
            <div className="flex items-center justify-between py-2"><span className="text-sm">JWT 认证</span><span className="tag tag-blue">开发模式</span></div>
          </div>
        </div>
        <div className="proto-card p-5"><h2 className="text-base font-semibold mb-4">关于</h2>
          <div className="text-sm text-gray-500 space-y-1"><div>ANOS V0.3.0</div><div>Ample AI Native OS</div><div>安芯易集团 · Trading Intelligence OS</div></div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
