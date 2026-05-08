import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, shadows, spacing } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'small' | 'medium' | 'large';
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  elevation = 'medium',
  padding = 'md'
}) => {
  return (
    <View style={[
      styles.card,
      shadows[elevation],
      { padding: spacing[padding] },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
