import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  siteName?: string;
  locale?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = "QuoteManager - Professional Quotation Management System",
  description = "Streamline your quotation process with QuoteManager. Create, manage, and track quotations with ease. Features include customer management, product catalog, analytics, and more.",
  keywords = "quotation management, quote software, business quotes, CRM, customer management, product catalog, invoice software, business automation, sales management, quotation system",
  image = "/og-image.jpg",
  url = "https://quotemanager.com",
  type = "website",
  author = "QuoteManager Team",
  siteName = "QuoteManager",
  locale = "en_US",
  twitterCard = "summary_large_image",
  twitterSite = "@quotemanager",
  twitterCreator = "@quotemanager"
}) => {
  const fullTitle = title.includes('QuoteManager') ? title : `${title} | QuoteManager`;
  const fullUrl = url.startsWith('http') ? url : `https://quotemanager.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://quotemanager.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="QuoteManager" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={description} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:image:alt" content={description} />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.iconify.design" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "QuoteManager",
          "description": description,
          "url": fullUrl,
          "image": fullImage,
          "author": {
            "@type": "Organization",
            "name": author
          },
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "29.00",
            "priceCurrency": "USD",
            "priceValidUntil": "2024-12-31"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
          },
          "featureList": [
            "Quotation Management",
            "Customer Management", 
            "Product Catalog",
            "Analytics & Reporting",
            "Workflow Automation",
            "Mobile Access"
          ]
        })}
      </script>
    </Helmet>
  );
};

// SEO Hook for easy usage
export const useSEO = (seoProps: SEOProps) => {
  return <SEO {...seoProps} />;
};

// Predefined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: "QuoteManager - Professional Quotation Management System",
    description: "Streamline your quotation process with QuoteManager. Create, manage, and track quotations with ease. Start your free trial today!",
    url: "/",
    type: "website"
  },
  
  features: {
    title: "Features - QuoteManager",
    description: "Discover powerful features including quotation builder, customer management, product catalog, analytics, and workflow automation.",
    url: "/features",
    keywords: "quotation features, CRM features, business automation, quote builder, customer management"
  },
  
  pricing: {
    title: "Pricing Plans - QuoteManager", 
    description: "Choose the perfect plan for your business. Starting at $29/month with 14-day free trial. No setup fees, cancel anytime.",
    url: "/pricing",
    keywords: "quotation software pricing, quote management cost, business software plans"
  },
  
  login: {
    title: "Login - QuoteManager",
    description: "Access your QuoteManager account to manage quotations, customers, and grow your business.",
    url: "/login",
    type: "website"
  },
  
  dashboard: {
    title: "Dashboard - QuoteManager",
    description: "Your business overview dashboard with quotation analytics, recent activities, and quick actions.",
    url: "/dashboard",
    type: "website"
  },
  
  quotations: {
    title: "Quotations - QuoteManager",
    description: "Manage all your quotations in one place. Create, edit, send, and track quotation status.",
    url: "/quotations",
    keywords: "quotation management, quote tracking, business quotes"
  },
  
  customers: {
    title: "Customer Management - QuoteManager",
    description: "Organize and manage your customer relationships. Add contacts, track interactions, and segment customers.",
    url: "/customers",
    keywords: "customer management, CRM, contact management, customer segmentation"
  },
  
  products: {
    title: "Product Catalog - QuoteManager", 
    description: "Manage your product and service catalog. Add products, set pricing, and organize by categories.",
    url: "/products",
    keywords: "product catalog, inventory management, product pricing, service management"
  },
  
  analytics: {
    title: "Analytics & Reports - QuoteManager",
    description: "Business intelligence dashboard with revenue tracking, performance metrics, and detailed reports.",
    url: "/analytics", 
    keywords: "business analytics, quotation reports, revenue tracking, performance metrics"
  },
  
  settings: {
    title: "Settings - QuoteManager",
    description: "Configure your QuoteManager system settings, user preferences, and integrations.",
    url: "/settings",
    keywords: "system settings, user preferences, business configuration"
  }
};
