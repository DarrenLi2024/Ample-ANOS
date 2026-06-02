/**
 * ANOS API 服务 — Hono 主入口
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono';
import { errorHandler } from './middleware/error-handler';
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

// CORS — 开发环境允许 localhost, 生产环境由环境变量限制
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
  '*',
  cors({
    origin: process.env.NODE_ENV === 'production' ? corsOrigin : [corsOrigin, 'http://localhost:3000', 'http://localhost:3001'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-User-Id', 'X-User-Name', 'X-User-Role', 'X-User-Dept'],
    exposeHeaders: ['X-Request-Id'],
    maxAge: 86400,
  }),
);

// Logger
app.use('*', logger());

// Request ID
app.use('*', async (c, next) => {
  c.set('requestId', crypto.randomUUID?.() || Date.now().toString(36));
  await next();
});

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

// 全局错误处理
app.onError(errorHandler);

const port = parseInt(process.env.PORT || '3001', 10);

export default {
  port,
  fetch: app.fetch,
};
