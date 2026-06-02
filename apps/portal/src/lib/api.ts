/**
 * ANOS Portal API Client
 * 统一封装所有 API 调用 + JWT Token 管理
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (process.env.NODE_ENV === 'development') {
    // 开发回退
    headers['X-User-Role'] = 'SystemAdmin';
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
