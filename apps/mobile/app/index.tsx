import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInputArea } from '../components/TextInputArea';
import { ToneSelector } from '../components/ToneSelector';
import { Tone } from '../constants/config';

export default function HomeScreen() {
  const [chatContext, setChatContext] = useState('');
  const [tone, setTone] = useState<Tone>('calm');
  const [customTone, setCustomTone] = useState('');

  const canSubmit = chatContext.trim().length > 0 && (tone !== 'custom' || customTone.trim().length > 0);

  const handleAnalyze = () => {
    if (!canSubmit) return;
    router.push({
      pathname: '/results',
      params: {
        chatContext,
        tone,
        ...(tone === 'custom' ? { customTone } : {}),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
          <Text className="text-2xl font-bold text-gray-900 mb-1">Analyze a conversation</Text>
          <Text className="text-sm text-gray-500 mb-4">
            Paste the chat and choose a reply tone
          </Text>

          <TextInputArea value={chatContext} onChangeText={setChatContext} />
          <ToneSelector
            selected={tone}
            customTone={customTone}
            onSelect={setTone}
            onCustomToneChange={setCustomTone}
          />

          <TouchableOpacity
            className={`rounded-xl py-4 items-center mt-2 ${
              canSubmit ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
            onPress={handleAnalyze}
            disabled={!canSubmit}
          >
            <Text className={`text-base font-semibold ${canSubmit ? 'text-white' : 'text-gray-500'}`}>
              Analyze
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
