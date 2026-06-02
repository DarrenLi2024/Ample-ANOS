/**
 * ANOS 权限与审计类型定义
 * 基于 docs/25-权限与审计规范 V1.0.md
 * 与 docs/design.md 第6章对齐
 */

// ============================================================================
// 角色定义
// ============================================================================

export type Role =
  | 'Sales'
  | 'Procurement'
  | 'Risk'
  | 'Operations'
  | 'SystemAdmin'
  | 'CEO';

/** 角色友好名称 */
export const ROLE_LABELS: Record<Role, string> = {
  Sales: '销售',
  Procurement: '采购',
  Risk: '风控/财务',
  Operations: '运营/系统',
  SystemAdmin: '系统管理员',
  CEO: '管理层',
};

// ============================================================================
// 字段类别 (用于 RoleAwareField 脱敏映射)
// ============================================================================

export type FieldCategory =
  | 'CustomerName'
  | 'CustomerCredit'
  | 'SupplierName'
  | 'ProcurementCost'
  | 'SourceUrl'
  | 'AgentReasoning';

/** 字段展示策略 */
export type FieldDisplayMode =
  | 'Plaintext'       // 明文
  | 'Redacted'        // 完全隐藏 ●●●●
  | 'RedactedAsId'    // 脱敏为业务ID (如 C-10293)
  | 'RedactedAsRange' // 区间化
  | 'RedactedAsSummary' // 摘要化
  | 'Hidden';         // 完全不可见

// ============================================================================
// 角色 × 字段权限矩阵
// ============================================================================

/** 权限矩阵 — 与 design.md 第6章完全对齐 */
export const FIELD_PERMISSION_MATRIX: Record<FieldCategory, Record<Role, FieldDisplayMode>> = {
  CustomerName: {
    Sales: 'Plaintext',
    Procurement: 'RedactedAsId',
    Risk: 'Plaintext',
    Operations: 'RedactedAsId',
    SystemAdmin: 'Plaintext',
    CEO: 'RedactedAsSummary',
  },
  CustomerCredit: {
    Sales: 'RedactedAsSummary',
    Procurement: 'Hidden',
    Risk: 'Plaintext',
    Operations: 'Hidden',
    SystemAdmin: 'Plaintext',
    CEO: 'RedactedAsSummary',
  },
  SupplierName: {
    Sales: 'RedactedAsId',
    Procurement: 'Plaintext',
    Risk: 'Hidden',
    Operations: 'RedactedAsId',
    SystemAdmin: 'Plaintext',
    CEO: 'RedactedAsSummary',
  },
  ProcurementCost: {
    Sales: 'RedactedAsRange',
    Procurement: 'Plaintext',
    Risk: 'Hidden',
    Operations: 'Hidden',
    SystemAdmin: 'Plaintext',
    CEO: 'Hidden',
  },
  SourceUrl: {
    Sales: 'Plaintext',
    Procurement: 'Plaintext',
    Risk: 'RedactedAsSummary',
    Operations: 'RedactedAsSummary',
    SystemAdmin: 'Plaintext',
    CEO: 'RedactedAsSummary',
  },
  AgentReasoning: {
    Sales: 'Plaintext',
    Procurement: 'Plaintext',
    Risk: 'Plaintext',
    Operations: 'RedactedAsSummary',
    SystemAdmin: 'Plaintext',
    CEO: 'RedactedAsSummary',
  },
};

// ============================================================================
// 审计日志
// ============================================================================

export type AuditAction =
  | 'Create'
  | 'Update'
  | 'Delete'
  | 'View'
  | 'Export'
  | 'Approve'
  | 'Reject'
  | 'AgentCall'
  | 'PermissionChange'
  | 'WorkflowRun';

export interface AuditLog {
  auditId: string;
  objectType: string;     // 如 'Customer', 'Inquiry', 'Offer'
  objectId: string;
  action: AuditAction;
  actor: string;          // 操作人ID
  actorRole: Role;
  field?: string;
  oldValue?: string;
  newValue?: string;
  source?: string;
  evidenceId?: string;
  timestamp: string;      // ISO 8601 UTC+8
  ipAddress?: string;
  userAgent?: string;
}
