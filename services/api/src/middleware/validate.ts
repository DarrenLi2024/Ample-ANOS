/**
 * Zod 输入校验中间件
 * 用于所有 POST/PUT/PATCH 路由的请求体验证
 */
import type { Context, Next } from 'hono';
import type { ZodSchema } from 'zod';

/**
 * 请求体校验中间件工厂
 * @param schema Zod 校验 schema
 */
export function validateBody(schema: ZodSchema) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const result = schema.safeParse(body);
      if (!result.success) {
        return c.json(
          {
            error: 'Validation Error',
            message: '请求体格式不正确',
            details: result.error.issues.map((i) => ({
              field: i.path.join('.'),
              message: i.message,
            })),
          },
          400,
        );
      }
      c.set('validatedBody', result.data);
      await next();
    } catch {
      return c.json({ error: 'Invalid JSON', message: '请求体不是有效的 JSON' }, 400);
    }
  };
}

/**
 * 查询参数校验中间件工厂
 */
export function validateQuery(schema: ZodSchema) {
  return async (c: Context, next: Next) => {
    const query = c.req.query();
    const result = schema.safeParse(query);
    if (!result.success) {
      return c.json(
        {
          error: 'Validation Error',
          message: '查询参数格式不正确',
          details: result.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        400,
      );
    }
    c.set('validatedQuery', result.data);
    await next();
  };
}
