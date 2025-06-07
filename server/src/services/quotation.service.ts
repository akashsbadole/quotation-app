import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Enhanced Quotation Schemas
export const CreateQuotationSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  templateId: z.string().optional(),
  currency: z.string().default("USD"),
  exchangeRate: z.number().default(1.0),
  validityDays: z.number().default(30),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    description: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    tax: z.number().default(0),
    discount: z.number().default(0),
    discountType: z.enum(['percentage', 'fixed']).default('percentage'),
  })).min(1, "At least one item is required"),
  discountType: z.enum(['percentage', 'fixed', 'tiered']).default('percentage'),
  discountValue: z.number().default(0),
  taxRates: z.array(z.object({
    name: z.string(),
    rate: z.number(),
    type: z.enum(['inclusive', 'exclusive']).default('exclusive'),
  })).default([]),
  terms: z.string().optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  tags: z.array(z.string()).default([]),
  customFields: z.record(z.any()).default({}),
  approvalRequired: z.boolean().default(false),
  autoSend: z.boolean().default(false),
  followUpDays: z.number().default(7),
});

export const UpdateQuotationSchema = CreateQuotationSchema.partial();

export class QuotationService {
  // Generate unique reference number
  async generateReferenceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    const count = await prisma.quotation.count({
      where: {
        referenceNumber: {
          startsWith: `QUO-${year}${month}-`
        }
      }
    });
    
