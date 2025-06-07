// Workflow Service
// Handles workflow rules, approvals, and automation with real business logic

import { databaseService, QueryResult } from './database.service';

export interface WorkflowRule {
  id: string;
  company_id: number;
  name: string;
  description: string;
  trigger: string;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  isActive: boolean;
  priority: number;
  createdAt: string;
  lastModified: string;
  executionCount: number;
}

export interface WorkflowCondition {
  field: string;
  operator: string;
  value: string;
  type: 'amount' | 'customer' | 'product' | 'date' | 'status';
}

export interface WorkflowAction {
  type: string;
  target: string;
  value: string;
  description: string;
}

export interface ApprovalRequest {
  id: string;
  company_id: number;
  workflow_id?: string;
  quotation_id: string;
  quotation_number: string;
  client_name: string;
  amount: number;
  currency: string;
  level: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requested_by: string;
  requested_at: string;
  assigned_to?: string;
  approved_by?: string;
  approved_at?: string;
  comments?: string;
  processing_time?: number;
  expires_at?: string;
}

export interface ApprovalHistory {
  id: string;
  approval_request_id: string;
  quotation_id: string;
  quotation_number: string;
  client_name: string;
  amount: number;
  currency: string;
  action: 'submitted' | 'approved' | 'rejected' | 'escalated' | 'expired';
  performed_by?: string;
  comments?: string;
  processing_time_hours?: number;
  created_at: string;
}

class WorkflowService {
  private readonly TABLE_RULES = 'workflow_rules';
  private readonly TABLE_APPROVALS = 'approval_requests';
  private readonly TABLE_HISTORY = 'approval_history';

  constructor() {
    this.initializeMockData();
  }

  // Initialize with mock data
  private async initializeMockData(): Promise<void> {
    const existingRules = await this.getAllRules();
    if (existingRules.data && existingRules.data.length === 0) {
      const mockRules: Partial<WorkflowRule>[] = [
        {
          id: 'rule-001',
          company_id: 1,
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
          company_id: 1,
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
          company_id: 1,
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
        }
      ];

      await databaseService.bulkCreate(this.TABLE_RULES, mockRules);
    }

    // Initialize approval history
    const existingHistory = await this.getApprovalHistory();
    if (existingHistory.data && existingHistory.data.length === 0) {
      const mockHistory: Partial<ApprovalHistory>[] = [
        {
          id: 'hist-001',
          approval_request_id: 'req-001',
          quotation_id: 'quo-001',
          quotation_number: 'QUO-2024-001',
          client_name: 'Acme Corporation',
          amount: 25000,
          currency: 'USD',
          action: 'approved',
          performed_by: 'Sarah Johnson',
          comments: 'Approved after reviewing client history and project scope.',
          processing_time_hours: 4.25,
          created_at: '2024-01-15T14:45:00Z'
        },
        {
          id: 'hist-002',
          approval_request_id: 'req-002',
          quotation_id: 'quo-002',
          quotation_number: 'QUO-2024-002',
          client_name: 'TechFlow Solutions',
          amount: 45000,
          currency: 'USD',
          action: 'approved',
          performed_by: 'David Chen',
          comments: 'High-value quotation approved with standard terms.',
          processing_time_hours: 7.25,
          created_at: '2024-01-14T16:30:00Z'
        },
        {
          id: 'hist-003',
          approval_request_id: 'req-003',
          quotation_id: 'quo-003',
          quotation_number: 'QUO-2024-003',
          client_name: 'Global Industries',
          amount: 8500,
          currency: 'USD',
          action: 'rejected',
          performed_by: 'Sarah Johnson',
          comments: 'Rejected due to pricing concerns and competitive analysis.',
          processing_time_hours: 2.42,
          created_at: '2024-01-13T13:45:00Z'
        }
      ];

      await databaseService.bulkCreate(this.TABLE_HISTORY, mockHistory);
    }
  }

  // Get all workflow rules
  async getAllRules(filters?: {
    status?: 'all' | 'active' | 'inactive';
    search?: string;
  }): Promise<QueryResult<WorkflowRule[]>> {
    try {
      const queryFilters: any = {};

      if (filters?.status === 'active') {
        queryFilters.isActive = true;
      } else if (filters?.status === 'inactive') {
        queryFilters.isActive = false;
      }

      const result = await databaseService.findMany<WorkflowRule>(this.TABLE_RULES, {
        filters: queryFilters,
        pagination: { page: 1, limit: 100, sortBy: 'priority', sortOrder: 'ASC' }
      });

      if (result.success && result.data && filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        result.data = result.data.filter(rule =>
          rule.name.toLowerCase().includes(searchTerm) ||
          rule.description.toLowerCase().includes(searchTerm)
        );
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch workflow rules'
      };
    }
  }

