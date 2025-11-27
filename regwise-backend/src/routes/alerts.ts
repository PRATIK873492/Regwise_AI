import { Router } from "express";
import Alert from "../models/Alert";
import { requireAuth } from "../middleware/auth";

const router = Router();

// GET /api/alerts?country=...
router.get("/", async (req, res) => {
  try {
    const { country } = req.query;
    const query = country ? { country } : {};
    const alerts = await Alert.find(query).sort({ date: -1 }).limit(100);
    return res.json(alerts);
  } catch (err) {
    console.error("Get alerts error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/alerts/:id/read
router.patch("/:id/read", requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const alert = await Alert.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    return res.json(alert);
  } catch (err) {
    console.error("Mark alert read error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
