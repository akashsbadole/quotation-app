import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface PendingApproval {
  id: string;
  quotationId: string;
  quotationNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  level: number;
  requestedAt: string;
  requestedBy: string;
  comments?: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ApprovalHistory {
  id: string;
  quotationNumber: string;
  clientName: string;
  amount: number;
  decision: 'approved' | 'rejected';
  comments?: string;
  decidedAt: string;
  decidedBy: string;
}

interface ApprovalWorkflowProps {
  onNavigate?: (section: string) => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ onNavigate }) => {
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'settings'>('pending');
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockPendingApprovals: PendingApproval[] = [
      {
        id: 'approval-1',
        quotationId: 'QUO-202412-0001',
        quotationNumber: 'QUO-202412-0001',
        clientName: 'Acme Corporation',
        amount: 25000,
        currency: 'USD',
        priority: 'high',
        level: 1,
        requestedAt: '2024-12-01T10:30:00Z',
        requestedBy: 'John Smith',
        comments: 'High-value quotation requiring manager approval',
        status: 'pending',
      },
      {
        id: 'approval-2',
        quotationId: 'QUO-202412-0003',
        quotationNumber: 'QUO-202412-0003',
        clientName: 'Tech Solutions Inc',
        amount: 45000,
        currency: 'USD',
        priority: 'urgent',
        level: 2,
        requestedAt: '2024-12-01T14:15:00Z',
        requestedBy: 'Sarah Johnson',
        comments: 'Urgent approval needed for enterprise client',
        status: 'pending',
      },
      {
        id: 'approval-3',
        quotationId: 'QUO-202412-0005',
        quotationNumber: 'QUO-202412-0005',
        clientName: 'Global Industries',
        amount: 12500,
        currency: 'USD',
        priority: 'medium',
        level: 1,
        requestedAt: '2024-12-02T09:00:00Z',
        requestedBy: 'Mike Davis',
        status: 'pending',
      },
    ];

    const mockApprovalHistory: ApprovalHistory[] = [
      {
        id: 'history-1',
        quotationNumber: 'QUO-202411-0098',
        clientName: 'Innovation Labs',
        amount: 18000,
        decision: 'approved',
        comments: 'Approved with standard terms',
        decidedAt: '2024-11-30T16:45:00Z',
        decidedBy: 'Manager',
      },
      {
        id: 'history-2',
        quotationNumber: 'QUO-202411-0097',
        clientName: 'StartupCo',
        amount: 35000,
        decision: 'rejected',
        comments: 'Pricing too aggressive for this client segment',
        decidedAt: '2024-11-29T11:20:00Z',
        decidedBy: 'Manager',
      },
      {
        id: 'history-3',
        quotationNumber: 'QUO-202411-0096',
        clientName: 'Enterprise Corp',
        amount: 75000,
        decision: 'approved',
        comments: 'Strategic client - approved with volume discount',
        decidedAt: '2024-11-28T14:30:00Z',
        decidedBy: 'Director',
      },
    ];

    setPendingApprovals(mockPendingApprovals);
    setApprovalHistory(mockApprovalHistory);
  }, []);

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    const icons = {
      low: 'lucide:arrow-down',
      medium: 'lucide:minus',
      high: 'lucide:arrow-up',
      urgent: 'lucide:alert-triangle',
    };
    return icons[priority as keyof typeof icons] || 'lucide:minus';
  };

  const handleApprove = async (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setShowApprovalModal(true);
  };

  const handleReject = async (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setShowApprovalModal(true);
  };

  const submitApprovalDecision = async (decision: 'approved' | 'rejected') => {
    if (!selectedApproval) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remove from pending approvals
      setPendingApprovals(prev => prev.filter(a => a.id !== selectedApproval.id));

      // Add to history
      const historyEntry: ApprovalHistory = {
        id: `history-${Date.now()}`,
        quotationNumber: selectedApproval.quotationNumber,
        clientName: selectedApproval.clientName,
        amount: selectedApproval.amount,
        decision,
        comments: approvalComments,
        decidedAt: new Date().toISOString(),
        decidedBy: 'Current User',
      };
      setApprovalHistory(prev => [historyEntry, ...prev]);

      setShowApprovalModal(false);
      setSelectedApproval(null);
      setApprovalComments('');
    } catch (error) {
      console.error('Error processing approval:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
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
                onClick={() => onNavigate?.('quotations-list')}
              >
                <Icon icon="lucide:arrow-left" className="text-xl" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Approval Workflow</h1>
                <p className="text-sm text-gray-600">Manage quotation approvals and workflow processes</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                {pendingApprovals.length} Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'pending', name: 'Pending Approvals', count: pendingApprovals.length },
              { id: 'history', name: 'Approval History', count: approvalHistory.length },
              { id: 'settings', name: 'Workflow Settings' },
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
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
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
          {activeTab === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {pendingApprovals.length > 0 ? (
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <motion.div
                      key={approval.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {approval.quotationNumber}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(approval.priority)}`}>
                            <Icon icon={getPriorityIcon(approval.priority)} className="inline mr-1 text-xs" />
                            {approval.priority.toUpperCase()}
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Level {approval.level}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {approval.currency} {approval.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getTimeAgo(approval.requestedAt)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Client</p>
                          <p className="font-medium text-gray-900">{approval.clientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Requested By</p>
                          <p className="font-medium text-gray-900">{approval.requestedBy}</p>
                        </div>
                      </div>

                      {approval.comments && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">Comments</p>
                          <p className="text-gray-900">{approval.comments}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Requested: {formatDate(approval.requestedAt)}
                        </div>
                        <div className="flex space-x-3">
                          <motion.button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReject(approval)}
                          >
                            <Icon icon="lucide:x" className="text-sm" />
                            <span>Reject</span>
                          </motion.button>
                          <motion.button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(approval)}
                          >
                            <Icon icon="lucide:check" className="text-sm" />
                            <span>Approve</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon icon="lucide:check-circle" className="text-6xl text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                  <p className="text-gray-600">All quotations are up to date!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quotation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Decision
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Comments
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {approvalHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.quotationNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.clientName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${item.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.decision === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.decision}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.decidedAt)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {item.comments || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="text-center py-12">
                <Icon icon="lucide:settings" className="text-6xl text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Workflow Settings</h3>
                <p className="text-gray-600 mb-4">
                  Configure approval rules, thresholds, and automation settings
                </p>
                <p className="text-sm text-gray-500">
                  Advanced workflow configuration coming soon
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && selectedApproval && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Approval Decision
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Quotation: {selectedApproval.quotationNumber}</p>
                <p className="text-sm text-gray-600">Client: {selectedApproval.clientName}</p>
                <p className="text-sm text-gray-600">
                  Amount: {selectedApproval.currency} {selectedApproval.amount.toLocaleString()}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add your comments..."
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                />
              </div>
              <div className="flex space-x-3">
                <motion.button
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowApprovalModal(false)}
                  disabled={loading}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => submitApprovalDecision('rejected')}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Reject'}
                </motion.button>
                <motion.button
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => submitApprovalDecision('approved')}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Approve'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
