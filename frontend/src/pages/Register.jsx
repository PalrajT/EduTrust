import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Shield, Lock, Mail, User, UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    setError('')

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('')
      return
    }
    
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8

    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough].filter(Boolean).length

    if (strength <= 2) setPasswordStrength('weak')
    else if (strength <= 3) setPasswordStrength('medium')
    else setPasswordStrength('strong')
  }

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    // Username validation
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long')
      return false
    }

    // Full name validation
    if (formData.full_name.trim().length < 2) {
      setError('Please enter your full name')
      return false
    }

    // Password validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter')
      return false
    }

    if (!/\d/.test(formData.password)) {
      setError('Password must contain at least one number')
      return false
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const { confirmPassword, ...registrationData } = formData
      const result = await register(registrationData)
      
      if (result.success) {
        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Registration failed. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
      default: return 'bg-gray-300'
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-primary-50 to-primary-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary-600 animate-bounce-subtle">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900 animate-slide-up">
            {t('register.title')}
          </h2>
          <p className="text-gray-600 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {t('register.subtitle')}
          </p>
        </div>

        <div className="card animate-scale-in" style={{animationDelay: '0.3s'}}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-800 border border-red-200 rounded-lg bg-red-50 animate-shake">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                {t('register.email')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 input-field"
                  placeholder={t('register.placeholders.email')}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
                {t('register.username')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="pl-10 input-field"
                  placeholder={t('register.placeholders.username')}
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block mb-2 text-sm font-medium text-gray-700">
                {t('register.fullName')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserCircle className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="pl-10 input-field"
                  placeholder={t('register.placeholders.fullName')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                {t('register.password')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 input-field"
                  placeholder={t('register.placeholders.password')}
                />
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{t('register.passwordStrength.label')}:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength === 'weak' ? 'text-red-600' :
                      passwordStrength === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {t(`register.passwordStrength.${passwordStrength}`).toUpperCase()}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div 
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ 
                        width: passwordStrength === 'weak' ? '33%' : 
                               passwordStrength === 'medium' ? '66%' : '100%' 
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {t('register.requirements.minLength')}, {t('register.requirements.uppercase')}, {t('register.requirements.number')}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                {t('register.confirmPassword')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="pl-10 input-field"
                  placeholder={t('register.placeholders.confirmPassword')}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">
                {t('register.role')}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="user">{t('register.roleUser')}</option>
                <option value="institution">Educational Institution</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Select "Institution" if you represent an educational organization
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('register.creating')}
                </span>
              ) : (
                t('register.submit')
              )}
            </button>

            <div className="text-sm text-center">
              <span className="text-gray-600">{t('register.haveAccount')} </span>
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                {t('register.signIn')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
