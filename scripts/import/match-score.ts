/**
 * Opportunity Match Score 计算引擎
 * 
 * ⚠️ D-SCORE-001 待跟进: 评分权重需业务确认后调整
 * 当前使用默认权重作为第一版实现:
 *   型号匹配 40%  +  库存 20%  +  价格 15%  +  交期 15%  +  风险 10%
 * 
 * 用法:
 *   import { calculateMatchScore } from './match-score';
 */
import type { MatchScoreBreakdown } from '@anos/shared';

interface MatchInput {
  mpnMatch: boolean;         // 型号完全匹配
  partialMatch?: boolean;    // 部分匹配 (替代料)
  stockQty: number;          // 可用库存
  requestedQty: number;      // 需求数量
  price: number;             // 报价
  targetPrice?: number;       // 目标价
  leadTimeDays: number;      // 交期(天)
  requiredLeadTimeDays?: number; // 需求交期
  riskScore?: number;        // 供应商风险分 (0-100)
}

const DEFAULT_WEIGHTS = {
  model: 40,    // 🔴 D-SCORE-001: 待业务确认
  stock: 20,
  price: 15,
  delivery: 15,
  risk: 10,
};

export function calculateMatchScore(input: MatchInput, weights = DEFAULT_WEIGHTS): {
  totalScore: number;
  breakdown: MatchScoreBreakdown;
} {
  // 型号匹配 (0 or 40)
  let modelScore = 0;
  if (input.mpnMatch) {
    modelScore = weights.model; // 完全匹配满分
  } else if (input.partialMatch) {
    modelScore = Math.floor(weights.model * 0.6); // 替代料给60%
  }

  // 库存评分
  const stockRatio = Math.min(1, input.stockQty / Math.max(1, input.requestedQty));
  const stockScore = Math.floor(stockRatio * weights.stock);

  // 价格评分
  let priceScore = 0;
  if (input.targetPrice && input.targetPrice > 0) {
    const priceRatio = input.targetPrice / Math.max(1, input.price);
    priceScore = Math.floor(Math.min(1, priceRatio) * weights.price);
  } else {
    priceScore = Math.floor(weights.price * 0.5); // 无目标价给一半
  }

  // 交期评分
  let deliveryScore = 0;
  if (input.requiredLeadTimeDays && input.requiredLeadTimeDays > 0) {
    const deliveryRatio = input.requiredLeadTimeDays / Math.max(1, input.leadTimeDays);
    deliveryScore = Math.floor(Math.min(1, deliveryRatio) * weights.delivery);
  } else {
    deliveryScore = Math.floor(weights.delivery * 0.5);
  }

  // 风险评分 (风险越低分越高)
  const riskScore = Math.floor((Math.max(0, 100 - (input.riskScore || 50)) / 100) * weights.risk);

  const totalScore = modelScore + stockScore + priceScore + deliveryScore + riskScore;

  return {
    totalScore: Math.min(100, totalScore),
    breakdown: {
      modelMatch: modelScore,
      stockScore,
      priceScore,
      deliveryScore,
      riskScore,
    },
  };
}
