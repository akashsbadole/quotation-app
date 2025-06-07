import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: Condition[];
  actions: Action[];
  isActive: boolean;
  priority: number;
  createdAt: string;
  lastModified: string;
  executionCount: number;
}

interface Condition {
  field: string;
  operator: string;
  value: string;
  type: 'amount' | 'customer' | 'product' | 'date' | 'status';
}

interface Action {
  type: string;
  target: string;
  value: string;
  description: string;
}

interface WorkflowRulesProps {
  onNavigate?: (section: string) => void;
}

export const WorkflowRules: React.FC<WorkflowRulesProps> = ({ onNavigate }) => {
  const [rules, setRules] = useState<WorkflowRule[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<WorkflowRule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Mock workflow rules data
    const mockRules: WorkflowRule[] = [
      {
        id: 'rule-001',
        name: 'High Value Approval',
        description: 'Require manager approval for quotations over $10,000',
        trigger: 'quotation_created',
        conditions: [
          { field: 'total_amount', operator: 'greater_than', value: '10000', type: 'amount' }
        ],
        actions: [
          { type: 'require_approval', target: 'manager', value: 'level_1', description: 'Send to manager for approval' },
          { type: 'send_notification', target: 'creator', value: 'approval_required', description: 'Notify creator that approval is required' }
        ],
        isActive: true,
        priority: 1,
        createdAt: '2024-01-01T10:00:00Z',
        lastModified: '2024-01-15T14:30:00Z',
        executionCount: 45
      },
      {
        id: 'rule-002',
        name: 'VIP Customer Fast Track',
        description: 'Auto-approve quotations for VIP customers under $5,000',
        trigger: 'quotation_created',
        conditions: [
          { field: 'customer_tier', operator: 'equals', value: 'VIP', type: 'customer' },
          { field: 'total_amount', operator: 'less_than', value: '5000', type: 'amount' }
        ],
        actions: [
          { type: 'auto_approve', target: 'quotation', value: 'approved', description: 'Automatically approve quotation' },
          { type: 'send_email', target: 'customer', value: 'quotation_approved', description: 'Send approval email to customer' }
        ],
        isActive: true,
        priority: 2,
        createdAt: '2024-01-05T09:15:00Z',
        lastModified: '2024-01-20T11:45:00Z',
        executionCount: 23
      },
      {
        id: 'rule-003',
        name: 'Expiry Reminder',
        description: 'Send reminder emails 3 days before quotation expires',
        trigger: 'scheduled_daily',
        conditions: [
          { field: 'expiry_date', operator: 'days_until', value: '3', type: 'date' },
          { field: 'status', operator: 'equals', value: 'pending', type: 'status' }
        ],
        actions: [
          { type: 'send_email', target: 'customer', value: 'expiry_reminder', description: 'Send expiry reminder to customer' },
          { type: 'send_notification', target: 'sales_rep', value: 'follow_up', description: 'Notify sales rep to follow up' }
        ],
        isActive: true,
        priority: 3,
        createdAt: '2024-01-10T16:20:00Z',
        lastModified: '2024-01-25T13:10:00Z',
        executionCount: 67
      },
      {
        id: 'rule-004',
        name: 'Bulk Order Discount',
        description: 'Apply 10% discount for orders with more than 100 items',
        trigger: 'quotation_created',
        conditions: [
          { field: 'total_quantity', operator: 'greater_than', value: '100', type: 'product' }
        ],
        actions: [
          { type: 'apply_discount', target: 'quotation', value: '10', description: 'Apply 10% bulk discount' },
          { type: 'add_note', target: 'quotation', value: 'Bulk order discount applied', description: 'Add discount note to quotation' }
        ],
        isActive: false,
        priority: 4,
        createdAt: '2024-01-12T12:30:00Z',
        lastModified: '2024-01-28T10:15:00Z',
        executionCount: 12
      }
    ];

    setRules(mockRules);
  }, []);

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && rule.isActive) ||
                         (filterStatus === 'inactive' && !rule.isActive);
    return matchesSearch && matchesStatus;
  });

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive, lastModified: new Date().toISOString() }
        : rule
    ));
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'quotation_created': return 'lucide:file-plus';
      case 'quotation_updated': return 'lucide:file-edit';
      case 'scheduled_daily': return 'lucide:clock';
      case 'customer_action': return 'lucide:user';
      default: return 'lucide:zap';
    }
  };

  const getConditionDescription = (condition: Condition) => {
    const operatorMap: { [key: string]: string } = {
      'greater_than': '>',
      'less_than': '<',
      'equals': '=',
      'not_equals': '≠',
      'contains': 'contains',
      'days_until': 'days until'
    };
    
    return `${condition.field.replace('_', ' ')} ${operatorMap[condition.operator] || condition.operator} ${condition.value}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Rules</h1>
          <p className="text-gray-600 mt-1">Configure automated workflows and business rules</p>
        </div>
        <motion.button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
        >
          <Icon icon="lucide:plus" className="text-lg" />
          <span>Create Rule</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Rules', value: rules.length, icon: 'lucide:workflow', color: 'blue' },
          { title: 'Active Rules', value: rules.filter(r => r.isActive).length, icon: 'lucide:play', color: 'green' },
          { title: 'Total Executions', value: rules.reduce((sum, r) => sum + r.executionCount, 0), icon: 'lucide:zap', color: 'yellow' },
          { title: 'Avg Executions', value: Math.round(rules.reduce((sum, r) => sum + r.executionCount, 0) / rules.length), icon: 'lucide:trending-up', color: 'purple' }
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Rules</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or description..."
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Rules</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          <div className="flex items-end">
            <motion.button
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
            >
              Clear Filters
            </motion.button>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule, index) => (
          <motion.div
            key={rule.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    rule.isActive ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon 
                      icon={getTriggerIcon(rule.trigger)} 
                      className={`text-lg ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`} 
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                    <p className="text-gray-600">{rule.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    rule.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Conditions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Conditions</h4>
                    <div className="space-y-1">
                      {rule.conditions.map((condition, condIndex) => (
                        <div key={condIndex} className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-1">
                          {getConditionDescription(condition)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                    <div className="space-y-1">
                      {rule.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="text-sm text-gray-600 bg-blue-50 rounded px-3 py-1">
                          {action.description}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Priority: {rule.priority}</span>
                    <span>Executions: {rule.executionCount}</span>
                    <span>Modified: {new Date(rule.lastModified).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="text-blue-600 hover:text-blue-800 p-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedRule(rule)}
                    >
                      <Icon icon="lucide:edit" />
                    </motion.button>
                    <motion.button
                      className={`p-2 ${rule.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleRuleStatus(rule.id)}
                    >
                      <Icon icon={rule.isActive ? 'lucide:pause' : 'lucide:play'} />
                    </motion.button>
                    <motion.button
                      className="text-gray-600 hover:text-gray-800 p-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => alert(`Rule execution history for: ${rule.name}`)}
                    >
                      <Icon icon="lucide:history" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12">
          <Icon icon="lucide:workflow" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflow rules found</h3>
          <p className="text-gray-600 mb-4">
            Create your first workflow rule to automate your business processes.
          </p>
          <motion.button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Rule
          </motion.button>
        </div>
      )}

      {/* Create Rule Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create New Workflow Rule</h3>
              <motion.button
                className="p-2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCreateModal(false)}
              >
                <Icon icon="lucide:x" className="text-xl" />
              </motion.button>
            </div>
            <div className="text-center py-8">
              <Icon icon="lucide:workflow" className="mx-auto h-16 w-16 text-blue-600 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Rule Builder Coming Soon</h4>
              <p className="text-gray-600 mb-6">
                The visual rule builder interface is currently in development. 
                You'll be able to create complex workflow rules with drag-and-drop simplicity.
              </p>
              <motion.button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(false)}
              >
                Got It
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
