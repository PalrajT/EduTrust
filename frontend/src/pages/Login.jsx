import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Shield, Lock, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
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
            {t('login.title')}
          </h2>
          <p className="text-gray-600 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {t('login.subtitle')}
          </p>
        </div>

        <div className="card animate-scale-in" style={{animationDelay: '0.3s'}}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-800 border border-red-200 rounded-lg bg-red-50 animate-shake">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                {t('login.email')}
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
                  placeholder={t('login.placeholders.email')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                {t('login.password')}
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
                  placeholder={t('login.placeholders.password')}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="remember" className="block ml-2 text-sm text-gray-700">
                  {t('login.rememberMe')}
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  {t('login.forgotPassword')}
                </a>
              </div>
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
                  {t('login.signingIn')}
                </span>
              ) : (
                t('login.submit')
              )}
            </button>

            <div className="text-sm text-center">
              <span className="text-gray-600">Don&apos;t have an account? </span>
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Register here
              </Link>
            </div>

            <div className="p-4 mt-4 rounded-lg bg-primary-50 border border-primary-200">
              <p className="text-sm text-center text-gray-700">
                <strong className="text-primary-700">{t('login.demoCredentials')}</strong><br />
                <span className="text-xs">User:</span> testuser@edutrust.com<br />
                <span className="text-xs">Password:</span> TestPass123<br />
                <span className="text-xs mt-2 block">Admin:</span> admin@edutrust.com<br />
                <span className="text-xs">Password:</span> AdminPass123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
