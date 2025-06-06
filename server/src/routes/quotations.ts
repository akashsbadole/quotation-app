import express from 'express';
import { prisma } from '../index.js';
import { CreateQuotationSchema, UpdateQuotationSchema } from '../types/index.js';

const router = express.Router();

// Helper function to calculate quotation totals
function calculateTotals(items: any[]) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = items.reduce((sum, item) => sum + (item.tax / 100) * item.unitPrice * item.quantity, 0);
  const discount = items.reduce((sum, item) => sum + (item.discount / 100) * item.unitPrice * item.quantity, 0);
  const total = subtotal + tax - discount;
  
  return { subtotal, tax, discount, total };
}

// GET /api/v1/quotations - Get all quotations
router.get('/', async (req, res, next) => {
  try {
    const { status, clientId, search } = req.query;
    
    const where: any = {};
    
    if (status && typeof status === 'string') {
      where.status = status.toUpperCase();
    }
    
    if (clientId && typeof clientId === 'string') {
      where.clientId = clientId;
    }
    
    if (search && typeof search === 'string') {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const quotations = await prisma.quotation.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: quotations,
      count: quotations.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/quotations/:id - Get quotation by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        client: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: 'Quotation not found'
      });
    }

    res.json({
      success: true,
      data: quotation
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/quotations - Create new quotation
router.post('/', async (req, res, next) => {
  try {
    const validatedData = CreateQuotationSchema.parse(req.body);
    
    // Calculate totals
    const totals = calculateTotals(validatedData.items);
    
    // Generate quotation ID
    const year = new Date().getFullYear();
    const count = await prisma.quotation.count({
      where: {
        id: {
          startsWith: `Q-${year}-`
        }
      }
    });
    const quotationId = `Q-${year}-${(count + 1).toString().padStart(3, '0')}`;
    
    const quotation = await prisma.quotation.create({
      data: {
        id: quotationId,
        clientId: validatedData.clientId,
        date: new Date(validatedData.date),
        expiryDate: new Date(validatedData.expiryDate),
        notes: validatedData.notes,
        terms: validatedData.terms,
        status: validatedData.status,
        ...totals,
        items: {
          create: validatedData.items
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

    res.status(201).json({
      success: true,
      data: quotation,
      message: 'Quotation created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/quotations/:id - Update quotation
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateQuotationSchema.parse(req.body);

    // If items are being updated, recalculate totals
    let updateData: any = { ...validatedData };
    
    if (validatedData.items) {
      const totals = calculateTotals(validatedData.items);
      updateData = { ...updateData, ...totals };
      
      // Delete existing items and create new ones
      await prisma.quotationItem.deleteMany({
        where: { quotationId: id }
      });
      
      updateData.items = {
        create: validatedData.items
      };
    }

    const quotation = await prisma.quotation.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: quotation,
      message: 'Quotation updated successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Quotation not found'
      });
    }
    next(error);
  }
});

// DELETE /api/v1/quotations/:id - Delete quotation
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.quotation.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Quotation deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Quotation not found'
      });
    }
    next(error);
  }
});

// POST /api/v1/quotations/:id/duplicate - Duplicate quotation
router.post('/:id/duplicate', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const originalQuotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        items: true
      }
    });

    if (!originalQuotation) {
      return res.status(404).json({
        success: false,
        error: 'Quotation not found'
      });
    }

    // Generate new quotation ID
    const year = new Date().getFullYear();
    const count = await prisma.quotation.count({
      where: {
        id: {
          startsWith: `Q-${year}-`
        }
      }
    });
    const newQuotationId = `Q-${year}-${(count + 1).toString().padStart(3, '0')}`;

    const newQuotation = await prisma.quotation.create({
      data: {
        id: newQuotationId,
        clientId: originalQuotation.clientId,
        date: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        notes: originalQuotation.notes,
        terms: originalQuotation.terms,
        status: 'DRAFT',
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
            total: item.total
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

    res.status(201).json({
      success: true,
      data: newQuotation,
      message: 'Quotation duplicated successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
