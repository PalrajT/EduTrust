import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { testConnection, getNetworkInfo } from '../utils/connectionTest';
import api from '../services/api';

const DiagnosticsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [networkInfo, setNetworkInfo] = useState<string>('');
  const [backendUrl, setBackendUrl] = useState<string>('');

  useEffect(() => {
    loadInitialInfo();
  }, []);

  const loadInitialInfo = async () => {
    try {
      // Get backend URL
      const url = api.defaults.baseURL || 'Not configured';
      setBackendUrl(url);

      // Get network info
      const info = await getNetworkInfo();
      setNetworkInfo(info);
    } catch (error) {
      console.error('Failed to load initial info:', error);
    }
  };

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const results = await testConnection(backendUrl);
      setTestResults(results);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.toString() : 'Unknown error';
      setTestResults({
        success: false,
        message: 'Diagnostics failed',
        details: { errors: [errorMessage] },
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const diagnosticInfo = `
EduTrust Mobile Diagnostics
==========================
Platform: ${Platform.OS} ${Platform.Version}
Backend URL: ${backendUrl}

${networkInfo}

Test Results:
${JSON.stringify(testResults, null, 2)}
    `.trim();

    // For React Native, we need to use a different approach
    // or install @react-native-clipboard/clipboard
    Alert.alert(
      'Diagnostic Info',
      'Copy this info to share with support:\n\n' + diagnosticInfo.substring(0, 200) + '...',
      [{ text: 'OK' }]
    );
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
    ) : (
      <Ionicons name="close-circle" size={24} color="#EF4444" />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bug-outline" size={40} color="#4F46E5" />
        <Text style={styles.title}>System Diagnostics</Text>
        <Text style={styles.subtitle}>
          Check connectivity and troubleshoot issues
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Configuration</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Platform:</Text>
          <Text style={styles.infoValue}>
            {Platform.OS} {Platform.Version}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Backend URL:</Text>
          <Text style={styles.infoValue} numberOfLines={2}>
            {backendUrl}
          </Text>
        </View>
      </View>

      {networkInfo ? (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Network Information</Text>
          <Text style={styles.networkText}>{networkInfo}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={runDiagnostics}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="play-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Run Diagnostics</Text>
          </>
        )}
      </TouchableOpacity>

      {testResults && (
        <View style={styles.resultsCard}>
          <Text style={styles.cardTitle}>Test Results</Text>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Overall Status:</Text>
            <View style={styles.resultValue}>
              {getStatusIcon(testResults.success)}
              <Text
                style={[
                  styles.resultText,
                  testResults.success ? styles.successText : styles.errorText,
                ]}
              >
                {testResults.success ? 'PASSED' : 'FAILED'}
              </Text>
            </View>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Network:</Text>
            <View style={styles.resultValue}>
              {getStatusIcon(testResults.details.network)}
            </View>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Internet:</Text>
            <View style={styles.resultValue}>
              {getStatusIcon(testResults.details.internet)}
            </View>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Backend:</Text>
            <View style={styles.resultValue}>
              {getStatusIcon(testResults.details.backend)}
            </View>
          </View>

          <View style={styles.messageContainer}>
            <Text style={styles.messageTitle}>Message:</Text>
            <Text style={styles.messageText}>{testResults.message}</Text>
          </View>

          {testResults.details.errors.length > 0 && (
            <View style={styles.errorsContainer}>
              <Text style={styles.errorsTitle}>Errors:</Text>
              {testResults.details.errors.map((error: string, index: number) => (
                <Text key={index} style={styles.errorText}>
                  • {error}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Ionicons name="copy-outline" size={20} color="#4F46E5" />
            <Text style={styles.copyButtonText}>Copy Results</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tipsCard}>
        <Text style={styles.cardTitle}>Troubleshooting Tips</Text>
        <Text style={styles.tipText}>
          1. Ensure backend server is running on port 8000
        </Text>
        <Text style={styles.tipText}>
          2. Connect phone and computer to the same Wi-Fi network
        </Text>
        <Text style={styles.tipText}>
          3. Update IP address in src/services/api.ts
        </Text>
        <Text style={styles.tipText}>
          4. Check firewall settings allow port 8000
        </Text>
        <Text style={styles.tipText}>
          5. Run: npx expo start --tunnel (if local network fails)
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 100,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  networkText: {
    fontSize: 12,
    color: '#4B5563',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    gap: 10,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  resultLabel: {
    fontSize: 16,
    color: '#4B5563',
  },
  resultValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '600',
  },
  successText: {
    color: '#10B981',
  },
  errorText: {
    color: '#EF4444',
  },
  messageContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  errorsContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  errorsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 5,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#4F46E5',
    borderRadius: 8,
    gap: 5,
  },
  copyButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: '#FEF3C7',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    marginVertical: 5,
    lineHeight: 20,
  },
});

export default DiagnosticsScreen;
