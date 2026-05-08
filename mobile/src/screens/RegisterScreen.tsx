import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

const RegisterScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordStrength('');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough].filter(
      Boolean
    ).length;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 3) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'strong':
        return '#10B981';
      default:
        return colors.border;
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    if (formData.full_name.trim().length < 2) {
      setError('Please enter your full name');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }

    if (!/\d/.test(formData.password)) {
      setError('Password must contain at least one number');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);

      if (result.success) {
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="person-add" size={64} color="#fff" />
        <Text style={styles.title}>{t('register.title')}</Text>
        <Text style={styles.subtitle}>{t('register.subtitle')}</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('register.fullName')}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder={t('register.placeholders.fullName')}
              value={formData.full_name}
              onChangeText={(value) => handleChange('full_name', value)}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('register.username')}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="at-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder={t('register.placeholders.username')}
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('register.email')}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder={t('register.placeholders.email')}
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('register.password')}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder={t('register.placeholders.password')}
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {passwordStrength ? (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      width:
                        passwordStrength === 'weak'
                          ? '33%'
                          : passwordStrength === 'medium'
                          ? '66%'
                          : '100%',
                      backgroundColor: getPasswordStrengthColor(),
                    },
                  ]}
                />
              </View>
              <Text style={[styles.strengthText, { color: getPasswordStrengthColor() }]}>
                {t(`register.passwordStrength.${passwordStrength}`)}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('register.confirmPassword')}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder={t('register.placeholders.confirmPassword')}
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>{t('register.requirements.title')}</Text>
          <View style={styles.requirement}>
            <Ionicons
              name={formData.password.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
              size={16}
              color={formData.password.length >= 8 ? colors.success : colors.textSecondary}
            />
            <Text style={styles.requirementText}>{t('register.requirements.minLength')}</Text>
          </View>
          <View style={styles.requirement}>
            <Ionicons
              name={/[A-Z]/.test(formData.password) ? 'checkmark-circle' : 'ellipse-outline'}
              size={16}
              color={/[A-Z]/.test(formData.password) ? colors.success : colors.textSecondary}
            />
            <Text style={styles.requirementText}>{t('register.requirements.uppercase')}</Text>
          </View>
          <View style={styles.requirement}>
            <Ionicons
              name={/\d/.test(formData.password) ? 'checkmark-circle' : 'ellipse-outline'}
              size={16}
              color={/\d/.test(formData.password) ? colors.success : colors.textSecondary}
            />
            <Text style={styles.requirementText}>{t('register.requirements.number')}</Text>
          </View>
          <View style={styles.requirement}>
            <Ionicons
              name={
                formData.password === formData.confirmPassword && formData.password.length > 0
                  ? 'checkmark-circle'
                  : 'ellipse-outline'
              }
              size={16}
              color={
                formData.password === formData.confirmPassword && formData.password.length > 0
                  ? colors.success
                  : colors.textSecondary
              }
            />
            <Text style={styles.requirementText}>{t('register.requirements.match')}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>{t('register.submit')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>{t('register.haveAccount')} </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>{t('register.signIn')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    padding: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    marginLeft: 8,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.text,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
  },
  strengthText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  requirementsContainer: {
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;
