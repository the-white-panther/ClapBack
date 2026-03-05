import React from 'react';
import { View, Text } from 'react-native';

interface PsychologyCardProps {
  insight: string;
}

export function PsychologyCard({ insight }: PsychologyCardProps) {
  return (
    <View className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">
      <Text className="text-sm font-semibold text-amber-800 mb-2">Psychology Insight</Text>
      <Text className="text-base text-amber-900 leading-6">{insight}</Text>
    </View>
  );
}
