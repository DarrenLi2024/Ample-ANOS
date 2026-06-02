import { Hono } from 'hono';
import { jwtAuth } from '../middleware/jwt';
import { erpGetCustomers, erpGetSuppliers, erpGetMaterials, erpHealthCheck } from '../lib/erp-client';

export const erpSyncRoutes = new Hono().use('*', jwtAuth);

// GET /api/erp/health
erpSyncRoutes.get('/health', async (c) => {
  const ok = await erpHealthCheck();
  return c.json({ erp: ok ? 'connected' : 'unavailable' });
});

// GET /api/erp/customers
erpSyncRoutes.get('/customers', async (c) => {
  try {
    const data = await erpGetCustomers(50);
    return c.json({ source: 'ERP', data, count: data?.length || 0 });
  } catch (err: any) {
    return c.json({ error: err.message, hint: 'ERP接口需要在请求体中传FieldKeys+Limit' }, 502);
  }
});

// GET /api/erp/suppliers
erpSyncRoutes.get('/suppliers', async (c) => {
  try {
    const data = await erpGetSuppliers(50);
    return c.json({ source: 'ERP', data, count: data?.length || 0 });
  } catch (err: any) {
    return c.json({ error: err.message }, 502);
  }
});

// GET /api/erp/materials
erpSyncRoutes.get('/materials', async (c) => {
  try {
    const data = await erpGetMaterials(50);
    return c.json({ source: 'ERP', data, count: data?.length || 0 });
  } catch (err: any) {
    return c.json({ error: err.message }, 502);
  }
});
