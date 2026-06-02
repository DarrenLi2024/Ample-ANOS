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

export function SourceCard(p: SourceCardProps) {
  const s = p.status || 'unverified';
  const icon = s === 'verified' ? <CheckCircle size={14} className="text-green-500" /> : s === 'disputed' ? <AlertTriangle size={14} className="text-red-500" /> : <Clock size={14} className="text-amber-500" />;
  return (
    <div className="proto-card-accent p-4 text-[13px]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">{icon} Source Card</h4>
        <span className={clsx('tag', p.confidenceScore >= 90 ? 'tag-green' : p.confidenceScore >= 70 ? 'tag-blue' : p.confidenceScore >= 40 ? 'tag-yellow' : 'tag-red')}>
          可信度 {p.confidenceScore}%
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between"><span className="text-gray-400">来源</span><span className="text-gray-800 font-medium">{p.source}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">来源方式</span><span>{p.sourceType}</span></div>
        {p.sourceOwner && <div className="flex justify-between"><span className="text-gray-400">来源人</span><span>{p.sourceOwner}</span></div>}
        <div className="flex justify-between"><span className="text-gray-400">原始时间</span><span className="font-mono text-[12px]">{p.eventTime}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">采集时间</span><span className="font-mono text-[12px]">{p.capturedAt}</span></div>
        {p.verifiedBy && <div className="flex justify-between"><span className="text-gray-400">验证人</span><span>{p.verifiedBy}</span></div>}
      </div>
      <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
        {p.sourceURL && <button className="flex items-center gap-1 text-[12px] text-brand-600 hover:text-brand-700 transition-colors"><ExternalLink size={12} />查看来源</button>}
        {p.onViewAudit && <button onClick={p.onViewAudit} className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">审计轨迹</button>}
      </div>
    </div>
  );
}
