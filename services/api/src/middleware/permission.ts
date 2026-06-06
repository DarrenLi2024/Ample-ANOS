/**
 * 权限控制中间件 — 角色守卫 + 字段级脱敏
 * 基于 GA-010 交易防火墙 + GA-011 角色权限与信息隔离矩阵
 * 
 * 核心原则:
 *   - 采购: 只能看到 Sales 名字 + 客户编码，禁止看客户名/联系人
 *   - 销售: 只能看到供应商编码，禁止看供应商名/联系人/成本价
 *   - 风控: 可按需查看客户信息，禁止看供应商信息
 *   - CEO: 全量可见但全部审计
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
 * 买家(Buyer/Procurement) 角色集合
 */
const BUYER_ROLES: Role[] = ['Procurement', 'ProcurementManager'];

/**
 * 销售(Sales) 角色集合
 */
const SALES_ROLES: Role[] = ['Sales', 'SalesManager'];

/**
 * 风控(Risk) 角色集合
 */
const RISK_ROLES: Role[] = ['Risk'];

// ============================================================================
// 字段级脱敏 — 根据当前用户角色过滤返回数据的敏感字段
// ============================================================================
interface RedactRule {
  /** 角色 -> 需要脱敏的字段列表 */
  [role: string]: string[];
}

const SENSITIVE_FIELDS_BY_ROLE: Record<string, RedactRule> = {
  // ==========================================================
  // Customer 表 — 采购和风控禁止看客户敏感信息
  // ==========================================================
  Customer: {
    Procurement: [
      'customerName', 'customerShortName', 'customer_code',
      'contactInfo', 'contactName', 'contactPhone', 'contactEmail',
      'creditLimit', 'creditLevel',
      'arOutstanding', 'totalOrderAmount',
      'paymentTerm', 'address',
    ],
    ProcurementManager: [
      'customerName', 'customerShortName', 'customer_code',
      'contactName', 'contactPhone', 'contactEmail',
    ],
    Risk: [
      'contactName', 'contactPhone', 'contactEmail',
    ],
    Operations: ['customerName', 'customerShortName'],
    CEO: [], // CEO 全量可见
  },

  // ==========================================================
  // Supplier 表 — 销售和风控禁止看供应商敏感信息
  // ==========================================================
  Supplier: {
    Sales: [
      'supplierName', 'supplierEnglishName', 'supplier_code',
      'contactName', 'contactPhone', 'contactEmail',
      'preferredBrands', 'preferredProductLines',
    ],
    SalesManager: [
      'supplierName', 'supplierEnglishName', 'supplier_code',
      'contactName', 'contactPhone', 'contactEmail',
    ],
    Risk: [
      'supplierName', 'contactName', 'contactPhone', 'contactEmail',
    ],
    Operations: ['supplierName', 'supplierEnglishName'],
    CEO: [],
  },

  // ==========================================================
  // Inquiry 表 — 采购看询价时禁止看客户名，只能看Sales名+客户编码
  // ==========================================================
  Inquiry: {
    Procurement: [
      // 采购不能看到真实客户名，但可以看到 customer_id (编码) 和 sales_owner
      // customer_id 保留，customer_name 如果在返回中则脱敏
      'customerName', 'customerShortName',
    ],
    ProcurementManager: [
      'customerName', 'customerShortName',
    ],
    CEO: [],
    Sales: [],  // 销售看自己的询价部分
  },

  // ==========================================================
  // SupplyResource 表 — 销售看供应资源时禁止看供应商名/成本
  // ==========================================================
  SupplyResource: {
    Sales: [
      'supplierName', 'supplierShortName',
      'contactName', 'contactPhone', 'contactEmail',
      'costPrice', 'internalNote',
    ],
    SalesManager: [
      'supplierName', 'supplierShortName',
      'contactName', 'contactPhone', 'contactEmail',
    ],
    CEO: [],
    Procurement: [],
  },

  // ==========================================================
  // Offer 表 — 成本价脱敏
  // ==========================================================
  Offer: {
    Sales: [],
    Procurement: [],
    SalesManager: [],
    ProcurementManager: [],
    Risk: ['costPrice', 'margin', 'marginPercent'],
    Operations: ['costPrice', 'margin', 'marginPercent'],
    CEO: [],
  },

  // ==========================================================
  // AR 表 — 采购不关心，销售也有限
  // ==========================================================
  AR: {
    Procurement: ['customerName', 'customerId'],
    ProcurementManager: ['customerName'],
    Sales: [],  // 销售可看自己客户的AR
    CEO: [],
  },

  // ==========================================================
  // Opportunity 表 — 跨域匹配结果：双方都不能看到对方原始域数据
  // ==========================================================
  Opportunity: {
    Sales: [
      // 销售看到 MatchResult 但禁止看 Supplier Name/Source Person
      'supplierName', 'supplierId',
    ],
    Procurement: [
      // 采购看到 MatchResult 但禁止看 Customer Name
      'customerName', 'customerId',
    ],
    CEO: [],
  },
};

/**
 * 判断是否为买家角色
 */
export function isBuyerRole(role: Role): boolean {
  return BUYER_ROLES.includes(role);
}

/**
 * 判断是否为销售角色
 */
export function isSalesRole(role: Role): boolean {
  return SALES_ROLES.includes(role);
}

/**
 * 判断是否为风控角色
 */
export function isRiskRole(role: Role): boolean {
  return RISK_ROLES.includes(role);
}

/**
 * 获取用户可见的角色标签 (用于前端展示)
 */
export function getUserVisibleRole(user: AuthenticatedUser): {
  visibleRole: 'Sales' | 'Buyer' | 'Risk' | 'CEO' | 'Admin' | 'Unknown';
  canCreateInquiry: boolean;
  canCreateOffer: boolean;
  canSeeCustomerNames: boolean;
  canSeeSupplierNames: boolean;
} {
  if (isBuyerRole(user.role)) {
    return {
      visibleRole: 'Buyer',
      canCreateInquiry: false,
      canCreateOffer: true,
      canSeeCustomerNames: false,
      canSeeSupplierNames: true,
    };
  }
  if (isSalesRole(user.role)) {
    return {
      visibleRole: 'Sales',
      canCreateInquiry: true,
      canCreateOffer: false,
      canSeeCustomerNames: true,
      canSeeSupplierNames: false,
    };
  }
  if (isRiskRole(user.role)) {
    return {
      visibleRole: 'Risk',
      canCreateInquiry: false,
      canCreateOffer: false,
      canSeeCustomerNames: true,
      canSeeSupplierNames: false,
    };
  }
  if (user.role === 'CEO') {
    return {
      visibleRole: 'CEO',
      canCreateInquiry: false,
      canCreateOffer: false,
      canSeeCustomerNames: true,
      canSeeSupplierNames: true,
    };
  }
  return {
    visibleRole: 'Unknown',
    canCreateInquiry: false,
    canCreateOffer: false,
    canSeeCustomerNames: false,
    canSeeSupplierNames: false,
  };
}

function redactValue(val: unknown): string {
  if (typeof val === 'string') return '●●●●';
  if (typeof val === 'number') return 0;
  return '●●●●';
}

/**
 * 字段级脱敏 — 递归处理 object / array
 */
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
