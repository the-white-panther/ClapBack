import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnalysisCard } from '../components/AnalysisCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { ReplyCard } from '../components/ReplyCard';
import { useAnalysis } from '../hooks/useAnalysis';
import { useFreeCount } from '../contexts/FreeCountContext';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    chatContext: string;
    additionalContext?: string;
  }>();

  const { phase, questions, data, error, startClarify, submitAnswers } = useAnalysis();
  const { decrement } = useFreeCount();
  const decremented = useRef(false);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (params.chatContext) {
      startClarify(params.chatContext, params.additionalContext);
    }
  }, [params.chatContext, params.additionalContext, startClarify]);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setAnswers(new Array(questions.length).fill(''));
    }
  }, [questions]);

  useEffect(() => {
    if (phase === 'done' && !decremented.current) {
      decremented.current = true;
      decrement();
    }
  }, [phase, decrement]);

  const handleSubmitAnswers = () => {
    if (!questions) return;
    const formatted = questions
      .map((q, i) => `Q: ${q}\nA: ${answers[i] || ''}`)
      .join('\n\n');
    submitAnswers(formatted);
  };

  const updateAnswer = (index: number, value: string) => {
    setAnswers(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        {phase === 'clarifying' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Preparing questions...</Text>
          </View>
        )}

        {phase === 'answering' && questions && (
          <View style={styles.questionsCard}>
            <Text style={styles.questionsTitle}>A few quick questions</Text>
            <Text style={styles.questionsSubtitle}>Help us understand the situation better</Text>
            {questions.map((question, index) => (
              <View key={index} style={styles.questionBlock}>
                <Text style={styles.questionLabel}>{`${index + 1}. ${question}`}</Text>
                <TextInput
                  style={styles.questionInput}
                  placeholder="Your answer..."
                  placeholderTextColor="#9CA3AF"
                  value={answers[index] || ''}
                  onChangeText={(value) => updateAnswer(index, value)}
                  multiline
                />
              </View>
            ))}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitAnswers}>
              <Text style={styles.submitButtonText}>Submit Answers</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'analyzing' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Analyzing conversation...</Text>
          </View>
        )}

        {phase === 'error' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => startClarify(params.chatContext!, params.additionalContext)}
            >
              <Text style={styles.actionButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'done' && data && (
          <>
            <AnalysisCard analysis={data.analysis} />
            <RecommendationCard recommendation={data.recommendation} />
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
  questionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  questionsTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  questionsSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  questionBlock: { marginBottom: 16 },
  questionLabel: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 8 },
  questionInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
