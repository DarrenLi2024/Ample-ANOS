import { Hono } from 'hono';
import { db } from '../db/connection';
import { redactFields } from '../middleware/permission';
import { products } from '../db/schema';
import { eq, like } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { jwtAuth, requireRole } from '../middleware/jwt';

export const productRoutes = new Hono().use('*', jwtAuth);

productRoutes.get('/', async (c) => {
  const q = c.req.query('q') || '';
  const brand = c.req.query('brand');
  const query = db.select().from(products).$dynamic();
  if (q) query.where(like(products.mpn, `%${q}%`));
  if (brand) query.where(eq(products.brand, brand));
  const rows = await query.limit(50).all();
  const user = c.get('user') as any;
    const safeData = redactFields(rows as any, 'Product', user?.role || 'Sales');
    return c.json({ data: safeData });
});

productRoutes.get('/:id', async (c) => {
  const row = await db.select().from(products).where(eq(products.productId, c.req.param('id'))).get();
  if (!row) return c.json({ error: 'Not found' }, 404);
  const user = c.get('user') as any;
    const safeData = redactFields(row as any, 'Product', user?.role || 'Sales');
    return c.json(safeData);
});

productRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const id = uuid();
  await db.insert(products).values({
    id,
    productId: body.productId || `PRD-${Date.now()}`,
    brand: body.brand,
    mpn: body.mpn,
    description: body.description,
    category: body.category,
    packageType: body.packageType || 'Other',
    lifecycle: body.lifecycle || 'Active',
    isDomestic: body.isDomestic ?? false,
    source: body.source || 'Manual',
    sourceType: body.sourceType || 'Manual',
  });
  const created = await db.select().from(products).where(eq(products.id, id)).get();
  return c.json(created, 201);
});
