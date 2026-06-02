import { Hono } from 'hono';
import { db } from '../db/connection';
import { auditLogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '../middleware/auth';

export const auditRoutes = new Hono().use('*', auth);

auditRoutes.get('/', async (c) => {
  const objectType = c.req.query('objectType');
  const objectId = c.req.query('objectId');
  const query = db.select().from(auditLogs).$dynamic();
  if (objectType) query.where(eq(auditLogs.objectType, objectType));
  if (objectId) query.where(eq(auditLogs.objectId, objectId));
  const rows = await query.orderBy(auditLogs.timestamp).limit(100).all();
  return c.json({ data: rows });
});

auditRoutes.get('/:id', async (c) => {
  const row = await db.select().from(auditLogs).where(eq(auditLogs.auditId, c.req.param('id'))).get();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});
