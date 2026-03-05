import { Hono } from 'hono';
import { validateSubscription } from '../services/revenuecat.js';
import { ValidateSubscriptionRequest } from '../types/index.js';

const subscriptionRouter = new Hono();

subscriptionRouter.post('/', async (c) => {
  const { revenuecatUserId } = await c.req.json<ValidateSubscriptionRequest>();
  const status = await validateSubscription(revenuecatUserId);
  return c.json(status);
});

export { subscriptionRouter };
