import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import GradientBackground from '../components/GradientBackground';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to login screen
    // You can add auth check logic here in the future:
    // - Check if user is already logged in
    // - Check if user has seen onboarding
    // - Redirect accordingly

    const timer = setTimeout(() => {
      router.replace('/(tabs)');
      // router.replace('/(auth)/login');
    }, 200); // Small delay to prevent flash

    return () => clearTimeout(timer);
  }, [router]);

  // Show loading screen while redirecting
  return (
    <GradientBackground>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </GradientBackground>
  );
}
