import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertTriangle, Search, Loader, CheckCircle, XCircle, Shield } from 'lucide-react'
import { verifyWithComprehensiveReport, certificateAPI } from '../services/api'
import ComprehensiveReport from '../components/ComprehensiveReport'
import { useToast } from '../context/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'

const VerifyCertificate = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const [certificateId, setCertificateId] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [processingSteps, setProcessingSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.file.size > 10485760) {
        addToast(t('verify.upload.sizeError'), 'error')
      } else {
        addToast(t('verify.upload.typeError'), 'error')
      }
      return
    }
    
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0])
      setVerificationResult(null)
      setError(null)
      addToast(t('verify.upload.success'), 'success')
    }
  }, [addToast, t])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  })

  const handleFileVerification = async () => {
    if (!uploadedFile) {
      addToast(t('verify.upload.required'), 'warning')
      return
    }
    
    setIsLoading(true)
    setError(null)
    setVerificationResult(null)
    
    // Set processing steps
    const steps = [
      'Analyzing image properties...',
      'Performing OCR analysis...',
      'Extracting certificate fields...',
      'Running AI anomaly detection...',
      'Detecting watermarks...',
      'Verifying on blockchain...'
    ]
    setProcessingSteps(steps)
    
    // Simulate progress through steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1
        return prev
      })
    }, 3000) // Update every 3 seconds
    
    try {
      const result = await verifyWithComprehensiveReport(uploadedFile, 'degree', 'auto')
      clearInterval(stepInterval)
      setVerificationResult(result)
      setCurrentStep(steps.length) // Complete
      
      // Show success toast based on verification result
      if (result.status === 'verified') {
        addToast(t('verify.result.verifySuccess'), 'success')
      } else if (result.status === 'suspicious') {
        addToast(t('verify.result.suspicious'), 'warning')
      } else {
        addToast(t('verify.result.failed'), 'error')
      }
    } catch (err) {
      clearInterval(stepInterval)
      const errorMsg = err.response?.data?.detail || err.message || 'Verification failed'
      setError(errorMsg)
      addToast(errorMsg, 'error')
      console.error('Verification error:', err)
    } finally {
      setIsLoading(false)
      setProcessingSteps([])
      setCurrentStep(0)
    }
  }

  const handleIdVerification = async () => {
    if (!certificateId.trim()) {
      addToast(t('verify.certificateId.required'), 'warning')
      return
    }
    
    setIsLoading(true)
    setError(null)
    setVerificationResult(null)
    
    try {
      // For now, this still uses the old endpoint (can be updated later)
      const result = await certificateAPI.getDetails(certificateId)
      setVerificationResult(result)
      addToast(t('verify.certificateId.success'), 'success')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Certificate not found'
      setError(errorMsg)
      addToast(errorMsg, 'error')
      console.error('Verification error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {t('verify.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('verify.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
          {/* Upload Section */}
          <div className="card">
            <h2 className="mb-4 text-2xl font-semibold">{t('verify.upload.title')}</h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              {uploadedFile ? (
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium">{uploadedFile.name}</span>
                </div>
              ) : (
                <>
                  <p className="mb-2 text-gray-600">{t('verify.upload.description')}</p>
                  <p className="text-sm text-gray-500">{t('verify.upload.formats')}</p>
                </>
              )}
            </div>
            {uploadedFile && (
              <button
                onClick={handleFileVerification}
                disabled={isLoading}
                className="w-full mt-4 btn-primary"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    {processingSteps.length > 0 && currentStep < processingSteps.length ? (
                      <span>{processingSteps[currentStep]}</span>
                    ) : (
                      <span>{t('verify.processing')}</span>
                    )}
                  </span>
                ) : (
                  t('verify.upload.button')
                )}
              </button>
            )}
          </div>

          {/* Certificate ID Section */}
          <div className="card">
            <h2 className="mb-4 text-2xl font-semibold">{t('verify.certificateId.title')}</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder={t('verify.certificateId.placeholder')}
                  className="input-field"
                />
              </div>
              <button
                onClick={handleIdVerification}
                disabled={!certificateId || isLoading}
                className="flex items-center justify-center w-full btn-primary"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    {t('verify.processing')}
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    {t('verify.certificateId.button')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className="animate-fade-in">
            <ComprehensiveReport report={verificationResult} />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="border-red-200 card bg-red-50 animate-fade-in">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="mb-2 text-lg font-semibold text-red-900">
                  {t('verify.result.error')}
                </h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => {
                    setError(null)
                    setVerificationResult(null)
                  }}
                  className="mt-4 text-red-600 border-red-300 btn-outline hover:bg-red-100"
                >
                  {t('verify.result.tryAgain')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyCertificate
