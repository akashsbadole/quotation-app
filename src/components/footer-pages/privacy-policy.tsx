import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SEO } from '../seo';

interface PrivacyPolicyProps {
  onNavigate?: (section: string) => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: 'lucide:eye' },
    { id: 'information-collection', title: 'Information We Collect', icon: 'lucide:database' },
    { id: 'information-use', title: 'How We Use Information', icon: 'lucide:settings' },
    { id: 'information-sharing', title: 'Information Sharing', icon: 'lucide:share' },
    { id: 'data-security', title: 'Data Security', icon: 'lucide:shield' },
    { id: 'cookies', title: 'Cookies & Tracking', icon: 'lucide:cookie' },
    { id: 'user-rights', title: 'Your Rights', icon: 'lucide:user-check' },
    { id: 'data-retention', title: 'Data Retention', icon: 'lucide:archive' },
    { id: 'international', title: 'International Transfers', icon: 'lucide:globe' },
    { id: 'children', title: 'Children\'s Privacy', icon: 'lucide:baby' },
    { id: 'changes', title: 'Policy Changes', icon: 'lucide:edit' },
    { id: 'contact', title: 'Contact Us', icon: 'lucide:mail' }
  ];

  const seoConfig = {
    title: "Privacy Policy - QuoteManager",
    description: "Learn how QuoteManager collects, uses, and protects your personal information. Our comprehensive privacy policy explains your rights and our commitments.",
    keywords: "privacy policy, data protection, GDPR, personal information, data security",
    url: "/privacy-policy"
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy Overview</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Last Updated: January 15, 2024</h3>
              <p className="text-blue-800">
                This Privacy Policy describes how QuoteManager ("we," "our," or "us") collects, uses, and protects 
                your personal information when you use our quotation management platform and related services.
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed">
              At QuoteManager, we are committed to protecting your privacy and ensuring the security of your personal 
              information. This policy explains what information we collect, how we use it, and your rights regarding 
              your personal data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">✓ GDPR Compliant</h4>
                <p className="text-green-800 text-sm">
                  We comply with the General Data Protection Regulation and other applicable privacy laws.
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">✓ SOC 2 Type II</h4>
                <p className="text-purple-800 text-sm">
                  Our security practices are audited and certified to meet the highest industry standards.
                </p>
              </div>
            </div>
          </div>
        );

      case 'information-collection':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information You Provide</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Account Information:</strong> Name, email address, phone number, company details</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Profile Information:</strong> Job title, department, profile picture</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Business Data:</strong> Customer information, quotations, products, pricing</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span><strong>Payment Information:</strong> Billing address, payment method details (processed by secure third parties)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Information We Collect Automatically</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                    <span><strong>Usage Data:</strong> How you interact with our platform, features used, time spent</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                    <span><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                    <span><strong>Log Data:</strong> Server logs, error reports, performance metrics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'information-use':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            <p className="text-gray-600">
              We use the information we collect for the following purposes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Icon icon="lucide:cog" className="mr-2 text-blue-600" />
                  Service Provision
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Provide and maintain our platform</li>
                  <li>• Process quotations and transactions</li>
                  <li>• Manage user accounts and authentication</li>
                  <li>• Provide customer support</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Icon icon="lucide:trending-up" className="mr-2 text-green-600" />
                  Improvement & Analytics
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Analyze usage patterns and trends</li>
                  <li>• Improve platform performance</li>
                  <li>• Develop new features</li>
                  <li>• Conduct research and analytics</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Icon icon="lucide:mail" className="mr-2 text-purple-600" />
                  Communication
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Send service notifications</li>
                  <li>• Provide product updates</li>
                  <li>• Respond to inquiries</li>
                  <li>• Send marketing communications (with consent)</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Icon icon="lucide:shield" className="mr-2 text-red-600" />
                  Security & Compliance
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Detect and prevent fraud</li>
                  <li>• Ensure platform security</li>
                  <li>• Comply with legal obligations</li>
                  <li>• Enforce terms of service</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'data-security':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            <p className="text-gray-600">
              We implement industry-leading security measures to protect your personal information:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="lucide:lock" className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Encryption</h3>
                    <p className="text-sm text-gray-600">All data is encrypted in transit and at rest using AES-256 encryption.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="lucide:server" className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure Infrastructure</h3>
                    <p className="text-sm text-gray-600">Our servers are hosted in SOC 2 certified data centers with 24/7 monitoring.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="lucide:key" className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Access Controls</h3>
                    <p className="text-sm text-gray-600">Multi-factor authentication and role-based access controls protect your account.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="lucide:eye" className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Monitoring</h3>
                    <p className="text-sm text-gray-600">Continuous security monitoring and threat detection systems.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="lucide:shield-check" className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Regular Audits</h3>
                    <p className="text-sm text-gray-600">Third-party security audits and penetration testing performed regularly.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="lucide:backup" className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Data Backup</h3>
                    <p className="text-sm text-gray-600">Automated backups with point-in-time recovery capabilities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'user-rights':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            <p className="text-gray-600">
              You have the following rights regarding your personal information:
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: 'lucide:eye',
                  title: 'Right to Access',
                  description: 'Request a copy of the personal information we hold about you.'
                },
                {
                  icon: 'lucide:edit',
                  title: 'Right to Rectification',
                  description: 'Request correction of inaccurate or incomplete personal information.'
                },
                {
                  icon: 'lucide:trash',
                  title: 'Right to Erasure',
                  description: 'Request deletion of your personal information under certain circumstances.'
                },
                {
                  icon: 'lucide:pause',
                  title: 'Right to Restrict Processing',
                  description: 'Request limitation of how we process your personal information.'
                },
                {
                  icon: 'lucide:download',
                  title: 'Right to Data Portability',
                  description: 'Request a copy of your data in a structured, machine-readable format.'
                },
                {
                  icon: 'lucide:x-circle',
                  title: 'Right to Object',
                  description: 'Object to processing of your personal information for certain purposes.'
                }
              ].map((right, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon={right.icon} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{right.title}</h3>
                    <p className="text-gray-600 text-sm">{right.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">How to Exercise Your Rights</h3>
              <p className="text-blue-800 mb-4">
                To exercise any of these rights, please contact us at privacy@quotemanager.com or use the 
                contact form on our website. We will respond to your request within 30 days.
              </p>
              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate?.('contact')}
              >
                Contact Privacy Team
              </motion.button>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Privacy Officer</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icon icon="lucide:mail" className="text-blue-600" />
                    <span className="text-gray-600">privacy@quotemanager.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="lucide:phone" className="text-blue-600" />
                    <span className="text-gray-600">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon icon="lucide:map-pin" className="text-blue-600 mt-1" />
                    <div className="text-gray-600">
                      <div>QuoteManager Inc.</div>
                      <div>123 Privacy Street</div>
                      <div>San Francisco, CA 94105</div>
                      <div>United States</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">EU Representative</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icon icon="lucide:mail" className="text-blue-600" />
                    <span className="text-gray-600">eu-privacy@quotemanager.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="lucide:phone" className="text-blue-600" />
                    <span className="text-gray-600">+44 20 7123 4567</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon icon="lucide:map-pin" className="text-blue-600 mt-1" />
                    <div className="text-gray-600">
                      <div>QuoteManager EU Ltd.</div>
                      <div>456 GDPR Avenue</div>
                      <div>London EC1A 1BB</div>
                      <div>United Kingdom</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Section Not Found</h2>
            <p className="text-gray-600">The requested section could not be found.</p>
          </div>
        );
    }
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
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <motion.button
                      key={section.id}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-3 text-sm ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      whileHover={{ x: 4 }}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon icon={section.icon} className="text-lg flex-shrink-0" />
                      <span className="truncate">{section.title}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                {renderContent()}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};
