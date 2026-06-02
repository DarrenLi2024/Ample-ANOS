/**
 * 统一错误响应格式
 * 所有 API 错误遵循 { error: { code, message, details? }, requestId } 结构
 */
import type { Context } from 'hono';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  error: ApiError;
  requestId: string;
  timestamp: string;
}

export function sendError(c: Context, status: number, code: string, message: string, details?: unknown) {
  return c.json(
    {
      error: { code, message, details },
      requestId: c.get('requestId') || 'unknown',
      timestamp: new Date().toISOString(),
    } satisfies ApiErrorResponse,
    status as any,
  );
}

export function sendNotFound(c: Context, resource: string) {
  return sendError(c, 404, 'NOT_FOUND', `${resource} not found`);
}

export function sendConflict(c: Context, message: string) {
  return sendError(c, 409, 'CONFLICT', message);
}

export function sendDatabaseError(c: Context, err: Error) {
  return sendError(c, 500, 'DATABASE_ERROR', err.message);
}

export function sendValidationError(c: Context, details: unknown) {
  return sendError(c, 400, 'VALIDATION_ERROR', '请求参数校验失败', details);
}
