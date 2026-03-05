import { Context, Next } from 'hono';
import { Tone } from '../types/index.js';

const VALID_TONES: Tone[] = ['calm', 'assertive', 'cold', 'funny', 'romantic', 'savage', 'custom'];
const MAX_CHAT_CONTEXT_LENGTH = 5000;

export async function validateAnalyzeRequest(c: Context, next: Next) {
  let body: Record<string, unknown>;

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body.' }, 400);
  }

  const { chatContext, tone, customTone } = body;

  if (!chatContext || typeof chatContext !== 'string') {
    return c.json({ error: 'chatContext is required and must be a string.' }, 400);
  }

  if ((chatContext as string).length > MAX_CHAT_CONTEXT_LENGTH) {
    return c.json({ error: `chatContext must be under ${MAX_CHAT_CONTEXT_LENGTH} characters.` }, 400);
  }

  if (!tone || !VALID_TONES.includes(tone as Tone)) {
    return c.json({ error: `tone must be one of: ${VALID_TONES.join(', ')}` }, 400);
  }

  if (tone === 'custom' && (!customTone || typeof customTone !== 'string')) {
    return c.json({ error: 'customTone is required when tone is "custom".' }, 400);
  }

  await next();
}
