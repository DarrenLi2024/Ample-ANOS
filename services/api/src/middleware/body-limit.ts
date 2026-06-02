/**
 * 请求体大小限制中间件
 * 防止大文件上传和内存溢出攻击
 */
import type { Context, Next } from 'hono';

const MAX_BODY_SIZE = parseInt(process.env.MAX_BODY_SIZE || String(10 * 1024 * 1024), 10); // 默认 10MB

export async function bodyLimit(c: Context, next: Next) {
  const contentLength = parseInt(c.req.header('Content-Length') || '0', 10);

  if (contentLength > MAX_BODY_SIZE) {
    return c.json(
      {
        error: 'Payload Too Large',
        message: `请求体不能超过 ${Math.round(MAX_BODY_SIZE / 1024 / 1024)}MB`,
        maxSize: MAX_BODY_SIZE,
      },
      413,
    );
  }

  await next();
}
