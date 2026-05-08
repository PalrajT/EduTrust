import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  message 
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();

    // Fade in animation
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sizeMap = {
    small: 24,
    medium: 48,
    large: 64,
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeValue }]}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Ionicons 
          name="sync-circle" 
          size={sizeMap[size]} 
          color={colors.primary} 
        />
      </Animated.View>
      {message && <Text style={styles.message}>{message}</Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});
