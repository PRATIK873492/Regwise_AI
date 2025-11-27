import path from "path";
import fs from "fs";
import { connectDB } from "../config/db";
import CountryModel from "../models/Country";
import AlertModel from "../models/Alert";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.warn(
      "No MONGO_URI provided; seeding will try to use in-memory mongo"
    );
  }
  await connectDB(MONGO_URI);

  const filePath = path.join(process.cwd(), "data", "countries.json");
  const content = fs.readFileSync(filePath, "utf8");
  const countries = JSON.parse(content);

  for (const c of countries) {
    await CountryModel.findOneAndUpdate(
      { code: c.code },
      { $set: c },
      { upsert: true }
    );
  }
  // seed some sample alerts
  const sampleAlerts = [
    {
      country: "United States",
      title: "New AML Reporting Requirements Effective Q1 2025",
      description:
        "FinCEN announces enhanced beneficial ownership reporting requirements for financial institutions.",
      severity: "high",
      date: new Date(),
      isRead: false,
      sourceUrl: "https://example.com/aml-q1-2025",
    },
    {
      country: "Singapore",
      title: "MAS Implements Real-time Payment Fraud Monitoring",
      description:
        "Mandatory fraud surveillance for all payment service providers by Dec 2024.",
      severity: "critical",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      isRead: false,
      sourceUrl: "https://example.com/mas-fraud",
    },
  ];
  for (const a of sampleAlerts) {
    await AlertModel.findOneAndUpdate(
      { title: a.title },
      { $set: a },
      { upsert: true }
    );
  }
  console.log("Seeded countries data");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
