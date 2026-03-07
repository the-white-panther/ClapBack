import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { TextInputArea } from '../components/TextInputArea';
import { ToneSelector } from '../components/ToneSelector';
import { Tone } from '../constants/config';
import { recognizeText } from '../modules/expo-ocr';
import { useFreeCount } from '../contexts/FreeCountContext';

export default function HomeScreen() {
  const [chatContext, setChatContext] = useState('');
  const [tone, setTone] = useState<Tone>('calm');
  const [customTone, setCustomTone] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const { remaining, canAnalyze } = useFreeCount();

  const canSubmit =
    chatContext.trim().length > 0 && (tone !== 'custom' || customTone.trim().length > 0);

  const handleAnalyze = () => {
    if (!canSubmit) return;
    if (!canAnalyze) {
      router.push('/paywall');
      return;
    }
    router.push({
      pathname: '/results',
      params: {
        chatContext,
        tone,
        ...(tone === 'custom' ? { customTone } : {}),
      },
    });
  };

  const handlePickScreenshot = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (result.canceled || !result.assets[0]) return;

    setOcrLoading(true);
    try {
      const text = await recognizeText(result.assets[0].uri);
      if (text.trim().length === 0) {
        Alert.alert('No text found', 'Could not detect any text in that screenshot. Try a clearer image.');
        return;
      }
      setChatContext(text);
    } catch {
      Alert.alert('OCR failed', 'Something went wrong reading the screenshot. Try pasting the text instead.');
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Analyze a conversation</Text>
          <Text style={styles.subtitle}>Paste the chat or pick a screenshot</Text>

          <View style={styles.inputMethods}>
            <TouchableOpacity
              style={styles.screenshotButton}
              onPress={handlePickScreenshot}
              disabled={ocrLoading}
            >
              {ocrLoading ? (
                <ActivityIndicator size="small" color="#4F46E5" />
              ) : (
                <Text style={styles.screenshotButtonText}>Pick Screenshot</Text>
              )}
            </TouchableOpacity>
          </View>

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

          <Text style={styles.freeCountBadge}>
            {remaining > 0
              ? `${remaining} free ${remaining === 1 ? 'analysis' : 'analyses'} remaining`
              : 'No free analyses remaining'}
          </Text>
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
  inputMethods: { flexDirection: 'row', marginBottom: 12 },
  screenshotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  screenshotButtonText: { fontSize: 14, fontWeight: '600', color: '#4F46E5' },
  button: { borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 32 },
  buttonActive: { backgroundColor: '#4F46E5' },
  buttonDisabled: { backgroundColor: '#D1D5DB' },
  buttonText: { fontSize: 16, fontWeight: '600' },
  buttonTextActive: { color: '#FFFFFF' },
  buttonTextDisabled: { color: '#6B7280' },
  freeCountBadge: {
    textAlign: 'center',
    fontSize: 13,
    color: '#4F46E5',
    marginBottom: 32,
  },
});
