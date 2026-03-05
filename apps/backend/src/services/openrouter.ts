import { ENV } from '../config/index.js';
import { OpenRouterRequest, OpenRouterResponse } from '../types/index.js';

export async function callOpenRouter(systemPrompt: string, userPrompt: string): Promise<string> {
  const body: OpenRouterRequest = {
    model: ENV.OPENROUTER_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 1500,
  };

  const response = await fetch(`${ENV.OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://what2say.app',
      'X-Title': 'What2Say',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${error}`);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0].message.content;
}
