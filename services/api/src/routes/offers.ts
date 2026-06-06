import { Hono } from 'hono';
import { db } from '../db/connection';
import { redactFields } from '../middleware/permission';
import { offers } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { jwtAuth, requireRole } from '../middleware/jwt';

export const offerRoutes = new Hono().use('*', jwtAuth);

offerRoutes.get('/', async (c) => {
  const status = c.req.query('status');
  const query = db.select().from(offers).$dynamic();
  if (status) query.where(eq(offers.status, status));
  const rows = await query.limit(50).all();
  const user = c.get('user') as any;
    const safeData = redactFields(rows as any, 'Offer', user?.role || 'Sales');
    return c.json({ data: safeData });
});

offerRoutes.get('/:id', async (c) => {
  const row = await db.select().from(offers).where(eq(offers.offerId, c.req.param('id'))).get();
  if (!row) return c.json({ error: 'Not found' }, 404);
  const user = c.get('user') as any;
    const safeData = redactFields(row as any, 'Offer', user?.role || 'Sales');
    return c.json(safeData);
});

offerRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const id = uuid();
  const offerId = body.offerId || `OFF-${Date.now()}`;
  await db.insert(offers).values({
    id, offerId,
    inquiryId: body.inquiryId,
    customerId: body.customerId,
    supplierId: body.supplierId,
    supplyResourceId: body.supplyResourceId,
    opportunityId: body.opportunityId,
    brand: body.brand,
    mpn: body.mpn,
    quantity: body.quantity || 1,
    unitPrice: body.unitPrice,
    totalAmount: (body.quantity || 1) * (body.unitPrice || 0),
    currency: body.currency || 'USD',
    costPrice: body.costPrice,
    margin: body.margin,
    marginPercent: body.marginPercent,
    status: body.status || 'Draft',
    source: body.source || 'AI',
    sourceType: body.sourceType || 'AI',
  });
  const created = await db.select().from(offers).where(eq(offers.id, id)).get();
  return c.json(created, 201);
});
