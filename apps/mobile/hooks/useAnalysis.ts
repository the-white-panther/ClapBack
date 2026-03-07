import { useState, useCallback } from 'react';
import { analyzeChat, clarifyChat, AnalyzeResponse, ClarifyResponse } from '../services/api';

type Phase = 'idle' | 'clarifying' | 'answering' | 'analyzing' | 'done' | 'error';

interface UseAnalysisState {
  phase: Phase;
  questions: string[] | null;
  data: AnalyzeResponse | null;
  error: string | null;
}

export function useAnalysis() {
  const [state, setState] = useState<UseAnalysisState>({
    phase: 'idle',
    questions: null,
    data: null,
    error: null,
  });
  const [context, setContext] = useState<{ chatContext: string; additionalContext?: string }>({ chatContext: '' });

  const startClarify = useCallback(async (chatContext: string, additionalContext?: string) => {
    setContext({ chatContext, additionalContext });
    setState({ phase: 'clarifying', questions: null, data: null, error: null });
    try {
      const result = await clarifyChat({ chatContext, additionalContext });
      setState({ phase: 'answering', questions: result.questions, data: null, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setState({ phase: 'error', questions: null, data: null, error: message });
    }
  }, []);

  const submitAnswers = useCallback(async (clarifyingAnswers: string) => {
    setState(prev => ({ ...prev, phase: 'analyzing' }));
    try {
      const data = await analyzeChat({ ...context, clarifyingAnswers });
      setState({ phase: 'done', questions: null, data, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setState(prev => ({ ...prev, phase: 'error', error: message }));
    }
  }, [context]);

  return { ...state, startClarify, submitAnswers };
}
