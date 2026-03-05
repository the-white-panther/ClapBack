import { Hono } from 'hono';
import { buildPrompt } from '../services/prompt.js';
import { callOpenRouter } from '../services/openrouter.js';
import { validateAnalyzeRequest } from '../middleware/validateRequest.js';
import { AnalyzeRequest, AnalyzeResponse } from '../types/index.js';

const analyzeRouter = new Hono();

analyzeRouter.post('/', validateAnalyzeRequest, async (c) => {
  const body = await c.req.json<AnalyzeRequest>();
  const { systemPrompt, userPrompt } = buildPrompt(body.chatContext, body.tone, body.customTone);

  try {
    const rawResponse = await callOpenRouter(systemPrompt, userPrompt);

    const cleaned = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed: AnalyzeResponse = JSON.parse(cleaned);

    return c.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return c.json({ error: `Failed to analyze conversation: ${message}` }, 500);
  }
});

export { analyzeRouter };
