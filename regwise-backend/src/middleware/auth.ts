import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; email?: string; [key: string]: any };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No authorization header" });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const secret = process.env.JWT_SECRET || "changeme";
    const payload = jwt.verify(token, secret) as { id: string; email?: string; iat?: number; exp?: number };
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", error: (err as Error).message });
  }
}
