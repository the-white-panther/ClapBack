// Re-export shared types (duplicated locally until monorepo linking is set up)
export type TonePreset = 'calm' | 'assertive' | 'cold' | 'funny' | 'romantic' | 'savage';

export type Tone = TonePreset | 'custom';

export interface AnalyzeRequest {
  chatContext: string;
  tone: Tone;
  customTone?: string;
}

export interface ReplyOption {
  label: string;
  text: string;
}

export interface AnalyzeResponse {
  psychology: string;
  replies: [ReplyOption, ReplyOption, ReplyOption];
}

export interface SubscriptionStatus {
  isActive: boolean;
  freeAnalysesRemaining: number;
}

export interface ValidateSubscriptionRequest {
  revenuecatUserId: string;
}

// Backend-specific types

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
