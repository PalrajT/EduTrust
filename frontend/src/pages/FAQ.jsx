import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HelpCircle, ChevronDown, ChevronUp, Search, Shield, Upload, FileCheck, Clock, CreditCard, Lock } from 'lucide-react'

const FAQ = () => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [openIndex, setOpenIndex] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Category definitions with icons
  const categories = [
    { id: 'all', label: t('faq.categories.all'), icon: <HelpCircle className="w-6 h-6" /> },
    { id: 'general', label: t('faq.categories.general'), icon: <HelpCircle className="w-6 h-6" /> },
    { id: 'verification', label: t('faq.categories.verification'), icon: <FileCheck className="w-6 h-6" /> },
    { id: 'security', label: t('faq.categories.security'), icon: <Lock className="w-6 h-6" /> },
    { id: 'privacy', label: t('faq.categories.privacy'), icon: <Shield className="w-6 h-6" /> },
    { id: 'technical', label: t('faq.categories.technical'), icon: <Upload className="w-6 h-6" /> },
    { id: 'business', label: t('faq.categories.business'), icon: <CreditCard className="w-6 h-6" /> }
  ]

  // FAQ data structure - questions are kept in English as primary content
  // In a production app, you'd have full translations for all questions
  const faqs = [
    {
      category: "general",
      icon: <HelpCircle className="w-6 h-6" />,
      questions: [
        {
          q: "What is EduTrust?",
          a: "EduTrust is an AI-powered certificate verification platform that uses advanced OCR, computer vision, and blockchain technology to authenticate educational certificates. We support 10+ Indian languages and provide verification results in under 60 seconds."
        },
        {
          q: "How accurate is the verification?",
          a: "Our system achieves over 92% accuracy in detecting fake certificates. We use a multi-layered approach including OCR text extraction, AI-based anomaly detection, watermark analysis, and blockchain verification to ensure high accuracy."
        },
        {
          q: "Which certificates can I verify?",
          a: "You can verify degree certificates, diplomas, marksheets, transcripts, and other educational documents from Indian institutions. We support certificates in English and 10+ regional languages including Hindi, Tamil, Telugu, Bengali, and more."
        },
        {
          q: "Is EduTrust free to use?",
          a: "We offer a free tier with limited verifications per month. Premium plans provide unlimited verifications, bulk processing, API access, and advanced analytics. Check our pricing page for details."
        }
      ]
    },
    {
      category: "verification",
      icon: <FileCheck className="w-6 h-6" />,
      questions: [
        {
          q: "How long does verification take?",
          a: "Most verifications complete in 25-35 seconds. Our system guarantees results within 60 seconds. Processing time depends on document quality, file size, and current system load."
        },
        {
          q: "What file formats are supported?",
          a: "We accept JPEG, PNG, and PDF files. For best results, upload high-resolution scans (300+ DPI). Maximum file size is 10 MB per document."
        },
        {
          q: "How do I interpret verification results?",
          a: "Results include an authenticity score (0-1), confidence level, and detailed anomaly report. Scores above 0.85 indicate likely authentic certificates, while scores below 0.5 suggest potential fraud. You'll receive a comprehensive report highlighting specific issues detected."
        },
        {
          q: "What if my authentic certificate is flagged as suspicious?",
          a: "False positives can occur with poor-quality scans, unusual layouts, or rare certificate formats. If your genuine certificate is flagged, please contact support with additional documentation (e.g., university verification letter) for manual review."
        },
        {
          q: "Can I verify certificates from foreign universities?",
          a: "Currently, EduTrust focuses on Indian educational institutions. International certificate support is planned for future releases. Contact us if you have specific requirements."
        }
      ]
    },
    {
      category: "security",
      icon: <Upload className="w-6 h-6" />,
      questions: [
        {
          q: "Is my uploaded certificate secure?",
          a: "Yes. All uploads are encrypted during transmission (HTTPS/TLS). Certificates are stored securely with access controls and are automatically deleted after 90 days unless flagged for investigation. We never share your documents with third parties without consent."
        },
        {
          q: "Can I delete uploaded certificates?",
          a: "Yes. You can delete your uploaded certificates from your account dashboard at any time. Deletion is immediate and permanent, though verification history metadata is retained for audit purposes."
        },
        {
          q: "Who can see my verification results?",
          a: "Only you can see your verification results unless you explicitly share them. Admins have access for fraud investigation purposes only. Aggregated anonymous statistics may be used for system improvement."
        },
        {
          q: "What data do you collect from certificates?",
          a: "We extract text (names, institutions, dates, grades), analyze images (logos, seals, watermarks), and generate verification metadata (confidence scores, anomaly flags). Original images are stored temporarily for verification purposes."
        }
      ]
    },
    {
      category: "technical",
      icon: <Shield className="w-6 h-6" />,
      questions: [
        {
          q: "Why is my upload failing?",
          a: "Common issues include: file size exceeding 10 MB, unsupported format, poor image quality, or network problems. Try compressing your file, converting to JPEG/PNG, or checking your internet connection."
        },
        {
          q: "The verification is taking longer than 60 seconds",
          a: "This may indicate high server load or issues with the document. Refresh the page and try again. If the problem persists, contact support with your verification ID."
        },
        {
          q: "I'm not receiving verification emails",
          a: "Check your spam/junk folder. Add noreply@edutrust.com to your contacts. Verify your email address in account settings. If issues persist, contact support."
        },
        {
          q: "The system can't read text from my certificate",
          a: "Ensure your certificate scan is clear, well-lit, and high-resolution (300+ DPI). Avoid glare, shadows, or blurry images. Straighten skewed documents before uploading."
        }
      ]
    },
    {
      category: "business",
      icon: <CreditCard className="w-6 h-6" />,
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Register' in the navigation menu, provide your email, username, and password, then verify your email. Account creation is free and takes less than 2 minutes."
        },
        {
          q: "I forgot my password",
          a: "Click 'Forgot Password' on the login page. Enter your registered email to receive a password reset link. The link expires after 24 hours for security."
        },
        {
          q: "How do I upgrade to a premium plan?",
          a: "Navigate to your Profile page and click 'Upgrade Plan'. Choose your preferred tier and complete payment securely through our payment gateway. Premium access is instant."
        },
        {
          q: "Can I cancel my subscription?",
          a: "Yes. Go to Profile > Subscription > Cancel Subscription. You'll retain access until the current billing period ends. Refunds are available within 7 days for unused services."
        },
        {
          q: "Do you offer bulk verification discounts?",
          a: "Yes. Enterprise plans offer significant discounts for bulk verifications (1000+ per month). Contact sales@edutrust.com for custom pricing and API integration."
        }
      ]
    },
    {
      category: "privacy",
      icon: <Lock className="w-6 h-6" />,
      questions: [
        {
          q: "How is my personal data used?",
          a: "We use your data solely for providing verification services, improving our platform, and communication. We never sell your data. See our Privacy Policy for complete details."
        },
        {
          q: "Is EduTrust GDPR compliant?",
          a: "While GDPR is European regulation, we follow similar privacy principles. Indian users are protected under India's Digital Personal Data Protection Act. You can request data deletion or export at any time."
        },
        {
          q: "What happens if I report a fake certificate?",
          a: "Reported certificates are added to our blacklist and flagged for investigation. If confirmed fake, the issuer is notified (if identifiable), and the certificate is permanently blacklisted. Your report is confidential."
        },
        {
          q: "Can verification results be used in legal proceedings?",
          a: "Our reports provide strong evidence but are not legal documents. For legal purposes, we recommend combining our AI verification with official institutional verification. We can provide expert testimony if subpoenaed."
        }
      ]
    }
  ]

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === key ? null : key)
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{t('faq.title')}</h1>
          <p className="text-lg text-gray-600">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 card animate-slide-up">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
            <input
              type="text"
              placeholder={t('faq.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center card animate-fade-in">
            <p className="text-lg text-gray-600">{t('faq.search.noResults')}</p>
          </div>
        ) : (
          filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8 animate-slide-up" style={{animationDelay: `${categoryIndex * 0.1}s`}}>
              <div className="mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-primary-600">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{t(`faq.categories.${category.category}`)}</h2>
                </div>
              </div>

              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const isOpen = openIndex === `${categoryIndex}-${questionIndex}`
                  return (
                    <div 
                      key={questionIndex} 
                      className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                    >
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="flex items-center justify-between w-full p-4 text-left transition-colors duration-200 hover:bg-gray-50"
                      >
                        <span className="pr-4 font-semibold text-gray-900">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="flex-shrink-0 w-5 h-5 text-primary-600" />
                        ) : (
                          <ChevronDown className="flex-shrink-0 w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      
                      <div 
                        className={`transition-all duration-300 ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        } overflow-hidden`}
                      >
                        <div className="p-4 pt-0 text-gray-700 border-t border-gray-100">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}

        {/* Still Have Questions */}
        <div className="mt-12 text-center card animate-slide-up" style={{animationDelay: '0.8s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Still Have Questions?</h2>
          <p className="mb-6 text-gray-700">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a 
              href="/contact" 
              className="px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg bg-primary-600 hover:bg-primary-700 hover:scale-105 hover:shadow-lg"
            >
              Contact Support
            </a>
            <a 
              href="mailto:support@edutrust.com" 
              className="px-6 py-3 font-semibold transition-all duration-300 border-2 rounded-lg text-primary-600 border-primary-600 hover:bg-primary-50 hover:scale-105"
            >
              Email Us
            </a>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3 animate-fade-in" style={{animationDelay: '0.9s'}}>
          <div className="p-6 text-center transition-all duration-300 transform bg-white rounded-lg shadow-sm hover:shadow-md hover:scale-105">
            <Clock className="w-8 h-8 mx-auto mb-2 text-primary-600" />
            <p className="text-2xl font-bold text-gray-900">&lt; 60s</p>
            <p className="text-sm text-gray-600">Avg. Verification Time</p>
          </div>
          <div className="p-6 text-center transition-all duration-300 transform bg-white rounded-lg shadow-sm hover:shadow-md hover:scale-105">
            <Shield className="w-8 h-8 mx-auto mb-2 text-primary-600" />
            <p className="text-2xl font-bold text-gray-900">92%+</p>
            <p className="text-sm text-gray-600">Accuracy Rate</p>
          </div>
          <div className="p-6 text-center transition-all duration-300 transform bg-white rounded-lg shadow-sm hover:shadow-md hover:scale-105">
            <FileCheck className="w-8 h-8 mx-auto mb-2 text-primary-600" />
            <p className="text-2xl font-bold text-gray-900">10+</p>
            <p className="text-sm text-gray-600">Languages Supported</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
