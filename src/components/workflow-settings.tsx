import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface WorkflowSettings {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  threshold?: number;
  autoApprovalLimit?: number;
  escalationTime?: number;
  notificationSettings: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  approvalLevels: ApprovalLevel[];
}

interface ApprovalLevel {
  id: string;
  level: number;
  name: string;
  approvers: string[];
  conditions: string[];
  timeoutHours: number;
}

interface WorkflowSettingsProps {
  onNavigate?: (section: string) => void;
}

export const WorkflowSettings: React.FC<WorkflowSettingsProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<WorkflowSettings[]>([]);
  const [selectedSetting, setSelectedSetting] = useState<WorkflowSettings | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'approval-levels' | 'notifications' | 'automation'>('general');

  useEffect(() => {
    // Initialize with mock workflow settings
    const mockSettings: WorkflowSettings[] = [
      {
        id: 'workflow-001',
        name: 'High Value Quotation Approval',
        description: 'Approval workflow for quotations above $10,000',
        isEnabled: true,
        threshold: 10000,
        autoApprovalLimit: 5000,
        escalationTime: 24,
        notificationSettings: {
          email: true,
          sms: false,
          inApp: true
        },
        approvalLevels: [
          {
            id: 'level-001',
            level: 1,
            name: 'Manager Approval',
            approvers: ['manager@company.com', 'supervisor@company.com'],
            conditions: ['amount > 10000', 'customer_tier != VIP'],
            timeoutHours: 24
          },
          {
            id: 'level-002',
            level: 2,
            name: 'Director Approval',
            approvers: ['director@company.com'],
            conditions: ['amount > 50000'],
            timeoutHours: 48
          }
        ]
      },
      {
        id: 'workflow-002',
        name: 'New Customer Approval',
        description: 'Special approval process for new customers',
        isEnabled: true,
        threshold: 0,
        autoApprovalLimit: 1000,
        escalationTime: 12,
        notificationSettings: {
          email: true,
          sms: true,
          inApp: true
        },
        approvalLevels: [
          {
            id: 'level-003',
            level: 1,
            name: 'Sales Manager Review',
            approvers: ['sales.manager@company.com'],
            conditions: ['customer_type == new', 'amount > 1000'],
            timeoutHours: 12
          }
        ]
      },
      {
        id: 'workflow-003',
        name: 'Discount Approval',
        description: 'Approval required for discounts above 15%',
        isEnabled: false,
        threshold: 15,
        autoApprovalLimit: 10,
        escalationTime: 6,
        notificationSettings: {
          email: true,
          sms: false,
          inApp: true
        },
        approvalLevels: [
          {
            id: 'level-004',
            level: 1,
            name: 'Pricing Manager',
            approvers: ['pricing@company.com'],
            conditions: ['discount_percent > 15'],
            timeoutHours: 6
          }
        ]
      }
    ];

    setSettings(mockSettings);
  }, []);

  const handleToggleWorkflow = (workflowId: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === workflowId 
        ? { ...setting, isEnabled: !setting.isEnabled }
        : setting
    ));
  };

  const handleEditWorkflow = (workflow: WorkflowSettings) => {
    setSelectedSetting(workflow);
    setShowEditModal(true);
  };

  const handleSaveWorkflow = (updatedWorkflow: WorkflowSettings) => {
    setSettings(prev => prev.map(setting => 
      setting.id === updatedWorkflow.id ? updatedWorkflow : setting
    ));
    setShowEditModal(false);
    setSelectedSetting(null);
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      setSettings(prev => prev.filter(setting => setting.id !== workflowId));
    }
  };

  const handleCreateWorkflow = () => {
    const newWorkflow: WorkflowSettings = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: 'Description for new workflow',
      isEnabled: false,
      threshold: 0,
      autoApprovalLimit: 0,
      escalationTime: 24,
      notificationSettings: {
        email: true,
        sms: false,
        inApp: true
      },
      approvalLevels: []
    };
    
    setSelectedSetting(newWorkflow);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Settings</h1>
          <p className="text-gray-600 mt-1">Configure approval rules, thresholds, and automation settings</p>
        </div>
        <motion.button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateWorkflow}
        >
          <Icon icon="lucide:plus" className="text-lg" />
          <span>Create Workflow</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Active Workflows', value: settings.filter(s => s.isEnabled).length, icon: 'lucide:workflow', color: 'blue' },
          { title: 'Total Workflows', value: settings.length, icon: 'lucide:settings', color: 'green' },
          { title: 'Avg Processing Time', value: '4.2h', icon: 'lucide:clock', color: 'purple' },
          { title: 'Approval Rate', value: '94%', icon: 'lucide:check-circle', color: 'orange' }
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

      {/* Workflow List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Workflow Rules</h2>
          <p className="text-gray-600 text-sm mt-1">Manage your approval workflows and automation rules</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {settings.map((workflow, index) => (
            <motion.div
              key={workflow.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{workflow.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      workflow.isEnabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.isEnabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{workflow.description}</p>
                  
                  <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Icon icon="lucide:layers" />
                      <span>{workflow.approvalLevels.length} Levels</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon icon="lucide:dollar-sign" />
                      <span>Threshold: ${workflow.threshold?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon icon="lucide:clock" />
                      <span>Escalation: {workflow.escalationTime}h</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      workflow.isEnabled
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleWorkflow(workflow.id)}
                  >
                    {workflow.isEnabled ? 'Disable' : 'Enable'}
                  </motion.button>
                  
                  <motion.button
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditWorkflow(workflow)}
                  >
                    <Icon icon="lucide:edit" className="text-lg" />
                  </motion.button>
                  
                  <motion.button
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                  >
                    <Icon icon="lucide:trash-2" className="text-lg" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Edit Workflow</h3>
                <motion.button
                  className="p-2 text-gray-400 hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditModal(false)}
                >
                  <Icon icon="lucide:x" className="text-xl" />
                </motion.button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Name</label>
                    <input
                      type="text"
                      value={selectedSetting.name}
                      onChange={(e) => setSelectedSetting({...selectedSetting, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Threshold Amount</label>
                    <input
                      type="number"
                      value={selectedSetting.threshold}
                      onChange={(e) => setSelectedSetting({...selectedSetting, threshold: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={selectedSetting.description}
                    onChange={(e) => setSelectedSetting({...selectedSetting, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={selectedSetting.isEnabled}
                    onChange={(e) => setSelectedSetting({...selectedSetting, isEnabled: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="enabled" className="text-sm text-gray-700">Enable this workflow</label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSaveWorkflow(selectedSetting)}
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
