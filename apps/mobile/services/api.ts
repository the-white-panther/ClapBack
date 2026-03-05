import { APP_CONFIG, Tone } from '../constants/config';

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
  replies: ReplyOption[];
}

export async function analyzeChat(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  const response = await fetch(`${APP_CONFIG.API_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}
