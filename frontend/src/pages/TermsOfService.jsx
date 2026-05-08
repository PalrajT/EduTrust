import { Scale, FileCheck, AlertTriangle, Shield, UserX, CreditCard } from 'lucide-react'

const TermsOfService = () => {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <Scale className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last Updated: November 29, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-8 card animate-slide-up">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Agreement to Terms</h2>
          <p className="mb-4 text-gray-700">
            Welcome to EduTrust. These Terms of Service ("Terms") govern your access to and use of our AI-powered certificate verification platform. By accessing or using EduTrust, you agree to be bound by these Terms.
          </p>
          <p className="text-gray-700">
            If you disagree with any part of these terms, you do not have permission to access or use our services.
          </p>
        </div>

        {/* Service Description */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center mb-4">
            <FileCheck className="w-8 h-8 mr-3 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Service Description</h2>
          </div>
          
          <p className="mb-4 text-gray-700">EduTrust provides:</p>
          <ul className="ml-6 space-y-2 text-gray-700 list-disc">
            <li>AI-powered certificate verification using OCR and computer vision</li>
            <li>Multi-language support for Indian educational certificates</li>
            <li>Blockchain-based certificate authentication</li>
            <li>Comprehensive verification reports and analytics</li>
            <li>Secure document storage and management</li>
          </ul>
        </div>

        {/* User Accounts */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.2s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">User Accounts and Registration</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Account Creation</h3>
              <ul className="ml-6 space-y-2 text-gray-700 list-disc">
                <li>You must be at least 18 years old to create an account</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must not share your account credentials</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Account Responsibilities</h3>
              <ul className="ml-6 space-y-2 text-gray-700 list-disc">
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>You are liable for all activities under your account</li>
                <li>One person or entity per account</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Acceptable Use */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center mb-4">
            <Shield className="w-8 h-8 mr-3 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Acceptable Use Policy</h2>
          </div>
          
          <p className="mb-4 text-gray-700">You agree NOT to:</p>
          <ul className="ml-6 space-y-2 text-gray-700 list-disc">
            <li>Upload fake, forged, or fraudulent certificates</li>
            <li>Attempt to circumvent or manipulate our verification systems</li>
            <li>Use the service for any illegal or unauthorized purpose</li>
            <li>Violate any laws in your jurisdiction</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit viruses, malware, or harmful code</li>
            <li>Spam, harass, or abuse other users or staff</li>
            <li>Scrape or crawl the platform without permission</li>
            <li>Reverse engineer or attempt to extract source code</li>
            <li>Use automated systems to access the service excessively</li>
          </ul>
        </div>

        {/* Prohibited Activities */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-8 h-8 mr-3 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Prohibited Activities</h2>
          </div>
          
          <p className="mb-4 font-semibold text-red-700">
            Violations may result in immediate account termination and legal action:
          </p>
          
          <ul className="ml-6 space-y-2 text-gray-700 list-disc">
            <li><strong>Certificate Fraud:</strong> Creating, uploading, or verifying fake certificates</li>
            <li><strong>Identity Theft:</strong> Impersonating another person or institution</li>
            <li><strong>Data Breaches:</strong> Attempting to access unauthorized data</li>
            <li><strong>System Attacks:</strong> DDoS, hacking, or security testing without permission</li>
            <li><strong>Commercial Misuse:</strong> Reselling our services without authorization</li>
          </ul>
        </div>

        {/* Intellectual Property */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.5s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Intellectual Property Rights</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Our Property</h3>
              <p className="text-gray-700">
                The platform, including all content, features, functionality, code, designs, graphics, and trademarks, is owned by EduTrust and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without written permission.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Your Content</h3>
              <p className="text-gray-700">
                You retain ownership of certificates and documents you upload. By uploading content, you grant us a limited license to process, store, and analyze it for verification purposes. We will not share your certificates with third parties without your consent, except as required by law.
              </p>
            </div>
          </div>
        </div>

        {/* Service Limitations */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.6s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Service Limitations and Disclaimers</h2>
          
          <ul className="ml-6 space-y-3 text-gray-700 list-disc">
            <li><strong>No Guarantee:</strong> While we strive for accuracy, we do not guarantee 100% verification accuracy</li>
            <li><strong>AI Limitations:</strong> AI algorithms may produce false positives or negatives</li>
            <li><strong>Service Availability:</strong> We do not guarantee uninterrupted or error-free service</li>
            <li><strong>Maintenance:</strong> We may suspend service for maintenance without prior notice</li>
            <li><strong>Third-Party Services:</strong> We are not responsible for third-party service failures (OCR APIs, cloud hosting)</li>
            <li><strong>Legal Validation:</strong> Our verification is for informational purposes; legal validation may require additional steps</li>
          </ul>
        </div>

        {/* Liability */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.7s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Limitation of Liability</h2>
          
          <div className="p-4 mb-4 border-l-4 border-yellow-500 bg-yellow-50">
            <p className="font-semibold text-yellow-800">IMPORTANT LEGAL NOTICE</p>
          </div>
          
          <p className="mb-4 text-gray-700">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:
          </p>
          
          <ul className="ml-6 space-y-2 text-gray-700 list-disc">
            <li>EduTrust shall not be liable for any indirect, incidental, special, or consequential damages</li>
            <li>We are not liable for decisions made based on our verification results</li>
            <li>Our total liability shall not exceed the amount you paid for services (or ₹1,000 if free)</li>
            <li>We are not responsible for data loss due to your actions</li>
            <li>You agree to indemnify us against claims arising from your misuse of services</li>
          </ul>
        </div>

        {/* Payment Terms */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.8s'}}>
          <div className="flex items-center mb-4">
            <CreditCard className="w-8 h-8 mr-3 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Terms (If Applicable)</h2>
          </div>
          
          <ul className="ml-6 space-y-2 text-gray-700 list-disc">
            <li>Free tier includes limited verifications per month</li>
            <li>Premium plans offer unlimited verifications and advanced features</li>
            <li>Payments are processed securely through third-party providers</li>
            <li>Subscriptions renew automatically unless canceled</li>
            <li>Refunds are available within 7 days of purchase for unused services</li>
            <li>Price changes will be communicated 30 days in advance</li>
          </ul>
        </div>

        {/* Termination */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.9s'}}>
          <div className="flex items-center mb-4">
            <UserX className="w-8 h-8 mr-3 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Termination</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">By You</h3>
              <p className="text-gray-700">
                You may terminate your account at any time through account settings. Upon termination, your data will be deleted according to our data retention policy.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">By Us</h3>
              <p className="mb-2 text-gray-700">We may suspend or terminate your account if:</p>
              <ul className="ml-6 space-y-2 text-gray-700 list-disc">
                <li>You violate these Terms of Service</li>
                <li>You engage in fraudulent or illegal activity</li>
                <li>Your account remains inactive for over 2 years</li>
                <li>Required by law or government order</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Governing Law */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '1s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Governing Law and Disputes</h2>
          
          <ul className="ml-6 space-y-2 text-gray-700 list-disc">
            <li>These Terms are governed by the laws of India</li>
            <li>Disputes will be subject to the exclusive jurisdiction of courts in [Your City]</li>
            <li>We encourage informal resolution before legal action</li>
            <li>You agree to arbitration for disputes under ₹10,00,000</li>
          </ul>
        </div>

        {/* Changes to Terms */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '1.1s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Changes to Terms</h2>
          <p className="text-gray-700">
            We reserve the right to modify these Terms at any time. We will notify users of material changes via email or platform notification. Continued use after changes constitutes acceptance. If you disagree with new terms, you must stop using the service and may request account deletion.
          </p>
        </div>

        {/* Contact */}
        <div className="text-center card animate-slide-up" style={{animationDelay: '1.2s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Contact Us</h2>
          <p className="mb-4 text-gray-700">
            Questions about these Terms? Contact our legal team:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> <a href="mailto:legal@edutrust.com" className="text-primary-600 hover:underline">legal@edutrust.com</a></p>
            <p><strong>Address:</strong> Department of Computer Science & Engineering</p>
            <p><strong>Response Time:</strong> 3-5 business days</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
