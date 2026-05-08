import { useTranslation } from 'react-i18next'

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const { t } = useTranslation()
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const spinner = (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}></div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        <div className="text-center">
          <div className={`${sizes.xl} mx-auto border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
