import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DateRange {
  from: Date;
  to: Date;
}

export interface AnalyticsFilters {
  dateRange?: DateRange;
  clientId?: string;
  productId?: string;
  userId?: string;
  status?: string;
  currency?: string;
}

export class AnalyticsService {
  // Get quotation analytics
  async getQuotationAnalytics(filters: AnalyticsFilters = {}) {
    const where = this.buildWhereClause(filters);

    const [
      totalQuotations,
      quotationsByStatus,
      quotationsByMonth,
      conversionMetrics,
      valueMetrics,
      avgQuotationValue,
      topProducts,
      topClients,
      responseTimeMetrics
    ] = await Promise.all([
      this.getTotalQuotations(where),
      this.getQuotationsByStatus(where),
      this.getQuotationsByMonth(where),
      this.getConversionMetrics(where),
      this.getValueMetrics(where),
      this.getAvgQuotationValue(where),
      this.getTopProducts(where),
      this.getTopClients(where),
      this.getResponseTimeMetrics(where),
    ]);

    return {
      totalQuotations,
      quotationsByStatus,
      quotationsByMonth,
      conversionMetrics,
      valueMetrics,
      avgQuotationValue,
      topProducts,
      topClients,
      responseTimeMetrics,
    };
  }

  // Get sales performance analytics
  async getSalesPerformance(filters: AnalyticsFilters = {}) {
    const where = this.buildWhereClause(filters);

    const [
      totalRevenue,
      revenueByMonth,
      revenueByProduct,
      revenueByClient,
      profitMargins,
      salesFunnel,
      winLossAnalysis
    ] = await Promise.all([
      this.getTotalRevenue(where),
      this.getRevenueByMonth(where),
      this.getRevenueByProduct(where),
      this.getRevenueByClient(where),
      this.getProfitMargins(where),
      this.getSalesFunnel(where),
      this.getWinLossAnalysis(where),
    ]);

    return {
      totalRevenue,
      revenueByMonth,
      revenueByProduct,
      revenueByClient,
      profitMargins,
      salesFunnel,
      winLossAnalysis,
    };
  }

  // Get customer analytics
  async getCustomerAnalytics(filters: AnalyticsFilters = {}) {
    const where = this.buildWhereClause(filters, 'client');

    const [
      totalCustomers,
      customersBySegment,
      customerLifetimeValue,
      customerAcquisition,
      customerRetention,
      customerSatisfaction
    ] = await Promise.all([
      this.getTotalCustomers(where),
      this.getCustomersBySegment(where),
      this.getCustomerLifetimeValue(where),
      this.getCustomerAcquisition(where),
      this.getCustomerRetention(where),
      this.getCustomerSatisfaction(where),
    ]);

    return {
      totalCustomers,
      customersBySegment,
      customerLifetimeValue,
      customerAcquisition,
      customerRetention,
      customerSatisfaction,
    };
  }

  // Get product performance analytics
  async getProductPerformance(filters: AnalyticsFilters = {}) {
    const [
      topSellingProducts,
      productRevenue,
      productMargins,
      inventoryTurnover,
      productDemand
    ] = await Promise.all([
      this.getTopSellingProducts(filters),
      this.getProductRevenue(filters),
      this.getProductMargins(filters),
      this.getInventoryTurnover(filters),
      this.getProductDemand(filters),
    ]);

    return {
      topSellingProducts,
      productRevenue,
      productMargins,
      inventoryTurnover,
      productDemand,
    };
  }

  // Build where clause for queries
  private buildWhereClause(filters: AnalyticsFilters, table: string = 'quotation'): any {
    const where: any = {};

    if (filters.dateRange) {
      where.createdAt = {
        gte: filters.dateRange.from,
        lte: filters.dateRange.to,
      };
    }

    if (table === 'quotation') {
      if (filters.clientId) where.clientId = filters.clientId;
      if (filters.status) where.status = filters.status;
      if (filters.currency) where.currency = filters.currency;
    } else if (table === 'client') {
      if (filters.clientId) where.id = filters.clientId;
    }

    return where;
  }

