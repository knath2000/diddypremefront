interface EventProperties {
  [key: string]: any
}

export const useAnalytics = () => {
  const config = useRuntimeConfig()
  const route = useRoute()

  const trackEvent = (eventName: string, properties?: EventProperties) => {
    // In production, this would send to analytics service
    if (config.public.vercelEnv === 'production') {
      // Example: Send to Google Analytics, Mixpanel, etc.
      console.log(`[Analytics] Event: ${eventName}`, properties)
      
      // If using Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, properties)
      }
    } else {
      // Development logging
      console.log(`[Analytics Dev] Event: ${eventName}`, properties)
    }
  }

  const trackPageView = (pagePath?: string) => {
    const path = pagePath || route.fullPath
    trackEvent('page_view', {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href
    })
  }

  const trackError = (error: Error, context?: string) => {
    trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      error_context: context,
      page_path: route.fullPath
    })
  }

  const trackTiming = (category: string, variable: string, value: number) => {
    trackEvent('timing_complete', {
      timing_category: category,
      timing_variable: variable,
      timing_value: value
    })
  }

  return {
    trackEvent,
    trackPageView,
    trackError,
    trackTiming
  }
}