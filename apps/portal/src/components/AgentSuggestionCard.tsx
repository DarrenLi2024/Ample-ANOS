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

const typeStyles: Record<string, string> = {
  Sales: 'tag-blue', Procurement: 'tag-purple', Credit: 'tag-red', Risk: 'tag-yellow', Knowledge: 'tag-green',
};

export function AgentSuggestionCard({
  agentName, agentType, conclusion, evidence = [], sourceId, generatedAt,
  confidenceScore, suggestedActions = [], requiresApproval = false,
}: AgentSuggestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  return (
    <div className="proto-card-accent animate-in">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
            <Bot size={16} className="text-brand-600" />
          </div>
          <div>
            <span className="font-semibold text-[14px] text-gray-900">{agentName}</span>
            <span className={clsx('tag ml-2', typeStyles[agentType])}>{agentType}</span>
          </div>
        </div>
        <span className="text-[12px] text-gray-400">{generatedAt}</span>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-[14px] text-gray-800 leading-relaxed mb-3">{conclusion}</p>

        {/* Confidence bar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 progress-bar">
            <div className={clsx('progress-bar-fill', confidenceScore >= 70 ? 'bg-green-500' : confidenceScore >= 40 ? 'bg-amber-500' : 'bg-red-500')}
              style={{ width: `${confidenceScore}%` }} />
          </div>
          <span className="text-[12px] font-medium text-gray-500">{confidenceScore}%</span>
        </div>

        {/* Evidence */}
        {evidence.length > 0 && (
          <>
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-[12px] text-brand-600 hover:text-brand-700 mb-2 transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {evidence.length} 条依据
            </button>
            {expanded && (
              <ul className="space-y-1.5 mb-3">{evidence.map((e, i) => (
                <li key={i} className="text-[12px] text-gray-500 pl-3 border-l-2 border-brand-200 py-0.5">{e}</li>
              ))}</ul>
            )}
          </>
        )}

        {/* Suggested Actions */}
        {suggestedActions.length > 0 && (
          <div className="space-y-2 mb-3">
            {suggestedActions.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-[13px] border border-gray-100 rounded-md px-3 py-2.5 bg-gray-50/50">
                <span className="text-gray-700">{a.label}</span>
                <span className={clsx('tag', a.risk === 'low' ? 'tag-green' : a.risk === 'medium' ? 'tag-yellow' : 'tag-red')}>{a.risk}</span>
              </div>
            ))}
          </div>
        )}

        {/* Approval buttons */}
        {requiresApproval && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full" />
              <span className="text-[12px] font-medium text-amber-700">需要人工确认</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setVoted('up')}
                className={clsx('btn-outline !py-1.5 !px-3 !text-[12px] flex items-center gap-1.5', voted === 'up' && '!border-green-300 !text-green-700 !bg-green-50')}>
                <ThumbsUp size={14} />确认
              </button>
              <button onClick={() => setVoted('down')}
                className={clsx('btn-outline !py-1.5 !px-3 !text-[12px] flex items-center gap-1.5', voted === 'down' && '!border-red-300 !text-red-700 !bg-red-50')}>
                <ThumbsDown size={14} />驳回
              </button>
            </div>
          </div>
        )}

        {!sourceId && <p className="text-[12px] text-red-500 mt-3">⚠ 缺少来源引用</p>}
      </div>
    </div>
  );
}
