import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface QuotationData {
  id: string;
  referenceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  expiryDate: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  total: number;
  currency: string;
  version: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  approvalRequired: boolean;
  items: QuotationItem[];
  activities: Activity[];
  communications: Communication[];
}

interface QuotationItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  total: number;
}

interface Activity {
  id: string;
  action: string;
  description: string;
  userId?: string;
  createdAt: string;
}

interface Communication {
  id: string;
  type: 'email' | 'sms' | 'call' | 'meeting' | 'note';
  subject?: string;
  content: string;
  direction: 'inbound' | 'outbound';
  status: string;
  createdAt: string;
}

interface AdvancedQuotationManagerProps {
  onClose?: () => void;
}

export const AdvancedQuotationManager: React.FC<AdvancedQuotationManagerProps> = ({ onClose }) => {
  const [quotations, setQuotations] = useState<QuotationData[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationData | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'details' | 'analytics'>('list');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dateRange: '',
    search: '',
  });
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockQuotations: QuotationData[] = [
      {
        id: 'QUO-202412-0001',
        referenceNumber: 'QUO-202412-0001',
        clientId: 'client-1',
        clientName: 'Acme Corporation',
        date: '2024-12-01',
        expiryDate: '2024-12-31',
        status: 'PENDING_APPROVAL',
        total: 25000,
        currency: 'USD',
        version: 1,
        priority: 'high',
        approvalRequired: true,
        items: [
          {
            id: 'item-1',
            productId: 'prod-1',
            name: 'Enterprise Software License',
            description: 'Annual license for 100 users',
            quantity: 1,
            unitPrice: 20000,
            tax: 2000,
            discount: 0,
            total: 22000,
          },
          {
            id: 'item-2',
            productId: 'prod-2',
            name: 'Implementation Services',
            description: 'Professional setup and configuration',
            quantity: 20,
            unitPrice: 150,
            tax: 300,
            discount: 300,
            total: 3000,
          },
        ],
        activities: [
          {
            id: 'act-1',
            action: 'created',
            description: 'Quotation created',
            userId: 'user-1',
            createdAt: '2024-12-01T10:00:00Z',
          },
          {
            id: 'act-2',
            action: 'approval_requested',
            description: 'Approval requested from manager',
            userId: 'user-1',
            createdAt: '2024-12-01T10:30:00Z',
          },
        ],
        communications: [
          {
            id: 'comm-1',
            type: 'email',
            subject: 'Quotation QUO-202412-0001',
            content: 'Please find attached your quotation for enterprise software.',
            direction: 'outbound',
            status: 'sent',
            createdAt: '2024-12-01T11:00:00Z',
          },
        ],
      },
      {
        id: 'QUO-202412-0002',
        referenceNumber: 'QUO-202412-0002',
        clientId: 'client-2',
        clientName: 'Tech Solutions Inc',
        date: '2024-12-02',
        expiryDate: '2025-01-02',
        status: 'SENT',
        total: 15000,
        currency: 'USD',
        version: 2,
        priority: 'medium',
        approvalRequired: false,
        items: [],
        activities: [],
        communications: [],
      },
    ];
    setQuotations(mockQuotations);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      SENT: 'bg-blue-100 text-blue-800',
      VIEWED: 'bg-purple-100 text-purple-800',
      ACCEPTED: 'bg-emerald-100 text-emerald-800',
      REJECTED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const handleApprove = async (quotationId: string) => {
    setLoading(true);
    try {
      // API call to approve quotation
      console.log('Approving quotation:', quotationId);
      // Update local state
      setQuotations(prev => prev.map(q => 
        q.id === quotationId ? { ...q, status: 'APPROVED' as const } : q
      ));
    } catch (error) {
      console.error('Error approving quotation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (quotationId: string, reason: string) => {
    setLoading(true);
    try {
      // API call to reject quotation
      console.log('Rejecting quotation:', quotationId, 'Reason:', reason);
      // Update local state
      setQuotations(prev => prev.map(q => 
        q.id === quotationId ? { ...q, status: 'REJECTED' as const } : q
      ));
    } catch (error) {
      console.error('Error rejecting quotation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (quotationId: string) => {
    setLoading(true);
    try {
      // API call to send quotation
      console.log('Sending quotation:', quotationId);
      // Update local state
      setQuotations(prev => prev.map(q => 
        q.id === quotationId ? { ...q, status: 'SENT' as const } : q
      ));
    } catch (error) {
      console.error('Error sending quotation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (quotationId: string) => {
    setLoading(true);
    try {
      // API call to duplicate quotation
      console.log('Duplicating quotation:', quotationId);
      // This would create a new quotation based on the existing one
    } catch (error) {
      console.error('Error duplicating quotation:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotations = quotations.filter(quotation => {
    if (filters.status && quotation.status !== filters.status) return false;
    if (filters.priority && quotation.priority !== filters.priority) return false;
    if (filters.search && !quotation.referenceNumber.toLowerCase().includes(filters.search.toLowerCase()) &&
        !quotation.clientName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-full max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Advanced Quotation Manager</h2>
              <p className="text-blue-100 mt-1">Comprehensive quotation management with workflows and analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon icon="lucide:plus" className="text-lg" />
                <span>New Quotation</span>
              </motion.button>
              <motion.button
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                <Icon icon="lucide:x" className="text-xl" />
              </motion.button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6">
            {[
              { id: 'list', name: 'Quotations', icon: 'lucide:list' },
              { id: 'details', name: 'Details', icon: 'lucide:file-text' },
              { id: 'analytics', name: 'Analytics', icon: 'lucide:bar-chart-3' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600'
                    : 'text-blue-100 hover:bg-white hover:bg-opacity-20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <Icon icon={tab.icon} className="text-lg" />
                <span>{tab.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'list' && (
              <motion.div
                key="list"
                className="h-full flex"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Quotations List */}
                <div className="w-2/3 border-r border-gray-200 overflow-y-auto">
                  {/* Filters */}
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                          type="text"
                          placeholder="Search quotations..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={filters.search}
                          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={filters.status}
                          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        >
                          <option value="">All Statuses</option>
                          <option value="DRAFT">Draft</option>
                          <option value="PENDING_APPROVAL">Pending Approval</option>
                          <option value="APPROVED">Approved</option>
                          <option value="SENT">Sent</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={filters.priority}
                          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                        >
                          <option value="">All Priorities</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={filters.dateRange}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                        >
                          <option value="">All Dates</option>
                          <option value="today">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                          <option value="quarter">This Quarter</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quotations List */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {filteredQuotations.map((quotation) => (
                        <motion.div
                          key={quotation.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            selectedQuotation?.id === quotation.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedQuotation(quotation)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-900">{quotation.referenceNumber}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                                {quotation.status.replace('_', ' ')}
                              </span>
                              <Icon 
                                icon="lucide:flag" 
                                className={`text-sm ${getPriorityColor(quotation.priority)}`}
                                title={`Priority: ${quotation.priority}`}
                              />
                              {quotation.version > 1 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  v{quotation.version}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                {quotation.currency} {quotation.total.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(quotation.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">{quotation.clientName}</p>
                              <p className="text-xs text-gray-500">
                                Expires: {new Date(quotation.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {quotation.status === 'PENDING_APPROVAL' && (
                                <>
                                  <motion.button
                                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApprove(quotation.id);
                                    }}
                                  >
                                    Approve
                                  </motion.button>
                                  <motion.button
                                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReject(quotation.id, 'Rejected by user');
                                    }}
                                  >
                                    Reject
                                  </motion.button>
                                </>
                              )}
                              {quotation.status === 'APPROVED' && (
                                <motion.button
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors duration-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSend(quotation.id);
                                  }}
                                >
                                  Send
                                </motion.button>
                              )}
                              <motion.button
                                className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicate(quotation.id);
                                }}
                              >
                                Duplicate
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quotation Details Panel */}
                <div className="w-1/3 overflow-y-auto">
                  {selectedQuotation ? (
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {selectedQuotation.referenceNumber}
                      </h3>
                      
                      {/* Quick Actions */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <motion.button
                            className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon icon="lucide:edit" className="inline mr-1" />
                            Edit
                          </motion.button>
                          <motion.button
                            className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon icon="lucide:send" className="inline mr-1" />
                            Send
                          </motion.button>
                          <motion.button
                            className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon icon="lucide:copy" className="inline mr-1" />
                            Version
                          </motion.button>
                          <motion.button
                            className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon icon="lucide:download" className="inline mr-1" />
                            PDF
                          </motion.button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Items ({selectedQuotation.items.length})</h4>
                        <div className="space-y-2">
                          {selectedQuotation.items.map((item) => (
                            <div key={item.id} className="border border-gray-200 rounded p-3">
                              <div className="flex justify-between items-start mb-1">
                                <h5 className="font-medium text-gray-900 text-sm">{item.name}</h5>
                                <span className="font-semibold text-gray-900 text-sm">
                                  ${item.total.toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Qty: {item.quantity}</span>
                                <span>Unit: ${item.unitPrice}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Activities */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activities</h4>
                        <div className="space-y-2">
                          {selectedQuotation.activities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">{activity.description}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(activity.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Communications */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Communications</h4>
                        <div className="space-y-2">
                          {selectedQuotation.communications.map((comm) => (
                            <div key={comm.id} className="border border-gray-200 rounded p-3">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  <Icon 
                                    icon={comm.type === 'email' ? 'lucide:mail' : 'lucide:phone'} 
                                    className="text-sm text-gray-500" 
                                  />
                                  <span className="text-sm font-medium text-gray-900">
                                    {comm.subject || comm.type}
                                  </span>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  comm.direction === 'outbound' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {comm.direction}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{comm.content}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(comm.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <Icon icon="lucide:file-text" className="text-4xl mx-auto mb-2" />
                      <p>Select a quotation to view details</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'details' && (
              <motion.div
                key="details"
                className="p-6 h-full overflow-y-auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center text-gray-500">
                  <Icon icon="lucide:file-text" className="text-6xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Detailed View</h3>
                  <p>Comprehensive quotation details, version history, and document management will be displayed here.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                className="p-6 h-full overflow-y-auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center text-gray-500">
                  <Icon icon="lucide:bar-chart-3" className="text-6xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                  <p>Conversion rates, performance metrics, revenue analytics, and business insights will be displayed here.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
