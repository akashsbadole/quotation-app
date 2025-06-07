import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface FeaturesProps {
  onNavigate?: (section: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: 'lucide:file-text',
      title: 'Smart Quotation Builder',
      description: 'Create professional quotations with our intuitive drag-and-drop builder. Use templates, add custom fields, and generate PDF documents instantly.',
      benefits: ['Template library', 'Custom branding', 'PDF generation', 'Multi-currency support']
    },
    {
      icon: 'lucide:users',
      title: 'Customer Management',
      description: 'Organize and manage your customer relationships with comprehensive CRM features. Track interactions, segment customers, and personalize communications.',
      benefits: ['Contact management', 'Customer segmentation', 'Interaction history', 'Communication tracking']
    },
    {
      icon: 'lucide:workflow',
      title: 'Approval Workflows',
      description: 'Streamline your approval process with customizable workflows. Set approval rules, automate notifications, and track approval status in real-time.',
      benefits: ['Custom approval rules', 'Automated notifications', 'Status tracking', 'Multi-level approvals']
    },
    {
      icon: 'lucide:bar-chart',
      title: 'Analytics & Reporting',
      description: 'Gain insights into your quotation performance with comprehensive analytics. Track conversion rates, revenue trends, and team performance.',
      benefits: ['Performance metrics', 'Revenue tracking', 'Conversion analysis', 'Custom reports']
    },
    {
      icon: 'lucide:smartphone',
      title: 'Mobile Access',
      description: 'Access your quotation system anywhere with our responsive design and mobile apps. Create, review, and approve quotations on the go.',
      benefits: ['Responsive design', 'Mobile apps', 'Offline access', 'Push notifications']
    },
    {
      icon: 'lucide:shield',
      title: 'Security & Compliance',
      description: 'Keep your data secure with enterprise-grade security features. GDPR compliant, encrypted data, and role-based access controls.',
      benefits: ['Data encryption', 'GDPR compliance', 'Role-based access', 'Audit trails']
    }
  ];

  const integrations = [
    { name: 'Salesforce', icon: 'simple-icons:salesforce', color: 'text-blue-600' },
    { name: 'HubSpot', icon: 'simple-icons:hubspot', color: 'text-orange-600' },
    { name: 'QuickBooks', icon: 'simple-icons:quickbooks', color: 'text-green-600' },
    { name: 'Slack', icon: 'simple-icons:slack', color: 'text-purple-600' },
    { name: 'Microsoft Teams', icon: 'simple-icons:microsoftteams', color: 'text-blue-500' },
    { name: 'Zapier', icon: 'simple-icons:zapier', color: 'text-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate?.('dashboard')}
              >
                <Icon icon="lucide:arrow-left" className="text-xl" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Features</h1>
                <p className="text-sm text-gray-600">Discover what makes QuoteManager powerful</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Powerful Features for Modern Businesses
          </motion.h1>
          <motion.p
            className="text-xl text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Everything you need to create, manage, and track quotations efficiently. 
            Built for teams that want to close deals faster and grow their business.
          </motion.p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon icon={feature.icon} className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center text-sm text-gray-700">
                    <Icon icon="lucide:check" className="text-green-500 mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Integrations Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your favorite tools and streamline your workflow. 
              Our extensive integration library ensures you can work with the tools you already love.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Icon icon={integration.icon} className={`text-4xl ${integration.color} mb-3`} />
                <span className="text-sm font-medium text-gray-900">{integration.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust QuoteManager to streamline their quotation process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('pricing')}
            >
              View Pricing
            </motion.button>
            <motion.button
              className="bg-transparent border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('contact')}
            >
              Contact Sales
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
