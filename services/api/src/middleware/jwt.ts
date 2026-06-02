/**
 * JWT 认证中间件
 * Phase 1: 开发模式 + HMAC-SHA256 签名
 * Phase 2: 对接飞书 SSO 后，OAuth 回调签发 JWT
 */
import type { Context, Next } from 'hono';
import { createHmac } from 'node:crypto';
import type { Role } from '@anos/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'anos-dev-secret-change-in-production';
const TOKEN_EXPIRY = parseInt(process.env.JWT_EXPIRY_SECONDS || '86400', 10); // 默认 24h

export interface JwtPayload {
  sub: string;           // 用户ID
  name: string;          // 用户姓名
  role: Role;            // ANOS角色
  department: string;    // 部门
  iat: number;           // 签发时间
  exp: number;           // 过期时间
}

function base64url(str: string): string {
  return Buffer.from(str).toString('base64url');
}

function base64urlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf-8');
}

function sign(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

/** 签发 JWT Token */
export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + TOKEN_EXPIRY,
  };

  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(fullPayload));
  const signature = sign(`${header}.${body}`, JWT_SECRET);

  return `${header}.${body}.${signature}`;
}

/** 验证 JWT Token */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const parts = token.replace('Bearer ', '').split('.');
    if (parts.length !== 3) return null;

    const [headerB64, bodyB64, sigB64] = parts as [string, string, string];
    const expectedSig = sign(`${headerB64}.${bodyB64}`, JWT_SECRET);

    if (sigB64 !== expectedSig) return null;

    const payload = JSON.parse(base64urlDecode(bodyB64)) as JwtPayload;

    // 检查过期
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/** JWT 认证中间件 */
export async function jwtAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  // 开发回退: 如果没有 JWT，检查旧的 X-User-Role header
  if (!authHeader) {
    const devRole = c.req.header('X-User-Role');
    if (devRole && process.env.NODE_ENV !== 'production') {
      c.set('user', {
        userId: c.req.header('X-User-Id') || 'dev-user',
        name: c.req.header('X-User-Name') || 'Dev User',
        role: devRole as Role,
        department: c.req.header('X-User-Dept') || 'Development',
        authMethod: 'dev-header',
      });
      return next();
    }
    return c.json({ error: { code: 'UNAUTHORIZED', message: '缺少认证 Token' } }, 401);
  }

  const payload = verifyToken(authHeader);

  if (!payload) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Token 无效或已过期' } }, 401);
  }

  c.set('user', {
    userId: payload.sub,
    name: payload.name,
    role: payload.role,
    department: payload.department,
    authMethod: 'jwt',
  });

  await next();
}

/** 角色守卫中间件工厂 */
export function requireRole(...roles: Role[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as { role: Role } | undefined;
    if (!user || !roles.includes(user.role)) {
      return c.json({
        error: { code: 'FORBIDDEN', message: `角色 ${user?.role || 'unknown'} 无权限` },
      }, 403);
    }
    await next();
  };
}
