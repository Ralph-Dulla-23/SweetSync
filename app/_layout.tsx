import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Fraunces_700Bold,
  Fraunces_700Bold_Italic,
} from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { colors, spacing } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/ToastConfig';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, loading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    Fraunces_700Bold,
    Fraunces_700Bold_Italic,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
  });

  useEffect(() => {
    if (authLoading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const isRoot = segments.length === 0 || segments[0] === 'index';

    // Guard: Unauthenticated users
    if (!session) {
      if (!inAuthGroup && !isRoot) {
        // Trying to access internal screens while logged out -> Send to onboarding
        router.replace('/');
      }
    } 
    // Guard: Authenticated users
    else {
      if (inAuthGroup || isRoot) {
        // Logged in but hit landing/onboarding -> Send to home dashboard
        router.replace('/(tabs)');
      }
    }

    // Hide splash screen once we've handled routing
    SplashScreen.hideAsync();
  }, [session, authLoading, fontsLoaded, segments]);

  if (!fontsLoaded || authLoading) {
    return <View style={{ flex: 1, backgroundColor: colors.pageBg }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.pageBg }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.pageBg },
        }}
      >
        <Stack.Screen name="index" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(auth)/onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="room/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>
      <Toast 
        config={toastConfig} 
        topOffset={insets.top + spacing[2]}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <RootLayoutNav />
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
