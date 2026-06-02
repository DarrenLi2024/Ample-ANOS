import { describe, it, expect } from 'vitest';
import { FIELD_PERMISSION_MATRIX, ROLE_LABELS } from '@anos/shared';

describe('权限矩阵完整性', () => {
  const roles = ['Sales', 'Procurement', 'Risk', 'Operations', 'SystemAdmin', 'CEO'] as const;
  const fieldCategories = ['CustomerName', 'CustomerCredit', 'SupplierName', 'ProcurementCost', 'SourceUrl', 'AgentReasoning'] as const;

  it('应覆盖所有 6 种角色', () => {
    expect(Object.keys(ROLE_LABELS)).toHaveLength(6);
    roles.forEach((role) => {
      expect(ROLE_LABELS[role]).toBeDefined();
    });
  });

  it('应覆盖所有 6 种字段类别', () => {
    expect(Object.keys(FIELD_PERMISSION_MATRIX)).toHaveLength(6);
    fieldCategories.forEach((fc) => {
      expect(FIELD_PERMISSION_MATRIX[fc]).toBeDefined();
    });
  });

  it('每种类别应定义 6 个角色的权限 (36 cells)', () => {
    fieldCategories.forEach((fc) => {
      roles.forEach((role) => {
        expect(FIELD_PERMISSION_MATRIX[fc][role]).toBeDefined();
      });
    });
  });

  it('有效的权限值应为 Plaintext/Redacted/RedactedAsId/RedactedAsRange/RedactedAsSummary/Hidden', () => {
    const validModes = ['Plaintext', 'Redacted', 'RedactedAsId', 'RedactedAsRange', 'RedactedAsSummary', 'Hidden'];
    fieldCategories.forEach((fc) => {
      roles.forEach((role) => {
        expect(validModes).toContain(FIELD_PERMISSION_MATRIX[fc][role]);
      });
    });
  });

  it('销售应对采购成本隐藏或脱敏', () => {
    const mode = FIELD_PERMISSION_MATRIX.ProcurementCost.Sales;
    expect(['RedactedAsRange', 'Hidden']).toContain(mode);
  });

  it('采购应对客户名称脱敏', () => {
    const mode = FIELD_PERMISSION_MATRIX.CustomerName.Procurement;
    expect(mode).toBe('RedactedAsId');
  });

  it('系统管理员应对所有字段明文可见', () => {
    fieldCategories.forEach((fc) => {
      expect(FIELD_PERMISSION_MATRIX[fc].SystemAdmin).toBe('Plaintext');
    });
  });
});

describe('角色友好名称', () => {
  it('应包含中文友好名称', () => {
    expect(ROLE_LABELS.Sales).toBe('销售');
    expect(ROLE_LABELS.Procurement).toBe('采购');
    expect(ROLE_LABELS.Risk).toBe('风控/财务');
    expect(ROLE_LABELS.SystemAdmin).toBe('系统管理员');
    expect(ROLE_LABELS.CEO).toBe('管理层');
    expect(ROLE_LABELS.Operations).toBe('运营/系统');
  });
});
