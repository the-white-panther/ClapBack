import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FreeCountProvider } from '../contexts/FreeCountContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FreeCountProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#4F46E5',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'ClapBack' }} />
        <Stack.Screen name="results" options={{ title: 'Results' }} />
        <Stack.Screen name="paywall" options={{ title: 'Subscribe' }} />
      </Stack>
      </FreeCountProvider>
    </SafeAreaProvider>
  );
}
