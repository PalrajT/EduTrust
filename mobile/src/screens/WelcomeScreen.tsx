import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';

const WelcomeScreen = () => {
  const { t } = useTranslation();
  const navigation: any = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>{t('welcome.title') || 'Welcome to EduTrust'}</Text>
      <Text style={styles.subtitle}>{t('welcome.subtitle') || 'Verify certificates easily and securely.'}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryText}>{t('welcome.login') || 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.ghostButton]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.ghostText}>{t('welcome.explore') || 'Explore'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: theme.colors.primary,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    width: '100%'
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghostText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
