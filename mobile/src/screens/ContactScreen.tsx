import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/theme';

interface ContactInfoCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  onPress?: () => void;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ icon, title, value, onPress }) => (
  <TouchableOpacity
    style={styles.infoCard}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={styles.infoIconContainer}>
      <Ionicons name={icon} size={24} color={colors.primary} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </TouchableOpacity>
);

const ContactScreen = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    Alert.alert(
      'Success',
      'Your message has been sent successfully! We will get back to you soon.',
      [
        {
          text: 'OK',
          onPress: () => {
            setFormData({ name: '', email: '', subject: '', message: '' });
          },
        },
      ]
    );
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@edutrust.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+911234567890');
  };

  const handleAddressPress = () => {
    const address = '123 Tech Street, Bangalore, Karnataka 560001';
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.hero}
      >
        <View style={styles.heroIconContainer}>
          <Ionicons name="mail" size={64} color="#fff" />
        </View>
        <Text style={styles.heroTitle}>{t('contact.hero.title')}</Text>
        <Text style={styles.heroSubtitle}>{t('contact.hero.subtitle')}</Text>
      </LinearGradient>

      {/* Contact Info Cards */}
      <View style={styles.infoSection}>
        <ContactInfoCard
          icon="mail-outline"
          title={t('contact.info.email.title')}
          value={t('contact.info.email.value')}
          onPress={handleEmailPress}
        />
        <ContactInfoCard
          icon="call-outline"
          title={t('contact.info.phone.title')}
          value={t('contact.info.phone.value')}
          onPress={handlePhonePress}
        />
        <ContactInfoCard
          icon="location-outline"
          title={t('contact.info.address.title')}
          value={t('contact.info.address.value')}
          onPress={handleAddressPress}
        />
      </View>

      {/* Contact Form */}
      <View style={styles.formSection}>
        <Text style={styles.formTitle}>{t('contact.form.title')}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('contact.form.labels.name')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('contact.form.placeholders.name')}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('contact.form.labels.email')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('contact.form.placeholders.email')}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('contact.form.labels.subject')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('contact.form.placeholders.subject')}
            value={formData.subject}
            onChangeText={(value) => handleInputChange('subject', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('contact.form.labels.message')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('contact.form.placeholders.message')}
            value={formData.message}
            onChangeText={(value) => handleInputChange('message', value)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.buttonGradient}
          >
            <Text style={styles.submitButtonText}>{t('contact.form.submit')}</Text>
            <Ionicons name="send" size={20} color="#fff" style={styles.sendIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Business Hours */}
      <View style={styles.hoursSection}>
        <Text style={styles.hoursTitle}>{t('contact.hours.title')}</Text>
        <View style={styles.hourItem}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={styles.hourText}>{t('contact.hours.weekdays')}</Text>
        </View>
        <View style={styles.hourItem}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={styles.hourText}>{t('contact.hours.weekends')}</Text>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroIconContainer: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  infoSection: {
    padding: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: colors.primaryLight,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  formSection: {
    padding: 24,
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  submitButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sendIcon: {
    marginLeft: 8,
  },
  hoursSection: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  hourItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hourText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  bottomPadding: {
    height: 24,
  },
});

export default ContactScreen;
