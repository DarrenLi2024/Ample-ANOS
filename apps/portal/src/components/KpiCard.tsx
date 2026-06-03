'use client';

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  colorClass?: string;
}

export function KpiCard({ label, value, change, trend = 'neutral', icon, colorClass = 'bg-blue-50 text-blue-600' }: KpiCardProps) {
  const tc = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400';
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '·';

  return (
    <div className="proto-card p-5 animate-in flex flex-col">
      {/* 上行：标签 + 圆形图标 */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-gray-400 font-medium uppercase tracking-wider leading-tight">{label}</span>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClass} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
      </div>

      {/* 下行：大数值 + 趋势 */}
      <div className="mt-auto">
        <div className="text-[32px] font-bold text-gray-900 tracking-tight leading-none">{value}</div>
        {change && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${tc}`}>
            <span>{arrow}</span><span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}
