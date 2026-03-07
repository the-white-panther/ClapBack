import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PsychologyCardProps {
  insight: string;
}

export function PsychologyCard({ insight }: PsychologyCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Psychology Insight</Text>
      <Text style={styles.text}>{insight}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  title: { fontSize: 14, fontWeight: '600', color: '#92400E', marginBottom: 8 },
  text: { fontSize: 16, color: '#78350F', lineHeight: 24 },
});
