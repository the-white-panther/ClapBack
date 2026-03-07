import { Hono } from 'hono';
import { buildClarifyPrompt } from '../services/prompt.js';
import { callOpenRouter } from '../services/openrouter.js';
import { validateAnalyzeRequest } from '../middleware/validateRequest.js';
import { ENV } from '../config/index.js';

const clarifyRouter = new Hono();

clarifyRouter.post('/', validateAnalyzeRequest, async (c) => {
  const body = await c.req.json();
  const messages = buildClarifyPrompt(body.chatContext, body.additionalContext);

  try {
    const rawResponse = await callOpenRouter(messages, ENV.OPENROUTER_MODEL_CHEAP);
    const cleaned = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return c.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return c.json({ error: `Failed to generate questions: ${message}` }, 500);
  }
});

export { clarifyRouter };
