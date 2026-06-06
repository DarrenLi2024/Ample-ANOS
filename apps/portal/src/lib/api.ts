/**
 * ANOS Portal API Client
 * 统一封装所有 API 调用 + JWT Token 管理
 */

// 浏览器端使用相对路径（Next.js rewrites 代理到 localhost:3001）
// 服务端直连 API
const API_BASE = typeof window === 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
  : '';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('anos_token');
  }
  return null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = authToken || getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 始终发送 X-User-Role 作为认证回退（开发/演示环境）
  // 后端 jwtAuth 中间件在无 JWT 时会回退到 X-User-Role
  const storedRole = typeof window !== 'undefined' ? localStorage.getItem('anos_user_role') : null;
  headers['X-User-Role'] = storedRole || 'SystemAdmin';

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err.error?.message || `API Error ${res.status}`);
  }

  return res.json();
}

// ============================================================================
// Customers
// ============================================================================
export async function getCustomers(params?: { q?: string; limit?: number; offset?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.q) searchParams.set('q', params.q);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  const qs = searchParams.toString();
  return request<any>(`/api/customers${qs ? `?${qs}` : ''}`);
}

export async function getCustomer(id: string) {
  return request<any>(`/api/customers/${id}`);
}

// ============================================================================
// Inquiries
// ============================================================================
export async function getInquiries(params?: { status?: string }) {
  const qs = params?.status ? `?status=${params.status}` : '';
  return request<any>(`/api/inquiries${qs}`);
}

export async function createInquiry(data: {
  customerId: string;
  mpn: string;
  quantity: number;
  targetPrice?: number;
  brand?: string;
  priority?: string;
}) {
  return request<any>('/api/inquiries', { method: 'POST', body: data });
}

// ============================================================================
// AR
// ============================================================================
export async function getARItems(params?: { riskLevel?: string }) {
  const qs = params?.riskLevel ? `?riskLevel=${params.riskLevel}` : '';
  return request<any>(`/api/ar${qs}`);
}

// ============================================================================
// Auth
// ============================================================================
export async function login(username: string, password: string) {
  const res = await request<any>('/api/auth/login', {
    method: 'POST',
    body: { username, password },
  });
  if (res.token) {
    setAuthToken(res.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('anos_token', res.token);
    }
  }
  return res;
}

export async function getDevToken(role: string) {
  const res = await request<any>('/api/auth/dev-token', {
    method: 'POST',
    body: { role, name: `${role} Dev`, department: 'Development' },
  });
  if (res.token) {
    setAuthToken(res.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('anos_token', res.token);
    }
  }
  return res;
}

export async function getCurrentUser() {
  return request<any>('/api/auth/me');
}

// ============================================================================
// Suppliers
// ============================================================================
export async function getSuppliers(params?: { q?: string; limit?: number; offset?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.q) searchParams.set('q', params.q);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  return request<any>('/api/suppliers' + (searchParams.toString() ? '?' + searchParams.toString() : ''));
}

export async function getSupplier(id: string) {
  return request<any>('/api/suppliers/' + id);
}

// ============================================================================
// Products
// ============================================================================
export async function getProducts(params?: { q?: string; brand?: string; limit?: number; offset?: number }) {
  const sp = new URLSearchParams();
  if (params?.q) sp.set('q', params.q);
  if (params?.brand) sp.set('brand', params.brand);
  if (params?.limit) sp.set('limit', String(params.limit));
  if (params?.offset) sp.set('offset', String(params.offset));
  return request<any>('/api/products' + (sp.toString() ? '?' + sp.toString() : ''));
}

// ============================================================================
// Supply Resources
// ============================================================================
export async function getSupplyResources(params?: { mpn?: string; status?: string; supplierId?: string }) {
  const sp = new URLSearchParams();
  if (params?.mpn) sp.set('mpn', params.mpn);
  if (params?.status) sp.set('status', params.status);
  if (params?.supplierId) sp.set('supplierId', params.supplierId);
  return request<any>('/api/supply-resources' + (sp.toString() ? '?' + sp.toString() : ''));
}

// ============================================================================
// Opportunities
// ============================================================================
export async function getOpportunities(params?: { status?: string; inquiryId?: string }) {
  const sp = new URLSearchParams();
  if (params?.status) sp.set('status', params.status);
  if (params?.inquiryId) sp.set('inquiryId', params.inquiryId);
  return request<any>('/api/opportunities' + (sp.toString() ? '?' + sp.toString() : ''));
}

// ============================================================================
// Offers
// ============================================================================
export async function getOffers(params?: { status?: string; inquiryId?: string }) {
  const sp = new URLSearchParams();
  if (params?.status) sp.set('status', params.status);
  if (params?.inquiryId) sp.set('inquiryId', params.inquiryId);
  return request<any>('/api/offers' + (sp.toString() ? '?' + sp.toString() : ''));
}

// ============================================================================
// Agents
// ============================================================================
export async function getAgents() {
  return request<any>('/api/agents');
}

// ============================================================================
// Knowledge
// ============================================================================
export async function searchKnowledge(q: string) {
  return request<any>('/api/knowledge/search?q=' + encodeURIComponent(q));
}

// ============================================================================
// Audit
// ============================================================================
export async function getAuditLogs(params?: { objectType?: string; objectId?: string; limit?: number }) {
  const sp = new URLSearchParams();
  if (params?.objectType) sp.set('objectType', params.objectType);
  if (params?.objectId) sp.set('objectId', params.objectId);
  if (params?.limit) sp.set('limit', String(params.limit));
  return request<any>('/api/audit' + (sp.toString() ? '?' + sp.toString() : ''));
}

// ============================================================================
// Workflow
// ============================================================================
export async function triggerWorkflow(workflowId: string, payload: unknown) {
  return request<any>('/api/workflow/' + workflowId + '/run', { method: 'POST', body: payload });
}

// ============================================================================
// AI Inbox
// ============================================================================
export async function inboxSubmit(content: string, source?: string, sourceType?: string) {
  return request<any>('/api/inbox/submit', {
    method: 'POST',
    body: { content, source, sourceType },
  });
}

export async function inboxClassify(content: string) {
  return request<any>('/api/inbox/classify', {
    method: 'POST',
    body: { content },
  });
}

export async function getInboxStats() {
  return request<any>('/api/inbox/stats');
}
