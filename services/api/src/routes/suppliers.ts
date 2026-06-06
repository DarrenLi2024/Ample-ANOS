import { Hono } from 'hono';
import { db } from '../db/connection';
import { redactFields } from '../middleware/permission';
import { suppliers } from '../db/schema';
import { eq, like } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { jwtAuth, requireRole } from '../middleware/jwt';

export const supplierRoutes = new Hono().use('*', jwtAuth);

supplierRoutes.get('/', async (c) => {
  const q = c.req.query('q') || '';
  const query = db.select().from(suppliers).$dynamic();
  if (q) query.where(like(suppliers.supplierName, `%${q}%`));
  const rows = await query.limit(50).all();
  const user = c.get('user') as any;
    const safeData = redactFields(rows as any, 'Supplier', user?.role || 'Sales');
    return c.json({ data: safeData });
});

supplierRoutes.get('/:id', async (c) => {
  const row = await db.select().from(suppliers).where(eq(suppliers.supplierId, c.req.param('id'))).get();
  if (!row) return c.json({ error: 'Not found' }, 404);
  const user = c.get('user') as any;
    const safeData = redactFields(row as any, 'Supplier', user?.role || 'Sales');
    return c.json(safeData);
});

supplierRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const id = uuid();
  const supplierId = body.supplierId || `S-${Date.now()}`;
  await db.insert(suppliers).values({
    id, supplierId,
    supplierCode: body.supplierCode || supplierId,
    supplierName: body.supplierName,
    country: body.country || 'CN',
    supplierType: body.supplierType || 'IndependentDistributor',
    authorizationStatus: body.authorizationStatus || 'Unknown',
    paymentMethod: body.paymentMethod || 'T/T',
    source: body.source || 'Manual',
    sourceType: body.sourceType || 'Manual',
  });
  const created = await db.select().from(suppliers).where(eq(suppliers.id, id)).get();
  return c.json(created, 201);
});

supplierRoutes.delete('/:id', async (c) => {
  await db.update(suppliers).set({ status: 'Deleted' }).where(eq(suppliers.supplierId, c.req.param('id')));
  return c.json({ success: true });
});
