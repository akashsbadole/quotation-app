import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface GdprComplianceProps {
  onNavigate?: (section: string) => void;
}

export const GdprCompliance: React.FC<GdprComplianceProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const gdprRights = [
    {
      icon: 'lucide:info',
      title: 'Right to Information',
      description: 'You have the right to know what personal data we collect and how we use it.'
    },
    {
      icon: 'lucide:eye',
      title: 'Right of Access',
      description: 'You can request a copy of all personal data we hold about you.'
    },
    {
      icon: 'lucide:edit',
      title: 'Right to Rectification',
      description: 'You can ask us to correct any inaccurate or incomplete personal data.'
    },
    {
      icon: 'lucide:trash-2',
      title: 'Right to Erasure',
      description: 'You can request deletion of your personal data under certain circumstances.'
    },
    {
      icon: 'lucide:pause',
      title: 'Right to Restrict Processing',
      description: 'You can ask us to limit how we process your personal data.'
    },
    {
      icon: 'lucide:download',
      title: 'Right to Data Portability',
      description: 'You can request your data in a portable format to transfer to another service.'
    },
    {
      icon: 'lucide:x-circle',
      title: 'Right to Object',
      description: 'You can object to certain types of processing of your personal data.'
    },
    {
      icon: 'lucide:shield',
      title: 'Rights Related to Automated Decision Making',
      description: 'You have rights regarding automated decision-making and profiling.'
    }
  ];

  const dataTypes = [
    {
      category: 'Account Information',
      data: ['Name', 'Email address', 'Phone number', 'Company details'],
      purpose: 'Account management and service provision',
      retention: '7 years after account closure'
    },
    {
      category: 'Usage Data',
      data: ['Login times', 'Feature usage', 'IP addresses', 'Device information'],
      purpose: 'Service improvement and security',
      retention: '2 years'
    },
    {
      category: 'Communication Data',
      data: ['Support tickets', 'Email communications', 'Chat logs'],
      purpose: 'Customer support and service improvement',
      retention: '3 years'
    },
    {
      category: 'Financial Data',
      data: ['Billing information', 'Payment history', 'Invoice details'],
      purpose: 'Billing and financial compliance',
      retention: '7 years for tax purposes'
    }
  ];

  const sections = [
    { id: 'overview', title: 'Overview', icon: 'lucide:home' },
    { id: 'rights', title: 'Your Rights', icon: 'lucide:shield-check' },
    { id: 'data', title: 'Data We Collect', icon: 'lucide:database' },
    { id: 'requests', title: 'Data Requests', icon: 'lucide:file-text' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Icon icon="lucide:shield-check" className="text-4xl text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">GDPR Compliance</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are committed to protecting your privacy and ensuring compliance with the 
            General Data Protection Regulation (GDPR).
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-8">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center space-x-2 ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon icon={section.icon} />
                    <span>{section.title}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to GDPR</h2>
                    <p className="text-gray-600 mb-4">
                      The General Data Protection Regulation (GDPR) is a comprehensive data protection law 
                      that came into effect on May 25, 2018. It strengthens and unifies data protection 
                      for individuals within the European Union.
                    </p>
                    <p className="text-gray-600 mb-6">
                      At QuoteManager, we are fully committed to GDPR compliance and have implemented 
                      robust measures to protect your personal data and respect your privacy rights.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <Icon icon="lucide:shield" className="text-3xl text-blue-600 mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
                        <p className="text-sm text-gray-600">
                          We implement technical and organizational measures to ensure data security.
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-6">
                        <Icon icon="lucide:check-circle" className="text-3xl text-green-600 mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Lawful Processing</h3>
                        <p className="text-sm text-gray-600">
                          We only process personal data when we have a lawful basis to do so.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Principles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'Lawfulness, fairness and transparency',
                        'Purpose limitation',
                        'Data minimization',
                        'Accuracy',
                        'Storage limitation',
                        'Integrity and confidentiality'
                      ].map((principle, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Icon icon="lucide:check" className="text-green-500" />
                          <span className="text-gray-700">{principle}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Rights Section */}
              {activeSection === 'rights' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your GDPR Rights</h2>
                    <p className="text-gray-600 mb-8">
                      Under GDPR, you have several rights regarding your personal data. 
                      Here's what you can do and how to exercise these rights:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {gdprRights.map((right, index) => (
                        <motion.div
                          key={index}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon icon={right.icon} className="text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">{right.title}</h3>
                              <p className="text-sm text-gray-600">{right.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Data Section */}
              {activeSection === 'data' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Data We Collect and Process</h2>
                    <p className="text-gray-600 mb-8">
                      We are transparent about what personal data we collect, why we collect it, 
                      and how long we keep it. Here's a comprehensive overview:
                    </p>
                    
                    <div className="space-y-6">
                      {dataTypes.map((dataType, index) => (
                        <motion.div
                          key={index}
                          className="border border-gray-200 rounded-lg p-6"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">{dataType.category}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Data Types:</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {dataType.data.map((item, idx) => (
                                  <li key={idx} className="flex items-center space-x-2">
                                    <Icon icon="lucide:dot" className="text-blue-500 text-xs" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Purpose:</h4>
                              <p className="text-sm text-gray-600">{dataType.purpose}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Retention:</h4>
                              <p className="text-sm text-gray-600">{dataType.retention}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Requests Section */}
              {activeSection === 'requests' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Exercise Your Rights</h2>
                    <p className="text-gray-600 mb-8">
                      You can exercise your GDPR rights by contacting us. We will respond to your 
                      request within 30 days and provide the requested information or action.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit a Data Request</h3>
                        <div className="space-y-4">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Email Request</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              Send your request to our Data Protection Officer
                            </p>
                            <a 
                              href="mailto:dpo@quotemanager.com" 
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              dpo@quotemanager.com
                            </a>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Online Form</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              Use our secure online form for data requests
                            </p>
                            <motion.button
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => alert('Data request form would open here')}
                            >
                              Open Request Form
                            </motion.button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Include</h3>
                        <div className="space-y-3">
                          {[
                            'Your full name and email address',
                            'Specific right you want to exercise',
                            'Clear description of your request',
                            'Proof of identity (if required)',
                            'Any relevant account information'
                          ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <Icon icon="lucide:check" className="text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-8">
                    <div className="flex items-start space-x-4">
                      <Icon icon="lucide:clock" className="text-blue-600 text-2xl mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Timeline</h3>
                        <p className="text-gray-600 mb-4">
                          We will acknowledge your request within 72 hours and provide a full response 
                          within 30 days. In complex cases, we may extend this by an additional 60 days 
                          with proper notification.
                        </p>
                        <div className="flex space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Acknowledgment: 72 hours</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Response: 30 days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Contact Section */}
        <motion.div
          className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Icon icon="lucide:help-circle" className="text-4xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with GDPR?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            If you have questions about our GDPR compliance or need assistance with exercising your rights, 
            our Data Protection Officer is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <motion.button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('contact')}
            >
              Contact DPO
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
