import { Router } from "express";
import User from "../models/User";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

/**
 * GET /api/users/me
 * Protected - returns the authenticated user's profile
 */
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(400).json({ message: "User id missing in token" });

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error("Get me error:", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

export default router;
