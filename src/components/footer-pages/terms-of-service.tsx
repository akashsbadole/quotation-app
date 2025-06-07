import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SEO } from '../seo';

interface TermsOfServiceProps {
  onNavigate?: (section: string) => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: 'lucide:eye' },
    { id: 'acceptance', title: 'Acceptance of Terms', icon: 'lucide:check-circle' },
    { id: 'service-description', title: 'Service Description', icon: 'lucide:settings' },
    { id: 'user-accounts', title: 'User Accounts', icon: 'lucide:user' },
    { id: 'acceptable-use', title: 'Acceptable Use', icon: 'lucide:shield-check' },
    { id: 'payment-terms', title: 'Payment Terms', icon: 'lucide:credit-card' },
    { id: 'intellectual-property', title: 'Intellectual Property', icon: 'lucide:copyright' },
    { id: 'data-security', title: 'Data Security', icon: 'lucide:lock' },
    { id: 'limitation-liability', title: 'Limitation of Liability', icon: 'lucide:alert-triangle' },
    { id: 'termination', title: 'Termination', icon: 'lucide:x-circle' },
    { id: 'governing-law', title: 'Governing Law', icon: 'lucide:scale' },
    { id: 'contact', title: 'Contact Information', icon: 'lucide:mail' }
  ];

  const seoConfig = {
    title: "Terms of Service - QuoteManager",
    description: "Read QuoteManager's Terms of Service. Understand your rights and obligations when using our quotation management platform.",
    keywords: "terms of service, user agreement, legal terms, QuoteManager terms, service agreement",
    url: "/terms-of-service"
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Terms of Service Overview</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Last Updated: January 15, 2024</h3>
              <p className="text-blue-800">
                These Terms of Service ("Terms") govern your use of QuoteManager's quotation management platform 
                and related services provided by QuoteManager Inc. ("we," "our," or "us").
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using our services, you agree to be bound by these Terms. If you disagree with 
              any part of these terms, then you may not access the service.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">✓ Clear Terms</h4>
                <p className="text-green-800 text-sm">
                  We use plain language to explain your rights and responsibilities.
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">✓ Fair Usage</h4>
                <p className="text-purple-800 text-sm">
                  Our terms are designed to be fair and protect both parties.
                </p>
              </div>
            </div>
          </div>
        );

      case 'acceptance':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                By creating an account, accessing, or using QuoteManager services, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Important Notice</h3>
                <p className="text-yellow-800 text-sm">
                  If you are entering into these Terms on behalf of a company or other legal entity, 
                  you represent that you have the authority to bind such entity to these Terms.
                </p>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">What This Means:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>You must be at least 18 years old to use our services</span>
                </li>
                <li className="flex items-start">
                  <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>You have the legal capacity to enter into this agreement</span>
                </li>
                <li className="flex items-start">
                  <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>You agree to comply with all applicable laws and regulations</span>
                </li>
                <li className="flex items-start">
                  <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                  <span>You will keep your account information accurate and up-to-date</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'service-description':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Service Description</h2>
            <p className="text-gray-600 leading-relaxed">
              QuoteManager provides a cloud-based quotation management platform that enables businesses to create, 
              manage, and track quotations, manage customer relationships, and organize product catalogs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Icon icon="lucide:check-circle" className="mr-2 text-green-600" />
                  What We Provide
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Quotation creation and management tools</li>
                  <li>• Customer relationship management features</li>
                  <li>• Product catalog organization</li>
                  <li>• Analytics and reporting capabilities</li>
                  <li>• Mobile applications for iOS and Android</li>
                  <li>• API access for integrations</li>
                  <li>• Customer support and documentation</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Icon icon="lucide:info" className="mr-2 text-blue-600" />
                  Service Availability
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 99.9% uptime guarantee</li>
                  <li>• Regular maintenance windows</li>
                  <li>• Continuous service improvements</li>
                  <li>• Security updates and patches</li>
                  <li>• Feature updates and enhancements</li>
                  <li>• Technical support during business hours</li>
                  <li>• Emergency support for critical issues</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'payment-terms':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment Terms</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Subscription Plans</h3>
                <p className="text-gray-600 mb-4">
                  QuoteManager offers various subscription plans with different features and usage limits. 
                  All fees are stated in US Dollars and are non-refundable except as required by law.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Starter Plan</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">$29/month</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Up to 100 quotations/month</li>
                      <li>• 5 team members</li>
                      <li>• Basic support</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Professional Plan</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">$79/month</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Unlimited quotations</li>
                      <li>• 25 team members</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Enterprise Plan</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">Custom</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Custom features</li>
                      <li>• Unlimited team members</li>
                      <li>• Dedicated support</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Processing</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Icon icon="lucide:credit-card" className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                    <span>Payments are processed securely through Stripe</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:calendar" className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                    <span>Subscriptions are billed monthly or annually in advance</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:refresh-cw" className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                    <span>Automatic renewal unless cancelled before the next billing cycle</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:alert-circle" className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                    <span>Failed payments may result in service suspension</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'acceptable-use':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Acceptable Use Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to use QuoteManager services only for lawful purposes and in accordance with these Terms. 
              You are responsible for all activity that occurs under your account.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-green-700">✓ Permitted Uses</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Creating and managing business quotations</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Storing customer and product information</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Integrating with other business tools</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Sharing quotations with customers</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:check" className="mr-2 text-green-500 mt-1 flex-shrink-0" />
                    <span>Generating business reports and analytics</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-red-700">✗ Prohibited Uses</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Icon icon="lucide:x" className="mr-2 text-red-500 mt-1 flex-shrink-0" />
                    <span>Violating any applicable laws or regulations</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:x" className="mr-2 text-red-500 mt-1 flex-shrink-0" />
                    <span>Uploading malicious code or viruses</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:x" className="mr-2 text-red-500 mt-1 flex-shrink-0" />
                    <span>Attempting to gain unauthorized access</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:x" className="mr-2 text-red-500 mt-1 flex-shrink-0" />
                    <span>Reverse engineering or copying our software</span>
                  </li>
                  <li className="flex items-start">
                    <Icon icon="lucide:x" className="mr-2 text-red-500 mt-1 flex-shrink-0" />
                    <span>Using the service for spam or fraudulent activities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'termination':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Termination</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Termination by You</h3>
                <p className="text-gray-600 mb-4">
                  You may terminate your account at any time by canceling your subscription through your account settings 
                  or by contacting our support team.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">What Happens When You Cancel:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Your subscription will remain active until the end of your current billing period</li>
                    <li>• You can export your data before the account is deactivated</li>
                    <li>• No refunds will be provided for unused portions of your subscription</li>
                    <li>• Your data will be deleted 30 days after account termination</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Termination by Us</h3>
                <p className="text-gray-600 mb-4">
                  We may terminate or suspend your account immediately if you violate these Terms or engage in 
                  activities that could harm our service or other users.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">Reasons for Termination:</h4>
                  <ul className="text-red-800 text-sm space-y-1">
                    <li>• Violation of acceptable use policy</li>
                    <li>• Non-payment of fees</li>
                    <li>• Fraudulent or illegal activities</li>
                    <li>• Abuse of our support team</li>
                    <li>• Security threats to our platform</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Legal Department</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icon icon="lucide:mail" className="text-blue-600" />
                    <span className="text-gray-600">legal@quotemanager.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="lucide:phone" className="text-blue-600" />
                    <span className="text-gray-600">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon icon="lucide:map-pin" className="text-blue-600 mt-1" />
                    <div className="text-gray-600">
                      <div>QuoteManager Inc.</div>
                      <div>123 Legal Street</div>
                      <div>San Francisco, CA 94105</div>
                      <div>United States</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm">
                      For urgent legal matters, please email us and we'll respond within 24 hours.
                    </p>
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
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These terms govern your use of QuoteManager. Please read them carefully to understand your rights and responsibilities.
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
