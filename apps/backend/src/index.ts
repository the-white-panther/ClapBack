import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { analyzeRouter } from './routes/analyze.js';
import { subscriptionRouter } from './routes/subscription.js';
import { rateLimit } from './middleware/rateLimit.js';
import { ENV } from './config/index.js';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({ origin: ENV.ALLOWED_ORIGINS }));
app.use('/api/*', rateLimit);

app.route('/api/analyze', analyzeRouter);
app.route('/api/validate-subscription', subscriptionRouter);

app.get('/health', (c) => c.json({ status: 'ok' }));

serve({ fetch: app.fetch, port: ENV.PORT }, (info) => {
  console.log(`What2Say backend running on http://localhost:${info.port}`);
});
