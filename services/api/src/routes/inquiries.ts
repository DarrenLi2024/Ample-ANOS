import { Hono } from 'hono';
import { db } from '../db/connection';
import { inquiries } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { jwtAuth, requireRole } from '../middleware/jwt';
import { validateBody } from '../middleware/validate';
import { createInquirySchema, updateInquiryStatusSchema } from '../schemas';

export const inquiryRoutes = new Hono().use('*', jwtAuth);

inquiryRoutes.get('/', async (c) => {
  try {
    const status = c.req.query('status');
    const query = db.select().from(inquiries).$dynamic();
    if (status) query.where(eq(inquiries.status, status));
    const rows = await query.orderBy(inquiries.createdAt).limit(50).all();
    return c.json({ data: rows });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

inquiryRoutes.get('/:id', async (c) => {
  try {
    const row = await db.select().from(inquiries).where(eq(inquiries.inquiryId, c.req.param('id'))).get();
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

inquiryRoutes.post('/', requireRole('Sales', 'SystemAdmin'), validateBody(createInquirySchema), async (c) => {
  const body = c.get('validatedBody') as any;
  const id = uuid();
  const inquiryId = body.inquiryId || `INQ-${Date.now()}`;
  try {
    await db.insert(inquiries).values({
      id, inquiryId,
      customerId: body.customerId,
      mpn: body.mpn,
      brand: body.brand,
      quantity: body.quantity,
      targetPrice: body.targetPrice,
      requiredDate: body.requiredDate,
      priority: body.priority || 'Medium',
      status: 'New',
      rawContent: body.rawContent,
      source: body.source || 'Manual',
      sourceType: body.sourceType || 'Manual',
      salesOwnerId: body.salesOwnerId,
    });
    const created = await db.select().from(inquiries).where(eq(inquiries.id, id)).get();
    return c.json(created, 201);
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE')) return c.json({ error: 'Conflict', message: '询价ID已存在' }, 409);
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

inquiryRoutes.patch('/:id/status', requireRole('Sales', 'SystemAdmin'), validateBody(updateInquiryStatusSchema), async (c) => {
  const { status } = c.get('validatedBody') as any;
  try {
    await db.update(inquiries).set({ status, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) }).where(eq(inquiries.inquiryId, c.req.param('id')));
    return c.json({ success: true, status });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});
