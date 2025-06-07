import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface CustomerQuotation {
  id: string;
  referenceNumber: string;
  date: string;
  expiryDate: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  total: number;
  currency: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes?: string;
  terms?: string;
}

interface CustomerPortalProps {
  onNavigate?: (section: string) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'quotations' | 'profile' | 'documents' | 'support'>('quotations');
  const [quotations, setQuotations] = useState<CustomerQuotation[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<CustomerQuotation | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1-555-0101',
    address: '123 Business St, San Francisco, CA 94105',
    accountManager: 'Sarah Johnson',
    creditLimit: 50000,
    paymentTerms: 'Net 30',
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockQuotations: CustomerQuotation[] = [
      {
        id: 'quo-1',
        referenceNumber: 'QUO-202412-0001',
        date: '2024-12-01T10:00:00Z',
        expiryDate: '2024-12-31T23:59:59Z',
        status: 'sent',
        total: 25000,
        currency: 'USD',
        items: [
          { name: 'Enterprise Software License', quantity: 1, unitPrice: 20000, total: 20000 },
          { name: 'Professional Services', quantity: 25, unitPrice: 200, total: 5000 },
        ],
        notes: 'Thank you for your interest in our enterprise solution.',
        terms: 'Payment due within 30 days of acceptance.',
      },
      {
        id: 'quo-2',
        referenceNumber: 'QUO-202411-0098',
        date: '2024-11-15T14:30:00Z',
        expiryDate: '2024-12-15T23:59:59Z',
        status: 'accepted',
        total: 15000,
        currency: 'USD',
        items: [
          { name: 'Professional Services Package', quantity: 75, unitPrice: 200, total: 15000 },
        ],
        notes: 'Consulting services for Q4 implementation.',
        terms: 'Payment due within 30 days of acceptance.',
      },
      {
        id: 'quo-3',
        referenceNumber: 'QUO-202410-0087',
        date: '2024-10-20T09:15:00Z',
        expiryDate: '2024-11-20T23:59:59Z',
        status: 'expired',
        total: 8500,
        currency: 'USD',
        items: [
          { name: 'Software Maintenance', quantity: 1, unitPrice: 8500, total: 8500 },
        ],
        notes: 'Annual maintenance contract renewal.',
        terms: 'Payment due within 30 days of acceptance.',
      },
    ];
    setQuotations(mockQuotations);
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'viewed':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return 'lucide:edit';
      case 'sent':
        return 'lucide:send';
      case 'viewed':
        return 'lucide:eye';
      case 'accepted':
        return 'lucide:check-circle';
      case 'rejected':
        return 'lucide:x-circle';
      case 'expired':
        return 'lucide:clock';
      default:
        return 'lucide:file-text';
    }
  };

  const handleAcceptQuotation = (quotationId: string) => {
    setQuotations(prev => prev.map(q => 
      q.id === quotationId ? { ...q, status: 'accepted' as const } : q
    ));
    if (selectedQuotation?.id === quotationId) {
      setSelectedQuotation(prev => prev ? { ...prev, status: 'accepted' } : null);
    }
  };

  const handleRejectQuotation = (quotationId: string) => {
    setQuotations(prev => prev.map(q => 
      q.id === quotationId ? { ...q, status: 'rejected' as const } : q
    ));
    if (selectedQuotation?.id === quotationId) {
      setSelectedQuotation(prev => prev ? { ...prev, status: 'rejected' } : null);
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {customerInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{customerInfo.name}</p>
                <p className="text-xs text-gray-500">{customerInfo.email}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon icon="lucide:building" className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'quotations', name: 'Quotations', icon: 'lucide:file-text', count: quotations.length },
              { id: 'profile', name: 'Account Profile', icon: 'lucide:user' },
              { id: 'documents', name: 'Documents', icon: 'lucide:folder' },
              { id: 'support', name: 'Support', icon: 'lucide:help-circle' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <Icon icon={tab.icon} className="text-sm" />
                <span>{tab.name}</span>
                {tab.count !== undefined && (
                  <span className="bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'quotations' && (
            <motion.div
              key="quotations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex gap-6"
            >
              {/* Quotations List */}
              <div className="w-2/3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Your Quotations</h3>
                    <p className="text-sm text-gray-600">View and manage your quotation requests</p>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {quotations.map((quotation) => (
                      <motion.div
                        key={quotation.id}
                        className={`p-6 cursor-pointer transition-colors duration-200 ${
                          selectedQuotation?.id === quotation.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedQuotation(quotation)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{quotation.referenceNumber}</h4>
                            <p className="text-sm text-gray-500">Created: {formatDate(quotation.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(quotation.total)}</p>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quotation.status)}`}>
                              <Icon icon={getStatusIcon(quotation.status)} className="mr-1 text-xs" />
                              {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{quotation.items.length} items</span>
                          <span>Expires: {formatDate(quotation.expiryDate)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quotation Details */}
              <div className="w-1/3">
                {selectedQuotation ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Quotation Details</h3>
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedQuotation.status)}`}>
                        <Icon icon={getStatusIcon(selectedQuotation.status)} className="mr-1 text-sm" />
                        {selectedQuotation.status.charAt(0).toUpperCase() + selectedQuotation.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                        <div className="space-y-2">
                          {selectedQuotation.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-gray-500">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                              </div>
                              <p className="font-medium text-gray-900">{formatCurrency(item.total)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between font-semibold text-gray-900">
                          <span>Total:</span>
                          <span>{formatCurrency(selectedQuotation.total)}</span>
                        </div>
                      </div>

                      {selectedQuotation.notes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                          <p className="text-sm text-gray-600">{selectedQuotation.notes}</p>
                        </div>
                      )}

                      {selectedQuotation.terms && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Terms</h4>
                          <p className="text-sm text-gray-600">{selectedQuotation.terms}</p>
                        </div>
                      )}

                      {selectedQuotation.status === 'sent' && (
                        <div className="flex space-x-3 pt-4">
                          <motion.button
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRejectQuotation(selectedQuotation.id)}
                          >
                            Reject
                          </motion.button>
                          <motion.button
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAcceptQuotation(selectedQuotation.id)}
                          >
                            Accept
                          </motion.button>
                        </div>
                      )}

                      <motion.button
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon icon="lucide:download" className="text-sm" />
                        <span>Download PDF</span>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <Icon icon="lucide:file-text" className="text-4xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Select a quotation to view details</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <p className="text-gray-900">{customerInfo.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{customerInfo.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{customerInfo.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Manager</label>
                  <p className="text-gray-900">{customerInfo.accountManager}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">{customerInfo.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
                  <p className="text-gray-900">{formatCurrency(customerInfo.creditLimit)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                  <p className="text-gray-900">{customerInfo.paymentTerms}</p>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === 'documents' || activeTab === 'support') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="text-center py-12">
                <Icon 
                  icon={activeTab === 'documents' ? 'lucide:folder' : 'lucide:help-circle'} 
                  className="text-6xl text-gray-400 mx-auto mb-4" 
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'documents' ? 'Document Center' : 'Support Center'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === 'documents' 
                    ? 'Access your contracts, invoices, and other important documents'
                    : 'Get help and support for your account and services'
                  }
                </p>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
