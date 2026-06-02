import { Hono } from 'hono';
import { db } from '../db/connection';
import { customers } from '../db/schema';
import { eq, like, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { auth } from '../middleware/auth';

export const customerRoutes = new Hono().use('*', auth);

// GET /api/customers — 列表 + 搜索
customerRoutes.get('/', async (c) => {
  const q = c.req.query('q') || '';
  const level = c.req.query('level');
  const riskLevel = c.req.query('riskLevel');
  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
  const offset = parseInt(c.req.query('offset') || '0');

  const query = db.select().from(customers).$dynamic();

  if (q) query.where(like(customers.customerName, `%${q}%`));
  if (level) query.where(eq(customers.customerLevel, level));
  if (riskLevel) query.where(eq(customers.riskLevel, riskLevel));

  const [rows, total] = await Promise.all([
    query.limit(limit).offset(offset).all(),
    db.select({ count: sql<number>`count(*)` }).from(customers).then((r) => r[0]?.count ?? 0),
  ]);

  return c.json({ data: rows, total, limit, offset });
});

// GET /api/customers/:id
customerRoutes.get('/:id', async (c) => {
  const row = await db.select().from(customers).where(eq(customers.customerId, c.req.param('id'))).get();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

// POST /api/customers
customerRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const id = uuid();
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const customerId = body.customerId || `C-${Date.now()}`;

  await db.insert(customers).values({
    id,
    customerId,
    customerCode: body.customerCode || customerId,
    customerName: body.customerName,
    country: body.country || 'CN',
    customerType: body.customerType || 'EndUser',
    customerLevel: body.customerLevel || 'C',
    creditLevel: body.creditLevel || 'N/A',
    paymentTerm: body.paymentTerm || 'T/T',
    paymentMethod: body.paymentMethod || 'T/T',
    currency: body.currency || 'USD',
    source: body.source || 'Manual',
    sourceType: body.sourceType || 'Manual',
    sourceOwner: body.sourceOwner,
  });

  const created = await db.select().from(customers).where(eq(customers.id, id)).get();
  return c.json(created, 201);
});

// PUT /api/customers/:id
customerRoutes.put('/:id', async (c) => {
  const body = await c.req.json();
  await db.update(customers)
    .set({ ...body, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) })
    .where(eq(customers.customerId, c.req.param('id')));
  const updated = await db.select().from(customers).where(eq(customers.customerId, c.req.param('id'))).get();
  return c.json(updated);
});

// DELETE /api/customers/:id (软删除)
customerRoutes.delete('/:id', async (c) => {
  await db.update(customers).set({ status: 'Deleted' }).where(eq(customers.customerId, c.req.param('id')));
  return c.json({ success: true });
});
