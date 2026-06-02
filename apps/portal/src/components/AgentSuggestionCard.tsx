'use client';

import { clsx } from 'clsx';
import { Bot, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SuggestedAction {
  label: string;
  risk: 'low' | 'medium' | 'high';
}

interface AgentSuggestionCardProps {
  agentName: string;
  agentType: 'Sales' | 'Procurement' | 'Credit' | 'Knowledge' | 'Risk';
  conclusion: string;
  evidence?: string[];
  sourceId?: string;
  generatedAt: string;
  confidenceScore: number;
  suggestedActions?: SuggestedAction[];
  requiresApproval?: boolean;
}

const agentColors: Record<string, string> = {
  Sales: 'bg-blue-100 text-blue-700',
  Procurement: 'bg-purple-100 text-purple-700',
  Credit: 'bg-red-100 text-red-700',
  Risk: 'bg-orange-100 text-orange-700',
  Knowledge: 'bg-green-100 text-green-700',
};

export function AgentSuggestionCard({
  agentName,
  agentType,
  conclusion,
  evidence = [],
  sourceId,
  generatedAt,
  confidenceScore,
  suggestedActions = [],
  requiresApproval = false,
}: AgentSuggestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);

  const riskBadge = (risk: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    };
    return clsx('text-xs px-1.5 py-0.5 rounded font-medium', colors[risk] || 'bg-gray-100');
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={18} className={clsx('p-1 rounded', agentColors[agentType] || 'bg-gray-100')} />
          <span className="font-medium text-sm">{agentName}</span>
          <span className={clsx('text-xs px-1.5 py-0.5 rounded', agentColors[agentType])}>
            {agentType}
          </span>
        </div>
        <span className="text-xs text-gray-400">{generatedAt}</span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-sm text-gray-900 mb-2">{conclusion}</p>

        {/* Confidence */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all',
                confidenceScore >= 70 ? 'bg-green-500' : confidenceScore >= 40 ? 'bg-yellow-500' : 'bg-red-500',
              )}
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{confidenceScore}%</span>
        </div>

        {/* Evidence (expandable) */}
        {evidence.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 mb-2"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {evidence.length} 条依据
            </button>
            {expanded && (
              <ul className="space-y-1 mb-3">
                {evidence.map((e, i) => (
                  <li key={i} className="text-xs text-gray-500 pl-4 border-l-2 border-gray-200">
                    {e}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Suggested Actions */}
        {suggestedActions.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {suggestedActions.map((action, i) => (
              <div key={i} className="flex items-center justify-between text-sm border border-gray-100 rounded p-2">
                <span>{action.label}</span>
                <span className={riskBadge(action.risk)}>{action.risk}</span>
              </div>
            ))}
          </div>
        )}

        {/* Approval */}
        {requiresApproval && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-yellow-700 font-medium">⚠ 需要人工确认</span>
            <div className="flex gap-2">
              <button
                onClick={() => setVoted('up')}
                className={clsx(
                  'flex items-center gap-1 px-3 py-1 rounded text-xs font-medium',
                  voted === 'up' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-green-50',
                )}
              >
                <ThumbsUp size={14} />
                确认
              </button>
              <button
                onClick={() => setVoted('down')}
                className={clsx(
                  'flex items-center gap-1 px-3 py-1 rounded text-xs font-medium',
                  voted === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-red-50',
                )}
              >
                <ThumbsDown size={14} />
                驳回
              </button>
            </div>
          </div>
        )}

        {!sourceId && (
          <p className="text-xs text-red-500 mt-2">⚠ 缺少来源引用</p>
        )}
      </div>
    </div>
  );
}
