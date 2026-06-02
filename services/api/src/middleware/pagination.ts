/**
 * 统一分页工具
 * 为所有列表 API 提供标准分页参数解析和响应格式
 */
import type { Context } from 'hono';

export interface PaginationParams {
  limit: number;
  offset: number;
  page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    offset: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export function getPaginationParams(c: Context): PaginationParams {
  const page = Math.max(1, parseInt(c.req.query('page') || '1', 10));
  const limit = Math.min(Math.max(1, parseInt(c.req.query('limit') || String(DEFAULT_LIMIT), 10)), MAX_LIMIT);
  const offset = (page - 1) * limit;

  return { limit, offset, page };
}

export function buildSortParams(c: Context, allowedFields: string[]): { field: string; order: 'asc' | 'desc' } {
  const sortBy = c.req.query('sortBy');
  const sortOrder = (c.req.query('sortOrder') || 'desc').toLowerCase();

  const field = sortBy && allowedFields.includes(sortBy) ? sortBy : allowedFields[0] || 'createdAt';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';

  return { field, order };
}

export function formatPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      offset: params.offset,
      total,
      totalPages: Math.ceil(total / params.limit),
      hasNext: params.offset + params.limit < total,
      hasPrev: params.page > 1,
    },
  };
}
