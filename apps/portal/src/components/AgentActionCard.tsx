'use client';
import { Bot, Zap, ArrowRight, Play } from 'lucide-react';
import { clsx } from 'clsx';

type AgentType = 'Sales' | 'Procurement' | 'Credit' | 'Market' | 'Source' | 'Match' | 'Memory' | 'Price';

interface AgentAction {
  label: string;
  action: string; // 动作标识符
  risk?: 'low' | 'medium' | 'high';
}

interface Props {
  agentName: string;
  agentType: AgentType;
  discovery: string;      // 发现事项 (SA-019 第24章)
  suggestedAction: string; // 建议动作
  actionButton?: AgentAction; // 执行按钮
  confidence?: number;
  onExecute?: (action: string) => void;
}

const typeStyles: Record<AgentType, { color: string; icon: React.ReactNode }> = {
  Sales:       { color: 'tag-blue',    icon: <Bot size={14} /> },
  Procurement: { color: 'tag-purple',  icon: <Bot size={14} /> },
  Credit:      { color: 'tag-red',     icon: <Bot size={14} /> },
  Market:      { color: 'tag-green',   icon: <Zap size={14} /> },
  Source:      { color: 'tag-amber',   icon: <Zap size={14} /> },
  Match:       { color: 'tag-blue',    icon: <Zap size={14} /> },
  Memory:      { color: 'tag-gray',    icon: <Bot size={14} /> },
  Price:       { color: 'tag-green',   icon: <Zap size={14} /> },
};

export function AgentActionCard({
  agentName, agentType, discovery, suggestedAction, actionButton, confidence, onExecute,
}: Props) {
  const style = typeStyles[agentType];
  return (
    <div className="proto-card-accent p-4 space-y-3 animate-in">
      {/* Agent Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center">
            {style.icon}
          </div>
          <span className="text-sm font-semibold text-gray-800">{agentName}</span>
          <span className={clsx('tag text-xs', style.color)}>{agentType}</span>
        </div>
        {confidence !== undefined && (
          <span className={clsx(
            'text-xs font-medium',
            confidence >= 80 ? 'text-green-600' : 'text-amber-600'
          )}>
            {confidence}%
          </span>
        )}
      </div>

      {/* Discovery (发现事项) */}
      <p className="text-sm text-gray-700 leading-relaxed">
        <span className="text-brand-600 font-medium">发现：</span>
        {discovery}
      </p>

      {/* Suggested Action (建议动作) */}
      <p className="text-sm text-gray-600">
        <span className="text-amber-600 font-medium">建议：</span>
        {suggestedAction}
      </p>

      {/* Execute Button (执行按钮) — SA-019 第24章 */}
      {actionButton && (
        <button
          onClick={() => onExecute?.(actionButton.action)}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all',
            actionButton.risk === 'high' ? 'bg-red-50 text-red-700 hover:bg-red-100' :
            actionButton.risk === 'medium' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' :
            'bg-brand-50 text-brand-700 hover:bg-brand-100'
          )}>
          <Play size={14} />
          {actionButton.label}
        </button>
      )}
    </div>
  );
}
