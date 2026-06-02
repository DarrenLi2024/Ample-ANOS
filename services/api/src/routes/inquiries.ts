import { Hono } from 'hono';
import Database from 'better-sqlite3';
import path from 'node:path';
import { v4 as uuid } from 'uuid';
import { jwtAuth, requireRole } from '../middleware/jwt';
import { validateBody } from '../middleware/validate';
import { createInquirySchema, updateInquiryStatusSchema } from '../schemas';

const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');

function getDb() { const sqlite = new Database(DB_PATH); sqlite.pragma('journal_mode = WAL'); return sqlite; }

export const inquiryRoutes = new Hono().use('*', jwtAuth);

inquiryRoutes.get('/', async (c) => {
  const status = c.req.query('status');
  const db = getDb();
  try {
    const sql = status ? 'SELECT * FROM inquiries WHERE status = ? ORDER BY created_at DESC LIMIT 50' : 'SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 50';
    const rows = status ? db.prepare(sql).all(status) : db.prepare(sql).all();
    return c.json({ data: rows });
  } catch (err: any) { return c.json({ error: 'Database Error', message: err.message }, 500); }
  finally { db.close(); }
});

inquiryRoutes.get('/:id', async (c) => {
  const db = getDb();
  try {
    const row = db.prepare('SELECT * FROM inquiries WHERE inquiry_id = ?').get(c.req.param('id'));
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  } catch (err: any) { return c.json({ error: 'Database Error', message: err.message }, 500); }
  finally { db.close(); }
});

inquiryRoutes.post('/', requireRole('Sales', 'SystemAdmin'), validateBody(createInquirySchema), async (c) => {
  const body = c.get('validatedBody') as any;
  const id = uuid();
  const inquiryId = body.inquiryId || `INQ-${Date.now()}`;
  const db = getDb();
  try {
    db.prepare(`INSERT INTO inquiries (id, inquiry_id, customer_id, mpn, brand, quantity, target_price, required_date, priority, status, raw_content, source, source_type, sales_owner_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(id, inquiryId, body.customerId, body.mpn, body.brand||null, body.quantity||1, body.targetPrice||null, body.requiredDate||null, body.priority||'Medium', 'New', body.rawContent||null, body.source||'Manual', body.sourceType||'Manual', body.salesOwnerId||null);
    const row = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);
    return c.json(row, 201);
  } catch (err: any) { return c.json({ error: 'Database Error', message: err.message }, 500); }
  finally { db.close(); }
});

inquiryRoutes.patch('/:id/status', requireRole('Sales', 'SystemAdmin'), validateBody(updateInquiryStatusSchema), async (c) => {
  const { status } = c.get('validatedBody') as any;
  const db = getDb();
  try {
    db.prepare('UPDATE inquiries SET status = ?, updated_at = datetime(\'now\') WHERE inquiry_id = ?').run(status, c.req.param('id'));
    return c.json({ success: true, status });
  } catch (err: any) { return c.json({ error: 'Database Error', message: err.message }, 500); }
  finally { db.close(); }
});
