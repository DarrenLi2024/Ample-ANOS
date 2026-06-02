/**
 * 审计日志自动写入中间件
 * 拦截所有 POST/PUT/PATCH/DELETE 操作，自动记录审计日志
 */
import type { Context, Next } from 'hono';
import Database from 'better-sqlite3';
import path from 'node:path';
import { v4 as uuid } from 'uuid';

const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');

export async function auditLogMiddleware(c: Context, next: Next) {
  const startTime = Date.now();
  const method = c.req.method;
  
  await next();
  
  // 只记录写操作
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return;

  const user = c.get('user') as any;
  const status = c.res.status;
  const duration = Date.now() - startTime;

  if (status >= 400) return; // 失败的操作不记录

  try {
    const sqlite = new Database(DB_PATH);
    const pathSegments = c.req.path.split('/').filter(Boolean);
    const objectType = pathSegments[1] || 'unknown';
    const objectId = pathSegments[2] || '';

    sqlite.prepare(
      'INSERT INTO audit_logs (id, audit_id, object_type, object_id, action, actor, actor_role, source, timestamp) VALUES (?,?,?,?,?,?,?,?,datetime(\'now\'))'
    ).run(
      uuid(), `AUDIT-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      objectType, objectId, method,
      user?.userId || 'system', user?.role || 'System', 'ANOS API'
    );
    sqlite.close();
  } catch {}
}