  // Total quotations
  private async getTotalQuotations(where: any) {
    return await prisma.quotation.count({ where });
  }

  // Quotations by status
  private async getQuotationsByStatus(where: any) {
    return await prisma.quotation.groupBy({
      by: ['status'],
      where,
      _count: true,
      _sum: { total: true },
    });
  }

  // Quotations by month
  private async getQuotationsByMonth(where: any) {
    // This would need raw SQL for proper date grouping
    const quotations = await prisma.quotation.findMany({
      where,
      select: {
        createdAt: true,
        total: true,
        status: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by month
    const monthlyData: Record<string, { count: number; value: number; conversions: number }> = {};
    
    quotations.forEach(q => {
      const month = q.createdAt.toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { count: 0, value: 0, conversions: 0 };
      }
      monthlyData[month].count++;
      monthlyData[month].value += q.total;
      if (q.status === 'ACCEPTED') {
        monthlyData[month].conversions++;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
      conversionRate: data.count > 0 ? (data.conversions / data.count) * 100 : 0,
    }));
  }

  // Conversion metrics
  private async getConversionMetrics(where: any) {
    const [total, accepted, rejected, expired] = await Promise.all([
      prisma.quotation.count({ where }),
      prisma.quotation.count({ where: { ...where, status: 'ACCEPTED' } }),
      prisma.quotation.count({ where: { ...where, status: 'REJECTED' } }),
      prisma.quotation.count({ where: { ...where, status: 'EXPIRED' } }),
    ]);

    return {
      total,
      accepted,
      rejected,
      expired,
      pending: total - accepted - rejected - expired,
      conversionRate: total > 0 ? (accepted / total) * 100 : 0,
      rejectionRate: total > 0 ? (rejected / total) * 100 : 0,
    };
  }

  // Value metrics
  private async getValueMetrics(where: any) {
    const [totalValue, acceptedValue, avgValue] = await Promise.all([
      prisma.quotation.aggregate({
        where,
        _sum: { total: true },
      }),
      prisma.quotation.aggregate({
        where: { ...where, status: 'ACCEPTED' },
        _sum: { total: true },
      }),
      prisma.quotation.aggregate({
        where,
        _avg: { total: true },
      }),
    ]);

    return {
      totalValue: totalValue._sum.total || 0,
      acceptedValue: acceptedValue._sum.total || 0,
      avgValue: avgValue._avg.total || 0,
      lostValue: (totalValue._sum.total || 0) - (acceptedValue._sum.total || 0),
    };
  }

  // Average quotation value
  private async getAvgQuotationValue(where: any) {
    const result = await prisma.quotation.aggregate({
      where,
      _avg: { total: true },
    });
    return result._avg.total || 0;
  }

  // Top products
  private async getTopProducts(where: any) {
    const items = await prisma.quotationItem.findMany({
      where: {
        quotation: where,
      },
      include: {
        product: {
          select: { id: true, name: true, type: true }
        }
      }
    });

    // Group by product and calculate metrics
    const productMetrics: Record<string, any> = {};
    
    items.forEach(item => {
      const productId = item.product.id;
      if (!productMetrics[productId]) {
        productMetrics[productId] = {
          product: item.product,
          quantity: 0,
          revenue: 0,
          quotations: new Set(),
        };
      }
      productMetrics[productId].quantity += item.quantity;
      productMetrics[productId].revenue += item.total;
      productMetrics[productId].quotations.add(item.quotationId);
    });

    return Object.values(productMetrics)
      .map((p: any) => ({
        ...p,
        quotationCount: p.quotations.size,
        quotations: undefined, // Remove Set object
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }

  // Top clients
  private async getTopClients(where: any) {
    const quotations = await prisma.quotation.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, segment: true }
        }
      }
    });

    // Group by client
    const clientMetrics: Record<string, any> = {};
    
    quotations.forEach(q => {
      const clientId = q.client.id;
      if (!clientMetrics[clientId]) {
        clientMetrics[clientId] = {
          client: q.client,
          quotationCount: 0,
          totalValue: 0,
          acceptedValue: 0,
          acceptedCount: 0,
        };
      }
      clientMetrics[clientId].quotationCount++;
      clientMetrics[clientId].totalValue += q.total;
      if (q.status === 'ACCEPTED') {
        clientMetrics[clientId].acceptedValue += q.total;
        clientMetrics[clientId].acceptedCount++;
      }
    });

    return Object.values(clientMetrics)
      .map((c: any) => ({
        ...c,
        conversionRate: c.quotationCount > 0 ? (c.acceptedCount / c.quotationCount) * 100 : 0,
      }))
      .sort((a, b) => b.acceptedValue - a.acceptedValue)
      .slice(0, 10);
  }

