import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface SettingsSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'general' | 'users' | 'security' | 'integrations';
  status: 'configured' | 'needs-attention' | 'not-configured';
}

interface SettingsDashboardProps {
  onNavigate?: (section: string) => void;
}

export const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'users' | 'security' | 'integrations'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const settingsSections: SettingsSection[] = [
    {
      id: 'company-info',
      name: 'Company Information',
      description: 'Configure company details, branding, and contact information',
      icon: 'lucide:building',
      category: 'general',
      status: 'configured',
    },
    {
      id: 'quotation-settings',
      name: 'Quotation Settings',
      description: 'Default quotation settings, numbering, and templates',
      icon: 'lucide:file-text',
      category: 'general',
      status: 'configured',
    },
    {
      id: 'currency-tax',
      name: 'Currency & Tax',
      description: 'Manage currencies, exchange rates, and tax configurations',
      icon: 'lucide:dollar-sign',
      category: 'general',
      status: 'needs-attention',
    },
    {
      id: 'email-templates',
      name: 'Email Templates',
      description: 'Customize email templates for quotations and communications',
      icon: 'lucide:mail',
      category: 'general',
      status: 'configured',
    },
    {
      id: 'user-management',
      name: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      icon: 'lucide:users',
      category: 'users',
      status: 'configured',
    },
    {
      id: 'roles-permissions',
      name: 'Roles & Permissions',
      description: 'Configure user roles and access permissions',
      icon: 'lucide:shield',
      category: 'users',
      status: 'configured',
    },
    {
      id: 'team-settings',
      name: 'Team Settings',
      description: 'Organize teams and departments',
      icon: 'lucide:users-2',
      category: 'users',
      status: 'not-configured',
    },
    {
      id: 'security-policies',
      name: 'Security Policies',
      description: 'Configure password policies and security settings',
      icon: 'lucide:lock',
      category: 'security',
      status: 'needs-attention',
    },
    {
      id: 'audit-logs',
      name: 'Audit Logs',
      description: 'View and manage system audit logs',
      icon: 'lucide:file-search',
      category: 'security',
      status: 'configured',
    },
    {
      id: 'backup-recovery',
      name: 'Backup & Recovery',
      description: 'Configure data backup and recovery settings',
      icon: 'lucide:hard-drive',
      category: 'security',
      status: 'not-configured',
    },
    {
      id: 'api-settings',
      name: 'API Settings',
      description: 'Manage API keys and webhook configurations',
      icon: 'lucide:code',
      category: 'integrations',
      status: 'configured',
    },
    {
      id: 'crm-integration',
      name: 'CRM Integration',
      description: 'Connect with Salesforce, HubSpot, and other CRM systems',
      icon: 'lucide:database',
      category: 'integrations',
      status: 'not-configured',
    },
    {
      id: 'accounting-integration',
      name: 'Accounting Integration',
      description: 'Integrate with QuickBooks, Xero, and accounting systems',
      icon: 'lucide:calculator',
      category: 'integrations',
      status: 'not-configured',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Settings', icon: 'lucide:settings' },
    { id: 'general', name: 'General', icon: 'lucide:sliders' },
    { id: 'users', name: 'Users & Teams', icon: 'lucide:users' },
    { id: 'security', name: 'Security', icon: 'lucide:shield' },
    { id: 'integrations', name: 'Integrations', icon: 'lucide:plug' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'configured':
        return 'bg-green-100 text-green-800';
      case 'needs-attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-configured':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'configured':
        return 'lucide:check-circle';
      case 'needs-attention':
        return 'lucide:alert-circle';
      case 'not-configured':
        return 'lucide:circle';
      default:
        return 'lucide:circle';
    }
  };

  const filteredSections = settingsSections.filter(section => {
    if (activeCategory !== 'all' && section.category !== activeCategory) return false;
    if (searchQuery && !section.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !section.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusCounts = () => {
    return {
      configured: settingsSections.filter(s => s.status === 'configured').length,
      needsAttention: settingsSections.filter(s => s.status === 'needs-attention').length,
      notConfigured: settingsSections.filter(s => s.status === 'not-configured').length,
    };
  };

  const statusCounts = getStatusCounts();

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
                <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                <p className="text-sm text-gray-600">Configure and manage your quotation system</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon icon="lucide:save" className="text-lg" />
                <span>Save All</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icon icon="lucide:check-circle" className="text-2xl text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Configured</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.configured}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Icon icon="lucide:alert-circle" className="text-2xl text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.needsAttention}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Icon icon="lucide:circle" className="text-2xl text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Not Configured</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.notConfigured}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search settings..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Icon 
                icon="lucide:search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
            </div>

            {/* Category Filters */}
            <div className="flex space-x-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    activeCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id as any)}
                >
                  <Icon icon={category.icon} className="text-sm" />
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSections.map((section) => (
              <motion.div
                key={section.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
                onClick={() => console.log('Navigate to:', section.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon icon={section.icon} className="text-2xl text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{section.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(section.status)}`}>
                      <Icon icon={getStatusIcon(section.status)} className="mr-1 text-xs" />
                      {section.status === 'configured' ? 'Ready' : 
                       section.status === 'needs-attention' ? 'Review' : 'Setup'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{section.description}</p>

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    section.category === 'general' ? 'bg-blue-100 text-blue-800' :
                    section.category === 'users' ? 'bg-green-100 text-green-800' :
                    section.category === 'security' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {section.category}
                  </span>
                  <motion.button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Configure</span>
                    <Icon icon="lucide:arrow-right" className="text-xs" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredSections.length === 0 && (
          <div className="text-center py-12">
            <Icon icon="lucide:search" className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No settings found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.button
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon icon="lucide:download" className="text-2xl text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">Export Settings</h4>
              <p className="text-sm text-gray-600">Download configuration backup</p>
            </motion.button>
            <motion.button
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon icon="lucide:upload" className="text-2xl text-green-600 mb-2" />
              <h4 className="font-medium text-gray-900">Import Settings</h4>
              <p className="text-sm text-gray-600">Restore from backup file</p>
            </motion.button>
            <motion.button
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon icon="lucide:refresh-cw" className="text-2xl text-purple-600 mb-2" />
              <h4 className="font-medium text-gray-900">Reset to Defaults</h4>
              <p className="text-sm text-gray-600">Restore default settings</p>
            </motion.button>
            <motion.button
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon icon="lucide:help-circle" className="text-2xl text-orange-600 mb-2" />
              <h4 className="font-medium text-gray-900">Help & Support</h4>
              <p className="text-sm text-gray-600">Get configuration help</p>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
