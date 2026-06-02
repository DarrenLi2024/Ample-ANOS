'use client';
import { clsx } from 'clsx';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

type SourceType = 'Email' | 'WeChat' | 'WhatsApp' | 'Excel' | 'PDF' | 'Feishu' | 'ERP' | 'Manual';
type SourceStatus = 'verified' | 'unverified' | 'disputed';

interface SourceCardProps {
  source: string; sourceType: SourceType; sourceURL?: string; sourceOwner?: string;
  eventTime: string; capturedAt: string; verifiedBy?: string; confidenceScore: number;
  status?: SourceStatus; onViewAudit?: () => void;
}

function label(score: number) {
  if (score >= 90) return { text: '高可信', cls: 'badge-green' };
  if (score >= 70) return { text: '可信', cls: 'badge-blue' };
  if (score >= 40) return { text: '待验证', cls: 'badge-yellow' };
  return { text: '低可信', cls: 'badge-red' };
}

export function SourceCard(p: SourceCardProps) {
  const s = p.status || 'unverified';
  const l = label(p.confidenceScore);
  return (
    <div className="card-gradient p-4 text-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {s === 'verified' ? <CheckCircle size={14} className="text-success" /> :
           s === 'disputed' ? <AlertTriangle size={14} className="text-danger" /> :
           <Clock size={14} className="text-warning" />}
          <span className="font-semibold text-text-primary">Source Card</span>
        </div>
        <span className={clsx('badge', l.cls)}>{l.text} {p.confidenceScore}%</span>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between"><span className="text-text-tertiary">来源</span><span className="text-text-primary font-medium">{p.source}</span></div>
        <div className="flex justify-between"><span className="text-text-tertiary">方式</span><span>{p.sourceType}</span></div>
        {p.sourceOwner && <div className="flex justify-between"><span className="text-text-tertiary">来源人</span><span>{p.sourceOwner}</span></div>}
        <div className="flex justify-between"><span className="text-text-tertiary">原始时间</span><span className="font-mono">{p.eventTime}</span></div>
        <div className="flex justify-between"><span className="text-text-tertiary">采集时间</span><span className="font-mono">{p.capturedAt}</span></div>
      </div>
      {p.onViewAudit && (
        <button onClick={p.onViewAudit} className="mt-3 pt-3 border-t border-border-light w-full text-xs text-text-tertiary hover:text-brand transition-colors text-left">审计轨迹 →</button>
      )}
    </div>
  );
}
