'use client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RankItem {
  id: string;
  name: string;
  value: string;
  change?: 'up' | 'down' | 'flat';
  detail?: string;
}

interface Props {
  title: string;
  items: RankItem[];
  valueLabel?: string;
  maxItems?: number;
}

export function ValueRanking({ title, items, valueLabel = '成交额', maxItems = 5 }: Props) {
  const display = items.slice(0, maxItems);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <div className="space-y-2">
        {display.map((item, i) => (
          <div key={item.id} className="flex items-center gap-3">
            <span className={`
              w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
              ${i === 0 ? 'bg-amber-100 text-amber-700' :
                i === 1 ? 'bg-gray-200 text-gray-600' :
                i === 2 ? 'bg-amber-50 text-amber-600' :
                'bg-gray-100 text-gray-400'}
            `}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800 truncate">{item.name}</span>
                <span className="text-sm font-semibold text-gray-700">{item.value}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                {item.change && (
                  <>
                    {item.change === 'up' ? <TrendingUp size={10} className="text-green-500" /> :
                     item.change === 'down' ? <TrendingDown size={10} className="text-red-500" /> :
                     <Minus size={10} />}
                  </>
                )}
                {item.detail && <span>{item.detail}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
