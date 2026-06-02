/**
 * 数据库操作安全包装器
 * 统一捕获 Drizzle/Better-SQLite3 异常
 */
import type { Context } from 'hono';

/**
 * 安全执行数据库操作，自动处理异常
 */
export async function safeQuery<T>(c: Context, fn: () => Promise<T>): Promise<{ data: T } | { error: string; status: number }> {
  try {
    const data = await fn();
    return { data };
  } catch (err: any) {
    const message = err?.message || 'Unknown database error';
    if (message.includes('SQLITE_CONSTRAINT_UNIQUE')) {
      return { error: '记录已存在', status: 409 };
    }
    if (message.includes('SQLITE_BUSY')) {
      return { error: '数据库繁忙，请稍后重试', status: 503 };
    }
    console.error('[DB Error]', message);
    return { error: '数据库操作失败', status: 500 };
  }
}
