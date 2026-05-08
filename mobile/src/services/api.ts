import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { storage } from '../utils/storage';

// API Configuration for Android 15 compatibility
const getBaseURL = () => {
  // Allow override from Expo config (app.json / app.config.js) via extra.backendUrl
  const expoBackend: string | undefined = (Constants?.manifest?.extra as any)?.backendUrl || (Constants?.expoConfig?.extra as any)?.backendUrl;
  if (expoBackend) {
    const url = expoBackend.endsWith('/api/v1') ? expoBackend : `${expoBackend.replace(/\/$/, '')}/api/v1`;
    console.log('[API] Using backend URL from Expo config:', url);
    return url;
  }

  // Platform-based sensible defaults
  if (Platform.OS === 'android') {
    // Try localhost first (works with newer Android emulators and Expo)
    // If this doesn't work, use 10.0.2.2 or your PC's IP address
    const androidUrl = 'http://localhost:8000/api/v1';
    console.log('[API] Using Android base URL:', androidUrl);
    return androidUrl;
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:8000/api/v1';
  } else if (Platform.OS === 'web') {
    // For Expo web development
    return 'http://localhost:8000/api/v1';
  }

  // Default fallback
  return 'http://localhost:8000/api/v1';
};

// Create axios instance with enhanced configuration for Android 15
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // Increased timeout for Android 15
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log full URL for debugging
      const fullUrl = `${config.baseURL}${config.url}`;
      console.log(`[API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
      console.log(`[API] Platform: ${Platform.OS}, BaseURL: ${config.baseURL}`);
      
      return config;
    } catch (error) {
      console.error('[API Request Error]', error);
      return config;
    }
  },
  (error) => {
    console.error('[API Request Interceptor Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Enhanced error handling for Android 15
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors (common on Android 15)
    if (!error.response) {
      console.error('[API Network Error]', {
        message: error.message,
        code: error.code,
        url: originalRequest?.url,
      });
      
      // Provide helpful error messages for different network issues
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return Promise.reject({
          message: 'Request timeout. Please check your internet connection.',
          code: 'TIMEOUT',
          originalError: error,
        });
      }
      
      if (error.code === 'ECONNREFUSED') {
        return Promise.reject({
          message: 'Cannot connect to server. Please ensure:\n1. Backend server is running on port 8000\n2. You are on the same Wi-Fi network\n3. Your firewall allows connections',
          code: 'CONNECTION_REFUSED',
          originalError: error,
        });
      }
      
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        return Promise.reject({
          message: 'Network error. Please check:\n1. Backend server is running\n2. You are connected to Wi-Fi\n3. IP address in api.ts is correct',
          code: 'NETWORK_ERROR',
          originalError: error,
        });
      }
      
      return Promise.reject({
        message: 'Connection failed. Please check your network settings.',
        code: 'CONNECTION_FAILED',
        originalError: error,
      });
    }

    // Handle authentication errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await storage.removeItem('authToken');
        await storage.removeItem('userData');
        
        return Promise.reject({
          message: 'Session expired. Please login again.',
          code: 'UNAUTHORIZED',
        });
      } catch (e) {
        return Promise.reject(error);
      }
    }

    // Handle other HTTP errors
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.detail || 
                        error.message || 
                        'An unexpected error occurred';

    console.error(`[API Error] ${error.response?.status || 'Unknown'}: ${errorMessage}`);

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// API Methods
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await storage.removeItem('authToken');
      await storage.removeItem('userData');
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const certificateAPI = {
  verify: async (certificateData: {
    certificate_id?: string;
    file?: any;
  }) => {
    const formData = new FormData();
    
    if (certificateData.certificate_id) {
      formData.append('certificate_id', certificateData.certificate_id);
    }
    
    if (certificateData.file) {
      formData.append('file', {
        uri: certificateData.file.uri,
        type: certificateData.file.type || 'image/jpeg',
        name: certificateData.file.name || 'certificate.jpg',
      } as any);
    }

    const response = await api.post('/certificates/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // Extended timeout for file uploads on Android 15
    });
    
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/certificates/history');
    return response.data;
  },

  getDetails: async (certificateId: string) => {
    const response = await api.get(`/certificates/${certificateId}`);
    return response.data;
  },
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getRecentActivity: async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
  },
};

// Utility function to test connection (useful for Android 15 debugging)
export const testConnection = async () => {
  try {
    const response = await axios.get(`${getBaseURL().replace('/api/v1', '')}/health`, {
      timeout: 5000,
    });
    console.log('[Connection Test] Success:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('[Connection Test] Failed:', error.message);
    return { 
      success: false, 
      error: error.message,
      suggestion: 'Please check:\n1. Backend is running on correct port\n2. Network security config allows cleartext\n3. Device is on same network as backend'
    };
  }
};

// Update base URL dynamically (useful for switching between development and production)
export const updateBaseURL = (newBaseURL: string) => {
  api.defaults.baseURL = newBaseURL;
  console.log('[API] Base URL updated to:', newBaseURL);
};

export default api;
