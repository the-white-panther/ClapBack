import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Tone, TONE_PRESETS } from '../constants/config';

interface ToneSelectorProps {
  selected: Tone;
  customTone: string;
  onSelect: (tone: Tone) => void;
  onCustomToneChange: (text: string) => void;
}

export function ToneSelector({
  selected,
  customTone,
  onSelect,
  onCustomToneChange,
}: ToneSelectorProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-600 mb-2">Choose a tone</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {TONE_PRESETS.map((tone) => (
            <TouchableOpacity
              key={tone.id}
              className={`px-4 py-2 rounded-full border ${
                selected === tone.id
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-white border-gray-300'
              }`}
              onPress={() => onSelect(tone.id)}
            >
              <Text
                className={`text-sm ${
                  selected === tone.id ? 'text-white font-semibold' : 'text-gray-700'
                }`}
              >
                {tone.emoji} {tone.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            className={`px-4 py-2 rounded-full border ${
              selected === 'custom'
                ? 'bg-indigo-600 border-indigo-600'
                : 'bg-white border-gray-300'
            }`}
            onPress={() => onSelect('custom')}
          >
            <Text
              className={`text-sm ${
                selected === 'custom' ? 'text-white font-semibold' : 'text-gray-700'
              }`}
            >
              Custom
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {selected === 'custom' && (
        <TextInput
          className="bg-gray-100 rounded-lg p-3 mt-2 text-base text-gray-900"
          placeholder="Describe your tone..."
          placeholderTextColor="#9CA3AF"
          value={customTone}
          onChangeText={onCustomToneChange}
        />
      )}
    </View>
  );
}
