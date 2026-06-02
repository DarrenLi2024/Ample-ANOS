'use client';
import { clsx } from 'clsx';
import { Bot, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SuggestedAction { label: string; risk: 'low' | 'medium' | 'high' }
interface AgentSuggestionCardProps {
  agentName: string; agentType: 'Sales' | 'Procurement' | 'Credit' | 'Knowledge' | 'Risk';
  conclusion: string; evidence?: string[]; sourceId?: string; generatedAt: string;
  confidenceScore: number; suggestedActions?: SuggestedAction[]; requiresApproval?: boolean;
}

const typeColors: Record<string, string> = {
  Sales: 'badge-blue', Procurement: 'badge-purple', Credit: 'badge-red',
  Risk: 'badge-yellow', Knowledge: 'badge-green',
};

export function AgentSuggestionCard({
  agentName, agentType, conclusion, evidence = [], sourceId,
  generatedAt, confidenceScore, suggestedActions = [], requiresApproval = false,
}: AgentSuggestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);

  return (
    <div className="card-gradient animate-in-up">
      <div className="px-5 py-3 border-b border-border-light flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-brand" />
          <span className="font-medium text-sm">{agentName}</span>
          <span className={clsx('badge', typeColors[agentType])}>{agentType}</span>
        </div>
        <span className="text-xs text-text-tertiary">{generatedAt}</span>
      </div>
      <div className="p-5">
        <p className="text-sm text-text-primary mb-3 leading-relaxed">{conclusion}</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
            <div className={clsx('h-full rounded-full transition-all', confidenceScore >= 70 ? 'bg-success' : confidenceScore >= 40 ? 'bg-warning' : 'bg-danger')}
              style={{ width: `${confidenceScore}%` }} />
          </div>
          <span className="text-xs text-text-tertiary">{confidenceScore}%</span>
        </div>
        {evidence.length > 0 && (
          <>
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-brand hover:text-brand-dark mb-2 transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}{evidence.length} 条依据
            </button>
            {expanded && (
              <ul className="space-y-1 mb-3">{evidence.map((e, i) => (
                <li key={i} className="text-xs text-text-secondary pl-3 border-l-2 border-brand-light">{e}</li>
              ))}</ul>
            )}
          </>
        )}
        {suggestedActions.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {suggestedActions.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-sm border border-border-light rounded-sm px-3 py-2 bg-black/[0.02]">
                <span>{a.label}</span>
                <span className={clsx('text-xs px-1.5 py-0.5 rounded font-medium',
                  a.risk === 'low' ? 'badge-green' : a.risk === 'medium' ? 'badge-yellow' : 'badge-red')}>{a.risk}</span>
              </div>
            ))}
          </div>
        )}
        {requiresApproval && (
          <div className="mt-3 pt-3 border-t border-border-light flex items-center justify-between">
            <span className="text-xs text-warning font-medium">⚠ 需要人工确认</span>
            <div className="flex gap-2">
              <button onClick={() => setVoted('up')} className={clsx('btn-secondary !px-3 !py-1.5 !text-xs', voted === 'up' && '!border-brand !text-brand !bg-brand-ghost')}>
                <ThumbsUp size={14} className="mr-1" />确认
              </button>
              <button onClick={() => setVoted('down')} className={clsx('btn-secondary !px-3 !py-1.5 !text-xs', voted === 'down' && '!border-danger !text-danger !bg-red-50')}>
                <ThumbsDown size={14} className="mr-1" />驳回
              </button>
            </div>
          </div>
        )}
        {!sourceId && <p className="text-xs text-danger mt-2">⚠ 缺少来源引用</p>}
      </div>
    </div>
  );
}
