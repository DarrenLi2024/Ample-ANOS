/**
 * 简易速率限制中间件（内存实现）
 * 生产环境建议替换为 Redis 实现
 */
import type { Context, Next } from 'hono';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10); // 1 分钟
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || '100', 10); // 每窗口 100 次

// 定期清理过期条目
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000).unref();

export async function rateLimiter(c: Context, next: Next) {
  const ip = c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'unknown';
  const key = `rate:${ip}`;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(key, entry);
  }

  entry.count++;

  c.header('X-RateLimit-Limit', String(MAX_REQUESTS));
  c.header('X-RateLimit-Remaining', String(Math.max(0, MAX_REQUESTS - entry.count)));
  c.header('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));

  if (entry.count > MAX_REQUESTS) {
    return c.json(
      { error: 'Too Many Requests', message: '请求频率超限，请稍后重试', retryAfter: Math.ceil((entry.resetAt - now) / 1000) },
      429,
    );
  }

  await next();
}
