import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PsychologyCard } from '../components/PsychologyCard';
import { ReplyCard } from '../components/ReplyCard';
import { useAnalysis } from '../hooks/useAnalysis';
import { Tone } from '../constants/config';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    chatContext: string;
    tone: Tone;
    customTone?: string;
  }>();

  const { data, loading, error, analyze } = useAnalysis();

  useEffect(() => {
    if (params.chatContext && params.tone) {
      analyze(params.chatContext, params.tone, params.customTone);
    }
  }, [params.chatContext, params.tone, params.customTone, analyze]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 pt-4">
        {loading && (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-gray-500 mt-4">Analyzing conversation...</Text>
          </View>
        )}

        {error && (
          <View className="bg-red-50 rounded-xl p-4 border border-red-200">
            <Text className="text-red-800 font-semibold mb-1">Something went wrong</Text>
            <Text className="text-red-700">{error}</Text>
          </View>
        )}

        {data && (
          <>
            <PsychologyCard insight={data.psychology} />
            <Text className="text-lg font-semibold text-gray-900 mb-3">Suggested Replies</Text>
            {data.replies.map((reply, index) => (
              <ReplyCard key={index} label={reply.label} text={reply.text} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
