import { Hono } from 'hono';
import { db } from '../db/connection';
import { redactFields } from '../middleware/permission';
import { opportunities } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { jwtAuth, requireRole } from '../middleware/jwt';

export const opportunityRoutes = new Hono().use('*', jwtAuth);

opportunityRoutes.get('/', async (c) => {
  const status = c.req.query('status');
  const query = db.select().from(opportunities).$dynamic();
  if (status) query.where(eq(opportunities.status, status));
  const rows = await query.limit(50).all();
  const user = c.get('user') as any;
    const safeData = redactFields(rows as any, 'Opportunity', user?.role || 'Sales');
    return c.json({ data: safeData });
});

opportunityRoutes.get('/:id', async (c) => {
  const row = await db.select().from(opportunities).where(eq(opportunities.opportunityId, c.req.param('id'))).get();
  if (!row) return c.json({ error: 'Not found' }, 404);
  const user = c.get('user') as any;
    const safeData = redactFields(row as any, 'Opportunity', user?.role || 'Sales');
    return c.json(safeData);
});

opportunityRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const id = uuid();
  const opportunityId = body.opportunityId || `OPP-${Date.now()}`;
  await db.insert(opportunities).values({
    id, opportunityId,
    inquiryId: body.inquiryId,
    supplyResourceId: body.supplyResourceId,
    customerId: body.customerId,
    supplierId: body.supplierId,
    matchScore: body.matchScore || 0,
    suggestedPrice: body.suggestedPrice,
    status: body.status || 'New',
    source: body.source || 'AI',
    sourceType: body.sourceType || 'AI',
    aiGenerated: true,
    aiConfidence: body.matchScore || 70,
  });
  const created = await db.select().from(opportunities).where(eq(opportunities.id, id)).get();
  return c.json(created, 201);
});
