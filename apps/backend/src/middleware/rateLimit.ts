import { Context, Next } from 'hono';
import { ENV } from '../config/index.js';

const WINDOW_MS = 60_000;

const requests = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(c: Context, next: Next) {
  const clientId = c.req.header('x-device-id') ?? c.req.header('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const entry = requests.get(clientId);

  if (entry && now < entry.resetAt) {
    if (entry.count >= ENV.RATE_LIMIT_PER_MINUTE) {
      return c.json({ error: 'Rate limit exceeded. Try again later.' }, 429);
    }
    entry.count++;
  } else {
    requests.set(clientId, { count: 1, resetAt: now + WINDOW_MS });
  }

  await next();
}
