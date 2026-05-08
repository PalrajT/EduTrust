import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Eye,
  Shield,
  Hash,
  TrendingUp,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

const ComprehensiveReport = ({ report }) => {
  const { t } = useTranslation()
  const [expandedSections, setExpandedSections] = React.useState({
    image: true,
    ocr: true,
    fields: true,
    scores: true,
    checks: false,
    issues: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Status badge
  const getStatusBadge = () => {
    const statusMap = {
      verified: { color: 'green', icon: CheckCircle, text: t('verify.result.verified') },
      suspicious: { color: 'yellow', icon: AlertTriangle, text: t('verify.result.suspicious') },
      failed: { color: 'red', icon: XCircle, text: t('verify.result.failed') }
    }
    const status = statusMap[report.status] || statusMap.failed
    const Icon = status.icon
    
    return (
      <div className={`flex items-center space-x-2 px-4 py-2 bg-${status.color}-50 border border-${status.color}-200 rounded-lg`}>
        <Icon className={`h-6 w-6 text-${status.color}-600`} />
        <span className={`font-semibold text-${status.color}-800`}>{status.text}</span>
      </div>
    )
  }

  // Risk level badge
  const getRiskBadge = () => {
    const riskColors = {
      low: 'green',
      medium: 'yellow',
      high: 'orange',
      critical: 'red'
    }
    const color = riskColors[report.risk_level] || 'gray'
    
    return (
      <span className={`px-3 py-1 bg-${color}-100 text-${color}-800 rounded-full text-sm font-medium uppercase`}>
        {report.risk_level} Risk
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('verify.report.title')}
            </h2>
            <p className="text-sm text-gray-500">
              ID: {report.verification_id} | Processed in {report.processing_time?.toFixed(2)}s
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {getStatusBadge()}
            {getRiskBadge()}
          </div>
        </div>

        {/* Overall Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600 font-medium">Authenticity</span>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {(report.authenticity_score * 100).toFixed(1)}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">OCR Quality</span>
              <FileText className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900">
              {(report.ocr_quality_score * 100).toFixed(1)}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-600 font-medium">Image Quality</span>
              <ImageIcon className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {(report.image_quality_score * 100).toFixed(1)}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-orange-600 font-medium">Tampering</span>
              <Shield className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-900">
              {(report.tampering_score * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Image Analysis */}
      <div className="card">
        <button
          onClick={() => toggleSection('image')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <ImageIcon className="h-5 w-5 mr-2 text-primary-600" />
            {t('verify.report.imageAnalysis')}
          </h3>
          {expandedSections.image ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {expandedSections.image && report.image_analysis && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-xs text-gray-600">File Name</span>
              <p className="text-sm font-medium truncate">{report.image_analysis.file_name}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-xs text-gray-600">Format</span>
              <p className="text-sm font-medium">{report.image_analysis.file_format}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-xs text-gray-600">Size</span>
              <p className="text-sm font-medium">{(report.image_analysis.file_size / 1024).toFixed(2)} KB</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-xs text-gray-600">Dimensions</span>
              <p className="text-sm font-medium">
                {report.image_analysis.dimensions?.width} × {report.image_analysis.dimensions?.height}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-xs text-gray-600">Color Mode</span>
              <p className="text-sm font-medium">{report.image_analysis.color_mode}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="text-xs text-gray-600">Quality Score</span>
              <p className="text-sm font-medium">{(report.image_analysis.quality_score * 100).toFixed(0)}%</p>
            </div>
            {report.image_analysis.resolution && (
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs text-gray-600">Resolution (DPI)</span>
                <p className="text-sm font-medium">
                  {report.image_analysis.resolution.horizontal} × {report.image_analysis.resolution.vertical}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OCR Analysis */}
      <div className="card">
        <button
          onClick={() => toggleSection('ocr')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary-600" />
            {t('verify.report.ocrAnalysis')}
          </h3>
          {expandedSections.ocr ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {expandedSections.ocr && report.ocr_analysis && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs text-gray-600">Word Count</span>
                <p className="text-sm font-medium">{report.ocr_analysis.word_count}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs text-gray-600">Line Count</span>
                <p className="text-sm font-medium">{report.ocr_analysis.line_count}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs text-gray-600">Confidence</span>
                <p className="text-sm font-medium">{(report.ocr_analysis.confidence * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs text-gray-600">Language</span>
                <p className="text-sm font-medium capitalize">{report.ocr_analysis.detected_language}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs text-gray-600">Text Orientation</span>
                <p className="text-sm font-medium capitalize">{report.ocr_analysis.text_orientation}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs text-gray-600">Reading Order</span>
                <p className="text-sm font-medium">{(report.ocr_analysis.reading_order_score * 100).toFixed(0)}%</p>
              </div>
            </div>

            {report.ocr_analysis.cleaned_text && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-xs text-gray-600 mb-2 block">Extracted Text (Preview)</span>
                <p className="text-sm text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {report.ocr_analysis.cleaned_text.substring(0, 500)}
                  {report.ocr_analysis.cleaned_text.length > 500 && '...'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Extracted Fields */}
      <div className="card">
        <button
          onClick={() => toggleSection('fields')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Hash className="h-5 w-5 mr-2 text-primary-600" />
            {t('verify.report.extractedFields')}
          </h3>
          {expandedSections.fields ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {expandedSections.fields && report.extracted_fields && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.extracted_fields.student_name && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <span className="text-xs text-blue-600 font-medium">Student Name</span>
                <p className="text-lg font-semibold text-blue-900">{report.extracted_fields.student_name}</p>
              </div>
            )}
            {report.extracted_fields.institution && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <span className="text-xs text-green-600 font-medium">Institution</span>
                <p className="text-lg font-semibold text-green-900">{report.extracted_fields.institution}</p>
              </div>
            )}
            {report.extracted_fields.course && (
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <span className="text-xs text-purple-600 font-medium">Course</span>
                <p className="text-base font-semibold text-purple-900">{report.extracted_fields.course}</p>
              </div>
            )}
            {report.extracted_fields.certificate_number && (
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                <span className="text-xs text-indigo-600 font-medium">Certificate Number</span>
                <p className="text-base font-semibold text-indigo-900">{report.extracted_fields.certificate_number}</p>
              </div>
            )}
            {report.extracted_fields.issue_date && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <span className="text-xs text-yellow-600 font-medium">Issue Date</span>
                <p className="text-base font-semibold text-yellow-900">{report.extracted_fields.issue_date}</p>
              </div>
            )}
            {report.extracted_fields.grade && (
              <div className="bg-pink-50 border border-pink-200 p-4 rounded-lg">
                <span className="text-xs text-pink-600 font-medium">Grade</span>
                <p className="text-base font-semibold text-pink-900">{report.extracted_fields.grade}</p>
              </div>
            )}
            {report.extracted_fields.degree_type && (
              <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
                <span className="text-xs text-teal-600 font-medium">Degree Type</span>
                <p className="text-base font-semibold text-teal-900">{report.extracted_fields.degree_type}</p>
              </div>
            )}
            {report.extracted_fields.registration_number && (
              <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg">
                <span className="text-xs text-cyan-600 font-medium">Registration Number</span>
                <p className="text-base font-semibold text-cyan-900">{report.extracted_fields.registration_number}</p>
              </div>
            )}
          </div>
        )}

        {expandedSections.fields && report.extracted_fields && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {report.extracted_fields.university_seal && (
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">University Seal</span>
              </div>
            )}
            {report.extracted_fields.signatures_detected > 0 && (
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">{report.extracted_fields.signatures_detected} Signature(s)</span>
              </div>
            )}
            {report.extracted_fields.qr_code_detected && (
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-purple-800">QR Code</span>
              </div>
            )}
            {report.extracted_fields.barcode_detected && (
              <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-2 rounded">
                <CheckCircle className="h-4 w-4 text-indigo-600" />
                <span className="text-sm text-indigo-800">Barcode</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verification Checks */}
      {report.anomaly_checks && report.anomaly_checks.length > 0 && (
        <div className="card">
          <button
            onClick={() => toggleSection('checks')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary-600" />
              {t('verify.report.verificationChecks')} ({report.anomaly_checks.filter(c => c.passed).length}/{report.anomaly_checks.length} Passed)
            </h3>
            {expandedSections.checks ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {expandedSections.checks && (
            <div className="mt-4 space-y-2">
              {report.anomaly_checks.map((check, index) => (
                <div
                  key={index}
                  className={`flex items-start justify-between p-3 rounded-lg border ${
                    check.passed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start space-x-3 flex-1">
                    {check.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${check.passed ? 'text-green-900' : 'text-red-900'}`}>
                        {check.check_name}
                      </p>
                      {check.details && (
                        <p className={`text-sm mt-1 ${check.passed ? 'text-green-700' : 'text-red-700'}`}>
                          {check.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${check.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {(check.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detected Issues */}
      {report.detected_issues && report.detected_issues.length > 0 && (
        <div className="card">
          <button
            onClick={() => toggleSection('issues')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
              {t('verify.report.detectedIssues')} ({report.detected_issues.length})
            </h3>
            {expandedSections.issues ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {expandedSections.issues && (
            <div className="mt-4 space-y-2">
              {report.detected_issues.map((issue, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${
                    issue.severity === 'high'
                      ? 'bg-red-50 border-red-200'
                      : issue.severity === 'medium'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <AlertCircle
                    className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                      issue.severity === 'high'
                        ? 'text-red-600'
                        : issue.severity === 'medium'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium uppercase ${
                          issue.severity === 'high'
                            ? 'bg-red-200 text-red-800'
                            : issue.severity === 'medium'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-blue-200 text-blue-800'
                        }`}
                      >
                        {issue.severity}
                      </span>
                      <span className="text-xs text-gray-500 uppercase">{issue.type}</span>
                    </div>
                    <p className="text-sm mt-1 text-gray-800">{issue.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Warnings and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warnings */}
        {report.warnings && report.warnings.length > 0 && (
          <div className="card bg-yellow-50 border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Warnings
            </h3>
            <ul className="space-y-2">
              {report.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-yellow-800 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {report.recommendations && report.recommendations.length > 0 && (
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Recommendations
            </h3>
            <ul className="space-y-2">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Additional Details */}
      {report.blockchain_verified !== undefined && (
        <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-1">Blockchain Verification</h3>
              <p className="text-sm text-indigo-700">
                {report.blockchain_verified
                  ? '✅ Certificate verified on blockchain'
                  : '❌ Certificate not found on blockchain'}
              </p>
            </div>
            {report.watermark_detected && (
              <div className="text-right">
                <h3 className="text-lg font-semibold text-purple-900 mb-1">Watermark</h3>
                <p className="text-sm text-purple-700 capitalize">
                  {report.watermark_type || 'None'} detected
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ComprehensiveReport
