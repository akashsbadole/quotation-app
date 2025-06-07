import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Customer Schemas
export const CreateCustomerSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  contact: z.string().min(1, "Contact person is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  notes: z.string().optional(),

  // Enhanced CRM fields
  category: z.enum(["premium", "standard", "basic"]).optional(),
  segment: z.enum(["enterprise", "sme", "individual"]).optional(),
  creditLimit: z.number().default(0),
  paymentTerms: z.number().default(30),
  taxId: z.string().optional(),
  website: z.string().url().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  preferredCurrency: z.string().default("USD"),

  // Additional CRM features
  parentClientId: z.string().optional(),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  primaryContact: z.string().optional(),
  secondaryContact: z.string().optional(),
  accountManager: z.string().optional(),
  riskLevel: z.enum(["low", "medium", "high"]).default("low"),
  leadSource: z.string().optional(),
  tags: z.array(z.string()).default([]),
  customFields: z.record(z.any()).default({}),

  // Portal access
  portalEnabled: z.boolean().default(false),
  portalUsername: z.string().optional(),
  portalPassword: z.string().optional(),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export class CustomerService {
  // Create customer with advanced CRM features
  async createCustomer(data: z.infer<typeof CreateCustomerSchema>) {
    const validatedData = CreateCustomerSchema.parse(data);

    // Hash portal password if provided
    let hashedPassword = null;
    if (validatedData.portalPassword) {
      hashedPassword = await bcrypt.hash(validatedData.portalPassword, 10);
    }

    const customer = await prisma.client.create({
      data: {
        name: validatedData.name,
        contact: validatedData.contact,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        country: validatedData.country,
        notes: validatedData.notes,
        category: validatedData.category,
        segment: validatedData.segment,
        creditLimit: validatedData.creditLimit,
        paymentTerms: validatedData.paymentTerms,
        taxId: validatedData.taxId,
        website: validatedData.website,
        industry: validatedData.industry,
        companySize: validatedData.companySize,
        preferredCurrency: validatedData.preferredCurrency,
        parentClientId: validatedData.parentClientId,
        billingAddress: validatedData.billingAddress,
        shippingAddress: validatedData.shippingAddress,
        primaryContact: validatedData.primaryContact,
        secondaryContact: validatedData.secondaryContact,
        accountManager: validatedData.accountManager,
        riskLevel: validatedData.riskLevel,
        leadSource: validatedData.leadSource,
        tags:
          validatedData.tags.length > 0
            ? JSON.stringify(validatedData.tags)
            : null,
        customFields:
          Object.keys(validatedData.customFields).length > 0
            ? JSON.stringify(validatedData.customFields)
            : null,
        portalEnabled: validatedData.portalEnabled,
        portalUsername: validatedData.portalUsername,
        portalPassword: hashedPassword,
      },
      include: {
        parentClient: true,
        childClients: true,
        quotations: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Log customer creation activity
    await this.logActivity(customer.id, "created", "Customer created", null, {
      source: validatedData.leadSource,
      category: validatedData.category,
    });

    return customer;
  }

  // Update customer with activity logging
  async updateCustomer(
    customerId: string,
    data: z.infer<typeof UpdateCustomerSchema>,
    userId?: string
  ) {
    const validatedData = UpdateCustomerSchema.parse(data);

    // Get current customer data for comparison
    const currentCustomer = await prisma.client.findUnique({
      where: { id: customerId },
    });

    if (!currentCustomer) {
      throw new Error("Customer not found");
    }

    // Hash new password if provided
    let updateData: any = { ...validatedData };
    if (validatedData.portalPassword) {
      updateData.portalPassword = await bcrypt.hash(
        validatedData.portalPassword,
        10
      );
    }

    // Convert arrays and objects to JSON strings
    if (validatedData.tags) {
      updateData.tags = JSON.stringify(validatedData.tags);
    }
    if (validatedData.customFields) {
      updateData.customFields = JSON.stringify(validatedData.customFields);
    }

    const updatedCustomer = await prisma.client.update({
      where: { id: customerId },
      data: updateData,
      include: {
        parentClient: true,
        childClients: true,
        quotations: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // Log significant changes
    const changes = this.detectChanges(currentCustomer, updatedCustomer);
    if (changes.length > 0) {
      await this.logActivity(
        customerId,
        "updated",
        `Customer updated: ${changes.join(", ")}`,
        userId,
        { changes }
      );
    }

    return updatedCustomer;
  }

  // Get customer with comprehensive data
  async getCustomerDetails(customerId: string) {
    const customer = await prisma.client.findUnique({
      where: { id: customerId },
      include: {
        parentClient: true,
        childClients: true,
        quotations: {
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
          },
        },
        communications: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        pricingAgreements: {
          where: { isActive: true },
        },
        documents: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    // Calculate customer metrics
    const metrics = await this.calculateCustomerMetrics(customerId);

    return {
      ...customer,
      metrics,
      tags: customer.tags ? JSON.parse(customer.tags) : [],
      customFields: customer.customFields
        ? JSON.parse(customer.customFields)
        : {},
    };
  }

  // Calculate customer metrics and analytics
  async calculateCustomerMetrics(customerId: string) {
    const [
      totalQuotations,
      acceptedQuotations,
      totalValue,
      acceptedValue,
      avgQuotationValue,
      lastQuotationDate,
      firstQuotationDate,
    ] = await Promise.all([
      prisma.quotation.count({
        where: { clientId: customerId },
      }),
      prisma.quotation.count({
        where: { clientId: customerId, status: "ACCEPTED" },
      }),
      prisma.quotation.aggregate({
        where: { clientId: customerId },
        _sum: { total: true },
      }),
      prisma.quotation.aggregate({
        where: { clientId: customerId, status: "ACCEPTED" },
        _sum: { total: true },
      }),
      prisma.quotation.aggregate({
        where: { clientId: customerId },
        _avg: { total: true },
      }),
      prisma.quotation.findFirst({
        where: { clientId: customerId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      prisma.quotation.findFirst({
        where: { clientId: customerId },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      }),
    ]);

    const conversionRate =
      totalQuotations > 0 ? (acceptedQuotations / totalQuotations) * 100 : 0;
    const lifetimeValue = acceptedValue._sum.total || 0;

    // Calculate customer age in days
    const customerAge = firstQuotationDate
      ? Math.floor(
          (new Date().getTime() - firstQuotationDate.createdAt.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    // Calculate days since last quotation
    const daysSinceLastQuotation = lastQuotationDate
      ? Math.floor(
          (new Date().getTime() - lastQuotationDate.createdAt.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    return {
      totalQuotations,
      acceptedQuotations,
      rejectedQuotations: totalQuotations - acceptedQuotations,
      conversionRate: Math.round(conversionRate * 100) / 100,
      totalQuotationValue: totalValue._sum.total || 0,
      lifetimeValue,
      avgQuotationValue: avgQuotationValue._avg.total || 0,
      customerAge,
      daysSinceLastQuotation,
      riskScore: this.calculateRiskScore({
        conversionRate,
        daysSinceLastQuotation,
        lifetimeValue,
        customerAge,
      }),
    };
  }

  // Calculate customer risk score
  private calculateRiskScore(metrics: {
    conversionRate: number;
    daysSinceLastQuotation: number | null;
    lifetimeValue: number;
    customerAge: number;
  }): number {
    let score = 50; // Base score

    // Conversion rate impact (0-40 points)
    if (metrics.conversionRate > 80) score += 20;
    else if (metrics.conversionRate > 60) score += 10;
    else if (metrics.conversionRate > 40) score += 5;
    else if (metrics.conversionRate < 20) score -= 20;

    // Recency impact (0-30 points)
    if (metrics.daysSinceLastQuotation === null) {
      score -= 10;
    } else if (metrics.daysSinceLastQuotation > 180) {
      score -= 20;
    } else if (metrics.daysSinceLastQuotation > 90) {
      score -= 10;
    } else if (metrics.daysSinceLastQuotation < 30) {
      score += 15;
    }

    // Lifetime value impact (0-20 points)
    if (metrics.lifetimeValue > 100000) score += 20;
    else if (metrics.lifetimeValue > 50000) score += 15;
    else if (metrics.lifetimeValue > 10000) score += 10;
    else if (metrics.lifetimeValue < 1000) score -= 10;

    // Customer age impact (0-10 points)
    if (metrics.customerAge > 365) score += 10;
    else if (metrics.customerAge > 180) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  // Customer segmentation
  async segmentCustomers() {
    const customers = await prisma.client.findMany({
      include: {
        quotations: true,
      },
    });

    const segmentedCustomers = await Promise.all(
      customers.map(async (customer) => {
        const metrics = await this.calculateCustomerMetrics(customer.id);

        let segment = "bronze";
        if (metrics.lifetimeValue > 50000 && metrics.conversionRate > 60) {
          segment = "platinum";
        } else if (
          metrics.lifetimeValue > 20000 &&
          metrics.conversionRate > 40
        ) {
          segment = "gold";
        } else if (
          metrics.lifetimeValue > 5000 &&
          metrics.conversionRate > 20
        ) {
          segment = "silver";
        }

        return {
          ...customer,
          segment,
          metrics,
        };
      })
    );

    return {
      platinum: segmentedCustomers.filter((c) => c.segment === "platinum"),
      gold: segmentedCustomers.filter((c) => c.segment === "gold"),
      silver: segmentedCustomers.filter((c) => c.segment === "silver"),
      bronze: segmentedCustomers.filter((c) => c.segment === "bronze"),
    };
  }

  // Log customer activity
  async logActivity(
    customerId: string,
    type: string,
    description: string,
    userId?: string,
    metadata?: any
  ) {
    return await prisma.clientActivity.create({
      data: {
        clientId: customerId,
        userId,
        type,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  }

  // Detect changes between old and new customer data
  private detectChanges(oldData: any, newData: any): string[] {
    const changes: string[] = [];
    const fieldsToCheck = [
      "name",
      "email",
      "phone",
      "address",
      "category",
      "segment",
      "creditLimit",
      "paymentTerms",
      "riskLevel",
      "accountManager",
    ];

    fieldsToCheck.forEach((field) => {
      if (oldData[field] !== newData[field]) {
        changes.push(
          `${field} changed from "${oldData[field]}" to "${newData[field]}"`
        );
      }
    });

    return changes;
  }

  // Create customer pricing agreement
  async createPricingAgreement(data: {
    clientId: string;
    productId?: string;
    name: string;
    description?: string;
    price: number;
    discount: number;
    validFrom: Date;
    validTo?: Date;
  }) {
    return await prisma.pricingAgreement.create({
      data: {
        clientId: data.clientId,
        productId: data.productId,
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        validFrom: data.validFrom,
        validTo: data.validTo,
      },
      include: {
        client: {
          select: { id: true, name: true },
        },
      },
    });
  }

  // Get customer portal access
  async authenticatePortalUser(username: string, password: string) {
    const customer = await prisma.client.findUnique({
      where: {
        portalUsername: username,
        portalEnabled: true,
      },
    });

    if (!customer || !customer.portalPassword) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      customer.portalPassword
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Update last login
    await prisma.client.update({
      where: { id: customer.id },
      data: { lastPortalLogin: new Date() },
    });

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      lastLogin: new Date(),
    };
  }
}

export const customerService = new CustomerService();

// Export types for use in other modules
export type CreateCustomerData = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerData = z.infer<typeof UpdateCustomerSchema>;
