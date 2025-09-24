
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setupErrorLogging } from '../utils/errorLogger';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { colors } from '../styles/commonStyles';

const STORAGE_KEY = 'natively_emulate_device';

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const { emulate } = useGlobalSearchParams();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setupErrorLogging();
    setIsReady(true);
  }, [emulate]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
