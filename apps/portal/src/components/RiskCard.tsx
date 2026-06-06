'use client';
import { AlertTriangle, ShieldAlert, Package, DollarSign, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

type RiskType = 'AR' | 'Credit' | 'Supplier' | 'Inventory' | 'Price' | 'Conflict';
type RiskLevel = 'L4' | 'L3' | 'L2' | 'L1';

interface Props {
  level: RiskLevel;
  type: RiskType;
  subject: string;
  amount?: number;
  overdue?: number;
  action: string;
  owner?: string;
  onClick?: () => void;
}

const levelConfig: Record<RiskLevel, { color: string; bg: string; label: string }> = {
  L4: { color: 'text-red-600', bg: 'bg-red-50', label: '严重' },
  L3: { color: 'text-amber-600', bg: 'bg-amber-50', label: '警告' },
  L2: { color: 'text-blue-600', bg: 'bg-blue-50', label: '关注' },
  L1: { color: 'text-gray-500', bg: 'bg-gray-50', label: '正常' },
};

const typeIcons: Record<RiskType, React.ReactNode> = {
  AR: <DollarSign size={14} />,
  Credit: <ShieldAlert size={14} />,
  Supplier: <Package size={14} />,
  Inventory: <Package size={14} />,
  Price: <DollarSign size={14} />,
  Conflict: <AlertTriangle size={14} />,
};

const typeLabels: Record<RiskType, string> = {
  AR: 'AR逾期', Credit: '信用风险', Supplier: '供应商风险',
  Inventory: '库存风险', Price: '价格风险', Conflict: '报价冲突',
};

export function RiskCard({ level, type, subject, amount, overdue, action, owner, onClick }: Props) {
  const cfg = levelConfig[level];
  return (
    <div onClick={onClick}
      className={clsx(
        'proto-card p-3 cursor-pointer hover:shadow-sm transition-all border border-gray-100 group',
        level === 'L4' && 'border-red-200 bg-red-50/30',
        level === 'L3' && 'border-amber-200 bg-amber-50/30',
      )}>
      <div className="flex items-start gap-3">
        {/* Level badge */}
        <span className={clsx('tag shrink-0 flex items-center gap-1', cfg.bg, cfg.color)}>
          {typeIcons[type]}
          <span className="font-medium">{cfg.label}</span>
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{typeLabels[type]}</span>
            <ArrowRight size={12} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
          </div>
          <h4 className="font-medium text-sm text-gray-800 mt-0.5">{subject}</h4>
          <div className="flex gap-3 text-xs mt-1">
            {amount !== undefined && (
              <span className="text-red-600 font-medium">${amount.toLocaleString()}</span>
            )}
            {overdue !== undefined && (
              <span className={overdue > 60 ? 'text-red-600' : 'text-amber-600'}>
                {overdue}天
              </span>
            )}
            {owner && <span className="text-gray-400">{owner}</span>}
          </div>
          <p className="text-xs text-brand-600 font-medium mt-1.5">{action}</p>
        </div>
      </div>
    </div>
  );
}
