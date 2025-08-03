import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="connect-strava" />
      <Stack.Screen name="sync-strava" />
      <Stack.Screen name="plan-selection" />
      <Stack.Screen name="training-plan" />
      <Stack.Screen name="preferences" />
    </Stack>
  );
}
