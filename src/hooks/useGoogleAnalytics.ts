import { useEffect, useCallback } from 'react';
import { googleAnalyticsService } from '../services/google-analytics';

// Custom hook for Google Analytics integration
export const useGoogleAnalytics = () => {
  // Initialize GA on mount
  useEffect(() => {
    googleAnalyticsService.initialize();
  }, []);

  // Track page view
  const trackPageView = useCallback((path: string, title?: string) => {
    googleAnalyticsService.trackPageView(path, title);
  }, []);

  // Track custom event
  const trackEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    googleAnalyticsService.trackEvent(action, category, label, value);
  }, []);

  // Track quotation events
  const trackQuotationEvent = useCallback((action: 'created' | 'sent' | 'approved' | 'rejected' | 'viewed', quotationId: string, value?: number) => {
    googleAnalyticsService.trackQuotationEvent(action, quotationId, value);
  }, []);

  // Track user interactions
  const trackUserInteraction = useCallback((action: string, element: string, details?: string) => {
    googleAnalyticsService.trackUserInteraction(action, element, details);
  }, []);

  // Track business metrics
  const trackBusinessMetric = useCallback((metric: string, value: number, currency = 'USD') => {
    googleAnalyticsService.trackBusinessMetric(metric, value, currency);
  }, []);

  // Track conversions
  const trackConversion = useCallback((type: 'quotation_sent' | 'quotation_approved' | 'client_added' | 'product_added', value?: number) => {
    googleAnalyticsService.trackConversion(type, value);
  }, []);

  // Track form submissions
  const trackFormSubmission = useCallback((formName: string, success: boolean, errorMessage?: string) => {
    googleAnalyticsService.trackFormSubmission(formName, success, errorMessage);
  }, []);

  // Track search
  const trackSearch = useCallback((searchTerm: string, category?: string, resultsCount?: number) => {
    googleAnalyticsService.trackSearch(searchTerm, category, resultsCount);
  }, []);

  // Track downloads
  const trackDownload = useCallback((fileName: string, fileType: string) => {
    googleAnalyticsService.trackDownload(fileName, fileType);
  }, []);

  // Track external links
  const trackExternalLink = useCallback((url: string, linkText?: string) => {
    googleAnalyticsService.trackExternalLink(url, linkText);
  }, []);

  // Track errors
  const trackError = useCallback((description: string, fatal = false) => {
    googleAnalyticsService.trackError(description, fatal);
  }, []);

  // Track timing
  const trackTiming = useCallback((category: string, variable: string, value: number, label?: string) => {
    googleAnalyticsService.trackTiming(category, variable, value, label);
  }, []);

  // Set user properties
  const setUserProperties = useCallback((properties: Record<string, any>) => {
    googleAnalyticsService.setUserProperties(properties);
  }, []);

  return {
    trackPageView,
    trackEvent,
    trackQuotationEvent,
    trackUserInteraction,
    trackBusinessMetric,
    trackConversion,
    trackFormSubmission,
    trackSearch,
    trackDownload,
    trackExternalLink,
    trackError,
    trackTiming,
    setUserProperties
  };
};

// Hook for tracking component mount/unmount
export const usePageTracking = (pageName: string, pageTitle?: string) => {
  const { trackPageView } = useGoogleAnalytics();

  useEffect(() => {
    trackPageView(pageName, pageTitle);
  }, [pageName, pageTitle, trackPageView]);
};

// Hook for tracking user interactions with automatic cleanup
export const useInteractionTracking = () => {
  const { trackUserInteraction } = useGoogleAnalytics();

  const trackClick = useCallback((element: string, details?: string) => {
    trackUserInteraction('click', element, details);
  }, [trackUserInteraction]);

  const trackHover = useCallback((element: string, details?: string) => {
    trackUserInteraction('hover', element, details);
  }, [trackUserInteraction]);

  const trackFocus = useCallback((element: string, details?: string) => {
    trackUserInteraction('focus', element, details);
  }, [trackUserInteraction]);

  const trackScroll = useCallback((element: string, scrollPercentage?: number) => {
    trackUserInteraction('scroll', element, scrollPercentage ? `${scrollPercentage}%` : undefined);
  }, [trackUserInteraction]);

  return {
    trackClick,
    trackHover,
    trackFocus,
    trackScroll
  };
};

