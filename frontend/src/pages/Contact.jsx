import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, MapPin, Send, Users } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const Contact = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate success
      addToast(t('contact.success'), 'success')
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      addToast(t('contact.error'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 animate-slide-up">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="card group animate-slide-left">
              <div className="flex items-start space-x-4">
                <div className="p-3 transition-all duration-300 transform rounded-lg bg-primary-100 group-hover:bg-primary-600 group-hover:scale-110 group-hover:rotate-12">
                  <Mail className="w-6 h-6 transition-colors duration-300 text-primary-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">{t('contact.info.email.title')}</h3>
                  <p className="text-gray-600">{t('contact.info.email.primary')}</p>
                  <p className="text-gray-600">{t('contact.info.email.support')}</p>
                </div>
              </div>
            </div>

            <div className="card group animate-slide-left" style={{animationDelay: '0.1s'}}>
              <div className="flex items-start space-x-4">
                <div className="p-3 transition-all duration-300 transform rounded-lg bg-primary-100 group-hover:bg-primary-600 group-hover:scale-110 group-hover:rotate-12">
                  <Phone className="w-6 h-6 transition-colors duration-300 text-primary-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">{t('contact.info.phone.title')}</h3>
                  <p className="text-gray-600">{t('contact.info.phone.toll')}</p>
                  <p className="text-gray-600">{t('contact.info.phone.mobile')}</p>
                </div>
              </div>
            </div>

            <div className="card group animate-slide-left" style={{animationDelay: '0.2s'}}>
              <div className="flex items-start space-x-4">
                <div className="p-3 transition-all duration-300 transform rounded-lg bg-primary-100 group-hover:bg-primary-600 group-hover:scale-110 group-hover:rotate-12">
                  <MapPin className="w-6 h-6 transition-colors duration-300 text-primary-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">{t('contact.info.address.title')}</h3>
                  <p className="text-gray-600">
                    {t('contact.info.address.line1')}<br />
                    {t('contact.info.address.line2')}<br />
                    {t('contact.info.address.line3')}<br />
                    {t('contact.info.address.line4')}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-white card bg-primary-600 animate-slide-left" style={{animationDelay: '0.3s'}}>
              <h3 className="mb-2 font-semibold">{t('contact.info.hours.title')}</h3>
              <p className="text-primary-100">{t('contact.info.hours.weekday')}</p>
              <p className="text-primary-100">{t('contact.info.hours.saturday')}</p>
              <p className="text-primary-100">{t('contact.info.hours.sunday')}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-right">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('contact.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder={t('contact.placeholders.name')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('contact.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder={t('contact.placeholders.email')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">
                    {t('contact.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder={t('contact.placeholders.subject')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-field"
                    placeholder={t('contact.placeholders.message')}
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center w-full btn-primary group disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2 transition-all duration-300 transform group-hover:translate-x-1" />
                      {t('contact.send')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="mt-16 animate-fade-in">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600">
              The talented individuals behind EduTrust
            </p>
          </div>

          <div className="flex justify-center">
            {/* Team Member - Palraj T */}
            <div className="overflow-hidden transition-all duration-300 transform card hover:shadow-2xl hover:-translate-y-2 max-w-sm">
              <div className="text-center">
                <div className="relative mx-auto mb-4">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto transition-all duration-300 transform rounded-full bg-gradient-to-br from-blue-400 to-blue-600 group-hover:scale-110">
                    <span className="text-3xl font-bold text-white">PT</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                <h3 className="mb-1 text-xl font-bold text-gray-900">Palraj T</h3>
                <p className="mb-3 font-medium text-blue-600">Full Stack Developer</p>
                <p className="text-sm text-gray-600">Building robust APIs, database architecture, and user interfaces for scalable operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
