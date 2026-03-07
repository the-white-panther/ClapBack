export const ENV = {
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ?? '',
  REVENUECAT_SECRET_KEY: process.env.REVENUECAT_SECRET_KEY ?? '',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? '*',
  RATE_LIMIT_PER_MINUTE: Number(process.env.RATE_LIMIT_PER_MINUTE ?? '10'),
  PORT: Number(process.env.PORT ?? '3000'),
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
  OPENROUTER_MODEL_DEFAULT: process.env.OPENROUTER_MODEL_DEFAULT ?? 'openai/gpt-4o',
  OPENROUTER_MODEL_ALT: process.env.OPENROUTER_MODEL_ALT ?? 'openai/gpt-4o-mini',
} as const;
