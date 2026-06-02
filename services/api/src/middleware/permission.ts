/**
 * 权限控制中间件 — 角色守卫 + 字段级脱敏
 * 基于 docs/25-权限与审计规范 V1.0.md + packages/shared/src/types/permission.ts
 */
import type { Context, Next } from 'hono';
import type { Role } from '@anos/shared';
import type { AuthenticatedUser } from './auth';

/**
 * 角色守卫中间件工厂 — 限制特定角色访问路由
 */
export function requireRole(...roles: Role[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as AuthenticatedUser;
    if (!user || !roles.includes(user.role)) {
      return c.json(
        {
          error: 'Forbidden',
          message: `角色 ${user?.role || 'unknown'} 无权限访问此资源`,
          requiredRoles: roles,
        },
        403,
      );
    }
    await next();
  };
}

/**
 * 字段级脱敏 — 根据当前用户角色过滤返回数据的敏感字段
 * 用于 GET 请求的响应处理
 */
const SENSITIVE_FIELDS_BY_ROLE: Record<string, string[]> = {
  // 采购不能看客户敏感信息
  Customer: {
    Procurement: ['customerName', 'customerShortName', 'creditLimit', 'arOutstanding'],
    Operations: ['customerName', 'customerShortName'],
    CEO: [], // CEO 可聚合查看
  },
  // 销售不能看供应商敏感信息
  Supplier: {
    Sales: ['supplierName', 'supplierEnglishName', 'contactInfo'],
    Risk: ['supplierName'],
    Operations: ['supplierName', 'supplierEnglishName'],
  },
  // 通用—隐藏成本
  Offer: {
    Sales: [], // 销售可见
    Procurement: [],
    Risk: ['costPrice'],
    Operations: ['costPrice'],
    CEO: ['costPrice'],
  },
};

function redactValue(val: unknown): string {
  if (typeof val === 'string') return '●●●●';
  if (typeof val === 'number') return '●●●●';
  return '●●●●';
}

export function redactFields(
  data: Record<string, unknown> | Record<string, unknown>[],
  objectType: string,
  role: Role,
): typeof data {
  const roleFields = SENSITIVE_FIELDS_BY_ROLE[objectType] || {};
  const fieldsToRedact: string[] = roleFields[role] || [];

  if (fieldsToRedact.length === 0) return data;

  if (Array.isArray(data)) {
    return data.map((item) => {
      const redacted = { ...item };
      for (const field of fieldsToRedact) {
        if (field in redacted) {
          (redacted as Record<string, unknown>)[field] = redactValue(redacted[field]);
        }
      }
      return redacted;
    });
  }

  const redacted = { ...data };
  for (const field of fieldsToRedact) {
    if (field in redacted) {
      (redacted as Record<string, unknown>)[field] = redactValue(redacted[field]);
    }
  }
  return redacted;
}
