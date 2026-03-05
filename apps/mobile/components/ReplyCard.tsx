import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';

interface ReplyCardProps {
  label: string;
  text: string;
}

export function ReplyCard({ label, text }: ReplyCardProps) {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-semibold text-indigo-600">{label}</Text>
        <TouchableOpacity
          className="bg-indigo-100 px-3 py-1 rounded-full"
          onPress={handleCopy}
        >
          <Text className="text-xs font-medium text-indigo-700">Copy</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-base text-gray-800 leading-6">{text}</Text>
    </View>
  );
}
