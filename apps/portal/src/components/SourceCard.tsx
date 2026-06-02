'use client';

import { clsx } from 'clsx';
import { CheckCircle, Clock, AlertTriangle, ExternalLink } from 'lucide-react';

type SourceType = 'Email' | 'WeChat' | 'WhatsApp' | 'Excel' | 'PDF' | 'Feishu' | 'ERP' | 'Manual';
type SourceStatus = 'verified' | 'unverified' | 'disputed';

interface SourceCardProps {
  source: string;
  sourceType: SourceType;
  sourceURL?: string;
  sourceOwner?: string;
  eventTime: string;
  capturedAt: string;
  verifiedBy?: string;
  confidenceScore: number;
  status?: SourceStatus;
  onViewAudit?: () => void;
}

function confidenceLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: '高可信', color: 'text-green-700 bg-green-50' };
  if (score >= 70) return { label: '可信', color: 'text-blue-700 bg-blue-50' };
  if (score >= 40) return { label: '待验证', color: 'text-yellow-700 bg-yellow-50' };
  return { label: '低可信', color: 'text-red-700 bg-red-50' };
}

function statusIcon(status: SourceStatus) {
  switch (status) {
    case 'verified': return <CheckCircle size={14} className="text-green-500" />;
    case 'unverified': return <Clock size={14} className="text-yellow-500" />;
    case 'disputed': return <AlertTriangle size={14} className="text-red-500" />;
  }
}

export function SourceCard({
  source,
  sourceType,
  sourceURL,
  sourceOwner,
  eventTime,
  capturedAt,
  verifiedBy,
  confidenceScore,
  status = 'unverified',
  onViewAudit,
}: SourceCardProps) {
  const conf = confidenceLabel(confidenceScore);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          {statusIcon(status)}
          Source Card
        </h4>
        <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', conf.color)}>
          {conf.label} {confidenceScore}%
        </span>
      </div>

      <div className="space-y-1.5 text-gray-600">
        <div className="flex justify-between">
          <span className="text-gray-400">来源</span>
          <span className="text-gray-900 font-medium">{source}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">方式</span>
          <span>{sourceType}</span>
        </div>
        {sourceOwner && (
          <div className="flex justify-between">
            <span className="text-gray-400">来源人</span>
            <span>{sourceOwner}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-400">原始时间</span>
          <span className="font-mono text-xs">{eventTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">采集时间</span>
          <span className="font-mono text-xs">{capturedAt}</span>
        </div>
        {verifiedBy && (
          <div className="flex justify-between">
            <span className="text-gray-400">验证人</span>
            <span>{verifiedBy}</span>
          </div>
        )}
      </div>

      {(sourceURL || onViewAudit) && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          {sourceURL && (
            <button className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
              <ExternalLink size={12} />
              查看来源
            </button>
          )}
          {onViewAudit && (
            <button
              onClick={onViewAudit}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              审计轨迹
            </button>
          )}
        </div>
      )}
    </div>
  );
}
