interface KpiCardProps { label: string; value: string | number; change?: string; trend?: 'up' | 'down' | 'neutral'; icon?: React.ReactNode }
export function KpiCard({ label, value, change, trend = 'neutral', icon }: KpiCardProps) {
  const tc = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400';
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {change && <div className={`flex items-center gap-1 mt-1 text-xs ${tc}`}><span>{arrow}</span><span>{change}</span></div>}
    </div>
  );
}
