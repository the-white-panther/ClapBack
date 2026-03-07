import { APP_CONFIG } from '../constants/config';

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

export async function clarifyChat(request: AnalyzeRequest): Promise<ClarifyResponse> {
  const response = await fetch(`${APP_CONFIG.API_URL}/api/clarify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}
