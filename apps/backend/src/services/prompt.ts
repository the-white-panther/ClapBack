import { Tone, TonePreset } from '../types/index.js';

const TONE_MODIFIERS: Record<TonePreset, string> = {
  calm: 'Reply in a calm, measured, and emotionally balanced tone. Avoid escalation.',
  assertive: 'Reply in a confident, direct, and firm tone. Set clear boundaries without being aggressive.',
  cold: 'Reply in a detached, emotionally distant tone. Keep it short and unbothered.',
  funny: 'Reply with humor and wit. Lighten the mood while still addressing the situation.',
  romantic: 'Reply in a warm, affectionate, and loving tone. Show vulnerability and care.',
  savage: 'Reply with sharp wit and boldness. Be unapologetically direct and confident.',
};

export function buildPrompt(chatContext: string, tone: Tone, customTone?: string) {
  const toneInstruction = tone === 'custom' && customTone
    ? customTone
    : TONE_MODIFIERS[tone as TonePreset] ?? TONE_MODIFIERS.calm;

  const systemPrompt = [
    'You are What2Say, an AI conversation coach.',
    'Analyze the conversation the user provides and help them craft the perfect reply.',
    '',
    'You MUST:',
    '1. Provide a short, direct psychology insight (2-3 sentences max) explaining what is happening emotionally or psychologically in this conversation.',
    '2. Generate exactly 3 reply options with these labels: "Direct", "Softer", "Bold".',
    '3. Respond in the SAME LANGUAGE as the conversation.',
    `4. Apply this tone: ${toneInstruction}`,
    '5. Return ONLY valid JSON in this exact format, with no extra text or markdown:',
    '   { "psychology": "...", "replies": [{ "label": "Direct", "text": "..." }, { "label": "Softer", "text": "..." }, { "label": "Bold", "text": "..." }] }',
  ].join('\n');

  const userPrompt = `Here is the conversation I need help replying to:\n\n${chatContext}`;

  return { systemPrompt, userPrompt };
}
