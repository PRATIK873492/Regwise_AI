import { connectDB } from "../config/db";
import Alert from "../models/Alert";
import dotenv from "dotenv";

dotenv.config();

async function seedAlerts() {
  const MONGO_URI = process.env.MONGO_URI;
  await connectDB(MONGO_URI);

  const sampleAlerts = [
    {
      country: "United States",
      title: "New AML Reporting Requirements Effective Q1 2025",
      description:
        "FinCEN announces enhanced beneficial ownership reporting requirements for financial institutions.",
      severity: "high",
      isRead: false,
      sourceUrl: "https://example.com/alert1",
      date: new Date(),
    },
    {
      country: "Singapore",
      title: "MAS Implements Real-time Payment Fraud Monitoring",
      description:
        "Mandatory fraud surveillance for all payment service providers by Dec 2024.",
      severity: "critical",
      isRead: false,
      sourceUrl: "https://example.com/alert4",
      date: new Date(),
    },
  ];

  for (const a of sampleAlerts) {
    await Alert.create(a);
  }
  console.log("Seeded alerts data");
  process.exit(0);
}

seedAlerts().catch((err) => {
  console.error("Failed seeding alerts:", err);
  process.exit(1);
});
