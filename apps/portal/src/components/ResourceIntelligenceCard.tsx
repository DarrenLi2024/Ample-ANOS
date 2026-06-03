'use client';
import { Star, TrendingUp, Clock, Shield } from 'lucide-react';

interface Props {
  supplierName: string;
  authorizationStatus: string;
  resourceScore: number;
  priceScore: number;
  deliveryScore: number;
  qualityScore?: number;
  riskScore?: number;
}

export function ResourceIntelligenceCard({ supplierName, authorizationStatus, resourceScore, priceScore, deliveryScore, qualityScore, riskScore }: Props) {
  return (
    <div className="proto-card-accent p-4 text-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">Resource Intelligence</h4>
        <span className="tag tag-purple">{authorizationStatus}</span>
      </div>
      <div className="text-sm font-semibold text-gray-900 mb-3">{supplierName}</div>

      <div className="space-y-2">
        <ScoreRow icon={<Star size={14} />} label="资源评分" score={resourceScore} color="bg-brand-500" />
        <ScoreRow icon={<TrendingUp size={14} />} label="价格评分" score={priceScore} color="bg-green-500" />
        <ScoreRow icon={<Clock size={14} />} label="交期评分" score={deliveryScore} color="bg-amber-500" />
        {qualityScore !== undefined && <ScoreRow icon={<Shield size={14} />} label="质量评分" score={qualityScore} color="bg-purple-500" />}
      </div>

      {riskScore !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-400">风险评分</span>
          <span className={`font-semibold ${riskScore > 60 ? 'text-red-600' : riskScore > 30 ? 'text-amber-600' : 'text-green-600'}`}>{riskScore}/100</span>
        </div>
      )}
    </div>
  );
}

function ScoreRow({ icon, label, score, color }: { icon: React.ReactNode; label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="flex items-center gap-1 text-gray-500">{icon}{label}</span>
        <span className="font-semibold">{score}%</span>
      </div>
      <div className="progress-bar"><div className={`progress-bar-fill ${color}`} style={{ width: `${score}%` }} /></div>
    </div>
  );
}
