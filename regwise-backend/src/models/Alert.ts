import mongoose, { Document } from "mongoose";

export interface AlertDoc extends Document {
  country: string;
  title: string;
  description?: string;
  severity: "low" | "medium" | "high" | "critical";
  date: Date;
  isRead: boolean;
  sourceUrl?: string;
}

const AlertSchema = new mongoose.Schema<AlertDoc>({
  country: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "low",
  },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  sourceUrl: { type: String },
});

export default mongoose.model<AlertDoc>("Alert", AlertSchema);
