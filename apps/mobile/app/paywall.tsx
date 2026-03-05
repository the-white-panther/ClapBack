import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIERS = [
  { name: 'Weekly', price: '$2.99/wk', badge: '' },
  { name: 'Monthly', price: '$7.99/mo', badge: 'Most Popular' },
  { name: 'Yearly', price: '$49.99/yr', badge: 'Best Value' },
];

export default function PaywallScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <View className="flex-1 px-4 pt-8 items-center">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Subscribe to continue</Text>
        <Text className="text-base text-gray-500 mb-8 text-center">
          Unlock unlimited analyses and premium features
        </Text>

        {TIERS.map((tier) => (
          <TouchableOpacity
            key={tier.name}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3 flex-row justify-between items-center"
          >
            <View>
              <Text className="text-lg font-semibold text-gray-900">{tier.name}</Text>
              {tier.badge ? (
                <Text className="text-xs text-indigo-600 font-medium">{tier.badge}</Text>
              ) : null}
            </View>
            <Text className="text-base font-semibold text-indigo-600">{tier.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
