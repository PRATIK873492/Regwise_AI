import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import itemRoutes from "./routes/items";
import uploadRoutes from "./routes/upload";
import aiRoutes from "./routes/ai";
import searchRoutes from "./routes/search";
import alertsRoutes from "./routes/alerts";
import dashboardRoutes from "./routes/dashboard";
import countryRoutes from "./routes/countries";

dotenv.config();

const app = express();
import alertsRoutes from "./routes/alerts";
import searchRoutes from "./routes/search";
import dashboardRoutes from "./routes/dashboard";
app.use(helmet());
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true }));

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
const allowedOrigins = FRONTEND_ORIGIN
  ? FRONTEND_ORIGIN.split(",")
  : ["http://localhost:3000", "http://localhost:3001"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/countries", countryRoutes);

app.use("/api/alerts", alertsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);
// health
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// serve uploads statically
const uploadsPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

const PORT = Number(process.env.PORT || 5000);
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/regwise";

connectDB(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });
