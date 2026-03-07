export const APP_CONFIG = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  FREE_ANALYSIS_LIMIT: 2,
  MAX_CHAT_CONTEXT_LENGTH: 5000,
} as const;

export type TonePreset = 'calm' | 'assertive' | 'cold' | 'funny' | 'romantic' | 'savage';
export type Tone = TonePreset | 'custom';

export interface ToneConfig {
  id: TonePreset;
  label: string;
  emoji: string;
}

export const TONE_PRESETS: ToneConfig[] = [
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'assertive', label: 'Assertive', emoji: '💪' },
  { id: 'cold', label: 'Cold', emoji: '🧊' },
  { id: 'funny', label: 'Funny', emoji: '😂' },
  { id: 'romantic', label: 'Romantic', emoji: '❤️' },
  { id: 'savage', label: 'Savage', emoji: '🔥' },
];
