import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { TextInputArea } from '../components/TextInputArea';
import { recognizeText } from '../modules/expo-ocr';
import { useFreeCount } from '../contexts/FreeCountContext';

export default function HomeScreen() {
  const params = useLocalSearchParams<{ prefillContext?: string; prefillAdditional?: string }>();
  const [chatContext, setChatContext] = useState(params.prefillContext ?? '');
  const [additionalContext, setAdditionalContext] = useState(params.prefillAdditional ?? '');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const { remaining, canAnalyze } = useFreeCount();

  const canSubmit = chatContext.trim().length > 0;

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
        ...(additionalContext.trim().length > 0 ? { additionalContext } : {}),
      },
    });
  };

  const handlePickScreenshot = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    setOcrLoading(true);
    try {
      const texts: string[] = [];
      for (const asset of result.assets) {
        const text = await recognizeText(asset.uri);
        if (text.trim().length > 0) {
          texts.push(text.trim());
        }
      }
      if (texts.length === 0) {
        Alert.alert('No text found', 'Could not detect any text in the selected images. Try clearer images.');
        return;
      }
      setChatContext(texts.join('\n\n'));
      setPhotoCount(result.assets.length);
    } catch {
      Alert.alert('OCR failed', 'Something went wrong reading the screenshots. Try pasting the text instead.');
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
          <Text style={styles.subtitle}>Paste messages, pick screenshots, or both</Text>

          <View style={styles.inputMethods}>
            <TouchableOpacity
              style={styles.screenshotButton}
              onPress={handlePickScreenshot}
              disabled={ocrLoading}
            >
              {ocrLoading ? (
                <ActivityIndicator size="small" color="#4F46E5" />
              ) : (
                <Text style={styles.screenshotButtonText}>
                  {photoCount > 0 ? `${photoCount} photo${photoCount > 1 ? 's' : ''} selected` : 'Pick Screenshots'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TextInputArea value={chatContext} onChangeText={setChatContext} />

          <TextInput
            style={styles.additionalContextInput}
            placeholder="Add context... (e.g. 'This is my boss, we've had tension for months')"
            placeholderTextColor="#9CA3AF"
            value={additionalContext}
            onChangeText={setAdditionalContext}
            multiline
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
  additionalContextInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 60,
    textAlignVertical: 'top',
    marginTop: 12,
    marginBottom: 4,
  },
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
