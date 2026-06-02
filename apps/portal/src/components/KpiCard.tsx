interface KpiCardProps { label: string; value: string | number; change?: string; trend?: 'up' | 'down' | 'neutral'; icon?: React.ReactNode }
export function KpiCard({ label, value, change, trend = 'neutral', icon }: KpiCardProps) {
  const tc = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400';
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '·';
  return (
    <div className="proto-card p-5 animate-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-gray-400 font-medium uppercase tracking-wide">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="text-[28px] font-bold text-gray-900 tracking-tight">{value}</div>
      {change && (
        <div className={`flex items-center gap-1 mt-1.5 text-[12px] font-medium ${tc}`}>
          <span>{arrow}</span><span>{change}</span>
        </div>
      )}
    </div>
  );
}
