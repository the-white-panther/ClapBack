import { TonePreset } from './types';

export interface ToneConfig {
  id: TonePreset;
  label: string;
  emoji: string;
  promptModifier: string;
}

export const TONE_PRESETS: ToneConfig[] = [
  { id: 'calm', label: 'Calm', emoji: '😌', promptModifier: 'Reply in a calm, measured, and emotionally balanced tone. Avoid escalation.' },
  { id: 'assertive', label: 'Assertive', emoji: '💪', promptModifier: 'Reply in a confident, direct, and firm tone. Set clear boundaries without being aggressive.' },
  { id: 'cold', label: 'Cold', emoji: '🧊', promptModifier: 'Reply in a detached, emotionally distant tone. Keep it short and unbothered.' },
  { id: 'funny', label: 'Funny', emoji: '😂', promptModifier: 'Reply with humor and wit. Lighten the mood while still addressing the situation.' },
  { id: 'romantic', label: 'Romantic', emoji: '❤️', promptModifier: 'Reply in a warm, affectionate, and loving tone. Show vulnerability and care.' },
  { id: 'savage', label: 'Savage', emoji: '🔥', promptModifier: 'Reply with sharp wit and boldness. Be unapologetically direct and confident.' },
];

export const getToneConfig = (toneId: TonePreset): ToneConfig | undefined =>
  TONE_PRESETS.find((t) => t.id === toneId);
