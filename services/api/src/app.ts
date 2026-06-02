/**
 * ANOS API 应用实例
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { errorHandler } from './middleware/error-handler';
import { csrfProtection } from './middleware/csrf';
import { bodyLimit } from './middleware/body-limit';
import { rateLimiter } from './middleware/rate-limit';
import { securityHeaders } from './middleware/security-headers';
import { authRoutes } from './routes/auth';
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

// Security: CORS
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use('*', cors({
  origin: process.env.NODE_ENV === 'production'
    ? corsOrigin
    : [corsOrigin, 'http://localhost:3000', 'http://localhost:3001'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-User-Name', 'X-User-Role', 'X-User-Dept'],
  exposeHeaders: ['X-Request-Id', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400,
}));

// Security
app.use('*', securityHeaders);
app.use('*', rateLimiter);
app.use('*', bodyLimit);
app.use('*', csrfProtection);
app.use('*', logger());

app.use('*', async (c, next) => {
  c.set('requestId', crypto.randomUUID?.() || Date.now().toString(36));
  c.header('X-Request-Id', c.get('requestId'));
  await next();
});

// Health
app.get('/', (c) => c.json({ name: 'ANOS API', version: '0.3.0', status: 'ok' }));
app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString(), uptime: process.uptime() }));

// Auth (public)
app.route('/api/auth', authRoutes);

// Protected Routes
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

app.onError(errorHandler);

export { app };
