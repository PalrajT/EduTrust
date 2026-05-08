import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor with token refresh
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const { access_token } = response.data
        localStorage.setItem('access_token', access_token)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// ============================================
// Authentication API
// ============================================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    return api.post('/auth/register', userData)
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    
    // Save tokens and user data
    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('refresh_token', response.refresh_token)
    localStorage.setItem('user', JSON.stringify(response.user))
    
    return response
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  // Get current user profile
  getCurrentUser: async () => {
    return api.get('/auth/me')
  },

  // Update profile
  updateProfile: async (updates) => {
    return api.put('/auth/me', updates)
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token')
  },

  // Get stored user
  getStoredUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
}

// API methods
export const certificateAPI = {
  // Verify certificate with comprehensive OCR analysis and report
  verifyWithComprehensiveReport: async (file, certificateType = 'degree', language = 'auto') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('certificate_type', certificateType)
    formData.append('language', language)
    
    return api.post('/verify/analyze-report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60 seconds - optimized backend should complete within 55s
    })
  },

  // Get comprehensive report by verification ID
  getComprehensiveReport: async (verificationId) => {
    return api.get(`/verify/report/${verificationId}`)
  },

  // Verify certificate by file upload (legacy)
  verifyByFile: async (file, certificateType = 'other', language = 'auto') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('certificate_type', certificateType)
    formData.append('language', language)
    
    return api.post('/verify/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Get verification by ID
  getVerification: async (verificationId) => {
    return api.get(`/verify/${verificationId}`)
  },

  // List user's verifications
  listVerifications: async (skip = 0, limit = 10) => {
    return api.get('/verify/', { params: { skip, limit } })
  },

  // Get certificate details
  getDetails: async (certificateId) => {
    return api.get(`/certificates/${certificateId}`)
  },

  // List certificates with filters
  listCertificates: async (params = {}) => {
    return api.get('/certificates/', { params })
  },
}

export const adminAPI = {
  // Get dashboard statistics
  getStats: async () => {
    return api.get('/dashboard/stats')
  },

  // Get complete dashboard data
  getDashboard: async () => {
    return api.get('/dashboard/')
  },

  // Get recent verifications
  getRecentVerifications: async (limit = 10) => {
    return api.get(`/dashboard/recent-activity?limit=${limit}`)
  },

  // Get verification trends
  getTrends: async (days = 30) => {
    return api.get(`/dashboard/trends?days=${days}`)
  },

  // Get language distribution
  getLanguageDistribution: async () => {
    return api.get('/dashboard/language-distribution')
  },

  // Get top institutions
  getTopInstitutions: async (limit = 10) => {
    return api.get(`/dashboard/institutions?limit=${limit}`)
  },

  // Get blacklist
  getBlacklist: async (skip = 0, limit = 20) => {
    return api.get('/certificates/blacklist/', { params: { skip, limit } })
  },

  // Add to blacklist
  addToBlacklist: async (data) => {
    return api.post('/certificates/blacklist/', data)
  },

  // Create certificate
  createCertificate: async (data) => {
    return api.post('/certificates/', data)
  },
}

// Export individual functions for easier imports
export const verifyWithComprehensiveReport = certificateAPI.verifyWithComprehensiveReport
export const getComprehensiveReport = certificateAPI.getComprehensiveReport

export default api

