import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthStore } from '@/store/auth';

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments.includes(`(${role})`);

    if (!isAuthenticated && inProtectedGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace(`/(${role})`);
    }
  }, [isAuthenticated, segments, router, role]);
}

export default function RootLayout() {
  useFrameworkReady();
  useProtectedRoute();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(employee)" options={{ headerShown: false }} />
        <Stack.Screen name="(validator)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
