/**
 * ANOS 主数据层 (L0) 类型定义
 * 基于 docs/20-ANOS企业数据字典V1.0.md 第2章
 * 与 docs/42-ANOS数据中台建表蓝图 V1.0.md 第2章对齐
 */

import type { ANOSEntity, DataHealthFields, EntityStatus } from './common';

// ============================================================================
// Customer Base (01_Customer_Base)
// ============================================================================

export type CustomerType = 'EndUser' | 'Distributor' | 'OEM' | 'ODM' | 'Broker' | 'Other';
export type CustomerLevel = 'S' | 'A' | 'B' | 'C' | 'D';
export type CreditLevel = 'AAA' | 'AA' | 'A' | 'B' | 'C' | 'D' | 'N/A';
export type PaymentMethod = 'T/T' | 'L/C' | 'Net30' | 'Net60' | 'Cash' | 'Other';
export type RiskLevel = 'L1_Low' | 'L2_Watch' | 'L3_Warning' | 'L4_High';

export interface Customer extends ANOSEntity, DataHealthFields {
  // 基础信息
  customerId: string;
  customerCode: string;
  customerName: string;
  customerShortName?: string;
  country: string;
  city?: string;
  address?: string;
  website?: string;

  // 商业属性
  customerType: CustomerType;
  industry?: string;
  customerLevel: CustomerLevel;
  creditLevel: CreditLevel;
  creditLimit?: number;
  paymentTerm: string;
  paymentMethod: PaymentMethod;
  currency: string;

  // 销售属性
  accountOwner?: string;
  accountOwnerId?: string;
  leadSource?: string;
  firstOrderDate?: string;
  lastOrderDate?: string;
  lastContactAt?: string;

  // AI 属性
  customerScore?: number;   // 0-100
  winRate?: number;         // 0-100
  riskLevel: RiskLevel;
  tags?: string[];
  growthPotential?: 'High' | 'Medium' | 'Low';

  // 关联统计
  rfgCount?: number;
  orderCount?: number;
  totalOrderAmount?: number;
  arOutstanding?: number;
}

// ============================================================================
// Contact Base (02_Contact_Base)
// ============================================================================

export type DecisionLevel = 'Executive' | 'Manager' | 'Staff' | 'Unknown';

export interface Contact extends ANOSEntity {
  contactId: string;
  customerId: string;
  name: string;
  title?: string;
  department?: string;
  email?: string;
  mobile?: string;
  wechat?: string;
  linkedIn?: string;
  influenceScore?: number;  // 0-100
  activityScore?: number;   // 0-100
  decisionLevel: DecisionLevel;
  isPrimary: boolean;
}

// ============================================================================
// Supplier Base (03_Supplier_Base)
// ============================================================================

export type SupplierType = 'Manufacturer' | 'AuthorizedDistributor' | 'IndependentDistributor' | 'Broker' | 'Other';
export type AuthorizationStatus = 'Authorized' | 'Unauthorized' | 'Unknown';

export interface Supplier extends ANOSEntity, DataHealthFields {
  // 基础信息
  supplierId: string;
  supplierCode: string;
  supplierName: string;
  supplierEnglishName?: string;
  country: string;
  website?: string;

  // 商业属性
  supplierType: SupplierType;
  authorizationStatus: AuthorizationStatus;
  paymentMethod: PaymentMethod;
  paymentTerm?: string;
  preferredBrands?: string[];
  preferredProductLines?: string[];

  // AI 属性
  supplierScore?: number;       // 0-100
  priceScore?: number;          // 0-100
  qualityScore?: number;        // 0-100
  riskScore?: number;           // 0-100
  deliveryReliability?: number; // 0-100

  // 关联统计
  supplyResourceCount?: number;
  successfulOrders?: number;
  disputeCount?: number;
}

// ============================================================================
// Product Base (04_Product_Base)
// ============================================================================

export type ProductLifecycle = 'Active' | 'NRND' | 'EOL' | 'Obsolete' | 'Unknown';
export type PackageType = 'QFN' | 'BGA' | 'LQFP' | 'TSSOP' | 'SOP' | 'SOT' | 'QFP' | 'Other';

export interface Product extends ANOSEntity, DataHealthFields {
  productId: string;
  brand: string;
  brandId?: string;
  mpn: string;
  description?: string;
  category?: string;
  subCategory?: string;
  packageType: PackageType;
  lifecycle: ProductLifecycle;
  rohs: boolean;
  isDomestic: boolean;

  // AI 属性
  heatIndex?: number;           // 热度 0-100
  shortageIndex?: number;       // 缺货指数 0-100
  localizationIndex?: number;   // 国产替代指数 0-100
  lifecycleRisk?: RiskLevel;
}

// ============================================================================
// Brand Base (05_Brand_Base)
// ============================================================================

export interface Brand extends ANOSEntity {
  brandId: string;
  brandName: string;
  brandShortName?: string;
  manufacturer: string;
  country: string;
  website?: string;
  isDomestic: boolean;
  popularityIndex?: number;
  localizationIndex?: number;
}

// ============================================================================
// 通用枚举常量
// ============================================================================

export const CUSTOMER_LEVELS: CustomerLevel[] = ['S', 'A', 'B', 'C', 'D'];
export const CREDIT_LEVELS: CreditLevel[] = ['AAA', 'AA', 'A', 'B', 'C', 'D', 'N/A'];
export const RISK_LEVELS: RiskLevel[] = ['L1_Low', 'L2_Watch', 'L3_Warning', 'L4_High'];
export const PRODUCT_LIFECYCLE: ProductLifecycle[] = ['Active', 'NRND', 'EOL', 'Obsolete', 'Unknown'];
export const AUTHORIZATION_STATUSES: AuthorizationStatus[] = ['Authorized', 'Unauthorized', 'Unknown'];
