/**
 * CSRF 防护中间件
 * 基于 Origin/Referer 头校验 (适用于 SPA + API 架构)
 * 生产环境建议同时使用 CSRF Token（双提交 Cookie 模式）
 */
import type { Context, Next } from 'hono';

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export async function csrfProtection(c: Context, next: Next) {
  // 安全方法跳过
  if (SAFE_METHODS.has(c.req.method)) {
    return next();
  }

  const origin = c.req.header('Origin');
  const referer = c.req.header('Referer');

  // 无 Origin 且无 Referer 的请求（如 curl/脚本），在开发环境允许
  if (!origin && !referer) {
    if (process.env.NODE_ENV === 'production') {
      return c.json({ error: 'CSRF Validation Failed', message: 'Missing Origin/Referer header' }, 403);
    }
    return next();
  }

  const requestOrigin = origin || (referer ? new URL(referer).origin : null);

  if (!requestOrigin) {
    return c.json({ error: 'CSRF Validation Failed', message: 'Invalid origin' }, 403);
  }

  const isAllowed = ALLOWED_ORIGINS.some((allowed) => {
    if (allowed === '*') return true;
    return requestOrigin === allowed.trim();
  });

  if (!isAllowed) {
    return c.json({ error: 'CSRF Validation Failed', message: `Origin ${requestOrigin} not allowed` }, 403);
  }

  await next();
}
