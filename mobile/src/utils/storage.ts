import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Storage utility that works across web and mobile platforms
 * - Uses SecureStore for iOS/Android
 * - Uses localStorage for web
 */

const isWeb = Platform.OS === 'web';

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (isWeb) {
        // Use localStorage for web
        return localStorage.getItem(key);
      } else {
        // Use SecureStore for mobile
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (isWeb) {
        // Use localStorage for web
        localStorage.setItem(key, value);
      } else {
        // Use SecureStore for mobile
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (isWeb) {
        // Use localStorage for web
        localStorage.removeItem(key);
      } else {
        // Use SecureStore for mobile
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      if (isWeb) {
        // Clear localStorage for web
        localStorage.clear();
      } else {
        // Clear all SecureStore items for mobile
        // Note: SecureStore doesn't have a clear all method,
        // so you need to delete items individually
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('userData');
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
