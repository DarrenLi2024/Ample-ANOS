'use client';
import { Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

type Priority = 'urgent' | 'high' | 'medium' | 'low';
type ActionType = 'Quote' | 'FollowUp' | 'Collect' | 'Verify' | 'Ship' | 'Match' | 'Review';

interface Props {
  priority: Priority;
  type: ActionType;
  title: string;
  description?: string;
  dueDate?: string;
  suggestion?: string;
  onClick?: () => void;
}

const priorityConfig: Record<Priority, { color: string; label: string }> = {
  urgent: { color: 'text-red-600 bg-red-50', label: '紧急' },
  high:   { color: 'text-amber-600 bg-amber-50', label: '高' },
  medium: { color: 'text-blue-600 bg-blue-50', label: '中' },
  low:    { color: 'text-gray-500 bg-gray-50', label: '低' },
};

export function ActionCard({ priority, type, title, description, dueDate, suggestion, onClick }: Props) {
  const cfg = priorityConfig[priority];
  return (
    <div onClick={onClick}
      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group border-b border-gray-50 last:border-b-0">
      {/* Priority dot */}
      <span className={clsx('shrink-0 w-2 h-2 mt-1.5 rounded-full', 
        priority === 'urgent' ? 'bg-red-500' : 
        priority === 'high' ? 'bg-amber-500' : 
        priority === 'medium' ? 'bg-blue-500' : 'bg-gray-300'
      )} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={clsx('tag text-xs', cfg.color)}>{cfg.label}</span>
          <span className="text-sm font-medium text-gray-800 truncate">{title}</span>
        </div>
        {description && <p className="text-xs text-gray-400 mt-0.5 truncate">{description}</p>}
        <div className="flex items-center gap-3 mt-1">
          {dueDate && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={10} />{dueDate}
            </span>
          )}
          {suggestion && (
            <span className="text-xs text-brand-600 font-medium">{suggestion}</span>
          )}
        </div>
      </div>

      <ArrowRight size={14} className="shrink-0 text-gray-300 group-hover:text-brand-500 transition-colors self-center" />
    </div>
  );
}
