import express from 'express';
import { prisma } from '../index.js';
import { CreateProductSchema, UpdateProductSchema } from '../types/index.js';

const router = express.Router();

// GET /api/v1/products - Get all products
router.get('/', async (req, res, next) => {
  try {
    const { type, search } = req.query;
    
    const where: any = {};
    
    if (type && typeof type === 'string') {
      where.type = type.toUpperCase();
    }
    
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        quotationItems: {
          select: {
            id: true,
            quotationId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/products/:id - Get product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        quotationItems: {
          include: {
            quotation: {
              select: {
                id: true,
                client: {
                  select: {
                    name: true
                  }
                },
                date: true,
                status: true
              }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/products - Create new product
router.post('/', async (req, res, next) => {
  try {
    const validatedData = CreateProductSchema.parse(req.body);
    
    const product = await prisma.product.create({
      data: validatedData
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/products/:id - Update product
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateProductSchema.parse(req.body);

    const product = await prisma.product.update({
      where: { id },
      data: validatedData
    });

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    next(error);
  }
});

// DELETE /api/v1/products/:id - Delete product
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    next(error);
  }
});

export default router;
