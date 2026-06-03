'use client';
import { Clock, User, AlertTriangle } from 'lucide-react';

interface TaskCardProps { title: string; object: string; assignee: string; dueDate: string; aiSuggestion?: string; priority?: 'low' | 'medium' | 'high' | 'urgent'; onApprove?: () => void }

export function TaskCard({ title, object, assignee, dueDate, aiSuggestion, priority = 'medium', onApprove }: TaskCardProps) {
  const pColors = { low: 'tag-green', medium: 'tag-blue', high: 'tag-yellow', urgent: 'tag-red' };
  return (
    <div className="proto-card-accent p-4 text-sm space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
        <span className={`tag ${pColors[priority]}`}>{priority}</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><User size={12} />{assignee}</span>
        <span className="flex items-center gap-1"><Clock size={12} />{dueDate}</span>
      </div>
      <div className="text-xs text-gray-500">关联: {object}</div>
      {aiSuggestion && (
        <div className="bg-brand-50 p-2 rounded text-xs text-brand-700 flex items-start gap-2">
          <AlertTriangle size={12} className="mt-0.5 shrink-0" />
          {aiSuggestion}
        </div>
      )}
      {onApprove && <button onClick={onApprove} className="btn-primary w-full !py-1.5 !text-xs mt-2">确认执行</button>}
    </div>
  );
}
