/**
 * 简易认证中间件 — P0 阶段基于角色头
 * 生产环境应替换为 JWT/OAuth/飞书 SSO
 */
import type { Context, Next } from 'hono';
import type { Role } from '@anos/shared';

export interface AuthenticatedUser {
  userId: string;
  name: string;
  role: Role;
  department: string;
}

/** 从请求头提取用户上下文 */
export function extractUser(c: Context): AuthenticatedUser {
  return {
    userId: c.req.header('X-User-Id') || 'anonymous',
    name: c.req.header('X-User-Name') || 'Anonymous',
    role: (c.req.header('X-User-Role') || 'Sales') as Role,
    department: c.req.header('X-User-Dept') || 'Unknown',
  };
}

/** 简易认证中间件 */
export async function auth(c: Context, next: Next) {
  c.set('user', extractUser(c));
  await next();
}

/** 角色守卫中间件工厂 */
export function requireRole(...roles: Role[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as AuthenticatedUser;
    if (!roles.includes(user.role)) {
      return c.json({ error: 'Forbidden', message: `Role ${user.role} not authorized` }, 403);
    }
    await next();
  };
}
