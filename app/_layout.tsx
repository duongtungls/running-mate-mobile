import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/contexts/AuthContext';
import { TrainingProvider } from '@/contexts/TrainingContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { ActivityProvider } from '@/contexts/ActivityContext';
import '@/i18n'; // Initialize i18n

export default function RootLayout() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Layout initialized
  }, []);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>
          Initialization Error:
        </Text>
        <Text style={{ textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  try {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <ProfileProvider>
            <ActivityProvider>
              <NotificationProvider>
                <TrainingProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style="light" />
                </TrainingProvider>
              </NotificationProvider>
            </ActivityProvider>
          </ProfileProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    );
  } catch (err) {
    console.error('[RootLayout] Error in render:', err);
    setError(err instanceof Error ? err.message : 'Unknown error');
    return null;
  }
}
