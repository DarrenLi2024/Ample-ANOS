import { Hono } from 'hono';
import { db } from '../db/connection';
import { arItems } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { auth } from '../middleware/auth';

export const arRoutes = new Hono().use('*', auth);

arRoutes.get('/', async (c) => {
  const riskLevel = c.req.query('riskLevel');
  const query = db.select().from(arItems).$dynamic();
  if (riskLevel) query.where(eq(arItems.riskLevel, riskLevel));
  const rows = await query.orderBy(arItems.overdueDays).limit(50).all();
  return c.json({ data: rows });
});

arRoutes.get('/:id', async (c) => {
  const row = await db.select().from(arItems).where(eq(arItems.arId, c.req.param('id'))).get();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

arRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const id = uuid();
  const arId = body.arId || `AR-${Date.now()}`;
  const overdueDays = body.dueDate
    ? Math.max(0, Math.floor((Date.now() - new Date(body.dueDate).getTime()) / 86400000))
    : 0;
  let riskLevel = 'L1_Low';
  if (overdueDays > 90) riskLevel = 'L4_High';
  else if (overdueDays > 60) riskLevel = 'L3_Warning';
  else if (overdueDays > 30) riskLevel = 'L2_Watch';

  await db.insert(arItems).values({
    id, arId,
    customerId: body.customerId,
    soId: body.soId,
    invoiceNo: body.invoiceNo,
    invoiceDate: body.invoiceDate,
    dueDate: body.dueDate,
    arAmount: body.arAmount || 0,
    paidAmount: body.paidAmount || 0,
    outstandingAmount: (body.arAmount || 0) - (body.paidAmount || 0),
    overdueDays,
    riskLevel,
    status: overdueDays > 0 ? 'Overdue' : 'Open',
    source: body.source || 'ERP',
    sourceType: body.sourceType || 'ERP',
  });
  const created = await db.select().from(arItems).where(eq(arItems.id, id)).get();
  return c.json(created, 201);
});
