import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { firebaseNotificationService } from '../services/firebase-notification.service';

interface PendingApproval {
  id: string;
  quotationId: string;
  quotationNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  requestedBy: string;
  requestedAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  approvalLevel: number;
  approvers: string[];
  currentApprover: string;
  reason?: string;
  comments: ApprovalComment[];
  dueDate: string;
  escalationDate?: string;
}

interface ApprovalComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: string;
  action?: 'approve' | 'reject' | 'comment';
}

interface PendingApprovalsProps {
  onNavigate?: (section: string) => void;
}

export const PendingApprovals: React.FC<PendingApprovalsProps> = ({ onNavigate }) => {
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [filteredApprovals, setFilteredApprovals] = useState<PendingApproval[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'urgent'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'priority'>('date');
  const [comment, setComment] = useState('');
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);

  useEffect(() => {
    loadApprovals();
  }, []);

  useEffect(() => {
    filterAndSortApprovals();
  }, [approvals, filterStatus, sortBy]);

  const loadApprovals = () => {
    // Load from localStorage or create mock data
    const stored = localStorage.getItem('pending_approvals');
    let mockApprovals: PendingApproval[] = [];

    if (stored) {
      try {
        mockApprovals = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading approvals:', error);
      }
    }

    // Add mock data if none exists
    if (mockApprovals.length === 0) {
      mockApprovals = [
        {
          id: 'approval-001',
          quotationId: 'quo-001',
          quotationNumber: 'QUO-2024-001',
          customerName: 'Acme Corporation',
          amount: 25000,
          currency: 'USD',
          requestedBy: 'John Smith',
          requestedAt: '2024-01-16T09:00:00Z',
          priority: 'high',
          status: 'pending',
          approvalLevel: 1,
          approvers: ['manager@company.com', 'director@company.com'],
          currentApprover: 'manager@company.com',
          comments: [
            {
              id: 'comment-001',
              userId: 'user-001',
              userName: 'John Smith',
              comment: 'Customer is requesting expedited delivery. Please review urgently.',
              timestamp: '2024-01-16T09:15:00Z'
            }
          ],
          dueDate: '2024-01-18T17:00:00Z',
          escalationDate: '2024-01-17T17:00:00Z'
        },
        {
          id: 'approval-002',
          quotationId: 'quo-002',
          quotationNumber: 'QUO-2024-002',
          customerName: 'TechFlow Solutions',
          amount: 45000,
          currency: 'USD',
          requestedBy: 'Sarah Johnson',
          requestedAt: '2024-01-15T14:30:00Z',
          priority: 'urgent',
          status: 'pending',
          approvalLevel: 2,
          approvers: ['director@company.com'],
          currentApprover: 'director@company.com',
          comments: [],
          dueDate: '2024-01-17T17:00:00Z'
        },
        {
          id: 'approval-003',
          quotationId: 'quo-003',
          quotationNumber: 'QUO-2024-003',
          customerName: 'Global Industries',
          amount: 8500,
          currency: 'USD',
          requestedBy: 'Mike Wilson',
          requestedAt: '2024-01-14T11:20:00Z',
          priority: 'medium',
          status: 'pending',
          approvalLevel: 1,
          approvers: ['manager@company.com'],
          currentApprover: 'manager@company.com',
          comments: [],
          dueDate: '2024-01-19T17:00:00Z'
        }
      ];

      localStorage.setItem('pending_approvals', JSON.stringify(mockApprovals));
    }

    setApprovals(mockApprovals);
  };

  const filterAndSortApprovals = () => {
    let filtered = approvals;

    // Apply status filter
    if (filterStatus === 'pending') {
      filtered = filtered.filter(approval => approval.status === 'pending');
    } else if (filterStatus === 'urgent') {
      filtered = filtered.filter(approval => approval.priority === 'urgent' || approval.priority === 'high');
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'date':
        default:
          return new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
      }
    });

    setFilteredApprovals(filtered);
  };

  const handleApprove = async (approvalId: string, comment?: string) => {
    const approval = approvals.find(a => a.id === approvalId);
    if (!approval) return;

    // Update approval status
    const updatedApprovals = approvals.map(a =>
      a.id === approvalId
        ? {
            ...a,
            status: 'approved' as const,
            comments: comment ? [
              ...a.comments,
              {
                id: `comment-${Date.now()}`,
                userId: 'current-user',
                userName: 'Current User',
                comment,
                timestamp: new Date().toISOString(),
                action: 'approve' as const
              }
            ] : a.comments
          }
        : a
    );

    setApprovals(updatedApprovals);
    localStorage.setItem('pending_approvals', JSON.stringify(updatedApprovals));

    // Send notification
    await firebaseNotificationService.sendApprovalNotification('approved', {
      id: approvalId,
      quotationNumber: approval.quotationNumber,
      customerName: approval.customerName,
      amount: approval.amount
    });

    setShowDetailModal(false);
    setComment('');
  };

  const handleReject = async (approvalId: string, reason: string) => {
    const approval = approvals.find(a => a.id === approvalId);
    if (!approval) return;

    // Update approval status
    const updatedApprovals = approvals.map(a =>
      a.id === approvalId
        ? {
            ...a,
            status: 'rejected' as const,
            reason,
            comments: [
              ...a.comments,
              {
                id: `comment-${Date.now()}`,
                userId: 'current-user',
                userName: 'Current User',
                comment: reason,
                timestamp: new Date().toISOString(),
                action: 'reject' as const
              }
            ]
          }
        : a
    );

    setApprovals(updatedApprovals);
    localStorage.setItem('pending_approvals', JSON.stringify(updatedApprovals));

    // Send notification
    await firebaseNotificationService.sendApprovalNotification('rejected', {
      id: approvalId,
      quotationNumber: approval.quotationNumber,
      customerName: approval.customerName,
      amount: approval.amount
    });

    setShowDetailModal(false);
    setComment('');
  };

  const handleBulkApprove = async () => {
    if (selectedApprovals.length === 0) return;

    const updatedApprovals = approvals.map(a =>
      selectedApprovals.includes(a.id)
        ? { ...a, status: 'approved' as const }
        : a
    );

    setApprovals(updatedApprovals);
    localStorage.setItem('pending_approvals', JSON.stringify(updatedApprovals));

    // Send notifications
    for (const approvalId of selectedApprovals) {
      const approval = approvals.find(a => a.id === approvalId);
      if (approval) {
        await firebaseNotificationService.sendApprovalNotification('approved', {
          id: approvalId,
          quotationNumber: approval.quotationNumber,
          customerName: approval.customerName,
          amount: approval.amount
        });
      }
    }

    setSelectedApprovals([]);
    alert(`${selectedApprovals.length} approvals processed successfully!`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-600 mt-1">Review and process quotation approvals</p>
        </div>
        {selectedApprovals.length > 0 && (
          <motion.button
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBulkApprove}
          >
            <Icon icon="lucide:check-circle" className="text-lg" />
            <span>Approve Selected ({selectedApprovals.length})</span>
          </motion.button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Pending', value: approvals.filter(a => a.status === 'pending').length, icon: 'lucide:clock', color: 'blue' },
          { title: 'Urgent', value: approvals.filter(a => a.priority === 'urgent').length, icon: 'lucide:alert-triangle', color: 'red' },
          { title: 'Overdue', value: approvals.filter(a => isOverdue(a.dueDate)).length, icon: 'lucide:calendar-x', color: 'orange' },
          { title: 'This Week', value: approvals.filter(a => new Date(a.requestedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: 'lucide:calendar', color: 'green' }
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Approvals</option>
                <option value="pending">Pending Only</option>
                <option value="urgent">Urgent Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Date Requested</option>
                <option value="amount">Amount</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedApprovals.length === filteredApprovals.length && filteredApprovals.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedApprovals(filteredApprovals.map(a => a.id));
                      } else {
                        setSelectedApprovals([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApprovals.map((approval, index) => (
                <motion.tr
                  key={approval.id}
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedApprovals.includes(approval.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedApprovals([...selectedApprovals, approval.id]);
                        } else {
                          setSelectedApprovals(selectedApprovals.filter(id => id !== approval.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{approval.quotationNumber}</div>
                      <div className="text-sm text-gray-500">by {approval.requestedBy}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {approval.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(approval.amount, approval.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(approval.priority)}`}>
                      {approval.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isOverdue(approval.dueDate) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {formatDate(approval.dueDate)}
                    </div>
                    {isOverdue(approval.dueDate) && (
                      <div className="text-xs text-red-500">Overdue</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="text-blue-600 hover:text-blue-900"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedApproval(approval);
                          setShowDetailModal(true);
                        }}
                        title="View Details"
                      >
                        <Icon icon="lucide:eye" />
                      </motion.button>
                      <motion.button
                        className="text-green-600 hover:text-green-900"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleApprove(approval.id)}
                        title="Quick Approve"
                      >
                        <Icon icon="lucide:check" />
                      </motion.button>
                      <motion.button
                        className="text-red-600 hover:text-red-900"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const reason = prompt('Please provide a reason for rejection:');
                          if (reason) {
                            handleReject(approval.id, reason);
                          }
                        }}
                        title="Quick Reject"
                      >
                        <Icon icon="lucide:x" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Approval Details</h3>
                <motion.button
                  className="p-2 text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDetailModal(false)}
                >
                  <Icon icon="lucide:x" className="text-xl" />
                </motion.button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quotation Number</label>
                  <p className="text-gray-900">{selectedApproval.quotationNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-gray-900">{selectedApproval.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-gray-900">{formatCurrency(selectedApproval.amount, selectedApproval.currency)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedApproval.priority)}`}>
                    {selectedApproval.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Comments */}
              {selectedApproval.comments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                  <div className="space-y-2">
                    {selectedApproval.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{comment.userName}</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add your comment..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <motion.button
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDetailModal(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const reason = comment || 'No reason provided';
                  handleReject(selectedApproval.id, reason);
                }}
              >
                Reject
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleApprove(selectedApproval.id, comment)}
              >
                Approve
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
