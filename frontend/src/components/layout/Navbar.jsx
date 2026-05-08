import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Shield, Menu, X, Globe, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
  ]

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setIsLangMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 bg-white shadow-lg hover:shadow-2xl">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Shield className="h-8 w-8 text-primary-600 transform transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-125" />
              <span className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary-600">{t('appName')}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-4 md:flex">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-300 rounded-md hover:text-primary-600 hover:bg-primary-50 hover:scale-110 whitespace-nowrap">
              {t('nav.home')}
            </Link>
            <Link to="/verify" className="px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-300 rounded-md hover:text-primary-600 hover:bg-primary-50 hover:scale-110 whitespace-nowrap">
              {t('nav.verify')}
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-300 rounded-md hover:text-primary-600 hover:bg-primary-50 hover:scale-110 whitespace-nowrap">
                {t('nav.admin')}
              </Link>
            )}
            <Link to="/about" className="px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-300 rounded-md hover:text-primary-600 hover:bg-primary-50 hover:scale-110 whitespace-nowrap">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-300 rounded-md hover:text-primary-600 hover:bg-primary-50 hover:scale-110 whitespace-nowrap">
              {t('nav.contact')}
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center px-3 py-2 space-x-1 text-sm font-medium text-gray-700 transition-all duration-300 rounded-md hover:text-primary-600 hover:bg-primary-50 hover:scale-110 whitespace-nowrap"
              >
                <Globe className="w-4 h-4 transition-transform duration-300 hover:rotate-180" />
                <span className="inline-block">{languages.find(l => l.code === i18n.language)?.name || 'English'}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg animate-scale-in">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="flex items-center justify-start w-full px-4 py-2 text-sm text-left text-gray-700 transition-all duration-300 hover:bg-primary-50 hover:text-primary-600 hover:translate-x-1"
                    >
                      <span className="inline-block">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/profile" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-300 rounded-md hover:text-primary-600 hover:bg-primary-50 whitespace-nowrap"
                >
                  <User className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-primary whitespace-nowrap"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/register" className="px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-300 rounded-md hover:text-primary-600 hover:bg-primary-50 whitespace-nowrap">
                  Register
                </Link>
                <Link to="/login" className="btn-primary whitespace-nowrap">
                  {t('nav.login')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-all duration-300 hover:scale-125 active:scale-95"
            >
              {isMenuOpen ? <X className="w-6 h-6 transition-transform duration-300 rotate-90" /> : <Menu className="w-6 h-6 transition-transform duration-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="bg-white border-t border-gray-200 md:hidden animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              {t('nav.home')}
            </Link>
            <Link to="/verify" className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              {t('nav.verify')}
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                {t('nav.admin')}
              </Link>
            )}
            <Link to="/about" className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
              {t('nav.contact')}
            </Link>
            
            <div className="pt-2 mt-2 border-t border-gray-200">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { changeLanguage(lang.code); setIsMenuOpen(false) }}
                  className="block w-full px-3 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100"
                >
                  {lang.name}
                </button>
              ))}
            </div>

            {user ? (
              <div className="mt-2 space-y-2">
                <Link to="/profile" className="block">
                  <button className="w-full btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    <User className="inline w-4 h-4 mr-2" />
                    My Profile
                  </button>
                </Link>
                <button onClick={handleLogout} className="w-full btn-primary">
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <>
                <Link to="/register" className="block mt-2">
                  <button className="w-full mb-2 btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </button>
                </Link>
                <Link to="/login" className="block">
                  <button className="w-full btn-primary" onClick={() => setIsMenuOpen(false)}>
                    {t('nav.login')}
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
