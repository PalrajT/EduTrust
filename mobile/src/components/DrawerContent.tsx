import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography, shadows } from '../theme/theme';

const DrawerContent = React.forwardRef((props: any, ref) => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={56} color="#fff" />
          </View>
          <Text style={styles.appName}>{t('appName')}</Text>
          <Text style={styles.tagline}>{t('tagline')}</Text>
          
          {isAuthenticated && user && (
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name || user.email}</Text>
                <Text style={styles.userRole}>{user.role || 'User'}</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </LinearGradient>

      {/* Navigation Items - render manually to avoid animated DrawerItem components */}
      <View style={styles.menuContainer}>
        {(() => {
          const { state, navigation, descriptors } = props as any;
          return state.routes.map((route: any, idx: number) => {
            const focused = state.index === idx;
            const descriptor = descriptors[route.key] || {};
            const title = descriptor.options?.title ?? route.name;
            const DrawerIcon = descriptor.options?.drawerIcon;
            return (
              <TouchableOpacity
                key={route.key}
                style={[styles.menuItem, focused && styles.menuItemActive]}
                onPress={() => navigation.navigate(route.name)}
              >
                {DrawerIcon ? (
                  <View style={styles.menuIcon}>
                    {DrawerIcon({ color: focused ? colors.primary : colors.text, size: 20 })}
                  </View>
                ) : null}
                <Text style={[styles.menuItemText, focused && styles.menuItemTextActive]}>{title}</Text>
              </TouchableOpacity>
            );
          });
        })()}
      </View>

      {/* Language Selector */}
      <View style={styles.languageSection}>
        <Text style={styles.sectionTitle}>{t('nav.language') || 'Language'}</Text>
        <View style={styles.languageButtons}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                i18n.language === lang.code && styles.languageButtonActive,
              ]}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text
                style={[
                  styles.languageText,
                  i18n.language === lang.code && styles.languageTextActive,
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      {isAuthenticated && (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={styles.logoutText}>{t('nav.logout')}</Text>
        </TouchableOpacity>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 EduTrust
        </Text>
        <Text style={styles.footerSubtext}>
          Team COSMOS
        </Text>
      </View>
    </DrawerContentScrollView>
  );
});

DrawerContent.displayName = 'DrawerContent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 48,
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: '#E0E7FF',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '400',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    width: '100%',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  userRole: {
    color: '#E0E7FF',
    fontSize: 13,
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 8,
  },
  languageSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  languageButtons: {
    gap: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
  },
  languageButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  languageFlag: {
    fontSize: 26,
    marginRight: 14,
  },
  languageText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  languageTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderRadius: 10,
    marginVertical: 2,
  },
  menuItemActive: {
    backgroundColor: colors.primaryLight,
  },
  menuIcon: {
    width: 28,
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  menuItemTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '700',
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '400',
  },
});

export default DrawerContent;
