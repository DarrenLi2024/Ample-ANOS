/**
 * 全局错误处理中间件
 * 捕获所有未处理的异常并返回结构化错误响应
 */
import type { Context, Next } from 'hono';

export async function errorHandler(err: Error, c: Context) {
  console.error(`[ERROR] ${c.req.method} ${c.req.path}:`, err.message);

  // SQLite 特定错误
  if (err.message?.includes('SQLITE_BUSY')) {
    return c.json(
      {
        error: 'Database Busy',
        message: '数据库繁忙，请稍后重试',
        retryable: true,
      },
      503,
    );
  }

  if (err.message?.includes('SQLITE_CONSTRAINT')) {
    return c.json(
      {
        error: 'Constraint Violation',
        message: '数据约束冲突',
        detail: err.message.includes('UNIQUE') ? '记录已存在' : '数据关联错误',
      },
      409,
    );
  }

  // 通用错误
  return c.json(
    {
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
      requestId: c.get('requestId') || 'unknown',
    },
    500,
  );
}
