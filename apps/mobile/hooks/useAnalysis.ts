import { useState, useCallback } from 'react';
import { analyzeChat, AnalyzeResponse } from '../services/api';

interface UseAnalysisState {
  data: AnalyzeResponse | null;
  loading: boolean;
  error: string | null;
}

export function useAnalysis() {
  const [state, setState] = useState<UseAnalysisState>({
    data: null,
    loading: false,
    error: null,
  });

  const analyze = useCallback(
    async (chatContext: string, additionalContext?: string) => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await analyzeChat({ chatContext, additionalContext });
        setState({ data, loading: false, error: null });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setState({ data: null, loading: false, error: message });
      }
    },
    [],
  );

  return { ...state, analyze };
}
