/**
 * ANOS API 服务 — Hono 主入口
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { customerRoutes } from './routes/customers';
import { supplierRoutes } from './routes/suppliers';
import { productRoutes } from './routes/products';
import { inquiryRoutes } from './routes/inquiries';
import { supplyResourceRoutes } from './routes/supply-resources';
import { opportunityRoutes } from './routes/opportunities';
import { offerRoutes } from './routes/offers';
import { arRoutes } from './routes/ar';
import { agentRoutes } from './routes/agents';
import { auditRoutes } from './routes/audit';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());

// Health
app.get('/', (c) => c.json({ name: 'ANOS API', version: '0.1.0', status: 'ok' }));
app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString() }));

// P0 Routes
app.route('/api/customers', customerRoutes);
app.route('/api/suppliers', supplierRoutes);
app.route('/api/products', productRoutes);
app.route('/api/inquiries', inquiryRoutes);
app.route('/api/supply-resources', supplyResourceRoutes);
app.route('/api/opportunities', opportunityRoutes);
app.route('/api/offers', offerRoutes);
app.route('/api/ar', arRoutes);
app.route('/api/agents', agentRoutes);
app.route('/api/audit', auditRoutes);

const port = parseInt(process.env.PORT || '3001', 10);

export default {
  port,
  fetch: app.fetch,
};

// Start server if running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const { serve } = await import('@hono/node-server');
  console.log(`🚀 ANOS API server starting on http://localhost:${port}`);
  serve({ fetch: app.fetch, port });
}
