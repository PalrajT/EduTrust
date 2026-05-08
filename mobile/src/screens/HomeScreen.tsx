import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/theme';


const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const features = [
    {
      icon: 'language-outline',
      title: t('home.features.ocr.title'),
      description: t('home.features.ocr.description'),
    },
    {
      icon: 'bulb-outline',
      title: t('home.features.ai.title'),
      description: t('home.features.ai.description'),
    },
    {
      icon: 'shield-checkmark-outline',
      title: t('home.features.blockchain.title'),
      description: t('home.features.blockchain.description'),
    },
    {
      icon: 'flash-outline',
      title: t('home.features.instant.title'),
      description: t('home.features.instant.description'),
    },
  ];

  const stats = [
    { label: t('home.stats.verified'), value: '1M+' },
    { label: t('home.stats.universities'), value: '500+' },
    { label: t('home.stats.accuracy'), value: '99.8%' },
    { label: t('home.stats.languages'), value: '10+' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#4F46E5', '#4338CA']}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Ionicons name="shield-checkmark" size={64} color="#fff" />
          <Text style={styles.heroTitle}>{t('home.hero.title')}</Text>
          <Text style={styles.heroSubtitle}>{t('home.hero.subtitle')}</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Verify' as never)}
            >
              <Text style={styles.primaryButtonText}>{t('home.hero.cta')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => navigation.navigate('About' as never)}
            >
              <Text style={styles.outlineButtonText}>{t('home.hero.learnMore')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.features.title')}</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name={feature.icon as any} size={32} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.howItWorks.title')}</Text>
        
        {[1, 2, 3].map((step) => (
          <View key={step} style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{step}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                {t(`home.howItWorks.step${step}.title`)}
              </Text>
              <Text style={styles.stepDescription}>
                {t(`home.howItWorks.step${step}.description`)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA Section */}
      <LinearGradient
        colors={['#4F46E5', '#4338CA']}
        style={styles.ctaSection}
      >
        <Text style={styles.ctaTitle}>{t('home.cta.title')}</Text>
        <Text style={styles.ctaSubtitle}>{t('home.cta.subtitle')}</Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Verify' as never)}
        >
          <Text style={styles.ctaButtonText}>{t('home.cta.button')}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  outlineButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: '#fff',
  },
  statCard: {
    width: '50%',
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: colors.primaryLight,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  stepNumber: {
    width: 40,
    height: 40,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ctaSection: {
    padding: 24,
    marginTop: 8,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ctaButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
