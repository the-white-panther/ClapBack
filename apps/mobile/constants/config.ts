export const APP_CONFIG = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  FREE_ANALYSIS_LIMIT: 50,
  MAX_CHAT_CONTEXT_LENGTH: 5000,
} as const;
