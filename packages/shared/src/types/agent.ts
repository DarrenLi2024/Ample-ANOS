/**
 * ANOS Agent 与事件层 (L5) 类型定义
 * 基于 docs/45-Agent操作系统规范 V1.0.md
 * 与 docs/42-ANOS数据中台建表蓝图 V1.0.md 第7章对齐
 * 与 docs/85-MCP服务规范 V1.0.md 对齐
 */

import type { SourceType } from './common';

// ============================================================================
// Agent Registry
// ============================================================================

export type AgentType = 'Sales' | 'Procurement' | 'Credit' | 'Knowledge' | 'Risk' | 'CEO';
export type AgentLevel = 'L1_Rule' | 'L2_Knowledge' | 'L3_Reasoning' | 'L4_Collaborative' | 'L5_Autonomous';
export type AgentStatus = 'Online' | 'Busy' | 'WaitingApproval' | 'Error' | 'Offline';

export interface Agent {
  agentId: string;
  agentName: string;
  agentType: AgentType;
  department: string;
  ownerId: string;
  level: AgentLevel;
  status: AgentStatus;
  promptVersion?: string;
  modelVersion?: string;
  capabilities: string[];
  restrictions: string[];
  currentTaskCount?: number;
  completedTaskCount?: number;
  lastActiveAt?: string;
}

// ============================================================================
// Agent Task
// ============================================================================

export type TaskStatus = 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Cancelled' | 'AwaitingApproval';

export interface AgentTask {
  taskId: string;
  agentId: string;
  taskType: string;
  requestId: string;
  input: string;
  output?: string;
  status: TaskStatus;
  confidenceScore?: number;
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  executionTimeMs?: number;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
}

// ============================================================================
// Agent Tool Registry (MCP)
// ============================================================================

export type ToolRiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface AgentTool {
  toolId: string;
  toolName: string;
  description: string;
  toolType: 'Data' | 'Knowledge' | 'Workflow' | 'Communication';
  ownerId: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  permissionScope: AgentType[];
  auditRequired: boolean;
  riskLevel: ToolRiskLevel;
  status: 'Active' | 'Inactive' | 'Deprecated';
}

// ============================================================================
// MCP Tool Call / Response
// ============================================================================

export interface MCPRequest {
  actor: {
    type: 'Agent' | 'Human';
    id: string;
  };
  requestId: string;
  toolName: string;
  source: SourceType;
  payload: Record<string, unknown>;
}

export interface MCPResponse {
  success: boolean;
  data?: unknown;
  evidence: string;
  source: string;
  confidence: number;
  auditId: string;
  errors?: string[];
  requiresApproval?: boolean;
}

// ============================================================================
// Agent Audit Log
// ============================================================================

export interface AgentAuditLog {
  auditId: string;
  agentId: string;
  taskId: string;
  userId?: string;
  input: string;
  output: string;
  source: string;
  timestamp: string;
  modelVersion?: string;
  promptVersion?: string;
  outcome: TaskStatus;
  evidenceLinks?: string[];
}

// ============================================================================
// Agent Output Standard
// ============================================================================

/** Agent 输出标准结构 — 对应 Agent OS 规范 第9章 */
export interface AgentOutput {
  /** 执行摘要 */
  executiveSummary: string;
  /** 依据列表 */
  evidence: string[];
  /** 来源 */
  source: string;
  /** 生成时间 */
  timestamp: string;
  /** 可信度 0-100 */
  confidence: number;
  /** 建议动作 */
  recommendedActions: RecommendedAction[];
  /** 风险等级 */
  risk: 'Low' | 'Medium' | 'High';
  /** 是否需要人工确认 */
  humanApprovalRequired: boolean;
  /** 审计ID */
  auditId: string;
}

export interface RecommendedAction {
  label: string;
  action: string;
  risk: 'Low' | 'Medium' | 'High';
  autoExecutable: boolean;
}

// ============================================================================
// Human Approval
// ============================================================================

export type ApprovalAction = 'Approve' | 'Reject' | 'Modify' | 'Escalate';

export interface Approval {
  approvalId: string;
  taskId: string;
  agentId: string;
  targetType: string;
  targetId: string;
  aiSuggestion: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Escalated';
  requestedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  comment?: string;
  action?: ApprovalAction;
}
