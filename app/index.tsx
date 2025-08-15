import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import GradientBackground from '../components/GradientBackground';

export default function IndexScreen() {
  const router = useRouter();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Screen mounted, setting up redirect...

    // Simple fallback redirect after 2 seconds
    const fallbackTimer = setTimeout(() => {
      // Redirecting to login after timeout
      setTimeoutReached(true);
      // router.replace('/(auth)/login');
    }, 2000);

    return () => clearTimeout(fallbackTimer);
  }, [router]);

  useEffect(() => {
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);
  }, []);

  // useEffect(() => {
  //   console.log('router', router);
  //   const timer = setTimeout(() => {
  //     console.log('timer');
  //     router.replace('/login');
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
  //   // Immediately redirect to login screen
  //   // You can add auth check logic here in the future:
  //   // - Check if user is already logged in
  //   // - Check if user has seen onboarding
  //   // - Redirect accordingly

  //   const timer = setTimeout(() => {
  //     router.replace('/(auth)/login');
  //     // router.replace('/(auth)/login');
  //   }, 200); // Small delay to prevent flash

  //   return () => clearTimeout(timer);
  // }, [router]);

  // Show loading screen while checking auth and redirecting
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
        {timeoutReached && (
          <Text style={{ color: '#fff', marginTop: 16, textAlign: 'center' }}>
            Loading is taking longer than expected...{'\n'}Redirecting to login
          </Text>
        )}
      </View>
    </GradientBackground>
  );
}
