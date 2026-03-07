import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PsychologyCard } from '../components/PsychologyCard';
import { ReplyCard } from '../components/ReplyCard';
import { useAnalysis } from '../hooks/useAnalysis';
import { Tone } from '../constants/config';
import { useFreeCount } from '../contexts/FreeCountContext';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    chatContext: string;
    tone: Tone;
    customTone?: string;
  }>();

  const { data, loading, error, analyze } = useAnalysis();
  const { decrement } = useFreeCount();
  const decremented = useRef(false);

  useEffect(() => {
    if (params.chatContext && params.tone) {
      analyze(params.chatContext, params.tone, params.customTone);
    }
  }, [params.chatContext, params.tone, params.customTone, analyze]);

  useEffect(() => {
    if (data && !decremented.current) {
      decremented.current = true;
      decrement();
    }
  }, [data, decrement]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scroll}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Analyzing conversation...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => analyze(params.chatContext!, params.tone!, params.customTone)}
            >
              <Text style={styles.actionButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {data && (
          <>
            <PsychologyCard insight={data.psychology} />
            <Text style={styles.sectionTitle}>Suggested Replies</Text>
            {data.replies.map((reply, index) => (
              <ReplyCard key={index} label={reply.label} text={reply.text} />
            ))}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.replace('/')}
            >
              <Text style={styles.actionButtonText}>New Analysis</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  loadingText: { color: '#6B7280', marginTop: 16, fontSize: 15 },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorTitle: { color: '#991B1B', fontWeight: '600', marginBottom: 4, fontSize: 15 },
  errorText: { color: '#B91C1C', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
  actionButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
