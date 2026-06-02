import { Hono } from 'hono';
import Database from 'better-sqlite3';
import path from 'node:path';
import { v4 as uuid } from 'uuid';
import { jwtAuth, requireRole } from '../middleware/jwt';
import { validateBody } from '../middleware/validate';
import { createARSchema } from '../schemas';

const DB_PATH = process.env.ANOS_DB_PATH || path.join(process.cwd(), 'data', 'anos.db');
function getDb() { const sqlite = new Database(DB_PATH); sqlite.pragma('journal_mode = WAL'); return sqlite; }

export const arRoutes = new Hono().use('*', jwtAuth);

arRoutes.get('/', async (c) => {
  const riskLevel = c.req.query('riskLevel');
  const db = getDb();
  try {
    const sql = riskLevel ? 'SELECT * FROM ar_items WHERE risk_level = ? ORDER BY overdue_days DESC LIMIT 50' : 'SELECT * FROM ar_items ORDER BY overdue_days DESC LIMIT 50';
    const rows = riskLevel ? db.prepare(sql).all(riskLevel) : db.prepare(sql).all();
    return c.json({ data: rows });
  } catch (err: any) { return c.json({ error: 'Database Error', message: err.message }, 500); }
  finally { db.close(); }
});

arRoutes.get('/:id', async (c) => {
  const db = getDb();
  try {
    const row = db.prepare('SELECT * FROM ar_items WHERE ar_id = ?').get(c.req.param('id'));
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
  } catch (err: any) { return c.json({ error: 'Database Error', message: err.message }, 500); }
  finally { db.close(); }
});

arRoutes.post('/', requireRole('Risk', 'SystemAdmin'), validateBody(createARSchema), async (c) => {
  const body = c.get('validatedBody') as any;
  const id = uuid();
  const arId = body.arId || `AR-${Date.now()}`;
  const overdueDays = body.dueDate ? Math.max(0, Math.floor((Date.now() - new Date(body.dueDate).getTime()) / 86400000)) : 0;
  let riskLevel = 'L1_Low';
  if (overdueDays > 90) riskLevel = 'L4_High'; else if (overdueDays > 60) riskLevel = 'L3_Warning'; else if (overdueDays > 30) riskLevel = 'L2_Watch';
  const db = getDb();
  try {
    db.prepare('INSERT INTO ar_items (id, ar_id, customer_id, so_id, invoice_no, invoice_date, due_date, ar_amount, paid_amount, outstanding_amount, overdue_days, risk_level, status, source, source_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id, arId, body.customerId, body.soId||null, body.invoiceNo||null, body.invoiceDate||null, body.dueDate, body.arAmount||0, body.paidAmount||0, (body.arAmount||0)-(body.paidAmount||0), overdueDays, riskLevel, overdueDays>0?'Overdue':'Open', body.source||'ERP', body.sourceType||'ERP');
    const row = db.prepare('SELECT * FROM ar_items WHERE id = ?').get(id);
    return c.json(row, 201);
  } catch (err: any) { return c.json({ error: 'Database Error', message: err.message }, 500); }
  finally { db.close(); }
});
