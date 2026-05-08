import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed z-50 p-3 text-white transition-all duration-300 rounded-full shadow-lg bottom-8 right-8 bg-primary-600 hover:bg-primary-700 hover:scale-110 hover:shadow-2xl active:scale-95 animate-slide-up group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      )}
    </>
  )
}

export default BackToTop
