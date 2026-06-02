/**
 * ANOS 知识源 + Agent Skill 类型定义
 * 
 * Skill = 封装了特定领域知识 + 检索逻辑的 Agent 可调用模块
 * 上线后每个 Skill 可通过 MCP 工具被 Agent 在会话中智能调用
 */

import type { SourceType } from './common';

// ============================================================================
// Knowledge Source (知识源)
// ============================================================================

/** 知识源类型 — 对应 P0 确认表中的 4 类知识源 */
export type KnowledgeSourceType =
  | 'SalesSOP'        // 销售 SOP
  | 'ProcurementSOP'  // 采购 SOP
  | 'RiskRules'       // 风控/回款规则
  | 'ProductKnowledge' // 产品知识库
  | 'MarketIntel'     // 市场情报
  | 'Compliance';     // 合规制度

export interface KnowledgeSource {
  sourceId: string;
  sourceType: KnowledgeSourceType;
  title: string;
  description: string;
  /** 飞书知识库 URL */
  feishuUrl?: string;
  /** 本地缓存路径 */
  localPath?: string;
  /** 文档数量 */
  documentCount: number;
  /** 最后同步时间 */
  lastSyncedAt?: string;
  /** 状态 */
  status: 'Active' | 'Syncing' | 'Stale' | 'Unavailable';
  /** 负责部门 */
  ownerDepartment: string;
  /** 负责人 */
  ownerId: string;
}

// ============================================================================
// Agent Skill (Agent 可调用的技能模块)
// ============================================================================

/** Skill 类型 */
export type SkillType =
  | 'search'          // 语义搜索
  | 'qa'              // 问答
  | 'extract'         // 信息提取
  | 'summarize'       // 摘要
  | 'recommend'       // 推荐
  | 'classify';       // 分类

export interface AgentSkill {
  skillId: string;
  skillName: string;
  skillType: SkillType;
  /** 绑定的知识源 */
  knowledgeSources: KnowledgeSourceType[];
  /** 关联的 Agent 类型 */
  usedByAgents: string[];
  /** 触发词（用户输入匹配） */
  triggerKeywords: string[];
  /** Skill 描述（给 Agent 看的 system prompt 片段） */
  systemPrompt: string;
  /** 调用示例 */
  examples: string[];
  /** MCP 工具名 */
  mcpToolName: string;
  /** 状态 */
  status: 'Active' | 'Inactive' | 'Development';
  /** 是否需要人工确认 */
  requiresApproval: boolean;
}

// ============================================================================
// Knowledge Query (Agent 调用知识库的请求/响应)
// ============================================================================

export interface KnowledgeQuery {
  query: string;
  sourceTypes?: KnowledgeSourceType[];
  maxResults?: number;
  minConfidence?: number;
}

export interface KnowledgeResult {
  content: string;
  sourceType: KnowledgeSourceType;
  sourceTitle: string;
  sourceUrl?: string;
  confidence: number;
  retrievedAt: string;
  /** 引用片段 */
  citations: string[];
}

export interface KnowledgeResponse {
  query: string;
  results: KnowledgeResult[];
  totalFound: number;
  searchTimeMs: number;
  /** AI 基于检索结果生成的综合回答 */
  synthesizedAnswer?: string;
}