    return `QUO-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;
  }

  // Calculate quotation totals with advanced pricing
  calculateTotals(items: any[], discountType: string = 'percentage', discountValue: number = 0) {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    // Calculate item totals
    items.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      let itemDiscount = 0;
      
      if (item.discountType === 'percentage') {
        itemDiscount = itemSubtotal * (item.discount / 100);
      } else {
        itemDiscount = item.discount;
      }
      
      const itemAfterDiscount = itemSubtotal - itemDiscount;
      const itemTax = itemAfterDiscount * (item.tax / 100);
      
      item.total = itemAfterDiscount + itemTax;
      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;
    });

    // Apply global discount
    let globalDiscount = 0;
    if (discountType === 'percentage') {
      globalDiscount = subtotal * (discountValue / 100);
    } else if (discountType === 'fixed') {
      globalDiscount = discountValue;
    }

    const finalSubtotal = subtotal - totalDiscount - globalDiscount;
    const total = finalSubtotal + totalTax;

    return {
      subtotal: subtotal,
      tax: totalTax,
      discount: totalDiscount + globalDiscount,
      total: total,
    };
  }

  // Create new quotation with advanced features
  async createQuotation(data: z.infer<typeof CreateQuotationSchema>, userId?: string) {
    const validatedData = CreateQuotationSchema.parse(data);
    
    // Generate reference number
    const referenceNumber = await this.generateReferenceNumber();
    
    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + validatedData.validityDays);
    
    // Calculate totals
    const totals = this.calculateTotals(
      validatedData.items,
      validatedData.discountType,
      validatedData.discountValue
    );

    // Create quotation
    const quotation = await prisma.quotation.create({
      data: {
        referenceNumber,
        clientId: validatedData.clientId,
        templateId: validatedData.templateId,
        date: new Date(),
        expiryDate,
        currency: validatedData.currency,
        exchangeRate: validatedData.exchangeRate,
        priority: validatedData.priority,
        approvalRequired: validatedData.approvalRequired,
        terms: validatedData.terms,
        notes: validatedData.notes,
        ...totals,
        items: {
          create: validatedData.items.map(item => ({
            productId: item.productId,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax,
            discount: item.discount,
            total: item.quantity * item.unitPrice * (1 - item.discount / 100) * (1 + item.tax / 100),
          }))
        }
      },
      include: {
        client: true,
        items: {
          include: {
            product: true
          }
        },
        template: true,
      }
    });

    // Log activity
    await this.logActivity(quotation.id, 'created', 'Quotation created', userId);

    // Auto-send if requested
    if (validatedData.autoSend) {
      await this.sendQuotation(quotation.id, userId);
    }

    // Set up follow-up reminder
    if (validatedData.followUpDays > 0) {
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + validatedData.followUpDays);
      
      await prisma.quotation.update({
        where: { id: quotation.id },
        data: { nextFollowUp: followUpDate }
      });
    }

    return quotation;
  }

  // Duplicate quotation with version control
  async duplicateQuotation(quotationId: string, userId?: string) {
    const originalQuotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        items: true,
        client: true,
      }
    });

    if (!originalQuotation) {
      throw new Error('Quotation not found');
    }

    const referenceNumber = await this.generateReferenceNumber();
    
    const duplicatedQuotation = await prisma.quotation.create({
      data: {
        referenceNumber,
        clientId: originalQuotation.clientId,
        templateId: originalQuotation.templateId,
        date: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        currency: originalQuotation.currency,
        exchangeRate: originalQuotation.exchangeRate,
        priority: originalQuotation.priority,
        terms: originalQuotation.terms,
        notes: originalQuotation.notes,
        subtotal: originalQuotation.subtotal,
        tax: originalQuotation.tax,
        discount: originalQuotation.discount,
        total: originalQuotation.total,
        items: {
          create: originalQuotation.items.map(item => ({
            productId: item.productId,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax,
            discount: item.discount,
            total: item.total,
          }))
        }
      },
      include: {
        client: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    await this.logActivity(duplicatedQuotation.id, 'duplicated', `Duplicated from ${originalQuotation.referenceNumber}`, userId);

    return duplicatedQuotation;
  }

  // Create new version of quotation
  async createVersion(quotationId: string, changes: any, userId?: string) {
    const originalQuotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { items: true }
    });

    if (!originalQuotation) {
      throw new Error('Quotation not found');
    }

    const newVersion = originalQuotation.version + 1;
    const referenceNumber = `${originalQuotation.referenceNumber}-v${newVersion}`;

    const versionedQuotation = await prisma.quotation.create({
      data: {
        referenceNumber,
        parentQuotationId: quotationId,
        version: newVersion,
        clientId: originalQuotation.clientId,
        date: new Date(),
        expiryDate: originalQuotation.expiryDate,
        currency: originalQuotation.currency,
        exchangeRate: originalQuotation.exchangeRate,
        priority: originalQuotation.priority,
        terms: changes.terms || originalQuotation.terms,
        notes: changes.notes || originalQuotation.notes,
        ...this.calculateTotals(changes.items || originalQuotation.items),
        items: {
          create: (changes.items || originalQuotation.items).map((item: any) => ({
            productId: item.productId,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax,
            discount: item.discount,
            total: item.total,
          }))
        }
      },
      include: {
        client: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    await this.logActivity(versionedQuotation.id, 'versioned', `Created version ${newVersion}`, userId);

    return versionedQuotation;
  }

  // Log quotation activity
  async logActivity(quotationId: string, action: string, description: string, userId?: string, metadata?: any) {
    return await prisma.quotationActivity.create({
      data: {
        quotationId,
        userId,
        action,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
      }
    });
  }

  // Send quotation (placeholder for email integration)
  async sendQuotation(quotationId: string, userId?: string) {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { client: true }
    });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    // Update quotation status
    await prisma.quotation.update({
      where: { id: quotationId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      }
    });

    // Log activity
    await this.logActivity(quotationId, 'sent', `Quotation sent to ${quotation.client.email}`, userId);

    // Create communication record
    await prisma.communication.create({
      data: {
        quotationId,
        clientId: quotation.clientId,
        type: 'email',
        subject: `Quotation ${quotation.referenceNumber}`,
        content: `Your quotation ${quotation.referenceNumber} has been sent.`,
        direction: 'outbound',
        status: 'sent',
        sentAt: new Date(),
      }
    });

    return { success: true, message: 'Quotation sent successfully' };
  }
}

export const quotationService = new QuotationService();
