import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Workflow Schemas
export const CreateWorkflowTemplateSchema = z.object({
  name: z.string().min(1, "Workflow name is required"),
  description: z.string().optional(),
  type: z.enum(['approval', 'notification', 'automation']),
  conditions: z.object({
    triggers: z.array(z.object({
      field: z.string(),
      operator: z.enum(['equals', 'greater_than', 'less_than', 'contains']),
      value: z.any(),
    })),
    entityType: z.enum(['quotation', 'client', 'product']),
  }),
  actions: z.array(z.object({
    type: z.enum(['approval', 'notification', 'email', 'status_change', 'assignment']),
    config: z.record(z.any()),
    order: z.number(),
  })),
  isActive: z.boolean().default(true),
  priority: z.number().default(1),
});

export const CreateApprovalSchema = z.object({
  quotationId: z.string(),
  approverId: z.string(),
  level: z.number().default(1),
  comments: z.string().optional(),
  requiredBy: z.date().optional(),
});

export class WorkflowService {
  // Create workflow template
  async createWorkflowTemplate(data: z.infer<typeof CreateWorkflowTemplateSchema>) {
    const validatedData = CreateWorkflowTemplateSchema.parse(data);
    
    return await prisma.workflowTemplate.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        type: validatedData.type,
        conditions: JSON.stringify(validatedData.conditions),
        actions: JSON.stringify(validatedData.actions),
        isActive: validatedData.isActive,
        priority: validatedData.priority,
      }
    });
  }

  // Trigger workflow based on entity changes
  async triggerWorkflow(entityType: string, entityId: string, entityData: any, action: string) {
    // Find applicable workflow templates
    const templates = await prisma.workflowTemplate.findMany({
      where: { 
        isActive: true,
        type: { in: ['approval', 'automation'] }
      },
      orderBy: { priority: 'asc' }
    });

    const triggeredWorkflows = [];

    for (const template of templates) {
      const conditions = JSON.parse(template.conditions);
      
      if (conditions.entityType === entityType && this.evaluateConditions(conditions, entityData, action)) {
        const workflow = await this.createWorkflowInstance(template.id, entityId, entityType, entityData);
        triggeredWorkflows.push(workflow);
      }
    }

    return triggeredWorkflows;
  }

  // Create workflow instance
  async createWorkflowInstance(templateId: string, entityId: string, entityType: string, data: any) {
    const template = await prisma.workflowTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      throw new Error('Workflow template not found');
    }

    const workflow = await prisma.workflow.create({
      data: {
        templateId,
        entityId,
        entityType,
        data: JSON.stringify(data),
        currentStep: 1,
      }
    });

    // Create workflow steps based on template actions
    const actions = JSON.parse(template.actions);
    const steps = await Promise.all(
      actions.map(async (action: any, index: number) => {
        return await prisma.workflowStep.create({
          data: {
            workflowId: workflow.id,
            stepNumber: index + 1,
            name: action.type,
            type: action.type,
            assigneeId: action.config.assigneeId,
            data: JSON.stringify(action.config),
          }
        });
      })
    );

    // Execute first step if it's automated
    await this.executeWorkflowStep(workflow.id, 1);

    return { workflow, steps };
  }

  // Execute workflow step
  async executeWorkflowStep(workflowId: string, stepNumber: number) {
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        steps: {
          where: { stepNumber },
          take: 1
        },
        template: true
      }
    });

    if (!workflow || workflow.steps.length === 0) {
      throw new Error('Workflow or step not found');
    }

    const step = workflow.steps[0];
    const stepConfig = JSON.parse(step.data || '{}');

    switch (step.type) {
      case 'approval':
        await this.createApprovalRequest(workflow.entityId, stepConfig);
        break;
      
      case 'notification':
        await this.sendNotification(stepConfig);
        break;
      
      case 'email':
        await this.sendEmail(stepConfig);
        break;
      
      case 'status_change':
        await this.changeEntityStatus(workflow.entityType, workflow.entityId, stepConfig.status);
        break;
      
      case 'assignment':
        await this.assignEntity(workflow.entityType, workflow.entityId, stepConfig.assigneeId);
        break;
    }

    // Mark step as completed
    await prisma.workflowStep.update({
      where: { id: step.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      }
    });

    // Move to next step or complete workflow
    const nextStep = stepNumber + 1;
    const hasNextStep = await prisma.workflowStep.findFirst({
      where: { workflowId, stepNumber: nextStep }
    });

    if (hasNextStep) {
      await prisma.workflow.update({
        where: { id: workflowId },
        data: { currentStep: nextStep }
      });
      
      // Execute next step if it's automated
      if (hasNextStep.type !== 'approval') {
        await this.executeWorkflowStep(workflowId, nextStep);
      }
    } else {
      // Complete workflow
      await prisma.workflow.update({
        where: { id: workflowId },
        data: {
          status: 'completed',
          completedAt: new Date(),
        }
      });
    }
  }

  // Create approval request
  async createApprovalRequest(quotationId: string, config: any) {
    const approval = await prisma.quotationApproval.create({
      data: {
        quotationId,
        approverId: config.approverId,
        level: config.level || 1,
        status: 'pending',
      }
    });

    // Update quotation status
    await prisma.quotation.update({
      where: { id: quotationId },
      data: {
        approvalRequired: true,
        approvalStatus: 'pending',
      }
    });

    // Send notification to approver
    await this.sendNotification({
      userId: config.approverId,
      type: 'approval',
      title: 'Approval Required',
      message: `Quotation ${quotationId} requires your approval`,
      data: { quotationId, approvalId: approval.id }
    });

    return approval;
  }

  // Process approval decision
  async processApproval(approvalId: string, decision: 'approved' | 'rejected', comments?: string, userId?: string) {
    const approval = await prisma.quotationApproval.findUnique({
      where: { id: approvalId },
      include: { quotation: true }
    });

    if (!approval) {
      throw new Error('Approval not found');
    }

    if (approval.status !== 'pending') {
      throw new Error('Approval already processed');
    }

    // Update approval
    await prisma.quotationApproval.update({
      where: { id: approvalId },
      data: {
        status: decision,
        comments,
        approvedAt: new Date(),
      }
    });

    // Update quotation
    const quotationUpdate: any = {
      approvalStatus: decision,
    };

    if (decision === 'approved') {
      quotationUpdate.approvedBy = approval.approverId;
      quotationUpdate.approvedAt = new Date();
      quotationUpdate.status = 'APPROVED';
    } else {
      quotationUpdate.rejectionReason = comments;
      quotationUpdate.status = 'REJECTED';
    }

    await prisma.quotation.update({
      where: { id: approval.quotationId },
      data: quotationUpdate
    });

    // Log activity
    await prisma.quotationActivity.create({
      data: {
        quotationId: approval.quotationId,
        userId,
        action: decision,
        description: `Quotation ${decision} by approver`,
        metadata: JSON.stringify({ approvalId, comments }),
      }
    });

    // Continue workflow if approved
    if (decision === 'approved') {
      const workflows = await prisma.workflow.findMany({
        where: {
          entityId: approval.quotationId,
          entityType: 'quotation',
          status: 'active',
        }
      });

      for (const workflow of workflows) {
        await this.executeWorkflowStep(workflow.id, workflow.currentStep + 1);
      }
    }

    return { success: true, decision, quotationId: approval.quotationId };
  }

  // Get pending approvals for user
  async getPendingApprovals(userId: string) {
    return await prisma.quotationApproval.findMany({
      where: {
        approverId: userId,
        status: 'pending',
      },
      include: {
        quotation: {
          include: {
            client: {
              select: { id: true, name: true, email: true }
            },
            items: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  // Send notification
  async sendNotification(config: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    priority?: string;
  }) {
    return await prisma.notification.create({
      data: {
        userId: config.userId,
        type: config.type,
        title: config.title,
        message: config.message,
        data: config.data ? JSON.stringify(config.data) : null,
        priority: config.priority || 'medium',
      }
    });
  }

  // Send email (placeholder for email service integration)
  async sendEmail(config: {
    to: string;
    subject: string;
    template: string;
    data: any;
  }) {
    // Implement email sending logic here
    console.log('Sending email:', config);
    return { success: true, message: 'Email sent' };
  }

  // Change entity status
  async changeEntityStatus(entityType: string, entityId: string, status: string) {
    switch (entityType) {
      case 'quotation':
        await prisma.quotation.update({
          where: { id: entityId },
          data: { status }
        });
        break;
      
      case 'client':
        await prisma.client.update({
          where: { id: entityId },
          data: { status }
        });
        break;
      
      case 'product':
        await prisma.product.update({
          where: { id: entityId },
          data: { status }
        });
        break;
    }
  }

  // Assign entity to user
  async assignEntity(entityType: string, entityId: string, assigneeId: string) {
    switch (entityType) {
      case 'client':
        await prisma.client.update({
          where: { id: entityId },
          data: { assignedTo: assigneeId }
        });
        break;
    }
  }

  // Evaluate workflow conditions
  private evaluateConditions(conditions: any, entityData: any, action: string): boolean {
    if (!conditions.triggers || conditions.triggers.length === 0) {
      return true;
    }

    return conditions.triggers.every((trigger: any) => {
      const fieldValue = entityData[trigger.field];
      
      switch (trigger.operator) {
        case 'equals':
          return fieldValue === trigger.value;
        case 'greater_than':
          return Number(fieldValue) > Number(trigger.value);
        case 'less_than':
          return Number(fieldValue) < Number(trigger.value);
        case 'contains':
          return String(fieldValue).toLowerCase().includes(String(trigger.value).toLowerCase());
        default:
          return false;
      }
    });
  }

  // Get workflow analytics
  async getWorkflowAnalytics(dateRange?: { from: Date; to: Date }) {
    const where: any = {};
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.from,
        lte: dateRange.to,
      };
    }

    const [
      totalWorkflows,
      completedWorkflows,
      activeWorkflows,
      avgCompletionTime,
      workflowsByType
    ] = await Promise.all([
      prisma.workflow.count({ where }),
      prisma.workflow.count({ where: { ...where, status: 'completed' } }),
      prisma.workflow.count({ where: { ...where, status: 'active' } }),
      prisma.workflow.aggregate({
        where: { ...where, status: 'completed' },
        _avg: {
          // Calculate average time between startedAt and completedAt
          // This would need a computed field or raw query
        }
      }),
      prisma.workflow.groupBy({
        by: ['entityType'],
        where,
        _count: true,
      })
    ]);

    return {
      totalWorkflows,
      completedWorkflows,
      activeWorkflows,
      completionRate: totalWorkflows > 0 ? (completedWorkflows / totalWorkflows) * 100 : 0,
      workflowsByType,
    };
  }
}

export const workflowService = new WorkflowService();
