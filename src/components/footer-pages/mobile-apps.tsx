import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SEO } from '../seo';

interface MobileAppsProps {
  onNavigate?: (section: string) => void;
}

export const MobileApps: React.FC<MobileAppsProps> = ({ onNavigate }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android'>('ios');

  const appFeatures = [
    {
      icon: 'lucide:file-plus',
      title: 'Create Quotations',
      description: 'Build professional quotations on the go with our intuitive mobile interface.'
    },
    {
      icon: 'lucide:users',
      title: 'Customer Management',
      description: 'Access customer information, add new contacts, and manage relationships anywhere.'
    },
    {
      icon: 'lucide:package',
      title: 'Product Catalog',
      description: 'Browse your complete product catalog and add items to quotations instantly.'
    },
    {
      icon: 'lucide:bell',
      title: 'Real-time Notifications',
      description: 'Get instant alerts for quotation approvals, customer responses, and deadlines.'
    },
    {
      icon: 'lucide:cloud-sync',
      title: 'Offline Sync',
      description: 'Work offline and sync your data automatically when connection is restored.'
    },
    {
      icon: 'lucide:shield-check',
      title: 'Secure Access',
      description: 'Enterprise-grade security with biometric authentication and data encryption.'
    },
    {
      icon: 'lucide:camera',
      title: 'Document Scanner',
      description: 'Scan and attach documents, receipts, and contracts directly to quotations.'
    },
    {
      icon: 'lucide:bar-chart',
      title: 'Analytics Dashboard',
      description: 'View key metrics, sales performance, and business insights on your mobile device.'
    }
  ];

  const appInfo = {
    ios: {
      version: '2.1.4',
      size: '45.2 MB',
      rating: 4.8,
      reviews: 1247,
      minVersion: 'iOS 13.0',
      lastUpdate: 'December 15, 2023',
      downloadUrl: '#',
      screenshots: [
        '/screenshots/ios-1.png',
        '/screenshots/ios-2.png',
        '/screenshots/ios-3.png',
        '/screenshots/ios-4.png'
      ]
    },
    android: {
      version: '2.1.3',
      size: '52.8 MB',
      rating: 4.7,
      reviews: 2156,
      minVersion: 'Android 7.0',
      lastUpdate: 'December 12, 2023',
      downloadUrl: '#',
      screenshots: [
        '/screenshots/android-1.png',
        '/screenshots/android-2.png',
        '/screenshots/android-3.png',
        '/screenshots/android-4.png'
      ]
    }
  };

  const currentApp = appInfo[selectedPlatform];

  const seoConfig = {
    title: "Mobile Apps - QuoteManager",
    description: "Download QuoteManager mobile apps for iOS and Android. Create quotations, manage customers, and grow your business on the go.",
    keywords: "mobile app, iOS app, Android app, quotation app, business mobile, CRM mobile",
    url: "/mobile-apps"
  };

  return (
    <>
      <SEO {...seoConfig} />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              QuoteManager Mobile Apps
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take your business with you. Create quotations, manage customers, and close deals 
              from anywhere with our powerful mobile applications.
            </p>
          </motion.div>

          {/* Platform Selector */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
              <div className="flex space-x-2">
                <motion.button
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    selectedPlatform === 'ios'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlatform('ios')}
                >
                  <Icon icon="lucide:smartphone" className="text-lg" />
                  <span>iOS App</span>
                </motion.button>
                <motion.button
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    selectedPlatform === 'android'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlatform('android')}
                >
                  <Icon icon="lucide:smartphone" className="text-lg" />
                  <span>Android App</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* App Showcase */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* App Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    selectedPlatform === 'ios' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <Icon 
                      icon={selectedPlatform === 'ios' ? 'lucide:apple' : 'lucide:android'} 
                      className={`text-3xl ${
                        selectedPlatform === 'ios' ? 'text-blue-600' : 'text-green-600'
                      }`} 
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      QuoteManager for {selectedPlatform === 'ios' ? 'iOS' : 'Android'}
                    </h2>
                    <p className="text-gray-600">Version {currentApp.version}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon icon="lucide:star" className="text-yellow-500" />
                      <span className="font-semibold text-gray-900">{currentApp.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{currentApp.reviews.toLocaleString()} reviews</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon icon="lucide:download" className="text-blue-500" />
                      <span className="font-semibold text-gray-900">{currentApp.size}</span>
                    </div>
                    <p className="text-sm text-gray-600">Download size</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Minimum Version:</span>
                    <span className="font-medium text-gray-900">{currentApp.minVersion}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium text-gray-900">{currentApp.lastUpdate}</span>
                  </div>
                </div>

                <motion.a
                  href={currentApp.downloadUrl}
                  className={`inline-flex items-center justify-center w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                    selectedPlatform === 'ios' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon 
                    icon={selectedPlatform === 'ios' ? 'lucide:apple' : 'lucide:android'} 
                    className="mr-3 text-xl" 
                  />
                  Download for {selectedPlatform === 'ios' ? 'iOS' : 'Android'}
                </motion.a>
              </div>

              {/* Screenshots */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {currentApp.screenshots.slice(0, 4).map((screenshot, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-200 rounded-lg aspect-[9/16] flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <div className="text-center text-gray-500">
                        <Icon icon="lucide:smartphone" className="text-4xl mb-2 mx-auto" />
                        <p className="text-sm">Screenshot {index + 1}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Powerful Features in Your Pocket
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {appFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon icon={feature.icon} className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* System Requirements */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon icon="lucide:apple" className="mr-2 text-blue-600" />
                  iOS Requirements
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Icon icon="lucide:check" className="mr-2 text-green-500" />
                    iOS 13.0 or later
                  </li>
                  <li className="flex items-center">
                    <Icon icon="lucide:check" className="mr-2 text-green-500" />
                    iPhone 6s or newer
                  </li>
                  <li className="flex items-center">
                    <Icon icon="lucide:check" className="mr-2 text-green-500" />
                    iPad (6th generation) or newer
                  </li>
                  <li className="flex items-center">
                    <Icon icon="lucide:check" className="mr-2 text-green-500" />
                    50 MB free storage space
                  </li>
                  <li className="flex items-center">
                    <Icon icon="lucide:check" className="mr-2 text-green-500" />
                    Internet connection required
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon icon="lucide:android" className="mr-2 text-green-600" />
                  Android Requirements
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Icon icon="lucide:check" className="mr-2 text-green-500" />
                    Android 7.0 (API level 24) or higher
                  </li>
                  <li className="flex items-center">
                    <Icon icon="lucide:check" className="mr-2 text-green-500" />
                    2GB RAM minimum
                  </li>
                  <li className="flex items-center">
                    <Icon icon="lucide:check" className="mr-2 text-green-500" />
                    ARM64 or x86_64 processor
                  </li>
                  <li className="flex items-center">
                    <Icon icon="lucide:check" className="mr-2 text-green-500" />
                    60 MB free storage space
                  </li>
                  <li className="flex items-center">
                    <Icon icon="lucide:check" className="mr-2 text-green-500" />
                    Internet connection required
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  question: "Is the mobile app free to download?",
                  answer: "Yes, the QuoteManager mobile app is free to download. However, you need an active QuoteManager subscription to use the app features."
                },
                {
                  question: "Can I work offline with the mobile app?",
                  answer: "Yes, you can create and edit quotations offline. Your changes will automatically sync when you reconnect to the internet."
                },
                {
                  question: "Is my data secure on the mobile app?",
                  answer: "Absolutely. We use enterprise-grade encryption and security measures. You can also enable biometric authentication for additional security."
                },
                {
                  question: "How often is the app updated?",
                  answer: "We release updates regularly with new features, improvements, and security patches. Updates are typically released monthly."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
