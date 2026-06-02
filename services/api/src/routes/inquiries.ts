import { Hono } from 'hono';
import { db } from '../db/connection';
import { inquiries } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { auth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { requireRole } from '../middleware/permission';
import { createInquirySchema, updateInquiryStatusSchema } from '../schemas';

export const inquiryRoutes = new Hono().use('*', auth);

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
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/services/api/src/routes/suppliers.ts" << 'ENDOFFILE'
import { Hono } from 'hono';
import { db } from '../db/connection';
import { suppliers } from '../db/schema';
import { eq, like } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { auth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { requireRole } from '../middleware/permission';
import { createSupplierSchema } from '../schemas';

export const supplierRoutes = new Hono().use('*', auth);

supplierRoutes.get('/', async (c) => {
  try {
    const q = c.req.query('q') || '';
    const query = db.select().from(suppliers).$dynamic();
    if (q) query.where(like(suppliers.supplierName, `%${q}%`));
    const rows = await query.limit(50).all();
    return c.json({ data: rows });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

supplierRoutes.get('/:id', async (c) => {
  try {
    const row = await db.select().from(suppliers).where(eq(suppliers.supplierId, c.req.param('id'))).get();
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

supplierRoutes.post('/', requireRole('Procurement', 'SystemAdmin'), validateBody(createSupplierSchema), async (c) => {
  const body = c.get('validatedBody') as any;
  const id = uuid();
  const supplierId = body.supplierId || `S-${Date.now()}`;
  try {
    await db.insert(suppliers).values({
      id, supplierId,
      supplierCode: body.supplierCode || supplierId,
      supplierName: body.supplierName,
      country: body.country || 'CN',
      supplierType: body.supplierType || 'IndependentDistributor',
      authorizationStatus: body.authorizationStatus || 'Unknown',
      paymentMethod: body.paymentMethod || 'T/T',
      source: body.source || 'Manual',
      sourceType: body.sourceType || 'Manual',
    });
    const created = await db.select().from(suppliers).where(eq(suppliers.id, id)).get();
    return c.json(created, 201);
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE')) return c.json({ error: 'Conflict', message: '供应商编码已存在' }, 409);
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

supplierRoutes.delete('/:id', requireRole('SystemAdmin'), async (c) => {
  try {
    await db.update(suppliers).set({ status: 'Deleted' }).where(eq(suppliers.supplierId, c.req.param('id')));
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/services/api/src/routes/products.ts" << 'ENDOFFILE'
import { Hono } from 'hono';
import { db } from '../db/connection';
import { products } from '../db/schema';
import { eq, like } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { auth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { requireRole } from '../middleware/permission';
import { createProductSchema } from '../schemas';

export const productRoutes = new Hono().use('*', auth);

productRoutes.get('/', async (c) => {
  try {
    const q = c.req.query('q') || '';
    const brand = c.req.query('brand');
    const query = db.select().from(products).$dynamic();
    if (q) query.where(like(products.mpn, `%${q}%`));
    if (brand) query.where(eq(products.brand, brand));
    const rows = await query.limit(50).all();
    return c.json({ data: rows });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

productRoutes.get('/:id', async (c) => {
  try {
    const row = await db.select().from(products).where(eq(products.productId, c.req.param('id'))).get();
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

productRoutes.post('/', requireRole('Procurement', 'Sales', 'SystemAdmin'), validateBody(createProductSchema), async (c) => {
  const body = c.get('validatedBody') as any;
  const id = uuid();
  try {
    await db.insert(products).values({
      id,
      productId: body.productId || `PRD-${Date.now()}`,
      brand: body.brand,
      mpn: body.mpn,
      description: body.description,
      category: body.category,
      packageType: body.packageType || 'Other',
      lifecycle: body.lifecycle || 'Active',
      source: body.source || 'Manual',
      sourceType: body.sourceType || 'Manual',
    });
    const created = await db.select().from(products).where(eq(products.id, id)).get();
    return c.json(created, 201);
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE')) return c.json({ error: 'Conflict', message: '产品ID已存在' }, 409);
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/services/api/src/routes/supply-resources.ts" << 'ENDOFFILE'
import { Hono } from 'hono';
import { db } from '../db/connection';
import { supplyResources } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { auth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { requireRole } from '../middleware/permission';
import { createSupplyResourceSchema } from '../schemas';

export const supplyResourceRoutes = new Hono().use('*', auth);

supplyResourceRoutes.get('/', async (c) => {
  try {
    const status = c.req.query('status');
    const query = db.select().from(supplyResources).$dynamic();
    if (status) query.where(eq(supplyResources.status, status));
    const rows = await query.limit(50).all();
    return c.json({ data: rows });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

supplyResourceRoutes.get('/:id', async (c) => {
  try {
    const row = await db.select().from(supplyResources).where(eq(supplyResources.resourceId, c.req.param('id'))).get();
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

supplyResourceRoutes.post('/', requireRole('Procurement', 'SystemAdmin'), validateBody(createSupplyResourceSchema), async (c) => {
  const body = c.get('validatedBody') as any;
  const id = uuid();
  const resourceId = body.resourceId || `SR-${Date.now()}`;
  try {
    await db.insert(supplyResources).values({
      id, resourceId,
      supplierId: body.supplierId,
      brand: body.brand,
      mpn: body.mpn,
      stockQty: body.stockQty,
      price: body.price,
      leadTimeDays: body.leadTimeDays,
      dateCode: body.dateCode,
      moq: body.moq,
      currency: body.currency || 'USD',
      status: 'New',
      source: body.source || 'Manual',
      sourceType: body.sourceType || 'Manual',
    });
    const created = await db.select().from(supplyResources).where(eq(supplyResources.id, id)).get();
    return c.json(created, 201);
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE')) return c.json({ error: 'Conflict', message: '资源ID已存在' }, 409);
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/services/api/src/routes/opportunities.ts" << 'ENDOFFILE'
import { Hono } from 'hono';
import { db } from '../db/connection';
import { opportunities } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { auth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { requireRole } from '../middleware/permission';
import { createOpportunitySchema } from '../schemas';

export const opportunityRoutes = new Hono().use('*', auth);

opportunityRoutes.get('/', async (c) => {
  try {
    const status = c.req.query('status');
    const query = db.select().from(opportunities).$dynamic();
    if (status) query.where(eq(opportunities.status, status));
    const rows = await query.limit(50).all();
    return c.json({ data: rows });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

opportunityRoutes.get('/:id', async (c) => {
  try {
    const row = await db.select().from(opportunities).where(eq(opportunities.opportunityId, c.req.param('id'))).get();
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

opportunityRoutes.post('/', requireRole('Sales', 'Procurement', 'SystemAdmin'), validateBody(createOpportunitySchema), async (c) => {
  const body = c.get('validatedBody') as any;
  const id = uuid();
  const opportunityId = body.opportunityId || `OPP-${Date.now()}`;
  try {
    await db.insert(opportunities).values({
      id, opportunityId,
      inquiryId: body.inquiryId,
      supplyResourceId: body.supplyResourceId,
      customerId: body.customerId,
      supplierId: body.supplierId,
      matchScore: body.matchScore,
      suggestedPrice: body.suggestedPrice,
      source: body.source || 'AI',
      sourceType: body.sourceType || 'AI',
      aiGenerated: true,
      aiConfidence: body.matchScore || 70,
    });
    const created = await db.select().from(opportunities).where(eq(opportunities.id, id)).get();
    return c.json(created, 201);
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE')) return c.json({ error: 'Conflict', message: '商机ID已存在' }, 409);
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/services/api/src/routes/offers.ts" << 'ENDOFFILE'
import { Hono } from 'hono';
import { db } from '../db/connection';
import { offers } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { auth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { requireRole } from '../middleware/permission';
import { createOfferSchema } from '../schemas';

export const offerRoutes = new Hono().use('*', auth);

offerRoutes.get('/', async (c) => {
  try {
    const status = c.req.query('status');
    const query = db.select().from(offers).$dynamic();
    if (status) query.where(eq(offers.status, status));
    const rows = await query.limit(50).all();
    return c.json({ data: rows });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

offerRoutes.get('/:id', async (c) => {
  try {
    const row = await db.select().from(offers).where(eq(offers.offerId, c.req.param('id'))).get();
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

offerRoutes.post('/', requireRole('Sales', 'SystemAdmin'), validateBody(createOfferSchema), async (c) => {
  const body = c.get('validatedBody') as any;
  const id = uuid();
  const offerId = body.offerId || `OFF-${Date.now()}`;
  try {
    await db.insert(offers).values({
      id, offerId,
      inquiryId: body.inquiryId,
      customerId: body.customerId,
      supplierId: body.supplierId,
      supplyResourceId: body.supplyResourceId,
      opportunityId: body.opportunityId,
      brand: body.brand,
      mpn: body.mpn,
      quantity: body.quantity,
      unitPrice: body.unitPrice,
      totalAmount: body.quantity * body.unitPrice,
      currency: body.currency || 'USD',
      costPrice: body.costPrice,
      margin: body.margin,
      marginPercent: body.marginPercent,
      source: body.source || 'AI',
      sourceType: body.sourceType || 'AI',
    });
    const created = await db.select().from(offers).where(eq(offers.id, id)).get();
    return c.json(created, 201);
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE')) return c.json({ error: 'Conflict', message: '报价ID已存在' }, 409);
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/services/api/src/routes/ar.ts" << 'ENDOFFILE'
import { Hono } from 'hono';
import { db } from '../db/connection';
import { arItems } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { auth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { requireRole } from '../middleware/permission';
import { createARSchema } from '../schemas';

export const arRoutes = new Hono().use('*', auth);

arRoutes.get('/', async (c) => {
  try {
    const riskLevel = c.req.query('riskLevel');
    const query = db.select().from(arItems).$dynamic();
    if (riskLevel) query.where(eq(arItems.riskLevel, riskLevel));
    const rows = await query.orderBy(arItems.overdueDays).limit(50).all();
    return c.json({ data: rows });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

arRoutes.get('/:id', async (c) => {
  try {
    const row = await db.select().from(arItems).where(eq(arItems.arId, c.req.param('id'))).get();
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

arRoutes.post('/', requireRole('Risk', 'SystemAdmin'), validateBody(createARSchema), async (c) => {
  const body = c.get('validatedBody') as any;
  const id = uuid();
  const arId = body.arId || `AR-${Date.now()}`;
  const overdueDays = body.dueDate
    ? Math.max(0, Math.floor((Date.now() - new Date(body.dueDate).getTime()) / 86400000))
    : 0;
  let riskLevel = 'L1_Low';
  if (overdueDays > 90) riskLevel = 'L4_High';
  else if (overdueDays > 60) riskLevel = 'L3_Warning';
  else if (overdueDays > 30) riskLevel = 'L2_Watch';

  try {
    await db.insert(arItems).values({
      id, arId,
      customerId: body.customerId,
      soId: body.soId,
      invoiceNo: body.invoiceNo,
      invoiceDate: body.invoiceDate,
      dueDate: body.dueDate,
      arAmount: body.arAmount,
      paidAmount: body.paidAmount,
      outstandingAmount: body.arAmount - body.paidAmount,
      overdueDays,
      riskLevel,
      status: overdueDays > 0 ? 'Overdue' : 'Open',
      source: body.source || 'ERP',
      sourceType: body.sourceType || 'ERP',
    });
    const created = await db.select().from(arItems).where(eq(arItems.id, id)).get();
    return c.json(created, 201);
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE')) return c.json({ error: 'Conflict', message: 'AR ID已存在' }, 409);
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/services/api/src/routes/agents.ts" << 'ENDOFFILE'
import { Hono } from 'hono';
import { db } from '../db/connection';
import { agents } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { auth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { requireRole } from '../middleware/permission';
import { createAgentSchema, updateAgentStatusSchema } from '../schemas';

export const agentRoutes = new Hono().use('*', auth);

agentRoutes.get('/', async (c) => {
  try {
    const rows = await db.select().from(agents).all();
    return c.json({ data: rows });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

agentRoutes.get('/:id', async (c) => {
  try {
    const row = await db.select().from(agents).where(eq(agents.agentId, c.req.param('id'))).get();
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

agentRoutes.post('/', requireRole('SystemAdmin'), validateBody(createAgentSchema), async (c) => {
  const body = c.get('validatedBody') as any;
  const id = uuid();
  const agentId = body.agentId || `AGENT-${Date.now()}`;
  try {
    await db.insert(agents).values({
      id, agentId,
      agentName: body.agentName,
      agentType: body.agentType,
      department: body.department,
      ownerId: body.ownerId,
      level: body.level,
      status: body.status,
      capabilities: JSON.stringify(body.capabilities),
      restrictions: JSON.stringify(body.restrictions),
    });
    const created = await db.select().from(agents).where(eq(agents.id, id)).get();
    return c.json(created, 201);
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE')) return c.json({ error: 'Conflict', message: 'Agent ID已存在' }, 409);
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

agentRoutes.patch('/:id/status', requireRole('SystemAdmin'), validateBody(updateAgentStatusSchema), async (c) => {
  const { status } = c.get('validatedBody') as any;
  try {
    await db.update(agents).set({ status, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) }).where(eq(agents.agentId, c.req.param('id')));
    return c.json({ success: true, status });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});
EOF

cat > "/Users/lirundong/Documents/Ample ANOS/services/api/src/routes/audit.ts" << 'ENDOFFILE'
import { Hono } from 'hono';
import { db } from '../db/connection';
import { auditLogs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '../middleware/auth';
import { requireRole } from '../middleware/permission';

export const auditRoutes = new Hono().use('*', auth);

// 审计日志只读
auditRoutes.get('/', requireRole('Risk', 'CEO', 'SystemAdmin'), async (c) => {
  try {
    const objectType = c.req.query('objectType');
    const objectId = c.req.query('objectId');
    const query = db.select().from(auditLogs).$dynamic();
    if (objectType) query.where(eq(auditLogs.objectType, objectType));
    if (objectId) query.where(eq(auditLogs.objectId, objectId));
    const rows = await query.orderBy(auditLogs.timestamp).limit(100).all();
    return c.json({ data: rows });
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});

auditRoutes.get('/:id', requireRole('Risk', 'CEO', 'SystemAdmin'), async (c) => {
  try {
    const row = await db.select().from(auditLogs).where(eq(auditLogs.auditId, c.req.param('id'))).get();
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  } catch (err: any) {
    return c.json({ error: 'Database Error', message: err?.message }, 500);
  }
});
EOF

echo "All API routes rewritten with validation + error handling + permissions"