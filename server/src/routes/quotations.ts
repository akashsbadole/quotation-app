import express from "express";
import { prisma } from "../index.js";
import {
  CreateQuotationSchema,
  UpdateQuotationSchema,
} from "../types/index.js";
import { quotationService } from "../services/quotation.service.js";
import { workflowService } from "../services/workflow.service.js";
import { communicationService } from "../services/communication.service.js";

const router = express.Router();

// Helper function to calculate quotation totals
function calculateTotals(items: any[]) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = items.reduce(
    (sum, item) => sum + (item.tax / 100) * item.unitPrice * item.quantity,
    0
  );
  const discount = items.reduce(
    (sum, item) => sum + (item.discount / 100) * item.unitPrice * item.quantity,
    0
  );
  const total = subtotal + tax - discount;

  return { subtotal, tax, discount, total };
}

// GET /api/v1/quotations - Get all quotations
router.get("/", async (req, res, next) => {
  try {
    const { status, clientId, search } = req.query;

    const where: any = {};

    if (status && typeof status === "string") {
      where.status = status.toUpperCase();
    }

    if (clientId && typeof clientId === "string") {
      where.clientId = clientId;
    }

    if (search && typeof search === "string") {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { client: { name: { contains: search, mode: "insensitive" } } },
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
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: quotations,
      count: quotations.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/quotations/:id - Get quotation by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: "Quotation not found",
      });
    }

    res.json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/quotations - Create new quotation
router.post("/", async (req, res, next) => {
  try {
    const userId = req.headers["user-id"] as string; // Assuming user ID is passed in headers
    const quotation = await quotationService.createQuotation(req.body, userId);

    // Trigger workflows
    await workflowService.triggerWorkflow(
      "quotation",
      quotation.id,
      quotation,
      "created"
    );

    res.status(201).json({
      success: true,
      data: quotation,
      message: "Quotation created successfully",
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/quotations/:id - Update quotation
router.put("/:id", async (req, res, next) => {
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
        where: { quotationId: id },
      });

      updateData.items = {
        create: validatedData.items,
      };
    }

    const quotation = await prisma.quotation.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: quotation,
      message: "Quotation updated successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Quotation not found",
      });
    }
    next(error);
  }
});

// DELETE /api/v1/quotations/:id - Delete quotation
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.quotation.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Quotation deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Quotation not found",
      });
    }
    next(error);
  }
});

// POST /api/v1/quotations/:id/duplicate - Duplicate quotation
router.post("/:id/duplicate", async (req, res, next) => {
  try {
    const { id } = req.params;

    const originalQuotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!originalQuotation) {
      return res.status(404).json({
        success: false,
        error: "Quotation not found",
      });
    }

    // Generate new quotation ID
    const year = new Date().getFullYear();
    const count = await prisma.quotation.count({
      where: {
        id: {
          startsWith: `Q-${year}-`,
        },
      },
    });
    const newQuotationId = `Q-${year}-${(count + 1)
      .toString()
      .padStart(3, "0")}`;

    const newQuotation = await prisma.quotation.create({
      data: {
        id: newQuotationId,
        clientId: originalQuotation.clientId,
        date: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        notes: originalQuotation.notes,
        terms: originalQuotation.terms,
        status: "DRAFT",
        subtotal: originalQuotation.subtotal,
        tax: originalQuotation.tax,
        discount: originalQuotation.discount,
        total: originalQuotation.total,
        items: {
          create: originalQuotation.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tax: item.tax,
            discount: item.discount,
            total: item.total,
          })),
        },
      },
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: newQuotation,
      message: "Quotation duplicated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/quotations/:id/send - Send quotation
router.post("/:id/send", async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.headers["user-id"] as string;

    const result = await quotationService.sendQuotation(id, userId);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/quotations/:id/version - Create new version
router.post("/:id/version", async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.headers["user-id"] as string;

    const quotation = await quotationService.createVersion(
      id,
      req.body,
      userId
    );

    res.status(201).json({
      success: true,
      data: quotation,
      message: "New quotation version created successfully",
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/quotations/:id/versions - Get quotation versions
router.get("/:id/versions", async (req, res, next) => {
  try {
    const { id } = req.params;

    const versions = await prisma.quotation.findMany({
      where: {
        OR: [{ id }, { parentQuotationId: id }],
      },
      include: {
        client: {
          select: { id: true, name: true },
        },
      },
      orderBy: { version: "asc" },
    });

    res.json({
      success: true,
      data: versions,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/quotations/:id/activities - Get quotation activities
router.get("/:id/activities", async (req, res, next) => {
  try {
    const { id } = req.params;

    const activities = await prisma.quotationActivity.findMany({
      where: { quotationId: id },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/quotations/:id/approve - Approve quotation
router.post("/:id/approve", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const userId = req.headers["user-id"] as string;

    // Find pending approval for this user
    const approval = await prisma.quotationApproval.findFirst({
      where: {
        quotationId: id,
        approverId: userId,
        status: "pending",
      },
    });

    if (!approval) {
      return res.status(404).json({
        success: false,
        error: "No pending approval found for this user",
      });
    }

    const result = await workflowService.processApproval(
      approval.id,
      "approved",
      comments,
      userId
    );

    res.json({
      success: true,
      data: result,
      message: "Quotation approved successfully",
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/quotations/:id/reject - Reject quotation
router.post("/:id/reject", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const userId = req.headers["user-id"] as string;

    // Find pending approval for this user
    const approval = await prisma.quotationApproval.findFirst({
      where: {
        quotationId: id,
        approverId: userId,
        status: "pending",
      },
    });

    if (!approval) {
      return res.status(404).json({
        success: false,
        error: "No pending approval found for this user",
      });
    }

    const result = await workflowService.processApproval(
      approval.id,
      "rejected",
      comments,
      userId
    );

    res.json({
      success: true,
      data: result,
      message: "Quotation rejected",
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/quotations/:id/follow-up - Schedule follow-up
router.post("/:id/follow-up", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { days, templateId } = req.body;

    const communication = await communicationService.scheduleFollowUp(
      id,
      days || 7,
      templateId
    );

    res.status(201).json({
      success: true,
      data: communication,
      message: "Follow-up scheduled successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
