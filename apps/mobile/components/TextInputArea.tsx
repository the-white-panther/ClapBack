import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { APP_CONFIG } from '../constants/config';

interface TextInputAreaProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function TextInputArea({ value, onChangeText }: TextInputAreaProps) {
  return (
    <View className="mb-4">
      <TextInput
        className="bg-gray-100 rounded-xl p-4 text-base min-h-[160px] text-gray-900"
        placeholder="Paste your conversation here..."
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        maxLength={APP_CONFIG.MAX_CHAT_CONTEXT_LENGTH}
        value={value}
        onChangeText={onChangeText}
      />
      <Text className="text-right text-xs text-gray-400 mt-1">
        {value.length}/{APP_CONFIG.MAX_CHAT_CONTEXT_LENGTH}
      </Text>
    </View>
  );
}
