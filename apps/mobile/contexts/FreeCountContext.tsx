import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../constants/config';

const STORAGE_KEY = 'clapback_free_count';

interface FreeCountValue {
  remaining: number;
  decrement: () => Promise<void>;
  canAnalyze: boolean;
}

const FreeCountContext = createContext<FreeCountValue | null>(null);

export function FreeCountProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <FreeCountContext.Provider value={{ remaining, decrement, canAnalyze }}>
      {children}
    </FreeCountContext.Provider>
  );
}

export function useFreeCount(): FreeCountValue {
  const ctx = useContext(FreeCountContext);
  if (!ctx) {
    throw new Error('useFreeCount must be used within FreeCountProvider');
  }
  return ctx;
}
