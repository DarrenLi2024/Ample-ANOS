import { Hono } from 'hono';
import { db } from '../db/connection';
import { customers } from '../db/schema';
import { eq, like, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { jwtAuth, requireRole } from '../middleware/jwt';
import { validateBody } from '../middleware/validate';
import { redactFields } from '../middleware/permission';
import { createCustomerSchema, updateCustomerSchema } from '../schemas';

export const customerRoutes = new Hono().use('*', jwtAuth);

// GET /api/customers
customerRoutes.get('/', async (c) => {
  const user = c.get('user') as AuthenticatedUser;
  const q = c.req.query('q') || '';
  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    const query = db.select().from(customers).$dynamic();
    if (q) query.where(like(customers.customerName, `%${q}%`));

    const [rows, total] = await Promise.all([
      query.limit(limit).offset(offset).all(),
      db.select({ count: sql<number>`count(*)` }).from(customers).then((r) => r[0]?.count ?? 0),
    ]);

    const safeData = redactFields(rows as any, 'Customer', user.role);
    return c.json({ data: safeData, total, limit, offset });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message || 'Unknown error' }, 500);
  }
});

// GET /api/customers/:id
customerRoutes.get('/:id', async (c) => {
  const user = c.get('user') as AuthenticatedUser;
  try {
    const row = await db.select().from(customers).where(eq(customers.customerId, c.req.param('id'))).get();
    if (!row) return c.json({ error: 'Not found' }, 404);
    const safeData = redactFields(row as any, 'Customer', user.role);
    return c.json(safeData);
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

// POST /api/customers — 需要 Sales 或 SystemAdmin 角色
customerRoutes.post('/', requireRole('Sales', 'SystemAdmin'), validateBody(createCustomerSchema), async (c) => {
  const body = c.get('validatedBody') as any;
  const id = uuid();
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const customerId = body.customerId || `C-${Date.now()}`;

  try {
    await db.insert(customers).values({
      id,
      customerId,
      customerCode: body.customerCode || customerId,
      customerName: body.customerName,
      country: body.country || 'CN',
      city: body.city,
      address: body.address,
      website: body.website || undefined,
      customerType: body.customerType || 'EndUser',
      industry: body.industry,
      customerLevel: body.customerLevel || 'C',
      creditLevel: body.creditLevel || 'N/A',
      creditLimit: body.creditLimit,
      paymentTerm: body.paymentTerm || 'T/T',
      paymentMethod: body.paymentMethod || 'T/T',
      currency: body.currency || 'USD',
      source: body.source || 'Manual',
      sourceType: body.sourceType || 'Manual',
      accountOwner: body.accountOwner,
      accountOwnerId: body.accountOwnerId,
      leadSource: body.leadSource,
    });

    const created = await db.select().from(customers).where(eq(customers.id, id)).get();
    return c.json(created, 201);
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE')) {
      return c.json({ error: 'Conflict', message: '客户编码已存在' }, 409);
    }
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

// PUT /api/customers/:id
customerRoutes.put('/:id', requireRole('Sales', 'SystemAdmin'), validateBody(updateCustomerSchema), async (c) => {
  const body = c.get('validatedBody') as any;
  try {
    await db.update(customers)
      .set({ ...body, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) })
      .where(eq(customers.customerId, c.req.param('id')));
    const updated = await db.select().from(customers).where(eq(customers.customerId, c.req.param('id'))).get();
    return c.json(updated);
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

// DELETE /api/customers/:id (软删除) — SystemAdmin only
customerRoutes.delete('/:id', requireRole('SystemAdmin'), async (c) => {
  try {
    await db.update(customers).set({ status: 'Deleted' }).where(eq(customers.customerId, c.req.param('id')));
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});
