import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { firebaseNotificationService } from '../services/firebase-notification.service';

interface Quotation {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  total: number;
  currency: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  items: any[];
}

interface QuotationsListProps {
  onNavigate?: (section: string, data?: any) => void;
}

export const QuotationsList: React.FC<QuotationsListProps> = ({ onNavigate }) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    loadQuotations();
  }, []);

  useEffect(() => {
    filterQuotations();
  }, [quotations, searchQuery, statusFilter]);

  const loadQuotations = () => {
    // Load from localStorage (both drafts and sent quotations)
    const allQuotations: Quotation[] = [];
    
    // Load drafts
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('quotation_draft_') || key?.startsWith('quotation_sent_')) {
        try {
          const quotation = JSON.parse(localStorage.getItem(key) || '');
          allQuotations.push(quotation);
        } catch (error) {
          console.error('Error parsing quotation:', error);
        }
      }
    }

    // Add some mock quotations if none exist
    if (allQuotations.length === 0) {
      const mockQuotations: Quotation[] = [
        {
          id: 'quo-001',
          referenceNumber: 'QUO-2024-001',
          customerName: 'Acme Corporation',
          customerEmail: 'contact@acme.com',
          status: 'sent',
          total: 25000,
          currency: 'USD',
          validUntil: '2024-02-15',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          items: [
            { name: 'Enterprise Software License', quantity: 1, unitPrice: 25000 }
          ]
        },
        {
          id: 'quo-002',
          referenceNumber: 'QUO-2024-002',
          customerName: 'TechFlow Solutions',
          customerEmail: 'info@techflow.com',
          status: 'approved',
          total: 45000,
          currency: 'USD',
          validUntil: '2024-02-20',
          createdAt: '2024-01-14T09:15:00Z',
          updatedAt: '2024-01-16T14:30:00Z',
          items: [
            { name: 'Consulting Services', quantity: 100, unitPrice: 450 }
          ]
        },
        {
          id: 'quo-003',
          referenceNumber: 'QUO-2024-003',
          customerName: 'Global Industries',
          customerEmail: 'procurement@global.com',
          status: 'draft',
          total: 8500,
          currency: 'USD',
          validUntil: '2024-02-10',
          createdAt: '2024-01-13T11:20:00Z',
          updatedAt: '2024-01-13T11:20:00Z',
          items: [
            { name: 'Hardware Package', quantity: 5, unitPrice: 1700 }
          ]
        }
      ];
      
      allQuotations.push(...mockQuotations);
      
      // Save mock quotations to localStorage
      mockQuotations.forEach(quotation => {
        localStorage.setItem(`quotation_${quotation.status}_${quotation.referenceNumber}`, JSON.stringify(quotation));
      });
    }

    setQuotations(allQuotations);
  };

  const filterQuotations = () => {
    let filtered = quotations;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(quotation =>
        quotation.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quotation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quotation.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quotation => quotation.status === statusFilter);
    }

    setFilteredQuotations(filtered);
  };

  const handleViewQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setShowViewModal(true);
  };

  const handleEditQuotation = (quotation: Quotation) => {
    // Navigate to edit page with quotation data
    onNavigate?.('quotations-create', quotation);
  };

  const handleDuplicateQuotation = async (quotation: Quotation) => {
    const duplicatedQuotation = {
      ...quotation,
      id: `quo-${Date.now()}`,
      referenceNumber: `QUO-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem(`quotation_draft_${duplicatedQuotation.referenceNumber}`, JSON.stringify(duplicatedQuotation));
    
    // Send notification
    await firebaseNotificationService.sendInAppNotification({
      title: 'Quotation Duplicated',
      message: `Quotation ${duplicatedQuotation.referenceNumber} created from ${quotation.referenceNumber}`,
      type: 'success',
      priority: 'medium',
      data: duplicatedQuotation,
      actionUrl: '/quotations/edit',
      actionText: 'Edit Quotation'
    });

    // Reload quotations
    loadQuotations();
    alert(`Quotation duplicated as ${duplicatedQuotation.referenceNumber}`);
  };

  const handleDeleteQuotation = (quotation: Quotation) => {
    if (window.confirm(`Are you sure you want to delete quotation ${quotation.referenceNumber}?`)) {
      // Remove from localStorage
      const keys = [`quotation_draft_${quotation.referenceNumber}`, `quotation_sent_${quotation.referenceNumber}`];
      keys.forEach(key => localStorage.removeItem(key));
      
      // Reload quotations
      loadQuotations();
      alert('Quotation deleted successfully');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return 'lucide:file-edit';
      case 'sent': return 'lucide:send';
      case 'approved': return 'lucide:check-circle';
      case 'rejected': return 'lucide:x-circle';
      case 'expired': return 'lucide:calendar-x';
      default: return 'lucide:file';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotations</h1>
          <p className="text-gray-600 mt-1">Manage and track all your quotations</p>
        </div>
        <motion.button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate?.('quotations-create')}
        >
          <Icon icon="lucide:plus" className="text-lg" />
          <span>New Quotation</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Quotations', value: quotations.length, icon: 'lucide:file-text', color: 'blue' },
          { title: 'Sent', value: quotations.filter(q => q.status === 'sent').length, icon: 'lucide:send', color: 'green' },
          { title: 'Approved', value: quotations.filter(q => q.status === 'approved').length, icon: 'lucide:check-circle', color: 'purple' },
          { title: 'Drafts', value: quotations.filter(q => q.status === 'draft').length, icon: 'lucide:file-edit', color: 'orange' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <Icon icon={stat.icon} className={`text-${stat.color}-600 text-xl`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search quotations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Icon icon="lucide:search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="flex items-end">
            <motion.button
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotations.map((quotation, index) => (
                <motion.tr
                  key={quotation.id}
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quotation.referenceNumber}</div>
                      <div className="text-sm text-gray-500">{formatDate(quotation.createdAt)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{quotation.customerName}</div>
                      <div className="text-sm text-gray-500">{quotation.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(quotation.total, quotation.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                      <Icon icon={getStatusIcon(quotation.status)} className="mr-1" />
                      {quotation.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(quotation.validUntil)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="text-blue-600 hover:text-blue-900"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewQuotation(quotation)}
                        title="View"
                      >
                        <Icon icon="lucide:eye" />
                      </motion.button>
                      <motion.button
                        className="text-green-600 hover:text-green-900"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditQuotation(quotation)}
                        title="Edit"
                      >
                        <Icon icon="lucide:edit" />
                      </motion.button>
                      <motion.button
                        className="text-purple-600 hover:text-purple-900"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDuplicateQuotation(quotation)}
                        title="Duplicate"
                      >
                        <Icon icon="lucide:copy" />
                      </motion.button>
                      <motion.button
                        className="text-red-600 hover:text-red-900"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteQuotation(quotation)}
                        title="Delete"
                      >
                        <Icon icon="lucide:trash-2" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredQuotations.length === 0 && (
        <div className="text-center py-12">
          <Icon icon="lucide:file-search" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quotations found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or create a new quotation.</p>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Quotation Details</h3>
                <motion.button
                  className="p-2 text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowViewModal(false)}
                >
                  <Icon icon="lucide:x" className="text-xl" />
                </motion.button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reference Number</label>
                  <p className="text-gray-900">{selectedQuotation.referenceNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedQuotation.status)}`}>
                    <Icon icon={getStatusIcon(selectedQuotation.status)} className="mr-1" />
                    {selectedQuotation.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-gray-900">{selectedQuotation.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedQuotation.customerEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <p className="text-gray-900">{formatCurrency(selectedQuotation.total, selectedQuotation.currency)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                  <p className="text-gray-900">{formatDate(selectedQuotation.validUntil)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  {selectedQuotation.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <span className="text-gray-700">{item.name} (x{item.quantity})</span>
                      <span className="font-medium">{formatCurrency(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
