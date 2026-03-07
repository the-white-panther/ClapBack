import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { APP_CONFIG } from '../constants/config';

interface TextInputAreaProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function TextInputArea({ value, onChangeText }: TextInputAreaProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Paste your conversation here..."
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        maxLength={APP_CONFIG.MAX_CHAT_CONTEXT_LENGTH}
        value={value}
        onChangeText={onChangeText}
      />
      <Text style={styles.counter}>
        {value.length}/{APP_CONFIG.MAX_CHAT_CONTEXT_LENGTH}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 160,
    color: '#111827',
  },
  counter: { textAlign: 'right', fontSize: 12, color: '#9CA3AF', marginTop: 4 },
});