// Hook for tracking form interactions
export const useFormTracking = (formName: string) => {
  const { trackFormSubmission, trackUserInteraction } = useGoogleAnalytics();

  const trackFormStart = useCallback(() => {
    trackUserInteraction('form_start', formName);
  }, [formName, trackUserInteraction]);

  const trackFormFieldInteraction = useCallback((fieldName: string, action: 'focus' | 'blur' | 'change') => {
    trackUserInteraction(`form_field_${action}`, formName, fieldName);
  }, [formName, trackUserInteraction]);

  const trackFormSubmit = useCallback((success: boolean, errorMessage?: string) => {
    trackFormSubmission(formName, success, errorMessage);
  }, [formName, trackFormSubmission]);

  const trackFormAbandon = useCallback((completedFields: number, totalFields: number) => {
    const completionRate = Math.round((completedFields / totalFields) * 100);
    trackUserInteraction('form_abandon', formName, `${completionRate}% completed`);
  }, [formName, trackUserInteraction]);

  return {
    trackFormStart,
    trackFormFieldInteraction,
    trackFormSubmit,
    trackFormAbandon
  };
};

// Hook for tracking business metrics
export const useBusinessTracking = () => {
  const { trackBusinessMetric, trackConversion, trackQuotationEvent } = useGoogleAnalytics();

  const trackQuotationCreated = useCallback((quotationId: string, value: number) => {
    trackQuotationEvent('created', quotationId, value);
    trackConversion('quotation_sent', value);
    trackBusinessMetric('quotation_created', 1);
  }, [trackQuotationEvent, trackConversion, trackBusinessMetric]);

  const trackQuotationSent = useCallback((quotationId: string, value: number) => {
    trackQuotationEvent('sent', quotationId, value);
    trackConversion('quotation_sent', value);
    trackBusinessMetric('quotation_value', value);
  }, [trackQuotationEvent, trackConversion, trackBusinessMetric]);

  const trackQuotationApproved = useCallback((quotationId: string, value: number) => {
    trackQuotationEvent('approved', quotationId, value);
    trackConversion('quotation_approved', value);
    trackBusinessMetric('revenue', value);
  }, [trackQuotationEvent, trackConversion, trackBusinessMetric]);

  const trackClientAdded = useCallback((clientId: string, source: 'manual' | 'import' | 'api') => {
    trackConversion('client_added');
    trackBusinessMetric('client_added', 1);
    trackUserInteraction('client_add', 'CRM', `${clientId} - ${source}`);
  }, [trackConversion, trackBusinessMetric, trackUserInteraction]);

  const trackProductAdded = useCallback((productId: string, category: string, price: number) => {
    trackConversion('product_added', price);
    trackBusinessMetric('product_added', 1);
    trackUserInteraction('product_add', 'Catalog', `${productId} - ${category}`);
  }, [trackConversion, trackBusinessMetric, trackUserInteraction]);

  return {
    trackQuotationCreated,
    trackQuotationSent,
    trackQuotationApproved,
    trackClientAdded,
    trackProductAdded
  };
};

// Hook for tracking performance metrics
export const usePerformanceTracking = () => {
  const { trackTiming, trackError } = useGoogleAnalytics();

  const trackLoadTime = useCallback((category: string, variable: string, startTime: number) => {
    const loadTime = Date.now() - startTime;
    trackTiming(category, variable, loadTime);
  }, [trackTiming]);

  const trackApiCall = useCallback((endpoint: string, startTime: number, success: boolean, errorMessage?: string) => {
    const duration = Date.now() - startTime;
    trackTiming('API', endpoint, duration);
    
    if (!success && errorMessage) {
      trackError(`API Error: ${endpoint} - ${errorMessage}`);
    }
  }, [trackTiming, trackError]);

  const trackComponentRender = useCallback((componentName: string, renderTime: number) => {
    trackTiming('Component', componentName, renderTime);
  }, [trackTiming]);

  return {
    trackLoadTime,
    trackApiCall,
    trackComponentRender
  };
};

export default useGoogleAnalytics;
