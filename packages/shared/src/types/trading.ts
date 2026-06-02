/**
 * ANOS 交易数据层 (L1) 类型定义
 * 基于 docs/20-ANOS企业数据字典V1.0.md 第3章
 * 与 docs/42-ANOS数据中台建表蓝图 V1.0.md 第3章对齐
 */

import type { ANOSEntity, DataHealthFields, SourceType } from './common';
import type { RiskLevel } from './master';

// ============================================================================
// Inquiry Base (11_Inquiry_Base) — P0 核心表
// ============================================================================

export type InquiryStatus =
  | 'New'
  | 'Parsing'
  | 'Structured'
  | 'Matched'
  | 'Quoting'
  | 'Quoted'
  | 'Negotiating'
  | 'Won'
  | 'Lost'
  | 'Closed';

export type InquiryPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Inquiry extends ANOSEntity, DataHealthFields {
  inquiryId: string;
  customerId: string;
  contactId?: string;
  salesOwnerId?: string;

  // 产品信息
  brand?: string;
  mpn: string;
  description?: string;
  quantity: number;
  targetPrice?: number;
  currency?: string;

  // 时间约束
  requiredDate?: string;
  leadTimeDays?: number;

  // 状态与优先级
  status: InquiryStatus;
  priority: InquiryPriority;

  // AI 分析
  winProbability?: number;      // 0-100
  customerIntent?: string;
  aiSuggestion?: string;
  relatedOpportunityId?: string;

  // 原始输入
  rawContent?: string;
  rawAttachmentUrl?: string;
}

// ============================================================================
// Supply Resource Base (16_Supply_Resource_Base) — P0 核心表
// ============================================================================

export type SupplyResourceStatus =
  | 'New'
  | 'Parsing'
  | 'Verified'
  | 'Matched'
  | 'Quoted'
  | 'Won'
  | 'Expired'
  | 'Duplicate';

export interface SupplyResource extends ANOSEntity, DataHealthFields {
  resourceId: string;
  supplierId: string;
  procurementOwnerId?: string;

  // 产品信息
  brand: string;
  mpn: string;
  description?: string;
  dateCode?: string;
  packageType?: string;
  rohs?: boolean;

  // 库存与价格
  stockQty: number;
  price: number;
  currency?: string;
  leadTimeDays?: number;
  moq?: number;              // 最小起订量
  spq?: number;              // 标准包装数量

  // 评分
  resourceScore?: number;    // 0-100
  matchScore?: number;       // 0-100 与 Inquiry 的匹配度
  riskScore?: number;        // 0-100

  // 匹配关联
  matchedInquiryIds?: string[];
  matchedOpportunityId?: string;

  status: SupplyResourceStatus;
}

// ============================================================================
// Opportunity Base — P0 核心对象
// ============================================================================

export type OpportunityStatus = 'New' | 'Evaluating' | 'Quoting' | 'Won' | 'Lost' | 'Expired';

export interface Opportunity extends ANOSEntity {
  opportunityId: string;
  inquiryId: string;
  supplyResourceId: string;
  customerId: string;
  supplierId: string;

  // 匹配信息
  matchScore: number;            // 0-100
  matchScoreDetails?: MatchScoreBreakdown;
  estimatedMargin?: number;

  // 报价
  suggestedPrice?: number;
  suggestedLeadTimeDays?: number;

  // 状态
  status: OpportunityStatus;
  salesOwnerId?: string;
  procurementOwnerId?: string;

  // AI 建议
  aiRecommendation?: string;
  riskFlags?: string[];
}

/** 匹配评分细分 */
export interface MatchScoreBreakdown {
  modelMatch: number;    // 40% 型号匹配
  stockScore: number;    // 20% 库存
  priceScore: number;    // 15% 价格
  deliveryScore: number; // 15% 交期
  riskScore: number;     // 10% 风险
}

// ============================================================================
// Offer Base (12_Offer_Base) — P0 表
// ============================================================================

export type OfferStatus = 'Draft' | 'PendingApproval' | 'Approved' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';

export interface Offer extends ANOSEntity {
  offerId: string;
  inquiryId: string;
  customerId: string;
  supplierId?: string;
  supplyResourceId?: string;
  opportunityId?: string;

  // 产品
  brand: string;
  mpn: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  leadTimeDays?: number;

  // 毛利
  costPrice?: number;
  margin?: number;
  marginPercent?: number;

  // 状态
  status: OfferStatus;
  salesOwnerId?: string;
  validUntil?: string;

  // AI 建议
  aiSuggestedPrice?: number;
  aiPriceRationale?: string;
}

// ============================================================================
// SO Base (13_SO_Base) — P0 增强项
// ============================================================================

export type SOStatus = 'Open' | 'PartialShipped' | 'Shipped' | 'Delivered' | 'Invoiced' | 'Cancelled';

export interface SalesOrder extends ANOSEntity {
  soId: string;
  customerId: string;
  offerId?: string;
  inquiryId?: string;

  orderAmount: number;
  currency: string;
  orderDate: string;
  deliveryDate?: string;

  status: SOStatus;
  collectionRisk?: RiskLevel;
  marginPrediction?: number;
}
