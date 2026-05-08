import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Search, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  const { t } = useTranslation()
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-purple-50">
      <div className="max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        {/* 404 Illustration */}
        <div className="mb-8 animate-bounce-subtle">
          <div className="relative inline-block">
            <span className="text-9xl font-bold text-primary-600 opacity-20">404</span>
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <Search className="w-24 h-24 text-primary-600 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl animate-fade-in">
          {t('notFound.title')}
        </h1>
        <p className="mb-8 text-xl text-gray-600 animate-slide-up">
          {t('notFound.description')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up" style={{animationDelay: '0.2s'}}>
          <Link 
            to="/"
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg bg-primary-600 hover:bg-primary-700 hover:scale-105 hover:shadow-lg group"
          >
            <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            {t('notFound.goHome')}
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 border-2 rounded-lg text-primary-600 border-primary-600 hover:bg-primary-50 hover:scale-105 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            {t('notFound.goBack')}
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 animate-fade-in" style={{animationDelay: '0.4s'}}>
          <p className="mb-4 text-sm font-semibold text-gray-700">{t('notFound.quickLinks.title')}:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/verify" className="px-4 py-2 text-sm font-medium transition-all duration-300 bg-white border border-gray-300 rounded-lg hover:border-primary-500 hover:text-primary-600 hover:scale-105">
              {t('notFound.quickLinks.verify')}
            </Link>
            <Link to="/about" className="px-4 py-2 text-sm font-medium transition-all duration-300 bg-white border border-gray-300 rounded-lg hover:border-primary-500 hover:text-primary-600 hover:scale-105">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="px-4 py-2 text-sm font-medium transition-all duration-300 bg-white border border-gray-300 rounded-lg hover:border-primary-500 hover:text-primary-600 hover:scale-105">
              {t('notFound.quickLinks.contact')}
            </Link>
            <Link to="/faq" className="px-4 py-2 text-sm font-medium transition-all duration-300 bg-white border border-gray-300 rounded-lg hover:border-primary-500 hover:text-primary-600 hover:scale-105">
              {t('notFound.quickLinks.faq')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
