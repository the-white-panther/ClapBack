import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIERS = [
  { name: 'Weekly', price: '$1.99/wk', badge: '' },
  { name: 'Monthly', price: '$6.99/mo', badge: 'Most Popular' },
  { name: 'Yearly', price: '$39.99/yr', badge: 'Best Value' },
];

export default function PaywallScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Subscribe to continue</Text>
        <Text style={styles.subtitle}>Unlock unlimited analyses and premium features</Text>

        {TIERS.map((tier) => (
          <TouchableOpacity key={tier.name} style={styles.tierCard}>
            <View>
              <Text style={styles.tierName}>{tier.name}</Text>
              {tier.badge ? <Text style={styles.tierBadge}>{tier.badge}</Text> : null}
            </View>
            <Text style={styles.tierPrice}>{tier.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 32, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32, textAlign: 'center' },
  tierCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierName: { fontSize: 18, fontWeight: '600', color: '#111827' },
  tierBadge: { fontSize: 12, color: '#4F46E5', fontWeight: '500', marginTop: 2 },
  tierPrice: { fontSize: 16, fontWeight: '600', color: '#4F46E5' },
});
