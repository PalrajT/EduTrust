import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/theme';

interface VerificationResult {
  status: 'verified' | 'invalid' | null;
  certificateDetails?: {
    name: string;
    degree: string;
    institution: string;
    issueDate: string;
    certificateId: string;
  };
}

const VerifyScreen = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult>({
    status: null,
  });

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to scan certificates'
      );
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Gallery permission is required to select certificates'
      );
      return false;
    }
    return true;
  };

  const handleCameraCapture = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setVerificationResult({ status: null });
    }
  };

  const handleGallerySelect = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setVerificationResult({ status: null });
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setVerificationResult({ status: null });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleVerify = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or capture a certificate first');
      return;
    }

    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      // Mock verification result
      const isValid = Math.random() > 0.3; // 70% chance of valid certificate

      if (isValid) {
        setVerificationResult({
          status: 'verified',
          certificateDetails: {
            name: 'Rahul Sharma',
            degree: 'Bachelor of Science in Computer Science',
            institution: 'Indian Institute of Technology, Delhi',
            issueDate: '2023-06-15',
            certificateId: 'CERT-2023-CS-12345',
          },
        });
      } else {
        setVerificationResult({
          status: 'invalid',
        });
      }

      setIsVerifying(false);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setVerificationResult({ status: null });
  };

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
        <Text style={styles.heroTitle}>{t('verify.hero.title')}</Text>
        <Text style={styles.heroSubtitle}>{t('verify.hero.subtitle')}</Text>
      </LinearGradient>

      {/* Upload Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('verify.upload.title')}</Text>

        <View style={styles.uploadOptions}>
          <TouchableOpacity
            style={styles.uploadCard}
            onPress={handleCameraCapture}
          >
            <View style={styles.uploadIconContainer}>
              <Ionicons name="camera" size={32} color={colors.primary} />
            </View>
            <Text style={styles.uploadTitle}>{t('verify.upload.camera')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadCard}
            onPress={handleGallerySelect}
          >
            <View style={styles.uploadIconContainer}>
              <Ionicons name="images" size={32} color={colors.primary} />
            </View>
            <Text style={styles.uploadTitle}>{t('verify.upload.gallery')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadCard}
            onPress={handleDocumentPicker}
          >
            <View style={styles.uploadIconContainer}>
              <Ionicons name="document" size={32} color={colors.primary} />
            </View>
            <Text style={styles.uploadTitle}>{t('verify.upload.document')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preview Section */}
      {selectedImage && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeButton} onPress={handleReset}>
              <Ionicons name="close-circle" size={32} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Verify Button */}
      {selectedImage && !verificationResult.status && (
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]}
            onPress={handleVerify}
            disabled={isVerifying}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.buttonGradient}
            >
              {isVerifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.verifyButtonText}>
                    {t('verify.actions.verify')}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Verification Result */}
      {verificationResult.status && (
        <View style={styles.section}>
          <View
            style={[
              styles.resultContainer,
              verificationResult.status === 'verified'
                ? styles.resultSuccess
                : styles.resultError,
            ]}
          >
            <View style={styles.resultIconContainer}>
              <Ionicons
                name={
                  verificationResult.status === 'verified'
                    ? 'checkmark-circle'
                    : 'close-circle'
                }
                size={64}
                color={verificationResult.status === 'verified' ? '#10B981' : '#EF4444'}
              />
            </View>

            <Text style={styles.resultTitle}>
              {verificationResult.status === 'verified'
                ? t('verify.result.verified.title')
                : t('verify.result.invalid.title')}
            </Text>

            <Text style={styles.resultMessage}>
              {verificationResult.status === 'verified'
                ? t('verify.result.verified.message')
                : t('verify.result.invalid.message')}
            </Text>

            {verificationResult.certificateDetails && (
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>
                    {verificationResult.certificateDetails.name}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Degree:</Text>
                  <Text style={styles.detailValue}>
                    {verificationResult.certificateDetails.degree}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Institution:</Text>
                  <Text style={styles.detailValue}>
                    {verificationResult.certificateDetails.institution}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Issue Date:</Text>
                  <Text style={styles.detailValue}>
                    {verificationResult.certificateDetails.issueDate}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Certificate ID:</Text>
                  <Text style={styles.detailValue}>
                    {verificationResult.certificateDetails.certificateId}
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Verify Another Certificate</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* How It Works */}
      {!selectedImage && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('verify.howItWorks.title')}</Text>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                {t('verify.howItWorks.step1.title')}
              </Text>
              <Text style={styles.stepDescription}>
                {t('verify.howItWorks.step1.description')}
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                {t('verify.howItWorks.step2.title')}
              </Text>
              <Text style={styles.stepDescription}>
                {t('verify.howItWorks.step2.description')}
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                {t('verify.howItWorks.step3.title')}
              </Text>
              <Text style={styles.stepDescription}>
                {t('verify.howItWorks.step3.description')}
              </Text>
            </View>
          </View>
        </View>
      )}

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
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: colors.primaryLight,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  previewContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  removeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  verifyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultSuccess: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  resultError: {
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  resultIconContainer: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 120,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stepContainer: {
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
  bottomPadding: {
    height: 24,
  },
});

export default VerifyScreen;
