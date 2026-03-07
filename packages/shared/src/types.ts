export interface AnalyzeRequest {
  chatContext: string;
  additionalContext?: string;
}

export interface ReplyOption {
  label: string;
  text: string;
}

export interface AnalyzeResponse {
  analysis: string;
  recommendation: string;
  replies: ReplyOption[];
  clarifyingQuestions: string[];
}

export interface SubscriptionStatus {
  isActive: boolean;
  freeAnalysesRemaining: number;
}

export interface ValidateSubscriptionRequest {
  revenuecatUserId: string;
}
