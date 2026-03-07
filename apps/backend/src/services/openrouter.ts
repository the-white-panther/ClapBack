import { ENV } from '../config/index.js';
import { OpenRouterMessage, OpenRouterRequest, OpenRouterResponse } from '../types/index.js';

export async function callOpenRouter(messages: OpenRouterMessage[], model: string): Promise<string> {
  const body: OpenRouterRequest = {
    model,
    messages,
    temperature: 0.9,
    max_tokens: 1500,
  };

  const response = await fetch(`${ENV.OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://clapback.app',
      'X-Title': 'ClapBack',
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
