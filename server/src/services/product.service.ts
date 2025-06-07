import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Product Schemas
export const CreateProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(['PRODUCT', 'SERVICE', 'SUBSCRIPTION', 'BUNDLE']),
  price: z.number().min(0, "Price must be non-negative"),
  unit: z.string().min(1, "Unit is required"),
  tax: z.number().default(0),
  
  // Enhanced fields
  category: z.string().optional(),
  sku: z.string().optional(),
  specifications: z.record(z.any()).optional(),
  images: z.array(z.string().url()).default([]),
  documents: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
  })).default([]),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  manufacturer: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  warranty: z.string().optional(),
  
  // Pricing and inventory
  costPrice: z.number().optional(),
  marginPercent: z.number().default(0),
  taxable: z.boolean().default(true),
  taxCategory: z.string().default("standard"),
  currency: z.string().default("USD"),
  inStock: z.boolean().default(true),
  stockLevel: z.number().default(0),
  minStock: z.number().default(0),
  
  // Bundle configuration
  bundleItems: z.array(z.object({
    componentId: z.string(),
    quantity: z.number().min(1),
    discount: z.number().default(0),
  })).optional(),
  
  // Pricing tiers
  pricingTiers: z.array(z.object({
    name: z.string(),
    minQty: z.number().min(1),
    maxQty: z.number().optional(),
    price: z.number().min(0),
    discount: z.number().default(0),
  })).default([]),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export class ProductService {
  // Create product with advanced features
  async createProduct(data: z.infer<typeof CreateProductSchema>) {
    const validatedData = CreateProductSchema.parse(data);
    
    // Generate SKU if not provided
    if (!validatedData.sku) {
      validatedData.sku = await this.generateSKU(validatedData.name, validatedData.category);
    }

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        type: validatedData.type,
        price: validatedData.price,
        unit: validatedData.unit,
        tax: validatedData.tax,
        category: validatedData.category,
        sku: validatedData.sku,
        specifications: validatedData.specifications ? JSON.stringify(validatedData.specifications) : null,
        images: validatedData.images.length > 0 ? JSON.stringify(validatedData.images) : null,
        documents: validatedData.documents.length > 0 ? JSON.stringify(validatedData.documents) : null,
        weight: validatedData.weight,
        dimensions: validatedData.dimensions,
        manufacturer: validatedData.manufacturer,
        brand: validatedData.brand,
        model: validatedData.model,
        warranty: validatedData.warranty,
        costPrice: validatedData.costPrice,
        marginPercent: validatedData.marginPercent,
        taxable: validatedData.taxable,
        taxCategory: validatedData.taxCategory,
        currency: validatedData.currency,
        inStock: validatedData.inStock,
        stockLevel: validatedData.stockLevel,
        minStock: validatedData.minStock,
        isBundle: validatedData.type === 'BUNDLE',
        isService: validatedData.type === 'SERVICE',
        
        // Create pricing tiers
        pricingTiers: {
          create: validatedData.pricingTiers.map(tier => ({
            name: tier.name,
            minQty: tier.minQty,
            maxQty: tier.maxQty,
            price: tier.price,
            discount: tier.discount,
            currency: validatedData.currency,
          }))
        },
        
        // Create bundle items if it's a bundle
        ...(validatedData.type === 'BUNDLE' && validatedData.bundleItems ? {
          bundleItems: {
            create: validatedData.bundleItems.map(item => ({
              componentId: item.componentId,
              quantity: item.quantity,
              discount: item.discount,
            }))
          }
        } : {}),
      },
      include: {
        pricingTiers: true,
        bundleItems: {
          include: {
            component: true
          }
        },
        bundleComponents: {
          include: {
            bundleProduct: true
          }
        }
      }
    });

    return product;
  }

  // Generate SKU automatically
  async generateSKU(name: string, category?: string): Promise<string> {
    const prefix = category ? category.substring(0, 3).toUpperCase() : 'PRD';
    const nameCode = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    
    const count = await prisma.product.count({
      where: {
        sku: {
          startsWith: `${prefix}-${nameCode}-`
        }
      }
    });
    
    return `${prefix}-${nameCode}-${(count + 1).toString().padStart(4, '0')}`;
  }

  // Get product with pricing for specific quantity and customer
  async getProductPricing(productId: string, quantity: number = 1, clientId?: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        pricingTiers: {
          orderBy: { minQty: 'asc' }
        },
        bundleItems: {
          include: {
            component: true
          }
        }
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    let finalPrice = product.price;
    let appliedTier = null;

    // Check for quantity-based pricing tiers
    for (const tier of product.pricingTiers) {
      if (quantity >= tier.minQty && (!tier.maxQty || quantity <= tier.maxQty)) {
        finalPrice = tier.price;
        appliedTier = tier;
        break;
      }
    }

    // Check for customer-specific pricing
    if (clientId) {
      const customerPricing = await prisma.pricingAgreement.findFirst({
        where: {
          clientId,
          productId,
          isActive: true,
          validFrom: { lte: new Date() },
          OR: [
            { validTo: null },
            { validTo: { gte: new Date() } }
          ]
        }
      });

      if (customerPricing) {
        finalPrice = customerPricing.price;
        appliedTier = { name: 'Customer Specific', discount: customerPricing.discount };
      }
    }

    // Calculate bundle pricing if it's a bundle
    let bundlePrice = 0;
    if (product.isBundle && product.bundleItems.length > 0) {
      for (const bundleItem of product.bundleItems) {
        const componentPricing = await this.getProductPricing(
          bundleItem.componentId,
          bundleItem.quantity * quantity,
          clientId
        );
        bundlePrice += componentPricing.finalPrice * bundleItem.quantity * (1 - bundleItem.discount / 100);
      }
      finalPrice = Math.min(finalPrice, bundlePrice);
    }

    return {
      product,
      basePrice: product.price,
      finalPrice,
      quantity,
      totalPrice: finalPrice * quantity,
      appliedTier,
      savings: (product.price - finalPrice) * quantity,
      bundlePrice: product.isBundle ? bundlePrice : null,
    };
  }

  // Create product bundle
  async createBundle(bundleData: {
    name: string;
    description: string;
    components: Array<{
      productId: string;
      quantity: number;
      discount: number;
    }>;
    bundleDiscount: number;
  }) {
    // Calculate bundle price
    let totalPrice = 0;
    for (const component of bundleData.components) {
      const product = await prisma.product.findUnique({
        where: { id: component.productId }
      });
      if (product) {
        totalPrice += product.price * component.quantity * (1 - component.discount / 100);
      }
    }

    const bundlePrice = totalPrice * (1 - bundleData.bundleDiscount / 100);

    const bundle = await prisma.product.create({
      data: {
        name: bundleData.name,
        description: bundleData.description,
        type: 'BUNDLE',
        price: bundlePrice,
        unit: 'bundle',
        isBundle: true,
        bundleItems: {
          create: bundleData.components.map(comp => ({
            componentId: comp.productId,
            quantity: comp.quantity,
            discount: comp.discount,
          }))
        }
      },
      include: {
        bundleItems: {
          include: {
            component: true
          }
        }
      }
    });

    return bundle;
  }

  // Check inventory availability
  async checkInventory(productId: string, requestedQuantity: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        bundleItems: {
          include: {
            component: true
          }
        }
      }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Services don't have inventory constraints
    if (product.isService) {
      return {
        available: true,
        inStock: true,
        availableQuantity: Infinity,
        message: 'Service - no inventory constraints'
      };
    }

    // Check bundle components if it's a bundle
    if (product.isBundle) {
      const componentChecks = await Promise.all(
        product.bundleItems.map(async (bundleItem) => {
          const requiredQty = bundleItem.quantity * requestedQuantity;
          return await this.checkInventory(bundleItem.componentId, requiredQty);
        })
      );

      const unavailableComponents = componentChecks.filter(check => !check.available);
      if (unavailableComponents.length > 0) {
        return {
          available: false,
          inStock: false,
          availableQuantity: 0,
          message: 'Some bundle components are out of stock',
          componentIssues: unavailableComponents
        };
      }
    }

    // Check regular product inventory
    const available = product.stockLevel >= requestedQuantity;
    const lowStock = product.stockLevel <= product.minStock;

    return {
      available,
      inStock: product.inStock && product.stockLevel > 0,
      availableQuantity: product.stockLevel,
      requestedQuantity,
      lowStock,
      message: available 
        ? (lowStock ? 'Available but low stock' : 'Available') 
        : 'Insufficient stock'
    };
  }

  // Update inventory levels
  async updateInventory(productId: string, quantityChange: number, operation: 'add' | 'subtract' = 'subtract') {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.isService) {
      return { success: true, message: 'Service - no inventory update needed' };
    }

    const newStockLevel = operation === 'add' 
      ? product.stockLevel + quantityChange 
      : product.stockLevel - quantityChange;

    if (newStockLevel < 0) {
      throw new Error('Insufficient stock for this operation');
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stockLevel: newStockLevel,
        inStock: newStockLevel > 0,
      }
    });

    // Check if stock is below minimum and create alert
    if (newStockLevel <= product.minStock) {
      // Create low stock notification (implement notification service)
      console.log(`Low stock alert for product ${product.name}: ${newStockLevel} remaining`);
    }

    return {
      success: true,
      previousStock: product.stockLevel,
      newStock: newStockLevel,
      lowStock: newStockLevel <= product.minStock,
    };
  }

  // Get product catalog with filters
  async getProductCatalog(filters: {
    category?: string;
    type?: string;
    inStock?: boolean;
    priceRange?: { min: number; max: number };
    search?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const {
      category,
      type,
      inStock,
      priceRange,
      search,
      page = 1,
      limit = 50
    } = filters;

    const where: any = {
      status: 'active'
    };

    if (category) where.category = category;
    if (type) where.type = type;
    if (inStock !== undefined) where.inStock = inStock;
    if (priceRange) {
      where.price = {
        gte: priceRange.min,
        lte: priceRange.max
      };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          pricingTiers: true,
          bundleItems: {
            include: {
              component: {
                select: { id: true, name: true, price: true }
              }
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

export const productService = new ProductService();
