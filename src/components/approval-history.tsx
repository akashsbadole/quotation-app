import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface ApprovalRecord {
  id: string;
  quotationId: string;
  quotationNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'approved' | 'rejected' | 'pending' | 'expired';
  level: number;
  comments?: string;
  processingTime?: number; // in hours
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface ApprovalHistoryProps {
  onNavigate?: (section: string) => void;
}

export const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({ onNavigate }) => {
  const [records, setRecords] = useState<ApprovalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ApprovalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [selectedRecord, setSelectedRecord] = useState<ApprovalRecord | null>(null);

  useEffect(() => {
    // Mock approval history data
    const mockRecords: ApprovalRecord[] = [
      {
        id: 'approval-hist-001',
        quotationId: 'quo-001',
        quotationNumber: 'QUO-2024-001',
        clientName: 'Acme Corporation',
        amount: 25000,
        currency: 'USD',
        requestedBy: 'John Smith',
        requestedAt: '2024-01-15T10:30:00Z',
        approvedBy: 'Sarah Johnson',
        approvedAt: '2024-01-15T14:45:00Z',
        status: 'approved',
        level: 1,
        comments: 'Approved after reviewing client history and project scope.',
        processingTime: 4.25,
        priority: 'high'
      },
      {
        id: 'approval-hist-002',
        quotationId: 'quo-002',
        quotationNumber: 'QUO-2024-002',
        clientName: 'TechFlow Solutions',
        amount: 45000,
        currency: 'USD',
        requestedBy: 'Mike Rodriguez',
        requestedAt: '2024-01-14T09:15:00Z',
        approvedBy: 'David Chen',
        approvedAt: '2024-01-14T16:30:00Z',
        status: 'approved',
        level: 2,
        comments: 'High-value quotation approved with standard terms.',
        processingTime: 7.25,
        priority: 'urgent'
      },
      {
        id: 'approval-hist-003',
        quotationId: 'quo-003',
        quotationNumber: 'QUO-2024-003',
        clientName: 'Global Industries',
        amount: 8500,
        currency: 'USD',
        requestedBy: 'Lisa Park',
        requestedAt: '2024-01-13T11:20:00Z',
        approvedBy: 'Sarah Johnson',
        approvedAt: '2024-01-13T13:45:00Z',
        status: 'rejected',
        level: 1,
        comments: 'Rejected due to pricing concerns and competitive analysis.',
        processingTime: 2.42,
        priority: 'medium'
      },
      {
        id: 'approval-hist-004',
        quotationId: 'quo-004',
        quotationNumber: 'QUO-2024-004',
        clientName: 'StartupXYZ',
        amount: 12000,
        currency: 'USD',
        requestedBy: 'Alex Thompson',
        requestedAt: '2024-01-12T15:30:00Z',
        status: 'expired',
        level: 1,
        comments: 'Approval request expired after 48 hours.',
        priority: 'low'
      },
      {
        id: 'approval-hist-005',
        quotationId: 'quo-005',
        quotationNumber: 'QUO-2024-005',
        clientName: 'Enterprise Corp',
        amount: 75000,
        currency: 'USD',
        requestedBy: 'Emma Wilson',
        requestedAt: '2024-01-11T08:45:00Z',
        approvedBy: 'David Chen',
        approvedAt: '2024-01-11T12:15:00Z',
        status: 'approved',
        level: 2,
        comments: 'Large enterprise deal approved with custom terms.',
        processingTime: 3.5,
        priority: 'urgent'
      }
    ];

    setRecords(mockRecords);
    setFilteredRecords(mockRecords);
  }, []);

  useEffect(() => {
    let filtered = records;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(record =>
        record.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.approvedBy?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // Date range filter
    const now = new Date();
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    filtered = filtered.filter(record => 
      new Date(record.requestedAt) >= cutoffDate
    );

    setFilteredRecords(filtered);
  }, [records, searchQuery, statusFilter, dateRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'lucide:check-circle';
      case 'rejected': return 'lucide:x-circle';
      case 'pending': return 'lucide:clock';
      case 'expired': return 'lucide:calendar-x';
      default: return 'lucide:help-circle';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const approvedCount = records.filter(r => r.status === 'approved').length;
  const rejectedCount = records.filter(r => r.status === 'rejected').length;
  const avgProcessingTime = records
    .filter(r => r.processingTime)
    .reduce((sum, r) => sum + (r.processingTime || 0), 0) / 
    records.filter(r => r.processingTime).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approval History</h1>
          <p className="text-gray-600 mt-1">Complete audit trail of all approval activities</p>
        </div>
        <motion.button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const csvData = filteredRecords.map(record => ({
              'Quotation Number': record.quotationNumber,
              'Client': record.clientName,
              'Amount': `${record.currency} ${record.amount}`,
              'Status': record.status,
              'Requested By': record.requestedBy,
              'Requested At': new Date(record.requestedAt).toLocaleString(),
              'Approved By': record.approvedBy || 'N/A',
              'Processing Time': record.processingTime ? `${record.processingTime}h` : 'N/A'
            }));
            console.log('Exporting CSV:', csvData);
            alert('Export functionality would download CSV file');
          }}
        >
          <Icon icon="lucide:download" className="text-lg" />
          <span>Export Report</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Approvals', value: records.length, icon: 'lucide:file-check', color: 'blue' },
          { title: 'Approved', value: approvedCount, icon: 'lucide:check-circle', color: 'green' },
          { title: 'Rejected', value: rejectedCount, icon: 'lucide:x-circle', color: 'red' },
          { title: 'Avg Processing Time', value: `${avgProcessingTime.toFixed(1)}h`, icon: 'lucide:clock', color: 'purple' }
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search quotations, clients, or users..."
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
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
                setDateRange('30');
              }}
            >
              Clear Filters
            </motion.button>
          </div>
        </div>
      </div>

      {/* Approval History Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processing Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record, index) => (
                <motion.tr
                  key={record.id}
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.quotationNumber}</div>
                      <div className="text-sm text-gray-500">Level {record.level}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.clientName}</div>
                    <div className={`text-xs ${getPriorityColor(record.priority)}`}>
                      {record.priority.toUpperCase()} PRIORITY
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.currency} {record.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      <Icon icon={getStatusIcon(record.status)} className="mr-1" />
                      {record.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.requestedBy}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(record.requestedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.processingTime ? `${record.processingTime}h` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <motion.button
                      className="text-blue-600 hover:text-blue-900"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedRecord(record)}
                    >
                      <Icon icon="lucide:eye" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <Icon icon="lucide:file-search" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No approval records found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or date range.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Approval Details</h3>
              <motion.button
                className="p-2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedRecord(null)}
              >
                <Icon icon="lucide:x" className="text-xl" />
              </motion.button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quotation Number</label>
                  <p className="text-gray-900">{selectedRecord.quotationNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client</label>
                  <p className="text-gray-900">{selectedRecord.clientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-gray-900">{selectedRecord.currency} {selectedRecord.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRecord.status)}`}>
                    <Icon icon={getStatusIcon(selectedRecord.status)} className="mr-1" />
                    {selectedRecord.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Requested By</label>
                  <p className="text-gray-900">{selectedRecord.requestedBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Requested At</label>
                  <p className="text-gray-900">{new Date(selectedRecord.requestedAt).toLocaleString()}</p>
                </div>
                {selectedRecord.approvedBy && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Approved By</label>
                      <p className="text-gray-900">{selectedRecord.approvedBy}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Approved At</label>
                      <p className="text-gray-900">{selectedRecord.approvedAt ? new Date(selectedRecord.approvedAt).toLocaleString() : 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
              
              {selectedRecord.comments && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700">{selectedRecord.comments}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
