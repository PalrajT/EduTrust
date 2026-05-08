import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Shield, Languages, Cpu, Clock, CheckCircle, TrendingUp, Quote, Star, ArrowRight } from 'lucide-react'

const Home = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: <Languages className="h-12 w-12 text-primary-600" />,
      title: t('home.features.ocr.title'),
      description: t('home.features.ocr.description'),
    },
    {
      icon: <Cpu className="h-12 w-12 text-primary-600" />,
      title: t('home.features.ai.title'),
      description: t('home.features.ai.description'),
    },
    {
      icon: <Shield className="h-12 w-12 text-primary-600" />,
      title: t('home.features.blockchain.title'),
      description: t('home.features.blockchain.description'),
    },
    {
      icon: <Clock className="h-12 w-12 text-primary-600" />,
      title: t('home.features.instant.title'),
      description: t('home.features.instant.description'),
    },
  ]

  const stats = [
    { label: t('home.stats.verified'), value: '1M+', icon: <CheckCircle /> },
    { label: t('home.stats.universities'), value: '500+', icon: <Shield /> },
    { label: t('home.stats.accuracy'), value: '99.8%', icon: <TrendingUp /> },
    { label: t('home.stats.languages'), value: '10+', icon: <Languages /> },
  ]

  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      role: "HR Director, Tech Corp",
      image: "RK",
      rating: 5,
      text: "EduTrust has revolutionized our hiring process. We can now verify candidates' credentials in minutes instead of weeks. The accuracy is impressive!"
    },
    {
      name: "Priya Sharma",
      role: "University Registrar",
      image: "PS",
      rating: 5,
      text: "As a university administrator, I'm impressed by how EduTrust handles multi-language certificates. It has significantly reduced our verification workload."
    },
    {
      name: "Amit Patel",
      role: "Recruitment Manager",
      image: "AP",
      rating: 5,
      text: "The AI-powered fraud detection caught several fake certificates that would have slipped through manual verification. Highly recommended!"
    }
  ]

  const benefits = [
    {
      key: "employers",
      points: ["Instant verification", "Reduce hiring fraud", "Save time & costs", "Compliance assurance"]
    },
    {
      key: "institutions",
      points: ["Automated verification", "Reduce manual workload", "Enhanced reputation", "Digital transformation"]
    },
    {
      key: "students",
      points: ["Quick credential sharing", "Digital certificates", "Easy verification", "Career opportunities"]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Link to="/verify">
                <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95">
                  {t('home.hero.cta')}
                </button>
              </Link>
              <Link to="/about">
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 hover:shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95">
                  {t('home.hero.learnMore')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110 animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex justify-center mb-2 text-primary-600 group-hover:scale-125 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.features.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card group animate-slide-up" style={{animationDelay: `${index * 0.15}s`}}>
                <div className="mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.howItWorks.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110 animate-slide-left">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 group-hover:scale-125 transition-all duration-500">
                <span className="text-2xl font-bold text-primary-600 group-hover:text-white transition-colors duration-300">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors duration-300">{t('home.howItWorks.step1.title')}</h3>
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{t('home.howItWorks.step1.description')}</p>
            </div>
            <div className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 group-hover:scale-125 transition-all duration-500">
                <span className="text-2xl font-bold text-primary-600 group-hover:text-white transition-colors duration-300">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors duration-300">{t('home.howItWorks.step2.title')}</h3>
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{t('home.howItWorks.step2.description')}</p>
            </div>
            <div className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110 animate-slide-right" style={{animationDelay: '0.4s'}}>
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 group-hover:scale-125 transition-all duration-500">
                <span className="text-2xl font-bold text-primary-600 group-hover:text-white transition-colors duration-300">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors duration-300">{t('home.howItWorks.step3.title')}</h3>
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{t('home.howItWorks.step3.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('home.testimonials.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 relative transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-up" style={{animationDelay: `${index * 0.15}s`}}>
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary-200" />
                
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.benefits.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('home.benefits.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate-slide-up" style={{animationDelay: `${index * 0.15}s`}}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t(`home.benefits.${benefit.key}.title`)}</h3>
                <ul className="space-y-3">
                  {benefit.points.map((point, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <Shield className="w-12 h-12 mx-auto mb-3 text-primary-400" />
              <p className="text-sm font-semibold">{t('home.trust.encryption.title')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('home.trust.encryption.description')}</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p className="text-sm font-semibold">{t('home.trust.gdpr.title')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('home.trust.gdpr.description')}</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <Clock className="w-12 h-12 mx-auto mb-3 text-blue-400" />
              <p className="text-sm font-semibold">{t('home.trust.support.title')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('home.trust.support.description')}</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
              <Cpu className="w-12 h-12 mx-auto mb-3 text-purple-400" />
              <p className="text-sm font-semibold">{t('home.trust.ai.title')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('home.trust.ai.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-primary-100 animate-slide-up">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-subtle">
            <Link to="/verify">
              <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 hover:shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95 flex items-center gap-2 group">
                {t('home.cta.button')}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
            <Link to="/contact">
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 hover:shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95">
                Contact Sales
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
