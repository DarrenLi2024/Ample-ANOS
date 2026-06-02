/**
 * ANOS 财务数据层 (L2) 类型定义
 * 基于 docs/42-ANOS数据中台建表蓝图 V1.0.md 第4章
 */

import type { ANOSEntity, DataHealthFields } from './common';
import type { RiskLevel } from './master';

// ============================================================================
// AR Base (21_AR_Base) — P0 核心表
// ============================================================================

export type ARStatus = 'Open' | 'PartialPaid' | 'Paid' | 'Overdue' | 'Disputed' | 'WrittenOff';

export interface ARItem extends ANOSEntity, DataHealthFields {
  arId: string;
  customerId: string;
  soId?: string;
  invoiceNo?: string;
  invoiceDate?: string;
  dueDate: string;

  arAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;

  overdueDays: number;
  riskLevel: RiskLevel;
  collectionForecast?: number;  // 预计回款金额

  status: ARStatus;
  collectionOwnerId?: string;

  // AI 建议
  aiCollectionSuggestion?: string;
  aiStopShipmentRecommendation?: boolean;
}

// ============================================================================
// Credit Base (23_Credit_Base)
// ============================================================================

export interface CreditProfile extends ANOSEntity {
  customerId: string;
  creditLimit: number;
  usedCredit: number;
  availableCredit: number;
  creditScore: number;     // 0-100
  lastReviewDate?: string;
  nextReviewDate?: string;
}

// ============================================================================
// Risk Case (24_Risk_Base)
// ============================================================================

export type RiskType = 'AR' | 'Credit' | 'Supply' | 'Quality' | 'Delivery' | 'Compliance' | 'Other';
export type RiskSeverity = 'L1_Low' | 'L2_Watch' | 'L3_Warning' | 'L4_Critical';
export type RiskCaseStatus = 'Open' | 'Investigating' | 'Mitigating' | 'Resolved' | 'Closed';

export interface RiskCase extends ANOSEntity {
  riskId: string;
  riskType: RiskType;
  source: string;
  sourceId?: string;
  severity: RiskSeverity;
  ownerId?: string;
  description?: string;
  status: RiskCaseStatus;
  aiRecommendation?: string;
  resolution?: string;
  resolvedAt?: string;
}
