
import React, { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setupErrorLogging } from '../utils/errorLogger';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { colors } from '../styles/commonStyles';

const STORAGE_KEY = 'natively_emulate_device';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary - Component stack:', errorInfo.componentStack);
    console.error('Error Boundary - Error:', error);
    
    // Show user-friendly error message
    setTimeout(() => {
      Alert.alert(
        'Application Error',
        'Something went wrong. The app will try to recover automatically.',
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState({ hasError: false, error: undefined });
            }
          }
        ]
      );
    }, 100);
  }

  render() {
    if (this.state.hasError) {
      // Return null to let the app try to recover
      return null;
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const { emulate } = useGlobalSearchParams();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        setupErrorLogging();
        
        // Add a small delay to ensure everything is properly initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setIsReady(true);
        console.log('App initialization complete');
      } catch (error) {
        console.error('Error during app initialization:', error);
        // Still set ready to true to prevent infinite loading
        setIsReady(true);
      }
    };

    initializeApp();
  }, [emulate]);

  // Global promise rejection handler
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection in RootLayout:', event.reason);
      
      // Prevent the default behavior
      event.preventDefault();
      
      // Show user-friendly message
      Alert.alert(
        'Connection Error',
        'There was a problem with the app. Please try again.',
        [{ text: 'OK' }]
      );
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      
      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
