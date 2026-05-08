import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const hapticFeedback = {
  // Light haptic feedback for button taps
  light: () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },

  // Medium haptic feedback for interactions
  medium: () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },

  // Heavy haptic feedback for important actions
  heavy: () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },

  // Success notification
  success: () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },

  // Warning notification
  warning: () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },

  // Error notification
  error: () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },

  // Selection change feedback
  selection: () => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      Haptics.selectionAsync();
    }
  },
};
