import { useTranslation } from 'react-i18next'
import { Shield, Zap, Users, Globe, Award, Target, TrendingUp, CheckCircle, AlertTriangle, Clock, Building2, GraduationCap, Briefcase, FileCheck, Lock, Database, ArrowRight } from 'lucide-react'

const About = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: <Shield className="w-10 h-10 text-primary-600" />,
      title: t('about.features.security.title'),
      description: t('about.features.security.description')
    },
    {
      icon: <Zap className="w-10 h-10 text-primary-600" />,
      title: t('about.features.speed.title'),
      description: t('about.features.speed.description')
    },
    {
      icon: <Globe className="w-10 h-10 text-primary-600" />,
      title: t('about.features.multilingual.title'),
      description: t('about.features.multilingual.description')
    },
    {
      icon: <Users className="w-10 h-10 text-primary-600" />,
      title: t('about.features.trusted.title'),
      description: t('about.features.trusted.description')
    }
  ]

  const techStack = [
    { name: 'React', description: t('about.techStack.react') },
    { name: 'AI/ML', description: t('about.techStack.ai') },
    { name: 'OCR', description: t('about.techStack.ocr') },
    { name: 'Blockchain', description: t('about.techStack.blockchain') },
    { name: 'Cloud', description: t('about.techStack.cloud') },
    { name: 'Node.js', description: t('about.techStack.nodejs') }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            {t('about.title')}
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-primary-100">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                {t('about.mission')}
              </h2>
              <p className="mb-4 text-lg text-gray-600">
                {t('about.missionText')}
              </p>
              <p className="text-lg text-gray-600">
                {t('about.missionDescription')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center card">
                  <div className="flex justify-center mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
            {t('about.howItWorks')}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold">{t('about.process.step1.title')}</h3>
              <p className="text-gray-600">
                {t('about.process.step1.description')}
              </p>
            </div>
            <div className="card">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold">{t('about.process.step2.title')}</h3>
              <p className="text-gray-600">
                {t('about.process.step2.description')}
              </p>
            </div>
            <div className="card">
              <div className="flex items-center justify-center w-12 h-12 mb-4 text-white rounded-full bg-primary-600">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold">{t('about.process.step3.title')}</h3>
              <p className="text-gray-600">
                {t('about.process.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
            {t('about.technology')}
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {techStack.map((tech, index) => (
              <div key={index} className="text-center">
                <div className="p-6 mb-2 rounded-lg bg-primary-100">
                  <h3 className="text-lg font-bold text-primary-600">{tech.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Meet Our Team
            </h2>
            <p className="mb-2 text-xl text-gray-600">
              {t('about.teamSubtitle')}
            </p>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              {t('about.teamDescription')}
            </p>
          </div>

          <div className="flex justify-center mb-12">
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

          <div className="max-w-4xl p-8 mx-auto text-center text-white rounded-lg bg-gradient-to-r from-primary-600 to-primary-800">
            <p className="mb-4 text-lg">
              {t('about.teamMission')}
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                The Problem We&apos;re Solving
              </h2>
              <p className="mb-4 text-lg text-gray-700">
                Certificate fraud is a growing crisis in India&apos;s education and employment sectors. Fake degrees cost organizations billions annually and undermine trust in genuine credentials.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertTriangle className="flex-shrink-0 w-6 h-6 mt-1 mr-3 text-red-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Widespread Fraud</h4>
                    <p className="text-gray-600">Over 40% of credentials submitted contain discrepancies or falsified information</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="flex-shrink-0 w-6 h-6 mt-1 mr-3 text-orange-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Slow Verification</h4>
                    <p className="text-gray-600">Traditional verification takes 2-4 weeks, delaying hiring and admissions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Globe className="flex-shrink-0 w-6 h-6 mt-1 mr-3 text-blue-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Language Barriers</h4>
                    <p className="text-gray-600">Most systems can&apos;t process regional language certificates from Indian institutions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 text-center rounded-lg bg-red-50">
                <p className="text-4xl font-bold text-red-600">40%</p>
                <p className="text-gray-700">Fake Certificates</p>
              </div>
              <div className="p-6 text-center rounded-lg bg-orange-50">
                <p className="text-4xl font-bold text-orange-600">2-4</p>
                <p className="text-gray-700">Weeks Wait Time</p>
              </div>
              <div className="p-6 text-center rounded-lg bg-blue-50">
                <p className="text-4xl font-bold text-blue-600">₹1000Cr+</p>
                <p className="text-gray-700">Annual Losses</p>
              </div>
              <div className="p-6 text-center rounded-lg bg-purple-50">
                <p className="text-4xl font-bold text-purple-600">22+</p>
                <p className="text-gray-700">Languages Needed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution / Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
            Why Choose EduTrust?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center transition-all duration-300 card group hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-all duration-300 transform rounded-full bg-primary-100 group-hover:bg-primary-600 group-hover:scale-110">
                <CheckCircle className="w-8 h-8 transition-colors text-primary-600 group-hover:text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">99.8% Accuracy</h3>
              <p className="text-gray-600">Industry-leading accuracy in detecting forgeries and anomalies</p>
            </div>
            <div className="text-center transition-all duration-300 card group hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-all duration-300 transform rounded-full bg-primary-100 group-hover:bg-primary-600 group-hover:scale-110">
                <Zap className="w-8 h-8 transition-colors text-primary-600 group-hover:text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">30 Second Verification</h3>
              <p className="text-gray-600">Instant results compared to weeks of manual processing</p>
            </div>
            <div className="text-center transition-all duration-300 card group hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-all duration-300 transform rounded-full bg-primary-100 group-hover:bg-primary-600 group-hover:scale-110">
                <Globe className="w-8 h-8 transition-colors text-primary-600 group-hover:text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">10+ Languages</h3>
              <p className="text-gray-600">Support for Hindi, Tamil, Telugu, Bengali, and more</p>
            </div>
            <div className="text-center transition-all duration-300 card group hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-all duration-300 transform rounded-full bg-primary-100 group-hover:bg-primary-600 group-hover:scale-110">
                <Shield className="w-8 h-8 transition-colors text-primary-600 group-hover:text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Blockchain Secured</h3>
              <p className="text-gray-600">Tamper-proof verification with distributed ledger technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Stats Section */}
      <section className="py-16 text-white bg-gradient-to-r from-primary-700 to-primary-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3" />
              <p className="mb-2 text-4xl font-bold">500+</p>
              <p className="text-primary-100">Partner Institutions</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-3" />
              <p className="mb-2 text-4xl font-bold">50K+</p>
              <p className="text-primary-100">Certificates Verified</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-3" />
              <p className="mb-2 text-4xl font-bold">99.8%</p>
              <p className="text-primary-100">Detection Rate</p>
            </div>
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto mb-3" />
              <p className="mb-2 text-4xl font-bold">15+</p>
              <p className="text-primary-100">States Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-4xl p-8 mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Our Vision</h2>
            <p className="mb-6 text-xl text-gray-700">
              To become India&apos;s most trusted platform for academic credential verification, eliminating certificate fraud and building a transparent education ecosystem.
            </p>
            <p className="text-lg text-gray-600">
              We envision a future where every academic credential in India is verifiable instantly, securely, and transparently—protecting students, employers, and institutions from the devastating impact of certificate fraud.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-center text-gray-900">
            Who Benefits from EduTrust?
          </h2>
          <p className="max-w-3xl mx-auto mb-12 text-lg text-center text-gray-600">
            Our platform serves multiple stakeholders in the education ecosystem
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 transition-all duration-300 transform bg-white rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-center text-gray-900">Universities</h3>
              <p className="text-center text-gray-600">Issue tamper-proof digital certificates and reduce verification burden</p>
            </div>
            <div className="p-6 transition-all duration-300 transform bg-white rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-center text-gray-900">Employers</h3>
              <p className="text-center text-gray-600">Verify candidate credentials instantly during hiring process</p>
            </div>
            <div className="p-6 transition-all duration-300 transform bg-white rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-center text-gray-900">Government</h3>
              <p className="text-center text-gray-600">Prevent fraud in government schemes and public sector recruitment</p>
            </div>
            <div className="p-6 transition-all duration-300 transform bg-white rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-center text-gray-900">Students</h3>
              <p className="text-center text-gray-600">Share verifiable credentials easily and build trust with institutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
            Comprehensive Features
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border-l-4 border-primary-600 bg-gray-50">
              <FileCheck className="w-10 h-10 mb-4 text-primary-600" />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Multi-Format Support</h3>
              <p className="text-gray-600">Process certificates in PDF, JPG, PNG formats with automatic format detection and optimization</p>
            </div>
            <div className="p-6 border-l-4 border-primary-600 bg-gray-50">
              <Database className="w-10 h-10 mb-4 text-primary-600" />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Centralized Database</h3>
              <p className="text-gray-600">Unified repository of verified credentials from universities across India for quick cross-reference</p>
            </div>
            <div className="p-6 border-l-4 border-primary-600 bg-gray-50">
              <Lock className="w-10 h-10 mb-4 text-primary-600" />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Privacy Protection</h3>
              <p className="text-gray-600">End-to-end encryption and GDPR-compliant data handling to protect sensitive information</p>
            </div>
            <div className="p-6 border-l-4 border-primary-600 bg-gray-50">
              <Shield className="w-10 h-10 mb-4 text-primary-600" />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">AI-Powered Detection</h3>
              <p className="text-gray-600">Advanced machine learning models detect font manipulation, seal forgery, and signature anomalies</p>
            </div>
            <div className="p-6 border-l-4 border-primary-600 bg-gray-50">
              <Globe className="w-10 h-10 mb-4 text-primary-600" />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Multi-Language OCR</h3>
              <p className="text-gray-600">Accurate text extraction from certificates in 10+ Indian languages including regional scripts</p>
            </div>
            <div className="p-6 border-l-4 border-primary-600 bg-gray-50">
              <CheckCircle className="w-10 h-10 mb-4 text-primary-600" />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Real-Time Verification</h3>
              <p className="text-gray-600">Instant verification status with detailed reports and confidence scores for each check</p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-center text-gray-900">
            Awards & Recognition
          </h2>
          <p className="mb-12 text-lg text-center text-gray-600">
            Recognized for innovation and impact in education technology
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="p-8 text-center transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
              <Target className="w-16 h-16 mx-auto mb-4 text-primary-600" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">Innovation in EdTech</h3>
              <p className="text-gray-600">Pioneering AI-based verification solutions for Indian education</p>
            </div>
            <div className="p-8 text-center transition-all duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105">
              <Users className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">Community Impact</h3>
              <p className="text-gray-600">Building trust and transparency in academic credentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-white bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Experience Secure Verification?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-primary-100">
            Join the revolution in academic credential verification. Start verifying certificates today.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button 
              onClick={() => window.location.href = '/verify'}
              className="flex items-center gap-2 px-8 py-4 text-lg font-semibold transition-all duration-300 transform bg-white rounded-lg text-primary-600 hover:scale-105 hover:shadow-2xl group"
            >
              Verify Certificate
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform border-2 border-white rounded-lg hover:bg-white hover:text-primary-600 hover:scale-105 hover:shadow-2xl"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
