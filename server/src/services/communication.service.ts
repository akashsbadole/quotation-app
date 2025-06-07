import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Communication Schemas
export const CreateCommunicationSchema = z.object({
  quotationId: z.string().optional(),
  clientId: z.string(),
  type: z.enum(['email', 'sms', 'call', 'meeting', 'note']),
  subject: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  direction: z.enum(['inbound', 'outbound']),
  scheduledAt: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const CreateEmailTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(['quotation', 'follow_up', 'reminder', 'welcome', 'custom']),
  variables: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export class CommunicationService {
  // Create communication record
  async createCommunication(data: z.infer<typeof CreateCommunicationSchema>, userId?: string) {
    const validatedData = CreateCommunicationSchema.parse(data);
    
    const communication = await prisma.communication.create({
      data: {
        quotationId: validatedData.quotationId,
        clientId: validatedData.clientId,
        type: validatedData.type,
        subject: validatedData.subject,
        content: validatedData.content,
        direction: validatedData.direction,
        scheduledAt: validatedData.scheduledAt,
        status: validatedData.scheduledAt ? 'scheduled' : 'sent',
        sentAt: validatedData.scheduledAt ? null : new Date(),
      },
      include: {
        client: {
          select: { id: true, name: true, email: true, phone: true }
        },
        quotation: {
          select: { id: true, referenceNumber: true }
        }
      }
    });

    // Log client activity
    await prisma.clientActivity.create({
      data: {
        clientId: validatedData.clientId,
        userId,
        type: validatedData.type,
        subject: validatedData.subject,
        description: `${validatedData.direction} ${validatedData.type}: ${validatedData.subject || 'No subject'}`,
        completedAt: validatedData.scheduledAt ? null : new Date(),
        scheduledAt: validatedData.scheduledAt,
        status: validatedData.scheduledAt ? 'scheduled' : 'completed',
      }
    });

    // Send communication if not scheduled
    if (!validatedData.scheduledAt) {
      await this.sendCommunication(communication.id);
    }

    return communication;
  }

  // Send communication
  async sendCommunication(communicationId: string) {
    const communication = await prisma.communication.findUnique({
      where: { id: communicationId },
      include: {
        client: true,
        quotation: true,
      }
    });

    if (!communication) {
      throw new Error('Communication not found');
    }

    let result = { success: false, message: 'Unknown error' };

    switch (communication.type) {
      case 'email':
        result = await this.sendEmail(communication);
        break;
      case 'sms':
        result = await this.sendSMS(communication);
        break;
      case 'call':
        result = await this.logCall(communication);
        break;
      case 'meeting':
        result = await this.scheduleMeeting(communication);
        break;
      case 'note':
        result = { success: true, message: 'Note recorded' };
        break;
    }

    // Update communication status
    await prisma.communication.update({
      where: { id: communicationId },
      data: {
        status: result.success ? 'sent' : 'failed',
        sentAt: result.success ? new Date() : null,
      }
    });

    return result;
  }

  // Send email
  private async sendEmail(communication: any) {
    try {
      // Implement email sending logic here (e.g., using SendGrid, Mailgun, etc.)
      console.log('Sending email:', {
        to: communication.client.email,
        subject: communication.subject,
        content: communication.content,
      });

      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, message: 'Failed to send email' };
    }
  }

  // Send SMS
  private async sendSMS(communication: any) {
    try {
      // Implement SMS sending logic here (e.g., using Twilio, AWS SNS, etc.)
      console.log('Sending SMS:', {
        to: communication.client.phone,
        content: communication.content,
      });

      // Simulate SMS sending
      await new Promise(resolve => setTimeout(resolve, 500));

      return { success: true, message: 'SMS sent successfully' };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return { success: false, message: 'Failed to send SMS' };
    }
  }

  // Log call
  private async logCall(communication: any) {
    // Call logging is just recording the communication
    return { success: true, message: 'Call logged successfully' };
  }

  // Schedule meeting
  private async scheduleMeeting(communication: any) {
    try {
      // Implement meeting scheduling logic here (e.g., using Google Calendar, Outlook, etc.)
      console.log('Scheduling meeting:', {
        attendees: [communication.client.email],
        subject: communication.subject,
        content: communication.content,
        scheduledAt: communication.scheduledAt,
      });

      return { success: true, message: 'Meeting scheduled successfully' };
    } catch (error) {
      console.error('Meeting scheduling failed:', error);
      return { success: false, message: 'Failed to schedule meeting' };
    }
  }

  // Create email template
  async createEmailTemplate(data: z.infer<typeof CreateEmailTemplateSchema>) {
    const validatedData = CreateEmailTemplateSchema.parse(data);
    
    return await prisma.template.create({
      data: {
        name: validatedData.name,
        description: `Email template for ${validatedData.type}`,
        category: 'email',
        type: 'email',
        content: JSON.stringify({
          subject: validatedData.subject,
          content: validatedData.content,
          variables: validatedData.variables,
        }),
        variables: JSON.stringify(validatedData.variables),
      }
    });
  }

  // Send templated email
  async sendTemplatedEmail(templateId: string, clientId: string, variables: Record<string, any> = {}) {
    const template = await prisma.template.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      throw new Error('Email template not found');
    }

    const templateData = JSON.parse(template.content);
    
    // Replace variables in subject and content
    let subject = templateData.subject;
    let content = templateData.content;

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });

    // Create and send communication
    return await this.createCommunication({
      clientId,
      type: 'email',
      subject,
      content,
      direction: 'outbound',
    });
  }

  // Get communication history
  async getCommunicationHistory(filters: {
    clientId?: string;
    quotationId?: string;
    type?: string;
    dateRange?: { from: Date; to: Date };
    page?: number;
    limit?: number;
  } = {}) {
    const {
      clientId,
      quotationId,
      type,
      dateRange,
      page = 1,
      limit = 50
    } = filters;

    const where: any = {};
    
    if (clientId) where.clientId = clientId;
    if (quotationId) where.quotationId = quotationId;
    if (type) where.type = type;
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.from,
        lte: dateRange.to,
      };
    }

    const [communications, total] = await Promise.all([
      prisma.communication.findMany({
        where,
        include: {
          client: {
            select: { id: true, name: true, email: true }
          },
          quotation: {
            select: { id: true, referenceNumber: true }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.communication.count({ where })
    ]);

    return {
      communications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Schedule follow-up communications
  async scheduleFollowUp(quotationId: string, days: number, templateId?: string) {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { client: true }
    });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + days);

    let subject = `Follow-up on Quotation ${quotation.referenceNumber}`;
    let content = `Hi ${quotation.client.contact},\n\nI wanted to follow up on the quotation we sent you. Do you have any questions or need any clarifications?\n\nBest regards`;

    // Use template if provided
    if (templateId) {
      const template = await prisma.template.findUnique({
        where: { id: templateId }
      });

      if (template) {
        const templateData = JSON.parse(template.content);
        subject = templateData.subject.replace('{{quotationNumber}}', quotation.referenceNumber);
        content = templateData.content
          .replace('{{clientName}}', quotation.client.contact)
          .replace('{{quotationNumber}}', quotation.referenceNumber);
      }
    }

    return await this.createCommunication({
      quotationId,
      clientId: quotation.clientId,
      type: 'email',
      subject,
      content,
      direction: 'outbound',
      scheduledAt: followUpDate,
    });
  }

  // Get communication analytics
  async getCommunicationAnalytics(dateRange?: { from: Date; to: Date }) {
    const where: any = {};
    if (dateRange) {
      where.createdAt = {
        gte: dateRange.from,
        lte: dateRange.to,
      };
    }

    const [
      totalCommunications,
      communicationsByType,
      communicationsByStatus,
      responseRate,
      avgResponseTime
    ] = await Promise.all([
      prisma.communication.count({ where }),
      prisma.communication.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
      prisma.communication.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      this.calculateResponseRate(where),
      this.calculateAvgResponseTime(where),
    ]);

    return {
      totalCommunications,
      communicationsByType,
      communicationsByStatus,
      responseRate,
      avgResponseTime,
    };
  }

  // Calculate response rate
  private async calculateResponseRate(where: any) {
    const outboundCommunications = await prisma.communication.count({
      where: { ...where, direction: 'outbound' }
    });

    const inboundCommunications = await prisma.communication.count({
      where: { ...where, direction: 'inbound' }
    });

    return outboundCommunications > 0 ? (inboundCommunications / outboundCommunications) * 100 : 0;
  }

  // Calculate average response time
  private async calculateAvgResponseTime(where: any) {
    // This would require more complex logic to match outbound communications with their responses
    // For now, return a placeholder
    return 24; // hours
  }

  // Process scheduled communications
  async processScheduledCommunications() {
    const scheduledCommunications = await prisma.communication.findMany({
      where: {
        status: 'scheduled',
        scheduledAt: {
          lte: new Date(),
        }
      },
      include: {
        client: true,
        quotation: true,
      }
    });

    const results = [];
    for (const communication of scheduledCommunications) {
      try {
        const result = await this.sendCommunication(communication.id);
        results.push({ communicationId: communication.id, ...result });
      } catch (error) {
        console.error(`Failed to send scheduled communication ${communication.id}:`, error);
        results.push({
          communicationId: communication.id,
          success: false,
          message: 'Failed to send scheduled communication'
        });
      }
    }

    return results;
  }
}

export const communicationService = new CommunicationService();
