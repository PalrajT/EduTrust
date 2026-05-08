import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit2, 
  Save, 
  X, 
  Lock,
  UserCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, updateProfile, logout } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
  })

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const [showPasswordChange, setShowPasswordChange] = useState(false)

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        full_name: user.full_name || '',
        email: user.email || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const updates = {}
      
      // Only include changed fields
      if (formData.username !== user.username) {
        updates.username = formData.username
      }
      if (formData.full_name !== user.full_name) {
        updates.full_name = formData.full_name
      }

      if (Object.keys(updates).length === 0) {
        setError(t('profile.errors.noChanges'))
        setLoading(false)
        return
      }

      const result = await updateProfile(updates)
      
      if (result.success) {
        setSuccess(t('profile.success.profileUpdated'))
        setIsEditing(false)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || t('profile.errors.updateFailed'))
      }
    } catch (err) {
      setError(t('profile.errors.updateFailed'))
      console.error('Profile update error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validate passwords
    if (passwordData.new_password.length < 8) {
      setError(t('profile.errors.passwordLength'))
      setLoading(false)
      return
    }

    if (!/[A-Z]/.test(passwordData.new_password)) {
      setError(t('profile.errors.passwordUppercase'))
      setLoading(false)
      return
    }

    if (!/\d/.test(passwordData.new_password)) {
      setError(t('profile.errors.passwordNumber'))
      setLoading(false)
      return
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError(t('profile.errors.passwordMismatch'))
      setLoading(false)
      return
    }

    try {
      // TODO: Implement password change API endpoint
      // For now, show a message
      setError(t('profile.errors.passwordComingSoon'))
      setLoading(false)
      
      // Reset password form
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
      setShowPasswordChange(false)
    } catch (err) {
      setError(t('profile.errors.passwordChangeFailed'))
      console.error('Password change error:', err)
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      username: user.username || '',
      full_name: user.full_name || '',
      email: user.email || '',
    })
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: 'bg-red-100 text-red-800 border-red-200', icon: <Shield className="w-4 h-4" /> },
      institution: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Shield className="w-4 h-4" /> },
      user: { color: 'bg-green-100 text-green-800 border-green-200', icon: <User className="w-4 h-4" /> },
    }
    
    const badge = badges[role] || badges.user
    
    return (
      <span className={`inline-flex items-center px-3 py-1 space-x-1 text-sm font-medium border rounded-full ${badge.color}`}>
        {badge.icon}
        <span className="capitalize">{role}</span>
      </span>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 rounded-full animate-spin border-t-primary-600"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-primary-50 to-primary-100 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="p-6 rounded-full bg-primary-600 animate-bounce-subtle">
              <UserCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 animate-slide-up">
            {t('profile.title')}
          </h1>
          <p className="text-gray-600 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="max-w-2xl p-4 mx-auto mb-6 text-green-800 border border-green-200 rounded-lg bg-green-50 animate-scale-in">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl p-4 mx-auto mb-6 text-red-800 border border-red-200 rounded-lg bg-red-50 animate-shake">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Sidebar - Profile Summary */}
          <div className="space-y-6 md:col-span-1">
            {/* Profile Card */}
            <div className="card animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary-100">
                    <UserCircle className="w-20 h-20 text-primary-600" />
                  </div>
                </div>
                <h2 className="mb-1 text-xl font-bold text-gray-900">{user.full_name}</h2>
                <p className="mb-3 text-sm text-gray-600">@{user.username}</p>
                <div className="flex justify-center mb-4">
                  {getRoleBadge(user.role)}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  {user.is_active ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                      <span>{t('profile.accountStatus.active')}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-1 text-red-600" />
                      <span>{t('profile.accountStatus.inactive')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="card animate-scale-in" style={{animationDelay: '0.4s'}}>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">{t('profile.accountDetails')}</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mt-0.5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t('profile.memberSince')}</p>
                    <p className="text-sm text-gray-600">{formatDate(user.created_at)}</p>
                  </div>
                </div>
                {user.last_login && (
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mt-0.5 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{t('profile.lastLogin')}</p>
                      <p className="text-sm text-gray-600">{formatDate(user.last_login)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card animate-scale-in" style={{animationDelay: '0.5s'}}>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">{t('profile.quickActions')}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="w-full btn-secondary"
                >
                  <Lock className="inline w-4 h-4 mr-2" />
                  {t('profile.changePassword')}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-red-600 btn-outline hover:bg-red-50"
                >
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Profile Details */}
          <div className="space-y-6 md:col-span-2">
            {/* Profile Information */}
            <div className="card animate-scale-in" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t('profile.personalInfo')}</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    <Edit2 className="inline w-4 h-4 mr-2" />
                    {t('common.edit')}
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (Read-only) */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t('profile.fields.email')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10 bg-gray-100 cursor-not-allowed input-field"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{t('profile.emailNote')}</p>
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
                    {t('profile.fields.username')}
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
                      disabled={!isEditing}
                      className={`pl-10 input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="full_name" className="block mb-2 text-sm font-medium text-gray-700">
                    {t('profile.fields.fullName')}
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
                      disabled={!isEditing}
                      className={`pl-10 input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 btn-primary disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('profile.saving')}
                        </span>
                      ) : (
                        <>
                          <Save className="inline w-4 h-4 mr-2" />
                          {t('common.save')}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex-1 btn-secondary"
                    >
                      <X className="inline w-4 h-4 mr-2" />
                      {t('common.cancel')}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password Section */}
            {showPasswordChange && (
              <div className="card animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{t('profile.changePassword')}</h2>
                  <button
                    onClick={() => setShowPasswordChange(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label htmlFor="current_password" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('profile.fields.currentPassword')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="current_password"
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        required
                        className="pl-10 input-field"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('profile.fields.newPassword')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="new_password"
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        required
                        className="pl-10 input-field"
                        placeholder="••••••••"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {t('profile.passwordRequirements')}
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('profile.fields.confirmPassword')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        required
                        className="pl-10 input-field"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('profile.updatingPassword')}
                      </span>
                    ) : (
                      <>
                        <Lock className="inline w-4 h-4 mr-2" />
                        {t('profile.updatePassword')}
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Account Activity */}
            <div className="card animate-scale-in" style={{animationDelay: '0.7s'}}>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">{t('profile.activity.title')}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 mr-4 bg-blue-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t('profile.activity.accountCreated')}</p>
                      <p className="text-sm text-gray-600">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                </div>
                
                {user.updated_at && user.updated_at !== user.created_at && (
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 mr-4 bg-green-100 rounded-full">
                        <Edit2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{t('profile.activity.profileUpdated')}</p>
                        <p className="text-sm text-gray-600">{formatDate(user.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {user.last_login && (
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 mr-4 bg-purple-100 rounded-full">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{t('profile.activity.lastLogin')}</p>
                        <p className="text-sm text-gray-600">{formatDate(user.last_login)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
