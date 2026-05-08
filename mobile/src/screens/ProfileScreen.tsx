import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        full_name: user.full_name || user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (name: string, value: string) => {
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // TODO: Implement update profile API
      setTimeout(() => {
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false);
        setLoading(false);
      }, 1000);
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.new_password.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement password change API
      setTimeout(() => {
        Alert.alert('Info', 'Password change feature coming soon!');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
        setShowPasswordChange(false);
        setLoading(false);
      }, 1000);
    } catch (err) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#fff" />
        </View>
        <Text style={styles.userName}>{user.full_name || user.name || user.email}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role || 'user'}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('profile.personalInfo')}</Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Ionicons name="create-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('profile.fullName')}</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={formData.full_name}
                  onChangeText={(value) => handleChange('full_name', value)}
                  placeholder="Enter full name"
                />
              ) : (
                <Text style={styles.infoValue}>{formData.full_name}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('profile.username')}</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={formData.username}
                  onChangeText={(value) => handleChange('username', value)}
                  placeholder="Enter username"
                />
              ) : (
                <Text style={styles.infoValue}>{formData.username || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('profile.email')}</Text>
              <Text style={styles.infoValue}>{formData.email}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('profile.role')}</Text>
              <Text style={styles.infoValue}>{user.role || 'user'}</Text>
            </View>
          </View>

          {isEditing && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  if (user) {
                    setFormData({
                      username: user.username || '',
                      full_name: user.full_name || user.name || '',
                      email: user.email || '',
                    });
                  }
                }}
              >
                <Text style={styles.cancelButtonText}>{t('profile.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>{t('profile.save')}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Password Change Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowPasswordChange(!showPasswordChange)}
          >
            <Text style={styles.sectionTitle}>{t('profile.changePassword')}</Text>
            <Ionicons
              name={showPasswordChange ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {showPasswordChange && (
            <View style={styles.passwordCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('profile.currentPassword')}</Text>
                <TextInput
                  style={styles.input}
                  value={passwordData.current_password}
                  onChangeText={(value) => handlePasswordChange('current_password', value)}
                  secureTextEntry
                  placeholder="Enter current password"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('profile.newPassword')}</Text>
                <TextInput
                  style={styles.input}
                  value={passwordData.new_password}
                  onChangeText={(value) => handlePasswordChange('new_password', value)}
                  secureTextEntry
                  placeholder="Enter new password"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('profile.confirmPassword')}</Text>
                <TextInput
                  style={styles.input}
                  value={passwordData.confirm_password}
                  onChangeText={(value) => handlePasswordChange('confirm_password', value)}
                  secureTextEntry
                  placeholder="Confirm new password"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handlePasswordSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Update Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={styles.logoutText}>{t('nav.logout')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    paddingBottom: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  infoInput: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginTop: 8,
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;
