import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          const userData = await authAPI.getCurrentUser()
          setUser(userData)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        // Clear invalid tokens
        authAPI.logout()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await authAPI.login(email, password)
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      const newUser = await authAPI.register(userData)
      // Auto-login after registration
      const loginResult = await login(userData.email, userData.password)
      return loginResult
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Registration failed. Please try again.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
    setError(null)
  }

  const updateProfile = async (profileData) => {
    try {
      setError(null)
      const updatedUser = await authAPI.updateProfile(profileData)
      setUser(updatedUser)
      return { success: true, user: updatedUser }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Profile update failed.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
