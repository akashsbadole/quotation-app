import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: 'platinum' | 'gold' | 'silver' | 'bronze';
  lifetimeValue: number;
  totalQuotations: number;
  conversionRate: number;
  lastActivity: string;
  riskScore: number;
  industry?: string;
  location?: string;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: {
    minLifetimeValue?: number;
    minConversionRate?: number;
    minQuotations?: number;
    industries?: string[];
    customRules?: string[];
  };
  customers: Customer[];
  color: string;
  icon: string;
}

interface CustomerSegmentsProps {
  onNavigate?: (section: string) => void;
}

export const CustomerSegments: React.FC<CustomerSegmentsProps> = ({ onNavigate }) => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'segments' | 'analytics'>('overview');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: 'cust-1',
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1-555-0101',
        segment: 'platinum',
        lifetimeValue: 125000,
        totalQuotations: 45,
        conversionRate: 85,
        lastActivity: '2024-12-01T10:00:00Z',
        riskScore: 95,
        industry: 'Technology',
        location: 'San Francisco, CA',
      },
      {
        id: 'cust-2',
        name: 'Tech Solutions Inc',
        email: 'info@techsolutions.com',
        phone: '+1-555-0102',
        segment: 'gold',
        lifetimeValue: 75000,
        totalQuotations: 28,
        conversionRate: 72,
        lastActivity: '2024-11-28T14:30:00Z',
        riskScore: 88,
        industry: 'Software',
        location: 'Austin, TX',
      },
      {
        id: 'cust-3',
        name: 'Global Industries',
        email: 'procurement@global.com',
        phone: '+1-555-0103',
        segment: 'silver',
        lifetimeValue: 35000,
        totalQuotations: 18,
        conversionRate: 61,
        lastActivity: '2024-11-25T09:15:00Z',
        riskScore: 75,
        industry: 'Manufacturing',
        location: 'Detroit, MI',
      },
      {
        id: 'cust-4',
        name: 'StartupCo',
        email: 'hello@startupco.com',
        phone: '+1-555-0104',
        segment: 'bronze',
        lifetimeValue: 8500,
        totalQuotations: 12,
        conversionRate: 42,
        lastActivity: '2024-11-20T16:45:00Z',
        riskScore: 65,
        industry: 'Startup',
        location: 'Seattle, WA',
      },
    ];

    const mockSegments: Segment[] = [
      {
        id: 'platinum',
        name: 'Platinum',
        description: 'High-value customers with excellent conversion rates and long-term relationships',
        criteria: {
          minLifetimeValue: 100000,
          minConversionRate: 80,
          minQuotations: 30,
        },
        customers: mockCustomers.filter(c => c.segment === 'platinum'),
        color: 'bg-purple-500',
        icon: 'lucide:crown',
      },
      {
        id: 'gold',
        name: 'Gold',
        description: 'Valuable customers with good conversion rates and consistent business',
        criteria: {
          minLifetimeValue: 50000,
          minConversionRate: 65,
          minQuotations: 20,
        },
        customers: mockCustomers.filter(c => c.segment === 'gold'),
        color: 'bg-yellow-500',
        icon: 'lucide:star',
      },
      {
        id: 'silver',
        name: 'Silver',
        description: 'Regular customers with moderate value and conversion rates',
        criteria: {
          minLifetimeValue: 20000,
          minConversionRate: 50,
          minQuotations: 10,
        },
        customers: mockCustomers.filter(c => c.segment === 'silver'),
        color: 'bg-gray-400',
        icon: 'lucide:medal',
      },
      {
        id: 'bronze',
        name: 'Bronze',
        description: 'New or low-value customers with growth potential',
        criteria: {
          minLifetimeValue: 0,
          minConversionRate: 0,
          minQuotations: 0,
        },
        customers: mockCustomers.filter(c => c.segment === 'bronze'),
        color: 'bg-orange-600',
        icon: 'lucide:award',
      },
    ];

    setSegments(mockSegments);
  }, []);

  const getTotalCustomers = () => {
    return segments.reduce((total, segment) => total + segment.customers.length, 0);
  };

  const getTotalValue = () => {
    return segments.reduce((total, segment) => 
      total + segment.customers.reduce((segmentTotal, customer) => 
        segmentTotal + customer.lifetimeValue, 0), 0);
  };

  const getAverageConversionRate = () => {
    const allCustomers = segments.flatMap(s => s.customers);
    if (allCustomers.length === 0) return 0;
    return allCustomers.reduce((total, customer) => total + customer.conversionRate, 0) / allCustomers.length;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleSegmentClick = (segment: Segment) => {
    setSelectedSegment(segment);
  };

  const handleCustomerClick = (customer: Customer) => {
    // Navigate to customer details
    console.log('Navigate to customer:', customer.id);
  };

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
                onClick={() => onNavigate?.('customers-list')}
              >
                <Icon icon="lucide:arrow-left" className="text-xl" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Segments</h1>
                <p className="text-sm text-gray-600">Organize and analyze your customer base</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon icon="lucide:refresh-cw" className="text-lg" />
                <span>Refresh Segments</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'segments', name: 'Segments' },
              { id: 'analytics', name: 'Analytics' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
              >
                {tab.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon icon="lucide:users" className="text-2xl text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Customers</p>
                      <p className="text-2xl font-bold text-gray-900">{getTotalCustomers()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Icon icon="lucide:dollar-sign" className="text-2xl text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalValue())}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Icon icon="lucide:trending-up" className="text-2xl text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Conversion</p>
                      <p className="text-2xl font-bold text-gray-900">{getAverageConversionRate().toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Icon icon="lucide:layers" className="text-2xl text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Segments</p>
                      <p className="text-2xl font-bold text-gray-900">{segments.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segment Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {segments.map((segment) => (
                  <motion.div
                    key={segment.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleSegmentClick(segment)}
                  >
                    <div className={`h-2 ${segment.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${segment.color} bg-opacity-20 rounded-lg`}>
                            <Icon icon={segment.icon} className={`text-xl ${segment.color.replace('bg-', 'text-')}`} />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                        </div>
                        <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
                          {segment.customers.length}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{segment.description}</p>
                      
                      {/* Segment Metrics */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Value:</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(segment.customers.reduce((total, c) => total + c.lifetimeValue, 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Avg Conversion:</span>
                          <span className="font-medium text-gray-900">
                            {segment.customers.length > 0 
                              ? (segment.customers.reduce((total, c) => total + c.conversionRate, 0) / segment.customers.length).toFixed(1)
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'segments' && (
            <motion.div
              key="segments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex gap-6"
            >
              {/* Segments List */}
              <div className="w-1/3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Segments</h3>
                  <div className="space-y-2">
                    {segments.map((segment) => (
                      <motion.div
                        key={segment.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                          selectedSegment?.id === segment.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedSegment(segment)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-1 ${segment.color} bg-opacity-20 rounded`}>
                              <Icon icon={segment.icon} className={`text-sm ${segment.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className="font-medium text-gray-900">{segment.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{segment.customers.length}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Segment Details */}
              <div className="w-2/3">
                {selectedSegment ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${selectedSegment.color} bg-opacity-20 rounded-lg`}>
                          <Icon icon={selectedSegment.icon} className={`text-xl ${selectedSegment.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{selectedSegment.name} Segment</h3>
                          <p className="text-sm text-gray-600">{selectedSegment.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Segment Criteria */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Segment Criteria</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedSegment.criteria.minLifetimeValue && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600">Min Lifetime Value</p>
                            <p className="font-medium text-gray-900">{formatCurrency(selectedSegment.criteria.minLifetimeValue)}</p>
                          </div>
                        )}
                        {selectedSegment.criteria.minConversionRate && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600">Min Conversion Rate</p>
                            <p className="font-medium text-gray-900">{selectedSegment.criteria.minConversionRate}%</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customers in Segment */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Customers ({selectedSegment.customers.length})
                      </h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedSegment.customers.map((customer) => (
                          <motion.div
                            key={customer.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                            whileHover={{ scale: 1.01 }}
                            onClick={() => handleCustomerClick(customer)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{customer.name}</h5>
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(customer.lifetimeValue)}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <p>Quotations: {customer.totalQuotations}</p>
                                <p>Conversion: {customer.conversionRate}%</p>
                              </div>
                              <div>
                                <p>Industry: {customer.industry}</p>
                                <p>Last Activity: {formatDate(customer.lastActivity)}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                    <Icon icon="lucide:users" className="text-6xl text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Segment</h3>
                    <p className="text-gray-600">Choose a segment from the list to view details and customers</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="text-center py-12">
                <Icon icon="lucide:bar-chart-3" className="text-6xl text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Segment Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Advanced analytics and insights for customer segments
                </p>
                <p className="text-sm text-gray-500">
                  Detailed analytics dashboard coming soon
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
