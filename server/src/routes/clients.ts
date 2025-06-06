import express from 'express';
import { prisma } from '../index.js';
import { CreateClientSchema, UpdateClientSchema } from '../types/index.js';

const router = express.Router();

// GET /api/v1/clients - Get all clients
router.get('/', async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        quotations: {
          select: {
            id: true,
            total: true,
            status: true,
            date: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: clients,
      count: clients.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/clients/:id - Get client by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        quotations: {
          include: {
            items: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/clients - Create new client
router.post('/', async (req, res, next) => {
  try {
    const validatedData = CreateClientSchema.parse(req.body);
    
    const client = await prisma.client.create({
      data: validatedData
    });

    res.status(201).json({
      success: true,
      data: client,
      message: 'Client created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/clients/:id - Update client
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = UpdateClientSchema.parse(req.body);

    const client = await prisma.client.update({
      where: { id },
      data: validatedData
    });

    res.json({
      success: true,
      data: client,
      message: 'Client updated successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    next(error);
  }
});

// DELETE /api/v1/clients/:id - Delete client
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    next(error);
  }
});

export default router;
