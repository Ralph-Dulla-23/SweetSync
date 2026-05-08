import { Redirect } from 'expo-router';

export default function Index() {
  // Splash / redirect logic
  // In a real app, check auth state and redirect to (tabs) or (auth)/onboarding
  return <Redirect href="/(tabs)" />;
}
