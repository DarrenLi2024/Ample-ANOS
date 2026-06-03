'use client';
import { useState } from 'react';
import { CheckCircle, XCircle, Edit3 } from 'lucide-react';

interface ApprovalAction { id: string; label: string; variant: 'primary' | 'secondary' | 'danger'; requireComment?: boolean }
interface Props { targetType: string; targetId: string; title: string; aiSuggestion: string; actions: ApprovalAction[]; onSubmit: (action: string, comment?: string) => void; onCancel: () => void }

export function HumanApprovalPanel({ targetType, targetId, title, aiSuggestion, actions, onSubmit, onCancel }: Props) {
  const [comment, setComment] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  const handleConfirm = () => {
    if (selectedAction) onSubmit(selectedAction, comment || undefined);
  };

  return (
    <div className="proto-card-accent p-5 text-base space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">人工确认</h3>
        <span className="tag tag-yellow">{targetType} · {targetId}</span>
      </div>
      <p className="text-sm text-gray-700">{title}</p>
      <div className="bg-brand-50 p-3 rounded-lg text-xs text-brand-700">{aiSuggestion}</div>
      <div className="space-y-2">
        {actions.map(a => (
          <button key={a.id} onClick={() => setSelectedAction(a.id)}
            className={`w-full text-left px-4 py-2.5 rounded-lg border transition-colors text-sm
              ${selectedAction === a.id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 hover:border-gray-300'}`}>
            {a.label}
            {a.requireComment && <span className="text-xs text-gray-400 ml-2">(需要备注)</span>}
          </button>
        ))}
      </div>
      {selectedAction && actions.find(a => a.id === selectedAction)?.requireComment && (
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="请输入审批备注..." className="proto-input text-sm" rows={2} />
      )}
      <div className="flex gap-2 pt-2">
        <button onClick={handleConfirm} disabled={!selectedAction} className="btn-primary flex-1 flex items-center justify-center gap-2"><CheckCircle size={16} />确认</button>
        <button onClick={onCancel} className="btn-outline flex items-center gap-2"><XCircle size={16} />取消</button>
      </div>
    </div>
  );
}
