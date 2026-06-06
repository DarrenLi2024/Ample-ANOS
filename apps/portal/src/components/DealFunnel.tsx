'use client';

interface FunnelStage {
  label: string;
  count: number;
  color: string;
}

interface Props {
  stages: FunnelStage[];
  totalLabel?: string;
}

const defaultStages: FunnelStage[] = [
  { label: 'Inquiry', count: 25, color: 'bg-blue-500' },
  { label: 'Matched', count: 12, color: 'bg-purple-500' },
  { label: 'Quoted', count: 8, color: 'bg-amber-500' },
  { label: 'Won', count: 3, color: 'bg-green-500' },
];

export function DealFunnel({ stages = defaultStages, totalLabel }: Props) {
  const maxCount = Math.max(...stages.map(s => s.count), 1);

  return (
    <div className="space-y-3">
      {totalLabel && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">成交漏斗</h3>
          <span className="text-xs text-gray-400">{totalLabel}</span>
        </div>
      )}
      {stages.map((stage, i) => {
        const width = Math.round((stage.count / maxCount) * 100);
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600">{stage.label}</span>
              <span className="text-gray-500">{stage.count}</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
