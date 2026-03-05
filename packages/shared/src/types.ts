export type TonePreset = 'calm' | 'assertive' | 'cold' | 'funny' | 'romantic' | 'savage';

export type Tone = TonePreset | 'custom';

export interface AnalyzeRequest {
  chatContext: string;
  tone: Tone;
  customTone?: string; // only when tone === 'custom'
}

export interface ReplyOption {
  label: string;
  text: string;
}

export interface AnalyzeResponse {
  psychology: string;
  replies: [ReplyOption, ReplyOption, ReplyOption]; // always exactly 3
}

export interface SubscriptionStatus {
  isActive: boolean;
  freeAnalysesRemaining: number;
}

export interface ValidateSubscriptionRequest {
  revenuecatUserId: string;
}
