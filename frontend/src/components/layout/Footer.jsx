import { useTranslation } from 'react-i18next'
import { Shield, Mail, Phone, MapPin, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Footer = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      // In production, this would call an API
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="py-12 border-b border-gray-800 bg-gradient-to-r from-primary-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="mb-2 text-2xl font-bold text-white">Stay Updated</h3>
              <p className="text-primary-200">Get the latest news and updates about certificate verification</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 text-gray-900 transition-all duration-300 border-0 rounded-lg focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
          {subscribed && (
            <div className="mt-3 text-center">
              <p className="text-green-400 animate-fade-in">✓ {t('footer.newsletter.success')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">{t('appName')}</span>
            </div>
            <p className="text-sm text-gray-400">
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary-400 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-sm hover:text-primary-400 transition-colors">
                  {t('nav.verify')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-primary-400 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary-400 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>{t('footer.email')}</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>{t('footer.phone')}</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{t('footer.address')}</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm hover:text-primary-400 transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-primary-400 transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            {t('footer.copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
