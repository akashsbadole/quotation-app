import ReactGA from 'react-ga4';

// Google Analytics Configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 Measurement ID

class GoogleAnalyticsService {
  private isInitialized = false;

  // Initialize Google Analytics
  initialize() {
    if (this.isInitialized) return;

    try {
      ReactGA.initialize(GA_MEASUREMENT_ID, {
        debug: process.env.NODE_ENV === 'development',
        testMode: process.env.NODE_ENV === 'test',
        gaOptions: {
          send_page_view: false // We'll send page views manually
        }
      });
      
      this.isInitialized = true;
      console.log('Google Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (!this.isInitialized) return;

    try {
      ReactGA.send({
        hitType: 'pageview',
        page: path,
        title: title || document.title
      });
      
      console.log(`GA: Page view tracked - ${path}`);
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  // Track custom events
  trackEvent(action: string, category: string, label?: string, value?: number) {
    if (!this.isInitialized) return;

    try {
      ReactGA.event({
        action,
        category,
        label,
        value
      });
      
      console.log(`GA: Event tracked - ${category}:${action}`);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  // Track quotation events
  trackQuotationEvent(action: 'created' | 'sent' | 'approved' | 'rejected' | 'viewed', quotationId: string, value?: number) {
    this.trackEvent(action, 'Quotation', quotationId, value);
  }

  // Track user interactions
  trackUserInteraction(action: string, element: string, details?: string) {
    this.trackEvent(action, 'User Interaction', `${element}${details ? ` - ${details}` : ''}`);
  }

  // Track business metrics
  trackBusinessMetric(metric: string, value: number, currency = 'USD') {
    this.trackEvent('business_metric', 'Business', metric, value);
    
    // Also track as a custom metric for enhanced ecommerce
    ReactGA.gtag('event', 'business_metric', {
      metric_name: metric,
      value: value,
      currency: currency
    });
  }

  // Track conversion events
  trackConversion(type: 'quotation_sent' | 'quotation_approved' | 'client_added' | 'product_added', value?: number) {
    this.trackEvent('conversion', 'Business Conversion', type, value);
    
    // Track as conversion event
    ReactGA.gtag('event', 'conversion', {
      send_to: GA_MEASUREMENT_ID,
      conversion_type: type,
      value: value || 0,
      currency: 'USD'
    });
  }

  // Track user timing (performance metrics)
  trackTiming(category: string, variable: string, value: number, label?: string) {
    if (!this.isInitialized) return;

    try {
      ReactGA.gtag('event', 'timing_complete', {
        name: variable,
        value: value,
        event_category: category,
        event_label: label
      });
      
      console.log(`GA: Timing tracked - ${category}:${variable} = ${value}ms`);
    } catch (error) {
      console.error('Failed to track timing:', error);
    }
  }

  // Track errors
  trackError(description: string, fatal = false) {
    if (!this.isInitialized) return;

    try {
      ReactGA.gtag('event', 'exception', {
        description: description,
        fatal: fatal
      });
      
      console.log(`GA: Error tracked - ${description}`);
    } catch (error) {
      console.error('Failed to track error:', error);
    }
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>) {
    if (!this.isInitialized) return;

    try {
      ReactGA.gtag('config', GA_MEASUREMENT_ID, {
        user_properties: properties
      });
      
      console.log('GA: User properties set', properties);
    } catch (error) {
      console.error('Failed to set user properties:', error);
    }
  }

  // Track enhanced ecommerce events
  trackPurchase(transactionId: string, items: any[], value: number) {
    if (!this.isInitialized) return;

    try {
      ReactGA.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: 'USD',
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          category: item.category || 'Quotation Item',
          quantity: item.quantity,
          price: item.unitPrice
        }))
      });
      
      console.log(`GA: Purchase tracked - ${transactionId} = $${value}`);
    } catch (error) {
      console.error('Failed to track purchase:', error);
    }
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean, errorMessage?: string) {
    this.trackEvent(
      success ? 'form_submit_success' : 'form_submit_error',
      'Form Interaction',
      formName,
      success ? 1 : 0
    );

    if (!success && errorMessage) {
      this.trackError(`Form submission failed: ${formName} - ${errorMessage}`);
    }
  }

  // Track search events
  trackSearch(searchTerm: string, category?: string, resultsCount?: number) {
    ReactGA.gtag('event', 'search', {
      search_term: searchTerm,
      content_category: category,
      results_count: resultsCount
    });
  }

  // Track file downloads
  trackDownload(fileName: string, fileType: string) {
    this.trackEvent('download', 'File Download', `${fileName} (${fileType})`);
  }

  // Track external link clicks
  trackExternalLink(url: string, linkText?: string) {
    this.trackEvent('click', 'External Link', linkText || url);
  }

  // Get client ID for cross-platform tracking
  getClientId(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.isInitialized) {
        resolve('');
        return;
      }

      ReactGA.gtag('get', GA_MEASUREMENT_ID, 'client_id', (clientId: string) => {
        resolve(clientId);
      });
    });
  }

  // Track custom dimensions
  trackCustomDimension(index: number, value: string) {
    if (!this.isInitialized) return;

    ReactGA.gtag('config', GA_MEASUREMENT_ID, {
      [`custom_map.dimension${index}`]: value
    });
  }

  // Debug mode toggle
  setDebugMode(enabled: boolean) {
    if (!this.isInitialized) return;

    ReactGA.gtag('config', GA_MEASUREMENT_ID, {
      debug_mode: enabled
    });
  }
}

// Create singleton instance
export const googleAnalyticsService = new GoogleAnalyticsService();

// Export types for TypeScript
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface GAPageView {
  path: string;
  title?: string;
}

export interface GAUserProperties {
  user_type?: 'premium' | 'free' | 'trial';
  company_size?: 'small' | 'medium' | 'large' | 'enterprise';
  industry?: string;
  plan_type?: string;
  [key: string]: any;
}

// Helper functions for common tracking scenarios
export const trackQuotationCreated = (quotationId: string, value: number) => {
  googleAnalyticsService.trackQuotationEvent('created', quotationId, value);
  googleAnalyticsService.trackConversion('quotation_sent', value);
};

export const trackQuotationSent = (quotationId: string, value: number, customerEmail: string) => {
  googleAnalyticsService.trackQuotationEvent('sent', quotationId, value);
  googleAnalyticsService.trackConversion('quotation_sent', value);
  googleAnalyticsService.trackBusinessMetric('quotation_value', value);
};

export const trackQuotationApproved = (quotationId: string, value: number) => {
  googleAnalyticsService.trackQuotationEvent('approved', quotationId, value);
  googleAnalyticsService.trackConversion('quotation_approved', value);
  googleAnalyticsService.trackBusinessMetric('revenue', value);
};

export const trackClientAdded = (clientId: string, source: 'manual' | 'import' | 'api') => {
  googleAnalyticsService.trackEvent('client_added', 'CRM', `${clientId} - ${source}`);
  googleAnalyticsService.trackConversion('client_added');
};

export const trackProductAdded = (productId: string, category: string, price: number) => {
  googleAnalyticsService.trackEvent('product_added', 'Catalog', `${productId} - ${category}`, price);
  googleAnalyticsService.trackConversion('product_added', price);
};

export default googleAnalyticsService;
