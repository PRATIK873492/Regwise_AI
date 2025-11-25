import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

/**
 * POST /api/upload
 * form-data: file (single)
 */
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    return res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
});

export default router;
