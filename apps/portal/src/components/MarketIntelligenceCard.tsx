'use client';
import { TrendingUp, AlertTriangle, Zap, ArrowRight } from 'lucide-react';

interface IntelItem { icon: 'trend' | 'alert' | 'zap'; title: string; desc: string; source: string; time: string }

const marketIntel: IntelItem[] = [
  { icon: 'trend', title: 'STM32F407 市场缺货预警', desc: 'ST原厂产能受限，Q3交期延长至4-6周，建议提前备货', source: '原厂通知', time: '2小时前' },
  { icon: 'zap', title: 'GD32F103 国产替代窗口', desc: 'GigaDevice 价格下探至 $0.70，比 STM32F103 低 46%', source: '行业情报', time: '5小时前' },
  { icon: 'alert', title: 'TI 部分型号 EOL 通知', desc: 'TMS320F28335 进入 NRND 阶段，建议寻找替代方案', source: 'TI官网', time: '1天前' },
  { icon: 'zap', title: '人民币汇率波动提醒', desc: 'USD/CNY 突破 7.25，进口成本上升约 3%，建议调整报价', source: '财经数据', time: '6小时前' },
];

const iconMap = {
  trend: <TrendingUp size={14} className="text-brand-500" />,
  alert: <AlertTriangle size={14} className="text-amber-500" />,
  zap: <Zap size={14} className="text-green-500" />,
};

export function MarketIntelligenceCard() {
  return (
    <div className="proto-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">市场情报</h3>
        <ArrowRight size={14} className="text-gray-300" />
      </div>
      <div className="space-y-3">
        {marketIntel.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 p-2 -mx-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="mt-0.5 shrink-0">{iconMap[item.icon]}</div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-800 leading-snug">{item.title}</div>
              <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.desc}</div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span>{item.source}</span>
                <span>·</span>
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