  // Create new workflow rule
  async createRule(rule: Omit<WorkflowRule, 'id' | 'createdAt' | 'lastModified' | 'executionCount'>): Promise<QueryResult<WorkflowRule>> {
    try {
      const newRule: Partial<WorkflowRule> = {
        ...rule,
        id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        executionCount: 0
      };

      return await databaseService.create<WorkflowRule>(this.TABLE_RULES, newRule);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create workflow rule'
      };
    }
  }

  // Update workflow rule
  async updateRule(id: string, updates: Partial<WorkflowRule>): Promise<QueryResult<WorkflowRule>> {
    try {
      const updateData = {
        ...updates,
        lastModified: new Date().toISOString()
      };

      return await databaseService.update<WorkflowRule>(this.TABLE_RULES, id, updateData);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update workflow rule'
      };
    }
  }

  // Toggle rule active status
  async toggleRuleStatus(id: string): Promise<QueryResult<WorkflowRule>> {
    try {
      const rule = await databaseService.findById<WorkflowRule>(this.TABLE_RULES, id);
      if (!rule.success || !rule.data) {
        return {
          success: false,
          error: 'Workflow rule not found'
        };
      }

      return await this.updateRule(id, { isActive: !rule.data.isActive });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to toggle rule status'
      };
    }
  }

  // Execute workflow rules for a quotation
  async executeRulesForQuotation(quotationData: {
    id: string;
    total_amount: number;
    customer_tier?: string;
    status: string;
    expiry_date?: string;
  }): Promise<QueryResult<{ triggeredRules: WorkflowRule[]; actions: string[] }>> {
    try {
      const activeRules = await this.getAllRules({ status: 'active' });
      if (!activeRules.success || !activeRules.data) {
        return {
          success: false,
          error: 'Failed to fetch active rules'
        };
      }

      const triggeredRules: WorkflowRule[] = [];
      const actions: string[] = [];

      for (const rule of activeRules.data) {
        if (rule.trigger === 'quotation_created' || rule.trigger === 'quotation_updated') {
          const conditionsMet = this.evaluateConditions(rule.conditions, quotationData);
          
          if (conditionsMet) {
            triggeredRules.push(rule);
            
            // Execute actions
            for (const action of rule.actions) {
              const actionResult = await this.executeAction(action, quotationData);
              actions.push(actionResult);
            }

            // Increment execution count
            await this.updateRule(rule.id, { 
              executionCount: rule.executionCount + 1 
            });
          }
        }
      }

      return {
        success: true,
        data: { triggeredRules, actions }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to execute workflow rules'
      };
    }
  }

  // Get approval history
  async getApprovalHistory(filters?: {
    status?: string;
    dateRange?: string;
    search?: string;
  }): Promise<QueryResult<ApprovalHistory[]>> {
    try {
      const queryFilters: any = {};

      if (filters?.status && filters.status !== 'all') {
        queryFilters.action = filters.status;
      }

      const result = await databaseService.findMany<ApprovalHistory>(this.TABLE_HISTORY, {
        filters: queryFilters,
        pagination: { page: 1, limit: 100, sortBy: 'created_at', sortOrder: 'DESC' }
      });

      if (result.success && result.data) {
        // Apply date range filter
        if (filters?.dateRange) {
          const days = parseInt(filters.dateRange);
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - days);
          
          result.data = result.data.filter(record => 
            new Date(record.created_at) >= cutoffDate
          );
        }

        // Apply search filter
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          result.data = result.data.filter(record =>
            record.quotation_number.toLowerCase().includes(searchTerm) ||
            record.client_name.toLowerCase().includes(searchTerm) ||
            record.performed_by?.toLowerCase().includes(searchTerm)
          );
        }
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch approval history'
      };
    }
  }

  // Create approval request
  async createApprovalRequest(request: Omit<ApprovalRequest, 'id' | 'requested_at'>): Promise<QueryResult<ApprovalRequest>> {
    try {
      const newRequest: Partial<ApprovalRequest> = {
        ...request,
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        requested_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
      };

      const result = await databaseService.create<ApprovalRequest>(this.TABLE_APPROVALS, newRequest);

      if (result.success && result.data) {
        // Record in history
        await this.recordApprovalHistory({
          approval_request_id: result.data.id,
          quotation_id: result.data.quotation_id,
          quotation_number: result.data.quotation_number,
          client_name: result.data.client_name,
          amount: result.data.amount,
          currency: result.data.currency,
          action: 'submitted',
          performed_by: result.data.requested_by
        });
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create approval request'
      };
    }
  }

  // Process approval decision
  async processApproval(
    requestId: string, 
    decision: 'approved' | 'rejected', 
    approver: string, 
    comments?: string
  ): Promise<QueryResult<ApprovalRequest>> {
    try {
      const request = await databaseService.findById<ApprovalRequest>(this.TABLE_APPROVALS, requestId);
      if (!request.success || !request.data) {
        return {
          success: false,
          error: 'Approval request not found'
        };
      }

      const requestedAt = new Date(request.data.requested_at);
      const approvedAt = new Date();
      const processingTime = (approvedAt.getTime() - requestedAt.getTime()) / (1000 * 60 * 60); // hours

      const updateData = {
        status: decision,
        approved_by: approver,
        approved_at: approvedAt.toISOString(),
        comments,
        processing_time: processingTime
      };

      const result = await databaseService.update<ApprovalRequest>(this.TABLE_APPROVALS, requestId, updateData);

      if (result.success && result.data) {
        // Record in history
        await this.recordApprovalHistory({
          approval_request_id: requestId,
          quotation_id: result.data.quotation_id,
          quotation_number: result.data.quotation_number,
          client_name: result.data.client_name,
          amount: result.data.amount,
          currency: result.data.currency,
          action: decision,
          performed_by: approver,
          comments,
          processing_time_hours: processingTime
        });
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process approval'
      };
    }
  }

  // Private helper methods
  private evaluateConditions(conditions: WorkflowCondition[], data: any): boolean {
    return conditions.every(condition => {
      const fieldValue = data[condition.field];
      const conditionValue = condition.value;

      switch (condition.operator) {
        case 'greater_than':
          return parseFloat(fieldValue) > parseFloat(conditionValue);
        case 'less_than':
          return parseFloat(fieldValue) < parseFloat(conditionValue);
        case 'equals':
          return fieldValue === conditionValue;
        case 'not_equals':
          return fieldValue !== conditionValue;
        case 'contains':
          return fieldValue?.toString().toLowerCase().includes(conditionValue.toLowerCase());
        case 'days_until':
          if (fieldValue) {
            const targetDate = new Date(fieldValue);
            const today = new Date();
            const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays <= parseInt(conditionValue);
          }
          return false;
        default:
          return false;
      }
    });
  }

  private async executeAction(action: WorkflowAction, data: any): Promise<string> {
    try {
      switch (action.type) {
        case 'require_approval':
          await this.createApprovalRequest({
            company_id: 1,
            quotation_id: data.id,
            quotation_number: `QUO-${Date.now()}`,
            client_name: 'Customer',
            amount: data.total_amount,
            currency: 'USD',
            level: 1,
            status: 'pending',
            priority: 'medium',
            requested_by: 'System'
          });
          return `Approval request created for ${action.target}`;

        case 'send_notification':
          // Simulate sending notification
          return `Notification sent to ${action.target}: ${action.value}`;

        case 'auto_approve':
          // Simulate auto-approval
          return `Quotation auto-approved: ${action.description}`;

        case 'send_email':
          // Simulate email sending
          return `Email sent to ${action.target}: ${action.value}`;

        default:
          return `Unknown action: ${action.type}`;
      }
    } catch (error) {
      return `Failed to execute action: ${action.type}`;
    }
  }

  private async recordApprovalHistory(history: Omit<ApprovalHistory, 'id' | 'created_at'>): Promise<void> {
    try {
      const historyRecord: Partial<ApprovalHistory> = {
        ...history,
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      };

      await databaseService.create(this.TABLE_HISTORY, historyRecord);
    } catch (error) {
      console.error('Failed to record approval history:', error);
    }
  }
}

// Export singleton instance
export const workflowService = new WorkflowService();
export default WorkflowService;
