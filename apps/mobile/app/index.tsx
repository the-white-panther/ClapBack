import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInputArea } from '../components/TextInputArea';
import { ToneSelector } from '../components/ToneSelector';
import { Tone } from '../constants/config';

export default function HomeScreen() {
  const [chatContext, setChatContext] = useState('');
  const [tone, setTone] = useState<Tone>('calm');
  const [customTone, setCustomTone] = useState('');

  const canSubmit =
    chatContext.trim().length > 0 && (tone !== 'custom' || customTone.trim().length > 0);

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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Analyze a conversation</Text>
          <Text style={styles.subtitle}>Paste the chat and choose a reply tone</Text>

          <TextInputArea value={chatContext} onChangeText={setChatContext} />
          <ToneSelector
            selected={tone}
            customTone={customTone}
            onSelect={setTone}
            onCustomToneChange={setCustomTone}
          />

          <TouchableOpacity
            style={[styles.button, canSubmit ? styles.buttonActive : styles.buttonDisabled]}
            onPress={handleAnalyze}
            disabled={!canSubmit}
          >
            <Text style={[styles.buttonText, canSubmit ? styles.buttonTextActive : styles.buttonTextDisabled]}>
              Analyze
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  button: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 32 },
  buttonActive: { backgroundColor: '#4F46E5' },
  buttonDisabled: { backgroundColor: '#D1D5DB' },
  buttonText: { fontSize: 16, fontWeight: '600' },
  buttonTextActive: { color: '#FFFFFF' },
  buttonTextDisabled: { color: '#6B7280' },
});
