import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../constants/config';

const STORAGE_KEY = 'what2say_free_count';

export function useFreeCount() {
  const [remaining, setRemaining] = useState<number>(APP_CONFIG.FREE_ANALYSIS_LIMIT);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value !== null) {
        setRemaining(Number(value));
      }
    });
  }, []);

  const decrement = useCallback(async () => {
    const next = Math.max(remaining - 1, 0);
    setRemaining(next);
    await AsyncStorage.setItem(STORAGE_KEY, String(next));
  }, [remaining]);

  const canAnalyze = remaining > 0;

  return { remaining, decrement, canAnalyze };
}
