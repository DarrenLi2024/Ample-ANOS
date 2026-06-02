import { Hono } from 'hono';
import { db } from '../db/connection';
import { inquiries } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { auth } from '../middleware/auth';

export const inquiryRoutes = new Hono().use('*', auth);

// GET /api/inquiries
inquiryRoutes.get('/', async (c) => {
  const status = c.req.query('status');
  const query = db.select().from(inquiries).$dynamic();
  if (status) query.where(eq(inquiries.status, status));
  const rows = await query.orderBy(inquiries.createdAt).limit(50).all();
  return c.json({ data: rows });
});

// GET /api/inquiries/:id
inquiryRoutes.get('/:id', async (c) => {
  const row = await db.select().from(inquiries).where(eq(inquiries.inquiryId, c.req.param('id'))).get();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

// POST /api/inquiries
inquiryRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const id = uuid();
  const inquiryId = body.inquiryId || `INQ-${Date.now()}`;

  await db.insert(inquiries).values({
    id,
    inquiryId,
    customerId: body.customerId,
    mpn: body.mpn,
    brand: body.brand,
    quantity: body.quantity || 1,
    targetPrice: body.targetPrice,
    requiredDate: body.requiredDate,
    priority: body.priority || 'Medium',
    status: body.status || 'New',
    rawContent: body.rawContent,
    source: body.source || 'Manual',
    sourceType: body.sourceType || 'Manual',
    salesOwnerId: body.salesOwnerId,
  });

  const created = await db.select().from(inquiries).where(eq(inquiries.id, id)).get();
  return c.json(created, 201);
});

// PUT /api/inquiries/:id/status
inquiryRoutes.patch('/:id/status', async (c) => {
  const { status } = await c.req.json();
  await db.update(inquiries)
    .set({ status, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) })
    .where(eq(inquiries.inquiryId, c.req.param('id')));
  return c.json({ success: true, status });
});