  // Response time metrics
  private async getResponseTimeMetrics(where: any) {
    const quotations = await prisma.quotation.findMany({
      where: {
        ...where,
        sentAt: { not: null },
        viewedAt: { not: null },
      },
      select: {
        sentAt: true,
        viewedAt: true,
        createdAt: true,
      }
    });

    if (quotations.length === 0) {
      return {
        avgResponseTime: 0,
        avgViewTime: 0,
        totalResponses: 0,
      };
    }

    let totalResponseTime = 0;
    let totalViewTime = 0;

    quotations.forEach(q => {
      if (q.sentAt && q.viewedAt) {
        const responseTime = q.viewedAt.getTime() - q.sentAt.getTime();
        totalResponseTime += responseTime;
      }
      if (q.sentAt) {
        const viewTime = q.sentAt.getTime() - q.createdAt.getTime();
        totalViewTime += viewTime;
      }
    });

    return {
      avgResponseTime: totalResponseTime / quotations.length / (1000 * 60 * 60), // hours
      avgViewTime: totalViewTime / quotations.length / (1000 * 60 * 60), // hours
      totalResponses: quotations.length,
    };
  }

  // Total revenue
  private async getTotalRevenue(where: any) {
    const result = await prisma.quotation.aggregate({
      where: { ...where, status: 'ACCEPTED' },
      _sum: { total: true },
    });
    return result._sum.total || 0;
  }

