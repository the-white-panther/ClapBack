import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RecommendationCardProps {
  recommendation: string;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>How to Handle This</Text>
      <Text style={styles.text}>{recommendation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  title: { fontSize: 14, fontWeight: '600', color: '#3730A3', marginBottom: 8 },
  text: { fontSize: 16, color: '#312E81', lineHeight: 24 },
});
