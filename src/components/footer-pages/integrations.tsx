import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SEO } from '../seo';

interface IntegrationsProps {
  onNavigate?: (section: string) => void;
}

export const Integrations: React.FC<IntegrationsProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Integrations', count: 24 },
    { id: 'crm', name: 'CRM Systems', count: 6 },
    { id: 'accounting', name: 'Accounting', count: 5 },
    { id: 'communication', name: 'Communication', count: 4 },
    { id: 'storage', name: 'Cloud Storage', count: 3 },
    { id: 'payment', name: 'Payment Processing', count: 4 },
    { id: 'productivity', name: 'Productivity', count: 2 }
  ];

  const integrations = [
    {
      id: 1,
      name: 'Salesforce',
      category: 'crm',
      description: 'Sync customers and quotations with your Salesforce CRM automatically.',
      logo: '🔵',
      status: 'active',
      popularity: 'high',
      features: ['Two-way sync', 'Real-time updates', 'Custom field mapping'],
      setupTime: '5 minutes'
    },
    {
      id: 2,
      name: 'QuickBooks',
      category: 'accounting',
      description: 'Export quotations directly to QuickBooks for seamless accounting workflows.',
      logo: '💚',
      status: 'active',
      popularity: 'high',
      features: ['Invoice creation', 'Customer sync', 'Tax calculations'],
      setupTime: '10 minutes'
    },
    {
      id: 3,
      name: 'HubSpot',
      category: 'crm',
      description: 'Connect with HubSpot to manage leads and track quotation performance.',
      logo: '🟠',
      status: 'active',
      popularity: 'high',
      features: ['Lead tracking', 'Deal pipeline', 'Contact management'],
      setupTime: '5 minutes'
    },
    {
      id: 4,
      name: 'Slack',
      category: 'communication',
      description: 'Get notifications in Slack when quotations are created, approved, or updated.',
      logo: '💬',
      status: 'active',
      popularity: 'medium',
      features: ['Real-time notifications', 'Custom channels', 'Team collaboration'],
      setupTime: '3 minutes'
    },
    {
      id: 5,
      name: 'Google Drive',
      category: 'storage',
      description: 'Automatically save quotation PDFs to your Google Drive folders.',
      logo: '📁',
      status: 'active',
      popularity: 'medium',
      features: ['Auto-save PDFs', 'Folder organization', 'Version control'],
      setupTime: '2 minutes'
    },
    {
      id: 6,
      name: 'Stripe',
      category: 'payment',
      description: 'Accept payments directly from quotations with Stripe integration.',
      logo: '💳',
      status: 'active',
      popularity: 'high',
      features: ['Online payments', 'Subscription billing', 'Payment tracking'],
      setupTime: '15 minutes'
    },
    {
      id: 7,
      name: 'Xero',
      category: 'accounting',
      description: 'Sync quotations and customer data with Xero accounting software.',
      logo: '🔷',
      status: 'active',
      popularity: 'medium',
      features: ['Invoice sync', 'Customer management', 'Financial reporting'],
      setupTime: '10 minutes'
    },
    {
      id: 8,
      name: 'Microsoft Teams',
      category: 'communication',
      description: 'Collaborate on quotations and get updates in Microsoft Teams.',
      logo: '🟣',
      status: 'active',
      popularity: 'medium',
      features: ['Team notifications', 'File sharing', 'Meeting integration'],
      setupTime: '5 minutes'
    },
    {
      id: 9,
      name: 'Zapier',
      category: 'productivity',
      description: 'Connect QuoteManager with 5000+ apps through Zapier automation.',
      logo: '⚡',
      status: 'active',
      popularity: 'high',
      features: ['Workflow automation', '5000+ app connections', 'Custom triggers'],
      setupTime: '10 minutes'
    },
    {
      id: 10,
      name: 'Pipedrive',
      category: 'crm',
      description: 'Sync deals and contacts between QuoteManager and Pipedrive.',
      logo: '🟢',
      status: 'active',
      popularity: 'medium',
      features: ['Deal tracking', 'Contact sync', 'Sales pipeline'],
      setupTime: '8 minutes'
    },
    {
      id: 11,
      name: 'DocuSign',
      category: 'productivity',
      description: 'Send quotations for electronic signature through DocuSign.',
      logo: '📝',
      status: 'beta',
      popularity: 'medium',
      features: ['E-signatures', 'Document tracking', 'Legal compliance'],
      setupTime: '12 minutes'
    },
    {
      id: 12,
      name: 'PayPal',
      category: 'payment',
      description: 'Accept PayPal payments directly from your quotations.',
      logo: '💙',
      status: 'active',
      popularity: 'high',
      features: ['PayPal payments', 'Buyer protection', 'Global reach'],
      setupTime: '8 minutes'
    }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const categoryMatch = selectedCategory === 'all' || integration.category === selectedCategory;
    const searchMatch = searchQuery === '' || 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'coming-soon': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPopularityIcon = (popularity: string) => {
    switch (popularity) {
      case 'high': return 'lucide:trending-up';
      case 'medium': return 'lucide:minus';
      case 'low': return 'lucide:trending-down';
      default: return 'lucide:minus';
    }
  };

  const seoConfig = {
    title: "Integrations - QuoteManager",
    description: "Connect QuoteManager with your favorite business tools. Integrate with CRM systems, accounting software, communication tools, and more.",
    keywords: "integrations, CRM integration, accounting software, business tools, API connections, workflow automation",
    url: "/integrations"
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
              Integrations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect QuoteManager with your favorite business tools to streamline your workflow 
              and boost productivity. Set up integrations in minutes, not hours.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Icon 
                icon="lucide:search" 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { number: '24+', label: 'Integrations', icon: 'lucide:link' },
              { number: '5000+', label: 'Via Zapier', icon: 'lucide:zap' },
              { number: '< 10min', label: 'Setup Time', icon: 'lucide:clock' },
              { number: '99.9%', label: 'Uptime', icon: 'lucide:shield-check' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon icon={stat.icon} className="text-blue-600 text-xl" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
                  <div className="space-y-3">
                    <motion.button
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate?.('api-documentation')}
                    >
                      View API Docs
                    </motion.button>
                    <motion.button
                      className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate?.('contact')}
                    >
                      Request Integration
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                className="mb-6 flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' 
                    ? 'All Integrations' 
                    : categories.find(c => c.id === selectedCategory)?.name
                  }
                </h2>
                <span className="text-gray-600">
                  {filteredIntegrations.length} integration{filteredIntegrations.length !== 1 ? 's' : ''}
                </span>
              </motion.div>

              {/* Integrations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredIntegrations.map((integration, index) => (
                  <motion.div
                    key={integration.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{integration.logo}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {integration.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(integration.status)}`}>
                              {integration.status === 'active' ? 'Available' : 
                               integration.status === 'beta' ? 'Beta' : 'Coming Soon'}
                            </span>
                            <Icon 
                              icon={getPopularityIcon(integration.popularity)} 
                              className={`text-sm ${
                                integration.popularity === 'high' ? 'text-green-500' :
                                integration.popularity === 'medium' ? 'text-yellow-500' :
                                'text-gray-400'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm">
                      {integration.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Key Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Icon icon="lucide:clock" className="mr-1" />
                        {integration.setupTime} setup
                      </div>
                      <motion.button
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                          integration.status === 'active'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : integration.status === 'beta'
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        whileHover={integration.status !== 'coming-soon' ? { scale: 1.05 } : {}}
                        whileTap={integration.status !== 'coming-soon' ? { scale: 0.95 } : {}}
                        disabled={integration.status === 'coming-soon'}
                        onClick={() => {
                          if (integration.status !== 'coming-soon') {
                            alert(`Setting up ${integration.name} integration...`);
                          }
                        }}
                      >
                        {integration.status === 'active' ? 'Connect' :
                         integration.status === 'beta' ? 'Try Beta' : 'Coming Soon'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredIntegrations.length === 0 && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon icon="lucide:search" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or browse different categories.
                  </p>
                  <motion.button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Filters
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Custom Integration CTA */}
          <motion.div
            className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Need a Custom Integration?</h2>
            <p className="text-xl mb-8 opacity-90">
              Don't see the integration you need? Our team can build custom integrations 
              for enterprise customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('contact')}
              >
                Contact Sales
              </motion.button>
              <motion.button
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('api-documentation')}
              >
                View API Docs
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
