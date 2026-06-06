import { Hono } from 'hono';
import { db } from '../db/connection';
import { redactFields } from '../middleware/permission';
import { supplyResources } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { jwtAuth, requireRole } from '../middleware/jwt';

export const supplyResourceRoutes = new Hono().use('*', jwtAuth);

supplyResourceRoutes.get('/', async (c) => {
  const status = c.req.query('status');
  const query = db.select().from(supplyResources).$dynamic();
  if (status) query.where(eq(supplyResources.status, status));
  const rows = await query.limit(50).all();
  const user = c.get('user') as any;
    const safeData = redactFields(rows as any, 'SupplyResource', user?.role || 'Sales');
    return c.json({ data: safeData });
});

supplyResourceRoutes.get('/:id', async (c) => {
  const row = await db.select().from(supplyResources).where(eq(supplyResources.resourceId, c.req.param('id'))).get();
  if (!row) return c.json({ error: 'Not found' }, 404);
  const user = c.get('user') as any;
    const safeData = redactFields(row as any, 'SupplyResource', user?.role || 'Sales');
    return c.json(safeData);
});

supplyResourceRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const id = uuid();
  const resourceId = body.resourceId || `SR-${Date.now()}`;
  await db.insert(supplyResources).values({
    id, resourceId,
    supplierId: body.supplierId,
    brand: body.brand,
    mpn: body.mpn,
    stockQty: body.stockQty || 0,
    price: body.price || 0,
    leadTimeDays: body.leadTimeDays,
    dateCode: body.dateCode,
    moq: body.moq,
    status: body.status || 'New',
    source: body.source || 'Manual',
    sourceType: body.sourceType || 'Manual',
  });
  const created = await db.select().from(supplyResources).where(eq(supplyResources.id, id)).get();
  return c.json(created, 201);
});