  // Revenue by month
  private async getRevenueByMonth(where: any) {
    const quotations = await prisma.quotation.findMany({
      where: { ...where, status: 'ACCEPTED' },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    const monthlyRevenue: Record<string, number> = {};
    
    quotations.forEach(q => {
      const month = q.createdAt.toISOString().substring(0, 7);
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + q.total;
    });

    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }

  // Revenue by product
  private async getRevenueByProduct(where: any) {
    const items = await prisma.quotationItem.findMany({
      where: {
        quotation: { ...where, status: 'ACCEPTED' },
      },
      include: {
        product: {
          select: { id: true, name: true }
        }
      }
    });

    const productRevenue: Record<string, any> = {};
    
    items.forEach(item => {
      const productId = item.product.id;
      if (!productRevenue[productId]) {
        productRevenue[productId] = {
          product: item.product,
          revenue: 0,
        };
      }
      productRevenue[productId].revenue += item.total;
    });

    return Object.values(productRevenue)
      .sort((a: any, b: any) => b.revenue - a.revenue);
  }

  // Revenue by client
  private async getRevenueByClient(where: any) {
    const quotations = await prisma.quotation.findMany({
      where: { ...where, status: 'ACCEPTED' },
      include: {
        client: {
          select: { id: true, name: true }
        }
      }
    });

    const clientRevenue: Record<string, any> = {};
    
    quotations.forEach(q => {
      const clientId = q.client.id;
      if (!clientRevenue[clientId]) {
        clientRevenue[clientId] = {
          client: q.client,
          revenue: 0,
        };
      }
      clientRevenue[clientId].revenue += q.total;
    });

    return Object.values(clientRevenue)
      .sort((a: any, b: any) => b.revenue - a.revenue);
  }

  // Profit margins (placeholder - would need cost data)
  private async getProfitMargins(where: any) {
    // This would require product cost data to calculate actual margins
    return {
      avgMargin: 25, // percentage
      totalProfit: 0,
      marginByProduct: [],
    };
  }

  // Sales funnel
  private async getSalesFunnel(where: any) {
    const [draft, sent, viewed, approved, accepted] = await Promise.all([
      prisma.quotation.count({ where: { ...where, status: 'DRAFT' } }),
      prisma.quotation.count({ where: { ...where, status: 'SENT' } }),
      prisma.quotation.count({ where: { ...where, status: 'VIEWED' } }),
      prisma.quotation.count({ where: { ...where, status: 'APPROVED' } }),
      prisma.quotation.count({ where: { ...where, status: 'ACCEPTED' } }),
    ]);

    return {
      draft,
      sent,
      viewed,
      approved,
      accepted,
    };
  }

  // Win/Loss analysis
  private async getWinLossAnalysis(where: any) {
    const quotations = await prisma.quotation.findMany({
      where: {
        ...where,
        status: { in: ['ACCEPTED', 'REJECTED'] }
      },
      select: {
        status: true,
        winLossReason: true,
        total: true,
      }
    });

    const analysis = {
      won: quotations.filter(q => q.status === 'ACCEPTED').length,
      lost: quotations.filter(q => q.status === 'REJECTED').length,
      wonValue: quotations.filter(q => q.status === 'ACCEPTED').reduce((sum, q) => sum + q.total, 0),
      lostValue: quotations.filter(q => q.status === 'REJECTED').reduce((sum, q) => sum + q.total, 0),
      reasons: {} as Record<string, number>,
    };

    quotations.forEach(q => {
      if (q.winLossReason) {
        analysis.reasons[q.winLossReason] = (analysis.reasons[q.winLossReason] || 0) + 1;
      }
    });

    return analysis;
  }

  // Customer-specific methods
  private async getTotalCustomers(where: any) {
    return await prisma.client.count({ where });
  }

  private async getCustomersBySegment(where: any) {
    return await prisma.client.groupBy({
      by: ['segment'],
      where,
      _count: true,
    });
  }

  private async getCustomerLifetimeValue(where: any) {
    // This would require more complex calculation
    return { avgLTV: 0, totalLTV: 0 };
  }

  private async getCustomerAcquisition(where: any) {
    return await prisma.client.groupBy({
      by: ['leadSource'],
      where,
      _count: true,
    });
  }

  private async getCustomerRetention(where: any) {
    // This would require time-based analysis
    return { retentionRate: 0, churnRate: 0 };
  }

  private async getCustomerSatisfaction(where: any) {
    const result = await prisma.client.aggregate({
      where,
      _avg: { satisfactionScore: true },
    });
    return result._avg.satisfactionScore || 0;
  }

  // Product-specific methods
  private async getTopSellingProducts(filters: AnalyticsFilters) {
    // Implementation similar to getTopProducts but focused on sales
    return [];
  }

  private async getProductRevenue(filters: AnalyticsFilters) {
    // Implementation for product revenue analysis
    return [];
  }

  private async getProductMargins(filters: AnalyticsFilters) {
    // Implementation for product margin analysis
    return [];
  }

  private async getInventoryTurnover(filters: AnalyticsFilters) {
    // Implementation for inventory turnover analysis
    return [];
  }

  private async getProductDemand(filters: AnalyticsFilters) {
    // Implementation for product demand analysis
    return [];
  }
}

export const analyticsService = new AnalyticsService();
