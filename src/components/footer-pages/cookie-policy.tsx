import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface CookiePolicyProps {
  onNavigate?: (section: string) => void;
}

export const CookiePolicy: React.FC<CookiePolicyProps> = ({ onNavigate }) => {
  const cookieTypes = [
    {
      type: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      examples: ['Authentication tokens', 'Session management', 'Security features'],
      retention: 'Session or up to 1 year',
      canDisable: false
    },
    {
      type: 'Performance Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: ['Google Analytics', 'Page load times', 'Error tracking'],
      retention: 'Up to 2 years',
      canDisable: true
    },
    {
      type: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: ['Language preferences', 'Theme settings', 'Form data'],
      retention: 'Up to 1 year',
      canDisable: true
    },
    {
      type: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements.',
      examples: ['Ad targeting', 'Campaign tracking', 'Social media integration'],
      retention: 'Up to 2 years',
      canDisable: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600">
            Learn about how we use cookies and similar technologies on QuoteManager
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: January 16, 2024
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
          <p className="text-gray-600 mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
            They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
          <p className="text-gray-600">
            We use cookies to enhance your experience, analyze website traffic, and for marketing purposes. 
            This policy explains what cookies we use and why.
          </p>
        </motion.div>

        {/* Cookie Types */}
        <motion.div
          className="space-y-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>
          
          {cookieTypes.map((cookie, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{cookie.type}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  cookie.canDisable 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {cookie.canDisable ? 'Optional' : 'Required'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{cookie.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Examples:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {cookie.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <Icon icon="lucide:check" className="text-green-500 text-xs" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Retention Period:</h4>
                  <p className="text-sm text-gray-600">{cookie.retention}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Third Party Cookies */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
          <p className="text-gray-600 mb-4">
            We also use third-party services that may set cookies on your device:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Google Analytics</h3>
              <p className="text-sm text-gray-600 mb-2">
                Helps us understand how visitors use our website
              </p>
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Google Privacy Policy →
              </a>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Intercom</h3>
              <p className="text-sm text-gray-600 mb-2">
                Powers our customer support chat widget
              </p>
              <a 
                href="https://www.intercom.com/legal/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Intercom Privacy Policy →
              </a>
            </div>
          </div>
        </motion.div>

        {/* Managing Cookies */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Cookie Settings</h3>
              <p className="text-gray-600 mb-4">
                You can manage your cookie preferences using our cookie banner or by visiting your browser settings.
              </p>
              <motion.button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // This would typically open a cookie preferences modal
                  alert('Cookie preferences panel would open here');
                }}
              >
                Manage Cookie Preferences
              </motion.button>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Browser Settings</h3>
              <p className="text-gray-600 mb-2">
                You can also control cookies through your browser settings:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center space-x-2">
                  <Icon icon="lucide:chrome" className="text-blue-500" />
                  <span>Chrome: Settings → Privacy and security → Cookies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon icon="lucide:firefox" className="text-orange-500" />
                  <span>Firefox: Settings → Privacy & Security → Cookies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon icon="lucide:safari" className="text-blue-400" />
                  <span>Safari: Preferences → Privacy → Cookies</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="bg-blue-50 rounded-lg p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Icon icon="lucide:help-circle" className="text-4xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Cookie Policy?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about our use of cookies, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <motion.button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('contact')}
            >
              Contact Us
            </motion.button>
            <motion.button
              className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('privacy-policy')}
            >
              Privacy Policy
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
