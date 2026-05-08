import 'react-native-reanimated';
import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Network from 'expo-network';
import './src/i18n/config';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { theme, colors } from './src/theme/theme';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = useState<string>('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function prepare() {
      try {
        console.log('=== EduTrust App Starting ===');
        console.log('Platform:', Platform.OS);
        
        // Animate splash screen
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]).start();

        // Spin animation for loading indicator
        Animated.loop(
          Animated.timing(spinAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ).start();
        
        // Check network connectivity
        if (Platform.OS === 'android') {
          try {
            const networkState = await Network.getNetworkStateAsync();
            console.log('Network State:', networkState);
            
            const info = `Connected: ${networkState.isConnected}, Internet: ${networkState.isInternetReachable}`;
            setNetworkInfo(info);
            
            if (!networkState.isConnected) {
              console.warn('No network connection detected');
            } else if (!networkState.isInternetReachable) {
              console.warn('Network connected but internet may not be reachable');
            }
          } catch (netError) {
            console.warn('Could not check network state:', netError);
          }
        }

        // Give time for i18n to initialize
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('=== App Initialization Complete ===');
        setIsReady(true);
      } catch (e) {
        console.error('App initialization error:', e);
        const errorMsg = e instanceof Error ? e.message : 'Unknown error during initialization';
        setError(errorMsg);
        // Still allow app to load even with errors
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!isReady) {
    return (
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.loadingContainer}
      >
        <Animated.View style={[
          styles.splashContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}>
          <View style={styles.logoWrapper}>
            <Ionicons name="shield-checkmark" size={100} color="#fff" />
          </View>
          <Text style={styles.appTitle}>EduTrust</Text>
          <Text style={styles.appTagline}>Verify with Confidence</Text>
          
          <Animated.View style={{ transform: [{ rotate: spin }], marginTop: 40 }}>
            <Ionicons name="sync-circle" size={40} color="#fff" />
          </Animated.View>
          
          {networkInfo ? (
            <Text style={styles.networkInfo}>{networkInfo}</Text>
          ) : null}
        </Animated.View>
      </LinearGradient>
    );
  }

  if (error) {
    console.warn('App started with initialization warning:', error);
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <NavigationContainer
              onReady={() => console.log('Navigation ready')}
              onStateChange={(state) => console.log('Navigation state changed:', state)}
              fallback={
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.loadingContainer}
                >
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Ionicons name="sync-circle" size={48} color="#fff" />
                  </Animated.View>
                  <Text style={styles.loadingText}>Loading navigation...</Text>
                </LinearGradient>
              }
            >
              <AppNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 16,
    color: '#E0E7FF',
    marginTop: 8,
    fontWeight: '400',
  },
  loadingText: {
    marginTop: 24,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  networkInfo: {
    marginTop: 12,
    fontSize: 13,
    color: '#E0E7FF',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

