'use client';
import { clsx } from 'clsx';
import { CheckCircle, Clock, AlertTriangle, ExternalLink } from 'lucide-react';

type SourceType = 'Email' | 'WeChat' | 'WhatsApp' | 'Excel' | 'PDF' | 'Feishu' | 'ERP' | 'Manual';
type SourceStatus = 'verified' | 'unverified' | 'disputed';

interface SourceCardProps {
  source: string; sourceType: SourceType; sourceURL?: string; sourceOwner?: string;
  eventTime: string; capturedAt: string; verifiedBy?: string; confidenceScore: number;
  status?: SourceStatus; onViewAudit?: () => void;
}

function cLabel(score: number) { if (score>=90) return {l:'高可信',c:'text-green-700 bg-green-50'}; if (score>=70) return {l:'可信',c:'text-blue-700 bg-blue-50'}; if (score>=40) return {l:'待验证',c:'text-yellow-700 bg-yellow-50'}; return {l:'低可信',c:'text-red-700 bg-red-50'}; }

export function SourceCard(p: SourceCardProps) {
  const s = p.status || 'unverified';
  const cl = cLabel(p.confidenceScore);
  const icon = s === 'verified' ? <CheckCircle size={14} className="text-green-500" /> : s === 'disputed' ? <AlertTriangle size={14} className="text-red-500" /> : <Clock size={14} className="text-yellow-500" />;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">{icon}Source Card</h4>
        <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', cl.c)}>{cl.l} {p.confidenceScore}%</span>
      </div>
      <div className="space-y-1.5 text-gray-600">
        <div className="flex justify-between"><span className="text-gray-400">来源</span><span className="text-gray-900 font-medium">{p.source}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">方式</span><span>{p.sourceType}</span></div>
        {p.sourceOwner && <div className="flex justify-between"><span className="text-gray-400">来源人</span><span>{p.sourceOwner}</span></div>}
        <div className="flex justify-between"><span className="text-gray-400">原始时间</span><span className="font-mono text-xs">{p.eventTime}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">采集时间</span><span className="font-mono text-xs">{p.capturedAt}</span></div>
      </div>
      {(p.sourceURL || p.onViewAudit) && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          {p.sourceURL && <button className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"><ExternalLink size={12} />查看来源</button>}
          {p.onViewAudit && <button onClick={p.onViewAudit} className="text-xs text-gray-500 hover:text-gray-700">审计轨迹</button>}
        </div>
      )}
    </div>
  );
}
