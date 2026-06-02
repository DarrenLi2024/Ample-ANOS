import { Hono } from 'hono';
import { db } from '../db/connection';
import { agents } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { jwtAuth, requireRole } from '../middleware/jwt';

export const agentRoutes = new Hono().use('*', jwtAuth);

agentRoutes.get('/', async (c) => {
  const rows = await db.select().from(agents).all();
  return c.json({ data: rows });
});

agentRoutes.get('/:id', async (c) => {
  const row = await db.select().from(agents).where(eq(agents.agentId, c.req.param('id'))).get();
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(row);
});

agentRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const id = uuid();
  const agentId = body.agentId || `AGENT-${Date.now()}`;
  await db.insert(agents).values({
    id, agentId,
    agentName: body.agentName,
    agentType: body.agentType,
    department: body.department,
    ownerId: body.ownerId,
    level: body.level || 'L2_Knowledge',
    status: body.status || 'Offline',
    capabilities: JSON.stringify(body.capabilities || []),
    restrictions: JSON.stringify(body.restrictions || []),
  });
  const created = await db.select().from(agents).where(eq(agents.id, id)).get();
  return c.json(created, 201);
});

agentRoutes.patch('/:id/status', async (c) => {
  const { status } = await c.req.json();
  await db.update(agents).set({ status, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) }).where(eq(agents.agentId, c.req.param('id')));
  return c.json({ success: true, status });
});
