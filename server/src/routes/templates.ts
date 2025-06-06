import express from 'express';
import { prisma } from '../index.js';
import { CreateTemplateSchema, UpdateTemplateSchema } from '../types/index.js';

const router = express.Router();

// GET /api/v1/templates - Get all templates
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    
    const where: any = {};
    
    if (category && typeof category === 'string') {
      where.category = category;
    }
    
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: templates,
      count: templates.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/templates/:id - Get template by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const template = await prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/templates - Create new template
router.post('/', async (req, res, next) => {
  try {
    const validatedData = CreateTemplateSchema.parse(req.body);
    
    const template = await prisma.template.create({
      data: validatedData
    });

    res.status(201).json({
      success: true,
      data: template,
      message: 'Template created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/templates/:id - Update template
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateTemplateSchema.parse(req.body);

    const template = await prisma.template.update({
      where: { id },
      data: validatedData
    });

    res.json({
      success: true,
      data: template,
      message: 'Template updated successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }
    next(error);
  }
});

// DELETE /api/v1/templates/:id - Delete template
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.template.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }
    next(error);
  }
});

export default router;
