import { Platform } from 'react-native';
import * as Network from 'expo-network';
import axios from 'axios';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details: {
    network: boolean;
    internet: boolean;
    backend: boolean;
    errors: string[];
  };
}

/**
 * Comprehensive connection test for mobile app
 * Tests: Network connection, Internet access, and Backend reachability
 */
export async function testConnection(backendUrl?: string): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    success: false,
    message: '',
    details: {
      network: false,
      internet: false,
      backend: false,
      errors: [],
    },
  };

  try {
    // Step 1: Check network connection
    console.log('[Connection Test] Checking network...');
    const networkState = await Network.getNetworkStateAsync();
    result.details.network = networkState.isConnected ?? false;
    
    if (!result.details.network) {
      result.details.errors.push('No network connection detected');
      result.message = 'Please connect to Wi-Fi or mobile data';
      return result;
    }

    // Step 2: Check internet reachability
    console.log('[Connection Test] Checking internet...');
    result.details.internet = networkState.isInternetReachable ?? false;
    
    if (!result.details.internet) {
      result.details.errors.push('Internet not reachable');
      result.message = 'Network connected but no internet access';
      return result;
    }

    // Step 3: Check backend connection (if URL provided)
    if (backendUrl) {
      console.log('[Connection Test] Checking backend:', backendUrl);
      try {
        const testUrl = backendUrl.replace('/api/v1', '/health');
        const response = await axios.get(testUrl, {
          timeout: 5000,
          headers: { 'Accept': 'application/json' },
        });
        
        if (response.status === 200) {
          result.details.backend = true;
          result.success = true;
          result.message = 'All systems connected successfully';
        } else {
          result.details.errors.push(`Backend returned status: ${response.status}`);
          result.message = 'Backend server responded with error';
        }
      } catch (backendError: any) {
        result.details.errors.push(`Backend connection failed: ${backendError.message}`);
        
        if (backendError.code === 'ECONNREFUSED') {
          result.message = 'Backend server is not running or not accessible';
        } else if (backendError.code === 'ETIMEDOUT') {
          result.message = 'Backend server connection timeout - check your IP address';
        } else if (backendError.code === 'ENOTFOUND') {
          result.message = 'Backend server address not found';
        } else {
          result.message = 'Cannot connect to backend server';
        }
      }
    } else {
      result.success = true;
      result.message = 'Network and internet connected';
    }

  } catch (error: any) {
    result.details.errors.push(`Connection test failed: ${error.message}`);
    result.message = 'Connection test encountered an error';
    console.error('[Connection Test] Error:', error);
  }

  return result;
}

/**
 * Get detailed network information for debugging
 */
export async function getNetworkInfo(): Promise<string> {
  try {
    const networkState = await Network.getNetworkStateAsync();
    const ipAddress = await Network.getIpAddressAsync();
    
    return `
Network Status:
- Connected: ${networkState.isConnected}
- Internet: ${networkState.isInternetReachable}
- Type: ${networkState.type}
- IP Address: ${ipAddress}
- Platform: ${Platform.OS}
    `.trim();
  } catch (error) {
    return `Failed to get network info: ${error}`;
  }
}

/**
 * Quick check if backend is reachable
 */
export async function isBackendReachable(baseURL: string): Promise<boolean> {
  try {
    const testUrl = baseURL.replace('/api/v1', '/health');
    const response = await axios.get(testUrl, { timeout: 3000 });
    return response.status === 200;
  } catch {
    return false;
  }
}
