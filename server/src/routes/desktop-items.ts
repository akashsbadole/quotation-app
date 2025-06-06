import express from "express";

const router = express.Router();

// GET /api/v1/desktop-items - Get all desktop items
router.get("/", async (_req, res) => {
  try {
    // For now, return empty array until database migration is complete
    // TODO: Implement proper database integration after migration
    const mockDesktopItems: any[] = [];

    res.json({
      success: true,
      data: mockDesktopItems,
      count: mockDesktopItems.length,
    });
  } catch (error) {
    console.error("Desktop items error:", error);
    // Return empty array on error to prevent app crash
    res.json({
      success: true,
      data: [],
      count: 0,
    });
  }
});

// GET /api/v1/desktop-items/:id - Get desktop item by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Return mock data for now
    const mockItem = {
      id: id,
      name: "Mock Item",
      type: "folder",
      icon: "lucide:folder",
      position: { x: 0, y: 0 },
      target: null,
      content: null,
      createdAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: mockItem,
    });
  } catch (error) {
    console.error("Desktop items get error:", error);
    res.status(404).json({
      success: false,
      error: "Desktop item not found",
    });
  }
});

// POST /api/v1/desktop-items - Create new desktop item
router.post("/", async (req, res) => {
  try {
    // For now, return mock data until database migration is complete
    const mockItem = {
      id: `mock-${Date.now()}`,
      name: req.body.name || "New Item",
      type: req.body.type || "folder",
      icon: req.body.icon || "lucide:folder",
      position: { x: req.body.positionX || 0, y: req.body.positionY || 0 },
      target: req.body.target,
      content: req.body.content,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      data: mockItem,
      message: "Desktop item created successfully (mock)",
    });
  } catch (error) {
    console.error("Desktop items create error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create desktop item",
    });
  }
});

// PUT /api/v1/desktop-items/:id - Update desktop item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Return mock updated data
    const mockItem = {
      id: id,
      name: req.body.name || "Updated Item",
      type: req.body.type || "folder",
      icon: req.body.icon || "lucide:folder",
      position: { x: req.body.positionX || 0, y: req.body.positionY || 0 },
      target: req.body.target,
      content: req.body.content,
      createdAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: mockItem,
      message: "Desktop item updated successfully (mock)",
    });
  } catch (error) {
    console.error("Desktop items update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update desktop item",
    });
  }
});

// DELETE /api/v1/desktop-items/:id - Delete desktop item
router.delete("/:id", async (_req, res) => {
  try {
    // Mock deletion
    res.json({
      success: true,
      message: "Desktop item deleted successfully (mock)",
    });
  } catch (error) {
    console.error("Desktop items delete error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete desktop item",
    });
  }
});

export default router;
