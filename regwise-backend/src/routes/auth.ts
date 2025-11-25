import { Router } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { registerValidator, loginValidator } from "../utils/validators";

const router = Router();

/**
 * POST /api/auth/register
 * body: { name?, email, password }
 */
router.post("/register", registerValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body as { name?: string; email: string; password: string };

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed });
    await user.save();

    const secret = process.env.JWT_SECRET || "changeme";
    const token = jwt.sign({ id: user._id.toString(), email: user.email }, secret, { expiresIn: "7d" });

    return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", loginValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body as { email: string; password: string };

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET || "changeme";
    const token = jwt.sign({ id: user._id.toString(), email: user.email }, secret, { expiresIn: "7d" });

    return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

export default router;
