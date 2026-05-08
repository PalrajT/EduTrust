import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/theme';

const { width } = Dimensions.get('window');

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

interface VerificationRowProps {
  id: string;
  studentName: string;
  certificateType: string;
  status: 'verified' | 'pending' | 'rejected';
  date: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, isPositive }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>
      <Ionicons name={icon} size={24} color={colors.primary} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
    <View style={styles.changeContainer}>
      <Ionicons
        name={isPositive ? 'trending-up' : 'trending-down'}
        size={16}
        color={isPositive ? '#10B981' : '#EF4444'}
      />
      <Text style={[styles.changeText, { color: isPositive ? '#10B981' : '#EF4444' }]}>
        {change}
      </Text>
    </View>
  </View>
);

const VerificationRow: React.FC<VerificationRowProps> = ({
  id,
  studentName,
  certificateType,
  status,
  date,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <TouchableOpacity style={styles.verificationRow}>
      <View style={styles.verificationInfo}>
        <Text style={styles.verificationId}>#{id}</Text>
        <Text style={styles.studentName}>{studentName}</Text>
        <Text style={styles.certificateType}>{certificateType}</Text>
      </View>
      <View style={styles.verificationMeta}>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}15` }]}>
          <Ionicons name={getStatusIcon()} size={14} color={getStatusColor()} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
        <Text style={styles.verificationDate}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const AdminDashboardScreen = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: 'document-text-outline' as const,
      title: 'Total Certificates',
      value: '1,234',
      change: '+12%',
      isPositive: true,
    },
    {
      icon: 'checkmark-circle-outline' as const,
      title: 'Verified',
      value: '1,089',
      change: '+8%',
      isPositive: true,
    },
    {
      icon: 'time-outline' as const,
      title: 'Pending',
      value: '89',
      change: '-5%',
      isPositive: true,
    },
    {
      icon: 'close-circle-outline' as const,
      title: 'Rejected',
      value: '56',
      change: '+2%',
      isPositive: false,
    },
  ];

  const recentVerifications: VerificationRowProps[] = [
    {
      id: 'CERT001',
      studentName: 'Rahul Sharma',
      certificateType: 'Bachelor of Science',
      status: 'verified',
      date: '2024-01-15',
    },
    {
      id: 'CERT002',
      studentName: 'Priya Patel',
      certificateType: 'Master of Arts',
      status: 'pending',
      date: '2024-01-14',
    },
    {
      id: 'CERT003',
      studentName: 'Amit Kumar',
      certificateType: 'Diploma',
      status: 'verified',
      date: '2024-01-14',
    },
    {
      id: 'CERT004',
      studentName: 'Sneha Singh',
      certificateType: 'Certificate Course',
      status: 'rejected',
      date: '2024-01-13',
    },
    {
      id: 'CERT005',
      studentName: 'Vikram Mehta',
      certificateType: 'Bachelor of Engineering',
      status: 'verified',
      date: '2024-01-13',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{t('admin.dashboard.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('admin.dashboard.subtitle')}</Text>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsSection}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </View>

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Verification Trends</Text>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="bar-chart-outline" size={64} color={colors.primary} />
          <Text style={styles.chartPlaceholderText}>
            Chart visualization will be displayed here
          </Text>
        </View>
      </View>

      {/* Recent Verifications */}
      <View style={styles.verificationsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Verifications</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.verificationsList}>
          {recentVerifications.map((verification) => (
            <VerificationRow key={verification.id} {...verification} />
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="add-circle-outline" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Add Certificate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="search-outline" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Search Records</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="download-outline" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Export Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="settings-outline" size={32} color={colors.primary} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
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
  header: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
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
  statIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: colors.primaryLight,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  chartSection: {
    margin: 24,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  chartPlaceholderText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
  verificationsSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  verificationsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationId: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  certificateType: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  verificationMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  verificationDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionsSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionCard: {
    width: (width - 64) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 24,
  },
});

export default AdminDashboardScreen;
