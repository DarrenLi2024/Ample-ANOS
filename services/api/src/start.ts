import { app } from './app';
import { serve } from '@hono/node-server';

const port = parseInt(process.env.PORT || '3001', 10);
console.log(`🚀 ANOS API starting on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
