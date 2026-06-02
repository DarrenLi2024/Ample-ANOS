/**
 * ANOS 通用字段类型定义
 * 基于 docs/20-ANOS企业数据字典V1.0.md 第1章
 *
 * 所有核心实体遵循 Source First + AI Governance + Timestamp 标准
 */

// ============================================================================
// 来源追踪字段 (Source First)
// ============================================================================

/** 来源类型枚举 — 对应数据字典 1.6 节 */
export type SourceType =
  | 'ERP'
  | 'Kingdee'
  | 'Email'
  | 'Feishu'
  | 'OpenClaw'
  | 'Aily'
  | 'API'
  | 'Manual'
  | 'WeChat'
  | 'WhatsApp'
  | 'Excel'
  | 'PDF'
  | 'Image'
  | 'AI';

/** 来源追踪字段 */
export interface SourceFields {
  /** 来源描述 */
  source: string;
  /** 来源类型 */
  sourceType: SourceType;
  /** 来源系统内部ID */
  sourceId?: string;
  /** 来源链接 */
  sourceUrl?: string;
  /** 来源负责人 */
  sourceOwner?: string;
}

// ============================================================================
// AI 治理字段
// ============================================================================

/** AI 治理字段 — 对应数据字典 1.7 节 */
export interface AIFields {
  /** 是否由AI生成 */
  aiGenerated: boolean;
  /** 是否由AI修改 */
  aiModified: boolean;
  /** AI置信度 0-100 */
  aiConfidence: number;
  /** AI洞察摘要 */
  aiInsight?: string;
  /** AI标签 */
  aiTags?: string[];
  /** 是否经人工确认 */
  humanVerified: boolean;
  /** 人工确认人 */
  verifiedBy?: string;
}

// ============================================================================
// 时间戳字段
// ============================================================================

/** 时间戳字段 — 对应数据字典 1.5 节 (UTC+8 Asia/Shanghai) */
export interface TimestampFields {
  /** 创建时间 (ANOS记录时间) */
  createdAt: string; // ISO 8601
  /** 更新时间 */
  updatedAt: string; // ISO 8601
  /** 业务事件发生时间 */
  eventTime: string; // ISO 8601
  /** 最近业务活动时间 */
  lastActivityAt?: string; // ISO 8601
}

// ============================================================================
// 通用实体基类
// ============================================================================

/** 所有 ANOS 核心实体必须实现的基类型 */
export interface ANOSEntity extends SourceFields, AIFields, TimestampFields {
  /** 实体全局唯一ID */
  id: string;
  /** 业务编码 */
  code?: string;
  /** 实体状态 */
  status: EntityStatus;
  /** 创建人 */
  createdBy?: string;
  /** 最后修改人 */
  updatedBy?: string;
}

/** 实体状态枚举 */
export type EntityStatus =
  | 'Draft'
  | 'Active'
  | 'Inactive'
  | 'Archived'
  | 'Deleted'
  | 'Pending'
  | 'Confirmed'
  | 'Rejected';

// ============================================================================
// 数据健康度
// ============================================================================

/** 数据健康度评分 */
export type DataHealthLevel = 'Healthy' | 'Fair' | 'NeedsGovernance';

export interface DataHealthFields {
  /** 数据健康度分数 0-100 */
  dataHealthScore: number;
  /** 数据健康度等级 */
  dataHealthLevel: DataHealthLevel;
}
