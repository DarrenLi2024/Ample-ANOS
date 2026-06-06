'use client';
import { TrendingUp, Zap, Lightbulb, Star, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

type OppType = 'HighValue' | 'Shortage' | 'Alternative' | 'HighMargin' | 'NewCustomer';

interface Props {
  type: OppType;
  mpn: string;
  brand?: string;
  matchScore?: number;
  winRate?: number;
  margin?: number;
  action: string;
  evidence?: string[];
  customerCode?: string; // 采购视角：仅显示编码
  salesName?: string;    // 采购视角：显示Sales名
  onClick?: () => void;
}

const typeConfig: Record<OppType, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  HighValue:     { icon: <Star size={16} />,      label: '高价值',     color: 'text-amber-600', bg: 'bg-amber-50' },
  Shortage:      { icon: <Zap size={16} />,       label: '缺货机会',   color: 'text-red-600',   bg: 'bg-red-50' },
  Alternative:   { icon: <Lightbulb size={16} />,  label: '替代料',     color: 'text-blue-600',  bg: 'bg-blue-50' },
  HighMargin:    { icon: <TrendingUp size={16} />, label: '高利润',     color: 'text-green-600', bg: 'bg-green-50' },
  NewCustomer:   { icon: <Star size={16} />,      label: '新客户',     color: 'text-purple-600',bg: 'bg-purple-50' },
};

export function OpportunityCard({
  type, mpn, brand, matchScore, winRate, margin, action, evidence, customerCode, salesName, onClick,
}: Props) {
  const cfg = typeConfig[type];
  return (
    <div onClick={onClick}
      className={clsx(
        'proto-card p-4 cursor-pointer hover:shadow-md transition-all border border-gray-100 hover:border-brand-200 group',
        'animate-in'
      )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className={clsx('tag flex items-center gap-1', cfg.bg, cfg.color)}>
          {cfg.icon}
          <span className="font-medium">{cfg.label}</span>
        </span>
        {matchScore && (
          <span className={clsx(
            'text-sm font-bold',
            matchScore >= 85 ? 'text-green-600' : matchScore >= 70 ? 'text-amber-600' : 'text-gray-500'
          )}>
            {matchScore}%
          </span>
        )}
      </div>

      {/* Body */}
      <div className="space-y-1.5 mb-3">
        <h4 className="font-semibold text-sm text-gray-900">
          {brand && <span className="text-gray-400 font-normal">{brand} </span>}
          <span className="font-mono">{mpn}</span>
        </h4>
        {salesName && <p className="text-xs text-gray-400">Sales: {salesName}</p>}
        {customerCode && <p className="text-xs text-gray-400">客户编码: {customerCode}</p>}
        <div className="flex gap-3 text-xs text-gray-500 mt-1">
          {winRate !== undefined && <span>成交率 {winRate}%</span>}
          {margin !== undefined && <span>利润率 {margin}%</span>}
        </div>
      </div>

      {/* Evidence */}
      {evidence && evidence.length > 0 && (
        <div className="mb-3 space-y-0.5">
          {evidence.slice(0, 2).map((e, i) => (
            <p key={i} className="text-xs text-gray-400 truncate">{e}</p>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-brand-600 font-medium">{action}</span>
        <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
      </div>
    </div>
  );
}
