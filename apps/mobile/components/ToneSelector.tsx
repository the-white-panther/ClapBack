import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.label}>Choose a tone</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {TONE_PRESETS.map((tone) => {
            const isSelected = selected === tone.id;
            return (
              <TouchableOpacity
                key={tone.id}
                style={[styles.chip, isSelected ? styles.chipSelected : styles.chipDefault]}
                onPress={() => onSelect(tone.id)}
              >
                <Text style={[styles.chipText, isSelected ? styles.chipTextSelected : styles.chipTextDefault]}>
                  {tone.label}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={[styles.chip, selected === 'custom' ? styles.chipSelected : styles.chipDefault]}
            onPress={() => onSelect('custom')}
          >
            <Text style={[styles.chipText, selected === 'custom' ? styles.chipTextSelected : styles.chipTextDefault]}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {selected === 'custom' && (
        <TextInput
          style={styles.customInput}
          placeholder="Describe your tone..."
          placeholderTextColor="#9CA3AF"
          value={customTone}
          onChangeText={onCustomToneChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipSelected: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  chipDefault: { backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' },
  chipText: { fontSize: 14 },
  chipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  chipTextDefault: { color: '#374151' },
  customInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
    color: '#111827',
  },
});
