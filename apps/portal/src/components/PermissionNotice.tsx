'use client';
import { Lock } from 'lucide-react';

interface Props { reason: 'role' | 'field' | 'object' | 'action'; fieldName?: string; requiredLevel?: string; onRequestAccess?: () => void }

const config = {
  role: { title: '此区域仅限授权角色访问', icon: '🔐' },
  field: { title: '此字段已脱敏', icon: '👁' },
  object: { title: '此记录超出权限范围', icon: '📋' },
  action: { title: '此操作需要授权', icon: '🚫' },
};

export function PermissionNotice({ reason, fieldName, requiredLevel, onRequestAccess }: Props) {
  const c = config[reason];
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <Lock size={32} className="text-gray-300 mb-3" />
      <h3 className="text-sm font-semibold text-gray-500">{c.title}</h3>
      {fieldName && <p className="text-xs text-gray-400 mt-1">字段: {fieldName}</p>}
      {requiredLevel && <p className="text-xs text-gray-400">需要: {requiredLevel}</p>}
      {onRequestAccess && (
        <button onClick={onRequestAccess} className="mt-3 text-xs text-brand-600 hover:text-brand-700">申请权限</button>
      )}
    </div>
  );
}
