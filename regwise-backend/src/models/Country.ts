import mongoose, { Document } from "mongoose";

export interface OnboardingStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  required: boolean;
  documents?: string[];
  threshold?: string;
  conditions?: string[];
}

export interface CountryDoc extends Document {
  code: string;
  name: string;
  region: string;
  currency?: string;
  population?: number;
  onboarding?: OnboardingStep[];
  regulators?: string[];
  laws?: string[];
  workflow?: any;
}

const OnboardingStepSchema = new mongoose.Schema<OnboardingStep>({
  id: { type: String, required: true },
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  required: { type: Boolean, required: true },
  documents: { type: [String], default: [] },
  threshold: { type: String },
  conditions: { type: [String], default: [] },
});

const CountrySchema = new mongoose.Schema<CountryDoc>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  region: { type: String, required: true },
  currency: { type: String },
  population: { type: Number },
  onboarding: { type: [OnboardingStepSchema], default: [] },
  regulators: { type: [String], default: [] },
  laws: { type: [String], default: [] },
  workflow: { type: mongoose.Schema.Types.Mixed },
});

export default mongoose.model<CountryDoc>("Country", CountrySchema);
