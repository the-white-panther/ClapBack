export interface AnalyzeRequest {
  chatContext: string;
  additionalContext?: string;
  clarifyingAnswers?: string;
}

export interface ReplyOption {
  label: string;
  text: string;
}

export interface AnalyzeResponse {
  analysis: string;
  recommendation: string;
  replies: ReplyOption[];
}

export interface ClarifyResponse {
  questions: string[];
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
