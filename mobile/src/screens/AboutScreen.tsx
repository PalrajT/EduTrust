import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/theme';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

interface TechStackItemProps {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <View style={styles.featureCard}>
    <View style={styles.featureIconContainer}>
      <Ionicons name={icon} size={32} color={colors.primary} />
    </View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const TechStackItem: React.FC<TechStackItemProps> = ({ name, icon }) => (
  <View style={styles.techItem}>
    <Ionicons name={icon} size={24} color={colors.primary} />
    <Text style={styles.techName}>{name}</Text>
  </View>
);

const AboutScreen = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: 'shield-checkmark-outline' as const,
      title: t('about.features.blockchain.title'),
      description: t('about.features.blockchain.description'),
    },
    {
      icon: 'flash-outline' as const,
      title: t('about.features.instant.title'),
      description: t('about.features.instant.description'),
    },
    {
      icon: 'lock-closed-outline' as const,
      title: t('about.features.secure.title'),
      description: t('about.features.secure.description'),
    },
    {
      icon: 'people-outline' as const,
      title: t('about.features.userFriendly.title'),
      description: t('about.features.userFriendly.description'),
    },
  ];

  const techStack = [
    { name: 'React Native', icon: 'logo-react' as const },
    { name: 'Blockchain', icon: 'cube-outline' as const },
    { name: 'Node.js', icon: 'logo-nodejs' as const },
    { name: 'MongoDB', icon: 'server-outline' as const },
  ];

  const processSteps = [
    {
      step: '1',
      title: t('about.process.upload.title'),
      description: t('about.process.upload.description'),
    },
    {
      step: '2',
      title: t('about.process.verify.title'),
      description: t('about.process.verify.description'),
    },
    {
      step: '3',
      title: t('about.process.result.title'),
      description: t('about.process.result.description'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.hero}
      >
        <View style={styles.heroIconContainer}>
          <Ionicons name="shield-checkmark" size={64} color="#fff" />
        </View>
        <Text style={styles.heroTitle}>{t('about.hero.title')}</Text>
        <Text style={styles.heroSubtitle}>{t('about.hero.subtitle')}</Text>
      </LinearGradient>

      {/* Mission Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.mission.title')}</Text>
        <Text style={styles.missionText}>{t('about.mission.description')}</Text>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.features.title')}</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </View>
      </View>

      {/* Tech Stack Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.tech.title')}</Text>
        <View style={styles.techGrid}>
          {techStack.map((tech, index) => (
            <TechStackItem key={index} name={tech.name} icon={tech.icon} />
          ))}
        </View>
      </View>

      {/* Process Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.process.title')}</Text>
        {processSteps.map((step, index) => (
          <View key={index} style={styles.processStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{step.step}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Team Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.team.title')}</Text>
        <Text style={styles.teamDescription}>{t('about.team.description')}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>10K+</Text>
          <Text style={styles.statLabel}>Certificates Verified</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Institutions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>99.9%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
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
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  missionText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 64) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  techItem: {
    width: (width - 64) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  techName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  processStep: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepNumber: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  teamDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  statsSection: {
    flexDirection: 'row',
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
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  bottomPadding: {
    height: 24,
  },
});

export default AboutScreen;
