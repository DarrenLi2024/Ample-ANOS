/**
 * 安全 HTTP 响应头中间件
 * OWASP 推荐的安全头配置
 */
import type { Context, Next } from 'hono';

export async function securityHeaders(c: Context, next: Next) {
  await next();

  // Content Security Policy
  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'");

  // 禁止 MIME 类型嗅探
  c.header('X-Content-Type-Options', 'nosniff');

  // 禁止页面被嵌入 iframe
  c.header('X-Frame-Options', 'DENY');

  // XSS 过滤器
  c.header('X-XSS-Protection', '0');

  // 引用策略
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 权限策略
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // HSTS (仅生产环境 HTTPS)
  if (process.env.NODE_ENV === 'production') {
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
}
