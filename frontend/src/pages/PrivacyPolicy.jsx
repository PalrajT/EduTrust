import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <Shield className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last Updated: November 29, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-8 card animate-slide-up">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Introduction</h2>
          <p className="mb-4 text-gray-700">
            Welcome to EduTrust. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered certificate verification platform.
          </p>
          <p className="text-gray-700">
            By using EduTrust, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center mb-4">
            <Database className="w-8 h-8 mr-3 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">1. Personal Information</h3>
              <ul className="ml-6 space-y-2 text-gray-700 list-disc">
                <li>Name and email address (for account registration)</li>
                <li>Username and encrypted password</li>
                <li>Contact information (phone number, if provided)</li>
                <li>Institution or organization affiliation</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">2. Certificate Information</h3>
              <ul className="ml-6 space-y-2 text-gray-700 list-disc">
                <li>Uploaded certificate images and documents</li>
                <li>Extracted text data from certificates (OCR results)</li>
                <li>Verification results and confidence scores</li>
                <li>Metadata (upload date, file size, format)</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">3. Usage Data</h3>
              <ul className="ml-6 space-y-2 text-gray-700 list-disc">
                <li>IP address and browser information</li>
                <li>Pages visited and features used</li>
                <li>Time and date of access</li>
                <li>Device information and operating system</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center mb-4">
            <Eye className="w-8 h-8 mr-3 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>
          
          <ul className="ml-6 space-y-3 text-gray-700 list-disc">
            <li><strong>Certificate Verification:</strong> To process and verify the authenticity of uploaded certificates using AI and OCR technology</li>
            <li><strong>Account Management:</strong> To create and manage your user account and provide customer support</li>
            <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our verification algorithms</li>
            <li><strong>Communication:</strong> To send verification reports, system notifications, and important updates</li>
            <li><strong>Security:</strong> To detect fraud, prevent abuse, and ensure platform security</li>
            <li><strong>Legal Compliance:</strong> To comply with legal obligations and resolve disputes</li>
          </ul>
        </div>

        {/* Data Security */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center mb-4">
            <Lock className="w-8 h-8 mr-3 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
          </div>
          
          <p className="mb-4 text-gray-700">
            We implement industry-standard security measures to protect your information:
          </p>
          
          <ul className="ml-6 space-y-3 text-gray-700 list-disc">
            <li><strong>Encryption:</strong> All data transmissions are encrypted using HTTPS/TLS protocols</li>
            <li><strong>Password Security:</strong> Passwords are hashed using bcrypt with salt</li>
            <li><strong>Access Control:</strong> Role-based access control (RBAC) limits data access</li>
            <li><strong>Secure Storage:</strong> Uploaded certificates are stored securely with access logs</li>
            <li><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments</li>
            <li><strong>Blockchain Integration:</strong> Certificate hashes are stored on blockchain for tamper-proof records</li>
          </ul>
        </div>

        {/* Data Sharing */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center mb-4">
            <UserCheck className="w-8 h-8 mr-3 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Data Sharing and Disclosure</h2>
          </div>
          
          <p className="mb-4 text-gray-700">
            We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:
          </p>
          
          <ul className="ml-6 space-y-3 text-gray-700 list-disc">
            <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
            <li><strong>Service Providers:</strong> With trusted third-party services that help us operate (e.g., cloud hosting, OCR APIs)</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or asset sale</li>
            <li><strong>Protection:</strong> To protect our rights, property, or safety, or that of our users</li>
          </ul>
        </div>

        {/* Your Rights */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 mr-3 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
          </div>
          
          <p className="mb-4 text-gray-700">You have the following rights regarding your personal information:</p>
          
          <ul className="ml-6 space-y-3 text-gray-700 list-disc">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
            <li><strong>Objection:</strong> Object to processing of your personal data</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
          </ul>
          
          <p className="mt-4 text-gray-700">
            To exercise these rights, please contact us at <a href="mailto:privacy@edutrust.com" className="text-primary-600 hover:underline">privacy@edutrust.com</a>
          </p>
        </div>

        {/* Cookies */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.6s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Cookies and Tracking</h2>
          <p className="mb-4 text-gray-700">
            We use cookies and similar tracking technologies to enhance your experience:
          </p>
          <ul className="ml-6 space-y-2 text-gray-700 list-disc">
            <li><strong>Essential Cookies:</strong> Required for authentication and security</li>
            <li><strong>Functional Cookies:</strong> Remember your language and preferences</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
          </ul>
          <p className="mt-4 text-gray-700">
            You can control cookies through your browser settings, but disabling them may affect functionality.
          </p>
        </div>

        {/* Data Retention */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.7s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Data Retention</h2>
          <p className="mb-4 text-gray-700">
            We retain your information for as long as necessary to provide our services and comply with legal obligations:
          </p>
          <ul className="ml-6 space-y-2 text-gray-700 list-disc">
            <li>Account information: Until account deletion</li>
            <li>Verification history: 7 years (for audit purposes)</li>
            <li>Uploaded certificates: 90 days (unless flagged for investigation)</li>
            <li>System logs: 1 year</li>
          </ul>
        </div>

        {/* Children's Privacy */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.8s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Children's Privacy</h2>
          <p className="text-gray-700">
            EduTrust is intended for users who are 18 years or older. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </div>

        {/* Changes to Policy */}
        <div className="mb-8 card animate-slide-up" style={{animationDelay: '0.9s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
          </p>
        </div>

        {/* Contact */}
        <div className="text-center card animate-slide-up" style={{animationDelay: '1s'}}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Contact Us</h2>
          <p className="mb-4 text-gray-700">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> <a href="mailto:privacy@edutrust.com" className="text-primary-600 hover:underline">privacy@edutrust.com</a></p>
            <p><strong>Address:</strong> Department of Computer Science & Engineering</p>
            <p><strong>Response Time:</strong> We aim to respond within 48 hours</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
