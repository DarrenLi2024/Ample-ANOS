'use client';
interface KpiCardProps {
  label: string; value: string | number; change?: string;
  trend?: 'up' | 'down' | 'neutral'; icon?: React.ReactNode;
}
export function KpiCard({ label, value, change, trend = 'neutral', icon }: KpiCardProps) {
  const trendColor = trend === 'up' ? 'badge-green' : trend === 'down' ? 'badge-red' : 'text-text-tertiary';
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return (
    <div className="card-gradient card-hover p-5 animate-in-up">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-tertiary font-medium tracking-wide uppercase">{label}</span>
        {icon && <span className="text-text-tertiary">{icon}</span>}
      </div>
      <div className="text-[32px] font-semibold text-text-primary tracking-tight leading-none">{value}</div>
      {change && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${trendColor}`}>
          <span>{arrow}</span><span>{change}</span>
        </div>
      )}
    </div>
  );
}
