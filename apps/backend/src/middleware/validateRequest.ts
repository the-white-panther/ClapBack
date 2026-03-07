import { Context, Next } from 'hono';

const MAX_CHAT_CONTEXT_LENGTH = 5000;

export async function validateAnalyzeRequest(c: Context, next: Next) {
  let body: Record<string, unknown>;

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body.' }, 400);
  }

  const { chatContext, additionalContext, clarifyingAnswers } = body;

  if (!chatContext || typeof chatContext !== 'string') {
    return c.json({ error: 'chatContext is required and must be a string.' }, 400);
  }

  if ((chatContext as string).length > MAX_CHAT_CONTEXT_LENGTH) {
    return c.json({ error: `chatContext must be under ${MAX_CHAT_CONTEXT_LENGTH} characters.` }, 400);
  }

  if (additionalContext !== undefined && typeof additionalContext !== 'string') {
    return c.json({ error: 'additionalContext must be a string.' }, 400);
  }

  if (clarifyingAnswers !== undefined && typeof clarifyingAnswers !== 'string') {
    return c.json({ error: 'clarifyingAnswers must be a string.' }, 400);
  }

  await next();
}
