import { Router } from "express";
import Item from "../models/Item";
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * GET /api/items
 * Public: list items
 */
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().limit(100).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error("Get items error:", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

/**
 * POST /api/items
 * Protected: create item
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, meta } = req.body;
    if (!title) return res.status(400).json({ message: "title required" });
    const item = new Item({ title, description, meta });
    await item.save();
    return res.status(201).json(item);
  } catch (err) {
    console.error("Create item error:", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

/**
 * GET /api/items/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json(item);
  } catch (err) {
    console.error("Get item error:", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

/**
 * PUT /api/items/:id
 * Protected: update item
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Not found" });
    return res.json(item);
  } catch (err) {
    console.error("Update item error:", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

/**
 * DELETE /api/items/:id
 * Protected: delete item
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete item error:", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

export default router;
